import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import useIndependentAgendaStore from '../../../stores/independentAgendaStore';
import useAuthStore from '../../../stores/authStore';
import EventBlock from '../EventComponents/EventBlock';

const WeekView = ({ onTimeSlotClick, onDateClick, onEventClick, onEventEdit }) => {
  const { user } = useAuthStore();
  const { 
    selectedDate, 
    currentGuide,
    actions: { getGuideCompleteAgenda, getGuideAvailability }
  } = useIndependentAgendaStore();

  const [weekEvents, setWeekEvents] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  const isAdmin = user?.role === 'admin';
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Lunes como primer día
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM a 10 PM

  // Actualizar tiempo actual cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Cargar eventos de la semana
  useEffect(() => {
    const eventsData = {};
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const currentWeekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    currentWeekDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      
      if (isAdmin && currentGuide) {
        // Vista admin: solo disponibilidad
        const availability = getGuideAvailability(currentGuide, day);
        eventsData[dateKey] = availability?.occupiedSlots || [];
      } else if (!isAdmin && user?.id) {
        // Vista guía: agenda completa
        const agenda = getGuideCompleteAgenda(user.id, day);
        eventsData[dateKey] = agenda?.allEvents?.filter(event => !event.allDay) || [];
      }
    });

    setWeekEvents(eventsData);
  }, [selectedDate, currentGuide, user?.id, isAdmin, getGuideAvailability, getGuideCompleteAgenda]);

  const handleTimeSlotClick = (day, hour, minutes = 0) => {
    const clickDate = new Date(day);
    clickDate.setHours(hour, minutes, 0, 0);
    
    const timeString = format(clickDate, 'HH:mm');
    
    // Llamar función del componente padre si existe
    if (onTimeSlotClick) {
      onTimeSlotClick(day, timeString);
    }
    
    console.log(`Adding event at ${timeString} on ${format(day, 'yyyy-MM-dd')}`);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    
    if (onEventClick) {
      onEventClick(event);
    }
    
    console.log('Event clicked:', event);
  };

  const handleEventDoubleClick = (event) => {
    if (onEventEdit) {
      onEventEdit(event);
    }
    
    console.log('Event double-clicked for editing:', event);
  };

  const handleSlotHover = (day, hour, isHovering) => {
    if (isHovering) {
      setHoveredSlot(`${format(day, 'yyyy-MM-dd')}-${hour}`);
    } else {
      setHoveredSlot(null);
    }
  };

  const handleDragOver = (e, day, hour) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(`${format(day, 'yyyy-MM-dd')}-${hour}`);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    setDraggedOver(null);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { eventId, eventType, startTime, endTime } = dragData;
      
      console.log('Event dropped in week view:', {
        eventId,
        originalTime: startTime,
        newDay: format(day, 'yyyy-MM-dd'),
        newHour: hour
      });
      
      // TODO: Integrar con el store para mover el evento
      
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 6 || hours > 22) return null;
    
    const hourIndex = hours - 6;
    const minutePercent = minutes / 60;
    const position = (hourIndex + minutePercent) * 60; // 60px por hora
    
    return position;
  };

  const renderEventsForDayAndHour = (day, hour) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayEvents = weekEvents[dateKey] || [];
    
    // Solo mostrar eventos que EMPIEZAN en esta hora exacta
    const hourEvents = dayEvents.filter(event => {
      const eventHour = parseInt(event.startTime?.split(':')[0] || '0');
      return eventHour === hour;
    });

    // Limitar a 1 evento visible por slot para grid uniforme
    const visibleEvents = hourEvents.slice(0, 1);
    const hiddenCount = Math.max(0, hourEvents.length - 1);

    return (
      <>
        {visibleEvents.map((event, index) => (
          <EventBlock
            key={event.id}
            event={event}
            isAdmin={isAdmin}
            isSelected={selectedEvent?.id === event.id}
            onClick={() => handleEventClick(event)}
            onDoubleClick={() => handleEventDoubleClick(event)}
            className="absolute inset-x-1 top-1 z-10"
            style={{
              height: '52px', // Altura fija uniforme
              minHeight: '52px',
              maxHeight: '52px'
            }}
            showTooltip={true}
          />
        ))}
        {hiddenCount > 0 && (
          <div 
            className="absolute top-1 right-1 text-xs text-gray-500 bg-white border border-gray-300 rounded px-1 shadow-sm z-20"
            style={{
              fontSize: '10px',
              lineHeight: '12px',
              height: '12px'
            }}
            onClick={() => handleTimeSlotClick(day, hour)}
            title={`+${hiddenCount} eventos más`}
          >
            +{hiddenCount}
          </div>
        )}
      </>
    );
  };

  const currentTimePosition = getCurrentTimePosition();
  const todayColumn = weekDays.findIndex(day => isToday(day));

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header de la semana */}
      <div className="flex-shrink-0 border-b border-gray-200">
        {/* Días de la semana */}
        <div className="flex">
          {/* Espacio para la columna de horas */}
          <div className="w-16 flex-shrink-0 border-r border-gray-200" />
          
          {/* Días */}
          {weekDays.map((day) => (
            <div 
              key={day.toString()} 
              className={`
                flex-1 p-4 text-center border-r border-gray-200 last:border-r-0
                ${isToday(day) ? 'bg-blue-50' : 'hover:bg-gray-50'}
              `}
            >
              <div className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-500'}`}>
                {format(day, 'EEE', { locale: es }).toUpperCase()}
              </div>
              <div className={`text-2xl font-semibold mt-1 ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
              {isToday(day) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido de la semana */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {/* Línea de tiempo actual */}
          {currentTimePosition !== null && todayColumn >= 0 && (
            <div
              className="absolute z-10 flex items-center"
              style={{ 
                top: `${currentTimePosition}px`,
                left: `${16 + (todayColumn * (100 / 7))}%`,
                width: `${100 / 7}%`
              }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full -ml-1"></div>
              <div className="flex-1 h-0.5 bg-red-500"></div>
            </div>
          )}

          {/* Grid de horas */}
          {hours.map((hour) => (
            <div key={hour} className="flex border-b border-gray-100 hover:bg-gray-50 group">
              {/* Columna de hora */}
              <div className="w-16 flex-shrink-0 p-2 text-right border-r border-gray-200">
                <span className="text-xs text-gray-500 font-medium">
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>

              {/* Columnas de días */}
              {weekDays.map((day, dayIndex) => {
                const slotKey = `${format(day, 'yyyy-MM-dd')}-${hour}`;
                const dateKey = format(day, 'yyyy-MM-dd');
                return (
                  <div 
                    key={day.toString()}
                    className={`
                      flex-1 h-[60px] border-r border-gray-200 last:border-r-0 cursor-pointer relative overflow-hidden
                      transition-colors
                      ${hoveredSlot === slotKey ? 'bg-blue-50' : ''}
                      ${draggedOver === slotKey ? 'bg-green-50 border-green-300' : ''}
                    `}
                    onClick={() => handleTimeSlotClick(day, hour)}
                    onMouseEnter={() => handleSlotHover(day, hour, true)}
                    onMouseLeave={() => handleSlotHover(day, hour, false)}
                    onDragOver={(e) => handleDragOver(e, day, hour)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day, hour)}
                  >
                  {/* Eventos de esta hora y día */}
                  {renderEventsForDayAndHour(day, hour)}

                  {/* Hover para agregar evento - solo si no hay eventos */}
                  {!isAdmin && (weekEvents[dateKey] || []).filter(e => {
                    const eventHour = parseInt(e.startTime?.split(':')[0] || '0');
                    const endHour = parseInt(e.endTime?.split(':')[0] || '0');
                    return eventHour <= hour && endHour > hour;
                  }).length === 0 && (
                    <div className="absolute inset-1 border border-dashed border-blue-300 rounded bg-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <PlusIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {String(hour).padStart(2, '0')}:00
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Indicador de disponibilidad para admin */}
                  {isAdmin && (weekEvents[dateKey] || []).filter(e => {
                    const eventHour = parseInt(e.startTime?.split(':')[0] || '0');
                    const endHour = parseInt(e.endTime?.split(':')[0] || '0');
                    return eventHour <= hour && endHour > hour;
                  }).length === 0 && (
                    <div className="absolute inset-1 border border-dashed border-green-300 rounded bg-green-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                      <span className="text-xs text-green-600 font-medium">
                        Disponible
                      </span>
                    </div>
                  )}

                  {/* Indicador de zona de drop */}
                  {draggedOver === slotKey && (
                    <div className="absolute inset-1 border-2 border-dashed border-green-400 rounded bg-green-100 bg-opacity-50 flex items-center justify-center">
                      <div className="flex items-center space-x-1 text-green-600">
                        <span className="text-xs font-medium">
                          Mover aquí
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Indicador de tiempo seleccionado */}
                  {hoveredSlot === slotKey && !isAdmin && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-400 rounded-r-full opacity-75"></div>
                  )}
                </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer con información */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Semana del {format(weekStart, 'd MMM', { locale: es })}</span>
            <span>•</span>
            <span>
              {Object.values(weekEvents).reduce((total, dayEvents) => total + dayEvents.length, 0)} eventos
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {todayColumn >= 0 && (
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600 font-medium">
                  {format(currentTime, 'HH:mm')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;