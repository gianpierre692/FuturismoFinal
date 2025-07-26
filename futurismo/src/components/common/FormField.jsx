import { memo } from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * FormField - Componente de campo de formulario con validación visual
 * 
 * BENEFICIO: Feedback visual inmediato, estados de carga, accesibilidad
 * UX consistente en todos los formularios
 */
const FormField = memo(({
  label,
  type = 'text',
  error,
  isValid,
  isValidating,
  required,
  hint,
  children,
  className = '',
  ...props
}) => {
  const fieldId = props.id || props.name;
  const hasError = !!error;

  // Clases CSS dinámicas según el estado
  const getFieldClasses = () => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
    
    if (hasError) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500`;
    }
    
    if (isValid) {
      return `${baseClasses} border-green-300 text-green-900 focus:border-green-500 focus:ring-green-500`;
    }
    
    return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
  };

  const getLabelClasses = () => {
    const baseClasses = 'block text-sm font-medium mb-1';
    
    if (hasError) {
      return `${baseClasses} text-red-700`;
    }
    
    if (isValid) {
      return `${baseClasses} text-green-700`;
    }
    
    return `${baseClasses} text-gray-700`;
  };

  return (
    <div className={`${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={fieldId} className={getLabelClasses()}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Campo de entrada */}
      <div className="relative">
        {children || (
          <input
            id={fieldId}
            type={type}
            className={getFieldClasses()}
            {...props}
          />
        )}

        {/* Indicadores de estado */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {isValidating && (
            <ArrowPathIcon className="w-5 h-5 text-gray-400 animate-spin" />
          )}
          
          {!isValidating && isValid && (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          )}
          
          {!isValidating && hasError && (
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {hasError && (
        <p 
          id={`${fieldId}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Mensaje de éxito */}
      {!hasError && isValid && (
        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
          <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
          Válido
        </p>
      )}

      {/* Hint/ayuda */}
      {!hasError && !isValid && hint && (
        <p className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

FormField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  isValid: PropTypes.bool,
  isValidating: PropTypes.bool,
  required: PropTypes.bool,
  hint: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string
};

export default FormField;