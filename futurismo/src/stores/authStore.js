import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
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
          // Simulación de login con diferentes tipos de usuarios
          let mockResponse;
          
          // Usuario tipo Agencia
          if (credentials.email === 'demo@futurismo.com' || credentials.email === 'agencia@futurismo.com') {
            mockResponse = {
              token: 'mock-jwt-token-agency',
              user: {
                id: '1',
                name: 'Agencia Demo',
                email: credentials.email,
                role: 'agency',
                agencyId: 'AG001',
                company: 'Viajes El Dorado SAC',
                permissions: ['view_services', 'create_reservations', 'view_reports', 'manage_bookings']
              }
            };
          }
          // Usuario tipo Guía
          else if (credentials.email === 'guia@futurismo.com') {
            mockResponse = {
              token: 'mock-jwt-token-guide',
              user: {
                id: '2',
                name: 'Carlos Mendoza',
                email: credentials.email,
                role: 'guide',
                guideId: 'GU001',
                avatar: 'https://i.pravatar.cc/150?img=1',
                permissions: ['view_services', 'update_location', 'manage_tours', 'chat']
              }
            };
          }
          // Usuario tipo Admin
          else if (credentials.email === 'admin@futurismo.com') {
            mockResponse = {
              token: 'mock-jwt-token-admin',
              user: {
                id: '3',
                name: 'Administrador',
                email: credentials.email,
                role: 'admin',
                adminId: 'AD001',
                permissions: ['all']
              }
            };
          }
          // Credenciales inválidas
          else {
            throw new Error('Credenciales inválidas');
          }
          
          // Guardar en el store
          set({
            token: mockResponse.token,
            user: mockResponse.user,
            isAuthenticated: true,
            isLoading: false,
            rememberMe: credentials.remember || false
          });
          
          // Si no se marca "recordarme", limpiar al cerrar el navegador
          if (!credentials.remember) {
            window.addEventListener('beforeunload', () => {
              get().logout();
            });
          }
          
          return { success: true };
        } catch (error) {
          set({ 
            error: error.message || 'Error al iniciar sesión',
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
          rememberMe: false
        });
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates }
        }));
      },

      checkTokenExpiry: () => {
        const { token } = get();
        if (!token) return false;
        
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            get().logout();
            return false;
          }
          
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Solo persistir estos campos
        token: state.rememberMe ? state.token : null,
        user: state.rememberMe ? state.user : null,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        rememberMe: state.rememberMe
      })
    }
  )
);

export { useAuthStore };
export default useAuthStore;