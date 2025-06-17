import { 
  Calendar, User, DollarSign, MapPin, Clock, 
  CheckCircle, XCircle, AlertCircle, MessageSquare,
  TrendingUp, Users, Star
} from 'lucide-react';
import { formatters } from '../../utils/formatters';

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
      icon: Calendar,
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
      icon: DollarSign,
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
      icon: MapPin,
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
      icon: Star,
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
      icon: XCircle,
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
      icon: MessageSquare,
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
      icon: CheckCircle,
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
      icon: AlertCircle,
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
      <div className={`p-2 rounded-full ${activity.iconBg}`}>
        <Icon className={`w-5 h-5 ${activity.iconColor}`} />
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
          
          {stats.pendingActions > 0 && (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.pendingActions} acciones pendientes
            </div>
          )}
        </div>

        {/* Mini estadísticas */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-lg font-semibold">+15%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">vs. ayer</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Users className="w-4 h-4" />
              <span className="text-lg font-semibold">84</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">turistas hoy</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-purple-600">
              <Star className="w-4 h-4" />
              <span className="text-lg font-semibold">4.8</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">rating promedio</p>
          </div>
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
              {getActivityIcon(activity)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatters.formatRelativeTime(activity.time)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button className="w-full text-sm font-medium text-primary-600 hover:text-primary-700">
          Ver toda la actividad →
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;