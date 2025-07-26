import { Suspense, memo } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';

/**
 * LazyWrapper - Wrapper para componentes lazy con loading states personalizados
 * 
 * BENEFICIO: Mejor UX durante carga, fallbacks consistentes, menor bundle inicial
 * Carga solo cuando se necesita
 */
const LazyWrapper = memo(({ 
  children, 
  fallback, 
  error,
  minHeight = 'min-h-[200px]',
  showDescription = false,
  description = 'Cargando componente...'
}) => {
  // Fallback personalizado o por defecto
  const defaultFallback = (
    <div className={`w-full ${minHeight} flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200`}>
      <div className="text-center">
        <LoadingSpinner size="medium" />
        {showDescription && (
          <p className="mt-3 text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className={`w-full ${minHeight} flex items-center justify-center bg-red-50 rounded-lg border border-red-200`}>
        <div className="text-center p-6">
          <div className="text-red-400 mb-2">⚠️</div>
          <p className="text-sm text-red-700">Error cargando componente</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs text-red-600 underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
});

LazyWrapper.displayName = 'LazyWrapper';

LazyWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  error: PropTypes.bool,
  minHeight: PropTypes.string,
  showDescription: PropTypes.bool,
  description: PropTypes.string
};

export default LazyWrapper;