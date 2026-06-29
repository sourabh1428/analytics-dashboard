# Easibill — Product Overview
> For landing page, tutorials, and investor/partner documentation  
> Last updated: June 2026

---

## What is Easibill?

Easibill is a WhatsApp-first CRM built exclusively for independent pharmacies in India. It does one thing better than any tool in the market: it automatically sends your patients a WhatsApp refill reminder on exactly the right day — from your own number, without you touching anything.

If a patient buys blood pressure medicine today, Easibill schedules a WhatsApp message for 28 days from now. You don't follow up. You don't forget. The patient comes back.

> **The problem it solves:** The average independent pharmacy loses 20–40% of its chronic-medication customers every year — not because of competition, but because patients simply forget to refill. Easibill eliminates that.

---

## Who It's For

**Primary:** Single-store independent pharmacy owners in Tier 1 and Tier 2 Indian cities (Bangalore, Pune, Indore, Bhopal, Raipur). Age 28–45. Smartphone owner. Currently sending WhatsApp reminders manually to 20–30 patients and running out of time.

**Secondary (V2):** Small pharmacy chains (3–10 stores) that need multi-location dashboards and team logins.

**Not for:** Hospital chains, online pharmacies, clinics, or anyone who needs GST billing (Marg ERP already handles that — we work alongside it).

---

## Plans & Pricing

| | Starter | Pro |
|---|---|---|
| **Price** | ₹299 / month | ₹999 / month |
| **Free trial** | 14 days | 14 days |
| **Patients** | Unlimited | Unlimited |
| **Automated reminders** | Your own WhatsApp number | Official WABA business number |
| **Broadcast campaigns** | — | ✓ (wallet credits) |
| **Analytics** | Basic | Advanced |
| **Message templates** | Hindi + English | All 5 languages + custom |
| **Languages** | Hindi, English | + Marathi, Telugu, Kannada |
| **Support** | Email | Priority WhatsApp |

**Wallet credits (Pro):** 1 credit = ₹1 = 1 broadcast message. Minimum top-up ₹200. Credits never expire.

---

## Features — What's Built Today

### 1. Automated WhatsApp Refill Reminders
**The core feature. The reason Easibill exists.**

When you log a patient's purchase, Easibill calculates the refill date (default: 28 days, adjustable per purchase) and schedules a WhatsApp message for 9:00 AM on that day — automatically.

**How it works:**
- Log a purchase: patient name, medicine, date bought, and how many days' supply
- Easibill creates a scheduled reminder — you can see it on the dashboard
- At 9:00 AM IST on the refill date, the message goes out from your WhatsApp number
- Dashboard shows Scheduled → Sent → Delivered in real time

**Default messages (customizable):**
- Hindi: *"Namaste [Name] ji, aapki [Medicine] refill ka time aa gaya hai. Kripya aaj pharmacy par aaiye. — [Your Pharmacy]"*
- English: *"Hello [Name], your [Medicine] refill is due today. Please visit us. — [Your Pharmacy]"*

**Why it matters:** Sending 200 manual WhatsApp messages a month takes 2–3 hours. Easibill does it in 0.

---

### 2. Patient Management
**Your pharmacy's patient database — simple, fast, mobile-first.**

- Add patients with name, phone number, WhatsApp number (if different), language preference, and notes (e.g., "diabetic, Dr. Mehta's patient")
- Tag patients by condition, household, or any custom label (e.g., "diabetic", "senior citizen", "Sharma family")
- Search and filter patients by name, phone, upcoming refill date, or tag
- View each patient's full history: every purchase logged, every reminder sent, every message delivered
- Soft delete (patient data preserved for records)

**Import patients:** Upload a CSV to add your existing patient list in bulk — no manual entry required.

---

### 3. Purchase Logging
**The action that triggers everything.**

- Log any medicine purchase in under 10 seconds
- Set a custom refill interval per purchase (not all medicines are 28-day supplies)
- Automatic reminder is created immediately — no extra steps
- Edit a purchase to reschedule the reminder
- Full purchase history per patient

**New Sale screen (mobile):** Optimized for counter speed. Tap a patient, tap a medicine from your catalog, confirm quantity — done. Designed to be completed in one hand while a customer is standing in front of you.

---

### 4. Dashboard & Today's View
**Your day at a glance.**

- **Today tab:** Every patient who should receive a reminder today — name, medicine, status (Scheduled / Sent / Failed)
- **Upcoming:** 7-day preview of reminders — plan your week
- **Stats bar:** Total patients, active reminders, messages sent this month, WhatsApp connection status
- **Activity feed:** Last 10 reminder events — sent, failed, retried
- **Failed reminders:** Surface prominently so nothing falls through the cracks

---

### 5. WhatsApp Connection (Starter — Your Own Number)
**Connect your existing WhatsApp number — no new number needed, no registration.**

- Scan a QR code once in the dashboard — done
- Session stays connected permanently (survives server restarts, no re-scanning needed)
- Connection status visible on every screen: Connected / Disconnected / Reconnecting
- Automatic reconnection with retry on network drops
- Rate-limited to 30 messages/hour to protect your number from WhatsApp restrictions

**Takes 2 minutes to set up. No BSP registration. No waiting period.**

---

### 6. Gupshup WABA Integration (Pro — Official WhatsApp Business)
**For pharmacies sending broadcasts or needing a dedicated business number.**

- Messages sent from an official WhatsApp Business API number — no ban risk
- Required for broadcast campaigns
- Pre-approved message templates (HSM) via the Gupshup BSP
- Template library in dashboard — refills, health tips, festival greetings
- Per-message delivery receipts: Sent → Delivered → Read
- Wallet-based pay-per-message billing

---

### 7. Broadcast Campaigns (Pro)
**Send one message to many patients at once.**

- Build a segment: all diabetic patients, all patients not seen in 45 days, all patients in a specific tag group
- Schedule a broadcast: send now, or pick a date and time
- Personalized per-patient fields in the message (name, medicine, last visit date)
- Broadcast history with full delivery stats: sent / delivered / read
- Requires wallet credits (1 credit per message)

**Example use cases:**
- "Diwali offer — 10% off on all vitamins this week. Visit us!"
- "Reminder: patients who haven't visited in 45+ days"
- "Stock alert: your regular Metformin brand is back"

---

### 8. Analytics & Reports (Pro)
**Know which patients are slipping away before they're gone.**

- **Patient lapse detection:** Flags patients overdue by 15, 30, or 45+ days — act before you lose them
- **Retention rate:** % of patients who returned after receiving a reminder (monthly)
- **Revenue impact estimate:** Average basket size × retained patients = your ROI from Easibill
- **Top medicines by refill frequency:** Know your most-recurring revenue
- **Message delivery report:** All sends, all outcomes, filterable by date range
- **Reminder success rate:** % of scheduled reminders that fired successfully

---

### 9. Medicine Catalog
**Your pharmacy's own medicine list — faster purchase logging.**

- Add your commonly dispensed medicines once
- Auto-suggest medicines when logging a purchase — no typing the same name 200 times
- Set a default refill interval per medicine (Metformin = 28 days, Vitamin D = 90 days)
- Edit and manage your catalog from settings

---

### 10. Tags & Household Grouping
**Organize patients your way.**

- Create custom tags: "diabetic", "BP patient", "senior", "home delivery" — anything
- Tag multiple patients at once
- Household groups: link family members so a broadcast reaches the whole household once, not each person separately
- Filter patient lists by tag
- Target broadcast campaigns to specific tags

---

### 11. Reminder Controls
**Full control over every scheduled message.**

- Cancel any scheduled reminder (patient called ahead, purchase was different)
- Reschedule to a new date
- Manually retry failed reminders (network error, WhatsApp was disconnected)
- View full message content before it goes out

---

### 12. Settings & Customization
**Set it once, forget it.**

- Pharmacy name, address, and owner details
- Custom message templates per language
- Default refill interval (global)
- WhatsApp connection management
- Wallet top-up and credit history
- Password and security settings

---

### 13. Mobile App (React Native — iOS & Android)
**The full Easibill experience on your phone.**

The mobile app is built for the pharmacist at the counter — not a smaller version of a desktop dashboard, but a ground-up redesign for one-handed, 4G, Hindi-first use.

**Mobile-specific features:**
- **Today screen:** All of today's reminders at a glance. One tap to see a patient's detail.
- **New Sale:** Counter-speed purchase entry. Tap patient, tap medicine, confirm. Under 5 seconds.
- **Patients screen:** Card-based list. Every patient's key info visible without scrolling right.
- **Settings:** WhatsApp connection status and quick reconnect.
- All text at readable size for shop-lighting and cheap Android screens
- Touch targets ≥44px everywhere — no hover, no hidden buttons, no mystery gestures

---

### 14. Admin Panel (Internal)
**For Easibill operations — not visible to pharmacy users.**

- View and manage all registered pharmacies
- Monitor WhatsApp connection status across all tenants
- Manage subscription plans and wallet credits
- Broadcast health of the reminder pipeline
- Internal tooling for support and onboarding

---

## The Reminder Pipeline — How It All Works

```
You log a purchase
        ↓
Easibill creates a scheduled reminder in the database
        ↓
Every morning at 8:50 AM IST — Easibill checks:
"Who has a refill due today?"
        ↓
All due reminders are added to a message queue (BullMQ)
        ↓
Queue workers send each WhatsApp message
(Starter: your number via Baileys · Pro: WABA via Gupshup)
        ↓
Message delivered → status updated to "Sent"
Failed → retried 3× with backoff → surfaced on dashboard if still failed
        ↓
You see: ✓ Sent at 9:04 AM
```

**Architecture guarantee:** Every message goes through the queue. Nothing fires directly. Failed messages always retry. Nothing disappears silently.

---

## AI Features — Coming Next

These are the AI capabilities on the roadmap, grounded in the exact problems pharmacy owners face.

### AI-1. Smart Refill Interval Prediction
**"Easibill learns your patients' real refill patterns."**

Today, refill intervals are set manually (default 28 days). But a patient might actually pick up Metformin every 23 days because they adjust their dosage. Or every 35 days because they have a stockpile.

The AI will:
- Learn each patient's *actual* refill cadence from their purchase history
- Automatically adjust the reminder date to match their real pattern
- Show confidence: "This patient has refilled 6 times — predicted at 24 days"
- Never show this feature for patients with fewer than 3 purchases (no data = no prediction)

**Benefit:** Reminders arrive *when the patient is actually running low* — not on a fixed calendar. Higher conversion rate. Fewer "thanks, I just bought it yesterday" replies.

---

### AI-2. Lapse Risk Score
**"Know which patients are about to disappear before they do."**

Each patient will get a real-time risk score (Low / Medium / High) based on:
- Days since last purchase vs. their normal refill frequency
- Whether past reminders were responded to
- Seasonal patterns (patients skip refills around festivals and travel periods)

The dashboard will surface a "Patients at risk this week" card — patients who are 5–10 days overdue based on their personal pattern, not a fixed 45-day cutoff.

**Benefit:** Targeted outreach at the right moment, not a mass broadcast to everyone who's been away 45 days.

---

### AI-3. Message Personalization Engine
**"The right message for each patient, not a template blast."**

Today's reminder messages are templates: "Your [Medicine] refill is due today." The AI will generate slightly different, contextually appropriate messages:

- For a patient who replied last month: "Welcome back! Time for your Metformin refill."
- For a patient at high lapse risk: adds a soft urgency tone
- For festival periods: adds a friendly greeting context
- Language and tone match per-patient preferences (formal/informal, Hindi/English)

All messages are generated from a controlled prompt — no hallucinated medicine names, no wrong dosages. The AI fills in *tone and warmth*, not clinical content.

---

### AI-4. Broadcast Copy Generator
**"Tell Easibill what you want to say. It writes the WhatsApp message."**

When creating a broadcast campaign, instead of typing out a message, the pharmacist describes what they want:

> "Diwali sale, 10% off vitamins and protein supplements, this week only"

Easibill generates a WhatsApp-appropriate broadcast message in Hindi and English, within HSM character limits, ready to send. The pharmacist reviews, edits if needed, approves.

**Benefit:** Saves 20–30 minutes of message-writing per campaign. Consistent quality.

---

### AI-5. Medicine Name Normalization
**"Log Metformin, Glycomet, and glycomet 500mg — Easibill knows they're the same."**

Indian pharmacies use brand names, generic names, and truncated names interchangeably. Without normalization, the same drug appears as 30 different line items in reports.

The AI will:
- Normalize medicine names to a canonical form on ingestion
- Map brand names → generics → drug categories
- Surface "you have 12 patients on Metformin variants" in analytics, not 12 separate medicines
- Used internally for reports and lapse detection — the pharmacist's typed name is always preserved

---

### AI-6. Inventory Alert Intelligence (Roadmap)
**"Know what to reorder before it runs out."**

Using purchase velocity data, Easibill will predict which medicines are likely to run low within the next 7 days and surface a "Consider reordering" alert. No inventory system required — just inferred from purchase patterns.

This is a longer-term feature, planned after the core CRM workflows are stable.

---

## What Easibill Does NOT Do

We are deliberately narrow. Pharmacists use Marg ERP, Ecogreen, or Vyapar for billing. We work alongside those tools.

| Feature | Status | Reason |
|---|---|---|
| GST billing / invoicing | Not building | Marg ERP owns this. We don't compete with it. |
| Inventory management | Not building (V3 AI inference only) | Separate tool category |
| Online pharmacy / delivery | Never | Different business |
| Doctor CRM / appointment booking | Never | Wrong user — that's clinic software |
| Payment collection | Not building | Regulatory complexity |
| AI medicine recommendations | Never | Liability. We are not a clinical tool. |

---

## Technical Highlights (For Developers / Partners)

- **Stack:** Node.js + Express + PostgreSQL + Redis + Next.js (frontend) + React Native (mobile)
- **Queue architecture:** Every WhatsApp send goes through BullMQ — retries, backoff, and full observability built in
- **WhatsApp:** Dual-mode — Baileys (Starter, pharmacy's own number) and Gupshup WABA (Pro, official)
- **Session persistence:** Baileys sessions stored in Redis — pharmacies never re-scan QR after a restart
- **Multi-tenancy:** All data scoped to `pharmacy_id` — complete data isolation between pharmacies
- **Real-time updates:** Server-Sent Events (SSE) for live dashboard status without polling
- **Cloudflare Worker:** Edge-cached static assets and webhook ingestion
- **Self-hostable:** Full docker-compose setup — one command to run everything locally

---

## Success Metrics We Track

| Metric | What it measures | Target |
|---|---|---|
| Activation rate | Pharmacies who connect WhatsApp + add 1 patient in 7 days | >70% |
| Reminders sent / pharmacy | Avg monthly reminders fired per active pharmacy | >40 |
| Delivery success rate | % of scheduled reminders that reach "sent" status | >95% |
| Session uptime | % of time WhatsApp stays connected per pharmacy | >98% |
| Monthly churn | % of paying pharmacies cancelling | <5% |

---

*Easibill. One WhatsApp message at the right time. Everything else is noise.*
