import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const steps = [
  {
    number: '1',
    title: 'Customer Data Collection',
    description: 'Gather and organize customer data from your sales, marketing campaigns, and interactions to better understand your audience.'
  },
  {
    number: '2',
    title: 'Data Segmentation',
    description: 'Use advanced algorithms to categorize your customer data, making it easier to target specific segments for personalized marketing.'
  },
  {
    number: '3',
    title: 'Insights & Analytics',
    description: 'Leverage powerful analytics tools to uncover valuable insights about customer behavior and campaign performance.'
  },
  {
    number: '4',
    title: 'Campaign Prediction',
    description: 'Utilize predictive models to anticipate how different marketing strategies will perform, optimizing your approach.'
  },
  {
    number: '5',
    title: 'Actionable Recommendations',
    description: 'Receive customized recommendations that help you fine-tune your campaigns and business strategies for maximum impact.'
  },
  {
    number: '6',
    title: 'Continuous Improvement',
    description: 'Refine your marketing efforts and customer engagement strategies by incorporating real-time feedback and data insights.'
  }
]

const Process = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="process" className="container mx-auto px-6 py-20" ref={ref}>
      <motion.h2
        className="text-5xl font-bold text-center p-4 text-5xl font-bold bg-gradient-to-r from-amber-500 to-black text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Our Data-Driven Process
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-gray-900 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">{step.number}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Process
