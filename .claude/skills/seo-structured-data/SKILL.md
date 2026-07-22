---
name: seo-structured-data
description: Use when auditing or adding JSON-LD/schema.org structured data (Organization, Product, FAQPage, Article, BreadcrumbList, etc.) for rich-result eligibility, and validating that markup is actually correct and renders in production HTML - not just present in source.
---

# Structured Data (Schema.org / JSON-LD) Audit

Structured data doesn't affect whether a page gets indexed, but it affects whether an indexed page earns rich results (FAQ accordions, breadcrumbs, star ratings, etc. in the SERP) — a meaningful CTR lever that's easy to under-invest in.

## Checklist

1. **Inventory what schema types the content actually supports.** Don't add generic Organization/WebSite schema and stop — check for content that qualifies for richer types: FAQ Q&A pairs → `FAQPage`; step-by-step guides → `HowTo`; articles/blog posts → `Article` or `BlogPosting`; product/pricing pages → `Product`/`Offer`; nested page hierarchies → `BreadcrumbList`.
2. **Never fabricate schema for content that isn't visibly on the page** — Google's structured data guidelines explicitly prohibit marking up content not shown to users, and this can trigger a manual action. Only emit `FAQPage` schema for FAQs actually rendered, `Review`/`AggregateRating` only for genuine reviews, etc.
3. **One Organization/WebSite block site-wide** (root layout), not duplicated per page.
4. **Validate the actual rendered output**, not the source template: build the site (or fetch the live/prerendered HTML) and confirm the `<script type="application/ld+json">` contains valid, parseable JSON with real data substituted in — a template bug can silently emit `{{title}}` literal strings or `undefined`.
5. **Cross-check field requirements** for each type against schema.org / Google's rich result guidelines (e.g., `FAQPage` requires `mainEntity[].name` + `acceptedAnswer.text`; `Article` wants `headline`, `image`, `datePublished`, `author`).
6. **After deploying**, verify with Google's Rich Results Test (or Search Console's Enhancements report) — presence in source HTML is necessary but not sufficient; Google must also parse it without errors.

## Output format

List each page/template, the schema type(s) present or missing, and for present ones whether they validated. For missing high-value schema (especially FAQPage where FAQ content already exists), treat as a priority fix — it's near-zero-risk, high-leverage.
