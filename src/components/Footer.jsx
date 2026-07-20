"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useScrollReveal } from '@/src/lib/scrollScrub';

const DASHBOARD_LOGIN_URL = 'https://dashboard.ferbz.com/';

// Comp footer (pro/Ferbz Landing.dc.html) uses a 3-column link grid
// (TOOLS / START / COMPANY) beside the wordmark column. The old footer had
// a 4th "Resources" group — folded into COMPANY below so no link is dropped.
const linkGroups = [
  {
    title: 'TOOLS',
    links: [
      { label: 'Follow-up Reminders', href: '/features/follow-up-reminders' },
      { label: 'Customer Records', href: '/features/patient-records' },
      { label: 'Daily Queue', href: '/features/daily-queue' },
      { label: 'Broadcast Campaigns', href: '/features/broadcast-campaigns' },
      { label: 'Retention Analytics', href: '/features/retention-analytics' },
    ],
  },
  {
    title: 'START',
    links: [
      { label: '14-Day Free Trial', href: DASHBOARD_LOGIN_URL, external: true },
      { label: 'Book a Demo', href: '/contact' },
      { label: 'Onboarding Guide', href: '/onboarding' },
      { label: 'Pricing', href: '/#rates' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Business Guides', href: '/sitemap-page' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Webinars', href: '/webinars' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const Footer = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);

  const goTo = (event, href) => {
    if (href.startsWith('http')) return;
    event.preventDefault();
    router.push(href);
  };

  // Light-touch only, per global chrome guidance — a single once-off fade
  // as the footer arrives, nothing more.
  useScrollReveal({
    ref: footerRef,
    threshold: 0.05,
    duration: 600,
    onUpdate: (t) => {
      const el = footerRef.current
      if (!el) return
      el.style.opacity = String(t)
      el.style.transform = `translateY(${16 * (1 - t)}px)`
    },
  })

  return (
    <footer
      ref={footerRef}
      className="border-t border-white/20 bg-ink text-faint"
      data-section="footer"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 focus:outline-none"
            >
              <Image src="/logo.png" alt="" width={44} height={44} className="h-11 w-11" />
              <span className="font-display text-2xl font-black tracking-[0.01em] text-paper [font-stretch:118%]">
                FERBZ<span className="text-green-bright">*</span>
              </span>
            </button>
            <p className="mt-3.5 max-w-[300px] text-[13.5px] leading-relaxed">
              The local business retention OS. Fast billing, then WhatsApp follow-ups that bring customers back.
            </p>
            <div className="mt-5 font-mono text-[11px] leading-loose tracking-[0.1em]">
              SUPPORT@FERBZ.COM<br />+91 88391 43395
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title} className="grid content-start gap-3 font-mono text-xs tracking-[0.08em]">
              <span className="tracking-[0.14em] text-paper">{group.title}</span>
              {group.links.map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  onClick={(event) => goTo(event, href)}
                  className="text-faint transition-colors hover:text-green-bright"
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-5 font-mono text-[11px] tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {currentYear} FERBZ. ALL RIGHTS RESERVED.</span>
          <span>SERVING LOCAL BUSINESSES WORLDWIDE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
