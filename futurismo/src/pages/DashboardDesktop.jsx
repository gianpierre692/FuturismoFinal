import { useState } from 'react';
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
  UserGroupIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DashboardDesktop = () => {
  const { user } = useAuthStore();
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
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tours Hoy</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.toursToday}</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Turistas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.touristsToday}</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+8%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${stats.revenue}</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+15%</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Guías Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeGuides}</p>
              <p className="text-xs text-gray-500 mt-2">De 22 disponibles</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingReservations}</p>
              <p className="text-xs text-yellow-600 mt-2">Requieren atención</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa Éxito</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completionRate}%</p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-600">-2%</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ingresos de la Semana</h2>
              <button className="text-sm text-primary hover:text-primary-dark">
                Ver detalles →
              </button>
            </div>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de ingresos</p>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                    <div key={idx} className="text-center">
                      <div className="h-32 bg-primary/20 rounded relative">
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-primary rounded transition-all"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-gray-600">{day}</p>
                    </div>
                  ))}
                </div>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guía
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turistas
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{tour.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {tour.guide}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {tour.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {tour.tourists}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(tour.status)}`}>
                          {getStatusText(tour.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary hover:text-primary-dark">
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <div className="p-4 border-t border-gray-200">
              <button className="w-full text-center text-sm text-primary hover:text-primary-dark">
                Ver todas las notificaciones
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Nueva Reserva</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Asignar Guía</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Generar Reporte</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </button>
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