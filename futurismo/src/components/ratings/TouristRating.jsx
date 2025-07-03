import { useState } from 'react';
import { FaceSmileIcon, FaceFrownIcon, HandThumbUpIcon, HandThumbDownIcon, HeartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { FaceSmileIcon as FaceSmileSolid, FaceFrownIcon as FaceFrownSolid, HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const TouristRating = ({ 
  touristId, 
  touristName, 
  serviceId, 
  onRatingSubmitted, 
  existingRating = null,
  showComments = true 
}) => {
  const [selectedRating, setSelectedRating] = useState(existingRating?.rating || null);
  const [comments, setComments] = useState(existingRating?.comments || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingOptions = [
    {
      value: 'excellent',
      label: '😊 Excelente',
      description: 'El turista tuvo una experiencia excepcional',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200 hover:bg-green-100',
      selectedBg: 'bg-green-500 border-green-500 text-white',
      icon: FaceSmileIcon,
      iconSolid: FaceSmileSolid
    },
    {
      value: 'good',
      label: '👍 Bueno',
      description: 'El turista quedó satisfecho con el servicio',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      selectedBg: 'bg-blue-500 border-blue-500 text-white',
      icon: HandThumbUpIcon,
      iconSolid: HandThumbUpSolid
    },
    {
      value: 'poor',
      label: '😞 Regular',
      description: 'El turista no quedó completamente satisfecho',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200 hover:bg-red-100',
      selectedBg: 'bg-red-500 border-red-500 text-white',
      icon: FaceFrownIcon,
      iconSolid: FaceFrownSolid
    }
  ];

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async () => {
    if (!selectedRating) {
      toast.error('Por favor selecciona una valoración');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío a la API
      const ratingData = {
        touristId,
        serviceId,
        rating: selectedRating,
        comments: comments.trim(),
        ratedBy: 'agency', // Indica que fue valorado por la agencia
        ratedAt: new Date(),
        touristName
      };

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí iría la llamada a la API
      console.log('Rating submitted:', ratingData);

      toast.success(`Valoración "${ratingOptions.find(r => r.value === selectedRating)?.label}" enviada correctamente`);
      
      if (onRatingSubmitted) {
        onRatingSubmitted(ratingData);
      }

    } catch (error) {
      toast.error('Error al enviar la valoración');
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOption = ratingOptions.find(option => option.value === selectedRating);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <HeartIcon className="w-6 h-6 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Valorar Experiencia del Turista
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{touristName}</span> - ¿Cómo fue su experiencia en el tour?
        </p>
      </div>

      {/* Rating Options */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Selecciona la valoración que mejor describa la experiencia:
        </p>
        
        {ratingOptions.map((option) => {
          const Icon = selectedRating === option.value ? option.iconSolid : option.icon;
          const isSelected = selectedRating === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleRatingSelect(option.value)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                isSelected ? option.selectedBg : `${option.bgColor} border-gray-200`
              }`}
              disabled={isSubmitting}
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 ${isSelected ? 'text-white' : option.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {option.label}
                  </div>
                  <div className={`text-sm ${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios adicionales (opcional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Detalles adicionales sobre la experiencia del turista..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              Ejemplo: "El turista mostró mucho interés en la historia", "Preguntó por más información", etc.
            </p>
            <span className="text-xs text-gray-400">
              {comments.length}/500
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ExclamationTriangleIcon className="w-4 h-4" />
          <span>Esta valoración será registrada para análisis interno</span>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!selectedRating || isSubmitting}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Enviando...
            </>
          ) : (
            <>
              <HeartSolid className="w-4 h-4" />
              Enviar Valoración
            </>
          )}
        </button>
      </div>

      {/* Selected Rating Preview */}
      {selectedRating && !isSubmitting && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Valoración seleccionada:</span>
            <span className={`font-semibold ${selectedOption?.color}`}>
              {selectedOption?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristRating;