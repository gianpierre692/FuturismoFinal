import { create } from 'zustand';
import mockData, { mockUsers, userRoles, systemPermissions } from '../data/mockData';

const { getMockData } = mockData;

const useUsersStore = create((set, get) => ({
  // Estado
  users: mockUsers,
  roles: userRoles,
  permissions: systemPermissions,
  currentUser: mockUsers[0], // Usuario admin por defecto
  isLoading: false,
  error: null,
  
  // Filtros y búsqueda
  filters: {
    role: '',
    status: '',
    department: '',
    search: ''
  },

  // Acciones para obtener usuarios
  getUsers: (filters = {}) => {
    return getMockData.users(filters);
  },

  // Obtener usuario por ID
  getUserById: (userId) => {
    const { users } = get();
    return users.find(user => user.id === userId);
  },

  // Obtener usuarios filtrados según filtros actuales
  getFilteredUsers: () => {
    const { filters } = get();
    return getMockData.users(filters);
  },

  // Crear nuevo usuario
  createUser: (userData) => {
    set((state) => {
      const newUser = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        lastLogin: null,
        status: userData.status || 'activo'
      };
      
      return {
        users: [...state.users, newUser],
        error: null
      };
    });
  },

  // Actualizar usuario existente
  updateUser: (userId, updates) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { ...user, ...updates, updatedAt: new Date() }
          : user
      ),
      error: null
    }));
  },

  // Eliminar usuario
  deleteUser: (userId) => {
    set((state) => ({
      users: state.users.filter(user => user.id !== userId),
      error: null
    }));
  },

  // Cambiar estado de usuario (activar/desactivar)
  toggleUserStatus: (userId) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { 
              ...user, 
              status: user.status === 'activo' ? 'inactivo' : 'activo',
              updatedAt: new Date()
            }
          : user
      )
    }));
  },

  // Resetear contraseña
  resetUserPassword: (userId, newPassword) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { 
              ...user, 
              passwordReset: true,
              passwordResetDate: new Date(),
              updatedAt: new Date()
            }
          : user
      )
    }));
  },

  // Actualizar permisos de usuario
  updateUserPermissions: (userId, permissions) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { ...user, permissions, updatedAt: new Date() }
          : user
      )
    }));
  },

  // Obtener roles disponibles
  getRoles: () => {
    const { roles } = get();
    return roles;
  },

  // Obtener rol por ID
  getRoleById: (roleId) => {
    const { roles } = get();
    return roles.find(role => role.id === roleId);
  },

  // Obtener permisos del sistema
  getSystemPermissions: () => {
    const { permissions } = get();
    return permissions;
  },

  // Obtener permisos agrupados por módulo
  getPermissionsByModule: () => {
    const { permissions } = get();
    const grouped = {};
    
    permissions.forEach(permission => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    
    return grouped;
  },

  // Verificar si un usuario tiene un permiso específico
  userHasPermission: (userId, permissionId) => {
    const user = get().getUserById(userId);
    return user?.permissions?.includes(permissionId) || false;
  },

  // Obtener permisos de un usuario
  getUserPermissions: (userId) => {
    const user = get().getUserById(userId);
    if (!user) return [];
    
    const { permissions } = get();
    return permissions.filter(permission => 
      user.permissions?.includes(permission.id)
    );
  },

  // Establecer filtros
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  // Limpiar filtros
  clearFilters: () => {
    set({
      filters: {
        role: '',
        status: '',
        department: '',
        search: ''
      }
    });
  },

  // Obtener estadísticas de usuarios
  getUsersStatistics: () => {
    const { users } = get();
    
    const total = users.length;
    const active = users.filter(u => u.status === 'activo').length;
    const inactive = users.filter(u => u.status === 'inactivo').length;
    
    // Usuarios por rol
    const byRole = {};
    users.forEach(user => {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
    });
    
    // Usuarios por departamento
    const byDepartment = {};
    users.forEach(user => {
      byDepartment[user.department] = (byDepartment[user.department] || 0) + 1;
    });
    
    // Últimos logins
    const recentLogins = users
      .filter(u => u.lastLogin)
      .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
      .slice(0, 5);
    
    return {
      total,
      active,
      inactive,
      activeRate: total > 0 ? (active / total * 100).toFixed(1) : 0,
      byRole,
      byDepartment,
      recentLogins
    };
  },

  // Buscar usuarios
  searchUsers: (searchTerm) => {
    set((state) => ({
      filters: { ...state.filters, search: searchTerm }
    }));
  },

  // Obtener usuarios por departamento
  getUsersByDepartment: (department) => {
    const { users } = get();
    return users.filter(user => user.department === department);
  },

  // Obtener usuarios por rol
  getUsersByRole: (role) => {
    const { users } = get();
    return users.filter(user => user.role === role);
  },

  // Actualizar último login
  updateLastLogin: (userId) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { ...user, lastLogin: new Date() }
          : user
      )
    }));
  },

  // Actualizar usuario actual
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  // Actualizar preferencias de usuario
  updateUserPreferences: (userId, preferences) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId 
          ? { 
              ...user, 
              preferences: { ...user.preferences, ...preferences },
              updatedAt: new Date()
            }
          : user
      )
    }));
  },

  // Validar datos de usuario
  validateUserData: (userData) => {
    const errors = {};
    
    if (!userData.username || userData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!userData.firstName || userData.firstName.trim().length === 0) {
      errors.firstName = 'El nombre es requerido';
    }
    
    if (!userData.lastName || userData.lastName.trim().length === 0) {
      errors.lastName = 'El apellido es requerido';
    }
    
    if (!userData.role) {
      errors.role = 'El rol es requerido';
    }
    
    if (!userData.department) {
      errors.department = 'El departamento es requerido';
    }
    
    // Verificar email único
    const { users } = get();
    const existingUser = users.find(user => 
      user.email === userData.email && user.id !== userData.id
    );
    if (existingUser) {
      errors.email = 'Este email ya está en uso';
    }
    
    // Verificar username único
    const existingUsername = users.find(user => 
      user.username === userData.username && user.id !== userData.id
    );
    if (existingUsername) {
      errors.username = 'Este nombre de usuario ya está en uso';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Configurar estados de carga y error
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // Reinicializar store
  resetStore: () => set({
    users: mockUsers,
    filters: {
      role: '',
      status: '',
      department: '',
      search: ''
    },
    isLoading: false,
    error: null
  })
}));

export { useUsersStore };
export default useUsersStore;