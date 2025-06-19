import { create } from 'zustand';

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
        id: '1',
        name: credentials.email === 'admin@futurismo.com' ? 'Administrador' : 
              credentials.email === 'agencia@test.com' ? 'Agencia Test' :
              credentials.email === 'guia@test.com' ? 'Guía Planta' : 'Guía Freelance',
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
          console.warn('Error al recuperar sesión guardada:', error);
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
        console.warn('Error al inicializar sesión:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }
}));

export { useAuthStore };
export default useAuthStore;