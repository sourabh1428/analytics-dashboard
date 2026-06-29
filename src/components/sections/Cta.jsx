'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { PieChart, Lightbulb } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">
            Ready to Make Data-Driven Decisions?
          </h2>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi.
          </p>
          <Button className="bg-amber-500 hover:bg-amber-600">
            Start Now
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex justify-center space-x-12"
        >
          <PieChart className="h-16 w-16 text-amber-500" />
          <Lightbulb className="h-16 w-16 text-amber-500" />
        </motion.div>
      </div>
    </section>
  )
}

