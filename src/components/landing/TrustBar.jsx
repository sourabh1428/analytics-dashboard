'use client'

import { useRef } from 'react'
import { seg, useScrollReveal } from '@/src/lib/scrollScrub'
import { Reveal } from './reveal'

const STATS = [
  { count: 2400, suffix: '+', label: 'LOCAL BUSINESSES ON EASIBILL' },
  { count: 18, suffix: 'M+', label: 'BILLS SENT VIA WHATSAPP' },
  { count: 32, prefix: '+', suffix: '%', label: 'AVG. INCREASE IN REPEAT CUSTOMERS', accent: true },
  { display: '₹0', label: 'SETUP COST · FREE TO START' },
]

// Single-beat stat row — a light one-shot count-up driven by `p` (time-based,
// via useScrollReveal) instead of a long scroll-scrub: a slim four-cell row
// doesn't warrant a 300vh pinned wrapper, but still uses the same seg/lerp
// vocabulary as the heavier sections.
function CountUp({ value, prefix = '', suffix = '' }) {
  const spanRef = useRef(null)
  const format = (n) => `${prefix}${Math.round(n).toLocaleString('en-IN')}${suffix}`

  useScrollReveal({
    ref: spanRef,
    duration: 1400,
    threshold: 0.5,
    onUpdate: (t) => {
      const el = spanRef.current
      if (!el) return
      el.textContent = format(value * seg(t, 0, 1))
    },
  })

  return <span ref={spanRef}>{format(0)}</span>
}

export default function TrustBar() {
  return (
    <div className="border-b border-ink">
      <div className="mx-auto grid max-w-[1360px] grid-cols-2 px-4 sm:px-8 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 80}
            className={`py-[30px] px-[28px] first:pl-0 last:pr-0 ${i < STATS.length - 1 ? 'border-r border-ink/25' : ''}`}
          >
            <div
              className={`font-display text-[52px] font-extrabold leading-none [font-stretch:72%] ${stat.accent ? 'text-green' : 'text-ink'}`}
            >
              {stat.display ?? <CountUp value={stat.count} prefix={stat.prefix} suffix={stat.suffix} />}
            </div>
            <div className="mt-2.5 font-mono text-[11px] tracking-[0.12em] text-mutedink">{stat.label}</div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
