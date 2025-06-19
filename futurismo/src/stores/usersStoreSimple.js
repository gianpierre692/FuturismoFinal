import { create } from 'zustand';

// Datos mock simples integrados en el store
const mockUsersData = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@futurismo.com',
    firstName: 'Carlos',
    lastName: 'Administrator',
    role: 'administrador',
    status: 'activo',
    avatar: 'https://i.pravatar.cc/150?img=7',
    phone: '+51 999999999',
    company: 'Futurismo Tours',
    position: 'Administrador del Sistema',
    lastLogin: new Date('2024-02-14T10:30:00'),
    createdAt: new Date('2023-01-15'),
    permissions: [
      'users.manage', 'guides.manage', 'agencies.manage', 'reservations.manage', 
      'monitoring.full', 'reports.all', 'system.admin'
    ]
  },
  {
    id: 'user-2',
    username: 'agencia_eldorado',
    email: 'ventas@viajeseldorado.com',
    firstName: 'Ana',
    lastName: 'López',
    role: 'agencia',
    status: 'activo',
    avatar: 'https://i.pravatar.cc/150?img=8',
    phone: '+51 912345678',
    company: 'Viajes El Dorado SAC',
    position: 'Gerente de Ventas',
    ruc: '20123456789',
    address: 'Av. Larco 345, Miraflores',
    creditLimit: 10000,
    creditUsed: 3500,
    lastLogin: new Date('2024-02-14T09:15:00'),
    createdAt: new Date('2023-03-20'),
    permissions: [
      'reservations.create', 'reservations.read', 'reservations.update',
      'monitoring.own', 'reports.basic', 'chat.access'
    ]
  },
  {
    id: 'user-3',
    username: 'guia_carlos',
    email: 'carlos.mendoza@futurismo.com',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    role: 'guia',
    status: 'activo',
    avatar: 'https://i.pravatar.cc/150?img=9',
    phone: '+51 987654321',
    company: 'Futurismo Tours',
    position: 'Guía Turístico',
    guideType: 'planta', // planta o freelance
    languages: ['Español', 'Inglés', 'Portugués'],
    specialties: ['Historia', 'Arqueología', 'Cultura'],
    certifications: ['Guía Oficial MINCETUR', 'Primeros Auxilios'],
    experience: 8,
    rating: 4.8,
    lastLogin: new Date('2024-02-14T08:45:00'),
    createdAt: new Date('2023-06-10'),
    permissions: [
      'tours.execute', 'monitoring.own', 'chat.access', 'reports.own'
    ]
  },
  {
    id: 'user-4',
    username: 'agencia_perutravel',
    email: 'roberto@perutravel.com',
    firstName: 'Roberto',
    lastName: 'Díaz',
    role: 'agencia',
    status: 'activo',
    avatar: 'https://i.pravatar.cc/150?img=10',
    phone: '+51 923456789',
    company: 'Peru Travel Experience',
    position: 'Director Comercial',
    ruc: '20987654321',
    address: 'Calle Las Begonias 456, San Isidro',
    creditLimit: 15000,
    creditUsed: 8200,
    lastLogin: new Date('2024-02-13T16:30:00'),
    createdAt: new Date('2021-06-20'),
    permissions: [
      'reservations.create', 'reservations.read', 'reservations.update',
      'monitoring.own', 'reports.basic', 'chat.access'
    ]
  },
  {
    id: 'user-5',
    username: 'guia_ana',
    email: 'ana.rodriguez@gmail.com',
    firstName: 'Ana',
    lastName: 'Rodríguez',
    role: 'guia',
    status: 'activo',
    avatar: 'https://i.pravatar.cc/150?img=11',
    phone: '+51 954321987',
    company: 'Freelance',
    position: 'Guía Turístico Freelance',
    guideType: 'freelance', // planta o freelance
    languages: ['Español', 'Inglés'],
    specialties: ['Historia', 'Arte', 'Fotografía'],
    certifications: ['Guía Oficial MINCETUR'],
    experience: 6,
    rating: 4.6,
    agenda: {
      '2024-02-15': { disponible: true, horarios: ['09:00-13:00', '14:00-18:00'] },
      '2024-02-16': { disponible: true, horarios: ['09:00-17:00'] },
      '2024-02-17': { disponible: false, horarios: [] },
      '2024-02-18': { disponible: true, horarios: ['14:00-18:00'] }
    },
    lastLogin: new Date('2024-02-13T14:20:00'),
    createdAt: new Date('2023-08-15'),
    permissions: [
      'tours.execute', 'monitoring.own', 'chat.access', 'reports.own', 'agenda.manage'
    ]
  },
  {
    id: 'user-6',
    username: 'guia_freelance',
    email: 'guia@freelance.com',
    firstName: 'Miguel',
    lastName: 'Torres',
    role: 'guia',
    status: 'activo',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+51 965432187',
    company: 'Independiente',
    position: 'Guía Turístico Freelance',
    guideType: 'freelance',
    languages: ['Español', 'Inglés', 'Francés'],
    specialties: ['Aventura', 'Ecoturismo', 'Montañismo'],
    certifications: ['Guía Oficial MINCETUR', 'Rescate en Montaña', 'Primeros Auxilios'],
    experience: 12,
    rating: 4.9,
    agenda: {
      '2024-02-15': { disponible: true, horarios: ['06:00-12:00', '13:00-19:00'] },
      '2024-02-16': { disponible: true, horarios: ['07:00-15:00'] },
      '2024-02-17': { disponible: true, horarios: ['08:00-16:00'] },
      '2024-02-18': { disponible: false, horarios: [] },
      '2024-02-19': { disponible: true, horarios: ['06:00-18:00'] }
    },
    lastLogin: new Date('2024-02-14T07:30:00'),
    createdAt: new Date('2023-01-10'),
    permissions: [
      'tours.execute', 'monitoring.own', 'chat.access', 'reports.own', 'agenda.manage'
    ]
  }
];

const mockRoles = [
  { 
    id: 'administrador', 
    name: 'Administrador', 
    description: 'Gestiona todo el sistema, usuarios y configuraciones', 
    color: 'red',
    permissions: [
      'users.manage', 'guides.manage', 'agencies.manage', 'reservations.manage', 
      'monitoring.full', 'reports.all', 'system.admin'
    ]
  },
  { 
    id: 'agencia', 
    name: 'Agencia de Viajes', 
    description: 'Crea y gestiona reservas para sus clientes', 
    color: 'blue',
    permissions: [
      'reservations.create', 'reservations.read', 'reservations.update',
      'monitoring.own', 'reports.basic', 'chat.access'
    ]
  },
  { 
    id: 'guia', 
    name: 'Guía Turístico', 
    description: 'Ejecuta tours y gestiona su actividad', 
    color: 'green',
    permissions: [
      'tours.execute', 'monitoring.own', 'chat.access', 'reports.own'
    ]
  }
];

const useUsersStore = create((set, get) => ({
  // Estado
  users: mockUsersData,
  roles: mockRoles,
  isLoading: false,
  error: null,
  
  // Filtros
  filters: {
    role: '',
    status: '',
    guideType: '', // Para filtrar guías planta/freelance
    search: ''
  },

  // Acciones básicas
  getUsers: (filters = {}) => {
    const { users } = get();
    let filtered = [...users];
    
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }
    
    if (filters.guideType) {
      filtered = filtered.filter(user => user.role === 'guia' && user.guideType === filters.guideType);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        (user.company && user.company.toLowerCase().includes(searchTerm)) ||
        (user.ruc && user.ruc.includes(searchTerm))
      );
    }
    
    return filtered;
  },

  getFilteredUsers: () => {
    const { filters } = get();
    return get().getUsers(filters);
  },

  getUserById: (userId) => {
    const { users } = get();
    return users.find(user => user.id === userId);
  },

  createUser: (userData) => {
    set((state) => ({
      users: [...state.users, {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        lastLogin: null
      }]
    }));
  },

  updateUser: (userId, updates) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    }));
  },

  deleteUser: (userId) => {
    set((state) => ({
      users: state.users.filter(user => user.id !== userId)
    }));
  },

  toggleUserStatus: (userId) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { ...user, status: user.status === 'activo' ? 'inactivo' : 'activo' }
          : user
      )
    }));
  },

  getRoles: () => {
    const { roles } = get();
    return roles;
  },

  getUsersStatistics: () => {
    const { users } = get();
    
    const total = users.length;
    const active = users.filter(u => u.status === 'activo').length;
    const inactive = users.filter(u => u.status === 'inactivo').length;
    
    return {
      total,
      active,
      inactive,
      activeRate: total > 0 ? (active / total * 100).toFixed(1) : 0
    };
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        role: '',
        status: '',
        guideType: '',
        search: ''
      }
    });
  },

  // Funciones específicas por tipo de usuario
  getAdministrators: () => {
    const { users } = get();
    return users.filter(user => user.role === 'administrador');
  },

  getAgencies: () => {
    const { users } = get();
    return users.filter(user => user.role === 'agencia');
  },

  getGuides: (type = null) => {
    const { users } = get();
    const guides = users.filter(user => user.role === 'guia');
    if (type) {
      return guides.filter(guide => guide.guideType === type);
    }
    return guides;
  },

  getGuidesByType: () => {
    const { users } = get();
    const guides = users.filter(user => user.role === 'guia');
    return {
      planta: guides.filter(guide => guide.guideType === 'planta'),
      freelance: guides.filter(guide => guide.guideType === 'freelance')
    };
  },

  // Estadísticas específicas por rol
  getRoleStatistics: () => {
    const { users } = get();
    const total = users.length;
    const administradores = users.filter(u => u.role === 'administrador').length;
    const agencias = users.filter(u => u.role === 'agencia').length;
    const guias = users.filter(u => u.role === 'guia').length;
    const guiasPlanta = users.filter(u => u.role === 'guia' && u.guideType === 'planta').length;
    const guiasFreelance = users.filter(u => u.role === 'guia' && u.guideType === 'freelance').length;

    return {
      total,
      administradores,
      agencias,
      guias,
      guiasPlanta,
      guiasFreelance
    };
  },

  resetUserPassword: (userId) => {
    console.log(`Contraseña reseteada para usuario ${userId}`);
  },

  // Estados de carga
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export { useUsersStore };
export default useUsersStore;