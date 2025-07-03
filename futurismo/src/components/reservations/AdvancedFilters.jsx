import { useState } from 'react';
import { 
  FunnelIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const AdvancedFilters = ({ onApplyFilters, onClose }) => {
  const [showFilters, setShowFilters] = useState({
    dates: true,
    customers: false,
    passengers: false,
    price: false,
    location: false
  });

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    customerName: '',
    customerPhone: '',
    tourName: '',
    minPassengers: '',
    maxPassengers: '',
    minPrice: '',
    maxPrice: '',
    pickupLocation: '',
    paymentStatus: 'all'
  });

  const toggleSection = (section) => {
    setShowFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      customerName: '',
      customerPhone: '',
      tourName: '',
      minPassengers: '',
      maxPassengers: '',
      minPrice: '',
      maxPrice: '',
      pickupLocation: '',
      paymentStatus: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.customerName || filters.customerPhone) count++;
    if (filters.tourName) count++;
    if (filters.minPassengers || filters.maxPassengers) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.pickupLocation) count++;
    if (filters.paymentStatus !== 'all') count++;
    return count;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FunnelIcon className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Filtros Avanzados
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {getActiveFiltersCount()} activos
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Filtros */}
            <div className="space-y-4">
              {/* Filtro por Fechas */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('dates')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Rango de Fechas</span>
                  </div>
                  {showFilters.dates ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.dates && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Desde
                        </label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hasta
                        </label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => handleInputChange('dateTo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Cliente */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('customers')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Cliente / Tour</span>
                  </div>
                  {showFilters.customers ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.customers && (
                  <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Cliente
                      </label>
                      <input
                        type="text"
                        value={filters.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={filters.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="Ej: +51 987654321"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Tour
                      </label>
                      <input
                        type="text"
                        value={filters.tourName}
                        onChange={(e) => handleInputChange('tourName', e.target.value)}
                        placeholder="Ej: City Tour Lima"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Cantidad de Pasajeros */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('passengers')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Cantidad de Pasajeros</span>
                  </div>
                  {showFilters.passengers ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.passengers && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mínimo
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={filters.minPassengers}
                          onChange={(e) => handleInputChange('minPassengers', e.target.value)}
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Máximo
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={filters.maxPassengers}
                          onChange={(e) => handleInputChange('maxPassengers', e.target.value)}
                          placeholder="50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Precio */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Rango de Precio</span>
                  </div>
                  {showFilters.price ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.price && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Mínimo ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={filters.minPrice}
                          onChange={(e) => handleInputChange('minPrice', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Máximo ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={filters.maxPrice}
                          onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                          placeholder="10000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Ubicación y Estado de Pago */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('location')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Ubicación y Pago</span>
                  </div>
                  {showFilters.location ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.location && (
                  <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lugar de Recojo
                      </label>
                      <input
                        type="text"
                        value={filters.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        placeholder="Ej: Hotel Marriott"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado de Pago
                      </label>
                      <select
                        value={filters.paymentStatus}
                        onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="reembolsado">Reembolsado</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              onClick={handleApply}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleReset}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Limpiar
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;