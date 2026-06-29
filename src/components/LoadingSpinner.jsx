import React from 'react';

/**
 * LoadingSpinner Component
 * A high-performance, accessible loading indicator with customizable size and color.
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color variant of the spinner (primary, secondary, white)
 * @param {string} props.label - Accessibility label for screen readers
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  label = 'Loading...'
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Determine color classes
  const colorVariants = {
    primary: 'border-amber-500 border-t-amber-300',
    secondary: 'border-gray-500 border-t-gray-300',
    white: 'border-white/30 border-t-white'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorVariants[color] || colorVariants.primary;

  return (
    <div 
      className="flex flex-col items-center justify-center" 
      role="status" 
      aria-live="polite"
      data-testid="loading-spinner"
    >
      <div
        className={`${spinnerSize} border-4 border-solid ${spinnerColor} rounded-full animate-spin`}
        style={{ animationDuration: '1s' }}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
};

/**
 * FullPageLoader Component
 * A loading indicator that takes up the full page with backdrop
 * 
 * @param {Object} props
 * @param {string} props.message - Optional message to display below spinner
 */
export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
      role="alert"
      aria-busy="true"
      aria-label={message}
    >
      <LoadingSpinner size="lg" color="white" label={message} />
      {message && (
        <p className="mt-4 text-white font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;

