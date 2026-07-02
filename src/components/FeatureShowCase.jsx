'use client';

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
  DollarSign,
  ArrowRight
} from 'lucide-react'

const FeatureShowcase = () => {
  const features = [
    {
      icon: <ReceiptText className="w-6 h-6" />,
      title: "Simple Billing Software",
      description: "Create professional invoices with our user-friendly interface. Perfect for independent pharmacies.",
      color: "from-green-500 to-emerald-600",
      delay: 0
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Invoicing",
      description: "Generate invoices in seconds. Send digital copies instantly via WhatsApp to customers.",
      color: "from-amber-500 to-amber-600",
      delay: 0.1
    },
    {
      icon: <BarChart4 className="w-6 h-6" />,
      title: "Business Analytics",
      description: "Track sales, inventory, and customer data with powerful reporting and visual dashboards.",
      color: "from-blue-500 to-cyan-600",
      delay: 0.2
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Ready",
      description: "Access your system from any device. Create invoices on the go from your smartphone.",
      color: "from-pink-500 to-rose-600",
      delay: 0.3
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "WhatsApp Integration",
      description: "Send refill reminders automatically via WhatsApp from your own number.",
      color: "from-teal-500 to-cyan-600",
      delay: 0.4
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure Payments",
      description: "Integrate with popular payment gateways for secure and hassle-free transactions.",
      color: "from-purple-500 to-indigo-600",
      delay: 0.5
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Automation",
      description: "Automate recurring invoices, payment reminders, and patient retention alerts.",
      color: "from-orange-500 to-red-600",
      delay: 0.6
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Management",
      description: "Maintain customer profiles, purchase history, and communication records in one place.",
      color: "from-amber-500 to-orange-600",
      delay: 0.7
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Cost Effective",
      description: "Affordable pricing plans for pharmacies of all sizes with no hidden charges.",
      color: "from-pink-500 to-rose-600",
      delay: 0.8
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="features" className="relative py-24 bg-[#09090B] overflow-hidden" data-section="features">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)',
          }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Powerful Features</p>
            </motion.span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Everything You Need to <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Grow Your Pharmacy</span>
            </h2>
            
            <p className="max-w-2xl mx-auto text-zinc-300 text-lg leading-relaxed">
              EasiBill combines billing, customer retention, and analytics in one powerful platform designed for independent pharmacies.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 group-hover:border-amber-500/30 transition-all duration-300 -z-10" />
              
              {/* Glowing border on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-20">
                <div className={`absolute inset-0 bg-gradient-to-tr ${feature.color} rounded-xl opacity-20 blur-lg`} />
              </div>
              
              <div className="relative p-8">
                {/* Icon container */}
                <motion.div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {feature.description}
                </p>

                {/* Hidden arrow that appears on hover */}
                <motion.div
                  className="mt-4 flex items-center gap-2 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -8 }}
                  whileHover={{ x: 0 }}
                >
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.a 
            href="/features" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 gap-2 group"
            data-conversion-button="explore-features"
          >
            Explore All Features
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
