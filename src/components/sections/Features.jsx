'use client'

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LayoutDashboard, Target, BarChart } from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: "Insightful Analytics",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    icon: Target,
    title: "Automate Tasks",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    icon: BarChart,
    title: "Data-Backed Strategies",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  }
]

export function Features() {
  return (
    <section className="py-20 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Everything You Need to Scale
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-black/40 border-gray-800 p-6 backdrop-blur-sm hover:bg-black/60 transition-colors">
                <feature.icon className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

