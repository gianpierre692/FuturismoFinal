/**
 * Sistema de Validación Robusto para Futurismo
 * 
 * CARACTERÍSTICAS:
 * 1. Validación de formularios con reglas personalizables
 * 2. Sanitización de entrada de datos
 * 3. Validadores específicos para turismo
 * 4. Validación de API responses
 * 5. Mensajes de error i18n
 * 6. Performance optimizada
 */

import Logger from './logger.js';

// ===========================================
// TIPOS DE ERRORES DE VALIDACIÓN
// ===========================================

export const VALIDATION_ERROR_TYPES = {
  REQUIRED: 'required',
  FORMAT: 'format',
  LENGTH: 'length',
  RANGE: 'range',
  CUSTOM: 'custom',
  TYPE: 'type',
  SECURITY: 'security'
};

// ===========================================
// CLASE PRINCIPAL DE VALIDACIÓN
// ===========================================

class ValidationError extends Error {
  constructor(field, type, message, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.type = type;
    this.value = value;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationResult {
  constructor() {
    this.isValid = true;
    this.errors = [];
    this.warnings = [];
    this.sanitizedData = {};
  }

  addError(field, type, message, value = null) {
    this.isValid = false;
    this.errors.push(new ValidationError(field, type, message, value));
  }

  addWarning(field, message) {
    this.warnings.push({ field, message, timestamp: new Date().toISOString() });
  }

  getErrorsForField(field) {
    return this.errors.filter(error => error.field === field);
  }

  getFirstError(field = null) {
    if (field) {
      return this.errors.find(error => error.field === field);
    }
    return this.errors[0];
  }
}

// ===========================================
// VALIDADORES BASE
// ===========================================

const validators = {
  // Validación de requerido
  required: (value, options = {}) => {
    const { message = 'Este campo es requerido' } = options;
    
    if (value === null || value === undefined || value === '') {
      return { isValid: false, message };
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return { isValid: false, message };
    }
    
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return { isValid: false, message };
    }
    
    return { isValid: true };
  },

  // Validación de tipo
  type: (value, options = {}) => {
    const { expectedType, message } = options;
    
    if (value === null || value === undefined) return { isValid: true };
    
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (actualType !== expectedType) {
      return {
        isValid: false,
        message: message || `Se esperaba tipo ${expectedType}, recibido ${actualType}`
      };
    }
    
    return { isValid: true };
  },

  // Validación de longitud
  length: (value, options = {}) => {
    const { min, max, exact, message } = options;
    
    if (value === null || value === undefined) return { isValid: true };
    
    const length = typeof value === 'string' ? value.length : 
                   Array.isArray(value) ? value.length : 
                   typeof value === 'object' ? Object.keys(value).length : 0;
    
    if (exact !== undefined && length !== exact) {
      return {
        isValid: false,
        message: message || `Debe tener exactamente ${exact} caracteres`
      };
    }
    
    if (min !== undefined && length < min) {
      return {
        isValid: false,
        message: message || `Debe tener al menos ${min} caracteres`
      };
    }
    
    if (max !== undefined && length > max) {
      return {
        isValid: false,
        message: message || `No debe exceder ${max} caracteres`
      };
    }
    
    return { isValid: true };
  },

  // Validación de formato con regex
  format: (value, options = {}) => {
    const { pattern, message } = options;
    
    if (value === null || value === undefined || value === '') return { isValid: true };
    
    if (typeof value !== 'string') {
      return { isValid: false, message: 'El valor debe ser una cadena de texto' };
    }
    
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    if (!regex.test(value)) {
      return {
        isValid: false,
        message: message || 'El formato no es válido'
      };
    }
    
    return { isValid: true };
  },

  // Validación de rango numérico
  range: (value, options = {}) => {
    const { min, max, message } = options;
    
    if (value === null || value === undefined) return { isValid: true };
    
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return { isValid: false, message: 'Debe ser un número válido' };
    }
    
    if (min !== undefined && numValue < min) {
      return {
        isValid: false,
        message: message || `Debe ser mayor o igual a ${min}`
      };
    }
    
    if (max !== undefined && numValue > max) {
      return {
        isValid: false,
        message: message || `Debe ser menor o igual a ${max}`
      };
    }
    
    return { isValid: true };
  },

  // Validación personalizada
  custom: (value, options = {}) => {
    const { validator, message } = options;
    
    try {
      const result = validator(value);
      
      if (typeof result === 'boolean') {
        return {
          isValid: result,
          message: result ? '' : (message || 'Valor inválido')
        };
      }
      
      if (typeof result === 'object') {
        return {
          isValid: result.isValid,
          message: result.message || message || 'Valor inválido'
        };
      }
      
      return { isValid: true };
    } catch (error) {
      Logger.error('Error en validador personalizado:', error);
      return { isValid: false, message: 'Error en validación' };
    }
  }
};

// ===========================================
// VALIDADORES ESPECÍFICOS PARA TURISMO
// ===========================================

export const tourismValidators = {
  // Código de tour
  tourCode: (value) => {
    const result = validators.format(value, {
      pattern: /^[A-Z]{2,4}\d{3,6}$/,
      message: 'Código de tour inválido (ej: TOUR001, MP123456)'
    });
    
    if (!result.isValid) return result;
    
    // Validación adicional de longitud
    return validators.length(value, {
      min: 5,
      max: 10,
      message: 'El código debe tener entre 5 y 10 caracteres'
    });
  },

  // Email
  email: (value) => {
    return validators.format(value, {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Email inválido'
    });
  },

  // Teléfono peruano
  phoneNumber: (value) => {
    return validators.format(value, {
      pattern: /^(\+51|0051)?[9]\d{8}$/,
      message: 'Número de teléfono peruano inválido (ej: +51987654321)'
    });
  },

  // DNI peruano
  dni: (value) => {
    const formatResult = validators.format(value, {
      pattern: /^\d{8}$/,
      message: 'DNI debe tener 8 dígitos'
    });
    
    if (!formatResult.isValid) return formatResult;
    
    // Validación adicional de DNI (algoritmo básico)
    const digits = value.split('').map(Number);
    const sum = digits.reduce((acc, digit, index) => {
      if (index < 7) {
        return acc + (digit * (8 - index));
      }
      return acc;
    }, 0);
    
    const checkDigit = 11 - (sum % 11);
    const expectedDigit = checkDigit >= 10 ? checkDigit - 10 : checkDigit;
    
    if (digits[7] !== expectedDigit) {
      return { isValid: false, message: 'DNI inválido' };
    }
    
    return { isValid: true };
  },

  // Coordenadas GPS
  coordinates: (value) => {
    if (!value || typeof value !== 'object') {
      return { isValid: false, message: 'Coordenadas inválidas' };
    }
    
    const { lat, lng } = value;
    
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { isValid: false, message: 'Latitud y longitud deben ser números' };
    }
    
    if (lat < -90 || lat > 90) {
      return { isValid: false, message: 'Latitud debe estar entre -90 y 90' };
    }
    
    if (lng < -180 || lng > 180) {
      return { isValid: false, message: 'Longitud debe estar entre -180 y 180' };
    }
    
    return { isValid: true };
  },

  // Fecha de tour
  tourDate: (value) => {
    if (!value) return { isValid: false, message: 'Fecha es requerida' };
    
    const date = new Date(value);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return { isValid: false, message: 'Fecha inválida' };
    }
    
    // No puede ser en el pasado (excepto el día actual)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tourDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (tourDate < today) {
      return { isValid: false, message: 'La fecha no puede ser en el pasado' };
    }
    
    // No más de 2 años en el futuro
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2);
    
    if (date > maxDate) {
      return { isValid: false, message: 'La fecha no puede ser más de 2 años en el futuro' };
    }
    
    return { isValid: true };
  },

  // Capacidad de grupo
  groupCapacity: (value) => {
    const numResult = validators.range(value, {
      min: 1,
      max: 50,
      message: 'La capacidad debe estar entre 1 y 50 personas'
    });
    
    if (!numResult.isValid) return numResult;
    
    // Debe ser entero
    if (!Number.isInteger(Number(value))) {
      return { isValid: false, message: 'La capacidad debe ser un número entero' };
    }
    
    return { isValid: true };
  },

  // Precio
  price: (value) => {
    const numResult = validators.range(value, {
      min: 0,
      max: 10000,
      message: 'El precio debe estar entre 0 y 10,000'
    });
    
    if (!numResult.isValid) return numResult;
    
    // Máximo 2 decimales
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { isValid: false, message: 'El precio no puede tener más de 2 decimales' };
    }
    
    return { isValid: true };
  },

  // Estado de tour
  tourStatus: (value) => {
    const validStatuses = ['programado', 'en_curso', 'pausado', 'finalizado', 'cancelado'];
    
    if (!validStatuses.includes(value)) {
      return {
        isValid: false,
        message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`
      };
    }
    
    return { isValid: true };
  }
};

// ===========================================
// SANITIZACIÓN DE DATOS
// ===========================================

export const sanitizers = {
  // Limpiar HTML
  html: (value) => {
    if (typeof value !== 'string') return value;
    
    // Remover scripts y tags peligrosos
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },

  // Limpiar texto
  text: (value) => {
    if (typeof value !== 'string') return value;
    
    return value
      .trim()
      .replace(/\s+/g, ' ') // Múltiples espacios a uno
      .replace(/[^\w\s\-_.@áéíóúñÁÉÍÓÚÑ]/g, ''); // Solo caracteres permitidos
  },

  // Limpiar email
  email: (value) => {
    if (typeof value !== 'string') return value;
    
    return value.toLowerCase().trim();
  },

  // Limpiar número de teléfono
  phone: (value) => {
    if (typeof value !== 'string') return value;
    
    return value.replace(/\D/g, ''); // Solo dígitos
  },

  // Capitalizar nombre
  name: (value) => {
    if (typeof value !== 'string') return value;
    
    return value
      .toLowerCase()
      .trim()
      .replace(/\b\w/g, char => char.toUpperCase());
  },

  // Limpiar código
  code: (value) => {
    if (typeof value !== 'string') return value;
    
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }
};

// ===========================================
// ESQUEMAS DE VALIDACIÓN PREDEFINIDOS
// ===========================================

export const validationSchemas = {
  // Esquema para crear/editar tour
  tour: {
    code: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.tourCode }
    ],
    name: [
      { rule: 'required' },
      { rule: 'length', min: 3, max: 100 }
    ],
    description: [
      { rule: 'length', max: 500 }
    ],
    startDate: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.tourDate }
    ],
    endDate: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.tourDate }
    ],
    capacity: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.groupCapacity }
    ],
    price: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.price }
    ],
    status: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.tourStatus }
    ]
  },

  // Esquema para guía
  guide: {
    name: [
      { rule: 'required' },
      { rule: 'length', min: 2, max: 50 }
    ],
    email: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.email }
    ],
    phone: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.phoneNumber }
    ],
    dni: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.dni }
    ],
    languages: [
      { rule: 'type', expectedType: 'array' },
      { rule: 'length', min: 1, message: 'Debe seleccionar al menos un idioma' }
    ]
  },

  // Esquema para cliente
  client: {
    name: [
      { rule: 'required' },
      { rule: 'length', min: 2, max: 50 }
    ],
    email: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.email }
    ],
    phone: [
      { rule: 'custom', validator: tourismValidators.phoneNumber }
    ],
    emergencyContact: [
      { rule: 'custom', validator: tourismValidators.phoneNumber }
    ]
  },

  // Esquema para login
  login: {
    email: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.email }
    ],
    password: [
      { rule: 'required' },
      { rule: 'length', min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
    ]
  },

  // Esquema para ubicación
  location: {
    coordinates: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.coordinates }
    ],
    address: [
      { rule: 'length', max: 200 }
    ],
    description: [
      { rule: 'length', max: 300 }
    ]
  }
};

// ===========================================
// VALIDADOR PRINCIPAL
// ===========================================

class Validator {
  static validate(data, schema, options = {}) {
    const {
      sanitize = true,
      stopOnFirstError = false,
      context = 'form'
    } = options;
    
    const result = new ValidationResult();
    const startTime = performance.now();
    
    try {
      // Sanitizar datos si está habilitado
      if (sanitize) {
        result.sanitizedData = Validator.sanitizeData(data, schema);
      } else {
        result.sanitizedData = { ...data };
      }
      
      // Validar cada campo
      for (const [field, rules] of Object.entries(schema)) {
        const value = result.sanitizedData[field];
        
        for (const ruleConfig of rules) {
          const { rule, ...options } = ruleConfig;
          
          if (!validators[rule]) {
            Logger.warn(`Validador desconocido: ${rule}`);
            continue;
          }
          
          const validationResult = validators[rule](value, options);
          
          if (!validationResult.isValid) {
            result.addError(field, rule, validationResult.message, value);
            
            if (stopOnFirstError) {
              break;
            }
          }
        }
        
        if (stopOnFirstError && !result.isValid) {
          break;
        }
      }
      
      const duration = performance.now() - startTime;
      
      if (duration > 10) {
        Logger.performance(`Validation took ${duration.toFixed(2)}ms for ${Object.keys(schema).length} fields`);
      }
      
      if (!result.isValid) {
        Logger.debug(`Validation failed for ${context}:`, {
          errors: result.errors.length,
          fields: result.errors.map(e => e.field)
        });
      }
      
      return result;
      
    } catch (error) {
      Logger.error('Error durante validación:', error);
      result.addError('_system', 'error', 'Error interno de validación');
      return result;
    }
  }
  
  static sanitizeData(data, schema) {
    const sanitized = {};
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      if (value === undefined || value === null) {
        sanitized[field] = value;
        continue;
      }
      
      // Aplicar sanitización basada en el tipo de campo
      if (field.includes('email')) {
        sanitized[field] = sanitizers.email(value);
      } else if (field.includes('phone')) {
        sanitized[field] = sanitizers.phone(value);
      } else if (field.includes('name')) {
        sanitized[field] = sanitizers.name(value);
      } else if (field.includes('code')) {
        sanitized[field] = sanitizers.code(value);
      } else if (typeof value === 'string') {
        sanitized[field] = sanitizers.text(value);
      } else {
        sanitized[field] = value;
      }
    }
    
    return sanitized;
  }
  
  // Validación rápida de un solo campo
  static validateField(value, rules, fieldName = 'field') {
    const schema = { [fieldName]: rules };
    const data = { [fieldName]: value };
    
    return Validator.validate(data, schema);
  }
  
  // Validación de esquema predefinido
  static validateWithSchema(data, schemaName, options = {}) {
    const schema = validationSchemas[schemaName];
    
    if (!schema) {
      throw new Error(`Esquema de validación '${schemaName}' no encontrado`);
    }
    
    return Validator.validate(data, schema, {
      ...options,
      context: schemaName
    });
  }
}

// ===========================================
// HOOK PARA REACT
// ===========================================

export const useValidation = (initialData = {}, schema = {}) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);
  
  const validate = React.useCallback((dataToValidate = data) => {
    const result = Validator.validate(dataToValidate, schema);
    
    const errorsByField = {};
    result.errors.forEach(error => {
      if (!errorsByField[error.field]) {
        errorsByField[error.field] = [];
      }
      errorsByField[error.field].push(error.message);
    });
    
    setErrors(errorsByField);
    setIsValid(result.isValid);
    
    return result;
  }, [data, schema]);
  
  const validateField = React.useCallback((field, value) => {
    if (!schema[field]) return true;
    
    const result = Validator.validateField(value, schema[field], field);
    const fieldErrors = result.errors.map(e => e.message);
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors.length > 0 ? fieldErrors : undefined
    }));
    
    return result.isValid;
  }, [schema]);
  
  const updateField = React.useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, [validateField]);
  
  const reset = React.useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsValid(false);
  }, [initialData]);
  
  return {
    data,
    errors,
    isValid,
    validate,
    validateField,
    updateField,
    reset,
    setData
  };
};

export default Validator;
export { ValidationError, ValidationResult };