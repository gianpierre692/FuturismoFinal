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
const Users = lazy(() => import('./pages/Users'));
const Settings = lazy(() => import('./pages/Settings'));
const Agenda = lazy(() => import('./pages/Agenda'));
const TourAssignments = lazy(() => import('./pages/TourAssignments'));
const Providers = lazy(() => import('./pages/Providers'));
const EmergencyProtocols = lazy(() => import('./pages/EmergencyProtocols'));
const GuidesManagement = lazy(() => import('./pages/GuidesManagement'));
const AgencyCalendar = lazy(() => import('./pages/AgencyCalendar'));
const AgencyReports = lazy(() => import('./pages/AgencyReports'));
const AgencyPoints = lazy(() => import('./pages/AgencyPoints'));
const AdminReservations = lazy(() => import('./pages/AdminReservations'));
const ReservationManagement = lazy(() => import('./pages/admin/ReservationManagement'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const FinancialDashboard = lazy(() => import('./pages/guide/FinancialDashboard'));

// Marketplace pages
const GuidesMarketplace = lazy(() => import('./pages/marketplace/GuidesMarketplace'));
const GuideMarketplaceProfile = lazy(() => import('./pages/marketplace/GuideMarketplaceProfile'));
const ServiceRequestForm = lazy(() => import('./pages/marketplace/ServiceRequestForm'));
const ServiceRequestDetail = lazy(() => import('./pages/marketplace/ServiceRequestDetail'));
const ServiceReview = lazy(() => import('./pages/marketplace/ServiceReview'));
const AgencyMarketplaceDashboard = lazy(() => import('./pages/marketplace/AgencyMarketplaceDashboard'));
const GuideMarketplaceDashboard = lazy(() => import('./pages/marketplace/GuideMarketplaceDashboard'));

// WebSocket service
import webSocketService from './services/websocket';

function App() {
  const { isAuthenticated, token, initialize } = useAuthStore();
  const { addNotification } = useNotificationsStore();

  // Inicializar la aplicación
  useEffect(() => {
    try {
      initialize();
    } catch (error) {
      console.warn('Error al inicializar aplicación:', error);
      localStorage.clear();
    }
  }, [initialize]);

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
            <Route 
              path="admin/reservations" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReservationManagement />
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
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="agenda" 
              element={
                <ProtectedRoute allowedRoles={['guide', 'admin']}>
                  <Agenda />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="assignments" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TourAssignments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="providers" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Providers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="emergency" 
              element={
                <ProtectedRoute allowedRoles={['guide', 'admin']}>
                  <EmergencyProtocols />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="guides" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <GuidesManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="agency/calendar" 
              element={
                <ProtectedRoute allowedRoles={['agency', 'admin']}>
                  <AgencyCalendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="agency/reports" 
              element={
                <ProtectedRoute allowedRoles={['agency', 'admin']}>
                  <AgencyReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="agency/points" 
              element={
                <ProtectedRoute allowedRoles={['agency', 'admin']}>
                  <AgencyPoints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/reports" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="guide/finances" 
              element={
                <ProtectedRoute allowedRoles={['guide']} requireGuideType="freelance">
                  <FinancialDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas del Marketplace */}
            <Route path="marketplace">
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <GuidesMarketplace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="guide/:guideId" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <GuideMarketplaceProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="book/:guideId" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <ServiceRequestForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="requests" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <AgencyMarketplaceDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="requests/:requestId" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin', 'guide']}>
                    <ServiceRequestDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="review/:requestId" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <ServiceReview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="guide-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['guide']} requireGuideType="freelance">
                    <GuideMarketplaceDashboard />
                  </ProtectedRoute>
                } 
              />
            </Route>
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