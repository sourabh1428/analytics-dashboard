# New Sale — POS Split-Panel Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-step stepper with a single-screen split-panel POS layout — left 60% for order entry, right 40% as a live receipt — so a pharmacist completes a transaction without ever clicking "Next".

**Architecture:** `page.tsx` owns all state and handlers. It renders `<LeftPanel>` and `<RightPanel>` side by side in a fixed-height flex row. No steps, no navigation. The right panel swaps to `<ReceiptPanel>` in-place after a successful sale; the left resets immediately for the next transaction. All old stepper components are deleted.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind CSS, TypeScript, lucide-react, sonner.

---

## File Map

| File | Action |
|------|--------|
| `frontend/app/(dashboard)/new-sale/types.ts` | Modify — drop `StepId`, keep `SaleItemWithKey` + `DoneState` |
| `frontend/app/(dashboard)/new-sale/page.tsx` | Rewrite — split layout shell, all state + handlers |
| `frontend/app/(dashboard)/new-sale/components/PatientStrip.tsx` | Create — coloured left-border strip for patient identity |
| `frontend/app/(dashboard)/new-sale/components/MedicineRow.tsx` | Rewrite — tabular, always-visible days, tab-advance |
| `frontend/app/(dashboard)/new-sale/components/LeftPanel.tsx` | Create — phone input + patient strip + medicine table |
| `frontend/app/(dashboard)/new-sale/components/ReceiptPanel.tsx` | Create — post-sale receipt that replaces right panel content |
| `frontend/app/(dashboard)/new-sale/components/RightPanel.tsx` | Create — patient identity + live cart + total + payment + button |
| `frontend/app/(dashboard)/new-sale/components/StepperHeader.tsx` | Delete |
| `frontend/app/(dashboard)/new-sale/components/PatientStep.tsx` | Delete |
| `frontend/app/(dashboard)/new-sale/components/MedicinesStep.tsx` | Delete |
| `frontend/app/(dashboard)/new-sale/components/PaymentStep.tsx` | Delete |
| `frontend/app/(dashboard)/new-sale/components/PatientContextPanel.tsx` | Delete |
| `frontend/app/(dashboard)/new-sale/components/SuccessScreen.tsx` | Delete |

---

## Task 1: Update types.ts — drop StepId

**Files:**
- Modify: `frontend/app/(dashboard)/new-sale/types.ts`

`StepId` is no longer needed (no steps). `DoneState` already has `patientPhone`. Drop `StepId` and leave the rest intact.

- [ ] **Step 1: Replace the file**

```typescript
import type { SaleItem } from '../../../lib/api';

export type SaleItemWithKey = SaleItem & { _key: number };

export type DoneState = {
  patientId: string;
  patientName: string;
  patientPhone: string;
  isNew: boolean;
  whatsappSent: boolean;
  paymentMethod: string;
  total: number;
  medicines: { name: string; qty: number; price: number }[];
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/(dashboard)/new-sale/types.ts
git commit -m "refactor(new-sale): drop StepId type — stepper removed"
```

---

## Task 2: PatientStrip component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/PatientStrip.tsx`

Renders one of three states: loading skeleton, found-patient strip (green accent), new-patient form (amber accent). Shown in the left panel below the phone input.

- [ ] **Step 1: Create the file**

```tsx
'use client';
import { Loader2 } from 'lucide-react';
import type { Patient } from '../../../../lib/api';

const LANGUAGES = ['hindi', 'english', 'marathi', 'telugu', 'kannada', 'gujarati', 'bengali', 'punjabi'];

const fieldCls = "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue";

export function PatientStrip({
  lookingUp,
  foundPatient,
  newName,
  setNewName,
  newLanguage,
  setNewLanguage,
}: {
  lookingUp: boolean;
  foundPatient: Patient | null | undefined;
  newName: string;
  setNewName: (v: string) => void;
  newLanguage: string;
  setNewLanguage: (v: string) => void;
}) {
  if (lookingUp) {
    return (
      <div className="h-10 bg-zinc-100 animate-pulse rounded" />
    );
  }

  if (foundPatient) {
    const waOk = foundPatient.opted_in !== false;
    return (
      <div className="border-l-4 border-emerald-500 bg-emerald-50/40 px-3 py-2 rounded-r">
        <p className="text-sm font-semibold text-zinc-900">{foundPatient.name}</p>
        <p className="text-xs text-zinc-500">
          {foundPatient.phone}
          {' · '}
          <span className="capitalize">{foundPatient.language}</span>
          {' · '}
          {waOk
            ? <span className="text-emerald-600">✓ WhatsApp</span>
            : <span className="text-amber-600">⚠ No WhatsApp</span>
          }
        </p>
      </div>
    );
  }

  if (foundPatient === null) {
    return (
      <div className="border-l-4 border-amber-400 bg-amber-50/40 px-3 py-2 rounded-r space-y-2">
        <p className="text-xs font-medium text-amber-700">New patient — enter their details</p>
        <input
          type="text"
          placeholder="Patient name *"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className={fieldCls}
          autoFocus
        />
        <select
          value={newLanguage}
          onChange={e => setNewLanguage(e.target.value)}
          className={fieldCls}
        >
          {LANGUAGES.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add "frontend/app/(dashboard)/new-sale/components/PatientStrip.tsx"
git commit -m "feat(new-sale): PatientStrip component"
```

---

## Task 3: Rewrite MedicineRow

**Files:**
- Modify: `frontend/app/(dashboard)/new-sale/components/MedicineRow.tsx`

Tabular layout. All four data fields (name, price, qty, days) in one horizontal row with no mobile/desktop split. Spreadsheet-cell input style: border-transparent at rest, visible on hover/focus. Subtotal computed. Tab from the Days field on the last row calls `onAddRow` and prevents default tab navigation. Autocomplete logic preserved from the existing file.

- [ ] **Step 1: Replace the entire file**

```tsx
'use client';
import { useState, useRef, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { api } from '../../../../lib/api';
import type { SaleItem } from '../../../../lib/api';
import type { SaleItemWithKey } from '../types';

type Suggestion = { name: string; default_price: number | null; default_refill_days: number | null };
type SugState = { items: Suggestion[]; loading: boolean; error: boolean; fetched: boolean };
const INIT_SUG: SugState = { items: [], loading: false, error: false, fetched: false };

const cellCls = "bg-transparent border border-transparent hover:border-zinc-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue rounded px-2 py-1.5 text-sm transition-colors";

export function MedicineRow({
  item,
  index,
  isLast,
  canRemove,
  onUpdate,
  onRemove,
  onAddRow,
}: {
  item: SaleItemWithKey;
  index: number;
  isLast: boolean;
  canRemove: boolean;
  onUpdate: (index: number, field: keyof SaleItem, value: string | number) => void;
  onRemove: (index: number) => void;
  onAddRow: () => void;
}) {
  const [showSugg, setShowSugg] = useState(false);
  const [sug, setSug] = useState<SugState>(INIT_SUG);
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
    <div className="flex items-center gap-1 border-b border-zinc-100 py-1 group">
      {/* Medicine name + autocomplete */}
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
          className={cn(cellCls, 'w-full px-3')}
          aria-label={`Medicine name for item ${index + 1}`}
        />
        {showSugg && (sug.loading || sug.error || sug.items.length > 0) && (
          <ul className="absolute z-20 top-full left-0 right-0 mt-0.5 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
            {sug.loading && (
              <li className="px-3 py-2 text-sm text-zinc-400 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading…
              </li>
            )}
            {sug.error && !sug.loading && (
              <li className="px-3 py-2 text-sm text-red-500 flex items-center gap-2">
                Could not load.
                <button type="button" className="underline" onMouseDown={e => { e.preventDefault(); doFetch(item.medicine_name); }}>
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
        className={cn(cellCls, 'w-24 text-right tabular-nums')}
        aria-label={`Price for item ${index + 1}`}
      />

      {/* Qty */}
      <input
        type="number"
        placeholder="1"
        min={1}
        value={item.quantity ?? 1}
        onChange={e => onUpdate(index, 'quantity', Number(e.target.value))}
        className={cn(cellCls, 'w-14 text-center tabular-nums')}
        aria-label={`Quantity for item ${index + 1}`}
      />

      {/* Refill days — tab on last row adds new row */}
      <input
        type="number"
        placeholder="28"
        min={1}
        max={365}
        value={item.refill_interval_days ?? 28}
        onChange={e => onUpdate(index, 'refill_interval_days', Number(e.target.value))}
        onKeyDown={e => {
          if (e.key === 'Tab' && !e.shiftKey && isLast) {
            e.preventDefault();
            onAddRow();
          }
        }}
        className={cn(cellCls, 'w-16 text-center tabular-nums')}
        aria-label={`Refill days for item ${index + 1}`}
      />

      {/* Subtotal */}
      <span className={cn('w-16 text-right text-xs tabular-nums shrink-0', subtotal ? 'text-zinc-500' : 'text-transparent')}>
        {subtotal ? `₹${subtotal}` : '₹0'}
      </span>

      {/* Remove */}
      <button
        type="button"
        onClick={() => canRemove && onRemove(index)}
        aria-label={`Remove item ${index + 1}`}
        className={cn(
          'p-1 rounded transition-colors shrink-0',
          canRemove
            ? 'text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100'
            : 'invisible'
        )}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "frontend/app/(dashboard)/new-sale/components/MedicineRow.tsx"
git commit -m "feat(new-sale): rewrite MedicineRow — tabular, tab-advance, spreadsheet-cell inputs"
```

---

## Task 4: LeftPanel component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/LeftPanel.tsx`

Phone input at the top (full-width, `h-12`, autofocus). PatientStrip below it when the phone has ≥ 10 digits. Column header row. MedicineRow list. `+ Add medicine` text button at the bottom.

- [ ] **Step 1: Create the file**

```tsx
'use client';
import { Phone, Loader2, X } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { PatientStrip } from './PatientStrip';
import { MedicineRow } from './MedicineRow';
import type { Patient, SaleItem } from '../../../../lib/api';
import type { SaleItemWithKey } from '../types';

export function LeftPanel({
  phone,
  onPhoneChange,
  lookingUp,
  foundPatient,
  newName,
  setNewName,
  newLanguage,
  setNewLanguage,
  items,
  onUpdateItem,
  onRemoveItem,
  onAddRow,
}: {
  phone: string;
  onPhoneChange: (v: string) => void;
  lookingUp: boolean;
  foundPatient: Patient | null | undefined;
  newName: string;
  setNewName: (v: string) => void;
  newLanguage: string;
  setNewLanguage: (v: string) => void;
  items: SaleItemWithKey[];
  onUpdateItem: (index: number, field: keyof SaleItem, value: string | number) => void;
  onRemoveItem: (index: number) => void;
  onAddRow: () => void;
}) {
  const showStrip = lookingUp || foundPatient !== undefined;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ width: '60%' }}>
      {/* Phone input */}
      <div className="p-4 border-b border-zinc-100 shrink-0">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="tel"
            placeholder="Mobile number"
            value={phone}
            onChange={e => onPhoneChange(e.target.value)}
            className="w-full h-12 pl-9 pr-9 border border-zinc-200 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent placeholder:text-zinc-400"
            autoFocus
          />
          {lookingUp && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-zinc-400" />
          )}
          {phone && !lookingUp && (
            <button
              type="button"
              onClick={() => onPhoneChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Clear phone number"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Patient strip */}
      {showStrip && (
        <div className="px-4 py-2 border-b border-zinc-100 shrink-0">
          <PatientStrip
            lookingUp={lookingUp}
            foundPatient={foundPatient}
            newName={newName}
            setNewName={setNewName}
            newLanguage={newLanguage}
            setNewLanguage={setNewLanguage}
          />
        </div>
      )}

      {/* Medicine table */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Column headers */}
        <div className="flex items-center gap-1 text-xs text-zinc-400 uppercase tracking-wide pb-2 border-b border-zinc-200 mb-1 shrink-0">
          <span className="flex-1 pl-3">Medicine</span>
          <span className="w-24 text-right pr-2">₹ Price</span>
          <span className="w-14 text-center">Qty</span>
          <span className="w-16 text-center">Days</span>
          <span className="w-16 text-right">Subtotal</span>
          <span className="w-5" />
        </div>

        {/* Rows */}
        {items.map((item, index) => (
          <MedicineRow
            key={item._key}
            item={item}
            index={index}
            isLast={index === items.length - 1}
            canRemove={items.length > 1}
            onUpdate={onUpdateItem}
            onRemove={onRemoveItem}
            onAddRow={onAddRow}
          />
        ))}

        {/* Add medicine */}
        <button
          type="button"
          onClick={onAddRow}
          className="mt-2 text-sm text-zinc-400 hover:text-zinc-700 py-2 w-full text-left pl-3 transition-colors"
        >
          + Add medicine
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "frontend/app/(dashboard)/new-sale/components/LeftPanel.tsx"
git commit -m "feat(new-sale): LeftPanel — phone input, patient strip, medicine table"
```

---

## Task 5: ReceiptPanel component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/ReceiptPanel.tsx`

Shown in the right panel after a successful sale. Displays patient name, items as receipt rows, total, WhatsApp status, and two action buttons. `onNewSale` resets the page; "View Patient" links to the patient detail page.

- [ ] **Step 1: Create the file**

```tsx
'use client';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import type { DoneState } from '../types';

export function ReceiptPanel({ receipt, onNewSale }: { receipt: DoneState; onNewSale: () => void }) {
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
        <span className="text-sm font-semibold text-emerald-700">Sale complete</span>
      </div>

      {/* Patient */}
      <p className="text-base font-semibold text-zinc-900">{receipt.patientName}</p>
      <p className="text-xs text-zinc-500 mb-5">
        {receipt.patientPhone} · {receipt.paymentMethod}
        {receipt.isNew && ' · New patient'}
      </p>

      {/* Items */}
      <div className="flex-1 space-y-3 mb-5">
        {receipt.medicines.map((m, i) => (
          <div key={i} className="flex items-start justify-between border-b border-zinc-100 pb-3 last:border-0">
            <div>
              <p className="text-sm text-zinc-700">{m.name}</p>
              <p className="text-xs text-zinc-400">×{m.qty}</p>
            </div>
            {m.price > 0 && (
              <span className="text-sm tabular-nums text-zinc-700 shrink-0">
                ₹{Math.round(m.price * m.qty).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-zinc-200 pt-4 mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-zinc-400 uppercase tracking-wide">Total</span>
          <span className="text-3xl font-bold tabular-nums text-zinc-900">
            ₹{receipt.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* WhatsApp status */}
      <p className={cn('text-xs text-center mb-5', receipt.whatsappSent ? 'text-zinc-400' : 'text-amber-600')}>
        {receipt.whatsappSent ? '✅ WhatsApp confirmation sent' : '⚠ WhatsApp confirmation not sent'}
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/patients/${receipt.patientId}`}
          className="flex-1 text-center border border-zinc-200 rounded-xl py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          View Patient
        </Link>
        <button
          type="button"
          onClick={onNewSale}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
        >
          New Sale →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "frontend/app/(dashboard)/new-sale/components/ReceiptPanel.tsx"
git commit -m "feat(new-sale): ReceiptPanel — post-sale receipt in right panel"
```

---

## Task 6: RightPanel component

**Files:**
- Create: `frontend/app/(dashboard)/new-sale/components/RightPanel.tsx`

The right 40% panel. When `receipt` is non-null it renders `<ReceiptPanel>`. Otherwise it shows: patient identity section (hidden until patient resolves), cart rows (mirrors items), total, payment pills, Complete Sale button, WhatsApp notice.

- [ ] **Step 1: Create the file**

```tsx
'use client';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { ReceiptPanel } from './ReceiptPanel';
import type { Patient, SaleItem } from '../../../../lib/api';
import type { SaleItemWithKey, DoneState } from '../types';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Other'] as const;

export function RightPanel({
  foundPatient,
  newName,
  items,
  paymentMethod,
  setPaymentMethod,
  submitting,
  onSubmit,
  receipt,
  onNewSale,
}: {
  foundPatient: Patient | null | undefined;
  newName: string;
  items: SaleItemWithKey[];
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  submitting: boolean;
  onSubmit: () => void;
  receipt: DoneState | null;
  onNewSale: () => void;
}) {
  if (receipt) {
    return (
      <div className="h-full bg-zinc-50 border-l border-zinc-200" style={{ width: '40%' }}>
        <ReceiptPanel receipt={receipt} onNewSale={onNewSale} />
      </div>
    );
  }

  const validItems = items.filter(i => i.medicine_name.trim());
  const total = Math.round(validItems.reduce((s, i) => s + (i.unit_price || 0) * (i.quantity || 1), 0));

  const patientResolved = foundPatient !== undefined;
  const patientName = foundPatient ? foundPatient.name : newName || null;
  const waOk = foundPatient ? foundPatient.opted_in !== false : true;

  const canSubmit = patientResolved && validItems.length > 0 && !submitting &&
    (foundPatient !== null || newName.trim().length > 0);

  return (
    <div className="flex flex-col h-full bg-zinc-50 border-l border-zinc-200 overflow-y-auto" style={{ width: '40%' }}>
      {!patientResolved ? (
        /* Empty state */
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-zinc-400 text-center px-6">Enter mobile number<br />to begin</p>
        </div>
      ) : (
        <>
          {/* Patient identity */}
          <div className="px-5 pt-5 pb-4 border-b border-zinc-200 shrink-0">
            <p className="text-base font-semibold text-zinc-900">{patientName ?? '—'}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {foundPatient ? foundPatient.phone : 'New patient'}
              {foundPatient && ` · ${foundPatient.language}`}
            </p>
          </div>

          {/* Cart */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {validItems.length === 0 ? (
              <p className="text-sm text-zinc-400 text-center py-8">Add medicines to begin</p>
            ) : (
              <div className="space-y-3">
                {validItems.map(item => {
                  const lineTotal = (item.unit_price || 0) > 0
                    ? Math.round((item.unit_price || 0) * (item.quantity || 1))
                    : null;
                  return (
                    <div key={item._key} className="flex items-start justify-between border-b border-zinc-100 pb-3 last:border-0">
                      <div className="min-w-0 mr-3">
                        <p className="text-sm text-zinc-700 truncate">{item.medicine_name}</p>
                        <p className="text-xs text-zinc-400">
                          ×{item.quantity || 1}
                          {(item.unit_price || 0) > 0 && ` · ₹${item.unit_price} each`}
                        </p>
                      </div>
                      {lineTotal !== null && (
                        <span className="text-sm tabular-nums text-zinc-700 shrink-0">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="px-5 border-t border-zinc-200 pt-4 shrink-0">
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-xs text-zinc-400 uppercase tracking-wide">Total</span>
              <span className="text-3xl font-bold tabular-nums text-zinc-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Payment method */}
            <div className="flex gap-2 flex-wrap mb-5">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    paymentMethod === m
                      ? 'bg-zinc-900 text-white'
                      : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Complete Sale */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-base font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
            >
              {submitting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                : 'Complete Sale'
              }
            </button>

            {/* WhatsApp notice */}
            <p className={cn('text-xs text-center pb-5', waOk ? 'text-zinc-400' : 'text-amber-600')}>
              {foundPatient
                ? waOk
                  ? 'WhatsApp confirmation will be sent'
                  : '⚠ Patient opted out — no WhatsApp'
                : ''
              }
            </p>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "frontend/app/(dashboard)/new-sale/components/RightPanel.tsx"
git commit -m "feat(new-sale): RightPanel — cart, total, payment, Complete Sale"
```

---

## Task 7: Rewrite page.tsx

**Files:**
- Modify: `frontend/app/(dashboard)/new-sale/page.tsx`

Owns all state. Renders `<LeftPanel>` and `<RightPanel>` in a fixed-height horizontal flex. No steps, no stepper. `handlePhoneChange` clears `receipt` so the left panel is ready as soon as the sale completes. The `handleNewSale` reset re-focuses the phone input via a callback ref.

- [ ] **Step 1: Replace the entire file**

```tsx
'use client';
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { api, ApiError } from '../../../lib/api';
import type { Patient, SaleItem } from '../../../lib/api';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import type { SaleItemWithKey, DoneState } from './types';

const BLANK_ROW = (): SaleItemWithKey => ({ _key: Date.now(), medicine_name: '', refill_interval_days: 28, quantity: 1 });

export default function NewSalePage() {
  // Patient
  const [phone, setPhone] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [foundPatient, setFoundPatient] = useState<Patient | null | undefined>(undefined);
  const [newName, setNewName] = useState('');
  const [newLanguage, setNewLanguage] = useState('hindi');
  const phoneDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Items
  const [items, setItems] = useState<SaleItemWithKey[]>([BLANK_ROW()]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<DoneState | null>(null);

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

  const handleUpdateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRow = useCallback(() => {
    setItems(prev => [...prev, BLANK_ROW()]);
    // Focus the new row's name input on next tick (MedicineRow autoFocus not used; focus via DOM)
    setTimeout(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('[aria-label^="Medicine name for item"]');
      inputs[inputs.length - 1]?.focus();
    }, 0);
  }, []);

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

      const total = Math.round(validItems.reduce((s, i) => s + (i.unit_price || 0) * (i.quantity || 1), 0));

      setReceipt({
        patientId: result.patient.id,
        patientName: foundPatient?.name ?? newName,
        patientPhone: phone.replace(/\D/g, ''),
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

      // Reset left panel immediately for next transaction
      setPhone('');
      setFoundPatient(undefined);
      setNewName('');
      setNewLanguage('hindi');
      setItems([BLANK_ROW()]);
      setPaymentMethod('Cash');
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[placeholder="Mobile number"]')?.focus();
      }, 0);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Sale failed — try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewSale = () => {
    setReceipt(null);
    // Phone input already cleared after submit; just re-focus
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[placeholder="Mobile number"]')?.focus();
    }, 0);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-white">
      <LeftPanel
        phone={phone}
        onPhoneChange={handlePhoneChange}
        lookingUp={lookingUp}
        foundPatient={foundPatient}
        newName={newName}
        setNewName={setNewName}
        newLanguage={newLanguage}
        setNewLanguage={setNewLanguage}
        items={items}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
        onAddRow={handleAddRow}
      />
      <RightPanel
        foundPatient={foundPatient}
        newName={newName}
        items={items}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        submitting={submitting}
        onSubmit={handleSubmit}
        receipt={receipt}
        onNewSale={handleNewSale}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "frontend/app/(dashboard)/new-sale/page.tsx"
git commit -m "feat(new-sale): rewrite page.tsx as split-panel POS — no stepper"
```

---

## Task 8: Delete old stepper components

**Files:**
- Delete: `frontend/app/(dashboard)/new-sale/components/StepperHeader.tsx`
- Delete: `frontend/app/(dashboard)/new-sale/components/PatientStep.tsx`
- Delete: `frontend/app/(dashboard)/new-sale/components/MedicinesStep.tsx`
- Delete: `frontend/app/(dashboard)/new-sale/components/PaymentStep.tsx`
- Delete: `frontend/app/(dashboard)/new-sale/components/PatientContextPanel.tsx`
- Delete: `frontend/app/(dashboard)/new-sale/components/SuccessScreen.tsx`

- [ ] **Step 1: Delete the files**

```bash
rm "frontend/app/(dashboard)/new-sale/components/StepperHeader.tsx"
rm "frontend/app/(dashboard)/new-sale/components/PatientStep.tsx"
rm "frontend/app/(dashboard)/new-sale/components/MedicinesStep.tsx"
rm "frontend/app/(dashboard)/new-sale/components/PaymentStep.tsx"
rm "frontend/app/(dashboard)/new-sale/components/PatientContextPanel.tsx"
rm "frontend/app/(dashboard)/new-sale/components/SuccessScreen.tsx"
```

- [ ] **Step 2: Commit**

```bash
git add -A "frontend/app/(dashboard)/new-sale/components/"
git commit -m "chore(new-sale): delete stepper components — replaced by split-panel POS"
```

---

## Task 9: TypeScript check + visual verification

**Files:** None created — verification only.

- [ ] **Step 1: TypeScript check**

```bash
cd frontend && npx tsc --noEmit
```

Expected: zero errors. If errors appear, they will name the exact file and line — fix them before proceeding.

Common errors to watch for:
- `foundPatient` typed as `Patient | null | undefined` — `undefined` means "not yet resolved", `null` means "not found". Make sure comparisons use `=== null` / `=== undefined` explicitly, not falsy checks.
- `SaleItem` field names: `medicine_name`, `unit_price`, `quantity`, `refill_interval_days` — match exactly what `api.sales.create` expects.

- [ ] **Step 2: Start dev server**

```bash
cd frontend && npm run dev
```

Open `http://localhost:3000/new-sale`.

- [ ] **Step 3: Verify layout**

Confirm:
- Page is a horizontal split — left ~60%, right ~40%, no outer scroll
- Left panel: phone input with Phone icon, no patient strip visible yet
- Right panel: grey bg (`bg-zinc-50`), "Enter mobile number to begin" centred

- [ ] **Step 4: Verify patient lookup**

Type `9876543210` (a patient from smoke test). Confirm:
- Spinner appears while looking up
- Green left-border strip appears: name, phone, language, ✓ WhatsApp
- Right panel: patient name appears at top
- Clear `×` button appears in phone input after lookup

Type a number not in the DB. Confirm:
- Amber left-border strip: "New patient", name input, language select

- [ ] **Step 5: Verify medicine entry**

Click medicine name input. Confirm autocomplete dropdown opens.
Type "Met" — suggestions filter. Select one — price and days fill, focus moves to price input.
Tab through price → qty → days → Tab from days appends a new row and focuses its name input.
Confirm subtotal appears in right panel cart row.
Confirm total updates in real time.

- [ ] **Step 6: Verify payment and submit**

Select UPI — pill turns `bg-zinc-900 text-white`. Others revert to outline.
Complete Sale button is active (green, full-width).
Click Complete Sale → spinner → right panel swaps to ReceiptPanel showing patient name, items, total, WhatsApp status, two buttons.
Left panel resets to blank phone input with focus.

- [ ] **Step 7: Verify New Sale reset**

Click "New Sale →" in receipt — right panel reverts to "Enter mobile number to begin" empty state. Phone input has focus.

- [ ] **Step 8: Final commit if any lint/TS fixes were needed**

```bash
cd ..
git add -A
git commit -m "fix(new-sale): post-verification TS/lint fixes"
```

Only run this step if Step 1 produced errors that required fixes. Skip if the TypeScript check passed clean.
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| Fixed full-height split, no outer scroll | Task 7 — `h-[calc(100vh-4rem)] overflow-hidden` |
| Left 60%, right 40% | Tasks 4, 6 — `style={{ width: '60%' }}` / `40%` |
| Phone input autofocus, `h-12`, Phone icon, clear × | Task 4 |
| Patient strip: green/amber left border, states | Task 2 |
| Column headers: Medicine, ₹ Price, Qty, Days, Subtotal | Task 4 |
| MedicineRow: tabular, spreadsheet-cell inputs, `tabular-nums` | Task 3 |
| Tab-advance from last Days field appends row | Task 3 |
| Autocomplete preserved | Task 3 |
| Right panel: bg-zinc-50, border-l border-zinc-200 | Task 6 |
| Cart: receipt-style rows, no card borders | Task 6 |
| Total: `text-3xl font-bold tabular-nums` | Task 6 |
| Payment pills: zinc-900 active, outline inactive | Task 6 |
| Complete Sale: `h-14`, full-width, emerald | Task 6 |
| Disabled when no patient or no medicine | Task 6 |
| After sale: right panel swaps to receipt in-place | Task 6 |
| Left panel resets immediately after submit | Task 7 |
| ReceiptPanel: items, total, WhatsApp status, View Patient + New Sale | Task 5 |
| Delete all stepper components | Task 8 |
| StepId type removed | Task 1 |

No gaps found. All spec requirements covered.

**Placeholder scan:** No TBD, TODO, or vague steps found.

**Type consistency:** `SaleItemWithKey`, `DoneState`, `Patient`, `SaleItem` used consistently across all tasks. `onUpdateItem` prop name matches usage in Tasks 4 and 7. `onAddRow` matches Tasks 3, 4, and 7.
