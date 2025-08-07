import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardMobile from './DashboardMobile';
import { ArrowTrendingUpIcon, CalendarIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ChartBarIcon, ShieldExclamationIcon, StarIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/dashboard/StatsCard';
import ServiceChart from '../components/dashboard/ServiceChart';
import ExportPanel from '../components/dashboard/ExportPanel';
import MonthlyIncomeChart from '../components/dashboard/MonthlyIncomeChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InteractiveButton from '../components/common/InteractiveButton';
import InteractiveCard from '../components/common/InteractiveCard';
import useAuthStore from '../stores/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [stats, setStats] = useState(() => {
    // Estadísticas diferentes según el rol
    if (user?.role === 'guide') {
      return {
        myTours: 3,
        completedToday: 2,
        nextTour: '14:30',
        myRating: 4.8,
        monthlyEarnings: 3250
      };
    } else if (user?.role === 'agency') {
      return {
        activeServices: 12,
        activeTours: 5,
        completedToday: 8,
        totalRevenue: 15840,
        totalReservations: 127,
        totalTourists: 342,
        monthlyRevenue: 89500
      };
    } else { // admin
      return {
        activeServices: 48,
        totalAgencies: 12,
        totalGuides: 35,
        onlineUsers: 47,
        systemHealth: 99.9,
        totalReservations: 1847,
        totalTourists: 4532,
        totalRevenue: 285700
      };
    }
  });

  // Datos para el gráfico de comparación mensual
  const getMonthlyData = () => {
    const months = i18n.language === 'es' 
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return [
      { month: months[0], reservations: 145, tourists: 367, revenue: 23400 },
      { month: months[1], reservations: 132, tourists: 342, revenue: 21800 },
      { month: months[2], reservations: 178, tourists: 445, revenue: 28900 },
      { month: months[3], reservations: 189, tourists: 478, revenue: 31200 },
      { month: months[4], reservations: 167, tourists: 423, revenue: 27600 },
      { month: months[5], reservations: 203, tourists: 512, revenue: 33500 },
      { month: months[6], reservations: 234, tourists: 589, revenue: 38700 },
      { month: months[7], reservations: 221, tourists: 567, revenue: 36800 },
      { month: months[8], reservations: 198, tourists: 501, revenue: 32400 },
      { month: months[9], reservations: 187, tourists: 465, revenue: 30100 },
      { month: months[10], reservations: 165, tourists: 418, revenue: 27200 },
      { month: months[11], reservations: 201, tourists: 509, revenue: 33100 }
    ];
  };
  
  const [monthlyData, setMonthlyData] = useState([]);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Actualizar datos del gráfico cuando cambia el idioma
  useEffect(() => {
    setMonthlyData(getMonthlyData());
  }, [i18n.language]);

  // Funciones para manejar clicks en las tarjetas de estadísticas
  const handleStatsClick = (type) => {
    switch (type) {
      // Agency role actions
      case 'reservations':
        navigate('/reservations');
        break;
      case 'tourists':
        navigate('/reservations?filter=tourists');
        break;
      case 'income':
        navigate('/agency/reports?section=income');
        break;
      case 'active-tours':
        navigate('/monitoring');
        break;
      
      // Guide role actions
      case 'my-tours':
        navigate('/mis-tours');
        break;
      case 'completed':
        navigate('/historial?filter=completados');
        break;
      case 'next-tour':
        navigate('/agenda');
        break;
      case 'my-rating':
        navigate('/profile');
        break;
      case 'my-earnings':
        navigate('/guide/finances');
        break;
      
      // Admin role actions
      case 'admin-income':
        navigate('/admin/reports?section=income');
        break;
      case 'admin-reservations':
        navigate('/admin/reservations');
        break;
      case 'online-users':
        navigate('/users');
        break;
      case 'admin-cancellations':
        navigate('/admin/reports?section=cancellations');
        break;
      case 'admin-emergencies':
        navigate('/admin/alerts?view=emergencies');
        break;
      case 'admin-system':
        navigate('/settings?section=system-health');
        break;
      
      default:
        break;
    }
  };

  // Obtener hora del día para el saludo
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  // Usar versión móvil para pantallas pequeñas
  if (isMobile) {
    return <DashboardMobile />;
  }

  if (loading) {
    return <LoadingSpinner text={t('dashboard.loading')} />;
  }

  return (
    <div className="page-container">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none group">
          <h1 className="page-title group-hover:text-primary-600 transition-colors duration-300">
            {getGreeting()}, {user?.name || 'Usuario'}
          </h1>
          <p className="page-subtitle group-hover:text-gray-700 transition-colors duration-200">
            {t('dashboard.todaySummary')}
          </p>
          <div className="mt-3 h-1 w-0 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-20 transition-all duration-500 rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="page-section flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl w-full">
        {user?.role === 'guide' ? (
          <>
            <StatsCard
              title={t('dashboard.myToursToday')}
              value={stats.myTours}
              icon={CalendarIcon}
              trend="+1"
              color="primary"
              onClick={() => handleStatsClick('my-tours')}
            />
            <StatsCard
              title={t('dashboard.completed')}
              value={stats.completedToday}
              icon={CheckCircleIcon}
              trend="+2"
              color="success"
              onClick={() => handleStatsClick('completed')}
            />
            <StatsCard
              title={t('dashboard.nextTour')}
              value={stats.nextTour}
              icon={ClockIcon}
              color="secondary"
              onClick={() => handleStatsClick('next-tour')}
            />
            <StatsCard
              title={user?.guideType === 'freelance' ? 'Mis Ganancias' : 'Mi Calificación'}
              value={user?.guideType === 'freelance' ? `S/. ${stats.monthlyEarnings}` : `${stats.myRating} ⭐`}
              icon={user?.guideType === 'freelance' ? CurrencyDollarIcon : StarIcon}
              trend={user?.guideType === 'freelance' ? '+12%' : '+0.2'}
              color="primary"
              onClick={() => handleStatsClick(user?.guideType === 'freelance' ? 'my-earnings' : 'my-rating')}
            />
          </>
        ) : user?.role === 'agency' ? (
          <>
            <StatsCard
              title={t('dashboard.totalReservations')}
              value={stats.totalReservations}
              icon={CalendarIcon}
              trend="+18%"
              color="primary"
              onClick={() => handleStatsClick('reservations')}
            />
            <StatsCard
              title={t('dashboard.totalTourists')}
              value={stats.totalTourists}
              icon={UserGroupIcon}
              trend="+15%"
              color="success"
              onClick={() => handleStatsClick('tourists')}
            />
            <StatsCard
              title={t('dashboard.totalIncome')}
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+23%"
              color="secondary"
              onClick={() => handleStatsClick('income')}
            />
            <StatsCard
              title="Tours Activos"
              value={stats.activeTours}
              icon={PlayIcon}
              trend="+3 hoy"
              color="primary"
              onClick={() => handleStatsClick('active-tours')}
            />
          </>
        ) : (
          <>
            <StatsCard
              title={t('dashboard.totalIncome')}
              value={`S/. ${stats.totalRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+15.3%"
              color="success"
              onClick={() => handleStatsClick('admin-income')}
            />
            <StatsCard
              title="Reservaciones Activas"
              value="142"
              icon={CalendarIcon}
              trend="42 para hoy"
              color="primary"
              onClick={() => handleStatsClick('admin-reservations')}
            />
            <StatsCard
              title="Usuarios Online"
              value={stats.onlineUsers}
              icon={UserGroupIcon}
              trend="conectados ahora"
              color="success"
              onClick={() => handleStatsClick('online-users')}
            />
            <StatsCard
              title="Tours Sin Cancelaciones"
              value="92.8%"
              icon={CheckCircleIcon}
              trend="cancelación último momento"
              color="primary"
              onClick={() => handleStatsClick('admin-cancellations')}
            />
            <StatsCard
              title="Tours Sin Emergencias"
              value="99.1%"
              icon={ShieldExclamationIcon}
              trend="incidentes de seguridad"
              color="secondary"
              onClick={() => handleStatsClick('admin-emergencies')}
            />
            <StatsCard
              title="Uptime del Sistema"
              value={`${stats.systemHealth}%`}
              icon={ChartBarIcon}
              trend="Sistema operativo"
              color="primary"
              onClick={() => handleStatsClick('admin-system')}
            />
          </>
        )}  
          </div>
        </div>

      {/* Monthly Comparison Charts - Only for Agency and Admin */}
      {(user?.role === 'agency' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Reservas por Mes */}
          <InteractiveCard className="bg-white p-4 sm:p-6 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">{t('dashboard.reservationsByMonth')}</h3>
              <ChartBarIcon className="w-5 h-5 text-primary-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, t('dashboard.reservations')]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="reservations" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </InteractiveCard>

          {/* Turistas por Mes */}
          <InteractiveCard className="bg-white p-4 sm:p-6 group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">{t('dashboard.touristsByMonth')}</h3>
              <UserGroupIcon className="w-5 h-5 text-green-600 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300" />
            </div>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, t('dashboard.tourists')]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="tourists" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </InteractiveCard>
        </div>
      )}

      {/* Análisis Detallado de Ingresos - Solo para Agency y Admin */}
      {(user?.role === 'agency' || user?.role === 'admin') && (
        <div className="mb-6 sm:mb-8">
          <MonthlyIncomeChart />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <ServiceChart />
          
          {/* Tours activos mini table */}
          <InteractiveCard className="bg-white p-4 sm:p-6 group">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold group-hover:text-gray-800 transition-colors">{t('dashboard.activeToursNow')}</h3>
              <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors animate-pulse">
                {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full align-middle px-4 sm:px-6">
                <table className="min-w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">{t('dashboard.tour')}</th>
                      <th className="px-3 py-2 text-left hidden sm:table-cell">{t('dashboard.guide')}</th>
                      <th className="px-3 py-2 text-center">{t('dashboard.tourists')}</th>
                      <th className="px-3 py-2 text-left">{t('dashboard.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors duration-150 group/row cursor-pointer">
                      <td className="px-3 py-2 sm:py-3">
                        <div>
                          <div className="font-medium group-hover/row:text-primary-600 transition-colors">City Tour Lima</div>
                          <div className="text-xs text-gray-500 sm:hidden">Carlos Mendoza</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:py-3 hidden sm:table-cell group-hover/row:text-gray-800 transition-colors">Carlos Mendoza</td>
                      <td className="px-3 py-2 sm:py-3 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium group-hover/row:bg-primary-100 group-hover/row:text-primary-800 transition-all duration-150">12</span>
                      </td>
                      <td className="px-3 py-2 sm:py-3">
                        <span className="badge badge-green text-xs animate-pulse">{t('dashboard.enRoute')}</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors duration-150 group/row cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="font-medium group-hover/row:text-primary-600 transition-colors">Tour Gastronómico</div>
                      </td>
                      <td className="px-4 py-3 group-hover/row:text-gray-800 transition-colors">María García</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium group-hover/row:bg-primary-100 group-hover/row:text-primary-800 transition-all duration-150">8</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-yellow animate-bounce">{t('dashboard.atStop')}</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors duration-150 group/row cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="font-medium group-hover/row:text-primary-600 transition-colors">Islas Palomino</div>
                      </td>
                      <td className="px-4 py-3 group-hover/row:text-gray-800 transition-colors">Juan Pérez</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium group-hover/row:bg-primary-100 group-hover/row:text-primary-800 transition-all duration-150">15</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-blue">{t('dashboard.starting')}</span>
                      </td>
                    </tr>
                </tbody>
              </table>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <InteractiveButton
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                onClick={() => window.location.href = '/monitoring'}
              >
                {t('dashboard.viewLiveMonitoring')} →
              </InteractiveButton>
            </div>
          </InteractiveCard>
        </div>

        {/* Right Column - Export Panel Only */}
        <div className="space-y-6">
            {(user?.role === 'agency' || user?.role === 'admin') && <ExportPanel />}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;