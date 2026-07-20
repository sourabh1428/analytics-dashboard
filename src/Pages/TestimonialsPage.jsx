"use client";

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, Star } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EasibillCTA = lazy(() => import('../components/easibill/EasibillCTA'));

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Owner, Kumar Medicos',
    location: 'Bengaluru',
    text: 'We used to remember only the regular customers. Easibill now shows the full due list every morning, and my staff sends follow-ups without me checking WhatsApp chats.',
  },
  {
    name: 'Priya Sharma',
    role: 'Owner, Shree Wellness Spa',
    location: 'Pune',
    text: 'The best part is that it does not feel like a CRM. We record the service, and the reminder is handled. Customers like the message because it comes at the right time.',
  },
  {
    name: 'Amit Patel',
    role: 'Clinic Manager',
    location: 'Indore',
    text: 'We tried manual reminder lists before. They stopped working whenever the counter got busy. Easibill gives us a simple system the team can actually follow.',
  },
  {
    name: 'Sunita Joshi',
    role: 'Owner, Joshi Medical Store',
    location: 'Bhopal',
    text: 'Before Easibill, I had a notebook of dates I kept forgetting. Now the list is ready every morning and I do not need to think about it at all.',
  },
  {
    name: 'Ravi Mehta',
    role: 'Owner, Mehta General Store',
    location: 'Ahmedabad',
    text: 'WhatsApp reminders from our own number feel personal. Customers respond much better than a generic blast from an unknown sender.',
  },
  {
    name: 'Deepa Nair',
    role: 'Owner, Nair Medicals',
    location: 'Kochi',
    text: 'We recovered three customers in the first week who had not visited in two months. That alone paid for the whole year.',
  },
];

const proof = [
  ['120+', 'local business owners interviewed'],
  ['10k+', 'reminders sent in pilots'],
  ['< 4 hr', 'avg. support response time'],
  ['14 days', 'free trial, no card needed'],
];

const featured = testimonials[5]; // Deepa Nair pull-quote

const TestimonialsPage = () => {
  return (
    <div className="space-y-16 pb-20 pt-28 md:space-y-24 md:pb-28 md:pt-36">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          >
            <div>
              <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-rust">Real local businesses</p>
              <h1 className="mt-4 text-balance font-display text-5xl font-extrabold uppercase tracking-[-0.018em] text-ink sm:text-6xl">
                Built around how local business counters really work.
              </h1>
            </div>
            <div className="space-y-5">
              <p className="text-lg leading-8 text-mutedink">
                We interviewed over 120 local business owners before writing a line of code. Every feature in Easibill came from a real counter workflow — not a whiteboard assumption.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href={DASHBOARD_LOGIN_URL}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-2 bg-green px-6 py-3.5 font-mono text-sm tracking-[0.08em] text-paper transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
                >
                  Start 14-day trial
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </motion.a>
                <motion.a
                  href="/lead"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center border border-ink bg-paper-white px-6 py-3.5 font-mono text-sm tracking-[0.08em] text-ink transition hover:bg-ink hover:text-paper"
                >
                  Book a demo
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proof bar */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="grid gap-3 border border-ink bg-paper-white p-5 shadow-[8px_8px_0_#17150F] md:grid-cols-4"
          >
            {proof.map(([value, label]) => (
              <div key={label} className="border border-ink bg-paper-alt p-5 text-center">
                <p className="font-display text-3xl font-extrabold text-ink">{value}</p>
                <p className="mt-2 text-sm leading-5 text-mutedink">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial grid — 6 cards */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                className="border border-ink bg-paper-white p-6 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#17150F]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex gap-1 text-rust">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 text-faint" />
                </div>
                <p className="min-h-28 leading-8 text-ink-soft">&quot;{testimonial.text}&quot;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-ink/15 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-pale text-sm font-semibold text-green">
                    {testimonial.name.split(' ').map((part) => part[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{testimonial.name}</p>
                    <p className="text-sm text-mutedink">{testimonial.role}, {testimonial.location}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured pull-quote — dark background */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden bg-ink p-8 text-paper shadow-[8px_8px_0_#17150F] sm:p-12"
          >
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <Quote className="mx-auto mb-6 h-10 w-10 text-green-bright" />
              <p className="text-2xl font-semibold leading-9 sm:text-3xl sm:leading-10">
                &quot;{featured.text}&quot;
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-pale text-sm font-semibold text-green">
                  {featured.name.split(' ').map((part) => part[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="font-semibold">{featured.name}</p>
                  <p className="text-sm text-faint">{featured.role}, {featured.location}</p>
                </div>
              </div>
            </div>
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

export default TestimonialsPage;
