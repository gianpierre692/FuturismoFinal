import { create } from 'zustand';

// Zonas de trabajo disponibles
const workZones = [
  { id: 'cusco-ciudad', name: 'Cusco Ciudad', description: 'Centro histórico y alrededores' },
  { id: 'valle-sagrado', name: 'Valle Sagrado', description: 'Pisac, Ollantaytambo, Chinchero' },
  { id: 'machu-picchu', name: 'Machu Picchu', description: 'Ciudadela y Huayna Picchu' },
  { id: 'sur-valle', name: 'Sur del Valle', description: 'Tipón, Pikillaqta, Andahuaylillas' },
  { id: 'otros', name: 'Otros destinos', description: 'Otros lugares turísticos' }
];

// Tipos de tours disponibles
const tourTypes = [
  { id: 'cultural', name: 'Cultural', icon: '🏛️' },
  { id: 'aventura', name: 'Aventura', icon: '🏔️' },
  { id: 'gastronomico', name: 'Gastronómico', icon: '🍽️' },
  { id: 'mistico', name: 'Místico', icon: '🔮' },
  { id: 'fotografico', name: 'Fotográfico', icon: '📸' }
];

// Tipos de grupos
const groupTypes = [
  { id: 'children', name: 'Niños', description: 'Grupos escolares y familiares con niños' },
  { id: 'schools', name: 'Colegios', description: 'Visitas educativas' },
  { id: 'elderly', name: 'Adultos mayores', description: 'Grupos de tercera edad' },
  { id: 'corporate', name: 'Corporativo', description: 'Viajes de empresa' },
  { id: 'vip', name: 'VIP', description: 'Clientes exclusivos' },
  { id: 'specialNeeds', name: 'Necesidades especiales', description: 'Grupos con requerimientos especiales' }
];

// Mock data de guías freelance con marketplace features
const mockFreelanceGuides = [
  {
    id: 'guide001',
    fullName: 'María Elena Torres Vásquez',
    dni: '12345678',
    phone: '+51 987 654 321',
    email: 'maria.torres@futurismo.com',
    address: 'Av. Grau 123, Cusco',
    guideType: 'freelance',
    
    profile: {
      avatar: 'https://ui-avatars.com/api/?name=Maria+Torres&background=0D8ABC&color=fff',
      bio: 'Guía profesional con 5 años de experiencia en tours culturales y gastronómicos. Especializada en historia Inca y cocina tradicional cusqueña.',
      photos: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
      ],
      videoPresentation: 'https://youtube.com/watch?v=example'
    },
    
    specializations: {
      languages: [
        { code: 'es', level: 'nativo', certified: true, certificationDate: '2019-01-15' },
        { code: 'en', level: 'avanzado', certified: true, certificationDate: '2020-03-20' },
        { code: 'fr', level: 'intermedio', certified: false }
      ],
      tourTypes: ['cultural', 'gastronomico'],
      workZones: ['cusco-ciudad', 'valle-sagrado'],
      groupExperience: {
        children: { level: 'experto', yearsExperience: 3 },
        schools: { level: 'intermedio', yearsExperience: 2 },
        elderly: { level: 'experto', yearsExperience: 4 },
        corporate: { level: 'basico', yearsExperience: 1 },
        vip: { level: 'intermedio', yearsExperience: 2 },
        specialNeeds: { level: 'basico', yearsExperience: 1 }
      }
    },
    
    certifications: [
      {
        id: 'cert001',
        name: 'Guía Oficial de Turismo',
        issuer: 'MINCETUR',
        issueDate: '2019-01-15',
        expiryDate: '2025-01-15',
        documentUrl: '/docs/cert001.pdf',
        verified: true
      },
      {
        id: 'cert002',
        name: 'Primeros Auxilios',
        issuer: 'Cruz Roja',
        issueDate: '2023-06-10',
        expiryDate: '2025-06-10',
        documentUrl: '/docs/cert002.pdf',
        verified: true
      }
    ],
    
    availability: {
      calendar: {},
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      advanceBooking: 2
    },
    
    pricing: {
      hourlyRate: 30,
      fullDayRate: 200,
      halfDayRate: 120,
      specialRates: [
        { groupType: 'vip', rate: 50 },
        { groupType: 'children', rate: 25 }
      ]
    },
    
    marketplaceStats: {
      totalBookings: 156,
      completedServices: 150,
      cancelledServices: 6,
      responseTime: 30,
      acceptanceRate: 85,
      repeatClients: 45,
      totalEarnings: 25000,
      joinedDate: '2019-03-15'
    },
    
    ratings: {
      overall: 4.8,
      communication: 4.9,
      knowledge: 4.8,
      punctuality: 4.7,
      professionalism: 4.9,
      valueForMoney: 4.6,
      totalReviews: 89,
      reviews: []
    },
    
    preferences: {
      maxGroupSize: 20,
      minBookingHours: 2,
      cancellationPolicy: '24 horas de anticipación',
      instantBooking: true,
      requiresDeposit: true,
      depositPercentage: 30
    },
    
    marketplaceStatus: {
      active: true,
      verified: true,
      featured: true,
      suspendedUntil: null,
      verificationDocuments: ['dni', 'carnet', 'certificados']
    }
  },
  {
    id: 'guide002',
    fullName: 'Carlos Alberto Mendoza Silva',
    dni: '87654321',
    phone: '+51 987 654 322',
    email: 'carlos.mendoza@gmail.com',
    address: 'Jr. Lima 456, Cusco',
    guideType: 'freelance',
    
    profile: {
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Mendoza&background=0D8ABC&color=fff',
      bio: 'Especialista en turismo de aventura y fotografía. 8 años guiando expediciones a Machu Picchu y rutas alternativas.',
      photos: [
        'https://picsum.photos/400/300?random=4',
        'https://picsum.photos/400/300?random=5'
      ],
      videoPresentation: null
    },
    
    specializations: {
      languages: [
        { code: 'es', level: 'nativo', certified: true, certificationDate: '2016-01-10' },
        { code: 'en', level: 'experto', certified: true, certificationDate: '2017-05-15' },
        { code: 'de', level: 'avanzado', certified: true, certificationDate: '2018-09-20' }
      ],
      tourTypes: ['aventura', 'fotografico', 'cultural'],
      workZones: ['machu-picchu', 'valle-sagrado', 'otros'],
      groupExperience: {
        children: { level: 'basico', yearsExperience: 1 },
        schools: { level: 'basico', yearsExperience: 1 },
        elderly: { level: 'intermedio', yearsExperience: 3 },
        corporate: { level: 'experto', yearsExperience: 5 },
        vip: { level: 'experto', yearsExperience: 6 },
        specialNeeds: { level: 'intermedio', yearsExperience: 2 }
      }
    },
    
    certifications: [
      {
        id: 'cert003',
        name: 'Guía de Alta Montaña',
        issuer: 'AGMP',
        issueDate: '2018-03-20',
        expiryDate: '2024-03-20',
        documentUrl: '/docs/cert003.pdf',
        verified: true
      }
    ],
    
    availability: {
      calendar: {},
      workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      advanceBooking: 3
    },
    
    pricing: {
      hourlyRate: 40,
      fullDayRate: 280,
      halfDayRate: 150,
      specialRates: [
        { groupType: 'vip', rate: 60 },
        { groupType: 'corporate', rate: 50 }
      ]
    },
    
    marketplaceStats: {
      totalBookings: 234,
      completedServices: 230,
      cancelledServices: 4,
      responseTime: 45,
      acceptanceRate: 90,
      repeatClients: 78,
      totalEarnings: 45000,
      joinedDate: '2016-08-20'
    },
    
    ratings: {
      overall: 4.9,
      communication: 4.8,
      knowledge: 5.0,
      punctuality: 4.9,
      professionalism: 5.0,
      valueForMoney: 4.7,
      totalReviews: 156,
      reviews: []
    },
    
    preferences: {
      maxGroupSize: 15,
      minBookingHours: 4,
      cancellationPolicy: '48 horas de anticipación',
      instantBooking: false,
      requiresDeposit: true,
      depositPercentage: 50
    },
    
    marketplaceStatus: {
      active: true,
      verified: true,
      featured: false,
      suspendedUntil: null,
      verificationDocuments: ['dni', 'carnet', 'certificados', 'seguro']
    }
  }
];

// Mock service requests
const mockServiceRequests = [
  {
    id: 'req001',
    requestCode: 'SR-2024-001',
    agencyId: 'agency1',
    guideId: 'guide001',
    
    serviceDetails: {
      type: 'tour',
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '13:00',
      duration: 4,
      location: 'Centro Histórico Cusco',
      tourName: 'City Tour Cusco',
      groupSize: 12,
      groupType: 'mixed',
      specialRequirements: 'Grupo con 2 personas vegetarianas',
      languages: ['es', 'en']
    },
    
    pricing: {
      proposedRate: 120,
      finalRate: 120,
      paymentTerms: 'Pago al finalizar el servicio',
      currency: 'USD'
    },
    
    status: 'completed',
    
    timeline: {
      requestedAt: '2024-02-10T10:00:00Z',
      respondedAt: '2024-02-10T10:30:00Z',
      acceptedAt: '2024-02-10T11:00:00Z',
      completedAt: '2024-02-15T13:30:00Z'
    },
    
    messages: [
      {
        from: 'agency',
        message: 'Necesitamos un guía para city tour mañana',
        timestamp: '2024-02-10T10:00:00Z'
      },
      {
        from: 'guide',
        message: 'Disponible, confirmo el servicio',
        timestamp: '2024-02-10T10:30:00Z'
      }
    ],
    
    completion: {
      actualStartTime: '09:00',
      actualEndTime: '13:15',
      incidents: [],
      photos: ['photo1.jpg', 'photo2.jpg']
    }
  }
];

// Mock reviews
const mockReviews = [
  {
    id: 'review001',
    serviceRequestId: 'req001',
    guideId: 'guide001',
    agencyId: 'agency1',
    
    ratings: {
      overall: 5,
      communication: 5,
      knowledge: 5,
      punctuality: 4,
      professionalism: 5,
      valueForMoney: 5
    },
    
    review: {
      title: 'Excelente guía, muy profesional',
      content: 'María demostró un conocimiento profundo de la historia de Cusco. Fue muy amable con el grupo y manejó perfectamente los dos idiomas. La recomendaremos para futuros tours.',
      wouldRecommend: true,
      wouldHireAgain: true
    },
    
    response: {
      content: 'Gracias por la confianza. Fue un placer guiar a su grupo.',
      timestamp: '2024-02-16T09:00:00Z'
    },
    
    metadata: {
      serviceType: 'tour',
      serviceDate: '2024-02-15',
      groupSize: 12,
      verified: true,
      helpful: 5,
      createdAt: '2024-02-15T18:00:00Z',
      updatedAt: '2024-02-15T18:00:00Z'
    }
  }
];

const useMarketplaceStore = create((set, get) => ({
  // Estado
  freelanceGuides: mockFreelanceGuides,
  serviceRequests: mockServiceRequests,
  reviews: mockReviews,
  workZones,
  tourTypes,
  groupTypes,
  
  // Filtros activos
  activeFilters: {
    languages: [],
    tourTypes: [],
    workZones: [],
    groupTypes: [],
    priceRange: { min: 0, max: 500 },
    rating: 0,
    availability: null,
    instantBooking: false,
    verified: false
  },
  
  // Búsqueda
  searchQuery: '',
  sortBy: 'rating', // rating, price, experience, reviews
  
  // Acciones
  searchGuides: (query) => {
    set({ searchQuery: query });
  },
  
  setFilters: (filters) => {
    set({ activeFilters: { ...get().activeFilters, ...filters } });
  },
  
  clearFilters: () => {
    set({
      activeFilters: {
        languages: [],
        tourTypes: [],
        workZones: [],
        groupTypes: [],
        priceRange: { min: 0, max: 500 },
        rating: 0,
        availability: null,
        instantBooking: false,
        verified: false
      },
      searchQuery: ''
    });
  },
  
  setSortBy: (sortBy) => {
    set({ sortBy });
  },
  
  // Obtener guías filtrados
  getFilteredGuides: () => {
    const { freelanceGuides, activeFilters, searchQuery, sortBy } = get();
    
    let filtered = freelanceGuides.filter(guide => {
      // Solo guías activos
      if (!guide.marketplaceStatus.active) return false;
      
      // Búsqueda por texto
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          guide.fullName.toLowerCase().includes(query) ||
          guide.profile.bio.toLowerCase().includes(query) ||
          guide.specializations.tourTypes.some(type => type.includes(query));
        if (!matchesSearch) return false;
      }
      
      // Filtro por idiomas
      if (activeFilters.languages.length > 0) {
        const hasLanguage = activeFilters.languages.some(lang =>
          guide.specializations.languages.some(guideLang => guideLang.code === lang)
        );
        if (!hasLanguage) return false;
      }
      
      // Filtro por tipos de tour
      if (activeFilters.tourTypes.length > 0) {
        const hasTourType = activeFilters.tourTypes.some(type =>
          guide.specializations.tourTypes.includes(type)
        );
        if (!hasTourType) return false;
      }
      
      // Filtro por zonas de trabajo
      if (activeFilters.workZones.length > 0) {
        const hasWorkZone = activeFilters.workZones.some(zone =>
          guide.specializations.workZones.includes(zone)
        );
        if (!hasWorkZone) return false;
      }
      
      // Filtro por tipos de grupo
      if (activeFilters.groupTypes.length > 0) {
        const hasGroupExperience = activeFilters.groupTypes.some(type =>
          guide.specializations.groupExperience[type] &&
          guide.specializations.groupExperience[type].level !== 'basico'
        );
        if (!hasGroupExperience) return false;
      }
      
      // Filtro por rango de precio
      if (guide.pricing.hourlyRate < activeFilters.priceRange.min ||
          guide.pricing.hourlyRate > activeFilters.priceRange.max) {
        return false;
      }
      
      // Filtro por calificación mínima
      if (guide.ratings.overall < activeFilters.rating) {
        return false;
      }
      
      // Filtro por reserva instantánea
      if (activeFilters.instantBooking && !guide.preferences.instantBooking) {
        return false;
      }
      
      // Filtro por verificado
      if (activeFilters.verified && !guide.marketplaceStatus.verified) {
        return false;
      }
      
      return true;
    });
    
    // Ordenar resultados
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.ratings.overall - a.ratings.overall;
        case 'price':
          return a.pricing.hourlyRate - b.pricing.hourlyRate;
        case 'experience':
          return b.marketplaceStats.totalBookings - a.marketplaceStats.totalBookings;
        case 'reviews':
          return b.ratings.totalReviews - a.ratings.totalReviews;
        default:
          return 0;
      }
    });
    
    return filtered;
  },
  
  // Obtener guía por ID
  getGuideById: (guideId) => {
    const { freelanceGuides } = get();
    return freelanceGuides.find(guide => guide.id === guideId);
  },
  
  // Obtener reseñas de un guía
  getGuideReviews: (guideId) => {
    const { reviews } = get();
    return reviews.filter(review => review.guideId === guideId);
  },
  
  // Crear solicitud de servicio
  createServiceRequest: (requestData) => {
    const newRequest = {
      id: `req${Date.now()}`,
      requestCode: `SR-2024-${String(get().serviceRequests.length + 1).padStart(3, '0')}`,
      ...requestData,
      status: 'pending',
      timeline: {
        requestedAt: new Date().toISOString()
      },
      messages: []
    };
    
    set(state => ({
      serviceRequests: [...state.serviceRequests, newRequest]
    }));
    
    return newRequest;
  },
  
  // Actualizar solicitud de servicio
  updateServiceRequest: (requestId, updates) => {
    set(state => ({
      serviceRequests: state.serviceRequests.map(req =>
        req.id === requestId ? { ...req, ...updates } : req
      )
    }));
  },
  
  // Agregar mensaje a solicitud
  addMessageToRequest: (requestId, message) => {
    set(state => ({
      serviceRequests: state.serviceRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              messages: [...req.messages, { ...message, timestamp: new Date().toISOString() }]
            }
          : req
      )
    }));
  },
  
  // Crear reseña
  createReview: (reviewData) => {
    const newReview = {
      id: `review${Date.now()}`,
      ...reviewData,
      metadata: {
        ...reviewData.metadata,
        verified: true,
        helpful: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    set(state => ({
      reviews: [...state.reviews, newReview]
    }));
    
    // Actualizar estadísticas del guía
    const guide = get().getGuideById(reviewData.guideId);
    if (guide) {
      const allReviews = [...get().reviews, newReview].filter(r => r.guideId === reviewData.guideId);
      const avgRating = allReviews.reduce((acc, r) => acc + r.ratings.overall, 0) / allReviews.length;
      
      set(state => ({
        freelanceGuides: state.freelanceGuides.map(g =>
          g.id === reviewData.guideId
            ? {
                ...g,
                ratings: {
                  ...g.ratings,
                  overall: avgRating,
                  totalReviews: allReviews.length
                }
              }
            : g
        )
      }));
    }
    
    return newReview;
  },
  
  // Obtener estadísticas del marketplace
  getMarketplaceStats: () => {
    const { freelanceGuides, serviceRequests, reviews } = get();
    
    return {
      totalGuides: freelanceGuides.length,
      activeGuides: freelanceGuides.filter(g => g.marketplaceStatus.active).length,
      verifiedGuides: freelanceGuides.filter(g => g.marketplaceStatus.verified).length,
      totalRequests: serviceRequests.length,
      completedRequests: serviceRequests.filter(r => r.status === 'completed').length,
      totalReviews: reviews.length,
      averageRating: freelanceGuides.reduce((acc, g) => acc + g.ratings.overall, 0) / freelanceGuides.length
    };
  }
}));

export { useMarketplaceStore };
export default useMarketplaceStore;