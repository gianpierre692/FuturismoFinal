import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { 
  CalendarDaysIcon, 
  Squares2X2Icon, 
  ViewColumnsIcon, 
  TableCellsIcon 
} from '@heroicons/react/24/solid';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import useIndependentAgendaStore from '../../stores/independentAgendaStore';
import useAuthStore from '../../stores/authStore';

const FantasticalLayout = ({ children, sidebar, viewComponent }) => {
  const { user } = useAuthStore();
  const { 
    currentView, 
    selectedDate, 
    actions: { setCurrentView, setSelectedDate }
  } = useIndependentAgendaStore();

  const [isLoading, setIsLoading] = useState(false);

  const viewOptions = [
    { key: 'day', label: 'Día', icon: CalendarDaysIcon },
    { key: 'week', label: 'Semana', icon: ViewColumnsIcon },
    { key: 'month', label: 'Mes', icon: Squares2X2Icon },
    { key: 'year', label: 'Año', icon: TableCellsIcon }
  ];

  const navigateDate = (direction) => {
    setIsLoading(true);
    let newDate = new Date(selectedDate);

    switch (currentView) {
      case 'day':
        newDate = direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1);
        break;
      case 'week':
        newDate = direction === 'prev' ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1);
        break;
      case 'month':
        newDate = direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1);
        break;
      case 'year':
        newDate = direction === 'prev' ? subMonths(selectedDate, 12) : addMonths(selectedDate, 12);
        break;
    }

    setSelectedDate(newDate);
    setTimeout(() => setIsLoading(false), 150);
  };

  const goToToday = () => {
    setIsLoading(true);
    setSelectedDate(new Date());
    setTimeout(() => setIsLoading(false), 150);
  };

  const getDateTitle = () => {
    switch (currentView) {
      case 'day':
        return format(selectedDate, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es });
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;
      case 'month':
        return format(selectedDate, 'MMMM \'de\' yyyy', { locale: es });
      case 'year':
        return format(selectedDate, 'yyyy');
      default:
        return '';
    }
  };

  const getCurrentViewIcon = () => {
    const currentViewOption = viewOptions.find(option => option.key === currentView);
    return currentViewOption ? currentViewOption.icon : CalendarDaysIcon;
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="h-full flex flex-col">
          {/* Header del sidebar */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'usuario'}</p>
              </div>
            </div>
          </div>

          {/* Contenido del sidebar */}
          <div className="flex-1 overflow-y-auto">
            {sidebar || (
              <div className="p-4">
                <p className="text-sm text-gray-500">Cargando sidebar...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navegación de fecha */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDate('prev')}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  onClick={goToToday}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hoy
                </button>
                
                <button
                  onClick={() => navigateDate('next')}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Título de fecha actual */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {React.createElement(getCurrentViewIcon(), { 
                    className: "w-5 h-5 text-gray-400" 
                  })}
                  <h1 className="text-lg font-semibold text-gray-900 capitalize">
                    {getDateTitle()}
                  </h1>
                </div>
                
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            {/* Controles de vista */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {viewOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setCurrentView(option.key)}
                      disabled={isLoading}
                      className={`
                        flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all
                        disabled:opacity-50
                        ${currentView === option.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:block">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-hidden">
          <div 
            className={`
              h-full transition-opacity duration-150
              ${isLoading ? 'opacity-50' : 'opacity-100'}
            `}
          >
            {viewComponent || (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500">Cargando vista de calendario...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-5 z-50 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Cargando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FantasticalLayout;