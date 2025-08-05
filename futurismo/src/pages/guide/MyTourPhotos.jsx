import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PhotoIcon, 
  ArrowLeftIcon,
  EyeIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import useGuidesStore from '../../stores/guidesStore';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const MyTourPhotos = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getGuidePhotos, getPhotoStatistics } = useGuidesStore(state => state.actions);
  
  const [myPhotos, setMyPhotos] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all'); // all, recent, by_category

  useEffect(() => {
    if (user?.id) {
      loadMyPhotos();
      loadMyStats();
    }
  }, [user?.id, filter]);

  const loadMyPhotos = () => {
    // En una implementación real, obtendríamos el ID del guía del contexto
    const guideId = user?.id === 'guide1' ? 'guide001' : 'guide002';
    const photos = getGuidePhotos(guideId);
    
    // Aplanar todas las fotos de todos los tours
    const allPhotos = [];
    photos.forEach(tourEntry => {
      tourEntry.photos.forEach(photo => {
        allPhotos.push({
          ...photo,
          tourId: tourEntry.tourId,
          tourDate: new Date(tourEntry.createdAt)
        });
      });
    });

    // Aplicar filtros
    let filteredPhotos = allPhotos;
    if (filter === 'recent') {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      filteredPhotos = allPhotos.filter(photo => photo.tourDate > threeDaysAgo);
    }

    // Ordenar por fecha más reciente
    filteredPhotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    setMyPhotos(filteredPhotos);
  };

  const loadMyStats = () => {
    const guideId = user?.id === 'guide1' ? 'guide001' : 'guide002';
    const myStats = getPhotoStatistics(guideId);
    setStats(myStats);
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

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      tourist_group: 'bg-blue-100 text-blue-800',
      monument: 'bg-green-100 text-green-800',
      restaurant: 'bg-orange-100 text-orange-800',
      transport: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const openPreview = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePreview = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <PhotoIcon className="w-6 h-6 text-primary-600" />
                <div>
                  <h1 className="text-xl font-semibold">Mis Fotos de Tours</h1>
                  <p className="text-sm text-gray-600">Galería personal de fotos subidas</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Todas las fotos</option>
                <option value="recent">Últimos 3 días</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex items-center">
              <PhotoIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Fotos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalPhotos || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Tours con Fotos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.toursWithPhotos || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex items-center">
              <TagIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Promedio/Tour</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averagePhotosPerTour || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex items-center">
              <EyeIcon className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Mostrando</p>
                <p className="text-2xl font-semibold text-gray-900">{myPhotos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de fotos */}
        {myPhotos.length > 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Galería de Fotos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {myPhotos.map((photo) => (
                <div key={photo.id} className="group cursor-pointer" onClick={() => openPreview(photo)}>
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <EyeIcon className="w-6 h-6 text-white" />
                    </div>

                    {/* Info overlay */}
                    <div className="absolute top-2 left-2 right-2">
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(photo.category)}`}>
                          {getCategoryLabel(photo.category)}
                        </span>
                      </div>
                    </div>

                    {/* Tour info */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded truncate">
                        Tour: {photo.tourId}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes fotos aún</h3>
            <p className="text-gray-600 mb-4">
              Las fotos que subas durante tus tours aparecerán aquí.
            </p>
            <button
              onClick={() => navigate('/monitoring')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <MapPinIcon className="w-4 h-4" />
              Ir a Tours Activos
            </button>
          </div>
        )}

        {/* Modal de preview */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
              >
                <ArrowLeftIcon className="w-6 h-6 text-white" />
              </button>
              
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Info detallada */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-2xl mx-auto">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{selectedPhoto.name}</h3>
                    <p className="text-sm opacity-75">
                      {(selectedPhoto.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(selectedPhoto.category)}`}>
                    {getCategoryLabel(selectedPhoto.category)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Tour: {selectedPhoto.tourId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhotoIcon className="w-4 h-4" />
                    <span>{new Date(selectedPhoto.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                
                {selectedPhoto.description && (
                  <div className="border-t border-white border-opacity-20 pt-3">
                    <p className="text-sm">{selectedPhoto.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTourPhotos;