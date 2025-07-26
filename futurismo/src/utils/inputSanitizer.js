/**
 * Sistema de Sanitización de Entrada de Datos
 * 
 * PROPÓSITO: Limpiar y normalizar datos de entrada para prevenir:
 * - XSS (Cross-Site Scripting)
 * - Injection attacks
 * - Data corruption
 * - Format inconsistencies
 */

import Logger from './logger.js';

// ===========================================
// PATRONES PELIGROSOS
// ===========================================

const DANGEROUS_PATTERNS = {
  // Scripts maliciosos
  SCRIPT_TAGS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  
  // Event handlers peligrosos
  EVENT_HANDLERS: /on\w+\s*=\s*['""][^'"]*['"']/gi,
  
  // URLs con javascript:
  JAVASCRIPT_URLS: /javascript\s*:/gi,
  
  // Data URLs peligrosas (excepto imágenes)
  DANGEROUS_DATA_URLS: /data:(?!image\/)[^;]*;base64/gi,
  
  // Iframes y embeds
  EMBED_TAGS: /<(iframe|embed|object|applet|form)\b[^>]*>/gi,
  
  // SQL injection básico
  SQL_INJECTION: /(union\s+select|drop\s+table|delete\s+from|insert\s+into|update\s+set)/gi,
  
  // Path traversal
  PATH_TRAVERSAL: /\.\.[\/\\]/g,
  
  // HTML entities maliciosos
  MALICIOUS_ENTITIES: /&(#x?[0-9a-f]+;?|[a-z]+;?)/gi
};

// ===========================================
// SANITIZADORES ESPECIALIZADOS
// ===========================================

class InputSanitizer {
  
  // Sanitización general de texto
  static sanitizeText(input, options = {}) {
    const {
      maxLength = 1000,
      allowHtml = false,
      removeEmojis = false,
      normalizeSpaces = true,
      trim = true
    } = options;
    
    if (input === null || input === undefined) return input;
    if (typeof input !== 'string') return String(input);
    
    let sanitized = input;
    
    // Truncar si es muy largo
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
      Logger.warn(`Input truncado a ${maxLength} caracteres`);
    }
    
    // Remover HTML si no está permitido
    if (!allowHtml) {
      sanitized = this.stripHtml(sanitized);
    } else {
      sanitized = this.sanitizeHtml(sanitized);
    }
    
    // Remover emojis si está configurado
    if (removeEmojis) {
      sanitized = this.removeEmojis(sanitized);
    }
    
    // Normalizar espacios
    if (normalizeSpaces) {
      sanitized = sanitized.replace(/\s+/g, ' ');
    }
    
    // Trim
    if (trim) {
      sanitized = sanitized.trim();
    }
    
    return sanitized;
  }
  
  // Sanitización específica para HTML
  static sanitizeHtml(input) {
    if (typeof input !== 'string') return input;
    
    let sanitized = input;
    
    // Remover patrones peligrosos
    Object.values(DANGEROUS_PATTERNS).forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Lista blanca de tags permitidos
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'span', 'div'];
    const allowedAttributes = ['class', 'id'];
    
    // Remover tags no permitidos (implementación básica)
    sanitized = sanitized.replace(/<(\/?)([\w-]+)([^>]*)>/gi, (match, slash, tag, attrs) => {
      if (!allowedTags.includes(tag.toLowerCase())) {
        return ''; // Remover tag no permitido
      }
      
      // Limpiar atributos
      const cleanAttrs = attrs.replace(/(\w+)=["']([^"']*)["']/g, (attrMatch, name, value) => {
        if (allowedAttributes.includes(name.toLowerCase())) {
          // Sanitizar valor del atributo
          const cleanValue = value.replace(/[<>'"]/g, '');
          return `${name}="${cleanValue}"`;
        }
        return ''; // Remover atributo no permitido
      });
      
      return `<${slash}${tag}${cleanAttrs}>`;
    });
    
    return sanitized;
  }
  
  // Remover completamente HTML
  static stripHtml(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<[^>]*>/g, '') // Remover todos los tags
      .replace(/&[#\w]+;/g, '') // Remover entities HTML
      .trim();
  }
  
  // Sanitización de email
  static sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return email;
    
    let sanitized = email
      .toLowerCase()
      .trim()
      .replace(/[^\w@.-]/g, ''); // Solo caracteres válidos para email
    
    // Validar formato básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      Logger.warn('Email con formato inválido sanitizado:', email);
    }
    
    return sanitized;
  }
  
  // Sanitización de números de teléfono
  static sanitizePhone(phone) {
    if (!phone || typeof phone !== 'string') return phone;
    
    // Remover todo excepto dígitos y +
    let sanitized = phone.replace(/[^\d+]/g, '');
    
    // Si empieza con +51, mantenerlo
    if (sanitized.startsWith('+51')) {
      return sanitized;
    }
    
    // Si empieza con 51, agregar +
    if (sanitized.startsWith('51') && sanitized.length === 11) {
      return '+' + sanitized;
    }
    
    // Si es un número local de 9 dígitos, agregar +51
    if (sanitized.length === 9 && sanitized.startsWith('9')) {
      return '+51' + sanitized;
    }
    
    return sanitized;
  }
  
  // Sanitización de URLs
  static sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return url;
    
    let sanitized = url.trim();
    
    // Verificar protocolos seguros
    const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const hasProtocol = safeProtocols.some(protocol => 
      sanitized.toLowerCase().startsWith(protocol)
    );
    
    if (!hasProtocol && !sanitized.startsWith('/') && !sanitized.startsWith('#')) {
      // Asumir https si no hay protocolo
      sanitized = 'https://' + sanitized;
    }
    
    // Remover javascript: y data: peligrosos
    if (DANGEROUS_PATTERNS.JAVASCRIPT_URLS.test(sanitized) || 
        DANGEROUS_PATTERNS.DANGEROUS_DATA_URLS.test(sanitized)) {
      Logger.warn('URL peligrosa bloqueada:', url);
      return '#';
    }
    
    // Prevenir path traversal
    sanitized = sanitized.replace(DANGEROUS_PATTERNS.PATH_TRAVERSAL, '');
    
    return sanitized;
  }
  
  // Sanitización de nombres (personas, lugares, etc.)
  static sanitizeName(name) {
    if (!name || typeof name !== 'string') return name;
    
    let sanitized = name
      .trim()
      .replace(/[<>{}[\]]/g, '') // Remover caracteres problemáticos
      .replace(/\s+/g, ' '); // Normalizar espacios
    
    // Capitalizar correctamente
    sanitized = sanitized.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    
    // Limitar longitud
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 100);
      Logger.warn('Nombre truncado por longitud excesiva');
    }
    
    return sanitized;
  }
  
  // Sanitización de códigos (tours, etc.)
  static sanitizeCode(code) {
    if (!code || typeof code !== 'string') return code;
    
    return code
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '') // Solo letras y números
      .substring(0, 20); // Máximo 20 caracteres
  }
  
  // Sanitización de números
  static sanitizeNumber(number, options = {}) {
    const { 
      allowDecimals = true, 
      allowNegative = true, 
      maxDigits = 15 
    } = options;
    
    if (number === null || number === undefined) return number;
    
    let sanitized = String(number).trim();
    
    // Remover caracteres no numéricos (excepto . y -)
    if (allowDecimals && allowNegative) {
      sanitized = sanitized.replace(/[^0-9.-]/g, '');
    } else if (allowDecimals) {
      sanitized = sanitized.replace(/[^0-9.]/g, '');
    } else if (allowNegative) {
      sanitized = sanitized.replace(/[^0-9-]/g, '');
    } else {
      sanitized = sanitized.replace(/[^0-9]/g, '');
    }
    
    // Validar que solo hay un punto decimal
    if (allowDecimals) {
      const parts = sanitized.split('.');
      if (parts.length > 2) {
        sanitized = parts[0] + '.' + parts.slice(1).join('');
      }
    }
    
    // Validar que solo hay un signo negativo al inicio
    if (allowNegative) {
      const negative = sanitized.startsWith('-');
      sanitized = sanitized.replace(/-/g, '');
      if (negative) sanitized = '-' + sanitized;
    }
    
    // Limitar dígitos
    if (sanitized.replace(/[.-]/g, '').length > maxDigits) {
      Logger.warn(`Número truncado a ${maxDigits} dígitos`);
      sanitized = sanitized.substring(0, maxDigits + (allowDecimals ? 1 : 0) + (allowNegative ? 1 : 0));
    }
    
    return sanitized;
  }
  
  // Sanitización de coordenadas GPS
  static sanitizeCoordinates(coords) {
    if (!coords || typeof coords !== 'object') return coords;
    
    const sanitized = {};
    
    if ('lat' in coords) {
      const lat = parseFloat(coords.lat);
      sanitized.lat = Math.max(-90, Math.min(90, lat));
    }
    
    if ('lng' in coords) {
      const lng = parseFloat(coords.lng);
      sanitized.lng = Math.max(-180, Math.min(180, lng));
    }
    
    return sanitized;
  }
  
  // Sanitización de fechas
  static sanitizeDate(date) {
    if (!date) return date;
    
    // Si es string, intentar parsear
    if (typeof date === 'string') {
      // Remover caracteres peligrosos
      const cleanDate = date.replace(/[<>{}[\]]/g, '').trim();
      
      const parsed = new Date(cleanDate);
      if (isNaN(parsed.getTime())) {
        Logger.warn('Fecha inválida sanitizada:', date);
        return null;
      }
      
      return parsed.toISOString();
    }
    
    // Si es Date object
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        Logger.warn('Objeto Date inválido');
        return null;
      }
      return date.toISOString();
    }
    
    return date;
  }
  
  // Remover emojis
  static removeEmojis(text) {
    if (typeof text !== 'string') return text;
    
    // Regex para emojis (básico)
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    
    return text.replace(emojiRegex, '');
  }
  
  // Sanitización de objetos completos
  static sanitizeObject(obj, schema = {}) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldSchema = schema[key] || {};
      const { type = 'text', ...options } = fieldSchema;
      
      switch (type) {
        case 'email':
          sanitized[key] = this.sanitizeEmail(value);
          break;
        case 'phone':
          sanitized[key] = this.sanitizePhone(value);
          break;
        case 'url':
          sanitized[key] = this.sanitizeUrl(value);
          break;
        case 'name':
          sanitized[key] = this.sanitizeName(value);
          break;
        case 'code':
          sanitized[key] = this.sanitizeCode(value);
          break;
        case 'number':
          sanitized[key] = this.sanitizeNumber(value, options);
          break;
        case 'coordinates':
          sanitized[key] = this.sanitizeCoordinates(value);
          break;
        case 'date':
          sanitized[key] = this.sanitizeDate(value);
          break;
        case 'html':
          sanitized[key] = this.sanitizeHtml(value);
          break;
        case 'text':
        default:
          sanitized[key] = this.sanitizeText(value, options);
      }
    }
    
    return sanitized;
  }
  
  // Detección de contenido malicioso
  static detectMaliciousContent(input) {
    if (typeof input !== 'string') return false;
    
    const threats = [];
    
    // Verificar cada patrón peligroso
    for (const [name, pattern] of Object.entries(DANGEROUS_PATTERNS)) {
      if (pattern.test(input)) {
        threats.push(name);
      }
    }
    
    if (threats.length > 0) {
      Logger.warn('Contenido malicioso detectado:', { threats, input: input.substring(0, 100) });
      return { isMalicious: true, threats };
    }
    
    return { isMalicious: false, threats: [] };
  }
  
  // Validación de tipo de archivo
  static validateFileType(filename, allowedTypes = []) {
    if (!filename || typeof filename !== 'string') return false;
    
    const extension = filename.toLowerCase().split('.').pop();
    
    // Tipos de archivo seguros por defecto
    const defaultSafeTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'doc', 'docx'];
    const allowed = allowedTypes.length > 0 ? allowedTypes : defaultSafeTypes;
    
    return allowed.includes(extension);
  }
}

// ===========================================
// ESQUEMAS DE SANITIZACIÓN PREDEFINIDOS
// ===========================================

export const sanitizationSchemas = {
  tour: {
    code: { type: 'code' },
    name: { type: 'name', maxLength: 100 },
    description: { type: 'text', maxLength: 500, allowHtml: false },
    price: { type: 'number', allowDecimals: true, allowNegative: false },
    capacity: { type: 'number', allowDecimals: false, allowNegative: false }
  },
  
  guide: {
    name: { type: 'name' },
    email: { type: 'email' },
    phone: { type: 'phone' },
    bio: { type: 'text', maxLength: 300, allowHtml: false }
  },
  
  client: {
    name: { type: 'name' },
    email: { type: 'email' },
    phone: { type: 'phone' },
    emergencyContact: { type: 'phone' }
  },
  
  location: {
    coordinates: { type: 'coordinates' },
    address: { type: 'text', maxLength: 200 },
    description: { type: 'text', maxLength: 300 }
  }
};

// ===========================================
// MIDDLEWARE PARA EXPRESS (si se usa en backend)
// ===========================================

export const createSanitizationMiddleware = (schema = {}) => {
  return (req, res, next) => {
    try {
      if (req.body) {
        req.body = InputSanitizer.sanitizeObject(req.body, schema);
      }
      
      if (req.query) {
        req.query = InputSanitizer.sanitizeObject(req.query, schema);
      }
      
      if (req.params) {
        req.params = InputSanitizer.sanitizeObject(req.params, schema);
      }
      
      next();
    } catch (error) {
      Logger.error('Error en sanitización middleware:', error);
      res.status(400).json({ error: 'Error procesando datos de entrada' });
    }
  };
};

export default InputSanitizer;