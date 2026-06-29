import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

export const THEMES = {
  DEFAULT: 'default',
  DARK: 'dark',
  AMBER: 'amber',
  CONTRAST: 'contrast'
};

const themeStyles = {
  [THEMES.DEFAULT]: {
    background: 'bg-[#09090B]',
    text: 'text-white',
    card: 'bg-[#18181B] border border-[#27272A]',
    cardHover: 'hover:border-[#F59E0B]/30',
    button: 'bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706]',
    secondaryButton: 'bg-transparent border border-[#27272A] text-white hover:border-[#3F3F46]',
    highlight: 'text-[#F59E0B]'
  },
  [THEMES.DARK]: {
    background: 'bg-[#09090B]',
    text: 'text-white',
    card: 'bg-[#18181B] border border-[#27272A]',
    cardHover: 'hover:border-[#3F3F46]',
    button: 'bg-zinc-800 text-white hover:bg-zinc-700',
    secondaryButton: 'bg-transparent border border-[#27272A] text-white hover:bg-[#27272A]',
    highlight: 'text-zinc-300'
  },
  [THEMES.AMBER]: {
    background: 'bg-[#09090B]',
    text: 'text-white',
    card: 'bg-[#1C1C1F] border border-[#F59E0B]/20',
    cardHover: 'hover:border-[#F59E0B]/50',
    button: 'bg-[#F59E0B] text-[#09090B] hover:bg-[#D97706]',
    secondaryButton: 'bg-[#78350F]/30 text-amber-200 hover:bg-[#78350F]/50',
    highlight: 'text-[#F59E0B]'
  },
  [THEMES.CONTRAST]: {
    background: 'bg-[#09090B]',
    text: 'text-white',
    card: 'bg-[#18181B] border border-[#27272A]',
    cardHover: 'hover:border-[#F59E0B]',
    button: 'bg-white text-[#09090B] hover:bg-zinc-100',
    secondaryButton: 'bg-transparent border border-zinc-600 text-white hover:border-white',
    highlight: 'text-white'
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemedBackground = ({ theme }) => {
  const currentTheme = themeStyles[theme] || themeStyles[THEMES.DEFAULT];

  return (
    <motion.div
      className={`fixed inset-0 -z-10 ${currentTheme.background}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    />
  );
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.DEFAULT);

  const changeTheme = (newTheme) => {
    if (themeStyles[newTheme]) {
      setTheme(newTheme);
    } else {
      setTheme(THEMES.DEFAULT);
    }
  };

  const getStyles = () => themeStyles[theme] || themeStyles[THEMES.DEFAULT];

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, getStyles }}>
      <ThemedBackground theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
