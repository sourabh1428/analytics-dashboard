"use client";

import { ArrowRight, BriefcaseBusiness, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login';
const DISCORD_URL = 'https://discord.gg/easibill';

const linkGroups = [
  {
    title: 'Pharmacy Tools',
    links: [
      { label: 'Refill Reminders', description: 'Automatic WhatsApp follow-ups for chronic-care patients.', href: '/#features' },
      { label: 'Patient Records', description: 'Medicine, interval, and contact stored per patient.', href: '/#features' },
      { label: 'Daily Queue', description: 'Who is due, overdue, or recently refilled — every morning.', href: '/#features' },
      { label: 'Broadcast Campaigns', description: 'Health camp and loyalty messages for targeted patient groups.', href: '/#features' },
      { label: 'Retention Analytics', description: 'Reminders sent, recovered refills, and inactive patients tracked.', href: '/#features' },
    ],
  },
  {
    title: 'Getting Started',
    links: [
      { label: '14-Day Free Trial', description: 'Full access, no card required, set up in under 5 minutes.', href: 'https://easibill.vercel.app/login', external: true },
      { label: 'Book a Demo', description: 'Live walkthrough with a pharmacy retention specialist.', href: '/lead' },
      { label: 'Onboarding Guide', description: 'Step-by-step setup from first patient to first reminder.', href: '#', disabled: true },
      { label: 'Pricing', description: 'Starter at Rs. 299/month. Pro at Rs. 999/month.', href: '/#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', description: 'Setup guides for reminders, billing, and patient records.', href: '#', disabled: true },
      { label: 'Blog', description: 'Practical growth notes for Indian pharmacy owners.', href: '#', disabled: true },
      { label: 'Tutorials', description: 'Short walkthroughs for staff onboarding.', href: '#', disabled: true },
      { label: 'Webinars', description: 'Live sessions on refill automation and retention.', href: '#', disabled: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', description: 'Building practical software for busy Indian counters.', href: '#', disabled: true },
      { label: 'Careers', description: 'Join the team shaping pharmacy retention tools.', href: '#careers' },
      { label: 'Contact', description: 'Talk to us about sales, support, or partnerships.', href: '/contact' },
      { label: 'Privacy Policy', description: 'How we handle pharmacy and patient data.', href: '#', disabled: true },
      { label: 'Terms of Service', description: 'Terms for using Easibill products.', href: '#', disabled: true },
    ],
  },
];

const jobs = [
  {
    title: 'Senior Developer',
    type: 'Full-time',
    detail: 'React, Node, integrations, reliability, and product-minded engineering for a SaaS used by pharmacy teams.',
  },
  {
    title: 'Sales Person',
    type: 'Full-time',
    detail: 'Own pharmacy demos, outbound conversations, onboarding follow-up, and local market learning.',
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
    <footer className="border-t border-slate-200 bg-white text-slate-600" data-section="footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <img src="/logo.png" alt="Easibill Logo" className="h-12 w-12 rounded-full" width="48" height="48" />
              <span>
                <span className="block text-2xl font-semibold tracking-tight text-slate-950">Easibill</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Pharmacy retention OS</span>
              </span>
            </button>
            <p className="mt-5 max-w-md leading-7">
              Simplify your billing process with fast, reliable software, then bring patients back with WhatsApp refill reminders built for Indian pharmacies.
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-950">Stay Updated</h3>
              <div className="mt-3 flex overflow-hidden rounded-full border border-slate-200 bg-white">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-950 outline-none"
                  aria-label="Email Address"
                />
                <button className="bg-slate-950 px-4 text-white transition hover:bg-emerald-950" aria-label="Subscribe">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Get the latest updates, news and product offers.</p>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <h3 className="font-semibold text-slate-950">Contact Us</h3>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-700" />
                <a href="mailto:support@easibill.com" className="hover:text-emerald-800">support@easibill.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-700" />
                <a href="tel:+918001234567" className="hover:text-emerald-800">+91 8839143395</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-700" />
                <span>Mumbai, India</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={DASHBOARD_LOGIN_URL} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-950">
                Open Easibill app
              </a>
              <a href={DISCORD_URL} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-800 transition hover:border-indigo-300">
                <MessageCircle className="h-4 w-4" />
                Join Discord
              </a>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {linkGroups.map((group) => (
              <div key={group.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-950">{group.title}</h3>
                <ul className="mt-4 space-y-4">
                  {group.links.map(({ label, description, href, external, disabled }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        aria-disabled={disabled || undefined}
                        onClick={disabled ? (e) => e.preventDefault() : undefined}
                        className={`block${disabled ? ' pointer-events-none opacity-50' : ''}`}
                      >
                        <span className="text-sm font-semibold text-slate-800 hover:text-emerald-800">{label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div id="careers" className="mt-10 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">We are hiring</h3>
              <p className="text-sm text-slate-600">Open roles for people who want to build and sell useful software for real pharmacy teams.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <div key={job.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold text-slate-950">{job.title}</h4>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{job.type}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{job.detail}</p>
                <a href="mailto:careers@easibill.com" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  Apply now
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p>Copyright {currentYear} Easibill. All rights reserved.</p>
            <p className="mt-1">Easibill - Best Billing Service &amp; Simple Billing Software</p>
          </div>
          <div className="flex gap-3">
            <a href="/privacy" onClick={(event) => goTo(event, '/privacy')} className="hover:text-emerald-800">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" onClick={(event) => goTo(event, '/terms')} className="hover:text-emerald-800">Terms of Service</a>
            <span>|</span>
            <a href="/sitemap" onClick={(event) => goTo(event, '/sitemap')} className="hover:text-emerald-800">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
