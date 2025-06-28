import { useEffect, useState } from 'react';
import { ArrowTrendingUpIcon, CalendarIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import StatsCard from '../components/dashboard/StatsCard';
import ServiceChart from '../components/dashboard/ServiceChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import ExportPanel from '../components/dashboard/ExportPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
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
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Ene', reservations: 145, tourists: 367, revenue: 23400 },
    { month: 'Feb', reservations: 132, tourists: 342, revenue: 21800 },
    { month: 'Mar', reservations: 178, tourists: 445, revenue: 28900 },
    { month: 'Abr', reservations: 189, tourists: 478, revenue: 31200 },
    { month: 'May', reservations: 167, tourists: 423, revenue: 27600 },
    { month: 'Jun', reservations: 203, tourists: 512, revenue: 33500 },
    { month: 'Jul', reservations: 234, tourists: 589, revenue: 38700 },
    { month: 'Ago', reservations: 221, tourists: 567, revenue: 36800 },
    { month: 'Sep', reservations: 198, tourists: 501, revenue: 32400 },
    { month: 'Oct', reservations: 187, tourists: 465, revenue: 30100 },
    { month: 'Nov', reservations: 165, tourists: 418, revenue: 27200 },
    { month: 'Dic', reservations: 201, tourists: 509, revenue: 33100 }
  ]);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />;
  }

  // Obtener hora del día para el saludo
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-2">
          Aquí tienes un resumen de la actividad de hoy
        </p>
      </div>

      {/* Stats Squares2X2Icon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user?.role === 'guide' ? (
          <>
            <StatsCard
              title="Mis Tours Hoy"
              value={stats.myTours}
              icon={CalendarIcon}
              trend="+1"
              color="primary"
            />
            <StatsCard
              title="Completados"
              value={stats.completedToday}
              icon={CheckCircleIcon}
              trend="+2"
              color="success"
            />
            <StatsCard
              title="Próximo Tour"
              value={stats.nextTour}
              icon={ClockIcon}
              color="secondary"
            />
            <StatsCard
              title="Mi Puntualidad"
              value={`${stats.punctualityRate}%`}
              icon={ArrowTrendingUpIcon}
              trend="+0.5%"
              color="primary"
            />
          </>
        ) : user?.role === 'agency' ? (
          <>
            <StatsCard
              title="Total Reservas"
              value={stats.totalReservations}
              icon={CalendarIcon}
              trend="+18%"
              color="primary"
            />
            <StatsCard
              title="Total Turistas"
              value={stats.totalTourists}
              icon={UserGroupIcon}
              trend="+15%"
              color="success"
            />
            <StatsCard
              title="Ingresos Totales"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+23%"
              color="secondary"
            />
            <StatsCard
              title="Puntualidad"
              value={`${stats.punctualityRate}%`}
              icon={ArrowTrendingUpIcon}
              trend="+2.5%"
              color="primary"
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Reservas"
              value={stats.totalReservations}
              icon={CalendarIcon}
              trend="+25%"
              color="primary"
            />
            <StatsCard
              title="Total Turistas"
              value={stats.totalTourists}
              icon={UserGroupIcon}
              trend="+22%"
              color="success"
            />
            <StatsCard
              title="Ingresos Totales"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+28%"
              color="secondary"
            />
            <StatsCard
              title="Salud del Sistema"
              value={`${stats.systemHealth}%`}
              icon={ChartBarIcon}
              color="primary"
            />
          </>
        )}  
      </div>

      {/* Monthly Comparison Charts - Only for Agency and Admin */}
      {(user?.role === 'agency' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Reservas por Mes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reservas por Mes</h3>
              <ChartBarIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, 'Reservas']}
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
          </div>

          {/* Turistas por Mes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Turistas por Mes</h3>
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, 'Turistas']}
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
          </div>

          {/* Ingresos por Mes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ingresos por Mes</h3>
              <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Squares2X2Icon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ServiceChart />
          
          {/* Tours activos mini table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tours Activos Ahora</h3>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Tour</th>
                    <th className="px-4 py-2 text-left">Guía</th>
                    <th className="px-4 py-2 text-center">Turistas</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3">City Tour Lima</td>
                    <td className="px-4 py-3">Carlos Mendoza</td>
                    <td className="px-4 py-3 text-center">12</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-green">En ruta</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Tour Gastronómico</td>
                    <td className="px-4 py-3">María García</td>
                    <td className="px-4 py-3 text-center">8</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-yellow">En parada</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Islas Palomino</td>
                    <td className="px-4 py-3">Juan Pérez</td>
                    <td className="px-4 py-3 text-center">15</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-blue">Iniciando</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-center">
              <a href="/monitoring" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Ver monitoreo en tiempo real →
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - ChartBarIcon & Quick Actions */}
        <div className="space-y-6">
          <RecentActivity />
          {user?.role !== 'guide' && <QuickActions />}
          {(user?.role === 'agency' || user?.role === 'admin') && <ExportPanel />}
        </div>
      </div>

      {/* Bottom Section - Alerts or Announcements */}
      <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <ExclamationTriangleIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Recordatorio Importante</h3>
            <p className="text-primary-100 mb-3">
              Mañana es feriado nacional. Recuerda confirmar los horarios especiales con los guías 
              y notificar a los clientes sobre posibles cambios en los itinerarios.
            </p>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Ver calendario de feriados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;