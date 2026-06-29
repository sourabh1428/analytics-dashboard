import type { Metadata } from "next";
import Link from "next/link";
import { Bell, CheckCircle, Clock, MessageCircle, ArrowRight, Users, TrendingUp, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Refill Reminders – Automatic WhatsApp Follow-ups | EasiBill",
  description: "Stop losing chronic-care patients to forgetfulness. EasiBill sends automatic WhatsApp refill reminders so patients come back before they run out.",
  alternates: { canonical: "https://easibill.com/features/refill-reminders" },
};

const steps = [
  { step: "1", title: "Log the prescription", body: "When you dispense medicine, record the patient name, drug, and interval — takes 10 seconds." },
  { step: "2", title: "EasiBill tracks the due date", body: "The system calculates when the patient is likely to run out based on the interval you set." },
  { step: "3", title: "WhatsApp reminder fires automatically", body: "3 days before the due date, the patient gets a friendly message. No manual work from you." },
  { step: "4", title: "Patient walks in (or calls)", body: "Recovered refills show up in your analytics so you can see exactly how much revenue reminders brought back." },
];

const faqs = [
  { q: "Do patients need to install any app?", a: "No. Reminders go to their regular WhatsApp number — nothing to download." },
  { q: "What if the interval varies patient to patient?", a: "You set the interval per patient. A diabetic on a 30-day supply gets a different cadence than a weekly antibiotic." },
  { q: "Can I customise the message text?", a: "Yes. Edit the template from your dashboard. The patient name and medicine are inserted automatically." },
  { q: "What if a patient doesn't want reminders?", a: "They can reply STOP at any time and are immediately removed from the queue." },
];

export default function RefillRemindersPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600 mb-6">
                <Bell className="h-3 w-3" /> Refill Reminders
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Patients who forget to refill are just{" "}
                <span className="text-amber-500">one message away</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                EasiBill tracks every chronic-care patient's refill date and sends an automatic WhatsApp reminder before they run out — without you lifting a finger.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://dashboard.easibill.com/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
                >
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  Book a demo
                </Link>
              </div>
            </div>

            {/* Visual mockup */}
            <div className="relative">
              <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl max-w-sm mx-auto">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">WhatsApp · EasiBill</p>
                    <p className="text-white/40 text-xs">Pharmacy Refill Reminders</p>
                  </div>
                </div>
                {[
                  { name: "Ramesh Kumar", drug: "Metformin 500mg", days: 3, status: "sent" },
                  { name: "Sunita Sharma", drug: "Amlodipine 5mg", days: 1, status: "replied" },
                  { name: "Mohan Das", drug: "Atorvastatin 10mg", days: 5, status: "pending" },
                  { name: "Priya Nair", drug: "Losartan 50mg", days: 0, status: "overdue" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                    <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
                      {p.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{p.name}</p>
                      <p className="text-white/40 text-[10px] truncate">{p.drug}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.status === "sent" ? "bg-blue-500/20 text-blue-300" :
                      p.status === "replied" ? "bg-green-500/20 text-green-300" :
                      p.status === "overdue" ? "bg-red-500/20 text-red-300" :
                      "bg-white/10 text-white/50"
                    }`}>
                      {p.status === "sent" ? `Sent · ${p.days}d` : p.status === "replied" ? "Confirmed" : p.status === "overdue" ? "Overdue" : `Due in ${p.days}d`}
                    </span>
                  </div>
                ))}
                <div className="mt-4 rounded-xl bg-amber-500/20 border border-amber-500/30 p-3">
                  <p className="text-amber-300 text-xs font-semibold">Today's reminder queue</p>
                  <p className="text-white text-lg font-bold mt-1">12 messages</p>
                  <p className="text-white/40 text-xs">Sending automatically at 10:00 AM</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ₹4,200 recovered this week
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-amber-500">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { value: "67%", label: "of missed refills recovered with reminders" },
            { value: "90%+", label: "WhatsApp open rate vs 22% for SMS" },
            { value: "3 min", label: "to set up your first reminder template" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-white">{s.value}</p>
              <p className="text-amber-200 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">How refill reminders work</h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Everything included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Custom intervals", body: "Set per-patient refill windows — 7, 14, 30, or 90 days." },
              { icon: MessageCircle, title: "WhatsApp delivery", body: "Reaches patients on the app they already use every day." },
              { icon: CheckCircle, title: "Opt-out handling", body: "Patients who reply STOP are removed instantly." },
              { icon: Users, title: "Bulk import", body: "Upload your existing patient list via CSV to get started." },
              { icon: TrendingUp, title: "Recovery tracking", body: "See exactly how many refills each reminder campaign recovered." },
              { icon: RefreshCw, title: "Recurring schedules", body: "Once set up, reminders repeat every cycle automatically." },
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

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Common questions</h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-gray-600 text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to stop losing refills?</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Set up your first refill reminder in under 5 minutes. Free to start.</p>
        <Link href="https://dashboard.easibill.com/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-500 transition-colors">
          Start free — no card needed <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
