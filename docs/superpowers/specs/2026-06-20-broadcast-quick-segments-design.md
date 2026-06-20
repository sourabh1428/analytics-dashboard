# Broadcast Quick Segments — Design Spec

**Date:** 2026-06-20  
**Status:** ✅ Approved (PM ✅ · Designer ✅ · CTO ✅)

---

## Problem

Current tag and language dropdowns don't match how pharmacists think. They want to reach "customers who bought recently" or "lapsed customers" — time-based segments, not internal tag labels.

---

## What Ships

Replace the two filter dropdowns (tag, language) on the broadcast compose form with **4 mutually exclusive segment chips**. Add a `GET /broadcasts/audience-preview` endpoint. Store `segment_include` on broadcasts.

**Out of scope (v3):** multi-condition AND builder, exclude segments, patient name preview list, `has_medicine` condition, tag-based condition.

---

## Segment Chips (UI)

Four chips, mutually exclusive, one active at a time:

| Chip | Default | Segment type |
|------|---------|--------------|
| All Patients | — | `all` |
| Active Buyers — last [N] days | 30 | `last_purchased_within_days` |
| Lapsed Buyers — [N]+ days | 60 | `not_purchased_within_days` |
| Recent Visitors — last [N] days | 14 | `active_within_days` |

Chips with `[N]` show a small inline number input (1–365). "All Patients" has no input.

---

## TypeScript Types

```typescript
type SegmentType = 'all' | 'last_purchased_within_days' | 'not_purchased_within_days' | 'active_within_days';

type SegmentInclude = { type: SegmentType; value?: number };
```

Stored in DB as flat JSONB object: `{ "type": "last_purchased_within_days", "value": 30 }`. Not an array. Multi-segment is explicitly out of scope.

---

## Segment SQL Queries

**Base skeleton (both audience-preview and send path):**
```sql
SELECT COUNT(*) AS count   -- or full SELECT for send
FROM patients p
WHERE p.pharmacy_id = $1
  AND p.is_active = true
  AND p.opted_in = true
  AND <segment clause>
```

**`all`:** no extra clause.

**`last_purchased_within_days` (Active Buyers):**
```sql
AND EXISTS (
  SELECT 1 FROM purchases
  WHERE patient_id = p.id AND pharmacy_id = $1
    AND purchased_at >= NOW() - ($2 * INTERVAL '1 day')
)
```

**`not_purchased_within_days` (Lapsed Buyers):**
```sql
AND EXISTS (SELECT 1 FROM purchases WHERE patient_id = p.id AND pharmacy_id = $1)
AND NOT EXISTS (
  SELECT 1 FROM purchases
  WHERE patient_id = p.id AND pharmacy_id = $1
    AND purchased_at >= NOW() - ($2 * INTERVAL '1 day')
)
```
Note: requires at least one purchase ever — patients with zero purchase history are excluded.

**`active_within_days` (Recent Visitors):**
```sql
AND p.last_visit_at >= NOW() - ($2 * INTERVAL '1 day')
```

**Parameterization:** `$2` is always an integer passed as a query parameter. No string interpolation.

When `type = 'all'`, `value` is silently ignored — do not push `value` into params (Postgres rejects unreferenced `$2`).

---

## Backend

### New endpoint: `GET /broadcasts/audience-preview`

Query params:
- `type`: one of the 4 `SegmentType` values (required)
- `value`: integer 1–365 (required for all types except `all`)

Response: `{ success: true, count: number }`

Validation errors → 400 + `{ success: false, error: string, code: 'VALIDATION_ERROR' }`

Auth: existing `authenticate` middleware (pharmacy-scoped).

### Updated: `POST /broadcasts`

New body field: `segment_include: SegmentInclude`

Still accepts `filter_tag_id` / `filter_language` for backward compat (old scheduled broadcasts).

The recipient query for immediate sends is the **full SELECT** (with LATERAL join for personalisation data), not just COUNT. Only the WHERE clause segment part is new — the SELECT list and LATERAL join stay identical to the current implementation.

### Updated: `scheduledBroadcastDispatcher`

RETURNING clause must include `segment_include`:
```sql
RETURNING id, pharmacy_id, message_body, filter_tag_id, filter_language, segment_include
```

TypeScript row type:
```typescript
type BroadcastRow = {
  id: string;
  pharmacy_id: string;
  message_body: string;
  filter_tag_id: string | null;
  filter_language: string | null;
  segment_include: SegmentInclude | null;
};
```

Branch logic:
```typescript
if (broadcast.segment_include) {
  // new segment path — apply segment SQL
} else {
  // legacy path — existing filter_tag_id / filter_language logic
}
```

Zero recipients at dispatch time: update status to `'running'` with `recipient_count = 0` (already handled) + add `console.warn('[scheduledBroadcastDispatcher] zero recipients for broadcast ${id}')`.

---

## DB Migration: `018_segment_targeting.sql`

```sql
ALTER TABLE broadcasts ADD COLUMN IF NOT EXISTS segment_include JSONB;

CREATE INDEX IF NOT EXISTS patients_pharmacy_last_visit_idx
  ON patients(pharmacy_id, last_visit_at DESC NULLS LAST);
```

No purchases index — `idx_purchases_patient_purchased_at` from migration 016 covers EXISTS queries scoped by `patient_id` + `purchased_at`.

Existing columns `filter_tag_id` and `filter_language` stay permanently. No backfill.

---

## Frontend UX

### Chip states

- **Inactive:** `border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 rounded-full px-3 py-2 text-sm`
- **Active:** `border border-brand-blue bg-brand-blue/10 text-brand-blue`
- **Number input (on active chip only):** `w-10 text-center text-sm bg-transparent border-b border-brand-blue focus:outline-none appearance-none`
- Chips container: `flex flex-wrap gap-2`

### Count fetch behaviour

| Event | Action |
|-------|--------|
| Page mount | Auto-fetch (All Patients) — spinner shown |
| Chip activated | Auto-fetch immediately — spinner |
| Number input changed | Reset to spinner, debounced 400ms fetch |

No manual "Refresh count" button.

### Count display states

| State | Display |
|-------|---------|
| Loading | `<Loader2 animate-spin />` + "Loading…" |
| Loaded (send now) | "Sending to **N** patients" |
| Loaded (scheduled) | "~N patients (estimated at time of scheduling)" + sub-text "Actual recipients calculated at send time." |
| Zero | "No patients match this segment" in text-sm text-zinc-500 |
| Error | "Could not load — Retry" in text-red-500 |

### Send button

- Disabled while count is loading or in error
- Disabled when count = 0
- Enabled when count > 0 and message/template is valid

### What's removed

- Language filter dropdown
- Tag filter dropdown
- `GET /broadcasts/recipient-count` frontend call (replaced by `audience-preview`; endpoint kept on backend for backward compat)

---

## Known Implementation Details

1. `GET /broadcasts` list endpoint does not currently return `segment_include` — history display is a future enhancement, not in this spec.
2. The `audience-preview` endpoint must be rate-friendly; frontend debounce of 400ms on input change is required (already in spec).
