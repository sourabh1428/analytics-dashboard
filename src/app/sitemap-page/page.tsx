import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap – EasiBill",
  description: "All pages on easibill.com — local business billing, customer retention, WhatsApp reminders, pricing, help, and more.",
  alternates: { canonical: "https://easibill.com/sitemap-page" },
};

const groups = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Business Tools",
    links: [
      { label: "Follow-up Reminders", href: "/features/follow-up-reminders" },
      { label: "Customer Records", href: "/features/patient-records" },
      { label: "Daily Queue", href: "/features/daily-queue" },
      { label: "Broadcast Campaigns", href: "/features/broadcast-campaigns" },
      { label: "Retention Analytics", href: "/features/retention-analytics" },
    ],
  },
  {
    title: "Getting Started",
    links: [
      { label: "14-Day Free Trial", href: "https://dashboard.easibill.com/", external: true },
      { label: "Book a Demo", href: "/contact" },
      { label: "Onboarding Guide", href: "/onboarding" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Blog (200+ articles)", href: "/blog" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Webinars", href: "/webinars" },
    ],
  },
  {
    title: "Pharmacy Guides",
    links: [
      { label: "Pharmacy Refill Reminder System", href: "/pharmacy-refill-reminder-system" },
      { label: "Pharmacy WhatsApp Refill Reminders", href: "/pharmacy-whatsapp-refill-reminders" },
      { label: "Pharmacy Billing & Inventory", href: "/pharmacy-billing-and-inventory-management" },
      { label: "GST Invoicing Made Easy", href: "/pharmacy-gst-invoicing-made-easy" },
      { label: "Inventory Management Simplified", href: "/pharmacy-inventory-management-simplified" },
      { label: "Pharmacy Refill Reminder Systems", href: "/pharmacy-refill-reminder-systems" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function SitemapPageRoute() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-green">SITEMAP</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[.96] tracking-[-0.018em] text-ink [font-stretch:68%]">
        All pages
      </h1>
      <p className="mt-4 text-mutedink">Every page on easibill.com, organised by section.</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title} className="border border-ink bg-paper-white p-6">
            <h2 className="font-mono text-xs tracking-[0.15em] text-green">{g.title.toUpperCase()}</h2>
            <ul className="mt-4">
              {g.links.map((l) => (
                <li key={l.label} className="border-t border-ink py-2.5 first:border-t-0 first:pt-0">
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs tracking-[0.02em] text-ink transition-colors hover:text-green"
                    >
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link href={l.href} className="font-mono text-xs tracking-[0.02em] text-ink transition-colors hover:text-green">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
