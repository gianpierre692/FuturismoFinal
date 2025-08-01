import React, { useState, useEffect, useMemo } from 'react';
import { 
  UsersIcon as Users,
  CalendarIcon as Calendar,
  FunnelIcon as Filter,
  MagnifyingGlassIcon as Search,
  ArrowDownTrayIcon as Download,
  ArrowPathIcon as RefreshCw,
  MapPinIcon as MapPin,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
  CurrencyDollarIcon as DollarSign,
  ArrowTrendingUpIcon as TrendingUp,
  ChartBarIcon as BarChart3,
  UserGroupIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import AssignmentManager from '../../components/assignments/AssignmentManager';
import ExcelButton from '../../components/common/ExcelButton';
import toast from 'react-hot-toast';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    destination: 'all',
    guide: 'all',
    tourType: 'all',
    status: 'all',
    searchTerm: '',
    clientQuantityType: 'all',
    minClients: '',
    maxClients: '',
    clientCategory: 'all',
    agency: 'all',
    dateFilterType: 'custom',
    specificDate: '',
    weekNumber: '',
    month: '',
    quarter: '',
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data
  const mockAgencies = [
    { id: 'ag001', name: 'Viajes El Dorado SAC' },
    { id: 'ag002', name: 'Turismo Aventura S.A.C.' },
    { id: 'ag003', name: 'Explorar Mundo Ltda.' },
    { id: 'ag004', name: 'Destinos Plus S.A.C.' },
    { id: 'ag005', name: 'Viajeros Únicos E.I.R.L.' },
    { id: 'ag006', name: 'Reserva Directa' }
  ];

  const dateFilterOptions = [
    { value: 'custom', label: 'Personalizado' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'biweekly', label: 'Últimas 2 semanas' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' }
  ];

  const mockReservations = [
    {
      id: 'RES-001',
      clientName: 'Juan Pérez',
      clientEmail: 'juan@email.com',
      clientPhone: '+51 987 654 321',
      tourName: 'City Tour Lima Centro',
      destination: 'Centro de Lima',
      guide: 'Carlos Mendez',
      tourDate: '2024-01-15',
      tourists: 4,
      totalAmount: 1080,
      status: 'completed',
      bookingDate: '2024-01-10',
      paymentStatus: 'paid',
      tourType: 'cultural',
      agencyId: 'ag001',
      agencyName: 'Viajes El Dorado SAC',
      assignmentStatus: 'assigned',
      assignedResources: {
        guide: { id: 'G001', name: 'Carlos Mendez' },
        driver: { id: 'D001', name: 'Luis García' },
        vehicle: { id: 'V001', type: 'Van Toyota', capacity: 15 }
      }
    },
    {
      id: 'RES-002',
      clientName: 'María García',
      clientEmail: 'maria@email.com',
      clientPhone: '+51 976 543 210',
      tourName: 'Tour Miraflores y Barranco',
      destination: 'Miraflores',
      guide: 'Ana López',
      tourDate: '2024-01-14',
      tourists: 2,
      totalAmount: 680,
      status: 'confirmed',
      bookingDate: '2024-01-08',
      paymentStatus: 'paid',
      tourType: 'adventure',
      agencyId: 'ag006',
      agencyName: 'Reserva Directa',
      assignmentStatus: 'pending'
    },
    {
      id: 'RES-003',
      clientName: 'Carlos Rodríguez',
      clientEmail: 'carlos@email.com',
      clientPhone: '+57 302 345 6789',
      tourName: 'Coffee Tour',
      destination: 'Jardín',
      guide: 'Luis Torres',
      tourDate: '2024-01-13',
      tourists: 6,
      totalAmount: 600000,
      status: 'confirmed',
      bookingDate: '2024-01-07',
      paymentStatus: 'paid',
      tourType: 'cultural',
      agencyId: 'ag002',
      agencyName: 'Turismo Aventura S.A.C.',
      assignmentStatus: 'assigned',
      assignedResources: {
        guide: { id: 'G002', name: 'Ana López' },
        driver: { id: 'D002', name: 'Pedro Ruiz' },
        vehicle: { id: 'V002', type: 'Minibus Mercedes', capacity: 19 }
      }
    }
  ];

  const destinations = ['Centro de Lima', 'Miraflores', 'San Isidro', 'Barranco', 'Pachacamac', 'Callao'];
  const guides = ['Carlos Mendez', 'Ana López', 'Luis Torres', 'Pedro Gómez', 'Carmen Díaz'];
  const tourTypes = ['cultural', 'adventure', 'nature', 'gastronomic'];
  const statusOptions = ['all', 'completed', 'confirmed', 'pending', 'cancelled'];
  
  const clientCategories = [
    { value: 'all', label: 'Todas las cantidades', range: null },
    { value: 'individual', label: 'Individual (1 persona)', range: [1, 1] },
    { value: 'small', label: 'Grupo Pequeño (2-4)', range: [2, 4] },
    { value: 'medium', label: 'Grupo Mediano (5-8)', range: [5, 8] },
    { value: 'large', label: 'Grupo Grande (9-15)', range: [9, 15] },
    { value: 'extra_large', label: 'Grupo Extra Grande (16+)', range: [16, 999] }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredReservations = useMemo(() => {
    let filtered = reservations;

    if (filters.status !== 'all') {
      filtered = filtered.filter(res => res.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(res => res.tourDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(res => res.tourDate <= filters.dateTo);
    }

    if (filters.destination !== 'all') {
      filtered = filtered.filter(res => res.destination === filters.destination);
    }

    if (filters.guide !== 'all') {
      filtered = filtered.filter(res => res.guide === filters.guide);
    }

    if (filters.tourType !== 'all') {
      filtered = filtered.filter(res => res.tourType === filters.tourType);
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(res => 
        res.clientName.toLowerCase().includes(searchTerm) ||
        res.clientEmail.toLowerCase().includes(searchTerm) ||
        res.tourName.toLowerCase().includes(searchTerm) ||
        res.id.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.clientQuantityType === 'range' && (filters.minClients || filters.maxClients)) {
      const minClients = parseInt(filters.minClients) || 0;
      const maxClients = parseInt(filters.maxClients) || 999;
      filtered = filtered.filter(res => 
        res.tourists >= minClients && res.tourists <= maxClients
      );
    } else if (filters.clientQuantityType === 'category' && filters.clientCategory !== 'all') {
      const category = clientCategories.find(cat => cat.value === filters.clientCategory);
      if (category && category.range) {
        const [min, max] = category.range;
        filtered = filtered.filter(res => 
          res.tourists >= min && res.tourists <= max
        );
      }
    }

    if (filters.agency !== 'all') {
      filtered = filtered.filter(res => res.agencyId === filters.agency);
    }

    return filtered;
  }, [reservations, filters]);

  const stats = useMemo(() => {
    const totalClients = filteredReservations.length;
    const totalTourists = filteredReservations.reduce((sum, res) => sum + res.tourists, 0);
    const totalRevenue = filteredReservations.reduce((sum, res) => sum + res.totalAmount, 0);
    const avgGroupSize = totalClients > 0 ? (totalTourists / totalClients).toFixed(1) : 0;

    const groupSizeDistribution = clientCategories.map(category => {
      if (category.value === 'all') return null;
      
      const count = filteredReservations.filter(res => {
        const [min, max] = category.range;
        return res.tourists >= min && res.tourists <= max;
      }).length;
      
      return {
        category: category.label,
        count,
        percentage: totalClients > 0 ? ((count / totalClients) * 100).toFixed(1) : 0
      };
    }).filter(Boolean);

    return {
      totalClients,
      totalTourists,
      totalRevenue,
      avgGroupSize,
      groupSizeDistribution
    };
  }, [filteredReservations, clientCategories]);

  const handleExport = () => {
    console.log('Exportando reservas filtradas:', filteredReservations);
    toast.success(`Exportando ${filteredReservations.length} reservas...`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGroupSizeInfo = (touristCount) => {
    const category = clientCategories.find(cat => {
      if (!cat.range) return false;
      const [min, max] = cat.range;
      return touristCount >= min && touristCount <= max;
    });
    
    return {
      category: category?.value || 'unknown',
      label: category?.label || 'Desconocido',
      color: category?.value === 'individual' ? 'bg-blue-100 text-blue-800' :
             category?.value === 'small' ? 'bg-green-100 text-green-800' :
             category?.value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
             category?.value === 'large' ? 'bg-purple-100 text-purple-800' :
             category?.value === 'extra_large' ? 'bg-red-100 text-red-800' :
             'bg-gray-100 text-gray-800'
    };
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", compact = false }) => {
    const colorClasses = {
      blue: 'border-blue-500 text-blue-600',
      green: 'border-green-500 text-green-600',
      yellow: 'border-yellow-500 text-yellow-600',
      purple: 'border-purple-500 text-purple-600',
      orange: 'border-orange-500 text-orange-600'
    };

    if (compact) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 truncate">{title}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
            <Icon className={`w-6 h-6 ${colorClasses[color]} flex-shrink-0`} />
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
          </div>
          <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
        </div>
      </div>
    );
  };

  // Mobile Filters Modal
  const MobileFilters = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-lg max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-64px)]">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cliente, email, ID..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Todos los estados' : 
                     status === 'completed' ? 'Completados' :
                     status === 'confirmed' ? 'Confirmados' :
                     status === 'pending' ? 'Pendientes' :
                     status === 'cancelled' ? 'Cancelados' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <select
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los destinos</option>
                {destinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Guide */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guía
              </label>
              <select
                value={filters.guide}
                onChange={(e) => handleFilterChange('guide', e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los guías</option>
                {guides.map(guide => (
                  <option key={guide} value={guide}>{guide}</option>
                ))}
              </select>
            </div>

            {/* Tour Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de tour
              </label>
              <select
                value={filters.tourType}
                onChange={(e) => handleFilterChange('tourType', e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los tipos</option>
                {tourTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Agency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agencia
              </label>
              <select
                value={filters.agency}
                onChange={(e) => handleFilterChange('agency', e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las agencias</option>
                {mockAgencies.map(agency => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setFilters({
                  dateFrom: '',
                  dateTo: '',
                  destination: 'all',
                  guide: 'all',
                  tourType: 'all',
                  status: 'all',
                  searchTerm: '',
                  clientQuantityType: 'all',
                  minClients: '',
                  maxClients: '',
                  clientCategory: 'all',
                  agency: 'all',
                  dateFilterType: 'custom',
                  specificDate: '',
                  weekNumber: '',
                  month: '',
                  quarter: '',
                  year: new Date().getFullYear()
                });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Reservation Card
  const MobileReservationCard = ({ reservation }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{reservation.clientName}</h3>
          <p className="text-sm text-gray-500 truncate">{reservation.clientEmail}</p>
          <p className="text-xs text-gray-400">{reservation.id}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {reservation.status === 'completed' ? (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completado
            </span>
          ) : reservation.status === 'confirmed' ? (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              <Clock className="w-3 h-3 mr-1" />
              Confirmado
            </span>
          ) : reservation.status === 'pending' ? (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              <Clock className="w-3 h-3 mr-1" />
              Pendiente
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
              <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
              Cancelado
            </span>
          )}
        </div>
      </div>

      {/* Tour Details */}
      <div className="space-y-2 mb-3">
        <div>
          <p className="font-medium text-sm text-gray-900">{reservation.tourName}</p>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {reservation.destination}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(reservation.tourDate)}
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="w-3 h-3 mr-1" />
            {reservation.tourists} personas
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Agencia</p>
          <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
            {reservation.agencyName}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-sm font-bold text-gray-900">
            {formatCurrency(reservation.totalAmount)}
          </p>
        </div>
      </div>

      {/* Assignment Status */}
      {reservation.status === 'confirmed' && (
        <div className="border-t pt-3">
          {reservation.assignmentStatus === 'assigned' ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Recursos asignados:</p>
              <div className="space-y-1">
                <div className="flex items-center text-xs text-green-700">
                  <UserGroupIcon className="w-3 h-3 mr-1" />
                  {reservation.assignedResources?.guide?.name || 'Sin guía'}
                </div>
                {reservation.assignedResources?.driver && (
                  <div className="flex items-center text-xs text-blue-700">
                    <TruckIcon className="w-3 h-3 mr-1" />
                    {reservation.assignedResources.driver.name}
                  </div>
                )}
                {reservation.assignedResources?.vehicle && (
                  <div className="flex items-center text-xs text-gray-600">
                    <TruckIcon className="w-3 h-3 mr-1" />
                    {reservation.assignedResources.vehicle.type}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedReservation(reservation);
                  setShowAssignmentModal(true);
                }}
                className="w-full mt-2 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Editar Asignación
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                Sin asignar
              </span>
              <button
                onClick={() => {
                  setSelectedReservation(reservation);
                  setShowAssignmentModal(true);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Asignar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="px-2 sm:px-4 lg:px-6 xl:px-8 py-1 sm:py-2 lg:py-4 bg-white min-h-screen">
        <div className="max-w-7xl xl:max-w-full mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  Gestión de Reservas
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Administración completa de reservas y clientes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLoading(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Actualizar</span>
                </button>
                <ExcelButton
                  onClick={handleExport}
                  text="Exportar"
                  className="px-3 sm:px-4 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards - Mobile */}
          {isMobile && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard
                title="Total Reservas"
                value={filteredReservations.length}
                icon={Calendar}
                color="blue"
                compact
              />
              <StatCard
                title="Confirmadas"
                value={filteredReservations.filter(r => r.status === 'confirmed').length}
                icon={CheckCircle}
                color="green"
                compact
              />
              <StatCard
                title="Sin Asignar"
                value={filteredReservations.filter(r => r.status === 'confirmed' && r.assignmentStatus === 'pending').length}
                icon={ExclamationTriangleIcon}
                color="yellow"
                compact
              />
              <StatCard
                title="Asignadas"
                value={filteredReservations.filter(r => r.assignmentStatus === 'assigned').length}
                icon={UserGroupIcon}
                color="purple"
                compact
              />
            </div>
          )}

          {/* Stats Cards - Desktop */}
          {!isMobile && (
            <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-6">
              <StatCard
                title="Total Reservas"
                value={filteredReservations.length}
                subtitle="En vista actual"
                icon={Calendar}
                color="blue"
              />
              <StatCard
                title="Confirmadas"
                value={filteredReservations.filter(r => r.status === 'confirmed').length}
                subtitle="Listas para asignar"
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Sin Asignar"
                value={filteredReservations.filter(r => r.status === 'confirmed' && r.assignmentStatus === 'pending').length}
                subtitle="Requieren atención"
                icon={ExclamationTriangleIcon}
                color="yellow"
              />
              <StatCard
                title="Asignadas"
                value={filteredReservations.filter(r => r.assignmentStatus === 'assigned').length}
                subtitle="Con recursos asignados"
                icon={UserGroupIcon}
                color="purple"
              />
            </div>
          )}

          {/* Mobile Search and Filter Toggle */}
          {isMobile && (
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                Filtros
                {Object.keys(filters).filter(key => 
                  filters[key] !== '' && 
                  filters[key] !== 'all' && 
                  key !== 'year' && 
                  key !== 'dateFilterType'
                ).length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {Object.keys(filters).filter(key => 
                      filters[key] !== '' && 
                      filters[key] !== 'all' && 
                      key !== 'year' && 
                      key !== 'dateFilterType'
                    ).length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Desktop Filters */}
          {!isMobile && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destino
                  </label>
                  <select
                    value={filters.destination}
                    onChange={(e) => handleFilterChange('destination', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los destinos</option>
                    {destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guía
                  </label>
                  <select
                    value={filters.guide}
                    onChange={(e) => handleFilterChange('guide', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los guías</option>
                    {guides.map(guide => (
                      <option key={guide} value={guide}>{guide}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de tour
                  </label>
                  <select
                    value={filters.tourType}
                    onChange={(e) => handleFilterChange('tourType', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los tipos</option>
                    {tourTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'Todos los estados' : 
                         status === 'completed' ? 'Completados' :
                         status === 'confirmed' ? 'Confirmados' :
                         status === 'pending' ? 'Pendientes' :
                         status === 'cancelled' ? 'Cancelados' : status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cliente, email, ID..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="w-full pl-10 pr-4 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Stats - Desktop Only */}
          {!isMobile && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-8">
              <StatCard
                title="Total de Clientes"
                value={stats.totalClients}
                subtitle="Reservas filtradas"
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Total Turistas"
                value={stats.totalTourists}
                subtitle="Personas atendidas"
                icon={TrendingUp}
                color="green"
              />
              <StatCard
                title="Ingresos Totales"
                value={formatCurrency(stats.totalRevenue)}
                subtitle="Valor acumulado"
                icon={DollarSign}
                color="purple"
              />
              <StatCard
                title="Promedio Grupo"
                value={stats.avgGroupSize}
                subtitle="Personas por reserva"
                icon={BarChart3}
                color="orange"
              />
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Mostrando {filteredReservations.length} de {reservations.length} reservas
            </p>
          </div>

          {/* Reservations List */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Cargando reservas...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No se encontraron reservas con los filtros aplicados</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile && (
                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <MobileReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}

              {/* Desktop Table */}
              {!isMobile && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tour / Destino
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Turistas
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asignación
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReservations.map((reservation) => (
                          <tr key={reservation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {reservation.clientName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {reservation.clientEmail}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {reservation.id}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {reservation.tourName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {reservation.destination}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {reservation.agencyName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(reservation.tourDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex flex-col items-center gap-1">
                                <div className="text-sm text-gray-900 flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {reservation.tourists}
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGroupSizeInfo(reservation.tourists).color}`}>
                                  {getGroupSizeInfo(reservation.tourists).category === 'individual' ? 'Individual' :
                                   getGroupSizeInfo(reservation.tourists).category === 'small' ? 'Pequeño' :
                                   getGroupSizeInfo(reservation.tourists).category === 'medium' ? 'Mediano' :
                                   getGroupSizeInfo(reservation.tourists).category === 'large' ? 'Grande' :
                                   getGroupSizeInfo(reservation.tourists).category === 'extra_large' ? 'XL' : 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(reservation.totalAmount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex justify-center">
                                {reservation.status === 'completed' ? (
                                  <span className="inline-flex items-center text-xs text-green-800 bg-green-100 px-2 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completado
                                  </span>
                                ) : reservation.status === 'confirmed' ? (
                                  <span className="inline-flex items-center text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Confirmado
                                  </span>
                                ) : reservation.status === 'pending' ? (
                                  <span className="inline-flex items-center text-xs text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pendiente
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-xs text-red-800 bg-red-100 px-2 py-1 rounded-full">
                                    <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                    Cancelado
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {reservation.status === 'confirmed' ? (
                                reservation.assignmentStatus === 'assigned' ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center text-xs text-green-700">
                                      <UserGroupIcon className="w-3 h-3 mr-1" />
                                      <span className="truncate">{reservation.assignedResources?.guide?.name || 'Sin guía'}</span>
                                    </div>
                                    {reservation.assignedResources?.driver && (
                                      <div className="flex items-center text-xs text-blue-700">
                                        <TruckIcon className="w-3 h-3 mr-1" />
                                        <span className="truncate">{reservation.assignedResources.driver.name}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                                    Sin asignar
                                  </span>
                                )
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {reservation.status === 'confirmed' && reservation.assignmentStatus !== 'assigned' ? (
                                <button
                                  onClick={() => {
                                    setSelectedReservation(reservation);
                                    setShowAssignmentModal(true);
                                  }}
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                                >
                                  <PlusIcon className="w-3 h-3" />
                                  Asignar
                                </button>
                              ) : reservation.assignmentStatus === 'assigned' ? (
                                <button
                                  onClick={() => {
                                    setSelectedReservation(reservation);
                                    setShowAssignmentModal(true);
                                  }}
                                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  Editar
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && <MobileFilters />}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Asignar Recursos - {selectedReservation.id}</h2>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <AssignmentManager
                reservation={{
                  date: selectedReservation.tourDate,
                  time: '08:00',
                  tourName: selectedReservation.tourName,
                  groupSize: selectedReservation.tourists,
                  agency: {
                    name: selectedReservation.agencyName,
                    whatsapp: '+51987654321'
                  },
                  pickupLocation: {
                    name: selectedReservation.destination
                  }
                }}
                onAssignmentComplete={(assignment) => {
                  setReservations(prev => prev.map(r => 
                    r.id === selectedReservation.id 
                      ? { 
                          ...r, 
                          assignmentStatus: 'assigned',
                          assignedResources: {
                            guide: assignment.guide,
                            driver: assignment.driver,
                            vehicle: assignment.vehicle
                          }
                        }
                      : r
                  ));
                  setShowAssignmentModal(false);
                  toast.success('Recursos asignados correctamente');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReservationManagement;