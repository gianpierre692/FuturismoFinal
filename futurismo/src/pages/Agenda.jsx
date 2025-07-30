import React, { useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  InformationCircleIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const Agenda = () => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month, day
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Verificar el tipo de usuario
  const isFreelanceGuide = user?.role === 'guide' && user?.guideType === 'freelance';
  const isAdmin = user?.role === 'admin';

  // Datos de ejemplo para eventos
  const [events] = useState([
    {
      id: 1,
      title: 'Tour Valle Sagrado',
      date: new Date(),
      time: '09:00',
      duration: '4h',
      client: 'Juan Pérez',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'City Tour Cusco',
      date: addDays(new Date(), 1),
      time: '14:00',
      duration: '3h',
      client: 'María García',
      status: 'pending'
    }
  ]);

  if (!isFreelanceGuide && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
            <CalendarDaysIcon className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Gestión de Agenda
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Esta función está disponible para guías freelance y administradores.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Acceso a la Agenda</p>
                  <p>
                    Los guías freelance pueden gestionar su disponibilidad y horarios 
                    desde esta sección. Los administradores pueden coordinar y visualizar 
                    las agendas de todos los guías freelance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de calendario simple
  const renderWeekView = () => {
    const start = startOfWeek(selectedDate, { locale: es });
    const end = endOfWeek(selectedDate, { locale: es });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-0 border-b">
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={`p-2 sm:p-3 text-center border-r last:border-r-0 ${
                isSameDay(day, new Date()) ? 'bg-primary-50' : ''
              }`}
            >
              <div className="text-xs sm:text-sm font-medium text-gray-900">
                {format(day, 'EEE', { locale: es })}
              </div>
              <div className="text-lg sm:text-xl font-semibold">
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {events.map(event => (
              <div
                key={event.id}
                className="p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {format(event.date, 'dd MMM', { locale: es })} • {event.time} • {event.duration}
                    </p>
                    <p className="text-xs text-gray-500">Cliente: {event.client}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {isAdmin ? 'Coordinación de Agendas' : 'Mi Agenda'}
            </h1>
            <button
              onClick={() => setShowAddEvent(true)}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nuevo Evento</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">Vista rápida</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setView('day')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    view === 'day' ? 'bg-primary-50 text-primary' : 'hover:bg-gray-50'
                  }`}
                >
                  Día
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    view === 'week' ? 'bg-primary-50 text-primary' : 'hover:bg-gray-50'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    view === 'month' ? 'bg-primary-50 text-primary' : 'hover:bg-gray-50'
                  }`}
                >
                  Mes
                </button>
              </div>

              {/* Resumen del día */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Hoy</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                    2 tours confirmados
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 text-yellow-500 mr-2" />
                    1 pendiente
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendario */}
          <div className="lg:col-span-3">
            {view === 'week' && renderWeekView()}
            {view === 'day' && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Vista de día en desarrollo</p>
              </div>
            )}
            {view === 'month' && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Vista de mes en desarrollo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar evento (placeholder) */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Nuevo Evento</h3>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-500 text-center py-8">
              Formulario de nuevo evento en desarrollo
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddEvent(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowAddEvent(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;