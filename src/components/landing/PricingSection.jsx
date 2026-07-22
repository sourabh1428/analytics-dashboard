'use client'

import { useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { lerp, seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines } from './reveal'

const STARTER_FEATURES = [
  'Unlimited customers',
  'Automated WhatsApp follow-up reminders',
  'Your own WhatsApp number — no API needed',
  'Customer records, daily queue, item catalog',
  'CSV import · Hindi + English templates',
  'Email support',
]

const PRO_FEATURES = [
  'Everything in Starter',
  'Official WhatsApp Business number (WABA — no ban risk)',
  'Broadcast campaigns with segmentation',
  'Advanced retention analytics',
  '5 languages — Hindi, English, Marathi, Telugu, Kannada',
  'Delivery receipts: Sent → Delivered → Read',
  'Priority WhatsApp support',
]

export default function PricingSection() {
  const posthog = usePostHog()
  const cardsRef = useRef(null)
  const starterRef = useRef(null)
  const proRef = useRef(null)

  // Distinct vocabulary: the two plans converge from opposite edges rather
  // than a uniform stagger — a rate card being laid open on the counter.
  useScrollReveal({
    ref: cardsRef,
    threshold: 0.15,
    duration: 900,
    onUpdate: (t) => {
      const sStarter = seg(t, 0, 0.85)
      const sPro = seg(t, 0.08, 0.93)
      if (starterRef.current) {
        starterRef.current.style.opacity = String(sStarter)
        starterRef.current.style.transform = `translateX(${lerp(-32, 0, sStarter)}px)`
      }
      if (proRef.current) {
        proRef.current.style.opacity = String(sPro)
        proRef.current.style.transform = `translateX(${lerp(32, 0, sPro)}px)`
      }
    },
  })

  return (
    <section id="rates" className="border-t border-ink">
      <div className="mx-auto max-w-[1360px] px-4 py-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-[18px] font-mono text-xs tracking-[0.14em] text-mutedink">
          <span>08 — THE RATE CARD</span>
          <span className="hidden sm:inline">14-DAY TRIAL · NO CARD · CANCEL ANYTIME</span>
        </div>

        <Lines
          className="mb-[52px] mt-[42px] font-display text-[clamp(38px,4.2vw,64px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
          lines={[
            'Simple rates. Written',
            <>in <span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal text-green">plain ink.</span></>,
          ]}
        />

        <div ref={cardsRef} className="grid grid-cols-1 overflow-x-clip border border-ink md:grid-cols-2">
          <div
            ref={starterRef}
            className="border-b border-ink p-8 sm:p-11 md:border-b-0 md:border-r"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <div className="font-mono text-xs tracking-[0.14em] text-mutedink">STARTER — FOR SHOPS REMINDING BY MEMORY</div>
            <div className="my-[22px] mb-1.5 flex items-baseline gap-2.5">
              <span className="font-display text-7xl font-extrabold leading-[.9] sm:text-[96px] [font-stretch:66%]">₹299</span>
              <span className="font-mono text-[13px] text-mutedink">/ MONTH</span>
            </div>
            <div className="my-7 border-t border-ink/30" />
            <ul className="grid gap-3 text-[14.5px] leading-[1.5]">
              {STARTER_FEATURES.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="font-mono text-green">✓</span>{f}
                </li>
              ))}
            </ul>
            <a
              href="https://dashboard.ferbz.com/"
              onClick={() => posthog?.capture('pricing_cta_clicked', { plan: 'Starter', popular: false })}
              className="mt-8 inline-block border border-ink px-[26px] py-4 font-mono text-[13px] tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              START 14-DAY TRIAL
            </a>
          </div>

          <div
            ref={proRef}
            className="relative bg-ink p-8 text-paper sm:p-11"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <div className="absolute right-6 top-6 rotate-[6deg] border-2 border-rust px-2.5 py-1.5 font-mono text-[11px] tracking-[0.16em] text-ember sm:right-8">
              MOST POPULAR
            </div>
            <div className="font-mono text-xs tracking-[0.14em] text-faint">PRO — FOR SHOPS RUNNING CAMPAIGNS</div>
            <div className="my-[22px] mb-1.5 flex items-baseline gap-2.5">
              <span className="font-display text-7xl font-extrabold leading-[.9] text-green-bright sm:text-[96px] [font-stretch:66%]">₹999</span>
              <span className="font-mono text-[13px] text-faint">/ MONTH</span>
            </div>
            <div className="my-7 border-t border-paper/25" />
            <ul className="grid gap-3 text-[14.5px] leading-[1.5] text-paper/85">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="font-mono text-green-bright">✓</span>{f}
                </li>
              ))}
            </ul>
            <a
              href="https://dashboard.ferbz.com/"
              onClick={() => posthog?.capture('pricing_cta_clicked', { plan: 'Pro', popular: true })}
              className="mt-8 inline-block bg-green px-[26px] py-4 font-mono text-[13px] tracking-[0.1em] text-paper transition-colors hover:bg-green-bright hover:text-ink"
            >
              START 14-DAY TRIAL
            </a>
          </div>
        </div>

        <p className="mt-[18px] font-mono text-[11px] tracking-[0.1em] text-mutedink">
          PRICES IN INR. WORKS ALONGSIDE MARG, VYAPAR &amp; ECOGREEN — NO REPLACEMENT NEEDED. WALLET TOP-UP FROM ₹200; CREDITS NEVER EXPIRE.
        </p>
      </div>
    </section>
  )
}
