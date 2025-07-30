/**
 * Validador de Configuración y Variables de Entorno
 * 
 * PROPÓSITO:
 * - Validar variables de entorno al inicio
 * - Detectar configuraciones inseguras
 * - Proveer valores por defecto seguros
 * - Validar configuración de producción
 * - Logging de configuración incorrecta
 */

import Logger from './logger.js';

// ===========================================
// ESQUEMAS DE CONFIGURACIÓN
// ===========================================

const CONFIG_SCHEMAS = {
  // Configuración de API
  api: {
    VITE_API_URL: {
      type: 'url',
      required: true,
      default: 'http://localhost:3006/api',
      description: 'URL base de la API',
      validation: {
        pattern: /^https?:\/\/.+/,
        message: 'Debe ser una URL válida HTTP/HTTPS'
      }
    },
    VITE_REQUEST_TIMEOUT: {
      type: 'number',
      required: false,
      default: 30000,
      description: 'Timeout para requests HTTP en ms',
      validation: {
        min: 5000,
        max: 120000,
        message: 'Timeout debe estar entre 5 y 120 segundos'
      }
    },
    VITE_MAX_RETRIES: {
      type: 'number',
      required: false,
      default: 3,
      description: 'Número máximo de reintentos',
      validation: {
        min: 0,
        max: 10,
        message: 'Reintentos debe estar entre 0 y 10'
      }
    }
  },

  // Configuración de WebSocket
  websocket: {
    VITE_WS_URL: {
      type: 'url',
      required: false,
      default: 'ws://localhost:3006',
      description: 'URL del WebSocket principal',
      validation: {
        pattern: /^wss?:\/\/.+/,
        message: 'Debe ser una URL válida WS/WSS'
      }
    },
    VITE_WS_BACKUP_URL: {
      type: 'url',
      required: false,
      default: 'ws://backup.localhost:3006',
      description: 'URL de respaldo del WebSocket',
      validation: {
        pattern: /^wss?:\/\/.+/,
        message: 'Debe ser una URL válida WS/WSS'
      }
    },
    VITE_WS_RECONNECT_INTERVAL: {
      type: 'number',
      required: false,
      default: 5000,
      description: 'Intervalo de reconexión en ms',
      validation: {
        min: 1000,
        max: 60000,
        message: 'Intervalo debe estar entre 1 y 60 segundos'
      }
    },
    VITE_WS_MAX_RECONNECT_ATTEMPTS: {
      type: 'number',
      required: false,
      default: 10,
      description: 'Máximo número de intentos de reconexión',
      validation: {
        min: 1,
        max: 100,
        message: 'Intentos debe estar entre 1 y 100'
      }
    }
  },

  // Configuración de mapas
  maps: {
    VITE_MAP_PROVIDER: {
      type: 'string',
      required: false,
      default: 'openstreetmap',
      description: 'Proveedor de mapas por defecto',
      validation: {
        allowedValues: ['openstreetmap', 'cartodb', 'stamen'],
        message: 'Proveedor debe ser: openstreetmap, cartodb, stamen'
      }
    },
    VITE_MAP_DEFAULT_LAT: {
      type: 'number',
      required: false,
      default: -13.5319,
      description: 'Latitud por defecto (Cusco)',
      validation: {
        min: -90,
        max: 90,
        message: 'Latitud debe estar entre -90 y 90'
      }
    },
    VITE_MAP_DEFAULT_LNG: {
      type: 'number',
      required: false,
      default: -71.9675,
      description: 'Longitud por defecto (Cusco)',
      validation: {
        min: -180,
        max: 180,
        message: 'Longitud debe estar entre -180 y 180'
      }
    },
    VITE_MAP_DEFAULT_ZOOM: {
      type: 'number',
      required: false,
      default: 13,
      description: 'Zoom por defecto del mapa',
      validation: {
        min: 1,
        max: 20,
        message: 'Zoom debe estar entre 1 y 20'
      }
    }
  },

  // Configuración de seguridad
  security: {
    VITE_ENABLE_DEV_TOOLS: {
      type: 'boolean',
      required: false,
      default: false,
      description: 'Habilitar herramientas de desarrollo',
      productionValue: false,
      securityRisk: 'high',
      message: 'No debe estar habilitado en producción'
    },
    VITE_DEBUG_MODE: {
      type: 'boolean',
      required: false,
      default: false,
      description: 'Modo debug',
      productionValue: false,
      securityRisk: 'medium',
      message: 'No debe estar habilitado en producción'
    },
    VITE_LOG_LEVEL: {
      type: 'string',
      required: false,
      default: 'info',
      description: 'Nivel de logging',
      validation: {
        allowedValues: ['error', 'warn', 'info', 'debug'],
        message: 'Nivel debe ser: error, warn, info, debug'
      },
      productionValue: 'warn'
    },
    VITE_ENABLE_ANALYTICS: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Habilitar analytics'
    }
  },

  // Configuración de features
  features: {
    VITE_ENABLE_WEBSOCKET: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Habilitar WebSocket'
    },
    VITE_ENABLE_OFFLINE_MODE: {
      type: 'boolean',
      required: false,
      default: false,
      description: 'Habilitar modo offline'
    },
    VITE_ENABLE_GEOLOCATION: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Habilitar geolocalización'
    },
    VITE_ENABLE_NOTIFICATIONS: {
      type: 'boolean',
      required: false,
      default: true,
      description: 'Habilitar notificaciones'
    },
    VITE_MAX_TOUR_CAPACITY: {
      type: 'number',
      required: false,
      default: 50,
      description: 'Capacidad máxima de tours',
      validation: {
        min: 1,
        max: 200,
        message: 'Capacidad debe estar entre 1 y 200'
      }
    }
  },

  // Configuración de performance
  performance: {
    VITE_UPDATE_INTERVAL: {
      type: 'number',
      required: false,
      default: 5000,
      description: 'Intervalo de actualización en ms',
      validation: {
        min: 1000,
        max: 60000,
        message: 'Intervalo debe estar entre 1 y 60 segundos'
      }
    },
    VITE_DEBOUNCE_MS: {
      type: 'number',
      required: false,
      default: 300,
      description: 'Debounce para validaciones en ms',
      validation: {
        min: 100,
        max: 2000,
        message: 'Debounce debe estar entre 100ms y 2s'
      }
    },
    VITE_CACHE_SIZE: {
      type: 'number',
      required: false,
      default: 100,
      description: 'Tamaño máximo de cache',
      validation: {
        min: 10,
        max: 1000,
        message: 'Cache debe estar entre 10 y 1000 items'
      }
    }
  }
};

// ===========================================
// VALIDADOR DE CONFIGURACIÓN
// ===========================================

class ConfigValidator {
  constructor() {
    this.validatedConfig = null;
    this.validationResult = null;
    this.isProduction = import.meta.env.PROD || false;
    this.environment = import.meta.env.MODE || 'development';
  }

  validateAll(options = {}) {
    const {
      enforceRequired = true,
      checkSecurity = true,
      useDefaults = true,
      logWarnings = true
    } = options;

    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      securityIssues: [],
      config: {},
      metadata: {
        environment: this.environment,
        isProduction: this.isProduction,
        validatedAt: new Date().toISOString()
      }
    };

    try {
      // Validar cada categoría de configuración
      for (const [category, schema] of Object.entries(CONFIG_SCHEMAS)) {
        const categoryResult = this.validateCategory(category, schema, {
          enforceRequired,
          checkSecurity,
          useDefaults
        });

        result.config[category] = categoryResult.config;
        result.errors.push(...categoryResult.errors);
        result.warnings.push(...categoryResult.warnings);
        result.securityIssues.push(...categoryResult.securityIssues);

        if (!categoryResult.isValid) {
          result.isValid = false;
        }
      }

      // Validaciones adicionales
      this.performCrossValidation(result);
      this.checkProductionReadiness(result);

      // Logging
      if (result.errors.length > 0) {
        Logger.error('Errores de configuración encontrados:', result.errors);
      }

      if (result.warnings.length > 0 && logWarnings) {
        Logger.warn('Advertencias de configuración:', result.warnings);
      }

      if (result.securityIssues.length > 0) {
        Logger.warn('Problemas de seguridad en configuración:', result.securityIssues);
      }

      this.validationResult = result;
      this.validatedConfig = result.config;

      return result;

    } catch (error) {
      Logger.error('Error durante validación de configuración:', error);
      return {
        isValid: false,
        errors: ['Error interno de validación de configuración'],
        warnings: [],
        securityIssues: [],
        config: {},
        metadata: result.metadata
      };
    }
  }

  validateCategory(category, schema, options) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      securityIssues: [],
      config: {}
    };

    for (const [key, fieldSchema] of Object.entries(schema)) {
      const envValue = import.meta.env[key];
      const fieldResult = this.validateField(key, envValue, fieldSchema, options);

      result.config[key] = fieldResult.value;

      if (!fieldResult.isValid) {
        result.isValid = false;
        result.errors.push(...fieldResult.errors);
      }

      result.warnings.push(...fieldResult.warnings);
      result.securityIssues.push(...fieldResult.securityIssues);
    }

    return result;
  }

  validateField(key, value, schema, options) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      securityIssues: [],
      value: value
    };

    // Si el valor no está definido
    if (value === undefined || value === null || value === '') {
      if (schema.required && options.enforceRequired) {
        result.isValid = false;
        result.errors.push(`Variable requerida faltante: ${key} - ${schema.description}`);
      }

      if (options.useDefaults && schema.default !== undefined) {
        result.value = schema.default;
        result.warnings.push(`Usando valor por defecto para ${key}: ${schema.default}`);
      }

      return result;
    }

    // Convertir tipo si es necesario
    const convertedValue = this.convertType(value, schema.type);
    if (convertedValue === null) {
      result.isValid = false;
      result.errors.push(`Tipo inválido para ${key}: esperado ${schema.type}, recibido ${typeof value}`);
      return result;
    }

    result.value = convertedValue;

    // Validar contra reglas específicas
    if (schema.validation) {
      const validationResult = this.validateAgainstRules(convertedValue, schema.validation, key);
      if (!validationResult.isValid) {
        result.isValid = false;
        result.errors.push(...validationResult.errors);
      }
    }

    // Verificar problemas de seguridad
    if (options.checkSecurity) {
      const securityResult = this.checkFieldSecurity(key, convertedValue, schema);
      result.securityIssues.push(...securityResult.issues);
      result.warnings.push(...securityResult.warnings);
    }

    return result;
  }

  convertType(value, expectedType) {
    switch (expectedType) {
      case 'string':
        return String(value);

      case 'number':
        const num = Number(value);
        return isNaN(num) ? null : num;

      case 'boolean':
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          const lower = value.toLowerCase();
          if (lower === 'true' || lower === '1') return true;
          if (lower === 'false' || lower === '0') return false;
        }
        return null;

      case 'url':
        try {
          new URL(value);
          return String(value);
        } catch {
          return null;
        }

      default:
        return value;
    }
  }

  validateAgainstRules(value, rules, fieldName) {
    const result = { isValid: true, errors: [] };

    // Validar patrón regex
    if (rules.pattern && !rules.pattern.test(value)) {
      result.isValid = false;
      result.errors.push(`${fieldName}: ${rules.message || 'Formato inválido'}`);
    }

    // Validar rango numérico
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        result.isValid = false;
        result.errors.push(`${fieldName}: valor muy bajo (mínimo: ${rules.min})`);
      }

      if (rules.max !== undefined && value > rules.max) {
        result.isValid = false;
        result.errors.push(`${fieldName}: valor muy alto (máximo: ${rules.max})`);
      }
    }

    // Validar valores permitidos
    if (rules.allowedValues && !rules.allowedValues.includes(value)) {
      result.isValid = false;
      result.errors.push(`${fieldName}: ${rules.message || `Valor no permitido. Opciones: ${rules.allowedValues.join(', ')}`}`);
    }

    return result;
  }

  checkFieldSecurity(key, value, schema) {
    const result = { issues: [], warnings: [] };

    // Verificar configuraciones inseguras para producción
    if (this.isProduction && schema.securityRisk) {
      if (schema.productionValue !== undefined && value !== schema.productionValue) {
        const severity = schema.securityRisk;
        const issue = `${key}: ${schema.message || 'Configuración insegura para producción'}`;

        if (severity === 'high') {
          result.issues.push(issue);
        } else {
          result.warnings.push(issue);
        }
      }
    }

    // Verificar URLs inseguras en producción
    if (this.isProduction && schema.type === 'url' && typeof value === 'string') {
      if (value.startsWith('http://') && !value.includes('localhost')) {
        result.warnings.push(`${key}: Usando HTTP en lugar de HTTPS en producción`);
      }
    }

    // Verificar valores de desarrollo en producción
    if (this.isProduction) {
      const developmentIndicators = ['localhost', '127.0.0.1', 'dev', 'test', 'debug'];
      if (typeof value === 'string' && developmentIndicators.some(indicator => 
        value.toLowerCase().includes(indicator))) {
        result.warnings.push(`${key}: Valor de desarrollo detectado en producción: ${value}`);
      }
    }

    return result;
  }

  performCrossValidation(result) {
    // Validar que URLs de WebSocket coincidan con el protocolo de API
    const apiUrl = result.config.api?.VITE_API_URL;
    const wsUrl = result.config.websocket?.VITE_WS_URL;

    if (apiUrl && wsUrl) {
      const isApiSecure = apiUrl.startsWith('https://');
      const isWsSecure = wsUrl.startsWith('wss://');

      if (isApiSecure && !isWsSecure) {
        result.warnings.push('API usa HTTPS pero WebSocket usa WS inseguro');
      }
    }

    // Validar timeouts coherentes
    const requestTimeout = result.config.api?.VITE_REQUEST_TIMEOUT;
    const updateInterval = result.config.performance?.VITE_UPDATE_INTERVAL;

    if (requestTimeout && updateInterval && requestTimeout < updateInterval) {
      result.warnings.push('Timeout de request menor que intervalo de actualización');
    }
  }

  checkProductionReadiness(result) {
    if (!this.isProduction) return;

    const productionChecks = [];

    // Verificar que debug esté deshabilitado
    if (result.config.security?.VITE_DEBUG_MODE === true) {
      productionChecks.push('Modo debug habilitado en producción');
    }

    // Verificar nivel de log apropiado
    const logLevel = result.config.security?.VITE_LOG_LEVEL;
    if (logLevel === 'debug') {
      productionChecks.push('Nivel de log debug en producción');
    }

    // Verificar URLs seguras
    const urls = [
      result.config.api?.VITE_API_URL,
      result.config.websocket?.VITE_WS_URL
    ].filter(Boolean);

    for (const url of urls) {
      if (url.startsWith('http://') && !url.includes('localhost')) {
        productionChecks.push(`URL insegura en producción: ${url}`);
      }
    }

    if (productionChecks.length > 0) {
      result.warnings.push(...productionChecks.map(check => `Producción: ${check}`));
    }
  }

  getValidatedConfig() {
    if (!this.validatedConfig) {
      Logger.warn('Configuración no validada. Ejecute validateAll() primero.');
      return this.getEmergencyConfig();
    }

    return this.validatedConfig;
  }

  getEmergencyConfig() {
    // Configuración mínima de emergencia
    const emergency = {};

    for (const [category, schema] of Object.entries(CONFIG_SCHEMAS)) {
      emergency[category] = {};
      for (const [key, fieldSchema] of Object.entries(schema)) {
        emergency[category][key] = fieldSchema.default;
      }
    }

    Logger.warn('Usando configuración de emergencia');
    return emergency;
  }

  // Obtener configuración plana (sin categorías)
  getFlatConfig() {
    const validated = this.getValidatedConfig();
    const flat = {};

    for (const category of Object.values(validated)) {
      Object.assign(flat, category);
    }

    return flat;
  }

  // Verificar si una característica está habilitada
  isFeatureEnabled(feature) {
    const config = this.getValidatedConfig();
    return config.features?.[`VITE_ENABLE_${feature.toUpperCase()}`] === true;
  }

  // Obtener estadísticas de la configuración
  getConfigStats() {
    if (!this.validationResult) {
      return null;
    }

    return {
      totalFields: Object.values(CONFIG_SCHEMAS).reduce((sum, schema) => sum + Object.keys(schema).length, 0),
      validFields: this.validationResult.errors.length === 0 ? 'all' : 'partial',
      errors: this.validationResult.errors.length,
      warnings: this.validationResult.warnings.length,
      securityIssues: this.validationResult.securityIssues.length,
      environment: this.environment,
      isProduction: this.isProduction,
      validatedAt: this.validationResult.metadata.validatedAt
    };
  }
}

// ===========================================
// INSTANCIA SINGLETON
// ===========================================

const configValidator = new ConfigValidator();

// Validar configuración al importar
const validationResult = configValidator.validateAll();

if (!validationResult.isValid) {
  Logger.error('Configuración inválida detectada. La aplicación puede no funcionar correctamente.');
}

export default configValidator;
export { ConfigValidator, CONFIG_SCHEMAS };