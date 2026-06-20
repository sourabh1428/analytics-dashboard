# Area D — Billing Credit System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "coming soon" billing tab with a live credit balance, Razorpay credit-pack purchase flow, and transaction history; deduct 1 credit per successful WhatsApp send across all three workers.

**Architecture:** New `credit_transactions` DB table tracks every purchase and deduction. A `deductCredit` service helper is called after each successful Gupshup send in three BullMQ workers. Three new `GET/POST /api/v1/billing` routes handle balance reads and Razorpay order creation/verification. The frontend `BillingTab` component loads the `razorpay.js` script lazily on first Buy click.

**Tech Stack:** Node.js + TypeScript + Express + PostgreSQL (backend); Razorpay Node.js SDK; Next.js 14 + Tailwind CSS (frontend); Razorpay Checkout JS (browser).

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `backend/src/db/migrations/013_credit_transactions.sql` | Create | New table + indices |
| `backend/src/db/migrate.ts` | Modify | Add `013_credit_transactions.sql` to migration list |
| `backend/src/services/creditService.ts` | Create | `deductCredit` helper |
| `backend/src/routes/billing.ts` | Create | GET /billing, POST /billing/orders, POST /billing/verify |
| `backend/src/app.ts` | Modify | Mount `/api/v1/billing` router |
| `backend/src/jobs/broadcastWorker.ts` | Modify | Call `deductCredit` after successful send |
| `backend/src/jobs/reminderWorker.ts` | Modify | Call `deductCredit` after successful send |
| `backend/src/jobs/saleConfirmationWorker.ts` | Modify | Call `deductCredit` after successful send |
| `frontend/lib/api.ts` | Modify | Add `PackId`, `CreditTransaction`, `api.billing.*` |
| `frontend/app/(dashboard)/settings/page.tsx` | Modify | Replace billing tab with `BillingTab` component |

---

## Task 1: DB Migration — credit_transactions table

**Files:**
- Create: `backend/src/db/migrations/013_credit_transactions.sql`
- Modify: `backend/src/db/migrate.ts`

- [ ] **Step 1: Create the migration file**

Write `backend/src/db/migrations/013_credit_transactions.sql`:

```sql
CREATE TABLE IF NOT EXISTS credit_transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id         UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  type                TEXT NOT NULL CHECK (type IN ('purchase', 'deduct')),
  amount              INTEGER NOT NULL,
  description         TEXT NOT NULL,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS credit_transactions_pharmacy_id_idx
  ON credit_transactions(pharmacy_id);

CREATE UNIQUE INDEX IF NOT EXISTS credit_transactions_payment_id_idx
  ON credit_transactions(razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;
```

- [ ] **Step 2: Register the migration in the runner**

Open `backend/src/db/migrate.ts`. Find the `migrations` array (line 10). The current last entry is `'012_schema_cleanup.sql'`. Add `'013_credit_transactions.sql'` after it:

```typescript
const migrations = [
  '001_initial.sql', '002_delivery_and_lang.sql', '003_opted_in.sql',
  '004_onboarding.sql', '005_medicine_catalog.sql', '006_tags_households.sql',
  '007_broadcasts.sql', '008_template_fields.sql', '009_template_bodies.sql',
  '010_template_params.sql', '011_template_name.sql', '012_schema_cleanup.sql',
  '013_credit_transactions.sql',
];
```

- [ ] **Step 3: Run the migration**

```bash
cd backend && npx ts-node src/db/migrate.ts
```

Expected output ends with:
```
Applied: 013_credit_transactions.sql
```

- [ ] **Step 4: Verify the table exists**

```bash
cd backend && npx ts-node -e "
const { pool } = require('./src/db/pool');
pool.query(\"SELECT column_name FROM information_schema.columns WHERE table_name = 'credit_transactions' ORDER BY ordinal_position\")
  .then(r => { console.log(r.rows.map(r => r.column_name)); pool.end(); })
  .catch(e => { console.error(e); pool.end(); });
"
```

Expected: `['id', 'pharmacy_id', 'type', 'amount', 'description', 'razorpay_order_id', 'razorpay_payment_id', 'created_at']`

- [ ] **Step 5: Commit**

```bash
git add backend/src/db/migrations/013_credit_transactions.sql backend/src/db/migrate.ts
git commit -m "feat: add credit_transactions migration"
```

---

## Task 2: Install Razorpay SDK

**Files:**
- Modify: `backend/package.json` (via npm install)

- [ ] **Step 1: Install the Razorpay Node.js SDK**

```bash
cd backend && npm install razorpay
```

The `razorpay` package bundles its own TypeScript declarations — no separate `@types/razorpay` needed.

- [ ] **Step 2: Add env vars to `.env`**

Open the root `.env` file (at `C:\Users\spsou\Documents\Easibill\.env`). Add:

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

(Use your actual Razorpay test credentials from the Razorpay dashboard.)

- [ ] **Step 3: Verify import compiles**

```bash
cd backend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add backend/package.json backend/package-lock.json
git commit -m "chore: install razorpay SDK"
```

---

## Task 3: creditService — deductCredit helper

**Files:**
- Create: `backend/src/services/creditService.ts`

- [ ] **Step 1: Create the service file**

Write `backend/src/services/creditService.ts`:

```typescript
import { pool } from '../db/pool';

export async function deductCredit(pharmacyId: string, description: string): Promise<void> {
  await pool.query(
    `UPDATE pharmacies SET wallet_credits = wallet_credits - 1 WHERE id = $1`,
    [pharmacyId]
  );
  await pool.query(
    `INSERT INTO credit_transactions (pharmacy_id, type, amount, description)
     VALUES ($1, 'deduct', -1, $2)`,
    [pharmacyId, description]
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd backend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add backend/src/services/creditService.ts
git commit -m "feat: creditService — deductCredit helper"
```

---

## Task 4: Billing Routes

**Files:**
- Create: `backend/src/routes/billing.ts`

- [ ] **Step 1: Create the billing route file**

Write `backend/src/routes/billing.ts`:

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { pool } from '../db/pool';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PACKS = {
  starter: { label: 'Starter', credits: 100,  amount: 9900  },
  popular: { label: 'Popular', credits: 350,  amount: 29900 },
  pro:     { label: 'Pro',     credits: 1000, amount: 79900 },
} as const;

type PackId = keyof typeof PACKS;

// GET /billing — balance + last 20 transactions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ph = await pool.query(
      'SELECT wallet_credits FROM pharmacies WHERE id = $1',
      [req.pharmacyId]
    );
    const tx = await pool.query(
      `SELECT id, type, amount, description, razorpay_payment_id, created_at
       FROM credit_transactions
       WHERE pharmacy_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [req.pharmacyId]
    );
    res.json({ success: true, balance: ph.rows[0].wallet_credits, transactions: tx.rows });
  } catch (err) { next(err); }
});

// POST /billing/orders — create a Razorpay order
router.post('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pack } = req.body as { pack: PackId };
    if (!pack || !PACKS[pack]) {
      return res.status(400).json({ success: false, error: 'Invalid pack', code: 'VALIDATION_ERROR' });
    }
    const order = await razorpay.orders.create({
      amount: PACKS[pack].amount,
      currency: 'INR',
      receipt: req.pharmacyId!,
    });
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) { next(err); }
});

// POST /billing/verify — verify signature and credit wallet
router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, pack } =
      req.body as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        pack: PackId;
      };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !pack || !PACKS[pack]) {
      return res.status(400).json({ success: false, error: 'Missing fields', code: 'VALIDATION_ERROR' });
    }

    // Verify HMAC-SHA256
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid signature', code: 'INVALID_SIGNATURE' });
    }

    // Idempotency: if payment_id already exists, return current balance without double-crediting
    const existing = await pool.query(
      `SELECT id FROM credit_transactions WHERE razorpay_payment_id = $1`,
      [razorpay_payment_id]
    );
    if (existing.rows.length > 0) {
      const ph = await pool.query('SELECT wallet_credits FROM pharmacies WHERE id = $1', [req.pharmacyId]);
      return res.json({ success: true, balance: ph.rows[0].wallet_credits });
    }

    // Credit wallet + log transaction
    await pool.query(
      `UPDATE pharmacies SET wallet_credits = wallet_credits + $1 WHERE id = $2`,
      [PACKS[pack].credits, req.pharmacyId]
    );
    await pool.query(
      `INSERT INTO credit_transactions
         (pharmacy_id, type, amount, description, razorpay_order_id, razorpay_payment_id)
       VALUES ($1, 'purchase', $2, $3, $4, $5)`,
      [
        req.pharmacyId,
        PACKS[pack].credits,
        `${PACKS[pack].credits} credits (${PACKS[pack].label} pack)`,
        razorpay_order_id,
        razorpay_payment_id,
      ]
    );

    const updated = await pool.query(
      'SELECT wallet_credits FROM pharmacies WHERE id = $1',
      [req.pharmacyId]
    );
    res.json({ success: true, balance: updated.rows[0].wallet_credits });
  } catch (err) { next(err); }
});

export default router;
```

- [ ] **Step 2: Mount the router in app.ts**

Open `backend/src/app.ts`. Add the billing import and mount:

After line 19 (`import broadcastsRouter from './routes/broadcasts';`):
```typescript
import billingRouter from './routes/billing';
```

After line 37 (`app.use('/api/v1/broadcasts', broadcastsRouter);`):
```typescript
app.use('/api/v1/billing', billingRouter);
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd backend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add backend/src/routes/billing.ts backend/src/app.ts
git commit -m "feat: billing routes — GET /billing, POST /billing/orders, POST /billing/verify"
```

---

## Task 5: Wire deductCredit into Workers

**Files:**
- Modify: `backend/src/jobs/broadcastWorker.ts`
- Modify: `backend/src/jobs/reminderWorker.ts`
- Modify: `backend/src/jobs/saleConfirmationWorker.ts`

### broadcastWorker.ts

- [ ] **Step 1: Import deductCredit**

Open `backend/src/jobs/broadcastWorker.ts`. Line 4 currently imports gupshup functions. Add import after line 4:

```typescript
import { deductCredit } from '../services/creditService';
```

- [ ] **Step 2: Add deduction after successful send**

Find the block after the successful send (lines 57–66 — the two `pool.query` calls for `UPDATE broadcasts` and `INSERT INTO message_logs`). After the second `pool.query` (the INSERT into message_logs), add:

```typescript
await deductCredit(pharmacyId, 'Broadcast message');
```

The full `try` block after the change:

```typescript
try {
  if (templateId) {
    const resolvedParams = (templateParams ?? []).map(key => FIELD_RESOLVERS[key] ?? '');
    await sendTemplateViaGupshup({
      to: patientPhone,
      templateId,
      templateParams: resolvedParams,
      templateBody: message,
    });
  } else {
    await sendViaGupshup({ to: patientPhone, body: message, pharmacyName });
  }

  await pool.query(
    `UPDATE broadcasts SET sent_count = sent_count + 1 WHERE id = $1`,
    [broadcastId]
  );
  await pool.query(
    `INSERT INTO message_logs (pharmacy_id, to_phone, message_body, channel, status)
     VALUES ($1, $2, $3, 'gupshup', 'sent')`,
    [pharmacyId, patientPhone, message]
  );
  await deductCredit(pharmacyId, 'Broadcast message');
} catch (err: unknown) {
  // ... unchanged catch block
}
```

### reminderWorker.ts

- [ ] **Step 3: Import deductCredit**

Open `backend/src/jobs/reminderWorker.ts`. Add import after the existing imports (after line 5):

```typescript
import { deductCredit } from '../services/creditService';
```

- [ ] **Step 4: Add deduction after successful send**

Find the `INSERT INTO message_logs` query (lines 88–92) inside the `try` block. Add `deductCredit` after it:

```typescript
await pool.query(
  `INSERT INTO message_logs (pharmacy_id, reminder_id, to_phone, message_body, channel, status, gupshup_msg_id)
   VALUES ($1, $2, $3, $4, 'gupshup', 'sent', $5)`,
  [data.pharmacyId, data.reminderId, data.patientPhone, messagePreview, gupshupMsgId]
);
await deductCredit(data.pharmacyId, 'Reminder message');
```

### saleConfirmationWorker.ts

- [ ] **Step 5: Import deductCredit**

Open `backend/src/jobs/saleConfirmationWorker.ts`. Add import after the existing imports (after line 5):

```typescript
import { deductCredit } from '../services/creditService';
```

- [ ] **Step 6: Add deduction after successful send**

Find the `INSERT INTO message_logs` query (lines 73–77). Add `deductCredit` after it:

```typescript
await pool.query(
  `INSERT INTO message_logs (pharmacy_id, to_phone, message_body, channel, status, gupshup_msg_id)
   VALUES ($1, $2, $3, 'gupshup', 'sent', $4)`,
  [pharmacyId, patientPhone, msgBody, messageId || null]
);
await deductCredit(pharmacyId, 'Sale confirmation');
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
cd backend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add backend/src/jobs/broadcastWorker.ts backend/src/jobs/reminderWorker.ts backend/src/jobs/saleConfirmationWorker.ts
git commit -m "feat: deduct 1 credit per successful WhatsApp send in all three workers"
```

---

## Task 6: Frontend API Types

**Files:**
- Modify: `frontend/lib/api.ts`

- [ ] **Step 1: Add CreditTransaction type and PackId after the existing Broadcast interface**

Open `frontend/lib/api.ts`. Find the `export interface Broadcast` block (around line 209). After it, add:

```typescript
export type PackId = 'starter' | 'popular' | 'pro';

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'deduct';
  amount: number;
  description: string;
  razorpay_payment_id: string | null;
  created_at: string;
}
```

- [ ] **Step 2: Add billing namespace to the api object**

Find the closing `};` of the `api` object (after the `broadcasts` block). Add `billing` before the closing brace:

```typescript
  billing: {
    get: () =>
      request<{ balance: number; transactions: CreditTransaction[] }>('/billing'),
    createOrder: (pack: PackId) =>
      request<{ orderId: string; amount: number; currency: string; key: string }>(
        '/billing/orders', { method: 'POST', body: JSON.stringify({ pack }) }
      ),
    verify: (body: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      pack: PackId;
    }) =>
      request<{ balance: number }>(
        '/billing/verify', { method: 'POST', body: JSON.stringify(body) }
      ),
  },
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/lib/api.ts
git commit -m "feat: add billing API types and methods to frontend api client"
```

---

## Task 7: BillingTab Component

**Files:**
- Modify: `frontend/app/(dashboard)/settings/page.tsx`

This task replaces the 14-line "coming soon" billing card (lines 681–694) with a full `BillingTab` component.

- [ ] **Step 1: Add new imports at the top of the file**

Open `frontend/app/(dashboard)/settings/page.tsx`. Line 6 currently imports lucide icons. Add `CreditCard`, `CheckCircle2`, `Minus` to the existing import:

Before (line 6):
```typescript
import { MessageSquare, Clock, RefreshCw, Activity, Pencil, Check, X, Loader2, Lock, Download, FileText, AlertCircle, ChevronDown } from 'lucide-react';
```

After:
```typescript
import { MessageSquare, Clock, RefreshCw, Activity, Pencil, Check, X, Loader2, Lock, Download, FileText, AlertCircle, ChevronDown, CreditCard, CheckCircle2, Minus } from 'lucide-react';
```

Line 7 imports `api, ApiError, GupshupTemplate`. Add `CreditTransaction, PackId`:

Before:
```typescript
import { api, ApiError, GupshupTemplate } from '../../../lib/api';
```

After:
```typescript
import { api, ApiError, GupshupTemplate, CreditTransaction, PackId } from '../../../lib/api';
```

Add shared component imports after line 5 (`import { WAStatusBadge } ...`):

```typescript
import { Skeleton } from '../../../components/shared/Skeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
```

- [ ] **Step 2: Add the PACKS constant and BillingTab component before SettingsContent**

Find the line `export default function SettingsPage()` (line 700). Insert the following code block **before** it:

```typescript
const PACKS: Record<PackId, { label: string; credits: number; price: number; popular?: boolean }> = {
  starter: { label: 'Starter', credits: 100,  price: 99 },
  popular: { label: 'Popular', credits: 350,  price: 299, popular: true },
  pro:     { label: 'Pro',     credits: 1000, price: 799 },
};

function ensureRazorpayScript(): Promise<void> {
  return new Promise(resolve => {
    if (document.getElementById('razorpay-script')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

function BillingTab() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loadingBilling, setLoadingBilling] = useState(true);
  const [purchasing, setPurchasing] = useState<PackId | null>(null);

  useEffect(() => {
    api.billing.get()
      .then(d => { setBalance(d.balance); setTransactions(d.transactions); })
      .catch(() => {})
      .finally(() => setLoadingBilling(false));
  }, []);

  const handleBuy = async (pack: PackId) => {
    setPurchasing(pack);
    try {
      await ensureRazorpayScript();
      const { orderId, amount, currency, key } = await api.billing.createOrder(pack);
      const rzp = new (window as any).Razorpay({
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Easibill',
        description: `${PACKS[pack].label} — ${PACKS[pack].credits} credits`,
        handler: async (response: any) => {
          try {
            const { balance: newBalance } = await api.billing.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              pack,
            });
            setBalance(newBalance);
            toast.success(`${PACKS[pack].credits} credits added!`);
            api.billing.get().then(d => setTransactions(d.transactions)).catch(() => {});
          } catch {
            toast.error('Payment completed but credits could not be applied — contact support@easibill.in');
          } finally {
            setPurchasing(null);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment was not completed — no credits were charged.');
            setPurchasing(null);
          },
        },
      });
      rzp.open();
    } catch {
      toast.error('Could not start checkout — try again');
      setPurchasing(null);
    }
  };

  const balanceStatus = balance === null
    ? null
    : balance >= 50
    ? { text: 'Healthy', className: 'bg-emerald-100 text-emerald-700' }
    : balance >= 1
    ? { text: 'Running low — top up soon', className: 'bg-amber-100 text-amber-700' }
    : { text: 'Credits exhausted — top up to continue sending reminders', className: 'bg-red-100 text-red-700' };

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Credit Balance</p>
        {loadingBilling ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-4xl font-bold text-zinc-900">{balance ?? 0}</span>
            {balanceStatus && (
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', balanceStatus.className)}>
                {balanceStatus.text}
              </span>
            )}
          </div>
        )}
        <p className="text-xs text-zinc-400 mt-2">1 credit = 1 WhatsApp message (broadcast, reminder, or sale confirmation)</p>
      </div>

      {/* Credit packs */}
      <div>
        <p className="text-sm font-semibold text-zinc-900 mb-3">Top Up Credits</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(Object.entries(PACKS) as [PackId, typeof PACKS[PackId]][]).map(([packId, pack]) => (
            <div key={packId} className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-3 relative">
              {pack.popular && (
                <span className="absolute -top-2.5 left-4 text-xs font-medium bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  Most popular
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900">{pack.label}</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">{pack.credits} <span className="text-sm font-normal text-zinc-400">credits</span></p>
                <p className="text-sm text-zinc-500 mt-0.5">₹{pack.price}</p>
              </div>
              <button
                type="button"
                onClick={() => handleBuy(packId)}
                disabled={purchasing !== null}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {purchasing === packId ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                ) : (
                  <><CreditCard className="h-4 w-4" /> Buy</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-100">
          <p className="text-sm font-semibold text-zinc-900">Transaction History</p>
        </div>
        {transactions.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-8 w-8 text-zinc-300" />}
            heading="No transactions yet"
            body="Your credit purchases and usage will appear here"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs text-zinc-400">
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Description</th>
                  <th className="text-right px-5 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-zinc-50 last:border-0">
                    <td className="px-5 py-3 text-zinc-500 whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-zinc-700">{tx.description}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      {tx.amount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          +{tx.amount}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500">
                          <Minus className="h-3.5 w-3.5" />
                          {Math.abs(tx.amount)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Replace the billing tab placeholder**

Find the existing billing tab block (lines 681–694):

```tsx
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

Replace it with:

```tsx
      {activeTab === 'billing' && <BillingTab />}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Smoke test in browser**

With `cd frontend && npm run dev` running, open `http://localhost:3000/settings?tab=billing`.

Confirm:
- Balance card shows a number with colour badge (or skeleton briefly while loading)
- Three credit pack cards visible: Starter ₹99/100cr, Popular ₹299/350cr (with "Most popular" pill), Pro ₹799/1000cr
- Transaction history shows empty state if no transactions
- Buy button on a pack opens Razorpay checkout modal (test mode)
- After successful test payment: toast "N credits added!", balance updates, transaction row appears

- [ ] **Step 6: Commit**

```bash
git add "frontend/app/(dashboard)/settings/page.tsx"
git commit -m "feat: billing tab — credit balance, Razorpay pack purchase, transaction history"
```
