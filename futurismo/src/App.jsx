import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Stores
import useAuthStore from './stores/authStore';
import useNotificationsStore from './stores/notificationsStore';

// Componentes
import Layout from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loading de páginas
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Monitoring = lazy(() => import('./pages/Monitoring'));
const Reservations = lazy(() => import('./pages/Reservations'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));
const Chat = lazy(() => import('./pages/Chat'));

// WebSocket service
import webSocketService from './services/websocket';

function App() {
  const { isAuthenticated, token, checkTokenExpiry } = useAuthStore();
  const { addNotification } = useNotificationsStore();

  // Verificar token al cargar
  useEffect(() => {
    if (isAuthenticated) {
      checkTokenExpiry();
    }
  }, []);

  // Conectar WebSocket cuando se autentique
  useEffect(() => {
    if (isAuthenticated && token) {
      webSocketService.connect(token);

      // Listeners de WebSocket
      const unsubscribeUpdate = webSocketService.on('service:update', (data) => {
        addNotification({
          type: 'info',
          title: 'Actualización de servicio',
          message: `Servicio ${data.serviceCode} actualizado`,
          actionUrl: `/monitoring?service=${data.serviceCode}`
        });
      });

      const unsubscribeNotification = webSocketService.on('notification:new', (data) => {
        addNotification(data);
      });

      return () => {
        unsubscribeUpdate();
        unsubscribeNotification();
        webSocketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Ruta de login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route 
              path="reservations" 
              element={
                <ProtectedRoute allowedRoles={['agency', 'admin']}>
                  <Reservations />
                </ProtectedRoute>
              } 
            />
            <Route path="history" element={<History />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
            <Route 
              path="users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                    <p className="text-gray-600 mt-2">Módulo disponible solo para administradores</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
                    <p className="text-gray-600 mt-2">Módulo disponible solo para administradores</p>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;