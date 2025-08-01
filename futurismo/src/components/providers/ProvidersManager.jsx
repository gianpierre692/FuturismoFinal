import { useState, useMemo, useEffect } from 'react';
import { MapPinIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon, BuildingOffice2Icon, PhoneIcon, EnvelopeIcon, StarIcon, UserGroupIcon, ClockIcon, CalendarIcon, DocumentTextIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import useProvidersStore from '../../stores/providersStore';
import ProviderCard from './ProviderCard';
import ProviderForm from './ProviderForm';
import ProviderAssignment from './ProviderAssignment';
import LocationTree from './LocationTree';
import ExportImportModal from '../common/ExportImportModal';

const ProvidersManager = () => {
  const {
    locations,
    categories,
    selectedLocation,
    selectedCategory,
    actions
  } = useProvidersStore();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'tree'
  const [showForm, setShowForm] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    minRating: 0
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImportSuccess = (importedData) => {
    if (importedData && Object.keys(importedData).length > 0) {
      const firstSheet = Object.values(importedData)[0];
      if (actions?.importProviders && typeof actions.importProviders === 'function') {
        actions.importProviders(firstSheet);
      }
      setShowExportModal(false);
    }
  };

  // Obtener proveedores filtrados
  const filteredProviders = useMemo(() => {
    let providers = actions.searchProviders(searchQuery, {
      location: selectedLocation || filters.location || undefined,
      category: selectedCategory || filters.category || undefined,
      minRating: filters.minRating
    });

    return providers;
  }, [searchQuery, filters, selectedLocation, selectedCategory, actions]);

  const handleAddProvider = () => {
    setEditingProvider(null);
    setShowForm(true);
  };

  const handleEditProvider = (provider) => {
    setEditingProvider(provider);
    setShowForm(true);
  };

  const handleDeleteProvider = (providerId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      actions.deleteProvider(providerId);
    }
  };

  const handleSaveProvider = (providerData) => {
    if (editingProvider) {
      actions.updateProvider(editingProvider.id, providerData);
    } else {
      actions.addProvider(providerData);
    }
    setShowForm(false);
    setEditingProvider(null);
  };

  const getLocationName = (locationId) => {
    return locations.find(l => l.id === locationId)?.name || '';
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="page-content max-w-7xl mx-auto">
      {/* Mobile Header */}
      {isMobile ? (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Gestión de Proveedores</h1>
          <p className="text-gray-600 text-sm mb-4">
            Administra proveedores locales
          </p>
          
          {/* Mobile Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleAddProvider}
              className="flex-1 btn btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nuevo</span>
            </button>
            
            <button
              onClick={() => setShowExportModal(true)}
              className="btn btn-secondary bg-green-600 hover:bg-green-700 text-white border-green-600 px-4 py-3"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowAssignment(true)}
              className="btn btn-outline px-4 py-3"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Desktop Header */
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h1>
            <p className="text-gray-600 mt-1">
              Administra proveedores locales por ubicación y categoría
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAssignment(true)}
              className="btn btn-outline flex items-center space-x-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Asignar a Tour</span>
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                className="btn btn-secondary flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Export/Import</span>
              </button>
              
              <button
                onClick={handleAddProvider}
                className="btn btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Nuevo Proveedor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        {isMobile ? (
          /* Mobile Filters */
          <>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar proveedores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center space-x-2 text-gray-600"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Filtros</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Filters Collapsible */}
            {showMobileFilters && (
              <div className="mt-4 space-y-3 border-t pt-4">
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
                >
                  <option value="">Todas las ubicaciones</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        ) : (
          /* Desktop Filters */
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar proveedores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center space-x-4">
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Todas las ubicaciones</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modo de vista */}
            <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`p-1.5 rounded ${viewMode === 'tree' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Vista árbol"
              >
                <BuildingOffice2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Vista cuadrícula"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Vista lista"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className={`${!isMobile && viewMode === 'tree' ? 'flex gap-6' : ''}`}>
        {/* Árbol de ubicaciones/categorías (sidebar) - Solo desktop */}
        {!isMobile && viewMode === 'tree' && (
          <div className="w-80 flex-shrink-0">
            <LocationTree />
          </div>
        )}

        {/* Lista/Grid de proveedores */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className={`grid gap-4 ${
              isMobile 
                ? 'grid-cols-1' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredProviders.map(provider => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  locationName={getLocationName(provider.location)}
                  categoryInfo={getCategoryInfo(provider.category)}
                  onEdit={() => handleEditProvider(provider)}
                  onDelete={() => handleDeleteProvider(provider.id)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProviders.map(provider => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  locationName={getLocationName(provider.location)}
                  categoryInfo={getCategoryInfo(provider.category)}
                  onEdit={() => handleEditProvider(provider)}
                  onDelete={() => handleDeleteProvider(provider.id)}
                  layout="list"
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}

          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron proveedores
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza agregando un nuevo proveedor o ajusta los filtros.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddProvider}
                  className="btn btn-primary"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Agregar Proveedor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showForm && (
        <ProviderForm
          provider={editingProvider}
          onSave={handleSaveProvider}
          onCancel={() => {
            setShowForm(false);
            setEditingProvider(null);
          }}
        />
      )}

      {showAssignment && (
        <ProviderAssignment
          onClose={() => setShowAssignment(false)}
        />
      )}

      {/* Export/Import Modal */}
      <ExportImportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={actions?.getAllProviders ? actions.getAllProviders() : filteredProviders}
        dataType="providers"
        title="Exportar/Importar Proveedores"
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default ProvidersManager;