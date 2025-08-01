import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import ToastContainer from './components/common/ToastContainer';

// Stores
import useAuthStore from './stores/authStore';
import useNotificationsStore from './stores/notificationsStore';

// Componentes
import Layout from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ConnectionStatus from './components/common/ConnectionStatus';
import RouteErrorBoundary from './components/common/RouteErrorBoundary';
import LazyWrapper from './components/common/LazyWrapper';
import SkeletonLoader from './components/common/SkeletonLoader';

// Componentes
// import InstallPWA from './components/common/InstallPWA'; // Removido - no es una app móvil

// Lazy loading de páginas con chunks nombrados
const LoginRegister = lazy(() => import(/* webpackChunkName: "auth" */ './pages/LoginRegister'));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'));
const Monitoring = lazy(() => import(/* webpackChunkName: "monitoring" */ './pages/Monitoring'));
const Reservations = lazy(() => import(/* webpackChunkName: "reservations" */ './pages/Reservations'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));
const Chat = lazy(() => import('./pages/Chat'));
const Users = lazy(() => import('./pages/Users'));
const Settings = lazy(() => import('./pages/Settings'));
const Agenda = lazy(() => import('./pages/Agenda'));
const Providers = lazy(() => import('./pages/Providers'));
const EmergencyProtocols = lazy(() => import('./pages/EmergencyProtocols'));
const GuidesManagement = lazy(() => import('./pages/GuidesManagement'));
const AgencyCalendar = lazy(() => import('./pages/AgencyCalendar'));
const AgencyReports = lazy(() => import('./pages/AgencyReports'));
const AgencyPoints = lazy(() => import('./pages/AgencyPoints'));
const AdminReservations = lazy(() => import('./pages/AdminReservations'));
const ReservationManagement = lazy(() => import('./pages/admin/ReservationManagement'));
const ResourcesManagement = lazy(() => import('./pages/admin/ResourcesManagement'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AlertsCenter = lazy(() => import('./pages/admin/AlertsCenter'));
const ConflictManagement = lazy(() => import('./pages/admin/ConflictManagement'));
const TourReassignment = lazy(() => import('./pages/admin/TourReassignment'));
const AgencyApproval = lazy(() => import('./pages/admin/AgencyApproval'));
const MassNotifications = lazy(() => import('./pages/admin/MassNotifications'));
const RouteAnalytics = lazy(() => import('./pages/admin/RouteAnalytics'));
const FinancialDashboard = lazy(() => import('./pages/guide/FinancialDashboard'));
const PointsStore = lazy(() => import('./pages/guide/PointsStore'));
const ResponsiveTest = lazy(() => import('./pages/ResponsiveTest'));
const MobileMenuAlternatives = lazy(() => import('./components/navigation/MobileMenuAlternatives'));
const MenuStructureComparison = lazy(() => import('./pages/MenuStructureComparison'));
const MenuMockups = lazy(() => import('./pages/MenuMockups'));

// Marketplace pages
const MarketplaceHome = lazy(() => import('./pages/marketplace/MarketplaceHome'));
const GuideSearch = lazy(() => import('./pages/marketplace/GuideSearch'));
const GuideMarketplaceProfile = lazy(() => import('./pages/marketplace/GuideMarketplaceProfile'));
const BookingFlow = lazy(() => import('./pages/marketplace/BookingFlow'));
const MyBookings = lazy(() => import('./pages/marketplace/MyBookings'));
const ServiceRequestDetail = lazy(() => import('./pages/marketplace/ServiceRequestDetail'));
const ServiceReview = lazy(() => import('./pages/marketplace/ServiceReview'));
const AgencyMarketplaceDashboard = lazy(() => import('./pages/marketplace/AgencyMarketplaceDashboard'));
const GuideMarketplaceDashboard = lazy(() => import('./pages/marketplace/GuideMarketplaceDashboard'));

// WebSocket service
import webSocketResilientService from './services/websocketResilient';

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

  // Conectar WebSocket resiliente cuando se autentique
  useEffect(() => {
    const wsEnabled = import.meta.env.VITE_ENABLE_WEBSOCKET === 'true';
    if (isAuthenticated && token && wsEnabled) {
      webSocketResilientService.connect(token);

      // Listeners de WebSocket resiliente
      const unsubscribeTourUpdate = webSocketResilientService.on('tour:location-update', (data) => {
        // Actualización de ubicación de tour recibida
        console.log('Tour location updated:', data);
      });

      const unsubscribeTourStatus = webSocketResilientService.on('tour:status-change', (data) => {
        addNotification({
          type: 'info',
          title: 'Estado de tour actualizado',
          message: `Tour ${data.tourId} cambió a: ${data.status}`,
          actionUrl: `/monitoring?tour=${data.tourId}`
        });
      });

      const unsubscribeEmergency = webSocketResilientService.on('emergency:alert', (data) => {
        addNotification({
          type: 'error',
          title: '🚨 EMERGENCIA',
          message: `Alerta de emergencia en ${data.location}`,
          actionUrl: `/monitoring?emergency=${data.id}`
        });
      });

      const unsubscribeNotification = webSocketResilientService.on('notification:new', (data) => {
        addNotification(data);
      });

      return () => {
        unsubscribeTourUpdate();
        unsubscribeTourStatus();
        unsubscribeEmergency();
        unsubscribeNotification();
        webSocketResilientService.disconnect();
      };
    }
  }, [isAuthenticated, token, addNotification]);

  return (
    <Router>
      <RouteErrorBoundary routeName="Aplicación Principal">
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Ruta de login */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : (
                  <LazyWrapper description="Cargando página de acceso...">
                    <LoginRegister />
                  </LazyWrapper>
                )
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
            <Route path="dashboard" element={
              <LazyWrapper 
                fallback={<SkeletonLoader.Dashboard />}
                description="Cargando dashboard..."
              >
                <Dashboard />
              </LazyWrapper>
            } />
            <Route path="monitoring" element={
              <LazyWrapper 
                fallback={<SkeletonLoader.Map />}
                description="Cargando monitoreo en tiempo real..."
              >
                <Monitoring />
              </LazyWrapper>
            } />
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
            <Route 
              path="admin/resources" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ResourcesManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="history" element={<History />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
            <Route path="responsive-test" element={<ResponsiveTest />} />
            <Route path="menu-test" element={<MobileMenuAlternatives />} />
            <Route path="menu-structure" element={<MenuStructureComparison />} />
            <Route path="menu-mockups" element={<MenuMockups />} />
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
              path="admin/alerts" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AlertsCenter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/conflicts" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ConflictManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/tour-reassignment" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TourReassignment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/agency-approval" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AgencyApproval />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/mass-notifications" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MassNotifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/route-analytics" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <RouteAnalytics />
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
            <Route 
              path="guide/points-store" 
              element={
                <ProtectedRoute allowedRoles={['guide']} requireGuideType="freelance">
                  <PointsStore />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas del Marketplace */}
            <Route path="marketplace">
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin', 'guide']}>
                    <MarketplaceHome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="search" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <GuideSearch />
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
                path="booking/:guideId" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <BookingFlow />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="bookings" 
                element={
                  <ProtectedRoute allowedRoles={['agency', 'admin']}>
                    <MyBookings />
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

      {/* Indicador de estado de conexión */}
      {isAuthenticated && !import.meta.env.DEV && <ConnectionStatus />}
      </RouteErrorBoundary>

      {/* Sistema de Toast Avanzado */}
      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;