---
name: seo-indexing-sitemaps
description: Use when auditing or fixing Google Search Console indexing status, sitemap submission/health, and the request-indexing workflow. Distinguishes "never crawled," "crawled but not indexed," and "indexed" states, and knows GSC's actual UI/API surface for verifying and acting on each.
---

# SEO Indexing & Sitemap Audit

Google Search Console (GSC) is the ground truth for indexing — not assumptions, not "it looks fine to me." This skill is about reading GSC precisely and taking the right action for the state found.

## Key distinctions (do not conflate these)

- **"URL is unknown to Google"** — never discovered. Fix: get it into a sitemap that's submitted and successfully fetched, or get an inbound link to it, or manually request indexing.
- **"Crawled – currently not indexed"** — Google fetched it and chose not to index it. This is usually a *quality* judgment (thin/duplicate content, low perceived value), not a technical block. Re-requesting indexing only helps if the underlying content or signals actually improved since the last crawl.
- **"Discovered – currently not indexed"** — known but not yet crawled (often a crawl-budget/priority issue on low-authority sites).
- **Indexed** — done; further work is about ranking, not indexing.

Always check the **live test** ("Test Live URL" / real-time inspection) separately from the **indexed/cached report** — they can disagree, and the live test is what tells you whether *today's* code is fetchable, while the report tells you what Google last decided.

## Checklist

1. Confirm the GSC property matches the actual production host (domain property `sc-domain:example.com` covers all subdomains/protocols; a URL-prefix property does not — a common false "not verified" scare when checking the wrong property type).
2. Check `Sitemaps` report for every submitted sitemap: status (Success/Couldn't fetch/Pending), discovered page count, last read date. A "Couldn't fetch" or a last-read date from years ago on an old URL variant is often harmless historical cruft — cross-check whether that exact URL still resolves correctly *today* before treating it as a live bug.
3. Resubmit any sitemap that legitimately failed, only after confirming (via curl) that it now returns 200 with valid XML.
4. Use URL Inspection's live test on: the homepage, 1-2 deep/inner pages, and any page the user specifically flagged. Compare "last crawl" date against how long ago the site last changed meaningfully (a stale last-crawl from before a rebrand/relaunch fully explains a "not indexed" complaint).
5. Where the live test passes ("Page can be indexed"), use **Request Indexing** — note GSC enforces a small daily quota (roughly ~10 URLs/property/day), so prioritize the homepage and top-traffic-intent pages first.
6. Check the **Performance** report's impressions/clicks separately, and explicitly tell the user: this metric only counts appearances in real Google Search results pages, not direct visits to the site — 0 impressions is expected and uninformative while nothing is indexed yet, it is not itself evidence of a block.
7. Re-verification cadence: indexing requests are typically actioned within hours to a couple of days, not instantly — don't re-test in a tight loop; set expectations accordingly.

## Output format

State current status per URL checked (unknown / crawled-not-indexed / indexed), the evidence (screenshot text or field values, not paraphrase), and the single next action taken or recommended.
