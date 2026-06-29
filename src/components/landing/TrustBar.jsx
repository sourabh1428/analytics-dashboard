'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGeo } from '@/src/hooks/useGeo'
import { fadeIn, viewport } from '@/src/lib/motion'

const STATS = [
  { value: 2400, suffix: '+', label: 'Pharmacies using EasiBill' },
  { value: 18, suffix: 'M+', label: 'Bills sent via WhatsApp' },
  { value: 34, suffix: '%', label: 'Average increase in repeat customers' },
  { value: 0, prefix: '$', suffix: '', label: 'Setup cost' },
]

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); obs.disconnect() } },
      { rootMargin: '-72px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!seen) return
    const duration = 1600
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [seen, value])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toLocaleString('en-US')}{suffix}
    </span>
  )
}

export default function TrustBar() {
  const geo = useGeo()

  const label = geo
    ? `Trusted by independent pharmacies in ${geo.flag} ${geo.countryName} and worldwide`
    : 'Trusted by independent pharmacies worldwide'

  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-[#09090B] border-y border-zinc-800 py-16 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.p
          id="trust-heading"
          key={label}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-10"
        >
          {label}
        </motion.p>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              viewport={viewport}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <p className="text-4xl font-bold text-white mb-1">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
