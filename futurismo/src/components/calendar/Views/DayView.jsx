import { useState, useEffect } from 'react';
import { format, addHours, startOfDay, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import useIndependentAgendaStore from '../../../stores/independentAgendaStore';
import useAuthStore from '../../../stores/authStore';
import EventBlock from '../EventComponents/EventBlock';
import AllDayEvent from '../EventComponents/AllDayEvent';

const DayView = ({ onTimeSlotClick, onDateClick, onEventClick, onEventEdit }) => {
  const { user } = useAuthStore();
  const { 
    selectedDate, 
    currentGuide,
    actions: { getGuideCompleteAgenda, getGuideAvailability }
  } = useIndependentAgendaStore();

  const [dayEvents, setDayEvents] = useState([]);
  const [allDayEvents, setAllDayEvents] = useState([]);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isCurrentDay = isToday(selectedDate);

  // Horas del día (6 AM a 10 PM)
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

  // Actualizar tiempo actual cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Cargar eventos del día
  useEffect(() => {
    if (isAdmin && currentGuide) {
      // Vista admin: solo disponibilidad
      const availability = getGuideAvailability(currentGuide, selectedDate);
      setAvailabilityData(availability);
      setDayEvents(availability?.occupiedSlots || []);
      setAllDayEvents([]);
    } else if (!isAdmin && user?.id) {
      // Vista guía: agenda completa
      const agenda = getGuideCompleteAgenda(user.id, selectedDate);
      const events = agenda?.allEvents || [];
      
      // Separar eventos de todo el día
      const allDay = events.filter(event => event.allDay);
      const timedEvents = events.filter(event => !event.allDay);
      
      setAllDayEvents(allDay);
      setDayEvents(timedEvents);
      setAvailabilityData(null);
    }
  }, [selectedDate, currentGuide, user?.id, isAdmin, getGuideAvailability, getGuideCompleteAgenda]);

  const handleTimeSlotClick = (hour, minutes = 0) => {
    const clickDate = new Date(selectedDate);
    clickDate.setHours(hour, minutes, 0, 0);
    
    const timeString = format(clickDate, 'HH:mm');
    
    // Llamar función del componente padre si existe
    if (onTimeSlotClick) {
      onTimeSlotClick(selectedDate, timeString);
    }
    
    console.log(`Adding event at ${timeString} on ${format(selectedDate, 'yyyy-MM-dd')}`);
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

  const handleSlotHover = (hour, isHovering) => {
    if (isHovering) {
      setHoveredSlot(hour);
    } else {
      setHoveredSlot(null);
    }
  };

  const handleDragOver = (e, hour) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(hour);
  };

  const handleDragLeave = (e) => {
    // Solo limpiar si realmente salimos del área
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = (e, hour) => {
    e.preventDefault();
    setDraggedOver(null);
    setIsDragging(false);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { eventId, eventType, startTime, endTime } = dragData;
      
      // Aquí implementaremos la lógica para mover el evento
      console.log('Event dropped:', {
        eventId,
        originalTime: startTime,
        newHour: hour,
        newDate: format(selectedDate, 'yyyy-MM-dd')
      });
      
      // TODO: Integrar con el store para mover el evento
      // moveEvent(eventId, selectedDate, hour);
      
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const getCurrentTimePosition = () => {
    if (!isCurrentDay) return null;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 6 || hours > 22) return null;
    
    const hourIndex = hours - 6;
    const minutePercent = minutes / 60;
    const position = (hourIndex + minutePercent) * 60; // 60px por hora
    
    return position;
  };

  const renderEventInHour = (hour) => {
    const hourEvents = dayEvents.filter(event => {
      const eventHour = parseInt(event.startTime?.split(':')[0] || '0');
      return eventHour === hour;
    });

    // Si hay más de 3 eventos, mostrar solo los primeros 2 y un indicador
    const visibleEvents = hourEvents.slice(0, 2);
    const hiddenCount = Math.max(0, hourEvents.length - 2);

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
            className="absolute inset-x-2 z-10"
            style={{
              top: `${2 + (index * 24)}px`, // Eventos apilados más separados
              height: '22px', // Altura fija más compacta
              minHeight: '22px',
              maxHeight: '22px'
            }}
            showTooltip={true}
          />
        ))}
        {hiddenCount > 0 && (
          <div 
            className="absolute inset-x-2 z-10 flex items-center justify-center text-xs text-gray-500 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200"
            style={{
              top: `${2 + (visibleEvents.length * 24)}px`,
              height: '20px'
            }}
            onClick={() => handleTimeSlotClick(hour)}
            title={`+${hiddenCount} eventos más - Click para ver todos`}
          >
            +{hiddenCount} más
          </div>
        )}
      </>
    );
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header del día */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 capitalize">
              {format(selectedDate, 'EEEE, d \'de\' MMMM', { locale: es })}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isCurrentDay ? 'Hoy' : format(selectedDate, 'yyyy', { locale: es })}
              {isAdmin && currentGuide && (
                <span className="ml-2">• Vista de disponibilidad</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {isCurrentDay && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                <ClockIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  {format(currentTime, 'HH:mm')}
                </span>
              </div>
            )}
            
            {!isAdmin && (
              <button
                onClick={() => handleTimeSlotClick(new Date().getHours())}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Agregar evento</span>
              </button>
            )}
          </div>
        </div>

        {/* Eventos de todo el día */}
        {allDayEvents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Todo el día</h3>
            <div className="space-y-1">
              {allDayEvents.map(event => (
                <AllDayEvent
                  key={event.id}
                  event={event}
                  isSelected={selectedEvent?.id === event.id}
                  onClick={() => handleEventClick(event)}
                  onDoubleClick={() => handleEventDoubleClick(event)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline del día */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {/* Línea de tiempo actual */}
          {currentTimePosition !== null && (
            <div
              className="absolute left-0 right-0 z-10 flex items-center"
              style={{ top: `${currentTimePosition + 60}px` }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full ml-14 -mt-1"></div>
              <div className="flex-1 h-0.5 bg-red-500 mr-4"></div>
            </div>
          )}

          {/* Horas */}
          {hours.map((hour) => (
            <div 
              key={hour} 
              className={`flex border-b border-gray-100 hover:bg-gray-50 group transition-colors ${
                hoveredSlot === hour ? 'bg-blue-50' : ''
              } ${
                draggedOver === hour ? 'bg-green-50 border-green-300' : ''
              }`}
            >
              {/* Hora */}
              <div className="w-16 flex-shrink-0 p-4 text-right">
                <span className="text-sm text-gray-500 font-medium">
                  {format(addHours(startOfDay(selectedDate), hour), 'HH:mm')}
                </span>
              </div>

              {/* Área de eventos */}
              <div 
                className="flex-1 h-[60px] p-2 cursor-pointer relative overflow-visible"
                onClick={() => handleTimeSlotClick(hour)}
                onMouseEnter={() => handleSlotHover(hour, true)}
                onMouseLeave={() => handleSlotHover(hour, false)}
                onDragOver={(e) => handleDragOver(e, hour)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, hour)}
                onDragEnter={handleDragEnter}
              >
                {/* Eventos de esta hora */}
                {renderEventInHour(hour)}

                {/* Indicador de hora disponible (para admin) */}
                {isAdmin && availabilityData?.availableSlots?.some(slot => {
                  const slotHour = parseInt(slot.startTime?.split(':')[0] || '0');
                  return slotHour === hour;
                }) && (
                  <div className="absolute inset-2 border-2 border-dashed border-green-300 rounded-lg bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-sm text-green-600 font-medium">
                      Disponible para asignar
                    </span>
                  </div>
                )}

                {/* Hover para agregar evento */}
                {!isAdmin && renderEventInHour(hour).length === 0 && (
                  <div className="absolute inset-2 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <PlusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Agregar evento a las {format(addHours(startOfDay(selectedDate), hour), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Indicador de tiempo seleccionado */}
                {hoveredSlot === hour && !isAdmin && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-blue-400 rounded-r-full opacity-75"></div>
                )}

                {/* Indicador de zona de drop */}
                {draggedOver === hour && (
                  <div className="absolute inset-2 border-2 border-dashed border-green-400 rounded-lg bg-green-100 bg-opacity-50 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-green-600">
                      <span className="text-sm font-medium">
                        Mover evento aquí
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con resumen */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{dayEvents.length} eventos</span>
            {isAdmin && availabilityData && (
              <>
                <span>•</span>
                <span>{availabilityData.availableSlots?.length || 0} slots disponibles</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isCurrentDay && (
              <span className="text-blue-600 font-medium">
                Hoy • {format(currentTime, 'HH:mm')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;