import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const ImageUpload = ({ onImageSelect, initialImage = null, error = null }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(initialImage);
  const [uploading, setUploading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  // Validar archivo de imagen
  const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: t('upload.invalidFormat') };
    }

    if (file.size > maxSize) {
      return { valid: false, error: t('upload.fileTooLarge') };
    }

    return { valid: true };
  };

  // Procesar archivo seleccionado
  const processFile = async (file) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      onImageSelect(null, validation.error);
      return;
    }

    setUploading(true);

    try {
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);

      // Simular upload (en producción aquí subirías a un servidor)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Retornar el archivo procesado
      onImageSelect(file, null);
    } catch (error) {
      setUploading(false);
      onImageSelect(null, t('upload.uploadError'));
    }
  };

  // Manejar drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Manejar drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Eliminar imagen
  const removeImage = () => {
    setPreview(null);
    onImageSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Abrir selector de archivos
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="label">{t('upload.profilePhoto')}</label>
      
      {preview ? (
        // Vista previa de la imagen
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Botón para eliminar */}
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          
          {/* Botón para cambiar imagen */}
          <button
            type="button"
            onClick={openFileSelector}
            className="absolute bottom-2 right-2 px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-lg hover:bg-opacity-70 transition-colors"
          >
            {t('upload.changePhoto')}
          </button>
        </div>
      ) : (
        // Zona de drag & drop
        <div
          className={`relative w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileSelector}
        >
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
                <p className="text-sm text-gray-600">{t('upload.uploading')}</p>
              </>
            ) : (
              <>
                <PhotoIcon className={`w-12 h-12 mb-3 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium mb-1 ${error ? 'text-red-600' : 'text-gray-700'}`}>
                  {dragActive ? t('upload.dropHere') : t('upload.dragOrClick')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('upload.supportedFormats')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('upload.maxSize')}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Panel de ayuda expandible */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <QuestionMarkCircleIcon className="w-4 h-4" />
          {t('upload.helpTitle')}
          {showHelp ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>

        {showHelp && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-2 text-sm text-blue-800">
              <div className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <PhotoIcon className="w-4 h-4" />
                Especificaciones recomendadas:
              </div>
              <p>{t('upload.helpResolution')}</p>
              <p>{t('upload.helpFormat')}</p>
              <p>{t('upload.helpSize')}</p>
              <p>{t('upload.helpComposition')}</p>
              <p>{t('upload.helpLighting')}</p>
              <p>{t('upload.helpQuality')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Ayuda adicional */}
      <p className="mt-2 text-xs text-gray-500">
        {t('upload.recommendation')}
      </p>
    </div>
  );
};

export default ImageUpload;