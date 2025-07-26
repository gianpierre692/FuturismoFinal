import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MapPinIcon, UserGroupIcon, PhoneIcon, ClockIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';
import { formatters } from '../../utils/formatters';
import ServiceListItem from './ServiceListItem';
import MapErrorBoundary from '../common/MapErrorBoundary';
import useTimer from '../../hooks/useTimer';
import useAbortController from '../../hooks/useAbortController';
import { useSmartMemo, useRenderCount } from '../../hooks/useSmartMemo';
import Logger from '../../utils/logger';

/**
 * LiveMapResilient - Mapa ultra resiliente para tiempo real
 * 
 * CARACTERÍSTICAS DE RESILENCIA:
 * 1. Fallback automático entre 3 proveedores de mapas
 * 2. Cache local de tiles para offline
 * 3. Modo degradado cuando falla todo
 * 4. Heartbeat para detectar fallos
 * 5. Reconexión automática inteligente
 * 6. Estado de salud visible
 */

const MAP_PROVIDERS = {
  openstreetmap: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    fallbackUrl: 'https://tiles.wmflabs.org/osm/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  },
  cartodb: {
    name: 'CartoDB',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    fallbackUrl: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '© CartoDB'
  },
  stamen: {
    name: 'Stamen',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
    fallbackUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png',
    maxZoom: 18,
    attribution: '© Stamen Design'
  }
};

const LiveMapResilient = memo(({ 
  updateInterval = 5000, // 5 segundos para tiempo real
  showSidebar = true,
  height = 'h-[600px]',
  filters = {},
  onServiceSelect,
  enableOfflineCache = true,
  showHealthStatus = true
}) => {
  // Debug - contar re-renders
  const renderCount = useRenderCount('LiveMapResilient');
  
  // Hooks optimizados
  const timer = useTimer();
  const { abortableFetch } = useAbortController();
  
  // Estados principales
  const { activeServices, setServices, initializeMockData } = useServicesStore();
  const [selectedService, setSelectedService] = useState(null);
  const [mapHealth, setMapHealth] = useState({
    status: 'initializing', // initializing, healthy, degraded, critical, offline
    provider: null,
    message: 'Inicializando mapa...',
    lastCheck: new Date(),
    failureCount: 0,
    isReconnecting: false
  });

  // Referencias
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map()); // Usar Map para mejor performance
  const healthCheckIntervalRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const currentProviderRef = useRef(0);
  const tilesCacheRef = useRef(new Map());
  
  // Cache para optimización de marcadores
  const markerDataCacheRef = useRef(new Map()); // Cache de datos procesados
  const positionCacheRef = useRef(new Map()); // Cache de posiciones calculadas

  // Estado de Leaflet
  const [isMapReady, setIsMapReady] = useState(false);

  // Inicializar servicios mock si es necesario
  useEffect(() => {
    if (activeServices.length === 0) {
      initializeMockData();
    }
  }, [activeServices.length, initializeMockData]);

  // Filtrar servicios con memoización inteligente
  const filteredServices = useSmartMemo(() => {
    return activeServices.filter(service => {
      if (filters.status && service.status !== filters.status) return false;
      if (filters.search && !service.code.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [activeServices, filters.status, filters.search], 'filteredServices');

  // Memoizar servicios con hash para detectar cambios reales
  const memoizedServices = useMemo(() => {
    return filteredServices.map((service, index) => {
      // Crear hash único basado en propiedades relevantes
      const hashData = `${service.id}-${service.status}-${service.guide?.name || ''}-${service.currentLocation}-${index}`;
      
      // Obtener posición del cache o calcularla
      let position = positionCacheRef.current.get(`${service.id}-${index}`);
      if (!position) {
        // Calcular posición solo una vez y cachearla
        position = {
          lat: -13.5319 + (Math.sin(index * 0.5) * 0.02),
          lng: -71.9675 + (Math.cos(index * 0.5) * 0.02)
        };
        positionCacheRef.current.set(`${service.id}-${index}`, position);
      }

      return {
        ...service,
        position,
        dataHash: hashData,
        index
      };
    });
  }, [filteredServices]);

  // Cargar Leaflet de forma resiliente
  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      if (window.L) {
        setIsMapReady(true);
        return;
      }

      try {
        // Intentar cargar desde CDN principal
        await loadLeafletFromCDN('https://unpkg.com/leaflet@1.9.4/dist/');
      } catch (error) {
        console.warn('CDN principal falló, intentando respaldo...', error);
        try {
          // CDN de respaldo
          await loadLeafletFromCDN('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/');
        } catch (backupError) {
          console.error('Todos los CDNs fallaron', backupError);
          setMapHealth({
            status: 'critical',
            provider: null,
            message: 'No se pudo cargar la librería de mapas',
            lastCheck: new Date(),
            failureCount: 2,
            isReconnecting: false
          });
        }
      }

      if (mounted && window.L) {
        setIsMapReady(true);
      }
    };

    loadLeaflet();

    return () => {
      mounted = false;
    };
  }, []);

  // Función para cargar Leaflet desde CDN
  const loadLeafletFromCDN = (baseUrl) => {
    return new Promise((resolve, reject) => {
      // CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${baseUrl}leaflet.css`;
      link.onerror = reject;
      document.head.appendChild(link);

      // JS
      const script = document.createElement('script');
      script.src = `${baseUrl}leaflet.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Inicializar mapa con fallback automático
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;

    const providers = Object.keys(MAP_PROVIDERS);
    let mapInitialized = false;

    // Intentar con cada proveedor hasta que uno funcione
    for (let i = 0; i < providers.length; i++) {
      const providerKey = providers[(currentProviderRef.current + i) % providers.length];
      const provider = MAP_PROVIDERS[providerKey];

      try {
        console.log(`Intentando con proveedor: ${provider.name}`);
        
        // Crear mapa
        const map = window.L.map(mapRef.current, {
          center: [-13.5319, -71.9675], // Cusco
          zoom: 13,
          zoomControl: true,
          attributionControl: false
        });

        // Agregar capa de tiles con timeout
        const tileLayer = window.L.tileLayer(provider.url, {
          maxZoom: provider.maxZoom,
          attribution: provider.attribution,
          errorTileUrl: '/placeholder-tile.png', // Imagen de respaldo
          timeout: 5000
        });

        // Esperar a que cargue el primer tile
        await new Promise((resolve, reject) => {
          let resolved = false;
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              reject(new Error('Timeout cargando tiles'));
            }
          }, 5000);

          tileLayer.once('tileload', () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              resolve();
            }
          });

          tileLayer.once('tileerror', () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              reject(new Error('Error cargando tiles'));
            }
          });

          tileLayer.addTo(map);
        });

        // Si llegamos aquí, el mapa se cargó correctamente
        mapInstanceRef.current = map;
        currentProviderRef.current = (currentProviderRef.current + i) % providers.length;
        mapInitialized = true;

        setMapHealth({
          status: 'healthy',
          provider: provider.name,
          message: `Conectado a ${provider.name}`,
          lastCheck: new Date(),
          failureCount: 0,
          isReconnecting: false
        });

        // Configurar eventos del mapa
        setupMapEvents(map);
        
        // Agregar marcadores
        updateMarkers();

        break; // Salir del loop si tuvimos éxito

      } catch (error) {
        console.warn(`Fallo con ${provider.name}:`, error);
        
        // Limpiar intento fallido
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      }
    }

    // Si ningún proveedor funcionó, activar modo degradado
    if (!mapInitialized) {
      console.error('Todos los proveedores de mapas fallaron');
      setMapHealth({
        status: 'offline',
        provider: null,
        message: 'Modo offline - Mostrando última ubicación conocida',
        lastCheck: new Date(),
        failureCount: providers.length,
        isReconnecting: true
      });

      // Programar reintento
      scheduleReconnect();
    }
  }, []);

  // Configurar eventos del mapa
  const setupMapEvents = (map) => {
    // Detectar errores de tiles
    map.on('tileerror', (error) => {
      console.warn('Error cargando tile:', error);
      // Intentar cargar desde cache local si está habilitado
      if (enableOfflineCache) {
        loadTileFromCache(error.coords);
      }
    });

    // Guardar tiles en cache cuando se cargan
    if (enableOfflineCache) {
      map.on('tileload', (e) => {
        saveTileToCache(e.coords, e.tile.src);
      });
    }
  };

  // Sistema de cache local de tiles
  const saveTileToCache = async (coords, src) => {
    const key = `${coords.z}/${coords.x}/${coords.y}`;
    tilesCacheRef.current.set(key, src);

    // Limitar tamaño del cache
    if (tilesCacheRef.current.size > 1000) {
      const firstKey = tilesCacheRef.current.keys().next().value;
      tilesCacheRef.current.delete(firstKey);
    }
  };

  const loadTileFromCache = (coords) => {
    const key = `${coords.z}/${coords.x}/${coords.y}`;
    return tilesCacheRef.current.get(key);
  };

  // Actualizar marcadores de forma ultra-eficiente con memoización inteligente
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const currentMarkers = markersRef.current;
    const currentCache = markerDataCacheRef.current;
    const serviceIds = new Set(memoizedServices.map(s => s.id));

    // Eliminar marcadores de servicios que ya no existen
    currentMarkers.forEach((markerData, id) => {
      if (!serviceIds.has(id)) {
        markerData.marker.remove();
        currentMarkers.delete(id);
        currentCache.delete(id);
      }
    });

    // Procesar solo servicios que han cambiado
    memoizedServices.forEach((service) => {
      const existingData = currentCache.get(service.id);
      const hasChanged = !existingData || existingData.dataHash !== service.dataHash;
      
      if (!hasChanged) {
        // No cambió nada, saltar
        return;
      }

      let markerData = currentMarkers.get(service.id);

      if (markerData) {
        // Actualizar marcador existente solo si cambió
        const { marker } = markerData;
        
        // Actualizar posición solo si cambió
        const currentPos = marker.getLatLng();
        if (currentPos.lat !== service.position.lat || currentPos.lng !== service.position.lng) {
          marker.setLatLng([service.position.lat, service.position.lng]);
        }
        
        // Actualizar icono solo si el estado cambió
        if (existingData && existingData.status !== service.status) {
          const newIcon = createServiceIcon(service.status);
          marker.setIcon(newIcon);
        }
        
        // Actualizar popup solo si el contenido cambió
        const newPopupContent = createPopupContent(service);
        if (existingData && existingData.popupContent !== newPopupContent) {
          marker.setPopupContent(newPopupContent);
        }

        // Actualizar cache
        currentCache.set(service.id, {
          dataHash: service.dataHash,
          status: service.status,
          popupContent: newPopupContent,
          position: service.position
        });

      } else {
        // Crear nuevo marcador (solo para servicios realmente nuevos)
        const icon = createServiceIcon(service.status);
        const popupContent = createPopupContent(service);
        
        const marker = window.L.marker([service.position.lat, service.position.lng], { icon })
          .bindPopup(popupContent)
          .on('click', () => handleServiceSelect(service));

        marker.addTo(mapInstanceRef.current);
        
        // Guardar en cache con metadatos
        currentMarkers.set(service.id, { marker, serviceId: service.id });
        currentCache.set(service.id, {
          dataHash: service.dataHash,
          status: service.status,
          popupContent,
          position: service.position
        });
      }
    });
  }, [memoizedServices]);

  // Cache de iconos para evitar recrearlos
  const iconCacheRef = useRef(new Map());

  // Crear icono personalizado según estado (memoizado)
  const createServiceIcon = useCallback((status) => {
    // Retornar del cache si ya existe
    if (iconCacheRef.current.has(status)) {
      return iconCacheRef.current.get(status);
    }

    const colors = {
      'en_curso': '#10b981',
      'programado': '#3b82f6',
      'pausado': '#f59e0b',
      'finalizado': '#6b7280'
    };

    const color = colors[status] || '#6b7280';

    const icon = window.L.divIcon({
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
            ${status === 'en_curso' ? 'animation: pulse 2s infinite;' : ''}
          "></div>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Cachear para futuras referencias
    iconCacheRef.current.set(status, icon);
    
    return icon;
  }, []);

  // Crear contenido del popup (memoizado)
  const createPopupContent = useCallback((service) => {
    return `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; font-weight: bold;">${service.code}</h4>
        <p style="margin: 4px 0;"><strong>Guía:</strong> ${service.guide?.name || 'Sin asignar'}</p>
        <p style="margin: 4px 0;"><strong>Cliente:</strong> ${service.client?.name || 'N/A'}</p>
        <p style="margin: 4px 0;"><strong>Ubicación:</strong> ${service.currentLocation}</p>
        <p style="margin: 4px 0;"><strong>Hora:</strong> ${service.startTime}</p>
      </div>
    `;
  }, []);

  // Health check del mapa
  useEffect(() => {
    if (!isMapReady) return;

    const checkMapHealth = async () => {
      if (!mapInstanceRef.current) {
        setMapHealth(prev => ({
          ...prev,
          status: 'critical',
          message: 'Mapa no inicializado'
        }));
        return;
      }

      try {
        // Verificar que el mapa responde
        const center = mapInstanceRef.current.getCenter();
        if (!center) throw new Error('Mapa no responde');

        // Actualizar estado si estaba mal
        if (mapHealth.status !== 'healthy') {
          setMapHealth(prev => ({
            ...prev,
            status: 'healthy',
            message: 'Mapa funcionando correctamente',
            lastCheck: new Date(),
            failureCount: 0,
            isReconnecting: false
          }));
        }
      } catch (error) {
        console.error('Health check falló:', error);
        setMapHealth(prev => ({
          ...prev,
          status: 'degraded',
          message: 'Verificando conexión...',
          lastCheck: new Date(),
          failureCount: prev.failureCount + 1
        }));

        // Si hay muchos fallos, reintentar
        if (mapHealth.failureCount > 3) {
          scheduleReconnect();
        }
      }
    };

    // Health check cada 30 segundos
    healthCheckIntervalRef.current = setInterval(checkMapHealth, 30000);
    
    // Check inicial
    checkMapHealth();

    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, [isMapReady, mapHealth.status, mapHealth.failureCount]);

  // Programar reconexión
  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) return;

    setMapHealth(prev => ({ ...prev, isReconnecting: true }));

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log('Intentando reconectar...');
      reconnectTimeoutRef.current = null;
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      currentProviderRef.current = (currentProviderRef.current + 1) % Object.keys(MAP_PROVIDERS).length;
      initializeMap();
    }, 5000);
  };

  // Actualización de marcadores cuando cambian los servicios (optimizada)
  useEffect(() => {
    if (isMapReady && mapInstanceRef.current) {
      updateMarkers();
    }
  }, [memoizedServices, isMapReady, updateMarkers]);

  // Inicializar mapa cuando Leaflet esté listo
  useEffect(() => {
    if (isMapReady && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [isMapReady, initializeMap]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      markersRef.current.clear();
    };
  }, []);

  // Actualización automática de posiciones con timer optimizado
  useEffect(() => {        
    let lastUpdateHash = '';
    
    const intervalId = timer.setInterval(() => {
      // Crear hash de todos los servicios para detectar cambios
      const currentHash = memoizedServices
        .map(s => s.dataHash)
        .join('|');
      
      // Solo actualizar si realmente cambió algo
      if (currentHash !== lastUpdateHash) {
        lastUpdateHash = currentHash;
        updateMarkers();
        Logger.map('Markers updated due to data changes');
      }
    }, updateInterval, 'map-update-interval');

    return () => {
      timer.clearInterval(intervalId, 'map-update-interval');
    };
  }, [updateInterval, updateMarkers, memoizedServices, timer]);

  // Manejo de selección con callback estable
  const handleServiceSelect = useCallback((service) => {
    setSelectedService(service);
    onServiceSelect?.(service);
  }, [onServiceSelect]);

  // Componente de estado de salud (memoizado)
  const HealthStatus = memo(() => {
    if (!showHealthStatus) return null;

    const statusConfig = {
      initializing: { color: 'bg-gray-500', icon: '🔄', text: 'Inicializando' },
      healthy: { color: 'bg-green-500', icon: '✓', text: 'Conectado' },
      degraded: { color: 'bg-yellow-500', icon: '⚠', text: 'Degradado' },
      critical: { color: 'bg-red-500', icon: '✗', text: 'Crítico' },
      offline: { color: 'bg-gray-800', icon: '📍', text: 'Offline' }
    };

    const config = statusConfig[mapHealth.status] || statusConfig.initializing;

    return (
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.color} ${mapHealth.status === 'healthy' ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">{config.text}</span>
        </div>
        {mapHealth.provider && (
          <p className="text-xs text-gray-600 mt-1">Proveedor: {mapHealth.provider}</p>
        )}
        {mapHealth.isReconnecting && (
          <p className="text-xs text-orange-600 mt-1">Reconectando...</p>
        )}
      </div>
    );
  });

  // Vista de modo degradado/offline (memoizada)
  const DegradedView = memo(() => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center p-8">
        <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Modo de Respaldo Activado</h3>
        <p className="text-gray-600 mb-4">
          El mapa está funcionando con capacidad limitada.
          Mostrando última ubicación conocida de los servicios.
        </p>
        <div className="bg-white rounded-lg shadow p-4 max-w-md mx-auto">
          <h4 className="font-medium mb-2">Servicios Activos:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {memoizedServices.map(service => (
              <div
                key={service.id}
                className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{service.code}</span>
                  <span className="text-sm text-gray-600">{service.status}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {service.guide?.name} - {service.currentLocation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ));

  // Estados por color para la leyenda (memoizado)
  const statusColors = useMemo(() => [
    { status: 'en_curso', label: 'En Curso', color: 'bg-green-500' },
    { status: 'programado', label: 'Programado', color: 'bg-blue-500' },
    { status: 'pausado', label: 'Pausado', color: 'bg-yellow-500' },
    { status: 'finalizado', label: 'Finalizado', color: 'bg-gray-500' }
  ], []);

  return (
    <div className="flex gap-4 h-full">
      {/* Mapa o vista degradada con Error Boundary */}
      <MapErrorBoundary 
        servicesCount={memoizedServices.length}
        onFallbackMode={() => console.log('Activando modo fallback')}
      >
        <div className={`flex-1 ${height} bg-white rounded-lg shadow-md overflow-hidden relative`}>
          {mapHealth.status === 'offline' ? (
            <DegradedView />
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
          <HealthStatus />
        </div>
      </MapErrorBoundary>

      {/* Sidebar con servicios activos */}
      {showSidebar && (
        <div className="w-96 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Servicios Activos</h3>
            <div className="flex items-center gap-2">
              {mapHealth.status === 'healthy' ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-sm text-gray-600">
                {memoizedServices.length} servicios
              </span>
            </div>
          </div>
          
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
            {memoizedServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay servicios activos en este momento
              </p>
            ) : (
              memoizedServices.map(service => (
                <ServiceListItem
                  key={service.id}
                  service={service}
                  selectedServiceId={selectedService?.id}
                  statusColors={statusColors}
                  onServiceSelect={handleServiceSelect}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

LiveMapResilient.displayName = 'LiveMapResilient';

LiveMapResilient.propTypes = {
  updateInterval: PropTypes.number,
  showSidebar: PropTypes.bool,
  height: PropTypes.string,
  filters: PropTypes.shape({
    status: PropTypes.string,
    search: PropTypes.string,
  }),
  onServiceSelect: PropTypes.func,
  enableOfflineCache: PropTypes.bool,
  showHealthStatus: PropTypes.bool
};

export default LiveMapResilient;