# Area B — Inventory Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Inventory page that lets pharmacy staff list, add, edit, and delete medicines in the catalogue, surfaced as a new nav item.

**Architecture:** Two tasks — (1) wire the nav item into the existing layout, (2) create the new page. The backend CRUD API is already complete (`GET/POST/PATCH/DELETE /medicines`). The frontend `api.medicines` client and `Medicine` type are already defined in `frontend/lib/api.ts`. No backend changes needed.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, TypeScript, lucide-react, sonner (toasts).

---

## File Map

| File | Change |
|---|---|
| `frontend/app/(dashboard)/layout.tsx` | Add `Package` import; add Inventory to `NAV`; swap `Reports` → `Inventory` in `MOBILE_NAV` |
| `frontend/app/(dashboard)/inventory/page.tsx` | Create — full inventory CRUD page |

---

## Task 1: Add Inventory Nav Item

**Files:**
- Modify: `frontend/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Add `Package` to the lucide-react import**

Open `frontend/app/(dashboard)/layout.tsx`. Line 6 currently reads:

```tsx
import { LayoutDashboard, Users, Bell, Settings, LogOut, Loader2, ShoppingCart, BarChart2, Radio } from 'lucide-react';
```

Change it to:

```tsx
import { LayoutDashboard, Users, Bell, Settings, LogOut, Loader2, ShoppingCart, BarChart2, Radio, Package } from 'lucide-react';
```

- [ ] **Step 2: Add Inventory to the desktop NAV array**

The `NAV` array currently is:

```tsx
const NAV = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/new-sale', label: 'New Sale', Icon: ShoppingCart },
  { href: '/patients', label: 'Patients', Icon: Users },
  { href: '/reminders', label: 'Reminders', Icon: Bell },
  { href: '/broadcasts', label: 'Broadcasts', Icon: Radio },
  { href: '/reports', label: 'Reports', Icon: BarChart2 },
  { href: '/settings', label: 'Settings', Icon: Settings },
];
```

Add Inventory between Patients and Reminders:

```tsx
const NAV = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/new-sale', label: 'New Sale', Icon: ShoppingCart },
  { href: '/patients', label: 'Patients', Icon: Users },
  { href: '/inventory', label: 'Inventory', Icon: Package },
  { href: '/reminders', label: 'Reminders', Icon: Bell },
  { href: '/broadcasts', label: 'Broadcasts', Icon: Radio },
  { href: '/reports', label: 'Reports', Icon: BarChart2 },
  { href: '/settings', label: 'Settings', Icon: Settings },
];
```

- [ ] **Step 3: Update the mobile MOBILE_NAV array**

The `MOBILE_NAV` array currently is:

```tsx
const MOBILE_NAV = [
  { href: '/', label: 'Home', Icon: LayoutDashboard },
  { href: '/new-sale', label: 'Sale', Icon: ShoppingCart },
  { href: '/patients', label: 'Patients', Icon: Users },
  { href: '/reminders', label: 'Reminders', Icon: Bell },
  { href: '/settings', label: 'Settings', Icon: Settings },
];
```

Replace with (swap Reminders for Inventory — Reports was never in mobile nav):

```tsx
const MOBILE_NAV = [
  { href: '/', label: 'Home', Icon: LayoutDashboard },
  { href: '/new-sale', label: 'Sale', Icon: ShoppingCart },
  { href: '/patients', label: 'Patients', Icon: Users },
  { href: '/inventory', label: 'Inventory', Icon: Package },
  { href: '/settings', label: 'Settings', Icon: Settings },
];
```

- [ ] **Step 4: Verify in browser**

Run `cd frontend && npm run dev`. Open `http://localhost:3000`. Confirm:
- Desktop sidebar shows "Inventory" with a Package icon between Patients and Reminders
- Mobile bottom bar shows "Inventory" instead of "Reminders"
- Clicking "Inventory" navigates to `/inventory` (will 404 until Task 2 is done — that's fine)

- [ ] **Step 5: Commit**

```bash
git add frontend/app/\(dashboard\)/layout.tsx
git commit -m "feat: add Inventory nav item to sidebar and mobile nav"
```

---

## Task 2: Create the Inventory Page

**Files:**
- Create: `frontend/app/(dashboard)/inventory/page.tsx`

The page uses these already-existing API methods from `frontend/lib/api.ts`:

```typescript
api.medicines.list()       // GET  /medicines → { medicines: Medicine[] }
api.medicines.upsert(body) // POST /medicines → { medicine: Medicine }  (ON CONFLICT updates)
api.medicines.update(id, body) // PATCH /medicines/:id → { medicine: Medicine }
api.medicines.delete(id)   // DELETE /medicines/:id → { success: boolean }
```

And the existing `Medicine` interface:
```typescript
interface Medicine {
  id: string;
  pharmacy_id: string;
  name: string;
  default_price: number | null;
  default_refill_days: number;
}
```

- [ ] **Step 1: Create the inventory page file**

Create `frontend/app/(dashboard)/inventory/page.tsx` with this full content:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { api, Medicine, ApiError } from '../../../lib/api';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Check, X, Loader2, Package } from 'lucide-react';
import { cn } from '../../../lib/utils';

const inputClass =
  'w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

const smallInputClass =
  'border border-zinc-200 rounded-lg px-2 py-1.5 text-sm bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

type EditDraft = { name: string; default_price: string; default_refill_days: string };

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [addName, setAddName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addDays, setAddDays] = useState('');
  const [adding, setAdding] = useState(false);

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft>({ name: '', default_price: '', default_refill_days: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.medicines.list()
      .then(({ medicines }) => setMedicines(medicines))
      .catch(() => toast.error('Failed to load medicines'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setAdding(true);
    try {
      const { medicine } = await api.medicines.upsert({
        name: addName.trim(),
        default_price: addPrice ? Number(addPrice) : undefined,
        default_refill_days: addDays ? Number(addDays) : undefined,
      });
      setMedicines(prev => {
        const idx = prev.findIndex(m => m.id === medicine.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = medicine;
          return updated;
        }
        return [medicine, ...prev];
      });
      setAddName('');
      setAddPrice('');
      setAddDays('');
      toast.success('Medicine saved');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save medicine');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (m: Medicine) => {
    setEditingId(m.id);
    setEditDraft({
      name: m.name,
      default_price: m.default_price != null ? String(m.default_price) : '',
      default_refill_days: String(m.default_refill_days),
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleSave = async (id: string) => {
    if (!editDraft.name.trim()) return;
    setSaving(true);
    try {
      const { medicine } = await api.medicines.update(id, {
        name: editDraft.name.trim(),
        default_price: editDraft.default_price ? Number(editDraft.default_price) : null,
        default_refill_days: editDraft.default_refill_days ? Number(editDraft.default_refill_days) : 28,
      });
      setMedicines(prev => prev.map(m => m.id === id ? medicine : m));
      setEditingId(null);
      toast.success('Saved');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? It will no longer appear in autocomplete.`)) return;
    try {
      await api.medicines.delete(id);
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast.success('Medicine deleted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="p-4 md:p-8 w-full space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Inventory</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Manage your medicine catalogue — names, default prices, and refill intervals appear as autocomplete in New Sale
        </p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-zinc-200 p-5">
        <h2 className="text-sm font-semibold text-zinc-900 mb-3">Add Medicine</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Medicine name"
            value={addName}
            onChange={e => setAddName(e.target.value)}
            required
            aria-label="New medicine name"
            className={cn(inputClass, 'flex-1')}
          />
          <input
            type="number"
            placeholder="₹ Price"
            value={addPrice}
            onChange={e => setAddPrice(e.target.value)}
            min={0}
            step={0.01}
            aria-label="Default price in rupees"
            className="sm:w-28 border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Days"
            value={addDays}
            onChange={e => setAddDays(e.target.value)}
            min={1}
            max={365}
            aria-label="Default refill interval in days"
            className="sm:w-20 border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={adding || !addName.trim()}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </div>
      </form>

      {/* Medicine list */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_120px_100px_72px] px-5 py-2.5 border-b border-zinc-100 text-xs font-medium text-zinc-400 uppercase tracking-wide">
          <span>Name</span>
          <span className="text-right">Default Price</span>
          <span className="text-right">Refill Days</span>
          <span />
        </div>

        {loading ? (
          <div className="divide-y divide-zinc-100">
            {[0, 1, 2].map(i => (
              <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                <div className="flex-1 h-4 bg-zinc-100 rounded" />
                <div className="w-20 h-4 bg-zinc-100 rounded" />
                <div className="w-16 h-4 bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        ) : medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-5">
            <Package className="h-8 w-8 text-zinc-200 mb-3" />
            <p className="text-sm text-zinc-400">No medicines yet.</p>
            <p className="text-xs text-zinc-300 mt-1">
              Add your first medicine above to enable autocomplete in New Sale.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {medicines.map(m =>
              editingId === m.id ? (
                <div key={m.id} className="px-5 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="text"
                    value={editDraft.name}
                    onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                    aria-label="Medicine name"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSave(m.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className={cn(smallInputClass, 'flex-1')}
                  />
                  <input
                    type="number"
                    value={editDraft.default_price}
                    onChange={e => setEditDraft(d => ({ ...d, default_price: e.target.value }))}
                    placeholder="₹ Price"
                    min={0}
                    step={0.01}
                    aria-label="Default price in rupees"
                    className={cn(smallInputClass, 'sm:w-28')}
                  />
                  <input
                    type="number"
                    value={editDraft.default_refill_days}
                    onChange={e => setEditDraft(d => ({ ...d, default_refill_days: e.target.value }))}
                    placeholder="Days"
                    min={1}
                    max={365}
                    aria-label="Default refill interval in days"
                    className={cn(smallInputClass, 'sm:w-20')}
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleSave(m.id)}
                      disabled={saving || !editDraft.name.trim()}
                      aria-label="Save changes"
                      className="p-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={cancelEdit}
                      aria-label="Cancel edit"
                      className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="group px-5 py-3.5 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_100px_72px] items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">{m.name}</span>
                  <span className="hidden sm:block text-sm text-zinc-500 text-right">
                    {m.default_price != null ? `₹${m.default_price}` : '—'}
                  </span>
                  <span className="hidden sm:block text-sm text-zinc-500 text-right">
                    {m.default_refill_days} days
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => startEdit(m)}
                      aria-label={`Edit ${m.name}`}
                      className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-300 hover:text-zinc-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      aria-label={`Delete ${m.name}`}
                      className="p-1.5 rounded-md hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the page loads**

With `npm run dev` still running, open `http://localhost:3000/inventory`.

Confirm:
- Page shows the "Inventory" heading and description
- Loading skeletons appear briefly, then the empty state shows (Package icon + "No medicines yet")
- No console errors

- [ ] **Step 3: Test adding a medicine**

In the Add Medicine form, enter:
- Name: `Paracetamol 500mg`
- Price: `12`
- Days: `30`

Click "Add". Confirm:
- Toast shows "Medicine saved"
- Row appears in the list with name, ₹12, 30 days
- Form fields clear

Add a second medicine with no price:
- Name: `Metformin 500mg`
- (leave price and days empty)

Click "Add". Confirm:
- Row appears with `—` for price and `28 days` (the backend default)

- [ ] **Step 4: Test inline editing**

Hover over the Paracetamol row. Confirm pencil and trash icons appear (they're `opacity-0 group-hover:opacity-100`).

Click the pencil icon. Confirm:
- Row switches to three inputs pre-filled with current values
- Name input is focused (`autoFocus`)

Change price to `15`, press Enter. Confirm:
- Toast "Saved"
- Row returns to view mode showing ₹15

Click pencil again, press Escape. Confirm row returns to view mode with no changes.

- [ ] **Step 5: Test deletion**

Hover over the Metformin row, click trash. Confirm:
- `window.confirm` dialog appears: `Delete "Metformin 500mg"? It will no longer appear in autocomplete.`
- Click OK → row disappears, toast "Medicine deleted"
- Click Cancel → nothing happens

- [ ] **Step 6: Verify New Sale autocomplete**

Open `http://localhost:3000/new-sale`. In the medicine name field, start typing "Para". Confirm:
- Dropdown appears showing "Paracetamol 500mg" with ₹12
- Selecting it fills the name, sets price to 12, sets refill days to 30 (the value stored from Step 3)

- [ ] **Step 7: Commit**

```bash
git add frontend/app/\(dashboard\)/inventory/page.tsx
git commit -m "feat: inventory management page — list, add, edit, delete medicines"
```
