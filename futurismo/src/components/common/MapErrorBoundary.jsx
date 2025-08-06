import React from 'react';
import PropTypes from 'prop-types';
import { MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Logger from '../../utils/logger';

/**
 * MapErrorBoundary - Error boundary específico para componentes de mapa
 * 
 * BENEFICIO: Si el mapa falla, solo afecta al mapa, no a toda la app
 * Ofrece fallback funcional con lista de servicios
 */
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Logger.error('Map Error Boundary:', error, errorInfo);
    
    // Log específico para errores de mapa
    if (import.meta.env.PROD) {
      // TODO: Enviar a servicio de logging con contexto de mapa
      Logger.debug('Map component failed:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        props: this.props
      });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <MapPinIcon className="w-8 h-8 text-yellow-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error en el Mapa
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              El mapa no pudo cargar correctamente. Puedes continuar usando la vista de lista 
              o intentar recargar el mapa.
            </p>

            {/* Botones de acción */}
            <div className="space-y-2">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={this.state.retryCount >= 3}
              >
                <ArrowPathIcon className="w-4 h-4" />
                {this.state.retryCount >= 3 ? 'Máx. intentos alcanzados' : 'Reintentar'}
              </button>
              
              {this.props.onFallbackMode && (
                <button
                  onClick={this.props.onFallbackMode}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Usar Vista de Lista
                </button>
              )}
            </div>

            {/* Información de servicios disponibles */}
            {this.props.servicesCount && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-700">
                  📍 {this.props.servicesCount} servicios disponibles en vista de lista
                </p>
              </div>
            )}

            {/* Error técnico en desarrollo */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                  Detalles técnicos
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

MapErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onFallbackMode: PropTypes.func,
  servicesCount: PropTypes.number
};

export default MapErrorBoundary;