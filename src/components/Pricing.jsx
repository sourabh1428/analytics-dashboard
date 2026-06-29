import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router'
import ZoomInEffect from '@/Visuals/ZoomInEffect'

const plans = [
  {
    name: 'Basic Plan',
    price: '300',
    features: [
    'Order summaries',
      'Whatsapp messages for sales',
      'Download the reports'
    ]
  },
  {
    name: 'Pro Plan',
    price: '900',
    popular: true,
    features: [
      'Order summaries',
      'Whatsapp messages for sales',
      'Download the reports',
      'Send future campaigns using whatsapp',
      'AI contents',
    ]
  },
  {
    name: 'Enterprise Plan',
    price: '2000',
    features: [
      'Order summaries',
      'Whatsapp messages for sales',
      'Download the reports',
      'Send future campaigns using whatsapp',
      'AI contents',
      'Email messages for sales and marketing',
      'SMS messages for sales and marketing',
      'Email newsletters',
      'Social media integration',
      'Integration with CRM systems',
      'Integration with payment gateways',
    ]
  }
]

const Pricing = () => {
  const navigate=useNavigate();
  return (
    <ZoomInEffect>
    <section className="container mx-auto px-6 py-20 bg-transparent text-white">
      <motion.h2
        className="text-5xl font-bold text-center mb-12 text-4xl font-bold bg-gradient-to-r from-amber-500 to-black text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Supercharge Your Analytics
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`bg-gray-900 p-6 rounded-lg ${plan.popular ? 'border-2 border-amber-500' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">Rs: {plan.price}</span>
              <span className="text-gray-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="text-amber-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className={plan.popular ? 'w-full bg-amber-500 hover: bg-amber-600 ':' w-full bg-white-600'} 
              variant={plan.popular ? 'default' : 'outline'}
              onClick={()=>navigate('lead')}
            >
              Try it
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
    </ZoomInEffect>
  )
}

export default Pricing

