// Configuración centralizada de la aplicación
// Este archivo valida y expone todas las variables de entorno

const getEnvVar = (key, defaultValue, required = false) => {
  const value = import.meta.env[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
};

const config = {
  // Environment
  env: getEnvVar('VITE_NODE_ENV', 'development'),
  isDevelopment: getEnvVar('VITE_NODE_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_NODE_ENV', 'development') === 'production',
  
  // API Configuration
  api: {
    baseUrl: getEnvVar('VITE_API_URL', 'http://localhost:3001/api'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000')),
    retryAttempts: parseInt(getEnvVar('VITE_API_RETRY_ATTEMPTS', '3')),
    retryDelay: parseInt(getEnvVar('VITE_API_RETRY_DELAY', '1000')),
  },
  
  // WebSocket Configuration
  websocket: {
    url: getEnvVar('VITE_WS_URL', 'ws://localhost:3001'),
    reconnectInterval: parseInt(getEnvVar('VITE_WS_RECONNECT_INTERVAL', '5000')),
    maxReconnectAttempts: parseInt(getEnvVar('VITE_WS_MAX_RECONNECTS', '10')),
  },
  
  // Map Configuration
  map: {
    defaultCenter: {
      lat: parseFloat(getEnvVar('VITE_MAP_CENTER_LAT', '-13.5319')),
      lng: parseFloat(getEnvVar('VITE_MAP_CENTER_LNG', '-71.9675')),
    },
    defaultZoom: parseInt(getEnvVar('VITE_MAP_DEFAULT_ZOOM', '13')),
    googleMapsApiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY', ''),
  },
  
  // Company Information
  company: {
    name: getEnvVar('VITE_COMPANY_NAME', 'Futurismo'),
    email: getEnvVar('VITE_COMPANY_EMAIL', ''),
    supportEmail: getEnvVar('VITE_SUPPORT_EMAIL', ''),
    emergencyEmail: getEnvVar('VITE_EMERGENCY_EMAIL', ''),
    whatsappNumber: getEnvVar('VITE_WHATSAPP_NUMBER', ''),
    address: getEnvVar('VITE_COMPANY_ADDRESS', ''),
  },
  
  // Business Rules
  business: {
    defaultCreditLimit: parseInt(getEnvVar('VITE_DEFAULT_CREDIT_LIMIT', '5000')),
    commissionRate: parseInt(getEnvVar('VITE_COMMISSION_RATE', '10')),
    sessionTimeoutMinutes: parseInt(getEnvVar('VITE_SESSION_TIMEOUT_MINUTES', '120')),
    maxLoginAttempts: parseInt(getEnvVar('VITE_MAX_LOGIN_ATTEMPTS', '3')),
    passwordMinLength: parseInt(getEnvVar('VITE_PASSWORD_MIN_LENGTH', '8')),
    passwordRequireSpecialChar: getEnvVar('VITE_PASSWORD_REQUIRE_SPECIAL_CHAR', 'true') === 'true',
  },
  
  // Feature Flags
  features: {
    enableMockData: getEnvVar('VITE_ENABLE_MOCK_DATA', 'true') === 'true',
    enableDebugMode: getEnvVar('VITE_ENABLE_DEBUG_MODE', 'false') === 'true',
    enableMarketplace: getEnvVar('VITE_ENABLE_MARKETPLACE', 'true') === 'true',
    enableChat: getEnvVar('VITE_ENABLE_CHAT', 'true') === 'true',
    enable2FA: getEnvVar('VITE_ENABLE_2FA', 'false') === 'true',
  },
  
  // External Services
  external: {
    sentryDsn: getEnvVar('VITE_SENTRY_DSN', ''),
    googleAnalyticsId: getEnvVar('VITE_GA_ID', ''),
    stripePublicKey: getEnvVar('VITE_STRIPE_PUBLIC_KEY', ''),
  },
  
  // Security
  security: {
    encryptionKey: getEnvVar('VITE_ENCRYPTION_KEY', 'default-dev-key-change-in-production'),
    csrfTokenHeader: 'X-CSRF-Token',
    allowedOrigins: getEnvVar('VITE_ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
  },
};

// Validar configuración en producción
if (config.isProduction) {
  const requiredInProduction = [
    'VITE_API_URL',
    'VITE_WS_URL',
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_ENCRYPTION_KEY',
    'VITE_COMPANY_EMAIL',
    'VITE_SUPPORT_EMAIL',
  ];
  
  requiredInProduction.forEach(key => {
    if (!import.meta.env[key]) {
      console.error(`Missing required production environment variable: ${key}`);
    }
  });
}

// Freeze config to prevent mutations
export default Object.freeze(config);