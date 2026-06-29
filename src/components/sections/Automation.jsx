'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Card } from "../ui/card"

export function Automation() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold">
            Automate Mundane Tasks With Drag & Drop Platform
          </h2>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi.
          </p>
          <Button className="bg-amber-500 hover:bg-amber-600">
            Start Now
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-black/40 border-gray-800 backdrop-blur-sm p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="h-10 w-10 rounded bg-amber-500/20 flex items-center justify-center">
                    <div className="h-6 w-6 rounded bg-amber-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-700 rounded w-3/4" />
                    <div className="h-2 bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

