'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { fadeUp, scaleIn, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'

// TODO(video): replace the placeholder panel below with the real embed once the
// demo video is produced. Swap the <div className="aspect-video ..."> block for
// either a <video> tag (self-hosted, src="/videos/product-demo.mp4", poster=
// "/videos/product-demo-poster.jpg") or an <iframe> (YouTube/Vimeo/Wistia embed
// URL). Keep the aspect-video wrapper and rounded-2xl/border/shadow classes so
// it matches the rest of the section.
const H2_WORDS = ['See', 'it', 'run', 'a', 'real', 'counter.']

export default function ProductDemo() {
  const posthog = usePostHog()

  return (
    <section
      aria-labelledby="product-demo-heading"
      className="py-24 px-6 bg-[#18181B]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.h2
            id="product-demo-heading"
            variants={stagger}
            className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
          >
            {H2_WORDS.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg">
            Two minutes, start to finish: log a sale, send the bill on WhatsApp, and watch the follow-up get scheduled automatically.
          </motion.p>
        </motion.div>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative"
        >
          <div
            className="absolute -inset-x-10 -inset-y-6 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Placeholder demo panel — swap for real <video>/<iframe> embed, see TODO above */}
          <div className="relative aspect-video rounded-2xl border border-zinc-800 bg-[#09090B] shadow-2xl shadow-black/40 overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle, #27272A 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => posthog?.capture('product_demo_play_clicked')}
              aria-label="Play product demo video"
              className="relative z-10 flex flex-col items-center gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-2xl p-4"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30 transition-transform duration-150 group-hover:scale-105">
                <Play className="h-6 w-6 ml-0.5" fill="currentColor" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                Watch the 2-minute walkthrough
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
