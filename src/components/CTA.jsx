import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { PieChart, LineChart } from 'lucide-react'
import { useNavigate } from 'react-router'

const CTA = () => {
const navigator=useNavigate();

  return (
    <section className="container mx-auto px-6 py-20 bg-gradient-transparent text-white">
      <div className="text-center max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-6 text-8xl font-bold bg-gradient-to-r from-amber-500 to-black text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Make Data-Driven Decisions?
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join thousands of businesses using Easibill to transform their operations and drive growth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button className="bg-amber-500 hover:bg-amber-600 text-lg px-8 py-6" onClick={()=>navigator('/lead')}>
            Contact us !
          </Button>
        </motion.div>
        
      </div>
    </section>
  )
}

export default React.memo(CTA);

