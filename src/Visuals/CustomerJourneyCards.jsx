// CustomerJourney.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Send, Smartphone, Database, ArrowRight, Box, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: ShoppingBag,
    title: 'Customer Purchase',
    description: 'Customer enters the store and buys products',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-400/10'
  },
  {
    icon: CreditCard,
    secondaryIcon: Database,
    title: 'Payment and Data Storage',
    description: 'Process payment and store customer data securely',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-400/10'
  },
  {
    icon: Send,
    title: 'Invoice Sent',
    description: 'Send invoice via WhatsApp and email',
    color: 'bg-green-500',
    lightColor: 'bg-green-400/10'
  },
  {
    icon: Smartphone,
    title: 'Future Marketing',
    description: 'Send promotional offers via WhatsApp',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-400/10'
  },
];

const CustomerJourney = () => {
  return (
    <div className="py-16 px-4 md:px-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-black-600 mb-4"
          >
            Your Customer Journey
          </motion.h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Follow your customers from their first purchase through their entire journey with your business
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-amber-500/50 via-blue-500/50 to-green-500/50" />

          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              {...step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const TimelineStep = ({ 
  icon: Icon, 
  secondaryIcon: SecondaryIcon, 
  title, 
  description, 
  color,
  lightColor,
  index,
  isLast 
}) => {
  const isEven = index % 2 === 0;
  
  // Variants for animations
  const cardVariants = {
    hidden: { 
      opacity: 0,
      x: isEven ? -50 : 50,
      y: 0
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.2,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.2 + 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <motion.div
      className={`flex flex-col md:flex-row mb-8 md:mb-16 items-center
        ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Content Section */}
      <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
        <motion.div
          className={`bg-gray-800/80 backdrop-blur-lg p-4 md:p-6 rounded-xl shadow-xl relative ${lightColor}`}
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(123, 123, 123, 0.2)" }}
          transition={{ duration: 0.2 }}
        >
          {/* Main icon */}
          <motion.div
            className={`absolute ${isEven ? 'md:-right-6 -top-6 md:top-1/2' : 'md:-left-6 -top-6 md:top-1/2'} 
              transform md:-translate-y-1/2 w-12 h-12 rounded-xl ${color} 
              flex items-center justify-center shadow-lg`}
            variants={iconVariants}
          >
            <Icon className="text-white" size={24} />
          </motion.div>

          {/* Secondary floating icon */}
          {SecondaryIcon && (
            <motion.div
              className="absolute -bottom-3 -right-3 w-8 h-8 bg-gray-700 rounded-full 
                flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <SecondaryIcon size={16} className="text-white" />
            </motion.div>
          )}

          <div className="mt-8 md:mt-0">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm md:text-base">{description}</p>
          </div>

          {/* Connection arrow - visible only on desktop */}
          {!isLast && (
            <motion.div 
              className={`hidden md:block absolute top-1/2 transform -translate-y-1/2
                ${isEven ? '-right-16' : '-left-16'} text-gray-500`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ChevronRight 
                size={24}
                className={isEven ? 'rotate-0' : 'rotate-180'}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Center Timeline Dot - visible only on desktop */}
      <motion.div
        className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 ${color} rounded-full
          shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
        variants={iconVariants}
      />

      {/* Mobile connection line */}
      {!isLast && (
        <motion.div 
          className="md:hidden h-8 w-0.5 my-2 bg-gradient-to-b from-current to-transparent"
          style={{ color: color.replace('bg-', '') }}
          initial={{ height: 0 }}
          animate={{ height: 32 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default React.memo(CustomerJourney);