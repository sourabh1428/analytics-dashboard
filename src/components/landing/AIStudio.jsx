'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { Wand2, Tags, Workflow, Megaphone } from 'lucide-react'
import { fadeUp, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import { useRef } from 'react'

const AI_FEATURES = [
  {
    icon: Wand2,
    tag: 'AI Template Generator',
    title: 'Describe the message once — AI writes the WhatsApp template',
    description: 'Type "remind customers their order is ready" and AI drafts three on-brand versions in seconds. You pick one, tweak the wording, and it is live.',
    accent: 'violet',
    glow: 'rgba(139,92,246,0.16)',
  },
  {
    icon: Tags,
    tag: 'AI Segmentation',
    title: 'Customer groups form themselves from buying patterns',
    description: 'No manual tagging. AI scans purchase history and groups customers into segments — high-value, lapsing, seasonal — that update automatically as new sales come in.',
    accent: 'sky',
    glow: 'rgba(56,189,248,0.16)',
  },
  {
    icon: Workflow,
    tag: 'AI Automation Builder',
    title: 'Type the rule in plain language, AI wires up the automation',
    description: '"Follow up with anyone who has not bought in 45 days" becomes a working automation — trigger, interval, and message — without touching a settings panel.',
    accent: 'amber',
    glow: 'rgba(245,158,11,0.16)',
  },
  {
    icon: Megaphone,
    tag: 'AI Campaign Copywriter',
    title: 'Broadcast and sale campaigns, drafted for you',
    description: 'Give it the offer and the audience — AI writes the broadcast copy, suggests send times based on past open rates, and schedules delivery.',
    accent: 'rose',
    glow: 'rgba(251,113,133,0.16)',
  },
]

const ICON_ACCENT = {
  violet: 'text-violet-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
}

const H2_WORDS = ['The', 'AI', 'does', 'the', 'busywork.']

export default function AIStudio() {
  const posthog = usePostHog()
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.4'] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 24, restDelta: 0.001 })

  return (
    <section
      aria-labelledby="ai-studio-heading"
      ref={ref}
      className="relative py-24 px-6 bg-[#09090B] border-t border-zinc-800 overflow-hidden"
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '420px',
          background: 'radial-gradient(ellipse at center top, rgba(139,92,246,0.08) 0%, transparent 68%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6"
          >
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">AI-powered</span>
          </motion.div>
          <motion.h2
            id="ai-studio-heading"
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
            You still approve every message. AI just gets you from blank page to ready-to-send in seconds instead of twenty minutes.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-zinc-800" aria-hidden="true">
            <motion.div
              className="w-full bg-gradient-to-b from-violet-400 to-sky-300 origin-top"
              style={{ scaleY: lineProgress, height: '100%' }}
            />
          </div>

          {AI_FEATURES.map((feature, i) => {
            const reversed = i % 2 === 1
            return (
              <motion.div
                key={feature.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={viewport}
                onViewportEnter={() => posthog?.capture('ai_studio_row_viewed', { feature: feature.tag })}
                className={`relative flex flex-col sm:flex-row ${reversed ? 'sm:flex-row-reverse' : ''} items-center gap-8 sm:gap-14 py-14`}
              >
                <div
                  className="absolute inset-0 -z-10 pointer-events-none"
                  style={{ background: `radial-gradient(480px circle at ${reversed ? '80%' : '20%'} 50%, ${feature.glow}, transparent 70%)` }}
                  aria-hidden="true"
                />

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4 ${ICON_ACCENT[feature.accent]}`}>
                    <feature.icon className="h-4 w-4" aria-hidden="true" />
                    {feature.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 leading-snug">{feature.title}</h3>
                  <p className="text-zinc-500 text-base leading-relaxed max-w-md sm:max-w-none mx-auto sm:mx-0">{feature.description}</p>
                </div>

                <div className="flex-1 flex items-center justify-center w-full">
                  <feature.icon
                    className={`h-28 w-28 sm:h-36 sm:w-36 ${ICON_ACCENT[feature.accent]} opacity-[0.14]`}
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
