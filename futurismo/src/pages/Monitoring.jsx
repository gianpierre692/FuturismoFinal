import { useState } from 'react';
import { MapIcon, UserGroupIcon, ChartBarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import LiveMap from '../components/monitoring/LiveMapCDN';
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
            {!isGuide && (
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'guides'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveView('guides')}
              >
                <UserGroupIcon className="w-4 h-4 inline mr-2" />
                {t('monitoring.guides')}
              </button>
            )}
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

          <button className="btn btn-outline flex items-center gap-2">
            <FunnelIcon className="w-4 h-4" />
            {t('monitoring.filters')}
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 min-h-0">
        {activeView === 'map' && <LiveMap />}
        
        {activeView === 'guides' && !isGuide && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Lista de guías */}
            <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">{t('monitoring.activeGuides')}</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((id) => (
                  <div
                    key={id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedGuide === id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedGuide(id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/150?img=${id}`}
                        alt="Guía"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">Guía {id}</p>
                        <p className="text-sm text-gray-600">{t('monitoring.onService')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detalles del guía seleccionado */}
            <div className="overflow-y-auto">
              {selectedGuide ? (
                <GuideTracker guideId={selectedGuide} />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                  <p className="text-gray-500">{t('monitoring.selectGuide')}</p>
                </div>
              )}
            </div>
          </div>
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