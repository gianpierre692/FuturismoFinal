import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StarIcon, GiftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { reviewSchema } from '../../utils/validationSchemas/marketplaceSchemas';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import Logger from '../../utils/logger';

const ServiceReview = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { serviceRequests, getGuideById, createReview, updateServiceRequest, awardAgencyPoints } = useMarketplaceStore();
  
  const [request, setRequest] = useState(null);
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState({});
  const [awardPoints, setAwardPoints] = useState(false);
  const [pointsToAward, setPointsToAward] = useState(10);
  const [pointsReason, setPointsReason] = useState('');

  const ratingCategories = [
    { key: 'overall', label: 'Calificación general', description: 'Tu experiencia general con el guía' },
    { key: 'communication', label: 'Comunicación', description: 'Claridad y fluidez en la comunicación' },
    { key: 'knowledge', label: 'Conocimiento', description: 'Dominio del tema y capacidad de explicación' },
    { key: 'punctuality', label: 'Puntualidad', description: 'Cumplimiento de horarios acordados' },
    { key: 'professionalism', label: 'Profesionalismo', description: 'Actitud profesional y cortesía' },
    { key: 'valueForMoney', label: 'Relación calidad-precio', description: 'Valor recibido por el precio pagado' }
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      ratings: {
        overall: 0,
        communication: 0,
        knowledge: 0,
        punctuality: 0,
        professionalism: 0,
        valueForMoney: 0
      },
      review: {
        title: '',
        content: '',
        wouldRecommend: null,
        wouldHireAgain: null
      }
    }
  });

  const watchRatings = watch('ratings');
  const watchRecommend = watch('review.wouldRecommend');
  const watchHireAgain = watch('review.wouldHireAgain');

  useEffect(() => {
    loadRequestData();
  }, [requestId]);

  const loadRequestData = async () => {
    setIsLoading(true);
    try {
      const foundRequest = serviceRequests.find(r => r.id === requestId);
      if (foundRequest && foundRequest.status === 'completed') {
        setRequest(foundRequest);
        const guideData = getGuideById(foundRequest.guideId);
        setGuide(guideData);
      } else {
        navigate('/marketplace/requests');
      }
    } catch (error) {
      Logger.error('Error loading request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingClick = (category, rating) => {
    setValue(`ratings.${category}`, rating);
  };

  const handleRatingHover = (category, rating) => {
    setHoveredRating(prev => ({ ...prev, [category]: rating }));
  };

  const handleRatingLeave = (category) => {
    setHoveredRating(prev => ({ ...prev, [category]: 0 }));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const reviewData = {
        serviceRequestId: requestId,
        guideId: guide.id,
        agencyId: user.id,
        ratings: data.ratings,
        review: data.review,
        metadata: {
          serviceType: request.serviceDetails.type,
          serviceDate: request.serviceDetails.date,
          groupSize: request.serviceDetails.groupSize
        }
      };

      createReview(reviewData);
      
      // Otorgar puntos de agencia si está habilitado
      if (awardPoints && pointsToAward > 0) {
        awardAgencyPoints(
          guide.id,
          user.id,
          user.agencyName || 'Agencia',
          requestId,
          pointsToAward,
          pointsReason || 'Puntos otorgados por excelente servicio'
        );
        toast.success(`¡Reseña enviada y ${pointsToAward} puntos otorgados al guía!`);
      } else {
        toast.success('¡Reseña enviada exitosamente!');
      }
      
      // Marcar solicitud como reseñada
      updateServiceRequest(requestId, { hasReview: true });
      
      navigate(`/marketplace/requests/${requestId}`);
    } catch (error) {
      Logger.error('Error creating review:', error);
      toast.error('Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ category, value, description }) => {
    const currentRating = watchRatings[category] || 0;
    const hoverRating = hoveredRating[category] || 0;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-900">{value}</label>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(category, star)}
                onMouseEnter={() => handleRatingHover(category, star)}
                onMouseLeave={() => handleRatingLeave(category)}
                className="p-1 transition-colors hover:bg-gray-50 rounded"
              >
                {star <= (hoverRating || currentRating) ? (
                  <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                ) : (
                  <StarIcon className="h-6 w-6 text-gray-300" />
                )}
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600 w-12 text-right">
              {currentRating > 0 && `${currentRating}/5`}
            </span>
          </div>
        </div>
        {errors.ratings?.[category] && (
          <p className="text-sm text-red-600">{errors.ratings[category].message}</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!request || !guide) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Califica tu experiencia</h1>
          
          {/* Información del servicio */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <img
                src={guide.profile.avatar}
                alt={guide.fullName}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{guide.fullName}</p>
                <p className="text-sm text-gray-600">
                  {request.serviceDetails.tourName || request.serviceDetails.type} • 
                  {' '}{new Date(request.serviceDetails.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de reseña */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Calificaciones */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Calificaciones</h2>
            
            <div className="space-y-4">
              {ratingCategories.map((category) => (
                <RatingStars
                  key={category.key}
                  category={category.key}
                  value={category.label}
                  description={category.description}
                />
              ))}
            </div>
          </div>

          {/* Reseña escrita */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tu reseña</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de tu reseña
                </label>
                <input
                  type="text"
                  {...register('review.title')}
                  placeholder="Resume tu experiencia en una frase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                {errors.review?.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.review.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuéntanos tu experiencia
                </label>
                <textarea
                  {...register('review.content')}
                  rows={5}
                  placeholder="¿Qué te gustó? ¿Qué podría mejorar? Tu opinión ayuda a otros viajeros..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                />
                {errors.review?.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.review.content.message}</p>
                )}
              </div>

              {/* Preguntas de recomendación */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    ¿Recomendarías este guía a otros viajeros?
                  </p>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('review.wouldRecommend')}
                        value="true"
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm">Sí, lo recomendaría</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('review.wouldRecommend')}
                        value="false"
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm">No lo recomendaría</span>
                    </label>
                  </div>
                  {errors.review?.wouldRecommend && (
                    <p className="mt-1 text-sm text-red-600">{errors.review.wouldRecommend.message}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    ¿Contratarías nuevamente a este guía?
                  </p>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('review.wouldHireAgain')}
                        value="true"
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm">Sí, definitivamente</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('review.wouldHireAgain')}
                        value="false"
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm">No, buscaría otro guía</span>
                    </label>
                  </div>
                  {errors.review?.wouldHireAgain && (
                    <p className="mt-1 text-sm text-red-600">{errors.review.wouldHireAgain.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de puntos (opcional) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GiftIcon className="h-5 w-5 text-purple-500" />
                  Otorgar puntos adicionales (opcional)
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Reconoce el excelente trabajo del guía otorgándole puntos adicionales
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={awardPoints}
                  onChange={(e) => setAwardPoints(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Otorgar puntos
                </span>
              </label>
            </div>
            
            {awardPoints && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <SparklesIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-purple-800 mb-1">¿Por qué otorgar puntos?</p>
                      <p className="text-purple-700">
                        Los puntos adicionales ayudan a los guías a mejorar su posición en el marketplace 
                        y son una forma de reconocer un servicio excepcional.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad de puntos
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={pointsToAward}
                        onChange={(e) => setPointsToAward(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-lg">
                        <GiftIcon className="h-4 w-4 text-purple-600" />
                        <span className="font-bold text-purple-700">{pointsToAward}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5 puntos</span>
                      <span>50 puntos</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo (opcional)
                    </label>
                    <input
                      type="text"
                      value={pointsReason}
                      onChange={(e) => setPointsReason(e.target.value)}
                      placeholder="Ej: Excelente conocimiento histórico"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {pointsReason.length}/100 caracteres
                    </p>
                  </div>
                </div>
                
                {/* Sugerencias de puntos */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Sugerencias:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { points: 10, reason: 'Servicio profesional' },
                      { points: 15, reason: 'Conocimiento excepcional' },
                      { points: 20, reason: 'Experiencia memorable' },
                      { points: 25, reason: 'Superó las expectativas' }
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setPointsToAward(suggestion.points);
                          setPointsReason(suggestion.reason);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        <GiftIcon className="h-3 w-3" />
                        {suggestion.points} pts - {suggestion.reason}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumen visual */}
          {watchRatings.overall > 0 && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`h-6 w-6 ${
                        i < watchRatings.overall ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-cyan-900">
                  Tu calificación general: <span className="font-semibold">{watchRatings.overall}/5</span>
                </p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/marketplace/requests/${requestId}`)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  Enviando...
                </span>
              ) : (
                'Enviar reseña'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceReview;