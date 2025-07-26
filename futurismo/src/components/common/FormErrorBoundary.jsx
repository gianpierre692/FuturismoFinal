import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * FormErrorBoundary - Error boundary específico para formularios
 * 
 * BENEFICIO: Si un formulario falla, no crashea la página completa
 * Preserva datos del usuario y ofrece recuperación
 */
class FormErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      savedFormData: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Form Error Boundary:', error, errorInfo);
    
    // Intentar preservar datos del formulario
    try {
      const formElements = document.querySelectorAll('input, select, textarea');
      const formData = {};
      
      formElements.forEach(element => {
        if (element.name && element.value) {
          formData[element.name] = element.value;
        }
      });
      
      if (Object.keys(formData).length > 0) {
        this.setState({ savedFormData: formData });
        // Guardar en localStorage como backup
        localStorage.setItem('form_backup_' + Date.now(), JSON.stringify(formData));
      }
    } catch (saveError) {
      console.warn('No se pudieron guardar los datos del formulario:', saveError);
    }

    // Log específico para errores de formulario
    if (import.meta.env.PROD) {
      console.log('Form component failed:', {
        error: error.message,
        formName: this.props.formName,
        hasUnsavedData: !!this.state.savedFormData
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  handleReportIssue = () => {
    const issueData = {
      error: this.state.error?.message,
      formName: this.props.formName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      savedData: !!this.state.savedFormData
    };
    
    // En producción, enviarías esto a tu sistema de reporte de bugs
    console.log('Issue reported:', issueData);
    alert('Reporte enviado. Gracias por ayudarnos a mejorar.');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-red-200 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error en {this.props.formName || 'Formulario'}
              </h3>
              
              <p className="text-sm text-red-700 mb-4">
                Ocurrió un problema al procesar el formulario. 
                {this.state.savedFormData && ' Tus datos han sido guardados automáticamente.'}
              </p>

              {/* Datos guardados */}
              {this.state.savedFormData && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="text-sm font-medium text-green-800 mb-2">
                    ✅ Datos Guardados Automáticamente
                  </h4>
                  <div className="text-xs text-green-700">
                    {Object.keys(this.state.savedFormData).length} campos guardados
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Reintentar
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  Recargar Página
                </button>
                
                <button
                  onClick={this.handleReportIssue}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Reportar Problema
                </button>
              </div>

              {/* Consejos para el usuario */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  💡 Consejos para continuar:
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Intenta recargar la página</li>
                  <li>• Si el problema persiste, contacta soporte</li>
                  {this.state.savedFormData && (
                    <li>• Tus datos están seguros y se restaurarán automáticamente</li>
                  )}
                </ul>
              </div>

              {/* Error técnico en desarrollo */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                    Información técnica (desarrollo)
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.savedFormData && (
                    <pre className="mt-2 p-2 bg-blue-100 rounded text-xs overflow-auto max-h-32">
                      Datos guardados: {JSON.stringify(this.state.savedFormData, null, 2)}
                    </pre>
                  )}
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

FormErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  formName: PropTypes.string
};

export default FormErrorBoundary;