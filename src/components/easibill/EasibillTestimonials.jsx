import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Owner, Kumar Medicos',
    location: 'Bengaluru',
    text: 'We used to remember only the regular diabetes patients. Easibill now shows the full due list every morning, and my staff sends follow-ups without me checking WhatsApp chats.',
  },
  {
    name: 'Priya Sharma',
    role: 'Owner, Shree Pharmacy',
    location: 'Pune',
    text: 'The best part is that it does not feel like a CRM. We record the medicine, and the reminder is handled. Patients like the message because it comes at the right time.',
  },
  {
    name: 'Amit Patel',
    role: 'Pharmacy Manager',
    location: 'Indore',
    text: 'We tried manual reminder lists before. They stopped working whenever the counter got busy. Easibill gives us a simple system the team can actually follow.',
  },
];

const proof = [
  ['120+', 'pharmacy owners interviewed'],
  ['10k+', 'reminders sent in pilots'],
  ['< 4 hr', 'avg. support response time'],
  ['14 days', 'free trial, no card needed'],
];

const EasibillTestimonials = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">Trust</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Built around how Indian pharmacy counters really work.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            Every pharmacy owner we spoke to said the same thing: patients come back when the reminder arrives at the right time — not when someone at the counter remembers to follow up.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-1 text-amber-400">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-slate-300" />
              </div>
              <p className="min-h-32 leading-8 text-slate-700">&quot;{testimonial.text}&quot;</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 text-sm font-semibold text-emerald-900">
                  {testimonial.name.split(' ').map((part) => part[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.location}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mt-8 grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4"
        >
          {proof.map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="text-3xl font-semibold text-slate-950">{value}</p>
              <p className="mt-2 text-sm leading-5 text-slate-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default EasibillTestimonials;
