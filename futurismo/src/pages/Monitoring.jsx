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
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('map');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (isMobile) {
    return <MonitoringMobile />;
  }
  
  // Para guías, solo mostrar sus propios tours
  const isGuide = user?.role === 'guide';
  const isAdmin = user?.role === 'admin' || user?.role === 'administrador';

  return (
    <div className="page-container bg-gray-50">
      <div className="page-content-none flex flex-col h-full">
        {/* Header con opciones de vista */}
        <div className="page-header-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="page-title">
              {isGuide ? t('monitoring.myTours') : isAdmin ? 'Monitoreo Global de Tours' : t('monitoring.liveMonitoring')}
            </h1>
            {isAdmin && (
              <p className="text-sm text-gray-600 mt-1">Vista administrativa de todos los tours activos en tiempo real</p>
            )}
          </div>
          
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

        {/* Admin Stats Panel */}
        {isAdmin && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tours Activos</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-green-600 mt-1">+12% vs ayer</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <MapIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turistas en Ruta</p>
                  <p className="text-2xl font-bold text-gray-900">287</p>
                  <p className="text-xs text-blue-600 mt-1">15 grupos</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Guías Activos</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                  <p className="text-xs text-gray-500 mt-1">de 35 totales</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Zonas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                  <p className="text-xs text-orange-600 mt-1">Cusco, Lima, Arequipa...</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal with better spacing */}
        <div className="flex-1 min-h-0 h-full">
          {activeView === 'map' && (
            <div className="h-full w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <LiveMapUnified 
                mode='cdn'
                showSidebar={true}
                height="h-full"
                showAllTours={isAdmin}
              />
            </div>
          )}

          {activeView === 'tours' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Lista de tours activos */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 overflow-hidden flex flex-col">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  {isGuide ? t('monitoring.myToursInProgress') : isAdmin ? 'Todos los Tours Activos' : t('monitoring.toursInProgress')}
                </h3>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {(isAdmin ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3]).map((id) => (
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
                          <p className="font-semibold text-gray-900">
                            {isAdmin && id > 3 
                              ? ['Machu Picchu Express', 'Valle Sagrado VIP', 'City Tour Cusco', 'Laguna Humantay', 'Montaña 7 Colores'][id - 4] + ` #${id}`
                              : `Tour Lima Histórica #${id}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isAdmin && id > 3 
                              ? `${8 + id} turistas • Guía: ${['Ana Rodriguez', 'Pedro Silva', 'Maria Torres', 'Juan Castro', 'Luis Vargas'][id - 4]}`
                              : `12 ${t('monitoring.tourists')} • Guía: Carlos Mendoza`}
                          </p>
                          {isAdmin && (
                            <p className="text-xs text-gray-500">
                              Agencia: {id > 3 ? ['Peru Travel', 'Cusco Adventures', 'Inca Trail Tours', 'Andes Explorer', 'Mystic Peru'][id - 4] : 'Viajes El Dorado'}
                            </p>
                          )}
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