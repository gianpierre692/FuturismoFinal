import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  ClockIcon, 
  MapPinIcon, 
  UserIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { VISIBILITY_LEVELS, EVENT_TYPES } from '../../../stores/independentAgendaStore';

const EventTooltip = ({ 
  event, 
  isAdmin = false, 
  children, 
  onEdit, 
  onDelete, 
  onView,
  position = 'top' 
}) => {
  if (!event) return children;

  const getEventTypeLabel = (type) => {
    switch (type) {
      case EVENT_TYPES.PERSONAL:
        return 'Evento Personal';
      case EVENT_TYPES.COMPANY_TOUR:
        return 'Tour de Empresa';
      case EVENT_TYPES.OCCUPIED:
        return 'Tiempo Ocupado';
      default:
        return 'Evento';
    }
  };

  const getVisibilityLabel = (visibility) => {
    switch (visibility) {
      case VISIBILITY_LEVELS.PRIVATE:
        return 'Privado';
      case VISIBILITY_LEVELS.OCCUPIED:
        return 'Solo Admin ve "Ocupado"';
      case VISIBILITY_LEVELS.COMPANY:
        return 'Visible para empresa';
      case VISIBILITY_LEVELS.PUBLIC:
        return 'Público';
      default:
        return 'Sin definir';
    }
  };

  const formatEventTime = () => {
    if (event.allDay) {
      return 'Todo el día';
    }
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    return 'Horario no definido';
  };

  const calculateDuration = () => {
    if (!event.startTime || !event.endTime) return null;
    
    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const diffMinutes = endMinutes - startMinutes;
    
    if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    
    return `${diffMinutes}m`;
  };

  const shouldShowDetails = () => {
    if (isAdmin && event.visibility === VISIBILITY_LEVELS.PRIVATE) {
      return false;
    }
    return true;
  };

  const showDetails = shouldShowDetails();
  const duration = calculateDuration();

  return (
    <Popover className="relative inline-block">
      {({ open }) => (
        <>
          <Popover.Button as="div" className="cursor-pointer">
            {children}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel 
              className={`absolute z-50 w-80 px-4 mt-3 transform ${
                position === 'bottom' ? 'top-full' : 'bottom-full mb-3'
              } -translate-x-1/2 left-1/2 sm:px-0`}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-white p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {showDetails ? event.title : 'Ocupado'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {getEventTypeLabel(event.type)}
                      </p>
                    </div>
                    
                    {/* Indicador de estado */}
                    <div className={`
                      flex-shrink-0 w-3 h-3 rounded-full ml-2 mt-1
                      ${event.type === EVENT_TYPES.PERSONAL ? 'bg-blue-400' : ''}
                      ${event.type === EVENT_TYPES.COMPANY_TOUR ? 'bg-green-400' : ''}
                      ${event.type === EVENT_TYPES.OCCUPIED ? 'bg-gray-400' : ''}
                    `} />
                  </div>

                  {/* Detalles de tiempo */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>{formatEventTime()}</span>
                      {duration && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{duration}</span>
                        </>
                      )}
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>📅</span>
                      <span>
                        {event.date && !isNaN(new Date(event.date)) 
                          ? format(new Date(event.date), 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })
                          : 'Fecha no disponible'
                        }
                      </span>
                    </div>

                    {/* Ubicación */}
                    {showDetails && event.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}

                    {/* Cliente (para tours) */}
                    {showDetails && event.type === EVENT_TYPES.COMPANY_TOUR && event.client && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <UserIcon className="w-4 h-4" />
                        <span className="truncate">{event.client}</span>
                      </div>
                    )}

                    {/* Precio (para tours) */}
                    {showDetails && event.type === EVENT_TYPES.COMPANY_TOUR && event.price && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>💰</span>
                        <span className="font-medium">S/. {event.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  {showDetails && event.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* Información de privacidad */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                    <EyeIcon className="w-3 h-3" />
                    <span>{getVisibilityLabel(event.visibility)}</span>
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                    {onView && (
                      <button
                        onClick={() => onView(event)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        <EyeIcon className="w-3 h-3 mr-1" />
                        Ver
                      </button>
                    )}
                    
                    {!isAdmin && onEdit && showDetails && (
                      <button
                        onClick={() => onEdit(event)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                      >
                        <PencilIcon className="w-3 h-3 mr-1" />
                        Editar
                      </button>
                    )}
                    
                    {!isAdmin && onDelete && showDetails && (
                      <button
                        onClick={() => onDelete(event)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors"
                      >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        Eliminar
                      </button>
                    )}
                  </div>

                  {/* Metadata adicional */}
                  {showDetails && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>ID: {event.id}</span>
                        {event.createdAt && (
                          <span>
                            Creado: {event.createdAt && !isNaN(new Date(event.createdAt)) 
                              ? format(new Date(event.createdAt), 'dd/MM/yyyy')
                              : 'Fecha no disponible'
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default EventTooltip;