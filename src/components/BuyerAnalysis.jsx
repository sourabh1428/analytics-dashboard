'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MoreHorizontal, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  Filter, 
  Download, 
  ChevronRight,
  Star,
  CheckCircle2,
  Target
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Sample data for buyer personas
const buyerPersonas = [
  { 
    id: 1, 
    name: "Small Business Owner", 
    score: 85, 
    traits: ["Price-conscious", "Values time-saving", "Need ease of use"],
    color: "from-blue-500 to-cyan-500"
  },
  { 
    id: 2, 
    name: "E-commerce Entrepreneur", 
    score: 72, 
    traits: ["Growth-focused", "Marketing savvy", "Data-driven"],
    color: "from-amber-500 to-amber-500"
  },
  { 
    id: 3, 
    name: "Retail Manager", 
    score: 64, 
    traits: ["Team collaboration", "Inventory focused", "Customer service"],
    color: "from-pink-500 to-rose-500"
  },
  { 
    id: 4, 
    name: "Freelance Professional", 
    score: 58, 
    traits: ["Mobile-first", "Budget conscious", "Needs automation"],
    color: "from-amber-500 to-orange-500"
  }
];

// Sample metrics data
const metricsData = [
  { id: 1, label: "Engagement Score", value: 78, increment: 12, color: "from-green-500 to-emerald-500" },
  { id: 2, label: "Conversion Rate", value: 4.2, increment: -0.8, color: "from-blue-500 to-cyan-500" },
  { id: 3, label: "Avg. Purchase Value", value: 128, increment: 24, color: "from-amber-500 to-amber-500" }
];

// Animated circular progress component
const CircularProgress = ({ progress, size = 120, strokeWidth = 12, gradient }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradient})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
        {/* Define gradient */}
        <defs>
          <linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" className="text-amber-500" />
            <stop offset="100%" stopColor="currentColor" className="text-amber-500" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold text-white">{progress}%</span>
        <span className="text-xs text-gray-400">Match Rate</span>
      </div>
    </div>
  );
};

// Progress bar component
const ProgressBar = ({ value, className, gradient }) => (
  <div className={`h-2 bg-gray-800 rounded-full overflow-hidden ${className}`}>
    <motion.div
      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
);

// Metric card component
const MetricCard = ({ label, value, increment, color }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [ref, inView] = React.useState({ inView: false });
  
  useEffect(() => {
    const onIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ref.inView = true;
          setAnimatedValue(value);
        }
      });
    };
    
    const observer = new IntersectionObserver(onIntersection, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, value]);

  // Update ref function
  ref.current = React.useRef(null).current;
  
  return (
    <motion.div 
      ref={ref.current}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-amber-500/30 rounded-xl p-4 transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
          increment > 0 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {increment > 0 ? '+' : ''}{increment}%
        </div>
      </div>
      <div className="text-2xl font-bold text-white">
        {typeof value === 'number' && value % 1 === 0 
          ? animatedValue.toLocaleString() 
          : animatedValue.toFixed(1)}
      </div>
      <ProgressBar value={typeof value === 'number' ? (value / 200) * 100 : value} gradient={color} className="mt-2" />
    </motion.div>
  );
};

// Buyer persona card component
const PersonaCard = ({ persona, index, isActive, onClick }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
      isActive 
        ? 'bg-gray-800/70 border border-amber-500/30' 
        : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-800/50'
    }`}
    onClick={() => onClick(persona.id)}
  >
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${persona.color} flex items-center justify-center`}>
      <Users className="text-white w-5 h-5" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">{persona.name}</span>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-700 text-gray-300">
          {persona.score}%
        </span>
      </div>
      <ProgressBar 
        value={persona.score} 
        gradient={persona.color}
        className="mt-2" 
      />
    </div>
    {isActive && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
      >
        <CheckCircle2 className="text-white w-4 h-4" />
      </motion.div>
    )}
  </motion.div>
);

// Trait tag component
const TraitTag = ({ text }) => (
  <div className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
    {text}
  </div>
);

function BuyerAnalysis() {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState(1);
  const selectedPersona = buyerPersonas.find(p => p.id === activePersona);
  
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-3xl">
          <motion.h2 
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-amber-300 to-amber-500 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Advanced Buyer Behavior Analysis
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Understand your customers like never before with our powerful analysis tools.
            Identify key personas, track behaviors, and create targeted marketing strategies.
          </motion.p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column - Persona selection */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-full">
              <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Buyer Personas</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-3 max-h-[600px] overflow-y-auto">
                {buyerPersonas.map((persona, index) => (
                  <PersonaCard 
                    key={persona.id}
                    persona={persona}
                    index={index}
                    isActive={activePersona === persona.id}
                    onClick={setActivePersona}
                  />
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r bg-amber-500 hover:from-amber-600 hover:to-amber-600 text-white font-medium transition-all duration-300"
                  onClick={() => navigate('/lead')}
                >
                  Create New Persona
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Right column - Persona details */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={activePersona}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-full"
              >
                <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <span>{selectedPersona.name}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded-full text-xs text-gray-400">
                      ID: #{selectedPersona.id}
                    </span>
                  </h3>
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </div>
                
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    {/* Circular progress */}
                    <div className="md:col-span-2 flex justify-center">
                      <CircularProgress 
                        progress={selectedPersona.score} 
                        gradient={`persona-gradient-${selectedPersona.id}`}
                      />
                    </div>
                    
                    {/* Metrics */}
                    <div className="md:col-span-4 space-y-4">
                      {metricsData.map((metric) => (
                        <MetricCard 
                          key={metric.id}
                          label={metric.label}
                          value={metric.value}
                          increment={metric.increment}
                          color={metric.color}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Traits section */}
                  <div className="mt-8">
                    <h4 className="text-sm uppercase text-gray-400 mb-3">Key Traits</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedPersona.traits.map((trait, i) => (
                        <TraitTag key={i} text={trait} />
                      ))}
                    </div>
                    
                    {/* Recommendations */}
                    <div className="mt-6">
                      <h4 className="text-sm uppercase text-gray-400 mb-3">Recommendations</h4>
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="text-amber-400 w-4 h-4" />
                            <h5 className="text-white font-medium">Optimize Marketing Messages</h5>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Focus on {selectedPersona.traits[0].toLowerCase()} and {selectedPersona.traits[1].toLowerCase()} in your marketing campaigns to increase engagement with this persona.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="text-amber-400 w-4 h-4" />
                            <h5 className="text-white font-medium">Feature Highlights</h5>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Showcase features that enable {selectedPersona.traits[2].toLowerCase()} to attract more customers with this buyer profile.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <div className="mt-8 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r bg-amber-500 hover:from-amber-600 hover:to-amber-600 text-white font-medium transition-all duration-300 flex items-center"
                        onClick={() => navigate('/lead')}
                      >
                        <span>View Full Analysis</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(BuyerAnalysis)