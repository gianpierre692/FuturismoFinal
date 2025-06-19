import React, { useState } from 'react';
import { 
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useSettingsStore } from '../../stores/settingsStore';

const NotificationsSettings = () => {
  const { 
    settings,
    updateNotificationsSettings,
    hasUnsavedChanges,
    saveSettings,
    isLoading
  } = useSettingsStore();

  const [formData, setFormData] = useState(settings.notifications);

  const handleChannelToggle = (channel, enabled) => {
    setFormData(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        enabled
      }
    }));
  };

  const handleNotificationToggle = (channel, notification, enabled) => {
    setFormData(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [notification]: enabled
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateNotificationsSettings(formData);
    await saveSettings();
  };

  const notificationTypes = [
    { key: 'newReservation', label: 'Nueva Reserva', description: 'Cuando se crea una nueva reserva' },
    { key: 'cancellation', label: 'Cancelación', description: 'Cuando se cancela una reserva' },
    { key: 'reminder24h', label: 'Recordatorio 24h', description: 'Recordatorio 24 horas antes del tour' },
    { key: 'reminder2h', label: 'Recordatorio 2h', description: 'Recordatorio 2 horas antes del tour' },
    { key: 'tourComplete', label: 'Tour Completado', description: 'Cuando se completa un tour' },
    { key: 'paymentReceived', label: 'Pago Recibido', description: 'Cuando se recibe un pago' },
    { key: 'lowCredit', label: 'Crédito Bajo', description: 'Cuando el crédito de agencia es bajo' },
    { key: 'systemAlerts', label: 'Alertas del Sistema', description: 'Alertas importantes del sistema' }
  ];

  const channels = [
    {
      key: 'email',
      label: 'Email',
      icon: EnvelopeIcon,
      color: 'blue',
      description: 'Notificaciones por correo electrónico'
    },
    {
      key: 'sms',
      label: 'SMS',
      icon: PhoneIcon,
      color: 'green',
      description: 'Notificaciones por mensaje de texto'
    },
    {
      key: 'push',
      label: 'Push',
      icon: DevicePhoneMobileIcon,
      color: 'purple',
      description: 'Notificaciones push en dispositivos móviles'
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: ChatBubbleLeftRightIcon,
      color: 'green',
      description: 'Notificaciones por WhatsApp Business'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-6">
          <BellIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Configuración de Notificaciones
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Configuración por canal */}
          {channels.map((channel) => (
            <div key={channel.key} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <channel.icon className={`h-6 w-6 text-${channel.color}-600 mr-3`} />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {channel.label}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {channel.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[channel.key].enabled}
                      onChange={(e) => handleChannelToggle(channel.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {formData[channel.key].enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  {notificationTypes.map((notificationType) => {
                    // Solo mostrar notificaciones específicas para SMS
                    if (channel.key === 'sms' && !['cancellation', 'reminder2h', 'emergencyOnly'].includes(notificationType.key)) {
                      return null;
                    }
                    
                    // Solo mostrar notificaciones específicas para WhatsApp
                    if (channel.key === 'whatsapp' && !['newReservation', 'reminder24h', 'tourComplete'].includes(notificationType.key)) {
                      return null;
                    }

                    // Agregar emergencyOnly solo para SMS
                    if (channel.key === 'sms' && notificationType.key === 'emergencyOnly') {
                      return (
                        <div key="emergencyOnly" className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Solo Emergencias
                            </label>
                            <p className="text-xs text-gray-500">
                              Enviar SMS solo en caso de emergencias
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData[channel.key].emergencyOnly || false}
                            onChange={(e) => handleNotificationToggle(channel.key, 'emergencyOnly', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      );
                    }

                    if (formData[channel.key][notificationType.key] !== undefined) {
                      return (
                        <div key={notificationType.key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              {notificationType.label}
                            </label>
                            <p className="text-xs text-gray-500">
                              {notificationType.description}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData[channel.key][notificationType.key]}
                            onChange={(e) => handleNotificationToggle(channel.key, notificationType.key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {!formData[channel.key].enabled && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center py-4">
                    Las notificaciones por {channel.label.toLowerCase()} están deshabilitadas
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <BellIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <h4 className="font-medium mb-1">Configuración de Notificaciones</h4>
                <ul className="space-y-1">
                  <li>• Las notificaciones por email están siempre disponibles</li>
                  <li>• SMS requiere configuración de proveedor de telefonía</li>
                  <li>• Push requiere aplicación móvil instalada</li>
                  <li>• WhatsApp requiere WhatsApp Business API configurado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => setFormData(settings.notifications)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>

        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Tienes cambios sin guardar. No olvides guardar antes de salir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsSettings;