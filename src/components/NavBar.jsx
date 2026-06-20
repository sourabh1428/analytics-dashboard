import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { name: 'Product', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Customers', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const goTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const linkClass = (path) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? 'bg-slate-950 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    }`;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
      data-section="navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between rounded-full border px-4 transition-all duration-300 ${
            scrolled
              ? 'border-slate-200 bg-white/85 shadow-lg shadow-slate-950/5 backdrop-blur-xl'
              : 'border-white/70 bg-white/55 shadow-sm backdrop-blur'
          }`}
        >
          <button
            type="button"
            onClick={() => goTo('/')}
            className="flex items-center gap-3 py-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Go to Easibill home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-emerald-300">
              EB
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-950">Easibill</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <button key={link.name} type="button" onClick={() => goTo(link.path)} className={linkClass(link.path)}>
                {link.name}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => goTo('/contact')}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Book demo
            </button>
            <button
              type="button"
              onClick={() => goTo('/contact')}
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-950"
              data-conversion-button="get-started"
            >
              Start free trial
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8 md:hidden"
          >
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-950/10 backdrop-blur">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => goTo(link.path)}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {link.name}
                </button>
              ))}
              <div className="mt-2 grid gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => goTo('/contact')}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Book demo
                </button>
                <button
                  type="button"
                  onClick={() => goTo('/contact')}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  Start free trial
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
