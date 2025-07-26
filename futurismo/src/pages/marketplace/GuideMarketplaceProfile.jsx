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
  ShieldCheckIcon,
  ChevronLeftIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  BuildingLibraryIcon,
  GiftIcon,
  TrophyIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PhotoUpload from '../../components/common/PhotoUpload';
import { useTranslation } from 'react-i18next';

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
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const tourTypeNames = {
    cultural: 'Cultural',
    aventura: 'Aventura',
    gastronomico: 'Gastronómico',
    mistico: 'Místico',
    fotografico: 'Fotográfico'
  };

  const workZoneNames = {
    'cusco-ciudad': 'Cusco Ciudad',
    'valle-sagrado': 'Valle Sagrado',
    'machu-picchu': 'Machu Picchu',
    'sur-valle': 'Sur del Valle',
    'otros': 'Otros destinos'
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

  const groupTypeNames = {
    children: 'Niños',
    schools: 'Colegios',
    elderly: 'Adultos mayores',
    corporate: 'Corporativo',
    vip: 'VIP',
    specialNeeds: 'Necesidades especiales'
  };

  const museumNames = {
    larco: t('auth.larcoMuseum'),
    gold: t('auth.goldMuseum'),
    national: t('auth.nationalMuseum'),
    art: t('auth.artMuseum'),
    archaeology: t('auth.archaeologyMuseum'),
    history: t('auth.historyMuseum'),
    contemporary: t('auth.contemporaryArt'),
    colonial: t('auth.colonialArt'),
    // Museos adicionales de Cusco
    qorikancha: 'Museo Qorikancha',
    inca: 'Museo Inca',
    chocolate: 'Museo del Chocolate'
  };

  useEffect(() => {
    loadGuideData();
  }, [guideId]);

  const loadGuideData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const guideData = getGuideById(guideId);
      const guideReviews = getGuideReviews(guideId);
      
      if (guideData) {
        setGuide(guideData);
        setReviews(guideReviews);
      } else {
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error loading guide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = () => {
    navigate(`/marketplace/book/${guideId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Guía turístico: ${guide.fullName}`,
        text: guide.profile.bio,
        url: window.location.href
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con imagen de fondo */}
      <div className="relative h-96 bg-gradient-to-br from-cyan-600 to-blue-600">
        {guide.profile.photos && guide.profile.photos.length > 0 && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={guide.profile.photos[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Navegación */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <button
            onClick={() => navigate('/marketplace')}
            className="inline-flex items-center text-white hover:text-cyan-200 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Volver al marketplace
          </button>
        </div>

        {/* Información principal */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              <img
                src={guide.profile.avatar}
                alt={guide.fullName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      {guide.fullName}
                      {guide.marketplaceStatus.verified && (
                        <CheckBadgeIcon className="h-8 w-8 text-cyan-400" />
                      )}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span className="font-semibold">{guide.ratings.overall.toFixed(1)}</span>
                        <span>({guide.ratings.totalReviews} reseñas)</span>
                      </div>
                      <span>•</span>
                      <span>{guide.marketplaceStats.totalBookings} tours completados</span>
                      <span>•</span>
                      <span>Se unió en {new Date(guide.marketplaceStats.joinedDate).getFullYear()}</span>
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isFavorite ? (
                        <HeartIcon className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartOutlineIcon className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ShareIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['about', 'experience', 'reviews', 'awards', 'availability'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'about' && 'Acerca de'}
                      {tab === 'experience' && 'Experiencia'}
                      {tab === 'reviews' && 'Reseñas'}
                      {tab === 'awards' && 'Reconocimientos'}
                      {tab === 'availability' && 'Disponibilidad'}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Tab: Acerca de */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre mí</h3>
                      <p className="text-gray-600">{guide.profile.bio}</p>
                    </div>

                    {/* Video presentación */}
                    {guide.profile.videoPresentation && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Video de presentación</h3>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <button className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors">
                            <PlayIcon className="h-16 w-16 text-white" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Galería de fotos */}
                    {guide.profile.photos && guide.profile.photos.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Galería</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {guide.profile.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedPhoto(index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Idiomas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <LanguageIcon className="h-5 w-5 text-gray-400" />
                        Idiomas
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {guide.specializations.languages.map((lang) => (
                          <div key={lang.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{languageNames[lang.code]}</p>
                              <p className="text-sm text-gray-600 capitalize">{lang.level}</p>
                            </div>
                            {lang.certified && (
                              <ShieldCheckIcon className="h-5 w-5 text-green-500" title="Certificado" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Especialidades */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        Especialidades
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {guide.specializations.tourTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800"
                          >
                            {tourTypeNames[type]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Zonas de trabajo */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        Zonas de trabajo
                      </h3>
                      <div className="space-y-2">
                        {guide.specializations.workZones.map((zone) => (
                          <div key={zone} className="flex items-start gap-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-700">{workZoneNames[zone]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experiencia en Museos */}
                    {guide.specializations.museums && guide.specializations.museums.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                          {t('auth.museumExperienceProfile')}
                        </h3>
                        <div className="space-y-4">
                          {guide.specializations.museums.map((museum) => (
                            <div key={museum} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <BuildingLibraryIcon className="h-5 w-5 text-orange-600" />
                                  <span className="font-medium text-gray-900">{museumNames[museum]}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= (guide.specializations.museumRatings?.[museum] || 0)
                                          ? 'text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    ({guide.specializations.museumRatings?.[museum] || 0}/5)
                                  </span>
                                </div>
                              </div>
                              
                              {/* Experiencia del guía en el museo */}
                              {guide.specializations.museumExperiences?.[museum] && (
                                <div className="space-y-2">
                                  {typeof guide.specializations.museumExperiences[museum] === 'string' ? (
                                    // Formato antiguo (string simple)
                                    <div className="bg-white rounded-md p-3 border-l-4 border-orange-500">
                                      <p className="text-sm text-gray-700 italic">
                                        "{guide.specializations.museumExperiences[museum]}"
                                      </p>
                                    </div>
                                  ) : (
                                    // Formato nuevo (objeto con idiomas)
                                    Object.entries(guide.specializations.museumExperiences[museum]).map(([lang, experience]) => (
                                      <div key={lang} className="bg-white rounded-md p-3 border-l-4 border-orange-500">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-sm">
                                            {lang === 'es' ? '🇪🇸' : lang === 'en' ? '🇺🇸' : '🏳️'}
                                          </span>
                                          <span className="text-xs font-medium text-gray-600">
                                            {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : lang.toUpperCase()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700 italic">
                                          "{experience}"
                                        </p>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                          {t('auth.museumExperienceProfile')}
                        </h3>
                        <p className="text-gray-500 italic">{t('auth.noMuseumExperience')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Experiencia */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    {/* Experiencia con grupos */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                        Experiencia con diferentes grupos
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(guide.specializations.groupExperience).map(([type, exp]) => (
                          <div key={type} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{groupTypeNames[type]}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                exp.level === 'experto' ? 'bg-green-100 text-green-800' :
                                exp.level === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {exp.level}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {exp.yearsExperience} años de experiencia
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certificaciones */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        Certificaciones
                      </h3>
                      <div className="space-y-3">
                        {guide.certifications.map((cert) => (
                          <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{cert.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Emitido por: {cert.issuer}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Válido hasta: {new Date(cert.expiryDate).toLocaleDateString()}
                                </p>
                              </div>
                              {cert.verified && (
                                <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {guide.marketplaceStats.totalBookings}
                          </p>
                          <p className="text-sm text-gray-600">Tours realizados</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {guide.marketplaceStats.acceptanceRate}%
                          </p>
                          <p className="text-sm text-gray-600">Tasa de aceptación</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {guide.marketplaceStats.responseTime} min
                          </p>
                          <p className="text-sm text-gray-600">Tiempo de respuesta</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {guide.marketplaceStats.repeatClients}
                          </p>
                          <p className="text-sm text-gray-600">Clientes recurrentes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Reseñas */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Resumen de calificaciones */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <p className="text-5xl font-bold text-gray-900">
                            {guide.ratings.overall.toFixed(1)}
                          </p>
                          <div className="flex justify-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-6 w-6 ${
                                  i < Math.round(guide.ratings.overall)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {guide.ratings.totalReviews} reseñas
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {Object.entries({
                            communication: 'Comunicación',
                            knowledge: 'Conocimiento',
                            punctuality: 'Puntualidad',
                            professionalism: 'Profesionalismo',
                            valueForMoney: 'Calidad-precio'
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 w-28">{label}</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-cyan-500 h-2 rounded-full"
                                  style={{ width: `${(guide.ratings[key] / 5) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-8">
                                {guide.ratings[key].toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Lista de reseñas */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.ratings.overall
                                          ? 'text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-medium text-gray-900">
                                  {review.review.title}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(review.metadata.createdAt).toLocaleDateString()} • 
                                Grupo de {review.metadata.groupSize} personas
                              </p>
                            </div>
                            {review.metadata.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Verificado
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{review.review.content}</p>
                          
                          {review.response && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Respuesta del guía:
                              </p>
                              <p className="text-sm text-gray-600">{review.response.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Reconocimientos */}
                {activeTab === 'awards' && (
                  <div className="space-y-6">
                    {/* Resumen de puntos */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <TrophyIcon className="h-6 w-6 text-purple-600" />
                            Puntos de Reconocimiento
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Puntos otorgados por agencias por servicio excepcional
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-purple-600">
                            {guide.agencyPoints?.totalPoints || 0}
                          </p>
                          <p className="text-sm text-purple-500">puntos totales</p>
                        </div>
                      </div>
                      
                      {/* Estadísticas adicionales */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/50 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <GiftIcon className="h-5 w-5 text-purple-500" />
                            <span className="text-2xl font-bold text-gray-900">
                              {guide.agencyPoints?.monthlyPoints || 0}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Este mes</p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <StarIcon className="h-5 w-5 text-purple-500" />
                            <span className="text-2xl font-bold text-gray-900">
                              {guide.agencyPoints?.averagePointsPerService?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Promedio por servicio</p>
                        </div>
                      </div>
                    </div>

                    {/* Historial de reconocimientos */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <GiftIcon className="h-5 w-5 text-gray-400" />
                        Historial de Reconocimientos
                      </h3>
                      
                      {guide.agencyPoints?.pointsHistory && guide.agencyPoints.pointsHistory.length > 0 ? (
                        <div className="space-y-4">
                          {guide.agencyPoints.pointsHistory.slice(0, 10).map((award) => (
                            <div
                              key={award.id}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
                                      <GiftIcon className="h-4 w-4 text-purple-600" />
                                      <span className="font-bold text-purple-700">+{award.points}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      por {award.agencyName}
                                    </span>
                                  </div>
                                  
                                  <p className="text-gray-800 font-medium mb-1">
                                    {award.reason}
                                  </p>
                                  
                                  <p className="text-sm text-gray-500">
                                    {new Date(award.awardedAt).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                                
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                    <TrophyIcon className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {guide.agencyPoints.pointsHistory.length > 10 && (
                            <div className="text-center">
                              <p className="text-sm text-gray-500">
                                Y {guide.agencyPoints.pointsHistory.length - 10} reconocimientos más...
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <GiftIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            Aún no hay reconocimientos
                          </h4>
                          <p className="text-gray-500">
                            Los puntos de reconocimiento aparecerán aquí cuando las agencias 
                            los otorguen por servicios excepcionales.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Disponibilidad */}
                {activeTab === 'availability' && (
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        La disponibilidad se muestra en tiempo real. Los horarios pueden cambiar según las reservas confirmadas.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Horario de trabajo</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => {
                          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                          const isWorkingDay = guide.availability.workingDays.includes(days[index]);
                          
                          return (
                            <div
                              key={day}
                              className={`text-center py-2 rounded-lg ${
                                isWorkingDay
                                  ? 'bg-cyan-100 text-cyan-800'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              <p className="font-medium">{day}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Selecciona una fecha en el proceso de reserva para ver los horarios disponibles
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Tarjeta de reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900">
                  ${guide.pricing.hourlyRate}
                  <span className="text-base font-normal text-gray-500">/hora</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Mínimo {guide.preferences.minBookingHours} horas
                </p>
              </div>

              {/* Tarifas especiales */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-900">Tarifas:</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Medio día (4h)</span>
                    <span className="font-medium">${guide.pricing.halfDayRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Día completo (8h)</span>
                    <span className="font-medium">${guide.pricing.fullDayRate}</span>
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span>Responde en ~{guide.marketplaceStats.responseTime} minutos</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span>Reserva con {guide.availability.advanceBooking} días de anticipación</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <span>Grupos hasta {guide.preferences.maxGroupSize} personas</span>
                </div>
                
                {guide.preferences.requiresDeposit && (
                  <div className="flex items-center gap-3 text-sm">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    <span>Depósito del {guide.preferences.depositPercentage}%</span>
                  </div>
                )}
              </div>

              {/* Política de cancelación */}
              <div className="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-1">Política de cancelación:</p>
                <p>{guide.preferences.cancellationPolicy}</p>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                >
                  Solicitar servicio
                </button>
                
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Enviar mensaje
                </button>
              </div>

              {/* Garantías */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p>
                    Todos nuestros guías están verificados y cuentan con seguro de responsabilidad civil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideMarketplaceProfile;