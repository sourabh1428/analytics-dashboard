---
name: seo-performance-cwv
description: Use when auditing page speed and Core Web Vitals (LCP, INP, CLS) as an SEO ranking and crawl-efficiency factor - render-blocking resources, image optimization, font loading, JS bundle size, and third-party script impact. Distinct from crawlability (can Google reach it) and content (is it relevant) - this is how fast/stable it is once loaded.
---

# Performance & Core Web Vitals SEO Audit

Page experience is a (minor but real) ranking factor, and poor performance can also reduce crawl budget efficiency on large sites. This skill audits the mechanical causes of slow/unstable pages.

## Checklist

1. **LCP (Largest Contentful Paint)**: identify the LCP element per template (usually a hero image or heading). Confirm hero images use a proper image component with `priority`/eager-loading and correct `sizes`, not lazy-loaded below-the-fold-style. Check for render-blocking CSS/JS before the LCP element.
2. **CLS (Cumulative Layout Shift)**: images/embeds must have explicit dimensions or aspect-ratio boxes; web fonts should use `font-display: swap` (or equivalent) with matched fallback metrics to avoid reflow; avoid injecting content above existing content after load (banners, cookie notices) without reserved space.
3. **INP (Interaction to Next Paint)**: flag heavy synchronous JS on main thread during load — large third-party widgets (chat, analytics, ads) initialized eagerly instead of deferred/`afterInteractive`/on-idle.
4. **Third-party scripts**: inventory every third-party `<script>` (analytics, chat widgets, ad tech, A/B testing). Each one is a tax on LCP/INP — confirm each uses an async/defer/lazy strategy appropriate to its actual necessity for first paint. A chat widget does not need to block initial render.
5. **Image optimization**: served via a real image optimization pipeline (framework image component, CDN transform) — not raw uncompressed originals; correct format (WebP/AVIF where supported); responsive `srcset`/`sizes` rather than one oversized image for all viewports.
6. **JS bundle size**: check the framework's own build output size report for outsized routes/chunks; flag heavy libraries loaded on routes that don't need them.
7. **Fonts**: self-hosted or preconnected, subset to used character sets/weights, `display: swap`, no more than 2-3 font families/weights combined.
8. **Measure, don't guess**: where possible, pull real data from the platform's own speed-insights tool or a Lighthouse/PageSpeed Insights run rather than eyeballing the code — code review catches *causes*, but only a measurement confirms *impact* and catches issues code review misses (e.g., real-world network conditions, actual third-party payload sizes).

## Output format

Report per metric (LCP/CLS/INP): current state (measured if available, otherwise "not measured — recommend running X"), root cause if failing, and the specific file/line or config change to fix it.
