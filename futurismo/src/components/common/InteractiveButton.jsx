import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

const InteractiveButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async (e) => {
    if (disabled || loading) return;
    
    setIsClicked(true);
    
    if (onClick) {
      await onClick(e);
    }
    
    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 150);
  };

  // Variantes de color
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    ghost: 'hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300'
  };

  // Tamaños
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const baseClass = `
    relative inline-flex items-center justify-center gap-2 
    font-medium rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isClicked ? 'scale-95' : 'hover:scale-105'}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <button
      className={baseClass}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Success checkmark */}
      {success && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-600 rounded-lg">
          <CheckIcon className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Content */}
      <div className={`flex items-center gap-2 ${(loading || success) ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </div>

      {/* Ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-20 scale-0 animate-ping rounded-lg" />
        </div>
      )}
    </button>
  );
};

export default InteractiveButton;