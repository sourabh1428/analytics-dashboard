import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, BarChart, Target, TrendingUp } from 'lucide-react';

const FloatingIcons = () => {
  const icons = [Zap, Star, BarChart, Target, TrendingUp];

  return (
    <>
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-amber-400 opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 30, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Icon size={24 + index * 8} />
        </motion.div>
      ))}
    </>
  );
};

export default FloatingIcons;

