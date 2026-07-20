'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/src/lib/scrollScrub'

// Buttery inertia scrolling. Lenis physically scrolls the real document (it
// doesn't hijack into a virtual scroll container). GSAP's ScrollTrigger
// drives all scroll-linked motion (see src/lib/scrollScrub.js), so it's
// chained to Lenis's own ticks here rather than the browser's native
// `scroll` event: gsap.ticker drives Lenis's rAF loop, and Lenis reports
// each frame back to ScrollTrigger.update. If this wiring stops, scroll
// appears completely frozen (every native scroll event gets corrected back
// to Lenis's stale position) or ScrollTrigger-driven animations freeze
// mid-scroll. Keep it dependency-free.
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return children
}
