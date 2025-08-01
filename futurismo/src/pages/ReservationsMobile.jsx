import { useState } from 'react';
import { 
  PlusIcon, 
  CalendarIcon, 
  ListBulletIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import ReservationWizard from '../components/reservations/ReservationWizard';
import ReservationDetail from '../components/reservations/ReservationDetail';

const ReservationsMobile = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('list');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data - en producción vendría del store
  const mockReservations = [
    {
      id: 1,
      code: 'RES-2024-001',
      tourName: 'Valle Sagrado Premium',
      date: '2024-02-15',
      time: '08:00',
      tourists: 12,
      status: 'confirmed',
      agency: 'Adventure Peru',
      guide: 'Carlos Mendoza',
      totalPrice: 1200
    },
    {
      id: 2,
      code: 'RES-2024-002',
      tourName: 'City Tour Cusco',
      date: '2024-02-15',
      time: '14:00',
      tourists: 8,
      status: 'pending',
      agency: 'Cusco Explorer',
      guide: 'Por asignar',
      totalPrice: 400
    },
    {
      id: 3,
      code: 'RES-2024-003',
      tourName: 'Machu Picchu Full Day',
      date: '2024-02-16',
      time: '05:00',
      tourists: 20,
      status: 'confirmed',
      agency: 'Inka Trail Tours',
      guide: 'Ana García',
      totalPrice: 2800
    },
    {
      id: 4,
      code: 'RES-2024-004',
      tourName: 'Montaña de 7 Colores',
      date: '2024-02-17',
      time: '04:30',
      tourists: 15,
      status: 'cancelled',
      agency: 'Rainbow Tours',
      guide: 'Luis Torres',
      totalPrice: 750,
      cancellationReason: 'Condiciones climáticas'
    }
  ];

  const filters = [
    { id: 'all', label: 'Todas', count: mockReservations.length },
    { id: 'confirmed', label: 'Confirmadas', count: 2 },
    { id: 'pending', label: 'Pendientes', count: 1 },
    { id: 'cancelled', label: 'Canceladas', count: 1 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const filteredReservations = mockReservations.filter(res => {
    if (activeFilter !== 'all' && res.status !== activeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return res.code.toLowerCase().includes(query) ||
             res.tourName.toLowerCase().includes(query) ||
             res.agency.toLowerCase().includes(query) ||
             res.guide.toLowerCase().includes(query);
    }
    return true;
  });

  // Vista del wizard
  if (showWizard) {
    return (
      <div className="min-h-screen bg-white">
        <ReservationWizard onClose={() => setShowWizard(false)} />
      </div>
    );
  }

  // Vista de detalle
  if (selectedReservation) {
    return (
      <div className="min-h-screen bg-white pb-16">
        <div className="bg-white shadow-sm sticky top-14 z-20">
          <div className="px-4 py-3 flex items-center">
            <button
              onClick={() => setSelectedReservation(null)}
              className="flex items-center gap-2 text-gray-600"
            >
              <ChevronRightIcon className="w-5 h-5 rotate-180" />
              <span className="font-medium">Volver</span>
            </button>
          </div>
        </div>
        <ReservationDetail 
          reservationId={selectedReservation.id} 
          onClose={() => setSelectedReservation(null)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-white">
      {/* Header con búsqueda y botón nuevo */}
      <div className="bg-white shadow-sm z-20 flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código, tour, agencia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={() => setShowWizard(true)}
              className="flex-shrink-0 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              aria-label="Nueva reserva"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtros Responsive */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
                  activeFilter === filter.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs opacity-75">{filter.label}</span>
                  <span className="text-lg font-bold">{filter.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de reservaciones */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Resumen del día */}
        <div className="bg-primary-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-primary-900 mb-2">Hoy, 15 de febrero</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-primary-700">Tours programados</p>
              <p className="text-2xl font-bold text-primary-900">2</p>
            </div>
            <div>
              <p className="text-primary-700">Total turistas</p>
              <p className="text-2xl font-bold text-primary-900">20</p>
            </div>
          </div>
        </div>

        {/* Lista de reservaciones */}
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron reservaciones</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              onClick={() => setSelectedReservation(reservation)}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{reservation.code}</p>
                  <h3 className="font-semibold text-gray-900">{reservation.tourName}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                  {getStatusLabel(reservation.status)}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(reservation.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" />
                    <span>{reservation.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{reservation.tourists}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Agencia: {reservation.agency}</span>
                  <span className="font-semibold text-gray-900">${reservation.totalPrice}</span>
                </div>
              </div>

              {/* Guía asignado o razón de cancelación */}
              {reservation.status === 'cancelled' && reservation.cancellationReason ? (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-red-600">
                    Motivo: {reservation.cancellationReason}
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Guía: <span className={reservation.guide === 'Por asignar' ? 'text-yellow-600' : 'text-gray-900'}>
                      {reservation.guide}
                    </span>
                  </span>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ReservationsMobile;