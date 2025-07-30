import { useState, useEffect } from 'react';

// Componente wrapper para manejar errores de Recharts con Vite
export const SafeChart = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Cargando gráfico...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SafeChart;