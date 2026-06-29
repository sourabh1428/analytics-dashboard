'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, CheckCircle, MessageCircle, LayoutDashboard, Users, Package, BarChart3 } from 'lucide-react'
import { useGeo } from '@/src/hooks/useGeo'
import { stagger, wordVariant, fadeUp, scaleIn, staggerFast, fadeIn, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'

const H1_WORDS_1 = ['Your', 'pharmacy', 'loses', '20–40%', 'of', 'patients', 'every', 'year.']
const H1_WORDS_2 = ['EasiBill', 'stops', 'that.']

const MEDICINES = [
  { name: 'Metformin 500mg', qty: '× 30', amount: '$6.00' },
  { name: 'Amlodipine 5mg', qty: '× 15', amount: '$2.50' },
  { name: 'Pantoprazole 40mg', qty: '× 10', amount: '$3.50' },
]

const SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: 'New Bill', active: true },
  { icon: Users, label: 'Patients', active: false },
  { icon: Package, label: 'Inventory', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
]

function AppMockup() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-300" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-yellow-300" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-green-300" aria-hidden="true" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white rounded border border-gray-200 px-3 py-1 text-xs text-gray-400 flex items-center gap-1.5 max-w-xs">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            app.easibill.com/billing/new
          </div>
        </div>
      </div>

      <div className="flex h-[390px]">
        <aside className="hidden md:flex w-44 border-r border-gray-100 bg-gray-50/50 p-3 flex-col shrink-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
            Verma Medical
          </p>
          <nav className="flex flex-col gap-0.5">
            {SIDEBAR_NAV.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                  item.active ? 'bg-amber-50 text-amber-600' : 'text-gray-500'
                }`}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {item.label}
              </div>
            ))}
          </nav>
          <div className="mt-auto space-y-2 pt-3 border-t border-gray-100">
            <div className="rounded-xl bg-white border border-gray-100 p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5">Today's bills</p>
              <p className="text-lg font-bold text-slate-900 leading-none">47</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-100 p-2.5">
              <p className="text-[10px] text-gray-400 mb-0.5">Reminders sent</p>
              <p className="text-lg font-bold text-slate-900 leading-none">12</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-5 overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">New Bill</h3>
              <p className="text-xs text-gray-400 mt-0.5">Invoice #2406-0047</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold">
              Tax-ready ✓
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">
              RK
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ramesh Kumar</p>
              <p className="text-xs text-gray-400">+1 (415) 555-0198</p>
            </div>
          </div>

          <table className="w-full text-xs mb-3">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Medicine</th>
                <th className="text-right pb-2 font-medium">Qty</th>
                <th className="text-right pb-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {MEDICINES.map((m) => (
                <tr key={m.name} className="border-b border-gray-50">
                  <td className="py-2 text-slate-700">{m.name}</td>
                  <td className="py-2 text-right text-gray-400">{m.qty}</td>
                  <td className="py-2 text-right font-medium text-slate-900">{m.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center py-2.5 border-t border-gray-200 mb-4">
            <span className="text-xs text-gray-500">Total (incl. tax)</span>
            <span className="text-base font-bold text-slate-900">$12.00</span>
          </div>

          <button
            className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-default"
            tabIndex={-1}
            aria-hidden="true"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Send bill on WhatsApp
          </button>
        </main>

        <aside className="hidden lg:flex w-56 border-l border-gray-100 flex-col gap-3 p-4 bg-gray-50/30 shrink-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            WhatsApp Preview
          </p>
          <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-amber-500 mb-1">EasiBill — Verma Medical</p>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              Invoice #2406-0047<br />$12.00 · tax included
            </p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1 text-amber-500">
              <span className="text-[10px]" aria-hidden="true">📄</span>
              <p className="text-[10px] font-medium">View &amp; download bill</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-amber-500" aria-hidden="true">✓✓</span>
            <p className="text-[10px] text-gray-500">Delivered · 2.3 seconds</p>
          </div>
          <div className="mt-auto rounded-xl bg-white border border-gray-100 p-3">
            <p className="text-[10px] font-semibold text-slate-900 mb-1">Next: Refill reminder</p>
            <p className="text-[10px] text-gray-400">Metformin due in 28 days</p>
            <p className="text-[10px] text-amber-500 font-medium mt-1">Auto-scheduled ✓</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function Hero() {
  const geo = useGeo()
  const posthog = usePostHog()

  const proofPoints = [
    geo ? `${geo.flag} Serving pharmacies in ${geo.countryName}` : '2,400+ pharmacies worldwide',
    '18M+ bills sent via WhatsApp',
    'Free to start — no card needed',
  ]

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative pt-28 pb-0 overflow-hidden bg-[#09090B]"
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272A 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      {/* Amber top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '500px',
          background: 'radial-gradient(ellipse at center top, rgba(245,158,11,0.09) 0%, transparent 68%)',
        }}
        aria-hidden="true"
      />

      {/* Copy */}
      <div className="relative max-w-3xl mx-auto px-6 text-center mb-12">
        {/* Badge */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
            #1 billing app for independent pharmacies
          </span>
        </motion.div>

        {/* Headline — word by word */}
        <motion.h1
          id="hero-heading"
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-[3.5rem] font-bold text-white leading-[1.08] tracking-tight mb-5"
        >
          {H1_WORDS_1.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="inline-block mr-[0.22em]"
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          {H1_WORDS_2.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="inline-block mr-[0.22em] text-amber-400"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="text-lg text-zinc-400 leading-relaxed mb-9"
        >
          EasiBill is a WhatsApp-first CRM for independent pharmacies. Log a purchase and EasiBill automatically sends a refill reminder on the right day — from your own WhatsApp number, without you touching anything.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.62 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-9"
        >
          <a
            href="https://dashboard.easibill.com/"
            onClick={() => posthog?.capture('hero_cta_clicked', { cta: 'start_free', location: 'hero' })}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 text-base min-h-[48px]"
          >
            Start free — no card needed
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#how-it-works"
            onClick={() => posthog?.capture('hero_cta_clicked', { cta: 'how_it_works', location: 'hero' })}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-zinc-700 text-zinc-200 font-semibold hover:bg-zinc-800 hover:border-zinc-600 transition-colors duration-150 text-base min-h-[48px]"
          >
            See how it works →
          </a>
        </motion.div>

        {/* Proof points */}
        <motion.ul
          variants={staggerFast}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          role="list"
        >
          {proofPoints.map((point) => (
            <motion.li
              key={point}
              variants={fadeIn}
              className="flex items-center gap-1.5 text-sm text-zinc-500"
            >
              <CheckCircle className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
              {point}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* App mockup — spring up from below */}
      <motion.div
        initial={{ opacity: 0, y: 64, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-6xl mx-auto px-6"
      >
        {/* Glow under mockup */}
        <div
          className="absolute -inset-x-8 -bottom-8 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(245,158,11,0.07) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <AppMockup />
      </motion.div>
    </section>
  )
}
