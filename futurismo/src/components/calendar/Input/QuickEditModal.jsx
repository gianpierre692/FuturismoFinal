import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  ClockIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TagIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useIndependentAgendaStore from '../../../stores/independentAgendaStore';
import useAuthStore from '../../../stores/authStore';
import { EVENT_TYPES, VISIBILITY_LEVELS } from '../../../stores/independentAgendaStore';

const QuickEditModal = ({ 
  isOpen, 
  onClose, 
  event,
  onSave,
  onDelete,
  onDuplicate
}) => {
  const { user } = useAuthStore();
  const { 
    actions: { updatePersonalEvent, deletePersonalEvent, addPersonalEvent }
  } = useIndependentAgendaStore();

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    allDay: false,
    category: 'personal',
    recurring: false,
    reminder: '15',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar datos del evento cuando se abre el modal
  useEffect(() => {
    if (event && isOpen) {
      setEditForm({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        location: event.location || '',
        allDay: event.allDay || false,
        category: event.category || 'personal',
        recurring: event.recurring || false,
        reminder: event.reminder || '15',
        priority: event.priority || 'medium'
      });
      setErrors({});
    }
  }, [event, isOpen]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!editForm.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!editForm.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!editForm.allDay) {
      if (!editForm.startTime) {
        newErrors.startTime = 'La hora de inicio es requerida';
      }
      if (!editForm.endTime) {
        newErrors.endTime = 'La hora de fin es requerida';
      }
      if (editForm.startTime && editForm.endTime && editForm.startTime >= editForm.endTime) {
        newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm() || !event) return;

    const updatedEvent = {
      ...event,
      ...editForm,
      updatedAt: new Date()
    };

    // Actualizar en el store
    updatePersonalEvent(user.id, event.id, editForm);

    // Llamar callback del componente padre si existe
    if (onSave) {
      onSave(updatedEvent);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (!event) return;

    setIsDeleting(true);
    
    // Eliminar del store
    deletePersonalEvent(user.id, event.id);

    // Llamar callback del componente padre si existe
    if (onDelete) {
      onDelete(event);
    }

    setTimeout(() => {
      setIsDeleting(false);
      handleClose();
    }, 500);
  };

  const handleDuplicate = () => {
    if (!event) return;

    const duplicatedEvent = {
      ...editForm,
      title: `${editForm.title} (Copia)`,
      type: EVENT_TYPES.PERSONAL,
      visibility: VISIBILITY_LEVELS.PRIVATE
    };

    // Agregar nuevo evento al store
    addPersonalEvent(user.id, duplicatedEvent);

    // Llamar callback del componente padre si existe
    if (onDuplicate) {
      onDuplicate(duplicatedEvent);
    }

    handleClose();
  };

  const handleClose = () => {
    setEditForm({
      title: '',
      description: '',
      date: '',
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
    setIsDeleting(false);
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

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: 'text-gray-500' },
    { value: 'medium', label: 'Media', color: 'text-blue-500' },
    { value: 'high', label: 'Alta', color: 'text-red-500' }
  ];

  if (!event) return null;

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
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                      <span>Editar Evento</span>
                    </div>
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
                  {isDeleting ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-4"></div>
                      <p className="text-gray-600">Eliminando evento...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Título */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título *
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.title ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Título del evento"
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
                            value={editForm.date}
                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
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
                            checked={editForm.allDay}
                            onChange={(e) => setEditForm({...editForm, allDay: e.target.checked})}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="allDay" className="text-sm text-gray-700">
                            Todo el día
                          </label>
                        </div>

                        {/* Horas */}
                        {!editForm.allDay && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <ClockIcon className="w-4 h-4 inline mr-1" />
                                Hora inicio *
                              </label>
                              <input
                                type="time"
                                value={editForm.startTime}
                                onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
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
                                value={editForm.endTime}
                                onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <MapPinIcon className="w-4 h-4 inline mr-1" />
                          Ubicación
                        </label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Hospital, Casa, Oficina..."
                        />
                      </div>

                      {/* Categoría y Prioridad */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <TagIcon className="w-4 h-4 inline mr-1" />
                            Categoría
                          </label>
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {eventCategories.map(category => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridad
                          </label>
                          <select
                            value={editForm.priority}
                            onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
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

                      {/* Descripción */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Detalles adicionales..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {!isDeleting && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    {/* Acciones secundarias */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleDuplicate}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                          <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
                          Duplicar
                        </button>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors"
                      >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        Eliminar
                      </button>
                    </div>

                    {/* Acciones principales */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        onClick={handleClose}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QuickEditModal;