import React, { useRef, useEffect, useMemo, useCallback } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"

const GridLines = React.memo(() => (
  <>
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={`grid-${i}`}
        className="absolute w-full h-full rounded-full border border-red-500/20"
        style={{
          transform: `rotateY(${i * 15}deg) rotateX(${i * 15}deg)`,
          transformStyle: "preserve-3d",
        }}
      />
    ))}
  </>
))

const SurfaceDetails = React.memo(() => (
  <>
    {[...Array(20)].map((_, i) => {
      const width = Math.random() * 40 + 10
      const height = Math.random() * 40 + 10
      const left = Math.random() * 100
      const top = Math.random() * 100
      const translateZ = Math.random() * 10
      const delay = Math.random() * 2

      return (
        <motion.div
          key={`detail-${i}`}
          className="absolute rounded-full bg-amber-400/20"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}%`,
            top: `${top}%`,
            transform: `translateZ(${translateZ}px)`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay,
          }}
        />
      )
    })}
  </>
))

const OrbitingElements = React.memo(() => (
  <>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`orbit-${i}`}
        className="absolute w-full h-full rounded-full border border-red-5000/10"
        style={{
          transform: `rotateY(${i * 60}deg) rotateX(${i * 30}deg)`,
        }}
      >
        <motion.div
          className="absolute w-4 h-4 bg-amber-400 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>
    ))}
  </>
))

const Meteors = React.memo(() => (
  <>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`meteor-${i}`}
        className="absolute w-1 h-16 origin-top"
        style={{
          background: "linear-gradient(to bottom, rgba(139, 92, 246, 0.8), transparent)",
          transformStyle: "preserve-3d",
        }}
        initial={{
          top: "-20%",
          left: "120%",
          rotateZ: 45,
          rotateY: 0,
          opacity: 0,
        }}
        animate={{
          top: "120%",
          left: "-20%",
          rotateZ: 45,
          rotateY: 360,
          opacity: [0, 1, 0],
          z: [-100, 100],
        }}
        transition={{
          duration: 2.5,
          delay: i * 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: Math.random() * 5,
        }}
      />
    ))}
  </>
))

const InteractiveGlobe = React.memo(() => {
  const globeRef = useRef(null)
  const { scrollY } = useScroll()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(scrollY, [0, 1000], [-15, 45]), {
    stiffness: 100,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(scrollY, [0, 1000], [0, 720]), {
    stiffness: 100,
    damping: 30,
  })
  const scale = useSpring(useTransform(scrollY, [0, 300, 600, 900], [1, 1.5, 0.8, 1.2]), {
    stiffness: 100,
    damping: 30,
  })

  const perspective = useTransform(scrollY, [0, 500, 1000], [1000, 2000, 1000])

  const combinedRotateX = useSpring(
    useTransform(mouseY, (value) => value + rotateX.get()),
    {
      stiffness: 400,
      damping: 50,
    },
  )
  const combinedRotateY = useSpring(
    useTransform(mouseX, (value) => value + rotateY.get()),
    {
      stiffness: 400,
      damping: 50,
    },
  )

  const lighting = useTransform(combinedRotateY, [-360, 0, 360], ["30% 30%", "50% 50%", "70% 70%"])

  const handleMouseMove = useCallback(
    (event) => {
      const { clientX, clientY } = event
      const { innerWidth, innerHeight } = window
      mouseX.set((clientX - innerWidth / 2) / 10)
      mouseY.set((clientY - innerHeight / 2) / 10)
    },
    [mouseX, mouseY],
  )



  const memoizedStyles = useMemo(
    () => ({
      perspective,
      transformStyle: "preserve-3d",
    }),
    [perspective],
  )

  const memoizedGlobeStyles = useMemo(
    () => ({
      rotateX: combinedRotateX,
      rotateY: combinedRotateY,
      scale,
      transformStyle: "preserve-3d",
    }),
    [combinedRotateX, combinedRotateY, scale],
  )

  const memoizedSphereStyles = useMemo(
    () => ({
      "--lighting": lighting,
      background: `radial-gradient(circle at var(--lighting), #4c1d95, #1e1b4b)`,
      boxShadow: "inset -30px -30px 60px rgba(0,0,0,0.8), 0 0 60px rgba(139, 92, 246, 0.6)",
      transformStyle: "preserve-3d",
    }),
    [lighting],
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-30 backdrop-filter-none">
      <div ref={globeRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div className="relative" style={memoizedStyles}>
          <motion.div className="w-96 h-96" style={memoizedGlobeStyles}>
           
            <OrbitingElements />
            <Meteors />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
})

export default InteractiveGlobe

