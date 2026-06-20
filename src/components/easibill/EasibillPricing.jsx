import { motion } from 'framer-motion';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Rs. 299',
    description: 'For one-store pharmacies starting refill automation.',
    cta: 'Start free trial',
    features: ['Unlimited patient records', 'Automatic refill reminders', '1,000 WhatsApp reminders/month', 'Daily due and overdue list', 'Basic delivery analytics', 'Email support'],
  },
  {
    name: 'Pro',
    price: 'Rs. 999',
    description: 'For pharmacies growing retention and campaigns.',
    cta: 'Choose Pro',
    featured: true,
    features: ['Everything in Starter', 'Broadcast messaging', 'Patient tags and segments', 'Advanced retention reports', 'Custom reminder intervals', 'Priority phone support'],
  },
];

const faqs = [
  ['Can I use this with Marg or Ecogreen?', 'Yes. Easibill works as the refill reminder layer beside your billing software. No migration is required.'],
  ['Do I need technical staff?', 'No. Pharmacy staff can add patients, review due lists, and track reminders from the dashboard.'],
  ['What happens above 1,000 messages?', 'You can add message credits or move to Pro. High-volume pricing is available for larger pharmacies.'],
  ['Is patient data safe?', 'Your pharmacy owns its data. Access is restricted, reminders are tracked, and data is not shared across pharmacies.'],
];

const EasibillPricing = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Pricing</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Affordable enough for one store. Powerful enough to compound.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Transparent monthly plans with no lock-in, no setup fee, and a 14-day free trial.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`relative rounded-[2rem] p-6 shadow-xl ${
                plan.featured
                  ? 'border border-slate-950 bg-slate-950 text-white shadow-slate-950/20'
                  : 'border border-slate-200 bg-white text-slate-950 shadow-slate-950/5'
              }`}
            >
              {plan.featured && (
                <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-950">
                  <Sparkles className="h-3.5 w-3.5" />
                  Best value
                </div>
              )}
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className={`mt-3 max-w-sm leading-7 ${plan.featured ? 'text-slate-300' : 'text-slate-600'}`}>{plan.description}</p>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                <span className={`pb-2 text-sm ${plan.featured ? 'text-slate-300' : 'text-slate-500'}`}>/month</span>
              </div>
              <p className={`mt-2 text-sm ${plan.featured ? 'text-slate-400' : 'text-slate-500'}`}>No card needed for trial.</p>

              <a
                href="/contact"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  plan.featured
                    ? 'bg-white text-slate-950 hover:bg-emerald-100'
                    : 'bg-slate-950 text-white hover:bg-emerald-950'
                }`}
              >
                {plan.cta}
              </a>

              <div className={`mt-8 space-y-4 border-t pt-8 ${plan.featured ? 'border-white/10' : 'border-slate-200'}`}>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className={`mt-0.5 h-5 w-5 flex-shrink-0 ${plan.featured ? 'text-emerald-300' : 'text-emerald-600'}`} />
                    <span className={plan.featured ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Payback should be obvious.</h3>
                <p className="mt-1 text-slate-600">Recovering even a handful of repeat refills can cover the monthly plan.</p>
              </div>
            </div>
            <a href="/contact" className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-500">
              Talk to sales
            </a>
          </div>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          {faqs.map(([question, answer], index) => (
            <motion.details
              key={question}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className="group rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950">
                {question}
                <span className="text-xl leading-none text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-7 text-slate-600">{answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EasibillPricing;
