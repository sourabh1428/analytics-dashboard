'use client'

// Shared plumbing for the site's "ledger" scroll-driven motion system.
// GSAP + ScrollTrigger under the hood (synced to the Lenis smooth-scroll
// instance set up in SmoothScroll.jsx), but the public API is unchanged so
// every call site (Hero, DayInTheLife, Testimonials, etc.) keeps working
// without edits. Two flavours:
//
//   useScrollScrub  — long, pinned-stage scrub (Hero, DayInTheLife): a tall
//                      wrapper holds a `position: sticky` stage; progress
//                      `p` (0..1) is derived from a ScrollTrigger tracking
//                      the wrapper against `stickyOffset`/the stage height,
//                      and fed to a bespoke `onUpdate(p, {mx,my})` that
//                      writes transforms/opacity straight to the DOM. Plays
//                      forward AND in reverse — it's a pure function of
//                      scroll position, no one-shot state.
//
//   useScrollReveal  — lighter, one-shot "enter" animation for slim
//                       sections that don't warrant a 300-400vh pinned
//                       wrapper. A ScrollTrigger fires once, then a GSAP
//                       tween advances a linear `t` (0..1) over `duration`
//                       ms; callers combine it with `seg`/`lerp` exactly
//                       like the scrub case, just time-driven instead of
//                       scroll-driven.
//
// Both honor prefers-reduced-motion by short-circuiting straight to the
// final state (`onUpdate(1, ...)`), and clean up all ScrollTriggers/tweens
// on unmount.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

export const clamp = (x, min = 0, max = 1) => Math.max(min, Math.min(max, x))

export const lerp = (a, b, t) => a + (b - a) * t

// Smoothstep of the local [a,b] segment of p — the one easing curve used
// everywhere instead of an easing library.
export const seg = (p, a, b) => {
  const x = clamp((p - a) / (b - a))
  return x * x * (3 - 2 * x)
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Long pinned-stage scrub.
//
// wrapperRef  — the tall (300-400vh) track element.
// stageRef    — the `position: sticky` stage inside it (its offsetHeight is
//               subtracted from the track height to get scrollable travel).
// stickyOffset— the stage's `top` sticky offset in px (e.g. nav height).
// onUpdate(p, { mx, my }) — called with progress 0..1 and, if
//               `mouseParallax` is on, a small ±px parallax offset pair.
export function useScrollScrub({
  wrapperRef,
  stageRef,
  stickyOffset = 0,
  onUpdate,
  reduceMotion,
  mouseParallax = false,
}) {
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper || !onUpdate) return undefined

    const rm = reduceMotion ?? prefersReducedMotion()
    if (rm) {
      onUpdate(1, { mx: 0, my: 0 })
      return undefined
    }

    let mx = 0
    let my = 0
    let lastP = 0

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: `top top+=${stickyOffset}`,
      end: () => {
        const stageH = stageRef?.current?.offsetHeight ?? 0
        const travel = wrapper.offsetHeight - stageH
        return `+=${Math.max(travel, 1)}`
      },
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        lastP = self.progress
        onUpdate(lastP, { mx, my })
      },
    })

    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 14
      my = (e.clientY / window.innerHeight - 0.5) * 10
      onUpdate(lastP, { mx, my })
    }
    if (mouseParallax) window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      trigger.kill()
      if (mouseParallax) window.removeEventListener('mousemove', onMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// Lighter one-shot reveal: fires once when `ref` enters the viewport, then
// advances a *linear* t (0..1) over `duration` ms via a GSAP tween. Callers
// apply `seg`/`lerp` themselves so every element can still get its own
// segment window, matching the scrub vocabulary without a long scroll-linked
// track.
export function useScrollReveal({
  ref,
  onUpdate,
  reduceMotion,
  threshold = 0.2,
  rootMargin = '0px 0px -10% 0px',
  duration = 800,
  delay = 0,
}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !onUpdate) return undefined

    const rm = reduceMotion ?? prefersReducedMotion()
    if (rm) {
      onUpdate(1)
      return undefined
    }

    onUpdate(0)

    // Approximate the old IntersectionObserver's rootMargin/threshold combo
    // as a single ScrollTrigger start point: higher threshold (needs more
    // of the element visible) and a larger negative bottom rootMargin both
    // push the fire point further up the viewport.
    const bottomMarginPct = Math.abs(parseFloat(rootMargin.split(' ')[2]) || 0)
    const startPct = clamp(0.92 - threshold * 0.3 - bottomMarginPct / 100, 0.35, 0.95)

    const proxy = { t: 0 }
    let tween

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: `top ${Math.round(startPct * 100)}%`,
      once: true,
      onEnter: () => {
        tween = gsap.to(proxy, {
          t: 1,
          duration: duration / 1000,
          delay: delay / 1000,
          ease: 'none',
          onUpdate: () => onUpdate(proxy.t),
        })
      },
    })

    return () => {
      trigger.kill()
      tween?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
