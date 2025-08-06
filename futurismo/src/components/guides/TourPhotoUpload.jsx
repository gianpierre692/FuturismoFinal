import { useState, useRef } from 'react';
import { PhotoIcon, PlusIcon, XMarkIcon, EyeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Logger from '../../utils/logger';

const TourPhotoUpload = ({ 
  tourId, 
  guideId, 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 10,
  readonly = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (photos.length + files.length > maxPhotos) {
      toast.error(t('monitoring.tourPhotoUpload.maxPhotosError', { max: maxPhotos }));
      return;
    }

    setUploading(true);
    
    try {
      const newPhotos = [];
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error(t('monitoring.tourPhotoUpload.invalidImage', { name: file.name }));
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(t('monitoring.tourPhotoUpload.fileTooLarge', { name: file.name }));
          continue;
        }

        const imageUrl = URL.createObjectURL(file);
        
        // Obtener metadatos de la imagen (ubicación, hora)
        const exifData = await extractImageMetadata(file);
        
        const photoData = {
          id: Date.now() + Math.random(),
          file: file,
          url: imageUrl,
          name: file.name,
          size: file.size,
          tourId: tourId,
          guideId: guideId,
          uploadedAt: new Date(),
          location: exifData.location,
          timestamp: exifData.timestamp || new Date(),
          description: '',
          category: 'general', // general, tourist_group, monument, restaurant, transport
          status: 'uploaded'
        };

        newPhotos.push(photoData);
      }

      const updatedPhotos = [...photos, ...newPhotos];
      onPhotosChange(updatedPhotos);
      
      if (newPhotos.length > 0) {
        const photosText = newPhotos.length > 1 ? t('monitoring.tourPhotoUpload.photosUploadedPlural') : t('monitoring.tourPhotoUpload.photoUploaded');
        toast.success(`${newPhotos.length} ${photosText} ${t('monitoring.tourPhotoUpload.ofTour')}`);
      }
      
    } catch (error) {
      toast.error(t('monitoring.tourPhotoUpload.uploadError'));
      Logger.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Función para extraer metadatos de la imagen
  const extractImageMetadata = async (file) => {
    return new Promise((resolve) => {
      // En un entorno real, aquí extraerías datos EXIF
      // Por ahora retornamos datos mock
      resolve({
        location: null, // Se obtendría del GPS si está disponible
        timestamp: file.lastModified ? new Date(file.lastModified) : new Date()
      });
    });
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
    
    const photoToRemove = photos.find(photo => photo.id === photoId);
    if (photoToRemove && photoToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    toast.success(t('monitoring.tourPhotoUpload.photoDeleted'));
  };

  const updatePhotoDescription = (photoId, description) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, description } : photo
    );
    onPhotosChange(updatedPhotos);
  };

  const updatePhotoCategory = (photoId, category) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, category } : photo
    );
    onPhotosChange(updatedPhotos);
  };

  const openPreview = (photo) => {
    setPreviewPhoto(photo);
  };

  const closePreview = () => {
    setPreviewPhoto(null);
  };

  const getCategoryLabel = (category) => {
    const categories = {
      general: t('monitoring.tourPhotoUpload.categories.general'),
      tourist_group: t('monitoring.tourPhotoUpload.categories.touristGroup'),
      monument: t('monitoring.tourPhotoUpload.categories.monument'),
      restaurant: t('monitoring.tourPhotoUpload.categories.restaurant'),
      transport: t('monitoring.tourPhotoUpload.categories.transport')
    };
    return categories[category] || t('monitoring.tourPhotoUpload.categories.general');
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {t('monitoring.tourPhotoUpload.tourPhotos')}
        </h3>
        <span className="text-sm text-gray-500">
          {photos.length}/{maxPhotos} {t('monitoring.tourPhotoUpload.photos')}
        </span>
      </div>

      {!readonly && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || photos.length >= maxPhotos}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('monitoring.tourPhotoUpload.uploadingPhotos')}
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4" />
                {t('monitoring.tourPhotoUpload.addTourPhotos')}
              </>
            )}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Grid de fotos */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <div className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openPreview(photo)}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      title={t('monitoring.tourPhotoUpload.viewPhoto')}
                    >
                      <EyeIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    {!readonly && (
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                        title={t('monitoring.tourPhotoUpload.deletePhoto')}
                      >
                        <XMarkIcon className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info de timestamp y ubicación */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <div className="flex items-center gap-1 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                    <ClockIcon className="w-3 h-3" />
                    {new Date(photo.timestamp).toLocaleTimeString()}
                  </div>
                  {photo.location && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      <MapPinIcon className="w-3 h-3" />
                      GPS
                    </div>
                  )}
                </div>

                {/* Categoría */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(photo.category)}`}>
                    {getCategoryLabel(photo.category)}
                  </span>
                </div>
              </div>

              {/* Controles de edición */}
              {!readonly && (
                <div className="space-y-2">
                  <select
                    value={photo.category}
                    onChange={(e) => updatePhotoCategory(photo.id, e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="general">{t('monitoring.tourPhotoUpload.categories.general')}</option>
                    <option value="tourist_group">{t('monitoring.tourPhotoUpload.categories.touristGroup')}</option>
                    <option value="monument">{t('monitoring.tourPhotoUpload.categories.monument')}</option>
                    <option value="restaurant">{t('monitoring.tourPhotoUpload.categories.restaurant')}</option>
                    <option value="transport">{t('monitoring.tourPhotoUpload.categories.transport')}</option>
                  </select>
                  
                  <textarea
                    placeholder={t('monitoring.tourPhotoUpload.photoDescription')}
                    value={photo.description}
                    onChange={(e) => updatePhotoDescription(photo.id, e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 resize-none"
                    rows="2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            {readonly ? t('monitoring.tourPhotoUpload.noPhotos') : t('monitoring.tourPhotoUpload.noPhotosUploaded')}
          </p>
          <p className="text-xs text-gray-500">
            {readonly 
              ? t('monitoring.tourPhotoUpload.noPhotosDocumented') 
              : t('monitoring.tourPhotoUpload.photosHelpDocument')
            }
          </p>
        </div>
      )}

      {/* Modal de preview */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-10"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            
            <img
              src={previewPhoto.url}
              alt={previewPhoto.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Info detallada */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{previewPhoto.name}</p>
                  <p className="text-sm opacity-75">
                    {(previewPhoto.size / 1024 / 1024).toFixed(1)} {t('monitoring.tourPhotoUpload.sizeInMB')}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(previewPhoto.category)}`}>
                  {getCategoryLabel(previewPhoto.category)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {new Date(previewPhoto.timestamp).toLocaleString()}
                </div>
                {previewPhoto.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {t('monitoring.tourPhotoUpload.gpsLocationAvailable')}
                  </div>
                )}
              </div>
              
              {previewPhoto.description && (
                <p className="mt-2 text-sm">{previewPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPhotoUpload;