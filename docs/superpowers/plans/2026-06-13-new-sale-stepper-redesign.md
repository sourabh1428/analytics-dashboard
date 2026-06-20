# New Sale Page — Stepper Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the new-sale page as a 3-step stepper (Patient → Medicines → Payment) with a two-column layout on Step 2, fixing all 10 identified UX failures.

**Architecture:** Split the monolithic `page.tsx` into focused components under `new-sale/components/`. Page owns all state; step components are presentational and receive props + callbacks. Step 2 uses a two-column grid: left = medicine entry, right = patient context panel (hidden for new patients).

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, TypeScript, lucide-react, date-fns, sonner

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `frontend/app/(dashboard)/new-sale/types.ts` | Shared types: StepId, SaleItemWithKey, DoneState |
| Create | `frontend/app/(dashboard)/new-sale/components/StepperHeader.tsx` | Visual stepper nodes + connecting lines |
| Create | `frontend/app/(dashboard)/new-sale/components/PatientStep.tsx` | Step 1: phone input, found/new patient UI, Continue button |
| Create | `frontend/app/(dashboard)/new-sale/components/MedicineRow.tsx` | Single medicine row with autocomplete, ⚙ days toggle, focus advancement |
| Create | `frontend/app/(dashboard)/new-sale/components/PatientContextPanel.tsx` | Right panel: refill-due badges + recent purchases |
| Create | `frontend/app/(dashboard)/new-sale/components/MedicinesStep.tsx` | Step 2: two-column layout, running total, Back/Continue |
| Create | `frontend/app/(dashboard)/new-sale/components/PaymentStep.tsx` | Step 3: receipt summary, payment method, Complete Sale |
| Create | `frontend/app/(dashboard)/new-sale/components/SuccessScreen.tsx` | Post-sale receipt with View Patient + New Sale |
| Modify | `frontend/app/(dashboard)/new-sale/page.tsx` | Full rewrite: stepper state machine + data fetching |

---

### Task 1: Shared types

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/types.ts`

- [ ] **Step 1: Create types file**

```typescript
import type { SaleItem } from '../../../lib/api';

export type StepId = 'patient' | 'medicines' | 'payment';

export type SaleItemWithKey = SaleItem & { _key: number };

export type DoneState = {
  patientId: string;
  patientName: string;
  isNew: boolean;
  whatsappSent: boolean;
  paymentMethod: string;
  total: number;
  medicines: { name: string; qty: number; price: number }[];
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/types.ts
git commit -m "feat(new-sale): add shared types for stepper redesign"
```

---

### Task 2: StepperHeader component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/StepperHeader.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';
import { Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import type { StepId } from '../types';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'patient', label: 'Patient' },
  { id: 'medicines', label: 'Medicines' },
  { id: 'payment', label: 'Payment' },
];

export function StepperHeader({
  current,
  onStepClick,
}: {
  current: StepId;
  onStepClick: (step: StepId) => void;
}) {
  const currentIndex = STEPS.findIndex(s => s.id === current);

  return (
    <div className="flex items-center justify-center py-4 px-4 border-b border-zinc-100 bg-white shrink-0">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.id} className="flex items-center">
            <button
              type="button"
              onClick={() => { if (isDone) onStepClick(step.id); }}
              disabled={!isDone}
              className={cn(
                'flex items-center gap-2 px-2 py-1 rounded-lg transition-colors',
                isDone ? 'cursor-pointer hover:bg-zinc-50' : 'cursor-default'
              )}
            >
              <div className={cn(
                'h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors',
                isDone || isActive ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-400'
              )}>
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className={cn(
                'text-sm',
                isActive ? 'font-semibold text-zinc-900' : isDone ? 'text-zinc-500' : 'text-zinc-400'
              )}>
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'h-px w-8 mx-1',
                i < currentIndex ? 'bg-emerald-300' : 'bg-zinc-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/components/StepperHeader.tsx
git commit -m "feat(new-sale): StepperHeader component"
```

---

### Task 3: PatientStep component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/PatientStep.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';
import { Search, Loader2, User, UserPlus, X } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import type { Patient } from '../../../../lib/api';

const LANGUAGES = ['hindi', 'english', 'marathi', 'telugu', 'kannada', 'gujarati', 'bengali', 'punjabi'];

const inputClass = "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

export function PatientStep({
  phone,
  onPhoneChange,
  lookingUp,
  foundPatient,
  newName,
  setNewName,
  newLanguage,
  setNewLanguage,
  onContinue,
}: {
  phone: string;
  onPhoneChange: (val: string) => void;
  lookingUp: boolean;
  foundPatient: Patient | null | undefined;
  newName: string;
  setNewName: (n: string) => void;
  newLanguage: string;
  setNewLanguage: (l: string) => void;
  onContinue: () => void;
}) {
  const digits = phone.replace(/\D/g, '');
  const isNewPatient = foundPatient === null;

  const canProceed =
    digits.length >= 10 &&
    !lookingUp &&
    foundPatient !== undefined &&
    (foundPatient !== null || newName.trim().length > 0);

  const disabledReason: string | null =
    digits.length < 10 ? 'Enter a 10-digit mobile number' :
    lookingUp ? null :
    foundPatient === undefined ? 'Enter a 10-digit mobile number' :
    isNewPatient && !newName.trim() ? "Enter the patient's name" :
    null;

  return (
    <div className="flex-1 flex items-start justify-center p-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">New Sale</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Start by looking up the customer</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">Customer</h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="tel"
              placeholder="Mobile number (10 digits)"
              value={phone}
              onChange={e => onPhoneChange(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            {lookingUp && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-zinc-400" />
            )}
          </div>

          {foundPatient && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-zinc-900">{foundPatient.name}</p>
                <p className="text-xs text-zinc-500">{foundPatient.phone} · {foundPatient.language}</p>
                {!foundPatient.opted_in && (
                  <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                    <X className="h-3 w-3" /> Opted out of WhatsApp messages
                  </p>
                )}
              </div>
            </div>
          )}

          {isNewPatient && (
            <div className="space-y-3 border-t border-zinc-100 pt-3">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <UserPlus className="h-4 w-4" />
                <span>New patient — enter their details</span>
              </div>
              <input
                type="text"
                placeholder="Patient name *"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className={inputClass}
                autoFocus
              />
              <select
                value={newLanguage}
                onChange={e => setNewLanguage(e.target.value)}
                className={inputClass}
              >
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onContinue}
            disabled={!canProceed}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            Continue →
          </button>
          {disabledReason && (
            <p className="text-xs text-zinc-400 text-center">{disabledReason}</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/components/PatientStep.tsx
git commit -m "feat(new-sale): PatientStep component"
```

---

### Task 4: MedicineRow component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/MedicineRow.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';
import { useState, useRef, useCallback } from 'react';
import { Trash2, Loader2, Settings } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { api } from '../../../../lib/api';
import type { SaleItem } from '../../../../lib/api';
import type { SaleItemWithKey } from '../types';

type Suggestion = { name: string; default_price: number | null; default_refill_days: number | null };
type SugState = { items: Suggestion[]; loading: boolean; error: boolean; fetched: boolean };
const INIT_SUG: SugState = { items: [], loading: false, error: false, fetched: false };

const inputCls = "w-full border border-zinc-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

export function MedicineRow({
  item,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: {
  item: SaleItemWithKey;
  index: number;
  canRemove: boolean;
  onUpdate: (index: number, field: keyof SaleItem, value: string | number) => void;
  onRemove: (index: number) => void;
}) {
  const [showSugg, setShowSugg] = useState(false);
  const [sug, setSug] = useState<SugState>(INIT_SUG);
  const [showDays, setShowDays] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQueryRef = useRef('');
  const priceInputRef = useRef<HTMLInputElement>(null);

  const doFetch = useCallback(async (q: string) => {
    currentQueryRef.current = q;
    setSug(prev => ({ ...prev, loading: true, error: false }));
    try {
      const { suggestions } = await api.purchases.suggestions(q || undefined);
      if (currentQueryRef.current !== q) return;
      setSug({ items: suggestions, loading: false, error: false, fetched: true });
    } catch {
      if (currentQueryRef.current !== q) return;
      setSug(prev => ({ ...prev, loading: false, error: true }));
    }
  }, []);

  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doFetch(q), 300);
  }, [doFetch]);

  const subtotal = (item.unit_price ?? 0) > 0
    ? Math.round((item.unit_price ?? 0) * (item.quantity || 1)).toLocaleString('en-IN')
    : null;

  return (
    <div className="group space-y-1">
      <div className="flex items-center gap-2">
        {/* Name + autocomplete */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Medicine name"
            value={item.medicine_name}
            onChange={e => {
              onUpdate(index, 'medicine_name', e.target.value);
              fetchSuggestions(e.target.value);
              setShowSugg(true);
            }}
            onFocus={() => {
              setShowSugg(true);
              if (!sug.fetched && !sug.loading) doFetch('');
            }}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            className={cn(inputCls, 'px-3')}
            aria-label={`Medicine name for item ${index + 1}`}
            required
          />
          {showSugg && item.medicine_name.length > 0 && (sug.loading || sug.error || sug.items.length > 0) && (
            <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden">
              {sug.loading && (
                <li className="px-3 py-2 text-sm text-zinc-400 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                </li>
              )}
              {sug.error && !sug.loading && (
                <li className="px-3 py-2 text-sm text-red-500 flex items-center gap-2">
                  <span>Could not load suggestions.</span>
                  <button
                    type="button"
                    className="underline"
                    onMouseDown={e => { e.preventDefault(); doFetch(item.medicine_name); }}
                  >
                    Retry
                  </button>
                </li>
              )}
              {!sug.loading && !sug.error && sug.items.map(s => (
                <li
                  key={s.name}
                  onMouseDown={() => {
                    onUpdate(index, 'medicine_name', s.name);
                    if (s.default_price != null) onUpdate(index, 'unit_price', s.default_price);
                    if (s.default_refill_days != null) onUpdate(index, 'refill_interval_days', s.default_refill_days);
                    setShowSugg(false);
                    setTimeout(() => priceInputRef.current?.focus(), 0);
                  }}
                  className="px-3 py-2 text-sm hover:bg-zinc-50 cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{s.name}</span>
                  {s.default_price != null && <span className="text-xs text-zinc-400">₹{s.default_price}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price */}
        <input
          ref={priceInputRef}
          type="number"
          placeholder="0"
          min={0}
          step={0.01}
          value={item.unit_price ?? ''}
          onChange={e => onUpdate(index, 'unit_price', Number(e.target.value))}
          className={cn(inputCls, 'w-24 text-right')}
          aria-label={`Price for item ${index + 1}`}
        />

        {/* Qty */}
        <input
          type="number"
          placeholder="1"
          min={1}
          value={item.quantity ?? 1}
          onChange={e => onUpdate(index, 'quantity', Number(e.target.value))}
          className={cn(inputCls, 'w-16 text-center')}
          aria-label={`Quantity for item ${index + 1}`}
        />

        {/* Days toggle */}
        <button
          type="button"
          onClick={() => setShowDays(d => !d)}
          className={cn(
            'p-1.5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100',
            showDays && 'text-zinc-600 bg-zinc-100'
          )}
          title="Refill interval"
          aria-label={`${showDays ? 'Hide' : 'Show'} refill days for item ${index + 1}`}
        >
          <Settings className={cn('h-3.5 w-3.5 transition-transform duration-150', showDays && 'rotate-90')} />
        </button>

        {/* Subtotal (desktop) */}
        {subtotal && (
          <span className="hidden sm:block text-xs text-zinc-500 whitespace-nowrap w-16 text-right">
            ₹{subtotal}
          </span>
        )}

        {/* Remove */}
        <button
          type="button"
          onClick={() => { if (canRemove) onRemove(index); }}
          aria-label={`Remove item ${index + 1}`}
          className={cn(
            'p-2 rounded-lg transition-colors',
            canRemove
              ? 'text-zinc-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100'
              : 'text-zinc-200 opacity-30 cursor-not-allowed'
          )}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Days sub-row */}
      {showDays && (
        <div className="grid grid-cols-2 gap-2 mt-1 pl-1">
          <div>
            <span className="text-xs text-zinc-400 mb-0.5 block">Refill days</span>
            <input
              type="number"
              placeholder="28"
              min={1}
              max={365}
              value={item.refill_interval_days ?? 28}
              onChange={e => onUpdate(index, 'refill_interval_days', Number(e.target.value))}
              className={cn(inputCls, 'text-center')}
              aria-label={`Refill interval for item ${index + 1}`}
            />
          </div>
        </div>
      )}

      {/* Subtotal (mobile) */}
      {subtotal && (
        <div className="text-right text-xs text-zinc-500 sm:hidden">₹{subtotal}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/components/MedicineRow.tsx
git commit -m "feat(new-sale): MedicineRow with gear toggle for days, focus advancement"
```

---

### Task 5: PatientContextPanel component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/PatientContextPanel.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';
import { Plus, CheckCircle } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { cn } from '../../../../lib/utils';
import { Skeleton } from '../../../../components/shared/Skeleton';
import type { PurchaseHistory, Reminder } from '../../../../lib/api';
import type { SaleItemWithKey } from '../types';

export function PatientContextPanel({
  loading,
  patientDetail,
  recentPurchases,
  dueReminders,
  items,
  onAddToSale,
  today,
  patientName,
  patientPhone,
}: {
  loading: boolean;
  patientDetail: { history: PurchaseHistory[] } | null | undefined;
  recentPurchases: PurchaseHistory[];
  dueReminders: (Reminder & { medicineName: string })[];
  items: SaleItemWithKey[];
  onAddToSale: (name: string, price?: number | null, days?: number | null) => void;
  today: Date;
  patientName: string;
  patientPhone: string;
}) {
  const isAdded = (name: string) =>
    items.some(i => i.medicine_name.trim().toLowerCase() === name.trim().toLowerCase());

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col overflow-hidden">
      <div className="mb-3 shrink-0">
        <p className="text-sm font-semibold text-zinc-900">{patientName}</p>
        <p className="text-xs text-zinc-400">{patientPhone}</p>
      </div>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {!loading && patientDetail === null && (
        <p className="text-xs text-zinc-400">Could not load history</p>
      )}

      {!loading && patientDetail && (
        <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
          {dueReminders.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-400 uppercase tracking-wide font-medium">Refill due</p>
              {dueReminders.map(reminder => {
                const diff = differenceInDays(today, parseISO(reminder.scheduled_for));
                const badgeCls = diff >= 4
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : diff >= 1
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-zinc-100 text-zinc-600';
                const badgeLabel = diff >= 1 ? `${diff}d overdue` : diff === 0 ? 'Due today' : `In ${Math.abs(diff)}d`;
                const added = isAdded(reminder.medicineName);
                return (
                  <div key={reminder.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="text-sm text-zinc-700 truncate">{reminder.medicineName}</span>
                      <span className={cn('text-xs px-1.5 py-0.5 rounded-full shrink-0', badgeCls)}>{badgeLabel}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { if (!added) onAddToSale(reminder.medicineName); }}
                      className={cn(
                        'text-xs px-2 py-1 rounded-full transition-colors shrink-0 flex items-center',
                        added ? 'bg-emerald-50 text-emerald-600 pointer-events-none' : 'bg-zinc-100 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700'
                      )}
                      aria-disabled={added}
                      aria-label={added ? `${reminder.medicineName} already in sale` : `Add ${reminder.medicineName} to sale`}
                    >
                      {added ? <CheckCircle className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {recentPurchases.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-400 uppercase tracking-wide font-medium">Recent</p>
              {recentPurchases.map(({ purchase }) => {
                const added = isAdded(purchase.medicine_name);
                return (
                  <div key={purchase.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-sm text-zinc-700 truncate block">{purchase.medicine_name}</span>
                      <span className="text-xs text-zinc-400">{format(parseISO(purchase.purchased_at), 'd MMM')}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { if (!added) onAddToSale(purchase.medicine_name, purchase.unit_price, purchase.refill_interval_days); }}
                      className={cn(
                        'text-xs px-2 py-1 rounded-full transition-colors shrink-0 flex items-center',
                        added ? 'bg-emerald-50 text-emerald-600 pointer-events-none' : 'bg-zinc-100 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700'
                      )}
                      aria-disabled={added}
                      aria-label={added ? `${purchase.medicine_name} already in sale` : `Add ${purchase.medicine_name} to sale`}
                    >
                      {added ? <CheckCircle className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {dueReminders.length === 0 && recentPurchases.length === 0 && (
            <p className="text-xs text-zinc-400">No purchase history</p>
          )}
        </div>
      )}

      {!loading && patientDetail === undefined && (
        <p className="text-xs text-zinc-400">No purchase history</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/components/PatientContextPanel.tsx
git commit -m "feat(new-sale): PatientContextPanel component"
```

---

### Task 6: MedicinesStep component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/MedicinesStep.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';
import { useCallback } from 'react';
import { Plus } from 'lucide-react';
import { parseISO } from 'date-fns';
import { cn } from '../../../../lib/utils';
import { MedicineRow } from './MedicineRow';
import { PatientContextPanel } from './PatientContextPanel';
import type { SaleItem, PurchaseHistory, Reminder, Patient } from '../../../../lib/api';
import type { SaleItemWithKey } from '../types';

const REFILL_LOOKAHEAD_DAYS = 7;

export function MedicinesStep({
  items,
  keyCounter,
  setItems,
  setKeyCounter,
  loadingDetail,
  patientDetail,
  patient,
  onBack,
  onContinue,
}: {
  items: SaleItemWithKey[];
  keyCounter: number;
  setItems: React.Dispatch<React.SetStateAction<SaleItemWithKey[]>>;
  setKeyCounter: React.Dispatch<React.SetStateAction<number>>;
  loadingDetail: boolean;
  patientDetail: { history: PurchaseHistory[] } | null | undefined;
  patient: Patient | null;
  onBack: () => void;
  onContinue: () => void;
}) {
  const today = new Date();
  const isExistingPatient = patient !== null;

  const onAddToSale = useCallback((medicineName: string, unitPrice?: number | null, refillDays?: number | null) => {
    const alreadyIn = items.some(i => i.medicine_name.trim().toLowerCase() === medicineName.trim().toLowerCase());
    if (alreadyIn) return;
    setItems(prev => [...prev, {
      _key: keyCounter,
      medicine_name: medicineName,
      unit_price: unitPrice ?? undefined,
      refill_interval_days: refillDays ?? 28,
      quantity: 1,
    }]);
    setKeyCounter(c => c + 1);
  }, [items, keyCounter, setItems, setKeyCounter]);

  const addItem = () => {
    setItems(prev => [...prev, { _key: keyCounter, medicine_name: '', refill_interval_days: 28, quantity: 1 }]);
    setKeyCounter(c => c + 1);
  };

  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const total = Math.round(items.reduce((sum, i) => sum + (i.unit_price || 0) * (i.quantity || 1), 0));
  const canContinue = items.some(i => i.medicine_name.trim());

  const recentPurchases: PurchaseHistory[] = patientDetail
    ? [...patientDetail.history]
        .sort((a, b) => new Date(b.purchase.purchased_at).getTime() - new Date(a.purchase.purchased_at).getTime())
        .slice(0, 5)
    : [];

  const dueReminders: (Reminder & { medicineName: string })[] = patientDetail
    ? patientDetail.history
        .flatMap(h => (h.reminders ?? []).map(r => ({ ...r, medicineName: h.purchase.medicine_name })))
        .filter(r => {
          if (r.status !== 'scheduled') return false;
          const d = parseISO(r.scheduled_for);
          return d <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + REFILL_LOOKAHEAD_DAYS);
        })
        .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime())
    : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 gap-4">
      <div className={cn(
        'flex-1 grid gap-4 overflow-hidden',
        isExistingPatient ? 'grid-cols-1 sm:grid-cols-[3fr_2fr]' : 'grid-cols-1'
      )}>
        {/* Left: medicine entry */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col overflow-hidden min-h-0">
          {/* Desktop column headers */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 mb-2 pr-10">
            <span className="flex-1">Medicine Name</span>
            <span className="w-24 text-right">₹ Price</span>
            <span className="w-16 text-center">Qty</span>
            <span className="w-6" />
            <span className="w-16 text-right">Subtotal</span>
          </div>

          {/* Rows */}
          <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
            {items.map((item, index) => (
              <MedicineRow
                key={item._key}
                item={item}
                index={index}
                canRemove={items.length > 1}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Add medicine */}
          <button
            type="button"
            onClick={addItem}
            className="mt-3 w-full py-2.5 border border-dashed border-zinc-300 rounded-lg text-sm text-zinc-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add medicine
          </button>

          {/* Running total */}
          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 shrink-0">
            <span className="text-sm text-zinc-600">Total</span>
            <span className="text-lg font-semibold text-zinc-900">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right: patient context */}
        {isExistingPatient && (
          <PatientContextPanel
            loading={loadingDetail}
            patientDetail={patientDetail}
            recentPurchases={recentPurchases}
            dueReminders={dueReminders}
            items={items}
            onAddToSale={onAddToSale}
            today={today}
            patientName={patient.name}
            patientPhone={patient.phone}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl text-sm hover:bg-zinc-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="flex-1 flex items-center justify-center bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/components/MedicinesStep.tsx
git commit -m "feat(new-sale): MedicinesStep two-column layout"
```

---

### Task 7: PaymentStep component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/PaymentStep.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import type { Patient } from '../../../../lib/api';
import type { SaleItemWithKey } from '../types';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Other'];

export function PaymentStep({
  items,
  paymentMethod,
  setPaymentMethod,
  patient,
  submitting,
  onBack,
  onSubmit,
}: {
  items: SaleItemWithKey[];
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  patient: Patient | null;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const validItems = items.filter(i => i.medicine_name.trim());
  const total = Math.round(validItems.reduce((sum, i) => sum + (i.unit_price || 0) * (i.quantity || 1), 0));
  const willSendWhatsapp = patient?.opted_in !== false;

  return (
    <div className="flex-1 flex items-start justify-center p-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-md space-y-4">
        {/* Order summary */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-sm font-semibold text-zinc-900 mb-3">Order Summary</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {validItems.map(item => (
              <div key={item._key} className="flex items-center gap-2">
                <span className="text-sm text-zinc-700 flex-1 truncate">{item.medicine_name}</span>
                <span className="text-xs text-zinc-400 shrink-0">×{item.quantity || 1}</span>
                {(item.unit_price ?? 0) > 0 && (
                  <span className="text-sm text-zinc-700 w-16 text-right shrink-0">
                    ₹{Math.round((item.unit_price ?? 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 mt-3 pt-3">
            <span className="text-sm text-zinc-600">Total</span>
            <span className="text-xl font-bold text-zinc-900">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-2">
          <p className="text-sm font-semibold text-zinc-900">Payment method</p>
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  paymentMethod === m
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp notice */}
        {patient && (
          <p className={cn('text-xs', willSendWhatsapp ? 'text-zinc-500' : 'text-amber-600')}>
            {willSendWhatsapp
              ? `✅ WhatsApp confirmation will be sent to ${patient.name}`
              : '⚠️ This patient has opted out of WhatsApp messages'}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="px-4 py-3 border border-zinc-200 text-zinc-600 rounded-xl text-sm hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {submitting
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
              : 'Complete Sale'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/components/PaymentStep.tsx
git commit -m "feat(new-sale): PaymentStep with receipt summary"
```

---

### Task 8: SuccessScreen component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/SuccessScreen.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { DoneState } from '../types';

export function SuccessScreen({ done }: { done: DoneState }) {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900">Sale Complete</h2>
        <p className="text-sm text-zinc-500">
          {done.patientName} · ₹{done.total.toLocaleString('en-IN')} · {done.paymentMethod}
          {done.isNew ? ' · New patient' : ''}
        </p>

        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-left space-y-2">
          {done.medicines.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm text-zinc-700 flex-1 truncate">{m.name}</span>
              <span className="text-xs text-zinc-400 shrink-0">×{m.qty}</span>
              {m.price > 0 && (
                <span className="text-sm text-zinc-700 w-16 text-right shrink-0">
                  ₹{Math.round(m.price * m.qty).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-zinc-400">
          {done.whatsappSent ? '✅ WhatsApp confirmation sent' : 'WhatsApp not sent (not connected)'}
        </p>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => router.push(`/patients/${done.patientId}`)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
          >
            View Patient
          </button>
          <button
            onClick={() => router.push('/new-sale')}
            className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-sm hover:bg-zinc-50"
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/components/SuccessScreen.tsx
git commit -m "feat(new-sale): SuccessScreen with receipt summary"
```

---

### Task 9: Rewrite page.tsx

**Files:**
- Modify: `frontend/app/(dashboard)/new-sale/page.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { api } from '../../../lib/api';
import { ApiError } from '../../../lib/api';
import { toast } from 'sonner';
import type { Patient, PurchaseHistory } from '../../../lib/api';
import { StepperHeader } from './components/StepperHeader';
import { PatientStep } from './components/PatientStep';
import { MedicinesStep } from './components/MedicinesStep';
import { PaymentStep } from './components/PaymentStep';
import { SuccessScreen } from './components/SuccessScreen';
import type { StepId, SaleItemWithKey, DoneState } from './types';

export default function NewSalePage() {
  const [step, setStep] = useState<StepId>('patient');

  // Patient
  const [phone, setPhone] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [foundPatient, setFoundPatient] = useState<Patient | null | undefined>(undefined);
  const [newName, setNewName] = useState('');
  const [newLanguage, setNewLanguage] = useState('hindi');
  const phoneDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Patient history
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [patientDetail, setPatientDetail] = useState<{ history: PurchaseHistory[] } | null | undefined>(undefined);

  // Items
  const [items, setItems] = useState<SaleItemWithKey[]>([
    { _key: 0, medicine_name: '', refill_interval_days: 28, quantity: 1 },
  ]);
  const [keyCounter, setKeyCounter] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<DoneState | null>(null);

  useEffect(() => {
    if (!foundPatient) {
      setPatientDetail(undefined);
      setLoadingDetail(false);
      return;
    }
    setPatientDetail(undefined);
    setLoadingDetail(true);
    api.patients.get(foundPatient.id)
      .then(({ patient }) => { setPatientDetail({ history: patient.history ?? [] }); setLoadingDetail(false); })
      .catch(() => { setPatientDetail(null); setLoadingDetail(false); });
  }, [foundPatient]);

  const lookupPhone = useCallback(async (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length < 10) { setFoundPatient(undefined); return; }
    setLookingUp(true);
    try {
      const { patient } = await api.patients.byPhone(digits);
      setFoundPatient(patient);
    } catch {
      setFoundPatient(undefined);
    } finally {
      setLookingUp(false);
    }
  }, []);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    setFoundPatient(undefined);
    if (phoneDebounce.current) clearTimeout(phoneDebounce.current);
    phoneDebounce.current = setTimeout(() => lookupPhone(val), 500);
  };

  const handleSubmit = async () => {
    const validItems = items.filter(i => i.medicine_name.trim());
    if (!validItems.length) { toast.error('Add at least one medicine'); return; }

    setSubmitting(true);
    try {
      const result = await api.sales.create({
        phone: phone.replace(/\D/g, ''),
        name: foundPatient === null ? newName : undefined,
        language: foundPatient === null ? newLanguage : undefined,
        payment_method: paymentMethod.toLowerCase(),
        items: validItems.map(({ medicine_name, quantity, refill_interval_days, unit_price }) => ({
          medicine_name,
          quantity: quantity || undefined,
          refill_interval_days: refill_interval_days ?? 28,
          unit_price: unit_price || undefined,
        })),
      });

      const total = Math.round(
        validItems.reduce((s, i) => s + (i.unit_price || 0) * (i.quantity || 1), 0)
      );

      setDone({
        patientId: result.patient.id,
        patientName: foundPatient?.name ?? newName,
        isNew: result.isNew,
        whatsappSent: result.whatsappSent,
        paymentMethod,
        total,
        medicines: validItems.map(i => ({
          name: i.medicine_name,
          qty: i.quantity || 1,
          price: i.unit_price || 0,
        })),
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Sale failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col">
        <SuccessScreen done={done} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <StepperHeader current={step} onStepClick={setStep} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {step === 'patient' && (
          <PatientStep
            phone={phone}
            onPhoneChange={handlePhoneChange}
            lookingUp={lookingUp}
            foundPatient={foundPatient}
            newName={newName}
            setNewName={setNewName}
            newLanguage={newLanguage}
            setNewLanguage={setNewLanguage}
            onContinue={() => setStep('medicines')}
          />
        )}
        {step === 'medicines' && (
          <MedicinesStep
            items={items}
            keyCounter={keyCounter}
            setItems={setItems}
            setKeyCounter={setKeyCounter}
            loadingDetail={loadingDetail}
            patientDetail={patientDetail}
            patient={foundPatient ?? null}
            onBack={() => setStep('patient')}
            onContinue={() => setStep('payment')}
          />
        )}
        {step === 'payment' && (
          <PaymentStep
            items={items}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            patient={foundPatient ?? null}
            submitting={submitting}
            onBack={() => setStep('medicines')}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd frontend && npx tsc --noEmit
```

Expected: zero errors. Fix any type errors before continuing.

- [ ] **Step 3: Run lint**

```bash
cd frontend && npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/app/\(dashboard\)/new-sale/page.tsx
git commit -m "feat(new-sale): rewrite page.tsx as 3-step stepper"
```

---

### Task 10: Manual verification

- [ ] **Step 1: Start dev server**

```bash
cd frontend && npm run dev
```

Open `http://localhost:3000/new-sale`

- [ ] **Step 2: Verify Step 1 — Patient**

- Stepper shows `[ 1 Patient ] ── [ 2 Medicines ] ── [ 3 Payment ]`
- Phone input has autofocus
- Type 9 digits → Continue button disabled, "Enter a 10-digit mobile number" appears below
- Type 10th digit → spinner appears, then found patient card shows name in `text-base font-semibold`
- WhatsApp opted-out patient → amber warning shows
- Unknown number → amber "New patient" section appears, Continue stays disabled until name is entered

- [ ] **Step 3: Verify Step 2 — Medicines**

- Stepper shows `[ ✓ Patient ] ── [ 2 Medicines ] ── [ 3 Payment ]`
- For existing patient: two-column layout with patient context panel on right
- For new patient: single-column layout (no right panel)
- Type in medicine name → autocomplete dropdown appears after 300ms
- Select from dropdown → price fills, focus jumps to price input
- Running total shows ₹0 even before any prices entered
- ⚙ icon → days sub-row expands, icon rotates 90°
- Qty field shows `1` not empty
- Refill due and Recent sections in right panel → [+] adds to left, turns to ✓
- Back → returns to Step 1 with all data intact

- [ ] **Step 4: Verify Step 3 — Payment**

- Order summary shows all medicines with ×qty and ₹price
- Total in large bold
- Payment method pills — clicking selects
- WhatsApp notice shows correct state
- Complete Sale → spinner → redirects to success screen

- [ ] **Step 5: Verify Success screen**

- Patient name + total + payment method in subtitle
- Full medicine list
- WhatsApp sent/not sent
- New Sale → returns to Step 1 with fresh form

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat(new-sale): stepper redesign complete"
```
