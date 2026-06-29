'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Building, Phone, ChevronRight, ChevronLeft, Send, Briefcase, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router'

const questions = [
  { id: 1, label: "What's your name?", icon: User, type: "text", name: "name", required: true },
  { id: 2, label: "What's your email address?", icon: Mail, type: "email", name: "email", required: true },
  { id: 3, label: "What's your mobile number?", icon: Phone, type: "tel", name: "mobile", required: true, pattern: "[0-9]{10}" },
  { id: 4, label: "What's your shop name?", icon: Briefcase, type: "text", name: "companyName", required: true },
  { id: 5, label: "Location", icon: Building, type: "text", name: "location", required: true },
]

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
        <h2 className="text-3xl font-bold text-white">Thank You!</h2>
        <p className="text-white text-opacity-90 text-lg">We've received your information and will contact you soon.</p>
      </div>
    </motion.div>
  );
};

const QuestionComponent = ({ question, value, onChange, error }) => {
  const Icon = question.icon

  return (
    <div className="space-y-4">
      <label htmlFor={question.name} className="block text-xl font-semibold text-white flex items-center space-x-2">
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
        pattern={question.pattern}
        className={`w-full p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-md text-white placeholder-white placeholder-opacity-70 outline-none focus:ring-2 focus:ring-white ${
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

export default function Leads() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 to-black-500 flex items-center justify-center p-4 sm:p-10">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden"
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
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
                  Tell us about yourself
                </h1>
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
                    />
                  </motion.div>

                  {errors.submit && (
                    <p className="text-red-400 text-sm text-center">{errors.submit}</p>
                  )}

                  <div className="flex justify-between mt-8">
                    {step > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white flex items-center space-x-2 hover:bg-opacity-30 transition-all duration-200"
                        disabled={isSubmitting}
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Previous</span>
                      </motion.button>
                    )}
                    {step < questions.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          const currentQuestion = questions[step];
                          const error = validateField(currentQuestion.name, formData[currentQuestion.name]);
                          if (!error) {
                            setStep(step + 1);
                          } else {
                            setErrors(prev => ({ ...prev, [currentQuestion.name]: error }));
                          }
                        }}
                        className="px-4 py-2 bg-white rounded-lg text-amber-500 flex items-center space-x-2 ml-auto hover:bg-opacity-90 transition-all duration-200"
                        disabled={isSubmitting}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-2 bg-white rounded-lg text-amber-500 flex items-center space-x-2 ml-auto hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                        <Send className="w-5 h-5" />
                      </motion.button>
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
        </motion.div>
      </div>
    </div>
  );
}