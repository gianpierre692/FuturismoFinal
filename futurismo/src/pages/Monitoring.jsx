import { useState } from 'react';
import { Map, Users, Activity, Filter } from 'lucide-react';
import LiveMap from '../components/monitoring/LiveMap';
import GuideTracker from '../components/monitoring/GuideTracker';
import TourProgress from '../components/monitoring/TourProgress';
import { useAuthStore } from '../stores/authStore';

const Monitoring = () => {
  const { user } = useAuthStore();
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
          {isGuide ? 'Mis Tours' : 'Monitoreo en Tiempo Real'}
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
              <Map className="w-4 h-4 inline mr-2" />
              {isGuide ? 'Mi Ubicación' : 'Mapa en Vivo'}
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
                <Users className="w-4 h-4 inline mr-2" />
                Guías
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
              <Activity className="w-4 h-4 inline mr-2" />
              {isGuide ? 'Mis Tours Activos' : 'Tours Activos'}
            </button>
          </div>

          <button className="btn btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
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
              <h3 className="text-lg font-semibold mb-4">Guías Activos</h3>
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
                        <p className="text-sm text-gray-600">En servicio - Tour Centro Histórico</p>
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
                  <p className="text-gray-500">Selecciona un guía para ver sus detalles</p>
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
                {isGuide ? 'Mis Tours en Progreso' : 'Tours en Progreso'}
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
                        <p className="text-sm text-gray-600">12 turistas • Guía: Carlos Mendoza</p>
                      </div>
                      <div className="text-right">
                        <span className="badge badge-green">En ruta</span>
                        <p className="text-xs text-gray-500 mt-1">60% completado</p>
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
                  <p className="text-gray-500">Selecciona un tour para ver su progreso</p>
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