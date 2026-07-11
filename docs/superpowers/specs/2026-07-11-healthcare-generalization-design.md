# Generalize Easibill copy: pharmacy-only → healthcare businesses (clinics, spas, pharmacies)

## Context

Easibill's marketing site (this repo) currently positions the product exclusively as pharmacy
software: hero copy, feature pages, testimonials, pricing, blog posts, help docs, and SEO
metadata all say "pharmacy" / "patients" / "refill." The actual product (WhatsApp-first
billing + reminders + retention CRM) applies equally to clinics and spas, so the site should
speak to all three verticals without a pharmacy-only framing.

This is a marketing-site content change only. The real product/dashboard app
(`dashboard.easibill.com`) is not in this repo and is out of scope.

## Terminology system

Applied consistently across all copy:

| Context | Old | New |
|---|---|---|
| Headlines / meta titles / hero badge | "pharmacy" / "independent pharmacies" | "clinics, spas & pharmacies" |
| Body copy, in-sentence | "pharmacy" / "your pharmacy" | "healthcare business" / "your business" |
| End-user noun | "patients" | "customers" |
| Feature name + route | "Refill Reminders" @ `/features/refill-reminders` | "Follow-up Reminders" @ `/features/follow-up-reminders` — add a redirect from the old path |
| Hero/feature mockup data table | "Medicine" column with drug names only (Metformin, Amlodipine, Pantoprazole) | Generic "Item/Service" column mixing one medicine line, one spa-treatment line, one consult/service line |
| Mockup sample business name | "Verma Medical" (pharmacy-flavored, reused everywhere) | Vary sample business name per mockup instance — at least one clinic-style name, one spa-style name — so no single mockup reads as pharmacy-only |
| Help-article prose | "your pharmacy's tone", "pharmacies that use broadcasts...", "your pharmacy's patient base" | "your business's tone", "healthcare businesses that use broadcasts...", "your business's customer base" |
| Help-article template placeholders | `{PharmacyName}`, `{Medicine}`, etc. | **Unchanged.** These read as literal merge-field names from the real product backend (outside this repo). Renaming them here would misdocument actual product behavior. Only the prose explaining them is generalized. |
| Component file | `src/components/easibill/PharmacyMarquee.jsx` | Renamed to `TrustMarquee.jsx`; internal business-name list already reads fine, only surrounding label text is genericized |

## Non-goals

- No changes to the actual dashboard/product app (not in this repo).
- No visual/design-system changes beyond swapping mockup table data and sample names.
- No new features, routes, or functionality beyond the one rename above.
- SEO: `/features/refill-reminders` must redirect (not 404) to `/features/follow-up-reminders`.

## Scope

All files currently matching `pharmac` (case-insensitive) under `src/` — approximately 47
files, spanning:

1. **Landing sections** — `src/components/landing/*.jsx` (Hero, TrustBar, Problem,
   Testimonials, FinalCTA, HowItWorks, FAQ, PricingSection), `src/components/Hero.jsx`,
   `src/components/easibill/*.jsx` (EasibillHero, EasibillCTA, EasibillPricing,
   EasibillSolution, EasibillTestimonials, EasibillProblem, EasibillFeatures,
   PharmacyMarquee→TrustMarquee)
2. **Feature pages** — `src/app/features/**/page.tsx` (daily-queue, broadcast-campaigns,
   retention-analytics, patient-records, refill-reminders→follow-up-reminders), plus
   `src/app/features/page.tsx` index and `src/Pages/FeaturesPage.jsx`
3. **Other top-level pages** — about, contact, testimonials, webinars, tutorials, terms,
   privacy, onboarding, help, sitemap-page, blog, blog/[slug],
   easibill-customisable-bulk-billing-solution (+ `src/Pages/*.jsx` counterparts:
   BulkBillingSolutionPage, Contact, TestimonialsPage)
4. **Data files** — `src/data/blogPosts.ts`, `src/data/helpArticles.ts` (prose only, not
   template placeholder tokens)
5. **Global metadata** — `src/app/layout.tsx`
6. **Lead-gen components** — `LeadNudge.jsx`, `LeadGeneration.jsx`, `LeadChatbot.jsx`, `Footer.jsx`

## Execution approach

Independent text/copy edits with no shared state — dispatch as parallel subagents grouped by
area (landing sections / feature pages + route rename / help+blog data / remaining top-level
pages + lead-gen components), each briefed with the terminology table above. A final pass
checks for redirect config and confirms no remaining case-insensitive "pharmac" matches outside
the intentionally-preserved template placeholder tokens.

## Testing

- `npm run lint`
- `npm run build` (confirms the route rename doesn't break the Next.js build and metadata is valid)
- Grep sweep for residual "pharmac" matches after edits, reviewed manually against the
  placeholder-token exception list
- Manual check that `/features/refill-reminders` redirects to `/features/follow-up-reminders`
