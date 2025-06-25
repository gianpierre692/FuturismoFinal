import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

const FilterPanel = () => {
  const [filters, setFilters] = useState({
    showWeekends: true,
    showPersonalEvents: true,
    showCompanyTours: true,
    showOccupiedTime: true,
    workingHoursOnly: false,
    showPastEvents: false
  });

  const [timeFilter, setTimeFilter] = useState('all'); // all, today, thisWeek, thisMonth

  const toggleFilter = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const timeFilterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Hoy' },
    { value: 'thisWeek', label: 'Esta semana' },
    { value: 'thisMonth', label: 'Este mes' }
  ];

  return (
    <div className="px-4 space-y-4">
      {/* Filtros de tiempo */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Período
        </h4>
        <div className="space-y-1">
          {timeFilterOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="timeFilter"
                value={option.value}
                checked={timeFilter === option.value}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-3 h-3 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtros de visibilidad */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Mostrar
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Fines de semana</span>
            <Switch
              checked={filters.showWeekends}
              onChange={() => toggleFilter('showWeekends')}
              className={`${
                filters.showWeekends ? 'bg-blue-500' : 'bg-gray-200'
              } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  filters.showWeekends ? 'translate-x-4' : 'translate-x-1'
                } inline-block h-2 w-2 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Eventos personales</span>
            <Switch
              checked={filters.showPersonalEvents}
              onChange={() => toggleFilter('showPersonalEvents')}
              className={`${
                filters.showPersonalEvents ? 'bg-blue-500' : 'bg-gray-200'
              } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  filters.showPersonalEvents ? 'translate-x-4' : 'translate-x-1'
                } inline-block h-2 w-2 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Tours empresa</span>
            <Switch
              checked={filters.showCompanyTours}
              onChange={() => toggleFilter('showCompanyTours')}
              className={`${
                filters.showCompanyTours ? 'bg-green-500' : 'bg-gray-200'
              } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  filters.showCompanyTours ? 'translate-x-4' : 'translate-x-1'
                } inline-block h-2 w-2 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Tiempo ocupado</span>
            <Switch
              checked={filters.showOccupiedTime}
              onChange={() => toggleFilter('showOccupiedTime')}
              className={`${
                filters.showOccupiedTime ? 'bg-red-500' : 'bg-gray-200'
              } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  filters.showOccupiedTime ? 'translate-x-4' : 'translate-x-1'
                } inline-block h-2 w-2 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Opciones
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Solo horario laboral</span>
            <Switch
              checked={filters.workingHoursOnly}
              onChange={() => toggleFilter('workingHoursOnly')}
              className={`${
                filters.workingHoursOnly ? 'bg-purple-500' : 'bg-gray-200'
              } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  filters.workingHoursOnly ? 'translate-x-4' : 'translate-x-1'
                } inline-block h-2 w-2 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Eventos pasados</span>
            <Switch
              checked={filters.showPastEvents}
              onChange={() => toggleFilter('showPastEvents')}
              className={`${
                filters.showPastEvents ? 'bg-gray-500' : 'bg-gray-200'
              } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  filters.showPastEvents ? 'translate-x-4' : 'translate-x-1'
                } inline-block h-2 w-2 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Botón para limpiar filtros */}
      <div className="pt-2 border-t border-gray-100">
        <button
          onClick={() => {
            setFilters({
              showWeekends: true,
              showPersonalEvents: true,
              showCompanyTours: true,
              showOccupiedTime: true,
              workingHoursOnly: false,
              showPastEvents: false
            });
            setTimeFilter('all');
          }}
          className="w-full text-xs text-gray-500 hover:text-gray-700 py-2 hover:bg-gray-50 rounded transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;