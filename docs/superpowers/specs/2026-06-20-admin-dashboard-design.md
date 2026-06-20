# Easibill Super-Admin Dashboard — Design Spec

**Date:** 2026-06-20
**Status:** Approved

---

## Overview

A separate Next.js 14 App Router application (deployed on Vercel) that gives the Easibill founder a full internal control panel over all pharmacy tenants. Admin API routes are added as a new protected router on the existing Railway Express backend.

---

## Architecture

### Frontend — `admin-frontend/` (new repo folder)

```
admin-frontend/
  app/
    login/page.tsx              ← ADMIN_SECRET entry, sets iron-session cookie
    (admin)/
      layout.tsx                ← session guard + sidebar nav
      page.tsx                  ← global overview stats
      pharmacies/
        page.tsx                ← searchable pharmacy table
        [id]/page.tsx           ← single pharmacy detail
      credits/page.tsx          ← global credit ledger
  lib/
    session.ts                  ← iron-session config
    api.ts                      ← typed fetch wrapper (passes X-Admin-Secret header)
```

- Stack: Next.js 14 App Router, Tailwind CSS, shadcn/ui, Lucide icons, sonner toasts
- Auth: `iron-session` signed cookie. Login page accepts `ADMIN_SECRET`; on match sets session. All `(admin)` layout routes read session server-side and redirect to `/login` if missing.
- Data fetching: server components for all read views. Server actions for mutations.
- Env vars: `ADMIN_SECRET`, `NEXT_PUBLIC_API_URL` (points to Railway backend)

### Backend — `backend/src/routes/admin.ts` (new file)

- Mounted at `/admin/*` in `app.ts`, gated by `ADMIN_ENABLED=true` env var
- Middleware: validates `X-Admin-Secret` header using `crypto.timingSafeEqual` (not `===`) to prevent timing attacks
- IP-level rate limit on `/admin/*` router: 10 requests/minute via `express-rate-limit`
- All existing pharmacy routes untouched
- Every mutation logs: timestamp, action name, changed field(s), old value, new value, pharmacy ID to server console

---

## Database Migrations (required before admin routes go live)

### `019_message_logs_pharmacy_idx.sql`
```sql
CREATE INDEX IF NOT EXISTS idx_message_logs_pharmacy_id ON message_logs(pharmacy_id);
```

### `020_credit_transactions_created_at_idx.sql`
```sql
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
```

### `021_session_version.sql`
```sql
ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
```
The auth middleware must reject JWTs where the embedded `session_version` is behind the DB value. Reset-password increments this column, invalidating all existing sessions for that pharmacy.

---

## Pages & Features

### 1. Login (`/login`)
- Single password field — enter `ADMIN_SECRET`
- On success: sets iron-session cookie, redirects to `/`
- On failure: error toast

### 2. Overview (`/`)
Stats cards:
- Total pharmacies (active / inactive)
- Total patients across all pharmacies
- Total messages sent (all time)
- Total credits in circulation
- Pharmacies with WhatsApp enabled
- New signups (last 7 days)

**States:**
- Loading: skeleton pulse on each card
- Error: muted card with dash value + small warning icon (no blank cards)

### 3. Pharmacy List (`/pharmacies`)
Searchable, paginated table (50 per page). Search by name, email, phone — 300ms debounce, server-side `ILIKE` query, clear (X) button in input. Columns:
- Name + owner name
- Email / phone
- Plan (`starter`/`pro`) — inline dropdown; on change show cell spinner, then sonner toast on success ("Plan updated to Pro for Sharma Medical") or error toast + revert dropdown to previous value
- Credits balance
- Patient count
- Messages sent (all time)
- WhatsApp status — green/red badge; clicking opens `AlertDialog` confirm before PATCH
- Account status — active/inactive badge; clicking opens `AlertDialog` confirm ("Deactivating this account will immediately block the pharmacy's login. Continue?") before PATCH
- Joined date
- "View" → `/pharmacies/[id]`

**States:**
- Loading: 7 skeleton table rows
- Empty (no pharmacies): shield icon + "No pharmacies yet"
- Error: red inline alert + Retry button

### 4. Pharmacy Detail (`/pharmacies/[id]`)
Tabs — each tab has its own skeleton while fetching.

**Overview tab**
- All fields from list row, plus: timezone, onboarding_step (displayed as human-readable label per mapping below), template names configured
- Edit plan inline (same spinner + toast + rollback pattern as list)
- Toggle WhatsApp on/off — `AlertDialog` confirm before PATCH
- Toggle account active/inactive — `AlertDialog` confirm before PATCH

`onboarding_step` display mapping:
- `0` → "Not started"
- `1` → "Profile complete"
- `2` → "WhatsApp connected"
- `3` → "Onboarding complete"

**Credits tab**
- Current balance displayed prominently at top
- Add credits form: amount + description → inserts `credit_transactions` row + updates `wallet_credits` in a single DB transaction
- Deduct credits form: amount + description. If amount > current balance: inline error "Cannot deduct more than current balance of X credits", submit blocked. Backend enforces atomically: `UPDATE pharmacies SET wallet_credits = wallet_credits - $1 WHERE id = $2 AND wallet_credits >= $1`, checks `rowCount === 1` before inserting the `credit_transactions` row — both in one `BEGIN/COMMIT` block
- Full transaction history table: date, type (purchase/deduct), amount, description, Razorpay IDs
- Empty state on history table: "No transactions yet"

**Messages tab**
- `message_logs` table for this pharmacy: date, to_phone, channel, status, error (if any), body preview (truncated to 60 chars with ellipsis)
- Clicking a row opens a shadcn `Sheet` showing: full message body, status, timestamps, error, phone number
- Filter by status (sent/failed/delivered/read) — applied server-side as a query param, not client-side, so pagination is correct
- Pagination (50 per page)
- Empty state (no messages): "No messages sent yet"
- Empty state (filter returns nothing): "No messages match this filter"

**Reset Password tab**
- New password field (min 8 chars) + confirm field
- Submit button disabled until both fields are non-empty, match, and ≥ 8 chars; inline validation error on blur if mismatch
- On submit: bcrypt hash, update `pharmacies.password_hash`, increment `pharmacies.session_version` (invalidates all existing JWTs for this pharmacy)
- After success: clear both fields, sonner toast "Password updated. Share it with the pharmacy owner manually."
- Muted note below form: "No email will be sent. The pharmacy's existing login sessions will be invalidated immediately."

### 5. Global Credits Ledger (`/credits`)
- Table of all `credit_transactions` across all pharmacies, sorted by `created_at DESC`
- Columns: pharmacy name, date, type, amount, description, Razorpay payment ID
- Filter by type (purchase/deduct) — server-side query param
- Pagination (100 per page)

**States:**
- Loading: skeleton rows
- Empty: "No credit transactions yet"
- Error: red inline alert + Retry button

---

## Backend API Endpoints

All under `/admin/*`, require `X-Admin-Secret` header (validated with `timingSafeEqual`).

| Method | Path | Description |
|---|---|---|
| GET | `/admin/overview` | Global stats (single aggregation query) |
| GET | `/admin/pharmacies?q=&page=&limit=50` | Pharmacies with counts via single JOIN query, paginated |
| GET | `/admin/pharmacies/:id` | Single pharmacy detail |
| PATCH | `/admin/pharmacies/:id` | Update plan, wa_connected, or is_active (one field at a time, allowlist validated, unknown fields rejected) |
| POST | `/admin/pharmacies/:id/reset-password` | Set new password hash + increment session_version |
| POST | `/admin/pharmacies/:id/credits` | Add or deduct credits (atomic DB transaction) |
| GET | `/admin/pharmacies/:id/credits?page=&limit=` | Credit transaction history |
| GET | `/admin/pharmacies/:id/messages?status=&page=&limit=50` | Message logs, server-side status filter, paginated |
| GET | `/admin/credits?type=&page=&limit=100` | Global credit ledger, paginated |

### `GET /admin/pharmacies` — single SQL query (no N+1)
```sql
SELECT
  p.*,
  COUNT(DISTINCT pat.id)  AS patient_count,
  COUNT(DISTINCT ml.id)   AS message_count
FROM pharmacies p
LEFT JOIN patients pat ON pat.pharmacy_id = p.id
LEFT JOIN message_logs ml ON ml.pharmacy_id = p.id
WHERE
  ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%'
   OR p.email ILIKE '%' || $1 || '%'
   OR p.phone ILIKE '%' || $1 || '%')
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT $2 OFFSET $3
```

### `PATCH /admin/pharmacies/:id` — allowed fields only
```ts
const ALLOWED = ['plan', 'wa_connected', 'is_active'] as const;
const VALIDATORS = {
  plan: (v) => ['starter', 'pro'].includes(v),
  wa_connected: (v) => typeof v === 'boolean',
  is_active: (v) => typeof v === 'boolean',
};
```
Reject any body key not in `ALLOWED`. Validate values. Log: `[admin] PATCH pharmacy=${id} field=${field} old=${old} new=${new}`.

---

## Auth — session_version integration

The existing `signToken` in `backend/src/utils/jwt.ts` must embed `session_version` in the payload. The auth middleware must:
1. Decode the JWT
2. Query `SELECT session_version FROM pharmacies WHERE id = $1`
3. Reject (401) if token's `session_version < DB value`

This adds one DB read per authenticated request. Given current scale this is acceptable; a Redis cache can be added later.

---

## Security

- `ADMIN_SECRET` ≥ 32 chars, stored in Railway + Vercel env vars only — never committed
- `ADMIN_ENABLED=true` env var gates the entire `/admin/*` router
- `timingSafeEqual` for secret comparison (no timing leak)
- `express-rate-limit`: 10 req/min on `/admin/*`
- `session_version` invalidates pharmacy sessions on password reset
- All mutations console-logged with field-level detail

---

## Out of Scope (v1)

- Admin action audit log table (console logging only for now)
- Bulk operations (mass credit top-up, mass message)
- Analytics charts / graphs
- Impersonation (use reset-password + manual login instead)
- System notifications
