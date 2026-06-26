"use client";

const ROW_ONE = [
  'Kumar Medicos · Bengaluru',
  'Shree Pharmacy · Pune',
  'City Medical Store · Delhi',
  'Raj Medicals · Mumbai',
  'Sai Drug House · Hyderabad',
  'Lakshmi Pharmacy · Chennai',
  'Bhandari Medical · Jaipur',
  'Apollo Pharmacy · Ahmedabad',
  'Nirmala Medicos · Nagpur',
  'Shah Drug Store · Surat',
  'Guru Nanak Medicals · Ludhiana',
  'Wellness Pharmacy · Kolkata',
];

const ROW_TWO = [
  'Sri Venkateswara Medicals · Vijayawada',
  'Patel Drug House · Vadodara',
  'New Life Pharmacy · Bhopal',
  'Om Sai Medicals · Indore',
  'Ramdev Drug Store · Kochi',
  'Mother India Medicals · Patna',
  'Balaji Pharmacy · Coimbatore',
  'Sunrise Medical Store · Lucknow',
  'Siva Sakthi Medicals · Madurai',
  'Holy Cross Pharmacy · Agra',
  'Swastik Drug House · Nashik',
  'Durgadevi Medicals · Visakhapatnam',
];

function MarqueeRow({ items, reverse = false, duration = '40s' }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="relative flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className={`flex shrink-0 gap-0 whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ '--marquee-duration': duration }}
        aria-hidden="true"
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-5 text-sm font-medium text-slate-300/80"
          >
            {name}
            <span className="h-1 w-1 rounded-full bg-emerald-500/60" />
          </span>
        ))}
      </div>
      {/* Screen-reader version — static, non-repeated */}
      <span className="sr-only">{items.join(', ')}</span>
    </div>
  );
}

export default function PharmacyMarquee() {
  return (
    <section
      aria-label="Trusted pharmacies using EasiBill"
      className="relative overflow-hidden bg-slate-950 py-5"
    >
      {/* Subtle top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

      <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
        Trusted by pharmacies across India
      </div>

      <div className="space-y-1 pause-on-hover">
        <MarqueeRow items={ROW_ONE} duration="40s" />
        <MarqueeRow items={ROW_TWO} reverse duration="44s" />
      </div>
    </section>
  );
}
