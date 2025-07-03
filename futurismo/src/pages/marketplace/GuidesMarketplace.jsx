import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AdjustmentsHorizontalIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import MarketplaceSearch from '../../components/marketplace/MarketplaceSearch';
import MarketplaceFilters from '../../components/marketplace/MarketplaceFilters';
import GuideMarketplaceCard from '../../components/marketplace/GuideMarketplaceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GuidesMarketplace = () => {
  const navigate = useNavigate();
  const { getFilteredGuides, getMarketplaceStats } = useMarketplaceStore();
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [viewLayout, setViewLayout] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const guidesPerPage = 12;

  const stats = getMarketplaceStats();

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 500));
      const guides = getFilteredGuides();
      setFilteredGuides(guides);
    } catch (error) {
      console.error('Error loading guides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = () => {
    loadGuides();
    setCurrentPage(1);
  };

  const handleSearchChange = () => {
    loadGuides();
    setCurrentPage(1);
  };

  const handleGuideSelect = (guide) => {
    navigate(`/marketplace/guide/${guide.id}`);
  };

  // Paginación
  const indexOfLastGuide = currentPage * guidesPerPage;
  const indexOfFirstGuide = indexOfLastGuide - guidesPerPage;
  const currentGuides = filteredGuides.slice(indexOfFirstGuide, indexOfLastGuide);
  const totalPages = Math.ceil(filteredGuides.length / guidesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Encuentra tu Guía Turístico Ideal</h1>
            <p className="text-cyan-100 mb-6">
              Conecta con guías profesionales verificados para experiencias únicas en Cusco
            </p>
            
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <UserGroupIcon className="h-8 w-8 mx-auto mb-2 text-cyan-200" />
                <div className="text-2xl font-bold">{stats.activeGuides}</div>
                <div className="text-sm text-cyan-100">Guías Activos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <SparklesIcon className="h-8 w-8 mx-auto mb-2 text-cyan-200" />
                <div className="text-2xl font-bold">{stats.verifiedGuides}</div>
                <div className="text-sm text-cyan-100">Verificados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.completedRequests}</div>
                <div className="text-sm text-cyan-100">Tours Completados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div className="text-sm text-cyan-100">Calificación Promedio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de búsqueda y controles */}
        <div className="mb-6 space-y-4">
          <MarketplaceSearch onSearchChange={handleSearchChange} />
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors md:hidden"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filtros
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredGuides.length} guías encontrados
              </span>
              
              <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-2 ${viewLayout === 'grid' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-500'}`}
                  title="Vista de cuadrícula"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-2 ${viewLayout === 'list' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-500'}`}
                  title="Vista de lista"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar de filtros */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-80 flex-shrink-0`}>
            <MarketplaceFilters onFiltersChange={handleFiltersChange} />
          </aside>

          {/* Lista de guías */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron guías
                </h3>
                <p className="text-gray-500">
                  Intenta ajustar tus filtros de búsqueda para encontrar más resultados.
                </p>
              </div>
            ) : (
              <>
                <div className={`
                  ${viewLayout === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                  }
                `}>
                  {currentGuides.map(guide => (
                    <GuideMarketplaceCard
                      key={guide.id}
                      guide={guide}
                      onSelect={handleGuideSelect}
                      layout={viewLayout}
                    />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isCurrentPage = pageNumber === currentPage;
                        const isNearCurrentPage = Math.abs(pageNumber - currentPage) <= 2;
                        const isFirstOrLastPage = pageNumber === 1 || pageNumber === totalPages;
                        
                        if (!isNearCurrentPage && !isFirstOrLastPage) {
                          if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                            return <span key={i} className="px-2 text-gray-500">...</span>;
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => paginate(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              isCurrentPage
                                ? 'z-10 bg-cyan-50 border-cyan-500 text-cyan-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default GuidesMarketplace;