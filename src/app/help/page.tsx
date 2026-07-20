import type { Metadata } from "next";
import Link from "next/link";
import { helpArticles, helpCategories } from "@/src/data/helpArticles";

export const metadata: Metadata = {
  title: "Help Center – Ferbz",
  description: "Setup guides, FAQs, and troubleshooting for Ferbz local business billing, WhatsApp reminders, and customer records.",
  alternates: { canonical: "https://ferbz.com/help" },
};

const faqs = [
  {
    q: "Do my customers need to install WhatsApp?",
    a: "Yes — customers need WhatsApp installed on their phone. Ferbz sends messages to the phone number stored in their customer record. If WhatsApp is not installed, the message will not be delivered.",
  },
  {
    q: "Can I use Ferbz without a WhatsApp Business account?",
    a: "You need a WhatsApp Business number to send reminders. Ferbz guides you through connecting one during onboarding — the process takes about 10 minutes.",
  },
  {
    q: "Is customer data stored securely?",
    a: "All customer records are encrypted at rest (AES-256) and in transit (TLS 1.3). We never share customer data with third parties. See our Privacy Policy for full details.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export all your data at any time from the dashboard. After cancellation, your data is retained for 14 days so you can complete your export, then permanently deleted.",
  },
  {
    q: "Can multiple staff members use one account?",
    a: "Yes. Pro plan accounts support up to 5 users with role-based access.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-green">HELP CENTER</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        How can we help?
      </h1>
      <p className="mt-4 text-mutedink">
        Guides and answers for setting up reminders, billing, and customer records.
      </p>

      <div className="mt-4 flex gap-3">
        <Link
          href="/contact"
          className="font-mono text-xs tracking-[0.1em] text-green hover:text-ink"
        >
          CAN'T FIND YOUR ANSWER? CONTACT SUPPORT →
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((cat) => {
          const articles = cat.slugs.map((slug) =>
            helpArticles.find((a) => a.slug === slug)
          ).filter(Boolean);

          return (
            <div key={cat.title} className="border border-ink bg-paper-white p-6">
              <div className="text-2xl">{cat.icon}</div>
              <h2 className="mt-3 font-display text-base font-bold uppercase tracking-[-0.005em] text-ink">{cat.title}</h2>
              <ul className="mt-4 space-y-3">
                {articles.map((a) => a && (
                  <li key={a.slug} className="flex items-start justify-between gap-2">
                    <Link
                      href={`/help/${a.slug}`}
                      className="text-sm text-mutedink transition-colors hover:text-green"
                    >
                      {a.title}
                    </Link>
                    <span className="shrink-0 font-mono text-[11px] text-faint">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <h2 className="mt-16 font-display text-2xl font-extrabold uppercase tracking-[-0.01em] text-ink">Frequently asked questions</h2>
      <div className="mt-6 space-y-6">
        {faqs.map((f) => (
          <div key={f.q} className="border border-ink bg-paper-white p-6">
            <h3 className="font-display font-bold text-ink">{f.q}</h3>
            <p className="mt-2 text-sm leading-6 text-mutedink">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 border border-ink bg-green-pale p-8 text-center">
        <h3 className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-ink">Still stuck?</h3>
        <p className="mt-2 text-sm text-mutedink">Our support team typically responds within 2 hours on business days.</p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="mailto:support@ferbz.com"
            className="inline-flex bg-green px-6 py-2.5 font-mono text-xs tracking-[0.1em] text-paper transition-colors hover:bg-ink"
          >
            EMAIL SUPPORT
          </a>
          <a
            href="tel:+918839143395"
            className="inline-flex border border-ink px-6 py-2.5 font-mono text-xs tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            +91 8839143395
          </a>
        </div>
      </div>
    </div>
  );
}
