'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { stagger, wordVariant, fadeUp, scaleIn, viewport } from '@/src/lib/motion'

const H2_WORDS_1 = ['Stop', 'losing', 'patients']
const H2_WORDS_2 = ['to', 'forgetfulness.']

export default function FinalCTA() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative py-24 px-6 bg-[#09090B] overflow-hidden"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #27272A 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      {/* Amber glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.1) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
        >
          <motion.h2
            id="cta-heading"
            variants={stagger}
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {H2_WORDS_1.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
            <br className="hidden sm:block" />
            {H2_WORDS_2.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em] text-amber-400">
                {word}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p variants={fadeUp} className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            EasiBill runs the reminders. You run the pharmacy. Free to start — no card needed.
          </motion.p>

          <motion.div variants={scaleIn} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://dashboard.easibill.com/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 text-base min-h-[52px]"
            >
              Start free — no card needed
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs text-zinc-600 mt-5">
            14-day free trial. Setup in under 30 minutes. Cancel any time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
