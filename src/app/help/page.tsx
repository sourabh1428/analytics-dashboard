import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center – EasiBill",
  description: "Setup guides, FAQs, and troubleshooting for EasiBill pharmacy billing, WhatsApp reminders, and patient records.",
  alternates: { canonical: "https://easibill.com/help" },
};

const categories = [
  {
    title: "Getting Started",
    icon: "🚀",
    articles: [
      { title: "Create your EasiBill account", time: "2 min" },
      { title: "Import patients from a CSV or Excel file", time: "4 min" },
      { title: "Connect your WhatsApp Business number", time: "5 min" },
      { title: "Send your first refill reminder", time: "3 min" },
    ],
  },
  {
    title: "Patient Records",
    icon: "👤",
    articles: [
      { title: "Add a patient manually", time: "2 min" },
      { title: "Set refill intervals per medicine", time: "3 min" },
      { title: "Edit or archive a patient", time: "2 min" },
      { title: "Search and filter patient records", time: "2 min" },
    ],
  },
  {
    title: "Refill Reminders",
    icon: "💊",
    articles: [
      { title: "How the daily reminder queue works", time: "3 min" },
      { title: "Customise reminder message templates", time: "4 min" },
      { title: "Handle overdue patients", time: "3 min" },
      { title: "Mark a patient as refilled", time: "1 min" },
    ],
  },
  {
    title: "Broadcast Campaigns",
    icon: "📢",
    articles: [
      { title: "Create a health camp announcement", time: "4 min" },
      { title: "Segment patients by medicine or last visit", time: "5 min" },
      { title: "Schedule a broadcast for later", time: "3 min" },
      { title: "View campaign delivery stats", time: "2 min" },
    ],
  },
  {
    title: "Analytics",
    icon: "📊",
    articles: [
      { title: "Reading your retention dashboard", time: "4 min" },
      { title: "Track recovered refills over time", time: "3 min" },
      { title: "Export reports as CSV", time: "2 min" },
    ],
  },
  {
    title: "Billing & Account",
    icon: "💳",
    articles: [
      { title: "Upgrade from Starter to Growth", time: "2 min" },
      { title: "Update your payment method", time: "2 min" },
      { title: "Download invoices", time: "1 min" },
      { title: "Cancel or pause your subscription", time: "3 min" },
    ],
  },
];

const faqs = [
  {
    q: "Do my patients need to install WhatsApp?",
    a: "Yes — patients need WhatsApp installed on their phone. EasiBill sends messages to the phone number stored in their patient record. If WhatsApp is not installed, the message will not be delivered.",
  },
  {
    q: "Can I use EasiBill without a WhatsApp Business account?",
    a: "You need a WhatsApp Business number to send reminders. EasiBill guides you through connecting one during onboarding — the process takes about 10 minutes.",
  },
  {
    q: "Is patient data stored securely?",
    a: "All patient records are encrypted at rest (AES-256) and in transit (TLS 1.3). We never share patient data with third parties. See our Privacy Policy for full details.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export all your data at any time from the dashboard. After cancellation, your data is retained for 14 days so you can complete your export, then permanently deleted.",
  },
  {
    q: "Can multiple staff members use one account?",
    a: "Yes. Growth plan accounts support up to 5 users with role-based access. Enterprise plans support unlimited users.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Help Center</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">How can we help?</h1>
      <p className="mt-4 text-white/60">
        Guides and answers for setting up reminders, billing, and patient records.
      </p>

      <div className="mt-4 flex gap-3">
        <Link
          href="/contact"
          className="text-sm font-semibold text-violet-400 hover:text-violet-300"
        >
          Can't find your answer? Contact support →
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <div className="text-2xl">{cat.icon}</div>
            <h2 className="mt-3 font-semibold text-white">{cat.title}</h2>
            <ul className="mt-4 space-y-3">
              {cat.articles.map((a) => (
                <li key={a.title} className="flex items-start justify-between gap-2">
                  <span className="text-sm text-white/60 hover:text-violet-400 cursor-pointer">{a.title}</span>
                  <span className="shrink-0 text-xs text-white/30">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-bold text-white">Frequently asked questions</h2>
      <div className="mt-6 space-y-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <h3 className="font-semibold text-white">{f.q}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8 text-center">
        <h3 className="text-lg font-semibold text-white">Still stuck?</h3>
        <p className="mt-2 text-sm text-white/60">Our support team typically responds within 2 hours on business days.</p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="mailto:support@easibill.com"
            className="inline-flex rounded-full bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
          >
            Email support
          </a>
          <a
            href="tel:+918839143395"
            className="inline-flex rounded-full border border-white/[0.1] px-6 py-2.5 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            +91 8839143395
          </a>
        </div>
      </div>
    </div>
  );
}
