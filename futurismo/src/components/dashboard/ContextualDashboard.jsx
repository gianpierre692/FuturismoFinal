import { useState, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const ContextualDashboard = () => {
  const { user } = useAuthStore();
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  // CONTENIDO CONTEXTUAL SEGÚN HORA Y ROL
  const getContextualContent = () => {
    const hour = new Date().getHours();
    
    if (user?.role === 'agency') {
      if (hour < 10) {
        // Mañana: Focus en tours del día
        return {
          primaryAction: {
            title: "Tours de Hoy",
            value: "8 activos",
            description: "3 saliendo en la próxima hora",
            action: { label: "Ver mapa en vivo", path: "/monitoring" },
            icon: CalendarIcon,
            color: "primary"
          },
          quickActions: [
            { label: "Nueva reserva", icon: PlusIcon, path: "/reservations/new" },
            { label: "Check disponibilidad", icon: UserGroupIcon, path: "/marketplace" }
          ],
          insights: [
            { metric: "Ocupación hoy", value: "85%", trend: "+5%" },
            { metric: "Guías disponibles", value: "12", status: "good" }
          ]
        };
      } else if (hour < 15) {
        // Mediodía: Focus en operaciones
        return {
          primaryAction: {
            title: "Tours en Progreso",
            value: "15 activos",
            description: "Todo marchando sin problemas",
            action: { label: "Monitorear", path: "/monitoring" },
            icon: UserGroupIcon,
            color: "success"
          },
          quickActions: [
            { label: "Chat con guías", icon: ChatIcon, path: "/chat" },
            { label: "Reportar incidencia", icon: ExclamationTriangleIcon, path: "/emergency" }
          ],
          insights: [
            { metric: "Puntualidad hoy", value: "96%", trend: "+2%" },
            { metric: "Satisfacción", value: "4.8", status: "excellent" }
          ]
        };
      } else {
        // Tarde: Focus en cierre y planificación
        return {
          primaryAction: {
            title: "Resumen del Día",
            value: "$12,450",
            description: "23 tours completados",
            action: { label: "Ver reporte completo", path: "/reports" },
            icon: ChartBarIcon,
            color: "secondary"
          },
          quickActions: [
            { label: "Planificar mañana", icon: CalendarIcon, path: "/calendar" },
            { label: "Exportar reporte", icon: DocumentIcon, action: "export" }
          ],
          insights: [
            { metric: "Tours mañana", value: "28", status: "warning", note: "3 sin guía" },
            { metric: "Ingresos mes", value: "$89.5k", trend: "+12%" }
          ]
        };
      }
    }
    
    // Similar para otros roles...
    return {};
  };

  const contextualData = getContextualContent();
  const { primaryAction, quickActions, insights } = contextualData;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HERO SECTION - Una métrica/acción principal */}
      <div className={`bg-${primaryAction.color}-50 border border-${primaryAction.color}-200 rounded-xl p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <primaryAction.icon className={`w-8 h-8 text-${primaryAction.color}-600`} />
              <h2 className="text-2xl font-bold text-gray-900">{primaryAction.title}</h2>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{primaryAction.value}</p>
            <p className="text-gray-600 mb-4">{primaryAction.description}</p>
            <a 
              href={primaryAction.action.path}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-${primaryAction.color} text-white rounded-lg hover:bg-${primaryAction.color}-dark transition-colors`}
            >
              {primaryAction.action.label}
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
          
          {/* Quick Actions - Máximo 2-3 */}
          <div className="flex gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.action ? action.action() : window.location.href = action.path}
                className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                title={action.label}
              >
                <action.icon className="w-5 h-5 text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INSIGHTS - Métricas secundarias en una línea */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">{insight.metric}</p>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">{insight.value}</p>
              {insight.trend && (
                <span className={`text-sm font-medium ${
                  insight.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {insight.trend}
                </span>
              )}
              {insight.status && (
                <StatusBadge status={insight.status} />
              )}
            </div>
            {insight.note && (
              <p className="text-xs text-amber-600 mt-1">{insight.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* PROGRESSIVE DISCLOSURE - Mostrar más si lo necesitan */}
      {!showAllMetrics && (
        <button
          onClick={() => setShowAllMetrics(true)}
          className="w-full py-3 text-center text-sm text-gray-600 hover:text-gray-900 border-t border-gray-100"
        >
          Ver más métricas y detalles ↓
        </button>
      )}

      {showAllMetrics && (
        <div className="space-y-6 animate-fadeIn">
          {/* Aquí van el resto de gráficos, tablas, etc. */}
          <DetailedMetrics />
          <UpcomingTasks />
        </div>
      )}
    </div>
  );
};

// Componente de estado visual
const StatusBadge = ({ status }) => {
  const colors = {
    good: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    critical: 'bg-red-100 text-red-800',
    excellent: 'bg-primary-100 text-primary-800'
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
};

export default ContextualDashboard;