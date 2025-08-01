import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import DesktopSidebar from '../common/Sidebar';
import BottomNavigation from '../navigation/BottomNavigation';
import CompactHamburgerMenu from '../navigation/CompactHamburgerMenu';
import MobileHeader from '../navigation/MobileHeader';
import Header from '../common/Header';
import NotificationsPanel from '../common/NotificationsPanel';

const UnifiedLayout = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ocultar navegación en ciertas rutas
  const hideNavRoutes = ['/login', '/register', '/onboarding'];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);
  const isMarketplace = location.pathname.includes('/marketplace');
  
  if (shouldHideNav) {
    return <div className="app-layout-minimal">{children}</div>;
  }

  const isGuide = user?.role === 'guide';
  const showBottomNav = isGuide || user?.role === 'driver';

  return (
    <div className="unified-app-layout">
      {/* Header - Desktop y Mobile */}
      <header className="unified-header">
        {isMobile ? (
          !isMarketplace && (
            <MobileHeader 
              onMenuClick={() => setDrawerOpen(true)}
              showMenu={true}
            />
          )
        ) : (
          <Header />
        )}
      </header>

      {/* Sidebar - Solo Desktop */}
      {!isMobile && (
        <aside className="unified-sidebar">
          <DesktopSidebar 
            isOpen={sidebarOpen} 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          />
        </aside>
      )}

      {/* Menú hamburguesa móvil */}
      <CompactHamburgerMenu 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Panel de notificaciones */}
      <NotificationsPanel />

      {/* Contenido principal */}
      <main className={`unified-main ${!isMobile && sidebarOpen ? 'with-sidebar' : ''} ${showBottomNav ? 'with-bottom-nav' : ''} ${isMarketplace && isMobile ? 'no-header' : ''}`}>
        <div className="unified-content">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Solo Mobile */}
      {isMobile && showBottomNav && (
        <nav className="unified-bottom-nav">
          <BottomNavigation userRole={user?.role} />
        </nav>
      )}
    </div>
  );
};

export default UnifiedLayout;