import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, User, Phone, Pill, Calendar, Search, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Records – Item, Interval & Contact | EasiBill",
  description: "Store every customer's item, follow-up interval, and WhatsApp number in one place. EasiBill makes customer records simple for local businesses.",
  alternates: { canonical: "https://easibill.com/features/patient-records" },
};

const customers = [
  { name: "Anjali Mehta", age: 58, item: "Monthly service", interval: "30 days", phone: "+91 98201 xxxxx", lastVisit: "Jun 1", nextDue: "Jul 1", status: "on-track" },
  { name: "Ravi Shankar", age: 65, item: "Repeat order", interval: "30 days", phone: "+91 97303 xxxxx", lastVisit: "May 18", nextDue: "Jun 17", status: "overdue" },
  { name: "Deepa Iyer", age: 44, item: "Quarterly checkup", interval: "90 days", phone: "+91 96112 xxxxx", lastVisit: "Apr 5", nextDue: "Jul 4", status: "on-track" },
  { name: "Suresh Pillai", age: 71, item: "Follow-up visit", interval: "30 days", phone: "+91 99820 xxxxx", lastVisit: "Jun 12", nextDue: "Jul 12", status: "upcoming" },
];

export default function CustomerRecordsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-6">
                <FileText className="h-3 w-3" /> Customer Records
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Every customer's history,{" "}
                <span className="text-blue-600">always at your fingertips</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop searching through paper registers. EasiBill stores each customer's items, purchases, follow-up intervals, and WhatsApp number — searchable in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://dashboard.easibill.com/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual: customer table mockup */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg px-3 py-1 flex items-center gap-2 border border-gray-100">
                  <Search className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Search customers…</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {customers.map((p) => (
                  <div key={p.name} className="rounded-xl border border-gray-100 p-4 hover:border-blue-100 hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.age} yrs · {p.phone}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === "overdue" ? "bg-red-100 text-red-600" :
                        p.status === "upcoming" ? "bg-amber-100 text-amber-600" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {p.status === "overdue" ? "Overdue" : p.status === "upcoming" ? "Due soon" : "On track"}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                      <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                        <p className="text-gray-400">Item</p>
                        <p className="font-medium text-slate-700 truncate">{p.item}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                        <p className="text-gray-400">Interval</p>
                        <p className="font-medium text-slate-700">{p.interval}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                        <p className="text-gray-400">Next due</p>
                        <p className="font-medium text-slate-700">{p.nextDue}</p>
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
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">What's stored for each customer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: User, title: "Name & contact", body: "Full name and WhatsApp number — used for reminders and billing." },
              { icon: Pill, title: "Item & details", body: "Exact item name and specification. Multiple items per customer." },
              { icon: Calendar, title: "Follow-up interval", body: "Per-customer interval drives the reminder schedule automatically." },
              { icon: FileText, title: "Purchase history", body: "Every transaction logged with date and quantity." },
              { icon: Search, title: "Instant search", body: "Find any customer by name or phone number in under a second." },
              { icon: Shield, title: "Data stays private", body: "Customer data is encrypted and never shared with third parties." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <Icon className="h-6 w-6 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Replace the paper register today</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Import your existing customer list or start fresh — set up takes under 5 minutes.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
