# Broadcast Quick Segments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tag/language broadcast filter dropdowns with 4 mutually-exclusive segment chips (All Patients, Active Buyers, Lapsed Buyers, Recent Visitors) that give live audience counts and pass a `segment_include` JSONB field to the backend.

**Architecture:** A shared `segmentUtils.ts` utility builds the parameterized SQL WHERE fragment for both the new `GET /broadcasts/audience-preview` endpoint and the existing `POST /broadcasts` send path. The `scheduledBroadcastDispatcher` is updated to branch on `segment_include` vs legacy `filter_tag_id`/`filter_language`. The frontend page replaces the two dropdowns with chip buttons + a debounced count fetch hook.

**Tech Stack:** Node.js/TypeScript, Express, pg (PostgreSQL), Jest + supertest (backend tests), Next.js 14, Tailwind CSS, React hooks.

## Global Constraints

- All segment SQL values are passed as query parameters — zero string interpolation into SQL.
- `filter_tag_id` and `filter_language` DB columns are kept permanently; old scheduled broadcasts continue to work.
- Segment value must be an integer 1–365; type must be one of: `all`, `last_purchased_within_days`, `not_purchased_within_days`, `active_within_days`.
- `not_purchased_within_days` excludes patients with zero purchase history (only returns patients who once bought but stopped).
- All patient queries always include `AND p.is_active = true AND p.opted_in = true`.
- Frontend debounce: 0 ms on chip click, 400 ms on number input change.
- Run backend tests with: `cd backend && npm test` (uses `DATABASE_URL_TEST`).
- Run migration with: `cd backend && npm run migrate` (or `ts-node src/db/migrate.ts`).

---

## File Map

| File | Action | What it does |
|------|--------|-------------|
| `backend/src/db/migrations/018_segment_targeting.sql` | **Create** | Adds `segment_include JSONB` column + `patients_pharmacy_last_visit_idx` index |
| `backend/src/utils/segmentUtils.ts` | **Create** | `SegmentType`, `SegmentInclude`, `buildSegmentClause()` shared utility |
| `backend/src/routes/broadcasts.ts` | **Modify** | Add `GET /audience-preview`; update `POST /` to accept + store `segment_include` |
| `backend/src/jobs/scheduledBroadcastDispatcher.ts` | **Modify** | Add `segment_include` to RETURNING clause; branch on segment vs legacy |
| `backend/tests/broadcasts.test.ts` | **Create** | Tests for `audience-preview` endpoint and `POST /broadcasts` with `segment_include` |
| `frontend/lib/api.ts` | **Modify** | Add `SegmentType`, `SegmentInclude` types; add `audiencePreview`; update `send` signature; update `Broadcast` interface |
| `frontend/app/(dashboard)/broadcasts/page.tsx` | **Modify** | Replace dropdowns with segment chips + debounced count fetch |

---

## Task 1: DB Migration

**Files:**
- Create: `backend/src/db/migrations/018_segment_targeting.sql`
- Modify: `backend/src/db/migrate.ts` (add filename to list)

**Interfaces:**
- Produces: `broadcasts.segment_include JSONB` column; `patients_pharmacy_last_visit_idx` index

- [ ] **Step 1: Create the migration file**

`backend/src/db/migrations/018_segment_targeting.sql`:
```sql
-- 018_segment_targeting.sql
ALTER TABLE broadcasts ADD COLUMN IF NOT EXISTS segment_include JSONB;

-- Covers AND p.last_visit_at >= NOW() - ($2 * INTERVAL '1 day') in active_within_days queries
CREATE INDEX IF NOT EXISTS patients_pharmacy_last_visit_idx
  ON patients(pharmacy_id, last_visit_at DESC NULLS LAST);
```

- [ ] **Step 2: Register migration in migrate.ts**

Open `backend/src/db/migrate.ts`. Find the array of migration filenames (looks like `['001_initial.sql', ..., '017_broadcast_scheduling.sql']`). Add `'018_segment_targeting.sql'` at the end of that array.

- [ ] **Step 3: Run migration against dev DB**

```bash
cd backend && npm run migrate
```

Expected output: no error, and the line `018_segment_targeting.sql` appears in migration log output.

- [ ] **Step 4: Verify column exists**

```bash
cd backend && ts-node -e "
  import dotenv from 'dotenv'; dotenv.config();
  import { pool } from './src/db/pool';
  pool.query(\"SELECT column_name FROM information_schema.columns WHERE table_name='broadcasts' AND column_name='segment_include'\")
    .then(r => { console.log(r.rows); pool.end(); });
"
```

Expected: `[ { column_name: 'segment_include' } ]`

- [ ] **Step 5: Run migration against test DB**

```bash
cd backend && cross-env NODE_ENV=test ts-node src/db/migrate.ts
```

Expected: same success output.

- [ ] **Step 6: Commit**

```bash
cd backend && git add src/db/migrations/018_segment_targeting.sql src/db/migrate.ts
git commit -m "feat(db): add segment_include JSONB column to broadcasts + last_visit_at index"
```

---

## Task 2: Shared Segment Utility

**Files:**
- Create: `backend/src/utils/segmentUtils.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type SegmentType = 'all' | 'last_purchased_within_days' | 'not_purchased_within_days' | 'active_within_days';
  export interface SegmentInclude { type: SegmentType; value?: number; }
  export function buildSegmentClause(segment: SegmentInclude | null, params: unknown[]): string
  ```
  `buildSegmentClause` **mutates** `params` (pushes the integer value) and returns a SQL fragment string to append to the WHERE clause. Returns `''` for `null` or `type === 'all'`.

- [ ] **Step 1: Create `segmentUtils.ts`**

`backend/src/utils/segmentUtils.ts`:
```typescript
export type SegmentType =
  | 'all'
  | 'last_purchased_within_days'
  | 'not_purchased_within_days'
  | 'active_within_days';

export interface SegmentInclude {
  type: SegmentType;
  value?: number;
}

/**
 * Appends a segment-specific WHERE fragment to the SQL query.
 * Mutates `params` by pushing the integer segment value.
 * Returns the SQL fragment (empty string for 'all' / null).
 *
 * Caller must already have `params[0] = pharmacyId` ($1).
 * The pushed value becomes $<params.length> after the push.
 */
export function buildSegmentClause(
  segment: SegmentInclude | null,
  params: unknown[],
): string {
  if (!segment || segment.type === 'all') return '';

  params.push(Number(segment.value));
  const p = params.length; // e.g. 2

  switch (segment.type) {
    case 'last_purchased_within_days':
      return `
        AND EXISTS (
          SELECT 1 FROM purchases
          WHERE patient_id = p.id AND pharmacy_id = $1
            AND purchased_at >= NOW() - ($${p} * INTERVAL '1 day')
        )`;

    case 'not_purchased_within_days':
      // Requires at least one purchase ever — patients with zero purchase history are excluded.
      return `
        AND EXISTS (
          SELECT 1 FROM purchases
          WHERE patient_id = p.id AND pharmacy_id = $1
        )
        AND NOT EXISTS (
          SELECT 1 FROM purchases
          WHERE patient_id = p.id AND pharmacy_id = $1
            AND purchased_at >= NOW() - ($${p} * INTERVAL '1 day')
        )`;

    case 'active_within_days':
      return `
        AND p.last_visit_at >= NOW() - ($${p} * INTERVAL '1 day')`;

    default:
      return '';
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd backend && git add src/utils/segmentUtils.ts
git commit -m "feat(backend): add segmentUtils — SegmentInclude type + buildSegmentClause helper"
```

---

## Task 3: Backend — `GET /broadcasts/audience-preview` + Update `POST /broadcasts`

**Files:**
- Modify: `backend/src/routes/broadcasts.ts`

**Interfaces:**
- Consumes: `buildSegmentClause` from `../utils/segmentUtils`
- Produces:
  - `GET /api/v1/broadcasts/audience-preview?type=<SegmentType>&value=<int>` → `{ success: true, count: number }`
  - `POST /api/v1/broadcasts` now also accepts body field `segment_include: SegmentInclude`

- [ ] **Step 1: Add import at top of `broadcasts.ts`**

At the top of `backend/src/routes/broadcasts.ts`, add:
```typescript
import { SegmentType, SegmentInclude, buildSegmentClause } from '../utils/segmentUtils';
```

- [ ] **Step 2: Add validation constants after the import block**

After the imports, before `function interpolate`, add:
```typescript
const VALID_SEGMENT_TYPES: SegmentType[] = [
  'all',
  'last_purchased_within_days',
  'not_purchased_within_days',
  'active_within_days',
];

function parseSegment(type: unknown, value: unknown): SegmentInclude | null {
  if (!type || !VALID_SEGMENT_TYPES.includes(type as SegmentType)) return null;
  const t = type as SegmentType;
  if (t === 'all') return { type: 'all' };
  const v = Number(value);
  if (!Number.isInteger(v) || v < 1 || v > 365) return null;
  return { type: t, value: v };
}
```

- [ ] **Step 3: Add `GET /audience-preview` route**

Add this route BEFORE `router.get('/', ...)` (the list endpoint) — Express matches routes in order:
```typescript
// GET /broadcasts/audience-preview — count opted-in patients matching a segment
router.get('/audience-preview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, value } = req.query as Record<string, string | undefined>;

    if (!type || !VALID_SEGMENT_TYPES.includes(type as SegmentType)) {
      return res.status(400).json({
        success: false,
        error: `type must be one of: ${VALID_SEGMENT_TYPES.join(', ')}`,
        code: 'VALIDATION_ERROR',
      });
    }

    if (type !== 'all') {
      const v = Number(value);
      if (!Number.isInteger(v) || v < 1 || v > 365) {
        return res.status(400).json({
          success: false,
          error: 'value must be an integer between 1 and 365',
          code: 'VALIDATION_ERROR',
        });
      }
    }

    const segment: SegmentInclude = type === 'all'
      ? { type: 'all' }
      : { type: type as SegmentType, value: Number(value) };

    const params: unknown[] = [req.pharmacyId];
    const segmentClause = buildSegmentClause(segment, params);

    const result = await pool.query(
      `SELECT COUNT(*) AS count
       FROM patients p
       WHERE p.pharmacy_id = $1
         AND p.is_active = true
         AND p.opted_in = true
         ${segmentClause}`,
      params,
    );

    res.json({ success: true, count: Number(result.rows[0].count) });
  } catch (err) { next(err); }
});
```

- [ ] **Step 4: Update `POST /broadcasts` to accept and store `segment_include`**

In the existing `router.post('/', ...)` handler, update the destructuring at the top:
```typescript
// BEFORE
const { message, filter_tag_id, filter_language, template_id, template_params, scheduled_at } = req.body as {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
  template_id?: string;
  template_params?: string[];
  scheduled_at?: string;
};

// AFTER
const { message, filter_tag_id, filter_language, segment_include, template_id, template_params, scheduled_at } = req.body as {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
  segment_include?: SegmentInclude;
  template_id?: string;
  template_params?: string[];
  scheduled_at?: string;
};
```

- [ ] **Step 5: Update the scheduled INSERT in `POST /broadcasts`**

Find the `INSERT INTO broadcasts` for the scheduled path (~line 100). Replace:
```typescript
// BEFORE
const { rows } = await pool.query(
  `INSERT INTO broadcasts (pharmacy_id, message_body, filter_tag_id, filter_language, recipient_count, sent_count, failed_count, status, scheduled_at)
   VALUES ($1, $2, $3, $4, 0, 0, 0, 'scheduled', $5)
   RETURNING id`,
  [req.pharmacyId, message.trim(), filter_tag_id || null, filter_language || null,
   scheduledAtDate.toISOString()]
);

// AFTER
const { rows } = await pool.query(
  `INSERT INTO broadcasts (pharmacy_id, message_body, segment_include, filter_tag_id, filter_language, recipient_count, sent_count, failed_count, status, scheduled_at)
   VALUES ($1, $2, $3, $4, $5, 0, 0, 0, 'scheduled', $6)
   RETURNING id`,
  [req.pharmacyId, message.trim(), segment_include ? JSON.stringify(segment_include) : null,
   filter_tag_id || null, filter_language || null, scheduledAtDate.toISOString()]
);
```

- [ ] **Step 6: Update the recipient query in `POST /broadcasts`**

Find the section where `query` and `params` are built for the immediate-send recipient SELECT (~line 127). Replace the filter_tag_id/filter_language section:
```typescript
// BEFORE
const params: unknown[] = [req.pharmacyId];

if (filter_tag_id) {
  params.push(filter_tag_id);
  query += ` AND p.id IN (
    SELECT patient_id FROM patient_tag_map WHERE tag_id = $${params.length}
  )`;
}

if (filter_language) {
  params.push(filter_language);
  query += ` AND p.language = $${params.length}`;
}

// AFTER
const params: unknown[] = [req.pharmacyId];

if (segment_include) {
  query += buildSegmentClause(segment_include, params);
} else {
  if (filter_tag_id) {
    params.push(filter_tag_id);
    query += ` AND p.id IN (
      SELECT patient_id FROM patient_tag_map WHERE tag_id = $${params.length}
    )`;
  }
  if (filter_language) {
    params.push(filter_language);
    query += ` AND p.language = $${params.length}`;
  }
}
```

- [ ] **Step 7: Update the running INSERT in `POST /broadcasts`**

Find the `INSERT INTO broadcasts` for the immediate-send path (~line 173). Replace:
```typescript
// BEFORE
const broadcastResult = await pool.query(
  `INSERT INTO broadcasts (pharmacy_id, message_body, filter_tag_id, filter_language, recipient_count, sent_count, failed_count, status)
   VALUES ($1, $2, $3, $4, $5, 0, 0, 'running')
   RETURNING id`,
  [req.pharmacyId, message.trim(), filter_tag_id || null, filter_language || null, recipients.length]
);

// AFTER
const broadcastResult = await pool.query(
  `INSERT INTO broadcasts (pharmacy_id, message_body, segment_include, filter_tag_id, filter_language, recipient_count, sent_count, failed_count, status)
   VALUES ($1, $2, $3, $4, $5, $6, 0, 0, 'running')
   RETURNING id`,
  [req.pharmacyId, message.trim(), segment_include ? JSON.stringify(segment_include) : null,
   filter_tag_id || null, filter_language || null, recipients.length]
);
```

- [ ] **Step 8: Commit**

```bash
cd backend && git add src/routes/broadcasts.ts src/utils/segmentUtils.ts
git commit -m "feat(backend): add audience-preview endpoint; update POST /broadcasts to accept segment_include"
```

---

## Task 4: Backend Tests for `audience-preview` + `POST /broadcasts` with Segments

**Files:**
- Create: `backend/tests/broadcasts.test.ts`

**Interfaces:**
- Consumes: `app` from `../src/app`, `pool` from `../src/db/pool`, `createTestPharmacy` from `./helpers/auth`

- [ ] **Step 1: Create `backend/tests/broadcasts.test.ts`**

```typescript
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'job-1' }),
    addBulk: jest.fn().mockResolvedValue([]),
    on: jest.fn(),
  })),
  Worker: jest.fn().mockImplementation(() => ({ on: jest.fn() })),
}));

import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';
import { createTestPharmacy } from './helpers/auth';

let token: string;
let pharmacyId: string;
let patientWithPurchase: string;
let patientNoPurchase: string;
let patientRecentVisit: string;

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);

  const { pharmacy, token: t } = await createTestPharmacy({
    phone: '+919111000001',
    email: 'broadcasts@test.com',
  });
  token = t;
  pharmacyId = pharmacy.id;

  // Patient with a purchase 10 days ago (opted in)
  const p1 = await pool.query(
    `INSERT INTO patients (pharmacy_id, name, phone, opted_in, is_active, last_visit_at)
     VALUES ($1, 'Active Buyer', '+919200000001', true, true, NOW() - INTERVAL '10 days')
     RETURNING id`,
    [pharmacyId],
  );
  patientWithPurchase = p1.rows[0].id;
  await pool.query(
    `INSERT INTO purchases (pharmacy_id, patient_id, medicine_name, purchased_at, refill_interval_days)
     VALUES ($1, $2, 'Paracetamol', NOW() - INTERVAL '10 days', 30)`,
    [pharmacyId, patientWithPurchase],
  );

  // Patient with last purchase 90 days ago (lapsed)
  const p2 = await pool.query(
    `INSERT INTO patients (pharmacy_id, name, phone, opted_in, is_active, last_visit_at)
     VALUES ($1, 'Lapsed Buyer', '+919200000002', true, true, NOW() - INTERVAL '90 days')
     RETURNING id`,
    [pharmacyId],
  );
  const lapsedId = p2.rows[0].id;
  await pool.query(
    `INSERT INTO purchases (pharmacy_id, patient_id, medicine_name, purchased_at, refill_interval_days)
     VALUES ($1, $2, 'Aspirin', NOW() - INTERVAL '90 days', 30)`,
    [pharmacyId, lapsedId],
  );

  // Patient with no purchases but visited recently
  const p3 = await pool.query(
    `INSERT INTO patients (pharmacy_id, name, phone, opted_in, is_active, last_visit_at)
     VALUES ($1, 'Recent Visitor', '+919200000003', true, true, NOW() - INTERVAL '5 days')
     RETURNING id`,
    [pharmacyId],
  );
  patientRecentVisit = p3.rows[0].id;

  // Patient opted out — must never appear
  await pool.query(
    `INSERT INTO patients (pharmacy_id, name, phone, opted_in, is_active)
     VALUES ($1, 'Opted Out', '+919200000004', false, true)`,
    [pharmacyId],
  );
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.end();
});

// ── audience-preview ──────────────────────────────────────────────────────────

describe('GET /api/v1/broadcasts/audience-preview', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/broadcasts/audience-preview?type=all');
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid type', async () => {
    const res = await request(app)
      .get('/api/v1/broadcasts/audience-preview?type=invalid')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when value missing for non-all type', async () => {
    const res = await request(app)
      .get('/api/v1/broadcasts/audience-preview?type=last_purchased_within_days')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('returns 400 for value out of range', async () => {
    const res = await request(app)
      .get('/api/v1/broadcasts/audience-preview?type=last_purchased_within_days&value=366')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('type=all returns all opted-in active patients', async () => {
    const res = await request(app)
      .get('/api/v1/broadcasts/audience-preview?type=all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3); // active buyer + lapsed buyer + recent visitor
  });

  it('last_purchased_within_days=30 returns only patients who bought in last 30 days', async () => {
    const res = await request(app)
      .get('/api/v1/broadcasts/audience-preview?type=last_purchased_within_days&value=30')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1); // only the 10-day buyer
  });

  it('not_purchased_within_days=30 returns only patients with old purchases, excludes zero-purchase patients', async () => {
    const res = await request(app)
      .get('/api/v1/broadcasts/audience-preview?type=not_purchased_within_days&value=30')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1); // only the 90-day lapsed buyer (recent visitor has no purchases)
  });

  it('active_within_days=7 returns patients with last_visit_at in last 7 days', async () => {
    const res = await request(app)
      .get('/api/v1/broadcasts/audience-preview?type=active_within_days&value=7')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1); // only the 5-day recent visitor
  });
});

// ── POST /broadcasts with segment_include ────────────────────────────────────

describe('POST /api/v1/broadcasts with segment_include', () => {
  it('accepts segment_include and stores it', async () => {
    const res = await request(app)
      .post('/api/v1/broadcasts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Hello {{patient_name}} from test',
        segment_include: { type: 'last_purchased_within_days', value: 30 },
      });
    expect(res.status).toBe(202);
    expect(res.body.recipientCount).toBe(1);

    const dbRow = await pool.query(
      `SELECT segment_include FROM broadcasts WHERE id = $1`,
      [res.body.broadcastId],
    );
    expect(dbRow.rows[0].segment_include).toEqual({ type: 'last_purchased_within_days', value: 30 });
  });

  it('returns NO_RECIPIENTS when segment matches zero patients', async () => {
    const res = await request(app)
      .post('/api/v1/broadcasts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Nobody will receive this message',
        segment_include: { type: 'last_purchased_within_days', value: 1 }, // bought in last 1 day
      });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('NO_RECIPIENTS');
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd backend && npm test -- --testPathPattern=broadcasts
```

Expected: all tests pass. If they fail, fix the route implementation before moving on.

- [ ] **Step 3: Commit**

```bash
cd backend && git add tests/broadcasts.test.ts
git commit -m "test(backend): add audience-preview and POST segment_include tests"
```

---

## Task 5: Update `scheduledBroadcastDispatcher`

**Files:**
- Modify: `backend/src/jobs/scheduledBroadcastDispatcher.ts`

**Interfaces:**
- Consumes: `SegmentInclude`, `buildSegmentClause` from `../utils/segmentUtils`

- [ ] **Step 1: Add import to dispatcher**

At the top of `backend/src/jobs/scheduledBroadcastDispatcher.ts`, add:
```typescript
import { SegmentInclude, buildSegmentClause } from '../utils/segmentUtils';
```

- [ ] **Step 2: Update the RETURNING clause**

Find the UPDATE broadcasts query that picks up scheduled broadcasts. Change the RETURNING clause from:
```sql
RETURNING id, pharmacy_id, message_body, filter_tag_id, filter_language
```
to:
```sql
RETURNING id, pharmacy_id, message_body, filter_tag_id, filter_language, segment_include
```

Also update the TypeScript type annotation for the query result. The `pool.query<{...}>` generic should include:
```typescript
pool.query<{
  id: string;
  pharmacy_id: string;
  message_body: string;
  filter_tag_id: string | null;
  filter_language: string | null;
  segment_include: SegmentInclude | null;
}>(
```

- [ ] **Step 3: Add segment branch to patient query**

In the dispatcher, find where `patientQuery` is built (the long SELECT with LATERAL join). Currently it applies `filter_tag_id` and `filter_language` at the bottom. Replace that filter section:

```typescript
// BEFORE (existing)
if (broadcast.filter_tag_id) {
  params.push(broadcast.filter_tag_id);
  patientQuery += ` AND p.id IN (
    SELECT patient_id FROM patient_tag_map WHERE tag_id = $${params.length}
  )`;
}
if (broadcast.filter_language) {
  params.push(broadcast.filter_language);
  patientQuery += ` AND p.language = $${params.length}`;
}

// AFTER
if (broadcast.segment_include) {
  patientQuery += buildSegmentClause(broadcast.segment_include, params);
} else {
  if (broadcast.filter_tag_id) {
    params.push(broadcast.filter_tag_id);
    patientQuery += ` AND p.id IN (
      SELECT patient_id FROM patient_tag_map WHERE tag_id = $${params.length}
    )`;
  }
  if (broadcast.filter_language) {
    params.push(broadcast.filter_language);
    patientQuery += ` AND p.language = $${params.length}`;
  }
}
```

- [ ] **Step 4: Add zero-recipient warn log**

Find the section in the dispatcher that handles `recipientCount === 0`:
```typescript
if (recipientCount === 0) {
  await pool.query(`UPDATE broadcasts SET status = 'running' WHERE id = $1`, [broadcast.id]);
  continue;
}
```
Add a console.warn before the continue:
```typescript
if (recipientCount === 0) {
  console.warn(`[scheduledBroadcastDispatcher] zero recipients for broadcast ${broadcast.id} — segment was empty at dispatch time`);
  await pool.query(`UPDATE broadcasts SET status = 'running' WHERE id = $1`, [broadcast.id]);
  continue;
}
```

- [ ] **Step 5: Commit**

```bash
cd backend && git add src/jobs/scheduledBroadcastDispatcher.ts
git commit -m "feat(backend): update dispatcher — add segment_include to RETURNING; branch on segment vs legacy filters"
```

---

## Task 6: Frontend — `lib/api.ts` Types + `audiencePreview`

**Files:**
- Modify: `frontend/lib/api.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type SegmentType = 'all' | 'last_purchased_within_days' | 'not_purchased_within_days' | 'active_within_days';
  export interface SegmentInclude { type: SegmentType; value?: number; }
  api.broadcasts.audiencePreview(type: SegmentType, value?: number): Promise<{ success: true; count: number }>
  ```

- [ ] **Step 1: Add `SegmentType` and `SegmentInclude` types**

Near the top of `frontend/lib/api.ts`, before the `export interface Broadcast`, add:
```typescript
export type SegmentType =
  | 'all'
  | 'last_purchased_within_days'
  | 'not_purchased_within_days'
  | 'active_within_days';

export interface SegmentInclude {
  type: SegmentType;
  value?: number;
}
```

- [ ] **Step 2: Update `Broadcast` interface**

Find `export interface Broadcast` and add `segment_include` field:
```typescript
export interface Broadcast {
  id: string; pharmacy_id: string; message_body: string;
  filter_tag_id: string | null; filter_language: string | null;
  segment_include: SegmentInclude | null;
  recipient_count: number; sent_count: number; failed_count: number; created_at: string;
  status: 'running' | 'scheduled' | 'queued' | 'cancelled' | 'failed';
  scheduled_at: string | null;
  template_id?: string | null;
  template_params?: string[] | null;
}
```

- [ ] **Step 3: Add `audiencePreview` to the broadcasts API object**

Find `broadcasts: {` in the `api` object. Add `audiencePreview` inside it:
```typescript
broadcasts: {
  list: () => request<{ broadcasts: Broadcast[] }>('/broadcasts'),
  audiencePreview: (type: SegmentType, value?: number) => {
    const params = new URLSearchParams({ type });
    if (value !== undefined) params.set('value', String(value));
    return request<{ success: true; count: number }>(`/broadcasts/audience-preview?${params}`);
  },
  send: (body: {
    message: string;
    segment_include?: SegmentInclude;
    filter_tag_id?: string;
    filter_language?: string;
    template_id?: string;
    template_params?: string[];
    scheduled_at?: string;
  }) =>
    request<{ broadcastId: string; recipientCount: number; message: string }>(
      '/broadcasts', { method: 'POST', body: JSON.stringify(body) }
    ),
  cancel: (id: string) =>
    request<{ success: true }>(`/broadcasts/${id}`, { method: 'DELETE' }),
  status: (id: string) =>
    request<{ broadcast: { id: string; recipient_count: number; sent_count: number; failed_count: number; created_at: string } }>(
      `/broadcasts/${id}/status`
    ),
},
```

- [ ] **Step 4: Commit**

```bash
cd frontend && git add lib/api.ts
git commit -m "feat(frontend): add SegmentType/SegmentInclude types; add audiencePreview to broadcasts API"
```

---

## Task 7: Frontend — Broadcasts Page Segment Chips

**Files:**
- Modify: `frontend/app/(dashboard)/broadcasts/page.tsx`

**Interfaces:**
- Consumes: `SegmentType`, `SegmentInclude`, `api.broadcasts.audiencePreview` from `../../../lib/api`

- [ ] **Step 1: Update imports at top of `broadcasts/page.tsx`**

Replace the existing import from `../../../lib/api`:
```typescript
// BEFORE
import { api, Broadcast, PatientTag, ApiError, GupshupTemplate } from '../../../lib/api';

// AFTER
import { api, Broadcast, ApiError, GupshupTemplate, SegmentType, SegmentInclude } from '../../../lib/api';
```

Also update the lucide-react import — remove `Users` (no longer needed separately):
```typescript
import { Send, Loader2, CheckCircle2, XCircle, Radio, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';
```

- [ ] **Step 2: Add segment constants above the component**

After the existing `MAPPING_OPTIONS` definition, add:
```typescript
type SegmentValues = Record<Exclude<SegmentType, 'all'>, number>;

const DEFAULT_SEGMENT_VALUES: SegmentValues = {
  last_purchased_within_days: 30,
  not_purchased_within_days: 60,
  active_within_days: 14,
};

const SEGMENT_CHIPS: Array<{
  type: SegmentType;
  label: string;
  before?: string;
  after?: string;
}> = [
  { type: 'all', label: 'All Patients' },
  { type: 'last_purchased_within_days', before: 'Active Buyers — last', after: 'days' },
  { type: 'not_purchased_within_days', before: 'Lapsed Buyers —', after: '+ days' },
  { type: 'active_within_days', before: 'Recent Visitors — last', after: 'days' },
];
```

- [ ] **Step 3: Replace filter state in `BroadcastsPage` component**

Inside `export default function BroadcastsPage()`, remove these state declarations:
```typescript
// REMOVE these three lines:
const [filterLanguage, setFilterLanguage] = useState('');
const [filterTagId, setFilterTagId] = useState('');
const [tags, setTags] = useState<PatientTag[]>([]);
```

Add segment state in their place:
```typescript
const [segmentType, setSegmentType] = useState<SegmentType>('all');
const [segmentValues, setSegmentValues] = useState<SegmentValues>({ ...DEFAULT_SEGMENT_VALUES });
const [recipientError, setRecipientError] = useState(false);
```

Keep the existing `recipientCount` and `recipientLoading` state — they stay.

- [ ] **Step 4: Add `useRef` import and prevType ref**

At the top of the component (inside the function body), add:
```typescript
const prevSegmentTypeRef = useRef<SegmentType>('all');
```

Make sure `useRef` is in the React import: `import { useEffect, useMemo, useState, useRef } from 'react';`

- [ ] **Step 5: Replace both recipient-count `useEffect` blocks**

Remove the two existing `useEffect` blocks that call `/api/v1/broadcasts/recipient-count`. Replace with one:
```typescript
// Segment count fetch — immediate on type change, debounced 400ms on value change
useEffect(() => {
  const typeChanged = prevSegmentTypeRef.current !== segmentType;
  prevSegmentTypeRef.current = segmentType;

  setRecipientCount(null);
  setRecipientLoading(true);
  setRecipientError(false);

  const currentType = segmentType;
  const currentValue = segmentType === 'all' ? undefined : segmentValues[segmentType as Exclude<SegmentType, 'all'>];
  const delay = typeChanged ? 0 : 400;

  const timer = setTimeout(async () => {
    try {
      const data = await api.broadcasts.audiencePreview(currentType, currentValue);
      setRecipientCount(data.count);
    } catch {
      setRecipientError(true);
    } finally {
      setRecipientLoading(false);
    }
  }, delay);

  return () => clearTimeout(timer);
}, [segmentType, segmentValues[segmentType as Exclude<SegmentType, 'all'>]]);
```

- [ ] **Step 6: Remove `api.tags.list()` from the existing `useEffect`**

Find the existing `useEffect` that calls `api.tags.list()` and `api.broadcasts.list()`. Remove the tags line:
```typescript
// BEFORE
useEffect(() => {
  api.tags.list().then(({ tags }) => setTags(tags)).catch(() => {});
  api.broadcasts.list().then(({ broadcasts }) => setBroadcasts(broadcasts)).catch(() => {});
}, []);

// AFTER
useEffect(() => {
  api.broadcasts.list().then(({ broadcasts }) => setBroadcasts(broadcasts)).catch(() => {});
}, []);
```

- [ ] **Step 7: Update `handleSend` to use `segment_include`**

In `handleSend`, find the place where `api.broadcasts.send` is called. Replace `filter_tag_id` and `filter_language` with `segment_include`:
```typescript
// BEFORE
: await api.broadcasts.send({
    message: message.trim(),
    filter_tag_id: filterTagId || undefined,
    filter_language: filterLanguage || undefined,
    scheduled_at: scheduledAtParam,
  });

// AFTER (both freetext and template branches need this change)
```

Find both `api.broadcasts.send({...})` calls in `handleSend` (template mode and freetext mode) and update each:
```typescript
// Template mode
? await api.broadcasts.send({
    message: selectedTemplate.body,
    template_id: selectedTemplate.elementName,
    template_params: paramMapping.slice(0, paramCount),
    segment_include: segmentType === 'all' ? undefined : { type: segmentType, value: segmentValues[segmentType as Exclude<SegmentType, 'all'>] },
    scheduled_at: scheduledAtParam,
  })
// Freetext mode
: await api.broadcasts.send({
    message: message.trim(),
    segment_include: segmentType === 'all' ? undefined : { type: segmentType, value: segmentValues[segmentType as Exclude<SegmentType, 'all'>] },
    scheduled_at: scheduledAtParam,
  });
```

- [ ] **Step 8: Update optimistic broadcast objects in `handleSend`**

Both optimistic `Broadcast` objects (scheduled and immediate) set `filter_tag_id` and `filter_language`. Update them to also set `segment_include`:
```typescript
// In both optimistic Broadcast objects, replace:
filter_tag_id: filterTagId || null,
filter_language: filterLanguage || null,

// With:
filter_tag_id: null,
filter_language: null,
segment_include: segmentType === 'all' ? null : { type: segmentType, value: segmentValues[segmentType as Exclude<SegmentType, 'all'>] },
```

- [ ] **Step 9: Replace filter dropdowns with segment chips in the JSX**

Find the `{/* Filters */}` section in the JSX (the `<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">` containing the two Select dropdowns). Replace the entire block:

```tsx
{/* Segment targeting */}
<div>
  <label className="block text-xs font-medium text-zinc-600 mb-2">Target audience</label>
  <div className="flex flex-wrap gap-2">
    {SEGMENT_CHIPS.map(chip => {
      const isActive = segmentType === chip.type;
      const numValue = chip.type !== 'all'
        ? segmentValues[chip.type as Exclude<SegmentType, 'all'>]
        : 0;
      return (
        <button
          key={chip.type}
          type="button"
          onClick={() => setSegmentType(chip.type)}
          className={cn(
            'inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
            isActive
              ? 'border border-brand-blue bg-brand-blue/10 text-brand-blue'
              : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50',
          )}
        >
          {chip.type === 'all' ? (
            chip.label
          ) : isActive ? (
            <>
              {chip.before}
              <input
                type="number"
                min={1}
                max={365}
                value={numValue}
                onChange={e => {
                  const v = Math.min(365, Math.max(1, parseInt(e.target.value, 10) || 1));
                  setSegmentValues(prev => ({ ...prev, [chip.type]: v }));
                }}
                onClick={ev => ev.stopPropagation()}
                className="w-10 text-center bg-transparent border-b border-brand-blue focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {chip.after}
            </>
          ) : (
            <>
              {chip.before} {numValue} {chip.after}
            </>
          )}
        </button>
      );
    })}
  </div>
</div>
```

- [ ] **Step 10: Update the recipient count display**

Find the existing recipient count `<div>` (the one with `<Users />` icon). Replace it:
```tsx
{/* Recipient count */}
<div className="flex items-center gap-1.5 text-sm min-h-[20px]">
  {recipientLoading ? (
    <span className="flex items-center gap-1.5 text-zinc-500">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Loading…
    </span>
  ) : recipientError ? (
    <span className="flex items-center gap-1.5 text-red-500">
      Could not load —{' '}
      <button
        type="button"
        className="underline"
        onClick={() => {
          setSegmentType(t => {
            // Toggling to same value doesn't re-trigger effect; force re-fetch
            prevSegmentTypeRef.current = 'all'; // reset so next render sees type as "changed"
            return t;
          });
          setRecipientCount(null);
          setRecipientLoading(true);
          setRecipientError(false);
          const currentType = segmentType;
          const currentValue = segmentType === 'all' ? undefined : segmentValues[segmentType as Exclude<SegmentType, 'all'>];
          api.broadcasts.audiencePreview(currentType, currentValue)
            .then(d => setRecipientCount(d.count))
            .catch(() => setRecipientError(true))
            .finally(() => setRecipientLoading(false));
        }}
      >
        Retry
      </button>
    </span>
  ) : recipientCount === 0 ? (
    <span className="text-zinc-500">No patients match this segment</span>
  ) : recipientCount !== null ? (
    <span className="text-zinc-500">
      {sendMode === 'schedule' ? '~' : ''}
      Sending to{' '}
      <strong className="text-zinc-800">{recipientCount.toLocaleString('en-IN')}</strong>{' '}
      patient{recipientCount !== 1 ? 's' : ''}
      {sendMode === 'schedule' && (
        <span className="ml-1 text-zinc-400 font-normal">(estimated)</span>
      )}
    </span>
  ) : null}
</div>
```

- [ ] **Step 11: Update `canSend` to account for error and null count**

Find the `canSend` computed value. Update to add error/loading guards:
```typescript
// BEFORE
const canSend = !sending && scheduleValid && (
  mode === 'freetext'
    ? message.trim().length >= 5 && renderPreview(message, BROADCAST_ATTRIBUTES).length <= 1000
    : !!selectedTemplate && (paramCount === 0 || paramMapping.slice(0, paramCount).every(v => v))
);

// AFTER
const canSend = !sending && scheduleValid && !recipientLoading && !recipientError && (recipientCount ?? 0) > 0 && (
  mode === 'freetext'
    ? message.trim().length >= 5 && renderPreview(message, BROADCAST_ATTRIBUTES).length <= 1000
    : !!selectedTemplate && (paramCount === 0 || paramMapping.slice(0, paramCount).every(v => v))
);
```

- [ ] **Step 12: Update `BroadcastRow` component to remove `filter_language` badge**

In the `BroadcastRow` component, find and remove the filter_language badge:
```tsx
// REMOVE this block:
{b.filter_language && (
  <span className="capitalize bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">{b.filter_language}</span>
)}
```

- [ ] **Step 13: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit
```

Expected: no errors. Fix any type errors before committing.

- [ ] **Step 14: Commit**

```bash
cd frontend && git add app/\(dashboard\)/broadcasts/page.tsx lib/api.ts
git commit -m "feat(frontend): replace tag/language dropdowns with segment chips; add debounced audience count"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Task covering it |
|-----------------|-----------------|
| 4 segment chips (All Patients, Active Buyers, Lapsed Buyers, Recent Visitors) | Task 7 |
| Inline number input (1–365), default 30/60/14 | Task 7 |
| Auto-fetch on chip click (0ms), debounced 400ms on value change | Task 7 step 5 |
| Loading spinner while in-flight | Task 7 step 10 |
| Error state: "Could not load — Retry" | Task 7 step 10 |
| Zero count: "No patients match" + Send disabled | Task 7 step 10 + 11 |
| Send disabled while loading / error | Task 7 step 11 |
| Estimated label on scheduled send | Task 7 step 10 |
| `GET /broadcasts/audience-preview` endpoint | Task 3 |
| Validation: type enum + value 1–365 | Task 3 |
| SQL parameterized with `$N * INTERVAL '1 day'` | Task 2 (`segmentUtils.ts`) |
| Lapsed buyers excludes zero-purchase patients | Task 2 + Task 4 test |
| `is_active = true` and `opted_in = true` guards | Task 3 (full query skeleton) |
| `POST /broadcasts` accepts `segment_include` | Task 3 |
| `segment_include` stored as JSONB | Task 3 + Task 1 migration |
| Backward compat: old `filter_tag_id`/`filter_language` paths unchanged | Task 3, Task 5 |
| Dispatcher RETURNING includes `segment_include` | Task 5 |
| Dispatcher branches on `segment_include` vs legacy | Task 5 |
| Zero-recipient warn log in dispatcher | Task 5 |
| DB migration adds column + index | Task 1 |
| Frontend types updated | Task 6 |
| `api.broadcasts.audiencePreview` added | Task 6 |
| Tests for audience-preview (all segment types) | Task 4 |

### Placeholder scan
No TBDs, TODOs, or vague steps found. All code blocks are complete.

### Type consistency check
- `SegmentType` defined in Task 2 (backend) as `'all' | 'last_purchased_within_days' | 'not_purchased_within_days' | 'active_within_days'` — matches Task 6 (frontend).
- `SegmentInclude` is `{ type: SegmentType; value?: number }` in both backend and frontend — consistent.
- `buildSegmentClause(segment: SegmentInclude | null, params: unknown[]): string` — used in Task 3 (broadcasts route) and Task 5 (dispatcher) exactly as defined in Task 2.
- `DEFAULT_SEGMENT_VALUES` keys match `Exclude<SegmentType, 'all'>` — consistent.
- `recipientError` state used in `canSend` (Task 7 step 11) and count display (Task 7 step 10) — consistent.
