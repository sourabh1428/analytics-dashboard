'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'
import { Wand2, Tags, Workflow, Megaphone, ArrowUpRight } from 'lucide-react'
import { fadeUp, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import { useRef } from 'react'

function TemplateGenVisual() {
  const drafts = [
    { text: 'Hi {name}, your order is ready for pickup! 🎉', active: true },
    { text: 'Your order is waiting — swing by anytime today.', active: false },
  ]
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm space-y-2.5">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
        <Wand2 className="h-3.5 w-3.5 text-violet-400 shrink-0" aria-hidden="true" />
        <span className="text-xs text-zinc-400 truncate">&ldquo;Order ready for pickup&rdquo;</span>
      </div>
      {drafts.map((d, i) => (
        <motion.div
          key={d.text}
          className={`text-[11px] rounded-lg px-3 py-2 border ${d.active ? 'border-violet-500/40 bg-violet-500/10 text-violet-200' : 'border-zinc-800 bg-zinc-950 text-zinc-500'}`}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
          viewport={{ once: true }}
        >
          {d.text}
        </motion.div>
      ))}
    </div>
  )
}

function SegmentationVisual() {
  const groups = [
    { color: 'bg-emerald-400', label: 'High-value', count: 3 },
    { color: 'bg-sky-400', label: 'Regular', count: 4 },
    { color: 'bg-amber-400', label: 'Lapsing', count: 2 },
  ]
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm space-y-3">
      {groups.map((g, gi) => (
        <div key={g.label} className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 w-16 shrink-0">{g.label}</span>
          <div className="flex -space-x-1.5">
            {Array.from({ length: g.count }).map((_, i) => (
              <motion.span
                key={i}
                className={`h-4 w-4 rounded-full ${g.color} ring-2 ring-zinc-900`}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: gi * 0.15 + i * 0.05, type: 'spring', stiffness: 300 }}
                viewport={{ once: true }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AutomationVisual() {
  const nodes = ['Trigger', 'Wait 45d', 'Send message']
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm">
      <div className="flex items-center justify-center flex-wrap gap-1">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center">
            <motion.div
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[10px] font-medium text-amber-300 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 260 }}
              viewport={{ once: true }}
            >
              {n}
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.div
                className="h-px w-6 bg-amber-500/40 mx-1"
                style={{ originX: 0 }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: i * 0.2 + 0.15, duration: 0.3 }}
                viewport={{ once: true }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CampaignVisual() {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">Weekend Sale · Loyalty segment</span>
        <motion.span
          className="text-[10px] font-semibold text-rose-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          ● Generating
        </motion.span>
      </div>
      <motion.p
        className="text-[11px] text-zinc-300 leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        &ldquo;This weekend only — 20% off for our loyalty members. Reply YES to claim before Sunday.&rdquo;
      </motion.p>
      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
        <span className="rounded-full bg-zinc-950 border border-zinc-800 px-2 py-0.5">Best time: 10 AM</span>
        <span className="rounded-full bg-zinc-950 border border-zinc-800 px-2 py-0.5">142 recipients</span>
      </div>
    </div>
  )
}

// None of these AI capabilities have a dedicated page yet — link to the
// real /features overview rather than inventing routes that don't exist.
const AI_FEATURES = [
  {
    icon: Wand2,
    tag: 'AI Template Generator',
    href: '/features',
    title: 'Describe the message once — AI writes the WhatsApp template',
    description: 'Type "remind customers their order is ready" and AI drafts three on-brand versions in seconds. You pick one, tweak the wording, and it is live.',
    accent: 'violet',
    glow: 'rgba(139,92,246,0.16)',
    visual: <TemplateGenVisual />,
  },
  {
    icon: Tags,
    tag: 'AI Segmentation',
    href: '/features',
    title: 'Customer groups form themselves from buying patterns',
    description: 'No manual tagging. AI scans purchase history and groups customers into segments — high-value, lapsing, seasonal — that update automatically as new sales come in.',
    accent: 'sky',
    glow: 'rgba(56,189,248,0.16)',
    visual: <SegmentationVisual />,
  },
  {
    icon: Workflow,
    tag: 'AI Automation Builder',
    href: '/features',
    title: 'Type the rule in plain language, AI wires up the automation',
    description: '"Follow up with anyone who has not bought in 45 days" becomes a working automation — trigger, interval, and message — without touching a settings panel.',
    accent: 'amber',
    glow: 'rgba(245,158,11,0.16)',
    visual: <AutomationVisual />,
  },
  {
    icon: Megaphone,
    tag: 'AI Campaign Copywriter',
    href: '/features',
    title: 'Broadcast and sale campaigns, drafted for you',
    description: 'Give it the offer and the audience — AI writes the broadcast copy, suggests send times based on past open rates, and schedules delivery.',
    accent: 'rose',
    glow: 'rgba(251,113,133,0.16)',
    visual: <CampaignVisual />,
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
                className="relative"
              >
                <div
                  className="absolute inset-0 -z-10 pointer-events-none"
                  style={{ background: `radial-gradient(480px circle at ${reversed ? '80%' : '20%'} 50%, ${feature.glow}, transparent 70%)` }}
                  aria-hidden="true"
                />

                <Link
                  href={feature.href}
                  onClick={() => posthog?.capture('ai_studio_row_clicked', { feature: feature.tag })}
                  className={`group flex flex-col sm:flex-row ${reversed ? 'sm:flex-row-reverse' : ''} items-center gap-8 sm:gap-14 py-14 rounded-2xl transition-colors duration-200 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 -mx-4 px-4`}
                >
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4 ${ICON_ACCENT[feature.accent]}`}>
                      <feature.icon className="h-4 w-4" aria-hidden="true" />
                      {feature.tag}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 leading-snug group-hover:text-white transition-colors">{feature.title}</h3>
                    <p className="text-zinc-500 text-base leading-relaxed max-w-md sm:max-w-none mx-auto sm:mx-0">{feature.description}</p>
                  </div>

                  <div className="flex-1 flex items-center justify-center w-full">
                    {feature.visual}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
