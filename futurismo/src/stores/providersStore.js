import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Datos mock de proveedores para desarrollo
const mockProviders = {
  locations: [
    {
      id: 'ica',
      name: 'Ica',
      region: 'Ica',
      country: 'Perú',
      categories: ['hoteles', 'restaurantes', 'transporte', 'actividades', 'guias_locales']
    },
    {
      id: 'cusco',
      name: 'Cusco',
      region: 'Cusco',
      country: 'Perú',
      categories: ['hoteles', 'restaurantes', 'transporte', 'actividades', 'guias_locales', 'artesanias']
    },
    {
      id: 'arequipa',
      name: 'Arequipa',
      region: 'Arequipa',
      country: 'Perú',
      categories: ['hoteles', 'restaurantes', 'transporte', 'actividades']
    },
    {
      id: 'lima',
      name: 'Lima',
      region: 'Lima',
      country: 'Perú',
      categories: ['hoteles', 'restaurantes', 'transporte', 'actividades', 'guias_locales']
    }
  ],
  
  categories: [
    { id: 'hoteles', name: 'Hoteles', icon: '🏨', color: 'blue' },
    { id: 'restaurantes', name: 'Restaurantes', icon: '🍽️', color: 'green' },
    { id: 'transporte', name: 'Transporte', icon: '🚐', color: 'yellow' },
    { id: 'actividades', name: 'Actividades', icon: '🎯', color: 'purple' },
    { id: 'guias_locales', name: 'Guías Locales', icon: '👨‍🦱', color: 'orange' },
    { id: 'artesanias', name: 'Artesanías', icon: '🎨', color: 'pink' }
  ],

  providers: [
    // Ica - Hoteles
    {
      id: 'hotel_las_dunas_ica',
      name: 'Hotel Las Dunas',
      category: 'hoteles',
      location: 'ica',
      contact: {
        phone: '+51 956 123 456',
        email: 'reservas@hotellasdunasica.com',
        address: 'Av. La Angostura 400, Ica',
        contactPerson: 'María González'
      },
      services: ['Hospedaje', 'Desayuno', 'Piscina', 'Spa'],
      pricing: {
        type: 'per_night',
        basePrice: 120,
        currency: 'PEN'
      },
      rating: 4.5,
      capacity: 80,
      active: true
    },
    {
      id: 'hotel_viñas_queirolo_ica',
      name: 'Hotel Viñas Queirolo',
      category: 'hoteles',
      location: 'ica',
      contact: {
        phone: '+51 956 789 012',
        email: 'info@vinasqueirolo.com',
        address: 'Fundo Tres Esquinas s/n, Ica',
        contactPerson: 'Carlos Mendoza'
      },
      services: ['Hospedaje', 'Tour de viñedos', 'Degustación', 'Restaurante'],
      pricing: {
        type: 'per_night',
        basePrice: 180,
        currency: 'PEN'
      },
      rating: 4.8,
      capacity: 40,
      active: true
    },

    // Ica - Restaurantes
    {
      id: 'restaurant_el_catador_ica',
      name: 'El Catador',
      category: 'restaurantes',
      location: 'ica',
      contact: {
        phone: '+51 956 345 678',
        email: 'reservas@elcatador.com',
        address: 'Av. Municipalidad 142, Ica',
        contactPerson: 'Ana Flores'
      },
      services: ['Almuerzo', 'Cena', 'Comida criolla', 'Parrillas'],
      pricing: {
        type: 'per_person',
        basePrice: 35,
        currency: 'PEN'
      },
      rating: 4.3,
      capacity: 60,
      active: true
    },

    // Cusco - Hoteles
    {
      id: 'hotel_monasterio_cusco',
      name: 'Hotel Monasterio',
      category: 'hoteles',
      location: 'cusco',
      contact: {
        phone: '+51 984 123 456',
        email: 'reservas@monasterio.com',
        address: 'Calle Palacios 136, Cusco',
        contactPerson: 'José Quispe'
      },
      services: ['Hospedaje de lujo', 'Spa', 'Oxígeno', 'Restaurante gourmet'],
      pricing: {
        type: 'per_night',
        basePrice: 450,
        currency: 'PEN'
      },
      rating: 4.9,
      capacity: 120,
      active: true
    },

    // Cusco - Guías Locales
    {
      id: 'guia_local_cusco_1',
      name: 'Amaru Quispe',
      category: 'guias_locales',
      location: 'cusco',
      contact: {
        phone: '+51 984 567 890',
        email: 'amaru.quispe@gmail.com',
        address: 'Barrio San Blas, Cusco',
        contactPerson: 'Amaru Quispe'
      },
      services: ['Guía en quechua', 'Historia incaica', 'Sitios arqueológicos'],
      pricing: {
        type: 'per_day',
        basePrice: 150,
        currency: 'PEN'
      },
      rating: 4.7,
      specialties: ['Machu Picchu', 'Valle Sagrado', 'Ciudad del Cusco'],
      languages: ['Español', 'Quechua', 'Inglés'],
      active: true
    }
  ],

  assignments: [
    {
      id: 'assignment_1',
      tourId: 'tour_ica_fullday',
      tourName: 'Ica Full Day',
      date: '2024-01-15',
      providers: [
        {
          providerId: 'hotel_las_dunas_ica',
          startTime: '08:00',
          endTime: '10:00',
          service: 'Desayuno',
          notes: 'Desayuno buffet para 25 personas'
        },
        {
          providerId: 'restaurant_el_catador_ica',
          startTime: '13:00',
          endTime: '15:00',
          service: 'Almuerzo',
          notes: 'Menú especial turistas, incluye bebida'
        }
      ],
      status: 'confirmed',
      createdAt: '2024-01-10T10:00:00.000Z',
      createdBy: 'admin_user'
    }
  ]
};

const useProvidersStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        locations: mockProviders.locations,
        categories: mockProviders.categories,
        providers: mockProviders.providers,
        assignments: mockProviders.assignments,
        selectedLocation: null,
        selectedCategory: null,
        isLoading: false,
        error: null,

        // Acciones para ubicaciones
        actions: {
          // Obtener todas las ubicaciones
          getLocations: () => {
            return get().locations;
          },

          // Obtener categorías por ubicación
          getCategoriesByLocation: (locationId) => {
            const location = get().locations.find(loc => loc.id === locationId);
            if (!location) return [];
            
            const allCategories = get().categories;
            return location.categories.map(catId => 
              allCategories.find(cat => cat.id === catId)
            ).filter(Boolean);
          },

          // Obtener proveedores por ubicación y categoría
          getProvidersByLocationAndCategory: (locationId, categoryId = null) => {
            const providers = get().providers;
            let filtered = providers.filter(p => p.location === locationId && p.active);
            
            if (categoryId) {
              filtered = filtered.filter(p => p.category === categoryId);
            }
            
            return filtered;
          },

          // Agregar nuevo proveedor
          addProvider: (provider) => {
            const newProvider = {
              ...provider,
              id: `provider_${Date.now()}`,
              active: true,
              createdAt: new Date().toISOString()
            };

            set(state => ({
              providers: [...state.providers, newProvider]
            }));

            return newProvider;
          },

          // Actualizar proveedor
          updateProvider: (providerId, updates) => {
            set(state => ({
              providers: state.providers.map(provider =>
                provider.id === providerId
                  ? { ...provider, ...updates, updatedAt: new Date().toISOString() }
                  : provider
              )
            }));
          },

          // Eliminar proveedor (soft delete)
          deleteProvider: (providerId) => {
            set(state => ({
              providers: state.providers.map(provider =>
                provider.id === providerId
                  ? { ...provider, active: false, deletedAt: new Date().toISOString() }
                  : provider
              )
            }));
          },

          // Crear asignación de proveedores para un tour
          createAssignment: (tourData) => {
            const newAssignment = {
              ...tourData,
              id: `assignment_${Date.now()}`,
              status: 'draft',
              createdAt: new Date().toISOString(),
              createdBy: 'current_user' // TODO: obtener del auth store
            };

            set(state => ({
              assignments: [...state.assignments, newAssignment]
            }));

            return newAssignment;
          },

          // Actualizar asignación
          updateAssignment: (assignmentId, updates) => {
            set(state => ({
              assignments: state.assignments.map(assignment =>
                assignment.id === assignmentId
                  ? { ...assignment, ...updates, updatedAt: new Date().toISOString() }
                  : assignment
              )
            }));
          },

          // Obtener asignación por ID
          getAssignmentById: (assignmentId) => {
            return get().assignments.find(a => a.id === assignmentId);
          },

          // Obtener asignaciones por tour
          getAssignmentsByTour: (tourId) => {
            return get().assignments.filter(a => a.tourId === tourId);
          },

          // Confirmar asignación
          confirmAssignment: (assignmentId) => {
            get().actions.updateAssignment(assignmentId, { 
              status: 'confirmed',
              confirmedAt: new Date().toISOString()
            });
          },

          // Cancelar asignación
          cancelAssignment: (assignmentId, reason = '') => {
            get().actions.updateAssignment(assignmentId, { 
              status: 'cancelled',
              cancelledAt: new Date().toISOString(),
              cancellationReason: reason
            });
          },

          // Generar datos para PDF
          generatePDFData: (assignmentId) => {
            const assignment = get().actions.getAssignmentById(assignmentId);
            if (!assignment) return null;

            const providers = get().providers;
            const locations = get().locations;
            const categories = get().categories;

            const assignmentData = {
              ...assignment,
              providers: assignment.providers.map(ap => {
                const provider = providers.find(p => p.id === ap.providerId);
                const category = categories.find(c => c.id === provider?.category);
                const location = locations.find(l => l.id === provider?.location);

                return {
                  ...ap,
                  providerInfo: provider,
                  categoryInfo: category,
                  locationInfo: location
                };
              })
            };

            return assignmentData;
          },

          // Filtros y búsqueda
          setSelectedLocation: (locationId) => set({ selectedLocation: locationId }),
          setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
          
          searchProviders: (query, filters = {}) => {
            const providers = get().providers.filter(p => p.active);
            let filtered = providers;

            // Búsqueda por texto
            if (query) {
              const searchTerm = query.toLowerCase();
              filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.contact.contactPerson.toLowerCase().includes(searchTerm) ||
                p.services.some(s => s.toLowerCase().includes(searchTerm))
              );
            }

            // Filtros adicionales
            if (filters.location) {
              filtered = filtered.filter(p => p.location === filters.location);
            }
            if (filters.category) {
              filtered = filtered.filter(p => p.category === filters.category);
            }
            if (filters.minRating) {
              filtered = filtered.filter(p => p.rating >= filters.minRating);
            }

            return filtered;
          },

          getAllProviders: () => {
            return get().providers;
          },

          importProviders: (importedProviders) => {
            const newProviders = importedProviders.map((provider, index) => ({
              id: `imported-${Date.now()}-${index}`,
              name: provider.name || provider.Nombre || '',
              type: provider.type || provider.Tipo || 'restaurant',
              location: provider.location || provider.Ubicación || '',
              category: provider.category || provider.Categoría || '',
              contact: {
                phone: provider.phone || provider.Teléfono || '',
                email: provider.email || provider.Email || '',
                address: provider.address || provider.Dirección || ''
              },
              capacity: provider.capacity || provider.Capacidad || 0,
              rating: provider.rating || provider.Calificación || 0,
              description: provider.description || provider.Descripción || '',
              amenities: provider.amenities || [],
              priceRange: provider.priceRange || provider['Rango Precio'] || 'medio',
              images: [],
              availability: {},
              active: true
            }));
            
            set(state => ({ providers: [...state.providers, ...newProviders] }));
            return { success: true, imported: newProviders.length };
          }
        }
      }),
      {
        name: 'providers-store',
        partialize: (state) => ({
          providers: state.providers,
          assignments: state.assignments,
          locations: state.locations,
          categories: state.categories
        })
      }
    ),
    {
      name: 'providers-store'
    }
  )
);

export default useProvidersStore;