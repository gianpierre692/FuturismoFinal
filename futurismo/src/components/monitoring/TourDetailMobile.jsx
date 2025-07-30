import { 
  ArrowLeftIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';

const TourDetailMobile = ({ tour, onBack }) => {
  const stops = [
    {
      id: 1,
      name: 'Plaza de Armas',
      subtitle: 'Centro histórico de Lima',
      status: 'completed',
      arrival: '01:27',
      duration: '35 min'
    },
    {
      id: 2,
      name: 'Catedral de Lima',
      subtitle: 'Catedral de Lima y catacombs',
      status: 'in-progress',
      arrival: '01:37',
      duration: '40 min'
    }
  ];

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-gray-50">
      {/* Header con botón volver */}
      <div className="bg-white shadow-sm z-20 flex-shrink-0">
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto">
        {/* Información del tour */}
        <div className="bg-white shadow-sm mb-4">
          <div className="px-4 py-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{tour.name}</h2>
            <p className="text-sm text-gray-600 mb-3">Guía: {tour.guide?.name || 'Sin asignar'}</p>
            
            {/* Info básica */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClockIcon className="w-4 h-4" />
                <span>Inicio: {tour.startTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserGroupIcon className="w-4 h-4" />
                <span>{tour.tourists} turistas</span>
              </div>
            </div>

            {/* Botones de acción - Integrados en el layout */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.location.href = `tel:${tour.guide?.phone || ''}`}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PhoneIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Llamar guía</span>
              </button>
              
              <button
                onClick={() => console.log('Enviar mensaje')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Enviar mensaje</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progreso del tour */}
        <div className="bg-white shadow-sm mb-4 px-4 py-4">
          <h3 className="font-semibold text-gray-900 mb-3">Progreso del tour</h3>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>40% completado</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: '40%' }}
              />
            </div>
          </div>
        </div>

        {/* Itinerario */}
        <div className="bg-white shadow-sm px-4 py-4">
          <h3 className="font-semibold text-gray-900 mb-3">Itinerario del tour</h3>
          
          <div className="space-y-4">
            {stops.map((stop, index) => (
              <div key={stop.id} className="relative">
                {/* Línea conectora */}
                {index < stops.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-300" />
                )}
                
                {/* Contenido de la parada */}
                <div className="flex gap-3">
                  {/* Indicador de estado */}
                  <div className="flex-shrink-0 mt-1">
                    {stop.status === 'completed' ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      </div>
                    ) : stop.status === 'in-progress' ? (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  
                  {/* Información de la parada */}
                  <div className="flex-1 pb-6">
                    <h4 className="font-medium text-gray-900">{stop.name}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{stop.subtitle}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        <span>Llegada: {stop.arrival}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{stop.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Padding bottom para evitar que el contenido quede bajo la navegación */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default TourDetailMobile;