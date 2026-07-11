"use client";

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Star } from 'lucide-react';
import { fadeUpBlur, springCard, stagger, VIEWPORT } from '../../utils/animations';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Owner, Kumar Medicos',
    location: 'Bengaluru',
    text: 'We used to remember only the familiar faces. Now EasiBill shows the full due list every morning and staff sends follow-ups without anyone checking WhatsApp chats manually.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Owner, Shree Wellness Spa',
    location: 'Pune',
    text: 'It does not feel like a CRM. We record the service and the reminder is just handled. Customers actually like getting the message because it comes at exactly the right time.',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    role: 'Store Manager',
    location: 'Indore',
    text: 'Tried manual reminder lists before — they collapsed when the counter got busy. EasiBill gives staff a simple system they can actually follow without me supervising every step.',
    rating: 4,
  },
  {
    name: 'Sunita Rao',
    role: 'Owner, Sai Medical Hall',
    location: 'Hyderabad',
    text: 'The GST bill on WhatsApp saves us at least 20 minutes every day at the counter. Customers love that they can forward the bill directly to their insurance provider.',
    rating: 5,
  },
  {
    name: 'Vijay Nair',
    role: 'Owner, VN Medicals',
    location: 'Kochi',
    text: "The refill reminder recovered three diabetes patients in the first week who had quietly shifted to a nearby shop. That's the kind of ROI I wasn't expecting so fast.",
    rating: 5,
  },
  {
    name: 'Meena Agarwal',
    role: 'Co-owner, Agarwal Drug House',
    location: 'Jaipur',
    text: 'Setup took less than 30 minutes including importing our patient list. The team on WhatsApp walked us through everything. No IT person required at all.',
    rating: 4,
  },
];

const ROW_A = [...testimonials, ...testimonials];
const ROW_B = [...testimonials.slice(3), ...testimonials.slice(0, 3), ...testimonials.slice(3), ...testimonials.slice(0, 3)];

function CountUp({ to, suffix = '', prefix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN')
  );

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, to, { duration: 1.8, ease: 'easeOut' });
    return controls.stop;
  }, [isInView, count, to]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const proof = [
  { display: '2,400+', to: 2400, suffix: '+', label: 'local businesses active' },
  { display: '18M+', to: 18, suffix: 'M+', label: 'bills sent via WhatsApp' },
  { display: '34%', to: 34, suffix: '%', label: 'avg increase in return customers' },
  { display: '₹0', to: 0, prefix: '₹', label: 'setup cost' },
];

function TestimonialCard({ t }) {
  return (
    <div className="w-[300px] shrink-0 cursor-default rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12]">
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'fill-white/[0.08] text-white/[0.08]'}`}
          />
        ))}
      </div>
      <p className="text-sm leading-6 text-white/55">&ldquo;{t.text}&rdquo;</p>
      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <p className="text-sm font-semibold text-white">{t.name}</p>
        <p className="text-xs text-white/35">{t.role} · {t.location}</p>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false, duration = '50s' }) {
  return (
    <div
      className="relative flex overflow-hidden py-2"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
      }}
    >
      <div
        className={`flex gap-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ '--marquee-duration': duration }}
      >
        {items.map((t, i) => <TestimonialCard key={`${t.name}-${i}`} t={t} />)}
      </div>
    </div>
  );
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'EasiBill',
  description: 'Easy billing software for local businesses with WhatsApp follow-up reminders.',
  url: 'https://easibill.site',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '120', bestRating: '5', worstRating: '1' },
  review: testimonials.map((t) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: t.name },
    reviewBody: t.text,
    reviewRating: { '@type': 'Rating', ratingValue: String(t.rating) },
  })),
};

const EasibillTestimonials = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <motion.div
            className="text-center"
            variants={fadeUpBlur}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Built for how Indian{' '}
              <span className="text-emerald-400">local businesses</span>{' '}
              actually work.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/45">
              Every owner we talked to said the same thing: customers return when the reminder arrives at the right moment — not when someone remembers.
            </p>
          </motion.div>

          {/* Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="-mx-4 mt-12 space-y-4 pause-on-hover sm:-mx-6 lg:-mx-8"
          >
            <MarqueeRow items={ROW_A} duration="55s" />
            <MarqueeRow items={ROW_B} reverse duration="60s" />
          </motion.div>

          {/* Proof stats */}
          <motion.div
            className="mt-10 grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:grid-cols-4"
            variants={stagger(0.1, 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {proof.map(({ to, suffix, prefix, label }) => (
              <motion.div
                key={label}
                variants={springCard}
                className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-5 py-4 text-center"
              >
                <p className="text-3xl font-bold tracking-tight text-white">
                  <CountUp to={to} suffix={suffix} prefix={prefix} />
                </p>
                <p className="mt-1.5 text-sm text-white/40">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default EasibillTestimonials;
