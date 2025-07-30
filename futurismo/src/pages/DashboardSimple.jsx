import { useEffect, useState } from 'react';
import DashboardMobile from './DashboardMobile';
import DashboardDesktop from './DashboardDesktop';
import AdminDashboard from './admin/AdminDashboard';
import useAuthStore from '../stores/authStore';

const DashboardSimple = () => {
  const { user } = useAuthStore();
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Si es admin, mostrar el dashboard especializado
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Mobile version
  if (screenSize.isMobile) {
    return <DashboardMobile />;
  }

  // Desktop and Tablet version with enhanced details
  return <DashboardDesktop />;
};

export default DashboardSimple;