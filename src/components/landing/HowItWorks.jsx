'use client'

import { motion } from 'framer-motion'
import { Smartphone, Users, Bell } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Smartphone,
    title: 'Connect your WhatsApp number',
    description: 'Scan a QR code once in the dashboard. Your existing WhatsApp Business number is now linked. Takes 2 minutes. No API registration needed.',
    detail: 'Works with your current WhatsApp Business app — no new number required.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Add your patients and their medicines',
    description: 'Add each patient with their name, WhatsApp number, medicine, and refill interval. Or upload a CSV to import your existing patient list in bulk.',
    detail: 'Most pharmacies import their top 30 chronic-care patients in under 10 minutes.',
  },
  {
    number: '03',
    icon: Bell,
    title: 'Reminders fire automatically — forever',
    description: 'EasiBill calculates each patient\'s refill date and sends a WhatsApp message at 9 AM on that day. You do nothing. The patient comes back.',
    detail: 'Average pharmacy recovers 28–35% of missed refills in the first month.',
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
                  <step.icon className="h-8 w-8 text-violet-500" aria-hidden="true" />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">{step.description}</p>
              <p className="text-xs text-violet-600 font-medium">{step.detail}</p>
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
            href="https://dashboard.easibill.com/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-500 text-white font-semibold hover:bg-violet-600 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 text-base"
          >
            Start free — no card needed
          </a>
        </motion.div>
      </div>
    </section>
  )
}
