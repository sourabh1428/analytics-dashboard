'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'
import { Bell, Users, LayoutDashboard, Radio, BarChart3, BookOpen, ArrowUpRight, Search, CheckCircle2 } from 'lucide-react'
import { fadeUp, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import { useRef, useEffect } from 'react'

function CustomerRecordsVisual() {
  const rows = [
    { name: 'Ramesh Kumar', tag: 'High-value', color: 'bg-emerald-500/15 text-emerald-400' },
    { name: 'Sunita Gupta', tag: 'Regular', color: 'bg-sky-500/15 text-sky-400' },
    { name: 'Mohan Das', tag: 'Lapsing', color: 'bg-amber-500/15 text-amber-400' },
  ]
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 mb-3">
        <Search className="h-3.5 w-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
        <motion.span
          className="text-xs text-zinc-500"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.85, 1] }}
        >
          Search customers…
        </motion.span>
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.name}
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-zinc-300">{r.name}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${r.color}`}>{r.tag}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DailyQueueVisual() {
  const items = [
    { name: 'Priya Shah', status: 'Overdue', color: 'text-red-400' },
    { name: 'Anil Mehta', status: 'Due today', color: 'text-amber-400' },
  ]
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm space-y-2.5">
      {items.map((it) => (
        <div key={it.name} className="flex items-center justify-between text-xs">
          <span className="text-zinc-300">{it.name}</span>
          <span className={`font-medium ${it.color}`}>{it.status}</span>
        </div>
      ))}
      <div className="flex items-center justify-between text-xs border-t border-zinc-800 pt-2.5">
        <span className="text-zinc-500 line-through">Kavita Rao</span>
        <motion.span
          className="flex items-center gap-1 text-emerald-400 font-medium"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Done
        </motion.span>
      </div>
    </div>
  )
}

function BroadcastVisual() {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs text-zinc-300 font-medium">Weekend Sale broadcast</span>
        <motion.span
          className="text-[10px] text-teal-400 font-semibold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          ● Sending
        </motion.span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-2">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-400 to-teal-300"
          initial={{ width: '0%' }}
          whileInView={{ width: '78%' }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        />
      </div>
      <p className="text-[10px] text-zinc-500">234 / 300 delivered</p>
    </div>
  )
}

function RetentionVisual() {
  const bars = [40, 65, 52, 80, 95]
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm">
      <div className="flex items-end gap-2 h-24">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-rose-500/40 to-rose-300"
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          />
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 mt-2.5">Retention rate, last 5 months</p>
    </div>
  )
}

function CatalogVisual() {
  const items = [
    { name: 'Loyalty Reorder Pack', interval: '28d' },
    { name: 'Wellness Bundle', interval: '90d' },
    { name: 'Wireless Earbuds', interval: '—' },
  ]
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 w-full max-w-sm space-y-2.5">
      {items.map((it, i) => (
        <motion.div
          key={it.name}
          className="flex items-center justify-between text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <span className="text-zinc-300">{it.name}</span>
          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{it.interval}</span>
        </motion.div>
      ))}
    </div>
  )
}

const FEATURES = [
  {
    icon: Bell,
    tag: 'Follow-up Reminders',
    href: '/features/follow-up-reminders',
    title: 'Customers get a WhatsApp reminder on exactly the right day — automatically',
    description: "Log a purchase, set the interval, and EasiBill does the rest. At 9 AM on the follow-up date, a personalised WhatsApp message goes out from your own number. You don't touch anything.",
    accent: 'amber',
    glow: 'rgba(245,158,11,0.14)',
    visual: (
      <div className="bg-zinc-900 rounded-xl p-4 text-sm space-y-3 border border-zinc-800 w-full max-w-sm">
        {[
          { initials: 'RK', name: 'Ramesh Kumar', drug: 'Loyalty reorder', status: 'Sent · 9:02 AM', color: 'text-emerald-400 bg-emerald-500/10' },
          { initials: 'SG', name: 'Sunita Gupta', drug: 'Monthly top-up', status: 'Due today', color: 'text-amber-400 bg-amber-500/10' },
          { initials: 'MD', name: 'Mohan Das', drug: 'Reorder item', status: 'Overdue 5d', color: 'text-red-400 bg-red-500/10' },
        ].map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400 shrink-0">{p.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{p.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{p.drug}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.color}`}>{p.status}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Users,
    tag: 'Customer Records',
    href: '/features/patient-records',
    title: 'Every customer, every item, every interval — in one place',
    description: 'Add customers with their WhatsApp number, item or service, and follow-up cadence. Tag by segment. Import your existing list from CSV. Search in under a second.',
    accent: 'amber',
    glow: 'rgba(245,158,11,0.14)',
    visual: <CustomerRecordsVisual />,
  },
  {
    icon: LayoutDashboard,
    tag: 'Daily Queue',
    href: '/features/daily-queue',
    title: 'Start every morning knowing exactly who needs a call',
    description: "The daily queue shows who's due today, who's overdue, and who recently followed up — sorted by urgency. Your team works the list, not their memory.",
    accent: 'orange',
    glow: 'rgba(251,146,60,0.14)',
    visual: <DailyQueueVisual />,
  },
  {
    icon: Radio,
    tag: 'Broadcast Campaigns',
    href: '/features/broadcast-campaigns',
    title: 'One message to 300 customers in two minutes',
    description: 'Target by segment, inactivity, or tag. Promote seasonal sales, loyalty offers, and event messages. Personalised per customer. Scheduled delivery.',
    accent: 'teal',
    glow: 'rgba(45,212,191,0.14)',
    visual: <BroadcastVisual />,
  },
  {
    icon: BarChart3,
    tag: 'Retention Analytics',
    href: '/features/retention-analytics',
    title: 'Know exactly which customers you are keeping — and losing',
    description: 'Follow-up rate, recovered follow-ups, inactive customers, and revenue impact — all calculated from your actual sales data. Monthly and trend views included.',
    accent: 'rose',
    glow: 'rgba(251,113,133,0.14)',
    visual: <RetentionVisual />,
  },
  {
    icon: BookOpen,
    tag: 'Item Catalog',
    href: '/features',
    title: 'Your most-sold items, with default intervals pre-set',
    description: 'Add your commonly sold items once. Auto-suggest when logging a sale. Set a 28-day interval for one item and 90 days for another — apply to every customer instantly.',
    accent: 'amber',
    glow: 'rgba(245,158,11,0.14)',
    visual: <CatalogVisual />,
  },
]

const ICON_ACCENT = {
  amber: 'text-amber-400',
  orange: 'text-orange-400',
  teal: 'text-teal-400',
  rose: 'text-rose-400',
}

const TAG_ACCENT = {
  amber: 'text-amber-400',
  orange: 'text-orange-400',
  teal: 'text-teal-400',
  rose: 'text-rose-400',
}

const H2_WORDS_1 = ['One', 'WhatsApp', 'message', 'at', 'the', 'right', 'time.']
const H2_WORDS_2 = ['Everything', 'else', 'is', 'noise.']

export default function FeaturesBento() {
  const posthog = usePostHog()
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { posthog?.capture('features_section_viewed'); obs.disconnect() }
    }, { rootMargin: '-80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [posthog])

  // Connector line down the spine — fills with actual scroll position.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.4'] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 24, restDelta: 0.001 })

  return (
    <section
      id="features"
      ref={ref}
      aria-labelledby="features-heading"
      className="relative py-24 px-6 bg-[#09090B] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.h2
            id="features-heading"
            variants={stagger}
            className="text-4xl font-bold text-white mb-4 leading-tight"
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
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg">
            EasiBill does one thing better than any tool in the market: it sends your customers a follow-up reminder on exactly the right day. The rest supports that mission.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Spine — fills with scroll, not a one-shot reveal */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-zinc-800" aria-hidden="true">
            <motion.div
              className="w-full bg-gradient-to-b from-amber-400 to-amber-200 origin-top"
              style={{ scaleY: lineProgress, height: '100%' }}
            />
          </div>

          {FEATURES.map((feature, i) => {
            const reversed = i % 2 === 1
            return (
              <motion.div
                key={feature.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={viewport}
                onViewportEnter={() => posthog?.capture('feature_row_viewed', { feature: feature.tag })}
                className="relative"
              >
                <div
                  className="absolute inset-0 -z-10 pointer-events-none"
                  style={{ background: `radial-gradient(480px circle at ${reversed ? '80%' : '20%'} 50%, ${feature.glow}, transparent 70%)` }}
                  aria-hidden="true"
                />

                <Link
                  href={feature.href}
                  onClick={() => posthog?.capture('feature_row_clicked', { feature: feature.tag })}
                  className={`group flex flex-col sm:flex-row ${reversed ? 'sm:flex-row-reverse' : ''} items-center gap-8 sm:gap-14 py-14 rounded-2xl transition-colors duration-200 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 -mx-4 px-4`}
                >
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-4 ${TAG_ACCENT[feature.accent]}`}>
                      <feature.icon className="h-4 w-4" aria-hidden="true" />
                      {feature.tag}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 leading-snug group-hover:text-white transition-colors">{feature.title}</h3>
                    <p className="text-zinc-500 text-base leading-relaxed max-w-md sm:max-w-none mx-auto sm:mx-0">{feature.description}</p>
                  </div>

                  <div className="flex-1 flex items-center justify-center w-full">
                    {feature.visual ?? (
                      <feature.icon
                        className={`h-28 w-28 sm:h-36 sm:w-36 ${ICON_ACCENT[feature.accent]} opacity-[0.14] transition-opacity duration-200 group-hover:opacity-[0.22]`}
                        strokeWidth={1}
                        aria-hidden="true"
                      />
                    )}
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
