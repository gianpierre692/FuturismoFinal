import { useState } from 'react';
import { 
  ChartBarIcon,
  MapIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import InteractiveCard from '../../components/common/InteractiveCard';
import InteractiveButton from '../../components/common/InteractiveButton';
import ExcelButton from '../../components/common/ExcelButton';
import SafeChart from '../../components/charts/SafeChart';
import Logger from '../../utils/logger';

const RouteAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, routes, performance
  
  // Datos de rutas más rentables
  const routesProfitability = [
    { route: 'Machu Picchu Express', revenue: 145000, tours: 120, avgTourists: 18, profit: 87000, margin: 60 },
    { route: 'Valle Sagrado VIP', revenue: 98000, tours: 85, avgTourists: 12, profit: 58800, margin: 60 },
    { route: 'City Tour Cusco', revenue: 76000, tours: 152, avgTourists: 15, profit: 38000, margin: 50 },
    { route: 'Laguna Humantay', revenue: 65000, tours: 65, avgTourists: 20, profit: 39000, margin: 60 },
    { route: 'Montaña 7 Colores', revenue: 58000, tours: 58, avgTourists: 22, profit: 34800, margin: 60 },
    { route: 'Salineras Maras', revenue: 42000, tours: 70, avgTourists: 10, profit: 21000, margin: 50 },
    { route: 'Tour Lima Colonial', revenue: 35000, tours: 100, avgTourists: 8, profit: 14000, margin: 40 },
    { route: 'Islas Ballestas', revenue: 32000, tours: 40, avgTourists: 25, profit: 16000, margin: 50 }
  ];

  // Datos de tendencia mensual
  const monthlyTrend = [
    { month: 'Ene', revenue: 285000, tours: 342, satisfaction: 4.5 },
    { month: 'Feb', revenue: 312000, tours: 378, satisfaction: 4.6 },
    { month: 'Mar', revenue: 298000, tours: 365, satisfaction: 4.4 },
    { month: 'Abr', revenue: 345000, tours: 402, satisfaction: 4.7 },
    { month: 'May', revenue: 378000, tours: 425, satisfaction: 4.8 },
    { month: 'Jun', revenue: 425000, tours: 468, satisfaction: 4.9 }
  ];

  // Datos de desempeño por categoría
  const performanceByCategory = [
    { category: 'Cultural', value: 35, fill: '#3B82F6' },
    { category: 'Aventura', value: 30, fill: '#10B981' },
    { category: 'Naturaleza', value: 20, fill: '#F59E0B' },
    { category: 'Místico', value: 10, fill: '#8B5CF6' },
    { category: 'Gastronómico', value: 5, fill: '#EF4444' }
  ];

  // Datos de desempeño de guías
  const guidesPerformance = [
    { name: 'Carlos Mendoza', tours: 85, rating: 4.9, revenue: 42500, tourists: 1020 },
    { name: 'Ana Rodriguez', tours: 78, rating: 4.8, revenue: 39000, tourists: 936 },
    { name: 'Pedro Silva', tours: 72, rating: 4.7, revenue: 36000, tourists: 864 },
    { name: 'Maria Torres', tours: 68, rating: 4.9, revenue: 34000, tourists: 816 },
    { name: 'Juan Castro', tours: 65, rating: 4.6, revenue: 32500, tourists: 780 }
  ];

  // Datos de análisis por zona
  const zoneAnalysis = [
    { zone: 'Cusco', tours: 450, revenue: 450000, growth: 15 },
    { zone: 'Lima', tours: 280, revenue: 140000, growth: 8 },
    { zone: 'Arequipa', tours: 120, revenue: 72000, growth: 12 },
    { zone: 'Puno', tours: 85, revenue: 51000, growth: -5 },
    { zone: 'Ica', tours: 65, revenue: 32500, growth: 20 }
  ];

  // Métricas de comparación para radar chart
  const radarData = selectedRoute ? [
    { metric: 'Rentabilidad', value: 85 },
    { metric: 'Popularidad', value: 92 },
    { metric: 'Satisfacción', value: 88 },
    { metric: 'Ocupación', value: 75 },
    { metric: 'Frecuencia', value: 80 },
    { metric: 'Crecimiento', value: 70 }
  ] : [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  const calculateGrowth = (current, previous) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="page-container">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Análisis de Rutas y Desempeño</h1>
                <p className="text-sm text-gray-600">Identifica las rutas más rentables y el rendimiento del sistema</p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
              <ExcelButton
                onClick={() => Logger.debug('Exportar análisis')}
                text="Exportar"
                fullText={true}
              />
              <InteractiveButton
                variant="secondary"
                icon={ArrowPathIcon}
                onClick={() => window.location.reload()}
              >
                Actualizar
              </InteractiveButton>
            </div>
          </div>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <InteractiveCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">S/. 425,000</p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12.4%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tours Realizados</p>
                <p className="text-2xl font-bold text-gray-900">468</p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+9.8%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfacción Promedio</p>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                <div className="flex items-center mt-2 text-sm">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-gray-600">96% positivo</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupación Promedio</p>
                <p className="text-2xl font-bold text-gray-900">82%</p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">-3.2%</span>
                  <span className="text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </InteractiveCard>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'routes', 'performance'].map(view => (
            <button
              key={view}
              onClick={() => setViewMode(view)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                viewMode === view
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {view === 'overview' ? 'Vista General' :
               view === 'routes' ? 'Análisis de Rutas' : 'Desempeño'}
            </button>
          ))}
        </div>

        {/* Contenido según vista seleccionada */}
        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendencia de ingresos */}
            <InteractiveCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos y Tours</h3>
              <SafeChart height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      name="Ingresos (S/.)"
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="tours" 
                      stroke="#10B981" 
                      name="Tours"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </SafeChart>
            </InteractiveCard>

            {/* Distribución por categoría */}
            <InteractiveCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h3>
              <SafeChart height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </SafeChart>
            </InteractiveCard>
          </div>
        )}

        {viewMode === 'routes' && (
          <div className="space-y-6">
            {/* Tabla de rutas más rentables */}
            <InteractiveCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rutas Más Rentables</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ruta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promedio Turistas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Margen
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {routesProfitability.map((route, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{route.route}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">S/. {route.revenue.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{route.tours}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{route.avgTourists}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            S/. {route.profit.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            route.margin >= 60 ? 'bg-green-100 text-green-800' :
                            route.margin >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {route.margin}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedRoute(route)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Analizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InteractiveCard>

            {/* Análisis detallado de ruta seleccionada */}
            {selectedRoute && (
              <InteractiveCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Análisis Detallado: {selectedRoute.route}
                </h3>
                <SafeChart height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Métricas" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </SafeChart>
              </InteractiveCard>
            )}
          </div>
        )}

        {viewMode === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Desempeño por zona */}
            <InteractiveCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Desempeño por Zona</h3>
              <div className="space-y-4">
                {zoneAnalysis.map((zone, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{zone.zone}</p>
                      <p className="text-sm text-gray-600">{zone.tours} tours • S/. {zone.revenue.toLocaleString()}</p>
                    </div>
                    <div className={`flex items-center ${zone.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {zone.growth > 0 ? <ArrowTrendingUpIcon className="h-5 w-5 mr-1" /> : <ArrowTrendingDownIcon className="h-5 w-5 mr-1" />}
                      <span className="font-medium">{zone.growth > 0 ? '+' : ''}{zone.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </InteractiveCard>

            {/* Top guías */}
            <InteractiveCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Guías por Desempeño</h3>
              <div className="space-y-4">
                {guidesPerformance.map((guide, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                        {guide.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{guide.name}</p>
                        <p className="text-sm text-gray-600">{guide.tours} tours • {guide.tourists} turistas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <StarIcon className="h-4 w-4 fill-current" />
                        <span className="font-medium">{guide.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">S/. {guide.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InteractiveCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteAnalytics;