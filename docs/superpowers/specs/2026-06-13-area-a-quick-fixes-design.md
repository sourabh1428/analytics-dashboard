# Area A — Quick Fixes Design

**Date:** 2026-06-13  
**Scope:** Dashboard whitespace, sale accessibility, medicine suggestions from catalogue, default refill days

---

## 1. Dashboard Whitespace

**Problem:** `max-w-5xl` (1024px) on the dashboard page container leaves visible blank space on the right side of wide screens (≥ 1440px) because the grid cards do not fill the available content area.

**Fix:** Remove `max-w-5xl` from `frontend/app/(dashboard)/page.tsx`. The page-level `p-4 md:p-8` padding remains. The two-column reminder grid (`grid-cols-1 lg:grid-cols-2`) fills naturally.

**Scope:** Dashboard only. All other pages that use a constrained width (`max-w-2xl` on New Sale, Broadcasts, etc.) are unchanged — form-heavy pages should stay narrow.

---

## 2. Sale Accessibility (ARIA Labels)

**Problem:** Inputs in `MedicineRow` have no accessible labels — only placeholder text, which screen readers and automated testing tools cannot reliably use.

**Fix:** Add `aria-label` to every interactive element in `MedicineRow` in `frontend/app/(dashboard)/new-sale/page.tsx`:

| Element | `aria-label` value |
|---|---|
| Medicine name input | `"Medicine name for item ${index + 1}"` |
| Price input | `"Price per unit in rupees for item ${index + 1}"` |
| Quantity input | `"Quantity for item ${index + 1}"` |
| Refill days input | `"Refill interval in days for item ${index + 1}"` |
| Remove button | `"Remove item ${index + 1}"` |

---

## 3. Suggestions from Medicine Catalogue

**Problem:** `GET /purchases/suggestions` queries only the `purchases` table. Medicines added to the catalogue that have never been sold do not appear in the dropdown, and prices from the catalogue are unavailable until a medicine has been sold at least once.

**Fix:** Modify `backend/src/routes/purchases.ts` (the `/suggestions` handler) to UNION the `medicines` table:

```sql
SELECT name, default_price, default_refill_days FROM (
  -- Catalogue entries first (sort_order 0)
  SELECT name, default_price, default_refill_days, 0 AS sort_order
  FROM medicines
  WHERE pharmacy_id = $1
    AND ($2 = '' OR name ILIKE $3)

  UNION ALL

  -- Purchase history not already in the catalogue (sort_order 1)
  SELECT DISTINCT ON (p.medicine_name)
    p.medicine_name AS name,
    NULL::numeric AS default_price,
    NULL::integer AS default_refill_days,
    1 AS sort_order
  FROM purchases p
  WHERE p.pharmacy_id = $1
    AND ($2 = '' OR p.medicine_name ILIKE $3)
    AND NOT EXISTS (
      SELECT 1 FROM medicines m
      WHERE m.pharmacy_id = $1 AND m.name = p.medicine_name
    )
) combined
ORDER BY sort_order, name
LIMIT 10
```

**Response shape is unchanged:** `{ name: string; default_price: number | null; default_refill_days: number | null }[]`

No frontend type changes required.

---

## 4. Default Refill Days (side-effect fix)

**Problem reported:** New medicine rows default to 28 days regardless of catalogue data.

**Status:** Already fixed as a side-effect of fix #3. The `onMouseDown` handler in `MedicineRow` already calls `onUpdate(index, 'refill_interval_days', s.default_refill_days)` when a suggestion is selected. Once catalogue items appear in suggestions (fix #3), their `default_refill_days` will auto-populate.

The hardcoded `28` fallback in new-item state is correct — it is the right default for medicines with no catalogue entry and no prior sales.

---

## Files Changed

| File | Change |
|---|---|
| `frontend/app/(dashboard)/page.tsx` | Remove `max-w-5xl` |
| `frontend/app/(dashboard)/new-sale/page.tsx` | Add `aria-label` to all `MedicineRow` inputs and remove button |
| `backend/src/routes/purchases.ts` | Extend `/suggestions` handler to UNION medicines table |

---

## Out of Scope

- Inventory management page (Area B)
- Broadcast template selection (Area C)
- Billing credits (Area D)
- Team members (deferred)
