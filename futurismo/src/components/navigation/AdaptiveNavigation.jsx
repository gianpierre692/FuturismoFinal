import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import DesktopSidebar from '../common/Sidebar';
import BottomNavigation from './BottomNavigation';
import SlidePanelsNavigation from './SlidePanelsNavigation';
import MobileHeader from './MobileHeader';
import NotificationsPanel from '../common/NotificationsPanel';
import ResponsiveDebug from '../debug/ResponsiveDebug';
import BackToTopButton from '../common/BackToTopButton';

const AdaptiveNavigation = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth >= 1024) {
        setDrawerOpen(false);
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Ejecutar inmediatamente
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug en desarrollo
  // console.log('AdaptiveNavigation - isMobile:', isMobile, 'width:', window.innerWidth, 'user:', user?.role);
  
  // Ocultar navegación en ciertas rutas
  const hideNavRoutes = ['/login', '/register', '/onboarding'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  if (shouldHideNav) {
    return <>{children}</>;
  }

  // DESKTOP - Sidebar tradicional
  if (!isMobile) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-x-hidden max-w-full">
        <DesktopSidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <NotificationsPanel />
          <div className="flex-1 overflow-y-auto overflow-x-hidden max-w-full">
            <div className="max-w-full">
              {children}
            </div>
          </div>
        </div>
        {/* Botón Back to Top para desktop */}
        <BackToTopButton />
      </div>
    );
  }

  // MOBILE - Navegación adaptativa según rol
  const isGuide = user?.role === 'guide';
  const showBottomNav = isGuide || user?.role === 'driver';
  
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden max-w-full">
      {/* Header móvil - oculto en marketplace */}
      {!location.pathname.includes('/marketplace') && (
        <MobileHeader 
          onMenuClick={() => setDrawerOpen(true)}
          showMenu={true}
        />
      )}

      {/* Slide Panels para todos los roles en móvil */}
      <SlidePanelsNavigation 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Panel de notificaciones */}
      <NotificationsPanel />
      
      {/* Contenido principal */}
      <main className={`${showBottomNav ? 'pb-16' : ''} overflow-x-hidden max-w-full`}>
        <div className="max-w-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation para guías */}
      {showBottomNav && <BottomNavigation userRole={user?.role} />}

      {/* Botón Back to Top */}
      <BackToTopButton />

      {/* FAB Contextual - DESHABILITADO para diseño más limpio */}
      {/* <ContextualFAB userRole={user?.role} currentPath={location.pathname} /> */}
      
      {/* Debug info en desarrollo - DESHABILITADO */}
      {/* <ResponsiveDebug /> */}
    </div>
  );
};

export default AdaptiveNavigation;