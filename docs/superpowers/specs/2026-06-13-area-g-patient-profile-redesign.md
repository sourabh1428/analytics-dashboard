# Area G — Patient Profile Page Redesign

**Date:** 2026-06-13  
**PM Gate:** ✅ Approved  
**Designer Gate:** ✅ Approved (4 changes applied)

---

## Problem

Current profile page is a flat vertical dump: header → inline AddPurchaseForm → 10 individual purchase cards → activity list. No hierarchy, no stats, no sections.

---

## Layout

### Zone 1 — Patient Header Card

Full-width `bg-white rounded-xl border border-zinc-200 p-6`.

**Row A — Identity + Actions**  
Left: avatar (initials, `h-12 w-12 rounded-full bg-zinc-100`) + name (`text-xl font-semibold`) + phone + optional WA phone + language badge (`rounded-full bg-zinc-100 text-xs px-2 py-0.5`)  
Right: Edit icon button, Delete icon button (existing handlers), "New Sale" emerald button (desktop only: `hidden sm:flex bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm`); on mobile show ShoppingCart icon-only button

**Opted-out banner** — between Row A and Row B:  
`bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5` with `MessageCircleOff` icon, text "WhatsApp opted out — reminders will not be sent", + "Re-enable" inline link (existing `handleToggleOptIn`)

**Row B — Stats strip** (separated by `border-t border-zinc-100 pt-4 mt-4`):  
`grid grid-cols-2 sm:grid-cols-4 gap-4` — value (`text-xl font-semibold text-zinc-900`) + label (`text-xs text-zinc-400 mt-0.5`):
1. `{history.length}` · "Purchases"
2. `₹{totalSpend}` (en-IN, Math.round) · "Total spend"
3. `{lastPurchaseLabel}` · "Last purchase"
4. `{nextReminderLabel}` · "Next reminder"

**Row C — Tags** — existing tag add/remove logic, unchanged

---

### Zone 2 — Tabs

Tab bar: `flex gap-1 mb-4` — `rounded-full px-3 py-1.5 text-sm font-medium transition-colors`:
- Active: `bg-zinc-900 text-white`
- Inactive: `text-zinc-500 hover:text-zinc-900`
- Labels: `Purchases ({n})` and `Messages ({n})`
- Count `n` derived client-side from `history.length` and `activity.length`

#### Purchases tab

Header: `flex items-center justify-between mb-4` — "Purchase history" (`text-sm font-semibold`) + "+ Add purchase" (`bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm`)

Table inside `bg-white rounded-xl border border-zinc-200 overflow-hidden`:
- `divide-y divide-zinc-100`
- Each row: `grid grid-cols-[1fr_auto_auto_auto_auto] sm:grid-cols-[2fr_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center`
  - Medicine name (`text-sm font-medium text-zinc-900`) + qty below (`text-xs text-zinc-400`)
  - Date (`text-xs text-zinc-400`, `d MMM yyyy`, `hidden sm:block` for full, always show `d MMM` on mobile)
  - Total (`text-sm text-zinc-700`, `hidden sm:block`)
  - Refill (`text-xs text-zinc-400`, `hidden sm:block`)
  - Reminder status badge (`rounded-full px-2 py-0.5 text-xs font-medium` with STATUS_CONFIG colors)
  - Empty state: centered, icon + "No purchases recorded yet" + "+ Add first purchase" button

#### Messages tab

`bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100`:
- Each row: status dot + status text + timestamp (right-aligned) + message body (line-clamp-2)
- Empty state: "No WhatsApp messages sent yet"

---

### "+ Add Purchase" modal

Triggered by "+ Add purchase" or "+ Add first purchase" buttons.  
Overlay: `fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4`  
Click backdrop → close. Click inner container → `e.stopPropagation()`  
Inner: `bg-white rounded-xl shadow-xl max-w-md w-full`  
Header: "Add Purchase" + X close button (`border-b border-zinc-100 px-5 py-4`)  
Body: `<AddPurchaseForm patientId={id} onAdded={(purchase, reminder) => { ... close modal; add to history; }} />`

---

## States

**Loading**: show skeleton for Zone 1 (avatar skeleton `h-12 w-12 rounded-full` + two text skeletons + 4 stat skeletons) + `TableRowSkeleton` for tab content  
**Error**: `AlertCircle` icon + "Could not load patient" + Retry button (replaces full page content)  
**Not found**: "Patient not found" with back button

---

## Stats computation (client-side)

```typescript
const totalSpend = patient.history.reduce((s, { purchase }) =>
  s + (purchase.unit_price ?? 0) * (purchase.quantity ?? 1), 0);
const lastPurchaseLabel = patient.history.length > 0
  ? format(parseISO(patient.history[0].purchase.purchased_at), 'd MMM yyyy')
  : '—';
const allReminders = patient.history.flatMap(h => h.reminders ?? []);
const nextReminder = allReminders
  .filter(r => r.status === 'scheduled')
  .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime())[0];
const nextReminderLabel = nextReminder
  ? format(parseISO(nextReminder.scheduled_for), 'd MMM')
  : 'None';
```

---

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/(dashboard)/patients/[id]/page.tsx` | Full rewrite of layout; keep all existing handlers |
