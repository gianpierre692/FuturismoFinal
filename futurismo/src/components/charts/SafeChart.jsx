import { useState, useEffect } from 'react';
import ChartErrorBoundary from './ChartErrorBoundary';

// Componente wrapper para manejar errores de Recharts con Vite
export const SafeChart = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Dar tiempo para que React y Recharts se monten completamente
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Cargando gráfico...</p>
        </div>
      </div>
    );
  }

  return (
    <ChartErrorBoundary>
      <div className="w-full h-full">
        {children}
      </div>
    </ChartErrorBoundary>
  );
};

export default SafeChart;