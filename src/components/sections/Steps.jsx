'use client'

import { motion } from "framer-motion"
import { Card } from "../ui/card"

const steps = [
  {
    number: "1",
    title: "Gather Data",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    number: "2",
    title: "Predict Outcomes",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  },
  {
    number: "3",
    title: "Take Action",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
  }
]

export function Steps() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Turn Data into Decisions
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-black/40 border-gray-800 p-6 backdrop-blur-sm relative">
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

