// Datos mock para desarrollo y pruebas

export const mockTours = [
  {
    id: '1',
    code: 'TL001',
    name: 'City Tour Lima Histórica',
    description: 'Recorrido por el centro histórico de Lima, visitando los principales monumentos y museos',
    duration: 4,
    price: 35,
    capacity: 20,
    includes: ['Transporte', 'Guía profesional', 'Entradas a museos', 'Snack'],
    itinerary: [
      { time: '09:00', activity: 'Recojo en hotel' },
      { time: '09:30', activity: 'Plaza de Armas' },
      { time: '10:30', activity: 'Catedral de Lima' },
      { time: '11:30', activity: 'Palacio de Gobierno' },
      { time: '12:30', activity: 'Museo de Arte' },
      { time: '13:00', activity: 'Retorno al hotel' }
    ],
    images: ['/tours/lima-historica-1.jpg', '/tours/lima-historica-2.jpg'],
    rating: 4.8,
    reviews: 156,
    category: 'cultural',
    difficulty: 'fácil',
    languages: ['Español', 'Inglés', 'Portugués']
  },
  {
    id: '2',
    code: 'TG001',
    name: 'Tour Gastronómico Miraflores',
    description: 'Experiencia culinaria por los mejores restaurantes y mercados de Miraflores',
    duration: 5,
    price: 65,
    capacity: 12,
    includes: ['Transporte', 'Guía gastronómico', 'Degustaciones', 'Bebidas'],
    itinerary: [
      { time: '11:00', activity: 'Mercado de Surquillo' },
      { time: '12:00', activity: 'Clase de ceviche' },
      { time: '13:00', activity: 'Almuerzo en restaurante 5 estrellas' },
      { time: '15:00', activity: 'Degustación de piscos' },
      { time: '16:00', activity: 'Dulces tradicionales' }
    ],
    images: ['/tours/gastronomico-1.jpg', '/tours/gastronomico-2.jpg'],
    rating: 4.9,
    reviews: 203,
    category: 'gastronómico',
    difficulty: 'fácil',
    languages: ['Español', 'Inglés']
  },
  {
    id: '3',
    code: 'IP001',
    name: 'Islas Palomino - Lobos Marinos',
    description: 'Aventura marina nadando con lobos marinos en las Islas Palomino',
    duration: 8,
    price: 85,
    capacity: 15,
    includes: ['Transporte', 'Embarcación', 'Traje de neopreno', 'Guía marino', 'Almuerzo', 'Seguro'],
    itinerary: [
      { time: '06:00', activity: 'Recojo en hotel' },
      { time: '07:00', activity: 'Llegada al Callao' },
      { time: '08:00', activity: 'Navegación a Islas Palomino' },
      { time: '10:00', activity: 'Nado con lobos marinos' },
      { time: '12:00', activity: 'Almuerzo a bordo' },
      { time: '14:00', activity: 'Retorno al puerto' }
    ],
    images: ['/tours/palomino-1.jpg', '/tours/palomino-2.jpg'],
    rating: 4.7,
    reviews: 342,
    category: 'aventura',
    difficulty: 'moderado',
    languages: ['Español', 'Inglés', 'Francés']
  },
  {
    id: '4',
    code: 'PB001',
    name: 'Pachacámac y Barranco Bohemio',
    description: 'Visita al santuario arqueológico de Pachacámac y tour por el distrito bohemio de Barranco',
    duration: 6,
    price: 45,
    capacity: 18,
    includes: ['Transporte', 'Guía arqueológico', 'Entradas', 'Almuerzo'],
    itinerary: [
      { time: '09:00', activity: 'Recojo en hotel' },
      { time: '10:00', activity: 'Santuario de Pachacámac' },
      { time: '12:00', activity: 'Museo de sitio' },
      { time: '13:00', activity: 'Almuerzo tradicional' },
      { time: '14:30', activity: 'Tour por Barranco' },
      { time: '16:00', activity: 'Puente de los Suspiros' }
    ],
    images: ['/tours/pachacamac-1.jpg', '/tours/barranco-1.jpg'],
    rating: 4.6,
    reviews: 189,
    category: 'cultural',
    difficulty: 'fácil',
    languages: ['Español', 'Inglés']
  }
];

export const mockGuides = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@futurismo.com',
    phone: '+51 987654321',
    avatar: 'https://i.pravatar.cc/150?img=1',
    languages: ['Español', 'Inglés', 'Portugués'],
    specialties: ['Historia', 'Arqueología', 'Cultura'],
    rating: 4.8,
    experience: 8,
    certifications: ['Guía Oficial MINCETUR', 'Primeros Auxilios'],
    availability: 'disponible',
    tours: ['TL001', 'PB001'],
    stats: {
      totalTours: 456,
      thisMonth: 23,
      punctuality: 98,
      satisfaction: 96
    }
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria.garcia@futurismo.com',
    phone: '+51 976543210',
    avatar: 'https://i.pravatar.cc/150?img=2',
    languages: ['Español', 'Inglés'],
    specialties: ['Gastronomía', 'Cultura', 'Historia'],
    rating: 4.9,
    experience: 5,
    certifications: ['Guía Oficial MINCETUR', 'Sommelier'],
    availability: 'disponible',
    tours: ['TG001', 'TL001'],
    stats: {
      totalTours: 312,
      thisMonth: 18,
      punctuality: 99,
      satisfaction: 98
    }
  },
  {
    id: '3',
    name: 'Juan Pérez',
    email: 'juan.perez@futurismo.com',
    phone: '+51 965432198',
    avatar: 'https://i.pravatar.cc/150?img=3',
    languages: ['Español', 'Inglés', 'Francés'],
    specialties: ['Aventura', 'Naturaleza', 'Deportes'],
    rating: 4.7,
    experience: 10,
    certifications: ['Guía Oficial MINCETUR', 'Buceo PADI', 'Rescate Acuático'],
    availability: 'ocupado',
    tours: ['IP001'],
    stats: {
      totalTours: 678,
      thisMonth: 28,
      punctuality: 95,
      satisfaction: 94
    }
  }
];

export const mockClients = [
  {
    id: '1',
    type: 'agency',
    name: 'Viajes El Dorado SAC',
    contact: 'Ana López',
    email: 'ventas@viajeseldorado.com',
    phone: '+51 912345678',
    ruc: '20123456789',
    address: 'Av. Larco 345, Miraflores',
    creditLimit: 10000,
    creditUsed: 3500,
    status: 'activo',
    since: '2022-01-15',
    totalBookings: 156,
    totalRevenue: 45680,
    rating: 4.8,
    paymentTerms: 30
  },
  {
    id: '2',
    type: 'agency',
    name: 'Peru Travel Experience',
    contact: 'Roberto Díaz',
    email: 'roberto@perutravel.com',
    phone: '+51 923456789',
    ruc: '20987654321',
    address: 'Calle Las Begonias 456, San Isidro',
    creditLimit: 15000,
    creditUsed: 8200,
    status: 'activo',
    since: '2021-06-20',
    totalBookings: 234,
    totalRevenue: 78920,
    rating: 4.6,
    paymentTerms: 45
  },
  {
    id: '3',
    type: 'direct',
    name: 'Laura Martínez',
    email: 'laura.martinez@gmail.com',
    phone: '+51 934567890',
    dni: '12345678',
    nationality: 'Peruana',
    status: 'activo',
    since: '2023-03-10',
    totalBookings: 12,
    totalRevenue: 890,
    rating: 5.0,
    preferences: ['cultural', 'gastronómico']
  }
];

export const mockReservations = [
  {
    id: 'RES001',
    tourId: '1',
    tourName: 'City Tour Lima Histórica',
    clientId: '1',
    clientName: 'Viajes El Dorado SAC',
    clientContact: 'Ana López',
    clientEmail: 'ventas@viajeseldorado.com',
    clientPhone: '+51 912345678',
    date: new Date('2024-02-15'),
    time: '09:00',
    adults: 8,
    children: 2,
    total: 315,
    status: 'confirmada',
    pickupLocation: 'Hotel Marriott Miraflores',
    specialRequirements: 'Un turista es vegetariano',
    guideId: '1',
    guideName: 'Carlos Mendoza',
    createdAt: new Date('2024-02-01'),
    paymentStatus: 'pagado',
    paymentMethod: 'transferencia',
    commission: 31.5,
    notes: []
  },
  {
    id: 'RES002',
    tourId: '2',
    tourName: 'Tour Gastronómico Miraflores',
    clientId: '3',
    clientName: 'Laura Martínez',
    clientEmail: 'laura.martinez@gmail.com',
    clientPhone: '+51 934567890',
    date: new Date('2024-02-16'),
    time: '11:00',
    adults: 2,
    children: 0,
    total: 130,
    status: 'pendiente',
    pickupLocation: 'Parque Kennedy',
    specialRequirements: '',
    guideId: '2',
    guideName: 'María García',
    createdAt: new Date('2024-02-10'),
    paymentStatus: 'pendiente',
    paymentMethod: 'tarjeta',
    commission: 13,
    notes: ['Cliente frecuente', 'Prefiere comida picante']
  },
  {
    id: 'RES003',
    tourId: '3',
    tourName: 'Islas Palomino - Lobos Marinos',
    clientId: '2',
    clientName: 'Peru Travel Experience',
    clientContact: 'Roberto Díaz',
    clientEmail: 'roberto@perutravel.com',
    clientPhone: '+51 923456789',
    date: new Date('2024-02-18'),
    time: '06:00',
    adults: 12,
    children: 3,
    total: 1147.5,
    status: 'confirmada',
    pickupLocation: 'Hotel Hilton Lima',
    specialRequirements: 'Incluir almuerzo vegetariano para 2 personas',
    guideId: '3',
    guideName: 'Juan Pérez',
    createdAt: new Date('2024-02-05'),
    paymentStatus: 'pagado',
    paymentMethod: 'credito',
    commission: 114.75,
    notes: ['Grupo corporativo', 'Solicitan factura']
  }
];

export const mockNotifications = [
  {
    id: '1',
    type: 'info',
    title: 'Nueva reserva recibida',
    message: 'Reserva #RES004 para Tour Cusco Mágico',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    actionUrl: '/reservations?id=RES004'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Tour próximo a comenzar',
    message: 'City Tour Lima comienza en 30 minutos',
    timestamp: new Date(Date.now() - 600000),
    read: false,
    actionUrl: '/monitoring'
  },
  {
    id: '3',
    type: 'success',
    title: 'Pago confirmado',
    message: 'Se confirmó el pago de la reserva #RES002',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    actionUrl: '/reservations?id=RES002'
  },
  {
    id: '4',
    type: 'error',
    title: 'Error en sincronización',
    message: 'No se pudo sincronizar con el servidor',
    timestamp: new Date(Date.now() - 7200000),
    read: true
  }
];

export const mockStatistics = {
  daily: {
    date: new Date(),
    reservations: 8,
    tourists: 42,
    revenue: 2850,
    tours: 5,
    occupancy: 78
  },
  weekly: {
    reservations: 45,
    tourists: 286,
    revenue: 18920,
    tours: 32,
    occupancy: 82,
    trend: {
      reservations: 12,
      revenue: 15,
      occupancy: 5
    }
  },
  monthly: {
    reservations: 186,
    tourists: 1245,
    revenue: 82350,
    tours: 142,
    occupancy: 86,
    topTours: [
      { name: 'City Tour Lima', count: 45, revenue: 15750 },
      { name: 'Islas Palomino', count: 38, revenue: 32300 },
      { name: 'Tour Gastronómico', count: 32, revenue: 20800 }
    ],
    topGuides: [
      { name: 'Juan Pérez', tours: 48, rating: 4.7 },
      { name: 'María García', tours: 42, rating: 4.9 },
      { name: 'Carlos Mendoza', tours: 36, rating: 4.8 }
    ]
  }
};

export const mockMessages = [
  {
    id: '1',
    conversationId: 'conv-1',
    senderId: 'guide-1',
    senderName: 'Carlos Mendoza',
    senderAvatar: 'https://i.pravatar.cc/150?img=1',
    recipientId: 'admin',
    content: 'Ya estamos saliendo del hotel con el grupo',
    timestamp: new Date(Date.now() - 300000),
    type: 'text',
    status: 'delivered',
    attachments: []
  },
  {
    id: '2',
    conversationId: 'conv-1',
    senderId: 'admin',
    senderName: 'Admin',
    recipientId: 'guide-1',
    content: 'Perfecto Carlos, manténnos informados',
    timestamp: new Date(Date.now() - 240000),
    type: 'text',
    status: 'read',
    attachments: []
  },
  {
    id: '3',
    conversationId: 'conv-2',
    senderId: 'client-1',
    senderName: 'Ana López',
    senderAvatar: 'https://i.pravatar.cc/150?img=5',
    recipientId: 'admin',
    content: '¿Podrían confirmar la reserva para mañana?',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text',
    status: 'read',
    attachments: []
  }
];

// Función helper para obtener datos mock con filtros
export const getMockData = {
  tours: (filters = {}) => {
    let result = [...mockTours];
    if (filters.category) {
      result = result.filter(tour => tour.category === filters.category);
    }
    if (filters.priceRange) {
      result = result.filter(tour => 
        tour.price >= filters.priceRange.min && 
        tour.price <= filters.priceRange.max
      );
    }
    return result;
  },
  
  guides: (filters = {}) => {
    let result = [...mockGuides];
    if (filters.availability) {
      result = result.filter(guide => guide.availability === filters.availability);
    }
    if (filters.language) {
      result = result.filter(guide => guide.languages.includes(filters.language));
    }
    return result;
  },
  
  reservations: (filters = {}) => {
    let result = [...mockReservations];
    if (filters.status) {
      result = result.filter(res => res.status === filters.status);
    }
    if (filters.dateRange) {
      result = result.filter(res => 
        res.date >= filters.dateRange.start && 
        res.date <= filters.dateRange.end
      );
    }
    if (filters.clientId) {
      result = result.filter(res => res.clientId === filters.clientId);
    }
    return result;
  },
  
  statistics: (period = 'monthly') => {
    return mockStatistics[period] || mockStatistics.monthly;
  }
};

// Simulador de actualizaciones en tiempo real
export const mockRealtimeUpdates = {
  tourProgress: (tourId) => {
    const stops = [
      { name: 'Hotel', completed: true, time: '09:00' },
      { name: 'Plaza de Armas', completed: true, time: '09:30' },
      { name: 'Catedral', completed: false, time: '10:30' },
      { name: 'Palacio', completed: false, time: '11:30' }
    ];
    
    return {
      tourId,
      progress: 50,
      currentStop: 'Catedral de Lima',
      nextStop: 'Palacio de Gobierno',
      estimatedDelay: 0,
      touristsPresent: 12,
      stops
    };
  },
  
  guideLocation: (guideId) => {
    // Simular movimiento aleatorio cerca del centro de Lima
    const baseLat = -12.0464;
    const baseLng = -77.0428;
    const randomOffset = () => (Math.random() - 0.5) * 0.01;
    
    return {
      guideId,
      lat: baseLat + randomOffset(),
      lng: baseLng + randomOffset(),
      speed: Math.random() * 30 + 10,
      heading: Math.random() * 360,
      accuracy: 10,
      timestamp: new Date()
    };
  }
};

export default {
  tours: mockTours,
  guides: mockGuides,
  clients: mockClients,
  reservations: mockReservations,
  notifications: mockNotifications,
  statistics: mockStatistics,
  messages: mockMessages,
  getMockData,
  mockRealtimeUpdates
};