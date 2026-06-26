'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Bell, FileText, AlertTriangle, BarChart3, Store } from 'lucide-react'

const FEATURES = [
  {
    icon: MessageCircle,
    tag: 'WhatsApp Billing',
    title: 'Bills land in WhatsApp in under 3 seconds',
    description: "No printer. No paper. No hunting for the customer's email. Tap once — the bill is in their chat.",
    size: 'large',
    accent: 'blue',
    visual: (
      <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm space-y-2">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">R</div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-gray-100 max-w-xs">
            <p className="font-medium text-slate-900 text-xs">EasiBill — Verma Medical</p>
            <p className="text-gray-500 text-xs mt-0.5">Invoice #0814 · $12.50 · tax included</p>
            <p className="text-blue-600 text-xs mt-1">📄 View & download bill</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 ml-11">Delivered 2.3s ago</p>
      </div>
    ),
  },
  {
    icon: Bell,
    tag: 'Refill Reminders',
    title: 'Customers come back before they run out',
    description: 'EasiBill tracks what each customer buys and nudges them back automatically — before they buy from someone else.',
    size: 'small',
    accent: 'blue',
    visual: null,
  },
  {
    icon: FileText,
    tag: 'Tax-Ready Invoices',
    title: 'Every bill is tax-compliant. No accountant needed.',
    description: 'Tax IDs, product codes, tax breakdowns — all handled. Export a clean report for your accountant in one click.',
    size: 'small',
    accent: 'purple',
    visual: null,
  },
  {
    icon: AlertTriangle,
    tag: 'Expiry Alerts',
    title: 'Never write off dead stock again',
    description: 'Get notified 60 days before medicines expire. Review, return, or discount before the loss happens.',
    size: 'small',
    accent: 'orange',
    visual: null,
  },
  {
    icon: BarChart3,
    tag: 'Customer Analytics',
    title: 'Your customer data, finally useful',
    description: 'See who buys what, when they stop coming, and what brings them back. Simple charts, actionable data.',
    size: 'small',
    accent: 'teal',
    visual: null,
  },
  {
    icon: Store,
    tag: 'Multi-Store Dashboard',
    title: 'One login for all your stores',
    description: 'Run 1 pharmacy or 20. EasiBill centralizes billing, inventory, and reports across all your locations.',
    size: 'small',
    accent: 'rose',
    visual: null,
  },
]

const ACCENT_CLASSES = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  teal: 'bg-teal-50 text-teal-700 border-teal-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
}

const ICON_ACCENT_CLASSES = {
  blue: 'text-blue-600',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  teal: 'text-teal-500',
  rose: 'text-rose-500',
}

export default function FeaturesBento() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="features-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Everything your pharmacy needs.{' '}
            <span className="text-blue-600">Nothing it doesn't.</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Six features that replace manual billing, dead stock, and lost customers — all in one app.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.article
              key={feature.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-200 ${
                feature.size === 'large' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon
                  className={`h-7 w-7 ${ICON_ACCENT_CLASSES[feature.accent]}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ACCENT_CLASSES[feature.accent]}`}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              {feature.visual}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
