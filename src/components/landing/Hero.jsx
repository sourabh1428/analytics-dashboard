'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const PROOF_POINTS = [
  '2,400+ pharmacies across India',
  '18M+ bills sent via WhatsApp',
  'Free to start — no card needed',
]

function ProductMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute inset-0 bg-emerald-400/20 rounded-3xl blur-3xl scale-110" aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="ml-2 text-xs text-gray-400 font-mono">easibill.site</span>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Invoice #2406-0814</p>
              <p className="font-bold text-slate-900 mt-0.5">Ramesh Kumar</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              Sent on WhatsApp ✓
            </span>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Metformin 500mg × 30', amount: '₹148' },
              { name: 'Amlodipine 5mg × 15', amount: '₹63' },
              { name: 'Pantoprazole 40mg × 10', amount: '₹89' },
            ].map((item) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium text-slate-900">{item.amount}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-semibold text-slate-900">Total (incl. GST)</span>
            <span className="font-bold text-emerald-600 text-lg">₹300</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3">
            <span className="text-emerald-600 text-lg" aria-hidden="true">💬</span>
            <p className="text-xs text-emerald-700 font-medium">
              Bill delivered to +91 98765 43210 in 2.3 seconds
            </p>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-52"
        aria-hidden="true"
      >
        <p className="text-xs font-semibold text-slate-900">Refill Reminder Sent</p>
        <p className="text-xs text-gray-500 mt-0.5">Ramesh's Metformin runs out in 3 days</p>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <p className="text-[10px] text-emerald-600 font-medium">Auto-sent via WhatsApp</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="pt-28 pb-20 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              #1 Billing App for Independent Pharmacies
            </span>
          </div>

          <h1
            id="hero-heading"
            className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight"
          >
            Your pharmacy runs on hard work.{' '}
            <span className="text-emerald-500">Let billing run itself.</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
            EasiBill sends GST bills on WhatsApp, reminds customers when to refill, and keeps your inventory clean — so you can focus on your patients.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/lead"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-base min-h-[48px]"
            >
              Start free — no card needed
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 text-slate-900 font-semibold hover:bg-gray-50 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-base min-h-[48px]"
            >
              See how it works →
            </a>
          </div>

          <ul className="flex flex-col gap-2" role="list">
            {PROOF_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ProductMockup />
        </div>
      </div>
    </section>
  )
}
