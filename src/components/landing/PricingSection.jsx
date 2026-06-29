'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { fadeUp, stagger, wordVariant, viewport } from '@/src/lib/motion'
import { usePostHog } from 'posthog-js/react'
import { useRef, useEffect } from 'react'

const PLANS = [
  {
    name: 'Starter',
    price: '₹299',
    period: '/month',
    tagline: 'For pharmacies sending reminders manually today and running out of time.',
    cta: 'Start 14-day free trial',
    ctaHref: 'https://dashboard.easibill.com/',
    popular: false,
    badge: null,
    features: [
      'Unlimited patients',
      'Automated WhatsApp refill reminders',
      'Your own WhatsApp number (no API needed)',
      'Patient records — medicine, interval, history',
      'Daily queue — due, overdue, recently refilled',
      'Medicine catalog with default intervals',
      'CSV patient import',
      'Hindi + English message templates',
      'Email support',
    ],
    note: '14-day free trial. No card required.',
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/month',
    tagline: 'For pharmacies ready to run campaigns and measure retention.',
    cta: 'Start 14-day free trial',
    ctaHref: 'https://dashboard.easibill.com/',
    popular: true,
    badge: 'Most popular',
    features: [
      'Everything in Starter',
      'Official WhatsApp Business number (WABA — no ban risk)',
      'Broadcast campaigns with patient segmentation',
      'Advanced retention analytics',
      'All 5 languages — Hindi, English, Marathi, Telugu, Kannada',
      'Custom message templates',
      'Wallet credits for campaigns (1 credit = 1 message)',
      'Per-message delivery receipts (Sent → Delivered → Read)',
      'Priority WhatsApp support',
    ],
    note: 'Wallet top-up from ₹200. Credits never expire.',
  },
]

const H2_WORDS = ['Simple', 'pricing.', 'No', 'hidden', 'fees.']

export default function PricingSection() {
  const posthog = usePostHog()
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { posthog?.capture('pricing_section_viewed'); obs.disconnect() }
    }, { rootMargin: '-80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [posthog])

  return (
    <section
      id="pricing"
      ref={ref}
      aria-labelledby="pricing-heading"
      className="py-24 px-6 bg-[#18181B]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={viewport}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.h2
            id="pricing-heading"
            variants={stagger}
            className="text-4xl font-bold text-white mb-4 leading-tight"
          >
            {H2_WORDS.map((word, i) => (
              <motion.span key={i} variants={wordVariant} className="inline-block mr-[0.22em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-400 text-lg">
            14-day free trial on both plans. No credit card required. Cancel any time.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-start max-w-3xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, scale: plan.popular ? 0.88 : 0.93, y: 24 }}
              whileInView={{ opacity: 1, scale: plan.popular ? 1.02 : 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              viewport={viewport}
              className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
                plan.popular
                  ? 'bg-[#09090B] border border-amber-500/30 shadow-xl shadow-amber-500/8'
                  : 'bg-[#09090B] border border-zinc-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-wide">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-zinc-500">{plan.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 flex-1" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="h-4 w-4 shrink-0 mt-0.5 text-amber-400"
                      aria-hidden="true"
                    />
                    <span className="text-zinc-400">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="text-xs text-zinc-600">{plan.note}</p>
              )}

              <a
                href={plan.ctaHref}
                onClick={() => posthog?.capture('pricing_cta_clicked', { plan: plan.name, popular: plan.popular })}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 min-h-[44px] ${
                  plan.popular
                    ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                    : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={viewport}
          className="text-center text-sm text-zinc-600 mt-8"
        >
          Prices in INR. EasiBill works alongside your existing billing software (Marg, Vyapar, Ecogreen) — no replacement needed.
        </motion.p>
      </div>
    </section>
  )
}
