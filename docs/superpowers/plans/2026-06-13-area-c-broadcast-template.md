# Area C — Broadcast Template Picker + Personalisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Use template" mode to the Broadcasts page so pharmacy owners can send pre-approved Gupshup template messages that bypass the 24h session window and reach all opted-in patients.

**Architecture:** Four tasks in sequence — (1) extend the BullMQ worker type + handler to support template sends, (2) extend the broadcast route to accept and forward template fields, (3) extend the frontend API type, (4) rewrite the Broadcasts compose form with mode toggle + template picker. The backend `sendTemplateViaGupshup` function already exists. No DB migration needed — `message_body` stores the template body text.

**Tech Stack:** Node.js + TypeScript + BullMQ (backend); Next.js 14 + Tailwind CSS + TypeScript (frontend).

---

## File Map

| File | Change |
|------|--------|
| `backend/src/jobs/broadcastWorker.ts` | Add `templateId?` + `templateParams?` to job type; route to `sendTemplateViaGupshup` when present |
| `backend/src/routes/broadcasts.ts` | Accept `template_id` + `template_params` in POST body; pass to job |
| `frontend/lib/api.ts` | Add `template_id?` + `template_params?` to `broadcasts.send` body type |
| `frontend/app/(dashboard)/broadcasts/page.tsx` | Add mode toggle, template picker, parameter mapping UI |

---

## Task 1: Backend — Extend BroadcastWorker for Template Sends

**Files:**
- Modify: `backend/src/jobs/broadcastWorker.ts`

Context: `sendTemplateViaGupshup` is already in `backend/src/services/gupshupService.ts`. Its signature:
```typescript
sendTemplateViaGupshup(params: {
  to: string;
  templateId: string;   // elementName from Gupshup template list
  templateParams: string[];
  templateBody?: string;
}): Promise<string>
```

The current `BroadcastJobData` has no template fields. The worker always calls `sendViaGupshup` (free-text).

- [ ] **Step 1: Add `sendTemplateViaGupshup` import**

Open `backend/src/jobs/broadcastWorker.ts`. Line 4 currently reads:
```typescript
import { sendViaGupshup } from '../services/gupshupService';
```
Change to:
```typescript
import { sendViaGupshup, sendTemplateViaGupshup } from '../services/gupshupService';
```

- [ ] **Step 2: Extend `BroadcastJobData` with optional template fields**

Replace the current `BroadcastJobData` type (lines 6–14):
```typescript
export type BroadcastJobData = {
  broadcastId: string;
  pharmacyId: string;
  pharmacyName: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  message: string;
};
```
With:
```typescript
export type BroadcastJobData = {
  broadcastId: string;
  pharmacyId: string;
  pharmacyName: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  message: string;
  templateId?: string;
  templateParams?: string[];
};
```

- [ ] **Step 3: Update the worker handler to route template vs free-text sends**

In `startBroadcastWorker`, replace the `try` block inside the worker (lines 28–38) with:

```typescript
const {
  broadcastId, pharmacyId, pharmacyName,
  patientPhone, patientName, message,
  templateId, templateParams,
} = job.data;

const FIELD_RESOLVERS: Record<string, string> = {
  patient_name:  patientName,
  pharmacy_name: pharmacyName,
  medicine_list: '',
  refill_days:   '',
};

try {
  if (templateId) {
    const resolvedParams = (templateParams ?? []).map(key => FIELD_RESOLVERS[key] ?? '');
    await sendTemplateViaGupshup({
      to: patientPhone,
      templateId,
      templateParams: resolvedParams,
      templateBody: message,
    });
  } else {
    await sendViaGupshup({ to: patientPhone, body: message, pharmacyName });
  }

  await pool.query(
    `UPDATE broadcasts SET sent_count = sent_count + 1 WHERE id = $1`,
    [broadcastId]
  );
  await pool.query(
    `INSERT INTO message_logs (pharmacy_id, to_phone, message_body, channel, status)
     VALUES ($1, $2, $3, 'gupshup', 'sent')`,
    [pharmacyId, patientPhone, message]
  );
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  await pool.query(
    `UPDATE broadcasts SET failed_count = failed_count + 1 WHERE id = $1`,
    [broadcastId]
  );
  await pool.query(
    `INSERT INTO message_logs (pharmacy_id, to_phone, message_body, channel, status, error)
     VALUES ($1, $2, $3, 'gupshup', 'failed', $4)`,
    [pharmacyId, patientPhone, message, msg]
  );
  throw err;
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd backend && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add backend/src/jobs/broadcastWorker.ts
git commit -m "feat: broadcast worker routes to sendTemplateViaGupshup when templateId present"
```

---

## Task 2: Backend — Extend Broadcasts Route to Accept Template Fields

**Files:**
- Modify: `backend/src/routes/broadcasts.ts`

- [ ] **Step 1: Accept `template_id` and `template_params` in the POST body destructure**

Open `backend/src/routes/broadcasts.ts`. Find lines 28–32:
```typescript
const { message, filter_tag_id, filter_language } = req.body as {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
};
```
Replace with:
```typescript
const { message, filter_tag_id, filter_language, template_id, template_params } = req.body as {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
  template_id?: string;
  template_params?: string[];
};
```

- [ ] **Step 2: Relax the message length validation when using a template**

Find lines 34–36:
```typescript
if (!message || typeof message !== 'string' || message.trim().length < 5) {
  return res.status(400).json({ success: false, error: 'message must be at least 5 characters', code: 'VALIDATION_ERROR' });
}
```
Replace with:
```typescript
if (!message || typeof message !== 'string' || message.trim().length < 1) {
  return res.status(400).json({ success: false, error: 'message is required', code: 'VALIDATION_ERROR' });
}
```

(Template bodies can be short; the 5-char minimum was for free-text only.)

- [ ] **Step 3: Pass `templateId` and `templateParams` to each BullMQ job**

Find the `broadcastQueue.add` call (lines 84–96):
```typescript
return broadcastQueue.add(
  'send-broadcast',
  {
    broadcastId,
    pharmacyId: req.pharmacyId!,
    pharmacyName,
    patientId: patient.id,
    patientName: patient.name,
    patientPhone: dest,
    message: personalised,
  },
  { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
);
```
Replace with:
```typescript
return broadcastQueue.add(
  'send-broadcast',
  {
    broadcastId,
    pharmacyId: req.pharmacyId!,
    pharmacyName,
    patientId: patient.id,
    patientName: patient.name,
    patientPhone: dest,
    message: personalised,
    templateId: template_id,
    templateParams: template_params,
  },
  { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
);
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd backend && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add backend/src/routes/broadcasts.ts
git commit -m "feat: broadcast route accepts template_id + template_params, forwards to worker"
```

---

## Task 3: Frontend — Extend API Type for Template Broadcasts

**Files:**
- Modify: `frontend/lib/api.ts`

- [ ] **Step 1: Add template fields to `broadcasts.send` body type**

Open `frontend/lib/api.ts`. Find the `broadcasts.send` method (around line 137):
```typescript
send: (body: { message: string; filter_tag_id?: string; filter_language?: string }) =>
  request<{ broadcastId: string; recipientCount: number; message: string }>(
    '/broadcasts', { method: 'POST', body: JSON.stringify(body) }
  ),
```
Replace with:
```typescript
send: (body: {
  message: string;
  filter_tag_id?: string;
  filter_language?: string;
  template_id?: string;
  template_params?: string[];
}) =>
  request<{ broadcastId: string; recipientCount: number; message: string }>(
    '/broadcasts', { method: 'POST', body: JSON.stringify(body) }
  ),
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd frontend && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/api.ts
git commit -m "feat: add template_id + template_params to broadcasts.send API type"
```

---

## Task 4: Frontend — Broadcast Page Template Mode UI

**Files:**
- Modify: `frontend/app/(dashboard)/broadcasts/page.tsx`

This is a full rewrite of the compose form. The BroadcastRow component and polling effect are unchanged.

- [ ] **Step 1: Replace the entire file content**

Write `frontend/app/(dashboard)/broadcasts/page.tsx` with the following:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { api, Broadcast, PatientTag, ApiError, GupshupTemplate } from '../../../lib/api';
import { toast } from 'sonner';
import { Send, Loader2, CheckCircle2, XCircle, Radio, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../lib/utils';

const LANGUAGES = ['', 'hindi', 'english', 'marathi', 'telugu', 'kannada', 'gujarati', 'bengali', 'punjabi'];

const MAPPING_OPTIONS = [
  { value: '', label: 'Select a field…' },
  { value: 'patient_name', label: 'Patient name' },
  { value: 'pharmacy_name', label: 'Pharmacy name' },
  { value: 'medicine_list', label: 'Medicine list' },
  { value: 'refill_days', label: 'Refill due in (days)' },
];

const inputClass =
  'w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

function parsePlaceholderCount(body: string): number {
  const nums = (body.match(/\{\{\d+\}\}/g) ?? []).map(m => parseInt(m.replace(/\D/g, ''), 10));
  return nums.length > 0 ? Math.max(...nums) : 0;
}

function BroadcastRow({ b }: { b: Broadcast }) {
  const total = b.recipient_count;
  const date = new Date(b.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  return (
    <div className="py-4 border-b border-zinc-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-zinc-800 line-clamp-2">{b.message_body}</p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-400">
            <span>{date}</span>
            {b.filter_language && (
              <span className="capitalize bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">{b.filter_language}</span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> {b.sent_count}
            </span>
            {b.failed_count > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="h-3.5 w-3.5" /> {b.failed_count}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">{total} recipient{total !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
}

export default function BroadcastsPage() {
  // Filters + history
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterTagId, setFilterTagId] = useState('');
  const [tags, setTags] = useState<PatientTag[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [sending, setSending] = useState(false);
  const [pollingId, setPollingId] = useState<string | null>(null);

  // Free text
  const [message, setMessage] = useState('');

  // Template mode
  const [mode, setMode] = useState<'freetext' | 'template'>('freetext');
  const [templates, setTemplates] = useState<GupshupTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState(false);
  const [templatesFetched, setTemplatesFetched] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [paramMapping, setParamMapping] = useState<string[]>([]);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    api.tags.list().then(({ tags }) => setTags(tags)).catch(() => {});
    api.broadcasts.list().then(({ broadcasts }) => setBroadcasts(broadcasts)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!pollingId) return;
    const interval = setInterval(async () => {
      try {
        const { broadcast } = await api.broadcasts.status(pollingId);
        const done = broadcast.sent_count + broadcast.failed_count >= broadcast.recipient_count;
        setBroadcasts(prev =>
          prev.map(b =>
            b.id === pollingId
              ? { ...b, sent_count: broadcast.sent_count, failed_count: broadcast.failed_count }
              : b
          )
        );
        if (done) {
          clearInterval(interval);
          setPollingId(null);
          toast.success(`Broadcast complete — ${broadcast.sent_count} sent, ${broadcast.failed_count} failed`);
        }
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(interval);
  }, [pollingId]);

  const loadTemplates = async () => {
    if (templatesFetched) return;
    setTemplatesLoading(true);
    setTemplatesError(false);
    try {
      const { templates } = await api.pharmacy.waTemplates();
      setTemplates(templates);
      setTemplatesFetched(true);
    } catch {
      setTemplatesError(true);
      toast.error('Failed to load templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const retryLoadTemplates = () => {
    setTemplatesFetched(false);
    setTemplatesError(false);
    loadTemplates();
  };

  const handleModeSwitch = (newMode: 'freetext' | 'template') => {
    setMode(newMode);
    if (newMode === 'template') loadTemplates();
  };

  const selectedTemplate = templates.find(t => t.elementName === selectedTemplateId) ?? null;
  const paramCount = selectedTemplate ? parsePlaceholderCount(selectedTemplate.body) : 0;

  const handleTemplateSelect = (elementName: string) => {
    setSelectedTemplateId(elementName);
    setParamMapping([]);
    setShowFullPreview(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const result = mode === 'template' && selectedTemplate
        ? await api.broadcasts.send({
            message: selectedTemplate.body,
            template_id: selectedTemplate.elementName,
            template_params: paramMapping.slice(0, paramCount),
            filter_tag_id: filterTagId || undefined,
            filter_language: filterLanguage || undefined,
          })
        : await api.broadcasts.send({
            message: message.trim(),
            filter_tag_id: filterTagId || undefined,
            filter_language: filterLanguage || undefined,
          });

      toast.success(result.message);
      const optimistic: Broadcast = {
        id: result.broadcastId,
        pharmacy_id: '',
        message_body: mode === 'template' ? selectedTemplate!.body : message.trim(),
        filter_tag_id: filterTagId || null,
        filter_language: filterLanguage || null,
        recipient_count: result.recipientCount,
        sent_count: 0,
        failed_count: 0,
        created_at: new Date().toISOString(),
      };
      setBroadcasts(prev => [optimistic, ...prev]);
      if (mode === 'freetext') setMessage('');
      setPollingId(result.broadcastId);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  const charCount = message.length;
  const recipientLabel = filterLanguage || filterTagId
    ? `filtered patients${filterLanguage ? ` (${filterLanguage})` : ''}${filterTagId ? ' (tag)' : ''}`
    : 'all opted-in patients';

  const canSend = !sending && (
    mode === 'freetext'
      ? message.trim().length >= 5 && charCount <= 1000
      : !!selectedTemplate && (paramCount === 0 || paramMapping.slice(0, paramCount).every(v => v))
  );

  return (
    <div className="p-6 md:p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Broadcasts</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Send a WhatsApp message to all or filtered patients at once</p>
      </div>

      <form onSubmit={handleSend} className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <Radio className="h-4 w-4 text-emerald-500" />
          New Broadcast
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Language filter</label>
            <select value={filterLanguage} onChange={e => setFilterLanguage(e.target.value)} className={inputClass}>
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l ? l.charAt(0).toUpperCase() + l.slice(1) : 'All languages'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">Tag filter</label>
            <select value={filterTagId} onChange={e => setFilterTagId(e.target.value)} className={inputClass}>
              <option value="">All tags</option>
              {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {(['freetext', 'template'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeSwitch(m)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              )}
            >
              {m === 'freetext' ? 'Free text' : 'Use template'}
            </button>
          ))}
        </div>

        {/* Free text mode */}
        {mode === 'freetext' && (
          <>
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>
                Free-text broadcasts only reach patients who messaged your pharmacy in the last 24 hours.
                Switch to <strong>Use template</strong> to reach all opted-in patients at any time.
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">
                Message <span className="text-zinc-400">(use {'{{name}}'} for patient&apos;s first name)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Hi {{name}}, this is a reminder from our pharmacy about your medication."
                className={cn(inputClass, 'resize-none')}
                required
                minLength={5}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-zinc-400">Sending to {recipientLabel}</p>
                <p className={cn('text-xs', charCount > 1000 ? 'text-red-500' : 'text-zinc-400')}>{charCount}/1000</p>
              </div>
            </div>
          </>
        )}

        {/* Template mode */}
        {mode === 'template' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Template</label>
              {templatesLoading ? (
                <div className="h-9 rounded-lg bg-zinc-100 animate-pulse" />
              ) : templatesError ? (
                <div className="space-y-1.5">
                  <select disabled className={cn(inputClass, 'opacity-50 cursor-not-allowed')}>
                    <option>Failed to load — try refreshing</option>
                  </select>
                  <button
                    type="button"
                    onClick={retryLoadTemplates}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : templates.length === 0 && templatesFetched ? (
                <div className="space-y-1">
                  <select disabled className={cn(inputClass, 'opacity-50 cursor-not-allowed')}>
                    <option>No approved templates</option>
                  </select>
                  <p className="text-xs text-zinc-400">Contact support@easibill.in to add one</p>
                </div>
              ) : (
                <select
                  value={selectedTemplateId}
                  onChange={e => handleTemplateSelect(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a template…</option>
                  {templates.map(t => (
                    <option key={t.elementName} value={t.elementName}>{t.elementName}</option>
                  ))}
                </select>
              )}
            </div>

            {selectedTemplate && (
              <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 space-y-1.5">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Template content · fixed by WhatsApp</p>
                <p className={cn('text-sm text-zinc-700', !showFullPreview && 'line-clamp-2')}>
                  {selectedTemplate.body}
                </p>
                {selectedTemplate.body.length > 100 && (
                  <button
                    type="button"
                    onClick={() => setShowFullPreview(v => !v)}
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5"
                  >
                    {showFullPreview
                      ? <><ChevronUp className="h-3 w-3" /> Show less</>
                      : <><ChevronDown className="h-3 w-3" /> Show full</>}
                  </button>
                )}
              </div>
            )}

            {selectedTemplate && paramCount > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-600">Map template variables</p>
                <div className={cn('space-y-2', paramCount > 4 && 'max-h-48 overflow-y-auto pr-1')}>
                  {Array.from({ length: paramCount }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-20 shrink-0">Variable {i + 1}</span>
                      <select
                        value={paramMapping[i] || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setParamMapping(prev => {
                            const updated = [...prev];
                            updated[i] = val;
                            return updated;
                          });
                        }}
                        className={inputClass}
                        required
                      >
                        {MAPPING_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTemplate && (
              <p className="text-xs text-zinc-400">Sending to {recipientLabel}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSend}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {sending
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
            : <><Send className="h-4 w-4" /> Send Broadcast</>}
        </button>
      </form>

      {/* History */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Broadcast History</h2>
        </div>
        {broadcasts.length === 0 ? (
          <p className="px-5 py-8 text-sm text-zinc-400 text-center">No broadcasts yet</p>
        ) : (
          <div className="px-5">
            {broadcasts.map(b => <BroadcastRow key={b.id} b={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd frontend && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Verify in browser — free text mode**

With `npm run dev` running, open `http://localhost:3000/broadcasts`.

Confirm:
- Form shows filters, mode toggle pills (Free text active in emerald, Use template inactive in zinc)
- Amber 24h warning banner shows
- Textarea is present, char counter works
- Send button disabled until ≥5 chars typed

- [ ] **Step 4: Verify in browser — template mode**

Click "Use template" toggle. Confirm:
- Amber banner disappears
- A loading skeleton (grey animate-pulse bar) briefly appears while `waTemplates()` loads
- If no templates configured: disabled select shows "No approved templates" + support email
- If templates loaded: select shows template names; selecting one shows the preview block
- Preview shows template body text with "Template content · fixed by WhatsApp" label
- If template has `{{1}}` etc: Variable 1, Variable 2 dropdowns appear with MAPPING_OPTIONS
- Send button disabled until all Variable dropdowns have a selection
- Clicking "Free text" switches back; amber banner reappears

- [ ] **Step 5: Commit**

```bash
git add frontend/app/\(dashboard\)/broadcasts/page.tsx
git commit -m "feat: broadcast template mode — template picker, preview, variable mapping"
```
