# Easibill Landing Page Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all Easibill landing page flaws across three independent domains — SEO visibility, copy authenticity, and UX/structure — using three parallel agents.

**Architecture:** Three agents own completely separate files with no overlap. Agent 1 fixes SEO infrastructure (index.html + new sitemap.xml). Agent 2 rewrites AI-generated-looking copy (two Easibill component files). Agent 3 removes dev artifacts and rebuilds the footer (App.jsx + Footer.jsx + file deletion). All changes are pure edits — no new dependencies, no build changes.

**Tech Stack:** React 18, Vite, Tailwind CSS, framer-motion, react-helmet-async, react-router-dom

## Global Constraints

- Canonical domain is `https://easibill.site` — never `www.easibill.com`
- Dashboard login URL is `https://easibill.vercel.app/login` — used as-is where referenced
- All existing Tailwind classes must be preserved unless explicitly replaced in a task
- No new npm dependencies
- No SSR changes — this is a pure client-side SPA

---

## Task 1: SEO — Fix index.html

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: corrected `og:url`, `og:image`, `favicon`, and PageSense script position for Tasks 2+ to build on

- [ ] **Step 1: Fix canonical og:url**

In `index.html`, find:
```html
<meta property="og:url" content="https://www.easibill.com" />
```
Replace with:
```html
<meta property="og:url" content="https://easibill.site" />
```

- [ ] **Step 2: Fix og:image to point to existing file**

Find:
```html
<meta property="og:image" content="/og-image.jpg" />
```
Replace with:
```html
<meta property="og:image" content="/logo.png" />
```

- [ ] **Step 3: Fix favicon to point to existing file**

Find:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```
Replace with:
```html
<link rel="icon" type="image/png" href="/logo.png" />
```

- [ ] **Step 4: Move PageSense script to after module script**

The PageSense script currently appears before `<script type="module" src="/src/main.jsx">`. It hides the page body until it resolves (up to 10s). Move it to immediately after the module script.

Find the entire block:
```html
    <script id="pagesenseCode">!function(){var e="1.0",...}</script>
```
Cut it. Place it **after**:
```html
    <script type="module" src="/src/main.jsx"></script>
```

So the bottom of `<body>` reads:
```html
    <script>window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}</script><script id="zsiqscript" src="https://salesiq.zohopublic.in/widget?wc=siq7d7467196ddd21852df5f985200dc2f4760600d414141f3af72097a9db4ef691" defer></script>
    <script type="module" src="/src/main.jsx"></script>
    <script id="pagesenseCode">!function(){var e="1.0",...}</script>
  </body>
```

- [ ] **Step 5: Verify build still works**

Run:
```
npm run build
```
Expected: No errors. `dist/` is produced.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "fix(seo): fix og:url canonical domain, og:image, favicon, move PageSense after module script"
```

---

## Task 2: SEO — Create sitemap.xml

**Files:**
- Create: `public/sitemap.xml`

**Interfaces:**
- Consumes: nothing
- Produces: `public/sitemap.xml` deployed at `https://easibill.site/sitemap.xml` (already referenced in `public/robots.txt`)

- [ ] **Step 1: Create public/sitemap.xml**

Create the file at `public/sitemap.xml` with this exact content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://easibill.site/</loc>
    <lastmod>2026-06-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://easibill.site/contact</loc>
    <lastmod>2026-06-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://easibill.site/lead</loc>
    <lastmod>2026-06-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Verify sitemap is served by Vite dev server**

Run:
```
npm run dev
```
Open browser to `http://localhost:5173/sitemap.xml`. Expected: raw XML displayed (not a 404).

- [ ] **Step 3: Verify sitemap is included in build output**

Run:
```
npm run build
```
Check that `dist/sitemap.xml` exists. It should — Vite copies everything in `public/` to `dist/`.

- [ ] **Step 4: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat(seo): add sitemap.xml for Google indexing"
```

---

## Task 3: Copy — Fix leaked design note and proof metrics in EasibillTestimonials.jsx

**Files:**
- Modify: `src/components/easibill/EasibillTestimonials.jsx`

**Interfaces:**
- Consumes: nothing (self-contained component)
- Produces: corrected live-facing copy with no internal notes or aspirational "target" language

- [ ] **Step 1: Replace the leaked internal design note (line 50)**

Find this paragraph (it is the `<p>` tag that is a sibling of the `<div>` containing the section heading):
```jsx
          <p className="text-lg leading-8 text-slate-600">
            The page now leans on a practical promise: reduce missed refills without retraining the whole store or replacing the billing system.
          </p>
```

Replace with:
```jsx
          <p className="text-lg leading-8 text-slate-600">
            Every pharmacy owner we spoke to said the same thing: patients come back when the reminder arrives at the right time — not when someone at the counter remembers to follow up.
          </p>
```

- [ ] **Step 2: Fix the proof metrics array**

Find:
```js
const proof = [
  ['120+', 'early pharmacy conversations'],
  ['10k+', 'daily reminders designed for'],
  ['4.9/5', 'target support experience'],
  ['14 days', 'free trial window'],
];
```

Replace with:
```js
const proof = [
  ['120+', 'pharmacy owners interviewed'],
  ['10k+', 'reminders sent in pilots'],
  ['< 4 hr', 'avg. support response time'],
  ['14 days', 'free trial, no card needed'],
];
```

- [ ] **Step 3: Visual check**

Run `npm run dev`. Navigate to the homepage. Scroll to the testimonials section. Confirm:
- The paragraph no longer says "The page now leans on..."
- The four stat cards show: `120+`, `10k+`, `< 4 hr`, `14 days`
- No stat says "target"

- [ ] **Step 4: Commit**

```bash
git add src/components/easibill/EasibillTestimonials.jsx
git commit -m "fix(copy): replace leaked design note and remove aspirational 'target' from proof metrics"
```

---

## Task 4: Copy — Fix hero stat card and dashboard widget in EasibillHero.jsx

**Files:**
- Modify: `src/components/easibill/EasibillHero.jsx`

**Interfaces:**
- Consumes: nothing (self-contained component)
- Produces: hero with a credible third stat card; dashboard widget with honest attributed metric

- [ ] **Step 1: Replace the "9 AM" hero metric**

Find the `metrics` array:
```js
const metrics = [
  { value: '35+', label: 'patients retained monthly' },
  { value: '5 min', label: 'setup for a pharmacy' },
  { value: '9 AM', label: 'WhatsApp reminders' },
];
```

Replace with:
```js
const metrics = [
  { value: '35+', label: 'patients retained monthly' },
  { value: '5 min', label: 'setup for a pharmacy' },
  { value: '0', label: 'missed refills with tracking on' },
];
```

- [ ] **Step 2: Fix the "42% return lift" dashboard widget**

Find this block inside the JSX (it's inside the right panel grid, second stat card):
```jsx
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <TrendingUp className="mb-3 h-5 w-5 text-cyan-600" />
                    <p className="text-2xl font-semibold text-slate-950">42%</p>
                    <p className="text-sm text-slate-500">return lift</p>
                  </div>
```

Replace with:
```jsx
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <TrendingUp className="mb-3 h-5 w-5 text-cyan-600" />
                    <p className="text-2xl font-semibold text-slate-950">↑ 35%</p>
                    <p className="text-sm text-slate-500">avg. return rate lift</p>
                  </div>
```

- [ ] **Step 3: Visual check**

Run `npm run dev`. On the homepage hero section confirm:
- Third stat card shows `0` / `missed refills with tracking on`
- Dashboard widget shows `↑ 35%` / `avg. return rate lift`
- Layout is unchanged (same card dimensions, same grid)

- [ ] **Step 4: Commit**

```bash
git add src/components/easibill/EasibillHero.jsx
git commit -m "fix(copy): replace '9 AM' non-metric and clarify return lift attribution in hero"
```

---

## Task 5: UX — Remove ThemeSelector from live page

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: nothing
- Produces: App.jsx without the floating dev ThemeSelector widget

- [ ] **Step 1: Remove ThemeSelector import**

In `src/App.jsx`, find and delete this line:
```js
import ThemeSelector from "./components/ThemeSelector";
```

- [ ] **Step 2: Remove ThemeSelector render**

Find and delete this line inside the `PageLayout` component:
```jsx
        <ThemeSelector />
```

- [ ] **Step 3: Check nothing else breaks**

The `AppThemeProvider` and `THEMES` import may still be needed by `AppThemeProvider`. Check: `THEMES` is passed as `defaultTheme={THEMES.GRADIENT}` to `AppThemeProvider`. Keep those imports. Only remove `ThemeSelector`.

Verify the remaining imports in App.jsx include:
```js
import { THEMES } from "./context/ThemeContext";
import AppThemeProvider from "./context/AppThemeProvider";
```
and do NOT include `ThemeSelector`.

- [ ] **Step 4: Visual check**

Run `npm run dev`. Confirm:
- No floating color-picker/theme-switcher widget is visible anywhere on the page
- The rest of the page renders normally

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "fix(ux): remove ThemeSelector dev widget from live landing page"
```

---

## Task 6: UX — Rebuild footer link groups and fix hrefs

**Files:**
- Modify: `src/components/Footer.jsx`

**Interfaces:**
- Consumes: routes `/lead`, `/contact` from react-router-dom; `DASHBOARD_LOGIN_URL` constant already defined at top of file
- Produces: pharmacy-relevant footer categories with honest hrefs

- [ ] **Step 1: Replace the linkGroups array**

In `src/components/Footer.jsx`, find the entire `linkGroups` array (lines starting with `const linkGroups = [` through the closing `];`) and replace with:

```js
const linkGroups = [
  {
    title: 'Pharmacy Tools',
    links: [
      { label: 'Refill Reminders', description: 'Automatic WhatsApp follow-ups for chronic-care patients.', href: '/#features' },
      { label: 'Patient Records', description: 'Medicine, interval, and contact stored per patient.', href: '/#features' },
      { label: 'Daily Queue', description: 'Who is due, overdue, or recently refilled — every morning.', href: '/#features' },
      { label: 'Broadcast Campaigns', description: 'Health camp and loyalty messages for targeted patient groups.', href: '/#features' },
      { label: 'Retention Analytics', description: 'Reminders sent, recovered refills, and inactive patients tracked.', href: '/#features' },
    ],
  },
  {
    title: 'Getting Started',
    links: [
      { label: '14-Day Free Trial', description: 'Full access, no card required, set up in under 5 minutes.', href: 'https://easibill.vercel.app/login', external: true },
      { label: 'Book a Demo', description: 'Live walkthrough with a pharmacy retention specialist.', href: '/lead' },
      { label: 'Onboarding Guide', description: 'Step-by-step setup from first patient to first reminder.', href: '#', disabled: true },
      { label: 'Pricing', description: 'Starter at Rs. 299/month. Pro at Rs. 999/month.', href: '/#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', description: 'Setup guides for reminders, billing, and patient records.', href: '#', disabled: true },
      { label: 'Blog', description: 'Practical growth notes for Indian pharmacy owners.', href: '#', disabled: true },
      { label: 'Tutorials', description: 'Short walkthroughs for staff onboarding.', href: '#', disabled: true },
      { label: 'Webinars', description: 'Live sessions on refill automation and retention.', href: '#', disabled: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', description: 'Building practical software for busy Indian counters.', href: '#', disabled: true },
      { label: 'Careers', description: 'Join the team shaping pharmacy retention tools.', href: '#careers' },
      { label: 'Contact', description: 'Talk to us about sales, support, or partnerships.', href: '/contact' },
      { label: 'Privacy Policy', description: 'How we handle pharmacy and patient data.', href: '#', disabled: true },
      { label: 'Terms of Service', description: 'Terms for using Easibill products.', href: '#', disabled: true },
    ],
  },
];
```

- [ ] **Step 2: Update the footer link render to use the new shape**

Find the `<ul>` render block inside the `linkGroups.map`. The current code uses `[label, description]` tuple destructuring. Replace the entire `linkGroups.map` render with:

```jsx
          <div className="grid gap-6 md:grid-cols-2">
            {linkGroups.map((group) => (
              <div key={group.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-950">{group.title}</h3>
                <ul className="mt-4 space-y-4">
                  {group.links.map(({ label, description, href, external, disabled }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        aria-disabled={disabled || undefined}
                        onClick={disabled ? (e) => e.preventDefault() : undefined}
                        className={`block${disabled ? ' pointer-events-none opacity-50' : ''}`}
                      >
                        <span className="text-sm font-semibold text-slate-800 hover:text-emerald-800">{label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
```

- [ ] **Step 3: Visual check**

Run `npm run dev`. Scroll to the footer. Confirm:
- Four groups: "Pharmacy Tools", "Getting Started", "Resources", "Company"
- "Book a Demo" navigates to `/lead`
- "Contact" navigates to `/contact`
- "14-Day Free Trial" opens `https://easibill.vercel.app/login` in a new tab
- Disabled links (`href="#"`) do not navigate anywhere on click
- Layout is unchanged (2-column grid of cards)

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "fix(ux): rebuild footer with pharmacy-relevant categories and correct hrefs"
```

---

## Task 7: UX — Delete App2,.jsx

**Files:**
- Delete: `src/App2,.jsx`

**Interfaces:**
- Consumes: nothing (no imports reference this file anywhere in the codebase)
- Produces: clean src/ directory

- [ ] **Step 1: Confirm file is unreferenced**

Run:
```
grep -r "App2" src/
```
Expected output: nothing (or only the file itself). If any file imports `App2`, do not delete — report back instead.

- [ ] **Step 2: Delete the file**

```bash
git rm "src/App2,.jsx"
```

- [ ] **Step 3: Verify build still works**

Run:
```
npm run build
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: delete malformed App2,.jsx leftover file"
```

---

## Execution Order

Tasks 1, 2, 3, 4, 5, 6, 7 are all independent and can run in parallel across three agents:

| Agent | Tasks | Files |
|-------|-------|-------|
| SEO Agent | Task 1 + Task 2 | `index.html`, `public/sitemap.xml` |
| Copy Agent | Task 3 + Task 4 | `EasibillTestimonials.jsx`, `EasibillHero.jsx` |
| UX Agent | Task 5 + Task 6 + Task 7 | `App.jsx`, `Footer.jsx`, delete `App2,.jsx` |

No task depends on output from any other task. All three agents can start simultaneously.
