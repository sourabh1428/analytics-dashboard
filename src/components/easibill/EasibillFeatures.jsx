import { motion } from 'framer-motion';
import { BellRing, ChartNoAxesCombined, DatabaseZap, ListChecks, MessageSquareText, Tags } from 'lucide-react';

const features = [
  {
    icon: DatabaseZap,
    title: 'Patient refill memory',
    copy: 'Store patient, phone, medicine, refill interval, last purchase, and next due date without changing your ERP.',
  },
  {
    icon: BellRing,
    title: 'Automatic reminders',
    copy: 'Send friendly WhatsApp reminders at 9 AM IST with retry visibility for failed deliveries.',
  },
  {
    icon: ListChecks,
    title: 'Daily action queue',
    copy: 'Know exactly who is due, overdue, or recently refilled before the morning rush begins.',
  },
  {
    icon: Tags,
    title: 'Tags and segments',
    copy: 'Group patients by diabetes, BP, thyroid, senior citizen, or high-value repeat buyer.',
  },
  {
    icon: MessageSquareText,
    title: 'Broadcast campaigns',
    copy: 'Send targeted health camps, seasonal offers, and loyalty messages without blasting everyone.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Retention analytics',
    copy: 'Measure reminders sent, refill response, inactive patients, and recovered monthly revenue.',
  },
];

const rows = [
  ['Today due', '128', 'Send queue ready'],
  ['Failed delivery', '7', 'Needs staff follow-up'],
  ['Recovered revenue', 'Rs. 42,800', 'This month'],
];

const EasibillFeatures = () => {
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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Product depth</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Premium where it matters, simple where staff use it.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Easibill avoids bloated CRM behavior and focuses on the retention jobs a pharmacy performs every day.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-950/20"
          >
            <div className="border-b border-white/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Interactive showcase</p>
              <h3 className="mt-2 text-2xl font-semibold">Retention dashboard</h3>
            </div>
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {rows.map(([label, value, caption]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-sm text-slate-300">{label}</p>
                    <p className="mt-3 text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-xs text-cyan-200">{caption}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl bg-white p-4 text-slate-950">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Patients needing attention</p>
                    <p className="text-xs text-slate-500">Prioritized for staff follow-up</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Auto-sorted</span>
                </div>
                {['Ramesh P. - insulin refill overdue', 'Nisha V. - BP medicine due today', 'Kiran M. - WhatsApp failed'].map((item, index) => (
                  <div key={item} className="flex items-center justify-between border-t border-slate-100 py-3">
                    <span className="text-sm text-slate-700">{item}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-700 transition group-hover:bg-slate-950 group-hover:text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{feature.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EasibillFeatures;
