import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';

const MarketplaceHome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getMarketplaceStats, getFilteredGuides } = useMarketplaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredGuides, setFeaturedGuides] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Cargar guías destacados
    const guides = getFilteredGuides();
    setFeaturedGuides(guides.filter(g => g.marketplaceStatus?.featured).slice(0, 3));
  }, []);

  const stats = getMarketplaceStats();

  const popularTours = [
    { id: 'cultural', name: 'Tours Culturales', icon: '🏛️', count: 145 },
    { id: 'aventura', name: 'Aventura', icon: '🏔️', count: 89 },
    { id: 'gastronomico', name: 'Gastronómico', icon: '🍽️', count: 67 },
    { id: 'mistico', name: 'Místico', icon: '🔮', count: 45 }
  ];

  const benefits = [
    {
      icon: ShieldCheckIcon,
      title: 'Guías Verificados',
      description: 'Todos nuestros guías están certificados y verificados'
    },
    {
      icon: BoltIcon,
      title: 'Reserva Instantánea',
      description: 'Confirma tu tour en segundos, sin esperas'
    },
    {
      icon: StarIcon,
      title: 'Garantía de Calidad',
      description: 'Satisfacción garantizada o te devolvemos tu dinero'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/marketplace/search', { state: { query: searchQuery } });
  };

  const handleQuickSearch = (type) => {
    navigate('/marketplace/search', { state: { tourType: type } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-cyan-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              Encuentra el Guía Perfecto para tu Aventura
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Conecta con guías turísticos profesionales verificados en Cusco
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca por destino, tipo de tour o nombre del guía..."
                  className="w-full pl-12 pr-32 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-md font-medium transition-colors"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.activeGuides}</div>
                <div className="text-sm text-white/80">Guías Activos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.verifiedGuides}</div>
                <div className="text-sm text-white/80">Verificados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-white/80">Rating Promedio</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">2.5k+</div>
                <div className="text-sm text-white/80">Tours Completados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tours */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tours Populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularTours.map((tour) => (
            <button
              key={tour.id}
              onClick={() => handleQuickSearch(tour.id)}
              className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="text-3xl sm:text-4xl mb-2">{tour.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {tour.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{tour.count} guías</p>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Guides */}
      {featuredGuides.length > 0 && (
        <div className="bg-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-yellow-500" />
                Guías Destacados
              </h2>
              <button
                onClick={() => navigate('/marketplace/search')}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                Ver todos
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {featuredGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => navigate(`/marketplace/guide/${guide.id}`)}
                  className="bg-gray-50 rounded-lg p-4 sm:p-6 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={guide.profile?.avatar || '/api/placeholder/80/80'}
                      alt={guide.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{guide.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium">{guide.ratings?.overall || 4.9}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({guide.ratings?.totalReviews || 0} reseñas)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {guide.profile?.bio || 'Guía profesional con amplia experiencia'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          ¿Por qué elegir Futurismo?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <benefit.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-cyan-600 text-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Encuentra el guía perfecto y vive experiencias inolvidables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/marketplace/search')}
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Explorar Guías
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            {user?.role === 'guide' && (
              <button
                onClick={() => navigate('/marketplace/guide-dashboard')}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Panel de Guía
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions for Mobile */}
      {isMobile && user?.role === 'agency' && (
        <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <button
            onClick={() => navigate('/marketplace/bookings')}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <CalendarIcon className="h-5 w-5" />
            Mis Reservas
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketplaceHome;