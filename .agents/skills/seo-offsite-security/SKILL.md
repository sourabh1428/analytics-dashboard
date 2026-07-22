---
name: seo-offsite-security
description: Use when auditing off-site signals that affect indexing/ranking trust - suspicious or spammy inbound links surfaced in Search Console, manual actions/security issues, negative-SEO patterns, and stale/orphaned third-party references (old social profiles, broken backlinks) discovered during an indexing investigation.
---

# Off-Site & Security Signal Audit

Indexing problems aren't always on-site. This skill covers the signals visible from *outside* the codebase — mainly via Search Console — that can suppress indexing/ranking or indicate the domain has other issues.

## Checklist

1. **Search Console → Security & Manual Actions**: check both `Manual Actions` and `Security Issues` reports first, every time. A manual action or flagged malware/hacked-content issue can fully explain suppressed indexing and is invisible from any on-site code review.
2. **Referring pages surfaced in URL Inspection's "Discovery" section**: treat unfamiliar/low-quality-looking domains (random TLDs, non-Latin/spam-pattern paths, URL shorteners) as worth a quick manual look, not automatic alarm — most are harmless scraper/aggregator noise, but note them to the user rather than silently ignoring. Do not click through to suspicious URLs from an agent context.
3. **Links report**: check top linking sites and top linked pages for anything unexpected — a sudden spike of low-quality inbound links can indicate negative SEO or a scraper network, though it rarely by itself blocks indexing.
4. **Stale/orphaned brand references**: old social profiles, directory listings, or cached pages referencing a prior brand name/domain (common after a rebrand) that still link inbound with outdated URLs — flag for the user to update or redirect-map, since these are real traffic/link-equity sources being wasted.
5. **HTTPS/certificate validity and mixed content**: confirm the live cert is valid and no resources load over plain HTTP on an HTTPS page (mixed content can trigger browser warnings that indirectly hurt trust signals and, in some browsers, block resources outright).
6. **Domain-level trust basics**: WHOIS privacy/expiry not imminent, no DNS issues (SPF/DMARC are email deliverability, not indexing, but worth a one-line mention if glaringly absent since they're often audited together).

## Output format

Report Manual Actions/Security Issues status first and explicitly (clear or flagged) since it's the highest-priority item. Then list any notable off-site findings with the exact evidence (URL, date, report screen) and a clear recommendation — flag suspicious items for user awareness without taking action on them.
