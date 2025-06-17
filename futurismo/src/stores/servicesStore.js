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
  getStatistics: () => {
    const { activeServices } = get();
    
    return {
      total: activeServices.length,
      pending: activeServices.filter(s => s.status === SERVICE_STATUS.PENDING).length,
      onWay: activeServices.filter(s => s.status === SERVICE_STATUS.ON_WAY).length,
      inService: activeServices.filter(s => s.status === SERVICE_STATUS.IN_SERVICE).length
    };
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