import { useState, useEffect } from 'react';
import { MapIcon, UserGroupIcon, ChartBarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import LiveMapUnified from '../components/monitoring/LiveMapUnified';
import GuideTracker from '../components/monitoring/GuideTracker';
import TourProgress from '../components/monitoring/TourProgress';
import MonitoringMobile from './MonitoringMobile';
import useAuthStore from '../stores/authStore';

const Monitoring = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { user } = useAuthStore();
  
  if (isMobile) {
    return <MonitoringMobile />;
  }
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('map');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  
  // Para guías, solo mostrar sus propios tours
  const isGuide = user?.role === 'guide';

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Container with max width and better padding */}
      <div className="h-full flex flex-col max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        {/* Header con opciones de vista */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            {isGuide ? t('monitoring.myTours') : t('monitoring.liveMonitoring')}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
              <button
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'map'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveView('map')}
              >
                <MapIcon className="w-5 h-5 inline mr-2.5" />
                {isGuide ? t('monitoring.myLocation') : t('monitoring.liveMap')}
              </button>
              <button
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === 'tours'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveView('tours')}
              >
                <ChartBarIcon className="w-5 h-5 inline mr-2.5" />
                {isGuide ? t('monitoring.myActiveTours') : t('monitoring.activeTours')}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal with better spacing */}
        <div className="flex-1 min-h-0">
          {activeView === 'map' && (
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <LiveMapUnified 
                mode='cdn' // Usando modo CDN para mejor rendimiento
                updateInterval={5000} // 5 segundos para tiempo real
                showSidebar={true}
                height="h-full"
              />
            </div>
          )}

          {activeView === 'tours' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Lista de tours activos */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 overflow-hidden flex flex-col">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  {isGuide ? t('monitoring.myToursInProgress') : t('monitoring.toursInProgress')}
                </h3>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {[1, 2, 3].map((id) => (
                    <div
                      key={id}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedTour === id
                          ? 'border-primary-400 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                      }`}
                      onClick={() => setSelectedTour(id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">Tour Lima Histórica #{id}</p>
                          <p className="text-sm text-gray-600">12 {t('monitoring.tourists')} • Guía: Carlos Mendoza</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            En ruta
                          </span>
                          <p className="text-xs text-gray-500">60% {t('monitoring.completedPercentage')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progreso del tour seleccionado */}
              <div className="overflow-hidden">
                {selectedTour ? (
                  <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <TourProgress tourId={selectedTour} />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 h-full flex items-center justify-center">
                    <div className="text-center">
                      <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">{t('monitoring.selectTour')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;