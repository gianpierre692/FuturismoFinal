import { 
  Plus, Calendar, Users, FileText, MessageSquare, 
  Download, Settings, HelpCircle, Send, Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Acciones diferentes según el rol
  const getActions = () => {
    if (user?.role === 'agency') {
      return [
    {
      id: 1,
      title: 'Nueva Reserva',
      description: 'Crear una nueva reserva de tour',
      icon: Plus,
      color: 'bg-primary-500 hover:bg-primary-600 text-white',
      onClick: () => navigate('/reservations')
    },
    {
      id: 2,
      title: 'Ver Calendario',
      description: 'Consultar disponibilidad',
      icon: Calendar,
      color: 'bg-secondary-500 hover:bg-secondary-600 text-white',
      onClick: () => navigate('/reservations')
    },
    {
      id: 3,
      title: 'Monitoreo en Vivo',
      description: 'Ver tours activos',
      icon: Map,
      color: 'bg-success-500 hover:bg-success-600 text-white',
      onClick: () => navigate('/monitoring')
    },
    {
      id: 4,
      title: 'Enviar Mensaje',
      description: 'Comunicarse con guías',
      icon: MessageSquare,
      color: 'bg-purple-500 hover:bg-purple-600 text-white',
      onClick: () => console.log('Abrir chat')
    },
    {
      id: 5,
      title: 'Generar Reporte',
      description: 'Exportar datos del mes',
      icon: FileText,
      color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
      onClick: () => navigate('/history')
    },
    {
      id: 6,
      title: 'Asignar Guía',
      description: 'Gestionar asignaciones',
      icon: Users,
      color: 'bg-gray-500 hover:bg-gray-600 text-white',
      onClick: () => navigate('/reservations')
    }
  ];
    } else { // admin
      return [
        {
          id: 1,
          title: 'Gestionar Usuarios',
          description: 'Administrar cuentas',
          icon: Users,
          color: 'bg-primary-500 hover:bg-primary-600 text-white',
          onClick: () => navigate('/users')
        },
        {
          id: 2,
          title: 'Configuración',
          description: 'Ajustes del sistema',
          icon: Settings,
          color: 'bg-secondary-500 hover:bg-secondary-600 text-white',
          onClick: () => navigate('/settings')
        },
        {
          id: 3,
          title: 'Monitoreo Global',
          description: 'Ver todos los tours',
          icon: Map,
          color: 'bg-success-500 hover:bg-success-600 text-white',
          onClick: () => navigate('/monitoring')
        },
        {
          id: 4,
          title: 'Reportes Generales',
          description: 'Análisis completo',
          icon: FileText,
          color: 'bg-purple-500 hover:bg-purple-600 text-white',
          onClick: () => navigate('/history')
        },
        {
          id: 5,
          title: 'Comunicados',
          description: 'Enviar avisos masivos',
          icon: MessageSquare,
          color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
          onClick: () => navigate('/chat')
        },
        {
          id: 6,
          title: 'Respaldo',
          description: 'Backup del sistema',
          icon: Download,
          color: 'bg-gray-500 hover:bg-gray-600 text-white',
          onClick: () => console.log('Iniciar backup')
        }
      ];
    }
  };

  const actions = getActions();

  const shortcuts = [
    { key: 'Ctrl + N', action: 'Nueva reserva' },
    { key: 'Ctrl + M', action: 'Abrir mapa' },
    { key: 'Ctrl + /', action: 'Búsqueda rápida' },
    { key: 'Esc', action: 'Cerrar modal' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Grid de acciones */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-4 rounded-lg transition-all transform hover:scale-105 ${action.color} group`}
          >
            <action.icon className="w-8 h-8 mb-2" />
            <h4 className="font-medium text-sm">{action.title}</h4>
            <p className="text-xs opacity-90 mt-1">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Sección de ayuda rápida */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">Atajos de Teclado</h4>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            <HelpCircle className="w-4 h-4" />
            Ver todos
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{shortcut.action}</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Enlaces útiles */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Enlaces Útiles</h4>
        <div className="flex flex-wrap gap-2">
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            Centro de ayuda
          </a>
          <span className="text-gray-300">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            Documentación API
          </a>
          <span className="text-gray-300">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            Términos de servicio
          </a>
          <span className="text-gray-300">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            Contactar soporte
          </a>
        </div>
      </div>

      {/* Notificación de actualización */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Send className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Nueva actualización disponible</p>
            <p className="text-xs text-blue-700 mt-1">
              Versión 2.1.0 incluye mejoras en el sistema de notificaciones
            </p>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2">
              Ver más detalles →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;