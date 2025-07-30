import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import Logger from '../utils/logger';

const useNotificationsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado
        notifications: [],
        unreadCount: 0,
        isVisible: false,
        filter: 'all', // all, unread, important
        
        // Actions
        toggleVisibility: () => set((state) => ({ 
          isVisible: !state.isVisible 
        })),
        
        addNotification: (notification) => set((state) => {
          const newNotification = {
            id: Date.now().toString(),
            ...notification,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          Logger.info('Nueva notificación:', newNotification);
          
          return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
          };
        }),
        
        markAsRead: (notificationId) => set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        })),
        
        markAllAsRead: () => set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        })),
        
        deleteNotification: (notificationId) => set((state) => {
          const notification = state.notifications.find(n => n.id === notificationId);
          return {
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: notification && !notification.read 
              ? Math.max(0, state.unreadCount - 1) 
              : state.unreadCount
          };
        }),
        
        clearAll: () => set({ 
          notifications: [], 
          unreadCount: 0 
        }),
        
        setFilter: (filter) => set({ filter }),
        
        // Getters
        getFilteredNotifications: () => {
          const state = get();
          switch (state.filter) {
            case 'unread':
              return state.notifications.filter(n => !n.read);
            case 'important':
              return state.notifications.filter(n => n.important);
            default:
              return state.notifications;
          }
        },
        
        // Mock notifications para desarrollo
        addMockNotifications: () => {
          const mockNotifications = [
            {
              type: 'tour',
              title: 'Tour asignado',
              message: 'Se te ha asignado el tour "City Tour Cusco" para mañana',
              important: true
            },
            {
              type: 'message',
              title: 'Nuevo mensaje',
              message: 'La agencia Explore Peru te ha enviado un mensaje',
              important: false
            },
            {
              type: 'system',
              title: 'Actualización del sistema',
              message: 'Nueva funcionalidad disponible: Chat en tiempo real',
              important: false
            },
            {
              type: 'alert',
              title: 'Cambio de horario',
              message: 'El tour "Valle Sagrado" ha cambiado de horario: 8:00 AM',
              important: true
            }
          ];
          
          mockNotifications.forEach((notification, index) => {
            setTimeout(() => {
              get().addNotification(notification);
            }, index * 1000);
          });
        }
      }),
      {
        name: 'notifications-storage',
        partialize: (state) => ({ 
          notifications: state.notifications.slice(0, 50), // Solo guardar las últimas 50
          unreadCount: state.unreadCount 
        })
      }
    ),
    {
      name: 'NotificationsStore'
    }
  )
);

export default useNotificationsStore;