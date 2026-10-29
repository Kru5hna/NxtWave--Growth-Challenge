# ⚡ NxtWave Growth Challenge — Round 1 Submission
### *Acquiring 500 Final-Year Engineering Students in 7 Days on a ₹2,000 Budget*

[![Live Website](https://img.shields.io/badge/Live%20Prototype-Vercel-success?style=for-the-badge&logo=vercel)](https://nxtwave-growth-challenge-public.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-informational?style=for-the-badge&logo=render)](https://nxtwave-growth-challenge-ohbz.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Kru5hna/NxtWave--Growth-Challenge)
[![Status](https://img.shields.io/badge/Status-Complete%20%26%20Production--Ready-brightgreen?style=for-the-badge)](#)

---

## 🎯 Executive Summary & Challenge Brief

- **Challenge:** NxtWave Growth Intern Challenge (Round 1).
- **Core Objective:** Design a growth strategy and build a functional, production-ready asset to register **500 final-year engineering students** for a free 60-minute online workshop: *"Build Your First AI Project in 60 Minutes"*.
- **Constraints:** Budget strictly capped at **₹2,000 INR** | Timeframe: **7 Days**.
- **Target Audience:** Final-year B.Tech / B.E. students (2025/2026 batch) across Tier 2 & Tier 3 colleges in India facing immediate placement anxiety.

---

## 🚀 Live Production Links

| Resource | URL | Description |
| :--- | :--- | :--- |
| **🌐 Live Landing Page** | [nxtwave-growth-challenge-public.vercel.app](https://nxtwave-growth-challenge-public.vercel.app/) | Deployed on Vercel Edge Network |
| **⚙️ Backend API** | [nxtwave-growth-challenge-ohbz.onrender.com](https://nxtwave-growth-challenge-ohbz.onrender.com) | Express API running on Render |
| **📊 Google Sheets Webhook** | Google Apps Script (`google-sheets-automation.gs`) | Real-time lead capture & automated Gmail dispatch |
| **📄 Growth Plan Deck** | [`GROWTH_PLAN.md`](GROWTH_PLAN.md) / [`.pptx`](NxtWave%20Growth%20Plan%20-%20500%20Registrations%20in%207%20Days.pptx) | 5-Slide strategy & unit economics |
| **🤖 AI Worklog & Notes** | [`AI_LEARNING_NOTES.md`](AI_LEARNING_NOTES.md) | 3 meaningful examples & deliberate rejections |
| **🎥 3-Min Video Script** | [`VIDEO_SCRIPT.md`](VIDEO_SCRIPT.md) | Script breakdown for the submission video |

---

## 🧠 Growth Strategy & ₹2,000 Budget Allocation

Rather than burning ₹2,000 on broad Meta/Google Ads (which yields only 40–50 high-bounce clicks at standard EdTech CPCs), the strategy deploys a **Product-Led Viral Referral Loop** leveraging **WhatsApp Class Groups** and **Placement Representative Micro-Ambassadors**.

```
   [10 Seed Campus Placement Reps (₹1,500 incentive)]
                         │
                         ▼
             Class WhatsApp Announcement
       ("Placement-ready AI project in 60 mins")
                         │
                         ▼
        Landing Page Registration (Sub-300ms FCP)
                         │
                         ▼
          Unique Referral Code & Dynamic Link
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
1-Click WhatsApp Share           Gamified Live Leaderboard
(Unlock AI Starter Kit @ 3 refs)    (Top 10 Resume Review shoutout)
        │                                 │
        └────────────────┬────────────────┘
                         ▼
             Viral Multiplier (K-Factor ≥ 1.25)
                         ▼
             500+ Qualified Registrations
```

### Budget Breakdown (₹2,000 Total)
* **₹1,500 (75%) — 10 Campus Ambassadors / Placement Reps:** ₹150 UPI cash reward per rep upon delivering 25+ verified registrations from their class WhatsApp groups (Guaranteed 250 primary registrations @ ₹6/student).
* **₹500 (25%) — Viral Referral Leaderboard Rewards:** 5 × ₹100 Amazon gift vouchers for top 5 referrers on the live leaderboard.
* **₹0 (Free Tier Infrastructure):** Vercel (Frontend), Render (API), Google Sheets & Gmail (Apps Script), n8n (Automation backup).

---

## 🛠️ The Working Prototype Features

### 1. High-Converting Landing Page ("Sunset Spark / EventX" UI)
- **Palette:** Deep Obsidian (`#0F0B1A`), Card Surface (`#1A1428`), Vibrant Sunset Orange (`#FF6B35`), Hot Pink (`#FF3D81`), Warm Gold (`#FFC857`), Off-White (`#FFF7ED`).
- **Interactive Particle Background:** Lightweight HTML5 Canvas particle network themed to NxtWave colors.
- **Dynamic Urgency & Social Proof:** 7-day live countdown timer + real-time counter synced with backend registrations.
- **Conversion-Optimized Form:** 6 essential fields (Name, Email, WhatsApp, College, Year, Branch) with instant inline validation.
- **Multi-Student Registration Support:** Includes a *"Register Another Student"* quick-reset button so college lab computers or shared laptops can register multiple classmates seamlessly.

### 2. Viral Referral & Gamification Engine
- **Automatic Code Generation:** Generates personalized codes (e.g., `RAHUL9K2X`) and links (`/?ref=RAHUL9K2X`).
- **Safe 1-Click WhatsApp Share:** Sanitized Plane 0 Unicode characters (`⚡`, `✅`, `✨`) ensuring zero diamond-question-mark glyph corruption (``) on WhatsApp Web and mobile.
- **Live Leaderboard:** Real-time top 10 referrers with gold (🥇), silver (🥈), and bronze (🥉) badges and masked names for student privacy (`Rahul S.`).
- **Referral Milestones:** 3 referrals unlock AI Starter Kit; 5 referrals unlock 1-on-1 Mentor Resume Review.

### 3. Fraud Prevention & Abuse Protection
- **Phone Deduplication:** Normalized to last 10 digits to prevent duplicate submissions with different country prefixes.
- **Email Deduplication:** Case-insensitive email unique checks.
- **Self-Referral Prevention:** Blocked if the student tries to refer their own email or WhatsApp number.
- **IP Rate Limiting:** 15 requests per 15-minute window via `express-rate-limit`.

### 4. Zero-Friction Automations
- **Google Sheets Webhook (`google-sheets-automation.gs`):** Instant row addition with timestamp, ID, name, email, WhatsApp, college, branch, and referral attribution.
- **Automated Gmail Confirmation:** Sent instantly from `krishraut2103@gmail.com` via Google MailApp with branded HTML template, unique referral code, live Vercel link, and 1-click WhatsApp share button.
- **n8n Workflow (`campaign/automations/n8n-workflow.json`):** Ready-to-import template for self-hosted or cloud n8n orchestrations.

---

## 🔬 The 3 Growth Experiments

| # | Hypothesis | What We Test | Primary Metric |
| :--- | :--- | :--- | :--- |
| **Test 1** | Positioning the workshop around **placement resume proof** will generate a 25%+ higher landing page conversion rate than generic *learning AI* messaging. | Split headline A/B test: *"Build Your First AI Project in 60 Mins — Add to Placement Resume"* vs. *"Learn Generative AI Basics in 60 Minutes"*. | Visitor-to-Registration Conversion Rate (Target: > 28%). |
| **Test 2** | An **immediate tangible digital incentive** (AI Project Starter Kit unlocked at 3 referrals) will drive 40%+ more shares than vague leaderboard prizes. | Milestone reward unlock vs. Leaderboard-only reward banner. | Viral Coefficient / K-Factor (Target: K ≥ 1.25). |
| **Test 3** | Distributing copy via **Placement Class Representatives** will achieve a 3x higher click-to-register rate than posting in open unofficial college clubs. | Tracking custom ref links assigned to CRs (`?ref=CR_COLLEGE`) vs. public community links. | WhatsApp Click-to-Registration Conversion Rate (Target: > 45%). |

---

## 🤖 AI Worklog & Deliberate Rejections

### Meaningful Prompt-to-Output Examples
1. **Landing Page Architecture:**
   - *Prompt:* "Design a high-converting landing page for Indian college students."
   - *AI Output:* Suggested a generic 8-section SaaS layout with testimonial sliders and pricing tables.
   - *What was changed:* Stripped unnecessary fluff. Replaced with an above-the-fold split-screen hero (social proof + form), live counter, and instant referral reveal.
2. **Referral Flywheel Mechanics:**
   - *Prompt:* "Create an invite mechanism for students."
   - *AI Output:* Proposed an email invite modal where users enter 5 friend emails.
   - *What was changed:* Rejected entirely. Indian engineering students don't check personal emails for classmate invites. Replaced with 1-click native WhatsApp sharing with pre-filled high-converting copy.
3. **Automations Pipeline:**
   - *Prompt:* "Set up automated lead capture and student emails."
   - *AI Output:* Recommended paid SendGrid or Mailchimp APIs with credit card requirements.
   - *What was changed:* Engineered a zero-cost serverless Google Sheets Webhook via Google Apps Script and `MailApp.sendEmail()`, achieving ₹0 infrastructure cost.

### What AI Suggested That Was Deliberately Rejected & Why
1. **Running Meta & Instagram Ads:** AI suggested allocating ₹1,500 to Instagram Stories. Rejected because ₹1,500 on Meta yields barely ~40 clicks in competitive Indian EdTech CPMs. Reinvested into 10 Placement Reps who directly command 2,000+ active batchmates on WhatsApp with 10x higher trust.
2. **Using Heavy Single-Page App Frameworks (Next.js / React bundle):** AI suggested scaffolding a full Next.js project. Rejected in favor of lightweight vanilla HTML5, CSS3, and modern JavaScript. Engineering students on mobile data in Tier 2/3 hostels experience sub-300ms page loads instead of multi-megabyte JavaScript hydration delays.
3. **Cold Emailing College TPOs (Training & Placement Officers):** AI suggested cold emailing placement cells. Rejected because official college bureaucratic approvals take weeks. Replaced with bottom-up student-to-student peer virality.

---

## 📂 Repository Structure

```
NxtWave/
├── README.md                                   # Comprehensive documentation & project overview
├── GROWTH_PLAN.md                              # 5-Slide Growth Strategy & Budget Breakdown
├── AI_LEARNING_NOTES.md                        # AI worklog, meaningful examples & rejections
├── VIDEO_SCRIPT.md                             # 3-Minute video walkthrough script
├── NxtWave Growth Plan - 500 Registrations...  # PowerPoint presentation pitch deck
├── vercel.json                                 # Vercel proxy & rewrite configuration
│
└── campaign/
    ├── .env                                    # Environment configuration
    ├── package.json                            # Node.js backend dependencies
    │
    ├── automations/
    │   ├── google-sheets-automation.gs         # Google Apps Script for Sheet sync & Gmail
    │   ├── n8n-workflow.json                   # n8n visual automation workflow template
    │   └── sheets-sync-log.csv                 # Local CSV backup log
    │
    ├── public/                                 # Production Frontend (Vercel)
    │   ├── index.html                          # Sunset Spark EventX landing page
    │   ├── css/
    │   │   └── styles.css                      # Glassmorphic, responsive theme styles
    │   └── js/
    │       └── app.js                          # Real-time UI logic, validation & WhatsApp share
    │
    └── server/                                 # Production Backend (Render)
        ├── index.js                            # Express API endpoints & abuse protection
        ├── automation.js                       # Webhook dispatcher & email engine
        └── data/
            └── registrations.json              # Local persistent JSON data store
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone & Install
```bash
git clone https://github.com/Kru5hna/NxtWave--Growth-Challenge.git
cd NxtWave/campaign
npm install
```

### 2. Configure Environment (`campaign/.env`)
```env
PORT=3000
FRONTEND_URL=https://nxtwave-growth-challenge-public.vercel.app
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### 3. Run Locally
```bash
npm start
```
The application will launch at `http://localhost:3000`.

---

## 🌐 Deployment Architecture

- **Frontend:** Deployed on **Vercel** (`https://nxtwave-growth-challenge-public.vercel.app/`). Root and public `vercel.json` rewrite rules forward all `/api/*` traffic seamlessly to the Render backend.
- **Backend API:** Deployed on **Render** (`https://nxtwave-growth-challenge-ohbz.onrender.com`).
- **Sheets & Email:** Serverless deployment via **Google Apps Script** tied to a Google Sheet, executing with zero cold-starts and sending authentic notifications from Gmail.

---

## 👨‍💻 Author & Submission Details

- **Candidate:** Krushna Raut
- **Email:** [krishraut2103@gmail.com](mailto:krishraut2103@gmail.com)
- **Challenge:** NxtWave Growth Intern Challenge — Round 1
- **Live Prototype:** [https://nxtwave-growth-challenge-public.vercel.app/](https://nxtwave-growth-challenge-public.vercel.app/)
