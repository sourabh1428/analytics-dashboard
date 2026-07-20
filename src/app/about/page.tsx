import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Ferbz – Local Business Retention Software",
  description: "Ferbz was built to help local business owners stop losing customers to forgetfulness. Learn our story, mission, and the team behind the product.",
  alternates: { canonical: "https://ferbz.com/about" },
};

const values = [
  {
    title: "Business owners first",
    body: "Every feature is tested against the real daily workflow of a busy service counter — not a product manager's spreadsheet.",
  },
  {
    title: "Simple by design",
    body: "A staff member should be able to send reminders without training. If it needs a manual, we redesign it.",
  },
  {
    title: "Privacy by default",
    body: "Customer data stays yours. We encrypt it, never sell it, and delete it the moment you leave.",
  },
  {
    title: "Built to last",
    body: "Local businesses run for decades. We build infrastructure that works reliably at 6 AM every morning, not just on demo day.",
  },
];

const stats = [
  { value: "2,400+", label: "Local businesses served" },
  { value: "18 M+", label: "Reminders sent" },
  { value: "94 %", label: "Follow-up recovery rate" },
  { value: "4 countries", label: "India · UAE · Kenya · UK" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-rust">Our story</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-[-0.018em] text-ink">
        Built for the local business at the corner of every neighbourhood
      </h1>
      <p className="mt-6 max-w-2xl leading-7 text-mutedink">
        Ferbz started in 2023 when our founder watched a family member miss three consecutive follow-ups because the local business they trusted had no way to check back in. The owner cared — she just had no tool.
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-mutedink">
        We set out to fix that with the simplest possible stack: WhatsApp (which every customer already uses), a lightweight customer record system, and automated daily queues. No complicated ERP. No six-week onboarding. Just reminders that actually get sent.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-ink bg-paper-white p-6 shadow-[3px_3px_0_#17150F]">
            <p className="font-display text-3xl font-extrabold text-green">{s.value}</p>
            <p className="mt-1 text-sm text-mutedink">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-2xl font-extrabold uppercase tracking-[-0.014em] text-ink">What we believe</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {values.map((v) => (
          <div key={v.title} className="border border-ink bg-paper-white p-6">
            <h3 className="font-semibold text-ink">{v.title}</h3>
            <p className="mt-2 text-sm leading-6 text-mutedink">{v.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-2xl font-extrabold uppercase tracking-[-0.014em] text-ink">Where we are headed</h2>
      <p className="mt-4 max-w-2xl leading-7 text-mutedink">
        Ferbz is expanding its reminders engine to support regional languages, adding an integrated billing module, and building a network analytics layer so multi-location businesses can see customer retention across all locations in one view.
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-mutedink">
        We are a small, focused team. If you want to see a feature, tell us — most of our best ideas have come from business owners who emailed support@ferbz.com at 7 AM before their counter opened.
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center bg-green px-6 py-3 font-mono text-sm tracking-[0.08em] text-paper transition hover:bg-ink"
        >
          Talk to us
        </Link>
        <a
          href="https://dashboard.easibill.com/"
          className="inline-flex items-center border border-ink bg-paper-white px-6 py-3 font-mono text-sm tracking-[0.08em] text-ink transition hover:bg-ink hover:text-paper"
        >
          Try Ferbz free
        </a>
      </div>
    </div>
  );
}
