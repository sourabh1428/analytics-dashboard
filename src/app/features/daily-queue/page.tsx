import type { Metadata } from "next";
import Link from "next/link";
import { List, ArrowRight, CheckCircle, AlertCircle, Clock, RefreshCw, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Daily Queue – Who's Due or Overdue Today | Ferbz",
  description: "Start every morning knowing exactly which customers are due for a follow-up today. Ferbz's daily queue organises your workload automatically.",
  alternates: { canonical: "https://ferbz.com/features/daily-queue" },
};

const queue = [
  { name: "Anjali Mehta", item: "Monthly service", status: "due-today", phone: "+91 98201 xxxxx", days: 0 },
  { name: "Ravi Shankar", item: "Repeat order", status: "overdue", phone: "+91 97303 xxxxx", days: -12 },
  { name: "Kavitha Reddy", item: "Quarterly checkup", status: "due-today", phone: "+91 91234 xxxxx", days: 0 },
  { name: "Mohan Lal", item: "Follow-up visit", status: "overdue", phone: "+91 99001 xxxxx", days: -5 },
  { name: "Sunita Gupta", item: "Monthly service", status: "recently-followed-up", phone: "+91 98765 xxxxx", days: 3 },
  { name: "Deepak Joshi", item: "Repeat order", status: "recently-followed-up", phone: "+91 93020 xxxxx", days: 2 },
];

export default function DailyQueuePage() {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="border-b border-ink px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 border border-ink px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-green">
                <List className="h-3 w-3" /> Daily Queue
              </span>
              <h1 className="mb-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[-0.018em] text-ink md:text-5xl">
                Open your business knowing{" "}
                <span className="text-green">exactly who needs a call</span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-mutedink">
                Every morning, Ferbz shows you who is due today, who is overdue, and who just followed up. Your team works the list — no manual checking required.
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

            {/* Visual: daily queue mockup */}
            <div className="border border-ink bg-paper-white shadow-[8px_8px_0_#17150F]">
              <div className="bg-ink px-5 py-4">
                <p className="font-mono text-xs text-paper/50">Good morning, Dr. Verma</p>
                <p className="mt-0.5 text-sm font-semibold text-paper">{today}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: "Due today", count: 2 },
                    { label: "Overdue", count: 2 },
                    { label: "Followed up", count: 2 },
                  ].map((s) => (
                    <div key={s.label} className="border border-paper/15 p-2 text-center">
                      <p className="font-display text-lg font-extrabold text-paper">{s.count}</p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-paper/40">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-ink/10">
                {queue.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-paper-alt">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      p.status === "overdue" ? "border-rust/40 bg-rust/10" :
                      p.status === "due-today" ? "border-green/40 bg-green-pale" :
                      "border-ink/20 bg-paper-alt"
                    }`}>
                      {p.status === "overdue" ? <AlertCircle className="h-4 w-4 text-rust" /> :
                       p.status === "due-today" ? <Clock className="h-4 w-4 text-green" /> :
                       <CheckCircle className="h-4 w-4 text-mutedink" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                      <p className="truncate font-mono text-xs text-faint">{p.item}</p>
                    </div>
                    <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                      p.status === "overdue" ? "border-rust/50 text-rust" :
                      p.status === "due-today" ? "border-green/50 text-green" :
                      "border-ink/30 text-mutedink"
                    }`}>
                      {p.status === "overdue" ? `${Math.abs(p.days)}d overdue` :
                       p.status === "due-today" ? "Due today" :
                       `Followed up ${p.days}d ago`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How queue is built */}
      <section className="border-b border-ink bg-paper-alt px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">How the queue is built</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: RefreshCw, title: "Rebuilt nightly", body: "The queue recalculates at midnight based on every customer's interval and last follow-up date." },
              { icon: Bell, title: "WhatsApp sends first", body: "Reminders go out automatically. The queue shows who has and hasn't responded." },
              { icon: AlertCircle, title: "Overdue flagged prominently", body: "Customers who missed their window appear at the top so your staff can follow up by phone." },
              { icon: CheckCircle, title: "Followed-up customers archived", body: "Once served, a customer moves to the 'recently followed up' section and off your to-do list." },
              { icon: Clock, title: "Time-sensitive ordering", body: "Customers are sorted by urgency — most overdue first, due-today next, upcoming after." },
              { icon: List, title: "One view for the whole team", body: "Every staff member sees the same queue on any device — no coordination needed." },
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
        <h2 className="mb-4 font-display text-3xl font-extrabold uppercase tracking-[-0.018em] text-paper">Start every day with a clear plan</h2>
        <p className="mx-auto mb-8 max-w-md text-paper/60">No more guessing who needs to be called. Set up your queue in 5 minutes.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 bg-green px-8 py-4 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-green-bright hover:text-ink">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
