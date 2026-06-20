# Area D — Billing Credit System Design

**Date:** 2026-06-13
**PM Gate:** ✅ Approved
**Designer Gate:** ✅ Approved (6 changes applied)

---

## Problem

The Settings → Billing tab currently shows "Self-serve billing coming soon." Pharmacies have no way to see their credit balance, buy more credits, or understand what they've spent. The `wallet_credits` column already exists in the `pharmacies` table but is never read or decremented.

---

## Scope

1. **DB migration** — `credit_transactions` table
2. **Backend** — `creditService` helper + 3 billing routes + wire into 3 workers
3. **Frontend** — replace billing tab placeholder with balance card, credit pack purchase flow (Razorpay), and transaction history

---

## 1. Data Model

### Existing (no change)

`pharmacies.wallet_credits INTEGER DEFAULT 0` — current balance

### New: `credit_transactions` table

Migration file: `backend/src/db/migrations/002_credit_transactions.sql`

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

CREATE INDEX credit_transactions_pharmacy_id_idx ON credit_transactions(pharmacy_id);
CREATE UNIQUE INDEX credit_transactions_payment_id_idx ON credit_transactions(razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;
```

- `amount` is positive for purchases, negative for deductions.
- `razorpay_order_id` / `razorpay_payment_id` populated only for `type = 'purchase'`.

### Migration execution

The backend runs migrations on startup via `backend/src/db/migrate.ts` (reads all `.sql` files from `backend/src/db/migrations/` ordered by name). Adding `002_credit_transactions.sql` is sufficient; no code change to the migration runner is needed.

---

## 2. Credit Packs

| Pack ID | Label | Price (₹) | Price (paise) | Credits |
|---------|-------|-----------|---------------|---------|
| `starter` | Starter | 99 | 9900 | 100 |
| `popular` | Popular | 299 | 29900 | 350 |
| `pro` | Pro | 799 | 79900 | 1000 |

1 credit = 1 WhatsApp message delivered (broadcast, reminder, or sale confirmation).

The "Popular" pack gets a "Most popular" badge in the UI.

---

## 3. Backend

### Environment variables

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_KEY_ID` | Public key sent to frontend for checkout modal |
| `RAZORPAY_KEY_SECRET` | Secret for HMAC-SHA256 signature verification |

### New file: `backend/src/services/creditService.ts`

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

`deductCredit` does not throw if balance goes negative — sends are never blocked by credit exhaustion.

### New file: `backend/src/routes/billing.ts`

Three endpoints, all behind `authenticate` middleware.

#### `GET /billing`

Returns current balance and last 20 transactions (newest first).

```typescript
const ph = await pool.query('SELECT wallet_credits FROM pharmacies WHERE id = $1', [req.pharmacyId]);
const tx = await pool.query(
  `SELECT id, type, amount, description, razorpay_payment_id, created_at
   FROM credit_transactions WHERE pharmacy_id = $1 ORDER BY created_at DESC LIMIT 20`,
  [req.pharmacyId]
);
res.json({ success: true, balance: ph.rows[0].wallet_credits, transactions: tx.rows });
```

#### `POST /billing/orders`

Creates a Razorpay order. Body: `{ pack: 'starter' | 'popular' | 'pro' }`.

```typescript
const PACKS = {
  starter: { credits: 100, amount: 9900 },
  popular: { credits: 350, amount: 29900 },
  pro:     { credits: 1000, amount: 79900 },
};
// Validate pack key, then:
const order = await razorpay.orders.create({
  amount: PACKS[pack].amount,
  currency: 'INR',
  receipt: req.pharmacyId!,
});
res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
```

Error response on invalid pack: `400 { error: 'Invalid pack', code: 'VALIDATION_ERROR' }`.

#### `POST /billing/verify`

Verifies Razorpay payment signature and credits wallet.

Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, pack }`.

Verification:
```typescript
import crypto from 'crypto';
const body = razorpay_order_id + '|' + razorpay_payment_id;
const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  .update(body).digest('hex');
if (expected !== razorpay_signature) {
  return res.status(400).json({ success: false, error: 'Invalid signature', code: 'INVALID_SIGNATURE' });
}
```

On valid:
```typescript
await pool.query(
  `UPDATE pharmacies SET wallet_credits = wallet_credits + $1 WHERE id = $2`,
  [PACKS[pack].credits, req.pharmacyId]
);
await pool.query(
  `INSERT INTO credit_transactions
     (pharmacy_id, type, amount, description, razorpay_order_id, razorpay_payment_id)
   VALUES ($1, 'purchase', $2, $3, $4, $5)`,
  [req.pharmacyId, PACKS[pack].credits, `${PACKS[pack].credits} credits (${pack} pack)`,
   razorpay_order_id, razorpay_payment_id]
);
const updated = await pool.query('SELECT wallet_credits FROM pharmacies WHERE id = $1', [req.pharmacyId]);
res.json({ success: true, balance: updated.rows[0].wallet_credits });
```

Error response on already-verified payment (duplicate `razorpay_payment_id`): return `200` with current balance — idempotent. Detect via unique constraint on `razorpay_payment_id` in `credit_transactions` (add `UNIQUE` to migration).

### Mount billing router

In `backend/src/index.ts`, add:
```typescript
import billingRouter from './routes/billing';
app.use('/billing', billingRouter);
```

### Credit deduction in workers

In each of the three workers, after the successful Gupshup send (inside the `try` block, after the existing `pool.query` for status/logging), add:

```typescript
await deductCredit(pharmacyId, '<description>');
```

Descriptions:
- `broadcastWorker.ts`: `'Broadcast message'`
- `reminderWorker.ts`: `'Reminder message'`
- `saleConfirmationWorker.ts`: `'Sale confirmation'`

Deduction happens only on successful send — if the Gupshup call throws, the `catch` block is hit and no credit is deducted.

---

## 4. Frontend

### New types in `frontend/lib/api.ts`

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

New `billing` namespace on `api` object:
```typescript
billing: {
  get: () => request<{ balance: number; transactions: CreditTransaction[] }>('/billing'),
  createOrder: (pack: PackId) =>
    request<{ orderId: string; amount: number; currency: string; key: string }>(
      '/billing/orders', { method: 'POST', body: JSON.stringify({ pack }) }
    ),
  verify: (body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    pack: PackId;
  }) => request<{ balance: number }>('/billing/verify', { method: 'POST', body: JSON.stringify(body) }),
},
```

### Billing tab in `frontend/app/(dashboard)/settings/page.tsx`

Replace the "coming soon" card (lines 681–694) with a `<BillingTab />` component defined in the same file.

#### Balance card

```
[Balance: 247 credits]   ← large number, zinc-900
[Status badge]
```

Color rules:
- `balance >= 50`: emerald badge "Healthy"
- `1 <= balance <= 49`: amber badge "Running low — top up soon"
- `balance <= 0`: red badge "Credits exhausted — top up to continue sending reminders"

Loading: use the shared `<Skeleton>` component from `frontend/components/shared/Skeleton.tsx`.

#### Credit pack cards

Three `bg-white rounded-xl border` cards in a responsive grid (`grid-cols-1 sm:grid-cols-3`):

Each card shows:
- Pack label (e.g. "Popular")
- Credit count ("350 credits")
- Price ("₹299")
- "Most popular" emerald `rounded-full` pill on the Popular card only
- `<button>Buy</button>` (disabled while `purchasing === packId`)

#### Purchase flow

```typescript
async function handleBuy(pack: PackId) {
  setPurchasing(pack);
  try {
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
          const { balance } = await api.billing.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            pack,
          });
          setBalance(balance);
          toast.success(`${PACKS[pack].credits} credits added!`);
          // Reload transactions
          api.billing.get().then(d => setTransactions(d.transactions)).catch(() => {});
        } catch {
          toast.error('Payment completed but credits could not be applied — contact support@easibill.in');
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
  } finally {
    // Note: setPurchasing(null) for the success path is handled inside handler
    // For error/dismiss paths it's already cleared
  }
}
```

The `razorpay.js` script is loaded lazily on first Buy button click (not on BillingTab mount):
```typescript
function ensureRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}
// Called at the start of handleBuy: await ensureRazorpayScript();
```

#### Transaction history

Wrapped in `overflow-x-auto` for mobile. Table with columns: Date / Description / Amount.
- `amount > 0`: green `+{amount}` with CheckCircle2 icon
- `amount < 0`: red `−{Math.abs(amount)}` with Minus icon (amount is always −1 for deductions but rendered generically)
- Empty state: use shared `<EmptyState>` from `frontend/components/shared/EmptyState.tsx` with description "No transactions yet"

---

## 5. Files Changed

| File | Change |
|------|--------|
| `backend/src/db/migrations/002_credit_transactions.sql` | New table + index + unique constraint |
| `backend/src/services/creditService.ts` | `deductCredit` helper |
| `backend/src/routes/billing.ts` | GET /billing, POST /billing/orders, POST /billing/verify |
| `backend/src/index.ts` | Mount `/billing` router |
| `backend/src/jobs/broadcastWorker.ts` | Call `deductCredit` after successful send |
| `backend/src/jobs/reminderWorker.ts` | Call `deductCredit` after successful send |
| `backend/src/jobs/saleConfirmationWorker.ts` | Call `deductCredit` after successful send |
| `frontend/lib/api.ts` | Add `PackId`, `CreditTransaction`, `api.billing.*` |
| `frontend/app/(dashboard)/settings/page.tsx` | Replace billing tab with `BillingTab` component |

---

## 6. Out of Scope

- Razorpay webhooks (using frontend verification callback instead — simpler for MVP)
- Admin portal to manually top-up accounts
- Credit alerts via WhatsApp/email when balance is low
- Refunds
- Plan upgrades (Starter → Pro)
