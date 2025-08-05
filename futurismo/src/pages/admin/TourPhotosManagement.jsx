import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PhotoIcon, 
  ArrowLeftIcon,
  EyeIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import TourPhotosViewer from '../../components/admin/TourPhotosViewer';
import useGuidesStore from '../../stores/guidesStore';
import toast from 'react-hot-toast';

const TourPhotosManagement = () => {
  const navigate = useNavigate();
  const { getPhotoStatistics } = useGuidesStore(state => state.actions);
  const guides = useGuidesStore(state => state.guides);
  
  const [stats, setStats] = useState({});
  const [selectedGuide, setSelectedGuide] = useState('');
  const [view, setView] = useState('gallery'); // gallery, stats

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    const allStats = getPhotoStatistics();
    setStats(allStats);
  };

  const handleExportReport = () => {
    // En una implementación real, esto generaría un reporte
    toast.success('Generando reporte de fotos...');
  };

  const getCategoryData = () => {
    if (!stats.categoryBreakdown) return [];
    
    return Object.entries(stats.categoryBreakdown).map(([category, count]) => ({
      category: getCategoryLabel(category),
      count,
      percentage: ((count / stats.totalPhotos) * 100).toFixed(1)
    }));
  };

  const getCategoryLabel = (category) => {
    const categories = {
      general: 'General',
      tourist_group: 'Grupo turista',
      monument: 'Monumento/Lugar',
      restaurant: 'Restaurante/Comida',
      transport: 'Transporte'
    };
    return categories[category] || 'General';
  };

  const getGuidePhotosData = () => {
    return guides.map(guide => {
      const guideStats = getPhotoStatistics(guide.id);
      return {
        id: guide.id,
        name: guide.fullName,
        type: guide.guideType,
        photos: guideStats.totalPhotos || 0,
        tours: guideStats.toursWithPhotos || 0,
        average: guideStats.averagePhotosPerTour || 0
      };
    }).sort((a, b) => b.photos - a.photos);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <PhotoIcon className="w-6 h-6 text-primary-600" />
                <div>
                  <h1 className="text-xl font-semibold">Gestión de Fotos de Tours</h1>
                  <p className="text-sm text-gray-600">Visualización y análisis de fotos subidas por guías</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Selector de vista */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('gallery')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'gallery'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <EyeIcon className="w-4 h-4 inline mr-1" />
                  Galería
                </button>
                <button
                  onClick={() => setView('stats')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'stats'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4 inline mr-1" />
                  Estadísticas
                </button>
              </div>

              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Exportar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'gallery' ? (
          /* Vista de Galería */
          <TourPhotosViewer />
        ) : (
          /* Vista de Estadísticas */
          <div className="space-y-6">
            {/* Resumen general */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center">
                  <PhotoIcon className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Fotos</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalPhotos || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Tours con Fotos</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.toursWithPhotos || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center">
                  <FunnelIcon className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Promedio por Tour</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.averagePhotosPerTour || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center">
                  <PhotoIcon className="w-8 h-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Guías Activos</p>
                    <p className="text-2xl font-semibold text-gray-900">{guides.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución por categorías */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Distribución por Categorías</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {getCategoryData().map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                      {item.count}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{item.category}</p>
                    <p className="text-xs text-gray-500">{item.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ranking de guías por fotos */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Ranking de Guías por Fotos</h3>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posición
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guía
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Fotos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tours con Fotos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promedio/Tour
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getGuidePhotosData().map((guide, index) => (
                      <tr key={guide.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{guide.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            guide.type === 'planta' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {guide.type === 'planta' ? 'Planta' : 'Freelance'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guide.photos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guide.tours}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guide.average}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPhotosManagement;