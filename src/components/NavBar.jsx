"use client";

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { track } from '../utils/mixpanel';
import { prefersReducedMotion } from '@/src/lib/scrollScrub';

// Comp anchors (see pro/Ferbz Landing.dc.html nav): #toolkit #day #proof #rates #faq
const navLinks = [
  { name: 'TOOLKIT', section: 'toolkit' },
  { name: 'HOW IT WORKS', section: 'day' },
  { name: 'PROOF', section: 'proof' },
  { name: 'RATES', section: 'rates' },
  { name: 'FAQ', section: 'faq' },
];

const DASHBOARD_LOGIN_URL = 'https://dashboard.ferbz.com/';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Light-touch mount transition only — this is global chrome, not a
  // homepage section, so it should announce itself once and then get out
  // of the way. A plain CSS transition on mount (not scroll-driven), so no
  // rAF/scroll plumbing is warranted here.
  useEffect(() => {
    const el = headerRef.current
    if (!el || prefersReducedMotion()) return
    el.style.transform = 'translateY(-16px)'
    el.style.opacity = '0'
    el.style.transition = 'transform .5s cubic-bezier(.22,.61,.21,1), opacity .5s cubic-bezier(.22,.61,.21,1)'
    const raf = requestAnimationFrame(() => {
      el.style.transform = 'translateY(0)'
      el.style.opacity = '1'
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const goTo = (path) => { router.push(path); setIsOpen(false); };

  const goToSection = (section) => {
    if (pathname !== '/') {
      router.push('/');
      window.setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-ink bg-paper"
      data-section="navigation"
    >
      <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <button
          type="button"
          onClick={() => goTo('/')}
          className="flex items-center gap-2 focus:outline-none"
          aria-label="Go to Ferbz home"
        >
          <Image src="/logo.png" alt="" width={44} height={44} className="h-11 w-11" priority />
          <span className="font-display text-xl font-black tracking-[0.01em] text-ink [font-stretch:118%]">
            FERBZ<span className="text-green">*</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-baseline gap-6 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => goToSection(link.section)}
              className="font-mono text-xs tracking-[0.1em] text-ink transition-colors hover:text-green"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          type="button"
          onClick={() => { track('trial_started', { source: 'navbar' }); window.location.assign(DASHBOARD_LOGIN_URL); }}
          className="hidden font-mono text-xs tracking-[0.1em] bg-ink px-5 py-3 text-paper transition-colors hover:bg-green md:inline-block"
          data-conversion-button="get-started"
        >
          START FREE →
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center text-ink md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-ink bg-paper px-4 pb-4 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => goToSection(link.section)}
                className="block w-full py-3 text-left font-mono text-xs tracking-[0.1em] text-ink"
              >
                {link.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { track('trial_started', { source: 'navbar_mobile' }); window.location.assign(DASHBOARD_LOGIN_URL); }}
              className="mt-2 block w-full bg-ink py-3 text-center font-mono text-xs tracking-[0.1em] text-paper"
            >
              START FREE →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
