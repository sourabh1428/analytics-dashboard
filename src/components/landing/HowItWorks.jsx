'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { lerp, seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines, Reveal } from './reveal'

const STEPS = [
  {
    n: '1',
    title: 'Connect your WhatsApp number',
    copy: 'Scan a QR code once. Your existing WhatsApp Business number is linked in 2 minutes — no API registration, no new number.',
  },
  {
    n: '2',
    title: 'Add customers and their items',
    copy: 'Name, WhatsApp number, item, follow-up interval — or upload a CSV. Most shops import their top 30 repeat customers in 10 minutes.',
  },
  {
    n: '3',
    title: 'Reminders fire — forever',
    copy: 'EasiBill sends each message at 9 AM on the right day. You do nothing. The customer comes back.',
  },
]

const N = STEPS.length

function StepRow({ step, index, addNum, addBody }) {
  return (
    <div
      className={`grid grid-cols-[70px_1fr] gap-6 border-t border-ink/30 py-7 sm:grid-cols-[110px_1fr] ${
        index === N - 1 ? 'border-b border-ink' : ''
      }`}
    >
      <div ref={(el) => addNum(el, index)} className="font-display text-[64px] font-extrabold leading-[.8] text-rust sm:text-[84px] [font-stretch:65%]" style={{ opacity: 0, willChange: 'transform, opacity' }}>
        {step.n}
      </div>
      <div ref={(el) => addBody(el, index)} style={{ opacity: 0, willChange: 'transform, opacity' }}>
        <h3 className="mb-2 font-display text-2xl font-extrabold uppercase [font-stretch:74%] sm:text-[26px]">{step.title}</h3>
        <p className="text-[15px] leading-[1.6] text-ink-soft">{step.copy}</p>
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const listRef = useRef(null)
  const numRefs = useRef([])
  const bodyRefs = useRef([])
  const addNum = (el, i) => { if (el) numRefs.current[i] = el }
  const addBody = (el, i) => { if (el) bodyRefs.current[i] = el }

  // Distinct vocabulary: a slower vertical cascade with the giant step
  // digits scaling in from behind their copy — emphasises "step 1, step 2,
  // step 3" as a numbered procedure rather than a generic card grid.
  useScrollReveal({
    ref: listRef,
    threshold: 0.15,
    duration: 1100,
    onUpdate: (t) => {
      for (let i = 0; i < N; i++) {
        const numEl = numRefs.current[i]
        const bodyEl = bodyRefs.current[i]
        const sNum = seg(t, i * 0.22, i * 0.22 + 0.4)
        const sBody = seg(t, i * 0.22 + 0.08, i * 0.22 + 0.48)
        if (numEl) {
          numEl.style.opacity = String(sNum)
          numEl.style.transform = `scale(${lerp(0.7, 1, sNum)})`
        }
        if (bodyEl) {
          bodyEl.style.opacity = String(sBody)
          bodyEl.style.transform = `translateY(${lerp(18, 0, sBody)}px)`
        }
      }
    },
  })

  return (
    <section id="setup">
      <div className="mx-auto max-w-[1360px] px-4 py-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-[18px] font-mono text-xs tracking-[0.14em] text-mutedink">
          <span>06 — SETUP</span>
          <span className="hidden sm:inline">NO IT TEAM. NO TRAINING DAYS.</span>
        </div>

        <div className="mt-[42px] grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_380px]">
          <div ref={listRef}>
            <Lines
              className="mb-12 font-display text-[clamp(38px,3.8vw,58px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
              lines={[
                'Running in under',
                <span key="l2" className="text-green">10 minutes.</span>,
              ]}
            />

            {STEPS.map((step, i) => (
              <StepRow key={step.n} step={step} index={i} addNum={addNum} addBody={addBody} />
            ))}
          </div>

          <Reveal delay={150} className="sticky top-[104px]">
            <div className="relative h-[470px] w-full border border-ink shadow-[8px_8px_0_#146C3C]">
              <Image
                src="/images/shop-counter.png"
                alt="A shop owner at the billing counter, managing the business on their phone"
                fill
                sizes="380px"
                className="object-cover"
              />
            </div>
            <div className="mt-3 font-mono text-[11px] tracking-[0.12em] text-mutedink">
              FIG. 05 — THE COUNTER, 09:02 AM. THE REMINDER ALREADY WENT OUT.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
