import toast from 'react-hot-toast';
import Logger from './logger';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

/**
 * Manejador centralizado de errores
 * Categoriza errores y proporciona feedback consistente al usuario
 */
class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 10;
  }

  /**
   * Maneja errores de forma centralizada
   * @param {Error|Object} error - El error a manejar
   * @param {string} context - Contexto donde ocurrió el error
   * @param {Object} options - Opciones de manejo
   */
  handle(error, context = 'Unknown', options = {}) {
    const {
      showToast = true,
      logError = true,
      rethrow = false,
      customMessage = null,
      severity = 'error'
    } = options;

    // Crear objeto de error estandarizado
    const errorInfo = this.parseError(error, context);
    
    // Logging
    if (logError) {
      this.logError(errorInfo, severity);
    }

    // Agregar a la cola de errores
    this.addToQueue(errorInfo);

    // Mostrar feedback al usuario
    if (showToast) {
      this.showUserFeedback(errorInfo, customMessage, severity);
    }

    // Manejar casos especiales
    this.handleSpecialCases(errorInfo);

    // Reportar a servicio de monitoreo
    this.reportToMonitoring(errorInfo);

    // Re-lanzar si es necesario
    if (rethrow) {
      throw error;
    }

    return errorInfo;
  }

  /**
   * Parsea el error en un formato estandarizado
   */
  parseError(error, context) {
    const errorInfo = {
      context,
      timestamp: new Date().toISOString(),
      type: 'unknown',
      message: ERROR_MESSAGES.GENERIC_ERROR,
      details: {},
      stackTrace: error?.stack
    };

    // Error de respuesta HTTP
    if (error?.response) {
      errorInfo.type = 'http';
      errorInfo.status = error.response.status;
      errorInfo.statusText = error.response.statusText;
      errorInfo.message = error.response.data?.message || this.getHttpErrorMessage(error.response.status);
      errorInfo.details = error.response.data;
    }
    // Error de red
    else if (error?.code === 'ERR_NETWORK' || !navigator.onLine) {
      errorInfo.type = 'network';
      errorInfo.message = ERROR_MESSAGES.NETWORK_ERROR;
    }
    // Error de validación
    else if (error?.validationErrors || error?.errors) {
      errorInfo.type = 'validation';
      errorInfo.message = ERROR_MESSAGES.VALIDATION_ERROR;
      errorInfo.details = error.validationErrors || error.errors;
    }
    // Error de timeout
    else if (error?.code === 'ECONNABORTED') {
      errorInfo.type = 'timeout';
      errorInfo.message = 'La operación tardó demasiado tiempo. Por favor, intenta nuevamente.';
    }
    // Error genérico
    else if (error instanceof Error) {
      errorInfo.type = 'javascript';
      errorInfo.message = error.message;
      errorInfo.name = error.name;
    }
    // Objeto de error personalizado
    else if (typeof error === 'object' && error !== null) {
      errorInfo.type = 'custom';
      errorInfo.message = error.message || ERROR_MESSAGES.GENERIC_ERROR;
      errorInfo.details = error;
    }
    // String como error
    else if (typeof error === 'string') {
      errorInfo.type = 'string';
      errorInfo.message = error;
    }

    return errorInfo;
  }

  /**
   * Obtiene mensaje de error basado en código HTTP
   */
  getHttpErrorMessage(status) {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return 'Solicitud inválida. Por favor, verifica los datos.';
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.SESSION_EXPIRED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.NOT_FOUND:
        return 'El recurso solicitado no fue encontrado.';
      case HTTP_STATUS.CONFLICT:
        return 'Conflicto con el estado actual del recurso.';
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return 'Error del servidor. Por favor, intenta más tarde.';
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return 'Servicio temporalmente no disponible.';
      default:
        return ERROR_MESSAGES.GENERIC_ERROR;
    }
  }

  /**
   * Registra el error según su severidad
   */
  logError(errorInfo, severity) {
    const logData = {
      ...errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    switch (severity) {
      case 'warning':
        Logger.warn(`Error en ${errorInfo.context}:`, logData);
        break;
      case 'info':
        Logger.info(`Error menor en ${errorInfo.context}:`, logData);
        break;
      default:
        Logger.error(`Error en ${errorInfo.context}:`, logData);
    }
  }

  /**
   * Muestra feedback al usuario
   */
  showUserFeedback(errorInfo, customMessage, severity) {
    const message = customMessage || errorInfo.message;

    switch (severity) {
      case 'warning':
        toast.error(message, {
          icon: '⚠️',
          duration: 4000
        });
        break;
      case 'info':
        toast(message, {
          icon: 'ℹ️',
          duration: 3000
        });
        break;
      default:
        toast.error(message, {
          duration: 5000
        });
    }

    // Si hay errores de validación, mostrarlos
    if (errorInfo.type === 'validation' && errorInfo.details) {
      const validationMessages = Object.entries(errorInfo.details)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n');
      
      if (validationMessages) {
        toast.error(validationMessages, {
          duration: 7000
        });
      }
    }
  }

  /**
   * Maneja casos especiales de error
   */
  handleSpecialCases(errorInfo) {
    // Sesión expirada - redirigir a login
    if (errorInfo.status === HTTP_STATUS.UNAUTHORIZED) {
      // Limpiar datos de autenticación
      localStorage.removeItem('auth-storage');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }

    // Error de red - activar modo offline si está disponible
    if (errorInfo.type === 'network') {
      window.dispatchEvent(new Event('offline'));
    }
  }

  /**
   * Reporta errores a servicio de monitoreo externo
   */
  reportToMonitoring(errorInfo) {
    // Integración con Sentry, LogRocket, etc.
    if (window.Sentry && errorInfo.type !== 'validation') {
      window.Sentry.captureException(new Error(errorInfo.message), {
        contexts: {
          errorInfo
        }
      });
    }

    // Google Analytics (si está configurado)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${errorInfo.context}: ${errorInfo.message}`,
        fatal: errorInfo.type === 'javascript'
      });
    }
  }

  /**
   * Agrega error a la cola para análisis
   */
  addToQueue(errorInfo) {
    this.errorQueue.push(errorInfo);
    
    // Mantener tamaño máximo de cola
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * Obtiene los últimos errores para debugging
   */
  getRecentErrors() {
    return [...this.errorQueue];
  }

  /**
   * Limpia la cola de errores
   */
  clearErrors() {
    this.errorQueue = [];
  }

  /**
   * Wrapper para try-catch asíncrono
   */
  async tryAsync(asyncFn, context, options = {}) {
    try {
      return await asyncFn();
    } catch (error) {
      this.handle(error, context, options);
      return null;
    }
  }

  /**
   * Wrapper para try-catch síncrono
   */
  try(fn, context, options = {}) {
    try {
      return fn();
    } catch (error) {
      this.handle(error, context, options);
      return null;
    }
  }
}

// Exportar instancia única
const errorHandler = new ErrorHandler();
export default errorHandler;

// Exportar también funciones de conveniencia
export const handleError = errorHandler.handle.bind(errorHandler);
export const tryAsync = errorHandler.tryAsync.bind(errorHandler);
export const trySync = errorHandler.try.bind(errorHandler);