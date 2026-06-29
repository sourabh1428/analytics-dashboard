import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smartphone, User, Check, X, Send, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const API_ENDPOINT = "https://your-worker.your-cloudflare-account.workers.dev";

const useRateLimiter = () => {
  const checkLocalLimit = (mobile) => {
    const limitData = localStorage.getItem(`rateLimit-${mobile}`);
    if (!limitData) return false;
    
    const { count, timestamp } = JSON.parse(limitData);
    const now = Date.now();
    
    if (now - timestamp > 3600000) { // 1 hour
      localStorage.removeItem(`rateLimit-${mobile}`);
      return false;
    }
    
    return count >= 5;
  };

  const updateLocalLimit = (mobile) => {
    const limitData = localStorage.getItem(`rateLimit-${mobile}`);
    let newCount = 1;
    
    if (limitData) {
      const { count } = JSON.parse(limitData);
      newCount = count + 1;
    }
    
    localStorage.setItem(`rateLimit-${mobile}`, JSON.stringify({
      count: newCount,
      timestamp: Date.now()
    }));
  };

  return { checkLocalLimit, updateLocalLimit };
};

const SandBox = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { checkLocalLimit, updateLocalLimit } = useRateLimiter();

  const validatePhone = (number) => /^[6-9]\d{9}$/.test(number);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    if (checkLocalLimit(mobile)) {
      setError("Hourly message limit reached. Please try again later.");
      return;
    }

    setLoading(true);
    
    try {
      const receiptData = {
        templateID: "27c036bd-2390-4b7c-ab5f-436db569ca8c",
        destinationPhone: mobile,
        params: [name, "1000", "Software", "Easibill"],
        ctaUrl: "https://Easibill-pink.vercel.app/",
      };

      const response = await fetch(`${API_ENDPOINT}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('cf-auth')}`,
          'X-User-Identifier': mobile
        },
        body: JSON.stringify(receiptData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const resetTime = response.headers.get('Retry-After');
          setError(`Limit exceeded. Try again in ${resetTime} seconds`);
          localStorage.setItem(`rateLimit-${mobile}`, JSON.stringify({
            count: 5,
            timestamp: Date.now()
          }));
        }
        throw new Error(data.error || 'Request failed');
      }

      updateLocalLimit(mobile);
      setSuccess(true);
      
    } catch (error) {
      console.error("Transaction Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute top-20 left-20 w-48 h-48 bg-amber-200/30 rounded-full blur-xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-xl"
        animate={{ scale: [1, 0.8, 1], y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block p-4 bg-amber-100 rounded-full mb-4"
          >
            <Sparkles className="w-8 h-8 text-amber-500" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-blue-600 mb-2">
            WhatsApp Sandbox
          </h1>
          <p className="text-gray-600">Send secure test messages via WhatsApp</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm font-medium text-gray-700">Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="relative mt-1">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="pl-10"
                  maxLength={10}
                  required
                />
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg"
              >
                <X className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white"
              disabled={loading || success}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : success ? (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Message Sent!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  <span>Send via WhatsApp</span>
                </div>
              )}
            </Button>
          </motion.div>
        </form>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block mb-4"
                >
                  <Check className="w-16 h-16 text-green-500 bg-green-100 p-4 rounded-full" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h2>
                <p className="text-gray-600 mb-4">Check your WhatsApp messages</p>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SandBox;