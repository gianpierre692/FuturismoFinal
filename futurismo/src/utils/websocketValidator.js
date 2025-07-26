/**
 * Validador de Mensajes WebSocket
 * 
 * PROPÓSITO:
 * - Validar mensajes WebSocket entrantes y salientes
 * - Prevenir injection attacks a través de WebSocket
 * - Sanitizar datos en tiempo real
 * - Rate limiting y throttling
 * - Logging de eventos sospechosos
 */

import Logger from './logger.js';
import InputSanitizer from './inputSanitizer.js';
import ApiValidator from './apiValidator.js';

// ===========================================
// ESQUEMAS DE MENSAJES WEBSOCKET
// ===========================================

const WEBSOCKET_MESSAGE_SCHEMAS = {
  // Mensaje base
  base: {
    type: { type: 'string', required: true },
    payload: { type: 'object', required: true },
    timestamp: { type: 'string', required: true },
    id: { type: 'string', required: false },
    userId: { type: 'string', required: false }
  },

  // Actualización de ubicación de tour
  'tour:location-update': {
    type: { type: 'string', required: true, expectedValue: 'tour:location-update' },
    payload: {
      type: 'object',
      required: true,
      properties: {
        tourId: { type: 'string', required: true },
        coordinates: {
          type: 'object',
          required: true,
          properties: {
            lat: { type: 'number', required: true, min: -90, max: 90 },
            lng: { type: 'number', required: true, min: -180, max: 180 }
          }
        },
        accuracy: { type: 'number', required: false, min: 0, max: 1000 },
        heading: { type: 'number', required: false, min: 0, max: 360 },
        speed: { type: 'number', required: false, min: 0, max: 200 },
        timestamp: { type: 'string', required: true }
      }
    },
    timestamp: { type: 'string', required: true },
    id: { type: 'string', required: false }
  },

  // Cambio de estado de tour
  'tour:status-change': {
    type: { type: 'string', required: true, expectedValue: 'tour:status-change' },
    payload: {
      type: 'object',
      required: true,
      properties: {
        tourId: { type: 'string', required: true },
        status: { 
          type: 'string', 
          required: true,
          allowedValues: ['programado', 'en_curso', 'pausado', 'finalizado', 'cancelado']
        },
        reason: { type: 'string', required: false, maxLength: 500 },
        timestamp: { type: 'string', required: true }
      }
    },
    timestamp: { type: 'string', required: true }
  },

  // Actualización de estado de guía
  'guide:status-update': {
    type: { type: 'string', required: true, expectedValue: 'guide:status-update' },
    payload: {
      type: 'object',
      required: true,
      properties: {
        guideId: { type: 'string', required: true },
        status: { 
          type: 'string', 
          required: true,
          allowedValues: ['available', 'busy', 'offline', 'break']
        },
        currentLocation: {
          type: 'object',
          required: false,
          properties: {
            lat: { type: 'number', required: true, min: -90, max: 90 },
            lng: { type: 'number', required: true, min: -180, max: 180 }
          }
        },
        notes: { type: 'string', required: false, maxLength: 200 }
      }
    },
    timestamp: { type: 'string', required: true }
  },

  // Alerta de emergencia
  'emergency:alert': {
    type: { type: 'string', required: true, expectedValue: 'emergency:alert' },
    payload: {
      type: 'object',
      required: true,
      properties: {
        alertId: { type: 'string', required: true },
        severity: { 
          type: 'string', 
          required: true,
          allowedValues: ['low', 'medium', 'high', 'critical']
        },
        message: { type: 'string', required: true, maxLength: 1000 },
        location: {
          type: 'object',
          required: true,
          properties: {
            lat: { type: 'number', required: true, min: -90, max: 90 },
            lng: { type: 'number', required: true, min: -180, max: 180 }
          }
        },
        tourId: { type: 'string', required: false },
        guideId: { type: 'string', required: false },
        timestamp: { type: 'string', required: true }
      }
    },
    timestamp: { type: 'string', required: true }
  },

  // Nueva notificación
  'notification:new': {
    type: { type: 'string', required: true, expectedValue: 'notification:new' },
    payload: {
      type: 'object',
      required: true,
      properties: {
        notificationId: { type: 'string', required: true },
        title: { type: 'string', required: true, maxLength: 100 },
        message: { type: 'string', required: true, maxLength: 500 },
        category: { 
          type: 'string', 
          required: true,
          allowedValues: ['info', 'warning', 'error', 'success', 'reminder']
        },
        priority: {
          type: 'string',
          required: false,
          allowedValues: ['low', 'normal', 'high', 'urgent']
        },
        targetUsers: { type: 'array', required: false },
        actionUrl: { type: 'string', required: false, maxLength: 200 },
        expiresAt: { type: 'string', required: false }
      }
    },
    timestamp: { type: 'string', required: true }
  },

  // Heartbeat
  'heartbeat:ping': {
    type: { type: 'string', required: true, expectedValue: 'heartbeat:ping' },
    payload: {
      type: 'object',
      required: true,
      properties: {
        timestamp: { type: 'number', required: true },
        clientId: { type: 'string', required: true }
      }
    },
    timestamp: { type: 'string', required: true }
  },

  'heartbeat:response': {
    type: { type: 'string', required: true, expectedValue: 'heartbeat:response' },
    payload: {
      type: 'object',
      required: true,
      properties: {
        timestamp: { type: 'number', required: true },
        serverTime: { type: 'number', required: true }
      }
    },
    timestamp: { type: 'string', required: true }
  }
};

// ===========================================
// RATE LIMITING
// ===========================================

class RateLimiter {
  constructor() {
    this.clients = new Map(); // clientId -> { count, resetTime, blocked }
    this.globalStats = {
      totalMessages: 0,
      blockedMessages: 0,
      startTime: Date.now()
    };
  }

  isAllowed(clientId, messageType = 'default') {
    const now = Date.now();
    const windowMs = 60000; // 1 minuto
    const limits = {
      'tour:location-update': 60, // Max 60 ubicaciones por minuto
      'tour:status-change': 10,   // Max 10 cambios de estado por minuto
      'guide:status-update': 30,  // Max 30 actualizaciones por minuto
      'emergency:alert': 5,       // Max 5 alertas por minuto
      'notification:new': 20,     // Max 20 notificaciones por minuto
      'heartbeat:ping': 120,      // Max 120 heartbeats por minuto (cada 0.5s)
      'default': 100              // Límite general
    };

    const limit = limits[messageType] || limits.default;
    
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, {
        count: 0,
        resetTime: now + windowMs,
        blocked: false,
        messageTypes: new Map()
      });
    }

    const client = this.clients.get(clientId);

    // Reset si pasó la ventana de tiempo
    if (now > client.resetTime) {
      client.count = 0;
      client.resetTime = now + windowMs;
      client.blocked = false;
      client.messageTypes.clear();
    }

    // Verificar límite por tipo de mensaje
    const typeCount = client.messageTypes.get(messageType) || 0;
    if (typeCount >= limit) {
      Logger.warn(`Rate limit excedido para cliente ${clientId}, tipo ${messageType}: ${typeCount}/${limit}`);
      client.blocked = true;
      this.globalStats.blockedMessages++;
      return false;
    }

    // Incrementar contadores
    client.count++;
    client.messageTypes.set(messageType, typeCount + 1);
    this.globalStats.totalMessages++;

    return true;
  }

  getClientStats(clientId) {
    return this.clients.get(clientId) || null;
  }

  getGlobalStats() {
    return {
      ...this.globalStats,
      activeClients: this.clients.size,
      uptimeMs: Date.now() - this.globalStats.startTime
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [clientId, client] of this.clients.entries()) {
      if (now > client.resetTime + 300000) { // 5 minutos después del reset
        this.clients.delete(clientId);
      }
    }
  }
}

// ===========================================
// VALIDADOR PRINCIPAL
// ===========================================

class WebSocketValidator {
  constructor() {
    this.rateLimiter = new RateLimiter();
    this.suspiciousClients = new Set();
    this.validationStats = {
      totalValidated: 0,
      validMessages: 0,
      invalidMessages: 0,
      sanitizedMessages: 0,
      startTime: Date.now()
    };

    // Cleanup periódico
    setInterval(() => {
      this.rateLimiter.cleanup();
      this.cleanupSuspiciousClients();
    }, 300000); // Cada 5 minutos
  }

  validateIncomingMessage(rawMessage, clientId, options = {}) {
    const {
      enforceRateLimit = true,
      sanitize = true,
      logSuspicious = true,
      strictMode = true
    } = options;

    this.validationStats.totalValidated++;

    try {
      // 1. Parsear mensaje si es string
      let message;
      if (typeof rawMessage === 'string') {
        try {
          message = JSON.parse(rawMessage);
        } catch (error) {
          Logger.warn(`JSON inválido de cliente ${clientId}:`, error.message);
          return this.createValidationResult(false, ['JSON inválido'], rawMessage);
        }
      } else {
        message = rawMessage;
      }

      // 2. Validación básica de estructura
      if (!message || typeof message !== 'object') {
        return this.createValidationResult(false, ['Mensaje debe ser un objeto'], message);
      }

      if (!message.type || typeof message.type !== 'string') {
        return this.createValidationResult(false, ['Campo "type" requerido'], message);
      }

      // 3. Rate limiting
      if (enforceRateLimit && !this.rateLimiter.isAllowed(clientId, message.type)) {
        this.markSuspiciousClient(clientId, 'rate_limit_exceeded');
        return this.createValidationResult(false, ['Rate limit excedido'], message);
      }

      // 4. Validar contra esquema específico
      const schema = WEBSOCKET_MESSAGE_SCHEMAS[message.type] || WEBSOCKET_MESSAGE_SCHEMAS.base;
      const validationResult = this.validateAgainstSchema(message, schema, strictMode);

      if (!validationResult.isValid) {
        Logger.warn(`Mensaje inválido de tipo ${message.type} de cliente ${clientId}:`, {
          errors: validationResult.errors,
          message: this.sanitizeForLogging(message)
        });
        
        this.validationStats.invalidMessages++;
        this.markSuspiciousClient(clientId, 'invalid_message');
        return validationResult;
      }

      // 5. Sanitización
      let sanitizedMessage = message;
      if (sanitize) {
        sanitizedMessage = this.sanitizeMessage(message, schema);
        if (JSON.stringify(sanitizedMessage) !== JSON.stringify(message)) {
          this.validationStats.sanitizedMessages++;
          Logger.debug(`Mensaje sanitizado para cliente ${clientId}`);
        }
      }

      // 6. Validaciones específicas de dominio
      const domainValidation = this.validateDomainSpecific(sanitizedMessage);
      if (!domainValidation.isValid) {
        this.validationStats.invalidMessages++;
        return domainValidation;
      }

      // 7. Detectar patrones sospechosos
      if (logSuspicious) {
        this.detectSuspiciousPatterns(sanitizedMessage, clientId);
      }

      this.validationStats.validMessages++;
      return this.createValidationResult(true, [], sanitizedMessage);

    } catch (error) {
      Logger.error('Error durante validación de mensaje WebSocket:', error);
      return this.createValidationResult(false, ['Error interno de validación'], rawMessage);
    }
  }

  validateOutgoingMessage(message, options = {}) {
    const { sanitize = true, strictMode = false } = options;

    try {
      if (!message || typeof message !== 'object') {
        return this.createValidationResult(false, ['Mensaje debe ser un objeto'], message);
      }

      if (!message.type) {
        return this.createValidationResult(false, ['Campo "type" requerido'], message);
      }

      // Agregar timestamp si no existe
      if (!message.timestamp) {
        message.timestamp = new Date().toISOString();
      }

      const schema = WEBSOCKET_MESSAGE_SCHEMAS[message.type] || WEBSOCKET_MESSAGE_SCHEMAS.base;
      const validationResult = this.validateAgainstSchema(message, schema, strictMode);

      if (!validationResult.isValid) {
        Logger.warn(`Mensaje saliente inválido de tipo ${message.type}:`, validationResult.errors);
        return validationResult;
      }

      let sanitizedMessage = message;
      if (sanitize) {
        sanitizedMessage = this.sanitizeMessage(message, schema);
      }

      return this.createValidationResult(true, [], sanitizedMessage);

    } catch (error) {
      Logger.error('Error validando mensaje saliente:', error);
      return this.createValidationResult(false, ['Error interno de validación'], message);
    }
  }

  validateAgainstSchema(message, schema, strictMode = true) {
    return ApiValidator.validateResponse(message, null, {
      strict: strictMode,
      sanitize: false, // Sanitizamos por separado
      allowUnknownFields: !strictMode,
      logWarnings: true,
      customSchema: schema
    });
  }

  sanitizeMessage(message, schema) {
    const sanitized = { ...message };

    // Sanitizar campos específicos
    if (sanitized.payload && typeof sanitized.payload === 'object') {
      sanitized.payload = this.sanitizePayload(sanitized.payload, schema.payload);
    }

    // Sanitizar campos de nivel superior
    if (typeof sanitized.type === 'string') {
      sanitized.type = InputSanitizer.sanitizeText(sanitized.type, { maxLength: 50 });
    }

    if (sanitized.id && typeof sanitized.id === 'string') {
      sanitized.id = InputSanitizer.sanitizeText(sanitized.id, { maxLength: 100 });
    }

    if (sanitized.userId && typeof sanitized.userId === 'string') {
      sanitized.userId = InputSanitizer.sanitizeText(sanitized.userId, { maxLength: 50 });
    }

    return sanitized;
  }

  sanitizePayload(payload, payloadSchema) {
    if (!payloadSchema || !payloadSchema.properties) {
      // Sanitización básica si no hay esquema específico
      const sanitized = {};
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string') {
          sanitized[key] = InputSanitizer.sanitizeText(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = InputSanitizer.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }

    // Sanitización basada en esquema
    const sanitized = {};
    for (const [key, fieldSchema] of Object.entries(payloadSchema.properties)) {
      const value = payload[key];
      if (value !== undefined) {
        sanitized[key] = ApiValidator.sanitizeField(value, fieldSchema);
      }
    }

    return sanitized;
  }

  validateDomainSpecific(message) {
    switch (message.type) {
      case 'tour:location-update':
        return this.validateLocationUpdate(message);
      
      case 'tour:status-change':
        return this.validateStatusChange(message);
      
      case 'emergency:alert':
        return this.validateEmergencyAlert(message);
      
      default:
        return this.createValidationResult(true, []);
    }
  }

  validateLocationUpdate(message) {
    const { coordinates, tourId, timestamp } = message.payload;

    // Validar que la ubicación esté en Perú (aproximadamente)
    const peruBounds = {
      north: 0,
      south: -18.5,
      east: -68.5,
      west: -81.5
    };

    if (coordinates.lat > peruBounds.north || coordinates.lat < peruBounds.south ||
        coordinates.lng > peruBounds.east || coordinates.lng < peruBounds.west) {
      Logger.warn(`Ubicación fuera de Perú detectada: ${coordinates.lat}, ${coordinates.lng}`);
      return this.createValidationResult(false, ['Ubicación fuera del área permitida']);
    }

    // Validar timestamp reciente (no más de 5 minutos de diferencia)
    const msgTime = new Date(timestamp);
    const now = new Date();
    const diffMs = Math.abs(now.getTime() - msgTime.getTime());
    
    if (diffMs > 300000) { // 5 minutos
      return this.createValidationResult(false, ['Timestamp demasiado antiguo o futuro']);
    }

    return this.createValidationResult(true, []);
  }

  validateStatusChange(message) {
    const { status, reason } = message.payload;

    // Validar transiciones de estado válidas
    const validTransitions = {
      'programado': ['en_curso', 'cancelado'],
      'en_curso': ['pausado', 'finalizado', 'cancelado'],
      'pausado': ['en_curso', 'cancelado'],
      'finalizado': [], // Estado final
      'cancelado': []   // Estado final
    };

    // Si hay razón, debe ser válida para cancelaciones
    if (status === 'cancelado' && reason) {
      if (reason.length < 10) {
        return this.createValidationResult(false, ['Razón de cancelación muy corta']);
      }
    }

    return this.createValidationResult(true, []);
  }

  validateEmergencyAlert(message) {
    const { severity, message: alertMessage, location } = message.payload;

    // Alertas críticas deben tener mensaje detallado
    if (severity === 'critical' && alertMessage.length < 50) {
      return this.createValidationResult(false, ['Alerta crítica requiere mensaje detallado']);
    }

    // Validar ubicación en área permitida (similar a location update)
    const peruBounds = {
      north: 0,
      south: -18.5,
      east: -68.5,
      west: -81.5
    };

    if (location.lat > peruBounds.north || location.lat < peruBounds.south ||
        location.lng > peruBounds.east || location.lng < peruBounds.west) {
      return this.createValidationResult(false, ['Ubicación de emergencia fuera del área permitida']);
    }

    return this.createValidationResult(true, []);
  }

  detectSuspiciousPatterns(message, clientId) {
    const suspiciousPatterns = [];

    // Detectar mensajes repetitivos
    if (this.isRepetitiveMessage(message, clientId)) {
      suspiciousPatterns.push('repetitive_messages');
    }

    // Detectar coordenadas imposibles (velocidad > 200 km/h)
    if (message.type === 'tour:location-update') {
      if (this.isImpossibleMovement(message, clientId)) {
        suspiciousPatterns.push('impossible_movement');
      }
    }

    // Detectar mensajes con timing sospechoso
    if (this.hasSuspiciousTiming(message, clientId)) {
      suspiciousPatterns.push('suspicious_timing');
    }

    if (suspiciousPatterns.length > 0) {
      this.markSuspiciousClient(clientId, suspiciousPatterns.join(','));
      Logger.warn(`Patrones sospechosos detectados para cliente ${clientId}:`, suspiciousPatterns);
    }
  }

  isRepetitiveMessage(message, clientId) {
    // Implementación básica - se podría expandir
    const key = `${clientId}-${message.type}`;
    const lastMessage = this.lastMessages?.get(key);
    
    if (!this.lastMessages) {
      this.lastMessages = new Map();
    }

    if (lastMessage && JSON.stringify(lastMessage.payload) === JSON.stringify(message.payload)) {
      const timeDiff = Date.now() - lastMessage.timestamp;
      if (timeDiff < 1000) { // Mensaje idéntico en menos de 1 segundo
        return true;
      }
    }

    this.lastMessages.set(key, { payload: message.payload, timestamp: Date.now() });
    return false;
  }

  isImpossibleMovement(message, clientId) {
    // Verificar si el movimiento es físicamente posible
    const key = `${clientId}-location`;
    const lastLocation = this.lastLocations?.get(key);
    
    if (!this.lastLocations) {
      this.lastLocations = new Map();
    }

    if (lastLocation) {
      const { coordinates: lastCoords, timestamp: lastTime } = lastLocation;
      const { coordinates: currentCoords, timestamp: currentTime } = message.payload;
      
      const distance = this.calculateDistance(lastCoords, currentCoords);
      const timeDiff = (new Date(currentTime) - new Date(lastTime)) / 1000; // segundos
      
      if (timeDiff > 0) {
        const speedKmh = (distance / 1000) / (timeDiff / 3600);
        
        if (speedKmh > 200) { // Más de 200 km/h es sospechoso
          Logger.warn(`Velocidad imposible detectada: ${speedKmh.toFixed(2)} km/h`);
          return true;
        }
      }
    }

    this.lastLocations.set(key, {
      coordinates: message.payload.coordinates,
      timestamp: message.payload.timestamp
    });

    return false;
  }

  hasSuspiciousTiming(message, clientId) {
    // Detectar mensajes con timestamps claramente incorrectos
    const msgTime = new Date(message.timestamp);
    const now = new Date();
    const diffMs = Math.abs(now.getTime() - msgTime.getTime());
    
    // Más de 1 hora de diferencia es sospechoso
    return diffMs > 3600000;
  }

  calculateDistance(coords1, coords2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = coords1.lat * Math.PI / 180;
    const φ2 = coords2.lat * Math.PI / 180;
    const Δφ = (coords2.lat - coords1.lat) * Math.PI / 180;
    const Δλ = (coords2.lng - coords1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
  }

  markSuspiciousClient(clientId, reason) {
    const key = `${clientId}-${reason}`;
    this.suspiciousClients.add(key);
    
    Logger.warn(`Cliente marcado como sospechoso: ${clientId}, razón: ${reason}`);
  }

  cleanupSuspiciousClients() {
    // Limpiar clientes sospechosos después de 1 hora
    this.suspiciousClients.clear();
    
    if (this.lastMessages) {
      this.lastMessages.clear();
    }
    
    if (this.lastLocations) {
      this.lastLocations.clear();
    }
  }

  createValidationResult(isValid, errors = [], sanitizedData = null) {
    return {
      isValid,
      errors,
      sanitizedData,
      timestamp: new Date().toISOString()
    };
  }

  sanitizeForLogging(data) {
    return ApiValidator.sanitizeForLogging(data, 2);
  }

  getStats() {
    return {
      validation: this.validationStats,
      rateLimiting: this.rateLimiter.getGlobalStats(),
      suspiciousClients: this.suspiciousClients.size
    };
  }

  // Registrar esquemas personalizados
  static registerMessageSchema(messageType, schema) {
    WEBSOCKET_MESSAGE_SCHEMAS[messageType] = schema;
    Logger.debug(`Esquema WebSocket registrado: ${messageType}`);
  }

  // Obtener esquemas disponibles
  static getAvailableSchemas() {
    return Object.keys(WEBSOCKET_MESSAGE_SCHEMAS);
  }
}

// ===========================================
// INSTANCIA SINGLETON
// ===========================================

const webSocketValidator = new WebSocketValidator();

export default webSocketValidator;
export { WebSocketValidator, RateLimiter, WEBSOCKET_MESSAGE_SCHEMAS };