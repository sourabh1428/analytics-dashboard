# Area B — Inventory Management Design

**Date:** 2026-06-13  
**Scope:** New Inventory nav item + page to list/add/edit/delete medicines from the catalogue

---

## 1. Navigation Changes

**File:** `frontend/app/(dashboard)/layout.tsx`

Add `Inventory` entry to the desktop `NAV` array between Patients and Reminders:

```tsx
{ href: '/inventory', label: 'Inventory', Icon: Package }
```

Import `Package` from `lucide-react` (already available in the project).

For the mobile `MOBILE_NAV` (5-slot bottom bar), replace `Reports` with `Inventory`:

```tsx
// BEFORE
{ href: '/', label: 'Home', Icon: LayoutDashboard },
{ href: '/new-sale', label: 'Sale', Icon: ShoppingCart },
{ href: '/patients', label: 'Patients', Icon: Users },
{ href: '/reminders', label: 'Reminders', Icon: Bell },
{ href: '/settings', label: 'Settings', Icon: Settings },

// AFTER
{ href: '/', label: 'Home', Icon: LayoutDashboard },
{ href: '/new-sale', label: 'Sale', Icon: ShoppingCart },
{ href: '/patients', label: 'Patients', Icon: Users },
{ href: '/inventory', label: 'Inventory', Icon: Package },
{ href: '/settings', label: 'Settings', Icon: Settings },
```

Reports remains in the desktop sidebar — it is only deprioritised from the mobile bottom bar.

---

## 2. New Page

**File:** `frontend/app/(dashboard)/inventory/page.tsx`

### Data

Uses the existing `api.medicines` client methods (already typed in `frontend/lib/api.ts`):
- `api.medicines.list()` → `{ medicines: Medicine[] }`
- `api.medicines.upsert({ name, default_price?, default_refill_days? })` → `{ medicine: Medicine }`
- `api.medicines.update(id, { name?, default_price?, default_refill_days? })` → `{ medicine: Medicine }`
- `api.medicines.delete(id)` → `{ success: boolean }`

The `Medicine` type (from the backend schema): `{ id, pharmacy_id, name, default_price: number | null, default_refill_days: number }`

### Page Sections

#### Header
```
Inventory
Manage your medicine catalogue — names, default prices, and refill intervals appear as autocomplete in New Sale.
```

#### Add-Medicine Card
A `<form>` card at the top with three inline fields on one row (desktop) / stacked (mobile):
- **Name** (text, required, placeholder "Medicine name")
- **Default price** (number, optional, placeholder "₹ Price", min=0, step=0.01)
- **Default refill days** (number, optional, placeholder "Days", default 28, min=1, max=365)
- **Add button** (type=submit, emerald, shows `<Loader2>` while saving)

On submit: calls `api.medicines.upsert(...)`, shows `toast.success('Medicine saved')`, clears form fields. If the returned medicine ID already exists in the list (upsert hit a conflict), replace that row; otherwise prepend the new row.

#### Medicine List
A `bg-white rounded-xl border` card. Column header row (hidden on mobile): Name / Default Price / Refill Days / (actions).

Each row:

**View mode:**
- Name (font-medium)
- Default price (`₹N` or `—` if null)
- Default refill days (`N days`)
- Pencil button (edit, `aria-label="Edit {name}"`)
- Trash button (delete, `aria-label="Delete {name}"`)

**Edit mode** (when pencil clicked):
- Three inline inputs pre-filled with current values (name, price, days)
- Check button (save, emerald) + X button (cancel)
- On save: calls `api.medicines.update(id, {...})`, updates row in list, exits edit mode, `toast.success('Saved')`
- On cancel: discards draft, returns to view mode

**Delete:**
```
window.confirm(`Delete "${name}"? It will no longer appear in autocomplete.`)
```
If confirmed: calls `api.medicines.delete(id)`, removes row from list, `toast.success('Medicine deleted')`.

#### Empty State
When list is empty after load:
```
No medicines yet.
Add your first medicine above to enable autocomplete in New Sale.
```
Centred, `text-sm text-zinc-400`.

#### Loading State
Show three skeleton rows (grey `animate-pulse` bars) while initial fetch is in progress.

---

## 3. API Types

The `Medicine` interface is already defined in `frontend/lib/api.ts` — no changes needed:

```typescript
export interface Medicine {
  id: string;
  pharmacy_id: string;
  name: string;
  default_price: number | null;
  default_refill_days: number;
}
```

---

## 4. Files Changed

| File | Change |
|---|---|
| `frontend/app/(dashboard)/layout.tsx` | Add Inventory to NAV; swap Reports→Inventory in MOBILE_NAV |
| `frontend/app/(dashboard)/inventory/page.tsx` | Create new page |

---

## 5. Out of Scope

- Bulk import of medicines (Area B only covers UI CRUD)
- Stock quantity / expiry tracking (not in the domain model)
- Broadcast template selection (Area C)
- Billing credits (Area D)
