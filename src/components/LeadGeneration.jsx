'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Building, Phone, ChevronRight, ChevronLeft, Send, Briefcase, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useTheme } from '../context/ThemeContext'
import { track } from '../utils/mixpanel'
import { ThemedCard, ThemedButton, ThemedSection, ThemedHeading, ThemedText } from './ui/ThemedComponents'

// Import shared components from Leads.jsx
const questions = [
  { id: 1, label: "What's your name?", icon: User, type: "text", name: "name", required: true },
  { id: 2, label: "What's your email address?", icon: Mail, type: "email", name: "email", required: true },
  { id: 3, label: "What's your mobile number?", icon: Phone, type: "tel", name: "mobile", required: true, pattern: "[0-9]{10}" },
  { id: 4, label: "What's your shop name?", icon: Briefcase, type: "text", name: "companyName", required: true },
  { id: 5, label: "Location", icon: Building, type: "text", name: "location", required: true },
]

const DISCORD_URL = 'https://discord.gg/easibill';

const ThankYouMessage = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center space-y-6 py-8"
    >
      <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
      <div className="space-y-3">
        <ThemedHeading level={2}>Thank You!</ThemedHeading>
        <ThemedText variant="large">We've received your information and will contact you soon.</ThemedText>
      </div>
    </motion.div>
  );
};

const QuestionComponent = ({ question, value, onChange, error, isLast, onNext }) => {
  const Icon = question.icon
  const { getStyles } = useTheme();
  const styles = getStyles();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLast) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor={question.name} className={`block text-xl font-semibold ${styles.text} flex items-center space-x-2`}>
        <Icon className="w-6 h-6" />
        <span>{question.label}</span>
        {question.required && <span className="text-red-400 text-sm">*</span>}
      </label>
      <input
        type={question.type}
        id={question.name}
        name={question.name}
        value={value || ''}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        pattern={question.pattern}
        className={`w-full p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-md ${styles.text} placeholder-white placeholder-opacity-70 outline-none focus:ring-2 focus:ring-white ${
          error ? 'ring-2 ring-red-400' : ''
        }`}
        placeholder={`Enter your ${question.name.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
        required={question.required}
      />
      {error && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}

// Enhanced background elements
const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-3xl"
          style={{
            width: `${Math.random() * 30 + 10}rem`,
            height: `${Math.random() * 30 + 10}rem`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            scale: [1, Math.random() * 0.3 + 0.8, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function LeadGeneration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateField = (name, value) => {
    if (questions.find(q => q.name === name)?.required && !value) {
      return 'This field is required';
    }
    if (name === 'mobile' && value) {
      if (!/^[0-9]{10}$/.test(value)) {
        return 'Please enter a valid 10-digit mobile number';
      }
    }
    if (name === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors = {};
    questions.forEach(question => {
      const error = validateField(question.name, formData[question.name]);
      if (error) newErrors[question.name] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://landingpage-lead.sppathak1428.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send lead to worker');
      }
      track('demo_requested', {
        source: 'lead_form',
        method: 'form_submit',
        shop_name: formData.companyName,
        location: formData.location,
      });
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleNext = () => {
    const currentQuestion = questions[step];
    const error = validateField(currentQuestion.name, formData[currentQuestion.name]);
    if (!error) {
      setStep(step + 1);
    } else {
      setErrors(prev => ({ ...prev, [currentQuestion.name]: error }));
    }
  };

  return (
    <ThemedSection>
      <div className="w-full max-w-5xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ThemedHeading level={1} className="mb-6">
              Show us your pharmacy workflow
            </ThemedHeading>
            <ThemedText variant="large" className="mb-8">
              Tell us how your store handles chronic-care refills today. We will help you map the fastest path from manual WhatsApp follow-up to automated refill reminders.
            </ThemedText>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Pharmacy-specific onboarding</h3>
                  <ThemedText variant="default">We help set up patient records, refill intervals, and reminder templates</ThemedText>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">14-day refill reminder trial</h3>
                  <ThemedText variant="default">Start with your most frequent chronic-care patients first</ThemedText>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Community support</h3>
                  <ThemedText variant="default">Join our Discord to discuss setup, pharmacy growth, and product updates</ThemedText>
                </div>
              </div>

              <a
                href={DISCORD_URL}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/15 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500/25"
              >
                <MessageCircle className="h-4 w-4" />
                Join Easibill Discord
              </a>
            </div>
          </motion.div>
          
          {/* Right side - Form */}
          <ThemedCard 
            className="p-6 sm:p-8 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {showThankYou ? (
                <ThankYouMessage onComplete={() => navigate('/')} />
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ThemedHeading level={2} className="text-center mb-8">
                    Tell us about yourself
                  </ThemedHeading>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      key={step}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuestionComponent
                        question={questions[step]}
                        value={formData[questions[step].name]}
                        onChange={handleInputChange}
                        error={errors[questions[step].name]}
                        isLast={step === questions.length - 1}
                        onNext={handleNext}
                      />
                    </motion.div>

                    {errors.submit && (
                      <p className="text-red-400 text-sm text-center">{errors.submit}</p>
                    )}

                    <div className="flex justify-between mt-8">
                      {step > 0 && (
                        <ThemedButton
                          variant="secondary"
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="flex items-center space-x-2"
                          disabled={isSubmitting}
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </ThemedButton>
                      )}
                      {step < questions.length - 1 ? (
                        <ThemedButton
                          type="button"
                          onClick={handleNext}
                          className="flex items-center space-x-2 ml-auto"
                          disabled={isSubmitting}
                        >
                          <span>Next</span>
                          <ChevronRight className="w-5 h-5" />
                        </ThemedButton>
                      ) : (
                        <ThemedButton
                          type="submit"
                          className="flex items-center space-x-2 ml-auto disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                          <Send className="w-5 h-5" />
                        </ThemedButton>
                      )}
                    </div>

                    <div className="flex justify-center space-x-2 mt-8">
                      {questions.map((_, index) => (
                        <motion.div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === step ? 'w-4 bg-white' : 'w-2 bg-white/30'
                          }`}
                          animate={{ scale: index === step ? 1.2 : 1 }}
                        />
                      ))}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </ThemedCard>
        </div>
      </div>
    </ThemedSection>
  );
} 
