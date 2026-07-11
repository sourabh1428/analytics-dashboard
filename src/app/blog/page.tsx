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
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Blog</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Business growth, plainly explained</h1>
      <p className="mt-4 text-white/60 max-w-2xl">
        200+ practical articles for local business owners. Retention, WhatsApp billing, compliance, and operations — no fluff.
      </p>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <span
            key={cat}
            className={`rounded-full px-3 py-1 text-xs font-semibold border ${
              cat === "All"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "border-white/10 text-white/50 bg-white/[0.03] hover:border-white/20 hover:text-white/70 cursor-pointer transition-colors"
            }`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Featured posts */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {featured.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition hover:border-amber-500/30 hover:bg-white/[0.05] group"
          >
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[post.category] ?? "text-white/50 bg-white/10"}`}>
                {post.category}
              </span>
              <span className="text-xs text-white/30">{post.readTime}</span>
            </div>
            <h2 className="mt-4 text-base font-semibold leading-6 text-white group-hover:text-amber-300 transition-colors">{post.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-white/50">{post.excerpt}</p>
            <p className="mt-4 text-xs text-white/30">{post.date}</p>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8">
        <h2 className="text-lg font-semibold text-white">Get articles in your inbox</h2>
        <p className="mt-2 text-sm text-white/60">One email per week. Practical retention tips for local businesses. Unsubscribe anytime.</p>
        <div className="mt-5 flex max-w-sm overflow-hidden rounded-full border border-white/[0.1] bg-white/[0.04]">
          <input
            type="email"
            placeholder="your@email.com"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button className="bg-amber-500 px-5 text-sm font-semibold text-white transition hover:bg-amber-400">
            Subscribe
          </button>
        </div>
      </div>

      {/* All posts */}
      <h2 className="mt-16 text-2xl font-bold text-white">All articles</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition hover:border-amber-500/30 hover:bg-white/[0.05] group"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[post.category] ?? "text-white/50 bg-white/10"}`}>
                {post.category}
              </span>
              <span className="text-[10px] text-white/30">{post.readTime}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-5 text-white group-hover:text-amber-300 transition-colors">{post.title}</h3>
            <p className="mt-1.5 flex-1 text-xs leading-5 text-white/40 line-clamp-2">{post.excerpt}</p>
            <p className="mt-3 text-[10px] text-white/25">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
