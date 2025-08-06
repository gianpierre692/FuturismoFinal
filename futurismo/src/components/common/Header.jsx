import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BellIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, UserIcon, CogIcon, Bars3Icon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import useNotificationsStore from '../../stores/notificationsStore';
import LanguageToggle from './LanguageToggle';
import Logger from '../../utils/logger';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, toggleVisibility, isVisible } = useNotificationsStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

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


  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and brand */}
          <div className="flex items-center">
            <span className="text-2xl mr-3">🌎</span>
            <h1 className="text-xl font-bold text-gray-900">Futurismo</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle - Now visible on all devices */}
            <div className="mr-2">
              <LanguageToggle />
            </div>
            
            {/* Notifications */}
            <button
              onClick={() => {
                Logger.debug('Notification button clicked! Current state:', isVisible);
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
                  <p className="text-sm font-medium text-gray-900">{user?.name || t('profile.user')}</p>
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
                  
                  {/* Language Option */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <div className="flex items-center">
                        <GlobeAltIcon className="w-4 h-4 mr-3" />
                        {t('profile.language')}
                      </div>
                      <span className="text-xs text-gray-500">
                        {i18n.language === 'es' ? 'ES' : 'EN'}
                      </span>
                    </button>
                    
                    {showLanguageMenu && (
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            i18n.changeLanguage('es');
                            setShowLanguageMenu(false);
                            setProfileMenuOpen(false);
                          }}
                          className={`flex items-center px-8 py-2 text-sm hover:bg-gray-50 w-full ${
                            i18n.language === 'es' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                          }`}
                        >
                          <span className="mr-2">🇪🇸</span>
                          {t('profile.spanish')}
                          {i18n.language === 'es' && <span className="ml-auto text-primary-600">✓</span>}
                        </button>
                        <button
                          onClick={() => {
                            i18n.changeLanguage('en');
                            setShowLanguageMenu(false);
                            setProfileMenuOpen(false);
                          }}
                          className={`flex items-center px-8 py-2 text-sm hover:bg-gray-50 w-full ${
                            i18n.language === 'en' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                          }`}
                        >
                          <span className="mr-2">🇺🇸</span>
                          {t('profile.english')}
                          {i18n.language === 'en' && <span className="ml-auto text-primary-600">✓</span>}
                        </button>
                      </div>
                    )}
                  </div>
                  
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
  onMenuClick: PropTypes.func
};

export default Header;