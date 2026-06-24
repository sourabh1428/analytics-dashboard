export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 space-y-6">
      <div className="h-8 rounded-lg bg-zinc-100 animate-pulse w-3/4" />
      <div className="h-6 rounded-lg bg-zinc-100 animate-pulse" />
      <div className="h-6 rounded-lg bg-zinc-100 animate-pulse w-5/6" />
      <div className="h-6 rounded-lg bg-zinc-100 animate-pulse w-2/3" />
    </main>
  );
}
