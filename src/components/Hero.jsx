"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, Zap, Target, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import ZoomInEffect from '@/Visuals/ZoomInEffect';

// Memoize static components to prevent unnecessary re-renders
const Globe = memo(() => (
  <div
    className="absolute w-96 h-96 rounded-full animate-spin"
    style={{
      background: 'radial-gradient(circle at 30% 30%, #4c1d95, #1e1b4b)',
      boxShadow: 'inset -30px -30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.5)',
      animationDuration: '30s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    }}
    aria-hidden="true"
  >
    {/* Grid lines are static and don't need animations */}
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-full h-[1px] bg-purple-500/20"
        style={{
          top: `${(i + 1) * 12}%`,
          transform: `rotate(${i * 15}deg)`
        }}
        aria-hidden="true"
      />
    ))}
    {[...Array(8)].map((_, i) => (
      <div
        key={i + 8}
        className="absolute w-[1px] h-full bg-purple-500/20 left-1/2"
        style={{
          transform: `rotate(${i * 22.5}deg)`
        }}
        aria-hidden="true"
      />
    ))}
  </div>
));

// Stars are static and decorative - don't need heavy animations
const Star = memo(({ top, left }) => (
  <div
    className="absolute w-1 h-1 bg-white rounded-full opacity-70"
    style={{
      top: `${top}%`,
      left: `${left}%`,
    }}
    aria-hidden="true"
  />
));

// Replace costly meteor animations with static gradients
const Meteor = memo(() => (
  <div
    className="absolute w-0.5 h-12 bg-gradient-to-b from-purple-400 to-transparent"
    style={{ 
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 80}%`,
      transform: `rotate(45deg) translateY(${Math.random() * 100}px)`,
    }}
    aria-hidden="true"
  />
));

const TrustBadge = memo(({ icon, text }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span className="text-sm font-medium text-gray-300">{text}</span>
  </div>
));

const Hero = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [text, setText] = useState('');
  const fullText = "Supercharge your business with the best billing service";

  // Optimize typewriter effect to be less CPU intensive
  useEffect(() => {
    if (!inView) return; // Only start typing when in view
    
    let isMounted = true;
    const typeSpeed = 80; // ms per character
    
    // Create an array of indices to type out
    const indices = Array.from({ length: fullText.length }, (_, i) => i);
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (!isMounted) {
        clearInterval(typeInterval);
        return;
      }
      
      if (currentIndex < indices.length) {
        setText(fullText.slice(0, indices[currentIndex] + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, typeSpeed);
    
    return () => {
      isMounted = false;
      clearInterval(typeInterval);
    };
  }, [inView, fullText]);

  // Pre-compute static data
  const trustBadges = [
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, text: "Trusted by 100+ businesses" },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, text: "4.8/5 user rating" },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, text: "24/7 support" }
  ];

  const features = [
    { Icon: Zap, title: "Fast Invoicing", description: "Create professional invoices in seconds with our simple billing software" },
    { Icon: Target, title: "Local Shop Billing", description: "Perfect for retail stores, restaurants, and service providers" },
    { Icon: TrendingUp, title: "Business Growth", description: "Scale your business with the best billing service solution" },
  ];
  
  // Pre-compute star positions for static placement
  const starPositions = Array.from({ length: 20 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
  }));

  return (
    <ZoomInEffect>
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black" id="hero" aria-labelledby="hero-heading">
      {/* Background Elements - reduced animations */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Static meteors instead of animated ones */}
        {[...Array(5)].map((_, i) => (
          <Meteor key={i} />
        ))}
        
        {/* Static stars instead of animated ones */}
        {starPositions.map((pos, i) => (
          <Star key={i} top={pos.top} left={pos.left} />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t" />
      </div>

      {/* Content */}
      <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="flex flex-col space-y-8">
            <header>
              <div className="inline-block px-4 py-1 mb-6 rounded-full bg-purple-900/30 border border-purple-500/20 backdrop-blur-sm">
                <p className="text-sm font-medium text-purple-400">
                  Simple Billing Software for Small Businesses
                </p>
              </div>
              <h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-purple-500"
              >
                Modern Billing <br />
                <span className="text-white">Made Simple</span>
              </h1>
              
              <p 
                className="text-xl md:text-2xl mb-8 text-gray-300 max-w-xl"
              >
                Create professional invoices, manage inventory, and track sales with our easy-to-use billing platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={() => navigate('/lead')}
                  className="group w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  aria-label="Start billing now with Easibill"
                  data-conversion-button="primary-cta"
                >
                  Start Billing Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>

                <Button
                  onClick={() => navigate('/lead')}
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 text-lg border-purple-500/30 text-purple-300 hover:bg-purple-900/20 hover:text-white rounded-lg transition-colors duration-300"
                  aria-label="Get a demo of Easibill"
                  data-conversion-button="secondary-cta"
                >
                  Get Demo
                  <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mt-4">
                {trustBadges.map((badge, index) => (
                  <TrustBadge key={index} icon={badge.icon} text={badge.text} />
                ))}
              </div>
            </header>
          </div>

          {/* Right Column - Hero Image/Dashboard Preview */}
          <div
            className="hidden md:block relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-purple-500/20 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent pointer-events-none"></div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                alt="Easibill dashboard preview" 
                className="w-full h-auto rounded-lg shadow-2xl"
                loading="lazy"
                width="1000"
                height="700"
                fetchpriority="high"
              />
            </div>
            
            {/* Static floating elements instead of animated ones */}
            <div 
              className="absolute -top-4 -right-4 p-4 rounded-lg bg-black/50 backdrop-blur-lg border border-purple-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  +
                </div>
                <div>
                  <p className="text-xs text-gray-400">Daily Revenue</p>
                  <p className="text-white font-bold">₹24,500</p>
                </div>
              </div>
            </div>
            
            <div
              className="absolute -bottom-6 left-12 p-3 rounded-lg bg-black/50 backdrop-blur-lg border border-purple-500/30"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <p className="text-xs text-white">Invoice Sent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section 
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">Key Features</h2>
          {features.map(({ Icon, title, description }, index) => (
            <article 
              key={index} 
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-purple-500/10"
            >
              <div className="flex items-center mb-4">
                <span className="p-2 rounded-lg bg-purple-600/20 mr-3">
                  <Icon className="w-6 h-6 text-purple-400" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold text-white">{title}</h3>
              </div>
              <p className="text-gray-300">{description}</p>
            </article>
          ))}
        </section>

        {/* Brands Section */}
        <section 
          className="mt-20 text-center py-8 border-t border-b border-gray-800"
        >
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">Trusted by businesses worldwide</p>
        </section>
      </div>
    </section>
    </ZoomInEffect>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(Hero);