import { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import useAuthStore from '../stores/authStore';

const HistoryMobile = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - En producción vendría del store
  const assignedTrips = [
    {
      id: 'TRIP-001',
      tourName: 'City Tour Lima Centro',
      client: {
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '+51 987 654 321'
      },
      agency: 'Viajes El Dorado SAC',
      date: '2024-01-15',
      time: '08:00',
      duration: '4 horas',
      tourists: 4,
      destination: 'Centro de Lima',
      status: 'completed',
      totalAmount: 1080,
      assignment: {
        guide: {
          id: 'G001',
          name: 'Carlos Mendez',
          phone: '+51 987 654 321'
        },
        driver: {
          id: 'D001',
          name: 'Luis García',
          phone: '+51 976 543 210'
        },
        vehicle: {
          brand: 'Toyota',
          model: 'Hiace',
          plate: 'ABC-123'
        }
      },
      feedback: {
        rating: 4.8,
        comment: 'Excelente servicio, muy profesional'
      }
    },
    {
      id: 'TRIP-002',
      tourName: 'Tour Miraflores y Barranco',
      client: {
        name: 'María García',
        email: 'maria@email.com'
      },
      agency: 'Turismo Aventura S.A.C.',
      date: '2024-01-14',
      time: '09:00',
      duration: '3 horas',
      tourists: 2,
      destination: 'Miraflores',
      status: 'completed',
      totalAmount: 680,
      assignment: {
        guide: {
          name: 'Ana López'
        },
        driver: {
          name: 'Pedro Ruiz'
        }
      },
      feedback: {
        rating: 4.9,
        comment: 'Tour fantástico, guía muy conocedor'
      }
    },
    {
      id: 'TRIP-003',
      tourName: 'Coffee Tour',
      client: {
        name: 'Carlos Rodríguez'
      },
      agency: 'Reserva Directa',
      date: '2024-01-13',
      time: '07:30',
      duration: '6 horas',
      tourists: 6,
      destination: 'Jardín',
      status: 'completed',
      totalAmount: 600,
      assignment: {
        guide: {
          name: 'Miguel Torres'
        }
      },
      feedback: {
        rating: 5.0,
        comment: 'Experiencia increíble, muy recomendado'
      }
    },
    {
      id: 'TRIP-004',
      tourName: 'Nature Hike',
      client: {
        name: 'Laura Martínez'
      },
      agency: 'Eco Viajes',
      date: '2024-01-12',
      time: '06:00',
      duration: '8 horas',
      tourists: 3,
      destination: 'El Retiro',
      status: 'cancelled',
      totalAmount: 300,
      cancellationReason: 'Mal clima'
    }
  ];

  const filteredTrips = useMemo(() => {
    let filtered = assignedTrips;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.tourName.toLowerCase().includes(searchLower) ||
        trip.client.name.toLowerCase().includes(searchLower) ||
        trip.destination.toLowerCase().includes(searchLower) ||
        trip.id.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(today.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(trip => new Date(trip.date) >= filterDate);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [searchTerm, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const total = filteredTrips.length;
    const completed = filteredTrips.filter(t => t.status === 'completed').length;
    const cancelled = filteredTrips.filter(t => t.status === 'cancelled').length;
    const totalRevenue = filteredTrips
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.totalAmount, 0);
    const avgRating = filteredTrips
      .filter(t => t.feedback?.rating)
      .reduce((sum, t, _, arr) => sum + t.feedback.rating / arr.length, 0);

    return { total, completed, cancelled, totalRevenue, avgRating };
  }, [filteredTrips]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircleIcon;
      case 'cancelled': return ExclamationTriangleIcon;
      case 'in_progress': return ClockIcon;
      default: return ClockIcon;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      case 'in_progress': return 'En Progreso';
      default: return status;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolid key={i} className="w-3 h-3 text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} className="w-3 h-3 text-yellow-500" />);
      } else {
        stars.push(<StarIcon key={i} className="w-3 h-3 text-gray-300" />);
      }
    }
    return stars;
  };

  // Vista de detalle
  if (selectedTrip) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm sticky top-14 z-20">
          <div className="px-4 py-3 flex items-center">
            <button
              onClick={() => setSelectedTrip(null)}
              className="flex items-center gap-2 text-gray-600"
            >
              <ChevronRightIcon className="w-5 h-5 rotate-180" />
              <span className="font-medium">Volver</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Info principal */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">{selectedTrip.id}</p>
                <h2 className="text-xl font-semibold text-gray-900">{selectedTrip.tourName}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedTrip.destination}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTrip.status)}`}>
                {getStatusLabel(selectedTrip.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Fecha</p>
                <p className="font-medium">{formatDate(selectedTrip.date)}</p>
              </div>
              <div>
                <p className="text-gray-500">Hora</p>
                <p className="font-medium">{selectedTrip.time}</p>
              </div>
              <div>
                <p className="text-gray-500">Duración</p>
                <p className="font-medium">{selectedTrip.duration}</p>
              </div>
              <div>
                <p className="text-gray-500">Turistas</p>
                <p className="font-medium">{selectedTrip.tourists}</p>
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Cliente</h3>
            <div className="space-y-2">
              <p className="text-sm"><span className="text-gray-500">Nombre:</span> {selectedTrip.client.name}</p>
              {selectedTrip.client.email && (
                <p className="text-sm"><span className="text-gray-500">Email:</span> {selectedTrip.client.email}</p>
              )}
              {selectedTrip.client.phone && (
                <p className="text-sm"><span className="text-gray-500">Teléfono:</span> {selectedTrip.client.phone}</p>
              )}
              <p className="text-sm"><span className="text-gray-500">Agencia:</span> {selectedTrip.agency}</p>
            </div>
          </div>

          {/* Asignación */}
          {selectedTrip.assignment && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Asignación</h3>
              <div className="space-y-3">
                {selectedTrip.assignment.guide && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedTrip.assignment.guide.name}</p>
                      <p className="text-xs text-gray-500">Guía</p>
                    </div>
                  </div>
                )}
                {selectedTrip.assignment.driver && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedTrip.assignment.driver.name}</p>
                      <p className="text-xs text-gray-500">Conductor</p>
                    </div>
                  </div>
                )}
                {selectedTrip.assignment.vehicle && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedTrip.assignment.vehicle.brand} {selectedTrip.assignment.vehicle.model}</p>
                      <p className="text-xs text-gray-500">Vehículo • {selectedTrip.assignment.vehicle.plate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financiero */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Información Financiera</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total del tour</span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(selectedTrip.totalAmount)}</span>
            </div>
          </div>

          {/* Feedback */}
          {selectedTrip.feedback && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Evaluación del Cliente</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(selectedTrip.feedback.rating)}</div>
                <span className="font-medium">{selectedTrip.feedback.rating}</span>
              </div>
              <p className="text-sm text-gray-600 italic">"{selectedTrip.feedback.comment}"</p>
            </div>
          )}

          {/* Razón de cancelación */}
          {selectedTrip.status === 'cancelled' && selectedTrip.cancellationReason && (
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Motivo de Cancelación</h3>
              <p className="text-sm text-red-700">{selectedTrip.cancellationReason}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-gray-50">
      {/* Search and Filter Bar */}
      <div className="bg-white shadow-sm z-20 flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tour, cliente, destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-primary-100 text-primary-600' : 'bg-gray-50 text-gray-600'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="completed">Completados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Período</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="all">Todo</option>
                  <option value="week">Última semana</option>
                  <option value="month">Último mes</option>
                  <option value="quarter">Últimos 3 meses</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto">
        {/* Stats Summary */}
        <div className="px-4 pt-4">
        <div className="bg-primary-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-primary-900 mb-3">Resumen de Historial</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDaysIcon className="w-4 h-4 text-primary-600" />
                <p className="text-xs text-primary-700">Tours totales</p>
              </div>
              <p className="text-2xl font-bold text-primary-900">{stats.total}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700">Completados</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CurrencyDollarIcon className="w-4 h-4 text-primary-600" />
                <p className="text-xs text-primary-700">Ingresos</p>
              </div>
              <p className="text-lg font-bold text-primary-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StarIcon className="w-4 h-4 text-yellow-600" />
                <p className="text-xs text-yellow-700">Rating promedio</p>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{stats.avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de viajes */}
      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 mb-3">
          {filteredTrips.length} {filteredTrips.length === 1 ? 'viaje' : 'viajes'}
        </p>

        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron viajes</p>
            <p className="text-sm text-gray-400 mt-1">Ajusta los filtros para ver más resultados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTrips.map((trip) => {
              const StatusIcon = getStatusIcon(trip.status);
              
              return (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{trip.tourName}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{trip.destination}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {getStatusLabel(trip.status)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{formatDate(trip.date)} • {trip.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{trip.tourists} turistas</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Cliente</p>
                      <p className="text-sm font-medium text-gray-900">{trip.client.name}</p>
                    </div>
                    {trip.status === 'completed' ? (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(trip.totalAmount)}</p>
                        {trip.feedback && (
                          <div className="flex items-center gap-1 justify-end">
                            {renderStars(trip.feedback.rating)}
                            <span className="text-xs text-gray-600 ml-1">{trip.feedback.rating}</span>
                          </div>
                        )}
                      </div>
                    ) : trip.status === 'cancelled' ? (
                      <p className="text-xs text-red-600 text-right max-w-[120px]">
                        {trip.cancellationReason}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default HistoryMobile;