# Local Business Generalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite Easibill's marketing-site copy so it speaks to any local business (pharmacies,
clinics, spas today; clothing/ration/grocery/supermarket/electronics stores planned next)
instead of pharmacy-only, per
`docs/superpowers/specs/2026-07-11-healthcare-generalization-design.md`.

**Architecture:** Pure content edit across the existing Next.js marketing site. No new
components, no logic changes, no changes to the real product/dashboard app. One route rename
(`/features/refill-reminders` → `/features/follow-up-reminders`) with a redirect, one file
rename (`PharmacyMarquee.jsx` → `TrustMarquee.jsx`). A final SEO review pass checks the edited
metadata/headings, not just the wording swap.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript/JSX.

## Global Constraints — Terminology Table

Apply this exact table everywhere a match is found. This is the single source of truth for
every task below; do not improvise variants. "Local business" is the umbrella noun precisely
because more verticals (retail, grocery, electronics) are coming — do not narrow it to
"healthcare business" or name a vertical as the primary noun anywhere.

| Context | Old | New |
|---|---|---|
| Headlines / meta titles / hero badge | "pharmacy" / "independent pharmacies" | "local business" / "local businesses" |
| Body copy, in-sentence | "pharmacy" / "your pharmacy" | "your business" |
| End-user noun | "patients" | "customers" |
| Vertical examples (use sparingly — at most one supporting line per page, never the primary noun) | pharmacy-only examples | rotate a representative set, e.g. "pharmacies, clinics, spas, grocery stores, and electronics shops" |
| Feature name + route | "Refill Reminders" @ `/features/refill-reminders` | "Follow-up Reminders" @ `/features/follow-up-reminders` (old path redirects) |
| Mockup data table | "Medicine" column, all-drug rows (Metformin, Amlodipine, Pantoprazole) | "Item/Service" column: keep one medicine row, add one spa-treatment row (e.g. "Deep Tissue Massage — 60 min"), add one retail/service row (e.g. "Wireless Earbuds") |
| Mockup sample business name | "Verma Medical" reused everywhere | Vary per mockup instance: at least one clinic-style name (e.g. "Verma Medical"), one spa-or-retail-style name (e.g. "Serenity Wellness Spa") |
| Help-article prose | "your pharmacy's tone", "pharmacies that use broadcasts...", "your pharmacy's patient base" | "your business's tone", "businesses that use broadcasts...", "your business's customer base" |
| Help-article template placeholders | `{PharmacyName}`, `{Medicine}`, etc. | **Do not rename these tokens.** Only reword the prose around them. |
| Component file | `src/components/easibill/PharmacyMarquee.jsx` | Rename to `TrustMarquee.jsx`, update all imports; internal business-name list content stays, only surrounding label text is genericized |

Verification rule used in every task: after editing, run
`grep -rin "pharmac" <files>` — the only acceptable remaining hits are the literal template
placeholder tokens (`{PharmacyName}`) inside `src/data/helpArticles.ts`. Everything else must be
zero.

---

### Task 1: Landing sections & Easibill marketing components

**Files:**
- Modify: `src/components/landing/Hero.jsx`
- Modify: `src/components/landing/TrustBar.jsx`
- Modify: `src/components/landing/Problem.jsx`
- Modify: `src/components/landing/Testimonials.jsx`
- Modify: `src/components/landing/FinalCTA.jsx`
- Modify: `src/components/landing/HowItWorks.jsx`
- Modify: `src/components/landing/FAQ.jsx`
- Modify: `src/components/landing/PricingSection.jsx`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/easibill/EasibillHero.jsx`
- Modify: `src/components/easibill/EasibillCTA.jsx`
- Modify: `src/components/easibill/EasibillPricing.jsx`
- Modify: `src/components/easibill/EasibillSolution.jsx`
- Modify: `src/components/easibill/EasibillTestimonials.jsx`
- Modify: `src/components/easibill/EasibillProblem.jsx`
- Modify: `src/components/easibill/EasibillFeatures.jsx`
- Rename: `src/components/easibill/PharmacyMarquee.jsx` → `src/components/easibill/TrustMarquee.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/LeadNudge.jsx`
- Modify: `src/components/LeadGeneration.jsx`
- Modify: `src/components/LeadChatbot.jsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the `TrustMarquee` component name that any importer must reference (grep for
  `PharmacyMarquee` importers in this same task and update them — they live in this same file
  set, e.g. wherever `EasibillSolution.jsx` or a landing page composes it).

- [ ] **Step 1: Grep this task's files for "pharmac" (case-insensitive) to see every hit**

Run: `grep -rin "pharmac" src/components/landing/ src/components/easibill/ src/components/Hero.jsx src/components/Footer.jsx src/components/LeadNudge.jsx src/components/LeadGeneration.jsx src/components/LeadChatbot.jsx`

Expected: a list of matching lines (this is the checklist to work through).

- [ ] **Step 2: Apply the Global Constraints terminology table to every hit**

Concrete anchor example from `src/components/landing/Hero.jsx` (apply the same pattern to
every other file's hits):

```jsx
// Before
const H1_WORDS_1 = ['Your', 'pharmacy', 'loses', '20–40%', 'of', 'patients', 'every', 'year.']
// ...
'#1 billing app for independent pharmacies'
// ...
EasiBill is a WhatsApp-first CRM for independent pharmacies. Log a purchase and EasiBill
automatically sends a refill reminder on the right day — from your own WhatsApp number,
without you touching anything.
// ...
geo ? `${geo.flag} Serving pharmacies in ${geo.countryName}` : '2,400+ pharmacies worldwide',
```

```jsx
// After
const H1_WORDS_1 = ['Your', 'local', 'business', 'loses', '20–40%', 'of', 'customers', 'every', 'year.']
// ...
'#1 billing app for local businesses'
// ...
EasiBill is a WhatsApp-first CRM for local businesses. Log a purchase and EasiBill
automatically sends a follow-up reminder on the right day — from your own WhatsApp number,
without you touching anything.
// ...
geo ? `${geo.flag} Serving local businesses in ${geo.countryName}` : '2,400+ local businesses worldwide',
```

Also in `Hero.jsx`'s `AppMockup`: change the `MEDICINES` array/table to a generic item list per
the terminology table (keep one medicine row, add a spa-treatment row and a consult row), and
change the `"Next: Refill reminder"` sidebar label to `"Next: Follow-up reminder"`.

Repeat this same before/after pattern across every remaining file in this task's file list,
using the Global Constraints table for every "pharmacy"/"patients"/"refill" occurrence found in
Step 1.

- [ ] **Step 3: Rename PharmacyMarquee.jsx and fix imports**

```bash
git mv src/components/easibill/PharmacyMarquee.jsx src/components/easibill/TrustMarquee.jsx
```

Update the component's internal function/export name from `PharmacyMarquee` to `TrustMarquee`,
then grep for importers and update them:

Run: `grep -rln "PharmacyMarquee" src/`

Update every result to import `TrustMarquee` from the new path/name instead.

- [ ] **Step 4: Verify no residual matches**

Run: `grep -rin "pharmac" src/components/landing/ src/components/easibill/ src/components/Hero.jsx src/components/Footer.jsx src/components/LeadNudge.jsx src/components/LeadGeneration.jsx src/components/LeadChatbot.jsx`

Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "content: generalize landing/marketing components to local businesses"
```

---

### Task 2: Feature pages + refill-reminders → follow-up-reminders route rename

**Files:**
- Modify: `src/app/features/page.tsx`
- Move: `src/app/features/refill-reminders/page.tsx` → `src/app/features/follow-up-reminders/page.tsx`
- Modify: `src/app/features/broadcast-campaigns/page.tsx`
- Modify: `src/app/features/retention-analytics/page.tsx`
- Modify: `src/app/features/daily-queue/page.tsx`
- Modify: `src/app/features/patient-records/page.tsx`
- Modify: `src/Pages/FeaturesPage.jsx`
- Modify: `next.config.ts` (add redirect)

**Interfaces:**
- Consumes: nothing from other tasks (independent of Task 1's component edits, though the pages
  render some of those components — no shared state, just imports that still resolve).
- Produces: the new route path `/features/follow-up-reminders`, which Task 4's internal nav
  links (Footer, feature index links) must point to if they reference the old path.

- [ ] **Step 1: Grep this task's files for "pharmac" and "refill" (case-insensitive)**

Run: `grep -rin "pharmac\|refill" src/app/features/ src/Pages/FeaturesPage.jsx`

- [ ] **Step 2: Move the refill-reminders route**

```bash
git mv src/app/features/refill-reminders src/app/features/follow-up-reminders
```

- [ ] **Step 3: Rewrite the moved page's copy**

In `src/app/features/follow-up-reminders/page.tsx`, apply the terminology table: page title/H1
"Refill Reminders" → "Follow-up Reminders"; any body copy about medication refills becomes
general follow-up/recall language, e.g.:

```tsx
// Before (metadata example pattern, mirror actual content found in Step 1)
title: "Refill Reminders — EasiBill",
description: "Automatically remind pharmacy patients when it's time for a refill.",

// After
title: "Follow-up Reminders — EasiBill",
description: "Automatically remind customers when it's time for their next refill, appointment, treatment, or repeat purchase.",
```

Where body copy lists refill-specific examples, broaden to include appointment/treatment/repeat-
purchase recall examples (e.g. "medication refills, follow-up appointments, repeat treatments,
or restocking a regular order") while keeping the underlying mechanic description (scheduled
WhatsApp message on the right day) unchanged.

- [ ] **Step 4: Apply the terminology table to the remaining feature pages**

For each of `broadcast-campaigns/page.tsx`, `retention-analytics/page.tsx`,
`daily-queue/page.tsx`, `patient-records/page.tsx`, `features/page.tsx`, and
`FeaturesPage.jsx`: replace every "pharmacy"/"pharmacies" hit from Step 1 per the Global
Constraints table, and update any feature-index card/link text or href that names
"Refill Reminders" / `/features/refill-reminders` to "Follow-up Reminders" /
`/features/follow-up-reminders`.

- [ ] **Step 5: Add a redirect for the old URL**

Read `next.config.ts` first to see its current shape, then add a `redirects()` entry following
whatever config style it already uses (`async redirects()` returning an array), mapping:

```
source: '/features/refill-reminders'
destination: '/features/follow-up-reminders'
permanent: true
```

- [ ] **Step 6: Verify**

Run: `grep -rin "pharmac" src/app/features/ src/Pages/FeaturesPage.jsx`
Expected: no output.

Run: `npm run build`
Expected: build succeeds, `/features/follow-up-reminders` is a generated route.

- [ ] **Step 7: Commit**

```bash
git add src/app/features/ src/Pages/FeaturesPage.jsx next.config.ts
git commit -m "content: generalize feature pages, rename refill-reminders to follow-up-reminders"
```

---

### Task 3: Data files (blog posts, help articles)

**Files:**
- Modify: `src/data/blogPosts.ts`
- Modify: `src/data/helpArticles.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: nothing consumed by other tasks (rendering components already exist and are
  untouched).

- [ ] **Step 1: Grep for "pharmac" (case-insensitive)**

Run: `grep -nin "pharmac" src/data/blogPosts.ts src/data/helpArticles.ts`

- [ ] **Step 2: Apply the terminology table to prose, preserving template placeholder tokens**

Concrete anchor example from `src/data/helpArticles.ts` (apply the same pattern to every other
hit found in Step 1):

```ts
// Before
{ title: "Enter your pharmacy details", body: "Fill in your pharmacy name, your name, email address, and phone number. These details appear on reminder messages sent to patients." },
// ...
intro: "EasiBill includes default reminder templates in Hindi and English (Pro plan adds Marathi, Telugu, and Kannada). You can customise the text to match your pharmacy's tone.",
// ...
{ title: "Understand the variable placeholders", body: "Templates use placeholders that are replaced with real patient data before sending: {Name} = patient's name, {Medicine} = medicine name, {PharmacyName} = your pharmacy name, {NextDate} = formatted refill date." },
// ...
tip: "Keep reminders under 3 sentences. Longer messages get lower open and reply rates. The default templates are tested across hundreds of pharmacies — edit only if you have a specific reason.",
// ...
intro: "A health camp broadcast reaches all relevant patients in your database at once. Pharmacies that use broadcasts for health camps average 4× more attendance than those using printed notices.",
// ...
intro: "The retention dashboard shows you the health of your pharmacy's patient base at a glance. It answers the question: are you keeping your patients, or slowly losing them?",
```

```ts
// After
{ title: "Enter your business details", body: "Fill in your business name, your name, email address, and phone number. These details appear on reminder messages sent to customers." },
// ...
intro: "EasiBill includes default reminder templates in Hindi and English (Pro plan adds Marathi, Telugu, and Kannada). You can customise the text to match your business's tone.",
// ...
{ title: "Understand the variable placeholders", body: "Templates use placeholders that are replaced with real customer data before sending: {Name} = customer's name, {Medicine} = medicine name, {PharmacyName} = your business name, {NextDate} = formatted follow-up date." },
// ...
tip: "Keep reminders under 3 sentences. Longer messages get lower open and reply rates. The default templates are tested across hundreds of local businesses — edit only if you have a specific reason.",
// ...
intro: "A health camp broadcast reaches all relevant customers in your database at once. Businesses that use broadcasts for health camps average 4× more attendance than those using printed notices.",
// ...
intro: "The retention dashboard shows you the health of your business's customer base at a glance. It answers the question: are you keeping your customers, or slowly losing them?",
```

Note: `{Name}`, `{Medicine}`, `{PharmacyName}`, `{NextDate}` tokens are kept verbatim — only the
words describing them ("pharmacy name" → "business name") change.

Repeat the same before/after pattern for every remaining "pharmac"/"patient" hit in both files
found in Step 1, including entries in `blogPosts.ts` (titles, excerpts, body markdown).

- [ ] **Step 3: Verify**

Run: `grep -nin "pharmac" src/data/blogPosts.ts src/data/helpArticles.ts`
Expected: only lines containing the literal `{PharmacyName}` token remain.

- [ ] **Step 4: Commit**

```bash
git add src/data/blogPosts.ts src/data/helpArticles.ts
git commit -m "content: generalize blog posts and help articles to local businesses"
```

---

### Task 4: Remaining top-level pages, Pages/*.jsx counterparts, and global metadata

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/testimonials/page.tsx`
- Modify: `src/app/webinars/page.tsx`
- Modify: `src/app/tutorials/page.tsx`
- Modify: `src/app/terms/page.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/onboarding/page.tsx`
- Modify: `src/app/help/page.tsx`
- Modify: `src/app/sitemap-page/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/easibill-customisable-bulk-billing-solution/page.tsx`
- Modify: `src/Pages/TestimonialsPage.jsx`
- Modify: `src/Pages/Contact.jsx`
- Modify: `src/Pages/BulkBillingSolutionPage.jsx`

**Interfaces:**
- Consumes: the new `/features/follow-up-reminders` route from Task 2 — if any of these pages
  (e.g. Footer-adjacent nav, sitemap-page) link to `/features/refill-reminders`, update the href
  to the new path.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Grep this task's files for "pharmac" (case-insensitive)**

Run: `grep -rin "pharmac" src/app/layout.tsx src/app/about/ src/app/contact/ src/app/testimonials/ src/app/webinars/ src/app/tutorials/ src/app/terms/ src/app/privacy/ src/app/onboarding/ src/app/help/ src/app/sitemap-page/ src/app/blog/ "src/app/easibill-customisable-bulk-billing-solution/" src/Pages/TestimonialsPage.jsx src/Pages/Contact.jsx src/Pages/BulkBillingSolutionPage.jsx`

- [ ] **Step 2: Apply the terminology table to every hit**

Concrete anchor example from
`src/app/easibill-customisable-bulk-billing-solution/page.tsx` (apply the same pattern to every
other file's hits):

```tsx
// Before
title: "EasiBill Customisable Bulk Billing Solution for Pharmacies",
description:
  "EasiBill's customisable bulk billing solution helps independent pharmacies create compliant invoices, manage bulk orders, and send bills on WhatsApp — all in under 5 minutes of setup.",
```

```tsx
// After
title: "EasiBill Customisable Bulk Billing Solution for Local Businesses",
description:
  "EasiBill's customisable bulk billing solution helps local businesses — pharmacies, clinics, spas, and stores alike — create compliant invoices, manage bulk orders, and send bills on WhatsApp — all in under 5 minutes of setup.",
```

Apply this same title/description/body pattern across every `metadata` block and body-copy hit
found in Step 1 for the remaining files (about, contact, testimonials, webinars, tutorials,
terms, privacy, onboarding, help, sitemap-page, blog index, blog `[slug]`, and the three
`Pages/*.jsx` counterparts), always producing "local business(es)" in titles/headlines and
"your business" / "customers" in body copy per the Global Constraints table. Use the vertical-
examples row of the table (pharmacies, clinics, spas, grocery stores, electronics shops) sparingly
— at most once per page — for flavor, never as the primary noun.

- [ ] **Step 3: Fix any stale links to the renamed feature route**

Run: `grep -rln "refill-reminders" src/app/ src/Pages/ src/components/`
For every result, update the href/link string from `/features/refill-reminders` to
`/features/follow-up-reminders`.

- [ ] **Step 4: Verify**

Run: `grep -rin "pharmac" src/app/layout.tsx src/app/about/ src/app/contact/ src/app/testimonials/ src/app/webinars/ src/app/tutorials/ src/app/terms/ src/app/privacy/ src/app/onboarding/ src/app/help/ src/app/sitemap-page/ src/app/blog/ "src/app/easibill-customisable-bulk-billing-solution/" src/Pages/TestimonialsPage.jsx src/Pages/Contact.jsx src/Pages/BulkBillingSolutionPage.jsx`
Expected: no output.

Run: `grep -rn "refill-reminders" src/`
Expected: no output (all links updated, old route only exists as a redirect target in `next.config.ts`).

- [ ] **Step 5: Commit**

```bash
git add src/app/ src/Pages/
git commit -m "content: generalize remaining pages and global metadata to local businesses"
```

---

### Task 5: SEO review pass

**Files:** any file from Tasks 1–4 that a finding points to (fixed inline, no new files).

**Interfaces:**
- Consumes: the completed state of Tasks 1–4 (all copy already generalized to "local business").
- Produces: a fixed, SEO-sound set of `metadata` blocks and headings; feeds Task 6's final sweep.

This task is a review-and-fix pass, not a rewrite. Dispatch it as a subagent briefed as an SEO
reviewer, or perform it directly — either way, check every file touched in Tasks 1–4 against
this checklist and fix issues inline:

- [ ] **Step 1: List every changed `metadata` export and check title tags**

Run: `grep -rln "export const metadata" src/app/`

For each file, open it and confirm:
- `title` is unique across pages (no two pages share an identical title after the wording swap)
- `title` is under ~60 characters and contains a primary keyword ("local business", "billing",
  "WhatsApp", or the page's specific feature name) — not just the brand name alone
- `title` no longer contains "Pharmacy"/"Pharmacies" (the Task 1–4 sweep should have already
  caught this; re-check here as a safety net)

Fix any violation directly in the file.

- [ ] **Step 2: Check meta descriptions**

For each `metadata` block found in Step 1, confirm `description`:
- Is between ~120–160 characters (Google truncates longer descriptions)
- Reads as a compelling, specific sentence — not a generic restatement of the title
- Matches the page's actual content after the local-business rewrite

Fix any that are missing, too long, too short, or stale.

- [ ] **Step 3: Check heading hierarchy on pages with body content changes**

For each page modified in Tasks 1 and 4 that renders visible headings (landing sections,
feature pages, about, blog `[slug]`), confirm:
- Exactly one `<h1>` per page
- `<h2>`/`<h3>` nesting is still logical (the copy swap must not have merged or dropped a
  heading level)

Fix any page where a heading was accidentally changed from `<h2>` to `<p>` or similar during the
copy edit.

- [ ] **Step 4: Check internal links and canonical/OG URLs around the route rename**

Run: `grep -rn "refill-reminders" src/`
Expected: no output outside `next.config.ts`'s redirect entry — this confirms Task 4's Step 3
caught every internal link.

For `src/app/features/follow-up-reminders/page.tsx` specifically, confirm the `alternates.canonical`,
`openGraph.url`, and any `openGraph.title`/`twitter.title` fields were updated to the new
`/features/follow-up-reminders` URL and the new "Follow-up Reminders" title (not left pointing at
the old slug/name).

- [ ] **Step 5: Commit any SEO fixes**

```bash
git add -A
git commit -m "seo: fix titles, descriptions, and heading hierarchy after local-business rewrite"
```

If Steps 1–4 found nothing to fix, skip this commit.

---

### Task 6: Full-repo verification sweep

**Files:** none (verification only)

**Interfaces:**
- Consumes: the completed state of Tasks 1–5.
- Produces: final confirmation the site builds and no unintended "pharmac" copy remains.

- [ ] **Step 1: Full-repo grep sweep**

Run: `grep -rin "pharmac" src/`
Expected: only lines containing the literal `{PharmacyName}` template token in
`src/data/helpArticles.ts` remain. If anything else appears, fix it before continuing.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds; route list includes `/features/follow-up-reminders` and does not
include `/features/refill-reminders`.

- [ ] **Step 4: Confirm the redirect**

Run: `npm run preview` (starts `next start`), then in another shell:
`curl -I http://localhost:3000/features/refill-reminders`
Expected: `HTTP/1.1 308` (or `307`) with a `location` header pointing to
`/features/follow-up-reminders`. Stop the preview server after checking.

- [ ] **Step 5: Commit if any fixes were needed**

If Step 1–4 required any fixes, stage and commit them:

```bash
git add -A
git commit -m "content: final cleanup pass for local business generalization"
```

If no fixes were needed, skip this step — Tasks 1–5's commits already cover everything.
