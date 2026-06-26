'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "My old system took 5 minutes per bill. Now it's 30 seconds and the customer gets it directly on WhatsApp. They can view it any time — no more 'can you resend the invoice?'",
    name: 'Rajesh Verma',
    role: 'Owner, Verma Medical Store',
    location: 'Jaipur',
    since: 'Using EasiBill since March 2024',
    initials: 'RV',
    color: 'blue',
  },
  {
    quote: "The refill reminders alone brought back 40% of customers who used to just forget. I didn't change anything else — just switched to EasiBill. The numbers spoke for themselves in 3 months.",
    name: 'Sunita Patel',
    role: 'Owner, Patel Pharma',
    location: 'Ahmedabad',
    since: 'Using EasiBill since January 2024',
    initials: 'SP',
    color: 'indigo',
  },
  {
    quote: "Tax filing used to take my whole weekend every month. Now I export from EasiBill and my accountant finishes it in one hour. I get my Sunday back. Worth every penny.",
    name: 'Mohammed Arif',
    role: 'Owner, City Medical Hall',
    location: 'Hyderabad',
    since: 'Using EasiBill since October 2023',
    initials: 'MA',
    color: 'sky',
  },
]

const AVATAR_COLORS = {
  blue: 'bg-blue-100 text-blue-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  sky: 'bg-sky-100 text-sky-700',
}

const SINCE_COLORS = {
  blue: 'text-blue-600',
  indigo: 'text-indigo-600',
  sky: 'text-sky-600',
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
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
            id="testimonials-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Pharmacists who switched never went back
          </h2>
          <p className="text-gray-500 text-lg">
            Real store owners. Real results. No marketing language.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-5 transition-all duration-200"
            >
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="text-slate-900 text-base leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${AVATAR_COLORS[t.color]}`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.location}</p>
                  <p className={`text-xs mt-0.5 ${SINCE_COLORS[t.color]}`}>{t.since}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
