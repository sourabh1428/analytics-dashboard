import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

const linkGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Customers', href: '/testimonials' },
      { label: 'Book a demo', href: '/contact' },
    ],
  },
  {
    title: 'Use cases',
    links: [
      { label: 'Chronic refills', href: '/' },
      { label: 'WhatsApp reminders', href: '/' },
      { label: 'Patient segments', href: '/' },
      { label: 'Broadcast campaigns', href: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
];

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const goTo = (event, href) => {
    event.preventDefault();
    navigate(href);
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600" data-section="footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-emerald-300">
                EB
              </span>
              <span className="text-2xl font-semibold tracking-tight text-slate-950">Easibill</span>
            </button>
            <p className="mt-5 max-w-md leading-7">
              WhatsApp refill reminders and retention workflows for independent pharmacies in India.
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-700" />
                <a href="mailto:hello@easibill.io" className="hover:text-emerald-800">hello@easibill.io</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-700" />
                <a href="tel:+918001234567" className="hover:text-emerald-800">+91 800-123-4567</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-700" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-semibold text-slate-950">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(event) => goTo(event, link.href)}
                        className="text-sm hover:text-emerald-800"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">Ready to try refill automation?</h3>
              <p className="mt-1 text-sm">Start with one store and your most frequent chronic-care patients.</p>
            </div>
            <a
              href="/contact"
              onClick={(event) => goTo(event, '/contact')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-950"
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Copyright {currentYear} Easibill. All rights reserved.</p>
          <p>Built for pharmacy retention, refill reminders, and patient follow-up.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
