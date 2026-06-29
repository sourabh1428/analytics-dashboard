'use client'

import { motion } from 'framer-motion'
import { Smartphone, Users, Bell } from 'lucide-react'
import { slideLeft, slideRight, fadeUp, stagger, wordVariant, viewport } from '@/src/lib/motion'

const STEPS = [
  {
    number: '01',
    icon: Smartphone,
    title: 'Connect your WhatsApp number',
    description: 'Scan a QR code once in the dashboard. Your existing WhatsApp Business number is now linked. Takes 2 minutes. No API registration needed.',
    detail: 'Works with your current WhatsApp Business app — no new number required.',
    direction: 'left',
  },
  {
    number: '02',
    icon: Users,
    title: 'Add your patients and their medicines',
    description: 'Add each patient with their name, WhatsApp number, medicine, and refill interval. Or upload a CSV to import your existing patient list in bulk.',
    detail: 'Most pharmacies import their top 30 chronic-care patients in under 10 minutes.',
    direction: 'up',
  },
  {
    number: '03',
    icon: Bell,
    title: 'Reminders fire automatically — forever',
    description: 'EasiBill calculates each patient\'s refill date and sends a WhatsApp message at 9 AM on that day. You do nothing. The patient comes back.',
    detail: 'Average pharmacy recovers 28–35% of missed refills in the first month.',
    direction: 'right',
  },
]

const directionVariants = {
  left: slideLeft,
  right: slideRight,
  up: fadeUp,
}

const H2_WORDS = ['Up', 'and', 'running', 'in', 'under', '10', 'minutes']

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="py-24 px-6 bg-[#18181B]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.h2
            id="how-heading"
            variants={stagger}
            className="text-4xl font-bold text-white mb-4 leading-tight"
          >
            {H2_WORDS.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg">
            No IT team. No training days. No complicated onboarding. Just three steps.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line — draws left to right */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px overflow-hidden" aria-hidden="true">
            <motion.div
              className="h-full bg-zinc-700"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              viewport={viewport}
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial="hidden"
              whileInView="visible"
              variants={directionVariants[step.direction]}
              transition={{ delay: i * 0.15 }}
              viewport={viewport}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step icon */}
              <div className="relative mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.15 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={viewport}
                  className="h-20 w-20 rounded-2xl bg-[#09090B] border border-zinc-800 flex items-center justify-center"
                >
                  <step.icon className="h-8 w-8 text-amber-400" aria-hidden="true" />
                </motion.div>
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.15 + 0.25, type: 'spring', stiffness: 300 }}
                  viewport={viewport}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-amber-500 text-zinc-950 text-xs font-bold flex items-center justify-center"
                >
                  {i + 1}
                </motion.span>
              </div>

              <h3 className="text-xl font-bold text-zinc-100 mb-3">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-3">{step.description}</p>
              <p className="text-xs text-amber-400 font-medium">{step.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={viewport}
          className="text-center mt-14"
        >
          <a
            href="https://dashboard.easibill.com/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 text-base"
          >
            Start free — no card needed
          </a>
        </motion.div>
      </div>
    </section>
  )
}
