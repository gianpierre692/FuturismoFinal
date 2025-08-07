import React, { useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  InformationCircleIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const Agenda = () => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week'); // week, month, day
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '',
    duration: '',
    client: ''
  });

  // Verificar el tipo de usuario - TODOS los guías pueden ver su agenda
  const isGuide = user?.role === 'guide';
  const isAdmin = user?.role === 'admin';
  const isFreelanceGuide = user?.role === 'guide' && user?.guideType === 'freelance';
  const isStaffGuide = user?.role === 'guide' && user?.guideType === 'planta';

  // Datos de ejemplo para eventos
  const [events, setEvents] = useState([
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

  if (!isGuide && !isAdmin) {
    return (
      <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
            <CalendarDaysIcon className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Gestión de Agenda
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Esta función está disponible para guías y administradores.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Acceso a la Agenda</p>
                  <p>
                    Todos los guías pueden ver y gestionar su agenda de trabajo. 
                    Los administradores pueden coordinar y visualizar las agendas de todos los guías.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Funciones de navegación
  const navigateCalendar = (direction) => {
    if (view === 'week') {
      setSelectedDate(direction === 'prev' ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1));
    } else if (view === 'month') {
      setSelectedDate(direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1));
    } else if (view === 'day') {
      setSelectedDate(direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    const newId = events.length + 1;
    const eventToAdd = {
      id: newId,
      ...newEvent,
      status: 'pending'
    };
    setEvents([...events, eventToAdd]);
    setNewEvent({
      title: '',
      date: new Date(),
      time: '',
      duration: '',
      client: ''
    });
    setShowAddEvent(false);
  };

  // Vista de calendario simple
  const renderWeekView = () => {
    const start = startOfWeek(selectedDate, { locale: es });
    const end = endOfWeek(selectedDate, { locale: es });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header de navegación */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => navigateCalendar('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {format(start, 'dd MMM', { locale: es })} - {format(end, 'dd MMM yyyy', { locale: es })}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Hoy
            </button>
          </div>
          <button
            onClick={() => navigateCalendar('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0 border-b">
          {days.map(day => (
            <div
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`p-2 sm:p-3 text-center border-r last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                isSameDay(day, new Date()) ? 'bg-primary-50' : ''
              } ${
                isSameDay(day, selectedDate) ? 'bg-primary-100 ring-2 ring-primary-300' : ''
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
            {events.filter(event => {
              const eventWeekStart = startOfWeek(event.date, { locale: es });
              const eventWeekEnd = endOfWeek(event.date, { locale: es });
              return event.date >= start && event.date <= end;
            }).map(event => (
              <div
                key={event.id}
                className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
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
            {events.filter(event => {
              const eventWeekStart = startOfWeek(event.date, { locale: es });
              const eventWeekEnd = endOfWeek(event.date, { locale: es });
              return event.date >= start && event.date <= end;
            }).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No hay eventos esta semana</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Vista de día
  const renderDayView = () => {
    const dayEvents = events.filter(event => isSameDay(event.date, selectedDate));
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header de navegación */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => navigateCalendar('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Hoy
            </button>
          </div>
          <button
            onClick={() => navigateCalendar('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {dayEvents.length > 0 ? (
            <div className="space-y-3">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.time} • {event.duration}
                      </p>
                      <p className="text-sm text-gray-500">Cliente: {event.client}</p>
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
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No hay eventos hoy</p>
              <p>¡Perfecto día para descansar o planificar nuevos tours!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Vista de mes
  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart, { locale: es });
    const calendarEnd = endOfWeek(monthEnd, { locale: es });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header de navegación */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => navigateCalendar('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {format(selectedDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Hoy
            </button>
          </div>
          <button
            onClick={() => navigateCalendar('next')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7">
          {days.map(day => {
            const dayEvents = events.filter(event => isSameDay(event.date, day));
            const isCurrentMonth = day >= monthStart && day <= monthEnd;
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`min-h-[80px] p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${
                  isToday ? 'bg-primary-50' : ''
                } ${
                  isSelected ? 'bg-primary-100 ring-2 ring-primary-300' : ''
                }`}
              >
                <div className="font-medium text-sm mb-1">{format(day, 'd')}</div>
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mb-1 truncate"
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 2} más</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {isAdmin ? 'Coordinación de Agendas' : isStaffGuide ? 'Mi Agenda de Trabajo' : 'Mi Agenda'}
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
            {view === 'day' && renderDayView()}
            {view === 'month' && renderMonthView()}
          </div>
        </div>
      </div>

      {/* Modal para agregar evento */}
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del evento
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Tour Valle Sagrado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={format(newEvent.date, 'yyyy-MM-dd')}
                  onChange={(e) => setNewEvent({...newEvent, date: new Date(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración
                  </label>
                  <select
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="1h">1 hora</option>
                    <option value="2h">2 horas</option>
                    <option value="3h">3 horas</option>
                    <option value="4h">4 horas</option>
                    <option value="6h">6 horas</option>
                    <option value="8h">8 horas</option>
                    <option value="Todo el día">Todo el día</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <input
                  type="text"
                  value={newEvent.client}
                  onChange={(e) => setNewEvent({...newEvent, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nombre del cliente"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddEvent(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.time || !newEvent.duration || !newEvent.client}
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
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