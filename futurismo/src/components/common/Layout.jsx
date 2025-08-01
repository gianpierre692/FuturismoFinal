import { Outlet } from 'react-router-dom';
import UnifiedLayout from '../layout/UnifiedLayout';

const Layout = () => {
  // Usar layout unificado para eliminar conflictos de spacing
  return (
    <UnifiedLayout>
      <Outlet />
    </UnifiedLayout>
  );
};

export default Layout;