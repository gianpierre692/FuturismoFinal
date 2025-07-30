/**
 * WebSocket Ultra-Resiliente para Tiempo Real
 * 
 * CARACTERÍSTICAS:
 * 1. Reconexión infinita con backoff exponencial
 * 2. Queue de mensajes para modo offline
 * 3. Heartbeat para detectar conexiones zombi
 * 4. Fallback automático a polling
 * 5. Sincronización de estado al reconectar
 * 6. Múltiples URLs de backup
 * 7. Health monitoring en tiempo real
 */

import { io } from 'socket.io-client';
import Logger from '../utils/logger.js';

// Estados de conexión
const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  FAILED: 'failed', // Cuando WebSocket falla completamente
  POLLING: 'polling' // Fallback a HTTP polling
};

// Tipos de eventos
const EVENT_TYPES = {
  CONNECTION_STATE_CHANGED: 'connection:state-changed',
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_QUEUED: 'message:queued',
  HEARTBEAT_FAILED: 'heartbeat:failed',
  FALLBACK_ACTIVATED: 'fallback:activated'
};

class WebSocketResilientService {
  constructor() {
    // Importar configuración centralizada
    import('../utils/config.js').then(({ default: config }) => {
      this.wsUrls = [
        config.WEBSOCKET.PRIMARY_URL,
        config.WEBSOCKET.BACKUP_URL,
        config.WEBSOCKET.FALLBACK_URL
      ];
      this.apiUrl = config.API.BASE_URL;
      this.pollingInterval = config.WEBSOCKET.POLLING_INTERVAL;
    });
    
    // Configuración temporal mientras se carga
    this.wsUrls = [
      import.meta.env.VITE_WS_URL || 'ws://localhost:3006',
      import.meta.env.VITE_WS_BACKUP_URL || 'ws://backup.localhost:3006',
      import.meta.env.VITE_WS_FALLBACK_URL || 'ws://fallback.localhost:3006'
    ];
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3006/api';
    
    // Estado de conexión
    this.currentState = CONNECTION_STATES.DISCONNECTED;
    this.currentUrlIndex = 0;
    this.socket = null;
    this.token = null;
    
    // Reconexión
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = Infinity; // Intentos infinitos
    this.baseReconnectDelay = 1000; // 1 segundo inicial
    this.maxReconnectDelay = 30000; // Máximo 30 segundos
    this.reconnectTimeoutId = null;
    
    // Heartbeat
    this.heartbeatInterval = 30000; // 30 segundos
    this.heartbeatTimeoutId = null;
    this.heartbeatResponseTimeoutId = null;
    this.lastHeartbeatResponse = null;
    this.missedHeartbeats = 0;
    this.maxMissedHeartbeats = 3;
    
    // Queue de mensajes
    this.messageQueue = [];
    this.maxQueueSize = 100;
    
    // Fallback polling
    this.pollingInterval = 5000; // 5 segundos
    this.pollingTimeoutId = null;
    this.isPolling = false;
    
    // Listeners
    this.listeners = new Map();
    
    // Stats para debugging
    this.stats = {
      connectionsAttempted: 0,
      connectionsSuccessful: 0,
      reconnections: 0,
      messagesReceived: 0,
      messagesSent: 0,
      messagesQueued: 0,
      heartbeatsLost: 0,
      fallbackActivations: 0
    };
    
    // Bind methods
    this.handleConnect = this.handleConnect.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleConnectError = this.handleConnectError.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.sendHeartbeat = this.sendHeartbeat.bind(this);
    this.handleHeartbeatResponse = this.handleHeartbeatResponse.bind(this);
    
    // Auto-start en desarrollo si está habilitado
    if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false') {
      this.startMockMode();
    }
  }

  // ===========================================
  // MÉTODOS PÚBLICOS DE CONEXIÓN
  // ===========================================

  async connect(token) {
    this.token = token;
    
    if (this.currentState === CONNECTION_STATES.CONNECTED) {
      console.log('✅ WebSocket ya conectado');
      return;
    }

    Logger.websocket('Iniciando conexión WebSocket resiliente...');
    this.changeState(CONNECTION_STATES.CONNECTING);
    this.stats.connectionsAttempted++;
    
    await this.attemptConnection();
  }

  disconnect() {
    Logger.websocket('Desconectando WebSocket...');
    
    // Limpiar timers
    this.clearAllTimers();
    
    // Cerrar socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Detener polling si está activo
    this.stopPolling();
    
    this.changeState(CONNECTION_STATES.DISCONNECTED);
  }

  // ===========================================
  // SISTEMA DE CONEXIÓN CON FALLBACK
  // ===========================================

  async attemptConnection() {
    const wsUrl = this.wsUrls[this.currentUrlIndex];
    
    Logger.websocket(`Intentando conectar a: ${wsUrl} (intento ${this.reconnectAttempts + 1})`);
    
    try {
      // Crear socket con configuración resiliente
      this.socket = io(wsUrl, {
        auth: { token: this.token },
        transports: ['websocket', 'polling'], // Permitir fallback automático
        timeout: 10000, // 10 segundos timeout
        reconnection: false, // Manejamos la reconexión manualmente
        forceNew: true, // Forzar nueva conexión
        upgrade: true, // Permitir upgrade de polling a websocket
      });

      // Configurar event handlers
      this.setupSocketHandlers();
      
      // Timeout para la conexión
      const connectionTimeout = setTimeout(() => {
        if (this.currentState === CONNECTION_STATES.CONNECTING) {
          console.warn('⏰ Timeout de conexión');
          this.handleConnectionFailure();
        }
      }, 15000); // 15 segundos timeout

      // Esperar a que se conecte
      this.socket.once('connect', () => {
        clearTimeout(connectionTimeout);
        this.handleConnect();
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(connectionTimeout);
        this.handleConnectError(error);
      });

    } catch (error) {
      console.error('❌ Error creando socket:', error);
      this.handleConnectionFailure();
    }
  }

  setupSocketHandlers() {
    if (!this.socket) return;

    // Eventos de conexión
    this.socket.on('connect', this.handleConnect);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('connect_error', this.handleConnectError);
    
    // Eventos de datos en tiempo real
    this.socket.on('tour:location-update', this.handleMessage);
    this.socket.on('tour:status-change', this.handleMessage);
    this.socket.on('guide:status-update', this.handleMessage);
    this.socket.on('emergency:alert', this.handleMessage);
    this.socket.on('notification:new', this.handleMessage);
    
    // Heartbeat
    this.socket.on('heartbeat:response', this.handleHeartbeatResponse);
    
    // Mensajes genéricos
    this.socket.onAny((eventName, ...args) => {
      this.stats.messagesReceived++;
      this.emit(EVENT_TYPES.MESSAGE_RECEIVED, { eventName, args });
    });
  }

  // ===========================================
  // HANDLERS DE EVENTOS DE CONEXIÓN
  // ===========================================

  handleConnect() {
    console.log('✅ WebSocket conectado exitosamente');
    
    this.stats.connectionsSuccessful++;
    this.reconnectAttempts = 0;
    this.currentUrlIndex = 0; // Reset a URL principal
    this.changeState(CONNECTION_STATES.CONNECTED);
    
    // Iniciar heartbeat
    this.startHeartbeat();
    
    // Procesar queue de mensajes
    this.processMessageQueue();
    
    // Solicitar sincronización de estado
    this.requestStateSync();
  }

  handleDisconnect(reason) {
    console.warn(`⚠️ WebSocket desconectado: ${reason}`);
    
    this.clearAllTimers();
    this.changeState(CONNECTION_STATES.RECONNECTING);
    
    // Decidir si reconectar o fallar
    if (reason === 'io server disconnect') {
      // El servidor nos desconectó intencionalmente
      console.log('🚫 Server desconectó - esperando antes de reconectar');
      setTimeout(() => this.scheduleReconnect(), 5000);
    } else {
      // Desconexión inesperada - reconectar inmediatamente
      this.scheduleReconnect();
    }
  }

  handleConnectError(error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    this.handleConnectionFailure();
  }

  handleConnectionFailure() {
    this.reconnectAttempts++;
    
    // Intentar con siguiente URL
    if (this.reconnectAttempts % 3 === 0) {
      this.currentUrlIndex = (this.currentUrlIndex + 1) % this.wsUrls.length;
      console.log(`🔄 Cambiando a URL backup: ${this.wsUrls[this.currentUrlIndex]}`);
    }
    
    // Si fallaron todos los URLs varias veces, activar fallback
    if (this.reconnectAttempts > this.wsUrls.length * 3) {
      console.warn('🚨 WebSocket totalmente fallido - activando fallback polling');
      this.activateFallback();
      return;
    }
    
    this.scheduleReconnect();
  }

  // ===========================================
  // SISTEMA DE RECONEXIÓN EXPONENCIAL
  // ===========================================

  scheduleReconnect() {
    if (this.reconnectTimeoutId) return;
    
    // Backoff exponencial con jitter
    const baseDelay = Math.min(
      this.baseReconnectDelay * Math.pow(2, Math.min(this.reconnectAttempts, 8)),
      this.maxReconnectDelay
    );
    
    // Añadir jitter (±25%)
    const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1);
    const delay = Math.max(1000, baseDelay + jitter);
    
    console.log(`⏱️ Reconectando en ${Math.round(delay / 1000)}s (intento ${this.reconnectAttempts})`);
    
    this.reconnectTimeoutId = setTimeout(() => {
      this.reconnectTimeoutId = null;
      this.attemptConnection();
    }, delay);
  }

  // ===========================================
  // SISTEMA DE HEARTBEAT
  // ===========================================

  startHeartbeat() {
    this.stopHeartbeat(); // Limpiar anterior
    
    this.heartbeatTimeoutId = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatInterval);
    
    // Enviar primer heartbeat inmediatamente
    this.sendHeartbeat();
  }

  stopHeartbeat() {
    if (this.heartbeatTimeoutId) {
      clearInterval(this.heartbeatTimeoutId);
      this.heartbeatTimeoutId = null;
    }
    
    if (this.heartbeatResponseTimeoutId) {
      clearTimeout(this.heartbeatResponseTimeoutId);
      this.heartbeatResponseTimeoutId = null;
    }
  }

  sendHeartbeat() {
    if (!this.socket || this.currentState !== CONNECTION_STATES.CONNECTED) {
      return;
    }
    
    const heartbeatData = {
      timestamp: Date.now(),
      clientId: this.socket.id
    };
    
    this.socket.emit('heartbeat:ping', heartbeatData);
    
    // Timeout para respuesta de heartbeat
    this.heartbeatResponseTimeoutId = setTimeout(() => {
      this.handleHeartbeatTimeout();
    }, 10000); // 10 segundos para responder
  }

  handleHeartbeatResponse(data) {
    if (this.heartbeatResponseTimeoutId) {
      clearTimeout(this.heartbeatResponseTimeoutId);
      this.heartbeatResponseTimeoutId = null;
    }
    
    this.lastHeartbeatResponse = Date.now();
    this.missedHeartbeats = 0;
    
    // Calcular latencia
    const latency = Date.now() - data.timestamp;
    this.emit('heartbeat:success', { latency, timestamp: data.timestamp });
  }

  handleHeartbeatTimeout() {
    this.missedHeartbeats++;
    this.stats.heartbeatsLost++;
    
    console.warn(`💔 Heartbeat perdido (${this.missedHeartbeats}/${this.maxMissedHeartbeats})`);
    
    if (this.missedHeartbeats >= this.maxMissedHeartbeats) {
      console.error('💀 Demasiados heartbeats perdidos - reconectando');
      this.emit(EVENT_TYPES.HEARTBEAT_FAILED);
      
      // Forzar reconexión
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  }

  // ===========================================
  // QUEUE DE MENSAJES OFFLINE
  // ===========================================

  queueMessage(eventName, data) {
    if (this.messageQueue.length >= this.maxQueueSize) {
      // Remover mensaje más antiguo
      this.messageQueue.shift();
    }
    
    const queuedMessage = {
      id: Date.now().toString(),
      eventName,
      data,
      timestamp: new Date().toISOString(),
      attempts: 0
    };
    
    this.messageQueue.push(queuedMessage);
    this.stats.messagesQueued++;
    
    this.emit(EVENT_TYPES.MESSAGE_QUEUED, queuedMessage);
  }

  processMessageQueue() {
    if (this.messageQueue.length === 0) return;
    
    console.log(`📤 Procesando ${this.messageQueue.length} mensajes en queue`);
    
    const messagesToProcess = [...this.messageQueue];
    this.messageQueue = [];
    
    messagesToProcess.forEach(message => {
      this.emit(message.eventName, message.data);
      this.stats.messagesSent++;
    });
  }

  // ===========================================
  // FALLBACK A HTTP POLLING
  // ===========================================

  activateFallback() {
    this.stats.fallbackActivations++;
    this.changeState(CONNECTION_STATES.POLLING);
    this.startPolling();
    
    this.emit(EVENT_TYPES.FALLBACK_ACTIVATED, {
      reason: 'WebSocket failed after multiple attempts',
      pollingInterval: this.pollingInterval
    });
  }

  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    console.log('🔄 Iniciando HTTP polling fallback');
    
    const poll = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/realtime/updates`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.handlePollingData(data);
        }
      } catch (error) {
        console.error('❌ Error en polling:', error);
      }
      
      if (this.isPolling) {
        this.pollingTimeoutId = setTimeout(poll, this.pollingInterval);
      }
    };
    
    poll();
  }

  stopPolling() {
    this.isPolling = false;
    
    if (this.pollingTimeoutId) {
      clearTimeout(this.pollingTimeoutId);
      this.pollingTimeoutId = null;
    }
  }

  handlePollingData(data) {
    // Simular eventos WebSocket desde polling
    if (data.tours) {
      data.tours.forEach(tour => {
        this.emit('tour:location-update', tour);
      });
    }
    
    if (data.notifications) {
      data.notifications.forEach(notification => {
        this.emit('notification:new', notification);
      });
    }
  }

  // ===========================================
  // SINCRONIZACIÓN DE ESTADO
  // ===========================================

  requestStateSync() {
    if (this.currentState !== CONNECTION_STATES.CONNECTED) return;
    
    console.log('🔄 Solicitando sincronización de estado...');
    
    this.socket.emit('state:sync-request', {
      timestamp: Date.now(),
      lastSync: localStorage.getItem('lastSync') || null
    });
  }

  // ===========================================
  // MÉTODOS DE COMUNICACIÓN
  // ===========================================

  emit(eventName, data) {
    const listeners = this.listeners.get(eventName) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error en listener de ${eventName}:`, error);
      }
    });
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    
    this.listeners.get(eventName).push(callback);
    
    // Retornar función para desuscribir
    return () => {
      const listeners = this.listeners.get(eventName) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  send(eventName, data) {
    if (this.currentState === CONNECTION_STATES.CONNECTED && this.socket) {
      this.socket.emit(eventName, data);
      this.stats.messagesSent++;
    } else {
      // Encolar mensaje para enviar cuando se reconecte
      this.queueMessage(eventName, data);
    }
  }

  // ===========================================
  // GESTIÓN DE ESTADO
  // ===========================================

  changeState(newState) {
    const oldState = this.currentState;
    this.currentState = newState;
    
    console.log(`🔄 Estado WebSocket: ${oldState} → ${newState}`);
    
    this.emit(EVENT_TYPES.CONNECTION_STATE_CHANGED, {
      oldState,
      newState,
      timestamp: new Date().toISOString()
    });
  }

  getState() {
    return {
      connectionState: this.currentState,
      reconnectAttempts: this.reconnectAttempts,
      currentUrl: this.wsUrls[this.currentUrlIndex],
      queueLength: this.messageQueue.length,
      lastHeartbeat: this.lastHeartbeatResponse,
      isPolling: this.isPolling,
      stats: { ...this.stats }
    };
  }

  // ===========================================
  // CLEANUP Y UTILIDADES
  // ===========================================

  clearAllTimers() {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    
    this.stopHeartbeat();
    this.stopPolling();
  }

  handleMessage(data) {
    this.stats.messagesReceived++;
    // Los mensajes se propagan automáticamente a través del sistema onAny
  }

  // ===========================================
  // MODO MOCK PARA DESARROLLO
  // ===========================================

  startMockMode() {
    console.log('🎭 WebSocket en modo MOCK para desarrollo');
    
    this.changeState(CONNECTION_STATES.CONNECTED);
    
    // Simular datos en tiempo real
    setInterval(() => {
      this.emit('tour:location-update', {
        tourId: 'TOUR001',
        location: {
          lat: -13.5319 + (Math.random() - 0.5) * 0.01,
          lng: -71.9675 + (Math.random() - 0.5) * 0.01
        },
        timestamp: new Date().toISOString()
      });
    }, 5000);
    
    // Simular notificaciones
    setTimeout(() => {
      this.emit('notification:new', {
        type: 'info',
        title: 'Tour actualizado',
        message: 'El tour TOUR001 ha actualizado su ubicación',
        timestamp: new Date().toISOString()
      });
    }, 10000);
  }
}

// Singleton instance
const webSocketResilientService = new WebSocketResilientService();

export default webSocketResilientService;
export { CONNECTION_STATES, EVENT_TYPES };