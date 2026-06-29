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
  return {
    title: `${article.title} – EasiBill Help`,
    description: article.intro,
    alternates: { canonical: `https://easibill.com/help/${slug}` },
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
    <div className="min-h-screen" style={{ background: "#080d0a" }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/help" className="hover:text-amber-400 transition-colors">Help Center</Link>
          <span>/</span>
          <span className="text-white/60">{article.category}</span>
          <span>/</span>
          <span className="text-white/80">{article.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_260px] gap-12">
          {/* Main content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">{article.category}</span>
              <span className="flex items-center gap-1 text-xs text-white/30">
                <Clock className="h-3 w-3" /> {article.time} read
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
            <p className="text-white/60 text-base leading-relaxed mb-10 border-l-2 border-amber-500/40 pl-4">{article.intro}</p>

            {/* Steps */}
            <div className="space-y-6">
              {article.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/30 text-sm font-bold text-amber-400">
                      {i + 1}
                    </div>
                    {i < article.steps.length - 1 && (
                      <div className="mt-2 flex-1 w-px bg-white/[0.06]" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <h3 className="font-semibold text-white mb-1.5">{step.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tip */}
            {article.tip && (
              <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 flex gap-3">
                <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-300 mb-1">Pro tip</p>
                  <p className="text-sm text-white/60">{article.tip}</p>
                </div>
              </div>
            )}

            {/* Done check */}
            <div className="mt-10 rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
              <p className="text-sm text-white/70">
                Still need help?{" "}
                <Link href="/contact" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
                  Contact our support team
                </Link>{" "}
                — we typically respond within 2 hours.
              </p>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="text-base font-semibold text-white mb-4">Related articles</h2>
                <div className="space-y-2">
                  {related.map((r) => r && (
                    <Link
                      key={r.slug}
                      href={`/help/${r.slug}`}
                      className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors group"
                    >
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">{r.title}</span>
                      <span className="flex items-center gap-1 text-xs text-white/30 shrink-0">
                        <Clock className="h-3 w-3" /> {r.time}
                        <ArrowRight className="h-3 w-3 ml-1 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <Link href="/help" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-amber-400 transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" /> All categories
              </Link>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">{article.category}</p>
                <ul className="space-y-1">
                  {categoryArticles.map((a) => a && (
                    <li key={a.slug}>
                      <Link
                        href={`/help/${a.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <span>{a.title}</span>
                        <span className="text-xs text-white/25 shrink-0 ml-2">{a.time}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                <p className="text-sm font-semibold text-white mb-1">Need more help?</p>
                <p className="text-xs text-white/50 mb-3">Support team replies within 2 hours</p>
                <a
                  href="mailto:support@easibill.com"
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-amber-500 text-sm font-semibold text-white hover:bg-amber-400 transition-colors"
                >
                  Email support
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
