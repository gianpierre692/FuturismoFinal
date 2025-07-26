import { useState } from 'react';
import { MapIcon, UserGroupIcon, ChartBarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import LiveMapResilient from '../components/monitoring/LiveMapResilient';
import GuideTracker from '../components/monitoring/GuideTracker';
import TourProgress from '../components/monitoring/TourProgress';
import { useAuthStore } from '../stores/authStore';

const Monitoring = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('map');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  
  // Para guías, solo mostrar sus propios tours
  const isGuide = user?.role === 'guide';

  return (
    <div className="h-full flex flex-col">
      {/* Header con opciones de vista */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isGuide ? t('monitoring.myTours') : t('monitoring.liveMonitoring')}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'map'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveView('map')}
            >
              <MapIcon className="w-4 h-4 inline mr-2" />
              {isGuide ? t('monitoring.myLocation') : t('monitoring.liveMap')}
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'tours'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveView('tours')}
            >
              <ChartBarIcon className="w-4 h-4 inline mr-2" />
              {isGuide ? t('monitoring.myActiveTours') : t('monitoring.activeTours')}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 min-h-0">
        {activeView === 'map' && (
          <LiveMapResilient 
            updateInterval={5000} // 5 segundos para tiempo real
            showSidebar={true}
            enableOfflineCache={true}
            showHealthStatus={true}
          />
        )}

        {activeView === 'tours' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Lista de tours activos */}
            <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                {isGuide ? t('monitoring.myToursInProgress') : t('monitoring.toursInProgress')}
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((id) => (
                  <div
                    key={id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTour === id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTour(id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tour Lima Histórica #{id}</p>
                        <p className="text-sm text-gray-600">12 {t('monitoring.tourists')} • Guía: Carlos Mendoza</p>
                      </div>
                      <div className="text-right">
                        <span className="badge badge-green">En ruta</span>
                        <p className="text-xs text-gray-500 mt-1">60% {t('monitoring.completedPercentage')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progreso del tour seleccionado */}
            <div className="overflow-y-auto">
              {selectedTour ? (
                <TourProgress tourId={selectedTour} />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                  <p className="text-gray-500">{t('monitoring.selectTour')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitoring;