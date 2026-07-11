'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { frame, cancelFrame } from 'framer-motion'

// Buttery inertia scrolling, synced to Framer Motion's own frame loop so
// scroll-linked transforms (useScroll/useTransform) stay perfectly in step
// with the smoothed scroll position instead of racing it.
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function update(data) {
      lenis.raf(data.timestamp)
    }

    frame.update(update, true)
    return () => {
      cancelFrame(update)
      lenis.destroy()
    }
  }, [])

  return children
}
