'use client'

import { motion } from 'framer-motion'
import { Bell, Users, LayoutDashboard, Radio, BarChart3, BookOpen } from 'lucide-react'
import { fadeUp, scaleIn, stagger, wordVariant, viewport } from '@/src/lib/motion'

const FEATURES = [
  {
    icon: Bell,
    tag: 'Refill Reminders',
    title: 'Patients get a WhatsApp reminder on exactly the right day — automatically',
    description: "Log a purchase, set the interval, and EasiBill does the rest. At 9 AM on the refill date, a personalised WhatsApp message goes out from your own number. You don't touch anything.",
    size: 'large',
    accent: 'amber',
    visual: (
      <div className="mt-6 bg-zinc-900 rounded-xl p-4 text-sm space-y-3 border border-zinc-800">
        {[
          { initials: 'RK', name: 'Ramesh Kumar', drug: 'Metformin 500mg', status: 'Sent · 9:02 AM', color: 'text-emerald-400 bg-emerald-500/10' },
          { initials: 'SG', name: 'Sunita Gupta', drug: 'Amlodipine 5mg', status: 'Due today', color: 'text-amber-400 bg-amber-500/10' },
          { initials: 'MD', name: 'Mohan Das', drug: 'Atorvastatin 20mg', status: 'Overdue 5d', color: 'text-red-400 bg-red-500/10' },
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
    tag: 'Patient Management',
    title: 'Every patient, every medicine, every interval — in one place',
    description: 'Add patients with their WhatsApp number, medicine, and refill cadence. Tag by condition. Import your existing list from CSV. Search in under a second.',
    size: 'small',
    accent: 'amber',
  },
  {
    icon: LayoutDashboard,
    tag: 'Daily Queue',
    title: 'Start every morning knowing exactly who needs a call',
    description: "The daily queue shows who's due today, who's overdue, and who recently refilled — sorted by urgency. Your team works the list, not their memory.",
    size: 'small',
    accent: 'orange',
  },
  {
    icon: Radio,
    tag: 'Broadcast Campaigns',
    title: 'One message to 300 patients in two minutes',
    description: 'Target by condition, inactivity, or tag. Promote health camps, loyalty offers, and seasonal messages. Personalised per patient. Scheduled delivery.',
    size: 'small',
    accent: 'teal',
  },
  {
    icon: BarChart3,
    tag: 'Retention Analytics',
    title: 'Know exactly which patients you are keeping — and losing',
    description: 'Refill rate, recovered refills, inactive patients, and revenue impact — all calculated from your actual dispensing data. Monthly and trend views included.',
    size: 'small',
    accent: 'rose',
  },
  {
    icon: BookOpen,
    tag: 'Medicine Catalog',
    title: 'Your most-dispensed medicines, with default intervals pre-set',
    description: 'Add your commonly dispensed medicines once. Auto-suggest when logging a sale. Set Metformin to 28 days and Vitamin D to 90 days — apply to every patient instantly.',
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
  return (
    <section
      id="features"
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
            EasiBill does one thing better than any tool in the market: it sends your patients a refill reminder on exactly the right day. The rest supports that mission.
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
