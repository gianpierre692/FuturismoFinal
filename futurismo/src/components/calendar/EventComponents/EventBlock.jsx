import { ClockIcon, LockClosedIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline';
import { VISIBILITY_LEVELS, EVENT_TYPES } from '../../../stores/independentAgendaStore';
import EventTooltip from './EventTooltip';

const EventBlock = ({ 
  event, 
  isAdmin = false, 
  isSelected = false,
  onClick, 
  onDoubleClick,
  onEdit,
  onDelete,
  onView,
  className = '',
  draggable = true,
  showTooltip = true
}) => {
  if (!event) return null;
  
  // Validar datos del evento para evitar errores de fecha
  const validatedEvent = {
    ...event,
    date: event.date || new Date().toISOString().split('T')[0],
    createdAt: event.createdAt || new Date()
  };

  const getEventStyles = () => {
    switch (event.type) {
      case EVENT_TYPES.PERSONAL:
        return {
          bg: 'bg-blue-100 border-blue-300',
          text: 'text-blue-800',
          icon: UserIcon
        };
      case EVENT_TYPES.COMPANY_TOUR:
        return {
          bg: 'bg-green-100 border-green-300',
          text: 'text-green-800',
          icon: BuildingOfficeIcon
        };
      case EVENT_TYPES.OCCUPIED:
        return {
          bg: 'bg-gray-100 border-gray-300',
          text: 'text-gray-600',
          icon: LockClosedIcon
        };
      default:
        return {
          bg: 'bg-gray-100 border-gray-300',
          text: 'text-gray-600',
          icon: ClockIcon
        };
    }
  };

  const styles = getEventStyles();
  const IconComponent = styles.icon;

  // Determinar qué mostrar según el nivel de visibilidad y el tipo de usuario
  const getDisplayContent = () => {
    if (isAdmin && event.visibility === VISIBILITY_LEVELS.PRIVATE) {
      // Admin no puede ver eventos privados, pero esto no debería llegar aquí
      return null;
    }

    if (isAdmin && event.visibility === VISIBILITY_LEVELS.OCCUPIED) {
      return {
        title: 'Ocupado',
        showDetails: false
      };
    }

    return {
      title: event.title || 'Sin título',
      showDetails: true
    };
  };

  const displayContent = getDisplayContent();
  if (!displayContent) return null;

  const duration = calculateDuration(event.startTime, event.endTime);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(event);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick?.(event);
  };

  const handleDragStart = (e) => {
    if (!draggable || isAdmin) return;
    
    e.dataTransfer.setData('text/plain', JSON.stringify({
      eventId: event.id,
      eventType: event.type,
      startTime: event.startTime,
      endTime: event.endTime
    }));
    
    e.dataTransfer.effectAllowed = 'move';
  };

  const eventComponent = (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      draggable={draggable && !isAdmin}
      className={`
        ${styles.bg} ${styles.text} ${className}
        border rounded-md p-1 cursor-pointer transition-all duration-200
        hover:shadow-lg hover:z-30 active:scale-[0.98]
        relative overflow-hidden select-none text-xs
        ${isSelected ? 'ring-1 ring-blue-400 shadow-md' : ''}
        ${draggable && !isAdmin ? 'cursor-move' : 'cursor-pointer'}
      `}
      title={showTooltip ? 'Mantén el cursor para ver detalles' : `${event.title} - Doble clic para editar`}
    >
      {/* Contenido ultra compacto del evento */}
      <div className="flex items-start justify-between h-full">
        <div className="flex items-start space-x-1 flex-1 min-w-0">
          <IconComponent className="w-3 h-3 flex-shrink-0 mt-0.5" />
          
          <div className="flex-1 min-w-0">
            {/* Título muy compacto */}
            <div className="font-medium text-xs truncate leading-tight">
              {displayContent.title}
            </div>
            
            {/* Tiempo ultra compacto */}
            {event.startTime && event.endTime && (
              <div className="text-xs opacity-60 truncate leading-tight mt-0.5">
                {event.startTime}-{event.endTime}
              </div>
            )}
          </div>
        </div>

        {/* Indicador de tipo muy pequeño */}
        <div className="flex-shrink-0 mt-0.5">
          {event.visibility === VISIBILITY_LEVELS.PRIVATE && (
            <div className="w-1 h-1 bg-blue-500 rounded-full" />
          )}
          {event.visibility === VISIBILITY_LEVELS.OCCUPIED && (
            <div className="w-1 h-1 bg-gray-500 rounded-full" />
          )}
          {event.type === EVENT_TYPES.COMPANY_TOUR && (
            <div className="w-1 h-1 bg-green-500 rounded-full" />
          )}
        </div>
      </div>

      {/* Línea de progreso (si el evento está en curso) */}
      {isEventInProgress(event) && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-50 overflow-hidden">
          <div 
            className="h-full bg-current transition-all duration-1000"
            style={{ width: `${getEventProgress(event)}%` }}
          />
        </div>
      )}
    </div>
  );

  // Si showTooltip es false, retornar directamente el componente
  if (!showTooltip) {
    return eventComponent;
  }

  // Envolver con tooltip
  return (
    <EventTooltip
      event={validatedEvent}
      isAdmin={isAdmin}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      position="top"
    >
      {eventComponent}
    </EventTooltip>
  );
};

// Utilidades
function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return null;
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  const diffMinutes = endMinutes - startMinutes;
  
  if (diffMinutes >= 60) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  
  return `${diffMinutes}m`;
}

function isEventInProgress(event) {
  if (!event.startTime || !event.endTime) return false;
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  // Solo verificar si es el día de hoy
  if (event.date !== today) return false;
  
  return currentTime >= event.startTime && currentTime <= event.endTime;
}

function getEventProgress(event) {
  if (!isEventInProgress(event)) return 0;
  
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  const [startHour, startMin] = event.startTime.split(':').map(Number);
  const [endHour, endMin] = event.endTime.split(':').map(Number);
  const [currentHour, currentMin] = currentTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const currentMinutes = currentHour * 60 + currentMin;
  
  const totalDuration = endMinutes - startMinutes;
  const elapsed = currentMinutes - startMinutes;
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

export default EventBlock;