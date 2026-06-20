# Lead Gen Fix + Chatbot Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the Enter-key step-navigation bug in LeadGeneration.jsx and add a 15-second chatbot popup (bottom-left) that captures the same 5 lead fields and posts to the existing Cloudflare Worker.

**Architecture:** The form fix is a minimal patch to the input `onKeyDown` handler. The chatbot is a self-contained component mounted globally in App.jsx, using `sessionStorage` to avoid re-showing after dismiss/submit, and posting directly to the existing Worker URL.

**Tech Stack:** React 18, Framer Motion 11, Lucide React, Tailwind CSS, react-router-dom 7

## Global Constraints

- Worker endpoint (unchanged): `https://landingpage-lead.sppathak1428.workers.dev/`
- POST body shape: `{ name, email, mobile, companyName, location }`
- Mobile validation: `/^[0-9]{10}$/`
- Email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- All 5 fields required
- `sessionStorage` key for dismiss: `easibill_chatbot_dismissed`
- Tailwind only — no new CSS files
- No new npm packages

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/LeadGeneration.jsx` | Modify | Add `onKeyDown` to inputs to intercept Enter key |
| `src/components/LeadChatbot.jsx` | Create | Full chatbot popup component |
| `src/App.jsx` | Modify | Mount `<LeadChatbot />` outside `<Routes>` |

---

## Task 1: Fix Enter-Key Navigation in LeadGeneration.jsx

**Files:**
- Modify: `src/components/LeadGeneration.jsx`

**Problem:** `<form onSubmit={handleSubmit}>` submits when Enter is pressed in any `<input>`, even on intermediate steps. This runs `handleSubmit` which validates all fields at once, breaking the step-by-step flow.

**Fix:** Add `onKeyDown` to the `<input>` inside `QuestionComponent` that intercepts Enter and either advances the step (if not last) or allows submission (if last). Since `QuestionComponent` doesn't know which step it's on, we pass `isLast` and `onNext` as props, and call `onNext` on Enter when not last.

- [ ] **Step 1: Update QuestionComponent to accept `isLast` and `onNext` props**

In `src/components/LeadGeneration.jsx`, replace the `QuestionComponent` definition:

```jsx
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
```

- [ ] **Step 2: Extract the "advance step" logic into a named function and pass it to QuestionComponent**

In `src/components/LeadGeneration.jsx`, inside `LeadGeneration()`, add this function (before the return):

```jsx
const handleNext = () => {
  const currentQuestion = questions[step];
  const error = validateField(currentQuestion.name, formData[currentQuestion.name]);
  if (!error) {
    setStep(step + 1);
  } else {
    setErrors(prev => ({ ...prev, [currentQuestion.name]: error }));
  }
};
```

- [ ] **Step 3: Update the QuestionComponent usage in the JSX to pass new props**

Find the `<QuestionComponent ... />` inside the form and replace it:

```jsx
<QuestionComponent
  question={questions[step]}
  value={formData[questions[step].name]}
  onChange={handleInputChange}
  error={errors[questions[step].name]}
  isLast={step === questions.length - 1}
  onNext={handleNext}
/>
```

Also update the existing "Next" button's `onClick` to use `handleNext`:

```jsx
<ThemedButton
  type="button"
  onClick={handleNext}
  className="flex items-center space-x-2 ml-auto"
  disabled={isSubmitting}
>
  <span>Next</span>
  <ChevronRight className="w-5 h-5" />
</ThemedButton>
```

- [ ] **Step 4: Verify manually**

Run `npm run dev`. Navigate to `/lead`. Type a name and press Enter — the form should advance to the next question without submitting. On the last question, pressing Enter should submit the form normally.

- [ ] **Step 5: Commit**

```bash
git add src/components/LeadGeneration.jsx
git commit -m "fix(lead-form): intercept Enter key to advance steps instead of submitting"
```

---

## Task 2: Create LeadChatbot.jsx

**Files:**
- Create: `src/components/LeadChatbot.jsx`

**Interfaces:**
- Produces: `export default function LeadChatbot()` — a self-contained React component with no required props
- Posts to: `https://landingpage-lead.sppathak1428.workers.dev/` with `{ name, email, mobile, companyName, location }`

**Behaviour:**
- On mount, start a 15-second timer. When it fires, open the chat window (unless `sessionStorage.getItem('easibill_chatbot_dismissed')` is truthy).
- The chat window shows bot messages on the left and user replies on the right.
- Bot asks 5 questions sequentially. Each answer is validated before the next question appears.
- On submit, POST to Worker. On success, show a success bot message and set `sessionStorage.setItem('easibill_chatbot_dismissed', '1')`, then close after 3 seconds.
- Closing with × sets the same `sessionStorage` flag.

- [ ] **Step 1: Create the file with imports and constants**

Create `src/components/LeadChatbot.jsx`:

```jsx
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
```

- [ ] **Step 2: Add the main component with state and timer logic**

Append to `src/components/LeadChatbot.jsx`:

```jsx
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
        addBotMessage("Oops, something went wrong. Please try again or email us at hello@easibill.io.");
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
```

- [ ] **Step 3: Add the JSX return**

Append to `src/components/LeadChatbot.jsx`:

```jsx
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
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
```

- [ ] **Step 4: Verify the file has no syntax errors**

Run: `npm run build` (or `npm run dev` and check the browser console). Expected: no compilation errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/LeadChatbot.jsx
git commit -m "feat(chatbot): add 15-second lead capture chatbot popup"
```

---

## Task 3: Mount LeadChatbot in App.jsx

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `LeadChatbot` default export from `./components/LeadChatbot`

- [ ] **Step 1: Add the import at the top of App.jsx**

After the existing imports in `src/App.jsx`, add:

```jsx
import LeadChatbot from "./components/LeadChatbot";
```

- [ ] **Step 2: Mount it outside Routes in the return JSX**

In `src/App.jsx`, find the final `return` block:

```jsx
return (
  <AppThemeProvider defaultTheme={THEMES.GRADIENT}>
    <div className="overflow-x-hidden">
      <Routes>
        ...
      </Routes>
    </div>
  </AppThemeProvider>
);
```

Replace with:

```jsx
return (
  <AppThemeProvider defaultTheme={THEMES.GRADIENT}>
    <div className="overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
            <PageLayout><ContactPage /></PageLayout>
          </Suspense>
        } />
        <Route path="/lead" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
            <PageLayout><LeadGeneration /></PageLayout>
          </Suspense>
        } />
      </Routes>
      <LeadChatbot />
    </div>
  </AppThemeProvider>
);
```

- [ ] **Step 3: Verify manually**

Run `npm run dev`. Open the site. Wait 15 seconds — the chat bubble should pulse, and the chat window should open automatically with the first bot greeting. Click × — the chat should close and NOT reopen on page refresh within the same session. Open a new tab — it should reappear after 15 seconds.

Test the full flow: answer all 5 questions → verify the Worker receives the POST (check browser Network tab) → success message appears → chat closes after 3 seconds.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(app): mount LeadChatbot globally for passive lead capture"
```
