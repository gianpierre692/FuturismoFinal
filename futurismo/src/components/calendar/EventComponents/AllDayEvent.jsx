import { 
  CalendarDaysIcon, 
  LockClosedIcon, 
  BuildingOfficeIcon, 
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { VISIBILITY_LEVELS, EVENT_TYPES } from '../../../stores/independentAgendaStore';

const AllDayEvent = ({ event, onClick, isAdmin = false }) => {
  if (!event) return null;

  const getEventStyles = () => {
    switch (event.type) {
      case EVENT_TYPES.PERSONAL:
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          hoverBg: 'hover:bg-blue-600',
          icon: UserIcon
        };
      case EVENT_TYPES.COMPANY_TOUR:
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          hoverBg: 'hover:bg-green-600',
          icon: BuildingOfficeIcon
        };
      case EVENT_TYPES.OCCUPIED:
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          hoverBg: 'hover:bg-gray-600',
          icon: LockClosedIcon
        };
      default:
        return {
          bg: 'bg-purple-500',
          text: 'text-white',
          hoverBg: 'hover:bg-purple-600',
          icon: CalendarDaysIcon
        };
    }
  };

  const styles = getEventStyles();
  const IconComponent = styles.icon;

  // Determinar qué mostrar según visibilidad y usuario
  const getDisplayContent = () => {
    if (isAdmin && event.visibility === VISIBILITY_LEVELS.PRIVATE) {
      return null; // Admin no debe ver eventos privados
    }

    if (isAdmin && event.visibility === VISIBILITY_LEVELS.OCCUPIED) {
      return {
        title: 'Día ocupado',
        showDetails: false,
        subtitle: 'No disponible'
      };
    }

    return {
      title: event.title || 'Evento sin título',
      showDetails: true,
      subtitle: getEventSubtitle(event)
    };
  };

  const displayContent = getDisplayContent();
  if (!displayContent) return null;

  return (
    <div
      onClick={() => onClick?.(event)}
      className={`
        ${styles.bg} ${styles.text} ${styles.hoverBg}
        rounded-lg px-3 py-2 cursor-pointer transition-all duration-200
        hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
        flex items-center space-x-3 min-h-[40px]
      `}
    >
      {/* Icono del tipo de evento */}
      <IconComponent className="w-4 h-4 flex-shrink-0" />
      
      {/* Contenido del evento */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">
          {displayContent.title}
        </h4>
        
        {displayContent.subtitle && (
          <p className="text-xs opacity-75 truncate">
            {displayContent.subtitle}
          </p>
        )}
      </div>

      {/* Indicadores */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Ubicación */}
        {displayContent.showDetails && event.location && (
          <div className="flex items-center space-x-1">
            <MapPinIcon className="w-3 h-3 opacity-75" />
            <span className="text-xs opacity-75 max-w-20 truncate">
              {event.location}
            </span>
          </div>
        )}

        {/* Tipo de evento */}
        <div className="flex space-x-1">
          {event.visibility === VISIBILITY_LEVELS.PRIVATE && (
            <div 
              className="w-2 h-2 bg-white bg-opacity-50 rounded-full" 
              title="Evento privado" 
            />
          )}
          
          {event.visibility === VISIBILITY_LEVELS.OCCUPIED && (
            <div 
              className="w-2 h-2 bg-white bg-opacity-50 rounded-full" 
              title="Día ocupado" 
            />
          )}
          
          {event.type === EVENT_TYPES.COMPANY_TOUR && (
            <div 
              className="w-2 h-2 bg-white bg-opacity-50 rounded-full" 
              title="Tour de empresa" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Utilidad para generar subtítulo del evento
function getEventSubtitle(event) {
  const parts = [];

  // Agregar información del cliente para tours
  if (event.type === EVENT_TYPES.COMPANY_TOUR && event.client) {
    parts.push(`Cliente: ${event.client}`);
  }

  // Agregar categoría si existe
  if (event.category) {
    parts.push(event.category);
  }

  // Agregar descripción breve si no hay otra información
  if (parts.length === 0 && event.description) {
    parts.push(event.description.slice(0, 50) + (event.description.length > 50 ? '...' : ''));
  }

  // Agregar estado si es relevante
  if (event.status && event.status !== 'confirmed') {
    parts.push(`(${event.status})`);
  }

  return parts.join(' • ');
}

export default AllDayEvent;