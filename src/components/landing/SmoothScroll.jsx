'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from '@/src/lib/scrollScrub'

// Buttery inertia scrolling. Lenis physically scrolls the real document (it
// doesn't hijack into a virtual scroll container), driven by its own plain
// requestAnimationFrame loop — Lenis intercepts native wheel/touch input and
// replays it through its own animated scroll position, so if this loop ever
// stops ticking, scroll appears completely frozen (every native scroll event
// gets corrected back to Lenis's stale position). GSAP's ScrollTrigger (see
// src/lib/scrollScrub.js) drives all scroll-linked motion, so it's told to
// resync on every Lenis tick via `lenis.on('scroll', ...)` rather than
// relying on the browser's native `scroll` event. Keep this loop
// dependency-free.
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return children
}
