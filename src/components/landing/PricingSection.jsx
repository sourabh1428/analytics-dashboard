'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

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

export default function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-24 px-6 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="pricing-heading"
            className="text-4xl font-bold text-slate-900 mb-4"
          >
            Simple pricing. No hidden fees.
          </h2>
          <p className="text-gray-500 text-lg">
            14-day free trial on both plans. No credit card required. Cancel any time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-start max-w-3xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              className={`relative rounded-2xl p-7 flex flex-col gap-6 transition-all duration-200 ${
                plan.popular
                  ? 'bg-[#0D0B1E] border border-violet-500/30 shadow-xl shadow-violet-500/10'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-violet-600 text-white text-xs font-bold uppercase tracking-wide">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.tagline}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 flex-1" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? 'text-violet-400' : 'text-violet-600'}`}
                      aria-hidden="true"
                    />
                    <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className={`text-xs ${plan.popular ? 'text-gray-500' : 'text-gray-400'}`}>
                  {plan.note}
                </p>
              )}

              <a
                href={plan.ctaHref}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 min-h-[44px] ${
                  plan.popular
                    ? 'bg-violet-600 text-white hover:bg-violet-500'
                    : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
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
          viewport={{ once: true, margin: '-80px' }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          Prices in INR. EasiBill works alongside your existing billing software (Marg, Vyapar, Ecogreen) — no replacement needed.
        </motion.p>
      </div>
    </section>
  )
}
