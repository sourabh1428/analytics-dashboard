import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const WORKER_URL = 'https://landingpage-lead.sppathak1428.workers.dev/';
const SESSION_KEY = 'easibill_chatbot_dismissed';

const STEPS = [
  { field: 'name',        prompt: "Hi! 👋 I'm the Easibill assistant. What's your name?" },
  { field: 'email',       prompt: (name) => `Nice to meet you, ${name}! What's your email address?` },
  { field: 'mobile',      prompt: 'Got it! What\'s your mobile number?' },
  { field: 'companyName', prompt: 'What\'s your pharmacy or shop name?' },
  { field: 'location',    prompt: 'Last one — which city or area are you in?' },
];

function validate(field, value) {
  if (!value || !value.trim()) return 'This field is required.';
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'Please enter a valid email address.';
  if (field === 'mobile' && !/^[0-9]{10}$/.test(value))
    return 'Please enter a valid 10-digit mobile number.';
  return null;
}

export default function LeadChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const bottomRef = useRef(null);

  // 15-second auto-open timer
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      addBotMessage(STEPS[0].prompt);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function addBotMessage(text) {
    setMessages(prev => [...prev, { role: 'bot', text }]);
  }

  function addUserMessage(text) {
    setMessages(prev => [...prev, { role: 'user', text }]);
  }

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1');
    setIsOpen(false);
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSubmitting || isDone) return;

    const currentStep = STEPS[stepIndex];
    const error = validate(currentStep.field, trimmed);

    if (error) {
      addBotMessage(error);
      return;
    }

    addUserMessage(trimmed);
    setInput('');

    const newData = { ...formData, [currentStep.field]: trimmed };
    setFormData(newData);

    const nextIndex = stepIndex + 1;

    if (nextIndex < STEPS.length) {
      setStepIndex(nextIndex);
      const nextPrompt = STEPS[nextIndex].prompt;
      addBotMessage(typeof nextPrompt === 'function' ? nextPrompt(newData.name) : nextPrompt);
    } else {
      // All answers collected — submit
      setIsSubmitting(true);
      try {
        const res = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newData),
        });
        if (!res.ok) throw new Error('Worker error');
        addBotMessage("You're all set! 🎉 We'll reach out to you soon.");
        setIsDone(true);
        sessionStorage.setItem(SESSION_KEY, '1');
        setTimeout(() => setIsOpen(false), 3000);
      } catch {
        addBotMessage("Oops, something went wrong. Please try again or email us at support@easibill.com.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-3 flex flex-col rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
            style={{ width: 'min(320px, calc(100vw - 3rem))', maxHeight: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 rounded-t-2xl bg-gradient-to-r from-purple-700 to-indigo-700 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Easibill Assistant</p>
                <p className="text-xs text-white/70">Online</p>
              </div>
              <button
                onClick={dismiss}
                className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4" style={{ minHeight: '200px', maxHeight: '300px' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 mt-1">
                      <MessageCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-white text-slate-900'
                        : 'rounded-bl-sm bg-slate-700 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {!isDone && (
              <div className="flex items-center gap-2 border-t border-white/10 p-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer..."
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-slate-700 px-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={isSubmitting || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white transition hover:bg-purple-500 disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => {
          if (!isOpen) {
            if (messages.length === 0) addBotMessage(STEPS[0].prompt);
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/40"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
