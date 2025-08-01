import { useState, useRef } from 'react';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const InteractiveInput = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  success,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const inputRef = useRef(null);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(Boolean(e.target.value));
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
    if (onChange) onChange(e);
  };

  const getStateClasses = () => {
    if (error) return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-300 focus:border-green-500 focus:ring-green-500';
    if (isFocused) return 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20';
    return 'border-gray-300 hover:border-gray-400';
  };

  const getLabelClasses = () => {
    const baseClasses = 'absolute left-3 bg-white px-1 text-sm font-medium transition-all duration-200 pointer-events-none';
    
    if (isFocused || hasValue) {
      return `${baseClasses} -top-2.5 text-blue-600 scale-90`;
    }
    
    return `${baseClasses} top-3 text-gray-500 scale-100`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Container with animated border */}
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-full px-3 py-3 pr-10 text-gray-900 placeholder-transparent
            border rounded-lg transition-all duration-200 ease-out
            focus:outline-none focus:ring-0
            ${getStateClasses()}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            ${Icon ? 'pl-10' : ''}
          `}
          placeholder={placeholder}
          {...props}
        />

        {/* Floating label */}
        {label && (
          <label
            className={getLabelClasses()}
            onClick={() => inputRef.current?.focus()}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Left icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </div>
        )}

        {/* Right icon (status) */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {success && (
            <CheckIcon className="w-5 h-5 text-green-500 animate-in fade-in duration-200" />
          )}
          {error && (
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 animate-in fade-in duration-200" />
          )}
        </div>

        {/* Focus ring effect */}
        {isFocused && !error && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-500 opacity-20 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Success message */}
      {success && typeof success === 'string' && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600 animate-in slide-in-from-top-1 duration-200">
          <CheckIcon className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}
    </div>
  );
};

export default InteractiveInput;