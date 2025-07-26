import React from 'react';
import PropTypes from 'prop-types';
import { HomeIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

/**
 * RouteErrorBoundary - Error boundary para páginas/rutas completas
 * 
 * BENEFICIO: Si una página falla, permite navegar a otras secciones
 * Evita que toda la app se rompa por error en una sola página
 */
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    const errorId = Date.now().toString();
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route Error Boundary:', error, errorInfo);
    
    // Log específico para errores de ruta/página
    const errorReport = {
      errorId: this.state.errorId,
      route: window.location.pathname,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      routeName: this.props.routeName
    };

    if (import.meta.env.PROD) {
      // TODO: Enviar a servicio de logging
      console.log('Route failed:', errorReport);
    }

    // Guardar reporte para análisis
    try {
      const reports = JSON.parse(localStorage.getItem('error_reports') || '[]');
      reports.push(errorReport);
      // Mantener solo los últimos 10 reportes
      if (reports.length > 10) reports.shift();
      localStorage.setItem('error_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('No se pudo guardar reporte de error:', e);
    }
  }

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleRetry = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full">
            <div className="bg-white shadow-xl rounded-lg p-8 text-center">
              {/* Icono de error */}
              <div className="mx-auto flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
              </div>
              
              {/* Título y descripción */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Oops! Página no disponible
              </h1>
              
              <p className="text-gray-600 mb-2">
                La página "{this.props.routeName || 'actual'}" encontró un problema inesperado.
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                ID del error: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{this.state.errorId}</code>
              </p>

              {/* Acciones principales */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <HomeIcon className="w-5 h-5" />
                  Ir al Dashboard
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={this.handleGoBack}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    ← Volver
                  </button>
                  
                  <button
                    onClick={this.handleRetry}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    Reintentar
                  </button>
                </div>
              </div>

              {/* Enlaces de navegación alternativos */}
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 mb-3">O navegar a:</p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <a href="/monitoring" className="text-blue-600 hover:underline">Monitoreo</a>
                  <span className="text-gray-300">•</span>
                  <a href="/reservations" className="text-blue-600 hover:underline">Reservas</a>
                  <span className="text-gray-300">•</span>
                  <a href="/profile" className="text-blue-600 hover:underline">Perfil</a>
                  <span className="text-gray-300">•</span>
                  <a href="/chat" className="text-blue-600 hover:underline">Chat</a>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  💡 ¿Qué puedes hacer?
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Prueba recargar la página</li>
                  <li>• Navega a otra sección y regresa más tarde</li>
                  <li>• Si el problema persiste, contacta al administrador</li>
                </ul>
              </div>

              {/* Detalles técnicos en desarrollo */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 font-medium">
                    🔧 Información técnica (desarrollo)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded">
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Ruta:</strong> {window.location.pathname}
                    </p>
                    <pre className="text-xs overflow-auto max-h-32 text-red-600">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

RouteErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  routeName: PropTypes.string
};

export default RouteErrorBoundary;