/**
 * Validador de Respuestas de API
 * 
 * PROPÓSITO: 
 * - Validar responses de API antes de usar
 * - Detectar respuestas malformadas
 * - Prevenir errores de runtime
 * - Logging de anomalías
 */

import Logger from './logger.js';
import InputSanitizer from './inputSanitizer.js';

// ===========================================
// ESQUEMAS DE RESPUESTA ESPERADOS
// ===========================================

const API_RESPONSE_SCHEMAS = {
  // Respuesta estándar de API
  standard: {
    success: { type: 'boolean', required: true },
    data: { type: 'object', required: false },
    message: { type: 'string', required: false },
    error: { type: 'string', required: false },
    timestamp: { type: 'string', required: false }
  },

  // Lista paginada
  paginated: {
    success: { type: 'boolean', required: true },
    data: { type: 'array', required: true },
    pagination: {
      type: 'object',
      required: true,
      properties: {
        page: { type: 'number', required: true },
        limit: { type: 'number', required: true },
        total: { type: 'number', required: true },
        pages: { type: 'number', required: true }
      }
    }
  },

  // Autentificación
  auth: {
    success: { type: 'boolean', required: true },
    token: { type: 'string', required: true },
    user: {
      type: 'object',
      required: true,
      properties: {
        id: { type: 'string', required: true },
        email: { type: 'string', required: true },
        name: { type: 'string', required: true },
        role: { type: 'string', required: true }
      }
    },
    expiresAt: { type: 'string', required: true }
  },

  // Tour específico
  tour: {
    success: { type: 'boolean', required: true },
    data: {
      type: 'object',
      required: true,
      properties: {
        id: { type: 'string', required: true },
        code: { type: 'string', required: true },
        name: { type: 'string', required: true },
        status: { type: 'string', required: true },
        startDate: { type: 'string', required: true },
        endDate: { type: 'string', required: true },
        capacity: { type: 'number', required: true },
        price: { type: 'number', required: true },
        guide: {
          type: 'object',
          required: false,
          properties: {
            id: { type: 'string', required: true },
            name: { type: 'string', required: true },
            email: { type: 'string', required: true }
          }
        }
      }
    }
  },

  // WebSocket message
  websocket: {
    type: { type: 'string', required: true },
    payload: { type: 'object', required: true },
    timestamp: { type: 'string', required: true },
    id: { type: 'string', required: false }
  },

  // Error response
  error: {
    success: { type: 'boolean', required: true, expectedValue: false },
    error: { type: 'string', required: true },
    code: { type: 'string', required: false },
    details: { type: 'object', required: false },
    timestamp: { type: 'string', required: false }
  }
};

// ===========================================
// TIPOS DE VALIDACIÓN
// ===========================================

const VALIDATION_TYPES = {
  TYPE_MISMATCH: 'type_mismatch',
  MISSING_REQUIRED: 'missing_required',
  INVALID_FORMAT: 'invalid_format',
  SECURITY_RISK: 'security_risk',
  UNEXPECTED_FIELD: 'unexpected_field',
  VALUE_OUT_OF_RANGE: 'value_out_of_range'
};

// ===========================================
// CLASE PRINCIPAL DE VALIDACIÓN
// ===========================================

class ApiValidationError extends Error {
  constructor(message, type, field = null, value = null) {
    super(message);
    this.name = 'ApiValidationError';
    this.type = type;
    this.field = field;
    this.value = value;
    this.timestamp = new Date().toISOString();
  }
}

class ApiValidator {
  static validateResponse(response, schemaName = 'standard', options = {}) {
    const {
      strict = true,
      sanitize = true,
      allowUnknownFields = false,
      logWarnings = true
    } = options;

    const schema = API_RESPONSE_SCHEMAS[schemaName];
    if (!schema) {
      Logger.error(`Schema '${schemaName}' no encontrado para validación API`);
      return {
        isValid: false,
        errors: [`Schema '${schemaName}' no existe`],
        sanitizedData: response
      };
    }

    const validationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      sanitizedData: sanitize ? {} : response
    };

    try {
      // Validar estructura principal
      this.validateObject(response, schema, '', validationResult, {
        strict,
        sanitize,
        allowUnknownFields,
        logWarnings
      });

      // Log resultado
      if (!validationResult.isValid) {
        Logger.warn(`API Response validation failed for schema '${schemaName}':`, {
          errors: validationResult.errors,
          response: this.sanitizeForLogging(response)
        });
      } else if (validationResult.warnings.length > 0 && logWarnings) {
        Logger.debug(`API Response validation warnings for schema '${schemaName}':`, {
          warnings: validationResult.warnings
        });
      }

      return validationResult;

    } catch (error) {
      Logger.error('Error durante validación de API response:', error);
      return {
        isValid: false,
        errors: ['Error interno de validación'],
        warnings: [],
        sanitizedData: response
      };
    }
  }

  static validateObject(obj, schema, path, result, options) {
    if (obj === null || obj === undefined) {
      if (options.strict) {
        result.isValid = false;
        result.errors.push(`Objeto null/undefined en: ${path || 'root'}`);
      }
      return;
    }

    if (typeof obj !== 'object' || Array.isArray(obj)) {
      result.isValid = false;
      result.errors.push(`Esperado objeto en: ${path || 'root'}, recibido ${typeof obj}`);
      return;
    }

    // Validar campos requeridos y tipos
    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const fieldPath = path ? `${path}.${fieldName}` : fieldName;
      const fieldValue = obj[fieldName];

      // Verificar si es requerido
      if (fieldSchema.required && (fieldValue === undefined || fieldValue === null)) {
        result.isValid = false;
        result.errors.push(`Campo requerido faltante: ${fieldPath}`);
        continue;
      }

      if (fieldValue !== undefined && fieldValue !== null) {
        // Validar tipo
        if (!this.validateFieldType(fieldValue, fieldSchema, fieldPath, result)) {
          continue;
        }

        // Validar valor esperado específico
        if (fieldSchema.expectedValue !== undefined && fieldValue !== fieldSchema.expectedValue) {
          result.isValid = false;
          result.errors.push(`Valor incorrecto en ${fieldPath}: esperado ${fieldSchema.expectedValue}, recibido ${fieldValue}`);
          continue;
        }

        // Validar propiedades anidadas
        if (fieldSchema.properties && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
          this.validateObject(fieldValue, fieldSchema.properties, fieldPath, result, options);
        }

        // Sanitizar si está habilitado
        if (options.sanitize) {
          result.sanitizedData[fieldName] = this.sanitizeField(fieldValue, fieldSchema);
        }
      }
    }

    // Verificar campos desconocidos
    if (!options.allowUnknownFields) {
      for (const fieldName of Object.keys(obj)) {
        if (!schema[fieldName]) {
          const fieldPath = path ? `${path}.${fieldName}` : fieldName;
          result.warnings.push(`Campo desconocido encontrado: ${fieldPath}`);
          
          if (options.strict) {
            result.isValid = false;
            result.errors.push(`Campo no permitido: ${fieldPath}`);
          }
        }
      }
    }
  }

  static validateFieldType(value, schema, path, result) {
    const expectedType = schema.type;
    let actualType = typeof value;

    // Ajustar tipo para arrays
    if (Array.isArray(value)) {
      actualType = 'array';
    }

    // Validaciones específicas por tipo
    switch (expectedType) {
      case 'string':
        if (actualType !== 'string') {
          result.isValid = false;
          result.errors.push(`Tipo incorrecto en ${path}: esperado string, recibido ${actualType}`);
          return false;
        }
        
        // Verificar si es un string vacío cuando no debería serlo
        if (schema.required && value.trim() === '') {
          result.isValid = false;
          result.errors.push(`String vacío en campo requerido: ${path}`);
          return false;
        }

        // Detectar contenido potencialmente malicioso
        const maliciousContent = InputSanitizer.detectMaliciousContent(value);
        if (maliciousContent.isMalicious) {
          result.isValid = false;
          result.errors.push(`Contenido malicioso detectado en ${path}: ${maliciousContent.threats.join(', ')}`);
          return false;
        }
        break;

      case 'number':
        if (actualType !== 'number' || isNaN(value) || !isFinite(value)) {
          result.isValid = false;
          result.errors.push(`Número inválido en ${path}: ${value}`);
          return false;
        }

        // Validar rangos razonables
        if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
          result.warnings.push(`Número muy grande en ${path}: ${value}`);
        }
        break;

      case 'boolean':
        if (actualType !== 'boolean') {
          result.isValid = false;
          result.errors.push(`Tipo incorrecto en ${path}: esperado boolean, recibido ${actualType}`);
          return false;
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          result.isValid = false;
          result.errors.push(`Tipo incorrecto en ${path}: esperado array, recibido ${actualType}`);
          return false;
        }

        // Validar longitud del array
        if (schema.maxLength && value.length > schema.maxLength) {
          result.isValid = false;
          result.errors.push(`Array muy largo en ${path}: ${value.length} > ${schema.maxLength}`);
          return false;
        }

        if (schema.minLength && value.length < schema.minLength) {
          result.isValid = false;
          result.errors.push(`Array muy corto en ${path}: ${value.length} < ${schema.minLength}`);
          return false;
        }
        break;

      case 'object':
        if (actualType !== 'object' || Array.isArray(value)) {
          result.isValid = false;
          result.errors.push(`Tipo incorrecto en ${path}: esperado object, recibido ${actualType}`);
          return false;
        }
        break;

      default:
        result.warnings.push(`Tipo de validación desconocido: ${expectedType} en ${path}`);
    }

    return true;
  }

  static sanitizeField(value, schema) {
    const type = schema.type;

    switch (type) {
      case 'string':
        return InputSanitizer.sanitizeText(value, {
          maxLength: schema.maxLength || 1000,
          allowHtml: schema.allowHtml || false
        });

      case 'number':
        const num = Number(value);
        if (isNaN(num) || !isFinite(num)) return 0;
        
        // Aplicar límites si están definidos
        if (schema.min !== undefined) return Math.max(schema.min, num);
        if (schema.max !== undefined) return Math.min(schema.max, num);
        
        return num;

      case 'boolean':
        return Boolean(value);

      case 'array':
        if (!Array.isArray(value)) return [];
        
        // Limitar longitud
        let sanitizedArray = value;
        if (schema.maxLength) {
          sanitizedArray = value.slice(0, schema.maxLength);
        }
        
        // Sanitizar elementos si hay esquema de items
        if (schema.itemSchema) {
          sanitizedArray = sanitizedArray.map(item => 
            this.sanitizeField(item, schema.itemSchema)
          );
        }
        
        return sanitizedArray;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
          return {};
        }
        
        const sanitizedObj = {};
        
        // Si hay propiedades definidas, sanitizar según esquema
        if (schema.properties) {
          for (const [key, propSchema] of Object.entries(schema.properties)) {
            if (value[key] !== undefined) {
              sanitizedObj[key] = this.sanitizeField(value[key], propSchema);
            }
          }
        } else {
          // Sanitización básica de todas las propiedades
          for (const [key, val] of Object.entries(value)) {
            sanitizedObj[key] = InputSanitizer.sanitizeText(String(val));
          }
        }
        
        return sanitizedObj;

      default:
        return value;
    }
  }

  // Validaciones específicas para el dominio de turismo
  static validateTourismData(data, type) {
    const validators = {
      tourCode: (code) => {
        if (!/^[A-Z]{2,4}\d{3,6}$/.test(code)) {
          return 'Código de tour inválido';
        }
        return null;
      },

      email: (email) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return 'Email inválido';
        }
        return null;
      },

      phone: (phone) => {
        if (!/^(\+51|0051)?[9]\d{8}$/.test(phone)) {
          return 'Teléfono peruano inválido';
        }
        return null;
      },

      coordinates: (coords) => {
        if (!coords || typeof coords !== 'object') return 'Coordenadas inválidas';
        
        const { lat, lng } = coords;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return 'Coordenadas deben ser números';
        }
        
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          return 'Coordenadas fuera de rango válido';
        }
        
        return null;
      },

      price: (price) => {
        if (typeof price !== 'number' || price < 0 || price > 10000) {
          return 'Precio inválido (debe estar entre 0 y 10,000)';
        }
        return null;
      },

      capacity: (capacity) => {
        if (!Number.isInteger(capacity) || capacity < 1 || capacity > 50) {
          return 'Capacidad inválida (debe ser entero entre 1 y 50)';
        }
        return null;
      }
    };

    const validator = validators[type];
    if (!validator) {
      Logger.warn(`Validador de turismo '${type}' no encontrado`);
      return null;
    }

    return validator(data);
  }

  // Utilidad para sanitizar datos sensibles para logging
  static sanitizeForLogging(data, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) return '[Max depth reached]';
    
    if (data === null || data === undefined) return data;
    
    if (typeof data === 'string') {
      // Ocultar datos sensibles
      if (data.includes('@')) return '[EMAIL_REDACTED]';
      if (/^\+?[\d\s-()]+$/.test(data) && data.length > 8) return '[PHONE_REDACTED]';
      if (data.length > 100) return data.substring(0, 100) + '...[TRUNCATED]';
      return data;
    }
    
    if (typeof data === 'object' && !Array.isArray(data)) {
      const sanitized = {};
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
      
      for (const [key, value] of Object.entries(data)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeForLogging(value, maxDepth, currentDepth + 1);
        }
      }
      return sanitized;
    }
    
    if (Array.isArray(data)) {
      if (data.length > 10) {
        return [
          ...data.slice(0, 5).map(item => this.sanitizeForLogging(item, maxDepth, currentDepth + 1)),
          `...[${data.length - 5} more items]`
        ];
      }
      return data.map(item => this.sanitizeForLogging(item, maxDepth, currentDepth + 1));
    }
    
    return data;
  }

  // Crear esquemas personalizados
  static createSchema(schemaDefinition) {
    // Validar que el esquema tenga la estructura correcta
    for (const [fieldName, fieldSchema] of Object.entries(schemaDefinition)) {
      if (!fieldSchema.type) {
        Logger.warn(`Campo '${fieldName}' en esquema personalizado no tiene tipo definido`);
      }
    }
    
    return schemaDefinition;
  }

  // Registrar esquemas personalizados
  static registerSchema(name, schema) {
    if (API_RESPONSE_SCHEMAS[name]) {
      Logger.warn(`Sobrescribiendo esquema existente: ${name}`);
    }
    
    API_RESPONSE_SCHEMAS[name] = schema;
    Logger.debug(`Esquema '${name}' registrado exitosamente`);
  }

  // Obtener lista de esquemas disponibles
  static getAvailableSchemas() {
    return Object.keys(API_RESPONSE_SCHEMAS);
  }
}

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

// Validar respuesta HTTP completa
export const validateHttpResponse = async (response, expectedSchema = 'standard') => {
  try {
    // Verificar status HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        isValid: false,
        errors: [`HTTP ${response.status}: ${response.statusText}`],
        warnings: [],
        sanitizedData: errorData
      };
    }

    // Parsear JSON
    const data = await response.json();
    
    // Validar con esquema
    return ApiValidator.validateResponse(data, expectedSchema);

  } catch (error) {
    Logger.error('Error validando respuesta HTTP:', error);
    return {
      isValid: false,
      errors: ['Error parseando respuesta JSON'],
      warnings: [],
      sanitizedData: {}
    };
  }
};

// Middleware para fetch que valida automáticamente
export const createValidatedFetch = (defaultSchema = 'standard') => {
  return async (url, options = {}) => {
    const { expectedSchema = defaultSchema, ...fetchOptions } = options;
    
    try {
      const response = await fetch(url, fetchOptions);
      const validationResult = await validateHttpResponse(response, expectedSchema);
      
      return {
        response,
        ...validationResult
      };
    } catch (error) {
      Logger.error('Error en fetch validado:', error);
      return {
        response: null,
        isValid: false,
        errors: [error.message],
        warnings: [],
        sanitizedData: {}
      };
    }
  };
};

export default ApiValidator;
export { ApiValidationError, API_RESPONSE_SCHEMAS, VALIDATION_TYPES };