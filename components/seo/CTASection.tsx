import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">Ready to simplify billing?</h2>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          href="/"
        >
          Start Using EasiBill
        </Link>
      </div>
    </section>
  );
}
