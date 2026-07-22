import type { Metadata } from "next";
import Link from "next/link";
import { Bell, CheckCircle, Clock, MessageCircle, ArrowRight, Users, TrendingUp, RefreshCw } from "lucide-react";

const title = "Follow-up Reminders – Automatic WhatsApp Follow-ups | Ferbz";
const description =
  "Automatically remind customers when it's time for their next refill, appointment, treatment, or repeat purchase.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: "https://ferbz.com/features/follow-up-reminders", siteName: "Ferbz", type: "website" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://ferbz.com/features/follow-up-reminders" },
};

const steps = [
  { step: "1", title: "Log the visit", body: "When you serve a customer, record their name, item or service, and interval — takes 10 seconds." },
  { step: "2", title: "Ferbz tracks the due date", body: "The system calculates when the customer is likely due back based on the interval you set." },
  { step: "3", title: "WhatsApp reminder fires automatically", body: "3 days before the due date, the customer gets a friendly message. No manual work from you." },
  { step: "4", title: "Customer walks in (or calls)", body: "Recovered visits show up in your analytics so you can see exactly how much revenue reminders brought back." },
];

const faqs = [
  { q: "Do customers need to install any app?", a: "No. Reminders go to their regular WhatsApp number — nothing to download." },
  { q: "What if the interval varies customer to customer?", a: "You set the interval per customer. A monthly subscriber gets a different cadence than someone due for a quarterly service." },
  { q: "Can I customise the message text?", a: "Yes. Edit the template from your dashboard. The customer name and item are inserted automatically." },
  { q: "What if a customer doesn't want reminders?", a: "They can reply STOP at any time and are immediately removed from the queue." },
];

export default function FollowUpRemindersPage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="border-b border-ink px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 border border-ink px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-green">
                <Bell className="h-3 w-3" /> Follow-up Reminders
              </span>
              <h1 className="mb-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[-0.018em] text-ink md:text-5xl">
                Customers who forget to come back are just{" "}
                <span className="text-green">one message away</span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-mutedink">
                Ferbz tracks every customer's next-due date and sends an automatic WhatsApp reminder before they forget — without you lifting a finger.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="https://dashboard.ferbz.com/"
                  className="inline-flex items-center justify-center gap-2 bg-green px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-ink"
                >
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual mockup */}
            <div className="relative">
              <div className="mx-auto max-w-sm border border-ink bg-ink p-6 shadow-[8px_8px_0_#17150F]">
                <div className="mb-4 flex items-center gap-3 border-b border-paper/10 pb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green">
                    <MessageCircle className="h-5 w-5 text-paper" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-paper">WhatsApp · Ferbz</p>
                    <p className="font-mono text-xs text-paper/40">Follow-up Reminders</p>
                  </div>
                </div>
                {[
                  { name: "Ramesh Kumar", item: "Monthly service", days: 3, status: "sent" },
                  { name: "Sunita Sharma", item: "Repeat order", days: 1, status: "replied" },
                  { name: "Mohan Das", item: "Quarterly checkup", days: 5, status: "pending" },
                  { name: "Priya Nair", item: "Follow-up visit", days: 0, status: "overdue" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-paper/5 py-3 last:border-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/20 font-mono text-xs font-bold text-green-bright">
                      {p.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-paper">{p.name}</p>
                      <p className="truncate font-mono text-[10px] text-paper/40">{p.item}</p>
                    </div>
                    <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                      p.status === "sent" ? "border-paper/20 text-paper/60" :
                      p.status === "replied" ? "border-green-bright/40 text-green-bright" :
                      p.status === "overdue" ? "border-rust/50 text-rust" :
                      "border-paper/10 text-paper/40"
                    }`}>
                      {p.status === "sent" ? `Sent · ${p.days}d` : p.status === "replied" ? "Confirmed" : p.status === "overdue" ? "Overdue" : `Due in ${p.days}d`}
                    </span>
                  </div>
                ))}
                <div className="mt-4 border border-green-bright/30 bg-green/10 p-3">
                  <p className="font-mono text-xs uppercase tracking-[0.08em] text-green-bright">Today's reminder queue</p>
                  <p className="mt-1 text-lg font-bold text-paper">12 messages</p>
                  <p className="font-mono text-xs text-paper/40">Sending automatically at 10:00 AM</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 border border-ink bg-green px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-paper shadow-[4px_4px_0_#17150F]">
                ₹4,200 recovered this week
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink bg-ink px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">
          {[
            { value: "67%", label: "of missed follow-ups recovered with reminders" },
            { value: "90%+", label: "WhatsApp open rate vs 22% for SMS" },
            { value: "3 min", label: "to set up your first reminder template" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-extrabold text-paper">{s.value}</p>
              <p className="mt-2 font-mono text-sm uppercase tracking-[0.06em] text-green-bright">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-ink px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center font-display text-3xl font-extrabold uppercase tracking-[-0.018em] text-ink">How follow-up reminders work</h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink bg-green-pale font-mono font-bold text-green">
                  {s.step}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="text-mutedink">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-b border-ink bg-paper-alt px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">Everything included</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Clock, title: "Custom intervals", body: "Set per-customer reminder windows — 7, 14, 30, or 90 days — for medication refills, follow-up appointments, repeat treatments, or restocking a regular order." },
              { icon: MessageCircle, title: "WhatsApp delivery", body: "Reaches customers on the app they already use every day." },
              { icon: CheckCircle, title: "Opt-out handling", body: "Customers who reply STOP are removed instantly." },
              { icon: Users, title: "Bulk import", body: "Upload your existing customer list via CSV to get started." },
              { icon: TrendingUp, title: "Recovery tracking", body: "See exactly how many follow-ups each reminder campaign recovered." },
              { icon: RefreshCw, title: "Recurring schedules", body: "Once set up, reminders repeat every cycle automatically." },
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

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">Common questions</h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-ink/20 pb-6">
                <h3 className="mb-2 font-semibold text-ink">{f.q}</h3>
                <p className="text-sm text-mutedink">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink px-6 py-20 text-center">
        <h2 className="mb-4 font-display text-3xl font-extrabold uppercase tracking-[-0.018em] text-paper">Ready to stop losing follow-ups?</h2>
        <p className="mx-auto mb-8 max-w-md text-paper/60">Set up your first follow-up reminder in under 5 minutes. Free to start.</p>
        <Link href="https://dashboard.ferbz.com/" className="inline-flex items-center gap-2 bg-green px-8 py-4 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-green-bright hover:text-ink">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
