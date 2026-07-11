'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { slideLeft, slideRight, fadeUp, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import { useRef, useEffect } from 'react'

const TESTIMONIALS = [
  {
    quote: "My old system took 5 minutes per bill. Now it's 30 seconds and the customer gets it directly on WhatsApp. They can view it any time — no more 'can you resend the invoice?'",
    name: 'Rajesh Verma',
    role: 'Owner, Verma Medical Store',
    location: 'Jaipur',
    since: 'Using EasiBill since March 2024',
    initials: 'RV',
    enterFrom: slideLeft,
  },
  {
    quote: "The refill reminders alone brought back 40% of customers who used to just forget. I didn't change anything else — just switched to EasiBill. The numbers spoke for themselves in 3 months.",
    name: 'Sunita Patel',
    role: 'Owner, Patel Pharma',
    location: 'Ahmedabad',
    since: 'Using EasiBill since January 2024',
    initials: 'SP',
    enterFrom: fadeUp,
  },
  {
    quote: "Tax filing used to take my whole weekend every month. Now I export from EasiBill and my accountant finishes it in one hour. I get my Sunday back. Worth every penny.",
    name: 'Mohammed Arif',
    role: 'Owner, City Medical Hall',
    location: 'Hyderabad',
    since: 'Using EasiBill since October 2023',
    initials: 'MA',
    enterFrom: slideRight,
  },
]

const H2_WORDS = ['Business', 'owners', 'who', 'switched', 'never', 'went', 'back']

export default function Testimonials() {
  const posthog = usePostHog()
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { posthog?.capture('testimonials_section_viewed'); obs.disconnect() }
    }, { rootMargin: '-80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [posthog])

  return (
    <section
      id="testimonials"
      ref={ref}
      aria-labelledby="testimonials-heading"
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
            id="testimonials-heading"
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
            Real store owners. Real results. No marketing language.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial="hidden"
              whileInView="visible"
              variants={t.enterFrom}
              transition={{ delay: i * 0.12 }}
              viewport={viewport}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-[#18181B] rounded-2xl border border-zinc-800 p-7 flex flex-col gap-5"
            >
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="text-zinc-300 text-base leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                <div
                  className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-400 shrink-0"
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-zinc-200 text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role} · {t.location}</p>
                  <p className="text-xs mt-0.5 text-amber-500">{t.since}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
