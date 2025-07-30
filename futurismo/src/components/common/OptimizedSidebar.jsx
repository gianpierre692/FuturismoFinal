import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  CogIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';

const OptimizedSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // NAVEGACIÓN AGRUPADA Y SIMPLIFICADA
  const getNavigationGroups = () => {
    if (user?.role === 'agency') {
      return [
        {
          id: 'operations',
          label: 'Operaciones',
          icon: BriefcaseIcon,
          badge: 3, // notificaciones pendientes
          primary: true, // grupo más usado
          items: [
            { path: '/dashboard', label: 'Panel Principal', highlight: true },
            { path: '/reservations', label: 'Reservas' },
            { path: '/monitoring', label: 'Monitoreo en Vivo' },
            { path: '/marketplace', label: 'Buscar Guías' },
            { path: '/marketplace/requests', label: 'Mis Contrataciones' }
          ]
        },
        {
          id: 'analytics',
          label: 'Análisis',
          icon: ChartBarIcon,
          items: [
            { path: '/agency/reports', label: 'Reportes' },
            { path: '/history', label: 'Historial' },
            { path: '/agency/points', label: 'Programa de Puntos' }
          ]
        },
        {
          id: 'communication',
          label: 'Comunicación',
          icon: UserGroupIcon,
          items: [
            { path: '/chat', label: 'Mensajes', badge: 5 },
            { path: '/agency/calendar', label: 'Calendario' }
          ]
        }
      ];
    } else if (user?.role === 'guide') {
      return [
        {
          id: 'my-work',
          label: 'Mi Trabajo',
          icon: BriefcaseIcon,
          primary: true,
          items: [
            { path: '/dashboard', label: 'Inicio', highlight: true },
            { path: '/monitoring', label: 'Mis Tours Hoy', badge: 2 },
            { path: '/agenda', label: 'Mi Agenda' },
            { path: '/emergency', label: 'Emergencias', urgent: true }
          ]
        },
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: ChartBarIcon,
          items: [
            { path: '/marketplace/guide-dashboard', label: 'Mis Servicios' },
            { path: '/guide/finances', label: 'Finanzas' },
            { path: '/guide/points-store', label: 'Tienda de Puntos' }
          ]
        },
        {
          id: 'history',
          label: 'Historial',
          icon: UserGroupIcon,
          collapsed: true, // menos usado, colapsado por defecto
          items: [
            { path: '/history', label: 'Tours Completados' },
            { path: '/chat', label: 'Mensajes' }
          ]
        }
      ];
    } else { // admin
      return [
        {
          id: 'overview',
          label: 'Vista General',
          icon: HomeIcon,
          primary: true,
          items: [
            { path: '/dashboard', label: 'Dashboard', highlight: true },
            { path: '/monitoring', label: 'Monitoreo Global' },
            { path: '/admin/reservations', label: 'Todas las Reservas' }
          ]
        },
        {
          id: 'management',
          label: 'Gestión',
          icon: UserGroupIcon,
          items: [
            { path: '/admin/resources', label: 'Recursos y Guías' },
            { path: '/users', label: 'Usuarios' },
            { path: '/providers', label: 'Proveedores' },
            { path: '/marketplace', label: 'Marketplace' }
          ]
        },
        {
          id: 'operations',
          label: 'Operaciones',
          icon: BriefcaseIcon,
          items: [
            { path: '/agenda', label: 'Coordinación' },
            { path: '/emergency', label: 'Protocolos de Emergencia' },
            { path: '/guides', label: 'Directorio de Guías' }
          ]
        },
        {
          id: 'analytics',
          label: 'Análisis y Config',
          icon: ChartBarIcon,
          collapsed: true,
          items: [
            { path: '/admin/reports', label: 'Reportes Avanzados' },
            { path: '/history', label: 'Auditoría' },
            { path: '/settings', label: 'Configuración' }
          ]
        }
      ];
    }
  };

  const navigationGroups = getNavigationGroups();

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Auto-expandir grupos primarios
  useState(() => {
    const initialExpanded = {};
    navigationGroups.forEach(group => {
      if (group.primary) {
        initialExpanded[group.id] = true;
      } else if (group.collapsed) {
        initialExpanded[group.id] = false;
      } else {
        initialExpanded[group.id] = true;
      }
    });
    setExpandedGroups(initialExpanded);
  }, []);

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col h-full`}>
      {/* Header con Quick Action */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
            <span className="text-2xl">🌎</span>
            {isOpen && (
              <>
                <h1 className="ml-3 text-xl font-bold text-gray-900">Futurismo</h1>
                {/* Quick Create Button */}
                <button className="ml-auto p-1 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                  <PlusIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Box (solo cuando está abierto) */}
      {isOpen && (
        <div className="p-3 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-2">
          {navigationGroups.map((group) => {
            const Icon = group.icon;
            const isExpanded = expandedGroups[group.id] !== false;
            
            return (
              <div key={group.id}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    group.primary ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="text-sm font-medium">{group.label}</span>
                    )}
                  </div>
                  {isOpen && (
                    <div className="flex items-center gap-2">
                      {group.badge && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                          {group.badge}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Group Items */}
                {isExpanded && isOpen && (
                  <div className="mt-1 ml-8 space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-primary text-white'
                              : item.highlight
                              ? 'text-primary-700 font-medium hover:bg-primary-50'
                              : item.urgent
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-white bg-opacity-90 text-primary-700 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}

                {/* Tooltip for collapsed sidebar */}
                {!isOpen && isExpanded && (
                  <div className="space-y-1 mt-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className="block p-2 rounded-lg hover:bg-gray-100 relative group"
                      >
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                          {item.label}
                        </div>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer con accesos rápidos */}
      <div className="p-3 border-t border-gray-200">
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} gap-2`}>
          <NavLink
            to="/chat"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <BellIcon className="w-5 h-5 text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </NavLink>
          
          <NavLink
            to="/profile"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </NavLink>
          
          {isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CogIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

OptimizedSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

export default OptimizedSidebar;