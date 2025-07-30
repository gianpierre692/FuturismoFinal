import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  BuildingOfficeIcon, 
  PhoneIcon, 
  CreditCardIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  LockClosedIcon, 
  PowerIcon,
  ChevronRightIcon,
  CameraIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/authStore';
import useNotificationsStore from '../stores/notificationsStore';

const ProfileMobile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, toggleVisibility } = useNotificationsStore();
  const { t } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Datos del usuario (mock para demo)
  const userData = {
    name: user?.name || 'María González',
    email: user?.email || 'maria@turismo.com',
    role: user?.role || 'guide',
    avatar: null,
    stats: {
      tours: 156,
      rating: 4.8,
      years: 3
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Secciones del menú según rol
  const getMenuSections = () => {
    const sections = [
      {
        title: 'Cuenta',
        items: [
          { 
            icon: UserIcon, 
            label: 'Información Personal',
            path: '/profile/personal',
            badge: null
          },
          { 
            icon: BellIcon, 
            label: 'Notificaciones',
            action: toggleVisibility,
            badge: unreadCount > 0 ? unreadCount : null
          },
          { 
            icon: LockClosedIcon, 
            label: 'Seguridad',
            path: '/profile/security',
            badge: null
          }
        ]
      }
    ];

    // Secciones adicionales según rol
    if (userData.role === 'guide') {
      sections.push({
        title: 'Profesional',
        items: [
          { icon: CalendarIcon, label: 'Mi Disponibilidad', path: '/profile/availability' },
          { icon: DocumentTextIcon, label: 'Mis Documentos', path: '/profile/documents' },
          { icon: CreditCardIcon, label: 'Pagos y Comisiones', path: '/profile/payments' },
          { icon: StarIcon, label: 'Evaluaciones', path: '/profile/reviews' }
        ]
      });
    } else if (userData.role === 'agency') {
      sections.push({
        title: 'Empresa',
        items: [
          { icon: BuildingOfficeIcon, label: 'Datos de Empresa', path: '/profile/company' },
          { icon: PhoneIcon, label: 'Contactos', path: '/profile/contacts' },
          { icon: CreditCardIcon, label: 'Facturación', path: '/profile/billing' },
          { icon: DocumentTextIcon, label: 'Documentos Legales', path: '/profile/documents' }
        ]
      });
    }

    sections.push({
      title: 'Configuración',
      items: [
        { icon: CogIcon, label: 'Preferencias', path: '/profile/preferences' },
        { 
          icon: PowerIcon, 
          label: 'Cerrar Sesión',
          action: () => setShowLogoutModal(true),
          className: 'text-red-600'
        }
      ]
    });

    return sections;
  };

  const menuSections = getMenuSections();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del perfil */}
      <div className="bg-gradient-to-b from-primary to-primary-600 px-4 pt-8 pb-20">
        <div className="text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt={userData.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg">
              <CameraIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Info del usuario */}
          <h2 className="text-xl font-semibold text-white mb-1">{userData.name}</h2>
          <p className="text-primary-100 text-sm mb-4">{userData.email}</p>

          {/* Stats para guías */}
          {userData.role === 'guide' && (
            <div className="flex justify-center gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{userData.stats.tours}</p>
                <p className="text-xs text-primary-100">Tours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{userData.stats.rating}</p>
                <p className="text-xs text-primary-100">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{userData.stats.years}</p>
                <p className="text-xs text-primary-100">Años</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menú de opciones */}
      <div className="px-4 -mt-8 pb-20">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              {section.title}
            </h3>
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    item.className || ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${
                      item.className || 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      item.className || 'text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Cerrar sesión?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro que deseas cerrar tu sesión actual?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMobile;