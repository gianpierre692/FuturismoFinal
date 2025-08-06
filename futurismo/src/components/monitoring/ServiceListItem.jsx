import { memo } from 'react';
import PropTypes from 'prop-types';
import { UserGroupIcon, MapPinIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { getDestination } from '../../data/destinations';

/**
 * ServiceListItem - Componente memoizado para item individual de servicio
 * 
 * BENEFICIO: Evita re-renders innecesarios cuando otros servicios cambian
 * Solo se re-renderiza cuando sus propias props cambian
 */
const ServiceListItem = memo(({ 
  service, 
  selectedServiceId, 
  statusColors, 
  onServiceSelect 
}) => {
  const isSelected = selectedServiceId === service.id;
  const statusColor = statusColors.find(s => s.status === service.status)?.color || 'bg-gray-500';
  const destination = getDestination(service.destination);

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onServiceSelect(service)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{service.code}</h4>
          <div className="mt-1 space-y-1">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <UserGroupIcon className="w-3 h-3" />
              <span>{service.guide?.name || 'Sin guía'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MapPinIcon className="w-3 h-3" />
              <span>{destination?.name || service.destination || 'En ruta'}</span>
              {destination?.city && (
                <span className="text-gray-400 ml-1">• {destination.city}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <ClockIcon className="w-3 h-3" />
              <span>{service.startTime}</span>
            </div>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColor}`} />
      </div>

      {isSelected && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="space-y-1 text-xs">
            <p><strong>Cliente:</strong> {service.client?.name || 'N/A'}</p>
            <p><strong>Destino:</strong> {destination?.name || service.destination || 'N/A'}</p>
            {destination?.city && (
              <p><strong>Ciudad:</strong> {destination.city}, {destination.region || 'Cusco'}</p>
            )}
            {service.guide?.phone && (
              <div className="flex items-center gap-1">
                <PhoneIcon className="w-3 h-3" />
                <span className="text-gray-600">
                  {service.guide.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ServiceListItem.displayName = 'ServiceListItem';

ServiceListItem.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    code: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    currentLocation: PropTypes.string,
    startTime: PropTypes.string,
    guide: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string
    }),
    client: PropTypes.shape({
      name: PropTypes.string
    }),
    destination: PropTypes.string
  }).isRequired,
  selectedServiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statusColors: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired,
  onServiceSelect: PropTypes.func.isRequired
};

export default ServiceListItem;