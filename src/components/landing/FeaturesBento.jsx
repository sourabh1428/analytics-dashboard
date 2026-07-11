'use client'

import { motion } from 'framer-motion'
import { Bell, Users, LayoutDashboard, Radio, BarChart3, BookOpen } from 'lucide-react'
import { fadeUp, scaleIn, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import { useRef, useEffect } from 'react'

const FEATURES = [
  {
    icon: Bell,
    tag: 'Follow-up Reminders',
    title: 'Customers get a WhatsApp reminder on exactly the right day — automatically',
    description: "Log a purchase, set the interval, and EasiBill does the rest. At 9 AM on the follow-up date, a personalised WhatsApp message goes out from your own number. You don't touch anything.",
    size: 'large',
    accent: 'amber',
    visual: (
      <div className="mt-6 bg-zinc-900 rounded-xl p-4 text-sm space-y-3 border border-zinc-800">
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
    title: 'Every customer, every item, every interval — in one place',
    description: 'Add customers with their WhatsApp number, item or service, and follow-up cadence. Tag by segment. Import your existing list from CSV. Search in under a second.',
    size: 'small',
    accent: 'amber',
  },
  {
    icon: LayoutDashboard,
    tag: 'Daily Queue',
    title: 'Start every morning knowing exactly who needs a call',
    description: "The daily queue shows who's due today, who's overdue, and who recently followed up — sorted by urgency. Your team works the list, not their memory.",
    size: 'small',
    accent: 'orange',
  },
  {
    icon: Radio,
    tag: 'Broadcast Campaigns',
    title: 'One message to 300 customers in two minutes',
    description: 'Target by segment, inactivity, or tag. Promote seasonal sales, loyalty offers, and event messages. Personalised per customer. Scheduled delivery.',
    size: 'small',
    accent: 'teal',
  },
  {
    icon: BarChart3,
    tag: 'Retention Analytics',
    title: 'Know exactly which customers you are keeping — and losing',
    description: 'Follow-up rate, recovered follow-ups, inactive customers, and revenue impact — all calculated from your actual sales data. Monthly and trend views included.',
    size: 'small',
    accent: 'rose',
  },
  {
    icon: BookOpen,
    tag: 'Item Catalog',
    title: 'Your most-sold items, with default intervals pre-set',
    description: 'Add your commonly sold items once. Auto-suggest when logging a sale. Set a 28-day interval for one item and 90 days for another — apply to every customer instantly.',
    size: 'small',
    accent: 'amber',
  },
]

const ICON_ACCENT = {
  amber: 'text-amber-400',
  orange: 'text-orange-400',
  teal: 'text-teal-400',
  rose: 'text-rose-400',
}

const TAG_ACCENT = {
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
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

  return (
    <section
      id="features"
      ref={ref}
      aria-labelledby="features-heading"
      className="py-24 px-6 bg-[#09090B]"
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

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
          }}
        >
          {FEATURES.map((feature) => (
            <motion.article
              key={feature.tag}
              variants={scaleIn}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onHoverStart={() => posthog?.capture('feature_card_hovered', { feature: feature.tag })}
              className={`bg-[#18181B] rounded-2xl border border-zinc-800 p-6 flex flex-col ${
                feature.size === 'large' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon
                  className={`h-7 w-7 ${ICON_ACCENT[feature.accent]}`}
                  aria-hidden="true"
                />
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_ACCENT[feature.accent]}`}>
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
              {feature.visual}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
