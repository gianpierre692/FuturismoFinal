/**
 * Sistema de logging inteligente
 * 
 * BENEFICIO: Logs solo en desarrollo, silent en producción
 * Evita leaks de información y mejora performance
 */

import config from './config.js';

// Niveles de log
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Configuración por ambiente
const getLogLevel = () => {
  const envConfig = config.ENVIRONMENT;
  
  if (envConfig.isProduction) return LOG_LEVELS.ERROR;
  if (envConfig.isStaging) return LOG_LEVELS.INFO;
  return LOG_LEVELS.DEBUG; // Development
};

const CURRENT_LOG_LEVEL = getLogLevel();

// Función para sanitizar datos sensibles
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'credential'];
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '***REDACTED***';
    }
    
    // Recursivo para objetos anidados
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });
  
  return sanitized;
};

// Formatear mensajes con contexto
const formatMessage = (level, message, context = {}) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (typeof message === 'string') {
    return { message: `${prefix} ${message}`, context: sanitizeData(context) };
  }
  
  return { message: prefix, data: sanitizeData(message), context: sanitizeData(context) };
};

// Logger principal
class Logger {
  static error(message, context = {}) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
      const formatted = formatMessage('ERROR', message, context);
      console.error(formatted.message, formatted.data || '', formatted.context);
      
      // En producción, enviar errores a servicio de logging
      if (config.ENVIRONMENT.isProduction) {
        this.sendToLoggingService('error', formatted);
      }
    }
  }

  static warn(message, context = {}) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
      const formatted = formatMessage('WARN', message, context);
      console.warn(formatted.message, formatted.data || '', formatted.context);
    }
  }

  static info(message, context = {}) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
      const formatted = formatMessage('INFO', message, context);
      console.info(formatted.message, formatted.data || '', formatted.context);
    }
  }

  static debug(message, context = {}) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
      const formatted = formatMessage('DEBUG', message, context);
      console.log(formatted.message, formatted.data || '', formatted.context);
    }
  }

  // Logs específicos para desarrollo
  static dev(message, data = {}) {
    if (config.ENVIRONMENT.isDevelopment || config.FEATURES.DEBUG_MODE) {
      console.log(`🔧 [DEV] ${message}`, sanitizeData(data));
    }
  }

  // Performance logging
  static performance(label, duration, context = {}) {
    if (config.FEATURES.PERFORMANCE_METRICS) {
      this.info(`⚡ Performance: ${label} took ${duration}ms`, context);
    }
  }

  // WebSocket específico
  static websocket(message, data = {}) {
    if (config.ENVIRONMENT.isDevelopment) {
      console.log(`🔌 [WebSocket] ${message}`, sanitizeData(data));
    }
  }

  // Map específico
  static map(message, data = {}) {
    if (config.ENVIRONMENT.isDevelopment) {
      console.log(`🗺️ [Map] ${message}`, sanitizeData(data));
    }
  }

  // Envío a servicio externo en producción
  static sendToLoggingService(level, data) {
    // En producción real, aquí enviarías a Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: data.message,
        fatal: level === 'error'
      });
    }
  }

  // Crear logger con contexto
  static createContextLogger(context) {
    return {
      error: (message, additionalContext = {}) => 
        this.error(message, { ...context, ...additionalContext }),
      warn: (message, additionalContext = {}) => 
        this.warn(message, { ...context, ...additionalContext }),
      info: (message, additionalContext = {}) => 
        this.info(message, { ...context, ...additionalContext }),
      debug: (message, additionalContext = {}) => 
        this.debug(message, { ...context, ...additionalContext })
    };
  }
}

// Performance timing helper
export const withPerformanceLogging = (label, fn) => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        Logger.performance(label, duration);
      });
    } else {
      const duration = performance.now() - start;
      Logger.performance(label, duration);
      return result;
    }
  };
};

// Export aliases para compatibilidad
export const log = Logger.debug;
export const logger = Logger;

export default Logger;