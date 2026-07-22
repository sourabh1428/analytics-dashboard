---
name: seo-onpage-content
description: Use when auditing on-page SEO fundamentals across a site's pages - title/meta description quality and length, heading structure, duplicate or thin content, internal linking, image alt text, and URL structure. This is content/markup quality, distinct from crawlability (technical access) and structured data (schema markup).
---

# On-Page & Content SEO Audit

Covers the signals Google uses to judge a *reachable, indexed* page's relevance and quality — separate from whether it can be crawled at all.

## Checklist

1. **Title tags**: unique per page, ideally 50-60 chars (hard cap ~60 before truncation in SERPs), primary keyword near the front, brand suffix consistent. Grep all `metadata.title` / `<title>` sources and flag duplicates or missing ones across the whole route list, not a sample.
2. **Meta descriptions**: unique per page, ~150-160 chars, action-oriented, no truncation. Flag any page reusing the homepage's description verbatim (a common copy-paste bug in generated/templated pages).
3. **Heading structure**: exactly one `<h1>` per page, matching the page's primary topic (not the site name), followed by a logical `h2`/`h3` hierarchy — no skipped levels, no headings used purely for visual styling.
4. **Duplicate / near-duplicate content**: for programmatically generated pages (city/feature/keyword variants), sample several and check they aren't templated to the point of being near-identical — this is a common cause of "crawled but not indexed" at scale, since Google collapses nearly-identical pages.
5. **Thin content**: flag pages under ~300 words of substantive body copy with no other strong signal (e.g., a product/tool page can be thin if it's genuinely functional, but a blog/article/guide page should not be).
6. **Internal linking**: every real page should be reachable via at least one internal link from crawlable HTML (not JS-only navigation) — orphan pages that exist only in the sitemap are weak signals.
7. **Image alt text**: spot-check hero/content images for meaningful `alt`, not filenames or empty strings, especially on pages targeting image search.
8. **URL structure**: lowercase, hyphenated, human-readable, stable (changing URLs without redirects orphans prior SEO equity).

## Output format

Report as a table: page path → title length/uniqueness → description length/uniqueness → h1 status → word count → internal links in. Flag the worst offenders first, not every page individually if the codebase generates them from a shared template (fix the template, not each instance).
