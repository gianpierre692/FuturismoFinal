import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const DashboardMobile = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => setLoading(false), 500);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  // Datos según el rol
  const getStats = () => {
    if (user?.role === 'guide') {
      return [
        { icon: CalendarIcon, label: 'Tours Hoy', value: '3', color: 'bg-blue-500' },
        { icon: CheckCircleIcon, label: 'Completados', value: '2', color: 'bg-green-500' },
        { icon: ClockIcon, label: 'Próximo', value: '14:30', color: 'bg-orange-500' },
        { icon: ArrowTrendingUpIcon, label: 'Puntualidad', value: '98.5%', color: 'bg-purple-500' }
      ];
    } else if (user?.role === 'agency') {
      return [
        { icon: CalendarIcon, label: 'Reservas', value: '127', trend: '+18%', color: 'bg-blue-500' },
        { icon: UserGroupIcon, label: 'Turistas', value: '342', trend: '+15%', color: 'bg-green-500' },
        { icon: CurrencyDollarIcon, label: 'Ingresos', value: '$89.5k', trend: '+23%', color: 'bg-orange-500' },
        { icon: ArrowTrendingUpIcon, label: 'Puntualidad', value: '94.5%', trend: '+2.5%', color: 'bg-purple-500' }
      ];
    }
    // Admin
    return [
      { icon: CalendarIcon, label: 'Total Reservas', value: '1,847', trend: '+25%', color: 'bg-blue-500' },
      { icon: UserGroupIcon, label: 'Total Turistas', value: '4,532', trend: '+22%', color: 'bg-green-500' },
      { icon: CurrencyDollarIcon, label: 'Ingresos', value: '$285k', trend: '+28%', color: 'bg-orange-500' },
      { icon: ChartBarIcon, label: 'Sistema', value: '99.9%', color: 'bg-purple-500' }
    ];
  };

  const stats = getStats();

  // Actividades recientes
  const getRecentActivities = () => {
    if (user?.role === 'guide') {
      return [
        { time: '08:00', title: 'City Tour Cusco', status: 'completed', tourists: 12 },
        { time: '11:00', title: 'Valle Sagrado', status: 'in-progress', tourists: 8 },
        { time: '14:30', title: 'Machu Picchu', status: 'pending', tourists: 15 }
      ];
    }
    return [
      { time: '09:15', title: 'Nueva reserva #1234', status: 'new', amount: '$450' },
      { time: '10:30', title: 'Pago confirmado', status: 'payment', amount: '$1,200' },
      { time: '11:45', title: 'Tour completado', status: 'completed', guide: 'María G.' }
    ];
  };

  const activities = getRecentActivities();

  if (loading) {
    return <LoadingSpinner fullScreen text={t('dashboard.loading')} />;
  }

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-gray-50 overflow-y-auto">
      {/* Header con saludo */}
      <div className="bg-gradient-to-r from-primary to-primary-600 px-4 pt-4 pb-8">
        <h1 className="text-xl font-bold text-white">
          {getGreeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-primary-100 text-sm mt-1">
          {new Date().toLocaleDateString('es', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </p>
      </div>

      {/* Stats Cards - Grid 2x2 */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                {stat.trend && (
                  <span className="text-xs font-medium text-green-600">
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {user?.role === 'guide' ? 'Mi Agenda Hoy' : 'Actividad Reciente'}
        </h2>
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      activity.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      activity.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                      activity.status === 'new' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {activity.status === 'completed' ? 'Completado' :
                       activity.status === 'in-progress' ? 'En progreso' :
                       activity.status === 'pending' ? 'Pendiente' :
                       activity.status === 'new' ? 'Nuevo' : 'Pago'}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.tourists && `${activity.tourists} turistas`}
                    {activity.amount && activity.amount}
                    {activity.guide && `Guía: ${activity.guide}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          {user?.role === 'guide' ? (
            <>
              <button className="bg-primary text-white rounded-lg p-4 text-center">
                <CalendarIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Ver Agenda</span>
              </button>
              <button className="bg-green-500 text-white rounded-lg p-4 text-center">
                <CheckCircleIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Check-in</span>
              </button>
            </>
          ) : (
            <>
              <button className="bg-primary text-white rounded-lg p-4 text-center">
                <CalendarIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Nueva Reserva</span>
              </button>
              <button className="bg-purple-500 text-white rounded-lg p-4 text-center">
                <ChartBarIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Ver Reportes</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMobile;