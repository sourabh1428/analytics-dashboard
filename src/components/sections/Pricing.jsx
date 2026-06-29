'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Check } from 'lucide-react'

const plans = [
  {
    title: "Basic Plan",
    price: "19",
    features: ["This is a feature", "This is a feature", "This is a feature", "This is a feature"]
  },
  {
    title: "Pro Plan",
    popular: true,
    price: "29",
    features: ["This is a feature", "This is a feature", "This is a feature", "This is a feature", "This is a feature"]
  },
  {
    title: "Enterprise Plan",
    price: "49",
    features: ["This is a feature", "This is a feature", "This is a feature", "This is a feature", "This is a feature"]
  }
]

export function Pricing() {
  return (
    <section className="py-20 px-6" id="pricing">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Supercharge Your Analytics
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-sm rounded-full">
                  Popular
                </div>
              )}
              <Card className="bg-black/40 border-gray-800 p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <motion.li 
                      key={j} 
                      className="flex items-center text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (i * 0.2) + (j * 0.1) }}
                      viewport={{ once: true }}
                    >
                      <Check className="h-5 w-5 text-amber-500 mr-2" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <Button 
                  className={plan.popular ? "w-full bg-amber-500 hover:bg-amber-600" : "w-full"}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Try for free
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

