import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

const MacroAnimations = () => {
  const animations = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Animation ${i + 1}`,
  }))

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Macro Animations
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {animations.map((animation) => (
          <motion.div
            key={animation.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: animation.id * 0.02 }}
          >
            <Card>
              <CardContent className="p-4">
                <motion.div
                  className="w-full h-24 bg-gradient-to-r from-amber-500 to-pink-500 rounded-md"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                    borderRadius: ["0%", "50%", "0%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <p className="mt-2 text-sm text-center">{animation.name}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default MacroAnimations

