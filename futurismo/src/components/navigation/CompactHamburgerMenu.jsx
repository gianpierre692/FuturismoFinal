import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  XMarkIcon,
  ChevronRightIcon,
  HomeIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserCircleIcon,
  CalendarIcon,
  MapIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  CogIcon,
  PowerIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../stores/authStore';
import useNotificationsStore from '../../stores/notificationsStore';

const CompactHamburgerMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationsStore();
  const [expandedSection, setExpandedSection] = useState(null);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
    setExpandedSection(null);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Estructura de menú compacta
  const getMenuStructure = () => {
    const baseItems = [
      { 
        id: 'dashboard',
        icon: HomeIcon, 
        label: 'Inicio', 
        action: () => handleNavigate('/dashboard'),
        isActive: location.pathname === '/dashboard'
      }
    ];

    if (user?.role === 'agency') {
      return [
        ...baseItems,
        {
          id: 'operations',
          icon: BriefcaseIcon,
          label: 'Operaciones',
          badge: 3,
          expandable: true,
          subitems: [
            { icon: CalendarIcon, label: 'Reservaciones', action: () => handleNavigate('/reservations'), badge: 5 },
            { icon: MapIcon, label: 'Monitoreo', action: () => handleNavigate('/monitoring') },
            { icon: ClockIcon, label: 'Historial', action: () => handleNavigate('/history') }
          ]
        },
        {
          id: 'marketplace',
          icon: MagnifyingGlassIcon,
          label: 'Marketplace',
          expandable: true,
          subitems: [
            { icon: MagnifyingGlassIcon, label: 'Buscar Guías', action: () => handleNavigate('/marketplace/search') },
            { icon: BriefcaseIcon, label: 'Contrataciones', action: () => handleNavigate('/marketplace/bookings'), badge: 2 },
            { icon: StarIcon, label: 'Favoritos', action: () => handleNavigate('/marketplace/favorites') }
          ]
        },
        { icon: ChartBarIcon, label: 'Reportes', action: () => handleNavigate('/agency/reports') },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', action: () => handleNavigate('/chat'), badge: 5 },
        { icon: BellIcon, label: 'Notificaciones', action: () => handleNavigate('/notifications'), badge: unreadCount },
        { icon: UserCircleIcon, label: 'Mi Perfil', action: () => handleNavigate('/profile') },
        { icon: CogIcon, label: 'Configuración', action: () => handleNavigate('/settings') }
      ];
    } else if (user?.role === 'guide') {
      return [
        ...baseItems,
        { icon: CalendarDaysIcon, label: 'Mi Agenda', action: () => handleNavigate('/agenda'), badge: 3 },
        {
          id: 'tours',
          icon: MapIcon,
          label: 'Tours',
          expandable: true,
          subitems: [
            { icon: MapIcon, label: 'Tour Actual', action: () => handleNavigate('/monitoring'), status: 'active' },
            { icon: CalendarDaysIcon, label: 'Próximos', action: () => handleNavigate('/agenda') },
            { icon: ClockIcon, label: 'Historial', action: () => handleNavigate('/history') },
            { icon: ShieldCheckIcon, label: 'Emergencias', action: () => handleNavigate('/emergency'), important: true }
          ]
        },
        {
          id: 'finances',
          icon: CurrencyDollarIcon,
          label: 'Finanzas',
          expandable: true,
          subitems: [
            { icon: CurrencyDollarIcon, label: 'Ganancias', action: () => handleNavigate('/guide/finances') },
            { icon: StarIcon, label: 'Tienda Puntos', action: () => handleNavigate('/guide/points-store') },
            { icon: DocumentTextIcon, label: 'Facturas', action: () => handleNavigate('/invoices') }
          ]
        },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', action: () => handleNavigate('/chat'), badge: 5 },
        { icon: UserCircleIcon, label: 'Mi Perfil', action: () => handleNavigate('/profile') }
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        {
          id: 'users',
          icon: UserGroupIcon,
          label: 'Usuarios',
          expandable: true,
          subitems: [
            { icon: UserGroupIcon, label: 'Gestión', action: () => handleNavigate('/users') },
            { icon: DocumentTextIcon, label: 'Historial', action: () => handleNavigate('/history') }
          ]
        },
        {
          id: 'management',
          icon: BuildingOffice2Icon,
          label: 'Gestión',
          expandable: true,
          subitems: [
            { icon: CalendarIcon, label: 'Todas las Reservas', action: () => handleNavigate('/admin/reservations') },
            { icon: MapIcon, label: 'Centro Monitoreo', action: () => handleNavigate('/monitoring') },
            { icon: BuildingOffice2Icon, label: 'Proveedores', action: () => handleNavigate('/providers') },
            { icon: ShieldCheckIcon, label: 'Protocolos', action: () => handleNavigate('/protocols') }
          ]
        },
        { icon: ChartBarIcon, label: 'Reportes', action: () => handleNavigate('/admin/reports') },
        { icon: CogIcon, label: 'Configuración', action: () => handleNavigate('/settings') }
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuStructure();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay más sutil */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-200"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                {/* Menú más compacto - 75% del ancho de pantalla máximo */}
                <Dialog.Panel className="pointer-events-auto relative w-72 max-w-[75vw]">
                  <div className="flex h-full flex-col bg-white shadow-2xl">
                    {/* Header compacto */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                          </div>
                          <div>
                            <h2 className="text-base font-semibold text-white">Futurismo</h2>
                            <p className="text-xs text-primary-100">
                              {user?.role === 'agency' && 'Agencia'}
                              {user?.role === 'guide' && 'Guía'}
                              {user?.role === 'admin' && 'Admin'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={onClose}
                          className="rounded-full p-2 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Navigation Items compactos */}
                    <nav className="flex-1 overflow-y-auto py-1">
                      {menuItems.map((item, idx) => (
                        <div key={item.id || idx}>
                          <button
                            onClick={item.expandable ? () => toggleSection(item.id) : item.action}
                            className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-all duration-150 group ${
                              item.isActive ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1 rounded-md ${
                                item.isActive ? 'bg-primary-100' :
                                item.important ? 'bg-red-100' : 
                                item.status === 'active' ? 'bg-green-100' : 
                                'bg-gray-100 group-hover:bg-gray-200'
                              } transition-colors`}>
                                <item.icon className={`w-4 h-4 ${
                                  item.isActive ? 'text-primary-600' :
                                  item.important ? 'text-red-600' :
                                  item.status === 'active' ? 'text-green-600' :
                                  'text-gray-600'
                                }`} />
                              </div>
                              <span className={`font-medium text-sm ${
                                item.isActive ? 'text-primary-900' : 'text-gray-900'
                              } group-hover:text-gray-800 transition-colors`}>
                                {item.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className="min-w-[18px] h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1.5 font-medium">
                                  {item.badge > 9 ? '9+' : item.badge}
                                </span>
                              )}
                              {item.expandable && (
                                <ChevronRightIcon className={`w-3 h-3 text-gray-400 transition-transform ${
                                  expandedSection === item.id ? 'rotate-90' : ''
                                }`} />
                              )}
                            </div>
                          </button>

                          {/* Subitems expandibles */}
                          {item.expandable && expandedSection === item.id && (
                            <div className="bg-gray-50 animate-in slide-in-from-top-2 duration-200">
                              {item.subitems.map((subitem, subIdx) => (
                                <button
                                  key={subIdx}
                                  onClick={subitem.action}
                                  className="w-full flex items-center justify-between px-8 py-2 hover:bg-gray-100 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`p-1 rounded ${
                                      subitem.important ? 'bg-red-100' : 
                                      subitem.status === 'active' ? 'bg-green-100' : 
                                      'bg-gray-200'
                                    }`}>
                                      <subitem.icon className={`w-3 h-3 ${
                                        subitem.important ? 'text-red-600' :
                                        subitem.status === 'active' ? 'text-green-600' :
                                        'text-gray-600'
                                      }`} />
                                    </div>
                                    <span className="text-xs text-gray-700">{subitem.label}</span>
                                  </div>
                                  {subitem.badge && (
                                    <span className="min-w-[14px] h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-medium">
                                      {subitem.badge > 9 ? '9+' : subitem.badge}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Separador y logout solo para admin y guide */}
                      {user?.role !== 'agency' && (
                        <>
                          <div className="my-1 border-t border-gray-200 mx-3" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 transition-colors group"
                          >
                            <div className="p-1 rounded-md bg-red-100 group-hover:bg-red-200 transition-colors">
                              <PowerIcon className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-medium text-sm text-red-600 group-hover:text-red-700 transition-colors">Cerrar Sesión</span>
                          </button>
                        </>
                      )}
                    </nav>

                    {/* Footer compacto del usuario */}
                    <div className="border-t border-gray-200 px-3 py-2.5 bg-gray-50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-semibold text-xs">
                            {user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{user?.name || 'Usuario'}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.role === 'agency' && 'Agencia'}
                            {user?.role === 'guide' && 'Guía'}
                            {user?.role === 'admin' && 'Admin'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CompactHamburgerMenu;