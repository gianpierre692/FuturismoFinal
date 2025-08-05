import { CalendarIcon, UserIcon, CurrencyDollarIcon, MapPinIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ChatBubbleLeftRightIcon, ArrowTrendingUpIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';
import InteractiveButton from '../common/InteractiveButton';
import InteractiveCard from '../common/InteractiveCard';

const RecentActivity = () => {
  // Datos mock de actividad reciente
  const activities = [
    {
      id: 1,
      type: 'reservation',
      title: 'Nueva reserva confirmada',
      description: 'City Tour Lima para 4 personas',
      user: 'María García',
      time: new Date(Date.now() - 600000), // 10 minutos atrás
      icon: CalendarIcon,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Pago recibido',
      description: '$260 - Tour Gastronómico Miraflores',
      user: 'Juan Pérez',
      time: new Date(Date.now() - 1800000), // 30 minutos atrás
      icon: CurrencyDollarIcon,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      id: 3,
      type: 'tour_start',
      title: 'Tour iniciado',
      description: 'Islas Palomino - Guía: Carlos Mendoza',
      user: '12 turistas',
      time: new Date(Date.now() - 3600000), // 1 hora atrás
      icon: MapPinIcon,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    {
      id: 4,
      type: 'review',
      title: 'Nueva reseña 5 estrellas',
      description: 'Excelente servicio, muy recomendado',
      user: 'Ana López',
      time: new Date(Date.now() - 7200000), // 2 horas atrás
      icon: StarIcon,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      id: 5,
      type: 'cancellation',
      title: 'Reserva cancelada',
      description: 'Pachacámac y Barranco - 2 personas',
      user: 'Pedro Martínez',
      time: new Date(Date.now() - 10800000), // 3 horas atrás
      icon: XCircleIcon,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    {
      id: 6,
      type: 'message',
      title: 'Nuevo mensaje de cliente',
      description: '¿Incluye almuerzo el tour?',
      user: 'Luis Rodríguez',
      time: new Date(Date.now() - 14400000), // 4 horas atrás
      icon: ChatBubbleLeftRightIcon,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100'
    },
    {
      id: 7,
      type: 'tour_complete',
      title: 'Tour completado',
      description: 'City Tour Lima - Sin incidentes',
      user: 'Guía: María Sánchez',
      time: new Date(Date.now() - 18000000), // 5 horas atrás
      icon: CheckCircleIcon,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      id: 8,
      type: 'alert',
      title: 'Alerta de capacidad',
      description: 'Tour Machu Picchu casi lleno (90%)',
      user: 'Sistema',
      time: new Date(Date.now() - 21600000), // 6 horas atrás
      icon: ExclamationTriangleIcon,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100'
    }
  ];

  const stats = {
    totalActivities: 142,
    todayActivities: 28,
    pendingActions: 5
  };

  const getActivityIcon = (activity) => {
    const Icon = activity.icon;
    return (
      <div className={`p-2 rounded-full ${activity.iconBg} group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-5 h-5 ${activity.iconColor} group-hover:animate-pulse`} />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Actividad Reciente</h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.todayActivities} actividades hoy
            </p>
          </div>
          
        </div>

        {/* Mini estadísticas */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <InteractiveCard className="text-center p-3 bg-gray-50 group">
            <div className="flex items-center justify-center gap-1 text-green-600 group-hover:scale-105 transition-transform duration-200">
              <ArrowTrendingUpIcon className="w-4 h-4 animate-bounce" />
              <span className="text-lg font-semibold">+15%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">vs. ayer</p>
          </InteractiveCard>
          <InteractiveCard className="text-center p-3 bg-gray-50 group">
            <div className="flex items-center justify-center gap-1 text-blue-600 group-hover:scale-105 transition-transform duration-200">
              <UserGroupIcon className="w-4 h-4 group-hover:animate-pulse" />
              <span className="text-lg font-semibold">84</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">turistas hoy</p>
          </InteractiveCard>
          <InteractiveCard className="text-center p-3 bg-gray-50 group">
            <div className="flex items-center justify-center gap-1 text-purple-600 group-hover:scale-105 transition-transform duration-200">
              <StarIcon className="w-4 h-4 group-hover:animate-spin" />
              <span className="text-lg font-semibold">4.8</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">rating promedio</p>
          </InteractiveCard>
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="relative p-4 hover:bg-gray-50 transition-all duration-150 group cursor-pointer hover:shadow-sm border-r-2 border-transparent hover:border-blue-500">
            <div className="flex gap-4">
              {getActivityIcon(activity)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-gray-800 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5 group-hover:text-gray-700 transition-colors">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4 group-hover:text-gray-600 transition-colors group-hover:scale-105 transform duration-200">
                    {formatters.formatRelativeTime(activity.time)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RecentActivity;