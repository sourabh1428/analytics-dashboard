'use client'

import { useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { lerp, seg, useScrollScrub } from '@/src/lib/scrollScrub'
import { Lines } from './reveal'

const STEPS = [
  {
    time: "09:00 — YOU'RE STILL OPENING THE SHUTTER",
    title: 'The reminder fires. You did nothing.',
    copy: "28 days ago you logged Ramesh's purchase. EasiBill calculated the follow-up date and sent a personalised message from your own WhatsApp number — at 9 AM sharp.",
  },
  {
    time: '09:04 — FOUR MINUTES LATER',
    title: 'He replies. A lost sale, recovered.',
    copy: "Without the nudge, Ramesh buys from whoever is nearest when he remembers. With it, he's yours. Businesses recover 28–35% of missed follow-ups in month one.",
  },
  {
    time: '18:32 — AT THE COUNTER',
    title: 'Bill in 30 seconds, straight to his phone.',
    copy: 'Tap the item, tap the customer, send. Tax-ready PDF delivered on WhatsApp — no paper, no "can you resend the invoice?", no queue.',
  },
  {
    time: '18:33 — THE LOOP CLOSES',
    title: 'The next reminder is already booked.',
    copy: 'Logging the sale scheduled the next follow-up automatically. This loop runs for every customer, every day — forever.',
    cta: true,
  },
]

const N = STEPS.length

// Chat bubbles are refs, driven straight off `p` — an "assemble" beat
// (rise + scale + opacity) per bubble, each with its own segment window
// tied to the step it belongs to. No React state, no CSS transitions: pure
// function of scroll progress, so it plays cleanly in reverse too.
function ChatMockup({ addBubble, static: isStatic = false }) {
  const bubbleStyle = isStatic ? undefined : { opacity: 0, willChange: 'transform, opacity' }
  const ref = isStatic ? undefined : addBubble
  return (
    <div className="chat-panel">
      <div className="border border-ink bg-paper-warm shadow-[8px_8px_0_#17150F]">
        <div className="flex items-center gap-2.5 bg-green px-4 py-3 text-paper">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-paper text-[13px] font-extrabold text-green [font-stretch:80%]">RK</span>
          <div>
            <div className="text-sm font-semibold">Ramesh Kumar</div>
            <div className="font-mono text-[10px] tracking-[0.1em] opacity-75">VIA YOUR WHATSAPP № — AUTOMATED</div>
          </div>
        </div>
        <div
          className="flex min-h-[350px] flex-col gap-2.5 bg-paper-warm px-4 pb-5 pt-[18px]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 26px, rgba(23,21,15,.035) 26px 27px)' }}
        >
          <div ref={ref} className="self-center bg-black/[0.06] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-mutedink" style={bubbleStyle}>
            TUESDAY — 09:00
          </div>
          <div ref={ref} className="self-end max-w-[82%] border border-green/35 bg-green-pale px-3 py-2.5 text-[13.5px] leading-[1.45]" style={bubbleStyle}>
            Namaste Ramesh ji 🙏 Your monthly reorder pack is due. Reply YES and we&apos;ll keep it ready at the counter. — Verma Medical
            <div className="mt-1.5 text-right font-mono text-[10px] text-green">09:00 ✓✓</div>
          </div>
          <div ref={ref} className="self-start max-w-[75%] border border-ink/20 bg-paper-white px-3 py-2.5 text-[13.5px] leading-[1.45]" style={bubbleStyle}>
            Haan, coming today evening 👍
            <div className="mt-1.5 text-right font-mono text-[10px] text-mutedink">09:04</div>
          </div>
          <div ref={ref} className="mt-1.5 self-center bg-black/[0.06] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-mutedink" style={bubbleStyle}>
            18:32 — AT THE COUNTER
          </div>
          <div ref={ref} className="self-end max-w-[82%] border border-green/35 bg-green-pale px-3 py-2.5" style={bubbleStyle}>
            <div className="flex items-center gap-2.5 border border-ink/15 bg-paper-white px-2.5 py-2">
              <span className="font-mono text-base">▤</span>
              <div>
                <div className="text-[12.5px] font-semibold">Invoice #2406-0047.pdf</div>
                <div className="font-mono text-[10px] text-mutedink">₹1,090 · TAX INCLUDED</div>
              </div>
            </div>
            <div className="mt-1.5 text-right font-mono text-[10px] text-green">18:32 ✓✓</div>
          </div>
          <div ref={ref} className={`mt-2.5 self-center border-2 border-rust px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-rust ${isStatic ? '-rotate-[4deg]' : ''}`} style={bubbleStyle}>
            NEXT REMINDER: 17 AUG — AUTO ✓
          </div>
        </div>
      </div>
    </div>
  )
}

function StoryStep({ step, addStep, posthog }) {
  return (
    <div ref={addStep} className="flex min-h-[62vh] flex-col justify-center border-t border-ink/25 py-8" style={{ opacity: 0.4, willChange: 'opacity' }}>
      <div className="font-mono text-xs tracking-[0.14em] text-rust">{step.time}</div>
      <h3 className="mt-3.5 mb-3 font-display text-[40px] font-extrabold uppercase leading-none [font-stretch:74%]">
        {step.title}
      </h3>
      <p className="max-w-[480px] text-base leading-[1.6] text-ink-soft">{step.copy}</p>
      {step.cta && (
        <a
          href="https://dashboard.easibill.com/"
          onClick={() => posthog?.capture('day_in_the_life_cta_clicked')}
          className="mt-6 inline-block self-start bg-ink px-[26px] py-4 font-mono text-[13px] tracking-[0.1em] text-paper transition-colors hover:bg-green"
        >
          RUN THIS LOOP FOR MY SHOP →
        </a>
      )}
    </div>
  )
}

export default function DayInTheLife() {
  const posthog = usePostHog()
  const stepsColRef = useRef(null)
  const stepRefs = useRef([])
  const bubbleRefs = useRef([])
  const wireFillRef = useRef(null)
  const packetRef = useRef(null)
  const lastActive = useRef(-1)

  stepRefs.current = []
  bubbleRefs.current = []
  const addStep = (el) => { if (el) stepRefs.current.push(el) }
  const addBubble = (el) => { if (el) bubbleRefs.current.push(el) }

  useScrollScrub({
    wrapperRef: stepsColRef,
    stickyOffset: typeof window !== 'undefined' ? window.innerHeight * 0.55 : 400,
    onUpdate: (p) => {
      const raw = p * N
      const active = Math.max(0, Math.min(N - 1, Math.floor(raw)))

      if (active !== lastActive.current) {
        lastActive.current = active
        posthog?.capture('day_in_the_life_step_viewed', { step: active })
      }

      stepRefs.current.forEach((el, i) => {
        if (!el) return
        const dist = Math.abs(raw - (i + 0.5))
        const focus = 1 - seg(dist, 0.5, 1.15)
        el.style.opacity = String(lerp(0.4, 1, focus))
      })

      // chat bubbles: each gets its own segment window across the full
      // story so they arrive roughly in step with their beat, then stay.
      bubbleRefs.current.forEach((b, i) => {
        if (!b) return
        const s = seg(p, i * 0.11, i * 0.11 + 0.16)
        b.style.opacity = String(s)
        b.style.transform = i === bubbleRefs.current.length - 1
          ? `translateY(${lerp(14, 0, s)}px) rotate(${lerp(0, -4, s)}deg) scale(${lerp(0.94, 1, s)})`
          : `translateY(${lerp(14, 0, s)}px) scale(${lerp(0.94, 1, s)})`
      })

      // connecting element: a dashed wire running down the story rail with
      // a packet chip handing the "sale" off between beats.
      if (wireFillRef.current) wireFillRef.current.style.transform = `scaleY(${p})`
      if (packetRef.current) {
        packetRef.current.style.top = `${clampPct(p) * 100}%`
        packetRef.current.style.opacity = p > 0.02 && p < 0.98 ? '1' : '0'
      }
    },
  })

  return (
    <section id="day" className="border-b border-ink">
      <div className="mx-auto max-w-[1360px] px-4 pb-10 pt-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-[18px] font-mono text-xs tracking-[0.14em] text-mutedink">
          <span>02 — A DAY WITH EASIBILL</span>
          <span className="hidden sm:inline">SCROLL. THE STORY WRITES ITSELF.</span>
        </div>

        <Lines
          className="mb-6 mt-[42px] font-display text-[clamp(38px,4.2vw,64px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
          lines={[
            'One message at the right time.',
            <span key="l2" className="text-mutedink">
              Everything else is <span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal text-mutedink">noise.</span>
            </span>,
          ]}
        />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[420px_1fr] lg:gap-[72px]">
          <div className="relative hidden lg:block">
            <div className="sticky top-[104px]">
              <ChatMockup addBubble={addBubble} />
            </div>
          </div>
          <div className="lg:hidden">
            <ChatMockup static />
          </div>

          <div ref={stepsColRef} className="relative">
            {/* connecting element: dashed story wire + travelling packet */}
            <div className="absolute -left-6 top-0 hidden h-full w-[2px] bg-ink/[.14] lg:block">
              <span ref={wireFillRef} className="absolute inset-0 origin-top bg-green" style={{ transform: 'scaleY(0)', willChange: 'transform' }} />
            </div>
            <div
              ref={packetRef}
              className="absolute -left-[31px] hidden h-3 w-3 -translate-y-1/2 rounded-full border border-ink bg-green-bright lg:block"
              style={{ top: '0%', opacity: 0, willChange: 'top, opacity' }}
            />

            {STEPS.map((step) => (
              <StoryStep key={step.title} step={step} addStep={addStep} posthog={posthog} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function clampPct(p) {
  return Math.max(0, Math.min(1, p))
}
