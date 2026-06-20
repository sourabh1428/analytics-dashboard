import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const reminders = [
  { name: 'Anita R.', medicine: 'Metformin 500mg', status: 'Reminder sent', time: '9:00 AM' },
  { name: 'Harish K.', medicine: 'Telmisartan 40mg', status: 'Due tomorrow', time: '28 days' },
  { name: 'Meena S.', medicine: 'Thyroxine 50mcg', status: 'Refilled', time: 'Today' },
];

const metrics = [
  { value: '35+', label: 'patients retained monthly' },
  { value: '5 min', label: 'setup for a pharmacy' },
  { value: '9 AM', label: 'WhatsApp reminders' },
];

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/login';

const EasibillHero = () => {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.20),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.20),transparent_28%),linear-gradient(180deg,#f8faf8_0%,#eefbf6_52%,#ffffff_100%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-16 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/30 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-sm shadow-emerald-900/5 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Refill reminders built for Indian pharmacies
          </div>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Bring every chronic-care patient back on time.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Easibill turns each medicine sale into an automatic WhatsApp refill journey, so pharmacy owners retain recurring patients without chasing lists, chats, or spreadsheets.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:border-emerald-300 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Book pharmacy demo
            </motion.a>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-semibold text-slate-950">{metric.value}</div>
                <div className="mt-1 leading-5">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-300/40 via-cyan-200/30 to-indigo-300/30 blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/85 shadow-2xl shadow-emerald-950/15 backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Today</p>
                <h2 className="text-lg font-semibold text-slate-950">Refill command center</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live
              </div>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                {reminders.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.12 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.medicine}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{item.time}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {item.status}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-xl">
                  <div className="mb-5 flex items-center gap-2 text-sm text-emerald-200">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp preview
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                    Namaste Anita ji, your diabetes medicine is due for refill today. Reply YES and Easibill Pharmacy will keep it ready.
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-emerald-950">Queued for 9:00 AM</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <Bell className="mb-3 h-5 w-5 text-emerald-600" />
                    <p className="text-2xl font-semibold text-slate-950">128</p>
                    <p className="text-sm text-slate-500">due this week</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <TrendingUp className="mb-3 h-5 w-5 text-cyan-600" />
                    <p className="text-2xl font-semibold text-slate-950">42%</p>
                    <p className="text-sm text-slate-500">return lift</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    Pharmacy-owned data
                  </div>
                  <p>Messages go from your workflow with retries, delivery status, and patient history intact.</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute -bottom-6 -left-3 hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur sm:block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-100 p-2 text-cyan-700">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">No missed follow-ups</p>
                <p className="text-xs text-slate-500">Every refill date is tracked</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EasibillHero;
