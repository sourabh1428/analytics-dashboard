'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { Clock, UserX, FileWarning, TrendingDown } from 'lucide-react'
import { fadeUp, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import { useRef, useEffect } from 'react'

const PAIN_POINTS = [
  {
    icon: Clock,
    stat: '8 min',
    title: 'Average time for a manual bill',
    description: 'Hand-written or desktop software bills slow your queue. Customers leave before they get to the counter.',
  },
  {
    icon: UserX,
    stat: '6 in 10',
    title: "Customers who don't return",
    description: 'Without reminders, customers forget to follow up. They buy from the business closest to them next time — not yours.',
  },
  {
    icon: FileWarning,
    stat: '$500+',
    title: 'Average annual expired-stock loss',
    description: 'Perishable or seasonal stock expires quietly. By the time you notice, the loss is already done.',
  },
  {
    icon: TrendingDown,
    stat: '2 days',
    title: 'Lost per year to tax compliance',
    description: 'Manually compiling tax codes, rates, and invoice numbers for your accountant is a full weekend every month.',
  },
]

const HEADING = ['Manual', 'billing', 'is', 'costing', 'you', 'more', 'than', 'you', 'think']

export default function Problem() {
  const posthog = usePostHog()
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { posthog?.capture('problem_section_viewed'); obs.disconnect() }
    }, { rootMargin: '-80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [posthog])

  // Vertical line fills with actual scroll progress through the list.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.5'] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })

  return (
    <section
      id="problem"
      ref={ref}
      aria-labelledby="problem-heading"
      className="relative py-24 px-6 bg-[#18181B] overflow-hidden"
    >
      <div
        className="absolute top-1/3 left-1/4 -translate-x-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(248,113,113,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.h2
            id="problem-heading"
            variants={stagger}
            className="text-4xl font-bold text-white mb-4 leading-tight"
          >
            {HEADING.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg">
            Every local business dealing with paper bills and outdated software is bleeding time, customers, and money.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Vertical connector — fills with scroll position, not a one-shot reveal */}
          <div className="absolute left-6 sm:left-8 top-2 bottom-2 w-px bg-zinc-800" aria-hidden="true">
            <motion.div
              className="w-full bg-gradient-to-b from-red-400 to-orange-300 origin-top"
              style={{ scaleY: lineProgress, height: '100%' }}
            />
          </div>

          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              viewport={viewport}
              className={`relative flex items-start gap-6 sm:gap-10 pl-16 sm:pl-24 py-9 ${
                i !== PAIN_POINTS.length - 1 ? 'border-b border-zinc-800/70' : ''
              }`}
            >
              <span className="absolute left-0 top-9 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#18181B] border border-zinc-800">
                <point.icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" aria-hidden="true" />
              </span>

              <p className="shrink-0 w-28 sm:w-40 text-4xl sm:text-5xl font-black leading-none bg-gradient-to-br from-red-400 to-orange-300 bg-clip-text text-transparent">
                {point.stat}
              </p>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-zinc-100 mb-1.5">{point.title}</h3>
                <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
