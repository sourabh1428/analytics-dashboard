'use client'

import { motion } from "framer-motion"
import { Card } from "../ui/card"

export function PredictiveInsights() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <Card className="bg-black/40 border-gray-800 backdrop-blur-sm p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-amber-500" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-2 bg-gray-700 rounded w-3/4" />
                <div className="h-2 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-2 bg-gray-700 rounded" />
              ))}
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">
            Stay Ahead of Your Competition with Predictive Insights
          </h2>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

