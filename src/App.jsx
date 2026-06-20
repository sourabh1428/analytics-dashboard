import React, { useRef, useEffect, lazy, Suspense } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import LoadingSpinner from "./components/LoadingSpinner";
import ThemeSelector from "./components/ThemeSelector";
import { THEMES } from "./context/ThemeContext";
import AppThemeProvider from "./context/AppThemeProvider";
import { lazyImport } from "./utils/lazyImport.jsx";
import { initializePerformanceOptimizations } from "./utils/performanceUtils";

// Easibill Components
const EasibillHero = lazy(() => import("./components/easibill/EasibillHero"));
const EasibillProblem = lazy(() => import("./components/easibill/EasibillProblem"));
const EasibillSolution = lazy(() => import("./components/easibill/EasibillSolution"));
const EasibillFeatures = lazy(() => import("./components/easibill/EasibillFeatures"));
const EasibillPricing = lazy(() => import("./components/easibill/EasibillPricing"));
const EasibillTestimonials = lazy(() => import("./components/easibill/EasibillTestimonials"));
const EasibillCTA = lazy(() => import("./components/easibill/EasibillCTA"));

// Pages
const ContactPage = lazyImport(() => import("./Pages/Contact"));
const LeadGeneration = lazyImport(() => import("./components/LeadGeneration"));

const App = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  const PageLayout = React.memo(({ children }) => {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f8faf8] text-slate-950">
        <motion.div
          className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500"
          style={{ scaleX }}
        />
        <motion.div
          ref={containerRef}
          className="relative z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Navbar />
          </motion.div>

          <main className="relative">
            {children}
          </main>

          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Footer />
          </motion.footer>
        </motion.div>

        <ScrollToTopButton />
        <ThemeSelector />
      </div>
    );
  });

  const HomePage = React.memo(() => (
    <PageLayout>
      <div id="product">
        <Suspense fallback={<LoadingSpinner />}>
        <EasibillHero />
        </Suspense>
      </div>
      
      <div className="space-y-16 pb-20 md:space-y-24 md:pb-28">
        <div id="problem" className="scroll-mt-28">
          <Suspense fallback={<LoadingSpinner />}>
            <EasibillProblem />
          </Suspense>
        </div>

        <div id="solution" className="scroll-mt-28">
          <Suspense fallback={<LoadingSpinner />}>
            <EasibillSolution />
          </Suspense>
        </div>

        <div id="features" className="scroll-mt-28">
          <Suspense fallback={<LoadingSpinner />}>
            <EasibillFeatures />
          </Suspense>
        </div>

        <div id="pricing" className="scroll-mt-28">
          <Suspense fallback={<LoadingSpinner />}>
            <EasibillPricing />
          </Suspense>
        </div>

        <div id="customers" className="scroll-mt-28">
          <Suspense fallback={<LoadingSpinner />}>
            <EasibillTestimonials />
          </Suspense>
        </div>

        <div id="contact" className="scroll-mt-28">
          <Suspense fallback={<LoadingSpinner />}>
            <EasibillCTA />
          </Suspense>
        </div>
      </div>
    </PageLayout>
  ));

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
      </div>
    </AppThemeProvider>
  );
};

export default App;
