import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      dismissible: true,
      ...toast
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },
  
  updateToast: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map(toast => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
  
  // Métodos de conveniencia
  success: (message, options = {}) => {
    return get().addToast({
      type: 'success',
      message,
      ...options
    });
  },
  
  error: (message, options = {}) => {
    return get().addToast({
      type: 'error',
      message,
      duration: 8000, // Errores duran más
      ...options
    });
  },
  
  warning: (message, options = {}) => {
    return get().addToast({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    });
  },
  
  info: (message, options = {}) => {
    return get().addToast({
      type: 'info',
      message,
      ...options
    });
  },
  
  loading: (message, options = {}) => {
    return get().addToast({
      type: 'loading',
      message,
      duration: 0, // Loading toasts no se auto-dismiss
      dismissible: false,
      ...options
    });
  },
  
  // Para operaciones asíncronas
  promise: async (promise, { loading, success, error }) => {
    const loadingToastId = get().loading(loading || 'Cargando...');
    
    try {
      const result = await promise;
      get().removeToast(loadingToastId);
      get().success(success || 'Operación completada exitosamente');
      return result;
    } catch (err) {
      get().removeToast(loadingToastId);
      get().error(error || err.message || 'Ha ocurrido un error');
      throw err;
    }
  }
}));

export default useToastStore;