"use client";

import { motion } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import { track } from '../../utils/mixpanel';

const plans = [
  {
    name: 'Starter',
    price: 'Rs. 299',
    description: 'For one-store local businesses starting follow-up automation.',
    cta: 'Start free trial',
    features: ['Unlimited customer records', 'Automatic follow-up reminders', '1,000 WhatsApp reminders/month', 'Daily due and overdue list', 'Basic delivery analytics', 'Email support'],
  },
  {
    name: 'Pro',
    price: 'Rs. 999',
    description: 'For local businesses growing retention and campaigns.',
    cta: 'Choose Pro',
    featured: true,
    features: ['Everything in Starter', 'Broadcast messaging', 'Customer tags and segments', 'Advanced retention reports', 'Custom reminder intervals', 'Priority phone support'],
  },
];

const faqs = [
  ['Can I use this with Marg or Ecogreen?', 'Yes. Easibill works as the follow-up reminder layer beside your billing software. No migration is required.'],
  ['Do I need technical staff?', 'No. Business staff can add customers, review due lists, and track reminders from the dashboard.'],
  ['What happens above 1,000 messages?', 'You can add message credits or move to Pro. High-volume pricing is available for larger businesses.'],
  ['Is customer data safe?', 'Your business owns its data. Access is restricted, reminders are tracked, and data is not shared across businesses.'],
];

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const EasibillPricing = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Simple pricing.{' '}
            <span className="text-emerald-400">Pays for itself fast.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/45">
            Transparent monthly plans with no lock-in, no setup fee, and a 14-day free trial.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`relative rounded-2xl p-6 ${
                plan.featured
                  ? 'border border-emerald-500/30 bg-emerald-500 text-black shadow-xl shadow-emerald-500/20'
                  : 'border border-white/[0.08] bg-white/[0.04] text-white backdrop-blur-sm'
              }`}
            >
              {plan.featured && (
                <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-black">
                  Most popular
                </div>
              )}
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className={`mt-3 max-w-sm leading-7 ${plan.featured ? 'text-black/70' : 'text-white/45'}`}>
                {plan.description}
              </p>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                <span className={`pb-2 text-sm ${plan.featured ? 'text-black/60' : 'text-white/40'}`}>/month</span>
              </div>
              <p className={`mt-2 text-sm ${plan.featured ? 'text-black/60' : 'text-white/35'}`}>No card needed for trial.</p>

              <a
                href={DASHBOARD_LOGIN_URL}
                onClick={() => track('trial_started', { source: 'pricing', plan: plan.name })}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  plan.featured
                    ? 'bg-black text-white hover:bg-neutral-900 focus:ring-black focus:ring-offset-emerald-500'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 focus:ring-emerald-500 focus:ring-offset-[#080d0a]'
                }`}
              >
                {plan.cta}
              </a>

              <div className={`mt-8 space-y-4 border-t pt-8 ${plan.featured ? 'border-black/10' : 'border-white/[0.07]'}`}>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className={`mt-0.5 h-5 w-5 shrink-0 ${plan.featured ? 'text-black' : 'text-emerald-400'}`} />
                    <span className={plan.featured ? 'text-black/80' : 'text-white/55'}>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Payback block */}
        <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-emerald-500/[0.15] bg-emerald-500/[0.06] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="shrink-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Payback should be obvious.</h3>
                <p className="mt-1 text-white/45">Recovering even a handful of repeat follow-ups can cover the monthly plan.</p>
              </div>
            </div>
            <a
              href="/lead"
              className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
            >
              Talk to sales
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          {faqs.map(([question, answer], index) => (
            <motion.details
              key={question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                {question}
                <span className="text-xl leading-none text-white/30 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-7 text-white/45">{answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EasibillPricing;
