import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { serviceRequests, freelanceGuides, updateServiceRequestStatus } = useMarketplaceStore();
  
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [activeFilter, searchQuery, bookings]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      // Simular carga - En producción vendría del API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrar solo las reservas de la agencia actual
      const agencyBookings = serviceRequests.filter(req => req.agencyId === user?.id);
      
      // Enriquecer con datos del guía
      const enrichedBookings = agencyBookings.map(booking => {
        const guide = freelanceGuides.find(g => g.id === booking.guideId);
        return {
          ...booking,
          guide: guide || null
        };
      });
      
      setBookings(enrichedBookings);
      setFilteredBookings(enrichedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Error al cargar las reservas');
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filtro por estado
    if (activeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeFilter);
    }

    // Búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.requestCode.toLowerCase().includes(query) ||
        booking.guide?.fullName.toLowerCase().includes(query) ||
        booking.serviceDetails.tourName?.toLowerCase().includes(query) ||
        booking.serviceDetails.location.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: ExclamationCircleIcon,
        text: 'Pendiente'
      },
      accepted: {
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircleIcon,
        text: 'Aceptado'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: XCircleIcon,
        text: 'Rechazado'
      },
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon,
        text: 'Completado'
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-800',
        icon: XCircleIcon,
        text: 'Cancelado'
      }
    };

    return badges[status] || badges.pending;
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await updateServiceRequestStatus(selectedBooking.id, 'cancelled');
      toast.success('Reserva cancelada correctamente');
      setShowCancelModal(false);
      setSelectedBooking(null);
      loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Error al cancelar la reserva');
    }
  };

  const handleContactGuide = (booking) => {
    if (booking.guide?.phone) {
      window.location.href = `tel:${booking.guide.phone}`;
    }
  };

  const handleViewDetails = (booking) => {
    navigate(`/marketplace/booking/${booking.id}`);
  };

  const filterTabs = [
    { id: 'all', name: 'Todas', count: bookings.length },
    { id: 'pending', name: 'Pendientes', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'accepted', name: 'Aceptadas', count: bookings.filter(b => b.status === 'accepted').length },
    { id: 'completed', name: 'Completadas', count: bookings.filter(b => b.status === 'completed').length }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Componente de tarjeta de reserva
  const BookingCard = ({ booking }) => {
    const statusBadge = getStatusBadge(booking.status);
    const StatusIcon = statusBadge.icon;

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {booking.serviceDetails.tourName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Código: {booking.requestCode}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color} shrink-0`}>
            <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="inline">{statusBadge.text}</span>
          </span>
        </div>

        {/* Guía info */}
        {booking.guide && (
          <div className="flex items-center gap-3 sm:gap-3 mb-3 sm:mb-4 p-3 sm:p-3 bg-gray-50 rounded-lg">
            <img
              src={booking.guide.profile?.avatar || '/api/placeholder/40/40'}
              alt={booking.guide.fullName}
              className="w-10 h-10 sm:w-10 sm:h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{booking.guide.fullName}</p>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <StarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-400 fill-current" />
                <span>{booking.guide.ratings?.overall || 4.9}</span>
              </div>
            </div>
            <button
              onClick={() => handleContactGuide(booking)}
              className="p-2 sm:p-2 text-primary-600 hover:bg-primary-50 rounded-lg min-w-[40px] sm:min-w-auto"
            >
              <PhoneIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Detalles del tour */}
        <div className="space-y-2 sm:space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {new Date(booking.serviceDetails.date).toLocaleDateString('es-PE', {
                weekday: isMobile ? 'short' : 'long',
                year: 'numeric',
                month: isMobile ? 'short' : 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <ClockIcon className="h-4 w-4 shrink-0" />
            <span>{booking.serviceDetails.startTime || booking.serviceDetails.time} • {booking.serviceDetails.duration} horas</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPinIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{booking.serviceDetails.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <UserGroupIcon className="h-4 w-4 shrink-0" />
            <span>{booking.serviceDetails.groupSize || booking.serviceDetails.participants || 0} participantes</span>
          </div>
        </div>

        {/* Precio */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Total</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ${booking.pricing?.finalRate || booking.pricing?.proposedRate || booking.pricing?.totalPrice || 0}
            </p>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 sm:gap-2">
            {booking.status === 'pending' && (
              <button
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowCancelModal(true);
                }}
                className="px-3 sm:px-3 py-2 sm:py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[80px] sm:min-w-auto"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => handleViewDetails(booking)}
              className="px-3 sm:px-3 py-2 sm:py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 min-w-[90px] sm:min-w-auto"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
            Mis Reservas en el Marketplace
          </h1>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 lg:mb-6">
          {/* Búsqueda */}
          <div className="mb-3 sm:mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código, guía o destino..."
                className="w-full pl-8 sm:pl-9 lg:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Tabs de filtro */}
          <div className="flex overflow-x-auto gap-1 sm:gap-2 pb-1">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-sm sm:text-base ${
                  activeFilter === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de reservas */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes reservas {activeFilter !== 'all' ? getStatusBadge(activeFilter).text.toLowerCase() + 's' : ''}
            </h3>
            <p className="text-gray-600 mb-4">
              Explora el marketplace para encontrar guías profesionales
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Buscar Guías
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de cancelación */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Cancelar reserva?
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas cancelar la reserva con {selectedBooking.guide?.fullName}? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                No, mantener
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;