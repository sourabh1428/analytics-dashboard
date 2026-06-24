import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { SeoContent } from "@/lib/content";
import { FaqAccordion, type FaqPair } from "@/components/seo/FaqAccordion";

// ─── Content parser ───────────────────────────────────────────────────────────

type TextSection = { type: "text"; heading: string; body: string };
type FaqSection = { type: "faq"; heading: string; pairs: FaqPair[] };
type Section = TextSection | FaqSection;

function parseContent(markdown: string): Section[] {
  const raw = markdown.replace(/^## .+\n/, ""); // strip duplicate H1 at top if present
  const chunks = raw.split(/(?=^## )/m).filter((s) => s.trim());

  return chunks.map((chunk): Section => {
    const nl = chunk.indexOf("\n");
    const rawHeading = chunk.slice(0, nl === -1 ? undefined : nl).replace(/^## /, "").trim();
    const body = nl === -1 ? "" : chunk.slice(nl + 1).trim();

    if (/faq|frequently asked/i.test(rawHeading)) {
      // Parse **Q: ...** \n answer blocks
      const pairs: FaqPair[] = [];
      const blocks = body.split(/\n(?=\*\*Q[:\s])/);
      for (const block of blocks) {
        const m = block.match(/^\*\*Q[^*]*?:?\s*([\s\S]+?)\*\*\s*\n([\s\S]+)/);
        if (m) pairs.push({ q: m[1].replace(/\*+$/, "").trim(), a: m[2].trim() });
      }
      if (pairs.length > 0) return { type: "faq", heading: rawHeading, pairs };
    }

    return { type: "text", heading: rawHeading, body };
  });
}

// ─── Hero image selection ─────────────────────────────────────────────────────

// Free Unsplash photos — pharmacy / medical / billing contexts
const HERO_PHOTOS = [
  { id: "photo-1587854692152-cbe660dbde88", alt: "Pharmacy shelves with medicines" },
  { id: "photo-1576091160399-112ba8d25d1d", alt: "Assorted medicine pills and capsules" },
  { id: "photo-1584308666744-24d5c474f2ae", alt: "Medicine packaging and tablets" },
  { id: "photo-1559757148-5c350d0d3c56", alt: "Pharmacist at a medical counter" },
  { id: "photo-1584982751601-97dcc096659c", alt: "Inside view of a pharmacy" },
  { id: "photo-1563013544-824ae1b704d3", alt: "Medical billing and invoice documents" },
];

function pickHeroPhoto(slug: string) {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h) ^ slug.charCodeAt(i);
  return HERO_PHOTOS[Math.abs(h) % HERO_PHOTOS.length];
}

// ─── Section icons ────────────────────────────────────────────────────────────

const SECTION_ICONS: Record<string, string> = {
  problem: "⚡",
  today: "📋",
  manual: "✍️",
  handle: "✍️",
  easibill: "🚀",
  solve: "🚀",
  get: "🎯",
  start: "🎯",
  faq: "💬",
  frequently: "💬",
};

function getSectionIcon(heading: string): string {
  const lower = heading.toLowerCase();
  for (const [key, icon] of Object.entries(SECTION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📌";
}

// ─── Reading time ─────────────────────────────────────────────────────────────

function readingTime(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

// ─── Props ────────────────────────────────────────────────────────────────────

type ArticleProps = {
  page: SeoContent;
  relatedPages: SeoContent[];
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Article({ page, relatedPages }: ArticleProps) {
  const sections = parseContent(page.content);
  const hero = pickHeroPhoto(page.slug);
  const mins = readingTime(page.content);

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        <Image
          src={`https://images.unsplash.com/${hero.id}?w=1400&h=600&fit=crop&q=80&auto=format`}
          alt={hero.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-zinc-950/10" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 sm:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/30">
              {page.keyword}
            </span>
            <span className="text-xs text-zinc-300">{mins} min read</span>
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-snug text-white sm:text-4xl md:text-5xl">
            {page.h1}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
            {page.metaDescription}
          </p>
        </div>
      </div>

      {/* ── Quick-stat strip ── */}
      <div className="border-b border-zinc-100 bg-zinc-50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-zinc-200 sm:grid-cols-4">
          {[
            { stat: "12%", label: "GST on most medicines" },
            { stat: "0%", label: "GST on essential drugs" },
            { stat: "11th", label: "GSTR-1 filing deadline" },
            { stat: "₹40L+", label: "GSTIN mandatory above" },
          ].map(({ stat, label }) => (
            <div key={label} className="flex flex-col items-center px-4 py-4 text-center">
              <span className="text-2xl font-bold text-emerald-600">{stat}</span>
              <span className="mt-0.5 text-xs leading-4 text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-10">
            {sections.map((section, idx) => {
              if (section.type === "faq") {
                return (
                  <section key={idx}>
                    <div className="mb-5 flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">💬</span>
                      <h2 className="text-2xl font-bold text-zinc-900">{section.heading}</h2>
                    </div>
                    <FaqAccordion pairs={section.pairs} />
                  </section>
                );
              }

              const icon = getSectionIcon(section.heading);
              return (
                <section
                  key={idx}
                  className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-5 flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl"
                      aria-hidden="true"
                    >
                      {icon}
                    </span>
                    <h2 className="pt-1 text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
                      {section.heading}
                    </h2>
                  </div>

                  <div className="prose prose-zinc max-w-none text-sm leading-7 prose-headings:font-semibold prose-headings:text-zinc-800 prose-strong:text-zinc-900 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-li:text-zinc-700 prose-ol:text-zinc-700">
                    <ReactMarkdown skipHtml>{section.body}</ReactMarkdown>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-6 lg:w-72">
            {/* CTA card */}
            <div className="sticky top-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-lg">
              <div className="text-2xl" aria-hidden="true">💊</div>
              <h3 className="mt-3 text-lg font-bold">Try EasiBill free</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-100">
                Automate GST billing, WhatsApp reminders, and expiry tracking for your pharmacy.
              </p>
              <Link
                href="https://easibill.vercel.app/login"
                className="mt-5 flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start for free →
              </Link>
              <p className="mt-3 text-center text-xs text-emerald-200">No credit card required</p>
            </div>

            {/* Related pages */}
            {relatedPages.length > 0 && (
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                  Related Articles
                </h3>
                <ul className="mt-4 space-y-4">
                  {relatedPages.map((rp) => (
                    <li key={rp.slug}>
                      <Link
                        href={`/${rp.slug}`}
                        className="block text-sm font-medium text-zinc-900 transition hover:text-emerald-700"
                      >
                        {rp.metaTitle}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                        {rp.metaDescription}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact card */}
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
              <p className="text-xs leading-5 text-zinc-500">
                Questions? Talk to the EasiBill team directly.
              </p>
              <a
                href="mailto:hello@easibill.io"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                <span>hello@easibill.io</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
