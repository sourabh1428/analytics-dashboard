'use client'

import { motion } from 'framer-motion'
import { Wand2, Tags, Workflow, Megaphone } from 'lucide-react'
import { fadeUp, scaleIn, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import TiltCard from './TiltCard'

const AI_FEATURES = [
  {
    icon: Wand2,
    tag: 'AI Template Generator',
    title: 'Describe the message once — AI writes the WhatsApp template',
    description: 'Type "remind customers their order is ready" and AI drafts three on-brand versions in seconds. You pick one, tweak the wording, and it is live.',
    accent: 'violet',
  },
  {
    icon: Tags,
    tag: 'AI Segmentation',
    title: 'Customer groups form themselves from buying patterns',
    description: 'No manual tagging. AI scans purchase history and groups customers into segments — high-value, lapsing, seasonal — that update automatically as new sales come in.',
    accent: 'sky',
  },
  {
    icon: Workflow,
    tag: 'AI Automation Builder',
    title: 'Type the rule in plain language, AI wires up the automation',
    description: '"Follow up with anyone who has not bought in 45 days" becomes a working automation — trigger, interval, and message — without touching a settings panel.',
    accent: 'amber',
  },
  {
    icon: Megaphone,
    tag: 'AI Campaign Copywriter',
    title: 'Broadcast and sale campaigns, drafted for you',
    description: 'Give it the offer and the audience — AI writes the broadcast copy, suggests send times based on past open rates, and schedules delivery.',
    accent: 'rose',
  },
]

const ACCENT = {
  violet: { icon: 'text-violet-400', tag: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  sky: { icon: 'text-sky-400', tag: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  amber: { icon: 'text-amber-400', tag: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  rose: { icon: 'text-rose-400', tag: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
}

const H2_WORDS = ['The', 'AI', 'does', 'the', 'busywork.']

export default function AIStudio() {
  const posthog = usePostHog()

  return (
    <section
      aria-labelledby="ai-studio-heading"
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

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.div
            variants={scaleIn}
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

        <motion.div
          className="grid md:grid-cols-2 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
          }}
        >
          {AI_FEATURES.map((feature) => (
            <TiltCard
              key={feature.tag}
              variants={scaleIn}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onHoverStart={() => posthog?.capture('ai_studio_card_hovered', { feature: feature.tag })}
              className="bg-[#18181B] rounded-2xl border border-zinc-800 p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon className={`h-7 w-7 ${ACCENT[feature.accent].icon}`} aria-hidden="true" />
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ACCENT[feature.accent].tag}`}>
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
