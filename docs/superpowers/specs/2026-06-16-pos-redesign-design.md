# New Sale Page — POS Redesign Spec

**Date:** 2026-06-16  
**Status:** Approved

---

## Problem

The current new-sale page is a 3-step wizard (Patient → Medicines → Payment). Wizards are for onboarding flows. POS terminals are for transactions that happen dozens of times per day at a counter. Every "Next" click adds friction. A pharmacist processing 40 transactions a day loses minutes per shift to unnecessary navigation. The visual style — rounded cards, generous whitespace, soft palette — reads as a generic web form, not a professional tool.

---

## Goal

Replace the 3-step stepper with a single-screen split-panel layout that mirrors what Square, Shopify POS, and Toast POS do: **left panel to build the order, right panel as a live receipt**. Everything the pharmacist needs is visible at once. The transaction completes without changing screens.

---

## Layout

Fixed full-viewport-height page. No outer scroll. Two panels side by side:

```
┌─────────────────────────────────┬──────────────────────┐
│  LEFT  60%                      │  RIGHT  40%           │
│  white bg                       │  bg-zinc-50           │
│  order entry                    │  live receipt         │
└─────────────────────────────────┴──────────────────────┘
```

- Divider: `border-l border-zinc-200` on the right panel (no shadow, no gap)
- Each panel scrolls independently if content overflows (`overflow-y-auto`)
- Page header (sidebar layout wrapper) remains visible; the split sits inside the content area

---

## Left Panel — Order Entry

### 1. Phone Input (always at top)

```
[📱  9876543210                    ↻]
```

- Full-width input, `h-12`, `text-base`, autofocus on mount and on "New Sale" reset
- Left icon: `Phone` from lucide, `text-zinc-400`
- Right: spinner (`Loader2 animate-spin`) while looking up, clear `×` button when text present
- Debounce 500ms before lookup fires
- No label — placeholder is `"Mobile number"`

### 2. Patient Strip (appears below phone input once resolved)

**Found patient:**
```
┃ Ravi Kumar          Hindi · ✓ WhatsApp
  9876543210
```
- `border-l-4 border-emerald-500` left accent
- `bg-emerald-50/40` background
- Name: `text-sm font-semibold text-zinc-900`
- Phone + language: `text-xs text-zinc-500`
- WhatsApp opted-out: replace ✓ with `⚠ No WhatsApp` in `text-amber-600`

**New patient (number not found):**
```
┃ New patient
  [Name _______________] [Hindi ▾]
```
- `border-l-4 border-amber-400`, `bg-amber-50/40`
- Name input + language select appear inline
- No separate "create patient" step — details are saved when sale completes

**Loading:** single skeleton line, `animate-pulse`

### 3. Medicine Table

Column headers (sticky within left panel):
```
Medicine                ₹ Price   Qty   Days   Subtotal
```
`text-xs text-zinc-400 uppercase tracking-wide`

Each medicine row:
```
[Metformin 500mg___] [  2.50] [ 30] [ 28]   ₹75    ×
```
- Name: `flex-1`, full autocomplete dropdown (existing behaviour preserved)
- Price: `w-24 text-right tabular-nums`
- Qty: `w-14 text-center`
- Days: `w-16 text-center`
- Subtotal: `w-16 text-right text-xs text-zinc-400 tabular-nums` — computed, not editable
- Remove `×`: `text-zinc-300 hover:text-red-400`, only shown when >1 row
- **Tab-advance:** tabbing out of the Days field on the last row appends a new empty row and focuses its Medicine name input

Row separator: `border-b border-zinc-100` — no card borders, no shadow

**Add medicine:** plain text button at the bottom of the list:
```
+ Add medicine
```
`text-sm text-zinc-400 hover:text-zinc-700 py-2 w-full text-left`

---

## Right Panel — Live Receipt

### 1. Patient Info (top of panel)

Mirrors what the left strip shows but read-only, slightly larger:
- Name: `text-base font-semibold`
- Phone + language + opted-in status: `text-xs text-zinc-500`
- Hidden until a patient resolves (phone ≥ 10 digits and lookup completes)
- Placeholder when no patient: dimmed text `"Enter mobile number to begin"` centered in the panel

### 2. Cart

Receipt-style rows — no cards, no borders between items:
```
Metformin 500mg
×30                                    ₹75
─────────────────────────────────────────
Amlodipine 5mg
×14                                    ₹70
```
- Name: `text-sm text-zinc-700`
- `×qty · ₹price` on second line: `text-xs text-zinc-400`
- Amount right-aligned: `text-sm font-medium tabular-nums`
- Separator: `border-b border-zinc-100`
- Empty cart: nothing shown (panel placeholder covers it)

### 3. Total

```
Total                              ₹145
```
- `text-xs text-zinc-400 uppercase tracking-wide` label
- `text-3xl font-bold tabular-nums text-zinc-900` amount
- `border-t border-zinc-200 pt-4 mt-4`

### 4. Payment Method

```
[Cash]  [UPI]  [Card]  [Other]
```
- Active: `bg-zinc-900 text-white text-sm font-medium rounded-lg px-4 py-2`
- Inactive: `border border-zinc-200 text-zinc-600 text-sm rounded-lg px-4 py-2 hover:bg-zinc-50`
- Default selection: Cash

### 5. Complete Sale Button

```
[        Complete Sale        ]
```
- `w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold rounded-xl`
- Disabled (greyed, `opacity-40 cursor-not-allowed`) when: no patient resolved OR no medicine entered
- Loading state: `Loader2 animate-spin` inline, text changes to `"Processing…"`

### 6. WhatsApp Notice (below button)

`text-xs text-center`
- Opted in: `text-zinc-400` — "WhatsApp confirmation will be sent"
- Opted out: `text-amber-600` — "Patient has opted out — no WhatsApp"
- No patient: nothing

---

## After Sale — Receipt State

When the sale API returns successfully, the **right panel replaces its content** with a receipt view. The left panel resets to a fresh state immediately (phone cleared, medicines cleared) so the pharmacist can start the next transaction while glancing at the receipt.

Receipt panel content:
```
✓ Sale complete

Ravi Kumar · Cash
─────────────────
Metformin 500mg ×30      ₹75
Amlodipine 5mg  ×14      ₹70
─────────────────
Total                   ₹145

✅ WhatsApp sent  (or ⚠ No WhatsApp)

[View Patient]      [New Sale →]
```

- Green `CheckCircle` icon, `text-emerald-600`
- Items list compact, same receipt-row style
- "New Sale →" resets both panels and re-focuses phone input
- "View Patient" links to `/patients/[id]`
- Receipt stays until "New Sale" is clicked — no auto-dismiss

---

## File Structure

All changes are in `frontend/app/(dashboard)/new-sale/`. The existing component files are replaced/rewritten:

| File | Action |
|------|--------|
| `page.tsx` | Rewrite — single-screen layout, all state lives here |
| `components/LeftPanel.tsx` | Create — phone + patient strip + medicine table |
| `components/RightPanel.tsx` | Create — patient info + cart + total + payment + button |
| `components/MedicineRow.tsx` | Rewrite — tighter, tabular, no gear toggle (days always inline) |
| `components/PatientStrip.tsx` | Create — the coloured left-border strip |
| `components/ReceiptPanel.tsx` | Create — post-sale right panel |
| `components/StepperHeader.tsx` | Delete — steppers are gone |
| `components/PatientStep.tsx` | Delete |
| `components/MedicinesStep.tsx` | Delete |
| `components/PaymentStep.tsx` | Delete |
| `components/PatientContextPanel.tsx` | Delete — context now lives in RightPanel |
| `components/SuccessScreen.tsx` | Delete — replaced by ReceiptPanel |
| `types.ts` | Keep — `SaleItemWithKey` and `DoneState` still used |

---

## State Shape (page.tsx owns all state)

```typescript
// Patient
phone: string
lookingUp: boolean
foundPatient: Patient | null | undefined  // undefined = not yet resolved
newName: string
newLanguage: string

// Patient history (for right panel — not needed for sale, just for display)
// REMOVED — current design doesn't show purchase history in the new layout
// This simplifies the right panel. History lives on the patient detail page.

// Items
items: SaleItemWithKey[]
keyCounter: number

// Payment
paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Other'

// Submit
submitting: boolean

// Post-sale
receipt: DoneState | null  // replaces `done` — only right panel uses this
```

Patient history fetch is removed from this page. The right panel shows patient identity (name, phone, WhatsApp status) — not purchase history. History is on the patient detail page. This simplifies the data fetching significantly.

---

## Autocomplete (MedicineRow — preserved behaviour)

- 300ms debounce on name input change
- Fetches `GET /purchases/suggestions?q=...`
- Dropdown: absolute positioned below name input, `z-10`, max-height `200px`, scrollable
- Selecting a suggestion: fills name, fills price if available, fills days if available, advances focus to price input
- On focus (empty query): fetch all suggestions (shows most common medicines)
- Error state: "Could not load — Retry" link

---

## Keyboard Flow

The pharmacist types the mobile number → waits for lookup → Tab to first medicine name → types → selects from autocomplete → Tab to price → Tab to qty → Tab to days → Tab to next medicine name row (auto-added when tabbing past last row's days field) → when done, Enter or click Complete Sale.

Tab from the last medicine's days field automatically adds a new row and focuses its name input.

---

## Constraints

- No backend changes — all state changes are frontend only
- `api.sales.create` call signature unchanged
- `api.patients.byPhone` call unchanged
- Existing `SaleItemWithKey` type unchanged
- `tabular-nums` class requires no Tailwind plugin — it's a built-in utility

---

## Out of Scope

- Barcode scanning
- Medicine inventory quantity tracking
- Cash drawer integration
- Print receipt
- Split payment
