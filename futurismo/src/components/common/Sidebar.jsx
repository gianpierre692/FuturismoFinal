import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Home, 
  Map, 
  Calendar, 
  Clock, 
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();
  
  // Menú diferente según el tipo de usuario
  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' }
    ];
    
    if (user?.role === 'agency') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: Map, label: 'Monitoreo' },
        { path: '/reservations', icon: Calendar, label: 'Reservas' },
        { path: '/history', icon: Clock, label: 'Historial' },
        { path: '/chat', icon: MessageSquare, label: 'Chat' },
        { path: '/profile', icon: User, label: 'Perfil' }
      ];
    } else if (user?.role === 'guide') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: Map, label: 'Mis Tours' },
        { path: '/history', icon: Clock, label: 'Historial' },
        { path: '/chat', icon: MessageSquare, label: 'Chat' },
        { path: '/profile', icon: User, label: 'Perfil' }
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: Map, label: 'Monitoreo' },
        { path: '/reservations', icon: Calendar, label: 'Reservas' },
        { path: '/history', icon: FileText, label: 'Reportes' },
        { path: '/chat', icon: MessageSquare, label: 'Chat' },
        { path: '/users', icon: Users, label: 'Usuarios' },
        { path: '/settings', icon: Settings, label: 'Configuración' },
        { path: '/profile', icon: User, label: 'Perfil' }
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
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
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