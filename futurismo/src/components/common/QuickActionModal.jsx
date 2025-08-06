import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CheckIcon, CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import InteractiveButton from './InteractiveButton';
import InteractiveInput from './InteractiveInput';
import Logger from '../../utils/logger';

const QuickActionModal = ({ isOpen, onClose, type, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({});
    } catch (error) {
      Logger.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const modalConfigs = {
    newReservation: {
      title: 'Nueva Reserva Rápida',
      icon: CalendarIcon,
      color: 'primary-600',
      fields: [
        { key: 'clientName', label: 'Nombre del Cliente', type: 'text', required: true },
        { key: 'clientPhone', label: 'Teléfono', type: 'tel', required: true },
        { key: 'tourType', label: 'Tipo de Tour', type: 'select', options: [
          { value: 'city-tour', label: 'City Tour Lima' },
          { value: 'gastronomic', label: 'Tour Gastronómico' },
          { value: 'palomino', label: 'Islas Palomino' },
          { value: 'pachacamac', label: 'Pachacámac' }
        ], required: true },
        { key: 'date', label: 'Fecha', type: 'date', required: true },
        { key: 'time', label: 'Hora', type: 'time', required: true },
        { key: 'passengers', label: 'Número de Pasajeros', type: 'number', min: 1, max: 15 }
      ]
    },
    quickMonitoring: {
      title: 'Vista Rápida de Tours',
      icon: MapPinIcon,
      color: 'green-600',
      showToursList: true
    },
    assignGuide: {
      title: 'Asignar Guía Rápido',
      icon: UserGroupIcon,
      color: 'blue-600',
      fields: [
        { key: 'reservationId', label: 'ID Reserva', type: 'select', options: [
          { value: 'RES001', label: 'RES001 - City Tour (María García)' },
          { value: 'RES002', label: 'RES002 - Gastronómico (Juan Pérez)' },
          { value: 'RES003', label: 'RES003 - Palomino (Ana López)' }
        ], required: true },
        { key: 'guide', label: 'Seleccionar Guía', type: 'select', options: [
          { value: 'guide1', label: 'Carlos Mendoza - Disponible' },
          { value: 'guide2', label: 'María Sánchez - Disponible' },
          { value: 'guide3', label: 'Roberto Silva - Ocupado' }
        ], required: true }
      ]
    },
    quickChat: {
      title: 'Consulta Rápida',
      icon: ClockIcon,
      color: 'indigo-600',
      fields: [
        { key: 'clientName', label: 'Cliente', type: 'text', required: true },
        { key: 'consultType', label: 'Tipo de Consulta', type: 'select', options: [
          { value: 'availability', label: 'Consulta de Disponibilidad' },
          { value: 'pricing', label: 'Consulta de Precios' },
          { value: 'custom', label: 'Tour Personalizado' },
          { value: 'group', label: 'Grupo Grande (+15)' }
        ], required: true },
        { key: 'message', label: 'Mensaje', type: 'textarea', rows: 3 }
      ]
    }
  };

  const config = modalConfigs[type] || modalConfigs.newReservation;
  const Icon = config.icon;

  // Mock data para tour monitoring
  const activeTours = [
    { id: 'T001', name: 'City Tour Lima', guide: 'Carlos Mendoza', tourists: 12, status: 'En ruta', location: 'Centro Histórico' },
    { id: 'T002', name: 'Gastronómico', guide: 'María García', tourists: 8, status: 'En parada', location: 'Miraflores' },
    { id: 'T003', name: 'Islas Palomino', guide: 'Juan Pérez', tourists: 15, status: 'Iniciando', location: 'Callao' }
  ];

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (field) => {
    const value = formData[field.key] || '';

    if (field.type === 'select') {
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required={field.required}
          >
            <option value="">Seleccionar...</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            rows={field.rows || 3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required={field.required}
          />
        </div>
      );
    }

    return (
      <InteractiveInput
        key={field.key}
        label={field.label}
        type={field.type}
        value={value}
        onChange={(e) => handleInputChange(field.key, e.target.value)}
        required={field.required}
        min={field.min}
        max={field.max}
      />
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {/* Header */}
                <div className={`px-6 py-4 ${
                  config.color === 'primary-600' ? 'bg-gradient-to-r from-primary-600 to-primary-700' :
                  config.color === 'green-600' ? 'bg-gradient-to-r from-green-600 to-green-700' :
                  config.color === 'blue-600' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                  config.color === 'indigo-600' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700' :
                  'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Dialog.Title className="text-lg font-semibold text-white">
                        {config.title}
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  {config.showToursList ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-900">Tours Activos Ahora</h3>
                      {activeTours.map((tour) => (
                        <div key={tour.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">{tour.name}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  tour.status === 'En ruta' ? 'bg-green-100 text-green-800' :
                                  tour.status === 'En parada' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {tour.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {tour.guide} • {tour.tourists} turistas • {tour.location}
                              </p>
                            </div>
                            <InteractiveButton
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Ver
                            </InteractiveButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {config.fields?.map(renderField)}
                    </form>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <InteractiveButton
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </InteractiveButton>
                  {!config.showToursList && (
                    <InteractiveButton
                      variant="primary"
                      onClick={handleSubmit}
                      loading={loading}
                      icon={CheckIcon}
                    >
                      {type === 'newReservation' ? 'Crear Reserva' :
                       type === 'assignGuide' ? 'Asignar Guía' :
                       type === 'quickChat' ? 'Enviar Consulta' : 'Confirmar'}
                    </InteractiveButton>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default QuickActionModal;