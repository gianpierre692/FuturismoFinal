import { useEffect, useState } from 'react';
import DashboardMobile from './DashboardMobile';
import { ArrowTrendingUpIcon, CalendarIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ChartBarIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/dashboard/StatsCard';
import ServiceChart from '../components/dashboard/ServiceChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import ExportPanel from '../components/dashboard/ExportPanel';
import WeeklyIncomeChart from '../components/dashboard/WeeklyIncomeChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InteractiveButton from '../components/common/InteractiveButton';
import InteractiveCard from '../components/common/InteractiveCard';
import useAuthStore from '../stores/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [stats, setStats] = useState(() => {
    // Estadísticas diferentes según el rol
    if (user?.role === 'guide') {
      return {
        myTours: 3,
        completedToday: 2,
        nextTour: '14:30',
        punctualityRate: 98.5
      };
    } else if (user?.role === 'agency') {
      return {
        activeServices: 12,
        completedToday: 8,
        totalRevenue: 15840,
        punctualityRate: 94.5,
        totalReservations: 127,
        totalTourists: 342,
        monthlyRevenue: 89500
      };
    } else { // admin
      return {
        activeServices: 48,
        totalAgencies: 12,
        totalGuides: 35,
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
        <div className="page-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {user?.role === 'guide' ? (
          <>
            <StatsCard
              title={t('dashboard.myToursToday')}
              value={stats.myTours}
              icon={CalendarIcon}
              trend="+1"
              color="primary"
            />
            <StatsCard
              title={t('dashboard.completed')}
              value={stats.completedToday}
              icon={CheckCircleIcon}
              trend="+2"
              color="success"
            />
            <StatsCard
              title={t('dashboard.nextTour')}
              value={stats.nextTour}
              icon={ClockIcon}
              color="secondary"
            />
            <StatsCard
              title={t('dashboard.myPunctuality')}
              value={`${stats.punctualityRate}%`}
              icon={ArrowTrendingUpIcon}
              trend="+0.5%"
              color="primary"
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
            />
            <StatsCard
              title={t('dashboard.totalTourists')}
              value={stats.totalTourists}
              icon={UserGroupIcon}
              trend="+15%"
              color="success"
            />
            <StatsCard
              title={t('dashboard.totalIncome')}
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+23%"
              color="secondary"
            />
            <StatsCard
              title={t('dashboard.punctuality')}
              value={`${stats.punctualityRate}%`}
              icon={ArrowTrendingUpIcon}
              trend="+2.5%"
              color="primary"
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Ingresos del Mes"
              value={`S/. ${stats.totalRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+15.3%"
              color="success"
            />
            <StatsCard
              title="Reservaciones Activas"
              value="142"
              icon={CalendarIcon}
              trend="42 para hoy"
              color="primary"
            />
            <StatsCard
              title="Tours Completados a Tiempo"
              value="96.5%"
              icon={ClockIcon}
              trend="sin retrasos >30min"
              color="success"
            />
            <StatsCard
              title="Tours Sin Cancelaciones"
              value="92.8%"
              icon={CheckCircleIcon}
              trend="cancelación último momento"
              color="primary"
            />
            <StatsCard
              title="Tours Sin Emergencias"
              value="99.1%"
              icon={ShieldExclamationIcon}
              trend="incidentes de seguridad"
              color="secondary"
            />
            <StatsCard
              title="Uptime del Sistema"
              value={`${stats.systemHealth}%`}
              icon={ChartBarIcon}
              trend="Sistema operativo"
              color="primary"
            />
          </>
        )}  
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
          <WeeklyIncomeChart />
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

        {/* Right Column - ChartBarIcon & Quick Actions */}
        <div className="space-y-6">
            <RecentActivity />
            {user?.role !== 'guide' && <QuickActions />}
            {(user?.role === 'agency' || user?.role === 'admin') && <ExportPanel />}
          </div>
        </div>
      </div>

        {/* Bottom Section - Alerts or Announcements */}
        <div className="page-section bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <ExclamationTriangleIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 group-hover:scale-105 transition-transform duration-200">{t('dashboard.importantReminder')}</h3>
            <p className="text-primary-100 mb-3 group-hover:text-white transition-colors duration-200">
              {t('dashboard.holidayMessage')}
            </p>
            <InteractiveButton
              variant="ghost"
              size="sm"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 text-sm font-medium text-white border-white border border-opacity-30 hover:border-opacity-50"
            >
              {t('dashboard.viewHolidayCalendar')}
            </InteractiveButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;