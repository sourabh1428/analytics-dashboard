import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ArrowRight, TrendingUp, Users, AlertTriangle, Activity, RefreshCw, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Retention Analytics – Track Refills, Recovery & Inactive Patients | EasiBill",
  description: "See exactly how many reminders you sent, how many refills you recovered, and which patients have gone inactive. Data every pharmacy owner needs.",
  alternates: { canonical: "https://easibill.com/features/retention-analytics" },
};

const bars = [60, 75, 55, 80, 70, 90, 85];
const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function RetentionAnalyticsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700 mb-6">
                <BarChart3 className="h-3 w-3" /> Retention Analytics
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Know exactly which patients you're{" "}
                <span className="text-pink-600">keeping and losing</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                EasiBill tracks every reminder sent, every refill recovered, and every patient who went silent — so you can make decisions based on data, not gut feel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://dashboard.easibill.com/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual: analytics dashboard mockup */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-xs">Retention Dashboard</p>
                    <p className="text-white font-semibold text-sm mt-0.5">June 2026</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full font-semibold">↑ 12% vs last month</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { label: "Reminders sent", val: "1,240", color: "text-blue-300" },
                    { label: "Refills recovered", val: "347", color: "text-green-300" },
                    { label: "Inactive patients", val: "89", color: "text-red-300" },
                    { label: "Recovery rate", val: "28%", color: "text-amber-300" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/10 rounded-xl p-3">
                      <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                      <p className="text-white/40 text-[10px] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-medium text-gray-500 mb-3">Refill rate — last 7 months</p>
                <div className="flex items-end gap-2 h-20">
                  {bars.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-pink-500/80"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[9px] text-gray-400">{months[i]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-gray-500">Inactive patients (90+ days)</p>
                  {[
                    { name: "Ravi Shankar", drug: "Amlodipine", days: 112 },
                    { name: "Priya Nair", drug: "Metformin", days: 98 },
                    { name: "Suresh Pillai", drug: "Losartan", days: 91 },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-xs font-medium text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.drug}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-red-600">{p.days}d inactive</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics explained */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">The metrics that actually matter</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Most pharmacy owners track only daily revenue. EasiBill shows you the numbers that predict future revenue.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: "Refill rate", body: "What percentage of patients who were due actually refilled. The single best measure of your retention programme." },
              { icon: RefreshCw, title: "Recovered refills", body: "Refills that came in within 7 days of a reminder. This is revenue that would have gone to a competitor." },
              { icon: AlertTriangle, title: "Inactive patients", body: "Patients who haven't refilled in 90+ days. These are your reactivation targets for broadcast campaigns." },
              { icon: Users, title: "Patient lifetime value", body: "Average total spend per patient over 12 months. Knowing this tells you how much each new patient is worth." },
              { icon: TrendingUp, title: "Month-over-month trend", body: "Is retention improving or declining? Trend matters more than any single month's number." },
              { icon: DollarSign, title: "Revenue from reminders", body: "Total revenue from patients who were reminded. Proves the ROI of running EasiBill." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <Icon className="h-6 w-6 text-pink-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Start measuring what matters</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Analytics are included in every EasiBill plan. No setup required.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-500 transition-colors">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
