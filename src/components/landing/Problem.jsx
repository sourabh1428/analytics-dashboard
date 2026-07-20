'use client'

import { usePostHog } from 'posthog-js/react'
import { useEffect, useRef } from 'react'
import { lerp, seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines, Reveal } from './reveal'

const STATS = [
  {
    stat: '8 MIN',
    label: 'PER MANUAL BILL',
    copy: 'Hand-written bills slow your queue. Customers leave before they reach the counter.',
  },
  {
    stat: '6 / 10',
    label: 'CUSTOMERS NEVER RETURN',
    copy: 'Without reminders they forget — and buy from whoever is closest next time.',
  },
  {
    stat: '₹40K+',
    label: 'ANNUAL EXPIRED-STOCK LOSS',
    copy: 'Perishable stock expires quietly. By the time you notice, the loss is done.',
  },
  {
    stat: '2 DAYS',
    label: 'LOST MONTHLY TO TAX WORK',
    copy: 'Compiling tax codes and invoice numbers for your accountant eats a full weekend.',
  },
]

export default function Problem() {
  const posthog = usePostHog()
  const ref = useRef(null)
  const numRefs = useRef([])
  numRefs.current = []
  const addNum = (el) => { if (el) numRefs.current.push(el) }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { posthog?.capture('problem_section_viewed'); obs.disconnect() }
    }, { rootMargin: '-80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [posthog])

  // Distinct beat from the generic Reveal fade: the big stat numbers scale
  // and gain weight in as the row crosses into view, staggered per column,
  // layered on top of the Reveal fade+rise already on each card.
  useScrollReveal({
    ref,
    threshold: 0.2,
    duration: 900,
    onUpdate: (t) => {
      numRefs.current.forEach((el, i) => {
        const s = seg(t, i * 0.1, i * 0.1 + 0.55)
        el.style.opacity = String(s)
        el.style.transform = `scale(${lerp(0.82, 1, s)})`
      })
    },
  })

  return (
    <section id="problem" ref={ref} className="bg-ink text-paper">
      <div className="mx-auto max-w-[1360px] px-4 py-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-paper/25 pb-[18px] font-mono text-xs tracking-[0.14em] text-faint">
          <span>01 — THE LEAK</span>
          <span className="hidden sm:inline">WHAT MANUAL BILLING ACTUALLY COSTS</span>
        </div>

        <Lines
          className="mt-[42px] max-w-[900px] font-display text-[clamp(38px,4.2vw,64px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
          lines={[
            'Manual billing is costing you',
            <>more than you <span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal text-terracotta">think.</span></>,
          ]}
        />

        <div className="mt-16 grid grid-cols-1 border-t border-paper/25 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className={`pt-[30px] pr-[26px] ${i < STATS.length - 1 ? 'border-r border-paper/[0.18]' : ''}`}
            >
              <div
                ref={addNum}
                className="font-display text-[68px] font-extrabold leading-none text-ember [font-stretch:68%]"
                style={{ opacity: 0, willChange: 'transform, opacity' }}
              >
                {s.stat}
              </div>
              <div className="my-3.5 font-mono text-[11px] tracking-[0.12em] text-faint">{s.label}</div>
              <p className="text-[14.5px] leading-[1.55] text-paper/80">{s.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
