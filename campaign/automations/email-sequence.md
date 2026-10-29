# Email Automation Sequence

## Email 1: Welcome Email — Immediately After Registration

**Subject:** You're in! 🎉 Here's your exclusive referral link

**Body:**

```
Hi {{NAME}},

Welcome aboard! You've successfully registered for the NxtWave Workshop. 🚀

Here's what happens next:
• You'll receive workshop details closer to the date
• You'll get access to prep materials on Day 3
• The workshop link will be sent 1 hour before we go live

But first — want to make this even better?

🎁 Share your referral link with 3 friends and unlock exclusive bonus content:

👉 {{REFERRAL_LINK}}

Your unique referral code: {{REFERRAL_CODE}}

Every friend who registers using your link gets you closer to bonus rewards.
Top referrers get special recognition during the workshop!

Share on WhatsApp: https://wa.me/?text=Hey!%20Check%20out%20this%20free%20NxtWave%20workshop%20{{REFERRAL_LINK}}

See you at the workshop! 💪

— Team NxtWave
```

---

## Email 2: Day 3 Reminder — 3 Days After Registration

**Subject:** Workshop prep checklist ✅ (You're gonna love this)

**Body:**

```
Hi {{NAME}},

The NxtWave Workshop is coming up and we want you to get the MOST out of it.

📋 Here's your prep checklist:

✅ Laptop/desktop with a stable internet connection
✅ A code editor installed (VS Code recommended — it's free)
✅ A GitHub account (create one at github.com if you don't have one)
✅ Curiosity and 2 hours of focused time 😄

📅 Workshop Details:
• Date: {{WORKSHOP_DATE}}
• Time: {{WORKSHOP_TIME}}
• Duration: ~2 hours
• Mode: Online (link will be shared 1 hour before)

🔥 Quick update on your referrals:
You've referred {{REFERRAL_COUNT}} friend(s) so far.
{{#if REFERRAL_COUNT < 3}}
Share with {{3 - REFERRAL_COUNT}} more to unlock the bonus content!
👉 {{REFERRAL_LINK}}
{{/if}}
{{#if REFERRAL_COUNT >= 3}}
Amazing! You've unlocked the bonus content. It'll be shared after the workshop! 🎉
{{/if}}

Pro tip: Students who prepare beforehand get 3x more value from the workshop.

See you soon!

— Team NxtWave
```

---

## Email 3: Day 6 Pre-Workshop — 1 Day Before Workshop

**Subject:** 🚀 Tomorrow's the day! Here's everything you need

**Body:**

```
Hi {{NAME}},

The workshop is TOMORROW! Here's everything you need to be ready:

⏰ Schedule:
• Date: {{WORKSHOP_DATE}}
• Time: {{WORKSHOP_TIME}}
• The workshop link will arrive in your inbox 1 hour before start

💻 Tech Requirements (final check):
□ Stable internet connection
□ Laptop/desktop (not mobile — you'll be coding along)
□ VS Code installed and ready
□ GitHub account set up
□ Browser: Chrome or Firefox (latest version)

🎯 What to expect:
• Live coding — you'll build something real
• Industry insights you won't find in textbooks
• Q&A with experienced developers
• Certificate of completion

📊 Campaign Stats:
• {{TOTAL_REGISTRATIONS}} students registered
• You referred {{REFERRAL_COUNT}} friends — thank you! 🙏

💡 Last chance to share:
Know someone who'd benefit? They can still register 👇
{{REFERRAL_LINK}}

We've put months of work into making this workshop incredible.
Tomorrow, you'll see why.

Get some rest tonight — tomorrow we build! 🔥

— Team NxtWave
```

---

### Template Variables Reference

| Variable | Description |
|---|---|
| `{{NAME}}` | Student's first name |
| `{{EMAIL}}` | Student's email address |
| `{{REFERRAL_CODE}}` | Unique referral code |
| `{{REFERRAL_LINK}}` | Full referral registration link |
| `{{REFERRAL_COUNT}}` | Number of successful referrals |
| `{{WORKSHOP_DATE}}` | Workshop date |
| `{{WORKSHOP_TIME}}` | Workshop start time |
| `{{TOTAL_REGISTRATIONS}}` | Total campaign registrations |

### Sending Schedule

| Email | Trigger | Delay |
|---|---|---|
| Welcome | On registration | Immediate |
| Day 3 Reminder | After registration | +3 days |
| Pre-Workshop | Before workshop | -1 day (Day 6) |
