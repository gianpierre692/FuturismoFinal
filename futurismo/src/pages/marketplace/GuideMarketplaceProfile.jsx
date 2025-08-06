import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  StarIcon, 
  MapPinIcon, 
  LanguageIcon, 
  CheckBadgeIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import Logger from '../../utils/logger';

const GuideMarketplaceProfile = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { getGuideById, getGuideReviews } = useMarketplaceStore();
  const { t } = useTranslation();
  
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tourTypeNames = {
    cultural: 'Cultural',
    aventura: 'Aventura',
    gastronomico: 'Gastronómico',
    mistico: 'Místico',
    fotografico: 'Fotográfico'
  };

  const languageNames = {
    es: 'Español',
    en: 'Inglés',
    fr: 'Francés',
    de: 'Alemán',
    it: 'Italiano',
    pt: 'Portugués',
    ja: 'Japonés',
    ko: 'Coreano',
    zh: 'Chino',
    ru: 'Ruso'
  };

  useEffect(() => {
    loadGuideData();
  }, [guideId]);

  const loadGuideData = async () => {
    setIsLoading(true);
    try {
      const guideData = await getGuideById(guideId);
      setGuide(guideData);
      
      const reviewsData = await getGuideReviews(guideId);
      setReviews(reviewsData);
    } catch (error) {
      Logger.error('Error loading guide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Guía no encontrado</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="text-primary hover:underline"
        >
          Volver al marketplace
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.name,
        text: `Conoce a ${guide.name}, guía turístico profesional`,
        url: window.location.href
      });
    }
  };

  const handleContact = () => {
    navigate(`/marketplace/booking/${guideId}`);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Vista móvil
  if (screenSize.isMobile) {
    return (
      <div className="min-h-screen bg-white overflow-hidden flex flex-col">
        {/* Header móvil con imagen */}
        <div className="relative">
          <img
            src={guide.profile?.profilePhoto || '/api/placeholder/400/400'}
            alt={guide.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Botón volver */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full"
          >
            <ArrowLeftIcon className="h-5 w-5 text-white" />
          </button>
          
          {/* Botones de acción */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
            >
              {isFavorite ? (
                <HeartIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-5 w-5 text-white" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
            >
              <ShareIcon className="h-5 w-5 text-white" />
            </button>
          </div>
          
          {/* Info básica sobre la imagen */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white mb-1">{guide.name}</h1>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <MapPinIcon className="h-4 w-4" />
              <span>{guide.location || 'Cusco, Perú'}</span>
            </div>
          </div>
        </div>

        {/* Stats rápidos */}
        <div className="bg-white border-b">
          <div className="grid grid-cols-3 divide-x">
            <div className="py-3 text-center">
              <p className="text-xl font-semibold text-gray-900">
                {guide.stats?.toursCompleted || 0}
              </p>
              <p className="text-xs text-gray-500">Tours</p>
            </div>
            <div className="py-3 text-center">
              <div className="flex justify-center">
                {renderStars(guide.rating || 4.9)}
              </div>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div className="py-3 text-center">
              <p className="text-xl font-semibold text-gray-900">
                {guide.yearsExperience || 5}
              </p>
              <p className="text-xs text-gray-500">Años exp.</p>
            </div>
          </div>
        </div>

        {/* Tabs móvil */}
        <div className="bg-white sticky top-0 z-10 border-b">
          <div className="flex overflow-x-auto">
            {['about', 'experience', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500'
                }`}
              >
                {tab === 'about' && 'Acerca de'}
                {tab === 'experience' && 'Experiencia'}
                {tab === 'reviews' && 'Reseñas'}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de tabs */}
        <div className="flex-1 overflow-y-auto pb-20">
          {activeTab === 'about' && (
            <div className="space-y-4 p-4">
              {/* Bio */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Sobre mí</h3>
                <p className="text-gray-600 text-sm">
                  {guide.profile?.bio || 'Guía turístico profesional con amplia experiencia en la región.'}
                </p>
              </div>

              {/* Idiomas */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <LanguageIcon className="h-5 w-5 text-gray-400" />
                  Idiomas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(guide.languages || ['es', 'en']).map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {languageNames[lang] || lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Especialidades */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {(guide.tourTypes || ['cultural', 'aventura']).map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tourTypeNames[type] || type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4 p-4">
              {/* Certificaciones */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  Certificaciones
                </h3>
                <div className="space-y-2">
                  {(guide.certifications || []).map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experiencia destacada */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Experiencia destacada</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Más de {guide.stats?.toursCompleted || 500} tours completados
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Especialista en {guide.tourTypes?.length || 3} tipos de tours
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 p-4">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-500">Aún no hay reseñas</p>
                </div>
              ) : (
                reviews.map((review, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{review.userName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Botón de acción fijo */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <button
            onClick={handleContact}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-medium"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            Contactar
          </button>
        </div>
      </div>
    );
  }

  // Vista desktop
  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen de fondo */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-gray-900">
        <img
          src={guide.profile?.coverPhoto || '/api/placeholder/1200/400'}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Botón volver */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 -mt-16 sm:-mt-20 lg:-mt-24 relative z-10 pb-8 mb-8">
        {/* Card principal */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6">
              {/* Foto de perfil */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={guide.profile?.profilePhoto || '/api/placeholder/200/200'}
                  alt={guide.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>

              {/* Información principal */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{guide.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{guide.location || 'Cusco, Perú'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(guide.rating || 4.9)}
                      </div>
                      {guide.isVerified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckBadgeIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">Verificado</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 sm:p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {isFavorite ? (
                        <HeartIcon className="h-5 sm:h-6 w-5 sm:w-6 text-red-500" />
                      ) : (
                        <HeartOutlineIcon className="h-5 sm:h-6 w-5 sm:w-6 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 sm:p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ShareIcon className="h-5 sm:h-6 w-5 sm:w-6 text-gray-600" />
                    </button>
                    <button
                      onClick={handleContact}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      Contactar
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-3 sm:mt-4 py-3 sm:py-4 border-t border-gray-200">
                  <div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {guide.stats?.toursCompleted || 0}
                    </p>
                    <p className="text-xs text-gray-500">Tours completados</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {guide.yearsExperience || 5}
                    </p>
                    <p className="text-xs text-gray-500">Años de experiencia</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {guide.languages?.length || 2}
                    </p>
                    <p className="text-xs text-gray-500">Idiomas</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {guide.rating || 4.9}
                    </p>
                    <p className="text-xs text-gray-500">Rating promedio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 sticky top-0 bg-white z-10">
            <nav className="flex overflow-x-auto">
              {['about', 'experience', 'reviews', 'availability'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-fit py-2 sm:py-3 px-3 sm:px-4 text-center border-b-2 font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'about' && 'Acerca de'}
                  {tab === 'experience' && 'Experiencia'}
                  {tab === 'reviews' && 'Reseñas'}
                  {tab === 'availability' && (screenSize.isDesktop ? 'Disponibilidad' : 'Disp.')}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido de tabs */}
          <div className="p-3 sm:p-4 lg:p-6">
            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                  {/* Bio */}
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Sobre mí</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {guide.profile?.bio || 'Guía turístico profesional con amplia experiencia en la región.'}
                    </p>
                  </div>

                  {/* Galería */}
                  {guide.profile?.photos && guide.profile.photos.length > 0 && (
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Galería</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {guide.profile.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-20 sm:h-24 lg:h-28 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Idiomas */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <LanguageIcon className="h-4 w-4 text-gray-400" />
                      Idiomas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(guide.languages || ['es', 'en']).map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {languageNames[lang] || lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Especialidades */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Especialidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {(guide.tourTypes || ['cultural', 'aventura']).map((type) => (
                        <span
                          key={type}
                          className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          {tourTypeNames[type] || type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Certificaciones */}
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <AcademicCapIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    Certificaciones
                  </h3>
                  <div className="space-y-3">
                    {(guide.certifications || []).map((cert, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckBadgeIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{cert.name}</p>
                          <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experiencia destacada */}
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Experiencia destacada</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <UserGroupIcon className="h-5 sm:h-6 w-5 sm:w-6 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base text-gray-900">Tours grupales</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Experiencia con grupos de hasta 30 personas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aún no hay reseñas</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{review.userName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        {review.tourType && (
                          <p className="text-sm text-gray-500 mt-2">
                            Tour: {tourTypeNames[review.tourType] || review.tourType}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="max-w-2xl">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Disponibilidad</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    Para consultar disponibilidad específica, por favor contacta directamente con el guía.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    <span className="text-sm sm:text-base text-gray-600">Disponible todo el año</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    <span className="text-sm sm:text-base text-gray-600">Horario flexible</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CurrencyDollarIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    <span className="text-sm sm:text-base text-gray-600">Precios competitivos</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideMarketplaceProfile;