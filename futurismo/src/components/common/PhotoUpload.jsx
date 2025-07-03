import { useState, useRef } from 'react';
import { PhotoIcon, PlusIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PhotoUpload = ({ photos = [], onPhotosChange, maxPhotos = 5, acceptedTypes = "image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (photos.length + files.length > maxPhotos) {
      toast.error(`Máximo ${maxPhotos} fotos permitidas`);
      return;
    }

    setUploading(true);
    
    try {
      const newPhotos = [];
      
      for (const file of files) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`);
          continue;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} es muy grande (máximo 5MB)`);
          continue;
        }

        // Crear preview de la imagen
        const imageUrl = URL.createObjectURL(file);
        
        // Simular upload (en producción aquí iría la subida al servidor)
        const photoData = {
          id: Date.now() + Math.random(),
          file: file,
          url: imageUrl,
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
          status: 'uploaded' // 'uploading', 'uploaded', 'error'
        };

        newPhotos.push(photoData);
      }

      const updatedPhotos = [...photos, ...newPhotos];
      onPhotosChange(updatedPhotos);
      
      if (newPhotos.length > 0) {
        toast.success(`${newPhotos.length} foto${newPhotos.length > 1 ? 's' : ''} agregada${newPhotos.length > 1 ? 's' : ''}`);
      }
      
    } catch (error) {
      toast.error('Error al subir las fotos');
      console.error(error);
    } finally {
      setUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
    
    // Liberar memoria del URL del blob
    const photoToRemove = photos.find(photo => photo.id === photoId);
    if (photoToRemove && photoToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    toast.success('Foto eliminada');
  };

  const openPreview = (photo) => {
    setPreviewPhoto(photo);
  };

  const closePreview = () => {
    setPreviewPhoto(null);
  };

  return (
    <div className="space-y-3">
      {/* Botón de subida */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || photos.length >= maxPhotos}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              Subiendo...
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" />
              Agregar fotos
            </>
          )}
        </button>
        
        <span className="text-sm text-gray-500">
          {photos.length}/{maxPhotos} fotos
        </span>
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Grid de fotos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
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
                    className="p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Ver foto"
                  >
                    <EyeIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Eliminar foto"
                  >
                    <XMarkIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Indicador de estado */}
              {photo.status === 'uploading' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {photos.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">No hay fotos agregadas</p>
          <p className="text-xs text-gray-500">
            Las fotos son opcionales pero ayudan a documentar la visita
          </p>
        </div>
      )}

      {/* Modal de preview */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            
            <img
              src={previewPhoto.url}
              alt={previewPhoto.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
              <p className="text-sm font-medium">{previewPhoto.name}</p>
              <p className="text-xs opacity-75">
                {(previewPhoto.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;