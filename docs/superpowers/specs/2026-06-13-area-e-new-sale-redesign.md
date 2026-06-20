# Area E — New Sale Page: Suggestions Fix + UX Redesign

**Date:** 2026-06-13  
**PM Gate:** ✅ Approved  
**Designer Gate:** ✅ Approved (v2 — 4 changes applied)

---

## Problem

1. Medicine autocomplete silently fails — `catch { /* ignore */ }` swallows all errors
2. All `MedicineRow` components share one `suggestions` state — cross-row bleed on multi-medicine sales
3. No debounce on suggestions fetch — API called on every keystroke
4. Column headers hidden on mobile — once inputs have values, no label visible
5. No per-row subtotal — pharmacist must mentally calculate price × qty
6. "Add another medicine" button too subtle — plain text, hard to find

---

## Scope

Frontend only — `frontend/app/(dashboard)/new-sale/page.tsx`.  
Backend SQL and routes are correct and unchanged.

---

## Changes

### 1. Per-row suggestions state
Each `MedicineRow` manages its own `SugState`:
```typescript
type SugState = { items: Suggestion[]; loading: boolean; error: boolean; fetched: boolean };
```
Remove `suggestions` and `onQueryChange` from `MedicineRow` props.  
Parent no longer manages suggestions at all (remove `suggestions` state + `fetchSuggestions` + `useEffect`).

### 2. Suggestions fetch behaviour
- **On focus** of name input: if `!sug.fetched && !sug.loading`, trigger a background blank-query fetch (pre-warm). Dropdown does NOT open on focus.
- **On input change**: trigger debounced (300ms) fetch with current value. Set `showSugg(true)`.
- **Stale-response guard**: capture query string before the async call; if input value has changed by the time response arrives, discard the result (do not call `setSug`).
- **Dropdown visibility**: show only when `showSugg && medicine_name.length > 0 && (sug.loading || sug.error || sug.items.length > 0)`.

### 3. Dropdown states
- **Loading**: `<Loader2 className="h-3 w-3 animate-spin" />` + "Loading…" (text-zinc-400)
- **Error**: "Could not load suggestions" (text-red-500) + inline "Retry" link (underline, triggers re-fetch with current value)
- **Results**: name + price badge (`text-xs text-zinc-400`)
- **Empty** (fetched, no results): hide dropdown

### 4. Mobile medicine row — two-line layout
Line 1: name input (`flex-1`) + Trash2 (always visible mobile; `sm:opacity-0 sm:group-hover:opacity-100` desktop)  
Line 2: `grid grid-cols-3 gap-2 sm:hidden` — each cell has `<span className="text-xs text-zinc-400 mb-0.5 block">` label above input.  
Labels: "Price (₹)", "Qty", "Days"

Desktop: existing single-line layout unchanged. `<div className="hidden sm:flex ...">` for the three inputs.

**Single-row disabled state**: when `items.length === 1`, render Trash2 with `opacity-30 cursor-not-allowed`; block click.

### 5. Per-row subtotal
Render only when `unit_price > 0`.  
Format: `₹${Math.round(unit_price * (quantity || 1)).toLocaleString('en-IN')}`  
- Mobile: third line below inputs grid, right-aligned (`text-right`)
- Desktop: inline between inputs and remove button (`hidden sm:block`)

### 6. Running total precision
Change `toFixed(2)` to `Math.round(…).toLocaleString('en-IN')` — whole rupees, Indian formatting.

### 7. "Add medicine" button
```
className="w-full py-2.5 border border-dashed border-zinc-300 rounded-lg text-sm text-zinc-500
           hover:border-emerald-400 hover:text-emerald-600 transition-colors
           flex items-center justify-center gap-1.5"
```

---

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/(dashboard)/new-sale/page.tsx` | Complete rewrite of `MedicineRow` component + parent state cleanup |
