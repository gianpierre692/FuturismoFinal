import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  ClockIcon, 
  CalendarDaysIcon,
  MapPinIcon,
  TagIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useIndependentAgendaStore from '../../../stores/independentAgendaStore';
import useAuthStore from '../../../stores/authStore';

const QuickAddModal = ({ 
  isOpen, 
  onClose, 
  selectedDate = null, 
  selectedTime = null,
  mode = 'event' // 'event' | 'occupied'
}) => {
  const { user } = useAuthStore();
  const { 
    actions: { addPersonalEvent, markTimeAsOccupied }
  } = useIndependentAgendaStore();

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: selectedTime || '',
    endTime: '',
    location: '',
    allDay: false,
    category: 'personal',
    recurring: false,
    reminder: '15', // minutos antes
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});

  // Actualizar formulario cuando cambian las props
  useEffect(() => {
    if (selectedDate) {
      setEventForm(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
    if (selectedTime) {
      const endTime = selectedTime ? addHourToTime(selectedTime, 1) : '';
      setEventForm(prev => ({
        ...prev,
        startTime: selectedTime,
        endTime: endTime
      }));
    }
  }, [selectedDate, selectedTime]);

  // Función para agregar horas
  const addHourToTime = (time, hours) => {
    const [h, m] = time.split(':').map(Number);
    const newHour = (h + hours) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!eventForm.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!eventForm.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!eventForm.allDay) {
      if (!eventForm.startTime) {
        newErrors.startTime = 'La hora de inicio es requerida';
      }
      if (!eventForm.endTime) {
        newErrors.endTime = 'La hora de fin es requerida';
      }
      if (eventForm.startTime && eventForm.endTime && eventForm.startTime >= eventForm.endTime) {
        newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (mode === 'occupied') {
      markTimeAsOccupied(user.id, {
        date: eventForm.date,
        startTime: eventForm.allDay ? null : eventForm.startTime,
        endTime: eventForm.allDay ? null : eventForm.endTime,
        note: eventForm.description
      });
    } else {
      addPersonalEvent(user.id, {
        ...eventForm,
        type: 'personal',
        visibility: 'private'
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setEventForm({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '',
      endTime: '',
      location: '',
      allDay: false,
      category: 'personal',
      recurring: false,
      reminder: '15',
      priority: 'medium'
    });
    setErrors({});
    onClose();
  };

  const eventCategories = [
    { value: 'personal', label: 'Personal', color: 'bg-blue-500' },
    { value: 'medical', label: 'Médico', color: 'bg-red-500' },
    { value: 'family', label: 'Familiar', color: 'bg-green-500' },
    { value: 'business', label: 'Negocios', color: 'bg-purple-500' },
    { value: 'education', label: 'Educación', color: 'bg-yellow-500' },
    { value: 'other', label: 'Otro', color: 'bg-gray-500' }
  ];

  const reminderOptions = [
    { value: '0', label: 'Sin recordatorio' },
    { value: '5', label: '5 minutos antes' },
    { value: '15', label: '15 minutos antes' },
    { value: '30', label: '30 minutos antes' },
    { value: '60', label: '1 hora antes' },
    { value: '1440', label: '1 día antes' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'text-gray-500' },
    { value: 'medium', label: 'Media', color: 'text-blue-500' },
    { value: 'high', label: 'Alta', color: 'text-red-500' }
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    {mode === 'occupied' ? (
                      <div className="flex items-center space-x-2">
                        <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                        <span>Marcar Tiempo Ocupado</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                        <span>Agregar Evento Personal</span>
                      </div>
                    )}
                  </Dialog.Title>
                  
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Contenido */}
                <div className="px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Título */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={mode === 'occupied' ? 'Motivo (opcional)' : 'Ej: Cita médica, Reunión familiar...'}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                      )}
                    </div>

                    {/* Fecha y tiempo */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha *
                        </label>
                        <input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.date ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.date && (
                          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                        )}
                      </div>

                      {/* Todo el día */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allDay"
                          checked={eventForm.allDay}
                          onChange={(e) => setEventForm({...eventForm, allDay: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="allDay" className="text-sm text-gray-700">
                          Todo el día
                        </label>
                      </div>

                      {/* Horas */}
                      {!eventForm.allDay && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <ClockIcon className="w-4 h-4 inline mr-1" />
                              Hora inicio *
                            </label>
                            <input
                              type="time"
                              value={eventForm.startTime}
                              onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.startTime ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.startTime && (
                              <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora fin *
                            </label>
                            <input
                              type="time"
                              value={eventForm.endTime}
                              onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.endTime ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.endTime && (
                              <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ubicación */}
                    {mode !== 'occupied' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <MapPinIcon className="w-4 h-4 inline mr-1" />
                          Ubicación
                        </label>
                        <input
                          type="text"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Hospital, Casa, Oficina..."
                        />
                      </div>
                    )}

                    {/* Categoría */}
                    {mode !== 'occupied' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <TagIcon className="w-4 h-4 inline mr-1" />
                          Categoría
                        </label>
                        <select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {eventCategories.map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {mode === 'occupied' ? 'Nota personal (opcional)' : 'Descripción'}
                      </label>
                      <textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={mode === 'occupied' ? 'Solo para tu referencia...' : 'Detalles adicionales...'}
                      />
                    </div>

                    {/* Opciones adicionales para eventos */}
                    {mode !== 'occupied' && (
                      <div className="grid grid-cols-2 gap-4">
                        {/* Recordatorio */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recordatorio
                          </label>
                          <select
                            value={eventForm.reminder}
                            onChange={(e) => setEventForm({...eventForm, reminder: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {reminderOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Prioridad */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridad
                          </label>
                          <select
                            value={eventForm.priority}
                            onChange={(e) => setEventForm({...eventForm, priority: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {priorityOptions.map(option => (
                              <option key={option.value} value={option.value} className={option.color}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    onClick={handleClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      mode === 'occupied'
                        ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                    onClick={handleSubmit}
                  >
                    {mode === 'occupied' ? 'Marcar como Ocupado' : 'Agregar Evento'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QuickAddModal;