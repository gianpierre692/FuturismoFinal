import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  ChartBarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  Squares2X2Icon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import useInteractiveAdmin from '../../hooks/useInteractiveAdmin';
import UniversalExportService from '../../services/universalExportService';

const InteractiveRevenueChart = ({ 
  data, 
  title = "Ingresos Mensuales",
  showExport = true,
  showFilters = true,
  onDataPointClick,
  className = ""
}) => {
  const navigate = useNavigate();
  const { handleExport, notify } = useInteractiveAdmin();
  
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [chartType, setChartType] = useState('line'); // 'line' o 'bar'
  const [hoveredData, setHoveredData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  // Datos enriquecidos con comparaciones
  const [enrichedData, setEnrichedData] = useState([]);

  useEffect(() => {
    // Enriquecer datos con información adicional
    const enrichData = data.map((item, index) => {
      const prevValue = index > 0 ? data[index - 1].valor : item.valor;
      const growth = ((item.valor - prevValue) / prevValue) * 100;
      
      return {
        ...item,
        id: index,
        growth: growth.toFixed(1),
        isPositive: growth > 0,
        reservations: Math.floor((item.valor / 1500) + Math.random() * 50), // Estimación de reservas
        avgTicket: Math.floor(item.valor / (Math.floor(item.valor / 1500) + Math.random() * 50)),
        customers: Math.floor((item.valor / 2000) + Math.random() * 30)
      };
    });
    setEnrichedData(enrichData);
  }, [data, selectedPeriod]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[220px]">
          <h4 className="font-semibold text-gray-900 mb-2">{label}</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos:</span>
              <span className="font-bold text-green-600">
                S/. {data.valor?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Crecimiento:</span>
              <div className="flex items-center gap-1">
                {data.isPositive ? (
                  <ArrowTrendingUpIcon className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-sm font-medium ${data.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {data.growth > 0 ? '+' : ''}{data.growth}%
                </span>
              </div>
            </div>
            <div className="border-t pt-2 mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Reservas:</span>
                <span className="font-medium">{data.reservations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket promedio:</span>
                <span className="font-medium">S/. {data.avgTicket?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clientes:</span>
                <span className="font-medium">{data.customers}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2 pt-2 border-t">
              Click para ver detalles
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Manejar clic en punto de datos
  const handleDataPointClick = (data, index) => {
    setSelectedData(data);
    
    if (onDataPointClick) {
      onDataPointClick(data, index);
    } else {
      notify.info(`Mostrando detalles de ${data.mes}...`);
      // Navegar a reportes detallados del mes
      navigate(`/admin/reports?month=${data.mes}&year=2024`);
    }
  };

  // Exportar datos del gráfico
  const handleExportChart = async () => {
    await handleExport(async () => {
      const exportData = enrichedData.map(item => ({
        'Mes': item.mes,
        'Ingresos': `S/. ${item.valor?.toLocaleString()}`,
        'Crecimiento': `${item.growth}%`,
        'Reservas': item.reservations,
        'Ticket Promedio': `S/. ${item.avgTicket?.toLocaleString()}`,
        'Clientes': item.customers
      }));
      
      UniversalExportService.exportToExcel(
        exportData, 
        `ingresos_${selectedPeriod}`, 
        'Análisis de Ingresos'
      );
    }, 'Excel');
  };

  // Obtener estadísticas del período
  const getStats = () => {
    if (enrichedData.length === 0) return {};
    
    const totalRevenue = enrichedData.reduce((sum, item) => sum + item.valor, 0);
    const avgRevenue = totalRevenue / enrichedData.length;
    const maxMonth = enrichedData.reduce((max, item) => item.valor > max.valor ? item : max);
    const minMonth = enrichedData.reduce((min, item) => item.valor < min.valor ? item : min);
    
    return {
      total: totalRevenue,
      average: avgRevenue,
      maxMonth: maxMonth.mes,
      maxValue: maxMonth.valor,
      minMonth: minMonth.mes,
      minValue: minMonth.valor,
      trend: enrichedData[enrichedData.length - 1]?.growth || 0
    };
  };

  const stats = getStats();

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header mejorado */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">
                Análisis interactivo de ingresos - Últimos 6 meses
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showFilters && (
              <>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="3months">3 meses</option>
                  <option value="6months">6 meses</option>
                  <option value="12months">12 meses</option>
                  <option value="24months">24 meses</option>
                </select>
                
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-2 text-xs ${chartType === 'line' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    title="Gráfico de líneas"
                  >
                    <PresentationChartLineIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-2 text-xs ${chartType === 'bar' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    title="Gráfico de barras"
                  >
                    <ChartBarIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Mostrar/ocultar comparación"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </>
            )}
            
            {showExport && (
              <button
                onClick={handleExportChart}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Exportar datos"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Estadísticas rápidas */}
        {showComparison && (
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                S/. {stats.total?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                S/. {Math.floor(stats.average)?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {stats.maxMonth}
              </div>
              <div className="text-xs text-gray-600">Mejor mes</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${parseFloat(stats.trend) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.trend > 0 ? '+' : ''}{stats.trend}%
              </div>
              <div className="text-xs text-gray-600">Tendencia</div>
            </div>
          </div>
        )}

        {/* Gráfico principal */}
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={350}>
            {chartType === 'line' ? (
              <LineChart 
                data={enrichedData}
                onClick={handleDataPointClick}
                onMouseMove={(data) => setHoveredData(data?.activePayload?.[0]?.payload)}
                onMouseLeave={() => setHoveredData(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ 
                    fill: '#10B981', 
                    strokeWidth: 2, 
                    r: 5,
                    cursor: 'pointer'
                  }}
                  activeDot={{ 
                    r: 8, 
                    stroke: '#10B981',
                    strokeWidth: 2,
                    fill: '#ffffff'
                  }}
                />
              </LineChart>
            ) : (
              <BarChart 
                data={enrichedData}
                onClick={handleDataPointClick}
                onMouseMove={(data) => setHoveredData(data?.activePayload?.[0]?.payload)}
                onMouseLeave={() => setHoveredData(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="valor" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Información del punto seleccionado */}
        {selectedData && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Detalles de {selectedData.mes}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  S/. {selectedData.valor?.toLocaleString()}
                </div>
                <div className="text-sm text-green-700">Ingresos totales</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedData.reservations}
                </div>
                <div className="text-sm text-blue-700">Reservas completadas</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveRevenueChart;