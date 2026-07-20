'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { lerp, seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines, Reveal } from './reveal'

const TOOLS = [
  {
    num: 'F/01',
    name: 'Follow-up Reminders',
    href: '/features/follow-up-reminders',
    copy: 'A WhatsApp reminder on exactly the right day — sent from your number, automatically.',
    status: 'SENT 09:00 ✓✓',
  },
  {
    num: 'F/02',
    name: 'Customer Records',
    href: '/features/patient-records',
    copy: 'Every customer, item, and interval in one place. CSV import. Search in under a second.',
    status: '2,400 ROWS',
  },
  {
    num: 'F/03',
    name: 'Daily Queue',
    href: '/features/daily-queue',
    copy: "Who's due, who's overdue, who came back — sorted by urgency, every morning.",
    status: '12 DUE TODAY',
  },
  {
    num: 'F/04',
    name: 'Broadcast Campaigns',
    href: '/features/broadcast-campaigns',
    copy: 'One message to 300 customers in two minutes. Segmented, personalised, scheduled.',
    status: '234/300 ✓',
  },
  {
    num: 'F/05',
    name: 'Retention Analytics',
    href: '/features/retention-analytics',
    copy: "Which customers you're keeping — and losing — calculated from real sales data.",
    status: '+32% REPEAT',
  },
  {
    num: 'F/06',
    name: 'Item Catalog',
    href: '/features',
    copy: 'Default follow-up intervals per item — 28 days for one, 90 for another. Set once.',
    status: '28D / 90D',
  },
]

const N = TOOLS.length

export default function FeaturesBento() {
  const posthog = usePostHog()
  const tableRef = useRef(null)
  const wireFillRef = useRef(null)
  const packetRef = useRef(null)

  // The ledger table's connecting element: a dashed wire runs down the left
  // rail as the table enters, with a packet chip travelling row-to-row —
  // one shot, timed against the table's own height (not a long scrub —
  // six ledger rows are a single beat, not a multi-act sequence).
  useScrollReveal({
    ref: tableRef,
    threshold: 0.15,
    duration: 1400,
    onUpdate: (t) => {
      const s = seg(t, 0, 1)
      if (wireFillRef.current) wireFillRef.current.style.transform = `scaleY(${s})`
      if (packetRef.current) {
        packetRef.current.style.top = `${lerp(0, 100, s)}%`
        packetRef.current.style.opacity = t > 0.02 && t < 0.98 ? '1' : '0'
      }
    },
  })

  return (
    <section id="toolkit">
      <div className="mx-auto max-w-[1360px] px-4 py-[88px] sm:px-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-[18px] font-mono text-xs tracking-[0.14em] text-mutedink">
          <span>03 — THE TOOLKIT</span>
          <span className="hidden sm:inline">SIX TOOLS. ONE MISSION.</span>
        </div>

        <Lines
          className="mb-12 mt-[42px] font-display text-[clamp(38px,4.2vw,64px)] font-extrabold uppercase leading-[.96] tracking-[-0.01em] [font-stretch:70%]"
          lines={[
            'Everything supports',
            <>the <span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal text-green">follow-up.</span></>,
          ]}
        />

        <div ref={tableRef} className="relative border-t border-ink">
          <div className="absolute -left-4 top-0 hidden h-full w-[2px] bg-ink/[.14] sm:-left-6 lg:block">
            <span ref={wireFillRef} className="absolute inset-0 origin-top bg-green" style={{ transform: 'scaleY(0)', willChange: 'transform' }} />
          </div>
          <div
            ref={packetRef}
            className="absolute -left-[27px] hidden h-3 w-3 -translate-y-1/2 rounded-full border border-ink bg-green-bright sm:-left-[35px] lg:block"
            style={{ top: '0%', opacity: 0, willChange: 'top, opacity' }}
          />

          {TOOLS.map((tool, i) => (
            <Reveal key={tool.num} delay={i * 40}>
              <Link
                href={tool.href}
                onClick={() => posthog?.capture('toolkit_row_clicked', { feature: tool.name })}
                onFocus={() => posthog?.capture('toolkit_row_viewed', { feature: tool.name })}
                className={`grid grid-cols-1 items-center gap-3 px-2 py-6 transition-colors duration-300 hover:bg-ink hover:text-paper md:grid-cols-[90px_260px_1fr_170px] md:gap-6 ${
                  i < N - 1 ? 'border-b border-ink/30' : 'border-b border-ink'
                }`}
              >
                <span className="font-mono text-xs text-rust">{tool.num}</span>
                <span className="font-display text-[26px] font-extrabold uppercase [font-stretch:74%]">{tool.name}</span>
                <span className="text-[14.5px] leading-[1.5] opacity-75">{tool.copy}</span>
                <span className="font-mono text-[11px] tracking-[0.1em] text-green md:text-right">{tool.status}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
