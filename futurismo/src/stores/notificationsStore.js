import { create } from 'zustand';
import { NOTIFICATION_TYPES } from '../utils/constants';

const useNotificationsStore = create((set, get) => ({
  // Estado
  notifications: [],
  unreadCount: 0,
  isVisible: false,
  soundEnabled: true,
  pushEnabled: false,

  // Acciones
  addNotification: (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      type: NOTIFICATION_TYPES.INFO,
      ...notification
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
    
    // Reproducir sonido si está habilitado
    const { soundEnabled } = get();
    if (soundEnabled && notification.type !== NOTIFICATION_TYPES.INFO) {
      get().playNotificationSound();
    }
    
    // Mostrar notificación push si está habilitado
    const { pushEnabled } = get();
    if (pushEnabled) {
      get().showPushNotification(newNotification);
    }
    
    return newNotification.id;
  },

  markAsRead: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      const unreadCount = notifications.filter(n => !n.read).length;
      
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true })),
      unreadCount: 0
    }));
  },

  removeNotification: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.filter(n => n.id !== notificationId);
      const unreadCount = notifications.filter(n => !n.read).length;
      
      return { notifications, unreadCount };
    });
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0
    });
  },

  toggleVisibility: () => {
    set((state) => ({ isVisible: !state.isVisible }));
  },

  setVisibility: (isVisible) => set({ isVisible }),

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  togglePush: async () => {
    const { pushEnabled } = get();
    
    if (!pushEnabled) {
      // Solicitar permisos
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        set({ pushEnabled: true });
      }
    } else {
      set({ pushEnabled: false });
    }
  },

  playNotificationSound: () => {
    // En producción, reproducir un archivo de sonido
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizMGFGG87OScTgwOUqzn4rVfFAVFnN7vw3AeBSF+zPLaizsIHWzA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeTBELT6ni57JdGQdHm97uwXIiBCV7x/HWiTsLG2S56+ScUg0PVqzl47VgGAZKmuDyvmwhBSl+zPDaizsIHGvA7OaeODAJQBUFDx+z0kgAAAAASUVORK5CYII=');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Manejar error silenciosamente
    });
  },

  showPushNotification: (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification('Futurismo', {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: notification.id,
        requireInteraction: notification.type === NOTIFICATION_TYPES.ERROR
      });
      
      notif.onclick = () => {
        window.focus();
        notif.close();
        get().markAsRead(notification.id);
      };
    }
  },

  // Notificaciones predefinidas
  notifyServiceUpdate: (serviceCode, status) => {
    return get().addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title: 'Actualización de servicio',
      message: `El servicio ${serviceCode} cambió a estado: ${status}`,
      actionUrl: `/monitoring?service=${serviceCode}`
    });
  },

  notifyNewReservation: (reservationCode) => {
    return get().addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title: 'Nueva reserva confirmada',
      message: `La reserva ${reservationCode} ha sido confirmada exitosamente`,
      actionUrl: `/reservations/${reservationCode}`
    });
  },

  notifyError: (message) => {
    return get().addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title: 'Error',
      message
    });
  },

  notifyWarning: (message) => {
    return get().addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title: 'Advertencia',
      message
    });
  },

  // Obtener notificaciones filtradas
  getNotificationsByType: (type) => {
    const { notifications } = get();
    return notifications.filter(n => n.type === type);
  },

  getRecentNotifications: (limit = 10) => {
    const { notifications } = get();
    return notifications.slice(0, limit);
  }
}));

export { useNotificationsStore };
export default useNotificationsStore;