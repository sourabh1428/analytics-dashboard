'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { usePostHog } from 'posthog-js/react'
import { lerp, seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines } from './reveal'

const TESTIMONIALS = [
  {
    quote: '"My old system took 5 minutes per bill. Now it\'s 30 seconds and the customer gets it on WhatsApp. No more \'can you resend the invoice?\'"',
    name: 'RAJESH VERMA — VERMA MEDICAL STORE, JAIPUR',
    since: 'SINCE MAR 2024',
    image: '/images/testimonial-rajesh.png',
  },
  {
    quote: '"The follow-up reminders alone brought back 40% of customers who used to just forget. I changed nothing else. The numbers spoke in 3 months."',
    name: 'SUNITA PATEL — PATEL WELLNESS SPA, AHMEDABAD',
    since: 'SINCE JAN 2024',
    image: '/images/testimonial-sunita.png',
  },
  {
    quote: '"Tax filing used to take my whole weekend. Now I export from EasiBill and my accountant finishes in an hour. I get my Sunday back."',
    name: 'Swetha  — CITY MEDICAL HALL, HYDERABAD',
    since: 'SINCE OCT 2023',
    image: '/images/testimonial-arif.png',
  },
]

export default function Testimonials() {
  const posthog = usePostHog()
  const gridRef = useRef(null)
  const cardRefs = useRef([])
  cardRefs.current = []
  const addCard = (el) => { if (el) cardRefs.current.push(el) }

  // Distinct vocabulary again: a very slight rotation-in, like index cards
  // being set down on a desk — editorial rather than a straight fade/rise.
  useScrollReveal({
    ref: gridRef,
    threshold: 0.15,
    duration: 1000,
    onUpdate: (t) => {
      cardRefs.current.forEach((el, i) => {
        const s = seg(t, i * 0.16, i * 0.16 + 0.55)
        el.style.opacity = String(s)
        el.style.transform = `translateY(${lerp(30, 0, s)}px) rotate(${lerp(-1.6, 0, s)}deg)`
      })
      if (t >= 1) TESTIMONIALS.forEach((tm) => posthog?.capture('testimonial_viewed', { name: tm.name }))
    },
  })

  return (
    <section id="proof" className="border-t border-ink bg-paper-alt">
      <div className="mx-auto max-w-[1360px] px-4 py-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-[18px] font-mono text-xs tracking-[0.14em] text-mutedink">
          <span>07 — PROOF</span>
          <span className="hidden sm:inline">REAL OWNERS. REAL COUNTERS.</span>
        </div>

        <Lines
          className="mb-14 mt-[42px] font-display text-[clamp(38px,4.2vw,64px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
          lines={[
            'Owners who switched',
            <>never went <span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal text-green">back.</span></>,
          ]}
        />

        <div ref={gridRef} className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              ref={addCard}
              className="m-0 border-t border-ink pt-6"
              style={{ opacity: 0, transformOrigin: 'top left', willChange: 'transform, opacity' }}
            >
              <div className="relative h-[300px] w-full">
                <Image
                  src={t.image}
                  alt={t.name.split(' — ')[0]}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <blockquote className="my-[22px] font-serif text-xl italic leading-[1.45] text-ink">{t.quote}</blockquote>
              <figcaption className="font-mono text-[11px] tracking-[0.12em] text-mutedink">
                {t.name}
                <br />
                {t.since}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
