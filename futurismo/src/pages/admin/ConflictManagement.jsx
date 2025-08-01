import { useState } from 'react';
import { 
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  FunnelIcon,
  CalendarIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InteractiveCard from '../../components/common/InteractiveCard';
import InteractiveButton from '../../components/common/InteractiveButton';
import { useNavigate } from 'react-router-dom';
import useNotificationsStore from '../../stores/notificationsStore';

const ConflictManagement = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationsStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  
  const [conflicts, setConflicts] = useState([
    {
      id: 1,
      type: 'agency_guide',
      status: 'open',
      priority: 'high',
      title: 'Disputa por cancelación de tour',
      description: 'La agencia TravelPeru reclama que el guía Carlos Mendoza canceló el tour sin justificación válida',
      parties: {
        agency: { id: 'AG001', name: 'TravelPeru SAC', contact: 'gerencia@travelperu.com' },
        guide: { id: 'GU001', name: 'Carlos Mendoza', contact: '+51 987654321' },
        tourist: null
      },
      tourInfo: {
        id: 'TOUR-2024-001',
        name: 'City Tour Lima',
        date: '2024-01-15',
        tourists: 12
      },
      timeline: [
        { date: new Date(Date.now() - 2 * 24 * 60 * 60000), action: 'Conflicto reportado por agencia', user: 'TravelPeru' },
        { date: new Date(Date.now() - 24 * 60 * 60000), action: 'Respuesta del guía recibida', user: 'Carlos Mendoza' },
        { date: new Date(Date.now() - 12 * 60 * 60000), action: 'Evidencia presentada', user: 'Admin' }
      ],
      evidence: ['Capturas de WhatsApp', 'Email de cancelación', 'Reporte médico'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000)
    },
    {
      id: 2,
      type: 'tourist_guide',
      status: 'in_progress',
      priority: 'medium',
      title: 'Queja por servicio deficiente',
      description: 'Turista reporta que el guía llegó 1 hora tarde y no conocía bien las rutas',
      parties: {
        agency: { id: 'AG002', name: 'Cusco Adventures', contact: 'info@cuscoadv.com' },
        guide: { id: 'GU002', name: 'Ana Rodriguez', contact: '+51 912345678' },
        tourist: { id: 'TU001', name: 'John Smith', contact: 'jsmith@email.com', country: 'USA' }
      },
      tourInfo: {
        id: 'TOUR-2024-002',
        name: 'Valle Sagrado Full Day',
        date: '2024-01-14',
        tourists: 4
      },
      timeline: [
        { date: new Date(Date.now() - 3 * 24 * 60 * 60000), action: 'Queja recibida del turista', user: 'John Smith' },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60000), action: 'Notificación enviada al guía', user: 'Sistema' },
        { date: new Date(Date.now() - 24 * 60 * 60000), action: 'Descargo del guía', user: 'Ana Rodriguez' },
        { date: new Date(Date.now() - 6 * 60 * 60000), action: 'Mediación iniciada', user: 'Admin' }
      ],
      evidence: ['Reseña en TripAdvisor', 'Emails del turista', 'GPS del tour'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000)
    },
    {
      id: 3,
      type: 'agency_tourist',
      status: 'resolved',
      priority: 'low',
      title: 'Disputa por reembolso',
      description: 'Turista solicita reembolso completo por tour modificado',
      parties: {
        agency: { id: 'AG001', name: 'TravelPeru SAC', contact: 'gerencia@travelperu.com' },
        guide: null,
        tourist: { id: 'TU002', name: 'Maria Garcia', contact: 'mgarcia@email.com', country: 'España' }
      },
      tourInfo: {
        id: 'TOUR-2024-003',
        name: 'Machu Picchu Express',
        date: '2024-01-10',
        tourists: 2
      },
      timeline: [
        { date: new Date(Date.now() - 7 * 24 * 60 * 60000), action: 'Solicitud de reembolso', user: 'Maria Garcia' },
        { date: new Date(Date.now() - 6 * 24 * 60 * 60000), action: 'Revisión por agencia', user: 'TravelPeru' },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60000), action: 'Mediación administrativa', user: 'Admin' },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60000), action: 'Acuerdo alcanzado - 50% reembolso', user: 'Admin' },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60000), action: 'Caso cerrado', user: 'Sistema' }
      ],
      evidence: ['Contrato original', 'Comunicaciones', 'Acuerdo firmado'],
      resolution: {
        type: 'partial_refund',
        details: 'Se acordó un reembolso del 50% del valor del tour',
        date: new Date(Date.now() - 4 * 24 * 60 * 60000)
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60000)
    }
  ]);

  const stats = {
    total: conflicts.length,
    open: conflicts.filter(c => c.status === 'open').length,
    inProgress: conflicts.filter(c => c.status === 'in_progress').length,
    resolved: conflicts.filter(c => c.status === 'resolved').length,
    highPriority: conflicts.filter(c => c.priority === 'high').length
  };

  const filteredConflicts = conflicts.filter(conflict => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'open') return conflict.status === 'open';
    if (activeFilter === 'in_progress') return conflict.status === 'in_progress';
    if (activeFilter === 'resolved') return conflict.status === 'resolved';
    return conflict.type === activeFilter;
  });

  const getConflictTypeLabel = (type) => {
    const labels = {
      'agency_guide': 'Agencia ↔ Guía',
      'tourist_guide': 'Turista ↔ Guía', 
      'agency_tourist': 'Agencia ↔ Turista'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleResolve = (conflict) => {
    setSelectedConflict(conflict);
    setShowResolutionModal(true);
  };

  const submitResolution = (resolutionType, details) => {
    setConflicts(prev => prev.map(c => 
      c.id === selectedConflict.id 
        ? {
            ...c,
            status: 'resolved',
            resolution: {
              type: resolutionType,
              details: details,
              date: new Date()
            },
            timeline: [...c.timeline, {
              date: new Date(),
              action: `Caso resuelto: ${resolutionType}`,
              user: 'Admin'
            }]
          }
        : c
    ));
    
    addNotification({
      type: 'success',
      title: 'Conflicto resuelto',
      message: 'El caso ha sido cerrado exitosamente'
    });
    
    setShowResolutionModal(false);
    setSelectedConflict(null);
  };

  return (
    <div className="page-container">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ScaleIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Conflictos</h1>
                <p className="text-sm text-gray-600">Mediación y resolución de disputas</p>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('all')}>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total casos</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('open')}>
            <p className="text-3xl font-bold text-red-600">{stats.open}</p>
            <p className="text-sm text-gray-600">Abiertos</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('in_progress')}>
            <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-600">En proceso</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center cursor-pointer" onClick={() => setActiveFilter('resolved')}>
            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            <p className="text-sm text-gray-600">Resueltos</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center">
            <p className="text-3xl font-bold text-red-700">{stats.highPriority}</p>
            <p className="text-sm text-gray-600">Alta prioridad</p>
          </InteractiveCard>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'open', 'in_progress', 'resolved', 'agency_guide', 'tourist_guide', 'agency_tourist'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'Todos' :
               filter === 'open' ? 'Abiertos' :
               filter === 'in_progress' ? 'En proceso' :
               filter === 'resolved' ? 'Resueltos' :
               getConflictTypeLabel(filter)}
            </button>
          ))}
        </div>

        {/* Lista de conflictos */}
        <div className="space-y-4">
          {filteredConflicts.map(conflict => (
            <InteractiveCard key={conflict.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <ExclamationTriangleIcon className={`h-8 w-8 ${getPriorityColor(conflict.priority)}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{conflict.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{conflict.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={`px-3 py-1 rounded-full border ${getStatusColor(conflict.status)}`}>
                        {conflict.status === 'open' ? 'Abierto' :
                         conflict.status === 'in_progress' ? 'En proceso' : 'Resuelto'}
                      </span>
                      <span className="text-gray-500">
                        {getConflictTypeLabel(conflict.type)}
                      </span>
                      <span className="text-gray-500">
                        {format(conflict.createdAt, 'dd MMM yyyy', { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-medium ${getPriorityColor(conflict.priority)}`}>
                  {conflict.priority === 'high' ? 'Alta prioridad' :
                   conflict.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>

              {/* Partes involucradas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 rounded-lg p-4">
                {conflict.parties.agency && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Agencia</p>
                    <p className="font-medium text-gray-900">{conflict.parties.agency.name}</p>
                    <p className="text-xs text-gray-600">{conflict.parties.agency.contact}</p>
                  </div>
                )}
                {conflict.parties.guide && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Guía</p>
                    <p className="font-medium text-gray-900">{conflict.parties.guide.name}</p>
                    <p className="text-xs text-gray-600">{conflict.parties.guide.contact}</p>
                  </div>
                )}
                {conflict.parties.tourist && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Turista</p>
                    <p className="font-medium text-gray-900">{conflict.parties.tourist.name}</p>
                    <p className="text-xs text-gray-600">{conflict.parties.tourist.country}</p>
                  </div>
                )}
              </div>

              {/* Información del tour */}
              <div className="mb-4 text-sm">
                <p className="text-gray-600">
                  Tour: <span className="font-medium text-gray-900">{conflict.tourInfo.name}</span>
                  {' • '}
                  Fecha: <span className="font-medium">{format(new Date(conflict.tourInfo.date), 'dd/MM/yyyy')}</span>
                  {' • '}
                  {conflict.tourInfo.tourists} turistas
                </p>
              </div>

              {/* Timeline */}
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Ver historial ({conflict.timeline.length} eventos)
                </summary>
                <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
                  {conflict.timeline.map((event, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900">{event.action}</p>
                      <p className="text-xs text-gray-500">
                        {format(event.date, 'dd/MM HH:mm', { locale: es })} - {event.user}
                      </p>
                    </div>
                  ))}
                </div>
              </details>

              {/* Evidencia */}
              {conflict.evidence.length > 0 && (
                <div className="mb-4 text-sm">
                  <p className="text-gray-600">
                    Evidencia: {conflict.evidence.join(', ')}
                  </p>
                </div>
              )}

              {/* Resolución (si existe) */}
              {conflict.resolution && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Resolución:</p>
                  <p className="text-sm text-green-700">{conflict.resolution.details}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {format(conflict.resolution.date, 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                </div>
              )}

              {/* Acciones */}
              {conflict.status !== 'resolved' && (
                <div className="flex flex-wrap gap-2">
                  <InteractiveButton
                    size="sm"
                    variant="secondary"
                    icon={ChatBubbleLeftRightIcon}
                    onClick={() => navigate(`/chat?conflict=${conflict.id}`)}
                  >
                    Contactar partes
                  </InteractiveButton>
                  <InteractiveButton
                    size="sm"
                    variant="secondary"
                    icon={DocumentTextIcon}
                    onClick={() => console.log('Ver documentos', conflict.id)}
                  >
                    Ver documentos
                  </InteractiveButton>
                  <InteractiveButton
                    size="sm"
                    variant="primary"
                    icon={CheckCircleIcon}
                    onClick={() => handleResolve(conflict)}
                  >
                    Resolver caso
                  </InteractiveButton>
                </div>
              )}
            </InteractiveCard>
          ))}
        </div>

        {/* Modal de resolución */}
        {showResolutionModal && selectedConflict && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Resolver Conflicto</h3>
              <p className="text-gray-600 mb-4">
                {selectedConflict.title}
              </p>
              
              <div className="space-y-3 mb-6">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Tipo de resolución</span>
                  <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm">
                    <option>Acuerdo mutuo</option>
                    <option>Compensación parcial</option>
                    <option>Compensación total</option>
                    <option>Advertencia al responsable</option>
                    <option>Sin responsabilidad</option>
                  </select>
                </label>
                
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Detalles de la resolución</span>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                    placeholder="Describe los términos del acuerdo..."
                  />
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
                <InteractiveButton
                  variant="secondary"
                  onClick={() => setShowResolutionModal(false)}
                >
                  Cancelar
                </InteractiveButton>
                <InteractiveButton
                  variant="primary"
                  onClick={() => submitResolution('acuerdo_mutuo', 'Las partes llegaron a un acuerdo')}
                >
                  Confirmar resolución
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConflictManagement;