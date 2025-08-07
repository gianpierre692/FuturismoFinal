import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeIcon, MapIcon, CalendarIcon, ClockIcon, ChatBubbleLeftRightIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon, CogIcon, UserGroupIcon, DocumentTextIcon, CalendarDaysIcon, BuildingOffice2Icon, ShieldCheckIcon, ChartBarIcon, StarIcon, UserCircleIcon, CurrencyDollarIcon, MagnifyingGlassIcon, BriefcaseIcon, PhotoIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import LanguageToggle from './LanguageToggle';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  // Menú diferente según el tipo de usuario
  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') }
    ];
    
    if (user?.role === 'agency') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') },
        { path: '/reservations', icon: CalendarIcon, label: t('navigation.reservations') },
        { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.searchGuides') },
        { path: '/marketplace/bookings', icon: BriefcaseIcon, label: t('navigation.myContracts') },
        { path: '/agency/calendar', icon: CalendarDaysIcon, label: t('navigation.calendar') },
        { path: '/agency/reports', icon: ChartBarIcon, label: t('navigation.reports') },
        { path: '/agency/points', icon: StarIcon, label: t('navigation.points') },
        { path: '/history', icon: ClockIcon, label: t('navigation.history') },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') },
        { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
      ];
    } else if (user?.role === 'guide') {
      const guideItems = [
        ...baseItems,
        { path: '/mis-tours', icon: MapIcon, label: 'Mis Tours' },
        { path: '/monitoring', icon: GlobeAltIcon, label: t('navigation.monitoring') },
        { path: '/historial', icon: ClockIcon, label: 'Historial' },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') }
      ];
      
      // Agregar agenda para todos los guías
      guideItems.splice(-1, 0, { path: '/agenda', icon: CalendarDaysIcon, label: user?.guideType === 'planta' ? 'Mi Agenda de Trabajo' : 'Mi Agenda' });
      
      // Agregar opciones específicas para guías freelance
      if (user?.guideType === 'freelance') {
        guideItems.splice(-1, 0, { path: '/marketplace/guide-dashboard', icon: BriefcaseIcon, label: t('navigation.myServices') });
        guideItems.splice(-1, 0, { path: '/guide/finances', icon: CurrencyDollarIcon, label: t('navigation.finances') });
        guideItems.splice(-1, 0, { path: '/guide/points-store', icon: StarIcon, label: t('navigation.pointsStore') });
      }
      
      guideItems.splice(-1, 0, { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') });
      guideItems.push({ path: '/profile', icon: UserIcon, label: t('navigation.profile') });
      return guideItems;
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { 
          section: 'OPERACIONES',
          items: [
            { path: '/monitoring', icon: MapIcon, label: 'Monitoreo en Vivo', badge: 'En vivo', badgeColor: 'red' },
            { path: '/reservations', icon: CalendarIcon, label: 'Reservaciones' },
            { path: '/agenda', icon: CalendarDaysIcon, label: 'Calendario General' },
          ]
        },
        {
          section: 'GESTIÓN',
          items: [
            { path: '/users', icon: UserGroupIcon, label: 'Usuarios', badge: '389', badgeColor: 'blue' },
            { path: '/guides', icon: UserIcon, label: 'Guías', badge: '35', badgeColor: 'green' },
            { path: '/providers', icon: BuildingOffice2Icon, label: 'Proveedores' },
          ]
        },
        {
          section: 'ANÁLISIS',
          items: [
            { path: '/admin/reports', icon: ChartBarIcon, label: 'Reportes' },
                { path: '/history', icon: DocumentTextIcon, label: 'Historial' },
          ]
        },
        {
          section: 'COMUNICACIÓN',
          items: [
            { path: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat', badge: '8', badgeColor: 'red' },
            { path: '/emergency', icon: ShieldCheckIcon, label: 'Emergencias' },
          ]
        }
      ];
    }
    
    return baseItems;
  };
  
  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-lg flex-col h-full hidden lg:flex desktop-only">
      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 overflow-y-auto pt-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            // Si es una sección (para admin)
            if (item.section) {
              return (
                <li key={`section-${index}`} className="pt-4 first:pt-0">
                  <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.section}
                  </h3>
                  <ul className="space-y-1">
                    {item.items.map((subItem) => {
                      const Icon = subItem.icon;
                      return (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            end
                            className={({ isActive }) =>
                              `flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors group relative ${
                                isActive
                                  ? 'bg-primary text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`
                            }
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="ml-3 flex-1">{subItem.label}</span>
                            {subItem.badge && (
                              <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                                subItem.badgeColor === 'red' 
                                  ? 'bg-red-100 text-red-700'
                                  : subItem.badgeColor === 'green'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {subItem.badge}
                              </span>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }
            
            // Si es un item normal (para otros roles)
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors group relative ${
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

      {/* Language Toggle */}
      <div className="p-4 border-t border-gray-200">
        {isOpen ? (
          <div className="mb-4">
            <LanguageToggle />
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title={t('profile.language')}
            >
              <GlobeAltIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
        
        {/* Footer */}
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