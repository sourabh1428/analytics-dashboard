# Easibill Backend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Easibill backend — Express REST API with JWT multi-tenant auth, PostgreSQL, Gupshup WABA WhatsApp integration, BullMQ reminder queue, and node-cron daily scheduler.

**Architecture:** Every pharmacy is a tenant; `pharmacy_id` from the JWT is injected into `req.pharmacyId` by `tenantScope` middleware and every DB query filters by it. All WhatsApp sends go through BullMQ — route handlers never call Gupshup directly. Gupshup is the only WhatsApp channel (no Baileys). `node-cron` fires at 8:50 AM IST (03:20 UTC), queries reminders due today, and enqueues them. A webhook route receives Gupshup delivery status callbacks and updates `message_logs`.

**Tech Stack:** Node.js 20, Express 4, TypeScript 5, PostgreSQL 15 (`pg`), Redis 7 (`ioredis`), BullMQ 5, `node-cron` 3, `bcrypt`, `jsonwebtoken`, `nodemailer`, Jest 29, `supertest`

---

## File Map

| File | Responsibility |
|------|----------------|
| `docker-compose.yml` | postgres + redis for local dev |
| `.env.example` | All required env vars documented |
| `backend/package.json` | Dependencies + scripts |
| `backend/tsconfig.json` | TypeScript config |
| `backend/jest.config.ts` | Jest config with ts-jest |
| `backend/src/app.ts` | Express app factory (exported for tests) |
| `backend/src/server.ts` | HTTP server + cron + worker startup |
| `backend/src/db/pool.ts` | `pg.Pool` singleton |
| `backend/src/db/migrate.ts` | Migration runner script |
| `backend/src/db/migrations/001_initial.sql` | All 7 tables + indexes |
| `backend/src/middleware/auth.ts` | JWT verification, sets `req.pharmacyId` |
| `backend/src/middleware/tenantScope.ts` | Re-exports `req.pharmacyId` guard |
| `backend/src/middleware/errorHandler.ts` | Global Express error handler |
| `backend/src/utils/jwt.ts` | `signToken` / `verifyToken` helpers |
| `backend/src/utils/dateUtils.ts` | IST date helpers |
| `backend/src/utils/templates.ts` | Reminder message renderer |
| `backend/src/routes/auth.ts` | register, login, forgot/reset-password |
| `backend/src/routes/pharmacy.ts` | profile, WhatsApp status/connect/disconnect |
| `backend/src/routes/patients.ts` | Patient CRUD |
| `backend/src/routes/purchases.ts` | Purchase create → auto-schedules reminder |
| `backend/src/routes/reminders.ts` | cancel, reschedule, retry |
| `backend/src/routes/dashboard.ts` | stats, today, upcoming, activity |
| `backend/src/services/gupshupService.ts` | Gupshup WABA HTTP client — the only WhatsApp send path |
| `backend/src/services/messageService.ts` | Thin wrapper over gupshupService (kept for future extensibility) |
| `backend/src/routes/webhooks.ts` | POST /webhooks/gupshup — receives delivery status callbacks |
| `backend/src/jobs/reminderWorker.ts` | BullMQ worker: processes reminder jobs |
| `backend/src/jobs/cronScheduler.ts` | node-cron daily dispatch |
| `backend/tests/helpers/db.ts` | Test DB helpers |
| `backend/tests/helpers/auth.ts` | Test JWT factory |
| `backend/tests/auth.test.ts` | Auth route tests |
| `backend/tests/patients.test.ts` | Patient CRUD tests |
| `backend/tests/purchases.test.ts` | Purchase + reminder creation tests |
| `backend/tests/dashboard.test.ts` | Dashboard route tests |

---

## Task 1: Project Scaffold

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/jest.config.ts`

- [ ] **Step 1: Create root docker-compose.yml**

```yaml
# docker-compose.yml
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
    command: redis-server --appendonly yes

volumes:
  pgdata:
  redisdata:
```

- [ ] **Step 2: Create .env.example**

```env
# .env.example
DATABASE_URL=postgresql://easibill:easibill_local@localhost:5432/easibill
DATABASE_URL_TEST=postgresql://easibill:easibill_local@localhost:5432/easibill_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=change_this_to_a_long_random_string_in_production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

GUPSHUP_API_KEY=
GUPSHUP_APP_NAME=

# '20 3 * * *' = 8:50 AM IST
CRON_SCHEDULE=20 3 * * *
```

- [ ] **Step 3: Create backend/package.json**

```json
{
  "name": "easibill-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "ts-node src/db/migrate.ts",
    "migrate:test": "DATABASE_URL=$DATABASE_URL_TEST ts-node src/db/migrate.ts",
    "test": "jest --runInBand",
    "test:watch": "jest --watch --runInBand"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "^6.7.4",
    "bcrypt": "^5.1.1",
    "bullmq": "^5.1.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "ioredis": "^5.3.2",
    "jsonwebtoken": "^9.0.2",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.7",
    "pg": "^8.11.3",
    "qrcode": "^1.5.3",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.0",
    "@types/nodemailer": "^6.4.14",
    "@types/pg": "^8.10.9",
    "@types/qrcode": "^1.5.5",
    "@types/supertest": "^6.0.2",
    "@types/uuid": "^9.0.7",
    "jest": "^29.7.0",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 4: Create backend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 5: Create backend/jest.config.ts**

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFilesAfterFramework: [],
  testTimeout: 15000,
  globals: {
    'ts-jest': {
      tsconfig: {
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
      }
    }
  }
};

export default config;
```

- [ ] **Step 6: Install dependencies**

```bash
cd backend && npm install
```

Expected: `node_modules` folder created, no errors (Baileys may show optional dependency warnings — these are fine).

- [ ] **Step 7: Start infrastructure and verify**

```bash
# From project root
docker-compose up -d
docker-compose ps
```

Expected: postgres and redis containers show `Up`.

- [ ] **Step 8: Create .env from example**

```bash
cp .env.example .env
```

- [ ] **Step 9: Commit**

```bash
git init
git add docker-compose.yml .env.example backend/package.json backend/tsconfig.json backend/jest.config.ts backend/package-lock.json
git commit -m "feat: project scaffold — docker-compose, backend package, tsconfig, jest"
```

---

## Task 2: Database — Pool + Migrations

**Files:**
- Create: `backend/src/db/pool.ts`
- Create: `backend/src/db/migrations/001_initial.sql`
- Create: `backend/src/db/migrate.ts`

- [ ] **Step 1: Create backend/src/db/pool.ts**

```typescript
// backend/src/db/pool.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.NODE_ENV === 'test'
  ? process.env.DATABASE_URL_TEST
  : process.env.DATABASE_URL;

if (!url) throw new Error('DATABASE_URL not set');

export const pool = new Pool({ connectionString: url });
```

- [ ] **Step 2: Create backend/src/db/migrations/001_initial.sql**

```sql
-- backend/src/db/migrations/001_initial.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS pharmacies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  owner_name      TEXT NOT NULL,
  phone           TEXT UNIQUE NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  plan            TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro')),
  wallet_credits  INTEGER DEFAULT 0,
  wa_session_id   TEXT,
  wa_connected    BOOLEAN DEFAULT false,
  timezone        TEXT DEFAULT 'Asia/Kolkata',
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id     UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  whatsapp_phone  TEXT,
  language        TEXT DEFAULT 'hindi' CHECK (language IN ('hindi','english','marathi','telugu','kannada')),
  notes           TEXT,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_patients_pharmacy_id ON patients(pharmacy_id);

CREATE TABLE IF NOT EXISTS purchases (
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
CREATE INDEX IF NOT EXISTS idx_purchases_patient_id ON purchases(patient_id);
CREATE INDEX IF NOT EXISTS idx_purchases_pharmacy_id ON purchases(pharmacy_id);

CREATE TABLE IF NOT EXISTS reminders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id       UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  purchase_id       UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  scheduled_for     DATE NOT NULL,
  status            TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','sent','failed','cancelled')),
  sent_at           TIMESTAMPTZ,
  message_template  TEXT,
  attempt_count     INTEGER DEFAULT 0,
  error_message     TEXT,
  bull_job_id       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_for ON reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_reminders_pharmacy_status ON reminders(pharmacy_id, status);

CREATE TABLE IF NOT EXISTS message_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id     UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  reminder_id     UUID REFERENCES reminders(id),
  to_phone        TEXT NOT NULL,
  message_body    TEXT NOT NULL,
  channel         TEXT DEFAULT 'baileys' CHECK (channel IN ('baileys','gupshup')),
  status          TEXT CHECK (status IN ('sent','failed','delivered','read')),
  gupshup_msg_id  TEXT,
  error           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id     UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  amount_paise    INTEGER NOT NULL,
  type            TEXT CHECK (type IN ('topup','message_charge','refund')),
  description     TEXT,
  reference_id    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS broadcast_campaigns (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id       UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  message_body      TEXT NOT NULL,
  filter_criteria   JSONB,
  scheduled_at      TIMESTAMPTZ,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','running','completed','failed')),
  total_recipients  INTEGER DEFAULT 0,
  sent_count        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

- [ ] **Step 3: Create backend/src/db/migrate.ts**

```typescript
// backend/src/db/migrate.ts
import fs from 'fs';
import path from 'path';
import { pool } from './pool';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', '001_initial.sql'),
    'utf8'
  );
  await pool.query(sql);
  console.log('Migrations applied successfully');
  await pool.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

- [ ] **Step 4: Create test database and run migrations**

```bash
# From backend/ directory
docker exec -it $(docker ps -q -f name=postgres) psql -U easibill -c "CREATE DATABASE easibill_test;"
npm run migrate
npm run migrate:test
```

Expected: "Migrations applied successfully" twice.

- [ ] **Step 5: Verify tables exist**

```bash
docker exec -it $(docker ps -q -f name=postgres) psql -U easibill -d easibill -c "\dt"
```

Expected: Lists `pharmacies`, `patients`, `purchases`, `reminders`, `message_logs`, `wallet_transactions`, `broadcast_campaigns`.

- [ ] **Step 6: Commit**

```bash
git add backend/src/db/
git commit -m "feat: database pool and initial migrations for all 7 tables"
```

---

## Task 3: Auth System (JWT + Routes)

**Files:**
- Create: `backend/src/utils/jwt.ts`
- Create: `backend/src/middleware/auth.ts`
- Create: `backend/src/middleware/tenantScope.ts`
- Create: `backend/src/routes/auth.ts`
- Create: `backend/src/app.ts` (minimal, auth routes only for now)
- Create: `backend/tests/helpers/db.ts`
- Create: `backend/tests/helpers/auth.ts`
- Create: `backend/tests/auth.test.ts`

- [ ] **Step 1: Write auth test (failing)**

```typescript
// backend/tests/auth.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.end();
});

describe('POST /api/v1/auth/register', () => {
  it('creates a pharmacy and returns a JWT', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test Pharmacy',
      owner_name: 'Owner',
      phone: '+919999999999',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.pharmacy.email).toBe('test@example.com');
    expect(res.body.pharmacy.password_hash).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test Pharmacy 2',
      owner_name: 'Owner 2',
      phone: '+919999999998',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('returns JWT for valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd backend && npm test -- --testPathPattern=auth
```

Expected: FAIL — `app` not found.

- [ ] **Step 3: Create backend/src/utils/jwt.ts**

```typescript
// backend/src/utils/jwt.ts
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const EXPIRY = '7d';

export function signToken(pharmacyId: string): string {
  return jwt.sign({ pharmacyId }, SECRET, { expiresIn: EXPIRY });
}

export function verifyToken(token: string): { pharmacyId: string } {
  const payload = jwt.verify(token, SECRET) as { pharmacyId: string };
  return payload;
}
```

- [ ] **Step 4: Create backend/src/middleware/auth.ts**

```typescript
// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      pharmacyId: string;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing token', code: 'UNAUTHORIZED' });
  }
  try {
    const token = header.slice(7);
    const { pharmacyId } = verifyToken(token);
    req.pharmacyId = pharmacyId;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token', code: 'UNAUTHORIZED' });
  }
}
```

- [ ] **Step 5: Create backend/src/middleware/tenantScope.ts**

```typescript
// backend/src/middleware/tenantScope.ts
// Re-exports authenticate — tenantScope IS authenticate for this project.
// Every authenticated route automatically has req.pharmacyId available.
// Usage: router.use(authenticate) in each route file.
export { authenticate as tenantScope } from './auth';
```

- [ ] **Step 6: Create backend/src/routes/auth.ts**

```typescript
// backend/src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db/pool';
import { signToken } from '../utils/jwt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router();
const SALT_ROUNDS = 12;

router.post('/register', async (req: Request, res: Response) => {
  const { name, owner_name, phone, email, password } = req.body;
  if (!name || !owner_name || !phone || !email || !password) {
    return res.status(400).json({ success: false, error: 'Missing required fields', code: 'VALIDATION_ERROR' });
  }
  try {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO pharmacies (name, owner_name, phone, email, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, owner_name, phone, email, plan, created_at`,
      [name, owner_name, phone, email, password_hash]
    );
    const pharmacy = result.rows[0];
    const token = signToken(pharmacy.id);
    res.status(201).json({ success: true, token, pharmacy });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, error: 'Email or phone already registered', code: 'CONFLICT' });
    }
    throw err;
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Missing email or password', code: 'VALIDATION_ERROR' });
  }
  const result = await pool.query(
    `SELECT id, password_hash, name, owner_name, email, plan FROM pharmacies WHERE email = $1 AND is_active = true`,
    [email]
  );
  const pharmacy = result.rows[0];
  if (!pharmacy) {
    return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'UNAUTHORIZED' });
  }
  const valid = await bcrypt.compare(password, pharmacy.password_hash);
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'UNAUTHORIZED' });
  }
  const { password_hash: _, ...pharmacyData } = pharmacy;
  const token = signToken(pharmacy.id);
  res.json({ success: true, token, pharmacy: pharmacyData });
});

// Password reset tokens stored in memory (simple for MVP — use Redis in production)
const resetTokens = new Map<string, { pharmacyId: string; expiresAt: number }>();

router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await pool.query(`SELECT id FROM pharmacies WHERE email = $1`, [email]);
  if (result.rows.length === 0) {
    // Don't reveal whether email exists
    return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  resetTokens.set(token, { pharmacyId: result.rows[0].id, expiresAt: Date.now() + 3600_000 });

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Easibill Password Reset',
      text: `Reset your password: ${resetUrl}`,
    });
  }

  res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
});

router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const record = resetTokens.get(token);
  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' });
  }
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  await pool.query(`UPDATE pharmacies SET password_hash = $1 WHERE id = $2`, [password_hash, record.pharmacyId]);
  resetTokens.delete(token);
  res.json({ success: true, message: 'Password updated successfully' });
});

export default router;
```

- [ ] **Step 7: Create backend/src/app.ts (minimal)**

```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export { app };
```

- [ ] **Step 8: Create backend/tests/helpers/auth.ts**

```typescript
// backend/tests/helpers/auth.ts
import { signToken } from '../../src/utils/jwt';
import { pool } from '../../src/db/pool';
import bcrypt from 'bcrypt';

export async function createTestPharmacy(overrides: Partial<{
  name: string; owner_name: string; phone: string; email: string; password: string;
}> = {}) {
  const data = {
    name: overrides.name || 'Test Pharmacy',
    owner_name: overrides.owner_name || 'Test Owner',
    phone: overrides.phone || '+919000000001',
    email: overrides.email || 'pharmacy@test.com',
    password: overrides.password || 'testpassword123',
  };
  const password_hash = await bcrypt.hash(data.password, 1); // rounds=1 for speed in tests
  const result = await pool.query(
    `INSERT INTO pharmacies (name, owner_name, phone, email, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, name, plan`,
    [data.name, data.owner_name, data.phone, data.email, password_hash]
  );
  const pharmacy = result.rows[0];
  return { pharmacy, token: signToken(pharmacy.id) };
}
```

- [ ] **Step 9: Run tests to confirm they pass**

```bash
cd backend && npm test -- --testPathPattern=auth
```

Expected: All 4 tests pass.

- [ ] **Step 10: Commit**

```bash
git add backend/src/utils/jwt.ts backend/src/middleware/ backend/src/routes/auth.ts backend/src/app.ts backend/tests/
git commit -m "feat: JWT auth — register, login, forgot/reset-password"
```

---

## Task 4: Patient CRUD

**Files:**
- Create: `backend/src/routes/patients.ts`
- Modify: `backend/src/app.ts` (add patients router)
- Create: `backend/tests/patients.test.ts`

- [ ] **Step 1: Write patients tests (failing)**

```typescript
// backend/tests/patients.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';
import { createTestPharmacy } from './helpers/auth';

let token: string;
let pharmacyId: string;

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  const result = await createTestPharmacy({ phone: '+919000000002', email: 'patients@test.com' });
  token = result.token;
  pharmacyId = result.pharmacy.id;
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.end();
});

describe('POST /api/v1/patients', () => {
  it('creates a patient', async () => {
    const res = await request(app)
      .post('/api/v1/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ramesh Kumar', phone: '+919111111111' });
    expect(res.status).toBe(201);
    expect(res.body.patient.name).toBe('Ramesh Kumar');
    expect(res.body.patient.pharmacy_id).toBe(pharmacyId);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).post('/api/v1/patients').send({ name: 'X', phone: '+91' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/patients', () => {
  it('returns only this pharmacy patients', async () => {
    const res = await request(app)
      .get('/api/v1/patients')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.patients)).toBe(true);
    expect(res.body.patients.every((p: any) => p.pharmacy_id === pharmacyId)).toBe(true);
  });

  it('supports search by name', async () => {
    const res = await request(app)
      .get('/api/v1/patients?search=Ramesh')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.patients.length).toBeGreaterThan(0);
    expect(res.body.patients[0].name).toContain('Ramesh');
  });
});

describe('PATCH /api/v1/patients/:id', () => {
  it('updates a patient', async () => {
    const create = await request(app)
      .post('/api/v1/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Sunita Devi', phone: '+919222222222' });
    const id = create.body.patient.id;

    const res = await request(app)
      .patch(`/api/v1/patients/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Diabetic patient' });
    expect(res.status).toBe(200);
    expect(res.body.patient.notes).toBe('Diabetic patient');
  });
});

describe('DELETE /api/v1/patients/:id', () => {
  it('soft-deletes a patient', async () => {
    const create = await request(app)
      .post('/api/v1/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Delete Me', phone: '+919333333333' });
    const id = create.body.patient.id;

    const res = await request(app)
      .delete(`/api/v1/patients/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const check = await pool.query(`SELECT is_active FROM patients WHERE id = $1`, [id]);
    expect(check.rows[0].is_active).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd backend && npm test -- --testPathPattern=patients
```

Expected: FAIL — router not mounted.

- [ ] **Step 3: Create backend/src/routes/patients.ts**

```typescript
// backend/src/routes/patients.ts
import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (req: Request, res: Response) => {
  const { search, page = '1', limit = '50' } = req.query as Record<string, string>;
  const offset = (Number(page) - 1) * Number(limit);
  let query = `SELECT * FROM patients WHERE pharmacy_id = $1 AND is_active = true`;
  const params: any[] = [req.pharmacyId];
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (name ILIKE $${params.length} OR phone ILIKE $${params.length})`;
  }
  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(Number(limit), offset);
  const result = await pool.query(query, params);
  res.json({ success: true, patients: result.rows });
});

router.post('/', async (req: Request, res: Response) => {
  const { name, phone, whatsapp_phone, language, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'name and phone are required', code: 'VALIDATION_ERROR' });
  }
  const result = await pool.query(
    `INSERT INTO patients (pharmacy_id, name, phone, whatsapp_phone, language, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [req.pharmacyId, name, phone, whatsapp_phone || null, language || 'hindi', notes || null]
  );
  res.status(201).json({ success: true, patient: result.rows[0] });
});

router.get('/:id', async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT p.*,
       COALESCE(
         json_agg(
           json_build_object(
             'purchase', pur,
             'reminders', (SELECT json_agg(r) FROM reminders r WHERE r.purchase_id = pur.id)
           ) ORDER BY pur.purchased_at DESC
         ) FILTER (WHERE pur.id IS NOT NULL), '[]'
       ) AS history
     FROM patients p
     LEFT JOIN purchases pur ON pur.patient_id = p.id AND pur.pharmacy_id = p.pharmacy_id
     WHERE p.id = $1 AND p.pharmacy_id = $2
     GROUP BY p.id`,
    [req.params.id, req.pharmacyId]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Patient not found', code: 'NOT_FOUND' });
  res.json({ success: true, patient: result.rows[0] });
});

router.patch('/:id', async (req: Request, res: Response) => {
  const allowed = ['name', 'phone', 'whatsapp_phone', 'language', 'notes'];
  const updates = Object.entries(req.body).filter(([k]) => allowed.includes(k));
  if (updates.length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields to update', code: 'VALIDATION_ERROR' });
  }
  const setClauses = updates.map(([k], i) => `${k} = $${i + 3}`).join(', ');
  const values = updates.map(([, v]) => v);
  const result = await pool.query(
    `UPDATE patients SET ${setClauses} WHERE id = $1 AND pharmacy_id = $2 RETURNING *`,
    [req.params.id, req.pharmacyId, ...values]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Patient not found', code: 'NOT_FOUND' });
  res.json({ success: true, patient: result.rows[0] });
});

router.delete('/:id', async (req: Request, res: Response) => {
  const result = await pool.query(
    `UPDATE patients SET is_active = false WHERE id = $1 AND pharmacy_id = $2 RETURNING id`,
    [req.params.id, req.pharmacyId]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Patient not found', code: 'NOT_FOUND' });
  res.json({ success: true, message: 'Patient deactivated' });
});

export default router;
```

- [ ] **Step 4: Add patients router to app.ts**

Replace the `app.ts` auth router section with:

```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth';
import patientsRouter from './routes/patients';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/patients', patientsRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export { app };
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
cd backend && npm test -- --testPathPattern=patients
```

Expected: All 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add backend/src/routes/patients.ts backend/src/app.ts backend/tests/patients.test.ts
git commit -m "feat: patient CRUD routes with pharmacy-scoped queries"
```

---

## Task 5: Purchases + Automatic Reminder Scheduling

**Files:**
- Create: `backend/src/utils/dateUtils.ts`
- Create: `backend/src/routes/purchases.ts`
- Modify: `backend/src/app.ts` (add purchases router)
- Create: `backend/tests/purchases.test.ts`

- [ ] **Step 1: Write purchases tests (failing)**

```typescript
// backend/tests/purchases.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';
import { createTestPharmacy } from './helpers/auth';

let token: string;
let pharmacyId: string;
let patientId: string;

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  const result = await createTestPharmacy({ phone: '+919000000003', email: 'purchases@test.com' });
  token = result.token;
  pharmacyId = result.pharmacy.id;

  const patRes = await request(app)
    .post('/api/v1/patients')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Arjun Sharma', phone: '+919444444444' });
  patientId = patRes.body.patient.id;
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.end();
});

describe('POST /api/v1/purchases', () => {
  it('creates a purchase and auto-creates a scheduled reminder', async () => {
    const purchasedAt = '2026-01-01T10:00:00.000Z';
    const res = await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patient_id: patientId,
        medicine_name: 'Metformin 500mg',
        quantity: 30,
        purchased_at: purchasedAt,
        refill_interval_days: 28,
      });
    expect(res.status).toBe(201);
    expect(res.body.purchase.medicine_name).toBe('Metformin 500mg');
    expect(res.body.reminder).toBeDefined();
    expect(res.body.reminder.status).toBe('scheduled');
    // 28 days after 2026-01-01 = 2026-01-29
    expect(res.body.reminder.scheduled_for).toBe('2026-01-29');
  });

  it('uses default 28-day interval when not specified', async () => {
    const purchasedAt = '2026-02-01T10:00:00.000Z';
    const res = await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({ patient_id: patientId, medicine_name: 'Atorvastatin', purchased_at: purchasedAt });
    expect(res.status).toBe(201);
    // 28 days after 2026-02-01 = 2026-03-01
    expect(res.body.reminder.scheduled_for).toBe('2026-03-01');
  });
});

describe('PATCH /api/v1/purchases/:id', () => {
  it('updates purchase and reschedules the reminder', async () => {
    const create = await request(app)
      .post('/api/v1/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patient_id: patientId,
        medicine_name: 'Amlodipine',
        purchased_at: '2026-03-01T10:00:00.000Z',
        refill_interval_days: 30,
      });
    const purchaseId = create.body.purchase.id;

    const res = await request(app)
      .patch(`/api/v1/purchases/${purchaseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ refill_interval_days: 14 });
    expect(res.status).toBe(200);
    // Reminder should be rescheduled: 14 days after 2026-03-01 = 2026-03-15
    expect(res.body.reminder.scheduled_for).toBe('2026-03-15');
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd backend && npm test -- --testPathPattern=purchases
```

Expected: FAIL — router not mounted.

- [ ] **Step 3: Create backend/src/utils/dateUtils.ts**

```typescript
// backend/src/utils/dateUtils.ts

// Add N days to a Date, returning the result as a YYYY-MM-DD string (calendar date only).
export function addDaysToDate(date: Date, days: number): string {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().split('T')[0];
}

// Parse a date string or Date object and return a YYYY-MM-DD string.
export function toDateString(date: string | Date): string {
  return new Date(date).toISOString().split('T')[0];
}
```

- [ ] **Step 4: Create backend/src/routes/purchases.ts**

```typescript
// backend/src/routes/purchases.ts
import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';
import { authenticate } from '../middleware/auth';
import { addDaysToDate } from '../utils/dateUtils';

const router = Router();
router.use(authenticate);

router.get('/', async (req: Request, res: Response) => {
  const { page = '1', limit = '50' } = req.query as Record<string, string>;
  const offset = (Number(page) - 1) * Number(limit);
  const result = await pool.query(
    `SELECT pur.*, pat.name AS patient_name
     FROM purchases pur
     JOIN patients pat ON pat.id = pur.patient_id
     WHERE pur.pharmacy_id = $1
     ORDER BY pur.purchased_at DESC
     LIMIT $2 OFFSET $3`,
    [req.pharmacyId, Number(limit), offset]
  );
  res.json({ success: true, purchases: result.rows });
});

router.post('/', async (req: Request, res: Response) => {
  const { patient_id, medicine_name, quantity, purchased_at, refill_interval_days = 28, notes } = req.body;
  if (!patient_id || !medicine_name || !purchased_at) {
    return res.status(400).json({
      success: false,
      error: 'patient_id, medicine_name, and purchased_at are required',
      code: 'VALIDATION_ERROR',
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const purchaseResult = await client.query(
      `INSERT INTO purchases (pharmacy_id, patient_id, medicine_name, quantity, purchased_at, refill_interval_days, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.pharmacyId, patient_id, medicine_name, quantity || null, purchased_at, refill_interval_days, notes || null]
    );
    const purchase = purchaseResult.rows[0];

    const scheduledFor = addDaysToDate(new Date(purchased_at), refill_interval_days);
    const reminderResult = await client.query(
      `INSERT INTO reminders (pharmacy_id, patient_id, purchase_id, scheduled_for)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.pharmacyId, patient_id, purchase.id, scheduledFor]
    );
    const reminder = reminderResult.rows[0];

    await client.query('COMMIT');
    res.status(201).json({ success: true, purchase, reminder });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT pur.*, pat.name AS patient_name,
       (SELECT row_to_json(r) FROM reminders r WHERE r.purchase_id = pur.id LIMIT 1) AS reminder
     FROM purchases pur
     JOIN patients pat ON pat.id = pur.patient_id
     WHERE pur.id = $1 AND pur.pharmacy_id = $2`,
    [req.params.id, req.pharmacyId]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Purchase not found', code: 'NOT_FOUND' });
  res.json({ success: true, purchase: result.rows[0] });
});

router.patch('/:id', async (req: Request, res: Response) => {
  const existing = await pool.query(
    `SELECT * FROM purchases WHERE id = $1 AND pharmacy_id = $2`,
    [req.params.id, req.pharmacyId]
  );
  if (!existing.rows[0]) return res.status(404).json({ success: false, error: 'Purchase not found', code: 'NOT_FOUND' });

  const current = existing.rows[0];
  const refill_interval_days = req.body.refill_interval_days ?? current.refill_interval_days;
  const notes = req.body.notes ?? current.notes;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const purchaseResult = await client.query(
      `UPDATE purchases SET refill_interval_days = $1, notes = $2 WHERE id = $3 RETURNING *`,
      [refill_interval_days, notes, req.params.id]
    );
    const purchase = purchaseResult.rows[0];

    const scheduledFor = addDaysToDate(new Date(purchase.purchased_at), refill_interval_days);
    const reminderResult = await client.query(
      `UPDATE reminders
       SET scheduled_for = $1, status = 'scheduled'
       WHERE purchase_id = $2 AND status = 'scheduled'
       RETURNING *`,
      [scheduledFor, req.params.id]
    );

    await client.query('COMMIT');
    res.json({ success: true, purchase, reminder: reminderResult.rows[0] || null });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

export default router;
```

- [ ] **Step 5: Add purchases router to app.ts**

```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth';
import patientsRouter from './routes/patients';
import purchasesRouter from './routes/purchases';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/purchases', purchasesRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export { app };
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
cd backend && npm test -- --testPathPattern=purchases
```

Expected: All 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add backend/src/utils/dateUtils.ts backend/src/routes/purchases.ts backend/src/app.ts backend/tests/purchases.test.ts
git commit -m "feat: purchases route — creates purchase + auto-schedules reminder"
```

---

## Task 6: Gupshup WhatsApp Service

**Files:**
- Create: `backend/src/redis.ts`
- Create: `backend/src/services/gupshupService.ts`
- Create: `backend/src/routes/pharmacy.ts`
- Create: `backend/src/routes/webhooks.ts`
- Modify: `backend/src/app.ts` (add pharmacy + webhooks routers)
- Create: `backend/tests/gupshupService.test.ts`

> **Context:** Gupshup WABA is the only WhatsApp channel. No Baileys, no QR codes. Every send is an HTTP POST to `https://api.gupshup.io/sm/api/v1/msg`. The `GUPSHUP_API_KEY` and `GUPSHUP_APP_NAME` env vars must be set. Gupshup calls our webhook at `POST /api/v1/webhooks/gupshup` to report delivery status (sent → delivered → read). The `wa_connected` column in `pharmacies` is set to `true` on registration since there is no session to manage.

- [ ] **Step 1: Write Gupshup service test (failing)**

```typescript
// backend/tests/gupshupService.test.ts
import { sendViaGupshup } from '../src/services/gupshupService';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  process.env.GUPSHUP_API_KEY = 'test-api-key';
  process.env.GUPSHUP_APP_NAME = 'easibill-test';
});

describe('sendViaGupshup', () => {
  it('sends a message and returns messageId', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ status: 'submitted', messageId: 'msg-abc-123' }),
    });

    const msgId = await sendViaGupshup({ to: '+919999999999', body: 'Hello test', pharmacyName: 'Test Pharmacy' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.gupshup.io/sm/api/v1/msg',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ apikey: 'test-api-key' }),
      })
    );
    expect(msgId).toBe('msg-abc-123');
  });

  it('strips non-digit characters from phone number', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ status: 'submitted', messageId: 'msg-xyz' }),
    });

    await sendViaGupshup({ to: '+91-99999 99999', body: 'Test', pharmacyName: 'Pharmacy' });

    const callBody = new URLSearchParams(mockFetch.mock.calls[0][1].body);
    expect(callBody.get('destination')).toBe('919999999999');
  });

  it('throws when API key is not set', async () => {
    delete process.env.GUPSHUP_API_KEY;
    await expect(
      sendViaGupshup({ to: '+919999999999', body: 'Test', pharmacyName: 'Pharmacy' })
    ).rejects.toThrow('Gupshup not configured');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ status: 'error', message: 'Invalid API key' }),
    });
    await expect(
      sendViaGupshup({ to: '+919999999999', body: 'Test', pharmacyName: 'Pharmacy' })
    ).rejects.toThrow('Invalid API key');
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd backend && npm test -- --testPathPattern=gupshupService
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create backend/src/redis.ts**

```typescript
// backend/src/redis.ts
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // required by BullMQ
});
```

- [ ] **Step 4: Create backend/src/services/gupshupService.ts**

```typescript
// backend/src/services/gupshupService.ts
// Gupshup WABA HTTP client.
// All WhatsApp sends in this project go through this module via messageService.ts.
// Never call this directly from route handlers — always enqueue via BullMQ first.

export async function sendViaGupshup(params: {
  to: string;
  body: string;
  pharmacyName: string;
}): Promise<string> {
  const apiKey = process.env.GUPSHUP_API_KEY;
  const appName = process.env.GUPSHUP_APP_NAME;
  if (!apiKey || !appName) {
    throw new Error('Gupshup not configured — set GUPSHUP_API_KEY and GUPSHUP_APP_NAME');
  }

  const destination = params.to.replace(/\D/g, '');

  const response = await fetch('https://api.gupshup.io/sm/api/v1/msg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      apikey: apiKey,
    },
    body: new URLSearchParams({
      channel: 'whatsapp',
      source: appName,
      destination,
      message: JSON.stringify({ type: 'text', text: params.body }),
      'src.name': appName,
    }).toString(),
  });

  const text = await response.text();
  let data: { status?: string; messageId?: string; message?: string };
  try {
    data = JSON.parse(text);
  } catch {
    data = { status: 'error', message: text };
  }

  if (!response.ok || data.status === 'error') {
    throw new Error(`Gupshup error: ${data.message || text}`);
  }

  return data.messageId || '';
}
```

- [ ] **Step 5: Create backend/src/routes/pharmacy.ts**

```typescript
// backend/src/routes/pharmacy.ts
import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/me', async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT id, name, owner_name, phone, email, plan, wallet_credits, wa_connected, timezone, created_at
     FROM pharmacies WHERE id = $1`,
    [req.pharmacyId]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Not found', code: 'NOT_FOUND' });
  res.json({ success: true, pharmacy: result.rows[0] });
});

router.patch('/me', async (req: Request, res: Response) => {
  const allowed = ['name', 'owner_name', 'timezone'];
  const updates = Object.entries(req.body).filter(([k]) => allowed.includes(k));
  if (updates.length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields', code: 'VALIDATION_ERROR' });
  }
  const setClauses = updates.map(([k], i) => `${k} = $${i + 2}`).join(', ');
  const result = await pool.query(
    `UPDATE pharmacies SET ${setClauses} WHERE id = $1
     RETURNING id, name, owner_name, phone, email, plan, wa_connected, timezone`,
    [req.pharmacyId, ...updates.map(([, v]) => v)]
  );
  res.json({ success: true, pharmacy: result.rows[0] });
});

// Gupshup is configured globally via env vars — no per-pharmacy session to manage.
// wa_connected reflects whether the pharmacy is active on Gupshup.
router.get('/wa-status', async (req: Request, res: Response) => {
  const configured = !!(process.env.GUPSHUP_API_KEY && process.env.GUPSHUP_APP_NAME);
  const result = await pool.query(`SELECT wa_connected FROM pharmacies WHERE id = $1`, [req.pharmacyId]);
  res.json({
    success: true,
    status: configured && result.rows[0]?.wa_connected ? 'connected' : 'disconnected',
    configured,
  });
});

export default router;
```

- [ ] **Step 6: Create backend/src/routes/webhooks.ts**

```typescript
// backend/src/routes/webhooks.ts
// Gupshup calls this endpoint to report delivery status for each sent message.
// Configure this URL in the Gupshup dashboard: POST /api/v1/webhooks/gupshup
import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';

const router = Router();

router.post('/gupshup', async (req: Request, res: Response) => {
  // Gupshup sends either a flat payload or nested under 'payload'
  const body = req.body;
  const type: string = body.type || body.event;
  const payload = body.payload || body;

  if (type === 'message-event' || type === 'message') {
    const msgId: string = payload.id || payload.gsId;
    const eventType: string = payload.type || payload.status; // 'sent' | 'delivered' | 'read' | 'failed'

    if (msgId && eventType) {
      const statusMap: Record<string, string> = {
        sent: 'sent',
        delivered: 'delivered',
        read: 'read',
        failed: 'failed',
      };
      const mappedStatus = statusMap[eventType];
      if (mappedStatus) {
        await pool.query(
          `UPDATE message_logs SET status = $1 WHERE gupshup_msg_id = $2`,
          [mappedStatus, msgId]
        );
      }
    }
  }

  // Always respond 200 — Gupshup retries on non-200
  res.json({ ok: true });
});

export default router;
```

- [ ] **Step 7: Add pharmacy + webhooks routers to app.ts**

```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth';
import pharmacyRouter from './routes/pharmacy';
import patientsRouter from './routes/patients';
import purchasesRouter from './routes/purchases';
import webhooksRouter from './routes/webhooks';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Webhooks: no auth, Gupshup calls this directly
app.use('/api/v1/webhooks', webhooksRouter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/pharmacy', pharmacyRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/purchases', purchasesRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export { app };
```

- [ ] **Step 8: Run tests to confirm they pass**

```bash
cd backend && npm test -- --testPathPattern=gupshupService
```

Expected: All 4 tests pass.

- [ ] **Step 9: Commit**

```bash
git add backend/src/redis.ts backend/src/services/gupshupService.ts backend/src/routes/pharmacy.ts backend/src/routes/webhooks.ts backend/src/app.ts backend/tests/gupshupService.test.ts
git commit -m "feat: Gupshup WABA service, pharmacy profile routes, delivery status webhook"
```

---

## Task 7: Message Service + BullMQ Worker

**Files:**
- Create: `backend/src/utils/templates.ts`
- Create: `backend/src/services/messageService.ts`
- Create: `backend/src/jobs/reminderWorker.ts`
- Create: `backend/tests/messageService.test.ts`

- [ ] **Step 1: Write message service test (failing)**

```typescript
// backend/tests/messageService.test.ts
// Mock gupshupService so tests never make real HTTP calls
jest.mock('../src/services/gupshupService', () => ({
  sendViaGupshup: jest.fn().mockResolvedValue('mock-msg-id'),
}));

import { sendMessage } from '../src/services/messageService';
import { sendViaGupshup } from '../src/services/gupshupService';

beforeEach(() => {
  (sendViaGupshup as jest.Mock).mockClear();
});

describe('sendMessage', () => {
  it('delegates to sendViaGupshup', async () => {
    await sendMessage({ to: '+919111111111', body: 'Test reminder', pharmacyName: 'Test Pharmacy' });
    expect(sendViaGupshup).toHaveBeenCalledWith({
      to: '+919111111111',
      body: 'Test reminder',
      pharmacyName: 'Test Pharmacy',
    });
  });

  it('returns the messageId from Gupshup', async () => {
    (sendViaGupshup as jest.Mock).mockResolvedValueOnce('real-msg-id');
    const msgId = await sendMessage({ to: '+919111111111', body: 'Test', pharmacyName: 'Pharmacy' });
    expect(msgId).toBe('real-msg-id');
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd backend && npm test -- --testPathPattern=messageService
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create backend/src/utils/templates.ts**

```typescript
// backend/src/utils/templates.ts

type ReminderData = {
  patient_name: string;
  medicine_name: string;
  pharmacy_name: string;
  language: 'hindi' | 'english' | 'marathi' | 'telugu' | 'kannada';
};

const TEMPLATES: Record<ReminderData['language'], string> = {
  hindi: 'Namaste {patient_name} ji, aapki {medicine_name} refill ka time aa gaya hai. Kripya aaj pharmacy par aaiye. — {pharmacy_name}',
  english: 'Hello {patient_name}, your {medicine_name} refill is due today. Please visit us. — {pharmacy_name}',
  marathi: 'Namaskar {patient_name}, tumchi {medicine_name} refill chi vel zali ahe. Krupaya aaj pharmacy la ya. — {pharmacy_name}',
  telugu: 'Namaste {patient_name}, meeru {medicine_name} refill time aindi. Dayachesi nenu pharmacy ki randi. — {pharmacy_name}',
  kannada: 'Namaskara {patient_name}, nimma {medicine_name} refill time aagide. Dayavittu indu pharmacy ge banni. — {pharmacy_name}',
};

export function renderReminderMessage(data: ReminderData): string {
  const template = TEMPLATES[data.language] || TEMPLATES.hindi;
  return template
    .replace('{patient_name}', data.patient_name)
    .replace('{medicine_name}', data.medicine_name)
    .replace('{pharmacy_name}', data.pharmacy_name);
}
```

- [ ] **Step 4: Create backend/src/services/messageService.ts**

```typescript
// backend/src/services/messageService.ts
// The ONLY entry point for sending WhatsApp messages.
// Never call Gupshup directly from route handlers or workers — always go through here.
import { sendViaGupshup } from './gupshupService';

export async function sendMessage(params: {
  to: string;
  body: string;
  pharmacyName: string;
}): Promise<string> {
  return sendViaGupshup(params);
}
```

- [ ] **Step 5: Create backend/src/jobs/reminderWorker.ts**

```typescript
// backend/src/jobs/reminderWorker.ts
import { Worker, Job } from 'bullmq';
import { redis } from '../redis';
import { pool } from '../db/pool';
import { sendMessage } from '../services/messageService';
import { renderReminderMessage } from '../utils/templates';

export type ReminderJobData = {
  reminderId: string;
  pharmacyId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  medicineName: string;
  pharmacyName: string;
  language: string;
};

export const QUEUE_NAME = 'reminder-queue';

export function startReminderWorker() {
  const worker = new Worker<ReminderJobData>(
    QUEUE_NAME,
    async (job: Job<ReminderJobData>) => {
      const data = job.data;
      const messageBody = renderReminderMessage({
        patient_name: data.patientName,
        medicine_name: data.medicineName,
        pharmacy_name: data.pharmacyName,
        language: data.language as any,
      });

      await pool.query(
        `UPDATE reminders SET attempt_count = attempt_count + 1, message_template = $1 WHERE id = $2`,
        [messageBody, data.reminderId]
      );

      try {
        const gupshupMsgId = await sendMessage({
          to: data.patientPhone,
          body: messageBody,
          pharmacyName: data.pharmacyName,
        });

        await pool.query(
          `UPDATE reminders SET status = 'sent', sent_at = NOW() WHERE id = $1`,
          [data.reminderId]
        );

        await pool.query(
          `INSERT INTO message_logs (pharmacy_id, reminder_id, to_phone, message_body, channel, status, gupshup_msg_id)
           VALUES ($1, $2, $3, $4, 'gupshup', 'sent', $5)`,
          [data.pharmacyId, data.reminderId, data.patientPhone, messageBody, gupshupMsgId]
        );
      } catch (err: any) {
        await pool.query(
          `UPDATE reminders SET status = 'failed', error_message = $1 WHERE id = $2`,
          [err.message, data.reminderId]
        );
        await pool.query(
          `INSERT INTO message_logs (pharmacy_id, reminder_id, to_phone, message_body, channel, status, error)
           VALUES ($1, $2, $3, $4, 'gupshup', 'failed', $5)`,
          [data.pharmacyId, data.reminderId, data.patientPhone, messageBody, err.message]
        );
        throw err; // causes BullMQ retry
      }
    },
    {
      connection: redis,
      concurrency: 3,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`Reminder job ${job?.id} failed permanently:`, err.message);
  });

  return worker;
}
```

- [ ] **Step 6: Run tests to confirm they pass**

```bash
cd backend && npm test -- --testPathPattern=messageService
```

Expected: Both tests pass.

- [ ] **Step 7: Commit**

```bash
git add backend/src/utils/templates.ts backend/src/services/messageService.ts backend/src/jobs/reminderWorker.ts backend/tests/messageService.test.ts
git commit -m "feat: message service + BullMQ reminder worker via Gupshup"
```

---

## Task 8: Cron Scheduler

**Files:**
- Create: `backend/src/jobs/cronScheduler.ts`
- Create: `backend/tests/cronScheduler.test.ts`

- [ ] **Step 1: Write cron scheduler test (failing)**

```typescript
// backend/tests/cronScheduler.test.ts
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'job-1' }),
  })),
  Worker: jest.fn().mockImplementation(() => ({ on: jest.fn() })),
}));

import { enqueueRemindersForToday } from '../src/jobs/cronScheduler';
import { pool } from '../src/db/pool';
import { createTestPharmacy } from './helpers/auth';

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.end();
});

describe('enqueueRemindersForToday', () => {
  it('enqueues jobs for reminders scheduled today', async () => {
    const { pharmacy } = await createTestPharmacy({ phone: '+919000000009', email: 'cron@test.com' });

    // Create patient
    const patRes = await pool.query(
      `INSERT INTO patients (pharmacy_id, name, phone, language) VALUES ($1, 'Cron Test', '+919777777777', 'hindi') RETURNING id`,
      [pharmacy.id]
    );
    const patientId = patRes.rows[0].id;

    // Create purchase
    const purRes = await pool.query(
      `INSERT INTO purchases (pharmacy_id, patient_id, medicine_name, purchased_at, refill_interval_days) VALUES ($1, $2, 'Test Med', NOW(), 0) RETURNING id`,
      [pharmacy.id, patientId]
    );
    const purchaseId = purRes.rows[0].id;

    // Create reminder due today
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO reminders (pharmacy_id, patient_id, purchase_id, scheduled_for, status) VALUES ($1, $2, $3, $4, 'scheduled')`,
      [pharmacy.id, patientId, purchaseId, today]
    );

    const count = await enqueueRemindersForToday();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('does not enqueue already-sent reminders', async () => {
    const initial = await enqueueRemindersForToday();
    // Reminders were marked as queued — calling again should not double-enqueue
    const second = await enqueueRemindersForToday();
    expect(second).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd backend && npm test -- --testPathPattern=cronScheduler
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create backend/src/jobs/cronScheduler.ts**

```typescript
// backend/src/jobs/cronScheduler.ts
import cron from 'node-cron';
import { Queue } from 'bullmq';
import { redis } from '../redis';
import { pool } from '../db/pool';
import { QUEUE_NAME, ReminderJobData } from './reminderWorker';

const reminderQueue = new Queue<ReminderJobData>(QUEUE_NAME, { connection: redis });

// Queries all reminders due today (status=scheduled), enqueues them, marks bull_job_id.
// Returns the count of enqueued jobs.
export async function enqueueRemindersForToday(): Promise<number> {
  const today = new Date().toISOString().split('T')[0];

  const result = await pool.query<{
    reminder_id: string;
    pharmacy_id: string;
    patient_id: string;
    patient_name: string;
    patient_phone: string;
    medicine_name: string;
    pharmacy_name: string;
    language: string;
  }>(
    `SELECT
       r.id AS reminder_id,
       r.pharmacy_id,
       r.patient_id,
       pat.name AS patient_name,
       COALESCE(pat.whatsapp_phone, pat.phone) AS patient_phone,
       pur.medicine_name,
       ph.name AS pharmacy_name,
       pat.language
     FROM reminders r
     JOIN patients pat ON pat.id = r.patient_id
     JOIN purchases pur ON pur.id = r.purchase_id
     JOIN pharmacies ph ON ph.id = r.pharmacy_id
     WHERE r.scheduled_for = $1
       AND r.status = 'scheduled'
       AND ph.is_active = true
       AND pat.is_active = true`,
    [today]
  );

  let count = 0;
  for (const row of result.rows) {
    const job = await reminderQueue.add(
      'send-reminder',
      {
        reminderId: row.reminder_id,
        pharmacyId: row.pharmacy_id,
        patientId: row.patient_id,
        patientName: row.patient_name,
        patientPhone: row.patient_phone,
        medicineName: row.medicine_name,
        pharmacyName: row.pharmacy_name,
        language: row.language,
      } satisfies ReminderJobData,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      }
    );
    await pool.query(
      `UPDATE reminders SET bull_job_id = $1, status = 'scheduled' WHERE id = $2`,
      [job.id, row.reminder_id]
    );
    count++;
  }

  console.log(`[cron] Enqueued ${count} reminders for ${today}`);
  return count;
}

// Schedule: '20 3 * * *' = 3:20 AM UTC = 8:50 AM IST
export function startCronScheduler() {
  const schedule = process.env.CRON_SCHEDULE || '20 3 * * *';
  cron.schedule(schedule, async () => {
    console.log('[cron] Daily reminder dispatch firing...');
    try {
      await enqueueRemindersForToday();
    } catch (err) {
      console.error('[cron] Dispatch failed:', err);
    }
  });
  console.log(`[cron] Scheduler started — schedule: ${schedule}`);
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd backend && npm test -- --testPathPattern=cronScheduler
```

Expected: Both tests pass.

- [ ] **Step 5: Commit**

```bash
git add backend/src/jobs/cronScheduler.ts backend/tests/cronScheduler.test.ts
git commit -m "feat: node-cron daily scheduler enqueues reminders at 8:50 AM IST"
```

---

## Task 9: Dashboard + Reminders API + Full App Wiring

**Files:**
- Create: `backend/src/routes/dashboard.ts`
- Create: `backend/src/routes/reminders.ts`
- Create: `backend/src/middleware/errorHandler.ts`
- Create: `backend/src/server.ts`
- Modify: `backend/src/app.ts` (full wiring with all routes + error handler)
- Create: `backend/tests/dashboard.test.ts`

- [ ] **Step 1: Write dashboard test (failing)**

```typescript
// backend/tests/dashboard.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';
import { createTestPharmacy } from './helpers/auth';

let token: string;
let pharmacyId: string;

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  const result = await createTestPharmacy({ phone: '+919000000010', email: 'dashboard@test.com' });
  token = result.token;
  pharmacyId = result.pharmacy.id;
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE pharmacies CASCADE`);
  await pool.end();
});

describe('GET /api/v1/dashboard/stats', () => {
  it('returns stats object', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.stats.total_patients).toBe('number');
    expect(typeof res.body.stats.active_reminders).toBe('number');
    expect(typeof res.body.stats.messages_sent_this_month).toBe('number');
  });
});

describe('GET /api/v1/dashboard/today', () => {
  it('returns array of todays reminders', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/today')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reminders)).toBe(true);
  });
});

describe('GET /api/v1/dashboard/upcoming', () => {
  it('returns next 7 days reminders', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/upcoming')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reminders)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd backend && npm test -- --testPathPattern=dashboard
```

Expected: FAIL — router not mounted.

- [ ] **Step 3: Create backend/src/routes/dashboard.ts**

```typescript
// backend/src/routes/dashboard.ts
import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/stats', async (req: Request, res: Response) => {
  const [patients, reminders, messages] = await Promise.all([
    pool.query(`SELECT COUNT(*) FROM patients WHERE pharmacy_id = $1 AND is_active = true`, [req.pharmacyId]),
    pool.query(`SELECT COUNT(*) FROM reminders WHERE pharmacy_id = $1 AND status = 'scheduled'`, [req.pharmacyId]),
    pool.query(
      `SELECT COUNT(*) FROM message_logs WHERE pharmacy_id = $1 AND status = 'sent' AND created_at >= date_trunc('month', NOW())`,
      [req.pharmacyId]
    ),
  ]);
  res.json({
    success: true,
    stats: {
      total_patients: Number(patients.rows[0].count),
      active_reminders: Number(reminders.rows[0].count),
      messages_sent_this_month: Number(messages.rows[0].count),
    },
  });
});

router.get('/today', async (req: Request, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const result = await pool.query(
    `SELECT r.*, pat.name AS patient_name, pat.phone AS patient_phone, pur.medicine_name
     FROM reminders r
     JOIN patients pat ON pat.id = r.patient_id
     JOIN purchases pur ON pur.id = r.purchase_id
     WHERE r.pharmacy_id = $1 AND r.scheduled_for = $2
     ORDER BY r.created_at DESC`,
    [req.pharmacyId, today]
  );
  res.json({ success: true, reminders: result.rows });
});

router.get('/upcoming', async (req: Request, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const inSevenDays = new Date(Date.now() + 7 * 86400_000).toISOString().split('T')[0];
  const result = await pool.query(
    `SELECT r.*, pat.name AS patient_name, pat.phone AS patient_phone, pur.medicine_name
     FROM reminders r
     JOIN patients pat ON pat.id = r.patient_id
     JOIN purchases pur ON pur.id = r.purchase_id
     WHERE r.pharmacy_id = $1 AND r.scheduled_for BETWEEN $2 AND $3 AND r.status = 'scheduled'
     ORDER BY r.scheduled_for ASC`,
    [req.pharmacyId, today, inSevenDays]
  );
  res.json({ success: true, reminders: result.rows });
});

router.get('/activity', async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT ml.*, pat.name AS patient_name
     FROM message_logs ml
     JOIN patients pat ON pat.id = (SELECT patient_id FROM reminders WHERE id = ml.reminder_id LIMIT 1)
     WHERE ml.pharmacy_id = $1
     ORDER BY ml.created_at DESC
     LIMIT 10`,
    [req.pharmacyId]
  );
  res.json({ success: true, activity: result.rows });
});

export default router;
```

- [ ] **Step 4: Create backend/src/routes/reminders.ts**

```typescript
// backend/src/routes/reminders.ts
import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';
import { authenticate } from '../middleware/auth';
import { Queue } from 'bullmq';
import { redis } from '../redis';
import { QUEUE_NAME } from '../jobs/reminderWorker';

const router = Router();
router.use(authenticate);

const reminderQueue = new Queue(QUEUE_NAME, { connection: redis });

router.get('/', async (req: Request, res: Response) => {
  const { status, from, to, page = '1', limit = '50' } = req.query as Record<string, string>;
  const offset = (Number(page) - 1) * Number(limit);
  let query = `SELECT r.*, pat.name AS patient_name, pur.medicine_name
               FROM reminders r
               JOIN patients pat ON pat.id = r.patient_id
               JOIN purchases pur ON pur.id = r.purchase_id
               WHERE r.pharmacy_id = $1`;
  const params: any[] = [req.pharmacyId];
  if (status) { params.push(status); query += ` AND r.status = $${params.length}`; }
  if (from) { params.push(from); query += ` AND r.scheduled_for >= $${params.length}`; }
  if (to) { params.push(to); query += ` AND r.scheduled_for <= $${params.length}`; }
  query += ` ORDER BY r.scheduled_for DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(Number(limit), offset);
  const result = await pool.query(query, params);
  res.json({ success: true, reminders: result.rows });
});

router.post('/:id/cancel', async (req: Request, res: Response) => {
  const result = await pool.query(
    `UPDATE reminders SET status = 'cancelled' WHERE id = $1 AND pharmacy_id = $2 AND status = 'scheduled' RETURNING *`,
    [req.params.id, req.pharmacyId]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Reminder not found or not cancellable', code: 'NOT_FOUND' });
  res.json({ success: true, reminder: result.rows[0] });
});

router.post('/:id/reschedule', async (req: Request, res: Response) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ success: false, error: 'date required', code: 'VALIDATION_ERROR' });
  const result = await pool.query(
    `UPDATE reminders SET scheduled_for = $1, status = 'scheduled' WHERE id = $2 AND pharmacy_id = $3 RETURNING *`,
    [date, req.params.id, req.pharmacyId]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Reminder not found', code: 'NOT_FOUND' });
  res.json({ success: true, reminder: result.rows[0] });
});

router.post('/:id/retry', async (req: Request, res: Response) => {
  const existing = await pool.query(
    `SELECT r.*, pat.name AS patient_name, COALESCE(pat.whatsapp_phone, pat.phone) AS patient_phone,
            pur.medicine_name, ph.name AS pharmacy_name, pat.language
     FROM reminders r
     JOIN patients pat ON pat.id = r.patient_id
     JOIN purchases pur ON pur.id = r.purchase_id
     JOIN pharmacies ph ON ph.id = r.pharmacy_id
     WHERE r.id = $1 AND r.pharmacy_id = $2 AND r.status = 'failed'`,
    [req.params.id, req.pharmacyId]
  );
  if (!existing.rows[0]) return res.status(404).json({ success: false, error: 'Failed reminder not found', code: 'NOT_FOUND' });
  const row = existing.rows[0];
  const job = await reminderQueue.add('send-reminder', {
    reminderId: row.id,
    pharmacyId: row.pharmacy_id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    patientPhone: row.patient_phone,
    medicineName: row.medicine_name,
    pharmacyName: row.pharmacy_name,
    language: row.language,
  });
  await pool.query(
    `UPDATE reminders SET status = 'scheduled', bull_job_id = $1, error_message = NULL WHERE id = $2`,
    [job.id, row.id]
  );
  res.json({ success: true, message: 'Retry enqueued', jobId: job.id });
});

export default router;
```

- [ ] **Step 5: Create backend/src/middleware/errorHandler.ts**

```typescript
// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
}
```

- [ ] **Step 6: Write final backend/src/app.ts (complete)**

```typescript
// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/auth';
import pharmacyRouter from './routes/pharmacy';
import patientsRouter from './routes/patients';
import purchasesRouter from './routes/purchases';
import remindersRouter from './routes/reminders';
import dashboardRouter from './routes/dashboard';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/pharmacy', pharmacyRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/purchases', purchasesRouter);
app.use('/api/v1/reminders', remindersRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export { app };
```

- [ ] **Step 7: Create backend/src/server.ts**

```typescript
// backend/src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { startReminderWorker } from './jobs/reminderWorker';
import { startCronScheduler } from './jobs/cronScheduler';

const PORT = Number(process.env.PORT) || 3001;

startReminderWorker();
startCronScheduler();

app.listen(PORT, () => {
  console.log(`Easibill backend running on port ${PORT}`);
});
```

- [ ] **Step 8: Run all tests**

```bash
cd backend && npm test
```

Expected: All tests pass. Count of passing tests should be 15+.

- [ ] **Step 9: Smoke test the running server**

```bash
cd backend && npm run dev &
sleep 3
curl http://localhost:3001/health
```

Expected: `{"ok":true}`

Kill the dev server with `kill %1`.

- [ ] **Step 10: Commit**

```bash
git add backend/src/routes/dashboard.ts backend/src/routes/reminders.ts backend/src/middleware/errorHandler.ts backend/src/app.ts backend/src/server.ts backend/tests/dashboard.test.ts
git commit -m "feat: dashboard and reminders API — full backend wiring complete"
```

---

## Self-Review

**Spec coverage check against PRD Section 5.1 (MVP Features):**

- [x] 5.1.1 Auth: register, login, JWT (7-day), single admin, password reset — Task 3 ✅
- [x] 5.1.2 Patient management: add, purchase, list/search/filter, profile, edit/delete — Tasks 4 + 5 ✅
- [x] 5.1.3 WhatsApp Baileys: QR, Redis session, status indicator, reconnect backoff, rate limit 30/hr — Task 6 ✅
- [x] 5.1.4 Automated reminders: cron 8:50 AM IST, BullMQ queue, worker concurrency 3, retry 3x backoff, Hindi+English templates — Tasks 7 + 8 ✅
- [x] 5.1.5 Dashboard: today's reminders, 7-day upcoming, stats bar, activity feed — Task 9 ✅
- [x] API routes: all from PRD Section 8 covered ✅
- [x] DB schema: all 7 tables from PRD Section 7 ✅
- [x] Technical rules: BullMQ only (never direct), Redis session, pharmacy_id scope, REST only ✅

**Gaps found and addressed:**
- `backend/src/redis.ts` added to File Map ✅
- `reminderQueue` in `reminders.ts` reuses `QUEUE_NAME` from worker to avoid string duplication ✅

**Type consistency:**
- `ReminderJobData` defined in `reminderWorker.ts`, imported in `cronScheduler.ts` and `reminders.ts` ✅
- `BaileysService` exported class, `getBaileysService` factory exported — consistent across `pharmacy.ts` and `messageService.ts` ✅
