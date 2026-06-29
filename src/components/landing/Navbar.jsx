'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090B]/90 backdrop-blur-md border-b border-zinc-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-md"
        >
          <img src="/logo.png" alt="EasiBill" className="h-8 w-auto" loading="eager" />
          <span className="font-bold text-white text-lg tracking-tight">EasiBill</span>
        </a>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => posthog?.capture('navbar_link_clicked', { link: link.label })}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://dashboard.easibill.com/"
            onClick={() => posthog?.capture('navbar_signin_clicked')}
            className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 font-medium focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
          >
            Sign in
          </a>
          <a
            href="https://dashboard.easibill.com/"
            onClick={() => posthog?.capture('navbar_cta_clicked', { location: 'navbar_desktop' })}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-sm font-semibold hover:bg-amber-400 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            Start free
          </a>
        </div>

        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          {mobileOpen
            ? <X className="h-5 w-5" aria-hidden="true" />
            : <Menu className="h-5 w-5" aria-hidden="true" />
          }
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#09090B] border-b border-zinc-800 overflow-hidden"
          >
            <nav aria-label="Mobile navigation" className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-zinc-400 hover:text-white transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://dashboard.easibill.com/"
                onClick={() => posthog?.capture('navbar_cta_clicked', { location: 'navbar_mobile' })}
                className="mt-2 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-amber-500 text-zinc-950 text-sm font-semibold hover:bg-amber-400 transition-colors min-h-[44px]"
              >
                Start free — no card needed
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
