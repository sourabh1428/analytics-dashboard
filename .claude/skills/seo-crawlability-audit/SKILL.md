---
name: seo-crawlability-audit
description: Use when a site isn't getting indexed and the cause might be technical (firewall/WAF challenges, robots.txt, meta robots, canonical loops, redirect chains, wrong domain/project routing, DNS). Diagnoses whether Googlebot can actually reach and read the page, as opposed to content-quality issues.
---

# SEO Crawlability Audit

Diagnoses whether a page is technically reachable and crawlable — the layer *beneath* content quality. If this layer is broken, no amount of good content or backlinks will get a page indexed.

## Checklist (run in order — each step can fully explain "not indexed" on its own)

1. **Resolve the real production target.** Don't assume the local repo's `.vercel/project.json` or git remote points at the live domain. Confirm via the hosting platform which project/deployment actually serves the domain in question (`vercel.com/.../domains`, or `dig`/`whois` for DNS). A fix applied to the wrong project is invisible in production.
2. **Fetch with multiple user-agents and IPs.** `curl -A "<real Googlebot UA>"` from a random IP does NOT prove Googlebot is allowed through — WAFs verify by reverse-DNS/IP range, not UA string. Don't conclude "Googlebot is blocked" from a spoofed curl alone; corroborate with the search engine's own live-URL-test tool.
3. **Check for challenge/WAF layers**: look for 429s, JS challenge pages, `X-Vercel-Mitigated`, Cloudflare "Under Attack Mode", or similar headers on every path (`/`, `/robots.txt`, `/sitemap.xml`, and 2-3 inner pages). Check both apex and `www` — a rule can differ per host.
4. **robots.txt**: fetch it live, confirm it doesn't disallow the paths in question, and confirm the `Sitemap:` line points to a URL that actually 200s.
5. **Meta robots / X-Robots-Tag**: grep the codebase and check live response headers for `noindex`, `nofollow`, or an environment-gated `<meta name="robots" content="noindex">` accidentally left enabled in production config.
6. **Canonical tags**: every indexable page should have a self-referencing (or intentionally consolidating) canonical. Watch for canonical pointing to a different host (apex vs www mismatch) than the one actually serving traffic — this alone causes "crawled, not indexed."
7. **Redirect chains**: apex→www (or vice versa) should be a single clean 301/308, not a chain, and not inconsistent (some paths redirecting, others not).
8. **HTTP status sanity**: spot-check that real pages return 200, not soft-404s (200 status but "not found" content) or hard 404/500s.

## Output format

Report each check as PASS/FAIL/UNKNOWN with the literal command/evidence used — not a guess. For any FAIL, state the concrete fix (config file + line, or dashboard setting + path) rather than a general recommendation.
