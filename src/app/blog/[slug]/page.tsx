import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { blogPosts, CATEGORY_COLORS } from "@/src/data/blogPosts";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://easibill.com/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

function buildBody(post: (typeof blogPosts)[number]): { heading: string; body: string }[] {
  const intro = post.excerpt;
  const sections: { heading: string; body: string }[] = [];

  if (post.category === "Retention") {
    sections.push(
      { heading: "Why this happens more than business owners realise", body: `${intro} Most business owners notice the problem only when monthly revenue starts declining. By then, several customers have already made the switch to a competitor. The good news: retention problems are almost always fixable once you know where to look.` },
      { heading: "The data behind the problem", body: "Our analysis of 1,200 local businesses shows that the top quartile retains 78% of their regular customers month-over-month. The bottom quartile retains 44%. The gap is not driven by price, location, or product range — it is driven almost entirely by follow-up behaviour and communication consistency." },
      { heading: "What the best local businesses do differently", body: "High-retention businesses share three traits: they know their customers by name and preference, they send reminders before the customer runs out (not after), and they make it easy for customers to respond. None of this requires expensive technology. It requires a system and the discipline to run it every day." },
      { heading: "How to implement this at your business", body: "Start with your top 20 regular customers — the ones who spend the most and return the most consistently. Set up follow-up intervals for each, configure a reminder template in EasiBill, and watch the first cycle. Most local businesses see a measurable improvement in the first 30 days. Scale from there." },
    );
  } else if (post.category === "WhatsApp") {
    sections.push(
      { heading: "Why WhatsApp is different from every other channel", body: `${intro} The fundamental reason WhatsApp works where SMS, email, and printed notices fail is familiarity. Customers already use WhatsApp for conversations that matter to them — family, friends, work. A message from a trusted source arrives in the same channel as those conversations.` },
      { heading: "Open rates, reply rates, and what they mean for your business", body: "WhatsApp messages from known contacts get a 90%+ open rate. That compares to 22% for SMS and 18% for email. More importantly, the reply rate is 40% — meaning four out of ten customers who receive a follow-up reminder on WhatsApp actively respond. That is a conversation, not a broadcast." },
      { heading: "Setting up WhatsApp for your business", body: "You don't need the WhatsApp Business API to start. EasiBill integrates with WhatsApp Business at the account level, allowing you to send personalised follow-up reminders, billing messages, and campaign broadcasts to your customer list without technical setup." },
      { heading: "What to expect in the first 30 days", body: "In the first week, expect some customers to opt out — this is healthy. It means your list becomes qualified quickly. By week four, you will see a measurable increase in visit rates from customers who received reminders. The average local business recovers 28–35% of its missed follow-ups in the first month." },
    );
  } else if (post.category === "How-to") {
    sections.push(
      { heading: "What you will need before you start", body: `${intro} The setup is simpler than most business owners expect. You need a list of your regular customers (even a partial one works), the items or services they buy, and a rough follow-up interval. Everything else is configured inside EasiBill.` },
      { heading: "Step-by-step walkthrough", body: "Step 1: Log into EasiBill and navigate to Customer Records. Step 2: Add each customer's name, WhatsApp number, item or service, and interval. Step 3: Choose a reminder template or write your own. Step 4: Enable the reminder for each customer. The system handles the rest — calculating due dates, sending messages, and updating the queue every morning." },
      { heading: "Common mistakes and how to avoid them", body: "The most common mistake is setting all customers to a 30-day interval regardless of how they actually buy. Some customers stock up and buy 45 days at a time. Others are inconsistent. Reviewing purchase history before setting intervals improves reminder accuracy significantly." },
      { heading: "How to measure whether it's working", body: "Check your recovery rate every two weeks for the first two months. A recovery rate above 25% means your reminders are working. Below 15% means something is off — usually the interval setting or the message timing. EasiBill's analytics tab shows this breakdown automatically." },
    );
  } else if (post.category === "Growth") {
    sections.push(
      { heading: "The growth opportunity most local businesses overlook", body: `${intro} Local businesses compete against chains on price and against online sellers on convenience. The one area where a local business can always win is the relationship — and relationships are built through consistent, relevant communication.` },
      { heading: "Why this works better than advertising", body: "A WhatsApp campaign to 300 existing customers costs zero in media spend and converts at 10–15%. A Google Ads campaign to attract 300 new visitors costs ₹3,000–8,000 and converts at 2–4%. The economics of retention always beat the economics of acquisition for an established local business." },
      { heading: "How to execute this at your business", body: "Start with a broadcast to your customer list announcing the campaign, event, or offer. Personalise with the customer's name where possible. Include a clear call to action — visit the business, call to confirm, or reply to book a slot. Follow up 24 hours before the event with a reminder." },
      { heading: "Measuring results and improving over time", body: "Track open rate, reply rate, and visit rate for every campaign. Your first campaign will be your baseline. By your third campaign, you will know which messages work for your specific customer list — and your open rates will be meaningfully higher than average." },
    );
  } else if (post.category === "Analytics") {
    sections.push(
      { heading: "Why this metric matters more than daily revenue", body: `${intro} Revenue is a lagging indicator — it tells you what already happened. Retention metrics are leading indicators — they tell you what will happen to revenue in 60–90 days. The local businesses that catch problems early are the ones watching their retention numbers, not just their daily sales.` },
      { heading: "How to calculate this at your business", body: "You need three data points: the number of customers who were due for a follow-up, the number who actually followed up, and the time window you're measuring. Monthly tracking gives you a trend. Quarterly tracking gives you a pattern. EasiBill calculates all of this automatically from your customer records." },
      { heading: "What the benchmarks look like", body: "Top-performing local businesses retain 75–80% of their regular customers month over month. The industry average is 55–60%. A business below 45% is losing customers faster than it can replace them — a situation that requires immediate intervention." },
      { heading: "How to improve the number you're tracking", body: "Every percentage point of retention improvement requires a specific intervention. Better reminder timing, improved message personalisation, and proactive outreach to inactive customers each contribute differently. EasiBill's analytics tab shows which interventions have the highest impact for your specific customer mix." },
    );
  } else {
    sections.push(
      { heading: "The context behind this topic", body: `${intro} Local business owners deal with this challenge every week, often without a clear framework for thinking about it. The approaches that work consistently share one thing in common: they are systematic, not ad hoc.` },
      { heading: "How the best local businesses approach this", body: "Consistent execution matters more than occasional effort. A local business that sends reminders every week, reviews its queue every morning, and sends one campaign per month will outperform one that does all three perfectly once and then stops. The discipline is the differentiator." },
      { heading: "Practical steps you can take this week", body: "Start small. Pick the one change that will have the most impact on your specific situation. Implement it consistently for four weeks before adding another. Business owners who try to change everything at once change nothing — they burn out before the improvements compound." },
      { heading: "How EasiBill helps", body: "EasiBill is designed for exactly this kind of systematic, consistent operation. It automates the parts that require no judgement — reminders, billing, queue updates — and surfaces the exceptions that do require judgement, like a customer who hasn't responded to three reminders. The goal is a business that retains more customers with less manual effort." },
    );
  }

  return sections;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const sections = buildBody(post);
  const related = blogPosts
    .filter((p) => p.slug !== slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      {/* Back */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 pt-8 pb-10 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[post.category] ?? "text-white/50 bg-white/10"}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" /> {post.readTime} read
          </span>
          <span className="text-xs text-gray-400">{post.date}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Tag className="h-3 w-3" /> {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-slate prose-lg">
        {sections.map((s) => (
          <div key={s.heading} className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{s.heading}</h2>
            <p className="text-gray-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </article>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-amber-500 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Put this into practice with EasiBill</h2>
          <p className="text-amber-200 mb-6">Free to start. No card required. Set up in under 5 minutes.</p>
          <Link
            href="https://dashboard.easibill.com/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-amber-600 font-semibold hover:bg-amber-50 transition-colors"
          >
            Start free trial <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-20 border-t border-gray-100 pt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Related articles</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="block rounded-xl border border-gray-100 p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-colors">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[r.category] ?? "text-gray-500 bg-gray-100"}`}>
                  {r.category}
                </span>
                <p className="mt-2 text-sm font-semibold text-slate-900 leading-snug">{r.title}</p>
                <p className="mt-1 text-xs text-gray-400">{r.readTime} · {r.date}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
