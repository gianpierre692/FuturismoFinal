import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  StarIcon,
  SparklesIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import GuideCardSimple from '../../components/marketplace/GuideCardSimple';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { debounce } from 'lodash';

const GuideSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getFilteredGuides } = useMarketplaceStore();
  
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(location.state?.query || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewLayout, setViewLayout] = useState('grid');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Filtros
  const [filters, setFilters] = useState({
    tourType: location.state?.tourType || '',
    priceRange: { min: 0, max: 200 },
    languages: [],
    workZones: [],
    rating: 0,
    instantBooking: false,
    verified: false
  });

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewLayout('mobile');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar guías
  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const allGuides = getFilteredGuides();
      setGuides(allGuides);
      setFilteredGuides(allGuides);
    } catch (error) {
      console.error('Error loading guides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = [...guides];

    // Búsqueda por texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(guide => 
        guide.fullName.toLowerCase().includes(query) ||
        guide.profile?.bio?.toLowerCase().includes(query) ||
        guide.specializations?.tourTypes?.some(type => type.toLowerCase().includes(query))
      );
    }

    // Filtro por tipo de tour
    if (filters.tourType) {
      filtered = filtered.filter(guide => 
        guide.specializations?.tourTypes?.includes(filters.tourType)
      );
    }

    // Filtro por precio
    filtered = filtered.filter(guide => {
      const price = guide.pricing?.hourlyRate || 50;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // Filtro por idiomas
    if (filters.languages.length > 0) {
      filtered = filtered.filter(guide => 
        filters.languages.some(lang => 
          guide.specializations?.languages?.some(l => l.code === lang)
        )
      );
    }

    // Filtro por zonas
    if (filters.workZones.length > 0) {
      filtered = filtered.filter(guide => 
        filters.workZones.some(zone => 
          guide.specializations?.workZones?.includes(zone)
        )
      );
    }

    // Filtro por rating
    if (filters.rating > 0) {
      filtered = filtered.filter(guide => 
        (guide.ratings?.overall || 4.9) >= filters.rating
      );
    }

    // Filtros booleanos
    if (filters.instantBooking) {
      filtered = filtered.filter(guide => guide.preferences?.instantBooking);
    }
    if (filters.verified) {
      filtered = filtered.filter(guide => guide.marketplaceStatus?.verified);
    }

    setFilteredGuides(filtered);
  }, [guides, searchQuery, filters]);

  // Debounce búsqueda
  const debouncedSearch = useCallback(
    debounce(() => {
      applyFilters();
    }, 300),
    [applyFilters]
  );

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, filters, debouncedSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      tourType: '',
      priceRange: { min: 0, max: 200 },
      languages: [],
      workZones: [],
      rating: 0,
      instantBooking: false,
      verified: false
    });
    setSearchQuery('');
  };

  const handleGuideSelect = (guide) => {
    navigate(`/marketplace/guide/${guide.id}`);
  };

  // Opciones de filtros
  const tourTypes = [
    { id: 'cultural', name: 'Cultural', icon: '🏛️' },
    { id: 'aventura', name: 'Aventura', icon: '🏔️' },
    { id: 'gastronomico', name: 'Gastronómico', icon: '🍽️' },
    { id: 'mistico', name: 'Místico', icon: '🔮' },
    { id: 'fotografico', name: 'Fotográfico', icon: '📸' }
  ];

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'Inglés', flag: '🇺🇸' },
    { code: 'fr', name: 'Francés', flag: '🇫🇷' },
    { code: 'de', name: 'Alemán', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portugués', flag: '🇵🇹' }
  ];

  const workZones = [
    { id: 'cusco-ciudad', name: 'Cusco Ciudad' },
    { id: 'valle-sagrado', name: 'Valle Sagrado' },
    { id: 'machu-picchu', name: 'Machu Picchu' },
    { id: 'sur-valle', name: 'Sur del Valle' }
  ];

  // Panel de filtros móvil
  const FilterPanel = () => (
    <div className={`${isMobile ? 'fixed inset-0 bg-white z-50' : 'bg-white rounded-lg shadow-sm p-6'}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button onClick={() => setShowFilters(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className={`${isMobile ? 'p-4 overflow-y-auto h-[calc(100%-60px)]' : ''} space-y-6`}>
        {/* Tipo de tour */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Tipo de Tour</h3>
          <div className="space-y-2">
            {tourTypes.map(type => (
              <label key={type.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tourType"
                  checked={filters.tourType === type.id}
                  onChange={() => handleFilterChange('tourType', type.id)}
                  className="text-primary-600"
                />
                <span className="text-xl">{type.icon}</span>
                <span>{type.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rango de precio */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Precio por hora</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', { 
                ...filters.priceRange, 
                min: parseInt(e.target.value) || 0 
              })}
              className="w-24 px-3 py-2 border rounded-lg"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', { 
                ...filters.priceRange, 
                max: parseInt(e.target.value) || 200 
              })}
              className="w-24 px-3 py-2 border rounded-lg"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Idiomas */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Idiomas</h3>
          <div className="grid grid-cols-2 gap-2">
            {languages.map(lang => (
              <label key={lang.code} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(lang.code)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleFilterChange('languages', [...filters.languages, lang.code]);
                    } else {
                      handleFilterChange('languages', filters.languages.filter(l => l !== lang.code));
                    }
                  }}
                  className="text-primary-600"
                />
                <span>{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating mínimo */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Rating mínimo</h3>
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map(rating => (
              <button
                key={rating}
                onClick={() => handleFilterChange('rating', rating)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  filters.rating === rating 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {rating === 0 ? 'Todos' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.instantBooking}
              onChange={(e) => handleFilterChange('instantBooking', e.target.checked)}
              className="text-primary-600"
            />
            <span>Solo reserva instantánea</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.checked)}
              className="text-primary-600"
            />
            <span>Solo guías verificados</span>
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={clearFilters}
            className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Limpiar
          </button>
          {isMobile && (
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg font-medium"
            >
              Aplicar
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de búsqueda */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={() => navigate(-1)} className="p-1">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            )}
            
            {/* Barra de búsqueda */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar guías, destinos o tipos de tour..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border ${
                showFilters ? 'bg-primary-50 border-primary-300' : 'border-gray-300'
              } hover:bg-gray-50 transition-colors relative`}
            >
              <FunnelIcon className="h-5 w-5" />
              {Object.values(filters).some(v => v && v !== 0 && (Array.isArray(v) ? v.length > 0 : true)) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full" />
              )}
            </button>

            {/* Selector de vista (solo desktop) */}
            {!isMobile && (
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-2 rounded ${viewLayout === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-2 rounded ${viewLayout === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Resultados y ordenamiento */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredGuides.length} guías encontrados
          </p>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
            <option>Más relevantes</option>
            <option>Mejor valorados</option>
            <option>Precio: menor a mayor</option>
            <option>Precio: mayor a menor</option>
            <option>Más experiencia</option>
          </select>
        </div>
        <div className={`${!isMobile && showFilters ? 'grid grid-cols-4 gap-6' : ''}`}>
          {/* Panel de filtros desktop */}
          {!isMobile && showFilters && (
            <div className="col-span-1">
              <FilterPanel />
            </div>
          )}

          {/* Lista de guías */}
          <div className={!isMobile && showFilters ? 'col-span-3' : ''}>
            {filteredGuides.length === 0 ? (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron guías
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar tus filtros o buscar con otros términos
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewLayout === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {filteredGuides.map((guide) => (
                  <GuideCardSimple
                    key={guide.id}
                    guide={guide}
                    onSelect={handleGuideSelect}
                    layout={viewLayout}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel de filtros móvil */}
      {isMobile && showFilters && <FilterPanel />}
    </div>
  );
};

export default GuideSearch;