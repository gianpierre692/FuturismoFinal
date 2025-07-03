import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useMarketplaceStore from '../../stores/marketplaceStore';

const MarketplaceFilters = ({ onFiltersChange }) => {
  const { 
    workZones, 
    tourTypes, 
    groupTypes,
    activeFilters,
    setFilters,
    clearFilters 
  } = useMarketplaceStore();

  const [expandedSections, setExpandedSections] = useState({
    languages: true,
    tourTypes: true,
    workZones: true,
    groupTypes: false,
    price: false,
    rating: true,
    availability: false
  });

  const [localFilters, setLocalFilters] = useState(activeFilters);
  const [filtersCount, setFiltersCount] = useState(0);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'Inglés', flag: '🇺🇸' },
    { code: 'fr', name: 'Francés', flag: '🇫🇷' },
    { code: 'de', name: 'Alemán', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portugués', flag: '🇵🇹' },
    { code: 'ja', name: 'Japonés', flag: '🇯🇵' },
    { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
    { code: 'zh', name: 'Chino', flag: '🇨🇳' },
    { code: 'ru', name: 'Ruso', flag: '🇷🇺' }
  ];

  useEffect(() => {
    // Contar filtros activos
    let count = 0;
    count += localFilters.languages.length;
    count += localFilters.tourTypes.length;
    count += localFilters.workZones.length;
    count += localFilters.groupTypes.length;
    if (localFilters.rating > 0) count++;
    if (localFilters.instantBooking) count++;
    if (localFilters.verified) count++;
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 500) count++;
    setFiltersCount(count);
  }, [localFilters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLanguageToggle = (langCode) => {
    setLocalFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(langCode)
        ? prev.languages.filter(l => l !== langCode)
        : [...prev.languages, langCode]
    }));
  };

  const handleTourTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      tourTypes: prev.tourTypes.includes(type)
        ? prev.tourTypes.filter(t => t !== type)
        : [...prev.tourTypes, type]
    }));
  };

  const handleWorkZoneToggle = (zone) => {
    setLocalFilters(prev => ({
      ...prev,
      workZones: prev.workZones.includes(zone)
        ? prev.workZones.filter(z => z !== zone)
        : [...prev.workZones, zone]
    }));
  };

  const handleGroupTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      groupTypes: prev.groupTypes.includes(type)
        ? prev.groupTypes.filter(t => t !== type)
        : [...prev.groupTypes, type]
    }));
  };

  const handlePriceChange = (type, value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: Number(value)
      }
    }));
  };

  const handleRatingChange = (rating) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    if (onFiltersChange) {
      onFiltersChange(localFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      languages: [],
      tourTypes: [],
      workZones: [],
      groupTypes: [],
      priceRange: { min: 0, max: 500 },
      rating: 0,
      availability: null,
      instantBooking: false,
      verified: false
    };
    setLocalFilters(defaultFilters);
    clearFilters();
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-left hover:text-cyan-600 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {filtersCount > 0 && (
            <span className="ml-2 bg-cyan-100 text-cyan-800 text-xs font-medium px-2 py-1 rounded-full">
              {filtersCount}
            </span>
          )}
        </div>
        {filtersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Idiomas */}
        <FilterSection
          title="Idiomas"
          isExpanded={expandedSections.languages}
          onToggle={() => toggleSection('languages')}
        >
          <div className="grid grid-cols-2 gap-2">
            {languages.map(lang => (
              <label
                key={lang.code}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={localFilters.languages.includes(lang.code)}
                  onChange={() => handleLanguageToggle(lang.code)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {lang.flag} {lang.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Tipos de Tour */}
        <FilterSection
          title="Tipos de Tour"
          isExpanded={expandedSections.tourTypes}
          onToggle={() => toggleSection('tourTypes')}
        >
          <div className="space-y-2">
            {tourTypes.map(type => (
              <label
                key={type.id}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localFilters.tourTypes.includes(type.id)}
                  onChange={() => handleTourTypeToggle(type.id)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <span className="mr-2">{type.icon}</span>
                  {type.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Zonas de Trabajo */}
        <FilterSection
          title="Zonas de Trabajo"
          isExpanded={expandedSections.workZones}
          onToggle={() => toggleSection('workZones')}
        >
          <div className="space-y-2">
            {workZones.map(zone => (
              <label
                key={zone.id}
                className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localFilters.workZones.includes(zone.id)}
                  onChange={() => handleWorkZoneToggle(zone.id)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-0.5"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">{zone.name}</p>
                  <p className="text-xs text-gray-500">{zone.description}</p>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Experiencia con Grupos */}
        <FilterSection
          title="Experiencia con Grupos"
          isExpanded={expandedSections.groupTypes}
          onToggle={() => toggleSection('groupTypes')}
        >
          <div className="space-y-2">
            {groupTypes.map(type => (
              <label
                key={type.id}
                className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localFilters.groupTypes.includes(type.id)}
                  onChange={() => handleGroupTypeToggle(type.id)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-0.5"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">{type.name}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Calificación */}
        <FilterSection
          title="Calificación Mínima"
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full flex items-center justify-between p-2 rounded transition-colors ${
                  localFilters.rating === rating
                    ? 'bg-cyan-50 border border-cyan-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating === 5 ? 'Solo 5 estrellas' : `${rating}+ estrellas`}
                </span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Precio */}
        <FilterSection
          title="Rango de Precio (por hora)"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Mínimo: ${localFilters.priceRange.min}</label>
              <input
                type="range"
                min="0"
                max="200"
                value={localFilters.priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Máximo: ${localFilters.priceRange.max}</label>
              <input
                type="range"
                min="0"
                max="500"
                value={localFilters.priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full mt-1"
              />
            </div>
          </div>
        </FilterSection>

        {/* Opciones adicionales */}
        <div className="space-y-3 pt-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.instantBooking}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, instantBooking: e.target.checked }))}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Reserva instantánea</span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.verified}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, verified: e.target.checked }))}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Solo guías verificados</span>
          </label>
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full mt-6 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
      >
        Aplicar filtros
      </button>
    </div>
  );
};

export default MarketplaceFilters;