"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export type FaqPair = { q: string; a: string };

export function FaqAccordion({ pairs }: { pairs: FaqPair[] }) {
  return (
    <Accordion.Root
      type="single"
      defaultValue="faq-0"
      collapsible
      className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
    >
      {pairs.map((pair, i) => (
        <Accordion.Item key={i} value={`faq-${i}`} className="group">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-zinc-50 data-[state=open]:bg-emerald-50/50">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-semibold leading-6 text-zinc-900">{pair.q}</span>
              <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="px-6 pb-6 pl-16 leading-7 text-zinc-600">{pair.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
