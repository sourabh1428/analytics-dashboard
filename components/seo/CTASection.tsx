import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-zinc-100 bg-zinc-950 px-6 py-16 sm:py-20">
      {/* subtle background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 50%, #10b981 0%, transparent 60%), radial-gradient(circle at 75% 50%, #059669 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
          Built for Indian pharmacies
        </span>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stop doing billing manually.
          <br />
          <span className="text-emerald-400">Let EasiBill handle it.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400">
          WhatsApp refill reminders, bulk GST invoicing, expiry tracking, and purchase order
          management — all in one app designed for Indian pharmacy owners.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="https://easibill.vercel.app/login"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Start free trial →
          </Link>
          <a
            href="mailto:hello@easibill.io"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Talk to us
          </a>
        </div>

        <p className="mt-5 text-xs text-zinc-600">
          No credit card required · Works on mobile · Supports multiple branches
        </p>
      </div>
    </section>
  );
}
