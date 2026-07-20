import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, CATEGORY_COLORS } from "@/src/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog – EasiBill Business Growth",
  description: "Practical articles on customer retention, WhatsApp billing, follow-up automation, and running a local business more profitably every month.",
  alternates: { canonical: "https://easibill.com/blog" },
};

const ALL_CATEGORIES = ["All", "Retention", "WhatsApp", "How-to", "Growth", "Analytics", "Compliance", "Operations"];

export default function BlogPage() {
  const featured = blogPosts.slice(0, 3);
  const rest = blogPosts.slice(3);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-green">BLOG</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        Business growth, plainly explained
      </h1>
      <p className="mt-4 max-w-2xl text-mutedink">
        200+ practical articles for local business owners. Retention, WhatsApp billing, compliance, and operations — no fluff.
      </p>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <span
            key={cat}
            className={`border px-3 py-1 font-mono text-xs tracking-[0.1em] ${
              cat === "All"
                ? "border-ink bg-ink text-paper"
                : "cursor-pointer border-ink bg-paper-white text-mutedink transition-colors hover:bg-ink hover:text-paper"
            }`}
          >
            {cat.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Featured posts */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {featured.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col border border-ink bg-paper-white p-6 shadow-[8px_8px_0_#17150F] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 font-mono text-[11px] tracking-[0.08em] ${(CATEGORY_COLORS[post.category] ?? "text-mutedink bg-paper-alt").replace("rounded-full", "")}`}>
                {post.category}
              </span>
              <span className="font-mono text-[11px] text-faint">{post.readTime}</span>
            </div>
            <h2 className="mt-4 font-display text-base font-bold leading-6 text-ink transition-colors group-hover:text-green">{post.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-mutedink">{post.excerpt}</p>
            <p className="mt-4 font-mono text-[11px] text-faint">{post.date}</p>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-12 border border-ink bg-green-pale p-8">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-ink">Get articles in your inbox</h2>
        <p className="mt-2 text-sm text-mutedink">One email per week. Practical retention tips for local businesses. Unsubscribe anytime.</p>
        <div className="mt-5 flex max-w-sm border border-ink bg-paper-white">
          <input
            type="email"
            placeholder="your@email.com"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-faint"
          />
          <button className="bg-green px-5 font-mono text-xs tracking-[0.1em] text-paper transition-colors hover:bg-ink">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* All posts */}
      <h2 className="mt-16 font-display text-2xl font-extrabold uppercase tracking-[-0.01em] text-ink">All articles</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col border border-ink bg-paper-white p-5 transition-colors hover:bg-paper-alt"
          >
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] ${(CATEGORY_COLORS[post.category] ?? "text-mutedink bg-paper-alt").replace("rounded-full", "")}`}>
                {post.category}
              </span>
              <span className="font-mono text-[10px] text-faint">{post.readTime}</span>
            </div>
            <h3 className="mt-3 font-display text-sm font-bold leading-5 text-ink transition-colors group-hover:text-green">{post.title}</h3>
            <p className="mt-1.5 flex-1 text-xs leading-5 text-mutedink line-clamp-2">{post.excerpt}</p>
            <p className="mt-3 font-mono text-[10px] text-faint">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
