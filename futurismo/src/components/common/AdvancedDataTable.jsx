import { useState, useMemo, useEffect } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

const AdvancedDataTable = ({
  data = [],
  columns = [],
  searchable = true,
  sortable = true,
  filterable = true,
  pageSize = 10,
  className = '',
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick = null,
  actions = [],
  filters = [],
  searchPlaceholder = 'Buscar...',
  showPagination = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Reset current page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters]);

  // Filtrado y búsqueda
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Búsqueda por texto
    if (searchQuery && searchable) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return columns.some(column => {
          const value = column.accessor ? 
            column.accessor(item) : 
            item[column.key];
          return String(value || '').toLowerCase().includes(query);
        });
      });
    }

    // Aplicar filtros avanzados
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue !== '' && filterValue !== null && filterValue !== undefined) {
        const filter = filters.find(f => f.key === filterKey);
        if (filter && filter.filterFn) {
          filtered = filtered.filter(item => filter.filterFn(item, filterValue));
        }
      }
    });

    return filtered;
  }, [data, searchQuery, activeFilters, columns, filters, searchable]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.key);
      let aValue = column?.accessor ? column.accessor(a) : a[sortConfig.key];
      let bValue = column?.accessor ? column.accessor(b) : b[sortConfig.key];

      // Manejo de valores nulos
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Ordenamiento por tipo
      if (column?.sortType === 'numeric') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (column?.sortType === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, columns, sortable]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Funciones de ordenamiento
  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Función para obtener ícono de ordenamiento
  const getSortIcon = (columnKey) => {
    if (!sortable) return null;
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4 text-primary-600" /> : 
      <ChevronDownIcon className="h-4 w-4 text-primary-600" />;
  };

  // Función para aplicar filtros
  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  // Función para renderizar acciones
  const renderActions = (item) => {
    if (!actions.length) return null;

    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(item);
            }}
            className={`p-1 sm:p-1.5 rounded transition-colors ${
              action.className || 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-8 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header con búsqueda y filtros */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* Búsqueda */}
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}

          {/* Controles */}
          <div className="flex items-center gap-2">
            {/* Filtros */}
            {filterable && filters.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                  showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="h-4 w-4" />
                Filtros
                {Object.values(activeFilters).some(v => v) && (
                  <span className="bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {Object.values(activeFilters).filter(v => v).length}
                  </span>
                )}
              </button>
            )}

            {/* Información */}
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {sortedData.length} resultado{sortedData.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && filterable && filters.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  {filter.type === 'select' ? (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Todos</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={filter.type || 'text'}
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={filter.placeholder}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {paginatedData.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.header}</span>
                      {sortable && column.sortable !== false && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {column.render ? 
                        column.render(item) : 
                        (column.accessor ? column.accessor(item) : item[column.key])
                      }
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {renderActions(item)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {showPagination && totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            {/* Números de página */}
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        page === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === 2 || page === totalPages - 1) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedDataTable;