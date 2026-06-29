'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, MessageCircle, LayoutDashboard, Users, Package, BarChart3 } from 'lucide-react'
import { useGeo } from '@/src/hooks/useGeo'

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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-300/40 overflow-hidden">
      {/* Browser chrome */}
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

      {/* App layout */}
      <div className="flex h-[390px]">

        {/* Sidebar */}
        <aside className="hidden md:flex w-44 border-r border-gray-100 bg-gray-50/50 p-3 flex-col shrink-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">
            Verma Medical
          </p>
          <nav className="flex flex-col gap-0.5">
            {SIDEBAR_NAV.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                  item.active ? 'bg-violet-50 text-violet-700' : 'text-gray-500'
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

        {/* Billing form */}
        <main className="flex-1 p-5 overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">New Bill</h3>
              <p className="text-xs text-gray-400 mt-0.5">Invoice #2406-0047</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-[10px] font-semibold">
              Tax-ready ✓
            </span>
          </div>

          {/* Patient */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 shrink-0">
              RK
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Ramesh Kumar</p>
              <p className="text-xs text-gray-400">+1 (415) 555-0198</p>
            </div>
          </div>

          {/* Medicines */}
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
            className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-default"
            tabIndex={-1}
            aria-hidden="true"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Send bill on WhatsApp
          </button>
        </main>

        {/* WhatsApp delivery panel */}
        <aside className="hidden lg:flex w-56 border-l border-gray-100 flex-col gap-3 p-4 bg-gray-50/30 shrink-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            WhatsApp Preview
          </p>

          <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-violet-600 mb-1">EasiBill — Verma Medical</p>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              Invoice #2406-0047<br />$12.00 · tax included
            </p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1 text-violet-600">
              <span className="text-[10px]" aria-hidden="true">📄</span>
              <p className="text-[10px] font-medium">View &amp; download bill</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-violet-500" aria-hidden="true">✓✓</span>
            <p className="text-[10px] text-gray-500">Delivered · 2.3 seconds</p>
          </div>

          <div className="mt-auto rounded-xl bg-white border border-gray-100 p-3">
            <p className="text-[10px] font-semibold text-slate-900 mb-1">Next: Refill reminder</p>
            <p className="text-[10px] text-gray-400">Metformin due in 28 days</p>
            <p className="text-[10px] text-violet-600 font-medium mt-1">Auto-scheduled ✓</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function Hero() {
  const geo = useGeo()

  const proofPoints = [
    geo ? `${geo.flag} Serving pharmacies in ${geo.countryName}` : '2,400+ pharmacies worldwide',
    '18M+ bills sent via WhatsApp',
    'Free to start — no card needed',
  ]

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="pt-28 pb-0 bg-white overflow-hidden"
    >
      {/* Centered copy */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-600" aria-hidden="true" />
          <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">
            #1 billing app for independent pharmacies
          </span>
        </motion.div>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="text-5xl sm:text-[3.5rem] font-bold text-slate-900 leading-[1.06] tracking-tight mb-5"
        >
          Your pharmacy loses 20–40% of patients every year.{' '}
          <span className="text-violet-600">EasiBill stops that.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="text-lg text-gray-500 leading-relaxed mb-9"
        >
          EasiBill is a WhatsApp-first CRM for independent pharmacies. Log a purchase and EasiBill automatically sends a refill reminder on the right day — from your own WhatsApp number, without you touching anything.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-9"
        >
          <a
            href="https://dashboard.easibill.com/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 text-base min-h-[48px]"
          >
            Start free — no card needed
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 text-slate-900 font-semibold hover:bg-gray-50 transition-colors duration-150 text-base min-h-[48px]"
          >
            See how it works →
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.34 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          role="list"
        >
          {proofPoints.map((point) => (
            <li key={point} className="flex items-center gap-1.5 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-violet-600 shrink-0" aria-hidden="true" />
              {point}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Product mockup */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.42 }}
        className="max-w-6xl mx-auto px-6"
      >
        <AppMockup />
      </motion.div>
    </section>
  )
}
