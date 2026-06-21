import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EasibillFeatures = lazy(() => import('../components/easibill/EasibillFeatures'));
const EasibillCTA = lazy(() => import('../components/easibill/EasibillCTA'));

const DASHBOARD_LOGIN_URL = 'https://easibill.vercel.app/login';

const comparison = [
  { label: 'Setup time',           manual: 'None',           crm: '2–4 weeks',     easibill: '< 5 minutes' },
  { label: 'Monthly staff effort', manual: 'Hours of chats', crm: 'Training needed', easibill: 'Daily 2-min review' },
  { label: 'Patient tracking',     manual: 'Memory / notebook', crm: 'Spreadsheet import', easibill: 'Built-in, automatic' },
  { label: 'Reminder automation',  manual: 'None',           crm: 'Complex setup',  easibill: 'On by default' },
  { label: 'Monthly cost',         manual: '₹0',             crm: '₹800–2,500/user', easibill: 'From ₹299' },
];

const FeaturesPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Product features</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Every tool your pharmacy counter needs. Nothing it doesn't.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Easibill is not a CRM. It is a focused retention tool that fits the way a pharmacy counter already works — no migration, no training programme, no bloat.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <motion.a
                href={DASHBOARD_LOGIN_URL}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Start 14-day trial
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </motion.a>
              <motion.a
                href="/lead"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
              >
                Book pharmacy demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature grid (reuse existing section) */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillFeatures />
      </Suspense>

      {/* Comparison table */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">How it compares</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Designed for pharmacies, not generic businesses.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
          >
            {/* Table header */}
            <div className="grid grid-cols-4 gap-px bg-slate-200">
              <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500" />
              <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">Manual WhatsApp</div>
              <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">Generic CRM</div>
              <div className="bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">Easibill</div>
            </div>
            {/* Rows */}
            {comparison.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-4 gap-px bg-slate-200 ${index === comparison.length - 1 ? '' : ''}`}
              >
                <div className="bg-white px-5 py-4 text-sm font-medium text-slate-700">{row.label}</div>
                <div className="bg-white px-5 py-4 text-sm text-slate-500">{row.manual}</div>
                <div className="bg-white px-5 py-4 text-sm text-slate-500">{row.crm}</div>
                <div className="flex items-center gap-2 bg-emerald-50/50 px-5 py-4 text-sm font-medium text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                  {row.easibill}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA strip */}
      <Suspense fallback={<LoadingSpinner />}>
        <EasibillCTA />
      </Suspense>
    </div>
  );
};

export default FeaturesPage;
