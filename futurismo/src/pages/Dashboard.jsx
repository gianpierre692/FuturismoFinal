import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  Activity
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import ServiceChart from '../components/dashboard/ServiceChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';

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
        punctualityRate: 94.5
      };
    } else { // admin
      return {
        activeServices: 48,
        totalAgencies: 12,
        totalGuides: 35,
        systemHealth: 99.9
      };
    }
  });

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user?.role === 'guide' ? (
          <>
            <StatsCard
              title="Mis Tours Hoy"
              value={stats.myTours}
              icon={Calendar}
              trend="+1"
              color="primary"
            />
            <StatsCard
              title="Completados"
              value={stats.completedToday}
              icon={CheckCircle}
              trend="+2"
              color="success"
            />
            <StatsCard
              title="Próximo Tour"
              value={stats.nextTour}
              icon={Clock}
              color="secondary"
            />
            <StatsCard
              title="Mi Puntualidad"
              value={`${stats.punctualityRate}%`}
              icon={TrendingUp}
              trend="+0.5%"
              color="primary"
            />
          </>
        ) : user?.role === 'agency' ? (
          <>
            <StatsCard
              title="Servicios Activos"
              value={stats.activeServices}
              icon={Activity}
              trend="+12%"
              color="primary"
            />
            <StatsCard
              title="Completados Hoy"
              value={stats.completedToday}
              icon={CheckCircle}
              trend="+8%"
              color="success"
            />
            <StatsCard
              title="Ingresos del Día"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend="+23%"
              color="secondary"
            />
            <StatsCard
              title="Puntualidad"
              value={`${stats.punctualityRate}%`}
              icon={TrendingUp}
              trend="+2.5%"
              color="primary"
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Servicios Activos"
              value={stats.activeServices}
              icon={Activity}
              trend="+15%"
              color="primary"
            />
            <StatsCard
              title="Agencias Activas"
              value={stats.totalAgencies}
              icon={Users}
              trend="+2"
              color="success"
            />
            <StatsCard
              title="Guías Registrados"
              value={stats.totalGuides}
              icon={Users}
              trend="+5"
              color="secondary"
            />
            <StatsCard
              title="Salud del Sistema"
              value={`${stats.systemHealth}%`}
              icon={Activity}
              color="primary"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
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

        {/* Right Column - Activity & Quick Actions */}
        <div className="space-y-6">
          <RecentActivity />
          {user?.role !== 'guide' && <QuickActions />}
        </div>
      </div>

      {/* Bottom Section - Alerts or Announcements */}
      <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <AlertCircle className="w-6 h-6" />
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