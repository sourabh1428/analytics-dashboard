'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { useGeo } from '@/src/hooks/useGeo'

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    tagline: 'For pharmacies just getting started with digital billing.',
    cta: 'Start free today',
    ctaHref: '/contact',
    popular: false,
    features: [
      '1 store',
      'Up to 200 bills per month',
      'Digital billing via WhatsApp',
      'Basic inventory tracking',
      'Tax-compliant invoices',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$9',
    period: '/month',
    tagline: 'For pharmacies ready to grow their customer base.',
    cta: 'Start 14-day free trial',
    ctaHref: '/contact',
    popular: true,
    features: [
      '1 store',
      'Unlimited bills',
      'Digital billing via WhatsApp',
      'Refill reminders (automated)',
      'Full inventory + expiry alerts',
      'Tax reports — export for accountant',
      'Customer analytics dashboard',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    price: '$29',
    period: '/month',
    tagline: 'For pharmacy chains and high-volume medical stores.',
    cta: 'Talk to us',
    ctaHref: '/contact',
    popular: false,
    features: [
      'Up to 5 stores',
      'Unlimited bills across all stores',
      'Everything in Growth',
      'Multi-store dashboard',
      'Centralized inventory view',
      'Staff accounts per store',
      'Dedicated onboarding support',
      'SLA-backed uptime guarantee',
    ],
  },
]

const DEFAULT_PRICES = [0, 9, 29]

function formatPrice(sym, amount) {
  if (amount === 0) return `${sym}0`
  return `${sym}${amount.toLocaleString('en-US')}`
}

export default function PricingSection() {
  const geo = useGeo()
  const sym = geo?.currencySymbol ?? '$'
  const rawPrices = geo?.prices ?? DEFAULT_PRICES

  const plans = PLANS.map((plan, i) => ({
    ...plan,
    price: formatPrice(sym, rawPrices[i]),
  }))

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-24 px-6 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
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
            Start free. Upgrade when your pharmacy is ready. Cancel any time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              className={`relative rounded-2xl p-7 flex flex-col gap-6 transition-all duration-200 ${
                plan.popular
                  ? 'bg-slate-900 border border-blue-500/30 shadow-xl shadow-blue-500/10'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wide">
                    Most popular
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
                      className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? 'text-blue-400' : 'text-blue-600'}`}
                      aria-hidden="true"
                    />
                    <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 min-h-[44px] ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
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
          All plans include free data migration from your existing software. No technical setup required.
          {geo && ` Prices shown in ${geo.currencyCode} (${geo.flag} ${geo.countryName}).`}
        </motion.p>
      </div>
    </section>
  )
}
