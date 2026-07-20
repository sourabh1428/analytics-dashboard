'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/src/lib/scrollScrub'

// A "shutter opens, image develops" beat — echoes Hero's own copy
// ("OPENING THE SHUTTER") and its scanline/print-head vocabulary, rather
// than a generic caption-over-photo band. Two ink shutter blades slide away
// vertically (mechanical, not a soft fade), then a scan-head sweeps once
// top-to-bottom as the image resolves from high-contrast/desaturated to
// full colour — like a document coming off a scanner. The scroll-scrub
// Ken Burns settle continues underneath for the rest of the band's transit.
export default function WideImageBand() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  const shutterTopRef = useRef(null)
  const shutterBottomRef = useRef(null)
  const scanRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img) return undefined

    if (prefersReducedMotion()) {
      gsap.set(img, { scale: 1, filter: 'grayscale(0) contrast(1)' })
      gsap.set(shutterTopRef.current, { yPercent: -100 })
      gsap.set(shutterBottomRef.current, { yPercent: 100 })
      gsap.set(scanRef.current, { opacity: 0 })
      return undefined
    }

    const ctx = gsap.context(() => {
      // Continuous scrub: image transits from oversized/desaturated to
      // settled/full-colour across the band's own scroll range.
      gsap.fromTo(
        img,
        { scale: 1.18, filter: 'grayscale(1) contrast(1.15)' },
        {
          scale: 1,
          filter: 'grayscale(0) contrast(1)',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      // One-shot mechanical reveal: shutter blades snap open, then a scan
      // bar sweeps once — fires the first time the band clears the fold.
      const openTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
      openTl
        .to(shutterTopRef.current, { yPercent: -100, duration: 0.55, ease: 'power4.inOut' }, 0)
        .to(shutterBottomRef.current, { yPercent: 100, duration: 0.55, ease: 'power4.inOut' }, 0)
        .fromTo(
          scanRef.current,
          { top: '0%', opacity: 1 },
          { top: '100%', opacity: 1, duration: 0.7, ease: 'power2.inOut' },
          0.35
        )
        .to(scanRef.current, { opacity: 0, duration: 0.15 }, '>-0.05')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-ink">
      <div className="relative h-[54vh] w-full">
        <div ref={imgRef} className="absolute inset-0" style={{ willChange: 'transform, filter' }}>
          <Image
            src="/images/market-street.png"
            alt="A lively street of independent local shops"
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        <div ref={shutterTopRef} className="absolute inset-x-0 top-0 z-[2] h-1/2 bg-ink" style={{ willChange: 'transform' }} />
        <div ref={shutterBottomRef} className="absolute inset-x-0 bottom-0 z-[2] h-1/2 bg-ink" style={{ willChange: 'transform' }} />

        <div
          ref={scanRef}
          className="pointer-events-none absolute inset-x-0 z-[3] h-[2px] bg-green-bright"
          style={{ top: '0%', opacity: 0, boxShadow: '0 0 0 1px rgba(23,21,15,.4)', willChange: 'top, opacity' }}
        />
      </div>
    </section>
  )
}
