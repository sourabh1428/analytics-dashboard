'use client'

// Shared scroll-reveal primitives — vanilla JS versions of the comp's
// `data-lines` (line-mask reveal) and `data-reveal` (block "assemble") beats.
// Both are one-shot: they fire once via `useScrollReveal` (IntersectionObserver
// + rAF, see src/lib/scrollScrub.js) and use the same `seg`/`lerp` helpers a
// full scroll-scrubbed section would use — just time-driven instead of
// scroll-position-driven, since a 300-400vh wrapper would be overkill for a
// single headline or paragraph. Both respect prefers-reduced-motion.

import { useRef } from 'react'
import { seg, lerp } from '@/src/lib/scrollScrub'
import { useScrollReveal } from '@/src/lib/scrollScrub'

// Headline line-by-line mask reveal. `lines` is an array of React nodes, one
// per visual line (can contain mixed-styled spans, e.g. an italic accent word).
export function Lines({ lines, as: Comp = 'h2', className = '', lineClassName = '' }) {
  const containerRef = useRef(null)
  const lineRefs = useRef([])
  lineRefs.current = []
  const addRef = (el) => { if (el) lineRefs.current.push(el) }

  useScrollReveal({
    ref: containerRef,
    threshold: 0.25,
    duration: 750 + lines.length * 130,
    onUpdate: (t) => {
      lineRefs.current.forEach((el, i) => {
        const s = seg(t, i * 0.16, i * 0.16 + 0.62)
        el.style.transform = `translateY(${lerp(112, 0, s)}%)`
      })
    },
  })

  return (
    <Comp className={className} ref={containerRef}>
      {lines.map((line, i) => (
        // leading-none on both wrapper and inner: the parent heading sets a very
        // tight line-height (e.g. leading-[.94]) for overall vertical rhythm, but
        // that box is too short to contain a full glyph's cap-height without
        // clipping once overflow-hidden is applied — so each line gets its own
        // full (1em) box here instead. (No compensating negative margin: on
        // narrower viewports a "line" can itself wrap to two rows, and a fixed
        // margin then overlaps it with the next line — leading-none on every
        // row is the only value that stays correct regardless of wrap count.)
        <span key={i} className="block overflow-hidden leading-none">
          <span
            ref={addRef}
            style={{ transform: 'translateY(112%)', willChange: 'transform' }}
            className={`block leading-none ${lineClassName}`}
          >
            {line}
          </span>
        </span>
      ))}
    </Comp>
  )
}

// Block reveal — "assemble" beat: fades in, rises, and settles from a
// slightly smaller scale, matching data-reveal / data-reveal-delay.
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Comp = 'div',
  onViewportEnter,
  ...rest
}) {
  const elRef = useRef(null)

  useScrollReveal({
    ref: elRef,
    delay,
    duration: 800,
    onUpdate: (t) => {
      const s = seg(t, 0, 1)
      const el = elRef.current
      if (!el) return
      el.style.opacity = String(s)
      el.style.transform = `translateY(${lerp(22, 0, s)}px) scale(${lerp(0.97, 1, s)})`
      if (s >= 1) onViewportEnter?.()
    },
  })

  return (
    <Comp ref={elRef} className={className} style={{ willChange: 'transform, opacity' }} {...rest}>
      {children}
    </Comp>
  )
}
