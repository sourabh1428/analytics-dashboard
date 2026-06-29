import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About EasiBill – Pharmacy Retention Software",
  description: "EasiBill was built to help independent pharmacy owners stop losing patients to forgetfulness. Learn our story, mission, and the team behind the product.",
  alternates: { canonical: "https://easibill.com/about" },
};

const values = [
  {
    title: "Pharmacists first",
    body: "Every feature is tested against the real daily workflow of a busy pharmacy counter — not a product manager's spreadsheet.",
  },
  {
    title: "Simple by design",
    body: "A pharmacy assistant should be able to send reminders without training. If it needs a manual, we redesign it.",
  },
  {
    title: "Privacy by default",
    body: "Patient data stays yours. We encrypt it, never sell it, and delete it the moment you leave.",
  },
  {
    title: "Built to last",
    body: "Pharmacies run for decades. We build infrastructure that works reliably at 6 AM every morning, not just on demo day.",
  },
];

const stats = [
  { value: "2,400+", label: "Pharmacies served" },
  { value: "18 M+", label: "Reminders sent" },
  { value: "94 %", label: "Refill recovery rate" },
  { value: "4 countries", label: "India · UAE · Kenya · UK" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Our story</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
        Built for the pharmacy at the corner of every neighbourhood
      </h1>
      <p className="mt-6 max-w-2xl leading-7 text-white/70">
        EasiBill started in 2023 when our founder watched a family member with diabetes miss three consecutive refills because the pharmacy they trusted had no way to follow up. The pharmacist cared — she just had no tool.
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-white/70">
        We set out to fix that with the simplest possible stack: WhatsApp (which every patient already uses), a lightweight patient record system, and automated daily queues. No complicated ERP. No six-week onboarding. Just reminders that actually get sent.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <p className="text-3xl font-bold text-violet-400">{s.value}</p>
            <p className="mt-1 text-sm text-white/50">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-bold text-white">What we believe</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <h3 className="font-semibold text-white">{v.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{v.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-bold text-white">Where we are headed</h2>
      <p className="mt-4 max-w-2xl leading-7 text-white/70">
        EasiBill is expanding its reminders engine to support regional languages, adding an integrated billing module, and building a network analytics layer so pharmacy chains can see patient retention across all locations in one view.
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-white/70">
        We are a small, focused team. If you want to see a feature, tell us — most of our best ideas have come from pharmacists who emailed support@easibill.com at 7 AM before their counter opened.
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
        >
          Talk to us
        </Link>
        <a
          href="https://dashboard.easibill.com/"
          className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
        >
          Try EasiBill free
        </a>
      </div>
    </div>
  );
}
