import React, { useMemo } from 'react';
import { 
  UsersIcon as Users,
  CalendarIcon as Calendar,
  CurrencyDollarIcon as DollarSign,
  ArrowTrendingUpIcon as TrendingUp,
  MapPinIcon as MapPin,
  StarIcon as Star,
  ChartBarIcon as BarChart3,
  ChartPieIcon as PieChart
} from '@heroicons/react/24/outline';

const ReservationStats = ({ reservations = [], filters = {} }) => {
  
  // Calcular estadísticas detalladas
  const stats = useMemo(() => {
    if (!reservations.length) {
      return {
        totalClients: 0,
        totalTourists: 0,
        totalRevenue: 0,
        avgGroupSize: 0,
        avgRevenuePerClient: 0,
        topDestinations: [],
        topGuides: [],
        monthlyTrend: [],
        tourTypeDistribution: []
      };
    }

    const totalClients = reservations.length;
    const totalTourists = reservations.reduce((sum, res) => sum + res.tourists, 0);
    const totalRevenue = reservations.reduce((sum, res) => sum + res.totalAmount, 0);
    const avgGroupSize = totalClients > 0 ? (totalTourists / totalClients) : 0;
    const avgRevenuePerClient = totalClients > 0 ? (totalRevenue / totalClients) : 0;

    // Top destinos
    const destinationCounts = reservations.reduce((acc, res) => {
      acc[res.destination] = (acc[res.destination] || 0) + 1;
      return acc;
    }, {});
    
    const topDestinations = Object.entries(destinationCounts)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top guías
    const guideCounts = reservations.reduce((acc, res) => {
      acc[res.guide] = (acc[res.guide] || 0) + 1;
      return acc;
    }, {});
    
    const topGuides = Object.entries(guideCounts)
      .map(([guide, count]) => ({ guide, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Distribución por tipo de tour
    const tourTypeCounts = reservations.reduce((acc, res) => {
      acc[res.tourType] = (acc[res.tourType] || 0) + 1;
      return acc;
    }, {});
    
    const tourTypeDistribution = Object.entries(tourTypeCounts)
      .map(([type, count]) => ({ 
        type: type.charAt(0).toUpperCase() + type.slice(1), 
        count,
        percentage: ((count / totalClients) * 100).toFixed(1)
      }));

    // Tendencia mensual (simulada para los datos de ejemplo)
    const monthlyTrend = [
      { month: 'Ene', clients: Math.floor(totalClients * 0.8), revenue: totalRevenue * 0.8 },
      { month: 'Feb', clients: Math.floor(totalClients * 0.9), revenue: totalRevenue * 0.9 },
      { month: 'Mar', clients: totalClients, revenue: totalRevenue }
    ];

    return {
      totalClients,
      totalTourists,
      totalRevenue,
      avgGroupSize,
      avgRevenuePerClient,
      topDestinations,
      topGuides,
      monthlyTrend,
      tourTypeDistribution
    };
  }, [reservations]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end">
          <Icon className={`w-6 h-6 text-${color}-600 mb-2`} />
          {trend && (
            <span className={`text-xs font-medium ${
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Clientes"
          value={stats.totalClients.toLocaleString()}
          subtitle="Reservas completadas"
          icon={Users}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Total Turistas"
          value={stats.totalTourists.toLocaleString()}
          subtitle="Personas atendidas"
          icon={TrendingUp}
          color="green"
          trend="+18%"
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Ventas acumuladas"
          icon={DollarSign}
          color="purple"
          trend="+23%"
        />
        <StatCard
          title="Promedio por Grupo"
          value={stats.avgGroupSize.toFixed(1)}
          subtitle="Personas por reserva"
          icon={BarChart3}
          color="orange"
          trend="+5%"
        />
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Promedio por Cliente"
          value={formatCurrency(stats.avgRevenuePerClient)}
          subtitle="Valor promedio de reserva"
          icon={Star}
          color="yellow"
          trend="+8%"
        />
        <StatCard
          title="Destinos Activos"
          value={stats.topDestinations.length}
          subtitle="Ubicaciones disponibles"
          icon={MapPin}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Destinos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Top Destinos</h3>
          </div>
          <div className="space-y-3">
            {stats.topDestinations.map((item, index) => (
              <div key={item.destination} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {item.destination}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">reservas</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Guías */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Top Guías</h3>
          </div>
          <div className="space-y-3">
            {stats.topGuides.map((item, index) => (
              <div key={item.guide} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {item.guide}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">tours</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Tipo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Tipos de Tour</h3>
          </div>
          <div className="space-y-3">
            {stats.tourTypeDistribution.map((item, index) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 
                    index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-800">
                    {item.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tendencia Mensual */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Tendencia de Clientes</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {stats.monthlyTrend.map((month) => (
            <div key={month.month} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{month.month}</div>
              <div className="text-xl font-bold text-gray-900 mb-1">{month.clients}</div>
              <div className="text-xs text-gray-500">clientes</div>
              <div className="text-sm font-medium text-green-600 mt-1">
                {formatCurrency(month.revenue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationStats;