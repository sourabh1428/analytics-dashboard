'use client'

import { useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { lerp, seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines, Reveal } from './reveal'

const AI_FEATURES = [
  {
    num: 'A/01',
    title: 'Template Generator',
    copy: 'Type "remind customers their order is ready." AI drafts three on-brand versions. Pick, tweak, live.',
  },
  {
    num: 'A/02',
    title: 'Segmentation',
    copy: 'High-value, lapsing, seasonal — groups form themselves from buying patterns. No manual tagging.',
  },
  {
    num: 'A/03',
    title: 'Automation Builder',
    copy: '"Follow up with anyone quiet for 45 days" becomes a working rule — trigger, wait, send.',
  },
  {
    num: 'A/04',
    title: 'Campaign Copywriter',
    copy: 'Offer + audience in. Broadcast copy, best send time, and schedule out.',
  },
]

export default function AIStudio() {
  const posthog = usePostHog()
  const gridRef = useRef(null)
  const cardRefs = useRef([])
  cardRefs.current = []
  const addCard = (el) => { if (el) cardRefs.current.push(el) }

  // Distinct vocabulary from the other grid sections: a left-to-right
  // cascade with a slight horizontal drift — reads like text typing itself
  // into place, on-brand for the "AI does the busywork" panel.
  useScrollReveal({
    ref: gridRef,
    threshold: 0.2,
    duration: 900,
    onUpdate: (t) => {
      cardRefs.current.forEach((el, i) => {
        const s = seg(t, i * 0.12, i * 0.12 + 0.55)
        el.style.opacity = String(s)
        el.style.transform = `translate(${lerp(-18, 0, s)}px, ${lerp(14, 0, s)}px)`
      })
      if (t >= 1) AI_FEATURES.forEach((f) => posthog?.capture('ai_clerk_row_viewed', { feature: f.title }))
    },
  })

  return (
    <section className="border-y border-ink bg-green text-paper">
      <div className="mx-auto max-w-[1360px] px-4 py-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-paper/35 pb-[18px] font-mono text-xs tracking-[0.14em] text-green-muted">
          <span>04 — THE AI CLERK</span>
          <span className="hidden sm:inline">YOU APPROVE. IT TYPES.</span>
        </div>

        <Lines
          className="mt-[42px] font-display text-[clamp(38px,4.2vw,64px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
          lines={[
            <>The AI does the <span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal">busywork.</span></>,
          ]}
        />

        <Reveal as="p" className="my-5 mb-14 max-w-[520px] text-[16.5px] leading-[1.6] text-green-tint">
          Blank page to ready-to-send in seconds instead of twenty minutes. You still approve every message before it goes out.
        </Reveal>

        <div ref={gridRef} className="grid grid-cols-1 overflow-x-clip border-t border-paper/35 sm:grid-cols-2 lg:grid-cols-4">
          {AI_FEATURES.map((f, i) => (
            <div
              key={f.num}
              ref={addCard}
              className={`pt-7 pr-6 ${i < AI_FEATURES.length - 1 ? 'border-r border-paper/25' : ''}`}
              style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
              <div className="font-mono text-xs text-green-muted">{f.num}</div>
              <h3 className="my-3 font-display text-2xl font-extrabold uppercase leading-[1.05] [font-stretch:74%]">{f.title}</h3>
              <p className="text-sm leading-[1.55] text-green-tint">{f.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
