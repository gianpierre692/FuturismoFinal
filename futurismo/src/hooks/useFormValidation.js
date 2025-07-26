/**
 * Hook de Validación de Formularios Ultra-Robusto
 * 
 * CARACTERÍSTICAS:
 * 1. Validación en tiempo real y al envío
 * 2. Sanitización automática de datos
 * 3. Esquemas de validación predefinidos
 * 4. Manejo de errores por campo
 * 5. Soporte para validación asíncrona
 * 6. Debouncing para performance
 * 7. Integración con React Hook Form
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Validator, { validationSchemas } from '../utils/validation.js';
import InputSanitizer, { sanitizationSchemas } from '../utils/inputSanitizer.js';
import useTimer from './useTimer.js';
import { useSmartMemo } from './useSmartMemo.js';
import Logger from '../utils/logger.js';

// Validadores básicos para retrocompatibilidad
const basicValidators = {
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} es requerido`;
    }
    return null;
  },

  email: (value) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Email inválido';
    }
    return null;
  },

  phone: (value) => {
    if (value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
      return 'Teléfono inválido';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Mínimo ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Máximo ${max} caracteres`;
    }
    return null;
  },

  numeric: (value) => {
    if (value && isNaN(Number(value))) {
      return 'Debe ser un número';
    }
    return null;
  },

  min: (minVal) => (value) => {
    if (value && Number(value) < minVal) {
      return `Valor mínimo: ${minVal}`;
    }
    return null;
  },

  max: (maxVal) => (value) => {
    if (value && Number(value) > maxVal) {
      return `Valor máximo: ${maxVal}`;
    }
    return null;
  },

  match: (otherField, otherFieldName) => (value, _, formData) => {
    if (value && formData[otherField] && value !== formData[otherField]) {
      return `No coincide con ${otherFieldName}`;
    }
    return null;
  },

  custom: (validatorFn, message) => (value, fieldName, formData) => {
    if (!validatorFn(value, fieldName, formData)) {
      return message || 'Valor inválido';
    }
    return null;
  }
};

// Hook avanzado con todas las características
const useFormValidation = (initialData = {}, options = {}) => {
  const {
    schema = {},
    schemaName = null,
    sanitizationSchema = {},
    validateOnChange = true,
    validateOnBlur = true,
    sanitizeOnChange = true,
    debounceMs = 300,
    showSuccessStates = false,
    asyncValidators = {},
    onValidationComplete = null,
    stopOnFirstError = false,
    // Para retrocompatibilidad con la API anterior
    validationRules = null
  } = options;

  // Referencias y estado
  const timer = useTimer();
  const validationResultRef = useRef(null);
  const asyncValidationCacheRef = useRef(new Map());
  
  // Estados principales
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [fieldStates, setFieldStates] = useState({}); // validating, valid, invalid
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Estados para retrocompatibilidad
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState({});

  // Validar un campo específico
  const validateField = useCallback((fieldName, value, allFormData = formData) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // Ejecutar todas las reglas de validación para el campo
    for (const rule of rules) {
      let error = null;

      if (typeof rule === 'function') {
        error = rule(value, fieldName, allFormData);
      } else if (typeof rule === 'string' && validators[rule]) {
        error = validators[rule](value, fieldName, allFormData);
      } else if (rule.type && validators[rule.type]) {
        if (rule.params) {
          error = validators[rule.type](...rule.params)(value, fieldName, allFormData);
        } else {
          error = validators[rule.type](value, fieldName, allFormData);
        }
      }

      if (error) return error;
    }

    return null;
  }, [validationRules, formData]);

  // Validar todo el formulario
  const validateForm = useCallback((dataToValidate = formData) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, dataToValidate[fieldName], dataToValidate);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  }, [formData, validateField, validationRules]);

  // Manejar cambios de campo con validación opcional
  const handleChange = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    if (validateOnChange && touched[fieldName]) {
      setIsValidating(prev => ({ ...prev, [fieldName]: true }));
      
      // Debounce la validación
      const timeoutId = setTimeout(() => {
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        setIsValidating(prev => ({ ...prev, [fieldName]: false }));
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    }
  }, [validateOnChange, touched, validateField, debounceMs]);

  // Manejar blur (cuando el usuario sale del campo)
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    if (validateOnBlur) {
      const error = validateField(fieldName, formData[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [validateOnBlur, validateField, formData]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Marcar todos los campos como touched
    const allFields = Object.keys(validationRules);
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validar todo el formulario
    const { isValid, errors } = validateForm();

    if (isValid) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
        // Podrías setear errores de servidor aquí
      }
    }

    setIsSubmitting(false);
    return isValid;
  }, [formData, validateForm, validationRules]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setTouched({});
    setIsValidating({});
    setIsSubmitting(false);
  }, []);

  // Setear valores iniciales
  const setInitialValues = useCallback((initialValues) => {
    setFormData(initialValues);
  }, []);

  // Setear errores del servidor
  const setServerErrors = useCallback((serverErrors) => {
    setErrors(prev => ({ ...prev, ...serverErrors }));
  }, []);

  // Estado del formulario
  const formState = useMemo(() => {
    const hasErrors = Object.values(errors).some(error => error !== null);
    const hasValues = Object.values(formData).some(value => value !== null && value !== '');
    const allRequiredFieldsTouched = Object.keys(validationRules).every(field => touched[field]);
    
    return {
      isValid: !hasErrors && hasValues,
      isDirty: hasValues,
      hasErrors,
      isSubmitting,
      canSubmit: !hasErrors && !isSubmitting && (allRequiredFieldsTouched || hasValues)
    };
  }, [errors, formData, touched, isSubmitting, validationRules]);

  // Helper para obtener props de un campo
  const getFieldProps = useCallback((fieldName, fieldLabel) => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName];
    
    return {
      value: formData[fieldName] || '',
      onChange: (e) => {
        const value = e.target ? e.target.value : e;
        handleChange(fieldName, value);
      },
      onBlur: () => handleBlur(fieldName),
      error: hasError ? errors[fieldName] : null,
      isValid: showSuccessStates ? isValid : false,
      isValidating: isValidating[fieldName] || false,
      required: validationRules[fieldName]?.some(rule => 
        rule === 'required' || rule.type === 'required'
      ),
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${fieldName}-error` : undefined
    };
  }, [formData, errors, touched, isValidating, showSuccessStates, validationRules, handleChange, handleBlur]);

  return {
    // Datos del formulario
    formData,
    setFormData,
    
    // Estado de validación
    errors,
    touched,
    isValidating,
    formState,
    
    // Métodos
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    resetForm,
    setInitialValues,
    setServerErrors,
    getFieldProps,
    
    // Validadores disponibles para uso externo
    validators
  };
};

export default useFormValidation;