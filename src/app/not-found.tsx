import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">Page not found</h1>
      <p className="mt-4 text-zinc-700">The EasiBill guide you are looking for does not exist yet.</p>
      <Link className="mt-8 font-semibold text-emerald-700 hover:text-emerald-800" href="/">
        Back to EasiBill
      </Link>
    </main>
  );
}
