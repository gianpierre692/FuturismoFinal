import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import useNotificationsStore from '../../stores/notificationsStore';
import LanguageToggle from './LanguageToggle';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, toggleVisibility, isVisible } = useNotificationsStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef(null);
  const { t } = useTranslation();

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
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/monitoring?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-5 h-5 text-gray-500" />
            </button>

            {/* Search bar - Hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden sm:block ml-4 lg:ml-0">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.searchServices')}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-48 md:w-64 lg:w-80"
                />
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle - Hidden on mobile */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            
            {/* Notifications */}
            <button
              onClick={() => {
                console.log('Notification button clicked! Current state:', isVisible);
                toggleVisibility();
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="notifications"
            >
              <BellIcon className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'agency' && t('roles.agency')}
                    {user?.role === 'guide' && t('roles.guide')}
                    {user?.role === 'admin' && t('roles.admin')}
                  </p>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <UserIcon className="w-4 h-4 mr-3" />
                    {t('profile.myProfile')}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile?tab=settings');
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <CogIcon className="w-4 h-4 mr-3" />
                    {t('profile.configuration')}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    {t('profile.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
};

export default Header;