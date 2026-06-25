'use client'

import { motion } from 'framer-motion'
import { Smartphone, Package, Send } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Smartphone,
    title: 'Connect your WhatsApp Business number',
    description: 'Link your existing WhatsApp Business number in one click. Takes 5 minutes. No technical setup needed.',
    detail: 'Works with any Android phone or WhatsApp Business API account.',
  },
  {
    number: '02',
    icon: Package,
    title: 'Scan medicines or import your stock',
    description: 'Scan barcodes with your phone camera, or bulk-import from your existing Marg/Gofrugal data. One-time setup.',
    detail: 'Free migration support included for all plans.',
  },
  {
    number: '03',
    icon: Send,
    title: "Bill customers — they get it instantly",
    description: "Select medicines, enter quantity, tap send. The GST bill lands in your customer's WhatsApp before they leave your counter.",
    detail: 'Refill reminders send automatically from here on.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="py-24 px-6 bg-gray-50"
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
            id="how-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Up and running in under 10 minutes
          </h2>
          <p className="text-gray-500 text-lg">
            No IT team. No training days. No complicated onboarding. Just three steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gray-200"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.15 }}
              viewport={{ once: true, margin: '-80px' }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-emerald-500" aria-hidden="true" />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{step.description}</p>
              <p className="text-xs text-emerald-600 font-medium">{step.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mt-14"
        >
          <a
            href="/lead"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 text-base"
          >
            Start free — no card needed
          </a>
        </motion.div>
      </div>
    </section>
  )
}
