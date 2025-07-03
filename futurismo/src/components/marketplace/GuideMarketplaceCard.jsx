import { useState } from 'react';
import { 
  StarIcon, 
  MapPinIcon, 
  LanguageIcon, 
  CheckBadgeIcon,
  BoltIcon,
  ClockIcon,
  UserGroupIcon,
  CameraIcon
} from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const GuideMarketplaceCard = ({ guide, onSelect, layout = 'grid' }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const tourTypeIcons = {
    cultural: '🏛️',
    aventura: '🏔️',
    gastronomico: '🍽️',
    mistico: '🔮',
    fotografico: '📸'
  };

  const workZoneNames = {
    'cusco-ciudad': 'Cusco Ciudad',
    'valle-sagrado': 'Valle Sagrado',
    'machu-picchu': 'Machu Picchu',
    'sur-valle': 'Sur del Valle',
    'otros': 'Otros destinos'
  };

  const getLanguageFlags = () => {
    const languageFlags = {
      es: '🇪🇸',
      en: '🇺🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
      it: '🇮🇹',
      pt: '🇵🇹',
      ja: '🇯🇵',
      ko: '🇰🇷',
      zh: '🇨🇳',
      ru: '🇷🇺'
    };

    return guide.specializations.languages
      .filter(lang => lang.level !== 'basico')
      .slice(0, 3)
      .map(lang => languageFlags[lang.code] || '🌐');
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  if (layout === 'list') {
    return (
      <div 
        className="bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer p-6"
        onClick={() => onSelect(guide)}
      >
        <div className="flex items-start gap-4">
          {/* Avatar y verificación */}
          <div className="relative flex-shrink-0">
            <img
              src={guide.profile.avatar}
              alt={guide.fullName}
              className="w-20 h-20 rounded-full object-cover"
            />
            {guide.marketplaceStatus.verified && (
              <CheckBadgeIcon className="absolute -bottom-1 -right-1 h-6 w-6 text-cyan-500 bg-white rounded-full" />
            )}
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {guide.fullName}
                  {guide.marketplaceStatus.featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-0.5 rounded-full">
                      Destacado
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium">{guide.ratings.overall.toFixed(1)}</span>
                    <span>({guide.ratings.totalReviews} reseñas)</span>
                  </div>
                  <span>•</span>
                  <span>{guide.marketplaceStats.yearsExperience || Math.floor(guide.marketplaceStats.totalBookings / 30)} años exp.</span>
                  <span>•</span>
                  <span>{guide.marketplaceStats.totalBookings} tours</span>
                </div>
              </div>
              
              {/* Precio y favorito */}
              <div className="flex items-start gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${guide.pricing.hourlyRate}</p>
                  <p className="text-sm text-gray-500">por hora</p>
                </div>
                <button
                  onClick={handleFavoriteToggle}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {guide.profile.bio}
            </p>

            {/* Características */}
            <div className="flex flex-wrap gap-3 mt-3">
              {/* Idiomas */}
              <div className="flex items-center gap-1">
                <LanguageIcon className="h-4 w-4 text-gray-400" />
                <div className="flex gap-1">
                  {getLanguageFlags().map((flag, index) => (
                    <span key={index} className="text-sm">{flag}</span>
                  ))}
                </div>
                {guide.specializations.languages.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{guide.specializations.languages.length - 3}
                  </span>
                )}
              </div>

              {/* Zonas de trabajo */}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span>
                  {guide.specializations.workZones
                    .slice(0, 2)
                    .map(zone => workZoneNames[zone])
                    .join(', ')}
                  {guide.specializations.workZones.length > 2 && ' ...'}
                </span>
              </div>

              {/* Tipos de tour */}
              <div className="flex items-center gap-1">
                {guide.specializations.tourTypes.slice(0, 3).map(type => (
                  <span key={type} className="text-lg" title={type}>
                    {tourTypeIcons[type]}
                  </span>
                ))}
              </div>

              {/* Badges */}
              {guide.preferences.instantBooking && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <BoltIcon className="h-3 w-3" />
                  Reserva instantánea
                </span>
              )}
              
              {guide.marketplaceStats.responseTime <= 30 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <ClockIcon className="h-3 w-3" />
                  Respuesta rápida
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout Grid (tarjeta)
  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
      onClick={() => onSelect(guide)}
    >
      {/* Imagen de cabecera con galería */}
      <div className="relative h-48 overflow-hidden">
        {guide.profile.photos && guide.profile.photos.length > 0 ? (
          <img
            src={guide.profile.photos[0]}
            alt={guide.fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <UserGroupIcon className="h-16 w-16 text-white/50" />
          </div>
        )}
        
        {/* Overlay con información */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2">
              {getLanguageFlags().map((flag, index) => (
                <span key={index} className="text-lg bg-white/20 backdrop-blur-sm rounded px-1">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Badges flotantes */}
        <div className="absolute top-2 left-2 flex gap-2">
          {guide.marketplaceStatus.verified && (
            <span className="bg-white/90 backdrop-blur-sm text-cyan-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckBadgeIcon className="h-3 w-3" />
              Verificado
            </span>
          )}
          {guide.marketplaceStatus.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full">
              Destacado
            </span>
          )}
        </div>

        {/* Botón favorito */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-4 w-4 text-red-500" />
          ) : (
            <HeartIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Contador de fotos */}
        {guide.profile.photos && guide.profile.photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <CameraIcon className="h-3 w-3" />
            {guide.profile.photos.length}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Avatar y nombre */}
        <div className="flex items-start gap-3 mb-3">
          <img
            src={guide.profile.avatar}
            alt={guide.fullName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {guide.fullName}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="font-medium">{guide.ratings.overall.toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({guide.ratings.totalReviews})</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {guide.profile.bio}
        </p>

        {/* Especialidades */}
        <div className="flex flex-wrap gap-1 mb-3">
          {guide.specializations.tourTypes.map(type => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
            >
              <span>{tourTypeIcons[type]}</span>
              <span className="capitalize">{type}</span>
            </span>
          ))}
        </div>

        {/* Precio y características */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-lg font-bold text-gray-900">
              ${guide.pricing.hourlyRate}
              <span className="text-sm font-normal text-gray-500">/hora</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {guide.preferences.instantBooking && (
              <BoltIcon className="h-4 w-4 text-green-500" title="Reserva instantánea" />
            )}
            {guide.marketplaceStats.responseTime <= 30 && (
              <ClockIcon className="h-4 w-4 text-blue-500" title="Respuesta rápida" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideMarketplaceCard;