'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { lerp, useScrollScrub } from '@/src/lib/scrollScrub'
import { Reveal } from './reveal'

export default function WideImageBand() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)

  // Subtle Ken Burns-style settle, scrubbed to the band's own scroll-through
  // range (no tall wrapper or sticky stage needed — this is a single beat,
  // not a multi-act pinned sequence): p=0 as the band enters the bottom of
  // the viewport, p=1 as it leaves the top.
  useScrollScrub({
    wrapperRef: sectionRef,
    stickyOffset: typeof window !== 'undefined' ? window.innerHeight : 800,
    onUpdate: (p) => {
      if (imgRef.current) imgRef.current.style.transform = `scale(${lerp(1.08, 1, p)})`
    },
  })

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-ink">
      <div ref={imgRef} className="relative h-[54vh] w-full" style={{ willChange: 'transform' }}>
        <Image
          src="/images/market-street.png"
          alt="A lively street of independent local shops"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <Reveal className="pointer-events-none absolute bottom-6 right-4 border border-ink bg-paper px-3.5 py-2 font-mono text-[11px] tracking-[0.12em] text-ink sm:right-8">
        FIG. 09 — EVERY SHOP ON THIS STREET LOSES CUSTOMERS TO FORGETFULNESS.
      </Reveal>
    </section>
  )
}
