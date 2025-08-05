import { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  EyeIcon, 
  XMarkIcon, 
  FunnelIcon,
  CalendarDaysIcon,
  UserIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import useGuidesStore from '../../stores/guidesStore';

const TourPhotosViewer = ({ tourId = null, guideId = null }) => {
  const { searchTourPhotos, getPhotoStatistics, getGuideById } = useGuidesStore(state => state.actions);
  const guides = useGuidesStore(state => state.guides);
  
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({});
  
  const [filters, setFilters] = useState({
    guideId: guideId || '',
    tourId: tourId || '',
    category: '',
    dateFrom: '',
    dateTo: '',
    description: ''
  });

  // Cargar fotos y estadísticas
  useEffect(() => {
    loadPhotos();
    loadStatistics();
  }, [filters]);

  const loadPhotos = () => {
    const searchCriteria = {
      ...filters,
      guideId: filters.guideId || guideId,
      tourId: filters.tourId || tourId
    };
    
    // Remover filtros vacíos
    Object.keys(searchCriteria).forEach(key => {
      if (!searchCriteria[key]) {
        delete searchCriteria[key];
      }
    });

    const results = searchTourPhotos(searchCriteria);
    
    // Aplanar las fotos de todos los tours
    const allPhotos = [];
    results.forEach(tourEntry => {
      tourEntry.photos.forEach(photo => {
        allPhotos.push({
          ...photo,
          tourId: tourEntry.tourId,
          guideName: getGuideById(tourEntry.guideId)?.fullName || 'Guía desconocido'
        });
      });
    });

    setPhotos(allPhotos);
    setFilteredPhotos(allPhotos);
  };

  const loadStatistics = () => {
    const allStats = getPhotoStatistics();
    const guideStats = filters.guideId ? getPhotoStatistics(filters.guideId) : null;
    
    setStats({
      total: allStats,
      guide: guideStats
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      guideId: guideId || '',
      tourId: tourId || '',
      category: '',
      dateFrom: '',
      dateTo: '',
      description: ''
    });
  };

  const openPhotoModal = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(index);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    setCurrentPhotoIndex(0);
  };

  const navigatePhoto = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentPhotoIndex + 1) % filteredPhotos.length
      : (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fotos de Tours</h2>
          <p className="text-sm text-gray-600 mt-1">
            Visualización y gestión de fotos subidas por guías
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FunnelIcon className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <PhotoIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Fotos</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats.total?.totalPhotos || 0}
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Tours con Fotos</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.total?.toursWithPhotos || 0}
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Promedio/Tour</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {stats.total?.averagePhotosPerTour || 0}
          </p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Fotos Mostradas</span>
          </div>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {filteredPhotos.length}
          </p>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guía</label>
              <select
                value={filters.guideId}
                onChange={(e) => handleFilterChange('guideId', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Todos los guías</option>
                {guides.map(guide => (
                  <option key={guide.id} value={guide.id}>
                    {guide.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Todas las categorías</option>
                <option value="general">General</option>
                <option value="tourist_group">Grupo turista</option>
                <option value="monument">Monumento/Lugar</option>
                <option value="restaurant">Restaurante/Comida</option>
                <option value="transport">Transporte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar descripción</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.description}
                  onChange={(e) => handleFilterChange('description', e.target.value)}
                  placeholder="Buscar en descripciones..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pl-8 text-sm"
                />
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Grid de fotos */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div key={photo.id} className="group cursor-pointer" onClick={() => openPhotoModal(photo, index)}>
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
                    <div className="flex items-center gap-1 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      <ClockIcon className="w-3 h-3" />
                      {new Date(photo.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Guide info */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded truncate">
                    {photo.guideName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron fotos</h3>
          <p className="text-gray-600">
            No hay fotos que coincidan con los filtros aplicados.
          </p>
        </div>
      )}

      {/* Modal de foto */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            {/* Botón cerrar */}
            <button
              onClick={closePhotoModal}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Navegación */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={() => navigatePhoto('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => navigatePhoto('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Contador */}
            {filteredPhotos.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                {currentPhotoIndex + 1} de {filteredPhotos.length}
              </div>
            )}
            
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
                  <UserIcon className="w-4 h-4" />
                  <span>Guía: {selectedPhoto.guideName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Tour ID: {selectedPhoto.tourId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{new Date(selectedPhoto.timestamp).toLocaleString()}</span>
                </div>
                {selectedPhoto.location && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Ubicación GPS disponible</span>
                  </div>
                )}
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
  );
};

export default TourPhotosViewer;