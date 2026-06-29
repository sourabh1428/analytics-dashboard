import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const EnhancedAnimations = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const { scrollY } = useScroll();
    const containerRef = useRef(null);
  
    // Advanced parallax and depth effects
    const parallaxY = useTransform(scrollY, [0, 3000], [0, -600]);
    const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);
    const rotation = useTransform(scrollY, [0, 1000], [0, 45]);
    
    // Smooth spring animations
    const smoothY = useSpring(parallaxY, { stiffness: 50, damping: 15 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
    const smoothRotation = useSpring(rotation, { stiffness: 70, damping: 20 });
  
    // Mouse movement effect
    useEffect(() => {
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        mouseX.set((clientX - centerX) / centerX);
        mouseY.set((clientY - centerY) / centerY);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);
  
    return (
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated background gradients */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            scale: smoothScale,
            y: smoothY,
          }}
        />
  
        {/* Floating particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              x: useMotionValue(Math.random() * window.innerWidth),
              y: useMotionValue(Math.random() * window.innerHeight),
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
  
        {/* Animated light beams */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`beam-${i}`}
            className="absolute w-px h-screen bg-gradient-to-b from-amber-500/20 via-blue-500/10 to-transparent"
            style={{
              left: `${33 * (i + 1)}%`,
              transformOrigin: 'top',
            }}
            animate={{
              scaleY: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        ))}
  
        {/* Interactive glow effect */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            x: useTransform(mouseX, [-1, 1], [-200, 200]),
            y: useTransform(mouseY, [-1, 1], [-200, 200]),
          }}
        />
      </div>
    );
  };

  
  export default React.memo(EnhancedAnimations);