import { useEffect, useRef } from 'react';
import { XMarkIcon, BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import useNotificationsStore from '../../stores/notificationsStore';
import { useTranslation } from 'react-i18next';

const NotificationsPanel = () => {
  const { 
    isVisible, 
    toggleVisibility, 
    notifications, 
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getFilteredNotifications,
    addMockNotifications
  } = useNotificationsStore();
  
  const { t } = useTranslation();
  const panelRef = useRef(null);
  
  console.log('NotificationsPanel render - isVisible:', isVisible);
  
  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && 
          !event.target.closest('button[aria-label="notifications"]')) {
        toggleVisibility();
      }
    };
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, toggleVisibility]);
  
  // Agregar notificaciones de prueba en desarrollo
  useEffect(() => {
    if (import.meta.env.DEV && notifications.length === 0) {
      addMockNotifications();
    }
  }, []);
  
  const filteredNotifications = getFilteredNotifications();
  
  const getNotificationIcon = (type) => {
    const icons = {
      tour: '🗺️',
      message: '💬',
      system: '⚙️',
      alert: '⚠️',
      success: '✅',
      error: '❌'
    };
    return icons[type] || '📢';
  };
  
  const getNotificationColor = (type) => {
    const colors = {
      tour: 'bg-blue-50 border-blue-200',
      message: 'bg-green-50 border-green-200',
      system: 'bg-gray-50 border-gray-200',
      alert: 'bg-yellow-50 border-yellow-200',
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={panelRef}
      className="fixed top-16 sm:top-20 right-0 sm:right-4 w-full sm:w-96 h-full sm:h-auto sm:max-h-[70vh] bg-white sm:rounded-lg shadow-2xl z-[100] flex flex-col border-0 sm:border border-gray-200"
      style={{ maxWidth: '100vw' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white sm:bg-transparent sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-gray-700" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Notificaciones
              {unreadCount > 0 && (
                <span className="ml-2 text-xs sm:text-sm text-gray-500">
                  ({unreadCount} {unreadCount === 1 ? 'nueva' : 'nuevas'})
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={toggleVisibility}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Filtros */}
        <div className="flex gap-1 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap ${
              filter === 'unread' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No leídas
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap ${
              filter === 'important' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Importantes
          </button>
        </div>
      </div>
      
      {/* Lista de notificaciones */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className={`flex gap-3 p-3 rounded-lg border ${getNotificationColor(notification.type)}`}>
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          {notification.title}
                          {notification.important && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Importante
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.timestamp), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors group"
                      >
                        <TrashIcon className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer con acciones */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 flex justify-between">
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
            disabled={unreadCount === 0}
          >
            <CheckIcon className="w-4 h-4" />
            Marcar todas como leídas
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Limpiar todas
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;