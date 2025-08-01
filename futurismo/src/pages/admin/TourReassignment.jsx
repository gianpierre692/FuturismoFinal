import { useState, useEffect } from 'react';
import { 
  XCircleIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  PhoneIcon,
  StarIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import InteractiveCard from '../../components/common/InteractiveCard';
import InteractiveButton from '../../components/common/InteractiveButton';
import useNotificationsStore from '../../stores/notificationsStore';
import useGuidesStore from '../../stores/guidesStore';

const TourReassignment = () => {
  const { addNotification } = useNotificationsStore();
  const { guides } = useGuidesStore();
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [expandedTour, setExpandedTour] = useState(null);
  
  // Tours cancelados mock data
  const [cancelledTours, setCancelledTours] = useState([
    {
      id: 'TOUR-CANC-001',
      name: 'City Tour Lima - Grupo Premium',
      originalGuide: {
        id: 'GU001',
        name: 'Carlos Mendoza',
        reason: 'Emergencia médica'
      },
      tourInfo: {
        date: new Date(Date.now() + 24 * 60 * 60000), // Mañana
        time: '09:00',
        duration: 4,
        meetingPoint: 'Plaza de Armas',
        touristCount: 12,
        touristNames: ['John Smith', 'Mary Johnson', 'Robert Brown'],
        language: 'Inglés',
        specialRequirements: 'Un turista con movilidad reducida'
      },
      agency: {
        id: 'AG001',
        name: 'TravelPeru SAC',
        contact: 'Maria Rodriguez',
        phone: '+51 987654321'
      },
      status: 'urgent',
      cancelledAt: new Date(Date.now() - 2 * 60 * 60000),
      potentialRevenueLoss: 850
    },
    {
      id: 'TOUR-CANC-002',
      name: 'Valle Sagrado Full Day',
      originalGuide: {
        id: 'GU002',
        name: 'Ana Rodriguez',
        reason: 'Problemas personales'
      },
      tourInfo: {
        date: new Date(Date.now() + 48 * 60 * 60000), // Pasado mañana
        time: '06:00',
        duration: 10,
        meetingPoint: 'Hotel del turista',
        touristCount: 8,
        touristNames: ['Pierre Dubois', 'Marie Claire', 'Jean Paul'],
        language: 'Francés',
        specialRequirements: 'Vegetarianos'
      },
      agency: {
        id: 'AG002',
        name: 'Cusco Adventures',
        contact: 'Pedro Sanchez',
        phone: '+51 912345678'
      },
      status: 'medium',
      cancelledAt: new Date(Date.now() - 12 * 60 * 60000),
      potentialRevenueLoss: 1200
    },
    {
      id: 'TOUR-CANC-003',
      name: 'Machu Picchu Express',
      originalGuide: {
        id: 'GU003',
        name: 'Roberto Flores',
        reason: 'Conflicto de horarios'
      },
      tourInfo: {
        date: new Date(Date.now() + 72 * 60 * 60000), // 3 días
        time: '05:30',
        duration: 12,
        meetingPoint: 'Estación de tren Poroy',
        touristCount: 20,
        touristNames: ['grupo de brasileños'],
        language: 'Portugués',
        specialRequirements: 'Grupo grande, requiere guía experimentado'
      },
      agency: {
        id: 'AG003',
        name: 'Inca Trail Tours',
        contact: 'Luis Gutierrez',
        phone: '+51 998877665'
      },
      status: 'low',
      cancelledAt: new Date(Date.now() - 24 * 60 * 60000),
      potentialRevenueLoss: 2500
    }
  ]);

  // Obtener guías disponibles para una fecha y tour específico
  const getAvailableGuides = (tour) => {
    return guides.filter(guide => {
      // Verificar disponibilidad básica
      if (guide.todayStatus !== 'active') return false;
      
      // Verificar idiomas
      const requiredLang = tour.tourInfo.language.toLowerCase();
      const guideLangs = guide.languages?.map(l => l.toLowerCase()) || [];
      if (!guideLangs.includes(requiredLang) && !guideLangs.includes('inglés')) return false;
      
      // Verificar especialización si es necesario
      if (tour.name.includes('Machu Picchu') && !guide.specializations?.includes('Trekking')) return false;
      
      return true;
    }).map(guide => ({
      ...guide,
      matchScore: calculateMatchScore(guide, tour)
    })).sort((a, b) => b.matchScore - a.matchScore);
  };

  // Calcular puntaje de coincidencia guía-tour
  const calculateMatchScore = (guide, tour) => {
    let score = 0;
    
    // Idioma exacto
    const requiredLang = tour.tourInfo.language.toLowerCase();
    const guideLangs = guide.languages?.map(l => l.toLowerCase()) || [];
    if (guideLangs.includes(requiredLang)) score += 30;
    
    // Rating del guía
    score += (guide.rating || 0) * 10;
    
    // Experiencia (años)
    score += Math.min(guide.experienceYears || 0, 10) * 2;
    
    // Especialización relevante
    if (tour.name.includes('City Tour') && guide.specializations?.includes('Historia')) score += 20;
    if (tour.name.includes('Valle') && guide.specializations?.includes('Naturaleza')) score += 20;
    if (tour.name.includes('Machu') && guide.specializations?.includes('Trekking')) score += 20;
    
    return score;
  };

  const handleReassign = (tour) => {
    setSelectedTour(tour);
    setShowReassignModal(true);
  };

  const confirmReassignment = () => {
    if (!selectedTour || !selectedGuide) return;
    
    // Actualizar el tour
    setCancelledTours(prev => prev.filter(t => t.id !== selectedTour.id));
    
    // Notificar
    addNotification({
      type: 'success',
      title: 'Tour reasignado exitosamente',
      message: `${selectedTour.name} ha sido asignado a ${selectedGuide.name}`
    });
    
    // Cerrar modal
    setShowReassignModal(false);
    setSelectedTour(null);
    setSelectedGuide(null);
  };

  const getUrgencyColor = (status) => {
    switch (status) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyLabel = (status) => {
    switch (status) {
      case 'urgent': return '¡Urgente! < 24h';
      case 'medium': return 'Prioridad media';
      case 'low': return 'Baja prioridad';
      default: return status;
    }
  };

  const filteredTours = cancelledTours.filter(tour => {
    if (urgencyFilter === 'all') return true;
    return tour.status === urgencyFilter;
  });

  const stats = {
    total: cancelledTours.length,
    urgent: cancelledTours.filter(t => t.status === 'urgent').length,
    medium: cancelledTours.filter(t => t.status === 'medium').length,
    low: cancelledTours.filter(t => t.status === 'low').length,
    potentialLoss: cancelledTours.reduce((sum, t) => sum + t.potentialRevenueLoss, 0)
  };

  return (
    <div className="page-container">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reasignar Tours Cancelados</h1>
                <p className="text-sm text-gray-600">Gestiona tours sin guía asignado</p>
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
            onClick={() => setUrgencyFilter('all')}
          >
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Tours cancelados</p>
          </InteractiveCard>
          <InteractiveCard 
            className="p-4 text-center cursor-pointer border-red-200 bg-red-50" 
            onClick={() => setUrgencyFilter('urgent')}
          >
            <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
            <p className="text-sm text-red-700">Urgentes (&lt;24h)</p>
          </InteractiveCard>
          <InteractiveCard 
            className="p-4 text-center cursor-pointer border-yellow-200 bg-yellow-50" 
            onClick={() => setUrgencyFilter('medium')}
          >
            <p className="text-3xl font-bold text-yellow-600">{stats.medium}</p>
            <p className="text-sm text-yellow-700">Prioridad media</p>
          </InteractiveCard>
          <InteractiveCard 
            className="p-4 text-center cursor-pointer border-green-200 bg-green-50" 
            onClick={() => setUrgencyFilter('low')}
          >
            <p className="text-3xl font-bold text-green-600">{stats.low}</p>
            <p className="text-sm text-green-700">Baja prioridad</p>
          </InteractiveCard>
          <InteractiveCard className="p-4 text-center">
            <p className="text-3xl font-bold text-red-700">S/. {stats.potentialLoss.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Pérdida potencial</p>
          </InteractiveCard>
        </div>

        {/* Lista de tours cancelados */}
        <div className="space-y-4">
          {filteredTours.map(tour => (
            <InteractiveCard key={tour.id} className="p-6">
              {/* Header del tour */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <ExclamationTriangleIcon className={`h-8 w-8 ${tour.status === 'urgent' ? 'text-red-600' : tour.status === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{tour.name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(tour.status)}`}>
                        {getUrgencyLabel(tour.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {format(tour.tourInfo.date, 'dd MMM yyyy', { locale: es })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {tour.tourInfo.time} ({tour.tourInfo.duration}h)
                      </span>
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="h-4 w-4" />
                        {tour.tourInfo.touristCount} turistas
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        {tour.tourInfo.meetingPoint}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedTour(expandedTour === tour.id ? null : tour.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedTour === tour.id ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Información del guía original */}
              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-900">
                  <span className="font-medium">Guía original:</span> {tour.originalGuide.name}
                  <span className="text-red-700"> • Motivo: {tour.originalGuide.reason}</span>
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Cancelado hace {Math.round((Date.now() - tour.cancelledAt) / 3600000)} horas
                </p>
              </div>

              {/* Detalles expandidos */}
              {expandedTour === tour.id && (
                <div className="mb-4 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Agencia</p>
                    <p className="font-medium text-gray-900">{tour.agency.name}</p>
                    <p className="text-sm text-gray-600">{tour.agency.contact} • {tour.agency.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Requisitos especiales</p>
                    <p className="text-sm text-gray-700">{tour.tourInfo.specialRequirements}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Idioma requerido</p>
                    <p className="text-sm font-medium text-gray-900">{tour.tourInfo.language}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Turistas</p>
                    <p className="text-sm text-gray-700">{tour.tourInfo.touristNames.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-wrap gap-2">
                <InteractiveButton
                  variant="primary"
                  icon={UserIcon}
                  onClick={() => handleReassign(tour)}
                >
                  Reasignar guía
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  icon={PhoneIcon}
                  onClick={() => console.log('Contactar agencia', tour.agency)}
                >
                  Contactar agencia
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  icon={XCircleIcon}
                  onClick={() => console.log('Cancelar definitivamente', tour.id)}
                  className="hover:bg-red-50 hover:text-red-700"
                >
                  Cancelar definitivamente
                </InteractiveButton>
              </div>
            </InteractiveCard>
          ))}
        </div>

        {/* Modal de reasignación */}
        {showReassignModal && selectedTour && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Reasignar Tour</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedTour.name}</p>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Guías disponibles ordenados por compatibilidad:</p>
                </div>
                
                <div className="space-y-3">
                  {getAvailableGuides(selectedTour).map(guide => (
                    <div
                      key={guide.id}
                      onClick={() => setSelectedGuide(guide)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedGuide?.id === guide.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            selectedGuide?.id === guide.id ? 'bg-blue-600' : 'bg-gray-400'
                          }`}>
                            <UserIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{guide.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                {guide.rating}
                              </span>
                              <span>{guide.experienceYears} años exp.</span>
                              <span>{guide.languages?.join(', ')}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Especialización: {guide.specializations?.join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            guide.matchScore >= 70 ? 'text-green-600' :
                            guide.matchScore >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {guide.matchScore}% compatible
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {guide.tourAssignments || 0} tours hoy
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t flex justify-end gap-3">
                <InteractiveButton
                  variant="secondary"
                  onClick={() => {
                    setShowReassignModal(false);
                    setSelectedGuide(null);
                  }}
                >
                  Cancelar
                </InteractiveButton>
                <InteractiveButton
                  variant="primary"
                  disabled={!selectedGuide}
                  onClick={confirmReassignment}
                >
                  Confirmar reasignación
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourReassignment;