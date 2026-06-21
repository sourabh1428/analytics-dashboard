---
name: empty-routes-fix
description: Add full-content standalone pages for /features, /testimonials, /easibill-customisable-bulk-billing-solution and wire redirect aliases for similar URL variants
metadata:
  type: project
---

# Empty Routes Fix — Design Spec
> 2026-06-21 | Easibill marketing site

## Problem

Three public URLs referenced externally return blank pages because they are not registered in React Router:
- `/testimonials`
- `/features`
- `/easibill-customisable-bulk-billing-solution`

Visitors who land on these routes (from SEO, social sharing, or direct links) see nothing.

---

## Solution

Create three full standalone page components and register them (plus redirect aliases) in `App.jsx`.

---

## Pages

### 1. `/features`

**Purpose:** Dedicated features reference page for users exploring the product in depth.

**Sections (top to bottom):**
1. **Hero** — headline "Every tool your pharmacy counter needs. Nothing it doesn't.", subheadline about avoiding CRM bloat, two CTAs (Start trial / Book demo)
2. **Feature grid** — reuse `EasibillFeatures` section component (6 feature cards + dashboard showcase)
3. **How it compares** — 3-column table: Manual WhatsApp vs. Generic CRM vs. Easibill. Rows: Setup time, Monthly effort, Patient tracking, Reminder automation, Cost
4. **CTA strip** — "Ready to stop chasing refills?" with trial + demo buttons

---

### 2. `/testimonials`

**Purpose:** Social proof page for prospects evaluating trust signals.

**Sections (top to bottom):**
1. **Hero** — headline "Built around how Indian pharmacy counters really work.", subheadline about 120+ pharmacy owners interviewed
2. **Proof bar** — 4 stat chips (120+ owners interviewed, 10k+ reminders sent, <4 hr support response, 14-day free trial)
3. **Testimonial grid** — reuse `EasibillTestimonials` cards + add 3 more testimonials for page depth (total 6)
4. **Video/quote callout** — large pull-quote block with a highlighted testimonial (styled differently — dark background)
5. **CTA strip** — "Join pharmacies already retaining more patients"

**Extra testimonials for the page:**
- Sunita Joshi, Joshi Medical Store, Bhopal — "Before Easibill, I had a notebook of dates I kept forgetting. Now the list is ready every morning."
- Ravi Mehta, Mehta Pharmacy, Ahmedabad — "WhatsApp reminders from our own number feel personal. Patients respond much better than a generic blast."
- Deepa Nair, Nair Medicals, Kochi — "We recovered three patients in the first week who hadn't visited in two months. That paid for the whole year."

---

### 3. `/easibill-customisable-bulk-billing-solution`

**Purpose:** SEO landing page targeting search queries around customisable bulk billing, broadcast messaging, and pharmacy segmentation.

**Sections (top to bottom):**
1. **Hero** — headline "Customisable bulk billing built for Indian pharmacies.", badge "Broadcast + Segmentation", subheadline about sending targeted messages to the right patients at the right time, CTAs
2. **What is bulk billing** — 2-column explainer: left = plain text definition (send one message to many patients, filtered by segment, medicine, or activity), right = visual mock showing a broadcast being composed with segment filters
3. **Capabilities grid** — 4 cards:
   - Custom WhatsApp templates (medicine name, refill date, pharmacy name tokens)
   - Segment-based broadcasts (diabetes, BP, senior citizen, high-value)
   - Scheduled sends (health camps, seasonal offers, loyalty messages)
   - Delivery tracking (sent, failed, read receipts per campaign)
4. **Before / After** — split card: Before = blasting everyone with generic messages, high opt-outs; After = targeted segments, higher open rate, fewer complaints
5. **Pricing callout** — ₹999/month Pro plan unlocks bulk broadcasts; link to pricing section
6. **CTA strip** — "Start sending smarter campaigns"

---

## Redirects

Registered as `<Route path="X" element={<Navigate to="Y" replace />}` in `App.jsx`:

| From | To |
|---|---|
| `/feature` | `/features` |
| `/our-features` | `/features` |
| `/product-features` | `/features` |
| `/testimonial` | `/testimonials` |
| `/reviews` | `/testimonials` |
| `/customers` | `/testimonials` |
| `/bulk-billing` | `/easibill-customisable-bulk-billing-solution` |
| `/bulk-billing-solution` | `/easibill-customisable-bulk-billing-solution` |
| `/customisable-billing` | `/easibill-customisable-bulk-billing-solution` |
| `/easibill-bulk-billing` | `/easibill-customisable-bulk-billing-solution` |

---

## Architecture

**New files:**
- `src/Pages/FeaturesPage.jsx`
- `src/Pages/TestimonialsPage.jsx`
- `src/Pages/BulkBillingSolutionPage.jsx`

**Modified files:**
- `src/App.jsx` — add 3 page routes + 10 redirect routes, lazy-import new pages

**Reuse strategy:** Each page wraps existing easibill section components (`EasibillFeatures`, `EasibillTestimonials`) inside `PageLayout` with a page-specific hero and a closing CTA strip. New page-only sections are self-contained in the page file.

**Design tokens (consistent with homepage):**
- Background: `bg-gradient-to-b from-[#eafaf3] via-[#f4fdf8] to-[#eef9f4]`
- Accent: emerald-600 / cyan-700 / slate-950
- Cards: `rounded-[1.75rem] border border-slate-200 bg-white shadow-sm`
- Section spacing: `px-4 sm:px-6 lg:px-8`, `mx-auto max-w-7xl`
- Animations: `framer-motion` whileInView fade + slide, `once: true`

---

## Out of scope

- Navigation bar changes (existing nav already handles `/contact` and section anchors)
- SEO meta tags (separate task)
- New imagery or real video embeds
