import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Headphones, MessageCircle } from 'lucide-react';

const trial = ['Connect your pharmacy profile', 'Add or import patients', 'Send your first reminders', 'Review refill performance'];

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/login';

const EasibillCTA = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/25">
        <div className="relative isolate p-7 sm:p-10 lg:p-14">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.35),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.28),transparent_30%)]" />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
            animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">Start small, recover fast</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Stop letting refill revenue depend on memory.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Launch Easibill with one store, one staff workflow, and one simple goal: bring chronic-care patients back before they buy elsewhere.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href={DASHBOARD_LOGIN_URL}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Start free trial
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </motion.a>
                <motion.a
                  href="mailto:hello@easibill.io"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <Headphones className="h-4 w-4" />
                  Talk to the team
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-300 p-3 text-emerald-950">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Your first 14 days</h3>
                  <p className="text-sm text-slate-300">A guided setup path, not an empty dashboard.</p>
                </div>
              </div>
              <div className="space-y-3">
                {trial.map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-slate-100">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-300" />
                    <span>{item}</span>
                    <span className="ml-auto rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">0{index + 1}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EasibillCTA;
