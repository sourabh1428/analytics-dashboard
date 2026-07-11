'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Wraps a card in a perspective 3D pointer-tilt — rotation follows the
// cursor position within the card bounds, springs back to flat on leave.
export default function TiltCard({ children, className = '', variants, whileHover, onHoverStart, style, ...rest }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const rotateX = useTransform(springY, [0, 1], [7, -7])
  const rotateY = useTransform(springX, [0, 1], [-7, 7])
  const glowX = useTransform(springX, [0, 1], ['0%', '100%'])
  const glowY = useTransform(springY, [0, 1], ['0%', '100%'])

  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  function handlePointerLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.article
      variants={variants}
      whileHover={whileHover}
      onHoverStart={onHoverStart}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, ...style }}
      className={`relative group ${className}`}
      {...rest}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(280px circle at ${gx} ${gy}, rgba(245,158,11,0.12), transparent 70%)`
          ),
        }}
      />
      {children}
    </motion.article>
  )
}
