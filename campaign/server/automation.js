const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const LOG_CSV = path.join(__dirname, '..', 'automations', 'sheets-sync-log.csv');

// Initialize local sheets backup log if not present
if (!fs.existsSync(LOG_CSV)) {
  fs.writeFileSync(
    LOG_CSV,
    'Timestamp,ID,Name,Email,College,WhatsApp,Year,Branch,ReferralCode,ReferredBy,SyncStatus\n',
    'utf-8'
  );
}

/**
 * 1. GOOGLE SHEETS AUTOMATION
 * Sends registration data to a Google Sheets Webhook (via Google Apps Script Web App).
 * Also appends to local CSV log for 100% data persistence.
 */
async function syncToGoogleSheets(registration) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  let syncStatus = 'LOCAL_BACKUP_SAVED';

  const row = [
    new Date().toISOString(),
    registration.id,
    `"${registration.name.replace(/"/g, '""')}"`,
    registration.email,
    `"${registration.college.replace(/"/g, '""')}"`,
    registration.whatsapp,
    registration.year,
    registration.branch,
    registration.referralCode,
    registration.referredBy || '',
  ];

  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      console.log(`📊 Disptaching to Google Sheets webhook...`);
      // Use native fetch (available in Node 18+)
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration),
      });

      if (response.ok) {
        syncStatus = 'SYNCED_TO_GOOGLE_SHEETS';
        console.log(`✅ Successfully synced lead to Google Sheets: ${registration.email}`);
      } else {
        syncStatus = `WEBHOOK_HTTP_${response.status}`;
        console.warn(`⚠️ Google Sheets webhook returned status ${response.status}`);
      }
    } catch (err) {
      syncStatus = 'WEBHOOK_FAILED';
      console.error(`⚠️ Failed to call Google Sheets webhook: ${err.message}`);
    }
  } else {
    console.log(`ℹ️ [Google Sheets] No GOOGLE_SHEETS_WEBHOOK_URL configured. Appended to local backup: ${path.basename(LOG_CSV)}`);
  }

  // Always append to local sheets-sync-log.csv
  try {
    fs.appendFileSync(LOG_CSV, `${row.join(',')},${syncStatus}\n`, 'utf-8');
  } catch (e) {
    console.error('Failed to append to sheets log:', e.message);
  }

  return { success: syncStatus === 'SYNCED_TO_GOOGLE_SHEETS', status: syncStatus };
}

/**
 * 2. EMAIL AUTOMATION
 * Sends a welcome & confirmation email to the student.
 * If SMTP credentials exist in .env (Gmail, Sendgrid, Resend, etc.), sends real email.
 * Otherwise, generates an Ethereal test inbox link or logs a live email preview!
 */
async function sendConfirmationEmail(registration, referralLink) {
  const recipientEmail = registration.email;
  const firstName = registration.name.trim().split(/\s+/)[0];

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0F0B1A; color: #FFF7ED; padding: 20px; }
    .card { background-color: #1A1428; border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 14px; max-width: 580px; margin: 0 auto; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { text-align: center; border-bottom: 1px solid rgba(255, 107, 53, 0.2); padding-bottom: 20px; margin-bottom: 25px; }
    .bolt { color: #FF6B35; font-size: 28px; }
    h1 { color: #FFF7ED; font-size: 22px; margin: 10px 0 5px; }
    .badge { display: inline-block; background: rgba(255, 200, 87, 0.15); color: #FFC857; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255, 200, 87, 0.3); }
    p { color: #BCA8C8; font-size: 15px; line-height: 1.6; }
    .box { background: #0F0B1A; border: 1px solid #2F2444; border-radius: 10px; padding: 18px; margin: 20px 0; text-align: center; }
    .link-text { color: #FFC857; font-size: 15px; font-weight: bold; word-break: break-all; }
    .btn { display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; margin-top: 15px; }
    .details { background: rgba(15, 11, 26, 0.6); border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px; }
    .details li { color: #FFF7ED; margin-bottom: 6px; }
    .footer { text-align: center; font-size: 12px; color: #7E708E; margin-top: 25px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="bolt">⚡</div>
      <h1>You're In, ${firstName}!</h1>
      <span class="badge">NxtWave AI Workshop · Free Spot Confirmed</span>
    </div>

    <p>Hi <strong>${registration.name}</strong>,</p>
    <p>Your seat is locked for <strong>"Build Your First AI Project in 60 Minutes"</strong>. You'll build a live AI project from scratch and earn an industry-recognized certificate for your placement resume.</p>

    <div class="details">
      <ul style="list-style: none; padding-left: 0; margin: 0;">
        <li>📅 <strong>Date:</strong> In 7 Days</li>
        <li>💻 <strong>Mode:</strong> 100% Online & Live Interactive</li>
        <li>🎓 <strong>College Recorded:</strong> ${registration.college} (${registration.branch})</li>
        <li>🏷️ <strong>Your Referral Code:</strong> <span style="color:#FFC857; font-weight:bold;">${registration.referralCode}</span></li>
      </ul>
    </div>

    <div class="box">
      <p style="margin-top: 0; color: #FFF7ED; font-weight: 600;">🎁 Invite 3 Classmates → Unlock AI Starter Kit</p>
      <p style="font-size: 13px; color: #BCA8C8; margin-bottom: 10px;">Share your personalized referral link with your college WhatsApp group:</p>
      <div class="link-text">${referralLink}</div>
      <a class="btn" href="https://wa.me/?text=${encodeURIComponent(`🚀 Hey! I just registered for the free NxtWave AI Workshop to build an AI project in 60 mins. Register here: ${referralLink}`)}" target="_blank">
        Share on WhatsApp
      </a>
    </div>

    <p style="font-size: 13px; color: #BCA8C8;">We will send the workshop live stream link to your WhatsApp (+91 ${registration.whatsapp.replace(/^\+91/, '')}) 24 hours before the session.</p>

    <div class="footer">
      <p>© 2026 NxtWave Disruptive Technologies · Built for Growth Challenge</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create transporter
  let transporter;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    // Real SMTP (Gmail or custom service)
    transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });
  } else {
    // Fallback: create ethereal test account or test transport
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch {
      console.log('⚠️ Could not connect to Ethereal, email content ready in memory.');
      return { success: true, simulated: true, to: recipientEmail };
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"NxtWave AI Workshop" <${smtpUser || 'workshop@nxtwave.tech'}>`,
      to: recipientEmail,
      subject: `🎉 Spot Confirmed: Build Your First AI Project in 60 Mins!`,
      text: `Hi ${firstName}, you are registered for the NxtWave AI Workshop! Share your referral link: ${referralLink}`,
      html: htmlContent,
    });

    console.log(`📧 Confirmation email dispatched to ${recipientEmail} (MessageId: ${info.messageId})`);

    let previewUrl = null;
    if (nodemailer.getTestMessageUrl) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`🔗 [Live Email Preview URL]: ${previewUrl}`);
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
      to: recipientEmail,
    };
  } catch (err) {
    console.error(`⚠️ Email sending failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = {
  syncToGoogleSheets,
  sendConfirmationEmail,
};
