# Empty Routes Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three full standalone pages (`/features`, `/testimonials`, `/easibill-customisable-bulk-billing-solution`) plus 10 redirect aliases so no public Easibill URL returns a blank page.

**Architecture:** Three new page files under `src/Pages/` each using the existing `PageLayout` wrapper from `App.jsx`. Pages reuse existing easibill section components where possible and add page-specific hero + CTA sections inline. All routes (pages + redirects) are registered in `App.jsx`.

**Tech Stack:** React 18, React Router v6, Framer Motion, Tailwind CSS, Lucide React icons

## Global Constraints

- Background: `bg-gradient-to-b from-[#eafaf3] via-[#f4fdf8] to-[#eef9f4]` (applied by `PageLayout` in `App.jsx` — do not re-apply in page files)
- Accent colours: `emerald-600` / `cyan-700` / `slate-950`
- Card style: `rounded-[1.75rem] border border-slate-200 bg-white shadow-sm`
- Section wrapper: `<section className="px-4 sm:px-6 lg:px-8">` with `<div className="mx-auto max-w-7xl">`
- Animations: `framer-motion` `whileInView` + `initial={{ opacity: 0, y: 24 }}` + `viewport={{ once: true, amount: 0.35 }}` + `transition={{ duration: 0.7 }}`
- Dashboard login URL constant: `const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login'`
- All `<a>` tags for external navigation; `<Link>` / `useNavigate` for internal
- Redirect routes use `<Navigate to="..." replace />`  (React Router v6)
- No TypeScript — plain `.jsx`
- No new npm packages

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Create | `src/Pages/FeaturesPage.jsx` | `/features` standalone page |
| Create | `src/Pages/TestimonialsPage.jsx` | `/testimonials` standalone page |
| Create | `src/Pages/BulkBillingSolutionPage.jsx` | `/easibill-customisable-bulk-billing-solution` SEO page |
| Modify | `src/App.jsx` | Register 3 page routes + 10 redirect routes, lazy-import new pages |

---

## Task 1: FeaturesPage

**Files:**
- Create: `src/Pages/FeaturesPage.jsx`

**Interfaces:**
- Consumes: `EasibillFeatures` (default export from `src/components/easibill/EasibillFeatures.jsx`), `EasibillCTA` (default export from `src/components/easibill/EasibillCTA.jsx`)
- Produces: `default export FeaturesPage` — React component, no props

- [ ] **Step 1: Create `src/Pages/FeaturesPage.jsx`**

```jsx
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EasibillFeatures = lazy(() => import('../components/easibill/EasibillFeatures'));
const EasibillCTA = lazy(() => import('../components/easibill/EasibillCTA'));

const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login';

const comparison = [
  { label: 'Setup time',           manual: 'None',           crm: '2–4 weeks',     easibill: '< 5 minutes' },
  { label: 'Monthly staff effort', manual: 'Hours of chats', crm: 'Training needed', easibill: 'Daily 2-min review' },
  { label: 'Patient tracking',     manual: 'Memory / notebook', crm: 'Spreadsheet import', easibill: 'Built-in, automatic' },
  { label: 'Reminder automation',  manual: 'None',           crm: 'Complex setup',  easibill: 'On by default' },
  { label: 'Monthly cost',         manual: '₹0',             crm: '₹800–2,500/user', easibill: 'From ₹299' },
];

const FeaturesPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Product features</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Every tool your pharmacy counter needs. Nothing it doesn't.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Easibill is not a CRM. It is a focused retention tool that fits the way a pharmacy counter already works — no migration, no training programme, no bloat.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <motion.a
                href={DASHBOARD_LOGIN_URL}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Start 14-day trial
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </motion.a>
              <motion.a
                href="/lead"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
              >
                Book pharmacy demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature grid (reuse existing section) */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillFeatures />
      </Suspense>

      {/* Comparison table */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">How it compares</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Designed for pharmacies, not generic businesses.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
          >
            {/* Table header */}
            <div className="grid grid-cols-4 gap-px bg-slate-200">
              <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500" />
              <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">Manual WhatsApp</div>
              <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">Generic CRM</div>
              <div className="bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">Easibill</div>
            </div>
            {/* Rows */}
            {comparison.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-4 gap-px bg-slate-200 ${index === comparison.length - 1 ? '' : ''}`}
              >
                <div className="bg-white px-5 py-4 text-sm font-medium text-slate-700">{row.label}</div>
                <div className="bg-white px-5 py-4 text-sm text-slate-500">{row.manual}</div>
                <div className="bg-white px-5 py-4 text-sm text-slate-500">{row.crm}</div>
                <div className="flex items-center gap-2 bg-emerald-50/50 px-5 py-4 text-sm font-medium text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                  {row.easibill}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA strip */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillCTA />
      </Suspense>
    </div>
  );
};

export default FeaturesPage;
```

- [ ] **Step 2: Verify the file renders without import errors**

Open `src/App.jsx` temporarily and add a quick test import (do NOT commit this — just verify in your editor that the path resolves):
```js
import FeaturesPage from './Pages/FeaturesPage'; // check no red underlines
```
Remove the test import before committing.

- [ ] **Step 3: Commit**

```bash
git add src/Pages/FeaturesPage.jsx
git commit -m "feat(pages): add /features standalone page"
```

---

## Task 2: TestimonialsPage

**Files:**
- Create: `src/Pages/TestimonialsPage.jsx`

**Interfaces:**
- Consumes: `EasibillCTA` (default export from `src/components/easibill/EasibillCTA.jsx`)
- Produces: `default export TestimonialsPage` — React component, no props

- [ ] **Step 1: Create `src/Pages/TestimonialsPage.jsx`**

```jsx
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, Star } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EasibillCTA = lazy(() => import('../components/easibill/EasibillCTA'));

const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Owner, Kumar Medicos',
    location: 'Bengaluru',
    text: 'We used to remember only the regular diabetes patients. Easibill now shows the full due list every morning, and my staff sends follow-ups without me checking WhatsApp chats.',
  },
  {
    name: 'Priya Sharma',
    role: 'Owner, Shree Pharmacy',
    location: 'Pune',
    text: 'The best part is that it does not feel like a CRM. We record the medicine, and the reminder is handled. Patients like the message because it comes at the right time.',
  },
  {
    name: 'Amit Patel',
    role: 'Pharmacy Manager',
    location: 'Indore',
    text: 'We tried manual reminder lists before. They stopped working whenever the counter got busy. Easibill gives us a simple system the team can actually follow.',
  },
  {
    name: 'Sunita Joshi',
    role: 'Owner, Joshi Medical Store',
    location: 'Bhopal',
    text: 'Before Easibill, I had a notebook of dates I kept forgetting. Now the list is ready every morning and I do not need to think about it at all.',
  },
  {
    name: 'Ravi Mehta',
    role: 'Owner, Mehta Pharmacy',
    location: 'Ahmedabad',
    text: 'WhatsApp reminders from our own number feel personal. Patients respond much better than a generic blast from an unknown sender.',
  },
  {
    name: 'Deepa Nair',
    role: 'Owner, Nair Medicals',
    location: 'Kochi',
    text: 'We recovered three patients in the first week who had not visited in two months. That alone paid for the whole year.',
  },
];

const proof = [
  ['120+', 'pharmacy owners interviewed'],
  ['10k+', 'reminders sent in pilots'],
  ['< 4 hr', 'avg. support response time'],
  ['14 days', 'free trial, no card needed'],
];

const featured = testimonials[5]; // Deepa Nair pull-quote

const TestimonialsPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">Real pharmacies</p>
              <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Built around how Indian pharmacy counters really work.
              </h1>
            </div>
            <div className="space-y-5">
              <p className="text-lg leading-8 text-slate-600">
                We interviewed over 120 pharmacy owners before writing a line of code. Every feature in Easibill came from a real counter workflow — not a whiteboard assumption.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href={DASHBOARD_LOGIN_URL}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Start 14-day trial
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </motion.a>
                <motion.a
                  href="/lead"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
                >
                  Book pharmacy demo
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proof bar */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4"
          >
            {proof.map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="text-3xl font-semibold text-slate-950">{value}</p>
                <p className="mt-2 text-sm leading-5 text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial grid — 6 cards */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 text-slate-300" />
                </div>
                <p className="min-h-28 leading-8 text-slate-700">&quot;{testimonial.text}&quot;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 text-sm font-semibold text-emerald-900">
                    {testimonial.name.split(' ').map((part) => part[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.location}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured pull-quote — dark background */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-12"
          >
            <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.3),transparent_40%),radial-gradient(circle_at_85%_100%,rgba(56,189,248,0.2),transparent_40%)]" />
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <Quote className="mx-auto mb-6 h-10 w-10 text-emerald-300" />
              <p className="text-2xl font-semibold leading-9 sm:text-3xl sm:leading-10">
                &quot;{featured.text}&quot;
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-cyan-300 text-sm font-semibold text-emerald-950">
                  {featured.name.split(' ').map((part) => part[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="font-semibold">{featured.name}</p>
                  <p className="text-sm text-slate-400">{featured.role}, {featured.location}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA strip */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillCTA />
      </Suspense>
    </div>
  );
};

export default TestimonialsPage;
```

- [ ] **Step 2: Commit**

```bash
git add src/Pages/TestimonialsPage.jsx
git commit -m "feat(pages): add /testimonials standalone page"
```

---

## Task 3: BulkBillingSolutionPage

**Files:**
- Create: `src/Pages/BulkBillingSolutionPage.jsx`

**Interfaces:**
- Consumes: `EasibillCTA` (default export from `src/components/easibill/EasibillCTA.jsx`)
- Produces: `default export BulkBillingSolutionPage` — React component, no props

- [ ] **Step 1: Create `src/Pages/BulkBillingSolutionPage.jsx`**

```jsx
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  LayoutTemplate,
  Megaphone,
  Send,
  Tags,
  TrendingUp,
  X,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EasibillCTA = lazy(() => import('../components/easibill/EasibillCTA'));

const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login';

const capabilities = [
  {
    icon: LayoutTemplate,
    title: 'Custom WhatsApp templates',
    copy: 'Personalise every message with medicine name, refill date, and pharmacy name tokens. Patients get a message that feels written for them.',
  },
  {
    icon: Tags,
    title: 'Segment-based broadcasts',
    copy: 'Target the right patients — diabetes group, BP patients, senior citizens, or high-value repeat buyers — without blasting everyone.',
  },
  {
    icon: BellRing,
    title: 'Scheduled sends',
    copy: 'Plan health camp announcements, seasonal offers, or loyalty messages in advance. Campaigns go out at the right time automatically.',
  },
  {
    icon: TrendingUp,
    title: 'Delivery tracking per campaign',
    copy: 'See sent, failed, and read receipts for every broadcast. Know exactly which patient received which message.',
  },
];

const segments = ['Diabetes patients', 'BP medication', 'Thyroid care', 'Senior citizens', 'High-value buyers', 'Inactive 30+ days'];

const BulkBillingSolutionPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.15),transparent_30%)]" />
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur">
              <Megaphone className="h-4 w-4" />
              Broadcast + Segmentation — Pro plan
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Customisable bulk billing built for Indian pharmacies.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Send the right message to the right patients at the right time. Easibill's bulk messaging is built around pharmacy segments — not generic contact lists.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <motion.a
                href={DASHBOARD_LOGIN_URL}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Start 14-day trial
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </motion.a>
              <motion.a
                href="/lead"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
              >
                Book pharmacy demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is bulk billing — 2-col explainer */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">What it is</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                One message. The right patients. Zero manual work.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Bulk billing lets you compose a single WhatsApp message and deliver it to a filtered group of patients — by medicine, condition, activity, or custom tag. Unlike a generic blast, every message includes the patient's name and relevant medicine details.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  'No tech skills required — compose in the dashboard',
                  'Segments update automatically as patients are added',
                  'Schedule future campaigns without being online',
                  'Tracks delivery so you know who actually received it',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual mock — broadcast composer */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-950/20"
            >
              <div className="border-b border-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Broadcast composer</p>
                <h3 className="mt-1 text-lg font-semibold">New campaign</h3>
              </div>
              <div className="space-y-4 p-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Segment</p>
                  <div className="flex flex-wrap gap-2">
                    {segments.map((seg, i) => (
                      <span
                        key={seg}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          i === 0
                            ? 'bg-emerald-400 text-emerald-950'
                            : 'border border-white/10 bg-white/10 text-slate-300'
                        }`}
                      >
                        {seg}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Message preview</p>
                  <div className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                    Namaste {'{'}{'{'} Name {'}'}{'}'},<br />
                    Kumar Medicos is running a free diabetes check-up camp this Sunday. Please visit us before 12 PM.
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div>
                    <p className="text-sm font-semibold">Recipients</p>
                    <p className="text-xs text-slate-400">142 diabetes patients</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-300">
                    <Send className="h-3.5 w-3.5" />
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Capabilities</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Built for campaigns that actually get responses.
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <motion.article
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.07 }}
                  className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700 transition group-hover:bg-slate-950 group-hover:text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{cap.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{cap.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2.25rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-xl shadow-emerald-950/5 sm:p-8 lg:p-10"
          >
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">The difference</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-rose-100 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700">
                  <X className="h-4 w-4" />
                  Before Easibill
                </div>
                <ul className="space-y-3 text-slate-600">
                  {[
                    'Blast every contact with the same generic message',
                    'High opt-out rate from irrelevant messages',
                    'No way to know who received or responded',
                    'Staff manually copies numbers into WhatsApp groups',
                    'No record of what was sent or when',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.75rem] border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  After Easibill
                </div>
                <ul className="space-y-3 text-slate-600">
                  {[
                    'Targeted messages to the right segment only',
                    'Patients respond because the message is relevant',
                    'Full delivery report — sent, failed, read',
                    'One click to schedule from the dashboard',
                    'Campaign history saved automatically',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing callout */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Pro plan</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Bulk broadcasts from ₹999/month</h3>
              <p className="mt-2 text-slate-600">Broadcast messaging, segmentation, templates, and advanced analytics — all included in Pro.</p>
            </div>
            <a
              href="/#pricing"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-950"
            >
              See all pricing
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA strip */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillCTA />
      </Suspense>
    </div>
  );
};

export default BulkBillingSolutionPage;
```

- [ ] **Step 2: Commit**

```bash
git add src/Pages/BulkBillingSolutionPage.jsx
git commit -m "feat(pages): add /easibill-customisable-bulk-billing-solution SEO page"
```

---

## Task 4: Wire routes in App.jsx

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `FeaturesPage` (default export `src/Pages/FeaturesPage.jsx`), `TestimonialsPage` (default export `src/Pages/TestimonialsPage.jsx`), `BulkBillingSolutionPage` (default export `src/Pages/BulkBillingSolutionPage.jsx`)
- Consumes: `Navigate` from `react-router-dom`

- [ ] **Step 1: Add `Navigate` to the react-router-dom import and add lazy imports**

In `src/App.jsx`, find the existing imports block and apply these changes:

Change the react-router-dom import from:
```js
import { Routes, Route } from "react-router-dom";
```
To:
```js
import { Routes, Route, Navigate } from "react-router-dom";
```

After the existing `LeadGeneration` lazy import line, add:
```js
const FeaturesPage = lazy(() => import("./Pages/FeaturesPage"));
const TestimonialsPage = lazy(() => import("./Pages/TestimonialsPage"));
const BulkBillingSolutionPage = lazy(() => import("./Pages/BulkBillingSolutionPage"));
```

- [ ] **Step 2: Add the 3 page routes + 10 redirect routes inside `<Routes>`**

In `src/App.jsx`, find the `<Routes>` block. It currently ends with:
```jsx
          <Route path="/lead" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
              <PageLayout><LeadGeneration /></PageLayout>
            </Suspense>
          } />
        </Routes>
```

Replace that closing `</Routes>` with:
```jsx
          <Route path="/lead" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
              <PageLayout><LeadGeneration /></PageLayout>
            </Suspense>
          } />

          {/* Standalone pages */}
          <Route path="/features" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
              <PageLayout><FeaturesPage /></PageLayout>
            </Suspense>
          } />
          <Route path="/testimonials" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
              <PageLayout><TestimonialsPage /></PageLayout>
            </Suspense>
          } />
          <Route path="/easibill-customisable-bulk-billing-solution" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
              <PageLayout><BulkBillingSolutionPage /></PageLayout>
            </Suspense>
          } />

          {/* Redirect aliases */}
          <Route path="/feature" element={<Navigate to="/features" replace />} />
          <Route path="/our-features" element={<Navigate to="/features" replace />} />
          <Route path="/product-features" element={<Navigate to="/features" replace />} />
          <Route path="/testimonial" element={<Navigate to="/testimonials" replace />} />
          <Route path="/reviews" element={<Navigate to="/testimonials" replace />} />
          <Route path="/customers" element={<Navigate to="/testimonials" replace />} />
          <Route path="/bulk-billing" element={<Navigate to="/easibill-customisable-bulk-billing-solution" replace />} />
          <Route path="/bulk-billing-solution" element={<Navigate to="/easibill-customisable-bulk-billing-solution" replace />} />
          <Route path="/customisable-billing" element={<Navigate to="/easibill-customisable-bulk-billing-solution" replace />} />
          <Route path="/easibill-bulk-billing" element={<Navigate to="/easibill-customisable-bulk-billing-solution" replace />} />
        </Routes>
```

- [ ] **Step 3: Verify the dev server starts without errors**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:5173` with no console errors.

Manually visit in a browser:
- `http://localhost:5173/features` — features page with hero, grid, comparison table, CTA
- `http://localhost:5173/testimonials` — testimonials page with hero, proof bar, 6 cards, pull-quote, CTA
- `http://localhost:5173/easibill-customisable-bulk-billing-solution` — bulk billing SEO page with all sections
- `http://localhost:5173/feature` — redirects to `/features`
- `http://localhost:5173/reviews` — redirects to `/testimonials`
- `http://localhost:5173/bulk-billing` — redirects to `/easibill-customisable-bulk-billing-solution`

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(routing): wire /features, /testimonials, /easibill-customisable-bulk-billing-solution routes and 10 redirect aliases"
```
