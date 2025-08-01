import { useState } from 'react';
import { 
  BellIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  FunnelIcon,
  ClockIcon,
  CalendarIcon,
  XMarkIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InteractiveCard from '../../components/common/InteractiveCard';
import InteractiveButton from '../../components/common/InteractiveButton';
import useNotificationsStore from '../../stores/notificationsStore';
import useUsersStore from '../../stores/usersStoreSimple';
import useGuidesStore from '../../stores/guidesStore';

const MassNotifications = () => {
  const { addNotification } = useNotificationsStore();
  const { users } = useUsersStore();
  const { guides } = useGuidesStore();
  
  const [notificationType, setNotificationType] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [targetAudience, setTargetAudience] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Mock data para historial
  const [notificationHistory] = useState([
    {
      id: 1,
      type: 'maintenance',
      subject: 'Mantenimiento programado del sistema',
      message: 'El sistema estará en mantenimiento el sábado 20/01 de 2:00 AM a 6:00 AM',
      audience: 'all',
      audienceCount: 389,
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60000),
      sentBy: 'Admin Sistema',
      priority: 'high',
      readRate: 78
    },
    {
      id: 2,
      type: 'update',
      subject: 'Nueva funcionalidad: Chat mejorado',
      message: 'Hemos actualizado el sistema de chat con nuevas funciones de mensajería en tiempo real',
      audience: 'agencies',
      audienceCount: 12,
      sentAt: new Date(Date.now() - 5 * 24 * 60 * 60000),
      sentBy: 'Admin Sistema',
      priority: 'medium',
      readRate: 92
    },
    {
      id: 3,
      type: 'reminder',
      subject: 'Recordatorio: Actualización de documentos',
      message: 'Por favor actualicen sus documentos y certificaciones antes del 31/01',
      audience: 'guides',
      audienceCount: 35,
      sentAt: new Date(Date.now() - 7 * 24 * 60 * 60000),
      sentBy: 'Admin Sistema',
      priority: 'low',
      readRate: 65
    }
  ]);

  const notificationTypes = [
    { value: 'general', label: 'General', icon: InformationCircleIcon, color: 'blue' },
    { value: 'maintenance', label: 'Mantenimiento', icon: ExclamationCircleIcon, color: 'yellow' },
    { value: 'update', label: 'Actualización', icon: CheckCircleIcon, color: 'green' },
    { value: 'alert', label: 'Alerta', icon: ExclamationCircleIcon, color: 'red' },
    { value: 'reminder', label: 'Recordatorio', icon: ClockIcon, color: 'purple' }
  ];

  const audiences = [
    { value: 'all', label: 'Todos los usuarios', count: users.length },
    { value: 'agencies', label: 'Solo agencias', count: users.filter(u => u.role === 'agencia').length },
    { value: 'guides', label: 'Solo guías', count: guides.length },
    { value: 'admins', label: 'Solo administradores', count: users.filter(u => u.role === 'administrador').length },
    { value: 'custom', label: 'Selección personalizada', count: selectedUsers.length }
  ];

  const getTargetUsers = () => {
    switch (targetAudience) {
      case 'all':
        return users;
      case 'agencies':
        return users.filter(u => u.role === 'agencia');
      case 'guides':
        return guides.map(g => ({
          ...g,
          firstName: g.fullName.split(' ')[0],
          lastName: g.fullName.split(' ').slice(1).join(' ')
        }));
      case 'admins':
        return users.filter(u => u.role === 'administrador');
      case 'custom':
        return selectedUsers;
      default:
        return [];
    }
  };

  const handleSendNotification = () => {
    if (!subject.trim() || !message.trim()) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Debes completar el asunto y el mensaje'
      });
      return;
    }

    const targetUsers = getTargetUsers();
    if (targetUsers.length === 0) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Debes seleccionar al menos un destinatario'
      });
      return;
    }

    // Simular envío
    console.log('Enviando notificación:', {
      type: notificationType,
      priority,
      subject,
      message,
      audience: targetAudience,
      recipients: targetUsers.length,
      scheduled: scheduledDate && scheduledTime ? `${scheduledDate} ${scheduledTime}` : 'Inmediato'
    });

    addNotification({
      type: 'success',
      title: 'Notificación enviada',
      message: `Se envió la notificación a ${targetUsers.length} usuarios`
    });

    // Limpiar formulario
    setSubject('');
    setMessage('');
    setScheduledDate('');
    setScheduledTime('');
    setSelectedUsers([]);
  };

  const getNotificationIcon = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : InformationCircleIcon;
  };

  const getNotificationColor = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : 'blue';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="page-container">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MegaphoneIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notificaciones Masivas</h1>
                <p className="text-sm text-gray-600">Envía mensajes a grupos de usuarios</p>
              </div>
            </div>
            <div className="flex gap-3">
              <InteractiveButton
                variant="secondary"
                icon={ClockIcon}
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Crear nueva' : 'Ver historial'}
              </InteractiveButton>
              <InteractiveButton
                variant="secondary"
                icon={ArrowPathIcon}
                onClick={() => window.location.reload()}
              >
                Actualizar
              </InteractiveButton>
            </div>
          </div>
        </div>

        {showHistory ? (
          /* Historial de notificaciones */
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Notificaciones</h2>
            {notificationHistory.map(notification => {
              const Icon = getNotificationIcon(notification.type);
              const color = getNotificationColor(notification.type);
              
              return (
                <InteractiveCard key={notification.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-${color}-100`}>
                      <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{notification.subject}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1">
                              <UserGroupIcon className="h-4 w-4 text-gray-400" />
                              {notification.audienceCount} destinatarios
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              {format(notification.sentAt, 'dd MMM yyyy HH:mm', { locale: es })}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority === 'high' ? 'Alta' : notification.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{notification.readRate}%</p>
                          <p className="text-xs text-gray-500">Tasa de lectura</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
              );
            })}
          </div>
        ) : (
          /* Formulario de nueva notificación */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tipo y prioridad */}
              <InteractiveCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de la notificación</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de notificación
                    </label>
                    <select
                      value={notificationType}
                      onChange={(e) => setNotificationType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {notificationTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="high">Alta</option>
                      <option value="medium">Media</option>
                      <option value="low">Baja</option>
                    </select>
                  </div>
                </div>
              </InteractiveCard>

              {/* Audiencia */}
              <InteractiveCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audiencia</h3>
                
                <div className="space-y-3">
                  {audiences.map(audience => (
                    <label
                      key={audience.value}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                        targetAudience === audience.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="audience"
                          value={audience.value}
                          checked={targetAudience === audience.value}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          className="mr-3 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-medium text-gray-900">{audience.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">{audience.count} usuarios</span>
                    </label>
                  ))}
                </div>

                {targetAudience === 'custom' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Selecciona usuarios específicos desde la lista de usuarios o guías
                    </p>
                  </div>
                )}
              </InteractiveCard>

              {/* Mensaje */}
              <InteractiveCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensaje</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Actualización importante del sistema"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Escribe el mensaje que recibirán los usuarios..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{message.length} caracteres</p>
                  </div>
                </div>
              </InteractiveCard>

              {/* Programación */}
              <InteractiveCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Programación (opcional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-3">
                  Si no programas fecha y hora, la notificación se enviará inmediatamente
                </p>
              </InteractiveCard>
            </div>

            {/* Panel lateral de vista previa */}
            <div className="lg:col-span-1">
              <InteractiveCard className="p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista previa</h3>
                
                {/* Preview de la notificación */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    {(() => {
                      const Icon = getNotificationIcon(notificationType);
                      const color = getNotificationColor(notificationType);
                      return (
                        <div className={`p-2 rounded-lg bg-${color}-100`}>
                          <Icon className={`h-5 w-5 text-${color}-600`} />
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {subject || 'Sin asunto'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                        {message || 'Sin mensaje'}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${getPriorityColor(priority)}`}>
                          {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                        <span>Ahora mismo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen de envío */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Destinatarios:</span>
                    <span className="font-medium text-gray-900">{getTargetUsers().length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Canales:</span>
                    <span className="font-medium text-gray-900">App, Email, SMS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-medium text-gray-900">
                      {scheduledDate && scheduledTime 
                        ? `${format(new Date(scheduledDate), 'dd/MM/yyyy')} ${scheduledTime}`
                        : 'Inmediato'
                      }
                    </span>
                  </div>
                </div>

                {/* Botón de envío */}
                <InteractiveButton
                  variant="primary"
                  icon={PaperAirplaneIcon}
                  onClick={handleSendNotification}
                  className="w-full mt-6"
                  disabled={!subject.trim() || !message.trim()}
                >
                  Enviar notificación
                </InteractiveButton>
              </InteractiveCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MassNotifications;