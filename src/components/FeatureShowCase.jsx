import React from 'react'
import { motion } from 'framer-motion'
import { 
  ReceiptText, 
  BarChart4, 
  Smartphone, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Users, 
  DollarSign
} from 'lucide-react'

const FeatureShowcase = () => {
  const features = [
    {
      icon: <ReceiptText className="w-6 h-6" />,
      title: "Simple Billing Software",
      description: "Create professional invoices with our user-friendly interface. Perfect for small businesses and shops.",
      color: "from-green-500 to-emerald-700"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Invoicing",
      description: "Generate invoices in seconds. Save templates and send digital copies instantly to customers.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: <BarChart4 className="w-6 h-6" />,
      title: "Business Analytics",
      description: "Track sales, inventory, and customer data with powerful reporting tools and visual dashboards.",
      color: "from-blue-500 to-amber-600"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Ready",
      description: "Access your billing system from any device. Create invoices on the go from your smartphone or tablet.",
      color: "from-red-500 to-pink-700"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-language Support",
      description: "Create invoices in multiple languages and currencies for international customers.",
      color: "from-amber-500 to-orange-700"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure Payments",
      description: "Integrate with popular payment gateways for secure and hassle-free transactions.",
      color: "from-teal-500 to-green-700"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time-saving Automation",
      description: "Automate recurring invoices, payment reminders, and inventory alerts.",
      color: "from-cyan-500 to-blue-700"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Management",
      description: "Maintain customer profiles, purchase history, and communication records in one place.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Cost Effective",
      description: "Affordable pricing plans for businesses of all sizes with no hidden charges.",
      color: "from-fuchsia-500 to-pink-700"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900" data-section="features">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 mb-4 rounded-full bg-zinc-900/30 border border-amber-500/20 backdrop-blur-sm">
              <p className="text-sm font-medium text-amber-400">Powerful Features</p>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Run Your Business
            </h2>
            <p className="max-w-3xl mx-auto text-gray-400 text-lg">
              Easibill combines all the essential tools for creating invoices, managing inventory, and growing your business in one easy-to-use platform.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl group"
            >
              {/* Gradient border hover effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 bg-gradient-to-tr ${feature.color} opacity-20`}></div>
              </div>
              
              <div className="relative p-6 z-10">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${feature.color} flex items-center justify-center mb-4 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a 
            href="/features" 
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r bg-amber-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-600 shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            data-conversion-button="explore-features"
          >
            Explore All Features
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
