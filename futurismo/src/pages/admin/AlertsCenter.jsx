import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  XCircleIcon,
  BellIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  FunnelIcon,
  MapPinIcon,
  UserGroupIcon,
  PhoneIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InteractiveCard from '../../components/common/InteractiveCard';
import InteractiveButton from '../../components/common/InteractiveButton';
import useNotificationsStore from '../../stores/notificationsStore';
import { useNavigate } from 'react-router-dom';
import Logger from '../../utils/logger';

const AlertsCenter = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationsStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'delay',
      severity: 'high',
      title: 'Tour retrasado - City Tour Lima',
      description: 'El guía Carlos Mendoza reporta 45 minutos de retraso debido al tráfico',
      tourId: 'TOUR-2024-001',
      guideId: 'GUIDE-001',
      guideName: 'Carlos Mendoza',
      time: new Date(Date.now() - 15 * 60000), // hace 15 minutos
      location: 'Centro de Lima',
      tourists: 12,
      status: 'active',
      actions: ['contact_guide', 'notify_agency', 'reassign']
    },
    {
      id: 2,
      type: 'cancellation',
      severity: 'critical',
      title: 'Tour cancelado - Pachacámac',
      description: 'Guía no disponible por emergencia médica',
      tourId: 'TOUR-2024-002',
      guideId: 'GUIDE-003',
      guideName: 'Ana Rodriguez',
      time: new Date(Date.now() - 30 * 60000),
      location: 'Pachacámac',
      tourists: 8,
      status: 'pending_reassignment',
      actions: ['reassign_urgent', 'contact_backup', 'notify_tourists']
    },
    {
      id: 3,
      type: 'emergency',
      severity: 'critical',
      title: 'Emergencia médica - Tour Miraflores',
      description: 'Turista con problemas respiratorios, ambulancia en camino',
      tourId: 'TOUR-2024-003',
      guideId: 'GUIDE-002',
      guideName: 'Miguel Torres',
      time: new Date(Date.now() - 5 * 60000),
      location: 'Parque Kennedy, Miraflores',
      tourists: 15,
      status: 'emergency_active',
      emergencyProtocol: 'MED-001',
      actions: ['view_location', 'contact_emergency', 'activate_protocol']
    },
    {
      id: 4,
      type: 'delay',
      severity: 'medium',
      title: 'Retraso menor - Tour gastronómico',
      description: 'Problemas con reserva en restaurante, 20 minutos de demora',
      tourId: 'TOUR-2024-004',
      guideId: 'GUIDE-005',
      guideName: 'Luis Paredes',
      time: new Date(Date.now() - 45 * 60000),
      location: 'Barranco',
      tourists: 6,
      status: 'resolved',
      actions: ['view_details']
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return alert.status !== 'resolved';
    if (activeFilter === 'critical') return alert.severity === 'critical';
    return alert.type === activeFilter;
  });

  // Estadísticas
  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status !== 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    delays: alerts.filter(a => a.type === 'delay').length,
    cancellations: alerts.filter(a => a.type === 'cancellation').length,
    emergencies: alerts.filter(a => a.type === 'emergency').length
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'delay': return ClockIcon;
      case 'cancellation': return XCircleIcon;
      case 'emergency': return ShieldExclamationIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  const handleAction = (action, alert) => {
    switch (action) {
      case 'contact_guide':
        navigate(`/chat?guide=${alert.guideId}&name=${alert.guideName}`);
        break;
      case 'notify_agency':
        addNotification({
          type: 'info',
          title: 'Notificación enviada',
          message: 'Se ha notificado a la agencia sobre el retraso'
        });
        break;
      case 'reassign':
      case 'reassign_urgent':
        setSelectedAlert(alert);
        setShowReassignModal(true);
        break;
      case 'view_location':
        navigate(`/monitoring?tour=${alert.tourId}`);
        break;
      case 'activate_protocol':
        navigate(`/emergency?protocol=${alert.emergencyProtocol}`);
        break;
      default:
        Logger.debug('Action:', action, alert);
    }
  };

  const markAsResolved = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
    addNotification({
      type: 'success',
      title: 'Alerta resuelta',
      message: 'La alerta ha sido marcada como resuelta'
    });
  };

  return (
    <div className="page-container">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <BellIcon className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Centro de Alertas</h1>
                <p className="text-sm text-gray-600">Gestión de alertas y emergencias en tiempo real</p>
              </div>
            </div>
            <InteractiveButton
              variant="secondary"
              icon={ArrowPathIcon}
              onClick={() => window.location.reload()}
            >
              Actualizar
            </InteractiveButton>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('all')}>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total alertas</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('active')}>
            <p className="text-3xl font-bold text-orange-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Activas</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('critical')}>
            <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
            <p className="text-sm text-gray-600">Críticas</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('delay')}>
            <p className="text-3xl font-bold text-yellow-600">{stats.delays}</p>
            <p className="text-sm text-gray-600">Retrasos</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('cancellation')}>
            <p className="text-3xl font-bold text-purple-600">{stats.cancellations}</p>
            <p className="text-sm text-gray-600">Cancelaciones</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('emergency')}>
            <p className="text-3xl font-bold text-red-700">{stats.emergencies}</p>
            <p className="text-sm text-gray-600">Emergencias</p>
          </InteractiveCard>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'active', 'critical', 'delay', 'cancellation', 'emergency'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'Todas' :
               filter === 'active' ? 'Activas' :
               filter === 'critical' ? 'Críticas' :
               filter === 'delay' ? 'Retrasos' :
               filter === 'cancellation' ? 'Cancelaciones' :
               'Emergencias'}
            </button>
          ))}
        </div>

        {/* Lista de alertas */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <InteractiveCard className="p-8 text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No hay alertas activas en este momento</p>
            </InteractiveCard>
          ) : (
            filteredAlerts.map(alert => {
              const Icon = getTypeIcon(alert.type);
              return (
                <InteractiveCard
                  key={alert.id}
                  className={`p-6 border-2 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{alert.title}</h3>
                          <p className="text-sm mt-1">{alert.description}</p>
                        </div>
                        {alert.status === 'resolved' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Resuelto
                          </span>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {alert.severity === 'critical' ? 'Crítico' :
                             alert.severity === 'high' ? 'Alto' : 'Medio'}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="h-4 w-4 text-gray-400" />
                          <span>{alert.tourists} turistas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span>{format(alert.time, 'HH:mm', { locale: es })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="h-4 w-4 text-gray-400" />
                          <span>{alert.guideName}</span>
                        </div>
                      </div>

                      {alert.status !== 'resolved' && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {alert.actions.map(action => (
                            <InteractiveButton
                              key={action}
                              size="sm"
                              variant={action.includes('urgent') || action.includes('emergency') ? 'danger' : 'secondary'}
                              onClick={() => handleAction(action, alert)}
                            >
                              {action === 'contact_guide' ? 'Contactar Guía' :
                               action === 'notify_agency' ? 'Notificar Agencia' :
                               action === 'reassign' ? 'Reasignar' :
                               action === 'reassign_urgent' ? 'Reasignar Urgente' :
                               action === 'view_location' ? 'Ver Ubicación' :
                               action === 'activate_protocol' ? 'Activar Protocolo' :
                               action === 'contact_backup' ? 'Contactar Backup' :
                               action === 'notify_tourists' ? 'Notificar Turistas' :
                               'Ver Detalles'}
                            </InteractiveButton>
                          ))}
                          {alert.status !== 'resolved' && (
                            <InteractiveButton
                              size="sm"
                              variant="success"
                              onClick={() => markAsResolved(alert.id)}
                            >
                              Marcar como resuelto
                            </InteractiveButton>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </InteractiveCard>
              );
            })
          )}
        </div>

        {/* Modal de reasignación */}
        {showReassignModal && selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Reasignar Tour</h3>
              <p className="text-gray-600 mb-4">
                Selecciona un guía disponible para reasignar el tour {selectedAlert.tourId}
              </p>
              {/* Aquí iría el componente de selección de guías */}
              <div className="flex justify-end gap-3 mt-6">
                <InteractiveButton
                  variant="secondary"
                  onClick={() => setShowReassignModal(false)}
                >
                  Cancelar
                </InteractiveButton>
                <InteractiveButton
                  variant="primary"
                  onClick={() => {
                    setShowReassignModal(false);
                    addNotification({
                      type: 'success',
                      title: 'Tour reasignado',
                      message: 'El tour ha sido reasignado exitosamente'
                    });
                  }}
                >
                  Reasignar
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsCenter;