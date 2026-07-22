import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, ArrowRight, Lightbulb } from "lucide-react";
import { helpArticles, helpCategories } from "@/src/data/helpArticles";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return helpArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = helpArticles.find((a) => a.slug === slug);
  if (!article) return {};
  const title = `${article.title} – Ferbz Help`;
  return {
    title,
    description: article.intro,
    openGraph: { title, description: article.intro, url: `https://ferbz.com/help/${slug}`, siteName: "Ferbz", type: "article" },
    twitter: { card: "summary_large_image", title, description: article.intro },
    alternates: { canonical: `https://ferbz.com/help/${slug}` },
  };
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = helpArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = article.related
    ?.map((s) => helpArticles.find((a) => a.slug === s))
    .filter(Boolean) ?? [];

  const category = helpCategories.find((c) => c.title === article.category);
  const categoryArticles = category?.slugs
    .map((s) => helpArticles.find((a) => a.slug === s))
    .filter((a) => a && a.slug !== slug) ?? [];

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-faint">
          <Link href="/help" className="transition-colors hover:text-green">Help Center</Link>
          <span>/</span>
          <span className="text-mutedink">{article.category}</span>
          <span>/</span>
          <span className="text-ink">{article.title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_260px]">
          {/* Main content */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.2em] text-green">{article.category.toUpperCase()}</span>
              <span className="flex items-center gap-1 font-mono text-xs text-faint">
                <Clock className="h-3 w-3" /> {article.time} read
              </span>
            </div>

            <h1 className="mb-4 font-display text-3xl font-extrabold uppercase tracking-[-0.015em] text-ink">{article.title}</h1>
            <p className="mb-10 border-l-2 border-green pl-4 text-base leading-relaxed text-mutedink">{article.intro}</p>

            {/* Steps */}
            <div className="space-y-6">
              {article.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink bg-green-pale font-mono text-sm font-bold text-green">
                      {i + 1}
                    </div>
                    {i < article.steps.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-ink/15" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="mb-1.5 font-display font-bold text-ink">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-mutedink">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            {article.tip && (
              <div className="mt-8 flex gap-3 border border-ink bg-paper-white p-5">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-green" />
                <div>
                  <p className="mb-1 font-mono text-xs tracking-[0.1em] text-green">PRO TIP</p>
                  <p className="text-sm text-mutedink">{article.tip}</p>
                </div>
              </div>
            )}

            {/* Done check */}
            <div className="mt-10 flex items-center gap-3 border border-ink bg-green-pale p-5">
              <CheckCircle className="h-5 w-5 shrink-0 text-green" />
              <p className="text-sm text-ink">
                Still need help?{" "}
                <Link href="/contact" className="text-green underline underline-offset-2 hover:text-ink">
                  Contact our support team
                </Link>{" "}
                — we typically respond within 2 hours.
              </p>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-4 font-display text-base font-bold uppercase tracking-[-0.005em] text-ink">Related articles</h2>
                <div className="space-y-2">
                  {related.map((r) => r && (
                    <Link
                      key={r.slug}
                      href={`/help/${r.slug}`}
                      className="group flex items-center justify-between border border-ink bg-paper-white px-4 py-3 transition-colors hover:bg-green-pale"
                    >
                      <span className="text-sm text-ink transition-colors group-hover:text-green">{r.title}</span>
                      <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-faint">
                        <Clock className="h-3 w-3" /> {r.time}
                        <ArrowRight className="ml-1 h-3 w-3 text-green opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — category articles */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Link href="/help" className="mb-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-faint transition-colors hover:text-green">
                <ArrowLeft className="h-4 w-4" /> ALL CATEGORIES
              </Link>

              <div className="border border-ink bg-paper-white p-4">
                <p className="mb-3 font-mono text-xs tracking-[0.15em] text-green">{article.category.toUpperCase()}</p>
                <ul className="space-y-1">
                  {categoryArticles.map((a) => a && (
                    <li key={a.slug}>
                      <Link
                        href={`/help/${a.slug}`}
                        className="flex items-center justify-between px-3 py-2 text-sm text-mutedink transition-colors hover:bg-paper-alt hover:text-ink"
                      >
                        <span>{a.title}</span>
                        <span className="ml-2 shrink-0 font-mono text-[11px] text-faint">{a.time}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border border-ink bg-green-pale p-4 text-center">
                <p className="mb-1 font-display text-sm font-bold text-ink">Need more help?</p>
                <p className="mb-3 text-xs text-mutedink">Support team replies within 2 hours</p>
                <a
                  href="mailto:support@ferbz.com"
                  className="flex w-full items-center justify-center bg-green px-4 py-2 font-mono text-xs tracking-[0.1em] text-paper transition-colors hover:bg-ink"
                >
                  EMAIL SUPPORT
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
