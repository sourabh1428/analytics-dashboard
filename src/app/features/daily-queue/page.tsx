import type { Metadata } from "next";
import Link from "next/link";
import { List, ArrowRight, CheckCircle, AlertCircle, Clock, RefreshCw, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Daily Queue – Who's Due, Overdue, or Recently Refilled | EasiBill",
  description: "Start every morning knowing exactly which patients are due for a refill today. EasiBill's daily queue organises your workload automatically.",
  alternates: { canonical: "https://easibill.com/features/daily-queue" },
};

const queue = [
  { name: "Anjali Mehta", drug: "Metformin 500mg", status: "due-today", phone: "+91 98201 xxxxx", days: 0 },
  { name: "Ravi Shankar", drug: "Amlodipine 5mg", status: "overdue", phone: "+91 97303 xxxxx", days: -12 },
  { name: "Kavitha Reddy", drug: "Glimepiride 2mg", status: "due-today", phone: "+91 91234 xxxxx", days: 0 },
  { name: "Mohan Lal", drug: "Telmisartan 40mg", status: "overdue", phone: "+91 99001 xxxxx", days: -5 },
  { name: "Sunita Gupta", drug: "Pantoprazole 40mg", status: "recently-refilled", phone: "+91 98765 xxxxx", days: 3 },
  { name: "Deepak Joshi", drug: "Atorvastatin 20mg", status: "recently-refilled", phone: "+91 93020 xxxxx", days: 2 },
];

export default function DailyQueuePage() {
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 mb-6">
                <List className="h-3 w-3" /> Daily Queue
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Open your pharmacy knowing{" "}
                <span className="text-amber-600">exactly who needs a call</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every morning, EasiBill shows you who is due today, who is overdue, and who just refilled. Your team works the list — no manual checking required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://dashboard.easibill.com/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual: daily queue mockup */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 px-5 py-4">
                <p className="text-white/50 text-xs">Good morning, Dr. Verma</p>
                <p className="text-white font-semibold text-sm mt-0.5">{today}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: "Due today", count: 2, color: "bg-amber-500" },
                    { label: "Overdue", count: 2, color: "bg-red-500" },
                    { label: "Refilled", count: 2, color: "bg-green-500" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/10 rounded-xl p-2 text-center">
                      <p className={`text-lg font-bold text-white`}>{s.count}</p>
                      <p className="text-white/40 text-[9px] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {queue.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      p.status === "overdue" ? "bg-red-100" :
                      p.status === "due-today" ? "bg-amber-100" :
                      "bg-green-100"
                    }`}>
                      {p.status === "overdue" ? <AlertCircle className="h-4 w-4 text-red-500" /> :
                       p.status === "due-today" ? <Clock className="h-4 w-4 text-amber-500" /> :
                       <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.drug}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.status === "overdue" ? "bg-red-100 text-red-600" :
                      p.status === "due-today" ? "bg-amber-100 text-amber-600" :
                      "bg-green-100 text-green-600"
                    }`}>
                      {p.status === "overdue" ? `${Math.abs(p.days)}d overdue` :
                       p.status === "due-today" ? "Due today" :
                       `Refilled ${p.days}d ago`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How queue is built */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">How the queue is built</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: RefreshCw, title: "Rebuilt nightly", body: "The queue recalculates at midnight based on every patient's interval and last refill date." },
              { icon: Bell, title: "WhatsApp sends first", body: "Reminders go out automatically. The queue shows who has and hasn't responded." },
              { icon: AlertCircle, title: "Overdue flagged prominently", body: "Patients who missed their window appear at the top in red so your staff can follow up by phone." },
              { icon: CheckCircle, title: "Refilled patients archived", body: "Once dispensed, a patient moves to the 'recently refilled' section and off your to-do list." },
              { icon: Clock, title: "Time-sensitive ordering", body: "Patients are sorted by urgency — most overdue first, due-today next, upcoming after." },
              { icon: List, title: "One view for the whole team", body: "Every staff member sees the same queue on any device — no coordination needed." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <Icon className="h-6 w-6 text-amber-500 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Start every day with a clear plan</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">No more guessing who needs to be called. Set up your queue in 5 minutes.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-400 transition-colors">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
