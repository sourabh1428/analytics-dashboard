# Area A — Quick Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix dashboard right-side whitespace, add ARIA labels to New Sale medicine inputs, and confirm the suggestions backend already covers the catalogue (it does — no changes needed there).

**Architecture:** Two targeted frontend edits — one class removal in the dashboard layout container, one set of `aria-label` additions in the MedicineRow component. The backend suggestions endpoint (`GET /purchases/suggestions`) already UNIONs the `medicines` catalogue table; prices and catalogue items will appear automatically once Area B (inventory UI) populates that table.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, TypeScript.

---

## Pre-flight: Suggestions backend is already correct

Open `backend/src/routes/purchases.ts` lines 14–27. The query already does:

```sql
SELECT m.name, m.default_price, m.default_refill_days FROM medicines m …
UNION
SELECT DISTINCT pur.medicine_name, NULL, NULL FROM purchases pur …
  AND pur.medicine_name NOT IN (SELECT name FROM medicines WHERE pharmacy_id = $1)
ORDER BY name LIMIT 20
```

Catalogue items show up with prices. Purchase-history items not in the catalogue appear without prices. **No backend change needed for suggestions.** The dropdown will show catalogue items with prices as soon as medicines are added via the inventory page (Area B).

---

## Task 1: Dashboard — Remove Right-Side Whitespace

**Files:**
- Modify: `frontend/app/(dashboard)/page.tsx:74`

The outer container has `max-w-5xl` (1024 px). On wide screens the content area is wider than this, leaving blank space on the right. Removing the constraint lets the stats grid and reminder cards fill the available width.

- [ ] **Step 1: Remove `max-w-5xl` from the dashboard container**

Open `frontend/app/(dashboard)/page.tsx`. Find line 74:

```tsx
// BEFORE
<div className="p-4 md:p-8 max-w-5xl space-y-6 md:space-y-8">
```

Change it to:

```tsx
// AFTER
<div className="p-4 md:p-8 w-full space-y-6 md:space-y-8">
```

- [ ] **Step 2: Verify visually**

Run the dev server:
```bash
cd frontend && npm run dev
```

Open `http://localhost:3000` in a browser. Resize the window to ≥ 1440 px width. Confirm the stats bar and the two reminder cards stretch to fill the full content area with no blank column on the right.

- [ ] **Step 3: Commit**

```bash
git add frontend/app/\(dashboard\)/page.tsx
git commit -m "fix: remove max-w-5xl from dashboard so content fills full width"
```

---

## Task 2: New Sale — ARIA Labels on MedicineRow Inputs

**Files:**
- Modify: `frontend/app/(dashboard)/new-sale/page.tsx:36–105`

The five interactive elements in `MedicineRow` (medicine name input, price input, quantity input, refill days input, remove button) have no `aria-label`. Assistive technologies fall back to placeholder text, which is unreliable and causes failures in automated accessibility audits.

- [ ] **Step 1: Add `aria-label` to the medicine name input**

In `MedicineRow`, find the medicine name `<input>` (line ~37). Add `aria-label`:

```tsx
<input
  type="text"
  placeholder="Medicine name"
  value={item.medicine_name}
  aria-label={`Medicine name for item ${index + 1}`}
  onChange={e => { onUpdate(index, 'medicine_name', e.target.value); onQueryChange(e.target.value); setShowSugg(true); }}
  onFocus={() => setShowSugg(true)}
  onBlur={() => setTimeout(() => setShowSugg(false), 150)}
  className={inputClass}
  required
/>
```

- [ ] **Step 2: Add `aria-label` to the price input**

Find the price `<input>` (line ~70). Add `aria-label` and remove the now-redundant `title`:

```tsx
<input
  type="number"
  placeholder="₹ Price"
  min={0}
  step={0.01}
  value={item.unit_price ?? ''}
  onChange={e => onUpdate(index, 'unit_price', Number(e.target.value))}
  aria-label={`Price per unit in rupees for item ${index + 1}`}
  className="flex-1 sm:w-24 border border-zinc-200 rounded-lg px-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
/>
```

- [ ] **Step 3: Add `aria-label` to the quantity input**

Find the quantity `<input>` (line ~80):

```tsx
<input
  type="number"
  placeholder="Qty"
  min={1}
  value={item.quantity ?? ''}
  onChange={e => onUpdate(index, 'quantity', Number(e.target.value))}
  aria-label={`Quantity for item ${index + 1}`}
  className="flex-1 sm:w-16 border border-zinc-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
/>
```

- [ ] **Step 4: Add `aria-label` to the refill days input**

Find the refill days `<input>` (line ~86). Add `aria-label` and remove `title`:

```tsx
<input
  type="number"
  placeholder="Days"
  min={1}
  max={365}
  value={item.refill_interval_days ?? 28}
  onChange={e => onUpdate(index, 'refill_interval_days', Number(e.target.value))}
  aria-label={`Refill interval in days for item ${index + 1}`}
  className="flex-1 sm:w-20 border border-zinc-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
/>
```

- [ ] **Step 5: Add `aria-label` to the remove button**

Find the remove `<button>` (line ~96):

```tsx
<button
  type="button"
  onClick={() => onRemove(index)}
  aria-label={`Remove item ${index + 1}`}
  className="p-2 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
>
  <Trash2 className="h-4 w-4" />
</button>
```

- [ ] **Step 6: Verify in browser**

Open `http://localhost:3000/new-sale`. Inspect any input in the medicines section in DevTools. Confirm the `aria-label` attribute is present and reads e.g. `"Medicine name for item 1"`. Add a second medicine row and confirm it reads `"Medicine name for item 2"`.

- [ ] **Step 7: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/page.tsx
git commit -m "fix: add aria-label to all MedicineRow inputs and remove button"
```

---

## Summary

| Fix | Task | File |
|-----|------|------|
| Dashboard right-side whitespace | Task 1 | `frontend/app/(dashboard)/page.tsx` |
| Sale form ARIA labels | Task 2 | `frontend/app/(dashboard)/new-sale/page.tsx` |
| Suggestions from catalogue | Pre-flight (already done) | `backend/src/routes/purchases.ts` |
| Prices in suggestions | Flows from Area B (inventory UI) | — |
| Default refill days from catalogue | Works on selection already | — |
