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
    title: "Business Guides",
    links: [
      { label: "Follow-up Reminder System", href: "/pharmacy-refill-reminder-system" },
      { label: "WhatsApp Follow-up Reminders", href: "/pharmacy-whatsapp-refill-reminders" },
      { label: "Business Billing & Inventory", href: "/pharmacy-billing-and-inventory-management" },
      { label: "GST Invoicing Made Easy", href: "/pharmacy-gst-invoicing-made-easy" },
      { label: "Inventory Management Simplified", href: "/pharmacy-inventory-management-simplified" },
      { label: "Follow-up Reminder Systems", href: "/pharmacy-refill-reminder-systems" },
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
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Sitemap</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">All pages</h1>
      <p className="mt-4 text-white/60">Every page on easibill.com, organised by section.</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <h2 className="font-semibold text-white">{g.title}</h2>
            <ul className="mt-4 space-y-2">
              {g.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-amber-400"
                    >
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-white/60 hover:text-amber-400">
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
