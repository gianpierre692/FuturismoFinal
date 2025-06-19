import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useUsersStore } from '../../stores/usersStoreSimple';
import useAuthStore from '../../stores/authStore';

const FreelanceAgenda = () => {
  const { user } = useAuthStore();
  const { getUserById, updateUser } = useUsersStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('week'); // 'week', 'month'
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [freelanceUser, setFreelanceUser] = useState(null);

  useEffect(() => {
    // Buscar el usuario freelance actual (en una app real vendría del contexto de auth)
    const freelancer = getUserById('user-6'); // Miguel Torres - Guía Freelance
    setFreelanceUser(freelancer);
  }, []);

  const generateWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    const dayOfWeek = start.getDay();
    const monday = new Date(start);
    monday.setDate(start.getDate() - dayOfWeek + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const generateMonthDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    const year = start.getFullYear();
    const month = start.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Encontrar el lunes de la primera semana
    const startOfCalendar = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    startOfCalendar.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    // Generar todas las fechas necesarias para llenar el calendario (6 semanas)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startOfCalendar);
      date.setDate(startOfCalendar.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const weekDates = generateWeekDates(selectedDate);
  const monthDates = generateMonthDates(selectedDate);
  const currentDates = viewMode === 'week' ? weekDates : monthDates;
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getAvailabilityForDate = (date) => {
    if (!freelanceUser?.agenda) return { disponible: false, horarios: [] };
    return freelanceUser.agenda[date] || { disponible: false, horarios: [] };
  };

  const updateAvailability = (date, availability) => {
    if (!freelanceUser) return;

    const updatedAgenda = {
      ...freelanceUser.agenda,
      [date]: availability
    };

    const updatedUser = {
      ...freelanceUser,
      agenda: updatedAgenda
    };

    updateUser(freelanceUser.id, updatedUser);
    setFreelanceUser(updatedUser);
  };

  const toggleDayAvailability = (date) => {
    const current = getAvailabilityForDate(date);
    updateAvailability(date, {
      disponible: !current.disponible,
      horarios: current.disponible ? [] : ['09:00-17:00']
    });
  };

  const addTimeSlot = (date, timeSlot) => {
    const current = getAvailabilityForDate(date);
    const newHorarios = [...current.horarios, timeSlot];
    updateAvailability(date, {
      disponible: true,
      horarios: newHorarios
    });
  };

  const removeTimeSlot = (date, slotIndex) => {
    const current = getAvailabilityForDate(date);
    const newHorarios = current.horarios.filter((_, index) => index !== slotIndex);
    updateAvailability(date, {
      disponible: newHorarios.length > 0,
      horarios: newHorarios
    });
  };

  const TimeSlotModal = () => {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    const handleSave = () => {
      const timeSlot = `${startTime}-${endTime}`;
      if (editingSlot) {
        // Editar horario existente
        const current = getAvailabilityForDate(editingSlot.date);
        const newHorarios = [...current.horarios];
        newHorarios[editingSlot.index] = timeSlot;
        updateAvailability(editingSlot.date, {
          disponible: true,
          horarios: newHorarios
        });
      } else {
        // Agregar nuevo horario
        addTimeSlot(selectedDate, timeSlot);
      }
      setShowModal(false);
      setEditingSlot(null);
    };

    return showModal ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">
            {editingSlot ? 'Editar Horario' : 'Agregar Horario'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowModal(false);
                setEditingSlot(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingSlot ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    ) : null;
  };

  if (!freelanceUser) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Mi Agenda - {freelanceUser.firstName} {freelanceUser.lastName}
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="week">Vista Semanal</option>
              <option value="month">Vista Mensual</option>
            </select>
            
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Agregar Horario
            </button>
          </div>
        </div>

        {/* Navegación de fecha */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setMonth(newDate.getMonth() - 1);
                }
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ←
            </button>
            
            <span className="text-lg font-medium text-gray-900">
              {viewMode === 'week' 
                ? `Semana del ${new Date(weekDates[0]).toLocaleDateString('es-PE')}` 
                : `${new Date(selectedDate).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}`
              }
            </span>
            
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setMonth(newDate.getMonth() + 1);
                }
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              →
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
          >
            Hoy
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 divide-x divide-gray-200 bg-gray-50">
            {dayNames.map((dayName) => (
              <div key={dayName} className="p-3 text-center">
                <div className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  {dayName}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className={`grid ${viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-7'} divide-x divide-gray-200 ${viewMode === 'month' ? 'divide-y' : ''}`}>
          {currentDates.map((date, index) => {
            const availability = getAvailabilityForDate(date);
            const isToday = date === new Date().toISOString().split('T')[0];
            const dayName = viewMode === 'week' ? dayNames[index] : dayNames[index % 7];
            const dayNumber = new Date(date).getDate();
            const currentMonth = new Date(selectedDate).getMonth();
            const dateMonth = new Date(date).getMonth();
            const isCurrentMonth = dateMonth === currentMonth;

            return (
              <div key={date} className={`${viewMode === 'week' ? 'min-h-48' : 'min-h-32'} p-3 ${
                viewMode === 'month' && !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              }`}>
                {/* Day Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    {viewMode === 'week' && (
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {dayName}
                      </div>
                    )}
                    <div className={`${viewMode === 'week' ? 'text-lg' : 'text-base'} font-semibold ${
                      isToday ? 'text-blue-600' : (isCurrentMonth || viewMode === 'week' ? 'text-gray-900' : 'text-gray-400')
                    }`}>
                      {dayNumber}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleDayAvailability(date)}
                    className={`p-1 rounded-full ${
                      availability.disponible
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={availability.disponible ? 'Disponible' : 'No disponible'}
                  >
                    {availability.disponible ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <XCircleIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  {viewMode === 'week' ? (
                    // Vista detallada para semana
                    <>
                      {availability.horarios.map((horario, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg group"
                        >
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-800">
                              {horario}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingSlot({ date, index: slotIndex });
                                const [start, end] = horario.split('-');
                                setShowModal(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              title="Editar horario"
                            >
                              <PencilIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeTimeSlot(date, slotIndex)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Eliminar horario"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add time slot button */}
                      {availability.disponible && (
                        <button
                          onClick={() => {
                            setSelectedDate(date);
                            setShowModal(true);
                          }}
                          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors text-sm"
                        >
                          + Agregar horario
                        </button>
                      )}
                    </>
                  ) : (
                    // Vista compacta para mes
                    <div className="space-y-1">
                      {availability.horarios.slice(0, 2).map((horario, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => {
                            setSelectedDate(date);
                            setShowModal(true);
                          }}
                          title={`Horario: ${horario} - Click para editar`}
                        >
                          {horario}
                        </div>
                      ))}
                      
                      {availability.horarios.length > 2 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{availability.horarios.length - 2} más
                        </div>
                      )}
                      
                      {availability.disponible && availability.horarios.length === 0 && (
                        <div className="text-xs text-green-600 px-2 py-1">
                          Disponible
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen {viewMode === 'week' ? 'de la Semana' : 'del Mes'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentDates.filter(date => getAvailabilityForDate(date).disponible).length}
            </div>
            <div className="text-sm text-green-700">Días disponibles</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {currentDates.reduce((total, date) => {
                return total + getAvailabilityForDate(date).horarios.length;
              }, 0)}
            </div>
            <div className="text-sm text-blue-700">Horarios totales</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {currentDates.filter(date => !getAvailabilityForDate(date).disponible).length}
            </div>
            <div className="text-sm text-gray-700">Días bloqueados</div>
          </div>
        </div>
      </div>

      <TimeSlotModal />
    </div>
  );
};

export default FreelanceAgenda;