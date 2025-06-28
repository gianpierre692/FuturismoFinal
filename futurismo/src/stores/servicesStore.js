import { create } from 'zustand';
import { SERVICE_STATUS } from '../utils/constants';

const useServicesStore = create((set, get) => ({
  // Estado
  services: [],
  activeServices: [],
  historicalServices: [],
  filters: {
    status: '',
    date: null,
    serviceType: '',
    search: ''
  },
  isLoading: false,
  error: null,
  selectedService: null,
  mapView: true, // true = vista mapa, false = vista tarjetas

  // Acciones
  setServices: (services) => {
    const active = services.filter(s => 
      s.status !== SERVICE_STATUS.FINISHED && 
      s.status !== SERVICE_STATUS.CANCELLED
    );
    
    const historical = services.filter(s => 
      s.status === SERVICE_STATUS.FINISHED || 
      s.status === SERVICE_STATUS.CANCELLED
    );
    
    set({ 
      services, 
      activeServices: active,
      historicalServices: historical 
    });
  },

  addService: (service) => {
    set((state) => ({
      services: [...state.services, service],
      activeServices: service.status !== SERVICE_STATUS.FINISHED && service.status !== SERVICE_STATUS.CANCELLED
        ? [...state.activeServices, service]
        : state.activeServices
    }));
  },

  updateService: (serviceId, updates) => {
    set((state) => {
      const updatedServices = state.services.map(service =>
        service.id === serviceId ? { ...service, ...updates } : service
      );
      
      return {
        services: updatedServices,
        activeServices: updatedServices.filter(s => 
          s.status !== SERVICE_STATUS.FINISHED && 
          s.status !== SERVICE_STATUS.CANCELLED
        ),
        historicalServices: updatedServices.filter(s => 
          s.status === SERVICE_STATUS.FINISHED || 
          s.status === SERVICE_STATUS.CANCELLED
        )
      };
    });
  },

  updateServiceLocation: (serviceId, location) => {
    set((state) => ({
      services: state.services.map(service =>
        service.id === serviceId 
          ? { ...service, currentLocation: location, lastUpdate: new Date().toISOString() }
          : service
      ),
      activeServices: state.activeServices.map(service =>
        service.id === serviceId 
          ? { ...service, currentLocation: location, lastUpdate: new Date().toISOString() }
          : service
      )
    }));
  },

  updateGuidePosition: (guideId, position) => {
    set((state) => ({
      services: state.services.map(service =>
        service.guideId === guideId 
          ? { ...service, guideLocation: position, lastUpdate: new Date().toISOString() }
          : service
      ),
      activeServices: state.activeServices.map(service =>
        service.guideId === guideId 
          ? { ...service, guideLocation: position, lastUpdate: new Date().toISOString() }
          : service
      )
    }));
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        status: '',
        date: null,
        serviceType: '',
        search: ''
      }
    });
  },

  getFilteredServices: () => {
    const { services, filters } = get();
    
    return services.filter(service => {
      // Filtro por estado
      if (filters.status && service.status !== filters.status) {
        return false;
      }
      
      // Filtro por fecha
      if (filters.date) {
        const serviceDate = new Date(service.date).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        if (serviceDate !== filterDate) {
          return false;
        }
      }
      
      // Filtro por tipo de servicio
      if (filters.serviceType && service.type !== filters.serviceType) {
        return false;
      }
      
      // Filtro por búsqueda
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          service.code,
          service.guideName,
          service.touristName,
          service.destination
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  },

  selectService: (service) => set({ selectedService: service }),
  
  clearSelectedService: () => set({ selectedService: null }),

  toggleMapView: () => set((state) => ({ mapView: !state.mapView })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Obtener estadísticas
  getActiveServices: (filters = {}) => {
    const { activeServices } = get();
    
    if (!filters || Object.keys(filters).length === 0) {
      return activeServices;
    }
    
    return activeServices.filter(service => {
      // Filtro por estado
      if (filters.status && service.status !== filters.status) {
        return false;
      }
      
      // Filtro por fecha
      if (filters.date) {
        const serviceDate = new Date(service.date).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        if (serviceDate !== filterDate) {
          return false;
        }
      }
      
      // Filtro por tipo de servicio
      if (filters.serviceType && service.type !== filters.serviceType) {
        return false;
      }
      
      return true;
    });
  },

  getStatistics: () => {
    const { activeServices } = get();
    
    return {
      total: activeServices.length,
      pending: activeServices.filter(s => s.status === SERVICE_STATUS.PENDING).length,
      onWay: activeServices.filter(s => s.status === SERVICE_STATUS.ON_WAY).length,
      inService: activeServices.filter(s => s.status === SERVICE_STATUS.IN_SERVICE).length
    };
  },

  // Inicializar con datos mock
  initializeMockData: () => {
    const mockServices = [
      {
        id: 1,
        code: 'TUR001',
        status: 'en_curso',
        client: { name: 'María González', phone: '+51 987654321' },
        guide: { name: 'Carlos Mendoza', phone: '+51 123456789' },
        startTime: '09:00',
        pickupLocation: 'Plaza de Armas',
        destination: 'Circuito Mágico del Agua',
        currentLocation: { lat: -12.0464, lng: -77.0428 },
        lastUpdate: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        code: 'TUR002',
        status: 'programado',
        client: { name: 'John Smith', phone: '+1 555-0123' },
        guide: { name: 'Ana Rivera', phone: '+51 987654321' },
        startTime: '14:00',
        pickupLocation: 'Hotel Miraflores',
        destination: 'Museo Nacional',
        currentLocation: { lat: -12.1215, lng: -77.0298 },
        lastUpdate: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 3,
        code: 'TUR003',
        status: 'en_curso',
        client: { name: 'Sophie Dubois', phone: '+33 123456789' },
        guide: { name: 'Miguel Torres', phone: '+51 876543210' },
        startTime: '11:30',
        pickupLocation: 'Barranco',
        destination: 'Centro Histórico',
        currentLocation: { lat: -12.1533, lng: -77.0244 },
        lastUpdate: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 4,
        code: 'TUR004',
        status: 'pausado',
        client: { name: 'Roberto Silva', phone: '+51 555-9876' },
        guide: { name: 'Lucia Fernandez', phone: '+51 765432109' },
        startTime: '16:00',
        pickupLocation: 'San Isidro',
        destination: 'Larco Mar',
        currentLocation: { lat: -12.0956, lng: -77.0364 },
        lastUpdate: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 5,
        code: 'TUR005',
        status: 'programado',
        client: { name: 'Emma Johnson', phone: '+44 20 7946 0958' },
        guide: { name: 'Pedro Ramirez', phone: '+51 654321098' },
        startTime: '18:30',
        pickupLocation: 'Callao',
        destination: 'Fortaleza del Real Felipe',
        currentLocation: { lat: -12.0735, lng: -77.0826 },
        lastUpdate: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      }
    ];

    set((state) => {
      const active = mockServices.filter(s => 
        s.status !== 'completado' && s.status !== 'cancelado'
      );
      
      return {
        services: mockServices,
        activeServices: active,
        historicalServices: []
      };
    });
  },

  // Limpiar store
  clearStore: () => {
    set({
      services: [],
      activeServices: [],
      historicalServices: [],
      filters: {
        status: '',
        date: null,
        serviceType: '',
        search: ''
      },
      selectedService: null,
      error: null
    });
  }
}));

export { useServicesStore };
export default useServicesStore;