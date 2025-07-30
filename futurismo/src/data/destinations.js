// Coordenadas reales de destinos turísticos en Cusco
export const destinations = {
  // Sitios arqueológicos principales
  'machu-picchu': {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    city: 'Aguas Calientes',
    region: 'Cusco',
    coordinates: [-13.1631, -72.5450],
    type: 'archaeological',
    description: 'Ciudad Inca, Patrimonio de la Humanidad'
  },
  'sacsayhuaman': {
    id: 'sacsayhuaman',
    name: 'Sacsayhuamán',
    city: 'Cusco',
    region: 'Cusco',
    coordinates: [-13.5083, -71.9825],
    type: 'archaeological',
    description: 'Fortaleza ceremonial Inca'
  },
  'qenqo': {
    id: 'qenqo',
    name: 'Qenqo',
    city: 'Cusco',
    region: 'Cusco',
    coordinates: [-13.5067, -71.9700],
    type: 'archaeological',
    description: 'Centro ceremonial Inca'
  },
  'tambomachay': {
    id: 'tambomachay',
    name: 'Tambomachay',
    city: 'Cusco',
    region: 'Cusco',
    coordinates: [-13.4833, -71.9667],
    type: 'archaeological',
    description: 'Baños del Inca'
  },
  'pisac': {
    id: 'pisac',
    name: 'Pisac',
    city: 'Pisac',
    region: 'Cusco',
    coordinates: [-13.4150, -71.8497],
    type: 'archaeological',
    description: 'Complejo arqueológico y mercado'
  },
  'ollantaytambo': {
    id: 'ollantaytambo',
    name: 'Ollantaytambo',
    city: 'Ollantaytambo',
    region: 'Cusco',
    coordinates: [-13.2572, -72.2636],
    type: 'archaeological',
    description: 'Fortaleza y pueblo Inca viviente'
  },
  'chinchero': {
    id: 'chinchero',
    name: 'Chinchero',
    city: 'Chinchero',
    region: 'Cusco',
    coordinates: [-13.3928, -72.0470],
    type: 'archaeological',
    description: 'Pueblo tradicional y sitio arqueológico'
  },
  'moray': {
    id: 'moray',
    name: 'Moray',
    city: 'Maras',
    region: 'Cusco',
    coordinates: [-13.3297, -72.1961],
    type: 'archaeological',
    description: 'Laboratorio agrícola Inca'
  },
  'maras': {
    id: 'maras',
    name: 'Salineras de Maras',
    city: 'Maras',
    region: 'Cusco',
    coordinates: [-13.3000, -72.1556],
    type: 'natural',
    description: 'Minas de sal milenarias'
  },
  
  // Lagos y montañas
  'humantay': {
    id: 'humantay',
    name: 'Laguna Humantay',
    city: 'Soraypampa',
    region: 'Cusco',
    coordinates: [-13.4000, -72.8833],
    type: 'natural',
    description: 'Laguna turquesa de alta montaña'
  },
  'siete-lagunas': {
    id: 'siete-lagunas',
    name: 'Siete Lagunas',
    city: 'Canchis',
    region: 'Cusco',
    coordinates: [-13.8667, -71.2833],
    type: 'natural',
    description: 'Complejo de lagunas alto andinas'
  },
  'vinicunca': {
    id: 'vinicunca',
    name: 'Montaña de 7 Colores',
    city: 'Pitumarca',
    region: 'Cusco',
    coordinates: [-13.8667, -71.3000],
    type: 'natural',
    description: 'Montaña Arcoíris, fenómeno geológico'
  },
  'palccoyo': {
    id: 'palccoyo',
    name: 'Palccoyo',
    city: 'Checacupe',
    region: 'Cusco',
    coordinates: [-13.8706, -71.3778],
    type: 'natural',
    description: 'Montaña de colores alternativa'
  },
  
  // Puntos de referencia urbanos
  'plaza-armas': {
    id: 'plaza-armas',
    name: 'Plaza de Armas',
    city: 'Cusco',
    region: 'Cusco',
    coordinates: [-13.5169, -71.9788],
    type: 'urban',
    description: 'Centro histórico de Cusco'
  },
  'san-blas': {
    id: 'san-blas',
    name: 'Barrio San Blas',
    city: 'Cusco',
    region: 'Cusco',
    coordinates: [-13.5153, -71.9744],
    type: 'urban',
    description: 'Barrio de artesanos'
  },
  'qorikancha': {
    id: 'qorikancha',
    name: 'Qorikancha',
    city: 'Cusco',
    region: 'Cusco',
    coordinates: [-13.5199, -71.9753],
    type: 'archaeological',
    description: 'Templo del Sol Inca'
  },
  'san-pedro': {
    id: 'san-pedro',
    name: 'Mercado San Pedro',
    city: 'Cusco',
    region: 'Cusco',
    coordinates: [-13.5222, -71.9825],
    type: 'urban',
    description: 'Mercado tradicional'
  },
  
  // Rutas de trekking
  'salkantay': {
    id: 'salkantay',
    name: 'Nevado Salkantay',
    city: 'Mollepata',
    region: 'Cusco',
    coordinates: [-13.3333, -72.5447],
    type: 'trekking',
    description: 'Trek alternativo a Machu Picchu'
  },
  'choquequirao': {
    id: 'choquequirao',
    name: 'Choquequirao',
    city: 'Santa Teresa',
    region: 'Cusco',
    coordinates: [-13.3933, -72.8736],
    type: 'archaeological',
    description: 'Ciudad Inca hermana de Machu Picchu'
  },
  'lares': {
    id: 'lares',
    name: 'Valle de Lares',
    city: 'Lares',
    region: 'Cusco',
    coordinates: [-13.1050, -72.0450],
    type: 'trekking',
    description: 'Trek cultural y termal'
  }
};

// Rutas comunes de tours
export const tourRoutes = {
  'city-tour': {
    name: 'City Tour Clásico',
    destinations: ['plaza-armas', 'qorikancha', 'sacsayhuaman', 'qenqo', 'tambomachay'],
    duration: '4 horas',
    type: 'cultural'
  },
  'valle-sagrado': {
    name: 'Valle Sagrado',
    destinations: ['pisac', 'ollantaytambo', 'chinchero'],
    duration: '8 horas',
    type: 'cultural'
  },
  'maras-moray': {
    name: 'Maras y Moray',
    destinations: ['moray', 'maras'],
    duration: '4 horas',
    type: 'cultural'
  },
  'montaña-colores': {
    name: 'Montaña de 7 Colores',
    destinations: ['vinicunca'],
    duration: '12 horas',
    type: 'aventura'
  },
  'laguna-humantay': {
    name: 'Laguna Humantay',
    destinations: ['humantay'],
    duration: '12 horas',
    type: 'aventura'
  },
  'machu-picchu-1d': {
    name: 'Machu Picchu Full Day',
    destinations: ['machu-picchu'],
    duration: '14 horas',
    type: 'cultural'
  }
};

// Centro de Cusco (punto de referencia para cálculos)
export const cuscoCenter = {
  lat: -13.5169,
  lng: -71.9788
};

// Función para obtener destino por ID
export const getDestination = (id) => {
  return destinations[id] || null;
};

// Función para obtener coordenadas por ID
export const getCoordinates = (destinationId) => {
  const destination = destinations[destinationId];
  return destination ? destination.coordinates : null;
};

// Función para obtener destinos por tipo
export const getDestinationsByType = (type) => {
  return Object.values(destinations).filter(dest => dest.type === type);
};

// Función para obtener la ruta de un tour
export const getTourRoute = (routeId) => {
  return tourRoutes[routeId] || null;
};

// Función para obtener las coordenadas de una ruta completa
export const getRouteCoordinates = (routeId) => {
  const route = tourRoutes[routeId];
  if (!route) return [];
  
  return route.destinations
    .map(destId => destinations[destId])
    .filter(dest => dest)
    .map(dest => ({
      id: dest.id,
      name: dest.name,
      coordinates: dest.coordinates
    }));
};