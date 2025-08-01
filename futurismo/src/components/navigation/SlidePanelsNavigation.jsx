import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  XMarkIcon,
  ChevronLeftIcon,
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

const SlidePanelsNavigation = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationsStore();
  const [activePanel, setActivePanel] = useState('main');
  const [panelHistory, setPanelHistory] = useState(['main']);

  // Navegación entre paneles
  const navigateToPanel = (panel) => {
    setPanelHistory([...panelHistory, panel]);
    setActivePanel(panel);
  };

  const goBack = () => {
    if (panelHistory.length > 1) {
      const newHistory = [...panelHistory];
      newHistory.pop();
      setPanelHistory(newHistory);
      setActivePanel(newHistory[newHistory.length - 1]);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
    // Reset panel state
    setActivePanel('main');
    setPanelHistory(['main']);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  // Estructura de paneles según rol
  const getPanelStructure = () => {
    const baseStructure = {
      main: {
        title: 'Menú Principal',
        items: [
          { 
            icon: HomeIcon, 
            label: 'Inicio', 
            action: () => handleNavigate('/dashboard'),
            direct: true
          }
        ]
      }
    };

    if (user?.role === 'agency') {
      baseStructure.main.items.push(
        { icon: BriefcaseIcon, label: 'Operaciones', action: () => navigateToPanel('operations'), badge: 3 },
        { icon: MagnifyingGlassIcon, label: 'Marketplace', action: () => navigateToPanel('marketplace') },
        { icon: ChartBarIcon, label: 'Reportes', action: () => handleNavigate('/agency/reports'), direct: true },
        { icon: UserCircleIcon, label: 'Mi Cuenta', action: () => navigateToPanel('account'), badge: unreadCount }
      );

      baseStructure.operations = {
        title: 'Operaciones',
        items: [
          { icon: CalendarIcon, label: 'Reservaciones', action: () => handleNavigate('/reservations'), badge: 5 },
          { icon: MapIcon, label: 'Monitoreo en Vivo', action: () => handleNavigate('/monitoring') },
          { icon: ClockIcon, label: 'Historial', action: () => handleNavigate('/history') },
          { icon: DocumentTextIcon, label: 'Documentos', action: () => handleNavigate('/documents') }
        ]
      };

      baseStructure.marketplace = {
        title: 'Marketplace',
        items: [
          { icon: MagnifyingGlassIcon, label: 'Buscar Guías', action: () => handleNavigate('/marketplace/search') },
          { icon: BriefcaseIcon, label: 'Mis Contrataciones', action: () => handleNavigate('/marketplace/bookings'), badge: 2 },
          { icon: StarIcon, label: 'Guías Favoritos', action: () => handleNavigate('/marketplace/favorites') }
        ]
      };

    } else if (user?.role === 'guide') {
      baseStructure.main.items.push(
        { icon: CalendarDaysIcon, label: 'Mi Agenda', action: () => handleNavigate('/agenda'), badge: 3 },
        { icon: MapIcon, label: 'Tours', action: () => navigateToPanel('tours') },
        { icon: CurrencyDollarIcon, label: 'Finanzas', action: () => navigateToPanel('finances') },
        { icon: UserCircleIcon, label: 'Mi Cuenta', action: () => navigateToPanel('account'), badge: unreadCount }
      );

      baseStructure.tours = {
        title: 'Tours',
        items: [
          { icon: MapIcon, label: 'Tour Actual', action: () => handleNavigate('/monitoring'), status: 'active' },
          { icon: CalendarDaysIcon, label: 'Próximos Tours', action: () => handleNavigate('/agenda') },
          { icon: ClockIcon, label: 'Historial', action: () => handleNavigate('/history') },
          { icon: ShieldCheckIcon, label: 'Protocolos de Emergencia', action: () => handleNavigate('/emergency'), important: true }
        ]
      };

      baseStructure.finances = {
        title: 'Finanzas',
        items: [
          { icon: CurrencyDollarIcon, label: 'Mis Ganancias', action: () => handleNavigate('/guide/finances') },
          { icon: StarIcon, label: 'Tienda de Puntos', action: () => handleNavigate('/guide/points-store') },
          { icon: DocumentTextIcon, label: 'Facturas', action: () => handleNavigate('/invoices') }
        ]
      };
    } else if (user?.role === 'admin') {
      baseStructure.main.items.push(
        { icon: UserGroupIcon, label: 'Usuarios', action: () => navigateToPanel('users') },
        { icon: BuildingOffice2Icon, label: 'Gestión', action: () => navigateToPanel('management') },
        { icon: ChartBarIcon, label: 'Reportes', action: () => handleNavigate('/admin/reports'), direct: true },
        { icon: CogIcon, label: 'Configuración', action: () => handleNavigate('/settings'), direct: true }
      );

      baseStructure.users = {
        title: 'Gestión de Usuarios',
        items: [
          { icon: UserGroupIcon, label: 'Gestión de Usuarios', action: () => handleNavigate('/users') },
          { icon: DocumentTextIcon, label: 'Historial de Usuarios', action: () => handleNavigate('/history') }
        ]
      };

      baseStructure.management = {
        title: 'Gestión General',
        items: [
          { icon: CalendarIcon, label: 'Todas las Reservas', action: () => handleNavigate('/admin/reservations') },
          { icon: MapIcon, label: 'Centro de Monitoreo', action: () => handleNavigate('/monitoring') },
          { icon: BuildingOffice2Icon, label: 'Proveedores', action: () => handleNavigate('/providers') },
          { icon: ShieldCheckIcon, label: 'Protocolos', action: () => handleNavigate('/protocols') }
        ]
      };

    }

    // Panel de cuenta común para todos
    baseStructure.account = {
      title: 'Mi Cuenta',
      items: [
        { icon: UserCircleIcon, label: 'Mi Perfil', action: () => handleNavigate('/profile') },
        { icon: BellIcon, label: 'Notificaciones', action: () => handleNavigate('/notifications'), badge: unreadCount },
        { icon: ChatBubbleLeftRightIcon, label: 'Mensajes', action: () => handleNavigate('/chat'), badge: 5 },
        { icon: CogIcon, label: 'Configuración', action: () => handleNavigate('/settings') },
        { icon: PowerIcon, label: 'Cerrar Sesión', action: handleLogout, className: 'text-red-600' }
      ]
    };

    return baseStructure;
  };

  const panels = getPanelStructure();
  const currentPanel = panels[activePanel] || panels.main;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-4">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-sm">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-primary px-4 py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {activePanel !== 'main' && (
                            <button
                              onClick={goBack}
                              className="p-1 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                            >
                              <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">🌎</span>
                              <h2 className="text-lg font-semibold text-white">Futurismo</h2>
                            </div>
                            <p className="text-sm text-primary-100 mt-1">{currentPanel.title}</p>
                          </div>
                        </div>
                        <button
                          onClick={onClose}
                          className="rounded-full p-2 text-white hover:bg-white hover:bg-opacity-20"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {/* Breadcrumb */}
                    {panelHistory.length > 1 && (
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {panelHistory.map((panel, idx) => (
                            <Fragment key={idx}>
                              {idx > 0 && <ChevronRightIcon className="w-3 h-3" />}
                              <span className={idx === panelHistory.length - 1 ? 'text-gray-900 font-medium' : ''}>
                                {panels[panel]?.title || 'Menú'}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto">
                      <div className="py-2 space-y-1">
                        {currentPanel.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={item.action}
                            className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors min-h-[60px] ${
                              item.className || ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                item.important ? 'bg-red-100' : 
                                item.status === 'active' ? 'bg-green-100' : 
                                'bg-gray-100'
                              }`}>
                                <item.icon className={`w-5 h-5 ${
                                  item.important ? 'text-red-600' :
                                  item.status === 'active' ? 'text-green-600' :
                                  item.className || 'text-gray-600'
                                }`} />
                              </div>
                              <span className={`font-medium text-sm leading-tight ${item.className || 'text-gray-900'}`}>
                                {item.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                                  {item.badge > 9 ? '9+' : item.badge}
                                </span>
                              )}
                              {!item.direct && (
                                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCircleIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                          <p className="text-xs text-gray-500">
                            {user?.role === 'agency' && 'Agencia'}
                            {user?.role === 'guide' && 'Guía'}
                            {user?.role === 'admin' && 'Administrador'}
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

export default SlidePanelsNavigation;