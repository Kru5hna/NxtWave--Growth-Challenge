const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { syncToGoogleSheets, sendConfirmationEmail } = require('./automation');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Simple In-Memory Rate Limiter (Abuse Prevention)
const ipRequests = new Map();
function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const record = ipRequests.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }
  record.count++;
  ipRequests.set(ip, record);
  if (record.count > 15) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please wait a minute.' });
  }
  next();
}

// --- Helpers ---

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const empty = { registrations: [], referralCounts: {} };
    writeData(empty);
    return empty;
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function generateReferralCode(name) {
  const prefix = name.trim().split(/\s+/)[0].toUpperCase();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${suffix}`;
}

function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// --- API Routes ---

// POST /api/register — Register a student (with Rate Limiting & Abuse Prevention)
app.post('/api/register', rateLimiter, (req, res) => {
  try {
    const { name, email, college, whatsapp, year, branch, referredBy, referrer: bodyReferrer } = req.body;
    let incomingRef = (referredBy || bodyReferrer || '').trim().toUpperCase();

    // Validate required fields
    if (!name || !email || !college || !whatsapp || !year || !branch) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, college, whatsapp, year, branch',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const data = readData();

    // 1. Abuse Protection: Deduplication by Email
    const cleanEmail = email.trim().toLowerCase();
    const existingEmail = data.registrations.find(
      (r) => r.email.toLowerCase() === cleanEmail
    );
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.',
        referralCode: existingEmail.referralCode,
      });
    }

    // 2. Abuse Protection: Deduplication by Phone Number (Last 10 digits)
    const cleanPhone = String(whatsapp).replace(/\D/g, '').slice(-10);
    const existingPhone = data.registrations.find((r) => {
      const p = String(r.whatsapp).replace(/\D/g, '').slice(-10);
      return p === cleanPhone;
    });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'This WhatsApp phone number has already been registered.',
        referralCode: existingPhone.referralCode,
      });
    }

    // 3. Abuse Protection: Prevent Self-Referral
    if (incomingRef) {
      const referrer = data.registrations.find(
        (r) => r.referralCode === incomingRef
      );
      if (referrer && (referrer.email.toLowerCase() === cleanEmail || referrer.whatsapp.includes(cleanPhone))) {
        console.warn(`⚠️ Blocked self-referral attempt by ${cleanEmail}`);
        incomingRef = null; // Discard invalid self-referral
      } else if (referrer) {
        if (!data.referralCounts[incomingRef]) {
          data.referralCounts[incomingRef] = 0;
        }
        data.referralCounts[incomingRef] += 1;
      }
    }

    // Generate unique referral code
    let referralCode;
    do {
      referralCode = generateReferralCode(name);
    } while (data.registrations.some((r) => r.referralCode === referralCode));

    // Create registration record
    const registration = {
      id: uuidv4(),
      name: name.trim(),
      email: cleanEmail,
      college: college.trim(),
      whatsapp: whatsapp.trim(),
      year: year.trim(),
      branch: branch.trim(),
      referralCode,
      referredBy: incomingRef || null,
      registeredAt: new Date().toISOString(),
    };

    // Save registration
    data.registrations.push(registration);
    writeData(data);

    const referralLink = `${req.protocol}://${req.get('host')}/?ref=${referralCode}`;

    // 4. Live Automations: Dispatch to Google Sheets & Send Confirmation Email
    syncToGoogleSheets(registration).catch((err) =>
      console.error('⚠️ Background Google Sheets sync error:', err.message)
    );
    sendConfirmationEmail(registration, referralLink).catch((err) =>
      console.error('⚠️ Background email send error:', err.message)
    );

    return res.status(201).json({
      success: true,
      referralCode,
      referralLink,
      message: 'Registration successful! Confirmation email dispatched.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
});

// GET /api/registered-count — Total real registered count (Zero fake offset)
app.get('/api/registered-count', (req, res) => {
  try {
    const data = readData();
    const count = data.registrations ? data.registrations.length : 0;
    return res.json({ count, realCount: count });
  } catch (error) {
    return res.json({ count: 0, realCount: 0 });
  }
});

// GET /api/referral-count — Specific user's referral count
app.get('/api/referral-count', (req, res) => {
  try {
    const code = (req.query.code || '').trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }
    const data = readData();
    const count = data.referralCounts[code] || 0;
    return res.json({ code, count });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/leaderboard — Top 10 referrers
app.get('/api/leaderboard', (req, res) => {
  try {
    const data = readData();

    const leaderboard = data.registrations
      .map((r) => ({
        name: r.name,
        college: r.college,
        referralCount: data.referralCounts[r.referralCode] || 0,
      }))
      .filter((entry) => entry.referralCount > 0)
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, 10);

    return res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/stats — Campaign statistics
app.get('/api/stats', (req, res) => {
  try {
    const data = readData();
    const today = getTodayDateString();

    const totalRegistrations = data.registrations.length;

    const todayRegistrations = data.registrations.filter((r) =>
      r.registeredAt.startsWith(today)
    ).length;

    // Top colleges by registration count
    const collegeCounts = {};
    data.registrations.forEach((r) => {
      const key = r.college;
      collegeCounts[key] = (collegeCounts[key] || 0) + 1;
    });
    const topColleges = Object.entries(collegeCounts)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Channel breakdown: organic vs referral
    const referredCount = data.registrations.filter((r) => r.referredBy).length;
    const channelBreakdown = {
      organic: totalRegistrations - referredCount,
      referral: referredCount,
    };

    return res.json({
      totalRegistrations,
      todayRegistrations,
      topColleges,
      channelBreakdown,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/registrations — Admin endpoint, all registrations
app.get('/api/registrations', (req, res) => {
  try {
    const data = readData();
    return res.json(data.registrations);
  } catch (error) {
    console.error('Registrations error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/registrations/export — Export registrations as CSV
app.get('/api/registrations/export', (req, res) => {
  try {
    const data = readData();

    const headers = [
      'ID',
      'Name',
      'Email',
      'College',
      'WhatsApp',
      'Year',
      'Branch',
      'Referral Code',
      'Referred By',
      'Referral Count',
      'Registered At',
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = data.registrations.map((r) =>
      [
        r.id,
        r.name,
        r.email,
        r.college,
        r.whatsapp,
        r.year,
        r.branch,
        r.referralCode,
        r.referredBy || '',
        data.referralCounts[r.referralCode] || 0,
        r.registeredAt,
      ]
        .map(escapeCSV)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="registrations_${getTodayDateString()}.csv"`
    );
    return res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 NxtWave Campaign Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   POST /api/register       — Register a student`);
  console.log(`   GET  /api/leaderboard    — Top 10 referrers`);
  console.log(`   GET  /api/stats          — Campaign statistics`);
  console.log(`   GET  /api/registrations  — All registrations (admin)`);
  console.log(`   GET  /api/registrations/export — Export CSV`);
});
