import { forwardRef } from 'react';

const IconInput = forwardRef(({ 
  icon: Icon, 
  className = '', 
  error = false,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      )}
      <input
        ref={ref}
        className={`
          w-full rounded-lg border bg-white py-2 pr-4 
          ${Icon ? 'pl-10' : 'pl-4'}
          ${error ? 'border-red-300' : 'border-gray-300'}
          focus:border-transparent focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
          ${className}
        `}
        {...props}
      />
    </div>
  );
});

IconInput.displayName = 'IconInput';

export default IconInput;