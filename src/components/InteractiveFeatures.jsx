import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const icons = [Loader2, CheckCircle, XCircle, RefreshCw]

const InteractiveFeatures = () => {
  const features = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Feature ${i + 1}`,
    icon: icons[i % icons.length],
  }))

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interactive Features
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: Math.min(feature.id * 0.01, 1.5) }}
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12"
                  >
                    <feature.icon className="w-6 h-6 text-amber-500" />
                  </Button>
                </motion.div>
                <p className="mt-2 text-sm text-center text-gray-700">{feature.name}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default React.memo(InteractiveFeatures)
