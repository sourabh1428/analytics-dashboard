'use client'

import { motion } from 'framer-motion'
import { Clock, UserX, FileWarning, TrendingDown } from 'lucide-react'

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
    stat: '₹12,000',
    title: 'Average annual expired stock loss',
    description: 'Medicines expire silently. By the time you notice, the loss is already done.',
  },
  {
    icon: TrendingDown,
    stat: '2 days',
    title: 'Lost per year to GST filing',
    description: 'Manually compiling HSN codes, tax rates, and invoice numbers for your CA is a full weekend every month.',
  },
]

export default function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
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
            id="problem-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Manual billing is costing you more than you think
          </h2>
          <p className="text-gray-500 text-lg">
            Every pharmacy dealing with paper bills and outdated software is bleeding time, customers, and money.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PAIN_POINTS.map((point, i) => (
            <motion.article
              key={point.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-200"
            >
              <point.icon className="h-8 w-8 text-red-400 mb-4" aria-hidden="true" />
              <p className="text-3xl font-bold text-slate-900 mb-1">{point.stat}</p>
              <h3 className="font-semibold text-slate-900 mb-2">{point.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{point.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
