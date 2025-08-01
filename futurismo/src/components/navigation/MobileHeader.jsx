import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { 
  Bars3Icon, 
  ArrowLeftIcon, 
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../stores/authStore';
import useNotificationsStore from '../../stores/notificationsStore';

const MobileHeader = ({ onMenuClick, showMenu = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, toggleVisibility } = useNotificationsStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileMenuOpen(false);
  };

  // Configuración de título según ruta
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Inicio';
    if (path.includes('/monitoring')) return 'Monitoreo';
    if (path.includes('/reservations')) return 'Reservas';
    if (path.includes('/agenda')) return 'Mi Agenda';
    if (path.includes('/history')) return 'Historial';
    if (path.includes('/marketplace')) return 'Marketplace';
    if (path.includes('/profile')) return 'Mi Perfil';
    if (path.includes('/chat')) return 'Mensajes';
    return 'Futurismo';
  };

  // Determinar si mostrar botón de retroceso
  const showBackButton = location.pathname !== '/dashboard' && 
                        !location.pathname.includes('/monitoring') &&
                        !location.pathname.includes('/agenda');

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-[60]">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">🌎</span>
            <h1 className="text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search button - solo en ciertas páginas */}
          {(location.pathname.includes('/marketplace') || 
            location.pathname.includes('/history')) && (
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
            </button>
          )}
          
          {/* Notifications */}
          <button
            onClick={toggleVisibility}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BellIcon className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserCircleIcon className="w-5 h-5 text-gray-700" />
              <ChevronDownIcon className="w-3 h-3 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/profile');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  Mi Perfil
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar expandible (opcional) */}
      {/* {showSearch && (
        <div className="px-4 pb-3 border-t border-gray-100">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>
      )} */}
    </header>
  );
};

export default MobileHeader;