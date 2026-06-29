import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Themed card component 
export const ThemedCard = ({ 
  children, 
  className = '', 
  hoverable = true,
  animate = true,
  delay = 0,
  ...props 
}) => {
  const { getStyles } = useTheme();
  const styles = getStyles();
  
  const cardClasses = `${styles.card} ${hoverable ? styles.cardHover : ''} ${className}`;
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Themed button component
export const ThemedButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  animate = true,
  ...props 
}) => {
  const { getStyles } = useTheme();
  const styles = getStyles();
  
  const buttonStyle = variant === 'primary' ? styles.button : styles.secondaryButton;
  const buttonClasses = `px-4 py-2 rounded-lg font-medium transition-colors ${buttonStyle} ${className}`;
  
  if (animate) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClasses}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

// Themed section component with proper spacing
export const ThemedSection = ({ 
  children, 
  className = '', 
  fullWidth = false,
  ...props 
}) => {
  const containerClass = fullWidth ? '' : 'container mx-auto px-4';
  
  return (
    <section className={`py-12 md:py-20 ${containerClass} ${className}`} {...props}>
      {children}
    </section>
  );
};

// Themed heading component with consistent styling
export const ThemedHeading = ({ 
  children, 
  level = 1, 
  className = '',
  gradient = true,
  animate = true,
  ...props 
}) => {
  const { getStyles } = useTheme();
  const styles = getStyles();
  
  // Size classes based on heading level
  const sizeClasses = {
    1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-bold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-semibold',
    6: 'text-base md:text-lg font-semibold',
  }[level] || 'text-xl font-bold';
  
  // Apply gradient styling if requested
  const gradientClass = gradient 
    ? 'bg-gradient-to-r from-white via-amber-300 to-amber-500 text-transparent bg-clip-text' 
    : styles.text;
  
  const headingClasses = `${sizeClasses} ${gradientClass} ${className}`;
  const HeadingTag = `h${level}`;
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <HeadingTag className={headingClasses} {...props}>
          {children}
        </HeadingTag>
      </motion.div>
    );
  }
  
  return (
    <HeadingTag className={headingClasses} {...props}>
      {children}
    </HeadingTag>
  );
};

// Themed text component
export const ThemedText = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const { getStyles } = useTheme();
  const styles = getStyles();
  
  // Text styles based on variant
  const variantClasses = {
    default: `${styles.text} text-base`,
    highlight: `${styles.highlight} text-base`,
    large: `${styles.text} text-lg md:text-xl`,
    small: `${styles.text} text-sm opacity-80`,
  }[variant] || `${styles.text} text-base`;
  
  const textClasses = `${variantClasses} ${className}`;
  
  return (
    <p className={textClasses} {...props}>
      {children}
    </p>
  );
}; 