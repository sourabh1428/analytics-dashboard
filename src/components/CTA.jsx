'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { blurFadeUp } from '@/lib/motion'

const CTA = () => {
  const router = useRouter();

  return (
    <section className="relative py-24 overflow-hidden bg-[#09090B]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative container mx-auto px-6 text-white">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            variants={blurFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Limited Time Offer</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={blurFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center leading-tight"
          >
            <span>Ready to Grow Your </span>
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Pharmacy?</span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={blurFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-300 text-center mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join 2,400+ independent pharmacies using EasiBill to automate patient retention, increase refills, and grow revenue. Start free today — no card required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={blurFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/lead')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 group"
            >
              Start Your 14-Day Free Trial
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/contact')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-zinc-600 text-zinc-200 font-semibold rounded-lg hover:bg-zinc-800/50 hover:border-zinc-500 backdrop-blur-sm transition-all duration-300"
            >
              Schedule a Demo
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={blurFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>2,400+ pharmacies active</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>18M+ bills sent</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>99.9% uptime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(CTA);

