import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    // Aquí podrías enviar el error a un servicio de logging
    if (import.meta.env.PROD) {
      // TODO: Integrar con servicio de logging (Sentry, LogRocket, etc.)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-center text-gray-900">
              Algo salió mal
            </h1>
            <p className="mt-2 text-sm text-center text-gray-600">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 p-4 bg-gray-100 rounded text-xs">
                <summary className="cursor-pointer font-medium">
                  Detalles del error (solo desarrollo)
                </summary>
                <pre className="mt-2 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;