import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  XMarkIcon,
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
  CogIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../stores/authStore';

const CompactHamburgerMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  // Estructura de menú IDÉNTICA al sidebar desktop
  const getMenuStructure = () => {
    const baseItems = [
      { 
        icon: HomeIcon, 
        label: 'Inicio', 
        action: () => handleNavigate('/dashboard'),
        isActive: location.pathname === '/dashboard'
      }
    ];

    if (user?.role === 'agency') {
      return [
        ...baseItems,
        { icon: MapIcon, label: 'Monitoreo', action: () => handleNavigate('/monitoring') },
        { icon: CalendarIcon, label: 'Reservaciones', action: () => handleNavigate('/reservations') },
        { icon: MagnifyingGlassIcon, label: 'Buscar Guías', action: () => handleNavigate('/marketplace') },
        { icon: BriefcaseIcon, label: 'Mis Contratos', action: () => handleNavigate('/marketplace/bookings') },
        { icon: CalendarDaysIcon, label: 'Calendario', action: () => handleNavigate('/agency/calendar') },
        { icon: ChartBarIcon, label: 'Reportes', action: () => handleNavigate('/agency/reports') },
        { icon: StarIcon, label: 'Puntos', action: () => handleNavigate('/agency/points') },
        { icon: ClockIcon, label: 'Historial', action: () => handleNavigate('/history') },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', action: () => handleNavigate('/chat') }
      ];
    } else if (user?.role === 'guide') {
      const guideItems = [
        ...baseItems,
        { icon: MapIcon, label: 'Mis Tours', action: () => handleNavigate('/monitoring') },
        { icon: ClockIcon, label: 'Historial', action: () => handleNavigate('/history') },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', action: () => handleNavigate('/chat') }
      ];
      
      // Agregar opciones específicas para guías freelance
      if (user?.guideType === 'freelance') {
        guideItems.splice(-1, 0, { icon: CalendarDaysIcon, label: 'Mi Agenda', action: () => handleNavigate('/agenda') });
        guideItems.splice(-1, 0, { icon: BriefcaseIcon, label: 'Mis Servicios', action: () => handleNavigate('/marketplace/guide-dashboard') });
        guideItems.splice(-1, 0, { icon: CurrencyDollarIcon, label: 'Finanzas', action: () => handleNavigate('/guide/finances') });
        guideItems.splice(-1, 0, { icon: StarIcon, label: 'Tienda Puntos', action: () => handleNavigate('/guide/points-store') });
      }
      
      guideItems.splice(-1, 0, { icon: ShieldCheckIcon, label: 'Emergencias', action: () => handleNavigate('/emergency') });
      guideItems.push({ icon: UserCircleIcon, label: 'Perfil', action: () => handleNavigate('/profile') });
      return guideItems;
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { icon: MapIcon, label: 'Monitoreo en Vivo', action: () => handleNavigate('/monitoring'), badge: 'En vivo' },
        { icon: CalendarIcon, label: 'Reservaciones', action: () => handleNavigate('/reservations') },
        { icon: CalendarDaysIcon, label: 'Calendario General', action: () => handleNavigate('/agenda') },
        { icon: UserGroupIcon, label: 'Usuarios', action: () => handleNavigate('/users'), badge: '389' },
        { icon: UserCircleIcon, label: 'Guías', action: () => handleNavigate('/guides'), badge: '35' },
        { icon: BuildingOffice2Icon, label: 'Proveedores', action: () => handleNavigate('/providers') },
        { icon: ChartBarIcon, label: 'Reportes', action: () => handleNavigate('/admin/reports') },
        { icon: DocumentTextIcon, label: 'Historial', action: () => handleNavigate('/history') },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', action: () => handleNavigate('/chat'), badge: '8' },
        { icon: ShieldCheckIcon, label: 'Emergencias', action: () => handleNavigate('/emergency') }
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

                    {/* Navigation Items - Lista plana idéntica a desktop */}
                    <nav className="flex-1 overflow-y-auto py-1">
                      {menuItems.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={item.action}
                          className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-all duration-150 group ${
                            item.isActive ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`p-1 rounded-md ${
                              item.isActive ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-gray-200'
                            } transition-colors`}>
                              <item.icon className={`w-4 h-4 ${
                                item.isActive ? 'text-primary-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <span className={`font-medium text-sm ${
                              item.isActive ? 'text-primary-900' : 'text-gray-900'
                            } group-hover:text-gray-800 transition-colors`}>
                              {item.label}
                            </span>
                          </div>
                          {item.badge && (
                            <span className={`min-w-[18px] h-4 text-white text-xs rounded-full flex items-center justify-center px-1.5 font-medium ${
                              item.badge === 'En vivo' ? 'bg-red-500' : 
                              typeof item.badge === 'string' && !isNaN(item.badge) ? 'bg-blue-500' : 
                              'bg-red-500'
                            }`}>
                              {typeof item.badge === 'string' && item.badge.length > 3 ? item.badge.substring(0,3) : item.badge}
                            </span>
                          )}
                        </button>
                      ))}

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