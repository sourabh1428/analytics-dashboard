import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog – EasiBill Pharmacy Growth",
  description: "Practical articles on patient retention, WhatsApp billing, and running an independent pharmacy profitably.",
  alternates: { canonical: "https://easibill.com/blog" },
};

const posts = [
  {
    slug: "why-patients-stop-refilling",
    category: "Retention",
    title: "Why Patients Stop Refilling — and the One Message That Brings Them Back",
    excerpt: "Chronic-care patients miss refills for three reasons: they forget, they feel fine, or the refill feels inconvenient. Fixing reason one is the easiest win a pharmacy can make this month.",
    date: "June 18, 2026",
    readTime: "5 min",
  },
  {
    slug: "whatsapp-reminders-vs-sms",
    category: "WhatsApp",
    title: "WhatsApp Reminders vs SMS: Which Gets More Refills Back?",
    excerpt: "SMS open rates sit around 22%. WhatsApp open rates are above 90%. We looked at 6 months of data across 800 pharmacies to see what that difference means in recovered refill revenue.",
    date: "June 10, 2026",
    readTime: "7 min",
  },
  {
    slug: "setting-refill-intervals",
    category: "How-to",
    title: "How to Set Refill Intervals That Actually Match How Patients Buy",
    excerpt: "A 30-day supply does not always last 30 days. Patients skip doses, travel, or stock up. Here's how to calibrate intervals per patient so your reminders arrive at exactly the right moment.",
    date: "May 29, 2026",
    readTime: "4 min",
  },
  {
    slug: "broadcast-campaigns-health-camps",
    category: "Growth",
    title: "How Independent Pharmacies Use Broadcast Campaigns to Fill Health Camps",
    excerpt: "Three pharmacies in our network ran health camps last quarter. Two used WhatsApp broadcasts from EasiBill; one used printed notices. The broadcast pharmacies averaged 4× the attendance.",
    date: "May 20, 2026",
    readTime: "6 min",
  },
  {
    slug: "inactive-patient-reactivation",
    category: "Retention",
    title: "The 3-Message Sequence That Reactivates Inactive Pharmacy Patients",
    excerpt: "A patient who has not refilled in 90 days is not lost — they are dormant. We share the exact three-message sequence our top-performing pharmacies use to bring them back.",
    date: "May 12, 2026",
    readTime: "5 min",
  },
  {
    slug: "pharmacy-retention-metrics",
    category: "Analytics",
    title: "5 Retention Metrics Every Independent Pharmacy Should Track Monthly",
    excerpt: "Most pharmacy owners track sales and stock. Very few track refill rate, reactivation rate, or average patient lifetime value. Here's why those numbers matter more than daily revenue.",
    date: "May 5, 2026",
    readTime: "6 min",
  },
];

const categoryColors: Record<string, string> = {
  Retention: "text-violet-400 bg-violet-400/10",
  WhatsApp: "text-green-400 bg-green-400/10",
  "How-to": "text-blue-400 bg-blue-400/10",
  Growth: "text-amber-400 bg-amber-400/10",
  Analytics: "text-pink-400 bg-pink-400/10",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Blog</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Pharmacy growth, plainly explained</h1>
      <p className="mt-4 text-white/60">
        Practical notes for independent pharmacy owners. No fluff — just things that work at the counter.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition hover:border-white/[0.12] hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[post.category] ?? "text-white/50 bg-white/10"}`}>
                {post.category}
              </span>
              <span className="text-xs text-white/30">{post.readTime}</span>
            </div>
            <h2 className="mt-4 text-base font-semibold leading-6 text-white">{post.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-white/50">{post.excerpt}</p>
            <p className="mt-4 text-xs text-white/30">{post.date}</p>
          </article>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8">
        <h2 className="text-lg font-semibold text-white">Get articles in your inbox</h2>
        <p className="mt-2 text-sm text-white/60">One email per week. Practical retention tips for independent pharmacies. Unsubscribe anytime.</p>
        <div className="mt-5 flex max-w-sm overflow-hidden rounded-full border border-white/[0.1] bg-white/[0.04]">
          <input
            type="email"
            placeholder="your@email.com"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button className="bg-violet-500 px-5 text-sm font-semibold text-white transition hover:bg-violet-400">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
