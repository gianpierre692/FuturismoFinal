import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  UserPlusIcon,
  BellIcon,
  ShieldExclamationIcon,
  ClipboardDocumentCheckIcon,
  BuildingOffice2Icon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TicketIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  UsersIcon,
  BanknotesIcon,
  ChartPieIcon,
  TableCellsIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import UniversalExportService from '../../services/universalExportService';
import SafeChart from '../../components/charts/SafeChart';
import ExcelButton from '../../components/common/ExcelButton';
import InteractiveServiceDistribution from '../../components/charts/InteractiveServiceDistribution';
import InteractiveRevenueChart from '../../components/charts/InteractiveRevenueChart';
import ToastContainer from '../../components/common/ToastContainer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [stats, setStats] = useState({
    // Estadísticas principales
    totalReservations: 1847,
    activeReservations: 142,
    totalRevenue: 285700,
    todayRevenue: 12450,
    totalUsers: 389,
    activeGuides: 35,
    totalProviders: 78,
    systemAlerts: 3,
    
    // Métricas de rendimiento
    conversionRate: 68.5,
    satisfactionRate: 94.2,
    responseTime: 1.2,
    uptime: 99.9,
    
    // Comparaciones
    revenueGrowth: 15.3,
    userGrowth: 8.7,
    reservationGrowth: 12.4
  });

  // Datos para gráficos
  const revenueData = [
    { mes: 'Ene', valor: 185000 },
    { mes: 'Feb', valor: 205000 },
    { mes: 'Mar', valor: 198000 },
    { mes: 'Abr', valor: 225000 },
    { mes: 'May', valor: 245000 },
    { mes: 'Jun', valor: 285700 }
  ];

  const serviceDistribution = [
    { name: 'Tours Grupales', value: 45, color: '#3B82F6' },
    { name: 'Tours Privados', value: 30, color: '#10B981' },
    { name: 'Actividades', value: 15, color: '#F59E0B' },
    { name: 'Transfers', value: 10, color: '#EF4444' }
  ];

  // Acciones rápidas organizadas por categorías
  const quickActionCategories = [
    {
      title: 'Gestión de Usuarios',
      icon: UserGroupIcon,
      color: 'blue',
      actions: [
        {
          title: 'Usuarios',
          subtitle: 'Administrar usuarios del sistema',
          icon: UsersIcon,
          path: '/users',
          stats: { total: 389, new: 12 },
          color: 'blue'
        },
        {
          title: 'Guías',
          subtitle: 'Gestionar guías turísticos',
          icon: MapIcon,
          path: '/guides',
          stats: { total: 35, active: 28 },
          color: 'green'
        },
        {
          title: 'Agencias',
          subtitle: 'Administrar agencias de viajes',
          icon: BuildingOffice2Icon,
          path: '/users',
          stats: { total: 12, active: 10 },
          color: 'purple'
        }
      ]
    },
    {
      title: 'Operaciones',
      icon: CalendarIcon,
      color: 'green',
      actions: [
        {
          title: 'Reservaciones',
          subtitle: 'Ver y gestionar reservas',
          icon: TicketIcon,
          path: '/reservations',
          stats: { today: 42, pending: 8 },
          color: 'green'
        },
        {
          title: 'Calendario',
          subtitle: 'Vista de calendario de tours',
          icon: CalendarIcon,
          path: '/agenda',
          stats: { tours: 18, guides: 12 },
          color: 'indigo'
        },
        {
          title: 'Monitoreo',
          subtitle: 'Monitorear tours en vivo',
          icon: MapPinIcon,
          path: '/monitoring',
          stats: { active: 6, alerts: 0 },
          color: 'yellow',
          badge: 'En Vivo'
        }
      ]
    },
    {
      title: 'Administración',
      icon: CogIcon,
      color: 'purple',
      actions: [
        {
          title: 'Proveedores',
          subtitle: 'Gestionar proveedores',
          icon: BuildingOffice2Icon,
          path: '/providers',
          stats: { total: 78, new: 5 },
          color: 'purple'
        },
        {
          title: 'Reportes',
          subtitle: 'Análisis y estadísticas',
          icon: ChartBarIcon,
          path: '/admin/reports',
          stats: { reports: 15, scheduled: 3 },
          color: 'orange',
        },
        {
          title: 'Configuración',
          subtitle: 'Ajustes del sistema',
          icon: CogIcon,
          path: '/settings',
          stats: { updates: 2, pending: 1 },
          color: 'gray'
        }
      ]
    },
    {
      title: 'Comunicación',
      icon: BellIcon,
      color: 'yellow',
      actions: [
        {
          title: 'Chat',
          subtitle: 'Mensajes con guías y agencias',
          icon: PhoneIcon,
          path: '/chat',
          stats: { unread: 8, conversations: 24 },
          color: 'blue',
          badge: '8 nuevos'
        },
        {
          title: 'Protocolos',
          subtitle: 'Protocolos de emergencia',
          icon: ShieldExclamationIcon,
          path: '/admin/emergency',
          stats: { protocols: 12, drills: 3 },
          color: 'red'
        },
        {
          title: 'Historial de Usuarios',
          subtitle: 'Registro de actividades del sistema',
          icon: ClipboardDocumentCheckIcon,
          path: '/history',
          stats: { entries: 1847, today: 142 },
          color: 'gray'
        }
      ]
    }
  ];

  // Alertas del sistema
  const systemAlerts = [
    {
      type: 'warning',
      title: '3 guías sin asignar',
      description: 'Hay tours para mañana sin guías asignados',
      action: 'Asignar ahora',
      path: '/reservations'
    },
    {
      type: 'info',
      title: 'Reporte mensual disponible',
      description: 'El reporte de junio está listo para descargar',
      action: 'Ver reporte',
      path: '/admin/reports'
    },
    {
      type: 'success',
      title: 'Sistema actualizado',
      description: 'La actualización v2.5.0 se instaló correctamente',
      action: 'Ver cambios'
    }
  ];

  const exportDashboardData = () => {
    const dashboardData = {
      resumen: [
        { Métrica: 'Total Reservaciones', Valor: stats.totalReservations },
        { Métrica: 'Ingresos Totales', Valor: `S/. ${stats.totalRevenue}` },
        { Métrica: 'Total Usuarios', Valor: stats.totalUsers },
        { Métrica: 'Guías Activos', Valor: stats.activeGuides },
        { Métrica: 'Total Proveedores', Valor: stats.totalProviders },
        { Métrica: 'Tasa de Conversión', Valor: `${stats.conversionRate}%` },
        { Métrica: 'Satisfacción', Valor: `${stats.satisfactionRate}%` }
      ]
    };

    UniversalExportService.exportToExcel(dashboardData.resumen, 'dashboard_admin', 'Resumen');
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6">
      {/* Header mejorado */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ChartPieIcon className="h-8 w-8 text-blue-600" />
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenido de vuelta. Aquí está el resumen de tu sistema.
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
            </select>
            
            <ExcelButton
              onClick={exportDashboardData}
              text="Excel"
              fullText={true}
              title="Exportar datos a Excel"
            />
          </div>
        </div>
      </div>

      {/* Alertas del sistema */}
      {systemAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {systemAlerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border flex items-start gap-3 ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : alert.type === 'info'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              {alert.type === 'warning' ? (
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              ) : alert.type === 'info' ? (
                <BellIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              ) : (
                <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{alert.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
              </div>
              {alert.action && (
                <button
                  onClick={() => alert.path && navigate(alert.path)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    alert.type === 'warning'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : alert.type === 'info'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {alert.action}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                S/. {stats.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 text-sm">
                {stats.revenueGrowth > 0 ? (
                  <>
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+{stats.revenueGrowth}%</span>
                  </>
                ) : (
                  <>
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-600">{stats.revenueGrowth}%</span>
                  </>
                )}
                <span className="text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reservaciones Activas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeReservations}</p>
              <div className="flex items-center mt-2 text-sm">
                <ClockIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-gray-600">42 para hoy</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TicketIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tours Completados a Tiempo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">96.5%</p>
              <div className="flex items-center mt-2 text-sm">
                <ClockIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-gray-600">sin retrasos >30min</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tours Sin Cancelaciones</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">92.8%</p>
              <div className="flex items-center mt-2 text-sm">
                <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-gray-600">cancelación último momento</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tours Sin Emergencias</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">99.1%</p>
              <div className="flex items-center mt-2 text-sm">
                <ShieldExclamationIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-gray-600">incidentes de seguridad</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Uptime del Sistema</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.uptime}%</p>
              <div className="flex items-center mt-2 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-green-600">Sistema operativo</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <GlobeAltIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secciones de acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {quickActionCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                category.color === 'blue' ? 'bg-blue-100' :
                category.color === 'green' ? 'bg-green-100' :
                category.color === 'purple' ? 'bg-purple-100' :
                'bg-yellow-100'
              }`}>
                <category.icon className={`h-6 w-6 ${
                  category.color === 'blue' ? 'text-blue-600' :
                  category.color === 'green' ? 'text-green-600' :
                  category.color === 'purple' ? 'text-purple-600' :
                  'text-yellow-600'
                }`} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
            </div>
            
            <div className="space-y-3">
              {category.actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  onClick={() => navigate(action.path)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                        action.color === 'blue' ? 'bg-blue-100' :
                        action.color === 'green' ? 'bg-green-100' :
                        action.color === 'purple' ? 'bg-purple-100' :
                        action.color === 'indigo' ? 'bg-indigo-100' :
                        action.color === 'yellow' ? 'bg-yellow-100' :
                        action.color === 'orange' ? 'bg-orange-100' :
                        action.color === 'red' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <action.icon className={`h-6 w-6 ${
                          action.color === 'blue' ? 'text-blue-600' :
                          action.color === 'green' ? 'text-green-600' :
                          action.color === 'purple' ? 'text-purple-600' :
                          action.color === 'indigo' ? 'text-indigo-600' :
                          action.color === 'yellow' ? 'text-yellow-600' :
                          action.color === 'orange' ? 'text-orange-600' :
                          action.color === 'red' ? 'text-red-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {action.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          action.badge.includes('nuevo') || action.badge.includes('8')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {action.badge}
                        </span>
                      )}
                      <div className="text-right text-sm">
                        {Object.entries(action.stats).map(([key, value]) => (
                          <div key={key} className="text-gray-600">
                            <span className="font-medium">{value}</span>
                            <span className="text-gray-500 ml-1">{key}</span>
                          </div>
                        ))}
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Interactivos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de ingresos interactivo */}
        <InteractiveRevenueChart 
          data={revenueData}
          title="Análisis de Ingresos"
          showExport={true}
          showFilters={true}
          onDataPointClick={(data) => {
            // Navegación a reportes detallados del mes
            navigate(`/admin/reports?month=${data.mes}&year=2024&view=detailed`);
          }}
          className="xl:col-span-1"
        />

        {/* Distribución de servicios interactiva */}
        <InteractiveServiceDistribution 
          data={serviceDistribution}
          title="Distribución de Servicios"
          showExport={true}
          showFilters={true}
          onSegmentClick={(data) => {
            // Navegación personalizada según el servicio
            const routes = {
              'Tours Grupales': '/reservations?type=group',
              'Tours Privados': '/reservations?type=private', 
              'Actividades': '/reservations?type=activities',
              'Transfers': '/reservations?type=transfers'
            };
            const route = routes[data.name];
            if (route) {
              navigate(route);
            }
          }}
          className="xl:col-span-1"
        />
      </div>
      
      {/* Toast Notifications - Solo para esta página si es necesario */}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminDashboard;