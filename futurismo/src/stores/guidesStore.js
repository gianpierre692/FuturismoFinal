import { create } from 'zustand';

// Catálogo de idiomas disponibles
const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'Inglés', flag: '🇺🇸' },
  { code: 'fr', name: 'Francés', flag: '🇫🇷' },
  { code: 'de', name: 'Alemán', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugués', flag: '🇵🇹' },
  { code: 'ja', name: 'Japonés', flag: '🇯🇵' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
  { code: 'zh', name: 'Chino Mandarín', flag: '🇨🇳' },
  { code: 'ru', name: 'Ruso', flag: '🇷🇺' }
];

// Datos mock de guías
const mockGuides = [
  {
    id: 'guide001',
    fullName: 'María Elena Torres Vásquez',
    dni: '12345678',
    phone: '+51 987 654 321',
    email: 'maria.torres@futurismo.com',
    address: 'Av. Grau 123, Miraflores, Lima',
    guideType: 'freelance',
    specializations: {
      languages: [
        { code: 'es', level: 'nativo' },
        { code: 'en', level: 'avanzado' },
        { code: 'fr', level: 'intermedio' }
      ],
      museums: [
        { name: 'Museo Larco', expertise: 'experto' },
        { name: 'Museo del Oro', expertise: 'avanzado' },
        { name: 'Museo Nacional de Antropología', expertise: 'intermedio' }
      ]
    },
    stats: {
      toursCompleted: 156,
      yearsExperience: 5,
      rating: 4.8,
      certifications: 3
    },
    status: 'active',
    todayStatus: 'active',
    lastActivity: new Date().toISOString(),
    tourAssignments: 2,
    createdAt: '2019-03-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'guide002',
    fullName: 'Carlos Alberto Mendoza Silva',
    dni: '87654321',
    phone: '', // Guías de planta no tienen teléfono
    email: 'carlos.mendoza@futurismo.com',
    address: 'Jr. Lima 456, San Isidro, Lima',
    guideType: 'planta',
    specializations: {
      languages: [
        { code: 'es', level: 'nativo' },
        { code: 'en', level: 'experto' },
        { code: 'de', level: 'avanzado' }
      ],
      museums: [
        { name: 'Museo de Arte de Lima', expertise: 'experto' },
        { name: 'Museo Pedro de Osma', expertise: 'avanzado' }
      ]
    },
    stats: {
      toursCompleted: 234,
      yearsExperience: 8,
      rating: 4.9,
      certifications: 5
    },
    status: 'active',
    todayStatus: 'on_tour',
    lastActivity: new Date(Date.now() - 30 * 60000).toISOString(),
    tourAssignments: 1,
    currentTour: 'City Tour Lima - 10:00 AM',
    createdAt: '2016-08-20T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'guide003',
    fullName: 'Ana Sofía Quispe Mamani',
    dni: '11223344',
    phone: '+51 987 654 323',
    email: 'ana.quispe@futurismo.com',
    address: 'Av. Arequipa 789, Lince, Lima',
    guideType: 'freelance',
    specializations: {
      languages: [
        { code: 'es', level: 'nativo' },
        { code: 'en', level: 'intermedio' },
        { code: 'ja', level: 'avanzado' }
      ],
      museums: [
        { name: 'Museo de la Nación', expertise: 'experto' },
        { name: 'Museo de Sitio Pachacamac', expertise: 'intermedio' }
      ]
    },
    stats: {
      toursCompleted: 89,
      yearsExperience: 3,
      rating: 4.6,
      certifications: 2
    },
    status: 'active',
    todayStatus: 'inactive',
    lastActivity: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    tourAssignments: 0,
    inactiveReason: 'Sin tours asignados',
    createdAt: '2021-06-10T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
];

// Datos mock de fotos de tours
const mockTourPhotos = [
  {
    id: 'tour-photos-1',
    tourId: 'tour-001',
    guideId: 'guide001', // María (freelance)
    photos: [
      {
        id: 'photo-1',
        name: 'plaza_armas_group.jpg',
        url: 'https://via.placeholder.com/400x300?text=Plaza+Armas+Grupo',
        category: 'tourist_group',
        description: 'Grupo de turistas en Plaza de Armas',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        size: 2048000,
        tourId: 'tour-001',
        guideId: 'guide001'
      },
      {
        id: 'photo-2',
        name: 'catedral_exterior.jpg',
        url: 'https://via.placeholder.com/400x300?text=Catedral+Lima',
        category: 'monument',
        description: 'Fachada de la Catedral de Lima',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        uploadedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        size: 3072000,
        tourId: 'tour-001',
        guideId: 'guide001'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tour-photos-2',
    tourId: 'tour-002',
    guideId: 'guide002', // Carlos (planta)
    photos: [
      {
        id: 'photo-3',
        name: 'museo_larco_ceramicas.jpg',
        url: 'https://via.placeholder.com/400x300?text=Museo+Larco',
        category: 'monument',
        description: 'Colección de cerámicas precolombinas',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        size: 2560000,
        tourId: 'tour-002',
        guideId: 'guide002'
      },
      {
        id: 'photo-4',
        name: 'restaurant_ceviche.jpg',
        url: 'https://via.placeholder.com/400x300?text=Ceviche+Peruano',
        category: 'restaurant',
        description: 'Degustación de ceviche tradicional',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
        uploadedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        size: 1875000,
        tourId: 'tour-002',
        guideId: 'guide002'
      },
      {
        id: 'photo-5',
        name: 'grupo_museo.jpg',
        url: 'https://via.placeholder.com/400x300?text=Grupo+en+Museo',
        category: 'tourist_group',
        description: 'Turistas durante la explicación en el museo',
        timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000),
        uploadedAt: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
        size: 2240000,
        tourId: 'tour-002',
        guideId: 'guide002'
      }
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

const useGuidesStore = create((set, get) => ({
  // Estado
  guides: mockGuides,
  languages: languages,
  museums: [], // Ya no necesitamos un catálogo fijo de museos
  tourPhotos: mockTourPhotos, // Fotos de tours por guía con datos de ejemplo
  
  // Funciones principales (acceso directo)
  getGuides: (filters = {}) => {
    const { guides } = get();
    
    if (!filters || Object.keys(filters).length === 0) {
      return guides;
    }
    
    return guides.filter(guide => {
      // Filtro por tipo
      if (filters.tipo && guide.guideType !== filters.tipo) {
        return false;
      }
      
      // Filtro por idioma
      if (filters.language && !guide.specializations.languages.some(lang => lang.code === filters.language)) {
        return false;
      }
      
      // Filtro por museo
      if (filters.museum && !guide.specializations.museums.some(museum => 
        museum.name.toLowerCase().includes(filters.museum.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });
  },

  getGuideAgenda: (guideId, date) => {
    // Mock agenda data
    return {
      guideId,
      date: date,
      slots: [
        { time: '09:00', status: 'available' },
        { time: '10:00', status: 'busy', tour: 'City Tour Lima' },
        { time: '11:00', status: 'busy', tour: 'City Tour Lima' },
        { time: '12:00', status: 'available' },
        { time: '13:00', status: 'break' },
        { time: '14:00', status: 'available' },
        { time: '15:00', status: 'available' },
        { time: '16:00', status: 'busy', tour: 'Museo Larco' },
        { time: '17:00', status: 'available' }
      ]
    };
  },
  
  // Acciones
  actions: {
    // Agregar nuevo guía
    addGuide: (guideData) => {
      const newGuide = {
        id: `guide${Date.now()}`,
        ...guideData,
        stats: {
          toursCompleted: 0,
          yearsExperience: 0,
          rating: 0,
          certifications: 0
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      set((state) => ({
        guides: [...state.guides, newGuide]
      }));
      
      return newGuide;
    },

    // Actualizar guía existente
    updateGuide: (guideId, updateData) => {
      set((state) => ({
        guides: state.guides.map(guide =>
          guide.id === guideId
            ? { ...guide, ...updateData, updatedAt: new Date().toISOString() }
            : guide
        )
      }));
    },

    // Eliminar guía
    deleteGuide: (guideId) => {
      set((state) => ({
        guides: state.guides.filter(guide => guide.id !== guideId)
      }));
    },

    // Obtener guía por ID
    getGuideById: (guideId) => {
      const { guides } = get();
      return guides.find(guide => guide.id === guideId);
    },

    // Filtrar guías
    filterGuides: (filters) => {
      const { guides } = get();
      
      return guides.filter(guide => {
        // Filtro por tipo
        if (filters.type && guide.guideType !== filters.type) {
          return false;
        }
        
        // Filtro por idioma
        if (filters.language && !guide.specializations.languages.some(lang => lang.code === filters.language)) {
          return false;
        }
        
        // Filtro por museo (buscar en el nombre)
        if (filters.museum && !guide.specializations.museums.some(museum => 
          museum.name.toLowerCase().includes(filters.museum.toLowerCase())
        )) {
          return false;
        }
        
        // Filtro por texto de búsqueda
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return guide.fullName.toLowerCase().includes(searchTerm) ||
                 guide.email.toLowerCase().includes(searchTerm) ||
                 guide.dni.includes(searchTerm);
        }
        
        return true;
      });
    },

    // Obtener estadísticas
    getStatistics: () => {
      const { guides } = get();
      
      return {
        total: guides.length,
        planta: guides.filter(g => g.guideType === 'planta').length,
        freelance: guides.filter(g => g.guideType === 'freelance').length,
        active: guides.filter(g => g.status === 'active').length
      };
    },

    importGuides: (importedGuides) => {
      const newGuides = importedGuides.map((guide, index) => ({
        id: `imported-${Date.now()}-${index}`,
        firstName: guide.firstName || guide.Nombre || '',
        lastName: guide.lastName || guide.Apellido || '',
        email: guide.email || guide.Email || '',
        phone: guide.phone || guide.Teléfono || '',
        guideType: guide.guideType || guide.Tipo || 'freelance',
        status: guide.status || guide.Estado || 'active',
        specialties: guide.specialties ? guide.specialties.split(',').map(s => s.trim()) : [],
        languages: guide.languages ? guide.languages.split(',').map(l => l.trim()) : [],
        rating: guide.rating || guide.Calificación || 0,
        completedTours: guide.completedTours || guide['Tours Completados'] || 0,
        available: guide.available !== undefined ? guide.available : true,
        createdAt: new Date()
      }));
      
      set(state => ({ guides: [...state.guides, ...newGuides] }));
      return { success: true, imported: newGuides.length };
    },

    // === FUNCIONES PARA FOTOS DE TOURS ===
    
    // Agregar fotos a un tour
    addTourPhotos: (tourId, guideId, photos) => {
      const tourPhotoEntry = {
        id: `tour-photos-${Date.now()}`,
        tourId,
        guideId,
        photos: photos.map(photo => ({
          ...photo,
          tourId,
          guideId,
          uploadedAt: new Date().toISOString()
        })),
        createdAt: new Date().toISOString()
      };

      set(state => ({
        tourPhotos: [...state.tourPhotos, tourPhotoEntry]
      }));

      return tourPhotoEntry;
    },

    // Obtener fotos de un tour específico
    getTourPhotos: (tourId) => {
      const { tourPhotos } = get();
      const tourPhotoEntry = tourPhotos.find(entry => entry.tourId === tourId);
      return tourPhotoEntry ? tourPhotoEntry.photos : [];
    },

    // Obtener todas las fotos de un guía
    getGuidePhotos: (guideId) => {
      const { tourPhotos } = get();
      return tourPhotos.filter(entry => entry.guideId === guideId);
    },

    // Actualizar fotos de un tour
    updateTourPhotos: (tourId, updatedPhotos) => {
      set(state => ({
        tourPhotos: state.tourPhotos.map(entry =>
          entry.tourId === tourId
            ? { ...entry, photos: updatedPhotos, updatedAt: new Date().toISOString() }
            : entry
        )
      }));
    },

    // Eliminar foto específica
    deleteTourPhoto: (tourId, photoId) => {
      set(state => ({
        tourPhotos: state.tourPhotos.map(entry =>
          entry.tourId === tourId
            ? {
                ...entry,
                photos: entry.photos.filter(photo => photo.id !== photoId),
                updatedAt: new Date().toISOString()
              }
            : entry
        )
      }));
    },

    // Obtener estadísticas de fotos
    getPhotoStatistics: (guideId = null) => {
      const { tourPhotos } = get();
      const relevantEntries = guideId 
        ? tourPhotos.filter(entry => entry.guideId === guideId)
        : tourPhotos;

      const totalPhotos = relevantEntries.reduce((sum, entry) => sum + entry.photos.length, 0);
      const toursWithPhotos = relevantEntries.length;
      
      // Estadísticas por categoría
      const categoryStats = {};
      relevantEntries.forEach(entry => {
        entry.photos.forEach(photo => {
          categoryStats[photo.category] = (categoryStats[photo.category] || 0) + 1;
        });
      });

      return {
        totalPhotos,
        toursWithPhotos,
        averagePhotosPerTour: toursWithPhotos > 0 ? (totalPhotos / toursWithPhotos).toFixed(1) : 0,
        categoryBreakdown: categoryStats
      };
    },

    // Buscar fotos por criterios
    searchTourPhotos: (criteria = {}) => {
      const { tourPhotos } = get();
      let results = [];

      tourPhotos.forEach(entry => {
        const matchingPhotos = entry.photos.filter(photo => {
          // Filtrar por guía
          if (criteria.guideId && entry.guideId !== criteria.guideId) {
            return false;
          }

          // Filtrar por tour
          if (criteria.tourId && entry.tourId !== criteria.tourId) {
            return false;
          }

          // Filtrar por categoría
          if (criteria.category && photo.category !== criteria.category) {
            return false;
          }

          // Filtrar por fecha
          if (criteria.dateFrom || criteria.dateTo) {
            const photoDate = new Date(photo.uploadedAt);
            if (criteria.dateFrom && photoDate < new Date(criteria.dateFrom)) {
              return false;
            }
            if (criteria.dateTo && photoDate > new Date(criteria.dateTo)) {
              return false;
            }
          }

          // Filtrar por descripción
          if (criteria.description && !photo.description.toLowerCase().includes(criteria.description.toLowerCase())) {
            return false;
          }

          return true;
        });

        if (matchingPhotos.length > 0) {
          results.push({
            ...entry,
            photos: matchingPhotos
          });
        }
      });

      return results;
    }
  }
}));

export { useGuidesStore };
export default useGuidesStore;