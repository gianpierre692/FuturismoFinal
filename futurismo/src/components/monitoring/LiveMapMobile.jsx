import { useState, useEffect, useRef } from 'react';
import { MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';
import { getDestination } from '../../data/destinations';

const LiveMapMobile = ({ showSummary = true }) => {
  const { activeServices, initializeMockData } = useServicesStore();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Inicializar datos mock si es necesario
  useEffect(() => {
    if (activeServices.length === 0) {
      initializeMockData();
    }
  }, [activeServices.length, initializeMockData]);

  useEffect(() => {
    // Cargar Leaflet desde CDN
    if (!window.L) {
      // CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setIsMapLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsMapLoaded(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapRef.current && !mapInstanceRef.current) {
      // Inicializar mapa
      const map = window.L.map(mapRef.current, {
        center: [-13.5169, -71.9788], // Plaza de Armas Cusco
        zoom: 12,
        zoomControl: false // Desactivar controles de zoom para móvil
      });

      mapInstanceRef.current = map;

      // Agregar control de zoom en posición personalizada
      window.L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18
      }).addTo(map);

      // Agregar marcadores
      activeServices.forEach((service, index) => {
        // Usar las coordenadas reales del servicio
        const coordinates = service.currentLocation;
        if (!coordinates || coordinates.length !== 2) return;
        
        const [lat, lng] = coordinates;
        const destination = getDestination(service.destination);
        
        // Color según estado
        const bgColor = service.status === 'en_curso' ? 'bg-green-600' : 
                       service.status === 'pausado' ? 'bg-yellow-600' : 'bg-primary-600';
        
        const icon = window.L.divIcon({
          html: `<div class="${bgColor} text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">${index + 1}</div>`,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        window.L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <p class="font-semibold">${service.code}</p>
              <p class="text-sm">${service.guide?.name || 'Sin guía'}</p>
              <p class="text-xs text-gray-600">📍 ${destination?.name || service.destination}</p>
              <p class="text-xs text-gray-500">🏛️ ${destination?.city || 'Cusco'}, ${destination?.region || 'Cusco'}</p>
              <p class="text-xs text-gray-500">👥 ${service.tourists || 0} turistas</p>
              <p class="text-xs text-gray-400 mt-1">Estado: ${service.status}</p>
            </div>
          `);
      });

      // Ajustar vista para móvil
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [isMapLoaded, activeServices]);

  if (!isMapLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {showSummary && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 pointer-events-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">{activeServices.length}</span>
                <span className="text-xs text-gray-500">tours</span>
              </div>
              <div className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">
                  {activeServices.reduce((sum, s) => sum + (s.tourists || 0), 0)}
                </span>
                <span className="text-xs text-gray-500">turistas</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMapMobile;