import { create } from 'zustand';
import Logger from '../utils/logger';

const useAuthStore = create((set, get) => ({
  // Estado
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rememberMe: false,

  // Acciones
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciales mock
      const validCredentials = {
        'admin@futurismo.com': { password: 'admin123', role: 'admin' },
        'agencia@test.com': { password: 'agencia123', role: 'agency' },
        'guia@test.com': { password: 'guia123', role: 'guide', guideType: 'planta' },
        'freelance@test.com': { password: 'freelance123', role: 'guide', guideType: 'freelance' }
      };
      
      const userCredentials = validCredentials[credentials.email];
      
      if (!userCredentials || userCredentials.password !== credentials.password) {
        throw new Error('Credenciales inválidas');
      }
      
      // Crear usuario mock
      const mockUser = {
        id: credentials.email === 'admin@futurismo.com' ? 'admin1' : 
            credentials.email === 'agencia@test.com' ? 'agency1' :
            credentials.email === 'guia@test.com' ? 'guide1' : 'user123', // ID específico para guía freelance
        name: credentials.email === 'admin@futurismo.com' ? 'Administrador' : 
              credentials.email === 'agencia@test.com' ? 'Agencia Test' :
              credentials.email === 'guia@test.com' ? 'Guía Planta' : 'María Torres',
        email: credentials.email,
        role: userCredentials.role,
        guideType: userCredentials.guideType || null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email)}&background=0D8ABC&color=fff`
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      set({
        token: mockToken,
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe: credentials.rememberMe || false
      });
      
      // Guardar en localStorage si remember me
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
      }
      
      return { success: true, user: mockUser };
      
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        token: null,
        user: null
      });
      throw error;
    }
  },

  register: async (registerData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular validación de email único
      const existingEmails = [
        'admin@futurismo.com',
        'agencia@test.com', 
        'guia@test.com',
        'freelance@test.com'
      ];
      
      if (existingEmails.includes(registerData.email)) {
        throw new Error('Este email ya está registrado');
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: 'user_' + Date.now(),
        name: registerData.name,
        email: registerData.email,
        role: registerData.role,
        guideType: registerData.guideType,
        phone: registerData.phone,
        dni: registerData.dni,
        city: registerData.city,
        languages: registerData.languages,
        specialties: registerData.specialties,
        experience: registerData.experience,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(registerData.name)}&background=10B981&color=fff`,
        status: 'pending', // Pendiente de aprobación
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      set({
        token: mockToken,
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
      
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        token: null,
        user: null
      });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false
    });
    
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  checkTokenExpiry: () => {
    const { token } = get();
    if (!token) {
      // Intentar recuperar de localStorage
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      
      if (savedToken && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          set({
            token: savedToken,
            user: user,
            isAuthenticated: true,
            rememberMe: true
          });
          return true;
        } catch (error) {
          Logger.warn('Error al recuperar sesión guardada:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      return false;
    }
    return true;
  },

  clearError: () => {
    set({ error: null });
  },

  updateProfile: async (profileData) => {
    const { user } = get();
    if (!user) return false;
    
    try {
      set({ isLoading: true });
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...profileData };
      
      set({
        user: updatedUser,
        isLoading: false
      });
      
      // Actualizar localStorage si está guardado
      if (localStorage.getItem('auth_user')) {
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: 'Error al actualizar perfil' 
      });
      return false;
    }
  },

  // Función para inicializar el store
  initialize: () => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        set({
          token: savedToken,
          user: user,
          isAuthenticated: true,
          rememberMe: true
        });
      } catch (error) {
        Logger.warn('Error al inicializar sesión:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }
}));

export default useAuthStore;