'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative py-24 px-6 bg-[#0D0B1E] overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Join 2,400+ pharmacies already on EasiBill
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Free to start. No credit card. Cancel any time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base min-h-[52px]"
            >
              Start free — no card needed
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:support@easibill.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:border-gray-500 hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base min-h-[52px]"
            >
              Talk to us first
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
