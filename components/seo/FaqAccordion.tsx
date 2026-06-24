"use client";

import { useState } from "react";

export type FaqPair = { q: string; a: string };

export function FaqAccordion({ pairs }: { pairs: FaqPair[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
      {pairs.map((pair, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`transition-colors ${isOpen ? "bg-emerald-50/60" : "bg-white hover:bg-zinc-50"}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                  isOpen
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-300 bg-white text-zinc-500"
                }`}
              >
                {isOpen ? "−" : "+"}
              </span>
              <span className="flex-1 text-sm font-semibold leading-6 text-zinc-900">{pair.q}</span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-6 pb-6 pl-16 text-sm leading-7 text-zinc-600">{pair.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
