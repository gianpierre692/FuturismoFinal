import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import DesktopSidebar from '../common/Sidebar';
import BottomNavigation from './BottomNavigation';
import CompactHamburgerMenu from './CompactHamburgerMenu';
import MobileHeader from './MobileHeader';
import Header from '../common/Header';
import NotificationsPanel from '../common/NotificationsPanel';
import ResponsiveDebug from '../debug/ResponsiveDebug';
import Logger from '../../utils/logger';

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
  // Logger.debug('AdaptiveNavigation - isMobile:', isMobile, 'width:', window.innerWidth, 'user:', user?.role);
  
  // Ocultar navegación en ciertas rutas
  const hideNavRoutes = ['/login', '/register', '/onboarding'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  if (shouldHideNav) {
    return <>{children}</>;
  }

  // DESKTOP - Sidebar tradicional con Header
  if (!isMobile) {
    return (
      <div className="flex h-screen bg-white">
        <DesktopSidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <NotificationsPanel />
          <div className="flex-1 overflow-auto content-with-header">
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MOBILE - Navegación adaptativa según rol
  const isGuide = user?.role === 'guide';
  const showBottomNav = isGuide || user?.role === 'driver';
  
  return (
    <div className="min-h-screen bg-white overflow-x-hidden max-w-full">
      {/* Header móvil - oculto en marketplace */}
      {!location.pathname.includes('/marketplace') && (
        <MobileHeader 
          onMenuClick={() => setDrawerOpen(true)}
          showMenu={true}
        />
      )}

      {/* Menú hamburguesa compacto para todos los roles en móvil */}
      <CompactHamburgerMenu 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Panel de notificaciones */}
      <NotificationsPanel />
      
      {/* Contenido principal */}
      <main className={`mobile-main-content ${showBottomNav ? 'pb-16' : ''} ${location.pathname.includes('/marketplace') ? '!pt-0' : ''} overflow-x-hidden max-w-full`}>
        <div className="max-w-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation para guías */}
      {showBottomNav && <BottomNavigation userRole={user?.role} />}


      {/* FAB Contextual - DESHABILITADO para diseño más limpio */}
      {/* <ContextualFAB userRole={user?.role} currentPath={location.pathname} /> */}
      
      {/* Debug info en desarrollo - DESHABILITADO */}
      {/* <ResponsiveDebug /> */}
    </div>
  );
};

export default AdaptiveNavigation;