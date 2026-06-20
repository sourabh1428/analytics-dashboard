# Area C — Broadcast Template Picker + Personalisation Design

**Date:** 2026-06-13
**PM Gate:** ✅ Approved
**Designer Gate:** ✅ Approved

---

## Problem

The Broadcasts page only sends free-text WhatsApp messages, which only reach patients who messaged the pharmacy in the last 24 hours (WhatsApp session window). Pre-approved Gupshup templates bypass the session window and reach all opted-in patients. There is currently no way to send a template broadcast.

---

## Scope

Two changes:
1. **Frontend:** Add template mode to the Broadcasts compose form
2. **Backend:** Accept `template_id` on `POST /broadcasts` and route to `sendTemplateViaGupshup`

---

## Frontend: Broadcasts Page

**File:** `frontend/app/(dashboard)/broadcasts/page.tsx`

### Compose Form Structure (both modes)

```
[Language filter]  [Tag filter]
[Mode toggle: "Free text" | "Use template"]   ← NEW, rounded-full pills
[Content area — changes by mode]
[Send button]
```

### Mode Toggle

Two `<button type="button">` pills with `rounded-full`:
- Active: `bg-emerald-600 text-white`
- Inactive: `bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50`

### Free Text Mode (unchanged except amber banner position)

- Amber 24h warning banner (existing)
- Textarea with `{{name}}` hint, char counter

### Template Mode

**1. Template dropdown**

Fetches via `api.pharmacy.waTemplates()` on mode switch (lazy — only called when user switches to template mode for the first time).

- **Loading:** `animate-pulse` skeleton div replacing the select
- **Error:** `toast.error('Failed to load templates')` + disabled select showing "Failed to load — try refreshing" + a small "Retry" button that re-calls `waTemplates()`
- **Empty:** disabled select showing "No approved templates" + `<p>` below: "Contact support@easibill.in to add one"
- **Loaded:** `<select>` with option per template (`elementName` as label, `id` as value)

**2. Template preview**

Read-only text block showing the selected template's `body`. Label above: "Template content · fixed by WhatsApp". On mobile: truncated to 2 lines with a "Show full" toggle.

**3. Parameter mapping**

Shown only when the selected template body contains at least one `{{N}}` placeholder (detected via `/\{\{\d+\}\}/g`).

One row per placeholder:
- Label: "Variable 1", "Variable 2", etc.
- A `<select>` with options from `MAPPING_OPTIONS`:

```typescript
const MAPPING_OPTIONS = [
  { value: 'patient_name',   label: 'Patient name' },
  { value: 'pharmacy_name',  label: 'Pharmacy name' },
  { value: 'medicine_list',  label: 'Medicine list' },
  { value: 'refill_days',    label: 'Refill due in (days)' },
];
```

- Max 4 rows visible; if template has >4 placeholders, remaining rows in `max-h-48 overflow-y-auto` container.
- Zero-placeholder templates: parameter section hidden entirely.

**4. Amber banner**

Hidden in template mode (template messages bypass the 24h session window).

### API Call (template mode)

```typescript
await api.broadcasts.send({
  message: selectedTemplate.body,   // used for display in history
  template_id: selectedTemplate.id,
  template_params: paramMapping,    // string[] of MAPPING_OPTIONS values in order
  filter_tag_id: filterTagId || undefined,
  filter_language: filterLanguage || undefined,
});
```

---

## Backend: Broadcasts Route

**File:** `backend/src/routes/broadcasts.ts`

### POST /broadcasts — new fields

Accept two optional new fields in the request body:
- `template_id: string | undefined`
- `template_params: string[] | undefined` — ordered list of data field keys matching `{{1}}`, `{{2}}`, etc.

When `template_id` is present, the broadcast worker sends via `sendTemplateViaGupshup` instead of free-text `sendViaGupshup`.

The `message_body` column stores the template body text (for history display).

### BroadcastWorker — new logic

In `backend/src/jobs/broadcastWorker.ts`, extend `BroadcastJobData` with:
```typescript
templateId?: string;
templateParams?: string[];
```

In the worker handler, resolve parameter values per recipient:

```typescript
const FIELD_RESOLVERS: Record<string, (data: RecipientData) => string> = {
  patient_name:   d => d.patientName,
  pharmacy_name:  d => d.pharmacyName,
  medicine_list:  d => d.medicineList ?? '',
  refill_days:    d => d.refillDays ?? '',
};

const resolvedParams = (templateParams ?? []).map(key =>
  FIELD_RESOLVERS[key]?.(recipientData) ?? ''
);
```

Then call `sendTemplateViaGupshup({ to, templateId, templateParams: resolvedParams, templateBody })`.

`medicine_list` and `refill_days` will be empty strings for broadcast recipients (no recent purchase context) — this is acceptable for broadcast templates which typically only use `patient_name` and `pharmacy_name`.

---

## API Type Changes

**File:** `frontend/lib/api.ts`

Extend `broadcasts.send` body type:
```typescript
send: (body: {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
  template_id?: string;
  template_params?: string[];
}) => ...
```

---

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/(dashboard)/broadcasts/page.tsx` | Add mode toggle, template picker, parameter mapping |
| `frontend/lib/api.ts` | Extend `broadcasts.send` body type |
| `backend/src/routes/broadcasts.ts` | Accept `template_id` + `template_params`, pass to worker |
| `backend/src/jobs/broadcastWorker.ts` | Extend job data, resolve params, route to template send |

---

## Out of Scope

- Creating/editing templates (done in Gupshup dashboard)
- Billing credits (Area D)
- Team members
