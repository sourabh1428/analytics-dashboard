import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Send } from 'lucide-react';

const SegmentationPersonalization = () => {
  const segments = [
    { name: 'Frequent Buyer', icon: Users, color: 'bg-blue-500' },
    { name: 'High-Value Customer', icon: DollarSign, color: 'bg-green-500' },
  ];

  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6">Customer Segmentation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((segment, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 p-4 rounded-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className={`${segment.color} rounded-full p-2 mr-3`}>
                <segment.icon className="text-white" size={24} />
              </div>
              <h3 className="font-semibold">{segment.name}</h3>
            </div>
            <motion.button
  className="w-full bg-amber-500 text-white py-2 px-4 rounded-md flex items-center justify-center"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* Button content goes here */}

              <Send size={20} className="mr-2" />
              Send Personalized Offer
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SegmentationPersonalization;

