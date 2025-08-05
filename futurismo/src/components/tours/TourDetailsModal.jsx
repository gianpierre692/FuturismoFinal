import { useState } from 'react';
import { 
  XMarkIcon, 
  EyeIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  StarIcon,
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import useGuidesStore from '../../stores/guidesStore';

const TourDetailsModal = ({ tour, isOpen, onClose }) => {
  const { getTourPhotos } = useGuidesStore(state => state.actions);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  if (!isOpen || !tour) return null;

  // Obtener fotos del tour
  const tourPhotos = getTourPhotos(tour.id) || [];

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

  const openPhotoGallery = (index = 0) => {
    setSelectedPhotoIndex(index);
    setShowPhotoGallery(true);
  };

  const closePhotoGallery = () => {
    setShowPhotoGallery(false);
    setSelectedPhotoIndex(0);
  };

  const navigatePhoto = (direction) => {
    if (direction === 'next') {
      setSelectedPhotoIndex((prev) => (prev + 1) % tourPhotos.length);
    } else {
      setSelectedPhotoIndex((prev) => (prev - 1 + tourPhotos.length) % tourPhotos.length);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'En progreso':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tour.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <MapPinIcon className="w-4 h-4" />
                    {tour.destination || 'Centro de Lima'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Contenido */}           
            <div className="bg-white px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del Tour */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                    Detalles del Tour
                  </h4>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Código:</span>
                      <span className="text-sm text-gray-900">{tour.code || 'TRIP-001'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Cliente:</span>
                      <span className="text-sm text-gray-900">{tour.client || 'Juan Pérez'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Fecha:</span>
                      <span className="text-sm text-gray-900 flex items-center gap-1">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {tour.date || '14 ene 2024'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Hora:</span>
                      <span className="text-sm text-gray-900 flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {tour.time || '08:00 (4 horas)'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Turistas:</span>
                      <span className="text-sm text-gray-900 flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {tour.tourists || '4 personas'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Monto:</span>
                      <span className="text-sm text-gray-900 flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        {tour.amount || 'S/ 1,080.00'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tour.status || 'Completado')}`}>
                        {tour.status || 'Completado'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-900">{tour.rating || '4.8'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guías Asignados */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Guías Asignados</h5>
                    <div className="space-y-2">
                      {(tour.guides || ['Carlos Mendez', 'Luis García', 'Toyota Hiace']).map((guide, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {guide}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fotos del Tour */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <PhotoIcon className="w-5 h-5 text-green-600" />
                    Fotos del Tour ({tourPhotos.length})
                  </h4>
                  
                  {tourPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tourPhotos.slice(0, 6).map((photo, index) => (
                        <div 
                          key={photo.id} 
                          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => openPhotoGallery(index)}
                        >
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <EyeIcon className="w-6 h-6 text-white" />
                          </div>

                          {/* Categoría */}
                          <div className="absolute top-2 right-2">
                            <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getCategoryColor(photo.category)}`}>
                              {getCategoryLabel(photo.category)}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {tourPhotos.length > 6 && (
                        <div 
                          className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => openPhotoGallery(6)}
                        >
                          <div className="text-center">
                            <PhotoIcon className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">+{tourPhotos.length - 6} más</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">No hay fotos para este tour</p>
                      <p className="text-xs text-gray-500 mt-1">Las fotos aparecerán aquí cuando se suban</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Galería de Fotos */}
      {showPhotoGallery && tourPhotos.length > 0 && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-95 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            {/* Botón cerrar */}
            <button
              onClick={closePhotoGallery}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Navegación */}
            {tourPhotos.length > 1 && (
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
            {tourPhotos.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                {selectedPhotoIndex + 1} de {tourPhotos.length}
              </div>
            )}
            
            <img
              src={tourPhotos[selectedPhotoIndex]?.url}
              alt={tourPhotos[selectedPhotoIndex]?.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Info de la foto */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg max-w-2xl mx-auto">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{tourPhotos[selectedPhotoIndex]?.name}</h3>
                  <p className="text-sm opacity-75">
                    {tourPhotos[selectedPhotoIndex] && (tourPhotos[selectedPhotoIndex].size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(tourPhotos[selectedPhotoIndex]?.category)}`}>
                  {getCategoryLabel(tourPhotos[selectedPhotoIndex]?.category)}
                </span>
              </div>
              
              <div className="text-sm mb-3">
                <p>📅 {new Date(tourPhotos[selectedPhotoIndex]?.timestamp).toLocaleString()}</p>
              </div>
              
              {tourPhotos[selectedPhotoIndex]?.description && (
                <div className="border-t border-white border-opacity-20 pt-3">
                  <p className="text-sm">{tourPhotos[selectedPhotoIndex].description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TourDetailsModal;