import { useState } from 'react';
import { 
  CheckCircle, Circle, Clock, MapPin, Users, 
  ChevronRight, AlertTriangle, Phone, MessageSquare 
} from 'lucide-react';
import { formatters } from '../../utils/formatters';

const TourProgress = ({ tourId }) => {
  const [expandedStop, setExpandedStop] = useState(null);

  // Datos mock del tour
  const mockTour = {
    id: tourId || '1',
    name: 'City Tour Lima Histórica',
    guide: {
      name: 'Carlos Mendoza',
      phone: '+51 987654321',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    tourists: {
      total: 12,
      present: 12,
      missing: 0
    },
    startTime: new Date(Date.now() - 7200000),
    estimatedEndTime: new Date(Date.now() + 3600000),
    actualStartTime: new Date(Date.now() - 7000000),
    stops: [
      {
        id: 1,
        name: 'Plaza de Armas',
        description: 'Centro histórico de Lima',
        estimatedTime: 30,
        actualTime: 35,
        arrivalTime: new Date(Date.now() - 6300000),
        departureTime: new Date(Date.now() - 6000000),
        status: 'completado',
        photos: ['photo1.jpg', 'photo2.jpg'],
        incidents: []
      },
      {
        id: 2,
        name: 'Catedral de Lima',
        description: 'Catedral principal de la ciudad',
        estimatedTime: 45,
        actualTime: 40,
        arrivalTime: new Date(Date.now() - 5700000),
        departureTime: new Date(Date.now() - 5400000),
        status: 'completado',
        photos: ['photo3.jpg'],
        incidents: []
      },
      {
        id: 3,
        name: 'Palacio de Gobierno',
        description: 'Sede del poder ejecutivo',
        estimatedTime: 30,
        actualTime: null,
        arrivalTime: new Date(Date.now() - 300000),
        departureTime: null,
        status: 'en_progreso',
        photos: [],
        incidents: [
          {
            type: 'retraso',
            message: 'Cambio de guardia retrasó la visita',
            time: new Date(Date.now() - 600000)
          }
        ]
      },
      {
        id: 4,
        name: 'Museo de Arte de Lima',
        description: 'Principal museo de arte del país',
        estimatedTime: 60,
        actualTime: null,
        arrivalTime: null,
        departureTime: null,
        status: 'pendiente',
        photos: [],
        incidents: []
      },
      {
        id: 5,
        name: 'Parque de la Reserva',
        description: 'Circuito mágico del agua',
        estimatedTime: 45,
        actualTime: null,
        arrivalTime: null,
        departureTime: null,
        status: 'pendiente',
        photos: [],
        incidents: []
      }
    ],
    incidents: [
      {
        id: 1,
        type: 'retraso',
        message: 'Salida retrasada 10 minutos por recojo de turistas',
        time: new Date(Date.now() - 7000000)
      }
    ]
  };

  const getStopIcon = (status) => {
    switch (status) {
      case 'completado':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'en_progreso':
        return <Circle className="w-6 h-6 text-blue-600 animate-pulse" />;
      case 'pendiente':
        return <Circle className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getProgressPercentage = () => {
    const completedStops = mockTour.stops.filter(s => s.status === 'completado').length;
    return (completedStops / mockTour.stops.length) * 100;
  };

  const getEstimatedDelay = () => {
    const now = new Date();
    const elapsed = now - mockTour.actualStartTime;
    const plannedElapsed = now - mockTour.startTime;
    const delay = elapsed - plannedElapsed;
    return delay > 0 ? delay / 60000 : 0; // En minutos
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header del tour */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{mockTour.name}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Inicio: {formatters.formatTime(mockTour.actualStartTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{mockTour.tourists.present}/{mockTour.tourists.total} turistas</span>
              </div>
              {getEstimatedDelay() > 0 && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Retraso de {Math.round(getEstimatedDelay())} min</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn btn-outline flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Llamar guía
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Enviar mensaje
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Progreso del tour</span>
            <span className="font-medium">{Math.round(getProgressPercentage())}% completado</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline de paradas */}
      <div className="p-6">
        <h4 className="font-semibold mb-4">Itinerario del Tour</h4>
        
        <div className="space-y-0">
          {mockTour.stops.map((stop, index) => (
            <div key={stop.id}>
              <div
                className={`flex items-start gap-4 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors ${
                  expandedStop === stop.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}
              >
                <div className="relative">
                  {getStopIcon(stop.status)}
                  {index < mockTour.stops.length - 1 && (
                    <div className={`absolute top-8 left-3 w-0.5 h-16 ${
                      stop.status === 'completado' ? 'bg-green-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-semibold">{stop.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{stop.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        {stop.arrivalTime && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>Llegada: {formatters.formatTime(stop.arrivalTime)}</span>
                          </div>
                        )}
                        {stop.actualTime && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{stop.actualTime} min</span>
                          </div>
                        )}
                      </div>

                      {stop.incidents.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          {stop.incidents[0].message}
                        </div>
                      )}
                    </div>

                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedStop === stop.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              </div>

              {/* Detalles expandidos */}
              {expandedStop === stop.id && (
                <div className="ml-10 pl-4 pb-4 border-l-2 border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Tiempo estimado</p>
                        <p className="font-medium">{stop.estimatedTime} minutos</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tiempo real</p>
                        <p className="font-medium">{stop.actualTime || '-'} minutos</p>
                      </div>
                      {stop.departureTime && (
                        <>
                          <div>
                            <p className="text-gray-600">Hora de llegada</p>
                            <p className="font-medium">{formatters.formatTime(stop.arrivalTime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Hora de salida</p>
                            <p className="font-medium">{formatters.formatTime(stop.departureTime)}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {stop.photos.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Fotos subidas</p>
                        <div className="flex gap-2">
                          {stop.photos.map((photo, i) => (
                            <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {stop.status === 'pendiente' && (
                      <div className="text-sm text-gray-500">
                        <p>Esta parada aún no ha sido visitada</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hora estimada de finalización */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Hora estimada de finalización</p>
              <p className="text-lg font-semibold text-blue-800">
                {formatters.formatTime(mockTour.estimatedEndTime)}
              </p>
            </div>
            {getEstimatedDelay() > 0 && (
              <div className="text-right">
                <p className="text-sm text-blue-700">
                  Con retraso actual: {formatters.formatTime(
                    new Date(mockTour.estimatedEndTime.getTime() + (getEstimatedDelay() * 60000))
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourProgress;