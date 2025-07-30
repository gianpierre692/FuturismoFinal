import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  MapIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  UserCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MapIcon as MapIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  ClockIcon as ClockIconSolid,
  UserCircleIcon as UserCircleIconSolid
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const BottomNavigation = ({ userRole }) => {
  const { t } = useTranslation();
  const [hasEmergency, setHasEmergency] = useState(false);

  // Items de navegación según rol
  const getNavItems = () => {
    if (userRole === 'guide') {
      return [
        { 
          path: '/dashboard', 
          icon: HomeIcon, 
          iconActive: HomeIconSolid,
          label: 'Inicio',
          badge: null
        },
        { 
          path: '/monitoring', 
          icon: MapIcon, 
          iconActive: MapIconSolid,
          label: 'Mapa',
          badge: 2 // Tours activos
        },
        { 
          path: '/agenda', 
          icon: CalendarDaysIcon, 
          iconActive: CalendarDaysIconSolid,
          label: 'Agenda',
          badge: null
        },
        { 
          path: '/history', 
          icon: ClockIcon, 
          iconActive: ClockIconSolid,
          label: 'Historial',
          badge: null
        },
        { 
          path: '/profile', 
          icon: UserCircleIcon, 
          iconActive: UserCircleIconSolid,
          label: 'Perfil',
          badge: null
        }
      ];
    }
    
    // Similar para otros roles...
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Alerta de emergencia flotante */}
      {hasEmergency && (
        <div className="fixed bottom-20 left-4 right-4 bg-red-500 text-white rounded-lg p-3 shadow-lg flex items-center gap-3 z-50">
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm flex-1">Emergencia reportada en Tour Valle Sagrado</p>
          <button className="text-xs underline">Ver</button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center py-1
                ${isActive ? 'text-primary' : 'text-gray-400'}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-1 right-1/2 translate-x-3 -translate-y-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Icon */}
                  {isActive ? (
                    <item.iconActive className="w-6 h-6" />
                  ) : (
                    <item.icon className="w-6 h-6" />
                  )}
                  
                  {/* Label */}
                  <span className="text-xs mt-0.5">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-b-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;