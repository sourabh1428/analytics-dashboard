# New Sale Page — Stepper Redesign

**Date:** 2026-06-13
**PM Gate:** ✅ Approved
**Designer Gate:** ✅ Approved

---

## Problem

The current new-sale page is a single long scroll with 10 identified UX failures:

1. No step indicator — pharmacist has no sense of progress
2. Disabled submit button gives no reason why it's disabled
3. Running total appears/disappears conditionally (only when prices entered)
4. "Days" field hogs 1/3 of mobile screen despite being rarely changed
5. Quantity defaults to empty (placeholder "1" but value is blank — silent backend fallback)
6. No keyboard tab-flow after autocomplete selection
7. Success screen has no sale summary — no receipt, no verification
8. Patient "Found" confirmation is a tiny `text-xs` badge
9. Payment method and Total are two disconnected cards
10. Success screen is a dead end — no recovery if pharmacist missed a medicine

---

## Scope

Frontend only — `frontend/app/(dashboard)/new-sale/page.tsx`.
No backend changes. No new API routes.

---

## Design

### Layout Shell

```
min-h-screen flex flex-col
```

No page-level scroll. A fixed stepper header sits at the top of the content area (inside the page, not the global nav). Below it, a `flex-1 overflow-hidden` step body fills the remaining viewport height.

### Stepper Header

Three nodes connected by lines:

```
[ ✓ Patient ] ——— [ 2 Medicines ] ——— [ 3 Payment ]
```

- **Completed step:** filled emerald circle + checkmark icon + label
- **Active step:** filled emerald circle + bold label
- **Future step:** grey circle + grey label
- Clicking a completed step navigates back (no data loss)
- Stepper never scrolls away — fixed to top of content

---

### Step 1 — Patient

Full viewport, single centered card, no scroll.

**Layout:**
```
Mobile number input  (with 🔍 icon, auto-lookup on 10 digits)

[Found patient card]   OR   [New patient inline form]

Continue →  (with inline disabled reason below)
```

**Found patient card:**
- Large green card (`bg-emerald-50 border-emerald-100`)
- Patient name in `text-base font-semibold text-zinc-900` — not a tiny badge
- Phone + language below in `text-xs text-zinc-500`
- WhatsApp opted-out warning shown here (amber, `text-xs`) so pharmacist knows before billing

**New patient form:**
- Appears inline below the phone input (no extra card)
- Name input + language select
- Amber `UserPlus` icon + "New patient — enter their details"

**Continue button:**
- Primary emerald, full width
- Disabled when: phone < 10 digits, or new patient with no name
- Disabled reason shown as `text-xs text-zinc-400` directly below the button (not a tooltip)
  - "Enter a 10-digit mobile number"
  - "Enter the patient's name"

---

### Step 2 — Medicines

Two-column layout. No page scroll.

**Grid:** `grid grid-cols-[3fr_2fr] gap-6` on `sm+`. Stacked on mobile (right panel collapses to a horizontal scrollable chip strip above the medicine rows).

#### Left column — Medicine entry

**Column headers (desktop only):**
```
Medicine Name        ₹ Price    Qty    [spacer for delete]
```

**Each medicine row:**
```
[ Medicine name input (flex-1) ] [ ₹ Price (w-24) ] [ Qty (w-16) ] [ 🗑 ]
```

- Days field **removed from the main row** — a `⚙` icon sits after the Qty input; clicking it toggles an inline sub-row (`grid grid-cols-2 gap-2 mt-1`) with a labelled Days input. Collapsed by default. State is per-row (`showDays: boolean` in `MedicineRow`).
- When a medicine is added from the right panel (`onAddToSale`), its `refill_interval_days` from the patient's last purchase is pre-populated into the Days field (same as existing behavior).
- Quantity **defaults to 1** (value set to `1`, not just placeholder)
- After selecting from autocomplete: focus auto-advances Name → Price → Qty → next row Name
- Per-row subtotal shown right-aligned below each row when `unit_price > 0`
- Trash icon: `opacity-30 cursor-not-allowed` when only one row remains

**Add medicine button:**
```
className="w-full py-2.5 border border-dashed border-zinc-300 rounded-lg text-sm
           text-zinc-500 hover:border-emerald-400 hover:text-emerald-600
           transition-colors flex items-center justify-center gap-1.5"
```

**Running total:**
Always visible at the bottom of the left column, even at ₹0:
```
Total   ₹0
```
Format: `Math.round(…).toLocaleString('en-IN')`

**Bottom actions:**
```
[ ← Back ]    [ Continue to Payment → ]
```
Continue disabled if no medicine row has a name.

#### Right column — Patient context panel

Header: patient name (`text-sm font-semibold`) + phone (`text-xs text-zinc-400`)

**Refill due section** (shown only if reminders exist):
- Section label: `REFILL DUE` (`text-xs text-zinc-400 uppercase tracking-wide`)
- Each item: medicine name + urgency badge + `[+]` add button
  - 4+ days overdue: `bg-red-50 text-red-700 border border-red-200`
  - 1–3 days overdue: `bg-amber-50 text-amber-700 border border-amber-200`
  - Due today / upcoming: `bg-zinc-100 text-zinc-600`

**Recent purchases section:**
- Section label: `RECENT` (`text-xs text-zinc-400 uppercase tracking-wide`)
- Up to 5 items: medicine name + date + `[+]` add button
- `[+]` becomes `✓` (CheckCircle, emerald) when already in the sale — not clickable

**Empty state** (no history): `text-xs text-zinc-400` — "No purchase history"

**Mobile:** right panel collapses to a horizontal scrollable strip of pill chips above the medicine rows. Each chip: medicine name + urgency badge (for due reminders) or date (for recent). Tap to add.

---

### Step 3 — Payment

Full viewport, receipt-style card. No scroll.

**Order summary card:**
```
┌─────────────────────────────────┐
│ Metformin 500mg    ×2    ₹100   │
│ Amlodipine 5mg     ×1    ₹ 45   │
│ ─────────────────────────────── │
│ Total                    ₹145   │
└─────────────────────────────────┘
```
- Total in `text-xl font-bold text-zinc-900`
- Items: medicine name + `×qty` + price right-aligned

**Payment method:**
Pill buttons inline: `[ Cash ] [ UPI ] [ Card ] [ Other ]`
- Selected: `bg-emerald-600 text-white`
- Unselected: `border border-zinc-200 text-zinc-600 hover:bg-zinc-50`

**WhatsApp notice** (one line, below payment):
- Will send: `✅ WhatsApp confirmation will be sent to Ramesh Kumar`
- Won't send: `⚠️ This patient has opted out of WhatsApp messages`

**Actions:**
```
[ ← Back ]    [ Complete Sale ]
```
Complete Sale is full-width emerald, `py-3`. No ambiguity about what happens next.

---

### Post-Success Screen

Not a dead end. Receipt-style summary with clear next actions.

```
✅  Sale Complete

Ramesh Kumar · ₹145 · UPI

Metformin 500mg    ×2    ₹100
Amlodipine 5mg     ×1    ₹ 45

WhatsApp sent ✅   (or: WhatsApp not sent — not connected)

[ View Patient ]   [ New Sale ]
```

- Patient name, total, and payment method in `text-sm text-zinc-500` subtitle
- Full medicine list — receipt-style
- Two equal actions: View Patient (primary emerald) + New Sale (secondary border)

---

## States Covered

| State | Handling |
|-------|----------|
| Phone lookup loading | Spinner inside phone input (right side) |
| Phone lookup error | Silent — `foundPatient` stays `undefined`, no blocker |
| Patient history loading | Skeleton lines in right panel |
| Patient history error | `text-xs text-zinc-400` — "Could not load history" |
| Medicine suggestions loading | `Loader2` spinner + "Loading…" in dropdown |
| Medicine suggestions error | "Could not load suggestions" + inline Retry link |
| Medicine suggestions empty | Dropdown hidden (not shown) |
| No medicines with names | Continue disabled with reason |
| Submitting | Spinner + "Processing…" on Complete Sale button, button disabled |
| Submit error | `toast.error(message)` via sonner |

---

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/(dashboard)/new-sale/page.tsx` | Full rewrite — stepper shell + three step components |
