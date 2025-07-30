import { useState, useEffect } from 'react';
import { 
  MapIcon, 
  ListBulletIcon, 
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import LiveMapMobile from '../components/monitoring/LiveMapMobile';
import TourProgress from '../components/monitoring/TourProgress';
import TourDetailMobile from '../components/monitoring/TourDetailMobile';
import useAuthStore from '../stores/authStore';

const MonitoringMobile = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('map');
  const [selectedTour, setSelectedTour] = useState(null);
  const [showTourDetail, setShowTourDetail] = useState(false);
  
  const isGuide = user?.role === 'guide';

  // Mock data - En producción vendría del store
  const activeTours = [
    {
      id: 1,
      name: 'Valle Sagrado VIP',
      guide: {
        name: 'Carlos Mendoza',
        phone: '+51987654321'
      },
      tourists: 12,
      status: 'active',
      progress: 65,
      startTime: '09:00',
      currentLocation: 'Chinchero',
      nextStop: 'Maras',
      emergency: false
    },
    {
      id: 2,
      name: 'City Tour Cusco',
      guide: {
        name: 'Ana García',
        phone: '+51912345678'
      },
      tourists: 8,
      status: 'active',
      progress: 40,
      startTime: '14:00',
      currentLocation: 'Plaza de Armas',
      nextStop: 'Qorikancha',
      emergency: false
    },
    {
      id: 3,
      name: 'Machu Picchu Sunrise',
      guide: {
        name: 'Luis Torres',
        phone: '+51998877665'
      },
      tourists: 15,
      status: 'delayed',
      progress: 20,
      startTime: '05:00',
      currentLocation: 'Aguas Calientes',
      nextStop: 'Puerta de Control',
      emergency: true,
      emergencyMessage: 'Retraso por clima'
    }
  ];

  const getStatusColor = (status) => {
    if (status === 'active') return 'text-green-600 bg-green-50';
    if (status === 'delayed') return 'text-yellow-600 bg-yellow-50';
    if (status === 'emergency') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusIcon = (status) => {
    if (status === 'active') return CheckCircleIcon;
    if (status === 'delayed') return ClockIcon;
    if (status === 'emergency') return ExclamationTriangleIcon;
    return ClockIcon;
  };

  const handleTourSelect = (tour) => {
    setSelectedTour(tour);
    setShowTourDetail(true);
  };

  // Vista de detalle del tour
  if (showTourDetail && selectedTour) {
    return (
      <TourDetailMobile 
        tour={selectedTour} 
        onBack={() => setShowTourDetail(false)} 
      />
    );
  }

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-gray-50">
      {/* Tabs de navegación */}
      <div className="bg-white shadow-sm z-20 flex-shrink-0">
        <div className="grid grid-cols-2 border-b border-gray-200">
          <button
            onClick={() => setActiveView('map')}
            className={`py-3 text-center font-medium transition-colors relative ${
              activeView === 'map' 
                ? 'text-primary-600' 
                : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MapIcon className="w-5 h-5" />
              <span>Mapa</span>
            </div>
            {activeView === 'map' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`py-3 text-center font-medium transition-colors relative ${
              activeView === 'list' 
                ? 'text-primary-600' 
                : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ListBulletIcon className="w-5 h-5" />
              <span>Tours</span>
              {activeTours.some(t => t.emergency) && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            {activeView === 'list' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        </div>
      </div>

      {/* Vista de mapa */}
      {activeView === 'map' && (
        <div className="relative flex-1 w-full min-h-0">
          <div className="absolute inset-0 p-4">
            <LiveMapMobile showSummary={true} />
          </div>
        </div>
      )}

      {/* Vista de lista */}
      {activeView === 'list' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Resumen */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeTours.length}</p>
                <p className="text-xs text-gray-500">Tours activos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {activeTours.reduce((sum, t) => sum + t.tourists, 0)}
                </p>
                <p className="text-xs text-gray-500">Turistas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {activeTours.filter(t => t.emergency).length}
                </p>
                <p className="text-xs text-gray-500">Alertas</p>
              </div>
            </div>
          </div>

          {/* Lista de tours */}
          {activeTours.map((tour) => {
            const StatusIcon = getStatusIcon(tour.status);
            
            return (
              <div
                key={tour.id}
                onClick={() => handleTourSelect(tour)}
                className={`bg-white rounded-lg shadow-sm p-4 ${
                  tour.emergency ? 'ring-2 ring-red-500' : ''
                }`}
              >
                {/* Header del tour */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{tour.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {tour.guide.name} • {tour.tourists} turistas
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="capitalize">{tour.status}</span>
                  </div>
                </div>

                {/* Progreso */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progreso</span>
                    <span>{tour.progress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        tour.emergency ? 'bg-red-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${tour.progress}%` }}
                    />
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapIcon className="w-4 h-4" />
                    <span>{tour.currentLocation}</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                </div>

                {/* Mensaje de emergencia */}
                {tour.emergency && tour.emergencyMessage && (
                  <div className="mt-3 p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-700 font-medium">
                      {tour.emergencyMessage}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonitoringMobile;