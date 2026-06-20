# EASIBILL — Product Requirements Document
> Version 1.0 | June 2026 | Solo Founder: Sourabh  
> Stack: Next.js · Node.js · PostgreSQL · Redis · WhatsApp (Baileys/Gupshup)

---

## 1. Executive Summary

Easibill is a SaaS product for independent pharmacies in India. Its core function is one automated action: when a pharmacy records a patient purchase, Easibill schedules a WhatsApp refill reminder and sends it from the pharmacy's own number on the right day — without the pharmacist touching anything.

| Metric | Value |
|--------|-------|
| Starter plan | ₹299 / month — automated reminders via pharmacy's own WhatsApp |
| Pro plan | ₹999 / month — broadcast messaging, analytics, template library |
| Blended ARPU | ₹699 / month |
| Revenue model | SaaS subscription + wallet credits (pay-per-message top-up) |
| Initial target | 120 paying pharmacies |
| ARR milestone | ₹1 Crore |
| Primary market | Single-store independent pharmacies, Tier 1 and Tier 2 Indian cities |

---

## 2. Problem Statement

### 2.1 The Pharmacy Customer Retention Problem

A typical urban independent pharmacy has 200–500 active customers on chronic medications (diabetes, hypertension, thyroid) requiring monthly refills. These patients represent the most predictable, recurring revenue a pharmacy has. Yet most pharmacies lose 20–40% of these patients annually simply because they forgot to follow up.

Pharmacy owners already send WhatsApp reminders manually to their best customers. That behaviour validates the model. But they can only sustain it for 20–30 people before it breaks down.

### 2.2 Why Existing Tools Don't Solve It

| Tool | What It Does | Gap |
|------|-------------|-----|
| Marg ERP | Pharma billing, inventory, GST | No WhatsApp, no CRM, Windows desktop only |
| Khatabook | Credit/ledger tracking for SMBs | No refill reminders, no patient retention workflow |
| Vyapar | Billing + accounting for SMBs | Generic tool, not pharmacy-specific, no CRM |
| Tally | Accounting gold standard | No CRM, no WhatsApp, not pharma-specific |
| Zoho CRM | Enterprise CRM | Too complex, too expensive (₹800–2500/user), English-only |

> **Positioning:** Easibill does NOT compete with Marg ERP. Position as: "Works alongside your existing billing software. Add the CRM layer they don't have."

---

## 3. Target Users

### 3.1 Primary ICP — Independent Urban Pharmacist

| Attribute | Detail |
|-----------|--------|
| Store type | Single-store, owner-operated pharmacy |
| Location | Tier 1 / Tier 2 Indian city (Bangalore, Pune, Indore, Bhopal, Raipur) |
| Annual revenue | ₹25–80 lakh |
| Owner profile | Age 28–45, smartphone owner, uses WhatsApp daily |
| Current billing | Marg ERP, Ecogreen, or paper-based |
| Current CRM | None — manual WhatsApp to ~20–50 patients |
| Patient base | 100–400 active chronic patients (diabetes, BP, thyroid) |
| Pain | Loses patients who forget refills, cannot scale manual outreach |
| Willingness to pay | ₹500–1500/month if proven to retain 5+ patients per month |

### 3.2 Secondary ICP — Small Pharmacy Chain (3–10 stores)

| Attribute | Detail |
|-----------|--------|
| Store type | Owner-managed chain with a head office manager |
| Unlock condition | Target only after 50+ single-store customers acquired |
| Key difference | Needs multi-location dashboard, role-based access |
| Willingness to pay | ₹2,000–5,000/month for chain plan |

---

## 4. Core User Flow (MVP — The Only Thing That Matters)

This single automated flow must work perfectly before any other feature ships:

1. Pharmacist logs into the Easibill dashboard
2. Pharmacist adds or selects a patient — name, phone number, medicine name, date of purchase
3. System automatically calculates the refill date (default: 28 days from purchase)
4. System schedules a WhatsApp reminder job in the Bull queue
5. At 9:00 AM IST on the refill date — WhatsApp message sent from pharmacy's own number
6. Dashboard shows reminder status: Scheduled / Sent / Failed
7. Pharmacist sees which patients are due for a visit this week

> **Rule:** Nothing else ships until this flow works perfectly end-to-end for at least 10 pharmacies.

---

## 5. Feature Specifications

### 5.1 MVP Features (Week 1–3)

#### 5.1.1 Pharmacy Authentication
- Email + password login for pharmacy owner
- JWT-based session (7-day expiry)
- Single admin user per pharmacy in MVP
- Password reset via email

#### 5.1.2 Patient Management
- Add patient: name, phone number, WhatsApp number (if different), notes
- Add purchase: patient, medicine name, quantity, date purchased, refill interval (default 28 days, adjustable)
- Patient list view with search and filter by: name, phone, upcoming refill date
- Patient profile page: all purchase history, all reminders sent, status
- Edit or delete patients and purchases

#### 5.1.3 WhatsApp Connection (Baileys — Starter Tier)
- QR code displayed in dashboard for pharmacy owner to scan with their phone
- Session persisted in Redis — pharmacy should NOT need to re-scan after server restart
- Connection status indicator: Connected / Disconnected / Reconnecting
- Automatic reconnection on disconnect with exponential backoff
- Send rate limit: max 30 messages/hour per pharmacy number (avoid WhatsApp ban)

#### 5.1.4 Automated Refill Reminders
- Scheduler runs at 8:50 AM IST daily via `node-cron`
- Queries all reminders due today from PostgreSQL
- Adds each reminder as a job to Bull queue (`reminder-queue`)
- Bull worker processes queue with `concurrency: 3`
- Worker sends WhatsApp via Baileys, updates reminder status in DB (`sent` / `failed`)
- Failed jobs retry 3 times with exponential backoff (5s → 10s → 20s)
- Default message templates:
  - Hindi: `"Namaste {patient_name} ji, aapki {medicine_name} refill ka time aa gaya hai. Kripya aaj pharmacy par aaiye. — {pharmacy_name}"`
  - English: `"Hello {patient_name}, your {medicine_name} refill is due today. Please visit us. — {pharmacy_name}"`

#### 5.1.5 Dashboard
- Today's reminders: list of patients receiving a message today
- This week's upcoming reminders: 7-day preview
- Stats bar: total patients, active reminders, messages sent this month, WhatsApp status
- Recent activity feed: last 10 reminder events

---

### 5.2 Pro Features (Ship After 15 Paying Customers)

#### 5.2.1 Gupshup WABA Integration
- Replaces Baileys for Pro-tier pharmacies
- Required for broadcast messages (HSM templates)
- Per-message cost deducted from pharmacy wallet (credits)
- Template library: pre-approved templates for refills, festivals, health tips
- Template submission and approval workflow in dashboard

#### 5.2.2 Broadcast Campaigns
- Send one message to a filtered group of patients (e.g., all diabetic patients, all patients not seen in 45 days)
- Schedule broadcasts: send now or at a specific date/time
- Broadcast history with delivery stats (sent, delivered, read — via WABA webhooks)
- Wallet credits required (1 credit = 1 message)

#### 5.2.3 Advanced Analytics
- Patient lapse detection: flag patients who have not refilled in >45 days
- Retention rate per month: % of patients who returned vs. reminders sent
- Revenue impact estimate: average basket size × returned patients
- Top medicines by refill frequency

#### 5.2.4 Multi-Language Support
- Templates in: Hindi, English, Marathi, Telugu, Kannada
- Per-patient language preference

---

### 5.3 Out of Scope — Do NOT Build

| Feature | Why |
|---------|-----|
| GST billing / invoicing | Competes with Marg ERP — a battle we lose |
| Inventory management | Same reason — pharmacists already have tools |
| Online pharmacy store / delivery | Different business entirely |
| Doctor CRM / appointment booking | Wrong user — pharmacy, not clinic |
| Payment collection | Regulatory complexity |
| Native iOS / Android app | PWA via Next.js is sufficient for MVP |
| Multi-user roles (staff login) | V2 only, after chains are targeted |
| AI medicine recommendations | Out of scope. Liability risk. |

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 14 (App Router) + TypeScript | Dashboard UI |
| UI Library | Tailwind CSS + shadcn/ui | Fast, accessible components |
| Backend | Node.js + Express + TypeScript | REST API only — no GraphQL for MVP |
| Database | PostgreSQL 15 | Primary data store |
| Queue | BullMQ + Redis | All WhatsApp sends go through queue — never fire-and-forget |
| Session store | Redis | Baileys session persistence and BullMQ |
| Scheduler | node-cron | Triggers daily reminder query at 8:50 AM IST |
| WhatsApp (Starter) | Baileys (`@whiskeysockets/baileys`) | Unofficial API — pharmacy's own number |
| WhatsApp (Pro) | Gupshup WABA API | Official, required for broadcasts |
| Auth | JWT + bcrypt | Stateless, pharmacy-scoped |
| Infrastructure | AWS EC2 (t3.small) + RDS + ElastiCache | Or single VPS for MVP |
| Containerisation | Docker + docker-compose | Single file to spin up all services |

### 6.2 System Flow — Reminder Pipeline

```
Pharmacy Staff logs purchase
       |
       v
Next.js Dashboard  --REST-->  Express API
                                    |
                                    v
                              Saves reminder
                         (status: 'scheduled') → PostgreSQL

node-cron fires at 8:50 AM IST daily
       |
       v
Queries due reminders from PostgreSQL
       |
       v
Adds jobs to BullMQ (reminder-queue) in Redis
       |
       ├──────────────────────────┐
       v                          v
[Baileys Worker]          [Gupshup Worker]
(Starter plan)            (Pro plan)
       |                          |
       └──────────┬───────────────┘
                  v
    WhatsApp sent from pharmacy's number
                  |
                  v
    DB updated: reminder.status = 'sent'
```

> **Architecture rule:** Every WhatsApp send goes through BullMQ. Never call Baileys or Gupshup directly from an API route. This ensures retries, backoff, and observability.

### 6.3 WhatsApp Tier Strategy

| Attribute | Starter (Baileys) | Pro (Gupshup WABA) |
|-----------|-------------------|---------------------|
| Cost to pharmacy | Included in ₹299/month | Per-message via wallet credits |
| WhatsApp number | Pharmacy's own personal number | Dedicated business number |
| Approval required | No — QR scan, works immediately | Yes — BSP onboarding (3–7 days) |
| Broadcast support | No — 1:1 messages only | Yes — approved HSM templates |
| Daily limit | Max 30 messages/hour | Per Gupshup tier limits |
| Ban risk | Medium — mitigated by rate limiting | None — official API |

### 6.4 Baileys Session Persistence (CRITICAL — Solve in Week 1)

Session must survive server restarts. Without this, every deployment forces all pharmacies to re-scan QR — this is a fatal UX problem.

```typescript
// Use Redis auth state adapter
const { state, saveCreds } = await useRedisAuthState(redisClient, `wa:session:${pharmacyId}`);
const sock = makeWASocket({ auth: state });
sock.ev.on('creds.update', saveCreds); // persist immediately on every update
```

Rules:
- Store session under key: `wa:session:{pharmacyId}`
- On server start: check if Redis session exists — restore without QR if yes
- Never use in-memory or filesystem auth in production
- Bull queue: all sends have `attempts: 3`, `backoff: { type: 'exponential', delay: 5000 }`

### 6.5 Message Service Abstraction

```typescript
// messageService.ts — the ONLY way to send WhatsApp messages
// Allows swapping Baileys ↔ Gupshup without rewriting application logic
export async function sendMessage(pharmacyId: string, to: string, body: string): Promise<void> {
  const pharmacy = await getPharmacy(pharmacyId);
  if (pharmacy.plan === 'pro') {
    return sendViaGupshup({ to, body, pharmacy });
  }
  return sendViaBaileys({ to, body, pharmacyId });
}
```

---

## 7. Database Schema (PostgreSQL)

### Tables Overview

| Table | Purpose |
|-------|---------|
| `pharmacies` | One row per registered pharmacy (the tenant) |
| `patients` | Pharmacy's customers — each belongs to one pharmacy |
| `purchases` | Each medicine purchase by a patient |
| `reminders` | Scheduled WhatsApp reminder for each purchase |
| `message_logs` | Full log of every WhatsApp send attempt |
| `wallet_transactions` | Credits added/deducted per pharmacy (Pro tier) |
| `broadcast_campaigns` | Pro-tier bulk broadcast jobs |

### pharmacies

```sql
CREATE TABLE pharmacies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  owner_name      TEXT NOT NULL,
  phone           TEXT UNIQUE NOT NULL,    -- WhatsApp number used with Baileys
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  plan            TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro')),
  wallet_credits  INTEGER DEFAULT 0,       -- in paise (100 = ₹1)
  wa_session_id   TEXT,                    -- Redis key for Baileys session
  wa_connected    BOOLEAN DEFAULT false,
  timezone        TEXT DEFAULT 'Asia/Kolkata',
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### patients

```sql
CREATE TABLE patients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id     UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  whatsapp_phone  TEXT,                    -- if different from phone
  language        TEXT DEFAULT 'hindi' CHECK (language IN ('hindi','english','marathi','telugu','kannada')),
  notes           TEXT,                    -- chronic condition, doctor, etc.
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_patients_pharmacy_id ON patients(pharmacy_id);
```

### purchases

```sql
CREATE TABLE purchases (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id           UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  patient_id            UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medicine_name         TEXT NOT NULL,
  quantity              INTEGER,
  purchased_at          TIMESTAMPTZ NOT NULL,
  refill_interval_days  INTEGER DEFAULT 28,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_purchases_patient_id ON purchases(patient_id);
CREATE INDEX idx_purchases_pharmacy_id ON purchases(pharmacy_id);
```

### reminders

```sql
CREATE TABLE reminders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id       UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  purchase_id       UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  scheduled_for     DATE NOT NULL,
  status            TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','sent','failed','cancelled')),
  sent_at           TIMESTAMPTZ,
  message_template  TEXT,                  -- rendered message body
  attempt_count     INTEGER DEFAULT 0,
  error_message     TEXT,
  bull_job_id       TEXT,                  -- for queue observability
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reminders_scheduled_for ON reminders(scheduled_for);
CREATE INDEX idx_reminders_pharmacy_status ON reminders(pharmacy_id, status);
```

### message_logs

```sql
CREATE TABLE message_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id   UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  reminder_id   UUID REFERENCES reminders(id),
  to_phone      TEXT NOT NULL,
  message_body  TEXT NOT NULL,
  channel       TEXT DEFAULT 'baileys' CHECK (channel IN ('baileys','gupshup')),
  status        TEXT CHECK (status IN ('sent','failed','delivered','read')),
  gupshup_msg_id TEXT,
  error         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### wallet_transactions

```sql
CREATE TABLE wallet_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id     UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  amount_paise    INTEGER NOT NULL,        -- positive = credit, negative = debit
  type            TEXT CHECK (type IN ('topup','message_charge','refund')),
  description     TEXT,
  reference_id    TEXT,                    -- payment gateway txn id
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### broadcast_campaigns (Pro)

```sql
CREATE TABLE broadcast_campaigns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id     UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  message_body    TEXT NOT NULL,
  filter_criteria JSONB,                   -- e.g. {"condition": "diabetic", "last_seen_days": 45}
  scheduled_at    TIMESTAMPTZ,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','running','completed','failed')),
  total_recipients INTEGER DEFAULT 0,
  sent_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. API Routes

Base prefix: `/api/v1`  
All routes require `Authorization: Bearer <jwt>` except auth routes.  
Error format: `{ success: false, error: "message", code: "ERROR_CODE" }`

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create pharmacy account |
| POST | `/auth/login` | Returns JWT |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset with token |

### Pharmacy
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/pharmacy/me` | Get current pharmacy profile |
| PATCH | `/pharmacy/me` | Update pharmacy settings |
| GET | `/pharmacy/wa-status` | WhatsApp connection status + QR code |
| POST | `/pharmacy/wa-connect` | Trigger QR generation |
| POST | `/pharmacy/wa-disconnect` | Disconnect WhatsApp session |

### Patients
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/patients` | List all patients (paginated, searchable) |
| POST | `/patients` | Create patient |
| GET | `/patients/:id` | Get patient + purchase + reminder history |
| PATCH | `/patients/:id` | Update patient |
| DELETE | `/patients/:id` | Soft delete patient |

### Purchases
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/purchases` | List purchases (paginated) |
| POST | `/purchases` | Log purchase → auto-creates reminder |
| GET | `/purchases/:id` | Get purchase detail |
| PATCH | `/purchases/:id` | Update purchase + reschedule reminder |

### Reminders
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/reminders` | List reminders (filter by status, date range) |
| POST | `/reminders/:id/cancel` | Cancel a scheduled reminder |
| POST | `/reminders/:id/reschedule` | Reschedule to a new date |
| POST | `/reminders/:id/retry` | Manually retry a failed reminder |

### Dashboard
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard/stats` | Counts for dashboard cards |
| GET | `/dashboard/today` | Today's reminders list |
| GET | `/dashboard/upcoming` | Next 7 days reminder preview |
| GET | `/dashboard/activity` | Last 10 reminder events |

---

## 9. Project Structure

```
easibill/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── pharmacy.ts
│   │   │   ├── patients.ts
│   │   │   ├── purchases.ts
│   │   │   ├── reminders.ts
│   │   │   └── dashboard.ts
│   │   ├── services/
│   │   │   ├── baileysService.ts      # QR, connect, send, session management
│   │   │   ├── gupshupService.ts      # WABA send, template management
│   │   │   └── messageService.ts      # Abstraction layer — always use this
│   │   ├── jobs/
│   │   │   ├── cronScheduler.ts       # node-cron: queries DB, populates queue
│   │   │   └── reminderWorker.ts      # BullMQ worker: calls messageService
│   │   ├── db/
│   │   │   ├── pool.ts                # pg Pool singleton
│   │   │   └── migrations/            # SQL migration files
│   │   ├── middleware/
│   │   │   ├── auth.ts                # JWT verification
│   │   │   ├── tenantScope.ts         # Inject pharmacy_id into all queries
│   │   │   └── errorHandler.ts        # Global error handler
│   │   └── utils/
│   │       ├── templates.ts           # Message template renderer
│   │       └── dateUtils.ts           # IST timezone helpers
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (dashboard)/
│   │       ├── page.tsx               # Dashboard home
│   │       ├── patients/
│   │       ├── reminders/
│   │       └── settings/
│   ├── components/
│   │   ├── ui/                        # shadcn components
│   │   └── shared/                    # QRCodeDisplay, ReminderCard, etc.
│   ├── lib/
│   │   └── api.ts                     # Typed fetch wrapper
│   └── package.json
│
├── docker-compose.yml                 # postgres + redis + backend + frontend
├── .env.example
└── README.md
```

---

## 10. Environment Variables

```env
# Required for all environments
DATABASE_URL=postgresql://user:pass@localhost:5432/easibill
REDIS_URL=redis://localhost:6379
JWT_SECRET=<long-random-string-never-commit>
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email (password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Pro tier only
GUPSHUP_API_KEY=
GUPSHUP_APP_NAME=

# Scheduler (optional override)
# Default: '50 8 * * *' = 8:50 AM IST = '20 3 * * *' UTC
CRON_SCHEDULE=20 3 * * *
```

---

## 11. Docker Compose (MVP)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: easibill
      POSTGRES_USER: easibill
      POSTGRES_PASSWORD: easibill_local
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    command: redis-server --appendonly yes  # persist to disk

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    env_file: .env
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - backend

volumes:
  pgdata:
  redisdata:
```

---

## 12. Business Model

### Plans

| Feature | Starter (₹299/mo) | Pro (₹999/mo) |
|---------|-------------------|----------------|
| Patients | Unlimited | Unlimited |
| Automated reminders | Yes — pharmacy's own WhatsApp | Yes — official WABA number |
| Broadcast campaigns | No | Yes — wallet credits |
| Analytics | Basic | Advanced (lapse detection, retention rate) |
| Templates | 1 default per language | Full library + custom |
| Languages | Hindi + English | All 5 |
| Support | Email | Priority WhatsApp |
| Free trial | 14 days | 14 days |

### Wallet Credits (Pro)
- 1 credit = ₹1 = 1 WhatsApp message via Gupshup WABA
- Minimum top-up: ₹200
- Credits never expire
- Low-balance alert at ₹50 remaining

### Revenue Targets

| Milestone | Pharmacies | Mix | MRR |
|-----------|-----------|-----|-----|
| Month 3 | 20 | All Starter | ₹5,980 |
| Month 6 | 50 | 70% Starter, 30% Pro | ₹25,430 |
| Month 9 | 80 | 60% Starter, 40% Pro | ₹46,080 |
| Month 12 | 120 | 50/50 | ₹77,880 |

---

## 13. Development Roadmap

### Week 1 — Backend Core
- [ ] Project scaffold: monorepo, docker-compose (Postgres + Redis)
- [ ] Database migrations: all 7 tables + indexes
- [ ] Auth routes: register, login, JWT middleware, forgot-password
- [ ] Patient CRUD routes with pharmacy-scoped queries
- [ ] Purchase route — creates purchase + auto-creates reminder row
- [ ] **Baileys service: connect, QR generation, Redis session persistence** ← highest risk, solve first
- [ ] BullMQ setup: reminder-queue, worker skeleton
- [ ] node-cron job: daily 8:50 AM query + queue population
- [ ] BullMQ worker: calls messageService, updates reminder status

### Week 2 — Frontend Dashboard
- [ ] Next.js project setup with Tailwind + shadcn/ui
- [ ] Auth pages: login, register
- [ ] Dashboard home: stats cards + today's reminders + WhatsApp status badge
- [ ] Patients list page: search, filter, add patient modal
- [ ] Patient detail page: purchase history + reminder timeline
- [ ] Add purchase form: patient selector, medicine name, date, refill interval
- [ ] WhatsApp connect page: QR code display with polling / WebSocket status

### Week 3 — Polish, Test, First Customer
- [ ] Reminder list page: filter by status, cancel/reschedule actions
- [ ] E2E test: add patient → add purchase → wait → reminder fires → DB updated
- [ ] Error handling: failed job alerts in dashboard activity feed
- [ ] Production docker-compose: Nginx reverse proxy, SSL, env secrets
- [ ] Deploy to EC2 t3.small
- [ ] Onboard first 3 pharmacies in Bangalore — in-person install + QR scan

> **After Week 3:** Do not build more features until 10 pharmacies are live and paying. Talk to each one personally.

---

## 14. Success Metrics

### Product Health (Monthly)

| Metric | Definition | Target Month 3 |
|--------|-----------|----------------|
| Activation rate | % of signups who connect WhatsApp + add 1 patient in 7 days | >70% |
| Reminders sent/pharmacy | Avg monthly reminders fired per active pharmacy | >40 |
| Delivery success rate | % of scheduled reminders that reach 'sent' status | >95% |
| Session uptime | % of time Baileys session stays connected per pharmacy | >98% |
| Monthly churn | % of paying pharmacies cancelling each month | <5% |
| NPS | Net Promoter Score from monthly survey | >50 |

---

## 15. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| WhatsApp bans pharmacy number (Baileys) | Medium | High | Rate limit 30 msg/hr. Auto-switch to WABA on ban. |
| Baileys session drops after deploy | High | High | Redis auth state is non-negotiable. Test before every deploy. |
| Pharmacy never adds purchases (no input = no reminders) | High | Medium | Weekly digest email for 0-purchase pharmacies. Simple "quick add" mobile screen. |
| Competitor builds same feature into Marg ERP | Low | High | Marg is legacy Windows desktop. Timeline to ship WhatsApp CRM: 18–24 months. |
| Low willingness to pay at ₹299 | Medium | High | 14-day free trial. Price anchored to "saves 5 patients = ₹1,250 extra revenue." |
| Solo developer burnout before 10 customers | Medium | High | Week 3 is hard cut-off. Ship MVP as described. No feature creep. |

---

## 16. Key Technical Rules

1. **Every WhatsApp send goes through BullMQ** — never call Baileys/Gupshup directly from a route handler
2. **Baileys session MUST be in Redis** — not memory, not filesystem
3. **All DB queries MUST be scoped to `pharmacy_id`** — use `tenantScope` middleware
4. **REST only** — no GraphQL, no tRPC, no WebSockets (except QR status polling)
5. **No billing features** — no invoice, no GST, no inventory. If it touches stock, it's out of scope.
6. **Rate limit all Baileys sends** — 30 messages/hour max per pharmacy WhatsApp number
7. **Fail loudly** — all failed reminder jobs must surface in the dashboard, not silently disappear

---

*The only job that matters: send one WhatsApp message at the right time. Everything else is noise.*