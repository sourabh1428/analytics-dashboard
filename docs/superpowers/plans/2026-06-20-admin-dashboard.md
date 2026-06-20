# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate Next.js 14 admin frontend + protected Express admin router giving the founder full control over all pharmacy tenants.

**Architecture:** New `admin-frontend/` Next.js app (Vercel) calls new `/api/v1/admin/*` endpoints on the existing Railway Express backend. Backend routes are protected by `X-Admin-Secret` header with `timingSafeEqual`. Frontend uses iron-session for auth. JWT gains `session_version` to support session invalidation on password reset.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, shadcn/ui, iron-session, sonner, Lucide icons, Express, bcrypt, express-rate-limit, supertest (backend tests)

## Global Constraints

- All backend routes prefixed `/api/v1/admin/` (consistent with existing routes)
- `ADMIN_SECRET` env var ≥ 32 chars; compare with `crypto.timingSafeEqual` never `===`
- `ADMIN_ENABLED=true` env var must be set or admin router is not mounted
- Rate limit: 10 req/min on `/api/v1/admin/*` via `express-rate-limit`
- All mutations console-log: `[admin] ACTION pharmacy=<id> field=<f> old=<o> new=<n>`
- Admin frontend env vars: `ADMIN_SECRET`, `NEXT_PUBLIC_API_URL`, `SESSION_SECRET` (≥32 chars for iron-session)
- Next.js version: 14.2.x; React 18; Tailwind 3.4.x; shadcn/ui (latest)

---

### Task 1: DB Migrations (019–021)

**Files:**
- Create: `backend/src/db/migrations/019_message_logs_pharmacy_idx.sql`
- Create: `backend/src/db/migrations/020_credit_transactions_created_at_idx.sql`
- Create: `backend/src/db/migrations/021_session_version.sql`
- Modify: `backend/src/db/migrate.ts`

**Interfaces:**
- Produces: `session_version INTEGER NOT NULL DEFAULT 0` column on `pharmacies` table; two new indexes

- [ ] **Step 1: Create migration 019**

`backend/src/db/migrations/019_message_logs_pharmacy_idx.sql`:
```sql
CREATE INDEX IF NOT EXISTS idx_message_logs_pharmacy_id ON message_logs(pharmacy_id);
```

- [ ] **Step 2: Create migration 020**

`backend/src/db/migrations/020_credit_transactions_created_at_idx.sql`:
```sql
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
```

- [ ] **Step 3: Create migration 021**

`backend/src/db/migrations/021_session_version.sql`:
```sql
ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
```

- [ ] **Step 4: Register migrations in migrate.ts**

In `backend/src/db/migrate.ts`, add the three new filenames to the `migrations` array after `'018_segment_targeting.sql'`:
```ts
'019_message_logs_pharmacy_idx.sql',
'020_credit_transactions_created_at_idx.sql',
'021_session_version.sql',
```

- [ ] **Step 5: Run migrations**

```bash
cd backend && npx ts-node src/db/migrate.ts
```
Expected: `Applied: 019_message_logs_pharmacy_idx.sql`, `Applied: 020_credit_transactions_created_at_idx.sql`, `Applied: 021_session_version.sql`

- [ ] **Step 6: Commit**

```bash
git add backend/src/db/migrations/019_message_logs_pharmacy_idx.sql backend/src/db/migrations/020_credit_transactions_created_at_idx.sql backend/src/db/migrations/021_session_version.sql backend/src/db/migrate.ts
git commit -m "feat(db): add message_logs index, credit_transactions index, session_version column"
```

---

### Task 2: JWT session_version + Auth Middleware

**Files:**
- Modify: `backend/src/utils/jwt.ts`
- Modify: `backend/src/middleware/auth.ts`
- Modify: `backend/src/routes/auth.ts`
- Modify: `backend/tests/auth.test.ts`

**Interfaces:**
- Produces: `signToken(pharmacyId: string, sessionVersion: number): string`
- Produces: `verifyToken(token: string): { pharmacyId: string; sessionVersion: number }`
- Produces: `authenticate` middleware rejects 401 if token `sessionVersion` < DB `session_version`

- [ ] **Step 1: Write failing test for session_version invalidation**

Add to `backend/tests/auth.test.ts`:
```ts
describe('session_version invalidation', () => {
  let token: string;
  let pharmacyId: string;

  beforeAll(async () => {
    await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Session Test Pharmacy',
      owner_name: 'Owner',
      phone: '+911111111111',
      email: 'session@example.com',
      password: 'password123',
    });
    token = res.body.token;
    pharmacyId = res.body.pharmacy.id;
  });

  it('accepts a valid token', async () => {
    const res = await request(app)
      .get('/api/v1/pharmacy/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('rejects token after session_version increment', async () => {
    await pool.query(
      `UPDATE pharmacies SET session_version = session_version + 1 WHERE id = $1`,
      [pharmacyId]
    );
    const res = await request(app)
      .get('/api/v1/pharmacy/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd backend && npm test -- --testPathPattern=auth.test.ts
```
Expected: FAIL — "rejects token after session_version increment" fails because middleware doesn't check session_version yet.

- [ ] **Step 3: Update jwt.ts**

Replace `backend/src/utils/jwt.ts` entirely:
```ts
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;
const EXPIRY = '7d';

export function signToken(pharmacyId: string, sessionVersion: number): string {
  return jwt.sign({ pharmacyId, sessionVersion }, SECRET, { expiresIn: EXPIRY });
}

export function verifyToken(token: string): { pharmacyId: string; sessionVersion: number } {
  const payload = jwt.verify(token, SECRET) as { pharmacyId: string; sessionVersion: number };
  return payload;
}
```

- [ ] **Step 4: Update auth middleware to check session_version**

Replace `backend/src/middleware/auth.ts` entirely:
```ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { pool } from '../db/pool';

declare global {
  namespace Express {
    interface Request {
      pharmacyId: string;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const cookieToken = req.cookies?.easibill_token as string | undefined;
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = cookieToken ?? bearerToken;
  if (!token) {
    res.status(401).json({ success: false, error: 'Missing token', code: 'UNAUTHORIZED' });
    return;
  }
  let pharmacyId: string;
  let sessionVersion: number;
  try {
    ({ pharmacyId, sessionVersion } = verifyToken(token));
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token', code: 'UNAUTHORIZED' });
    return;
  }
  try {
    const result = await pool.query<{ session_version: number }>(
      `SELECT session_version FROM pharmacies WHERE id = $1 AND is_active = true`,
      [pharmacyId]
    );
    if (!result.rows[0]) {
      res.status(401).json({ success: false, error: 'Pharmacy not found', code: 'UNAUTHORIZED' });
      return;
    }
    if (sessionVersion < result.rows[0].session_version) {
      res.status(401).json({ success: false, error: 'Session expired', code: 'SESSION_EXPIRED' });
      return;
    }
  } catch {
    res.status(500).json({ success: false, error: 'Internal error', code: 'INTERNAL_ERROR' });
    return;
  }
  req.pharmacyId = pharmacyId;
  next();
}
```

- [ ] **Step 5: Update auth.ts to pass session_version to signToken**

In `backend/src/routes/auth.ts`, the `register` handler returns a new pharmacy with `session_version = 0` (default). Update the `signToken` call in the register handler:
```ts
// Find this line in the register handler:
const token = signToken(pharmacyId);
// Replace with:
const token = signToken(pharmacyId, 0);
```

In the login handler, fetch `session_version` in the SELECT and pass it:
```ts
// Find the SELECT query in the login handler and add session_version to the column list:
`SELECT id, password_hash, name, owner_name, phone, email, plan, wallet_credits, wa_connected, timezone, onboarding_step,
        reminder_template_id, sale_template_id, reminder_template_name, sale_template_name,
        reminder_template_body, sale_template_body, reminder_template_params, sale_template_params, created_at,
        session_version
 FROM pharmacies WHERE email = $1 AND is_active = true`

// Find this line in the login handler:
const token = signToken(pharmacy.id);
// Replace with:
const token = signToken(pharmacy.id, pharmacy.session_version ?? 0);
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
cd backend && npm test -- --testPathPattern=auth.test.ts
```
Expected: All PASS including "rejects token after session_version increment"

- [ ] **Step 7: Run all tests to check no regressions**

```bash
cd backend && npm test
```
Expected: All existing tests pass.

- [ ] **Step 8: Commit**

```bash
git add backend/src/utils/jwt.ts backend/src/middleware/auth.ts backend/src/routes/auth.ts backend/tests/auth.test.ts
git commit -m "feat(auth): embed session_version in JWT; invalidate sessions on version bump"
```

---

### Task 3: Backend Admin Router

**Files:**
- Create: `backend/src/routes/admin.ts`
- Modify: `backend/src/app.ts`
- Create: `backend/tests/admin.test.ts`

**Interfaces:**
- Consumes: `pool` from `../db/pool`, `bcrypt`, `signToken` is NOT used here (admin doesn't log in as pharmacy)
- Produces: All `/api/v1/admin/*` endpoints listed in spec

- [ ] **Step 1: Install express-rate-limit if not present**

```bash
cd backend && npm ls express-rate-limit
```
Already installed (used in app.ts). No action needed.

- [ ] **Step 2: Write failing tests for admin router**

Create `backend/tests/admin.test.ts`:
```ts
import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';

const SECRET = 'test_admin_secret_minimum_32_characters_ok';

beforeAll(async () => {
  process.env.ADMIN_SECRET = SECRET;
  process.env.ADMIN_ENABLED = 'true';
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.query(`
    INSERT INTO pharmacies (id, name, owner_name, phone, email, password_hash, wallet_credits, wa_connected, is_active)
    VALUES (
      'aaaaaaaa-0000-0000-0000-000000000001',
      'Test Pharmacy', 'Owner One', '+910000000001', 'one@test.com', 'hash', 50, false, true
    )
  `);
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.end();
});

const auth = () => ({ 'x-admin-secret': SECRET });

describe('Admin middleware', () => {
  it('rejects missing secret with 401', async () => {
    const res = await request(app).get('/api/v1/admin/overview');
    expect(res.status).toBe(401);
  });

  it('rejects wrong secret with 401', async () => {
    const res = await request(app)
      .get('/api/v1/admin/overview')
      .set('x-admin-secret', 'wrong');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/admin/overview', () => {
  it('returns stats object', async () => {
    const res = await request(app).get('/api/v1/admin/overview').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      totalPharmacies: expect.any(Number),
      activePharmacies: expect.any(Number),
      totalPatients: expect.any(Number),
      totalMessages: expect.any(Number),
      totalCredits: expect.any(Number),
      waConnected: expect.any(Number),
      newSignups7d: expect.any(Number),
    });
  });
});

describe('GET /api/v1/admin/pharmacies', () => {
  it('returns paginated list with counts', async () => {
    const res = await request(app).get('/api/v1/admin/pharmacies').set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0]).toHaveProperty('patient_count');
    expect(res.body.data[0]).toHaveProperty('message_count');
  });

  it('filters by search query', async () => {
    const res = await request(app)
      .get('/api/v1/admin/pharmacies?q=nomatch_xyz')
      .set(auth());
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('PATCH /api/v1/admin/pharmacies/:id', () => {
  it('updates plan', async () => {
    const res = await request(app)
      .patch('/api/v1/admin/pharmacies/aaaaaaaa-0000-0000-0000-000000000001')
      .set(auth())
      .send({ plan: 'pro' });
    expect(res.status).toBe(200);
    expect(res.body.pharmacy.plan).toBe('pro');
  });

  it('rejects unknown fields', async () => {
    const res = await request(app)
      .patch('/api/v1/admin/pharmacies/aaaaaaaa-0000-0000-0000-000000000001')
      .set(auth())
      .send({ password_hash: 'evil' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid plan value', async () => {
    const res = await request(app)
      .patch('/api/v1/admin/pharmacies/aaaaaaaa-0000-0000-0000-000000000001')
      .set(auth())
      .send({ plan: 'enterprise' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/admin/pharmacies/:id/credits', () => {
  it('adds credits atomically', async () => {
    const res = await request(app)
      .post('/api/v1/admin/pharmacies/aaaaaaaa-0000-0000-0000-000000000001/credits')
      .set(auth())
      .send({ type: 'purchase', amount: 100, description: 'Manual top-up' });
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(150);
  });

  it('rejects deduction exceeding balance', async () => {
    const res = await request(app)
      .post('/api/v1/admin/pharmacies/aaaaaaaa-0000-0000-0000-000000000001/credits')
      .set(auth())
      .send({ type: 'deduct', amount: 9999, description: 'Too much' });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INSUFFICIENT_CREDITS');
  });
});

describe('POST /api/v1/admin/pharmacies/:id/reset-password', () => {
  it('updates password and increments session_version', async () => {
    const before = await pool.query(
      `SELECT session_version FROM pharmacies WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001'`
    );
    const vBefore = before.rows[0].session_version;

    const res = await request(app)
      .post('/api/v1/admin/pharmacies/aaaaaaaa-0000-0000-0000-000000000001/reset-password')
      .set(auth())
      .send({ password: 'newpassword123' });
    expect(res.status).toBe(200);

    const after = await pool.query(
      `SELECT session_version FROM pharmacies WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001'`
    );
    expect(after.rows[0].session_version).toBe(vBefore + 1);
  });

  it('rejects password shorter than 8 chars', async () => {
    const res = await request(app)
      .post('/api/v1/admin/pharmacies/aaaaaaaa-0000-0000-0000-000000000001/reset-password')
      .set(auth())
      .send({ password: 'short' });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
cd backend && npm test -- --testPathPattern=admin.test.ts
```
Expected: FAIL — routes don't exist yet.

- [ ] **Step 4: Create admin router**

Create `backend/src/routes/admin.ts`:
```ts
import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import { pool } from '../db/pool';

const router = Router();

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests', code: 'RATE_LIMITED' },
});

router.use(adminLimiter);

router.use((req: Request, res: Response, next: NextFunction): void => {
  const secret = process.env.ADMIN_SECRET;
  const provided = req.headers['x-admin-secret'];
  if (!secret || typeof provided !== 'string') {
    res.status(401).json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' });
    return;
  }
  const secretBuf = Buffer.from(secret);
  const providedBuf = Buffer.from(provided);
  if (
    secretBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(secretBuf, providedBuf)
  ) {
    res.status(401).json({ success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' });
    return;
  }
  next();
});

// GET /admin/overview
router.get('/overview', async (_req: Request, res: Response): Promise<void> => {
  const result = await pool.query(`
    SELECT
      COUNT(*)                                              AS "totalPharmacies",
      COUNT(*) FILTER (WHERE is_active = true)             AS "activePharmacies",
      (SELECT COUNT(*) FROM patients)                      AS "totalPatients",
      (SELECT COUNT(*) FROM message_logs)                  AS "totalMessages",
      COALESCE(SUM(wallet_credits), 0)                     AS "totalCredits",
      COUNT(*) FILTER (WHERE wa_connected = true)          AS "waConnected",
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS "newSignups7d"
    FROM pharmacies
  `);
  const row = result.rows[0];
  res.json({
    totalPharmacies: Number(row.totalPharmacies),
    activePharmacies: Number(row.activePharmacies),
    totalPatients: Number(row.totalPatients),
    totalMessages: Number(row.totalMessages),
    totalCredits: Number(row.totalCredits),
    waConnected: Number(row.waConnected),
    newSignups7d: Number(row.newSignups7d),
  });
});

// GET /admin/pharmacies
router.get('/pharmacies', async (req: Request, res: Response): Promise<void> => {
  const q = (req.query.q as string) || null;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 50));
  const offset = (page - 1) * limit;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT
         p.id, p.name, p.owner_name, p.email, p.phone, p.plan,
         p.wallet_credits, p.wa_connected, p.is_active, p.created_at,
         p.timezone, p.onboarding_step,
         p.reminder_template_name, p.sale_template_name,
         COUNT(DISTINCT pat.id)::int AS patient_count,
         COUNT(DISTINCT ml.id)::int  AS message_count
       FROM pharmacies p
       LEFT JOIN patients pat ON pat.pharmacy_id = p.id
       LEFT JOIN message_logs ml ON ml.pharmacy_id = p.id
       WHERE ($1::text IS NULL
         OR p.name  ILIKE '%' || $1 || '%'
         OR p.email ILIKE '%' || $1 || '%'
         OR p.phone ILIKE '%' || $1 || '%')
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [q, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM pharmacies
       WHERE ($1::text IS NULL
         OR name  ILIKE '%' || $1 || '%'
         OR email ILIKE '%' || $1 || '%'
         OR phone ILIKE '%' || $1 || '%')`,
      [q]
    ),
  ]);

  res.json({ data: dataResult.rows, total: countResult.rows[0].total, page, limit });
});

// GET /admin/pharmacies/:id
router.get('/pharmacies/:id', async (req: Request, res: Response): Promise<void> => {
  const result = await pool.query(
    `SELECT p.id, p.name, p.owner_name, p.email, p.phone, p.plan,
            p.wallet_credits, p.wa_connected, p.is_active, p.created_at,
            p.timezone, p.onboarding_step,
            p.reminder_template_name, p.sale_template_name,
            COUNT(DISTINCT pat.id)::int AS patient_count,
            COUNT(DISTINCT ml.id)::int  AS message_count
     FROM pharmacies p
     LEFT JOIN patients pat ON pat.pharmacy_id = p.id
     LEFT JOIN message_logs ml ON ml.pharmacy_id = p.id
     WHERE p.id = $1
     GROUP BY p.id`,
    [req.params.id]
  );
  if (!result.rows[0]) {
    res.status(404).json({ success: false, error: 'Not found' });
    return;
  }
  res.json({ pharmacy: result.rows[0] });
});

// PATCH /admin/pharmacies/:id
const ALLOWED_FIELDS = ['plan', 'wa_connected', 'is_active'] as const;
type AllowedField = typeof ALLOWED_FIELDS[number];
const VALIDATORS: Record<AllowedField, (v: unknown) => boolean> = {
  plan: (v) => v === 'starter' || v === 'pro',
  wa_connected: (v) => typeof v === 'boolean',
  is_active: (v) => typeof v === 'boolean',
};

router.patch('/pharmacies/:id', async (req: Request, res: Response): Promise<void> => {
  const keys = Object.keys(req.body) as string[];
  const unknownKeys = keys.filter((k) => !ALLOWED_FIELDS.includes(k as AllowedField));
  if (unknownKeys.length > 0) {
    res.status(400).json({ success: false, error: `Unknown fields: ${unknownKeys.join(', ')}` });
    return;
  }
  if (keys.length !== 1) {
    res.status(400).json({ success: false, error: 'Send exactly one field per PATCH' });
    return;
  }
  const field = keys[0] as AllowedField;
  const value = req.body[field];
  if (!VALIDATORS[field](value)) {
    res.status(400).json({ success: false, error: `Invalid value for ${field}` });
    return;
  }

  const before = await pool.query(`SELECT ${field} FROM pharmacies WHERE id = $1`, [req.params.id]);
  if (!before.rows[0]) {
    res.status(404).json({ success: false, error: 'Not found' });
    return;
  }
  const oldValue = before.rows[0][field];

  const result = await pool.query(
    `UPDATE pharmacies SET ${field} = $1 WHERE id = $2
     RETURNING id, name, owner_name, email, phone, plan, wallet_credits, wa_connected, is_active, created_at`,
    [value, req.params.id]
  );
  console.log(`[admin] PATCH pharmacy=${req.params.id} field=${field} old=${oldValue} new=${value} at=${new Date().toISOString()}`);
  res.json({ pharmacy: result.rows[0] });
});

// POST /admin/pharmacies/:id/reset-password
router.post('/pharmacies/:id/reset-password', async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;
  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ success: false, error: 'Password must be at least 8 characters', code: 'VALIDATION_ERROR' });
    return;
  }
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `UPDATE pharmacies
     SET password_hash = $1, session_version = session_version + 1
     WHERE id = $2
     RETURNING id, session_version`,
    [hash, req.params.id]
  );
  if (!result.rows[0]) {
    res.status(404).json({ success: false, error: 'Not found' });
    return;
  }
  console.log(`[admin] RESET_PASSWORD pharmacy=${req.params.id} new_session_version=${result.rows[0].session_version} at=${new Date().toISOString()}`);
  res.json({ success: true });
});

// POST /admin/pharmacies/:id/credits
router.post('/pharmacies/:id/credits', async (req: Request, res: Response): Promise<void> => {
  const { type, amount, description } = req.body;
  if (!['purchase', 'deduct'].includes(type) || !Number.isInteger(amount) || amount <= 0 || !description) {
    res.status(400).json({ success: false, error: 'Invalid request', code: 'VALIDATION_ERROR' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let balanceResult;
    if (type === 'deduct') {
      balanceResult = await client.query(
        `UPDATE pharmacies SET wallet_credits = wallet_credits - $1
         WHERE id = $2 AND wallet_credits >= $1
         RETURNING wallet_credits`,
        [amount, req.params.id]
      );
      if (balanceResult.rowCount === 0) {
        await client.query('ROLLBACK');
        res.status(400).json({ success: false, error: 'Insufficient credits', code: 'INSUFFICIENT_CREDITS' });
        return;
      }
    } else {
      balanceResult = await client.query(
        `UPDATE pharmacies SET wallet_credits = wallet_credits + $1
         WHERE id = $2
         RETURNING wallet_credits`,
        [amount, req.params.id]
      );
      if (balanceResult.rowCount === 0) {
        await client.query('ROLLBACK');
        res.status(404).json({ success: false, error: 'Not found' });
        return;
      }
    }
    await client.query(
      `INSERT INTO credit_transactions (pharmacy_id, type, amount, description)
       VALUES ($1, $2, $3, $4)`,
      [req.params.id, type, type === 'deduct' ? -amount : amount, description]
    );
    await client.query('COMMIT');
    console.log(`[admin] CREDITS pharmacy=${req.params.id} type=${type} amount=${amount} desc="${description}" at=${new Date().toISOString()}`);
    res.json({ success: true, balance: balanceResult.rows[0].wallet_credits });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// GET /admin/pharmacies/:id/credits
router.get('/pharmacies/:id/credits', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const offset = (page - 1) * limit;
  const [data, count] = await Promise.all([
    pool.query(
      `SELECT id, type, amount, description, razorpay_order_id, razorpay_payment_id, created_at
       FROM credit_transactions WHERE pharmacy_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [req.params.id, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM credit_transactions WHERE pharmacy_id = $1`,
      [req.params.id]
    ),
  ]);
  res.json({ data: data.rows, total: count.rows[0].total, page, limit });
});

// GET /admin/pharmacies/:id/messages
router.get('/pharmacies/:id/messages', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 50));
  const offset = (page - 1) * limit;
  const status = (req.query.status as string) || null;
  const VALID_STATUSES = ['sent', 'failed', 'delivered', 'read'];
  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ success: false, error: 'Invalid status filter' });
    return;
  }
  const [data, count] = await Promise.all([
    pool.query(
      `SELECT id, to_phone, channel, status, message_body, error, gupshup_msg_id, created_at
       FROM message_logs
       WHERE pharmacy_id = $1 AND ($2::text IS NULL OR status = $2)
       ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
      [req.params.id, status, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM message_logs
       WHERE pharmacy_id = $1 AND ($2::text IS NULL OR status = $2)`,
      [req.params.id, status]
    ),
  ]);
  res.json({ data: data.rows, total: count.rows[0].total, page, limit });
});

// GET /admin/credits
router.get('/credits', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100));
  const offset = (page - 1) * limit;
  const type = (req.query.type as string) || null;
  const VALID_TYPES = ['purchase', 'deduct'];
  if (type && !VALID_TYPES.includes(type)) {
    res.status(400).json({ success: false, error: 'Invalid type filter' });
    return;
  }
  const [data, count] = await Promise.all([
    pool.query(
      `SELECT ct.id, ct.type, ct.amount, ct.description,
              ct.razorpay_payment_id, ct.created_at,
              p.name AS pharmacy_name
       FROM credit_transactions ct
       JOIN pharmacies p ON p.id = ct.pharmacy_id
       WHERE ($1::text IS NULL OR ct.type = $1)
       ORDER BY ct.created_at DESC
       LIMIT $2 OFFSET $3`,
      [type, limit, offset]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS total FROM credit_transactions
       WHERE ($1::text IS NULL OR type = $1)`,
      [type]
    ),
  ]);
  res.json({ data: data.rows, total: count.rows[0].total, page, limit });
});

export default router;
```

- [ ] **Step 5: Mount admin router in app.ts**

In `backend/src/app.ts`, add after the existing imports:
```ts
import adminRouter from './routes/admin';
```

Add before `app.use(errorHandler)`:
```ts
if (process.env.ADMIN_ENABLED === 'true') {
  app.use('/api/v1/admin', adminRouter);
}
```

Also add the admin Vercel URL to the allowed CORS origins:
```ts
// In the allowedOrigins array, the existing /\.vercel\.app$/ regex already covers it.
// No change needed.
```

- [ ] **Step 6: Add ADMIN_SECRET to env file**

Add to `.env` (local only — Railway gets it via env var):
```
ADMIN_SECRET=your_admin_secret_minimum_32_chars_here
ADMIN_ENABLED=true
```

- [ ] **Step 7: Run admin tests**

```bash
cd backend && npm test -- --testPathPattern=admin.test.ts
```
Expected: All PASS.

- [ ] **Step 8: Run all tests**

```bash
cd backend && npm test
```
Expected: All PASS.

- [ ] **Step 9: Commit**

```bash
git add backend/src/routes/admin.ts backend/src/app.ts backend/tests/admin.test.ts
git commit -m "feat(admin): add protected admin API router with all endpoints"
```

---

### Task 4: Scaffold Admin Frontend

**Files:**
- Create: `admin-frontend/` (new Next.js 14 app)
- Create: `admin-frontend/.env.local`
- Create: `admin-frontend/lib/session.ts`
- Create: `admin-frontend/lib/api.ts`

**Interfaces:**
- Produces: `getSession()` → `{ isLoggedIn: boolean }`
- Produces: `adminFetch(path, options?)` → typed JSON response

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd C:/Users/spsou/Documents/Easibill
npx create-next-app@14.2.3 admin-frontend --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```
When prompted, accept all defaults.

- [ ] **Step 2: Install dependencies**

```bash
cd admin-frontend
npm install iron-session sonner lucide-react
npm install @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select
npm install class-variance-authority clsx tailwind-merge
npm install -D @types/node
```

- [ ] **Step 3: Install shadcn/ui**

```bash
cd admin-frontend
npx shadcn@latest init
```
When prompted: Style = Default, Base color = Zinc, CSS variables = Yes.

Add needed components:
```bash
npx shadcn@latest add button input label card table badge select alert-dialog dialog tabs sheet toast
```

- [ ] **Step 4: Create .env.local**

`admin-frontend/.env.local`:
```
ADMIN_SECRET=your_admin_secret_minimum_32_chars_here
SESSION_SECRET=another_random_secret_minimum_32_chars_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- [ ] **Step 5: Create lib/session.ts**

`admin-frontend/lib/session.ts`:
```ts
import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isLoggedIn: boolean;
}

const sessionOptions = {
  cookieName: 'easibill_admin_session',
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}
```

- [ ] **Step 6: Create lib/api.ts**

`admin-frontend/lib/api.ts`:
```ts
const BASE = process.env.NEXT_PUBLIC_API_URL || '';
const SECRET = process.env.ADMIN_SECRET || '';

export class AdminApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}/api/v1/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': SECRET,
      ...options.headers,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new AdminApiError(res.status, body.error || 'Request failed', body.code);
  }
  return res.json() as Promise<T>;
}
```

- [ ] **Step 7: Update globals.css and tailwind.config**

In `admin-frontend/app/globals.css`, keep the shadcn/ui base styles (already added by shadcn init). Ensure `@tailwind` directives are present.

- [ ] **Step 8: Update app/layout.tsx**

`admin-frontend/app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Easibill Admin',
  description: 'Internal admin dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Commit**

```bash
cd C:/Users/spsou/Documents/Easibill
git add admin-frontend/
git commit -m "feat(admin-frontend): scaffold Next.js 14 admin app with iron-session and shadcn/ui"
```

---

### Task 5: Login Page

**Files:**
- Create: `admin-frontend/app/login/page.tsx`
- Create: `admin-frontend/app/login/actions.ts`
- Delete: `admin-frontend/app/page.tsx` (replace with redirect)

**Interfaces:**
- Produces: `loginAction(formData)` server action → sets session, redirects to `/`

- [ ] **Step 1: Create login server action**

`admin-frontend/app/login/actions.ts`:
```ts
'use server';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;
  const expected = process.env.ADMIN_SECRET as string;

  if (!password || !expected || password !== expected) {
    redirect('/login?error=1');
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  redirect('/');
}
```

- [ ] **Step 2: Create login page**

`admin-frontend/app/login/page.tsx`:
```tsx
import { loginAction } from './actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-zinc-900 mb-1">Easibill Admin</h1>
        <p className="text-sm text-zinc-500 mb-6">Enter your admin secret to continue.</p>

        {searchParams.error && (
          <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
            Incorrect secret. Try again.
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Admin Secret
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 rounded-md border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="••••••••••••••••••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white rounded-md py-2 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Replace root page.tsx with redirect to /pharmacies**

`admin-frontend/app/page.tsx`:
```tsx
import { redirect } from 'next/navigation';
export default function RootPage() {
  redirect('/pharmacies');
}
```

- [ ] **Step 4: Start dev server and verify login works**

```bash
cd admin-frontend && npm run dev
```
Open `http://localhost:3000/login`. Enter the `ADMIN_SECRET` from `.env.local`. Should redirect to `/pharmacies`.

- [ ] **Step 5: Commit**

```bash
git add admin-frontend/app/login/ admin-frontend/app/page.tsx
git commit -m "feat(admin-frontend): add login page with iron-session server action"
```

---

### Task 6: Admin Layout + Overview Page

**Files:**
- Create: `admin-frontend/app/(admin)/layout.tsx`
- Create: `admin-frontend/app/(admin)/page.tsx` (redirects to `/pharmacies`)
- Create: `admin-frontend/app/(admin)/pharmacies/page.tsx` (placeholder — fleshed out in Task 7)

**Interfaces:**
- Consumes: `getSession()` — redirects to `/login` if not logged in
- Consumes: `adminFetch<OverviewStats>('/overview')`
- Produces: sidebar nav wrapping all `(admin)` pages

- [ ] **Step 1: Create admin layout with session guard and sidebar**

`admin-frontend/app/(admin)/layout.tsx`:
```tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, LogOut } from 'lucide-react';

const NAV = [
  { href: '/pharmacies', label: 'Pharmacies', Icon: Users },
  { href: '/credits', label: 'Credits Ledger', Icon: CreditCard },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.isLoggedIn) redirect('/login');

  return (
    <div className="min-h-screen flex bg-zinc-50">
      <aside className="hidden md:flex w-[220px] bg-white border-r border-zinc-200 flex-col shrink-0 fixed h-full z-30">
        <div className="px-4 py-5 border-b border-zinc-100">
          <p className="font-semibold text-sm text-zinc-900">Easibill</p>
          <p className="text-xs text-zinc-400">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-2 py-3 border-t border-zinc-100">
          <form action={async () => { 'use server'; const { getSession } = await import('@/lib/session'); const s = await getSession(); s.isLoggedIn = false; await s.save(); const { redirect } = await import('next/navigation'); redirect('/login'); }}>
            <button type="submit" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-zinc-500 hover:bg-zinc-100 w-full">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 md:ml-[220px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create overview page with stats cards**

`admin-frontend/app/(admin)/pharmacies/page.tsx` (placeholder for now — just a heading):
```tsx
export default function PharmaciesPage() {
  return <div className="p-6"><h1 className="text-xl font-semibold">Pharmacies</h1></div>;
}
```

`admin-frontend/app/(admin)/page.tsx`:
```tsx
import { redirect } from 'next/navigation';
export default function AdminIndexPage() {
  redirect('/pharmacies');
}
```

Create `admin-frontend/app/(admin)/overview/page.tsx`:
```tsx
import { adminFetch, AdminApiError } from '@/lib/api';
import { Users, MessageSquare, Wallet, Wifi, TrendingUp, Activity } from 'lucide-react';

interface OverviewStats {
  totalPharmacies: number;
  activePharmacies: number;
  totalPatients: number;
  totalMessages: number;
  totalCredits: number;
  waConnected: number;
  newSignups7d: number;
}

async function getStats(): Promise<OverviewStats | null> {
  try {
    return await adminFetch<OverviewStats>('/overview');
  } catch {
    return null;
  }
}

function StatCard({
  label, value, icon: Icon, error,
}: { label: string; value: string | number | null; icon: React.ElementType; error?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-zinc-500">{label}</p>
        <Icon className={`h-4 w-4 ${error ? 'text-amber-400' : 'text-zinc-400'}`} />
      </div>
      <p className={`text-2xl font-bold ${error ? 'text-zinc-300' : 'text-zinc-900'}`}>
        {value ?? '—'}
      </p>
    </div>
  );
}

export default async function OverviewPage() {
  const stats = await getStats();
  const e = stats === null;

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Pharmacies" value={e ? null : `${stats!.activePharmacies} / ${stats!.totalPharmacies}`} icon={Users} error={e} />
        <StatCard label="Total Patients" value={e ? null : stats!.totalPatients} icon={Users} error={e} />
        <StatCard label="Messages Sent" value={e ? null : stats!.totalMessages} icon={MessageSquare} error={e} />
        <StatCard label="Credits in Circulation" value={e ? null : stats!.totalCredits} icon={Wallet} error={e} />
        <StatCard label="WhatsApp Enabled" value={e ? null : stats!.waConnected} icon={Wifi} error={e} />
        <StatCard label="New Signups (7d)" value={e ? null : stats!.newSignups7d} icon={TrendingUp} error={e} />
      </div>
    </div>
  );
}
```

Update the sidebar nav to include Overview:
```tsx
// In layout.tsx, update NAV array:
const NAV = [
  { href: '/overview', label: 'Overview', Icon: LayoutDashboard },
  { href: '/pharmacies', label: 'Pharmacies', Icon: Users },
  { href: '/credits', label: 'Credits Ledger', Icon: CreditCard },
];
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/overview`. Should show 6 stat cards populated from the backend.

- [ ] **Step 4: Commit**

```bash
git add admin-frontend/app/\(admin\)/
git commit -m "feat(admin-frontend): add admin layout, session guard, and overview stats page"
```

---

### Task 7: Pharmacy List Page

**Files:**
- Modify: `admin-frontend/app/(admin)/pharmacies/page.tsx`
- Create: `admin-frontend/app/(admin)/pharmacies/PharmacyTable.tsx` (client component for search + mutations)

**Interfaces:**
- Consumes: `adminFetch<PharmaciesResponse>('/pharmacies?q=&page=&limit=50')`
- Consumes: `adminFetch('/pharmacies/:id', { method: 'PATCH', body: JSON.stringify({ field: value }) })`

- [ ] **Step 1: Create PharmacyTable client component**

`admin-frontend/app/(admin)/pharmacies/PharmacyTable.tsx`:
```tsx
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Search, X, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';

interface Pharmacy {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  plan: 'starter' | 'pro';
  wallet_credits: number;
  wa_connected: boolean;
  is_active: boolean;
  created_at: string;
  patient_count: number;
  message_count: number;
}

interface PharmaciesResponse {
  data: Pharmacy[];
  total: number;
  page: number;
  limit: number;
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-zinc-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function ConfirmToggle({
  open, onOpenChange, message, onConfirm,
}: { open: boolean; onOpenChange: (v: boolean) => void; message: string; onConfirm: () => void }) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl border border-zinc-200 shadow-lg p-6 w-full max-w-sm">
          <AlertDialog.Title className="font-semibold text-zinc-900 mb-2">Confirm action</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-zinc-500 mb-5">{message}</AlertDialog.Description>
          <div className="flex gap-2 justify-end">
            <AlertDialog.Cancel asChild>
              <button className="px-3 py-1.5 rounded-md text-sm border border-zinc-200 text-zinc-600 hover:bg-zinc-50">Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={onConfirm} className="px-3 py-1.5 rounded-md text-sm bg-zinc-900 text-white hover:bg-zinc-700">Continue</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default function PharmacyTable() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PharmaciesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [confirm, setConfirm] = useState<{ id: string; field: 'wa_connected' | 'is_active'; value: boolean; message: string } | null>(null);
  const [planLoading, setPlanLoading] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchData = useCallback(async (query: string, pg: number) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: '50' });
      if (query) params.set('q', query);
      const res = await fetch(`/api/admin/pharmacies?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchData(q, 1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [q, fetchData]);

  useEffect(() => {
    fetchData(q, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function patchPharmacy(id: string, field: string, value: unknown) {
    const res = await fetch(`/api/admin/pharmacies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok) throw new Error();
    return res.json();
  }

  async function handlePlanChange(pharmacy: Pharmacy, newPlan: string) {
    const prev = pharmacy.plan;
    setPlanLoading(pharmacy.id);
    try {
      await patchPharmacy(pharmacy.id, 'plan', newPlan);
      toast.success(`Plan updated to ${newPlan} for ${pharmacy.name}`);
      fetchData(q, page);
    } catch {
      toast.error('Failed to update plan');
    } finally {
      setPlanLoading(null);
    }
  }

  async function handleConfirmedToggle() {
    if (!confirm) return;
    try {
      await patchPharmacy(confirm.id, confirm.field, confirm.value);
      toast.success('Updated successfully');
      fetchData(q, page);
    } catch {
      toast.error('Update failed');
    } finally {
      setConfirm(null);
    }
  }

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 50);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, phone…"
          className="w-full pl-9 pr-8 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Failed to load pharmacies.
          <button onClick={() => fetchData(q, page)} className="underline ml-1">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {['Name', 'Email / Phone', 'Plan', 'Credits', 'Patients', 'Messages', 'WhatsApp', 'Status', 'Joined', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading && Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)}
            {!loading && !error && data?.data.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-zinc-400">
                  <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
                  No pharmacies yet
                </td>
              </tr>
            )}
            {!loading && data?.data.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900">{p.name}</p>
                  <p className="text-xs text-zinc-400">{p.owner_name}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{p.email}</p>
                  <p className="text-xs text-zinc-400">{p.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {planLoading === p.id && <span className="h-3 w-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />}
                    <select
                      value={p.plan}
                      onChange={(e) => handlePlanChange(p, e.target.value)}
                      disabled={planLoading === p.id}
                      className="text-sm border border-zinc-200 rounded px-2 py-1 bg-white"
                    >
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums">{p.wallet_credits}</td>
                <td className="px-4 py-3 tabular-nums">{p.patient_count}</td>
                <td className="px-4 py-3 tabular-nums">{p.message_count}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setConfirm({
                      id: p.id, field: 'wa_connected', value: !p.wa_connected,
                      message: p.wa_connected
                        ? 'Disconnecting WhatsApp will stop all reminders for this pharmacy. Continue?'
                        : 'Enable WhatsApp for this pharmacy?',
                    })}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.wa_connected ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}
                  >
                    {p.wa_connected ? 'Connected' : 'Disconnected'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setConfirm({
                      id: p.id, field: 'is_active', value: !p.is_active,
                      message: p.is_active
                        ? 'Deactivating this account will immediately block the pharmacy\'s login. Continue?'
                        : 'Reactivate this pharmacy account?',
                    })}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}
                  >
                    {p.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => router.push(`/pharmacies/${p.id}`)}
                    className="text-xs text-zinc-600 underline hover:text-zinc-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-zinc-500">
          <span>{total} pharmacies</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded hover:bg-zinc-100 disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 rounded hover:bg-zinc-100 disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmToggle
          open={true}
          onOpenChange={(v) => { if (!v) setConfirm(null); }}
          message={confirm.message}
          onConfirm={handleConfirmedToggle}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create proxy API route (Next.js → backend)**

The client component fetches `/api/admin/*` (same origin). Create a Next.js route handler that proxies to the backend with the secret.

`admin-frontend/app/api/admin/[...path]/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || '';
const SECRET = process.env.ADMIN_SECRET || '';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path, 'GET');
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path, 'POST');
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params.path, 'PATCH');
}

async function proxy(req: NextRequest, pathParts: string[], method: string) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const search = req.nextUrl.search;
  const url = `${BACKEND}/api/v1/admin/${pathParts.join('/')}${search}`;
  const body = method !== 'GET' ? await req.text() : undefined;

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
    body,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

- [ ] **Step 3: Update pharmacies page to use PharmacyTable**

`admin-frontend/app/(admin)/pharmacies/page.tsx`:
```tsx
import PharmacyTable from './PharmacyTable';

export default function PharmaciesPage() {
  return (
    <div className="p-6 max-w-7xl">
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Pharmacies</h1>
      <PharmacyTable />
    </div>
  );
}
```

- [ ] **Step 4: Test in browser**

Navigate to `http://localhost:3000/pharmacies`. Verify: table loads, search debounces, WA/status toggles show confirm dialog, plan dropdown saves with toast.

- [ ] **Step 5: Commit**

```bash
git add admin-frontend/app/\(admin\)/pharmacies/ admin-frontend/app/api/
git commit -m "feat(admin-frontend): pharmacy list with search, pagination, and guarded mutations"
```

---

### Task 8: Pharmacy Detail Page

**Files:**
- Create: `admin-frontend/app/(admin)/pharmacies/[id]/page.tsx`
- Create: `admin-frontend/app/(admin)/pharmacies/[id]/CreditsTab.tsx`
- Create: `admin-frontend/app/(admin)/pharmacies/[id]/MessagesTab.tsx`
- Create: `admin-frontend/app/(admin)/pharmacies/[id]/ResetPasswordTab.tsx`

- [ ] **Step 1: Create pharmacy detail page with tabs**

`admin-frontend/app/(admin)/pharmacies/[id]/page.tsx`:
```tsx
import { adminFetch } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import CreditsTab from './CreditsTab';
import MessagesTab from './MessagesTab';
import ResetPasswordTab from './ResetPasswordTab';
import OverviewTab from './OverviewTab';

const ONBOARDING: Record<number, string> = {
  0: 'Not started',
  1: 'Profile complete',
  2: 'WhatsApp connected',
  3: 'Onboarding complete',
};

export default async function PharmacyDetailPage({ params }: { params: { id: string } }) {
  let pharmacy: any;
  try {
    const res = await adminFetch<{ pharmacy: any }>(`/pharmacies/${params.id}`);
    pharmacy = res.pharmacy;
  } catch {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl">
      <Link href="/pharmacies" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 mb-4">
        <ChevronLeft className="h-4 w-4" /> Back to Pharmacies
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">{pharmacy.name}</h1>
        <p className="text-sm text-zinc-500">{pharmacy.email} · {pharmacy.phone}</p>
      </div>

      {/* Tab implementation using URL search params */}
      <PharmacyTabs pharmacyId={params.id} pharmacy={pharmacy} />
    </div>
  );
}

function PharmacyTabs({ pharmacyId, pharmacy }: { pharmacyId: string; pharmacy: any }) {
  return (
    <div>
      {/* Static tabs rendered as server component, tab switching via client */}
      <TabsClient pharmacyId={pharmacyId} pharmacy={pharmacy} />
    </div>
  );
}

// We need a client component for tab switching — import it
import TabsClient from './TabsClient';
```

- [ ] **Step 2: Create TabsClient**

`admin-frontend/app/(admin)/pharmacies/[id]/TabsClient.tsx`:
```tsx
'use client';
import { useState } from 'react';
import OverviewTab from './OverviewTab';
import CreditsTab from './CreditsTab';
import MessagesTab from './MessagesTab';
import ResetPasswordTab from './ResetPasswordTab';

const TABS = ['Overview', 'Credits', 'Messages', 'Reset Password'] as const;
type Tab = typeof TABS[number];

export default function TabsClient({ pharmacyId, pharmacy }: { pharmacyId: string; pharmacy: any }) {
  const [active, setActive] = useState<Tab>('Overview');

  return (
    <div>
      <div className="flex gap-1 border-b border-zinc-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active === t
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {active === 'Overview' && <OverviewTab pharmacy={pharmacy} pharmacyId={pharmacyId} />}
      {active === 'Credits' && <CreditsTab pharmacyId={pharmacyId} initialBalance={pharmacy.wallet_credits} />}
      {active === 'Messages' && <MessagesTab pharmacyId={pharmacyId} />}
      {active === 'Reset Password' && <ResetPasswordTab pharmacyId={pharmacyId} />}
    </div>
  );
}
```

- [ ] **Step 3: Create OverviewTab**

`admin-frontend/app/(admin)/pharmacies/[id]/OverviewTab.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const ONBOARDING: Record<number, string> = {
  0: 'Not started', 1: 'Profile complete', 2: 'WhatsApp connected', 3: 'Onboarding complete',
};

export default function OverviewTab({ pharmacy: initial, pharmacyId }: { pharmacy: any; pharmacyId: string }) {
  const [pharmacy, setPharmacy] = useState(initial);
  const [planLoading, setPlanLoading] = useState(false);
  const [confirm, setConfirm] = useState<{ field: string; value: boolean; msg: string } | null>(null);

  async function patch(field: string, value: unknown) {
    const res = await fetch(`/api/admin/pharmacies/${pharmacyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    setPharmacy(data.pharmacy);
  }

  async function handlePlanChange(plan: string) {
    setPlanLoading(true);
    try {
      await patch('plan', plan);
      toast.success(`Plan updated to ${plan}`);
    } catch {
      toast.error('Failed to update plan');
    } finally {
      setPlanLoading(false);
    }
  }

  async function handleConfirm() {
    if (!confirm) return;
    try {
      await patch(confirm.field, confirm.value);
      toast.success('Updated');
    } catch {
      toast.error('Failed');
    } finally {
      setConfirm(null);
    }
  }

  const rows = [
    ['Owner', pharmacy.owner_name],
    ['Email', pharmacy.email],
    ['Phone', pharmacy.phone],
    ['Timezone', pharmacy.timezone],
    ['Onboarding', ONBOARDING[pharmacy.onboarding_step] ?? pharmacy.onboarding_step],
    ['Joined', new Date(pharmacy.created_at).toLocaleDateString('en-IN')],
    ['Patients', pharmacy.patient_count],
    ['Messages', pharmacy.message_count],
    ['Reminder Template', pharmacy.reminder_template_name ?? '—'],
    ['Sale Template', pharmacy.sale_template_name ?? '—'],
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
        {rows.map(([label, value]) => (
          <div key={String(label)} className="flex px-5 py-3">
            <span className="text-sm text-zinc-400 w-44 shrink-0">{label}</span>
            <span className="text-sm text-zinc-900">{String(value)}</span>
          </div>
        ))}

        {/* Plan row */}
        <div className="flex items-center px-5 py-3">
          <span className="text-sm text-zinc-400 w-44 shrink-0">Plan</span>
          <div className="flex items-center gap-2">
            {planLoading && <span className="h-3 w-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />}
            <select
              value={pharmacy.plan}
              onChange={(e) => handlePlanChange(e.target.value)}
              disabled={planLoading}
              className="text-sm border border-zinc-200 rounded px-2 py-1"
            >
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center px-5 py-3">
          <span className="text-sm text-zinc-400 w-44 shrink-0">WhatsApp</span>
          <button
            onClick={() => setConfirm({ field: 'wa_connected', value: !pharmacy.wa_connected, msg: pharmacy.wa_connected ? 'Disconnect WhatsApp for this pharmacy?' : 'Enable WhatsApp for this pharmacy?' })}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${pharmacy.wa_connected ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}
          >
            {pharmacy.wa_connected ? 'Connected' : 'Disconnected'}
          </button>
        </div>

        {/* Active */}
        <div className="flex items-center px-5 py-3">
          <span className="text-sm text-zinc-400 w-44 shrink-0">Account Status</span>
          <button
            onClick={() => setConfirm({ field: 'is_active', value: !pharmacy.is_active, msg: pharmacy.is_active ? "Deactivating this account will immediately block the pharmacy's login. Continue?" : 'Reactivate this pharmacy?' })}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${pharmacy.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}
          >
            {pharmacy.is_active ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      {confirm && (
        <AlertDialog.Root open onOpenChange={(v) => { if (!v) setConfirm(null); }}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl border border-zinc-200 shadow-lg p-6 w-full max-w-sm">
              <AlertDialog.Title className="font-semibold mb-2">Confirm</AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-zinc-500 mb-5">{confirm.msg}</AlertDialog.Description>
              <div className="flex gap-2 justify-end">
                <AlertDialog.Cancel asChild><button className="px-3 py-1.5 rounded-md text-sm border border-zinc-200 text-zinc-600">Cancel</button></AlertDialog.Cancel>
                <AlertDialog.Action asChild><button onClick={handleConfirm} className="px-3 py-1.5 rounded-md text-sm bg-zinc-900 text-white">Continue</button></AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create CreditsTab**

`admin-frontend/app/(admin)/pharmacies/[id]/CreditsTab.tsx`:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Transaction {
  id: string; type: string; amount: number; description: string;
  razorpay_payment_id: string | null; created_at: string;
}

export default function CreditsTab({ pharmacyId, initialBalance }: { pharmacyId: string; initialBalance: number }) {
  const [balance, setBalance] = useState(initialBalance);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: 'purchase', amount: '', description: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadTx(pg: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pharmacies/${pharmacyId}/credits?page=${pg}&limit=50`);
      const data = await res.json();
      setTransactions(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTx(page); }, [page]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const amount = parseInt(form.amount, 10);
    if (!amount || amount <= 0) { setFormError('Enter a valid amount'); return; }
    if (form.type === 'deduct' && amount > balance) {
      setFormError(`Cannot deduct more than current balance of ${balance} credits`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/pharmacies/${pharmacyId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: form.type, amount, description: form.description }),
      });
      if (!res.ok) {
        const err = await res.json();
        if (err.code === 'INSUFFICIENT_CREDITS') setFormError(`Cannot deduct more than current balance of ${balance} credits`);
        else toast.error('Failed');
        return;
      }
      const data = await res.json();
      setBalance(data.balance);
      setForm({ type: 'purchase', amount: '', description: '' });
      toast.success(`Credits ${form.type === 'purchase' ? 'added' : 'deducted'} successfully`);
      loadTx(1);
      setPage(1);
    } finally {
      setSubmitting(false);
    }
  }

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-6">
      {/* Balance */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <p className="text-sm text-zinc-400 mb-1">Current Balance</p>
        <p className="text-4xl font-bold text-zinc-900">{balance} <span className="text-lg font-normal text-zinc-400">credits</span></p>
      </div>

      {/* Credit form */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h2 className="font-medium text-zinc-900 mb-4">Add / Deduct Credits</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="text-sm border border-zinc-200 rounded-md px-3 py-2">
              <option value="purchase">Add</option>
              <option value="deduct">Deduct</option>
            </select>
            <input
              type="number" min="1" placeholder="Amount"
              value={form.amount}
              onChange={(e) => { setForm({ ...form, amount: e.target.value }); setFormError(''); }}
              className="flex-1 text-sm border border-zinc-200 rounded-md px-3 py-2"
            />
          </div>
          {form.type === 'deduct' && (
            <p className="text-xs text-zinc-400">Current balance: {balance} credits</p>
          )}
          <input
            placeholder="Description (e.g. Manual top-up)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="w-full text-sm border border-zinc-200 rounded-md px-3 py-2"
          />
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <button
            type="submit" disabled={submitting}
            className="bg-zinc-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Apply'}
          </button>
        </form>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 text-sm font-medium text-zinc-700">Transaction History</div>
        {loading ? (
          <div className="p-6 text-center text-zinc-400 text-sm">Loading…</div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center text-zinc-400 text-sm">No transactions yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50">
              <tr>
                {['Date', 'Type', 'Amount', 'Description', 'Razorpay ID'].map((h) => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-zinc-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2 text-zinc-500 text-xs">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.type === 'purchase' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {t.type === 'purchase' ? 'Add' : 'Deduct'}
                    </span>
                  </td>
                  <td className="px-4 py-2 tabular-nums font-medium">{t.amount > 0 ? `+${t.amount}` : t.amount}</td>
                  <td className="px-4 py-2 text-zinc-500">{t.description}</td>
                  <td className="px-4 py-2 text-zinc-400 text-xs font-mono">{t.razorpay_payment_id ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm text-zinc-500">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create MessagesTab**

`admin-frontend/app/(admin)/pharmacies/[id]/MessagesTab.tsx`:
```tsx
'use client';
import { useState, useEffect } from 'react';
import * as Sheet from '@radix-ui/react-dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MessageLog {
  id: string; to_phone: string; channel: string; status: string;
  message_body: string; error: string | null; gupshup_msg_id: string | null; created_at: string;
}

const STATUSES = ['', 'sent', 'failed', 'delivered', 'read'];

export default function MessagesTab({ pharmacyId }: { pharmacyId: string }) {
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MessageLog | null>(null);

  async function load(pg: number, st: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: '50' });
      if (st) params.set('status', st);
      const res = await fetch(`/api/admin/pharmacies/${pharmacyId}/messages?${params}`);
      const data = await res.json();
      setMessages(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(page, status); }, [page, status]);

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="text-sm border border-zinc-200 rounded-md px-3 py-2"
        >
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <span className="text-sm text-zinc-400">{total} messages</span>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-zinc-400 text-sm">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-zinc-400 text-sm">{status ? 'No messages match this filter' : 'No messages sent yet'}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                {['Date', 'To', 'Status', 'Preview'].map((h) => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-zinc-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {messages.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50 cursor-pointer" onClick={() => setSelected(m)}>
                  <td className="px-4 py-2 text-zinc-400 text-xs">{new Date(m.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-2 font-mono text-xs">{m.to_phone}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.status === 'sent' || m.status === 'delivered' || m.status === 'read' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500 max-w-xs truncate">
                    {m.message_body.length > 60 ? m.message_body.slice(0, 60) + '…' : m.message_body}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm text-zinc-500">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}

      {/* Detail sheet */}
      <Sheet.Root open={!!selected} onOpenChange={(v) => { if (!v) setSelected(null); }}>
        <Sheet.Portal>
          <Sheet.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Sheet.Content className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Sheet.Title className="font-semibold text-zinc-900">Message Detail</Sheet.Title>
              <Sheet.Close asChild>
                <button className="p-1 rounded hover:bg-zinc-100"><X className="h-4 w-4" /></button>
              </Sheet.Close>
            </div>
            {selected && (
              <div className="space-y-4 text-sm">
                {[
                  ['To', selected.to_phone],
                  ['Status', selected.status],
                  ['Channel', selected.channel],
                  ['Date', new Date(selected.created_at).toLocaleString('en-IN')],
                  ['Gupshup ID', selected.gupshup_msg_id ?? '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-zinc-400 mb-0.5">{k}</p>
                    <p className="text-zinc-900">{v}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Message Body</p>
                  <pre className="bg-zinc-50 rounded-md p-3 text-xs whitespace-pre-wrap border border-zinc-200">{selected.message_body}</pre>
                </div>
                {selected.error && (
                  <div>
                    <p className="text-xs text-red-400 mb-0.5">Error</p>
                    <p className="text-red-600 text-xs">{selected.error}</p>
                  </div>
                )}
              </div>
            )}
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
    </div>
  );
}
```

- [ ] **Step 6: Create ResetPasswordTab**

`admin-frontend/app/(admin)/pharmacies/[id]/ResetPasswordTab.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ResetPasswordTab({ pharmacyId }: { pharmacyId: string }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const mismatch = touched && password !== confirm;
  const tooShort = touched && password.length > 0 && password.length < 8;
  const valid = password.length >= 8 && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/pharmacies/${pharmacyId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { toast.error('Failed to reset password'); return; }
      setPassword('');
      setConfirm('');
      setTouched(false);
      toast.success('Password updated. Share it with the pharmacy owner manually.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="font-medium text-zinc-900 mb-1">Reset Admin Password</h2>
        <p className="text-sm text-zinc-400 mb-5">No email will be sent. The pharmacy's existing login sessions will be invalidated immediately.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
            <input
              type="password" value={password} minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="Min. 8 characters"
            />
            {tooShort && <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Confirm Password</label>
            <input
              type="password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="Repeat password"
            />
            {mismatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
          </div>
          <button
            type="submit" disabled={!valid || submitting}
            className="bg-zinc-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Test pharmacy detail in browser**

Navigate to a pharmacy's detail page. Verify all 4 tabs render, credits form guards against overdraft, messages row click opens sheet, reset password validates and clears on success.

- [ ] **Step 8: Commit**

```bash
git add admin-frontend/app/\(admin\)/pharmacies/\[id\]/
git commit -m "feat(admin-frontend): pharmacy detail page with Overview, Credits, Messages, Reset Password tabs"
```

---

### Task 9: Global Credits Ledger

**Files:**
- Create: `admin-frontend/app/(admin)/credits/page.tsx`

- [ ] **Step 1: Create credits ledger page**

`admin-frontend/app/(admin)/credits/page.tsx`:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

interface CreditTx {
  id: string; type: string; amount: number; description: string;
  razorpay_payment_id: string | null; created_at: string; pharmacy_name: string;
}

export default function CreditsLedgerPage() {
  const [txs, setTxs] = useState<CreditTx[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load(pg: number, t: string) {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: '100' });
      if (t) params.set('type', t);
      const res = await fetch(`/api/admin/credits?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTxs(data.data);
      setTotal(data.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(page, type); }, [page, type]);

  const totalPages = Math.ceil(total / 100);

  return (
    <div className="p-6 max-w-6xl">
      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Credits Ledger</h1>

      <div className="flex items-center gap-3 mb-4">
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="text-sm border border-zinc-200 rounded-md px-3 py-2">
          <option value="">All types</option>
          <option value="purchase">Purchase (add)</option>
          <option value="deduct">Deduct</option>
        </select>
        <span className="text-sm text-zinc-400">{total} transactions</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4">
          <ShieldAlert className="h-4 w-4" />
          Failed to load.
          <button onClick={() => load(page, type)} className="underline ml-1">Retry</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-zinc-400 text-sm">Loading…</div>
        ) : txs.length === 0 ? (
          <div className="p-6 text-center text-zinc-400 text-sm">No credit transactions yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                {['Date', 'Pharmacy', 'Type', 'Amount', 'Description', 'Razorpay ID'].map((h) => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-zinc-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {txs.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2 text-zinc-400 text-xs">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-2 font-medium text-zinc-900">{t.pharmacy_name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.type === 'purchase' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {t.type === 'purchase' ? 'Add' : 'Deduct'}
                    </span>
                  </td>
                  <td className="px-4 py-2 tabular-nums font-medium">{t.amount > 0 ? `+${t.amount}` : t.amount}</td>
                  <td className="px-4 py-2 text-zinc-500">{t.description}</td>
                  <td className="px-4 py-2 text-zinc-400 text-xs font-mono">{t.razorpay_payment_id ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4 text-sm text-zinc-500">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Test in browser**

Navigate to `http://localhost:3000/credits`. Verify type filter works, pagination works, rows show correctly.

- [ ] **Step 3: Commit**

```bash
git add admin-frontend/app/\(admin\)/credits/
git commit -m "feat(admin-frontend): global credits ledger with type filter and pagination"
```

---

### Task 10: Railway + Vercel Deploy Config

**Files:**
- Modify: `.env` (document new vars — never commit values)
- Create: `admin-frontend/vercel.json`

- [ ] **Step 1: Set Railway env vars**

In Railway backend service → Variables, add:
```
ADMIN_SECRET=<generate with: openssl rand -hex 32>
ADMIN_ENABLED=true
```

- [ ] **Step 2: Set Vercel env vars for admin-frontend**

In Vercel project settings for `admin-frontend`:
```
ADMIN_SECRET=<same value as Railway>
SESSION_SECRET=<generate with: openssl rand -hex 32>
NEXT_PUBLIC_API_URL=https://<your-railway-backend-url>
```

- [ ] **Step 3: Create vercel.json for admin-frontend**

`admin-frontend/vercel.json`:
```json
{
  "framework": "nextjs"
}
```

- [ ] **Step 4: Deploy admin-frontend to Vercel**

```bash
cd admin-frontend && npx vercel --prod
```
Follow prompts. Link to a new Vercel project named `easibill-admin`.

- [ ] **Step 5: Run migrations on production DB**

```bash
cd backend && DATABASE_URL=<production-db-url> npx ts-node src/db/migrate.ts
```

- [ ] **Step 6: Final smoke test**

Open the Vercel admin URL. Log in with `ADMIN_SECRET`. Verify overview loads, pharmacy list shows real data, credit top-up works, password reset works.

- [ ] **Step 7: Final commit**

```bash
git add admin-frontend/vercel.json
git commit -m "feat(admin-frontend): add vercel.json for deployment"
```
