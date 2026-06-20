# Broadcast Scheduling — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow pharmacy owners to schedule a broadcast to send at a future date/time instead of immediately.

**Architecture:** DB migration adds `status` + `scheduled_at` columns. POST `/broadcasts` gains an optional `scheduled_at` param. A new DELETE `/broadcasts/:id` handles cancellation. A new per-minute cron atomically transitions `scheduled → queued` and dispatches per-patient BullMQ jobs. The frontend compose form gains a "Send now / Schedule" toggle; the history list gains status badges and a cancel button.

**Reviewed and approved by PM, Designer, CTO (2026-06-19).**

---

## File Map

| File | Action |
|------|--------|
| `backend/src/db/migrations/017_broadcast_scheduling.sql` | Create |
| `backend/src/db/migrate.ts` | Modify — add migration to list |
| `backend/src/jobs/scheduledBroadcastDispatcher.ts` | Create — minute cron |
| `backend/src/app.ts` | Modify — start dispatcher on boot |
| `backend/src/routes/broadcasts.ts` | Modify — accept `scheduled_at`, add DELETE route |
| `frontend/lib/api.ts` | Modify — add `status`+`scheduled_at` to `Broadcast`; extend `broadcasts.send`; add `broadcasts.cancel` |
| `frontend/app/(dashboard)/broadcasts/page.tsx` | Modify — schedule toggle, datetime input, status badges, cancel button |

---

## Task 1: DB Migration

**Files:**
- Create: `backend/src/db/migrations/017_broadcast_scheduling.sql`
- Modify: `backend/src/db/migrate.ts`

- [ ] **Step 1: Create migration file**

```sql
-- 017_broadcast_scheduling.sql
ALTER TABLE broadcasts
  ADD COLUMN IF NOT EXISTS status       TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running','scheduled','queued','cancelled')),
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS broadcasts_status_scheduled_at_idx
  ON broadcasts(status, scheduled_at)
  WHERE status = 'scheduled';
```

- [ ] **Step 2: Add to migrate.ts**

Open `backend/src/db/migrate.ts`. Find the migrations array and append `'017_broadcast_scheduling.sql'`.

- [ ] **Step 3: Commit**

```bash
git add backend/src/db/migrations/017_broadcast_scheduling.sql backend/src/db/migrate.ts
git commit -m "feat(broadcast-scheduling): migration — add status + scheduled_at columns"
```

---

## Task 2: Scheduled Broadcast Dispatcher (cron)

**Files:**
- Create: `backend/src/jobs/scheduledBroadcastDispatcher.ts`

Runs every minute. Atomically transitions up to 5 `scheduled` broadcasts to `queued`, fetches patients, updates `recipient_count`, fans out into `broadcastQueue`, then sets each to `running`.

- [ ] **Step 1: Create the file**

```typescript
import cron from 'node-cron';
import { pool } from '../db/pool';
import { broadcastQueue } from './broadcastWorker';

export function startScheduledBroadcastDispatcher(): void {
  cron.schedule('* * * * *', async () => {
    let rows: any[];
    try {
      const result = await pool.query<{
        id: string;
        pharmacy_id: string;
        message_body: string;
        filter_tag_id: string | null;
        filter_language: string | null;
        template_id: string | null;
        template_params: string[] | null;
      }>(
        `UPDATE broadcasts
            SET status = 'queued'
          WHERE status = 'scheduled'
            AND scheduled_at <= NOW()
          LIMIT 5
          RETURNING id, pharmacy_id, message_body, filter_tag_id, filter_language,
                    template_id, template_params`
      );
      rows = result.rows;
    } catch (err) {
      console.error('[scheduledBroadcastDispatcher] DB error picking up scheduled broadcasts:', err);
      return;
    }

    for (const broadcast of rows) {
      try {
        // Fetch pharmacy name
        const pharmResult = await pool.query<{ name: string; owner_name: string }>(
          `SELECT name, owner_name FROM pharmacies WHERE id = $1`,
          [broadcast.pharmacy_id]
        );
        if (!pharmResult.rows[0]) {
          console.error(`[scheduledBroadcastDispatcher] pharmacy not found for broadcast ${broadcast.id}`);
          await pool.query(`UPDATE broadcasts SET status = 'failed' WHERE id = $1`, [broadcast.id]);
          continue;
        }
        const { name: pharmacyName, owner_name: pharmacyOwnerName } = pharmResult.rows[0];

        // Fetch opted-in patients
        let patientQuery = `
          SELECT DISTINCT ON (p.id)
                 p.id, p.name, COALESCE(p.whatsapp_phone, p.phone) AS dest,
                 COALESCE(ph.owner_name, '') AS pharmacy_owner_name,
                 COALESCE(TO_CHAR(p.last_visit_at AT TIME ZONE 'Asia/Kolkata', 'DD Mon YYYY'), '') AS last_visit_date
            FROM patients p
            JOIN pharmacies ph ON ph.id = p.pharmacy_id
           WHERE p.pharmacy_id = $1
             AND p.opted_in = true
             AND p.is_active = true`;
        const params: any[] = [broadcast.pharmacy_id];
        if (broadcast.filter_tag_id) {
          params.push(broadcast.filter_tag_id);
          patientQuery += ` AND EXISTS (SELECT 1 FROM patient_tags pt WHERE pt.patient_id = p.id AND pt.tag_id = $${params.length})`;
        }
        if (broadcast.filter_language) {
          params.push(broadcast.filter_language);
          patientQuery += ` AND p.language = $${params.length}`;
        }
        const patients = await pool.query(patientQuery, params);

        const recipientCount = patients.rows.length;
        await pool.query(
          `UPDATE broadcasts SET recipient_count = $1 WHERE id = $2`,
          [recipientCount, broadcast.id]
        );

        if (recipientCount === 0) {
          await pool.query(`UPDATE broadcasts SET status = 'running' WHERE id = $1`, [broadcast.id]);
          continue;
        }

        const jobs = patients.rows.map((p: any) => ({
          name: 'send-broadcast',
          data: {
            broadcastId: broadcast.id,
            pharmacyId:  broadcast.pharmacy_id,
            pharmacyName,
            patientId:   p.id,
            patientName: p.name,
            patientPhone: p.dest,
            message:     broadcast.message_body,
            templateId:  broadcast.template_id ?? undefined,
            templateParams: broadcast.template_params ?? undefined,
          },
          opts: { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
        }));

        await broadcastQueue.addBulk(jobs);
        await pool.query(`UPDATE broadcasts SET status = 'running' WHERE id = $1`, [broadcast.id]);
        console.log(`[scheduledBroadcastDispatcher] dispatched broadcast ${broadcast.id} to ${recipientCount} patients`);
      } catch (err) {
        console.error(`[scheduledBroadcastDispatcher] error dispatching broadcast ${broadcast.id}:`, err);
        await pool.query(
          `UPDATE broadcasts SET status = 'scheduled' WHERE id = $1 AND status = 'queued'`,
          [broadcast.id]
        );
      }
    }
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/jobs/scheduledBroadcastDispatcher.ts
git commit -m "feat(broadcast-scheduling): scheduled broadcast cron dispatcher"
```

---

## Task 3: Start dispatcher in app.ts

**Files:**
- Modify: `backend/src/app.ts`

- [ ] **Step 1: Import and start the dispatcher**

Open `backend/src/app.ts`. Find the section where `startReminderWorker`, `startBroadcastWorker`, etc. are called (likely near the end of the file). Add:

```typescript
import { startScheduledBroadcastDispatcher } from './jobs/scheduledBroadcastDispatcher';
```

And in the startup block:
```typescript
startScheduledBroadcastDispatcher();
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/app.ts
git commit -m "feat(broadcast-scheduling): start scheduled broadcast dispatcher on boot"
```

---

## Task 4: Extend broadcasts route

**Files:**
- Modify: `backend/src/routes/broadcasts.ts`

### Step 1: Accept `scheduled_at` in POST and add backend validation

Find the POST body destructure (around line 28):
```typescript
const { message, filter_tag_id, filter_language, template_id, template_params } = req.body as {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
  template_id?: string;
  template_params?: string[];
};
```
Replace with:
```typescript
const { message, filter_tag_id, filter_language, template_id, template_params, scheduled_at } = req.body as {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
  template_id?: string;
  template_params?: string[];
  scheduled_at?: string;
};
```

After the existing message validation block, add:
```typescript
let scheduledAtDate: Date | null = null;
if (scheduled_at) {
  scheduledAtDate = new Date(scheduled_at);
  if (isNaN(scheduledAtDate.getTime())) {
    return res.status(422).json({ success: false, error: 'scheduled_at is not a valid ISO date', code: 'VALIDATION_ERROR' });
  }
  const now = Date.now();
  if (scheduledAtDate.getTime() < now - 60_000) {
    return res.status(422).json({ success: false, error: 'scheduled_at cannot be more than 60 seconds in the past', code: 'VALIDATION_ERROR' });
  }
  if (scheduledAtDate.getTime() > now + 90 * 24 * 3600_000) {
    return res.status(422).json({ success: false, error: 'scheduled_at cannot be more than 90 days in the future', code: 'VALIDATION_ERROR' });
  }
}
```

### Step 2: Branch INSERT on scheduled vs immediate

Find the INSERT into `broadcasts` (it sets `recipient_count`, `message_body`, etc.). Replace the single INSERT + immediate fan-out with a conditional:

```typescript
if (scheduledAtDate) {
  // Scheduled path — save only, no fan-out
  const { rows } = await pool.query(
    `INSERT INTO broadcasts (pharmacy_id, message_body, filter_tag_id, filter_language, recipient_count, sent_count, failed_count, status, scheduled_at, template_id, template_params)
     VALUES ($1, $2, $3, $4, 0, 0, 0, 'scheduled', $5, $6, $7)
     RETURNING id`,
    [req.pharmacyId, message.trim(), filter_tag_id || null, filter_language || null,
     scheduledAtDate.toISOString(), template_id || null, template_params || null]
  );
  const broadcastId = rows[0].id;
  const formattedTime = scheduledAtDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  return res.status(201).json({
    success: true,
    broadcastId,
    recipientCount: 0,
    message: `Broadcast scheduled for ${formattedTime} IST`,
  });
}
// Immediate path — existing logic below (unchanged)
```

### Step 3: Add explicit `status = 'running'` to the immediate INSERT

Find the existing INSERT (for immediate sends) and add `status = 'running'` to the column list and `'running'` to the VALUES. Also add `template_id` and `template_params` if not already present.

### Step 4: Add DELETE /broadcasts/:id route

At the end of the router (before `export default router`):

```typescript
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE broadcasts SET status = 'cancelled', recipient_count = 0
        WHERE id = $1 AND pharmacy_id = $2 AND status = 'scheduled'
        RETURNING id`,
      [id, req.pharmacyId]
    );
    if (result.rowCount && result.rowCount > 0) {
      return res.json({ success: true });
    }
    // Check why no row was updated
    const existing = await pool.query(
      `SELECT status FROM broadcasts WHERE id = $1 AND pharmacy_id = $2`,
      [id, req.pharmacyId]
    );
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, error: 'Broadcast not found', code: 'NOT_FOUND' });
    }
    const { status } = existing.rows[0];
    if (status === 'queued' || status === 'running') {
      return res.status(409).json({ success: false, error: 'Broadcast is already being sent and cannot be cancelled', code: 'CONFLICT' });
    }
    return res.status(409).json({ success: false, error: `Broadcast cannot be cancelled (status: ${status})`, code: 'CONFLICT' });
  } catch (err) { next(err); }
});
```

### Step 5: Add `status` + `scheduled_at` to GET /broadcasts SELECT

Find the SELECT in the GET `/broadcasts` handler. Add `status, scheduled_at` to the SELECT column list and to the ORDER BY if needed.

- [ ] **Step 6: TypeScript check**

```bash
cd backend && npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add backend/src/routes/broadcasts.ts
git commit -m "feat(broadcast-scheduling): POST accepts scheduled_at, DELETE cancels, GET returns status"
```

---

## Task 5: Frontend — API types

**Files:**
- Modify: `frontend/lib/api.ts`

- [ ] **Step 1: Extend Broadcast interface**

Find the `Broadcast` interface/type. Add:
```typescript
status: 'running' | 'scheduled' | 'queued' | 'cancelled';
scheduled_at: string | null;
template_id?: string | null;
template_params?: string[] | null;
```

- [ ] **Step 2: Extend broadcasts.send body type**

Find `broadcasts.send`. Add `scheduled_at?: string` to the body type.

- [ ] **Step 3: Add broadcasts.cancel**

In the `broadcasts` object, add:
```typescript
cancel: (id: string) =>
  request<{ success: true }>(`/broadcasts/${id}`, { method: 'DELETE' }),
```

- [ ] **Step 4: TypeScript check**

```bash
cd frontend && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/api.ts
git commit -m "feat(broadcast-scheduling): extend Broadcast type, add cancel method"
```

---

## Task 6: Frontend — Broadcasts page UI

**Files:**
- Modify: `frontend/app/(dashboard)/broadcasts/page.tsx`

This task adds: schedule toggle, datetime input, schedule validation, optimistic history row, status badges, cancel button.

### Step 1: Add state for send mode and scheduled time

In the `BroadcastsPage` component, add:
```typescript
const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now');
const [scheduledAt, setScheduledAt] = useState('');
const [scheduleError, setScheduleError] = useState('');
```

### Step 2: IST min helper

Add a helper above the component:
```typescript
function getISTMinString(): string {
  // Return YYYY-MM-DDTHH:MM in IST for datetime-local min attribute
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${ist.getFullYear()}-${pad(ist.getMonth() + 1)}-${pad(ist.getDate())}T${pad(ist.getHours())}:${pad(ist.getMinutes())}`;
}
```

### Step 3: IST construction helper

```typescript
function istInputToISO(value: string): string {
  // value is YYYY-MM-DDTHH:MM from datetime-local — treat as IST regardless of browser timezone
  return `${value}:00+05:30`;
}

function formatIST(isoString: string): string {
  return new Date(isoString).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
```

### Step 4: Add schedule toggle + datetime input to the form

Inside the form, after the mode toggle pills (freetext/template toggle), add:

```tsx
{/* Send mode toggle */}
<div className="flex gap-2">
  {(['now', 'schedule'] as const).map(m => (
    <button
      key={m}
      type="button"
      onClick={() => { setSendMode(m); setScheduleError(''); }}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        sendMode === m
          ? 'bg-zinc-900 text-white'
          : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
      )}
    >
      {m === 'now' ? 'Send now' : 'Schedule'}
    </button>
  ))}
</div>

{/* Schedule datetime input */}
{sendMode === 'schedule' && (
  <div>
    <label className="block text-xs font-medium text-zinc-600 mb-1">
      Send at <span className="text-zinc-400 font-normal">IST</span>
    </label>
    <input
      type="datetime-local"
      value={scheduledAt}
      min={getISTMinString()}
      onChange={e => { setScheduledAt(e.target.value); setScheduleError(''); }}
      className={cn(inputClass, scheduleError ? 'border-red-400 focus:ring-red-400' : '')}
      required={sendMode === 'schedule'}
    />
    {scheduleError && <p className="mt-1 text-xs text-red-500">{scheduleError}</p>}
    <p className="mt-1 text-xs text-zinc-400">All times in IST (India Standard Time)</p>
  </div>
)}
```

### Step 5: Update handleSend to support scheduled path

In `handleSend`, before calling `api.broadcasts.send(...)`:

```typescript
if (sendMode === 'schedule') {
  if (!scheduledAt) {
    setScheduleError('Please choose a date and time');
    setSending(false);
    return;
  }
  const isoStr = istInputToISO(scheduledAt);
  const chosen = new Date(isoStr);
  if (chosen.getTime() < Date.now() - 60_000) {
    setScheduleError('Please choose a future date and time');
    setSending(false);
    return;
  }
}
```

When building the API call, add `scheduled_at: sendMode === 'schedule' ? istInputToISO(scheduledAt) : undefined`.

After success for a scheduled send:
- Do NOT call `setPollingId(...)` 
- Add optimistic row with `status: 'scheduled'` and `scheduled_at: istInputToISO(scheduledAt)`
- Reset `scheduledAt` and `setSendMode('now')`

### Step 6: Update BroadcastRow to show status badges and cancel button

Modify `BroadcastRow` to accept `onCancel?: (id: string) => void`:

```tsx
function BroadcastRow({ b, onCancel }: { b: Broadcast; onCancel?: (id: string) => void }) {
```

Inside the row, replace the sent/failed counts section with a conditional:

```tsx
{/* Right side — status-dependent */}
<div className="shrink-0 text-right">
  {b.status === 'scheduled' && b.scheduled_at && (
    <div className="flex items-center gap-2">
      <span className="text-xs text-amber-600 flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        Scheduled for {formatIST(b.scheduled_at)}
      </span>
      {onCancel && (
        <button
          type="button"
          onClick={() => onCancel(b.id)}
          className="text-zinc-400 hover:text-red-500 transition-colors"
          aria-label="Cancel scheduled broadcast"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )}
  {b.status === 'queued' && (
    <span className="text-xs text-zinc-500 flex items-center gap-1">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Sending…
    </span>
  )}
  {(b.status === 'running' || !b.status) && (
    <div className="flex items-center gap-2 text-xs">
      <span className="flex items-center gap-1 text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" /> {b.sent_count}
      </span>
      {b.failed_count > 0 && (
        <span className="flex items-center gap-1 text-red-500">
          <XCircle className="h-3.5 w-3.5" /> {b.failed_count}
        </span>
      )}
    </div>
  )}
  {b.status === 'cancelled' && (
    <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">Cancelled</span>
  )}
  {(b.status === 'running' || !b.status) && (
    <p className="text-xs text-zinc-400 mt-0.5">{b.recipient_count} recipient{b.recipient_count !== 1 ? 's' : ''}</p>
  )}
</div>
```

### Step 7: Add handleCancel in BroadcastsPage

```typescript
const handleCancel = async (id: string) => {
  try {
    await api.broadcasts.cancel(id);
    setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const, recipient_count: 0 } : b));
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      toast.error('Broadcast is already being sent and cannot be cancelled');
    } else {
      toast.error('Failed to cancel broadcast');
    }
  }
};
```

Pass to BroadcastRow: `<BroadcastRow key={b.id} b={b} onCancel={handleCancel} />`

### Step 8: Add Clock, X to lucide imports

Ensure `Clock` and `X` are imported from `lucide-react`.

- [ ] **Step 9: TypeScript check**

```bash
cd frontend && npx tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add "frontend/app/(dashboard)/broadcasts/page.tsx"
git commit -m "feat(broadcast-scheduling): schedule toggle, datetime input, status badges, cancel button"
```

---

## Task 7: Backend TypeScript check

- [ ] **Step 1:**

```bash
cd backend && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Commit fix if needed**

```bash
git add -A backend/src/
git commit -m "fix(broadcast-scheduling): post-TS-check fixes"
```

Only run if Step 1 produced errors.

---

## Self-Review

| Spec requirement | Task |
|-----------------|------|
| DB migration: status + scheduled_at columns + partial index | Task 1 |
| POST accepts scheduled_at, validates past/future | Task 4 |
| Scheduled INSERT: status=scheduled, recipient_count=0 | Task 4 |
| No immediate fan-out for scheduled broadcasts | Task 4 |
| GET returns status + scheduled_at | Task 4 |
| DELETE route: cancels if scheduled, 409 if queued/running | Task 4 |
| Cron: atomic status=queued transition, LIMIT 5 | Task 2 |
| Cron: fetch patients at dispatch, update recipient_count | Task 2 |
| Cron: rollback to scheduled on error | Task 2 |
| Frontend: Send now / Schedule toggle | Task 6 |
| Frontend: datetime-local with IST min attribute | Task 6 |
| Frontend: IST construction via +05:30 append | Task 6 |
| Frontend: inline error for past time | Task 6 |
| Frontend: no polling for scheduled path | Task 6 |
| History: scheduled badge (clock, amber) | Task 6 |
| History: queued (spinner + "Sending…") | Task 6 |
| History: cancelled badge (zinc, no counts) | Task 6 |
| History: cancel button, confirm, 409 toast | Task 6 |
| ApiError.status for 409 detection | Task 5 |
