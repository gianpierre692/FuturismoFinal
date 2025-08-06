import { useEffect, useRef, useState } from 'react';
import { MapPinIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import Logger from '../../utils/logger';

const LiveMapFixed = ({ 
  services = [], 
  height = '600px',
  selectedService,
  onServiceSelect,
  showSidebar = true,
  filterStatus = 'all' 
}) => {
  // Datos mock si no hay servicios
  const mockServices = [
    {
      id: 'SRV001',
      code: 'LIMA-001',
      destination: 'Lima Histórica',
      guide: { name: 'Carlos Mendoza' },
      tourists: 8,
      status: 'en_curso',
      currentLocation: [-12.0464, -77.0428], // Lima Centro
      startTime: '09:00'
    },
    {
      id: 'SRV002', 
      code: 'BRNC-002',
      destination: 'Barranco Bohemio',
      guide: { name: 'Ana García' },
      tourists: 6,
      status: 'pausado',
      currentLocation: [-12.1506, -77.0217], // Barranco
      startTime: '14:00'
    },
    {
      id: 'SRV003',
      code: 'MIRA-003', 
      destination: 'Miraflores Tour',
      guide: { name: 'Luis Torres' },
      tourists: 12,
      status: 'en_curso',
      currentLocation: [-12.1192, -77.0285], // Miraflores
      startTime: '10:30'
    }
  ];

  const servicesToUse = services.length > 0 ? services : mockServices;
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Filtrar servicios
  const filteredServices = servicesToUse.filter(service => {
    if (filterStatus === 'all') return true;
    return service.status === filterStatus;
  });

  // Colores por estado
  const getStatusColor = (status) => {
    switch(status) {
      case 'en_curso': return '#10B981';
      case 'pausado': return '#F59E0B';
      case 'finalizado': return '#6B7280';
      default: return '#3B82F6';
    }
  };

  // Inicializar mapa
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      // Verificar si Leaflet está disponible
      if (!window.L) {
        // Cargar CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Cargar JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        
        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      // Crear mapa solo si el componente sigue montado
      if (!isMounted || !mapContainerRef.current) return;

      // Verificar si ya existe un mapa
      if (mapContainerRef.current._leaflet_id) {
        return;
      }

      try {
        // Crear el mapa centrado en Lima
        const map = window.L.map(mapContainerRef.current).setView([-12.0464, -77.0428], 12);
        
        // Agregar tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsMapReady(true);
      } catch (error) {
        Logger.error('Error al inicializar el mapa:', error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      isMounted = false;
      
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          Logger.warn('Error al limpiar el mapa:', error);
        }
      }
      
      // Limpiar el ID de Leaflet del contenedor
      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }
    };
  }, []);

  // Actualizar marcadores
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        Logger.warn('Error al remover marcador:', error);
      }
    });
    markersRef.current = [];

    // Agregar nuevos marcadores
    filteredServices.forEach((service, index) => {
      if (!service.currentLocation || service.currentLocation.length !== 2) return;

      const [lat, lng] = service.currentLocation;
      const color = getStatusColor(service.status);

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
            <strong>Destino:</strong> ${service.destination}<br>
            <strong>Turistas:</strong> ${service.tourists || 0}<br>
            <strong>Estado:</strong> ${service.status}
          </div>
        `);

      if (onServiceSelect) {
        marker.on('click', () => onServiceSelect(service));
      }

      markersRef.current.push(marker);
    });
  }, [filteredServices, isMapReady, onServiceSelect]);

  return (
    <div className="flex gap-4 h-full">
      {/* Mapa */}
      <div className={`flex-1 bg-white rounded-lg shadow-md overflow-hidden`} style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-96 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Servicios Activos</h3>
          
          <div className="space-y-3">
            {filteredServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay servicios activos
              </p>
            ) : (
              filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedService?.id === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onServiceSelect && onServiceSelect(service)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: getStatusColor(service.status) }}
                        >
                          {index + 1}
                        </div>
                        <h4 className="font-medium text-sm">{service.code}</h4>
                      </div>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <UserGroupIcon className="w-3 h-3" />
                          <span>{service.guide?.name || 'Sin guía'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{service.destination}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <ClockIcon className="w-3 h-3" />
                          <span>{service.startTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{service.tourists}</span>
                      <p className="text-xs text-gray-500">turistas</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMapFixed;