import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UserCircleIcon,
  InformationCircleIcon,
  UserGroupIcon,
  EyeIcon,
  ShieldExclamationIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';
import AdvancedDataTable from '../components/common/AdvancedDataTable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DashboardDesktop = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats] = useState({
    toursToday: 24,
    touristsToday: 312,
    revenue: 8450,
    activeGuides: 18,
    pendingReservations: 7,
    completionRate: 94
  });

  // Tours activos simulados
  const activeTours = [
    { id: 1, name: 'Valle Sagrado Premium', guide: 'Carlos Mendoza', time: '09:00', tourists: 12, status: 'active' },
    { id: 2, name: 'City Tour Cusco', guide: 'Ana Quispe', time: '10:30', tourists: 8, status: 'active' },
    { id: 3, name: 'Machu Picchu Express', guide: 'Roberto Silva', time: '06:00', tourists: 20, status: 'completed' },
    { id: 4, name: 'Tour Gastronómico', guide: 'María García', time: '14:00', tourists: 6, status: 'pending' }
  ];

  // Notificaciones importantes
  const notifications = [
    { id: 1, type: 'warning', message: 'Guía Juan Pérez reporta retraso de 15 minutos', time: '10:45' },
    { id: 2, type: 'success', message: 'Tour Valle Sagrado completado exitosamente', time: '09:30' },
    { id: 3, type: 'info', message: 'Nueva reserva para mañana: City Tour x15 personas', time: '08:15' }
  ];

  // Funciones de navegación para KPIs
  const handleKPIClick = (kpiType) => {
    switch (kpiType) {
      case 'tours':
        navigate('/monitoring'); // Monitoreo de tours en tiempo real
        break;
      case 'tourists':
        navigate('/reservations'); // Gestión de reservas y turistas
        break;
      case 'revenue':
        navigate('/agency-reports'); // Reportes de ingresos
        break;
      case 'guides':
        navigate('/guides-management'); // Gestión de guías
        break;
      case 'pending':
        navigate('/reservations?filter=pending'); // Reservas pendientes
        break;
      case 'completion':
        navigate('/agency-reports?view=completion'); // Reporte de tasa de éxito
        break;
      default:
        // KPI navigation handled above
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      completed: 'text-blue-600 bg-blue-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'En curso',
      pending: 'Pendiente',
      completed: 'Completado'
    };
    return texts[status] || status;
  };

  // Datos simulados para el gráfico de barras
  const chartData = [
    { month: 'Ene', value: 420 },
    { month: 'Feb', value: 380 },
    { month: 'Mar', value: 450 },
    { month: 'Abr', value: 520 },
    { month: 'May', value: 580 },
    { month: 'Jun', value: 610 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-white py-1 px-1 sm:py-2 sm:px-1 lg:py-1 lg:px-1">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Dashboard Operacional
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Bienvenido, {user?.name || 'Usuario'} • {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
            </select>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-4">
        <div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          onClick={() => handleKPIClick('revenue')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">Ingresos del Mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-green-700 transition-colors">S/. 285,700</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+15.3%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          onClick={() => handleKPIClick('reservations')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Reservaciones Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-blue-700 transition-colors">142</p>
              <div className="flex items-center mt-2 text-sm">
                <ClockIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-gray-600">42 para hoy</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          onClick={() => handleKPIClick('ontime')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">Tours Completados a Tiempo</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-green-700 transition-colors">96.5%</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+2.1% vs mes pasado</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <ClockIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          onClick={() => handleKPIClick('nocancellations')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Tours Sin Cancelaciones</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-blue-700 transition-colors">92.8%</p>
              <div className="flex items-center mt-2 text-sm">
                <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-gray-600">cancelación último momento</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          onClick={() => handleKPIClick('noemergencies')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">Tours Sin Emergencias</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-red-700 transition-colors">99.1%</p>
              <div className="flex items-center mt-2 text-sm">
                <ShieldExclamationIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-gray-600">incidentes de seguridad</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <ShieldExclamationIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 group"
          onClick={() => handleKPIClick('guides')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors">Guías Disponibles Hoy</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-purple-700 transition-colors">28</p>
              <div className="flex items-center mt-2 text-sm">
                <UserCircleIcon className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-gray-600">De 35 totales</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <UserCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart Enhanced */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedPeriod === 'today' && 'Ingresos de Hoy'}
                {selectedPeriod === 'week' && 'Ingresos de la Semana'}
                {selectedPeriod === 'month' && 'Ingresos del Mes'}
                {selectedPeriod === 'year' && 'Ingresos del Año'}
              </h2>
            </div>
            
            {/* Header Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {selectedPeriod === 'today' && 'Total Hoy'}
                  {selectedPeriod === 'week' && 'Total Semana'}
                  {selectedPeriod === 'month' && 'Total Mes'}
                  {selectedPeriod === 'year' && 'Total Año'}
                </p>
                <p className="text-lg font-bold text-green-700">
                  {selectedPeriod === 'today' && 'S/. 12,450'}
                  {selectedPeriod === 'week' && 'S/. 45,200'}
                  {selectedPeriod === 'month' && 'S/. 285,700'}
                  {selectedPeriod === 'year' && 'S/. 2,450,000'}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {selectedPeriod === 'today' && 'Promedio por Hora'}
                  {selectedPeriod === 'week' && 'Promedio Diario'}
                  {selectedPeriod === 'month' && 'Promedio Diario'}
                  {selectedPeriod === 'year' && 'Promedio Mensual'}
                </p>
                <p className="text-lg font-bold text-blue-700">
                  {selectedPeriod === 'today' && 'S/. 1,560'}
                  {selectedPeriod === 'week' && 'S/. 6,457'}
                  {selectedPeriod === 'month' && 'S/. 9,523'}
                  {selectedPeriod === 'year' && 'S/. 204,166'}
                </p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {selectedPeriod === 'today' && 'Mejor Hora'}
                  {selectedPeriod === 'week' && 'Mejor Día'}
                  {selectedPeriod === 'month' && 'Mejor Semana'}
                  {selectedPeriod === 'year' && 'Mejor Mes'}
                </p>
                <p className="text-lg font-bold text-purple-700">
                  {selectedPeriod === 'today' && '14:00'}
                  {selectedPeriod === 'week' && 'Viernes'}
                  {selectedPeriod === 'month' && 'Semana 3'}
                  {selectedPeriod === 'year' && 'Diciembre'}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {selectedPeriod === 'today' && 'vs Ayer'}
                  {selectedPeriod === 'week' && 'vs Sem Pasada'}
                  {selectedPeriod === 'month' && 'vs Mes Pasado'}
                  {selectedPeriod === 'year' && 'vs Año Pasado'}
                </p>
                <p className="text-lg font-bold text-orange-700">
                  {selectedPeriod === 'today' && '+8%'}
                  {selectedPeriod === 'week' && '+12%'}
                  {selectedPeriod === 'month' && '+15%'}
                  {selectedPeriod === 'year' && '+18%'}
                </p>
              </div>
            </div>
            
            {/* Chart */}
            <div className="h-64">
              <div className="flex items-end justify-between h-full gap-2 px-2">
                {(() => {
                  const chartData = {
                    today: [
                      { label: '8h', value: 450, height: 25 },
                      { label: '10h', value: 780, height: 40 },
                      { label: '12h', value: 1200, height: 60 },
                      { label: '14h', value: 1800, height: 90 },
                      { label: '16h', value: 1600, height: 80 },
                      { label: '18h', value: 1200, height: 60 },
                      { label: '20h', value: 400, height: 20 }
                    ],
                    week: [
                      { label: 'L', value: 5200, height: 45 },
                      { label: 'M', value: 6800, height: 58 },
                      { label: 'M', value: 6100, height: 52 },
                      { label: 'J', value: 7200, height: 62 },
                      { label: 'V', value: 8900, height: 76 },
                      { label: 'S', value: 5800, height: 50 },
                      { label: 'D', value: 5200, height: 45 }
                    ],
                    month: [
                      { label: 'S1', value: 45200, height: 45 },
                      { label: 'S2', value: 52800, height: 55 },
                      { label: 'S3', value: 68900, height: 72 },
                      { label: 'S4', value: 61200, height: 64 }
                    ],
                    year: [
                      { label: 'E', value: 180000, height: 45 },
                      { label: 'F', value: 195000, height: 49 },
                      { label: 'M', value: 220000, height: 55 },
                      { label: 'A', value: 240000, height: 60 },
                      { label: 'M', value: 285000, height: 71 },
                      { label: 'J', value: 310000, height: 78 },
                      { label: 'J', value: 295000, height: 74 },
                      { label: 'A', value: 280000, height: 70 },
                      { label: 'S', value: 265000, height: 66 },
                      { label: 'O', value: 275000, height: 69 },
                      { label: 'N', value: 290000, height: 73 },
                      { label: 'D', value: 320000, height: 80 }
                    ]
                  };
                  
                  return chartData[selectedPeriod].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group cursor-pointer">
                      <div className="relative w-full max-w-12">
                        <div 
                          className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-500 hover:from-primary-700 hover:to-primary-500 group-hover:scale-110"
                          style={{ height: `${item.height}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          S/. {item.value.toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-2 group-hover:text-primary-600 transition-colors">{item.label}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Active Tours Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Tours en Tiempo Real</h2>
                <span className="text-sm text-gray-500">
                  {activeTours.filter(t => t.status === 'active').length} activos
                </span>
              </div>
            </div>
            
            <AdvancedDataTable
              data={activeTours}
              columns={[
                {
                  key: 'name',
                  header: 'Tour',
                  render: (tour) => (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{tour.name}</span>
                    </div>
                  )
                },
                {
                  key: 'guide',
                  header: 'Guía',
                  render: (tour) => (
                    <span className="text-sm text-gray-600">{tour.guide}</span>
                  )
                },
                {
                  key: 'time',
                  header: 'Hora',
                  sortType: 'text',
                  render: (tour) => (
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {tour.time}
                    </div>
                  )
                },
                {
                  key: 'tourists',
                  header: 'Turistas',
                  sortType: 'numeric',
                  render: (tour) => (
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {tour.tourists}
                    </div>
                  )
                },
                {
                  key: 'status',
                  header: 'Estado',
                  render: (tour) => (
                    <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(tour.status)}`}>
                      {getStatusText(tour.status)}
                    </span>
                  )
                }
              ]}
              actions={[
                {
                  label: 'Ver detalles',
                  icon: <EyeIcon className="w-4 h-4" />,
                  onClick: (tour) => {
                    // Navigate to tour details
                    navigate(`/monitoring/tour/${tour.id}`);
                  },
                  className: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                }
              ]}
              filters={[
                {
                  key: 'status',
                  label: 'Estado',
                  type: 'select',
                  options: [
                    { value: 'active', label: 'En curso' },
                    { value: 'pending', label: 'Pendiente' },
                    { value: 'completed', label: 'Completado' }
                  ],
                  filterFn: (tour, value) => tour.status === value
                },
                {
                  key: 'guide',
                  label: 'Guía',
                  type: 'text',
                  placeholder: 'Buscar por guía...',
                  filterFn: (tour, value) => tour.guide.toLowerCase().includes(value.toLowerCase())
                }
              ]}
              searchPlaceholder="Buscar tours por nombre, guía..."
              pageSize={10}
              className="border-0 shadow-none"
            />
          </div>

          {/* Monthly Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Rendimiento Mensual</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Últimos 6 meses</option>
                <option>Último año</option>
              </select>
            </div>
            <div className="space-y-4">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-10">{item.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(item.value / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 1 col */}
        <div className="space-y-8">
          {/* Tour Types Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución por Tipo</h2>
            <div className="space-y-4">
              {[
                { type: 'Cultural', value: 35, color: 'bg-indigo-500' },
                { type: 'Aventura', value: 25, color: 'bg-green-500' },
                { type: 'Gastronómico', value: 20, color: 'bg-orange-500' },
                { type: 'Místico', value: 15, color: 'bg-purple-500' },
                { type: 'Fotográfico', value: 5, color: 'bg-yellow-500' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Notificaciones Recientes</h2>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notif.type === 'warning' ? 'bg-yellow-100' :
                    notif.type === 'success' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    {notif.type === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />}
                    {notif.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                    {notif.type === 'info' && <InformationCircleIcon className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Top Guides */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Guías del Mes</h2>
            <div className="space-y-3">
              {[
                { name: 'Carlos Mendoza', tours: 45, rating: 4.9 },
                { name: 'Ana Quispe', tours: 42, rating: 4.8 },
                { name: 'Roberto Silva', tours: 38, rating: 4.9 }
              ].map((guide, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                      {guide.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{guide.name}</p>
                      <p className="text-xs text-gray-500">{guide.tours} tours</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 ml-1">{guide.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDesktop;