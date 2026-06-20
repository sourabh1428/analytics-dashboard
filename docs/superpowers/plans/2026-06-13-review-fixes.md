# Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all confirmed bugs and rough edges from the 2026-06-13 review doc, across backend (timezone, tag table, BullMQ) and frontend (error states, confirm dialogs, broadcast warning, pagination, settings cleanup).

**Architecture:** Backend fixes are targeted patches to existing files; new BullMQ workers follow the exact pattern of `reminderWorker.ts`. Frontend fixes are targeted edits; no new pages are created. One cleanup migration handles schema drift.

**Tech Stack:** Node.js + TypeScript + BullMQ + PostgreSQL (backend); Next.js 14 App Router + Tailwind (frontend).

---

## Pre-flight: What the review got wrong (already fixed — skip these)

- `is_test` column: added in `002_delivery_and_lang.sql` — **no action needed**
- Mobile sidebar: `layout.tsx` already uses `hidden md:flex` + bottom nav — **no action needed**
- Broadcasts/Reports in sidebar: already in the `NAV` array in `layout.tsx` — **no action needed**
- WAStatusBadge: already has "Send Test Message" button to verify real connectivity — **no action needed**

---

## Task 1: Backend — Timezone Fix + Wrong Tag Table + Schema Cleanup Migration

**Files:**
- Modify: `backend/src/jobs/cronScheduler.ts:11`
- Modify: `backend/src/routes/broadcasts.ts:55`
- Create: `backend/src/db/migrations/012_schema_cleanup.sql`
- Modify: `backend/src/db/migrate.ts`

### BUG-4: Timezone fix

- [ ] **Step 1: Fix `cronScheduler.ts` date calculation**

Open `backend/src/jobs/cronScheduler.ts`. Replace line 11:

```typescript
// BEFORE
const today = new Date().toISOString().split('T')[0];

// AFTER — produce date string in IST, not UTC
const today = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Kolkata' }).split(',')[0];
```

`en-CA` locale gives `YYYY-MM-DD` format. `toLocaleString` applies the timezone before formatting, so at 18:30 IST the result is still the IST date, not the UTC date which would already be the next day.

### BUG-3: Wrong tag junction table

- [ ] **Step 2: Fix broadcast tag filter in `broadcasts.ts`**

Open `backend/src/routes/broadcasts.ts`. On the line that says `SELECT patient_id FROM patient_tags WHERE tag_id = $N`, change `patient_tags` to `patient_tag_map`:

```typescript
// BEFORE (line ~55)
query += ` AND id IN (
  SELECT patient_id FROM patient_tags WHERE tag_id = $${params.length}
)`;

// AFTER
query += ` AND id IN (
  SELECT patient_id FROM patient_tag_map WHERE tag_id = $${params.length}
)`;
```

`patient_tags` is the tag definition table (name, color). `patient_tag_map` is the junction table (patient_id, tag_id). The filter was silently returning all patients or throwing a runtime error.

### Schema cleanup migration

- [ ] **Step 3: Create `backend/src/db/migrations/012_schema_cleanup.sql`**

```sql
-- Drop the unused broadcast_campaigns table created in 001_initial.sql.
-- The codebase uses the simpler 'broadcasts' table from 007_broadcasts.sql.
DROP TABLE IF EXISTS broadcast_campaigns;

-- Widen message_logs.channel CHECK to include 'baileys' for future use.
-- The original constraint only allowed 'gupshup'; drop it and re-add open.
ALTER TABLE message_logs
  DROP CONSTRAINT IF EXISTS message_logs_channel_check;
ALTER TABLE message_logs
  ADD CONSTRAINT message_logs_channel_check
    CHECK (channel IN ('gupshup', 'baileys', 'manual'));
```

- [ ] **Step 4: Add migration 012 to `backend/src/db/migrate.ts`**

```typescript
const migrations = [
  '001_initial.sql', '002_delivery_and_lang.sql', '003_opted_in.sql',
  '004_onboarding.sql', '005_medicine_catalog.sql', '006_tags_households.sql',
  '007_broadcasts.sql', '008_template_fields.sql', '009_template_bodies.sql',
  '010_template_params.sql', '011_template_name.sql', '012_schema_cleanup.sql',
];
```

- [ ] **Step 5: Apply migration via Node**

```bash
cd backend
node -e "
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  const sql = fs.readFileSync(path.join('src/db/migrations', '012_schema_cleanup.sql'), 'utf8');
  try { await pool.query(sql); console.log('OK: 012'); }
  catch(e) { console.log('ERR:', e.message); }
  await pool.end();
})();
"
```

Expected: `OK: 012`

- [ ] **Step 6: Commit**

```bash
git add backend/src/jobs/cronScheduler.ts backend/src/routes/broadcasts.ts backend/src/db/migrations/012_schema_cleanup.sql backend/src/db/migrate.ts
git commit -m "fix: IST timezone date for cron, correct tag junction table, schema cleanup migration"
```

---

## Task 2: Backend — Broadcast Worker via BullMQ

**Files:**
- Create: `backend/src/jobs/broadcastWorker.ts`
- Modify: `backend/src/routes/broadcasts.ts`
- Modify: `backend/src/app.ts`

The fire-and-forget loop in `broadcasts.ts` (lines 86-103) sends directly from the route handler with no retry, no observability, and no crash-safety. Each recipient must become an individual BullMQ job.

- [ ] **Step 1: Create `backend/src/jobs/broadcastWorker.ts`**

```typescript
import { Queue, Worker, Job } from 'bullmq';
import { bullMQConnection } from '../redis';
import { pool } from '../db/pool';
import { sendViaGupshup } from '../services/gupshupService';

export type BroadcastJobData = {
  broadcastId: string;
  pharmacyId: string;
  pharmacyName: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  message: string;
};

export const BROADCAST_QUEUE_NAME = 'broadcast-queue';

export const broadcastQueue = new Queue<BroadcastJobData>(BROADCAST_QUEUE_NAME, {
  connection: bullMQConnection,
});

export function startBroadcastWorker() {
  const worker = new Worker<BroadcastJobData>(
    BROADCAST_QUEUE_NAME,
    async (job: Job<BroadcastJobData>) => {
      const { broadcastId, pharmacyId, pharmacyName, patientPhone, message } = job.data;

      try {
        await sendViaGupshup({ to: patientPhone, body: message, pharmacyName });
        await pool.query(
          `UPDATE broadcasts SET sent_count = sent_count + 1 WHERE id = $1`,
          [broadcastId]
        );
        await pool.query(
          `INSERT INTO message_logs (pharmacy_id, to_phone, message_body, channel, status)
           VALUES ($1, $2, $3, 'gupshup', 'sent')`,
          [pharmacyId, patientPhone, message]
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        await pool.query(
          `UPDATE broadcasts SET failed_count = failed_count + 1 WHERE id = $1`,
          [broadcastId]
        );
        await pool.query(
          `INSERT INTO message_logs (pharmacy_id, to_phone, message_body, channel, status, error)
           VALUES ($1, $2, $3, 'gupshup', 'failed', $4)`,
          [pharmacyId, patientPhone, message, msg]
        );
        throw err; // BullMQ will retry with backoff
      }
    },
    {
      connection: bullMQConnection,
      concurrency: 5,
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`Broadcast job ${job?.id} failed permanently:`, err.message);
  });

  return worker;
}
```

- [ ] **Step 2: Rewrite the fire-and-forget loop in `broadcasts.ts`**

Replace the fire-and-forget block (lines 80–103) and the `sendViaGupshup` import with BullMQ enqueueing. The full updated `POST /` handler after the broadcast record insert:

```typescript
// At top of file — replace sendViaGupshup import with:
import { broadcastQueue } from '../jobs/broadcastWorker';

// Replace lines 80–103 (the fire-and-forget async IIFE) with:
const jobs = recipients.map(patient => {
  const dest = patient.whatsapp_phone || patient.phone;
  const personalised = message.replace(/\{\{name\}\}/gi, patient.name);
  return broadcastQueue.add(
    'send-broadcast',
    {
      broadcastId,
      pharmacyId: req.pharmacyId!,
      pharmacyName,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: dest,
      message: personalised,
    },
    { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
  );
});
await Promise.all(jobs);
```

The full `POST /broadcasts` route handler now:
1. Validates input
2. Fetches pharmacy name
3. Queries recipients (with fixed `patient_tag_map`)
4. Creates the `broadcasts` row
5. Enqueues one BullMQ job per recipient
6. Returns 202 immediately — the worker updates `sent_count`/`failed_count` as jobs complete

- [ ] **Step 3: Register `startBroadcastWorker` in `backend/src/app.ts`**

Add at the top of `app.ts` alongside the dotenv import block:

```typescript
import { startBroadcastWorker } from './jobs/broadcastWorker';
```

After `export { app }` at the bottom of the file (or in a separate `server.ts` if one exists), call it. Find where `startReminderWorker` is called — it's in the server startup file. Check `backend/src/index.ts` or `server.ts`:

```typescript
// wherever startReminderWorker() is called, add:
startBroadcastWorker();
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/jobs/broadcastWorker.ts backend/src/routes/broadcasts.ts backend/src/app.ts
git commit -m "fix: route broadcast sends through BullMQ worker (retry + observability)"
```

---

## Task 3: Backend — Sale Confirmation via BullMQ

**Files:**
- Create: `backend/src/jobs/saleConfirmationWorker.ts`
- Modify: `backend/src/routes/sales.ts`
- Modify: wherever workers are started (same file as Task 2 Step 3)

The inline `sendTemplateViaGupshup` / `sendViaGupshup` call in `sales.ts:123` sends directly from the POST handler. If Gupshup blips, the failure is logged to console and lost — no retry, no message_log entry on retry.

- [ ] **Step 1: Create `backend/src/jobs/saleConfirmationWorker.ts`**

```typescript
import { Queue, Worker, Job } from 'bullmq';
import { bullMQConnection } from '../redis';
import { pool } from '../db/pool';
import { sendViaGupshup, sendTemplateViaGupshup, countTemplatePlaceholders } from '../services/gupshupService';
import { renderPurchaseConfirmation } from '../utils/templates';
import { canSendWhatsApp } from '../utils/whatsapp';

export type SaleConfirmationJobData = {
  pharmacyId: string;
  pharmacyName: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientLanguage: string;
  medicineList: string;
  minRefillDays: number;
  totalAmount: number;
  paymentMethod: string | null;
  saleTemplateId: string | null;
  saleTemplateBody: string | null;
  saleTemplateParams: string[];
};

export const SALE_QUEUE_NAME = 'sale-confirmation-queue';

export const saleConfirmationQueue = new Queue<SaleConfirmationJobData>(SALE_QUEUE_NAME, {
  connection: bullMQConnection,
});

export function startSaleConfirmationWorker() {
  const worker = new Worker<SaleConfirmationJobData>(
    SALE_QUEUE_NAME,
    async (job: Job<SaleConfirmationJobData>) => {
      const {
        pharmacyId, pharmacyName, patientPhone, patientName, patientLanguage,
        medicineList, minRefillDays, totalAmount, paymentMethod,
        saleTemplateId, saleTemplateBody, saleTemplateParams,
      } = job.data;

      let msgBody: string;
      let messageId: string;

      if (saleTemplateId) {
        const saleFieldValues: Record<string, string> = {
          patient_name:   patientName,
          medicine_list:  medicineList,
          pharmacy_name:  pharmacyName,
          refill_days:    String(minRefillDays),
          total_amount:   totalAmount > 0 ? `₹${totalAmount.toFixed(2)}` : '',
          payment_method: paymentMethod || '',
        };
        const templateParams = saleTemplateParams.length > 0
          ? saleTemplateParams.map(key => saleFieldValues[key] ?? '')
          : [patientName, medicineList, String(minRefillDays), pharmacyName];

        messageId = await sendTemplateViaGupshup({
          to: patientPhone,
          templateId: saleTemplateId,
          templateParams,
          templateBody: saleTemplateBody ?? undefined,
        });
        msgBody = `[Template: ${saleTemplateId}] ${patientName} / ${medicineList}`;
      } else {
        msgBody = renderPurchaseConfirmation({
          patient_name: patientName,
          medicine_list: medicineList,
          refill_days: minRefillDays,
          pharmacy_name: pharmacyName,
          language: patientLanguage,
        });
        messageId = await sendViaGupshup({ to: patientPhone, body: msgBody, pharmacyName });
      }

      await pool.query(
        `INSERT INTO message_logs (pharmacy_id, to_phone, message_body, channel, status, gupshup_msg_id)
         VALUES ($1, $2, $3, 'gupshup', 'sent', $4)`,
        [pharmacyId, patientPhone, msgBody, messageId || null]
      );
    },
    { connection: bullMQConnection, concurrency: 5 }
  );

  worker.on('failed', (job, err) => {
    console.error(`Sale confirmation job ${job?.id} failed permanently:`, err.message);
  });

  return worker;
}
```

- [ ] **Step 2: Replace inline send in `sales.ts` with queue enqueue**

In `backend/src/routes/sales.ts`, remove the `sendViaGupshup`, `sendTemplateViaGupshup` imports and replace the entire try block (lines ~115-148) that does the WhatsApp send with:

```typescript
import { saleConfirmationQueue } from '../jobs/saleConfirmationWorker';

// After await client.query('COMMIT'), replace the whatsapp send block:
let whatsappSent = false;
if (pharmacy?.wa_connected && canSendWhatsApp(patient)) {
  const waPhone = patient.whatsapp_phone || patient.phone;
  const medicineList = items.map(i => i.medicine_name).join(', ');
  const minRefillDays = Math.min(...items.map(i => i.refill_interval_days ?? 28));
  const totalAmount = items.reduce((s, i) => s + (i.unit_price || 0) * (i.quantity || 1), 0);

  await saleConfirmationQueue.add(
    'send-sale-confirmation',
    {
      pharmacyId: req.pharmacyId!,
      pharmacyName: pharmacy.name,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: waPhone,
      patientLanguage: patient.language,
      medicineList,
      minRefillDays,
      totalAmount,
      paymentMethod: payment_method || null,
      saleTemplateId: pharmacy.sale_template_id || null,
      saleTemplateBody: pharmacy.sale_template_body || null,
      saleTemplateParams: pharmacy.sale_template_params || [],
    },
    { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
  );
  whatsappSent = true; // job enqueued, not yet sent
}

res.status(201).json({ success: true, patient, isNew, purchases, reminders, whatsappSent });
```

- [ ] **Step 3: Register `startSaleConfirmationWorker` alongside other workers**

Find the server startup file (usually `backend/src/index.ts` or wherever `startReminderWorker()` is called):

```typescript
import { startSaleConfirmationWorker } from './jobs/saleConfirmationWorker';
// ...
startSaleConfirmationWorker();
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/jobs/saleConfirmationWorker.ts backend/src/routes/sales.ts
git commit -m "fix: enqueue sale confirmation via BullMQ instead of inline Gupshup call"
```

---

## Task 4: Frontend — Dashboard Error State + 60-second Polling

**Files:**
- Modify: `frontend/app/(dashboard)/page.tsx`

Currently `.catch(() => {})` silently swallows all API errors. Data is never refreshed after mount.

- [ ] **Step 1: Add error state + polling to `frontend/app/(dashboard)/page.tsx`**

Replace the current `useEffect` and add an `error` state:

```typescript
// Add at the top of DashboardPage, alongside existing state:
const [error, setError] = useState(false);

// Replace the current useEffect (lines 31-43) with:
const loadDashboard = async () => {
  try {
    const [s, t, u, a] = await Promise.all([
      api.dashboard.stats(),
      api.dashboard.today(),
      api.dashboard.upcoming(),
      api.dashboard.activity(),
    ]);
    setStats(s.stats);
    setTodayReminders(t.reminders);
    setUpcomingReminders(u.reminders);
    setActivity(a.activity);
    setError(false);
  } catch {
    setError(true);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadDashboard();
  const interval = setInterval(loadDashboard, 60_000);
  return () => clearInterval(interval);
}, []);
```

Add the error banner just below the greeting `<div>` (before the quick actions row):

```tsx
{error && (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
    <span>Couldn&apos;t load dashboard data.</span>
    <button
      onClick={() => { setLoading(true); loadDashboard(); }}
      className="font-medium underline hover:no-underline"
    >
      Retry
    </button>
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/(dashboard)/page.tsx
git commit -m "fix: dashboard error banner + 60s auto-refresh polling"
```

---

## Task 5: Frontend — Confirm Dialogs Before Destructive Actions

**Files:**
- Modify: `frontend/app/(dashboard)/reminders/page.tsx` (cancel confirmation)
- Modify: `frontend/app/(dashboard)/patients/page.tsx` (delete confirmation)

### Reminders cancel confirm

- [ ] **Step 1: Add confirm dialog to `handleCancel` in `reminders/page.tsx`**

Replace the existing `handleCancel` function (around line 52):

```typescript
const handleCancel = async (id: string) => {
  const reminder = reminders.find(r => r.id === id);
  const label = reminder ? `${reminder.patient_name} — ${reminder.medicine_name}` : 'this reminder';
  if (!window.confirm(`Cancel reminder for ${label}? This cannot be undone.`)) return;
  try {
    await api.reminders.cancel(id);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));
    toast.success('Reminder cancelled');
  } catch {
    toast.error('Failed to cancel reminder');
  }
};
```

### Patients delete confirm

- [ ] **Step 2: Find and update the patient delete handler in `patients/page.tsx`**

Find the delete handler (it calls `api.patients.delete(id)`). Wrap it with a confirm:

```typescript
const handleDelete = async (id: string) => {
  const patient = patients.find(p => p.id === id);
  const name = patient?.name ?? 'this patient';
  if (!window.confirm(`Delete ${name}? Their purchase history will be retained but the patient record will be removed.`)) return;
  try {
    await api.patients.delete(id);
    setPatients(prev => prev.filter(p => p.id !== id));
    toast.success('Patient deleted');
  } catch {
    toast.error('Failed to delete patient');
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add frontend/app/(dashboard)/reminders/page.tsx frontend/app/(dashboard)/patients/page.tsx
git commit -m "fix: confirm dialogs before reminder cancel and patient delete"
```

---

## Task 6: Frontend — Broadcast Session Warning + Template Mapper Validation

**Files:**
- Modify: `frontend/app/(dashboard)/broadcasts/page.tsx`
- Modify: `frontend/app/(dashboard)/settings/page.tsx`

### Broadcast 24h session window warning

- [ ] **Step 1: Add callout to `broadcasts/page.tsx`**

Add this block inside the compose `<form>`, right before the `<textarea>` block (between filters and message):

```tsx
{/* 24h session window warning */}
<div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
  <span className="mt-0.5 shrink-0 text-amber-500">⚠️</span>
  <span>
    Free-text broadcasts only reach patients who have messaged your pharmacy number in the last 24 hours.
    To reach <strong>all</strong> opted-in patients at any time, use a pre-approved WhatsApp template
    (set up in <a href="/settings?tab=whatsapp" className="underline font-medium">Settings → WhatsApp &amp; Templates</a>).
  </span>
</div>
```

### Template mapper — unmapped variable warning

- [ ] **Step 2: Add validation warning to `TemplatePicker` in `settings/page.tsx`**

Inside the `TemplatePicker` component, find the `{placeholderCount > 0 && (` block. Add a warning when mapping is incomplete. Add this check just before the "Save mapping" button:

```tsx
{/* Warn if any slot is unmapped */}
{mapping.some((v, i) => i < placeholderCount && !v) || mapping.length < placeholderCount ? (
  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
    <span>⚠️</span>
    <span>Some variables are unmapped — reminders will send with blank fields.</span>
  </div>
) : null}
```

Place this block immediately before the "Save mapping" / "Mapping saved" button.

- [ ] **Step 3: Commit**

```bash
git add frontend/app/(dashboard)/broadcasts/page.tsx frontend/app/(dashboard)/settings/page.tsx
git commit -m "fix: broadcast 24h session warning, template mapper unmapped-slot validation"
```

---

## Task 7: Frontend — Load More Pagination on Patients and Reminders

**Files:**
- Modify: `frontend/app/(dashboard)/patients/page.tsx`
- Modify: `frontend/lib/api.ts` (add `total` to patients list response)
- Modify: `backend/src/routes/patients.ts` (return total count)

The backend already accepts `page` and `limit` query params. We just need the frontend to use them and the backend to return a `total` so we know when to stop.

### Backend: return total count

- [ ] **Step 1: Update `GET /patients` to return `total`**

In `backend/src/routes/patients.ts`, after building the query, run a count query then return total:

```typescript
// After building `query` and before `pool.query(query, params)`, add a count query:
// Build a count version of the same query (without LIMIT/OFFSET and without the GROUP BY / ORDER)
let countQuery = `
  SELECT COUNT(DISTINCT p.id) AS total
  FROM patients p
  LEFT JOIN patient_tag_map ptm ON ptm.patient_id = p.id
  LEFT JOIN patient_tags pt ON pt.id = ptm.tag_id
  WHERE p.pharmacy_id = $1 AND p.is_active = true`;
const countParams: unknown[] = [req.pharmacyId];
if (search) {
  countParams.push(`%${search}%`);
  countQuery += ` AND (p.name ILIKE $${countParams.length} OR p.phone ILIKE $${countParams.length})`;
}
if (filter === 'active') {
  countQuery += ` AND p.id IN (SELECT DISTINCT patient_id FROM purchases WHERE purchased_at > NOW() - INTERVAL '60 days' AND pharmacy_id = $1)`;
} else if (filter === 'inactive') {
  countQuery += ` AND p.id NOT IN (SELECT DISTINCT patient_id FROM purchases WHERE purchased_at > NOW() - INTERVAL '60 days' AND pharmacy_id = $1)`;
}

const [result, countResult] = await Promise.all([
  pool.query(query, params),
  pool.query(countQuery, countParams),
]);
const total = parseInt(countResult.rows[0]?.total ?? '0', 10);
res.json({ success: true, patients: result.rows, total, page: Number(page), limit: Number(limit) });
```

### Frontend: add Load More

- [ ] **Step 2: Add Load More to `patients/page.tsx`**

Add state for pagination and a `hasMore` flag, update `fetchPatients` to support page, and add a Load More button:

```typescript
// Add state
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(false);

// Update fetchPatients signature and body
const fetchPatients = async (q?: string, filter?: 'all' | 'active' | 'inactive', pageNum = 1) => {
  if (pageNum === 1) setLoading(true);
  try {
    const f = filter ?? activeFilter;
    const { patients: rows, total } = await api.patients.list(q, f !== 'all' ? f : undefined, pageNum);
    if (pageNum === 1) {
      setPatients(rows);
    } else {
      setPatients(prev => [...prev, ...rows]);
    }
    setHasMore(patients.length + rows.length < total);
    setPage(pageNum);
  } catch {
  } finally {
    setLoading(false);
  }
};

// Load More button at the bottom of the patient list:
{hasMore && (
  <div className="py-4 text-center">
    <button
      onClick={() => fetchPatients(search || undefined, activeFilter, page + 1)}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50"
    >
      {loading ? 'Loading…' : 'Load more'}
    </button>
  </div>
)}
```

- [ ] **Step 3: Update `api.patients.list` signature in `frontend/lib/api.ts`**

```typescript
list: (search?: string, filter?: string, page = 1) =>
  request<{ patients: Patient[]; total: number; page: number; limit: number }>(
    `/patients${buildQuery({ search, filter, page: String(page) })}`
  ),
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/routes/patients.ts frontend/app/(dashboard)/patients/page.tsx frontend/lib/api.ts
git commit -m "feat: patients load-more pagination (50 per page)"
```

---

## Task 8: Frontend — Settings Cleanup (Team / Billing Tabs)

**Files:**
- Modify: `frontend/app/(dashboard)/settings/page.tsx`

The "Team" and "Billing" tabs currently show `<ComingSoon>` with no context. Replace with informative placeholder cards that describe what's coming and set expectations.

- [ ] **Step 1: Replace `<ComingSoon>` renders in `SettingsContent`**

Find the `{activeTab === 'team' && <ComingSoon ...>}` and billing blocks and replace:

```tsx
{activeTab === 'team' && (
  <div className="bg-white rounded-xl border border-zinc-200 p-8">
    <h2 className="text-sm font-semibold text-zinc-900 mb-1">Team Members</h2>
    <p className="text-sm text-zinc-400 mb-4">
      Invite staff to access this pharmacy&apos;s dashboard. Set roles: Admin can manage settings; Staff can add patients and record sales only.
    </p>
    <span className="inline-block text-xs bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded-full">
      Coming in a future update
    </span>
  </div>
)}
{activeTab === 'billing' && (
  <div className="bg-white rounded-xl border border-zinc-200 p-8">
    <h2 className="text-sm font-semibold text-zinc-900 mb-1">Plan &amp; Billing</h2>
    <p className="text-sm text-zinc-400 mb-3">
      You are on the <strong className="text-zinc-700">Starter</strong> plan. Upgrade to Pro for higher message volumes and advanced analytics.
    </p>
    <p className="text-xs text-zinc-400 mb-4">
      To upgrade or manage payment, contact us at <span className="font-medium text-zinc-600">support@easibill.in</span>.
    </p>
    <span className="inline-block text-xs bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded-full">
      Self-serve billing coming soon
    </span>
  </div>
)}
```

Also remove the `ComingSoon` component definition from the file (it's no longer used).

- [ ] **Step 2: Commit**

```bash
git add frontend/app/(dashboard)/settings/page.tsx
git commit -m "fix: replace ComingSoon stubs with informative Team and Billing placeholder cards"
```

---

## Summary — Issues Addressed

| # | Review Item | Task |
|---|-------------|------|
| BUG-4 | Timezone bug in cronScheduler | Task 1 |
| BUG-3 | Broadcast tag filter wrong table | Task 1 |
| BUG-1 | Broadcasts bypass BullMQ | Task 2 |
| BUG-2 | Sale confirmation bypass BullMQ | Task 3 |
| DRIFT-3 | Dead broadcast_campaigns table | Task 1 (migration) |
| Cleanup | message_logs.channel constraint | Task 1 (migration) |
| UI-3 | Dashboard silent error swallowing | Task 4 |
| UI-2 | Dashboard data goes stale | Task 4 |
| UI-6 | No confirm before delete/cancel | Task 5 |
| UI-7/PM-4 | Broadcast free-text warning | Task 6 |
| UI-10 | Template mapper unmapped variable | Task 6 |
| UI-1 | No pagination on patient list | Task 7 |
| UI-9 | Team/Billing stub cards | Task 8 |

**Not in plan (require product/business decisions):**
- Baileys Starter plan (pricing model decision — DRIFT-1)
- messageService.ts abstraction (DRIFT-2 — safe to defer, no bug)
- Billing/Razorpay integration (PM-1 — separate large feature)
- Onboarding step completion (PM-2 — separate feature)
- SMTP password reset testing (PM-5 — configuration verification)
- Reminders pagination (similar to Task 7 — extend the same pattern)
