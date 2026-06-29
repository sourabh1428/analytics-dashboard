'use client'

import { motion } from 'framer-motion'
import { Clock, UserX, FileWarning, TrendingDown } from 'lucide-react'
import { fadeUp, scaleIn, stagger, wordVariant, viewport } from '@/src/lib/motion'

const PAIN_POINTS = [
  {
    icon: Clock,
    stat: '8 min',
    title: 'Average time for a manual bill',
    description: 'Hand-written or desktop software bills slow your queue. Customers leave before they get to the counter.',
  },
  {
    icon: UserX,
    stat: '6 in 10',
    title: "Customers who don't return",
    description: 'Without reminders, patients forget to refill. They buy from the pharmacy closest to them next time — not yours.',
  },
  {
    icon: FileWarning,
    stat: '$500+',
    title: 'Average annual expired stock loss',
    description: 'Medicines expire silently. By the time you notice, the loss is already done.',
  },
  {
    icon: TrendingDown,
    stat: '2 days',
    title: 'Lost per year to tax compliance',
    description: 'Manually compiling tax codes, rates, and invoice numbers for your accountant is a full weekend every month.',
  },
]

const HEADING = ['Manual', 'billing', 'is', 'costing', 'you', 'more', 'than', 'you', 'think']

export default function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
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
            id="problem-heading"
            variants={stagger}
            className="text-4xl font-bold text-white mb-4 leading-tight"
          >
            {HEADING.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg">
            Every pharmacy dealing with paper bills and outdated software is bleeding time, customers, and money.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
        >
          {PAIN_POINTS.map((point) => (
            <motion.article
              key={point.title}
              variants={scaleIn}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-[#09090B] rounded-2xl border border-zinc-800 p-6 flex flex-col"
            >
              <point.icon className="h-8 w-8 text-red-400 mb-4" aria-hidden="true" />
              <p className="text-3xl font-bold text-white mb-1">{point.stat}</p>
              <h3 className="font-semibold text-zinc-200 mb-2">{point.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{point.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
