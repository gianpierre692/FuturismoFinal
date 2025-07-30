import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationsPanel from './NotificationsPanel';
import AdaptiveNavigation from '../navigation/AdaptiveNavigation';

const Layout = () => {
  // Usar navegación adaptativa en lugar del layout tradicional
  return (
    <AdaptiveNavigation>
      <Outlet />
    </AdaptiveNavigation>
  );
};

export default Layout;