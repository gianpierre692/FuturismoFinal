import { useState } from 'react';
import { 
  StarIcon, 
  MapPinIcon, 
  CheckBadgeIcon,
  HeartIcon as HeartOutlineIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const GuideCardSimple = ({ guide, onSelect, layout = 'grid' }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Vista móvil compacta
  if (layout === 'mobile') {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm p-4 cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => onSelect(guide)}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={guide.profile?.avatar || '/api/placeholder/60/60'}
              alt={guide.fullName}
              className="w-14 h-14 rounded-full object-cover"
            />
            {guide.marketplaceStatus?.verified && (
              <CheckBadgeIcon className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-blue-500 bg-white rounded-full" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {guide.fullName}
                </h3>
                <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                    <span>{guide.ratings?.overall || 4.9}</span>
                  </div>
                  <span>•</span>
                  <span>{guide.marketplaceStats?.totalBookings || 0} tours</span>
                </div>
              </div>
              <button onClick={handleFavoriteToggle} className="p-1">
                {isFavorite ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              {guide.profile?.bio || 'Guía profesional certificado'}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-gray-900">
                ${guide.pricing?.hourlyRate || 50}
                <span className="text-xs font-normal text-gray-500">/hora</span>
              </span>
              {guide.preferences?.instantBooking && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Reserva instant.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista lista para desktop
  if (layout === 'list') {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
        onClick={() => onSelect(guide)}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={guide.profile?.avatar || '/api/placeholder/80/80'}
              alt={guide.fullName}
              className="w-20 h-20 rounded-full object-cover"
            />
            {guide.marketplaceStatus?.verified && (
              <CheckBadgeIcon className="absolute -bottom-1 -right-1 h-6 w-6 text-blue-500 bg-white rounded-full" />
            )}
          </div>

          {/* Información */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {guide.fullName}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{guide.ratings?.overall || 4.9}</span>
                    <span>({guide.ratings?.totalReviews || 0} reseñas)</span>
                  </div>
                  <span>•</span>
                  <span>{guide.yearsExperience || 5} años exp.</span>
                  <span>•</span>
                  <span>{guide.marketplaceStats?.totalBookings || 0} tours</span>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {guide.profile?.bio || 'Guía turístico profesional con amplia experiencia en la región.'}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2 ml-4">
                <button
                  onClick={handleFavoriteToggle}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartOutlineIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${guide.pricing?.hourlyRate || 50}
                  </p>
                  <p className="text-sm text-gray-500">por hora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista grid (tarjeta)
  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
      onClick={() => onSelect(guide)}
    >
      {/* Imagen header */}
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-cyan-500">
        {guide.profile?.photos?.[0] && (
          <img
            src={guide.profile.photos[0]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badges */}
        {guide.marketplaceStatus?.verified && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <CheckBadgeIcon className="h-3 w-3" />
            Verificado
          </div>
        )}
        
        {/* Favorito */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-4 w-4 text-red-500" />
          ) : (
            <HeartOutlineIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Avatar superpuesto */}
        <div className="absolute -bottom-10 left-4">
          <img
            src={guide.profile?.avatar || '/api/placeholder/80/80'}
            alt={guide.fullName}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 pt-14">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {guide.fullName}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{guide.ratings?.overall || 4.9}</span>
          </div>
          <span>•</span>
          <span>{guide.marketplaceStats?.totalBookings || 0} tours</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {guide.profile?.bio || 'Guía turístico profesional con amplia experiencia en la región.'}
        </p>

        {/* Footer con precio */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xl font-bold text-gray-900">
              ${guide.pricing?.hourlyRate || 50}
              <span className="text-sm font-normal text-gray-500">/hora</span>
            </p>
          </div>
          {guide.preferences?.instantBooking && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Reserva instant.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideCardSimple;