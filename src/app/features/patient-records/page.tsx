import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, User, Phone, Pill, Calendar, Search, Shield } from "lucide-react";

const title = "Customer Records – Item, Interval & Contact | Ferbz";
const description =
  "Store every customer's item, follow-up interval, and WhatsApp number in one place. Ferbz makes customer records simple for local businesses.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: "https://ferbz.com/features/patient-records", siteName: "Ferbz", type: "website" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "https://ferbz.com/features/patient-records" },
};

const customers = [
  { name: "Anjali Mehta", age: 58, item: "Monthly service", interval: "30 days", phone: "+91 98201 xxxxx", lastVisit: "Jun 1", nextDue: "Jul 1", status: "on-track" },
  { name: "Ravi Shankar", age: 65, item: "Repeat order", interval: "30 days", phone: "+91 97303 xxxxx", lastVisit: "May 18", nextDue: "Jun 17", status: "overdue" },
  { name: "Deepa Iyer", age: 44, item: "Quarterly checkup", interval: "90 days", phone: "+91 96112 xxxxx", lastVisit: "Apr 5", nextDue: "Jul 4", status: "on-track" },
  { name: "Suresh Pillai", age: 71, item: "Follow-up visit", interval: "30 days", phone: "+91 99820 xxxxx", lastVisit: "Jun 12", nextDue: "Jul 12", status: "upcoming" },
];

export default function CustomerRecordsPage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="border-b border-ink px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 border border-ink px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-green">
                <FileText className="h-3 w-3" /> Customer Records
              </span>
              <h1 className="mb-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[-0.018em] text-ink md:text-5xl">
                Every customer's history,{" "}
                <span className="text-green">always at your fingertips</span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-mutedink">
                Stop searching through paper registers. Ferbz stores each customer's items, purchases, follow-up intervals, and WhatsApp number — searchable in seconds.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="https://dashboard.ferbz.com/" className="inline-flex items-center justify-center gap-2 bg-green px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-ink">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-ink px-6 py-3 font-mono text-sm uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual: customer table mockup */}
            <div className="border border-ink bg-paper-white shadow-[8px_8px_0_#17150F]">
              <div className="flex items-center gap-3 border-b border-ink bg-paper-alt px-5 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rust" />
                  <div className="h-3 w-3 rounded-full bg-green" />
                  <div className="h-3 w-3 rounded-full bg-ink" />
                </div>
                <div className="flex flex-1 items-center gap-2 border border-ink bg-paper-white px-3 py-1">
                  <Search className="h-3 w-3 text-mutedink" />
                  <span className="font-mono text-xs text-faint">Search customers…</span>
                </div>
              </div>
              <div className="space-y-3 p-4">
                {customers.map((p) => (
                  <div key={p.name} className="cursor-pointer border border-ink/30 p-4 transition-colors hover:border-ink hover:bg-green-pale/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-pale font-mono text-sm font-bold text-green">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{p.name}</p>
                          <p className="font-mono text-xs text-faint">{p.age} yrs · {p.phone}</p>
                        </div>
                      </div>
                      <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                        p.status === "overdue" ? "border-rust/50 text-rust" :
                        p.status === "upcoming" ? "border-ink/40 text-mutedink" :
                        "border-green/50 text-green"
                      }`}>
                        {p.status === "overdue" ? "Overdue" : p.status === "upcoming" ? "Due soon" : "On track"}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                      <div className="border border-ink/20 bg-paper-alt px-2 py-1.5">
                        <p className="font-mono text-faint">Item</p>
                        <p className="truncate font-medium text-ink-soft">{p.item}</p>
                      </div>
                      <div className="border border-ink/20 bg-paper-alt px-2 py-1.5">
                        <p className="font-mono text-faint">Interval</p>
                        <p className="font-medium text-ink-soft">{p.interval}</p>
                      </div>
                      <div className="border border-ink/20 bg-paper-alt px-2 py-1.5">
                        <p className="font-mono text-faint">Next due</p>
                        <p className="font-medium text-ink-soft">{p.nextDue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-ink bg-paper-alt px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-2xl font-extrabold uppercase tracking-[-0.018em] text-ink">What's stored for each customer</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: User, title: "Name & contact", body: "Full name and WhatsApp number — used for reminders and billing." },
              { icon: Pill, title: "Item & details", body: "Exact item name and specification. Multiple items per customer." },
              { icon: Calendar, title: "Follow-up interval", body: "Per-customer interval drives the reminder schedule automatically." },
              { icon: FileText, title: "Purchase history", body: "Every transaction logged with date and quantity." },
              { icon: Search, title: "Instant search", body: "Find any customer by name or phone number in under a second." },
              { icon: Shield, title: "Data stays private", body: "Customer data is encrypted and never shared with third parties." },
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
        <h2 className="mb-4 font-display text-3xl font-extrabold uppercase tracking-[-0.018em] text-paper">Replace the paper register today</h2>
        <p className="mx-auto mb-8 max-w-md text-paper/60">Import your existing customer list or start fresh — set up takes under 5 minutes.</p>
        <Link href="https://dashboard.ferbz.com/" className="inline-flex items-center gap-2 bg-green px-8 py-4 font-mono text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-green-bright hover:text-ink">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
