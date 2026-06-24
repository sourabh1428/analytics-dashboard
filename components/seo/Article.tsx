import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { SeoContent } from "@/lib/content";

type ArticleProps = {
  page: SeoContent;
  relatedPages: SeoContent[];
};

export function Article({ page, relatedPages }: ArticleProps) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{page.keyword}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">{page.h1}</h1>
      <div className="prose prose-zinc mt-8 max-w-none prose-headings:scroll-mt-24 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:text-emerald-800">
        <ReactMarkdown skipHtml>{page.content}</ReactMarkdown>
      </div>

      {relatedPages.length > 0 ? (
        <aside className="mt-12 border-t border-zinc-200 pt-8">
          <h2 className="text-xl font-semibold text-zinc-950">Related articles</h2>
          <ul className="mt-4 space-y-3">
            {relatedPages.map((relatedPage) => (
              <li key={relatedPage.slug}>
                <Link className="font-medium text-emerald-700 hover:text-emerald-800" href={`/${relatedPage.slug}`}>
                  {relatedPage.metaTitle}
                </Link>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{relatedPage.metaDescription}</p>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}
