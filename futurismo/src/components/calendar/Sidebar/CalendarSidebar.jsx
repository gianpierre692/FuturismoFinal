import { useState } from 'react';
import { 
  CalendarIcon, 
  UserIcon, 
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { 
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid';
import MiniCalendar from './MiniCalendar';
import FilterPanel from './FilterPanel';
import useAuthStore from '../../../stores/authStore';
import useIndependentAgendaStore from '../../../stores/independentAgendaStore';

const CalendarSidebar = () => {
  const { user } = useAuthStore();
  const { currentGuide, actions: { setCurrentGuide } } = useIndependentAgendaStore();
  
  const [expandedSections, setExpandedSections] = useState({
    calendars: true,
    guides: true,
    filters: false
  });

  const [visibleCalendars, setVisibleCalendars] = useState({
    personal: true,
    company: true,
    reservations: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCalendarVisibility = (calendarType) => {
    setVisibleCalendars(prev => ({
      ...prev,
      [calendarType]: !prev[calendarType]
    }));
  };

  const calendars = [
    {
      id: 'personal',
      name: 'Mi Agenda',
      icon: UserIcon,
      color: 'bg-blue-500',
      visible: visibleCalendars.personal,
      description: 'Eventos personales'
    },
    {
      id: 'company',
      name: 'Tours Asignados',
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
      visible: visibleCalendars.company,
      description: 'Tours de la empresa'
    },
    {
      id: 'reservations',
      name: 'Reservas',
      icon: CalendarDaysIcon,
      color: 'bg-purple-500',
      visible: visibleCalendars.reservations,
      description: 'Calendario de reservas'
    }
  ];

  // Guías data - sincronizado con mock data del store
  const guides = [
    { id: '1', name: 'Carlos Mendoza', online: true, role: 'freelance' },
    { id: '2', name: 'Ana García', online: false, role: 'freelance' },
    { id: '3', name: 'Luis Rivera', online: true, role: 'freelance' },
    { id: 'user123', name: 'María Torres', online: true, role: 'freelance' }
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col h-full">
      {/* Mini Calendar */}
      <div className="p-4 border-b border-gray-100">
        <MiniCalendar />
      </div>

      {/* Calendarios */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('calendars')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Calendarios</span>
          </div>
          <div className={`transform transition-transform ${expandedSections.calendars ? 'rotate-90' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {expandedSections.calendars && (
          <div className="pb-2">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 group">
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => toggleCalendarVisibility(calendar.id)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    {calendar.visible ? (
                      <EyeIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-3 h-3 rounded-full ${calendar.color} ${!calendar.visible ? 'opacity-50' : ''}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${calendar.visible ? 'text-gray-700' : 'text-gray-400'}`}>
                        {calendar.name}
                      </p>
                      <p className="text-xs text-gray-500">{calendar.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Agregar calendario */}
            <button className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors">
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm">Agregar calendario</span>
            </button>
          </div>
        )}
      </div>

      {/* Guías (solo para admin) */}
      {isAdmin && (
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('guides')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Guías</span>
            </div>
            <div className={`transform transition-transform ${expandedSections.guides ? 'rotate-90' : ''}`}>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {expandedSections.guides && (
            <div className="pb-2">
              {guides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setCurrentGuide(guide.id)}
                  className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                    currentGuide === guide.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {guide.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {guide.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${currentGuide === guide.id ? 'text-blue-700' : 'text-gray-700'}`}>
                      {guide.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{guide.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('filters')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros</span>
          </div>
          <div className={`transform transition-transform ${expandedSections.filters ? 'rotate-90' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {expandedSections.filters && (
          <div className="pb-2">
            <FilterPanel />
          </div>
        )}
      </div>

      {/* Espacio flexible */}
      <div className="flex-1" />

      {/* Footer con información */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <p>Sincronizado hace 2 min</p>
          <p>3 eventos próximos</p>
          <button className="text-blue-500 hover:text-blue-600">
            Sincronizar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;