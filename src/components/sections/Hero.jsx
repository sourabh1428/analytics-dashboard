'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronRight } from 'lucide-react'
import { AnalyticsChart } from "../ui/chart"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <motion.h1 
            className="text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Intelligent Insights for Agile Enterprises
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              className="bg-amber-500 hover:bg-amber-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              as={motion.button}
            >
              Start Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[400px]"
        >
          <AnalyticsChart />
        </motion.div>
      </div>
    </section>
  )
}

