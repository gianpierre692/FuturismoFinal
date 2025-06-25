import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusIcon } from '@heroicons/react/24/outline';
import useIndependentAgendaStore from '../../../stores/independentAgendaStore';
import useAuthStore from '../../../stores/authStore';

const MonthView = ({ onTimeSlotClick, onDateClick, onEventClick, onEventEdit }) => {
  const { user } = useAuthStore();
  const { 
    selectedDate, 
    currentGuide,
    actions: { 
      getGuideCompleteAgenda, 
      getGuideAvailability, 
      setSelectedDate,
      setCurrentView
    }
  } = useIndependentAgendaStore();

  const [monthEvents, setMonthEvents] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isAdmin = user?.role === 'admin';
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Cargar eventos del mes
  useEffect(() => {
    const eventsData = {};
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      
      if (isAdmin && currentGuide) {
        // Vista admin: solo disponibilidad
        const availability = getGuideAvailability(currentGuide, currentDate);
        eventsData[dateKey] = {
          events: availability?.occupiedSlots || [],
          availability: availability?.availableSlots || []
        };
      } else if (!isAdmin && user?.id) {
        // Vista guía: agenda completa
        const agenda = getGuideCompleteAgenda(user.id, currentDate);
        eventsData[dateKey] = {
          events: agenda?.allEvents || [],
          availability: []
        };
      }

      currentDate = addDays(currentDate, 1);
    }

    setMonthEvents(eventsData);
  }, [selectedDate, currentGuide, user?.id, isAdmin, getGuideAvailability, getGuideCompleteAgenda]);

  const handleDateClick = (date, event) => {
    // Si hay un evento de clic desde el componente padre, usarlo
    if (onDateClick) {
      onDateClick(date);
    } else {
      // Comportamiento por defecto: ir a vista día
      setSelectedDate(date);
      setCurrentView('day');
    }
    
    // Si se hace click específicamente para agregar evento
    if (event && (event.shiftKey || event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.stopPropagation();
      if (onTimeSlotClick) {
        onTimeSlotClick(date, '09:00'); // Hora por defecto
      }
    }
  };

  const handleQuickAdd = (date, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (onTimeSlotClick) {
      onTimeSlotClick(date, '09:00'); // Hora por defecto para agregar evento
    }
  };

  const handleEventBadgeClick = (date, eventType, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Obtener eventos de ese día y tipo
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = monthEvents[dateKey] || { events: [] };
    const eventsOfType = dayData.events.filter(e => e.type === eventType);
    
    if (eventsOfType.length === 1 && onEventClick) {
      // Si solo hay un evento, clickearlo directamente
      onEventClick(eventsOfType[0]);
    } else {
      // Si hay múltiples eventos, ir a vista día
      setSelectedDate(date);
      setCurrentView('day');
    }
  };

  const handleDateHover = (date, isHovering) => {
    if (isHovering) {
      setHoveredDate(format(date, 'yyyy-MM-dd'));
    } else {
      setHoveredDate(null);
    }
  };

  const getDayEventIndicators = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = monthEvents[dateKey] || { events: [], availability: [] };
    
    const personalEvents = dayData.events.filter(e => e.type === 'personal').length;
    const companyTours = dayData.events.filter(e => e.type === 'company_tour').length;
    const occupiedSlots = dayData.events.filter(e => e.type === 'occupied').length;
    const availableSlots = dayData.availability.length;

    return {
      personalEvents,
      companyTours,
      occupiedSlots,
      availableSlots,
      hasEvents: dayData.events.length > 0,
      hasAvailability: availableSlots > 0
    };
  };

  const renderCalendarDays = () => {
    const days = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const isCurrentMonth = isSameMonth(currentDate, monthStart);
      const isSelected = isSameDay(currentDate, selectedDate);
      const isCurrentDay = isToday(currentDate);
      const dateToAdd = new Date(currentDate);
      const indicators = getDayEventIndicators(currentDate);
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const isHovered = hoveredDate === dateKey;

      days.push(
        <div
          key={currentDate.toString()}
          onClick={(e) => handleDateClick(dateToAdd, e)}
          onMouseEnter={() => handleDateHover(currentDate, true)}
          onMouseLeave={() => handleDateHover(currentDate, false)}
          className={`
            relative h-[120px] p-2 border-r border-b border-gray-200 cursor-pointer overflow-hidden
            transition-all duration-200 hover:bg-gray-50 group
            ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900'}
            ${isSelected ? 'bg-blue-50 border-blue-300' : ''}
            ${isCurrentDay ? 'ring-2 ring-blue-500 ring-inset' : ''}
            ${isHovered ? 'bg-blue-25 shadow-sm' : ''}
          `}
        >
          {/* Número del día */}
          <div className="flex items-center justify-between mb-2">
            <span className={`
              text-sm font-medium
              ${isCurrentDay ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs' : ''}
              ${isSelected && !isCurrentDay ? 'text-blue-600 font-semibold' : ''}
            `}>
              {format(currentDate, 'd')}
            </span>

            {/* Indicador de disponibilidad para admin */}
            {isAdmin && indicators.hasAvailability && (
              <div className="w-2 h-2 bg-green-400 rounded-full" title="Disponible" />
            )}
          </div>

          {/* Indicadores de eventos - altura fija */}
          <div className="h-[60px] space-y-1 overflow-hidden">
            {/* Eventos personales */}
            {indicators.personalEvents > 0 && (
              <div 
                onClick={(e) => handleEventBadgeClick(dateToAdd, 'personal', e)}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate hover:bg-blue-200 cursor-pointer transition-colors block"
                title="Click para ver eventos personales"
              >
                {indicators.personalEvents === 1 ? '1 personal' : `${indicators.personalEvents} pers.`}
              </div>
            )}

            {/* Tours de empresa */}
            {indicators.companyTours > 0 && (
              <div 
                onClick={(e) => handleEventBadgeClick(dateToAdd, 'company_tour', e)}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded truncate hover:bg-green-200 cursor-pointer transition-colors block"
                title="Click para ver tours de empresa"
              >
                {indicators.companyTours === 1 ? '1 tour' : `${indicators.companyTours} tours`}
              </div>
            )}

            {/* Tiempo ocupado */}
            {indicators.occupiedSlots > 0 && (
              <div 
                onClick={(e) => handleEventBadgeClick(dateToAdd, 'occupied', e)}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded truncate hover:bg-gray-200 cursor-pointer transition-colors block"
                title="Click para ver tiempo ocupado"
              >
                Ocupado
              </div>
            )}

            {/* Disponibilidad (para admin) */}
            {isAdmin && indicators.hasAvailability && (
              <div className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded truncate border border-green-200 block">
                Disponible
              </div>
            )}

            {/* Indicador de más eventos si se corta */}
            {(indicators.personalEvents + indicators.companyTours + (indicators.occupiedSlots > 0 ? 1 : 0)) > 3 && (
              <div className="text-xs text-gray-500 px-2 py-1 italic">
                +{(indicators.personalEvents + indicators.companyTours + (indicators.occupiedSlots > 0 ? 1 : 0)) - 2} más...
              </div>
            )}
          </div>

          {/* Botón agregar (hover) */}
          {!isAdmin && isCurrentMonth && (
            <div 
              onClick={(e) => handleQuickAdd(dateToAdd, e)}
              className="absolute inset-2 border-2 border-dashed border-blue-300 rounded bg-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-blue-100"
              title="Ctrl/Cmd + Click para agregar evento rápido"
            >
              <div className="flex items-center space-x-1 text-blue-600">
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Agregar evento</span>
              </div>
            </div>
          )}

          {/* Indicador para admin de día disponible */}
          {isAdmin && isCurrentMonth && indicators.hasAvailability && (
            <div className="absolute inset-2 border-2 border-dashed border-green-300 rounded bg-green-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
              <div className="flex items-center space-x-1 text-green-600">
                <span className="text-sm font-medium">Asignar tour</span>
              </div>
            </div>
          )}

          {/* Indicador de hover activo */}
          {isHovered && (
            <div className="absolute top-1 left-1 w-1 h-8 bg-blue-400 rounded-r-full opacity-75"></div>
          )}

          {/* Indicador de día seleccionado */}
          {isSelected && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>
      );

      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const totalEvents = Object.values(monthEvents).reduce((total, dayData) => 
    total + (dayData.events?.length || 0), 0
  );

  const availableDays = Object.values(monthEvents).filter(dayData => 
    (dayData.availability?.length || 0) > 0
  ).length;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header del mes */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 capitalize">
              {format(selectedDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isAdmin && currentGuide ? 'Vista de disponibilidad' : 'Vista mensual'}
              {isAdmin && (
                <span className="ml-2">• {availableDays} días disponibles</span>
              )}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{totalEvents}</p>
            <p className="text-sm text-gray-500">eventos</p>
          </div>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="flex-shrink-0 grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div key={day} className="p-4 text-center border-r border-gray-200 last:border-r-0">
            <span className="text-sm font-medium text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-y-auto">
        {renderCalendarDays()}
      </div>

      {/* Footer con resumen */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{format(selectedDate, 'MMMM yyyy', { locale: es })}</span>
            <span>•</span>
            <span>{totalEvents} eventos total</span>
            {isAdmin && (
              <>
                <span>•</span>
                <span>{availableDays} días con disponibilidad</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-blue-100 rounded" />
              <span>Personal</span>
              <div className="w-3 h-3 bg-green-100 rounded ml-2" />
              <span>Tours</span>
              <div className="w-3 h-3 bg-gray-100 rounded ml-2" />
              <span>Ocupado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthView;