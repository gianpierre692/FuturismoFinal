// Constantes de la aplicación

// Estados del servicio según el archivo leer.md
export const SERVICE_STATUS = {
  PENDING: 'pending',
  ON_WAY: 'on_way', 
  IN_SERVICE: 'in_service',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};

// Colores de estados para el mapa y badges
export const STATUS_COLORS = {
  [SERVICE_STATUS.PENDING]: '#6B7280', // gris
  [SERVICE_STATUS.ON_WAY]: '#F59E0B', // amarillo
  [SERVICE_STATUS.IN_SERVICE]: '#10B981', // verde
  [SERVICE_STATUS.FINISHED]: '#1E40AF', // azul
  [SERVICE_STATUS.CANCELLED]: '#EF4444' // rojo
};

// Tipos de servicio
export const SERVICE_TYPES = {
  TRANSFER: 'transfer',
  TOUR: 'tour',
  PACKAGE: 'package',
  CUSTOM: 'custom'
};

// Tipos de usuario
export const USER_ROLES = {
  AGENCY: 'agency',
  GUIDE: 'guide',
  ADMIN: 'admin'
};

// Intervalos de actualización
export const UPDATE_INTERVALS = {
  MAP_UPDATE: 30000, // 30 segundos
  NOTIFICATION_CHECK: 60000, // 1 minuto
  DASHBOARD_REFRESH: 300000 // 5 minutos
};

// Intervalos de tiempo en milisegundos (para reemplazar magic numbers)
export const TIME_INTERVALS = {
  ONE_SECOND: 1000,
  THREE_SECONDS: 3000,
  FIVE_SECONDS: 5000,
  TEN_SECONDS: 10000,
  THIRTY_SECONDS: 30000,
  ONE_MINUTE: 60000,
  FIVE_MINUTES: 300000,
  TEN_MINUTES: 600000,
  THIRTY_MINUTES: 1800000,
  ONE_HOUR: 3600000
};

// IDs por defecto del sistema
export const DEFAULT_IDS = {
  FREELANCE_USER: 'user-6',
  ADMIN_USER: 'admin1',
  AGENCY_USER: 'agency1',
  GUIDE_USER: 'guide1',
  DEFAULT_TOUR: 'TOUR001'
};

// Límites adicionales del sistema
export const SYSTEM_LIMITS = {
  MAX_RETRY_ATTEMPTS: 3,
  MAX_LOGIN_ATTEMPTS: 5,
  MAX_WEBSOCKET_RECONNECT_ATTEMPTS: 10,
  MAX_SEARCH_RESULTS: 100,
  MAX_EXPORT_RECORDS: 5000,
  MAX_NOTIFICATION_QUEUE: 50,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PRICE: 0,
  MAX_PRICE: 10000
};

// Configuración de WebSocket
export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_INTERVAL: 30000,
  RECONNECT_DECAY: 1.5,
  TIMEOUT: 60000,
  PING_INTERVAL: 30000,
  PONG_TIMEOUT: 10000
};

// Códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Límites y validaciones
export const LIMITS = {
  MIN_TOURISTS: 1,
  MAX_TOURISTS: 50,
  MIN_SERVICE_DURATION: 1, // horas
  MAX_SERVICE_DURATION: 24, // horas
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  DEBOUNCE_DELAY: 300 // ms para búsquedas
};

// Configuración de reservas fulldays (usando configuración centralizada)
export const FULLDAY_CONFIG = {
  CUTOFF_HOUR: 17, // 5 PM - hora límite para reservas directas
  WHATSAPP_NUMBER: config.EXTERNAL_SERVICES.WHATSAPP.NUMBER,
  WHATSAPP_MESSAGE: config.EXTERNAL_SERVICES.WHATSAPP.MESSAGE_TEMPLATE
};

// URLs de API (importadas desde configuración centralizada)
import config from './config.js';

export const API_ENDPOINTS = {
  BASE_URL: config.API.BASE_URL,
  WS_URL: config.WEBSOCKET.PRIMARY_URL
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  GENERIC_ERROR: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 5MB.'
};

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm'
};

// Configuración del mapa (importada desde configuración centralizada)
export const MAP_CONFIG = {
  DEFAULT_CENTER: config.MAP.DEFAULT_CENTER,
  DEFAULT_ZOOM: config.MAP.DEFAULT_ZOOM,
  MIN_ZOOM: config.MAP.MIN_ZOOM,
  MAX_ZOOM: config.MAP.MAX_ZOOM,
  TILE_LAYER_URL: config.MAP.TILE_URLS.openstreetmap,
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Configuración de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Estados de formulario
export const FORM_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Configuración de exportación
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv'
};

// Configuración de chat
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_BATCH_SIZE: 20
};

// Regex para validaciones
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  PASSPORT: /^[A-Z0-9]{6,20}$/i,
  SERVICE_CODE: /^[A-Z]{2}[0-9]{6}$/
};