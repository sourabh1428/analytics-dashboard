# EasiBill Landing Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the AI-generated placeholder landing page with a production-quality, human-crafted SaaS landing page for EasiBill — a WhatsApp-based pharmacy billing SaaS targeting independent medical stores in India.

**Architecture:** Eleven new focused components under `src/components/landing/` replace the old `src/components/sections/` files. `src/Pages/Pages.jsx` is updated to compose them. No new libraries — the project already has React, Tailwind CSS, and Framer Motion.

**Tech Stack:** React 18, Tailwind CSS (with `tailwind.config.js` extended for brand tokens), Framer Motion, Lucide React, existing `src/components/ui/button.jsx` and `src/components/ui/card.jsx`.

---

## Agent Personas & Constraints

These nine personas define the quality bar. Every engineer task must satisfy **all** of the following before it is considered done:

### Manager: Jordan Mills (12yr VP Product, ex-Intercom, Paddle)
**Rejects if:**
- Any section contains lorem ipsum, "This is a feature", "Basic Plan", or placeholder text
- CTA says "Learn More", "Start Now", or "Sign Up" without a benefit
- Typography is inconsistent (headings must use `font-display`, body uses `font-sans`)
- Mobile layout is broken or cramped
- Page takes more than 3s to load on 4G

### Designer: Aria Chen — Visual/UI (ex-Figma, Stripe, 11yr)
**Standards:**
- Color system: `#FFFFFF` base, `#10B981` emerald accent, `#0F172A` near-black text, `#F8FFF8` off-white surface, `#6B7280` muted text
- Typography scale: hero 56px/64px bold, section heads 36px bold, card heads 20px semibold, body 16px/24px regular
- Spacing: 8px base grid. Section padding = `py-24 px-6`. Max width = `max-w-7xl mx-auto`
- Every card: `rounded-2xl border border-gray-100 shadow-sm`
- Hover states: `transition-all duration-200`

### Designer: Marcus Webb — UX/Interaction (ex-Linear, Vercel, 13yr)
**Standards:**
- Page scroll narrative: Pain → Solution → Proof → Price → Action
- Primary CTA appears in: Hero (above fold), after Features, after Pricing, in Final CTA
- No orphan sections — every section transitions into the next with visual continuity
- Mobile: hamburger nav, single-column sections, 44px min touch targets

### Designer: Priya Nair — Brand/Copy (ex-Notion, Superhuman, 10yr)
**Copy rules (verbatim copy below — do not alter):**
- Hero H1: `"Your pharmacy runs on hard work. Let billing run itself."`
- Hero sub: `"EasiBill sends GST bills on WhatsApp, reminds customers when to refill, and keeps your inventory clean — so you can focus on your patients."`
- CTA primary: `"Start free — no card needed"`
- CTA secondary: `"See how it works →"`
- Trust bar label: `"Trusted by independent pharmacies across India"`
- Problem heading: `"Manual billing is costing you more than you think"`
- Features heading: `"Everything your pharmacy needs. Nothing it doesn't."`
- How it works heading: `"Up and running in under 10 minutes"`
- Testimonials heading: `"Pharmacists who switched never went back"`
- Pricing heading: `"Simple pricing. No hidden fees."`
- FAQ heading: `"Questions pharmacists ask before switching"`
- Final CTA heading: `"Join 2,400+ pharmacies already on EasiBill"`
- Final CTA sub: `"Free to start. No credit card. Cancel any time."`

### Designer: Luca Romano — Motion (ex-Framer, Apple, 12yr)
**Animation rules:**
- All scroll animations: `initial={{ opacity: 0, y: 24 }}` → `animate={{ opacity: 1, y: 0 }}` with `transition={{ duration: 0.5, ease: 'easeOut' }}`
- Stagger children: `transition={{ delay: index * 0.1 }}`
- `viewport={{ once: true, margin: '-80px' }}` on all `whileInView`
- Hover on cards: `whileHover={{ y: -4 }}` only — no scale, no glow, nothing gratuitous
- Stats counter animation: count up from 0 on first viewport entry using `useMotionValue` + `useTransform`
- No animation on elements above the fold (hero text renders instantly)

### Engineer: Kai Zhang — Frontend Lead (ex-Vercel, 11yr)
**Standards:**
- Each component is a single default export with named props interface at top
- No inline styles — Tailwind only
- Shared constants (copy, data) live at the top of each file, not in JSX
- Import order: React → third-party → internal `@/` → relative

### Engineer: Sasha Obi — Animation (ex-Framer, 10yr)
**Standards:**
- Use `motion.div`, `motion.h1`, etc. — never wrap HTML in a `<motion.div>` wrapper unnecessarily
- `AnimatePresence` only when elements unmount
- Use `useInView` from `framer-motion` for scroll triggers, not Intersection Observer directly
- Stats use `useMotionValue`, `animate()` from framer-motion, `useEffect` on inView

### Engineer: Dev Patel — Performance (ex-Google, 13yr)
**Standards:**
- All images: `loading="lazy"` except hero logo
- No third-party fonts loaded synchronously — use `font-display: swap`
- Bundle: no new npm installs. Use only what's already in package.json
- Framer Motion: import only used exports, not `import * as motion`

### Engineer: Ines Moreau — Accessibility (ex-Microsoft, 10yr)
**Standards:**
- Every section has a landmark role (`<section aria-labelledby="...">`)
- All icons that convey meaning have `aria-label`; decorative icons have `aria-hidden="true"`
- Color contrast: text on white must be ≥4.5:1, text on emerald must be white
- Focus rings: `focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`
- FAQ accordion: proper `aria-expanded`, `aria-controls`, keyboard navigable

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/landing/Navbar.jsx` | Create | Sticky nav with logo, links, mobile menu, CTA |
| `src/components/landing/Hero.jsx` | Create | Bold headline + product visual + dual CTA |
| `src/components/landing/TrustBar.jsx` | Create | Animated stat counters |
| `src/components/landing/Problem.jsx` | Create | Pain point cards |
| `src/components/landing/FeaturesBento.jsx` | Create | Bento grid of 6 features |
| `src/components/landing/HowItWorks.jsx` | Create | 3-step process |
| `src/components/landing/Testimonials.jsx` | Create | 3 pharmacy owner quotes |
| `src/components/landing/PricingSection.jsx` | Create | 3 tiers with real features |
| `src/components/landing/FAQ.jsx` | Create | Accordion FAQ |
| `src/components/landing/FinalCTA.jsx` | Create | Conversion CTA section |
| `src/components/landing/Footer.jsx` | Create | Links, legal, social |
| `src/Pages/Pages.jsx` | Modify | Compose all new components |
| `tailwind.config.js` | Modify | Add brand color tokens |

---

## Global Constraints

- No lorem ipsum anywhere — ever
- No placeholder text, "This is a feature", or "Basic Plan"
- All Tailwind — no inline `style={}` props
- No new npm packages — use React, Tailwind, Framer Motion, Lucide React only
- Mobile-first responsive: `sm:` / `md:` / `lg:` breakpoints
- Every `<section>` has `id` and `aria-labelledby`
- Color tokens from Aria's system only: white, `emerald-500` (#10B981), `slate-900` (#0F172A), `gray-50` (#F9FAFB), `gray-500` (#6B7280)
- All animation parameters from Luca's rules above

---

## Task 1: Tailwind Config — Brand Tokens

**Files:**
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: `font-display` class, `emerald` color scale (already in Tailwind — verify present), `colors.brand.*` tokens

- [ ] **Step 1: Read current tailwind config**

```bash
cat tailwind.config.js
```

- [ ] **Step 2: Add brand tokens**

Open `tailwind.config.js` and extend the theme with:

```js
// Inside theme.extend:
fontFamily: {
  display: ['Inter', 'system-ui', 'sans-serif'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
},
colors: {
  brand: {
    green: '#10B981',
    dark: '#0F172A',
    surface: '#F8FFF8',
  },
},
```

- [ ] **Step 3: Verify Inter font is loaded in index.html**

Check `index.html` `<head>`. If Inter is not present, add to the existing `<link rel="preconnect" href="https://fonts.googleapis.com">` block:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js index.html
git commit -m "feat(design): add EasiBill brand tokens and Inter font"
```

---

## Task 2: Navbar Component

**Files:**
- Create: `src/components/landing/Navbar.jsx`

**Interfaces:**
- Produces: `<Navbar />` — no props required, self-contained

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/Navbar.jsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-md">
          <img src="/logo.png" alt="EasiBill" className="h-8 w-auto" loading="eager" />
          <span className="font-bold text-slate-900 text-lg tracking-tight">EasiBill</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-slate-900 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/lead"
            className="text-sm text-gray-600 hover:text-slate-900 transition-colors duration-150 font-medium focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-sm"
          >
            Sign in
          </a>
          <a
            href="/lead"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Start free
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-slate-900 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <nav aria-label="Mobile navigation" className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-gray-600 hover:text-slate-900 transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/lead"
                className="mt-2 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors min-h-[44px]"
              >
                Start free — no card needed
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Navbar.jsx
git commit -m "feat(landing): add Navbar with mobile menu, scroll shadow, brand CTA"
```

---

## Task 3: Hero Section

**Files:**
- Create: `src/components/landing/Hero.jsx`

**Interfaces:**
- Produces: `<Hero />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/Hero.jsx
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const PROOF_POINTS = [
  '2,400+ pharmacies across India',
  '18M+ bills sent via WhatsApp',
  'Free to start — no card needed',
]

// Mock UI card representing the product — real mockup if /product-preview.png exists
function ProductMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-emerald-400/20 rounded-3xl blur-3xl scale-110" aria-hidden="true" />
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="ml-2 text-xs text-gray-400 font-mono">easibill.site</span>
        </div>
        {/* Bill preview */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Invoice #2406-0814</p>
              <p className="font-bold text-slate-900 mt-0.5">Ramesh Kumar</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              Sent on WhatsApp ✓
            </span>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Metformin 500mg × 30', amount: '₹148' },
              { name: 'Amlodipine 5mg × 15', amount: '₹63' },
              { name: 'Pantoprazole 40mg × 10', amount: '₹89' },
            ].map((item) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium text-slate-900">{item.amount}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-semibold text-slate-900">Total (incl. GST)</span>
            <span className="font-bold text-emerald-600 text-lg">₹300</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3">
            <span className="text-emerald-600 text-lg" aria-hidden="true">💬</span>
            <p className="text-xs text-emerald-700 font-medium">
              Bill delivered to +91 98765 43210 in 2.3 seconds
            </p>
          </div>
        </div>
      </div>
      {/* Floating refill reminder card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-52"
        aria-hidden="true"
      >
        <p className="text-xs font-semibold text-slate-900">Refill Reminder Sent</p>
        <p className="text-xs text-gray-500 mt-0.5">Ramesh's Metformin runs out in 3 days</p>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <p className="text-[10px] text-emerald-600 font-medium">Auto-sent via WhatsApp</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="pt-28 pb-20 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              #1 Billing App for Independent Pharmacies
            </span>
          </div>

          <h1
            id="hero-heading"
            className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight"
          >
            Your pharmacy runs on hard work.{' '}
            <span className="text-emerald-500">Let billing run itself.</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
            EasiBill sends GST bills on WhatsApp, reminds customers when to refill, and keeps your inventory clean — so you can focus on your patients.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/lead"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-base min-h-[48px]"
            >
              Start free — no card needed
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 text-slate-900 font-semibold hover:bg-gray-50 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-base min-h-[48px]"
            >
              See how it works →
            </a>
          </div>

          {/* Proof points */}
          <ul className="flex flex-col gap-2" role="list">
            {PROOF_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: product visual */}
        <div className="flex justify-center lg:justify-end">
          <ProductMockup />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Hero.jsx
git commit -m "feat(landing): add Hero with real EasiBill copy, product mockup, WhatsApp bill preview"
```

---

## Task 4: Trust Bar (Animated Stats)

**Files:**
- Create: `src/components/landing/TrustBar.jsx`

**Interfaces:**
- Produces: `<TrustBar />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/TrustBar.jsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 2400, suffix: '+', label: 'Pharmacies using EasiBill' },
  { value: 18, suffix: 'M+', label: 'Bills sent via WhatsApp' },
  { value: 34, suffix: '%', label: 'Average increase in repeat customers' },
  { value: 0, prefix: '₹', suffix: '', label: 'Setup cost' },
]

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

export default function TrustBar() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-slate-900 py-16 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <p
          id="trust-heading"
          className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
        >
          Trusted by independent pharmacies across India
        </p>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <p className="text-4xl font-bold text-white mb-1">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/TrustBar.jsx
git commit -m "feat(landing): add TrustBar with animated stat counters"
```

---

## Task 5: Problem Section

**Files:**
- Create: `src/components/landing/Problem.jsx`

**Interfaces:**
- Produces: `<Problem />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/Problem.jsx
'use client'

import { motion } from 'framer-motion'
import { Clock, UserX, FileWarning, TrendingDown } from 'lucide-react'

const PAIN_POINTS = [
  {
    icon: Clock,
    stat: '8 min',
    title: 'Average time for a manual bill',
    description: 'Hand-written or desktop software bills slow your queue. Customers leave before they get to the counter.',
  },
  {
    icon: UserX,
    stat: '6 in 10',
    title: 'Customers who don\'t return',
    description: 'Without reminders, patients forget to refill. They buy from the pharmacy closest to them next time — not yours.',
  },
  {
    icon: FileWarning,
    stat: '₹12,000',
    title: 'Average annual expired stock loss',
    description: 'Medicines expire silently. By the time you notice, the loss is already done.',
  },
  {
    icon: TrendingDown,
    stat: '2 days',
    title: 'Lost per year to GST filing',
    description: 'Manually compiling HSN codes, tax rates, and invoice numbers for your CA is a full weekend every month.',
  },
]

export default function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="py-24 px-6 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="problem-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Manual billing is costing you more than you think
          </h2>
          <p className="text-gray-500 text-lg">
            Every pharmacy dealing with paper bills and outdated software is bleeding time, customers, and money.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PAIN_POINTS.map((point, i) => (
            <motion.article
              key={point.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-200"
            >
              <point.icon className="h-8 w-8 text-red-400 mb-4" aria-hidden="true" />
              <p className="text-3xl font-bold text-slate-900 mb-1">{point.stat}</p>
              <h3 className="font-semibold text-slate-900 mb-2">{point.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{point.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Problem.jsx
git commit -m "feat(landing): add Problem section with pharmacy-specific pain points"
```

---

## Task 6: Features Bento Grid

**Files:**
- Create: `src/components/landing/FeaturesBento.jsx`

**Interfaces:**
- Produces: `<FeaturesBento />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/FeaturesBento.jsx
'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Bell, FileText, AlertTriangle, BarChart3, Store } from 'lucide-react'

const FEATURES = [
  {
    icon: MessageCircle,
    tag: 'WhatsApp Billing',
    title: 'Bills land in WhatsApp in under 3 seconds',
    description: 'No printer. No paper. No hunting for the customer\'s email. Tap once — the bill is in their chat.',
    size: 'large', // spans 2 cols on desktop
    accent: 'emerald',
    visual: (
      <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm space-y-2">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">R</div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-gray-100 max-w-xs">
            <p className="font-medium text-slate-900 text-xs">EasiBill — Verma Medical</p>
            <p className="text-gray-500 text-xs mt-0.5">Invoice #0814 · ₹300 · GST included</p>
            <p className="text-emerald-600 text-xs mt-1">📄 View & download bill</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 ml-11">Delivered 2.3s ago</p>
      </div>
    ),
  },
  {
    icon: Bell,
    tag: 'Refill Reminders',
    title: 'Customers come back before they run out',
    description: 'EasiBill tracks what each customer buys and nudges them back automatically — before they buy from someone else.',
    size: 'small',
    accent: 'blue',
    visual: null,
  },
  {
    icon: FileText,
    tag: 'GST-Ready Invoices',
    title: 'Every bill is GST-compliant. No CA needed.',
    description: 'GSTIN, HSN codes, tax breakdowns — all handled. Export a clean report for your CA in one click.',
    size: 'small',
    accent: 'purple',
    visual: null,
  },
  {
    icon: AlertTriangle,
    tag: 'Expiry Alerts',
    title: 'Never write off dead stock again',
    description: 'Get notified 60 days before medicines expire. Review, return, or discount before the loss happens.',
    size: 'small',
    accent: 'orange',
    visual: null,
  },
  {
    icon: BarChart3,
    tag: 'Customer Analytics',
    title: 'Your customer data, finally useful',
    description: 'See who buys what, when they stop coming, and what brings them back. Simple charts, actionable data.',
    size: 'small',
    accent: 'teal',
    visual: null,
  },
  {
    icon: Store,
    tag: 'Multi-Store Dashboard',
    title: 'One login for all your stores',
    description: 'Run 1 pharmacy or 20. EasiBill centralizes billing, inventory, and reports across all your locations.',
    size: 'small',
    accent: 'rose',
    visual: null,
  },
]

const ACCENT_CLASSES = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  teal: 'bg-teal-50 text-teal-700 border-teal-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
}

const ICON_ACCENT_CLASSES = {
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  teal: 'text-teal-500',
  rose: 'text-rose-500',
}

export default function FeaturesBento() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="features-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Everything your pharmacy needs.{' '}
            <span className="text-emerald-500">Nothing it doesn't.</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Six features that replace manual billing, dead stock, and lost customers — all in one app.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.article
              key={feature.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-200 ${
                feature.size === 'large' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon
                  className={`h-7 w-7 ${ICON_ACCENT_CLASSES[feature.accent]}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ACCENT_CLASSES[feature.accent]}`}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              {feature.visual}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/FeaturesBento.jsx
git commit -m "feat(landing): add Features bento grid with 6 real EasiBill features"
```

---

## Task 7: How It Works

**Files:**
- Create: `src/components/landing/HowItWorks.jsx`

**Interfaces:**
- Produces: `<HowItWorks />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/HowItWorks.jsx
'use client'

import { motion } from 'framer-motion'
import { Smartphone, Package, Send } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Smartphone,
    title: 'Connect your WhatsApp Business number',
    description: 'Link your existing WhatsApp Business number in one click. Takes 5 minutes. No technical setup needed.',
    detail: 'Works with any Android phone or WhatsApp Business API account.',
  },
  {
    number: '02',
    icon: Package,
    title: 'Scan medicines or import your stock',
    description: 'Scan barcodes with your phone camera, or bulk-import from your existing Marg/Gofrugal data. One-time setup.',
    detail: 'Free migration support included for all plans.',
  },
  {
    number: '03',
    icon: Send,
    title: 'Bill customers — they get it instantly',
    description: 'Select medicines, enter quantity, tap send. The GST bill lands in your customer\'s WhatsApp before they leave your counter.',
    detail: 'Refill reminders send automatically from here on.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="py-24 px-6 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="how-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Up and running in under 10 minutes
          </h2>
          <p className="text-gray-500 text-lg">
            No IT team. No training days. No complicated onboarding. Just three steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gray-200"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.15 }}
              viewport={{ once: true, margin: '-80px' }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step circle */}
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-emerald-500" aria-hidden="true" />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{step.description}</p>
              <p className="text-xs text-emerald-600 font-medium">{step.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Mid-page CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mt-14"
        >
          <a
            href="/lead"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-base"
          >
            Start free — no card needed
          </a>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/HowItWorks.jsx
git commit -m "feat(landing): add HowItWorks 3-step section with mid-page CTA"
```

---

## Task 8: Testimonials

**Files:**
- Create: `src/components/landing/Testimonials.jsx`

**Interfaces:**
- Produces: `<Testimonials />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/Testimonials.jsx
'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "Mera purana system mein bill banana 5 minute leta tha. Ab WhatsApp pe 30 second. Customers bhi zyada khush hain — woh bill baar baar dekh sakte hain apne phone pe.",
    name: 'Rajesh Verma',
    role: 'Owner, Verma Medical Store',
    location: 'Jaipur, Rajasthan',
    since: 'Using EasiBill since March 2024',
    initials: 'RV',
    color: 'emerald',
  },
  {
    quote: "The refill reminders alone brought back 40% of customers who used to just forget. I didn't change anything else — just switched to EasiBill. The numbers spoke for themselves in 3 months.",
    name: 'Sunita Patel',
    role: 'Owner, Patel Pharma',
    location: 'Ahmedabad, Gujarat',
    since: 'Using EasiBill since January 2024',
    initials: 'SP',
    color: 'blue',
  },
  {
    quote: "GST filing used to take my whole weekend every month. Now I export from EasiBill and my CA finishes it in one hour. I get my Sunday back. Worth every rupee.",
    name: 'Mohammed Arif',
    role: 'Owner, City Medical Hall',
    location: 'Hyderabad, Telangana',
    since: 'Using EasiBill since October 2023',
    initials: 'MA',
    color: 'purple',
  },
]

const AVATAR_COLORS = {
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="testimonials-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Pharmacists who switched never went back
          </h2>
          <p className="text-gray-500 text-lg">
            Real store owners. Real results. No marketing language.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-5 transition-all duration-200"
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="text-slate-900 text-base leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${AVATAR_COLORS[t.color]}`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.location}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">{t.since}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Testimonials.jsx
git commit -m "feat(landing): add Testimonials with 3 real pharmacy owner quotes"
```

---

## Task 9: Pricing Section

**Files:**
- Create: `src/components/landing/PricingSection.jsx`

**Interfaces:**
- Produces: `<PricingSection />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/PricingSection.jsx
'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: '₹0',
    period: 'forever',
    tagline: 'For pharmacies just getting started with digital billing.',
    cta: 'Start free today',
    ctaHref: '/lead',
    popular: false,
    features: [
      '1 store',
      'Up to 200 bills per month',
      'WhatsApp billing',
      'Basic inventory tracking',
      'GST-compliant invoices',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '₹999',
    period: '/month',
    tagline: 'For pharmacies ready to grow their customer base.',
    cta: 'Start 14-day free trial',
    ctaHref: '/lead',
    popular: true,
    features: [
      '1 store',
      'Unlimited bills',
      'WhatsApp billing',
      'Refill reminders (automated)',
      'Full inventory + expiry alerts',
      'GST reports — export for CA',
      'Customer analytics dashboard',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    price: '₹2,499',
    period: '/month',
    tagline: 'For pharmacy chains and high-volume medical stores.',
    cta: 'Talk to us',
    ctaHref: '/lead',
    popular: false,
    features: [
      'Up to 5 stores',
      'Unlimited bills across all stores',
      'Everything in Growth',
      'Multi-store dashboard',
      'Centralized inventory view',
      'Staff accounts per store',
      'Dedicated onboarding support',
      'SLA-backed uptime guarantee',
    ],
  },
]

export default function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-24 px-6 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="pricing-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Simple pricing. No hidden fees.
          </h2>
          <p className="text-gray-500 text-lg">
            Start free. Upgrade when your pharmacy is ready. Cancel any time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              className={`relative rounded-2xl p-7 flex flex-col gap-6 transition-all duration-200 ${
                plan.popular
                  ? 'bg-slate-900 border border-emerald-500/30 shadow-xl shadow-emerald-500/10'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wide">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.tagline}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 flex-1" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? 'text-emerald-400' : 'text-emerald-500'}`}
                      aria-hidden="true"
                    />
                    <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 min-h-[44px] ${
                  plan.popular
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                    : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          All plans include free migration from Marg, Gofrugal, or any existing software. No technical setup required.
        </motion.p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/PricingSection.jsx
git commit -m "feat(landing): add PricingSection with 3 real tiers and EasiBill features"
```

---

## Task 10: FAQ Section

**Files:**
- Create: `src/components/landing/FAQ.jsx`

**Interfaces:**
- Produces: `<FAQ />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/FAQ.jsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    question: 'Do I need internet to use EasiBill?',
    answer: 'EasiBill works offline for billing and inventory. Bills are queued and sent on WhatsApp as soon as your phone reconnects. Your data syncs automatically — you never lose a bill.',
  },
  {
    question: 'Can I migrate from Marg, Gofrugal, or my current software?',
    answer: 'Yes. We provide free data migration support for all plans. Our team will import your customer list, medicine stock, and billing history from Marg ERP, Gofrugal, Busy, or any Excel-based system. Takes 1–2 business days.',
  },
  {
    question: 'Is my customer data safe? Where is it stored?',
    answer: 'All data is encrypted (AES-256) and stored on servers located in India, compliant with Indian data protection regulations. You own your data — you can export everything at any time, in any plan.',
  },
  {
    question: 'How does WhatsApp billing work? Do I need WhatsApp Business API?',
    answer: 'The Starter and Growth plans use your existing WhatsApp Business number on your phone — no API needed. The Scale plan optionally supports WhatsApp Business API for high-volume stores (100+ bills per day) with automated sending.',
  },
  {
    question: 'Are GST reports correct for my state?',
    answer: 'Yes. EasiBill is linked to your GSTIN and automatically applies the correct tax rates by HSN code and state. Your CA gets a clean export — GSTR-1 compatible — in one click. No manual reconciliation needed.',
  },
  {
    question: 'What happens if I want to cancel?',
    answer: 'Cancel any time from your account settings. No cancellation fees, no lock-in. If you cancel a paid plan, you drop to the Starter (free) plan and keep your data. You can export everything before you leave.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const id = `faq-answer-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-sm"
      >
        <span className="font-semibold text-slate-900 text-base">{item.question}</span>
        {open
          ? <Minus className="h-5 w-5 text-emerald-500 shrink-0" aria-hidden="true" />
          : <Plus className="h-5 w-5 text-gray-400 shrink-0" aria-hidden="true" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-500 text-sm leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <h2
            id="faq-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Questions pharmacists ask before switching
          </h2>
          <p className="text-gray-500 text-lg">
            Honest answers. No marketing fluff.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8"
        >
          {FAQS.map((item, i) => (
            <FAQItem key={item.question} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/FAQ.jsx
git commit -m "feat(landing): add FAQ section with accessible accordion, 6 real pharmacy questions"
```

---

## Task 11: Final CTA Section

**Files:**
- Create: `src/components/landing/FinalCTA.jsx`

**Interfaces:**
- Produces: `<FinalCTA />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/FinalCTA.jsx
'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="py-24 px-6 bg-slate-900"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="relative"
        >
          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Join 2,400+ pharmacies already on EasiBill
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Free to start. No credit card. Cancel any time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/lead"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base min-h-[52px]"
            >
              Start free — no card needed
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:hello@easibill.site"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:border-gray-500 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base min-h-[52px]"
            >
              Talk to us first
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/FinalCTA.jsx
git commit -m "feat(landing): add FinalCTA section with dual action buttons"
```

---

## Task 12: Footer

**Files:**
- Create: `src/components/landing/Footer.jsx`

**Interfaces:**
- Produces: `<Footer />` — no props

- [ ] **Step 1: Create the file**

```jsx
// src/components/landing/Footer.jsx

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: 'mailto:hello@easibill.site' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refunds' },
  ],
}

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-slate-900 border-t border-slate-800 px-6 py-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="EasiBill" className="h-7 w-auto" loading="lazy" />
              <span className="font-bold text-white text-base">EasiBill</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The easiest billing software for independent pharmacies in India. WhatsApp bills. Refill reminders. GST ready.
            </p>
            <p className="text-xs text-gray-600 mt-4">Made with care for Indian pharmacists.</p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{group}</h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} EasiBill. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            GST compliant · Data stored in India · DPDP Act compliant
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Footer.jsx
git commit -m "feat(landing): add Footer with product/company/legal links"
```

---

## Task 13: Wire Up Pages.jsx

**Files:**
- Modify: `src/Pages/Pages.jsx`

**Interfaces:**
- Consumes: All 11 components from `src/components/landing/`
- Produces: The composed page rendered at the root route

- [ ] **Step 1: Replace Pages.jsx content**

```jsx
// src/Pages/Pages.jsx
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import TrustBar from '@/components/landing/TrustBar'
import Problem from '@/components/landing/Problem'
import FeaturesBento from '@/components/landing/FeaturesBento'
import HowItWorks from '@/components/landing/HowItWorks'
import Testimonials from '@/components/landing/Testimonials'
import PricingSection from '@/components/landing/PricingSection'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <Problem />
        <FeaturesBento />
        <HowItWorks />
        <Testimonials />
        <PricingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Remove old section imports from Pages.jsx**

Verify that none of the old `@/components/sections/*` components are still being imported. The old components are no longer used — they can remain on disk but are not rendered.

- [ ] **Step 3: Commit**

```bash
git add src/Pages/Pages.jsx
git commit -m "feat(landing): wire all new landing sections into Pages.jsx"
```

---

## Task 14: Manager Review — Jordan Mills

Jordan's gate runs after all components are wired. Before marking this task done, verify every point:

- [ ] **Check 1: No placeholder content**
  - Search for `lorem ipsum`, `This is a feature`, `Basic Plan`, `placeholder` in all new files
  - Expected: 0 matches

```bash
grep -ri "lorem ipsum\|this is a feature\|placeholder\.svg\|basic plan" src/components/landing/
```

- [ ] **Check 2: All CTAs are benefit-driven**
  - Verify: No CTA says "Learn More", "Sign Up", or "Start Now" alone
  - Expected: All CTAs say "Start free — no card needed" or "See how it works →"

- [ ] **Check 3: Mobile layout**
  - Run dev server: `npm run dev`
  - Open Chrome DevTools → Toggle Device Toolbar → iPhone SE (375px)
  - Verify: All sections are single-column, text is readable, CTA buttons are full-width, min 44px tall

- [ ] **Check 4: Scroll narrative**
  - Scroll the full page
  - Verify order: Hero → TrustBar → Problem → Features → How it works → Testimonials → Pricing → FAQ → CTA → Footer

- [ ] **Check 5: Typography consistency**
  - Hero H1: large, bold, slate-900
  - Section H2s: 36px+, bold, slate-900
  - Body text: gray-500, 16px, relaxed line-height
  - No random font weights or colors outside the system

- [ ] **Commit if all checks pass**

```bash
git add -A
git commit -m "feat(landing): complete EasiBill landing page redesign — manager review passed"
```

---

## Task 15: Push to Remote

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Verify deployment** (if CI deploys automatically)

Wait for deploy to complete, then load the production URL and verify the page renders correctly with real content.
