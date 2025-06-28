import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeIcon, MapIcon, CalendarIcon, ClockIcon, ChatBubbleLeftRightIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon, CogIcon, UserGroupIcon, DocumentTextIcon, CalendarDaysIcon, BuildingOffice2Icon, ShieldCheckIcon, ChartBarIcon, StarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();
  
  // Menú diferente según el tipo de usuario
  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' }
    ];
    
    if (user?.role === 'agency') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: 'Monitoreo' },
        { path: '/reservations', icon: CalendarIcon, label: 'Reservas' },
        { path: '/agency/calendar', icon: CalendarDaysIcon, label: 'Calendario' },
        { path: '/agency/reports', icon: ChartBarIcon, label: 'Reportes' },
        { path: '/agency/points', icon: StarIcon, label: 'Puntos' },
        { path: '/history', icon: ClockIcon, label: 'Historial' },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
        { path: '/profile', icon: UserIcon, label: 'Perfil' }
      ];
    } else if (user?.role === 'guide') {
      const guideItems = [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: 'Mis Tours' },
        { path: '/history', icon: ClockIcon, label: 'Historial' },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' }
      ];
      
      // Agregar agenda solo para guías freelance
      if (user?.guideType === 'freelance') {
        guideItems.splice(-1, 0, { path: '/agenda', icon: CalendarDaysIcon, label: 'Mi Agenda' });
      }
      
      guideItems.splice(-1, 0, { path: '/emergency', icon: ShieldCheckIcon, label: 'Emergencias' });
      guideItems.push({ path: '/profile', icon: UserIcon, label: 'Perfil' });
      return guideItems;
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: 'Monitoreo' },
        { path: '/admin/reservations', icon: CalendarIcon, label: 'Gestión Reservas' },
        { path: '/assignments', icon: UserCircleIcon, label: 'Asignaciones' },
        { path: '/guides', icon: UserIcon, label: 'Guías' },
        { path: '/providers', icon: BuildingOffice2Icon, label: 'Proveedores' },
        { path: '/emergency', icon: ShieldCheckIcon, label: 'Emergencias' },
        { path: '/agenda', icon: CalendarDaysIcon, label: 'Coordinación' },
        { path: '/history', icon: DocumentTextIcon, label: 'Reportes' },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
        { path: '/users', icon: UserGroupIcon, label: 'Usuarios' },
        { path: '/settings', icon: CogIcon, label: 'Configuración' },
        { path: '/profile', icon: UserIcon, label: 'Perfil' }
      ];
    }
    
    return baseItems;
  };
  
  const menuItems = getMenuItems();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
            <span className="text-2xl">🌎</span>
            {isOpen && (
              <h1 className="ml-3 text-xl font-bold text-gray-900">Futurismo</h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors lg:block hidden"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* MapIcon */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors group relative ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="ml-3">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`text-center ${!isOpen && 'hidden'}`}>
          <p className="text-xs text-gray-500">
            © 2024 Futurismo
          </p>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

export default Sidebar;