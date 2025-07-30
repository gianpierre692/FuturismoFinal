import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  HomeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../stores/authStore';

const DrawerNavigation = ({ isOpen, onClose, userRole }) => {
  const { user, logout } = useAuthStore();

  // Items de navegación según rol
  const getMenuItems = () => {
    if (userRole === 'agency') {
      return [
        { section: 'Principal', items: [
          { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
          { path: '/reservations', icon: CalendarIcon, label: 'Reservaciones', badge: 3 },
          { path: '/monitoring', icon: MagnifyingGlassIcon, label: 'Monitoreo' }
        ]},
        { section: 'Marketplace', items: [
          { path: '/marketplace', icon: MagnifyingGlassIcon, label: 'Buscar Guías' },
          { path: '/marketplace/requests', icon: BriefcaseIcon, label: 'Mis Contrataciones' }
        ]},
        { section: 'Análisis', items: [
          { path: '/agency/reports', icon: ChartBarIcon, label: 'Reportes' },
          { path: '/history', icon: ClockIcon, label: 'Historial' }
        ]},
        { section: 'Comunicación', items: [
          { path: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Mensajes', badge: 5 }
        ]}
      ];
    }
    
    // Admin
    return [
      // Similar estructura para admin...
    ];
  };

  const menuSections = getMenuItems();

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
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-xs">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-primary px-4 py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg">🌎</span>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-white">Futurismo</h2>
                            <p className="text-sm text-primary-100">{user?.name}</p>
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

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-4">
                      {menuSections.map((section, idx) => (
                        <div key={idx} className="mb-6">
                          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {section.section}
                          </h3>
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                    isActive
                                      ? 'bg-primary text-white'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <item.icon className="w-5 h-5" />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                {item.badge && (
                                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      ))}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4 space-y-2">
                      <NavLink
                        to="/profile"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <UserIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Mi Perfil</span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <CogIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Configuración</span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                      </button>
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

export default DrawerNavigation;