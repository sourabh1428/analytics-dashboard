'use client'

import { useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import { Lines, Reveal } from './reveal'

// Exact copy from the comp's faqData array (pro/EasiBill Landing.dc.html)
const FAQS = [
  { q: 'Do I need WhatsApp Business API?', a: "No. Starter works with your existing WhatsApp Business app — scan a QR code once and you're linked. Pro includes an official WABA number with zero ban risk, but it's optional." },
  { q: 'Does it replace Marg, Vyapar or Ecogreen?', a: 'No. EasiBill runs alongside your existing billing software. Keep your current system for accounting; EasiBill handles the WhatsApp bills and follow-up reminders it can\'t.' },
  { q: 'What if my WhatsApp disconnects?', a: 'You get an alert in the dashboard and reminders queue up automatically. Rescan the QR code and everything queued goes out — nothing is lost.' },
  { q: 'Is my customer data safe?', a: 'Yes. Data is encrypted, never shared or sold, and you can export or delete it any time. Your customer list is yours.' },
  { q: 'How long does setup take?', a: 'Under 30 minutes end to end. Connecting WhatsApp takes 2 minutes; most shops import their top repeat customers in 10.' },
  { q: 'What if I want to cancel?', a: 'Cancel any time from the app — no calls, no lock-in. You can export all your data before you go.' },
]

// Accordion open/close is click-driven, not scroll-scrubbed content, so it
// stays a plain CSS transition — a `grid-template-rows: 0fr -> 1fr` trick
// instead of animating `height`, so there's no need to measure scrollHeight
// in JS at all.
function FAQItem({ item, index, open, onToggle }) {
  const isOpen = open === index

  return (
    <div className="border-b border-ink/30">
      <button
        onClick={() => onToggle(isOpen ? -1 : index)}
        aria-expanded={isOpen}
        className="grid w-full grid-cols-[48px_1fr_32px] items-baseline gap-4 py-[22px] px-1 text-left font-sans text-ink sm:grid-cols-[64px_1fr_40px] sm:gap-4"
      >
        <span className="font-mono text-xs text-rust">Q/0{index + 1}</span>
        <span className="font-display text-lg font-bold uppercase [font-stretch:76%] sm:text-xl">{item.q}</span>
        <span className="text-right font-mono text-xl text-green">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="max-w-[680px] py-0 pb-[26px] pl-0 pr-11 text-[15px] leading-[1.65] text-ink-soft sm:pl-20">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const posthog = usePostHog()
  const [open, setOpen] = useState(0)

  const handleToggle = (nextIndex) => {
    setOpen(nextIndex)
    if (nextIndex !== -1) posthog?.capture('faq_opened', { question: FAQS[nextIndex].q, index: nextIndex })
  }

  return (
    <section id="faq" className="border-t border-ink">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-16 px-4 py-[88px] sm:px-8 lg:grid-cols-[380px_1fr]">
        <div>
          <div className="border-b border-ink pb-[18px] font-mono text-xs tracking-[0.14em] text-mutedink">08 — QUESTIONS</div>
          <Lines
            as="h2"
            className="my-4 mt-8 font-display text-[clamp(32px,3vw,46px)] font-extrabold uppercase leading-[.98] tracking-[-0.01em] [font-stretch:70%]"
            lines={['Asked before switching.']}
          />
          <Reveal as="p" delay={100} className="font-serif text-lg italic text-green">
            Honest answers. No marketing fluff.
          </Reveal>
        </div>

        <div className="border-t border-ink">
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} open={open} onToggle={handleToggle} />
          ))}
        </div>
      </div>
    </section>
  )
}
