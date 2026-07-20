import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ArrowRight, TrendingUp, Users, AlertTriangle, Activity, RefreshCw, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Retention Analytics – Follow-ups & Recovery | EasiBill",
  description: "See exactly how many reminders you sent, how many follow-ups you recovered, and which customers have gone inactive. Data every local business owner needs.",
  alternates: { canonical: "https://easibill.com/features/retention-analytics" },
};

const bars = [60, 75, 55, 80, 70, 90, 85];
const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function RetentionAnalyticsPage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="border-b border-ink px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 border border-ink px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-green">
                <BarChart3 className="h-3 w-3" /> Retention Analytics
              </span>
              <h1 className="mb-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[-0.018em] text-ink md:text-5xl">
                Know exactly which customers you're{" "}
                <span className="text-green">keeping and losing</span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-mutedink">
                EasiBill tracks every reminder sent, every follow-up recovered, and every customer who went silent — so you can make decisions based on data, not gut feel.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="https://dashboard.easibill.com/" className="inline-flex items-center justify-center gap-2 bg-green px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-ink">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual: analytics dashboard mockup */}
            <div className="border border-ink bg-paper-white shadow-[8px_8px_0_#17150F]">
              <div className="bg-ink px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-paper/50">Retention Dashboard</p>
                    <p className="mt-0.5 text-sm font-semibold text-paper">June 2026</p>
                  </div>
                  <span className="border border-green-bright/40 px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.04em] text-green-bright">↑ 12% vs last month</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { label: "Reminders sent", val: "1,240" },
                    { label: "Follow-ups recovered", val: "347" },
                    { label: "Inactive customers", val: "89" },
                    { label: "Recovery rate", val: "28%" },
                  ].map((s) => (
                    <div key={s.label} className="border border-paper/15 p-3">
                      <p className="font-display text-lg font-extrabold text-paper">{s.val}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-paper/40">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.06em] text-mutedink">Follow-up rate — last 7 months</p>
                <div className="flex h-20 items-end gap-2">
                  {bars.map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full bg-green"
                        style={{ height: `${h}%` }}
                      />
                      <span className="font-mono text-[9px] text-faint">{months[i]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.06em] text-mutedink">Inactive customers (90+ days)</p>
                  {[
                    { name: "Ravi Shankar", item: "Monthly service", days: 112 },
                    { name: "Priya Nair", item: "Repeat order", days: 98 },
                    { name: "Suresh Pillai", item: "Follow-up visit", days: 91 },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between border border-rust/30 bg-rust/10 px-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-ink">{p.name}</p>
                        <p className="font-mono text-[10px] text-faint">{p.item}</p>
                      </div>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.04em] text-rust">{p.days}d inactive</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics explained */}
      <section className="border-b border-ink bg-paper-alt px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">The metrics that actually matter</h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-mutedink">Most business owners track only daily revenue. EasiBill shows you the numbers that predict future revenue.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Activity, title: "Follow-up rate", body: "What percentage of customers who were due actually came back. The single best measure of your retention programme." },
              { icon: RefreshCw, title: "Recovered follow-ups", body: "Follow-ups that came in within 7 days of a reminder. This is revenue that would have gone to a competitor." },
              { icon: AlertTriangle, title: "Inactive customers", body: "Customers who haven't come back in 90+ days. These are your reactivation targets for broadcast campaigns." },
              { icon: Users, title: "Customer lifetime value", body: "Average total spend per customer over 12 months. Knowing this tells you how much each new customer is worth." },
              { icon: TrendingUp, title: "Month-over-month trend", body: "Is retention improving or declining? Trend matters more than any single month's number." },
              { icon: DollarSign, title: "Revenue from reminders", body: "Total revenue from customers who were reminded. Proves the ROI of running EasiBill." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-ink bg-paper-white p-6 shadow-[6px_6px_0_#17150F]">
                <Icon className="mb-4 h-6 w-6 text-green" />
                <h3 className="mb-2 font-semibold text-ink">{title}</h3>
                <p className="text-sm text-mutedink">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink px-6 py-20 text-center">
        <h2 className="mb-4 font-display text-3xl font-extrabold uppercase tracking-[-0.018em] text-paper">Start measuring what matters</h2>
        <p className="mx-auto mb-8 max-w-md text-paper/60">Analytics are included in every EasiBill plan. No setup required.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 bg-green px-8 py-4 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-green-bright hover:text-ink">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
