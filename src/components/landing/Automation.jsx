'use client'

import { useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { lerp, seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines, Reveal } from './reveal'

// Trigger → journey → exit, one scroll beat. The wire/node vocabulary here
// deliberately echoes Hero's timeline rail and FeaturesBento's wire+packet —
// same "machine" grammar, not a new one — so this reads as a deeper look at
// the "Automation Builder" teased in AIStudio (A/03), not a bolted-on section.
const TRIGGERS = [
  { n: '01', label: 'N days before reorder is due' },
  { n: '02', label: 'N days since last purchase' },
  { n: '03', label: 'N days since signup' },
  { n: '04', label: 'Customer gets tagged — e.g. "VIP"' },
]

const TEMPLATES = [
  {
    num: 'J/01',
    name: 'Reorder Nudge',
    copy: 'Reminds customers before they run out — with a smart follow-up if the first message goes unread.',
  },
  {
    num: 'J/02',
    name: 'Win-Back',
    copy: "Re-engages anyone who hasn't purchased in 45 days.",
  },
  {
    num: 'J/03',
    name: 'Post-Purchase Check-In',
    copy: 'Checks in 5 days after a purchase to see how it landed.',
  },
]

const STEPS = ['TRIGGER', 'MESSAGE SENT', 'READ?', 'FOLLOW-UP', 'EXIT']

export default function Automation() {
  const posthog = usePostHog()
  const flowRef = useRef(null)
  const wireFillRef = useRef(null)
  const packetRef = useRef(null)
  const stepRefs = useRef([])
  stepRefs.current = []
  const addStep = (el) => { if (el) stepRefs.current.push(el) }

  const triggerListRef = useRef(null)
  const triggerRefs = useRef([])
  triggerRefs.current = []
  const addTrigger = (el) => { if (el) triggerRefs.current.push(el) }

  const templateGridRef = useRef(null)
  const templateRefs = useRef([])
  templateRefs.current = []
  const addTemplate = (el) => { if (el) templateRefs.current.push(el) }

  // One-shot beat: the wire draws left-to-right as the flow enters, a
  // packet chip travels along it, and each step label lights up as the
  // packet passes its node — a single mechanical pass, not a long scrub.
  useScrollReveal({
    ref: flowRef,
    threshold: 0.2,
    duration: 1300,
    onUpdate: (t) => {
      const s = seg(t, 0, 1)
      if (wireFillRef.current) wireFillRef.current.style.transform = `scaleX(${s})`
      if (packetRef.current) {
        packetRef.current.style.left = `${lerp(0, 100, s)}%`
        packetRef.current.style.opacity = t > 0.02 && t < 0.98 ? '1' : '0'
      }
      stepRefs.current.forEach((el, i) => {
        const on = s >= (i + 0.5) / STEPS.length
        el.style.opacity = on ? '1' : '.4'
        const dot = el.firstElementChild
        if (dot) dot.style.background = on ? '#146C3C' : 'transparent'
      })
      if (t >= 1) posthog?.capture('automation_flow_viewed')
    },
  })

  useScrollReveal({
    ref: triggerListRef,
    threshold: 0.2,
    duration: 900,
    onUpdate: (t) => {
      triggerRefs.current.forEach((el, i) => {
        const s = seg(t, i * 0.14, i * 0.14 + 0.55)
        el.style.opacity = String(s)
        el.style.transform = `translateY(${lerp(14, 0, s)}px)`
      })
    },
  })

  useScrollReveal({
    ref: templateGridRef,
    threshold: 0.15,
    duration: 900,
    onUpdate: (t) => {
      templateRefs.current.forEach((el, i) => {
        const s = seg(t, i * 0.16, i * 0.16 + 0.55)
        el.style.opacity = String(s)
        el.style.transform = `translateY(${lerp(18, 0, s)}px)`
      })
    },
  })

  return (
    <section id="automation" className="border-b border-ink bg-paper-alt">
      <div className="mx-auto max-w-[1360px] px-4 py-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-[18px] font-mono text-xs tracking-[0.14em] text-mutedink">
          <span>05 — AUTOMATION</span>
          <span className="hidden sm:inline">SET ONCE. RUNS FOREVER.</span>
        </div>

        <div className="mt-[42px] flex flex-wrap items-start justify-between gap-6">
          <Lines
            className="max-w-[720px] font-display text-[clamp(38px,4.2vw,64px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
            lines={[
              'One reminder isn’t enough.',
              <><span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal text-green">Journeys</span> are.</>,
            ]}
          />
          <span className="mt-1 shrink-0 border-2 border-rust px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-rust">
            PRO PLAN
          </span>
        </div>

        <Reveal as="p" className="my-5 mb-16 max-w-[560px] text-[16.5px] leading-[1.6] text-ink-soft">
          Instead of one fixed follow-up, set up automatic message sequences that trigger off customer and purchase events. No manual follow-up — ever.
        </Reveal>

        {/* the journey flow — trigger to exit, one mechanical pass */}
        <div ref={flowRef} className="mb-16">
          <div className="relative h-[3px] w-full bg-ink/[.14]">
            <span
              ref={wireFillRef}
              className="absolute inset-0 origin-left bg-green"
              style={{ transform: 'scaleX(0)', willChange: 'transform' }}
            />
            <span
              ref={packetRef}
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border border-ink bg-green-bright"
              style={{ left: '0%', opacity: 0, willChange: 'left, opacity' }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-5 sm:gap-x-2">
            {STEPS.map((label, i) => (
              <div key={label} ref={addStep} className="flex items-center gap-2 opacity-[.4] transition-opacity duration-300">
                <span className="h-[9px] w-[9px] shrink-0 border border-ink transition-colors duration-300" />
                <span className="font-mono text-[10px] tracking-[0.12em]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
          {/* trigger list */}
          <div>
            <div className="mb-5 font-mono text-xs tracking-[0.14em] text-mutedink">A JOURNEY STARTS WHEN —</div>
            <div ref={triggerListRef} className="grid gap-px bg-ink/[.14]">
              {TRIGGERS.map((trig, i) => (
                <div
                  key={trig.n}
                  ref={addTrigger}
                  className="flex items-center gap-4 bg-paper-alt px-1 py-4"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  <span className="font-mono text-xs text-rust">{trig.n}</span>
                  <span className="text-[15px] text-ink-soft">{trig.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[13.5px] leading-[1.6] text-mutedink">
              A customer can be in several journeys at once — a purchase mid-sequence auto-exits the ones it satisfies, so nobody gets a nudge for something they already bought. A daily send cap keeps it from overloading anyone.
            </p>
          </div>

          {/* built-in templates */}
          <div>
            <div className="mb-5 flex items-baseline justify-between font-mono text-xs tracking-[0.14em] text-mutedink">
              <span>BUILT-IN TEMPLATES</span>
              <span>ONE TOGGLE — NO SETUP</span>
            </div>
            <div ref={templateGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.num}
                  ref={addTemplate}
                  className="border border-ink bg-paper-white p-5 shadow-[6px_6px_0_#17150F]"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  <span className="font-mono text-xs text-green">{tpl.num}</span>
                  <h3 className="mb-2 mt-2 font-display text-lg font-extrabold uppercase leading-[1.05] [font-stretch:74%]">{tpl.name}</h3>
                  <p className="text-[13.5px] leading-[1.55] text-ink-soft">{tpl.copy}</p>
                </div>
              ))}
            </div>
            <Reveal delay={120} className="mt-6 border-t border-ink pt-5 text-[13.5px] leading-[1.6] text-mutedink">
              Want more control? Build fully custom journeys on a drag-and-drop canvas — branching logic, custom delays, custom messages.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
