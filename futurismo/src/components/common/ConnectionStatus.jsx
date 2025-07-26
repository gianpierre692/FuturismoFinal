import { useState, useEffect } from 'react';
import { 
  WifiIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import webSocketResilientService, { CONNECTION_STATES, EVENT_TYPES } from '../../services/websocketResilient';

const ConnectionStatus = () => {
  const [connectionState, setConnectionState] = useState(webSocketResilientService.getState());
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(webSocketResilientService.stats);

  useEffect(() => {
    // Escuchar cambios de estado
    const unsubscribeState = webSocketResilientService.on(
      EVENT_TYPES.CONNECTION_STATE_CHANGED, 
      (data) => {
        setConnectionState(webSocketResilientService.getState());
        
        // Mostrar indicador cuando hay problemas
        const problemStates = [
          CONNECTION_STATES.RECONNECTING, 
          CONNECTION_STATES.FAILED, 
          CONNECTION_STATES.POLLING
        ];
        
        setIsVisible(problemStates.includes(data.newState));
      }
    );

    // Actualizar stats periódicamente
    const statsInterval = setInterval(() => {
      setStats({ ...webSocketResilientService.stats });
    }, 5000);

    // Estado inicial
    setConnectionState(webSocketResilientService.getState());

    return () => {
      unsubscribeState();
      clearInterval(statsInterval);
    };
  }, []);

  const getStatusConfig = () => {
    switch (connectionState.connectionState) {
      case CONNECTION_STATES.CONNECTED:
        return {
          icon: CheckCircleIcon,
          color: 'text-green-500 bg-green-50 border-green-200',
          text: 'Conectado',
          description: 'Tiempo real activo'
        };
      
      case CONNECTION_STATES.CONNECTING:
        return {
          icon: ArrowPathIcon,
          color: 'text-blue-500 bg-blue-50 border-blue-200',
          text: 'Conectando...',
          description: 'Estableciendo conexión'
        };
      
      case CONNECTION_STATES.RECONNECTING:
        return {
          icon: ArrowPathIcon,
          color: 'text-yellow-500 bg-yellow-50 border-yellow-200',
          text: 'Reconectando',
          description: `Intento ${connectionState.reconnectAttempts}`
        };
      
      case CONNECTION_STATES.POLLING:
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-orange-500 bg-orange-50 border-orange-200',
          text: 'Modo Respaldo',
          description: 'Usando HTTP polling'
        };
      
      case CONNECTION_STATES.FAILED:
        return {
          icon: XCircleIcon,
          color: 'text-red-500 bg-red-50 border-red-200',
          text: 'Desconectado',
          description: 'Sin conexión en tiempo real'
        };
      
      default:
        return {
          icon: WifiIcon,
          color: 'text-gray-500 bg-gray-50 border-gray-200',
          text: 'Desconocido',
          description: 'Estado desconocido'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  // Solo mostrar si hay problemas o si el usuario hace clic
  if (!isVisible && connectionState.connectionState === CONNECTION_STATES.CONNECTED) {
    return (
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
        title="Estado de conexión"
      >
        <WifiIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`rounded-lg border shadow-lg p-4 max-w-sm ${config.color}`}>
        <div className="flex items-center gap-3">
          <IconComponent className={`w-6 h-6 ${connectionState.connectionState === CONNECTION_STATES.RECONNECTING ? 'animate-spin' : ''}`} />
          <div className="flex-1">
            <div className="font-medium text-sm">{config.text}</div>
            <div className="text-xs opacity-75">{config.description}</div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        {/* Información adicional en modos problemáticos */}
        {connectionState.connectionState !== CONNECTION_STATES.CONNECTED && (
          <div className="mt-3 pt-3 border-t border-current border-opacity-20">
            <div className="text-xs space-y-1">
              {connectionState.queueLength > 0 && (
                <div>📤 {connectionState.queueLength} mensajes en cola</div>
              )}
              {connectionState.isPolling && (
                <div>🔄 Actualizando cada {webSocketResilientService.pollingInterval / 1000}s</div>
              )}
              {connectionState.currentUrl && (
                <div className="truncate opacity-75">
                  🌐 {connectionState.currentUrl.replace('ws://', '').replace('wss://', '')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats para debugging (solo en desarrollo) */}
        {import.meta.env.DEV && isVisible && (
          <details className="mt-3 pt-3 border-t border-current border-opacity-20">
            <summary className="text-xs cursor-pointer opacity-75 hover:opacity-100">
              Stats de desarrollo
            </summary>
            <div className="text-xs mt-2 space-y-1 opacity-75">
              <div>📊 Conexiones: {stats.connectionsSuccessful}/{stats.connectionsAttempted}</div>
              <div>📨 Mensajes: ↓{stats.messagesReceived} ↑{stats.messagesSent}</div>
              <div>📦 En cola: {stats.messagesQueued}</div>
              <div>💔 Heartbeats perdidos: {stats.heartbeatsLost}</div>
              {stats.fallbackActivations > 0 && (
                <div>🔄 Fallbacks: {stats.fallbackActivations}</div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;