"use client";

import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const linkGroups = [
  {
    title: 'Business Tools',
    links: [
      { label: 'Follow-up Reminders', description: 'Automatic WhatsApp follow-ups for repeat customers.', href: '/features/follow-up-reminders' },
      { label: 'Customer Records', description: 'Item, interval, and contact stored per customer.', href: '/features/patient-records' },
      { label: 'Daily Queue', description: 'Who is due, overdue, or recently followed up — every morning.', href: '/features/daily-queue' },
      { label: 'Broadcast Campaigns', description: 'Health camp and loyalty messages for targeted customer groups.', href: '/features/broadcast-campaigns' },
      { label: 'Retention Analytics', description: 'Reminders sent, recovered follow-ups, and inactive customers tracked.', href: '/features/retention-analytics' },
    ],
  },
  {
    title: 'Getting Started',
    links: [
      { label: '14-Day Free Trial', description: 'Full access, no card required, set up in under 5 minutes.', href: 'https://dashboard.easibill.com/', external: true },
      { label: 'Book a Demo', description: 'Live walkthrough with a business retention specialist.', href: '/contact' },
      { label: 'Onboarding Guide', description: 'Step-by-step setup from first customer to first reminder.', href: '/onboarding' },
      { label: 'Pricing', description: 'Starter free forever. Growth from $9/month.', href: '/#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', description: 'Setup guides for reminders, billing, and customer records.', href: '/help' },
      { label: 'Blog', description: 'Practical growth notes for local business owners.', href: '/blog' },
      { label: 'Business Guides', description: 'Deep-dive articles on GST invoicing, follow-up systems, and more.', href: '/sitemap-page' },
      { label: 'Tutorials', description: 'Short walkthroughs for staff onboarding.', href: '/tutorials' },
      { label: 'Webinars', description: 'Live sessions on follow-up automation and retention.', href: '/webinars' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', description: 'Building practical software for busy local businesses worldwide.', href: '/about' },
      { label: 'Contact', description: 'Talk to us about sales, support, or partnerships.', href: '/contact' },
      { label: 'Privacy Policy', description: 'How we handle business and customer data.', href: '/privacy' },
      { label: 'Terms of Service', description: 'Terms for using Easibill products.', href: '/terms' },
    ],
  },
];


const Footer = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const goTo = (event, href) => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <footer className="border-t border-white/[0.06] bg-[#080d0a] text-white/50" data-section="footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#080d0a]"
            >
              <img src="/logo.png" alt="Easibill Logo" className="h-12 w-12 rounded-full" width="48" height="48" />
              <span>
                <span className="block text-2xl font-semibold tracking-tight text-white">Easibill</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400/70">Local business retention OS</span>
              </span>
            </button>
            <p className="mt-5 max-w-md leading-7">
              Simplify your billing process with fast, reliable software, then bring customers back with WhatsApp follow-up reminders built for local businesses everywhere.
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-white/[0.07] bg-white/[0.03] p-4">
              <h3 className="font-semibold text-white">Stay Updated</h3>
              <div className="mt-3 flex overflow-hidden rounded-full border border-white/[0.1] bg-white/[0.04]">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                  aria-label="Email Address"
                />
                <button className="bg-amber-500 px-4 text-white transition hover:bg-amber-400" aria-label="Subscribe">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-white/30">Get the latest updates, news and product offers.</p>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <h3 className="font-semibold text-white">Contact Us</h3>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400/60" />
                <a href="mailto:support@easibill.com" className="hover:text-white">support@easibill.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400/60" />
                <a href="tel:+918839143395" className="hover:text-white">+91 8839143395</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-400/60" />
                <span>Serving local businesses worldwide</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={DASHBOARD_LOGIN_URL} className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-400">
                Open Easibill app
              </a>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {linkGroups.map((group) => (
              <div key={group.title} className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.03] p-5">
                <h3 className="font-semibold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-4">
                  {group.links.map(({ label, description, href, external, disabled }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        aria-disabled={disabled || undefined}
                        onClick={disabled ? (e) => e.preventDefault() : undefined}
                        className={`block${disabled ? ' pointer-events-none opacity-40' : ''}`}
                      >
                        <span className="text-sm font-semibold text-white/70 hover:text-amber-400">{label}</span>
                        <span className="mt-1 block text-xs leading-5 text-white/30">{description}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.05] pt-6 text-sm text-white/30 md:flex-row md:items-center md:justify-between">
          <div>
            <p>Copyright {currentYear} Easibill. All rights reserved.</p>
            <p className="mt-1">Easibill - Best Billing Service &amp; Simple Billing Software</p>
          </div>
          <div className="flex gap-3">
            <a href="/privacy" onClick={(event) => goTo(event, '/privacy')} className="hover:text-white">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" onClick={(event) => goTo(event, '/terms')} className="hover:text-white">Terms of Service</a>
            <span>|</span>
            <a href="/sitemap-page" onClick={(event) => goTo(event, '/sitemap-page')} className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
