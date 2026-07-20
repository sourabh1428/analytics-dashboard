'use client'

import { useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { useScrollReveal } from '@/src/lib/scrollScrub'
import { Lines, Reveal } from './reveal'

export default function FinalCTA() {
  const posthog = usePostHog()
  const sectionRef = useRef(null)
  const ruleRef = useRef(null)

  // A closing flourish rather than another fade: a green rule draws itself
  // in under the headline like a line under a final ledger entry, timed to
  // land just after the headline reveal finishes.
  useScrollReveal({
    ref: sectionRef,
    threshold: 0.3,
    duration: 900,
    delay: 450,
    onUpdate: (t) => {
      if (ruleRef.current) ruleRef.current.style.transform = `scaleX(${t})`
    },
  })

  return (
    <section id="cta" ref={sectionRef} className="border-t border-ink bg-ink text-paper">
      <div className="mx-auto max-w-[1360px] px-4 py-[110px] text-center sm:px-8">
        <Lines
          className="mx-auto font-display text-[clamp(44px,5.4vw,88px)] font-extrabold uppercase leading-[.94] tracking-[-0.015em] [font-stretch:68%]"
          lines={[
            'Stop losing customers',
            <>to <span className="font-serif text-[0.86em] italic font-medium normal-case tracking-normal text-green-bright">forgetfulness.</span></>,
          ]}
        />

        <div
          ref={ruleRef}
          className="mx-auto mt-8 h-px w-[220px] origin-center bg-green-bright/70"
          style={{ transform: 'scaleX(0)', willChange: 'transform' }}
        />

        <Reveal as="p" className="mx-auto my-7 mb-10 max-w-[460px] text-[16.5px] leading-[1.6] text-faint">
          EasiBill runs the reminders. You run the business. Free to start — no card needed.
        </Reveal>

        <Reveal delay={100} className="flex flex-wrap justify-center gap-3.5">
          <a
            href="https://dashboard.easibill.com/"
            onClick={() => posthog?.capture('final_cta_clicked')}
            className="inline-block bg-green px-[38px] py-5 font-mono text-sm tracking-[0.1em] text-paper transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-green-bright hover:text-ink"
          >
            START FREE — NO CARD NEEDED
          </a>
        </Reveal>

        <Reveal delay={180} as="p" className="mt-6 font-mono text-[11px] tracking-[0.14em] text-faint">
          14-DAY TRIAL · SETUP UNDER 30 MIN · CANCEL ANYTIME
        </Reveal>
      </div>
    </section>
  )
}
