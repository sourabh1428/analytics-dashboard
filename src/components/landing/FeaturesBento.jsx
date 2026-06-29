'use client'

import { motion } from 'framer-motion'
import { Bell, Users, LayoutDashboard, Radio, BarChart3, BookOpen } from 'lucide-react'

const FEATURES = [
  {
    icon: Bell,
    tag: 'Refill Reminders',
    title: 'Patients get a WhatsApp reminder on exactly the right day — automatically',
    description: "Log a purchase, set the interval, and EasiBill does the rest. At 9 AM on the refill date, a personalised WhatsApp message goes out from your own number. You don't touch anything.",
    size: 'large',
    accent: 'blue',
    visual: (
      <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm space-y-3">
        {[
          { initials: 'RK', name: 'Ramesh Kumar', drug: 'Metformin 500mg', status: 'Sent · 9:02 AM', color: 'text-green-600 bg-green-50' },
          { initials: 'SG', name: 'Sunita Gupta', drug: 'Amlodipine 5mg', status: 'Due today', color: 'text-amber-600 bg-amber-50' },
          { initials: 'MD', name: 'Mohan Das', drug: 'Atorvastatin 20mg', status: 'Overdue 5d', color: 'text-red-600 bg-red-50' },
        ].map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-700 shrink-0">{p.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{p.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{p.drug}</p>
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
    accent: 'purple',
    visual: null,
  },
  {
    icon: LayoutDashboard,
    tag: 'Daily Queue',
    title: "Start every morning knowing exactly who needs a call",
    description: "The daily queue shows who's due today, who's overdue, and who recently refilled — sorted by urgency. Your team works the list, not their memory.",
    size: 'small',
    accent: 'orange',
    visual: null,
  },
  {
    icon: Radio,
    tag: 'Broadcast Campaigns',
    title: 'One message to 300 patients in two minutes',
    description: 'Target by condition, inactivity, or tag. Promote health camps, loyalty offers, and seasonal messages. Personalised per patient. Scheduled delivery.',
    size: 'small',
    accent: 'teal',
    visual: null,
  },
  {
    icon: BarChart3,
    tag: 'Retention Analytics',
    title: 'Know exactly which patients you are keeping — and losing',
    description: 'Refill rate, recovered refills, inactive patients, and revenue impact — all calculated from your actual dispensing data. Monthly and trend views included.',
    size: 'small',
    accent: 'rose',
    visual: null,
  },
  {
    icon: BookOpen,
    tag: 'Medicine Catalog',
    title: 'Your most-dispensed medicines, with default intervals pre-set',
    description: 'Add your commonly dispensed medicines once. Auto-suggest when logging a sale. Set Metformin to 28 days and Vitamin D to 90 days — apply to every patient instantly.',
    size: 'small',
    accent: 'blue',
    visual: null,
  },
]

const ACCENT_CLASSES = {
  blue: 'bg-violet-50 text-violet-700 border-violet-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  teal: 'bg-teal-50 text-teal-700 border-teal-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
}

const ICON_ACCENT_CLASSES = {
  blue: 'text-violet-600',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  teal: 'text-teal-500',
  rose: 'text-rose-500',
}

export default function FeaturesBento() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="features-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            One WhatsApp message at the right time.{' '}
            <span className="text-violet-600">Everything else is noise.</span>
          </h2>
          <p className="text-gray-500 text-lg">
            EasiBill does one thing better than any tool in the market: it sends your patients a refill reminder on exactly the right day. The rest supports that mission.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.article
              key={feature.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-200 ${
                feature.size === 'large' ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <feature.icon
                  className={`h-7 w-7 ${ICON_ACCENT_CLASSES[feature.accent]}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ACCENT_CLASSES[feature.accent]}`}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              {feature.visual}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
