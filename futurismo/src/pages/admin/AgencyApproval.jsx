import { useState } from 'react';
import { 
  BuildingOffice2Icon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
  EyeIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InteractiveCard from '../../components/common/InteractiveCard';
import InteractiveButton from '../../components/common/InteractiveButton';
import useNotificationsStore from '../../stores/notificationsStore';
import Logger from '../../utils/logger';

const AgencyApproval = () => {
  const { addNotification } = useNotificationsStore();
  const [activeFilter, setActiveFilter] = useState('pending');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Solicitudes de agencias mock data
  const [agencyRequests, setAgencyRequests] = useState([
    {
      id: 'REQ-001',
      status: 'pending',
      agency: {
        name: 'Viajes Amazónicos SAC',
        ruc: '20123456789',
        legalName: 'Viajes Amazónicos Sociedad Anónima Cerrada',
        address: 'Av. La Marina 2000, San Miguel, Lima',
        phone: '+51 987654321',
        email: 'contacto@viajesamazonicos.com',
        website: 'www.viajesamazonicos.com'
      },
      representative: {
        name: 'María González',
        position: 'Gerente General',
        dni: '12345678',
        email: 'mgonzalez@viajesamazonicos.com',
        phone: '+51 912345678'
      },
      businessInfo: {
        foundedYear: 2015,
        employeeCount: 25,
        monthlyTours: 80,
        mainDestinations: ['Cusco', 'Arequipa', 'Iquitos', 'Puno'],
        tourTypes: ['Cultural', 'Aventura', 'Naturaleza'],
        certifications: ['CALTUR', 'ISO 9001:2015']
      },
      documents: {
        rucDocument: { uploaded: true, verified: true },
        businessLicense: { uploaded: true, verified: true },
        representativeId: { uploaded: true, verified: true },
        taxClearance: { uploaded: true, verified: false },
        bankReference: { uploaded: true, verified: true }
      },
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60000),
      notes: 'Agencia con buena reputación en el mercado. Pendiente verificación de estado tributario.'
    },
    {
      id: 'REQ-002',
      status: 'pending',
      agency: {
        name: 'Peru Adventure Tours',
        ruc: '20987654321',
        legalName: 'Peru Adventure Tours EIRL',
        address: 'Jr. Conquistadores 456, San Isidro, Lima',
        phone: '+51 923456789',
        email: 'info@peruadventure.com',
        website: 'www.peruadventure.com'
      },
      representative: {
        name: 'Carlos Mendoza',
        position: 'Director',
        dni: '87654321',
        email: 'cmendoza@peruadventure.com',
        phone: '+51 998877665'
      },
      businessInfo: {
        foundedYear: 2018,
        employeeCount: 15,
        monthlyTours: 50,
        mainDestinations: ['Machu Picchu', 'Huacachina', 'Paracas'],
        tourTypes: ['Trekking', 'Deportes extremos'],
        certifications: ['CALTUR']
      },
      documents: {
        rucDocument: { uploaded: true, verified: true },
        businessLicense: { uploaded: true, verified: true },
        representativeId: { uploaded: true, verified: true },
        taxClearance: { uploaded: true, verified: true },
        bankReference: { uploaded: false, verified: false }
      },
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60000),
      notes: 'Falta referencia bancaria. Empresa especializada en turismo de aventura.'
    },
    {
      id: 'REQ-003',
      status: 'approved',
      agency: {
        name: 'Inca Trail Expeditions',
        ruc: '20135792468',
        legalName: 'Inca Trail Expeditions SAC',
        address: 'Calle Plateros 123, Cusco',
        phone: '+51 984123456',
        email: 'reservas@incatrail.com',
        website: 'www.incatrailexpeditions.com'
      },
      representative: {
        name: 'Ana Quispe',
        position: 'Gerente Comercial',
        dni: '45678912',
        email: 'aquispe@incatrail.com',
        phone: '+51 974185296'
      },
      businessInfo: {
        foundedYear: 2010,
        employeeCount: 45,
        monthlyTours: 150,
        mainDestinations: ['Camino Inca', 'Salkantay', 'Choquequirao'],
        tourTypes: ['Trekking', 'Cultural', 'Místico'],
        certifications: ['CALTUR', 'TripAdvisor Excellence', 'ISO 14001']
      },
      documents: {
        rucDocument: { uploaded: true, verified: true },
        businessLicense: { uploaded: true, verified: true },
        representativeId: { uploaded: true, verified: true },
        taxClearance: { uploaded: true, verified: true },
        bankReference: { uploaded: true, verified: true }
      },
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60000),
      approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60000),
      approvedBy: 'Admin Sistema',
      notes: 'Documentación completa. Empresa con excelente trayectoria.'
    },
    {
      id: 'REQ-004',
      status: 'rejected',
      agency: {
        name: 'Tours Express Lima',
        ruc: '20112233445',
        legalName: 'Tours Express Lima SAC',
        address: 'Av. Aviación 789, San Borja, Lima',
        phone: '+51 911223344',
        email: 'info@toursexpress.pe'
      },
      representative: {
        name: 'Roberto Díaz',
        position: 'Administrador',
        dni: '11223344',
        email: 'rdiaz@toursexpress.pe',
        phone: '+51 922334455'
      },
      businessInfo: {
        foundedYear: 2022,
        employeeCount: 5,
        monthlyTours: 10,
        mainDestinations: ['Lima'],
        tourTypes: ['City tours'],
        certifications: []
      },
      documents: {
        rucDocument: { uploaded: true, verified: false },
        businessLicense: { uploaded: false, verified: false },
        representativeId: { uploaded: true, verified: true },
        taxClearance: { uploaded: false, verified: false },
        bankReference: { uploaded: false, verified: false }
      },
      submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60000),
      rejectedAt: new Date(Date.now() - 12 * 24 * 60 * 60000),
      rejectedBy: 'Admin Sistema',
      rejectionReason: 'Documentación incompleta. RUC inválido. Sin licencia de funcionamiento.',
      notes: 'Múltiples documentos faltantes o inválidos.'
    }
  ]);

  const stats = {
    total: agencyRequests.length,
    pending: agencyRequests.filter(r => r.status === 'pending').length,
    approved: agencyRequests.filter(r => r.status === 'approved').length,
    rejected: agencyRequests.filter(r => r.status === 'rejected').length,
    documentsToVerify: agencyRequests.filter(r => r.status === 'pending').reduce((count, req) => {
      return count + Object.values(req.documents).filter(doc => doc.uploaded && !doc.verified).length;
    }, 0)
  };

  const filteredRequests = agencyRequests.filter(request => {
    if (activeFilter === 'all') return true;
    return request.status === activeFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  const getDocumentStatus = (doc) => {
    if (!doc.uploaded) return { color: 'text-gray-400', icon: XCircleIcon, text: 'No cargado' };
    if (!doc.verified) return { color: 'text-yellow-600', icon: ClockIcon, text: 'Por verificar' };
    return { color: 'text-green-600', icon: CheckCircleIcon, text: 'Verificado' };
  };

  const handleApprove = (agency) => {
    setSelectedAgency(agency);
    setShowApprovalModal(true);
  };

  const handleReject = (agency) => {
    setSelectedAgency(agency);
    setShowRejectionModal(true);
    setRejectionReason('');
  };

  const confirmApproval = () => {
    setAgencyRequests(prev => prev.map(req => 
      req.id === selectedAgency.id 
        ? {
            ...req,
            status: 'approved',
            approvedAt: new Date(),
            approvedBy: 'Admin Sistema'
          }
        : req
    ));
    
    addNotification({
      type: 'success',
      title: 'Agencia aprobada',
      message: `${selectedAgency.agency.name} ha sido aprobada exitosamente`
    });
    
    setShowApprovalModal(false);
    setSelectedAgency(null);
  };

  const confirmRejection = () => {
    if (!rejectionReason.trim()) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Debes proporcionar una razón para el rechazo'
      });
      return;
    }

    setAgencyRequests(prev => prev.map(req => 
      req.id === selectedAgency.id 
        ? {
            ...req,
            status: 'rejected',
            rejectedAt: new Date(),
            rejectedBy: 'Admin Sistema',
            rejectionReason: rejectionReason
          }
        : req
    ));
    
    addNotification({
      type: 'info',
      title: 'Agencia rechazada',
      message: `${selectedAgency.agency.name} ha sido rechazada`
    });
    
    setShowRejectionModal(false);
    setSelectedAgency(null);
  };

  return (
    <div className="page-container">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Aprobación de Agencias</h1>
                <p className="text-sm text-gray-600">Gestiona las solicitudes de nuevas agencias</p>
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
          <InteractiveCard 
            className="p-4 text-center cursor-pointer" 
            onClick={() => setActiveFilter('all')}
          >
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total solicitudes</p>
          </InteractiveCard>
          <InteractiveCard 
            className="p-4 text-center cursor-pointer border-yellow-200 bg-yellow-50" 
            onClick={() => setActiveFilter('pending')}
          >
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-yellow-700">Pendientes</p>
          </InteractiveCard>
          <InteractiveCard 
            className="p-4 text-center cursor-pointer border-green-200 bg-green-50" 
            onClick={() => setActiveFilter('approved')}
          >
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-green-700">Aprobadas</p>
          </InteractiveCard>
          <InteractiveCard 
            className="p-4 text-center cursor-pointer border-red-200 bg-red-50" 
            onClick={() => setActiveFilter('rejected')}
          >
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-sm text-red-700">Rechazadas</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.documentsToVerify}</p>
            <p className="text-sm text-gray-600">Docs por verificar</p>
          </InteractiveCard>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'approved', 'rejected'].map(filter => (
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
               filter === 'pending' ? 'Pendientes' :
               filter === 'approved' ? 'Aprobadas' : 'Rechazadas'}
            </button>
          ))}
        </div>

        {/* Lista de solicitudes */}
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <InteractiveCard key={request.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <BuildingOffice2Icon className="h-8 w-8 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.agency.name}</h3>
                    <p className="text-sm text-gray-600">RUC: {request.agency.ruc} • {request.agency.legalName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Enviado {format(request.submittedAt, 'dd MMM yyyy', { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Representante Legal</p>
                  <p className="font-medium text-gray-900">{request.representative.name}</p>
                  <p className="text-sm text-gray-600">{request.representative.position}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      {request.representative.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      {request.representative.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Ubicación</p>
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <MapPinIcon className="h-4 w-4 mt-0.5" />
                    {request.agency.address}
                  </p>
                  {request.agency.website && (
                    <p className="text-sm text-blue-600 mt-2">
                      {request.agency.website}
                    </p>
                  )}
                </div>
              </div>

              {/* Información del negocio */}
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Fundada:</span> {request.businessInfo.foundedYear} • 
                  <span className="font-medium ml-2">Empleados:</span> {request.businessInfo.employeeCount} • 
                  <span className="font-medium ml-2">Tours/mes:</span> {request.businessInfo.monthlyTours}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Destinos:</span> {request.businessInfo.mainDestinations.join(', ')}
                </p>
                {request.businessInfo.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {request.businessInfo.certifications.map(cert => (
                      <span key={cert} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Documentos */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Documentación:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.entries(request.documents).map(([docType, doc]) => {
                    const status = getDocumentStatus(doc);
                    return (
                      <div key={docType} className={`flex items-center gap-2 text-sm ${status.color}`}>
                        <status.icon className="h-4 w-4" />
                        <span className="capitalize">{docType.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notas */}
              {request.notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Notas:</strong> {request.notes}
                  </p>
                </div>
              )}

              {/* Razón de rechazo */}
              {request.status === 'rejected' && request.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-900">
                    <strong>Razón de rechazo:</strong> {request.rejectionReason}
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Por {request.rejectedBy} • {format(request.rejectedAt, 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                </div>
              )}

              {/* Acciones */}
              {request.status === 'pending' && (
                <div className="flex flex-wrap gap-2">
                  <InteractiveButton
                    size="sm"
                    variant="secondary"
                    icon={DocumentTextIcon}
                    onClick={() => Logger.debug('Ver documentos', request.id)}
                  >
                    Ver documentos
                  </InteractiveButton>
                  <InteractiveButton
                    size="sm"
                    variant="secondary"
                    icon={PhoneIcon}
                    onClick={() => Logger.debug('Contactar', request.id)}
                  >
                    Contactar
                  </InteractiveButton>
                  <InteractiveButton
                    size="sm"
                    variant="primary"
                    icon={CheckCircleIcon}
                    onClick={() => handleApprove(request)}
                  >
                    Aprobar
                  </InteractiveButton>
                  <InteractiveButton
                    size="sm"
                    variant="secondary"
                    icon={XCircleIcon}
                    onClick={() => handleReject(request)}
                    className="hover:bg-red-50 hover:text-red-700"
                  >
                    Rechazar
                  </InteractiveButton>
                </div>
              )}
            </InteractiveCard>
          ))}
        </div>

        {/* Modal de aprobación */}
        {showApprovalModal && selectedAgency && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold">Aprobar Agencia</h3>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de aprobar a <strong>{selectedAgency.agency.name}</strong>? 
                Esta acción les permitirá acceder al sistema y crear reservas.
              </p>
              <div className="flex justify-end gap-3">
                <InteractiveButton
                  variant="secondary"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Cancelar
                </InteractiveButton>
                <InteractiveButton
                  variant="primary"
                  onClick={confirmApproval}
                >
                  Aprobar agencia
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}

        {/* Modal de rechazo */}
        {showRejectionModal && selectedAgency && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold">Rechazar Agencia</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Vas a rechazar la solicitud de <strong>{selectedAgency.agency.name}</strong>.
              </p>
              
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">Razón del rechazo *</span>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="Explica el motivo del rechazo..."
                />
              </label>
              
              <div className="flex justify-end gap-3">
                <InteractiveButton
                  variant="secondary"
                  onClick={() => setShowRejectionModal(false)}
                >
                  Cancelar
                </InteractiveButton>
                <InteractiveButton
                  variant="primary"
                  onClick={confirmRejection}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Rechazar agencia
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyApproval;