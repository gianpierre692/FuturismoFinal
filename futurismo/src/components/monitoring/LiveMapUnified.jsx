import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { MapPinIcon, UserGroupIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';
import { formatters } from '../../utils/formatters';
import { getDestination } from '../../data/destinations';

// Componente unificado que puede funcionar en 3 modos:
// 1. 'simple' - Sin librerías externas, mapa simulado
// 2. 'cdn' - Carga Leaflet desde CDN
// 3. 'npm' - Usa React Leaflet (requiere instalación)

const LiveMapUnified = memo(({ 
  mode = 'cdn', 
  filters = {}, 
  onServiceSelect,
  updateInterval = 30000, // 30 segundos por defecto
  showSidebar = true,
  height = 'h-[600px]'
}) => {
  const { activeServices, setServices, initializeMockData } = useServicesStore();
  const [selectedService, setSelectedService] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter] = useState([-13.5169, -71.9788]); // Plaza de Armas Cusco
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapId = useRef(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Inicializar datos mock si es necesario (solo una vez)
  useEffect(() => {
    console.log('LiveMapUnified - activeServices:', activeServices.length);
    if (activeServices.length === 0) {
      console.log('Inicializando datos mock...');
      initializeMockData();
    }
  }, []); // Solo ejecutar una vez al montar

  // Filtrar servicios según filtros
  const filteredServices = activeServices.filter(service => {
    if (filters.status && service.status !== filters.status) return false;
    if (filters.search && !service.code.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Actualización automática de posiciones (solo para el mapa)
  useEffect(() => {
    const interval = setInterval(() => {
      // En un caso real, aquí recibiríamos actualizaciones del backend
      // Por ahora solo actualizamos el timestamp para simular actividad
      if (activeServices.length > 0 && mode !== 'simple') {
        // Actualizamos solo el lastUpdate para evitar modificar la estructura de datos
        const randomService = activeServices[Math.floor(Math.random() * activeServices.length)];
        if (randomService && randomService.guideLocation) {
          // Simulamos pequeño movimiento solo para visualización en el mapa
          // sin afectar el currentLocation que es un string
          setSelectedService(prev => {
            if (prev && prev.id === randomService.id) {
              return { ...prev, lastUpdate: new Date().toISOString() };
            }
            return prev;
          });
        }
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [activeServices.length, updateInterval, mode]);

  // Función para manejar selección de servicio
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    onServiceSelect?.(service);
  };

  // Renderizar según el modo
  const renderMap = () => {
    switch (mode) {
      case 'simple':
        return <SimpleMap />;
      case 'cdn':
        return <CDNMap />;
      case 'npm':
        return <NPMMap />;
      default:
        return <SimpleMap />;
    }
  };

  // Componente de mapa simple (sin dependencias)
  const SimpleMap = () => (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1 p-4">
        {filteredServices.map((service, index) => {
          const gridPosition = {
            left: `${10 + (index % 8) * 12}%`,
            top: `${10 + Math.floor(index / 8) * 12}%`
          };

          return (
            <div
              key={service.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={gridPosition}
              onClick={() => handleServiceSelect(service)}
              title={`${service.code} - ${service.guide?.name || 'Sin guía'}`}
            >
              <div className={`w-4 h-4 rounded-full animate-pulse ${
                service.status === 'en_curso' ? 'bg-green-500' :
                service.status === 'programado' ? 'bg-blue-500' :
                service.status === 'pausado' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-50">
                {service.code}
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded shadow-md text-sm">
        Mapa Simulado
      </div>
    </div>
  );

  // Componente de mapa con CDN
  const CDNMap = () => {
    const mapInstanceRef = useRef(null);
    
    useEffect(() => {
      // Cargar Leaflet desde CDN si no está cargado
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          setIsMapLoaded(true);
          if (mapRef.current && !mapInstanceRef.current) {
            initializeLeafletMap();
          }
        };
        document.head.appendChild(script);

        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          }
          markersRef.current = [];
        };
      } else {
        setIsMapLoaded(true);
        if (mapRef.current && !mapInstanceRef.current) {
          initializeLeafletMap();
        }
      }
      
      return () => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          } catch (error) {
            console.warn('Error al limpiar el mapa:', error);
          }
        }
        markersRef.current = [];
        
        // Limpiar el ID de Leaflet
        if (mapRef.current && mapRef.current._leaflet_id) {
          delete mapRef.current._leaflet_id;
        }
      };
    }, []);

    const initializeLeafletMap = (retryCount = 0) => {
      if (!mapRef.current || !window.L) return;

      // Si ya existe una instancia, no crear otra
      if (mapInstanceRef.current) return;

      // Verificar que el contenedor tenga dimensiones
      const rect = mapRef.current.getBoundingClientRect();
      if ((rect.width === 0 || rect.height === 0) && retryCount < 10) {
        console.log(`Contenedor sin dimensiones (${rect.width}x${rect.height}), reintento ${retryCount + 1}/10`);
        setTimeout(() => initializeLeafletMap(retryCount + 1), 200);
        return;
      }

      // Si después de 10 intentos no tiene dimensiones, forzar inicialización
      if (rect.width === 0 || rect.height === 0) {
        console.warn('Forzando inicialización del mapa sin dimensiones detectadas');
      }

      // Limpiar cualquier inicialización previa del contenedor
      if (mapRef.current._leaflet_id) {
        delete mapRef.current._leaflet_id;
      }

      try {
        const map = window.L.map(mapRef.current).setView(mapCenter, 13);
        mapInstanceRef.current = map;
      
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        console.log('Mapa inicializado correctamente');
        setIsMapLoaded(true);
        
        // Invalidar el tamaño del mapa después de un pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
        
        updateMarkers();
      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        // Limpiar referencias en caso de error
        mapInstanceRef.current = null;
        if (mapRef.current && mapRef.current._leaflet_id) {
          delete mapRef.current._leaflet_id;
        }
      }
    };

    const updateMarkers = () => {
      if (!mapInstanceRef.current) return;

      // Limpiar marcadores existentes
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Agregar marcadores con coordenadas reales
      filteredServices.forEach((service, index) => {
        // Usar las coordenadas reales del servicio
        const coordinates = service.currentLocation;
        if (!coordinates || coordinates.length !== 2) return;
        
        const [lat, lng] = coordinates;
        const destination = getDestination(service.destination);
        
        // Color según estado
        const color = service.status === 'en_curso' ? '#10B981' : 
                     service.status === 'pausado' ? '#F59E0B' : '#6366F1';
        
        // Icono personalizado
        const icon = window.L.divIcon({
          html: `<div style="background-color: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${index + 1}</div>`,
          className: 'custom-div-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        const marker = window.L.marker([lat, lng], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="min-width: 200px;">
              <b>${service.code}</b><br>
              <strong>Guía:</strong> ${service.guide?.name || 'Sin guía'}<br>
              <strong>Destino:</strong> ${destination?.name || service.destination}<br>
              <strong>Ciudad:</strong> ${destination?.city || 'Cusco'}, ${destination?.region || 'Cusco'}<br>
              <strong>Turistas:</strong> ${service.tourists || 0}<br>
              <strong>Estado:</strong> ${service.status}<br>
              <strong>Hora inicio:</strong> ${service.startTime}
            </div>
          `)
          .on('click', () => handleServiceSelect(service));
        
        markersRef.current.push(marker);
      });
    };

    // useEffect para actualizar marcadores cuando cambian los servicios
    useEffect(() => {
      if (isMapLoaded && mapInstanceRef.current) {
        updateMarkers();
      }
    }, [filteredServices, isMapLoaded]);

    // useEffect para manejar cambios de tamaño
    useEffect(() => {
      const handleResize = () => {
        if (mapInstanceRef.current) {
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          }, 100);
        }
      };

      // Observar cambios en el contenedor
      const resizeObserver = new ResizeObserver(handleResize);
      if (mapRef.current) {
        resizeObserver.observe(mapRef.current);
      }

      // También escuchar eventos de resize de la ventana
      window.addEventListener('resize', handleResize);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    }, [isMapLoaded]);

    return (
      <div className="w-full h-full relative">
        <div 
          id={mapId.current} 
          ref={mapRef} 
          className="w-full h-full rounded-lg" 
          style={{ 
            minHeight: '500px',
            backgroundColor: '#f0f0f0' 
          }}
        />
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Componente de mapa con NPM (React Leaflet)
  const NPMMap = () => {
    // Este requeriría importar React Leaflet
    // Por ahora retornamos el modo simple como fallback
    console.warn('Modo NPM requiere instalar react-leaflet. Usando modo simple como fallback.');
    return <SimpleMap />;
  };

  // Estados por color para la leyenda
  const statusColors = [
    { status: 'en_curso', label: 'En Curso', color: 'bg-green-500' },
    { status: 'programado', label: 'Programado', color: 'bg-blue-500' },
    { status: 'pausado', label: 'Pausado', color: 'bg-yellow-500' },
    { status: 'finalizado', label: 'Finalizado', color: 'bg-gray-500' }
  ];

  return (
    <div className="flex gap-4 h-full w-full">
      {/* Mapa */}
      <div className={`flex-1 h-full bg-white rounded-lg shadow-md overflow-hidden relative`}>
        {renderMap()}
      </div>

      {/* Sidebar con servicios activos */}
      {showSidebar && (
        <div className="w-80 bg-white rounded-lg shadow-md p-4 overflow-y-auto flex-shrink-0">
          <h3 className="text-lg font-semibold mb-4">Servicios Activos</h3>
          
          {/* Leyenda */}
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {statusColors.map(({ status, label, color }) => (
              <div key={status} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Lista de servicios */}
          <div className="space-y-3">
            {filteredServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay servicios activos en este momento
              </p>
            ) : (
              filteredServices.map(service => (
                <div
                  key={service.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{service.code}</h4>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <UserGroupIcon className="w-3 h-3" />
                          <span>{service.guide?.name || 'Sin guía'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{service.currentLocation || 'En ruta'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <ClockIcon className="w-3 h-3" />
                          <span>{service.startTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      statusColors.find(s => s.status === service.status)?.color || 'bg-gray-500'
                    }`} />
                  </div>

                  {selectedService?.id === service.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="space-y-1 text-xs">
                        <p><strong>Cliente:</strong> {service.client?.name || 'N/A'}</p>
                        <p><strong>Destino:</strong> {service.destination || 'N/A'}</p>
                        {service.guide?.phone && (
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="w-3 h-3" />
                            <a href={`tel:${service.guide.phone}`} className="text-blue-600 hover:underline">
                              {service.guide.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

LiveMapUnified.displayName = 'LiveMapUnified';

LiveMapUnified.propTypes = {
  mode: PropTypes.oneOf(['simple', 'cdn', 'npm']),
  filters: PropTypes.shape({
    status: PropTypes.string,
    search: PropTypes.string,
  }),
  onServiceSelect: PropTypes.func,
  updateInterval: PropTypes.number,
  showSidebar: PropTypes.bool,
  height: PropTypes.string,
};

export default LiveMapUnified;