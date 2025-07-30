import { useState, useMemo, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import HistoryMobile from './HistoryMobile';
import useAuthStore from '../stores/authStore';
import ExcelButton from '../components/common/ExcelButton';

const History = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <HistoryMobile />;
  }

  // Mock data de viajes asignados
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
          phone: '+51 987 654 321',
          photo: 'https://i.pravatar.cc/150?img=1'
        },
        driver: {
          id: 'D001',
          name: 'Luis García',
          phone: '+51 976 543 210',
          photo: 'https://i.pravatar.cc/150?img=4'
        },
        vehicle: {
          id: 'V001',
          brand: 'Toyota',
          model: 'Hiace',
          plate: 'ABC-123',
          capacity: 15,
          photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop'
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
        email: 'maria@email.com',
        phone: '+51 976 543 210'
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
          id: 'G002',
          name: 'Ana López',
          phone: '+51 954 321 987',
          photo: 'https://i.pravatar.cc/150?img=2'
        },
        driver: {
          id: 'D002',
          name: 'Pedro Ruiz',
          phone: '+51 965 432 187',
          photo: 'https://i.pravatar.cc/150?img=5'
        },
        vehicle: {
          id: 'V002',
          brand: 'Mercedes-Benz',
          model: 'Sprinter',
          plate: 'XYZ-789',
          capacity: 20,
          photo: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop'
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
        name: 'Carlos Rodríguez',
        email: 'carlos@email.com',
        phone: '+57 302 345 6789'
      },
      agency: 'Reserva Directa',
      date: '2024-01-13',
      time: '07:30',
      duration: '6 horas',
      tourists: 6,
      destination: 'Jardín',
      status: 'completed',
      totalAmount: 600000,
      assignment: {
        guide: {
          id: 'G003',
          name: 'Miguel Torres',
          phone: '+51 965 432 187',
          photo: 'https://i.pravatar.cc/150?img=3'
        },
        driver: {
          id: 'D001',
          name: 'Luis García',
          phone: '+51 976 543 210',
          photo: 'https://i.pravatar.cc/150?img=4'
        },
        vehicle: {
          id: 'V003',
          brand: 'Ford',
          model: 'Transit',
          plate: 'DEF-456',
          capacity: 12,
          photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop'
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
        name: 'Laura Martínez',
        email: 'laura@email.com',
        phone: '+57 303 456 7890'
      },
      agency: 'Eco Viajes',
      date: '2024-01-12',
      time: '06:00',
      duration: '8 horas',
      tourists: 3,
      destination: 'El Retiro',
      status: 'cancelled',
      totalAmount: 300000,
      assignment: {
        guide: {
          id: 'G001',
          name: 'Carlos Mendez',
          phone: '+51 987 654 321',
          photo: 'https://i.pravatar.cc/150?img=1'
        },
        driver: null,
        vehicle: null
      },
      feedback: null,
      cancellationReason: 'Mal clima'
    },
    {
      id: 'TRIP-005',
      tourName: 'Historical Tour',
      client: {
        name: 'Roberto Silva',
        email: 'roberto@email.com',
        phone: '+57 304 567 8901'
      },
      agency: 'Antioquia Tours',
      date: '2024-01-11',
      time: '10:00',
      duration: '5 horas',
      tourists: 5,
      destination: 'Santa Fe de Antioquia',
      status: 'completed',
      totalAmount: 500000,
      assignment: {
        guide: {
          id: 'G002',
          name: 'Ana López',
          phone: '+51 954 321 987',
          photo: 'https://i.pravatar.cc/150?img=2'
        },
        driver: {
          id: 'D003',
          name: 'Carlos Díaz',
          phone: '+51 987 321 654',
          photo: 'https://i.pravatar.cc/150?img=6'
        },
        vehicle: {
          id: 'V002',
          brand: 'Mercedes-Benz',
          model: 'Sprinter',
          plate: 'XYZ-789',
          capacity: 20,
          photo: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop'
        }
      },
      feedback: {
        rating: 4.7,
        comment: 'Muy buen tour histórico'
      }
    }
  ];

  const filteredTrips = useMemo(() => {
    let filtered = assignedTrips;

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.tourName.toLowerCase().includes(searchLower) ||
        trip.client.name.toLowerCase().includes(searchLower) ||
        trip.destination.toLowerCase().includes(searchLower) ||
        trip.agency.toLowerCase().includes(searchLower) ||
        trip.id.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    // Filtro por fecha
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
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(trip => new Date(trip.date) >= filterDate);
      }
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'client':
          aValue = a.client.name;
          bValue = b.client.name;
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'rating':
          aValue = a.feedback?.rating || 0;
          bValue = b.feedback?.rating || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Completado
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Cancelado
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            <ClockIcon className="w-3 h-3 mr-1" />
            En Progreso
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            {status}
          </span>
        );
    }
  };

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Viajes Asignados
          </h1>
          <p className="text-gray-600">
            Registro completo de todos los viajes asignados y completados
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Viajes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              </div>
              <div className="text-yellow-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">Filtros y Búsqueda</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tour, cliente, destino, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="completed">Completados</option>
                <option value="cancelled">Cancelados</option>
                <option value="in_progress">En Progreso</option>
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
              </select>
            </div>

            {/* Ordenar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Fecha</option>
                  <option value="client">Cliente</option>
                  <option value="amount">Monto</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {filteredTrips.length} de {assignedTrips.length} viajes
          </p>
          <ExcelButton
            text="Excel"
            fullText={true}
          />
        </div>

        {/* Trips Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha & Hora
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turistas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignación
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="min-w-[180px]">
                        <div className="text-sm font-medium text-gray-900">
                          {trip.tourName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPinIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                          {trip.destination}
                        </div>
                        <div className="text-xs text-gray-400">
                          {trip.id}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="min-w-[160px]">
                        <div className="text-sm font-medium text-gray-900">
                          {trip.client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trip.client.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {trip.agency}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                          {formatDate(trip.date)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                          {trip.time} ({trip.duration})
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {trip.tourists}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="min-w-[200px] space-y-1">
                        {trip.assignment.guide && (
                          <div className="flex items-center text-xs text-green-700">
                            <UserGroupIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{trip.assignment.guide.name}</span>
                          </div>
                        )}
                        {trip.assignment.driver && (
                          <div className="flex items-center text-xs text-blue-700">
                            <TruckIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{trip.assignment.driver.name}</span>
                          </div>
                        )}
                        {trip.assignment.vehicle && (
                          <div className="flex items-center text-xs text-gray-600">
                            <TruckIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {trip.assignment.vehicle.brand} {trip.assignment.vehicle.model}
                            </span>
                          </div>
                        )}
                        {trip.status === 'cancelled' && (
                          <div className="text-xs text-red-600">
                            {trip.cancellationReason}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(trip.totalAmount)}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(trip.status)}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      {trip.feedback?.rating ? (
                        <div className="flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-900">
                            {trip.feedback.rating}
                          </span>
                          <svg className="w-4 h-4 text-yellow-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTrips.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <CalendarDaysIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron viajes
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda para encontrar más resultados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;