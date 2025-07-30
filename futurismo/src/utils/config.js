/**
 * Configuración centralizada de la aplicación
 * 
 * BUENAS PRÁCTICAS:
 * - Variables de entorno centralizadas
 * - Valores por defecto seguros
 * - Validación de configuración
 * - Diferentes configs por ambiente
 */

// Detectar ambiente actual
const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
const isDevelopment = environment === 'development';
const isProduction = environment === 'production';
const isStaging = environment === 'staging';

// Validar variables críticas en producción
if (isProduction) {
  const requiredVars = ['VITE_API_URL', 'VITE_WS_URL'];
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes en producción:', missingVars);
    throw new Error(`Variables de entorno requeridas: ${missingVars.join(', ')}`);
  }
}

// Configuración de API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3006/api',
  TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000,
  MAX_RETRIES: parseInt(import.meta.env.VITE_MAX_RETRY_ATTEMPTS) || 3,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Configuración de WebSocket
export const WEBSOCKET_CONFIG = {
  PRIMARY_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3006',
  BACKUP_URL: import.meta.env.VITE_WS_BACKUP_URL || 'ws://backup.localhost:3006',
  FALLBACK_URL: import.meta.env.VITE_WS_FALLBACK_URL || 'ws://fallback.localhost:3006',
  
  ENABLED: import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false',
  HEARTBEAT_INTERVAL: 30000,
  RECONNECT_DELAY: 1000,
  MAX_RECONNECT_DELAY: 30000,
  POLLING_INTERVAL: parseInt(import.meta.env.VITE_MAP_UPDATE_INTERVAL) || 5000
};

// Configuración de mapa
export const MAP_CONFIG = {
  DEFAULT_CENTER: [
    parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT) || -13.5319,
    parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG) || -71.9675
  ],
  DEFAULT_ZOOM: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 13,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  UPDATE_INTERVAL: parseInt(import.meta.env.VITE_MAP_UPDATE_INTERVAL) || 5000,
  
  // Providers disponibles
  PROVIDERS: (import.meta.env.VITE_MAP_PROVIDERS || 'openstreetmap,cartodb,stamen').split(','),
  
  // URLs de tiles
  TILE_URLS: {
    openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    cartodb: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    stamen: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
  }
};

// Configuración de servicios externos
export const EXTERNAL_SERVICES = {
  WHATSAPP: {
    NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '+51999888777',
    MESSAGE_TEMPLATE: 'Hola, necesito consultar disponibilidad para un tour fullday después de las 5 PM'
  },
  
  SUPPORT: {
    EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'soporte@futurismo.com',
    HELP_URL: import.meta.env.VITE_HELP_URL || 'https://help.futurismo.com'
  }
};

// Configuración de features
export const FEATURES = {
  MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || isDevelopment,
  PUSH_NOTIFICATIONS: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS !== 'false',
  OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE !== 'false',
  PERFORMANCE_METRICS: import.meta.env.VITE_ENABLE_PERFORMANCE_METRICS === 'true',
  DETAILED_LOGGING: import.meta.env.VITE_ENABLE_DETAILED_LOGGING === 'true' || isDevelopment,
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || isDevelopment
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 480, // minutos
  ALLOWED_DOMAIN: import.meta.env.VITE_ALLOWED_DOMAIN || null,
  
  // Validar dominio en producción
  validateDomain: (url) => {
    if (!isProduction) return true;
    if (!SECURITY_CONFIG.ALLOWED_DOMAIN) return true;
    
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.endsWith(SECURITY_CONFIG.ALLOWED_DOMAIN);
    } catch {
      return false;
    }
  }
};

// Configuración de performance
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  VIRTUAL_LIST_THRESHOLD: 100,
  LAZY_LOAD_THRESHOLD: '100px',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
  MAX_CACHE_SIZE: 100
};

// Configuración por ambiente
export const ENVIRONMENT_CONFIG = {
  environment,
  isDevelopment,
  isProduction,
  isStaging,
  
  // Logs según ambiente
  shouldLog: isDevelopment || FEATURES.DETAILED_LOGGING,
  shouldShowErrors: !isProduction || FEATURES.DEBUG_MODE,
  
  // Configuraciones específicas por ambiente
  development: {
    logLevel: 'debug',
    enableMocks: true,
    showPerformanceMetrics: true
  },
  
  staging: {
    logLevel: 'info',
    enableMocks: false,
    showPerformanceMetrics: true
  },
  
  production: {
    logLevel: 'error',
    enableMocks: false,
    showPerformanceMetrics: false
  }
};

// Validar configuración en runtime
export const validateConfig = () => {
  const errors = [];
  
  // Validar URLs
  try {
    new URL(API_CONFIG.BASE_URL);
  } catch {
    errors.push(`URL de API inválida: ${API_CONFIG.BASE_URL}`);
  }
  
  try {
    new URL(WEBSOCKET_CONFIG.PRIMARY_URL.replace('ws://', 'http://').replace('wss://', 'https://'));
  } catch {
    errors.push(`URL de WebSocket inválida: ${WEBSOCKET_CONFIG.PRIMARY_URL}`);
  }
  
  // Validar coordenadas del mapa
  const [lat, lng] = MAP_CONFIG.DEFAULT_CENTER;
  if (lat < -90 || lat > 90) {
    errors.push(`Latitud inválida: ${lat}`);
  }
  if (lng < -180 || lng > 180) {
    errors.push(`Longitud inválida: ${lng}`);
  }
  
  if (errors.length > 0) {
    console.error('❌ Errores de configuración:', errors);
    if (isProduction) {
      throw new Error(`Configuración inválida: ${errors.join(', ')}`);
    }
  }
  
  return errors.length === 0;
};

// Log de configuración en desarrollo
if (isDevelopment && FEATURES.DEBUG_MODE) {
  console.log('🔧 Configuración de la aplicación:', {
    environment,
    apiUrl: API_CONFIG.BASE_URL,
    wsUrl: WEBSOCKET_CONFIG.PRIMARY_URL,
    mapCenter: MAP_CONFIG.DEFAULT_CENTER,
    features: FEATURES
  });
}

// Exportar configuración completa
export default {
  API: API_CONFIG,
  WEBSOCKET: WEBSOCKET_CONFIG,
  MAP: MAP_CONFIG,
  EXTERNAL_SERVICES,
  FEATURES,
  SECURITY: SECURITY_CONFIG,
  PERFORMANCE: PERFORMANCE_CONFIG,
  ENVIRONMENT: ENVIRONMENT_CONFIG,
  validateConfig
};