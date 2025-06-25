import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  ClockIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import useIndependentAgendaStore from '../../../stores/independentAgendaStore';
import useAuthStore from '../../../stores/authStore';

const WorkingHoursModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { 
    workingHours,
    actions: { setWorkingHours }
  } = useIndependentAgendaStore();

  const [workingHoursForm, setWorkingHoursForm] = useState({
    lunes: { enabled: true, start: '09:00', end: '17:00' },
    martes: { enabled: true, start: '09:00', end: '17:00' },
    miercoles: { enabled: true, start: '09:00', end: '17:00' },
    jueves: { enabled: true, start: '09:00', end: '17:00' },
    viernes: { enabled: true, start: '09:00', end: '17:00' },
    sabado: { enabled: false, start: '10:00', end: '14:00' },
    domingo: { enabled: false, start: '10:00', end: '14:00' }
  });

  // Cargar horarios actuales del usuario
  useEffect(() => {
    if (user?.id && workingHours[user.id]) {
      setWorkingHoursForm(workingHours[user.id]);
    }
  }, [user?.id, workingHours, isOpen]);

  const handleSave = () => {
    if (user?.id) {
      setWorkingHours(user.id, workingHoursForm);
      onClose();
    }
  };

  const handleClose = () => {
    // Restaurar datos originales al cerrar sin guardar
    if (user?.id && workingHours[user.id]) {
      setWorkingHoursForm(workingHours[user.id]);
    }
    onClose();
  };

  const updateDaySchedule = (day, field, value) => {
    setWorkingHoursForm(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Cog6ToothIcon className="w-5 h-5 text-purple-500" />
                      <span>Configurar Horarios</span>
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
                  <p className="text-sm text-gray-600 mb-4">
                    Define tus horarios de trabajo semanales. Esto ayudará a mostrar tu disponibilidad.
                  </p>
                  
                  <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                      <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700">
                            {day.label}
                          </label>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={workingHoursForm[day.key].enabled}
                              onChange={(e) => updateDaySchedule(day.key, 'enabled', e.target.checked)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-500">Activo</span>
                          </div>
                        </div>
                        
                        {workingHoursForm[day.key].enabled && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                <ClockIcon className="w-3 h-3 inline mr-1" />
                                Inicio
                              </label>
                              <input
                                type="time"
                                value={workingHoursForm[day.key].start}
                                onChange={(e) => updateDaySchedule(day.key, 'start', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Fin
                              </label>
                              <input
                                type="time"
                                value={workingHoursForm[day.key].end}
                                onChange={(e) => updateDaySchedule(day.key, 'end', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    onClick={handleSave}
                  >
                    Guardar Horarios
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

export default WorkingHoursModal;