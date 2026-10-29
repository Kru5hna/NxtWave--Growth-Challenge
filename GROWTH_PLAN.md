# 🚀 NxtWave Growth Plan: "Build Your First AI Project in 60 Minutes"
**Goal:** 500 Final-Year Engineering Registrations | **Budget:** ₹2,000 | **Timeline:** 7 Days  
**Format:** 5-Slide Pitch Deck / 2-Page Executive Summary

---

## 📌 SLIDE 1: The Student Persona & Core Insight

### Who Exactly Are We Targeting?
- **Audience:** Final-year B.Tech / B.E. students (2025/2026 batch) across India.
- **Geography:** Tier 2 & Tier 3 engineering colleges (e.g., JNTU, VTU, AKTU, Anna University affiliates) who account for 80%+ of India's engineering graduates.
- **Mindset:** **Placement Anxiety.** Placements are either happening right now or drying up. Students realize generic web development or Python projects no longer impress recruiters; they lack a tangible **"AI Project"** on their resume.

### Why Would They Care?
1. **Resume Differentiation:** Recruiters filter for "Generative AI", "LLM", or "AI Agents". This workshop gives them a deployed project to list immediately.
2. **Zero Barrier to Entry:** Free + 60 minutes. It feels achievable today, not a 3-month commitment they'll postpone.
3. **Peer Benchmark:** When classmates start registering, fear of falling behind (FOMO) triggers immediate sign-ups.

---

## 📌 SLIDE 2: The Growth Engine — Viral WhatsApp Flywheel

Rather than spreading ₹2,000 across multiple paid ad channels with negligible reach, we deploy a **Product-Led Viral Referral Engine** centered on **WhatsApp Class Groups** (where Indian engineering students live).

```
   [Campus Ambassador / Seed Student]
                  │
                  ▼
       Shares in Class WhatsApp Group
                  │
                  ▼
  Student Registers (Landing Page with Live Counter)
                  │
                  ▼
  Instant Referral Link & Code Generated
                  │
                  ├──────────────────────────────┐
                  ▼                              ▼
     WhatsApp Auto-Share Button        Leaderboard Gamification
   ("Share with 3 batchmates to unlock")  (Top 10 Referrers shoutout)
                  │                              │
                  └──────────────┬───────────────┘
                                 ▼
                     3x - 5x Viral Loop
```

---

## 📌 SLIDE 3: Channel Prioritization, Unit Economics & Budget Breakdown

### Strict ₹2,000 Line-by-Line Budget Allocation:
| Line Item | Description | Cost |
|---|---|---|
| **Instagram Reels Targeted Boost (2 Posts)** | 2 high-energy short reels (15s hook: "Placement reality check for 2025 batch") boosted at ₹600 each targeting Tier-2/3 engineering students (age 20-23) | **₹1,200** |
| **Ambassador Milestone Rewards** | Amazon gift cards for top 3 referrers on the leaderboard (1st: ₹250, 2nd: ₹150, 3rd: ₹100) | **₹500** |
| **Transactional SMS / API Contingency** | Buffer for automated webhook alerts and domain verification | **₹300** |
| **Digital Rewards (Starter Kit, Badges, 1-on-1 Mentorship)** | Digital download pack & mentor review provided internally by growth team | **₹0** (Zero marginal cost) |
| **TOTAL BUDGET** | | **₹2,000** |

---

### Channel Target Modeling & Assumption Disclosure:
> *Note on Projections: Because this is a simulated pre-launch campaign, the figures below represent operational assumptions derived from industry benchmarks.*

| Channel | Target Signups | Budget | Modeled Assumption & Rationale |
|---|---|---|---|
| **WhatsApp Peer Network (Primary - P0)** | **350** | ₹500 | **Assumption:** 30 seed ambassadors (club leads, CRs) each share in 3 college groups (avg 60 students/group = 5,400 total reachable students). Modeled conversion: **6.5%** click-to-register rate driven by direct peer trust. |
| **LinkedIn Organic (Secondary - P1)** | **90** | ₹0 | **Assumption:** 3 thought-leadership posts by student ambassadors & alumni discussing Tier-2/3 placement bottlenecks. Estimated organic reach: ~3,000 impressions at **3%** engagement-to-registration rate. |
| **Instagram Reels Catalyst (P2)** | **70** | ₹1,200 | **Assumption:** ₹1,200 ad spend at estimated ₹8–₹10 CPM / ₹17 CPC generates ~70–80 direct registrations via mobile landing page. |
| **TOTAL** | **510+** | **₹2,000** | **Blended Target CAC: ~₹3.92** |

---

## 📌 SLIDE 4: 7-Day Blitz Execution Roadmap

```
Day 1: SEED & IGNITE (Target: 80 regs)
  • Deploy Landing Page + Referral Engine
  • Activate 30 Campus Ambassadors across 20 Tier-2/3 colleges
  • LinkedIn Post #1: "Why 2025 Engineering Resumes Need an AI Project"

Day 2-3: MOMENTUM & SOCIAL PROOF (Target: 170 regs | Cumulative: 250)
  • Launch WhatsApp Template #2: "200+ students already registered!"
  • Live counter creates visible social proof on landing page
  • Top Referrers announced on class groups to spark competitive sharing

Day 4-5: TARGETED ACCELERATION (Target: 150 regs | Cumulative: 400)
  • Boost Instagram Reel #1 (₹750) targeting final-year engineering students
  • Introduce milestone perk: "Refer 3 friends → Get Workshop Pre-Pack & Starter Kit"
  • Mid-campaign leaderboard refresh

Day 6-7: SCARCITY & LAST PUSH (Target: 110 regs | Cumulative: 510+)
  • Boost Instagram Reel #2 (₹750) — countdown urgency: "Closing in 24 hours"
  • WhatsApp Template #5: "Final 12 Hours — Capped at 500 Seats"
  • Auto-email confirmation and reminder flow to minimize no-shows
```

---

## 📌 SLIDE 5: The Working Asset & Technical Architecture

We did not build just a static landing page. We built an **end-to-end viral growth application**:

1. **Frontend (`/public`)**: High-converting, mobile-first responsive landing page with dynamic countdown, live particle backdrop, glassmorphic UI, and live social proof counter.
2. **Referral Engine**: Auto-generates unique student referral codes (e.g. `AARAV3L5W`), tracks referrer trees, updates real-time top-10 leaderboard with privacy-safe display names.
3. **One-Tap WhatsApp Sharing**: Generates instant `wa.me` links pre-filled with the student's unique link for 1-click sharing to WhatsApp groups.
4. **Backend API (`/server`)**: Production Node.js & Express server with registration validation, duplicate prevention, and one-click CSV export for placement/marketing teams.
5. **n8n Automation Architecture (`/automations`)**: Webhook triggers instant WhatsApp confirmation, adds row to Google Sheets, sends email drip, and detects 3-referral milestones for reward triggers.

