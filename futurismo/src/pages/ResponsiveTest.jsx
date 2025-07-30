import { useState, useEffect } from 'react';

const ResponsiveTest = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDeviceType = () => {
    if (windowSize.width < 640) return 'Mobile XS';
    if (windowSize.width < 768) return 'Mobile SM';
    if (windowSize.width < 1024) return 'Tablet MD';
    if (windowSize.width < 1280) return 'Desktop LG';
    return 'Desktop XL';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Test de Responsive</h1>
      
      {/* Info del dispositivo */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Información del Dispositivo</h2>
        <div className="space-y-2">
          <p><strong>Ancho:</strong> {windowSize.width}px</p>
          <p><strong>Alto:</strong> {windowSize.height}px</p>
          <p><strong>Tipo:</strong> {getDeviceType()}</p>
          <p><strong>Es móvil:</strong> {windowSize.width < 768 ? 'Sí' : 'No'}</p>
        </div>
      </div>

      {/* Test de Grid Responsive */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Grid Responsive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{i}</div>
                <p className="text-sm text-gray-600 mt-2">Tarjeta {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test de visibilidad */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Visibilidad por Breakpoint</h2>
        <div className="space-y-2">
          <div className="block sm:hidden bg-red-100 p-4 rounded">
            Visible solo en móvil (&lt; 640px)
          </div>
          <div className="hidden sm:block md:hidden bg-yellow-100 p-4 rounded">
            Visible solo en SM (640px - 767px)
          </div>
          <div className="hidden md:block lg:hidden bg-green-100 p-4 rounded">
            Visible solo en MD/Tablet (768px - 1023px)
          </div>
          <div className="hidden lg:block xl:hidden bg-blue-100 p-4 rounded">
            Visible solo en LG (1024px - 1279px)
          </div>
          <div className="hidden xl:block bg-purple-100 p-4 rounded">
            Visible solo en XL (≥ 1280px)
          </div>
        </div>
      </div>

      {/* Test de navegación */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Estado de Navegación</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="mb-2">
            <strong>Sidebar Desktop:</strong> 
            <span className="ml-2 inline-block lg:hidden text-red-600">No debería verse</span>
            <span className="ml-2 hidden lg:inline-block text-green-600">Debería verse</span>
          </p>
          <p className="mb-2">
            <strong>Header Móvil:</strong> 
            <span className="ml-2 inline-block md:hidden text-green-600">Debería verse</span>
            <span className="ml-2 hidden md:inline-block text-red-600">No debería verse</span>
          </p>
          <p>
            <strong>Bottom Navigation:</strong> 
            <span className="ml-2 inline-block md:hidden text-green-600">Debería verse (si eres guía)</span>
            <span className="ml-2 hidden md:inline-block text-red-600">No debería verse</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest;