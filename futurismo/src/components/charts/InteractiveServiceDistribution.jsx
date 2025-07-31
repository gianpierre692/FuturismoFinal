import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  ArrowTopRightOnSquareIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChartPieIcon,
  InformationCircleIcon,
  EyeIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import useInteractiveAdmin from '../../hooks/useInteractiveAdmin';
import UniversalExportService from '../../services/universalExportService';

const InteractiveServiceDistribution = ({ 
  data, 
  title = "Distribución de Servicios",
  showExport = true,
  showFilters = true,
  onSegmentClick,
  className = ""
}) => {
  const navigate = useNavigate();
  const { handleExport, notify } = useInteractiveAdmin();
  
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [detailView, setDetailView] = useState(false);

  // Datos expandidos con más información
  const [enrichedData, setEnrichedData] = useState([]);

  useEffect(() => {
    // Enriquecer datos con información adicional
    const enrichData = data.map((item, index) => ({
      ...item,
      id: index,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      trendValue: Math.floor(Math.random() * 20) + 1,
      customers: Math.floor(Math.random() * 500) + 100,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      growth: (Math.random() * 30 - 15).toFixed(1), // -15% a +15%
      bookings: Math.floor(Math.random() * 200) + 50
    }));
    setEnrichedData(enrichData);
  }, [data, filterPeriod]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <h4 className="font-semibold text-gray-900">{data.name}</h4>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Porcentaje:</span>
              <span className="font-medium">{data.value}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reservas:</span>
              <span className="font-medium">{data.bookings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ingresos:</span>
              <span className="font-medium">S/. {data.revenue?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tendencia:</span>
              <div className="flex items-center gap-1">
                {data.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.growth > 0 ? '+' : ''}{data.growth}%
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Manejar clic en segmento
  const handleSegmentClick = (data, index) => {
    setSelectedSegment(data);
    
    if (onSegmentClick) {
      onSegmentClick(data, index);
    } else {
      // Navegación por defecto según el tipo de servicio
      const navigationMap = {
        'Tours Grupales': '/reservations?filter=group',
        'Tours Privados': '/reservations?filter=private',
        'Actividades': '/reservations?filter=activities',
        'Transfers': '/reservations?filter=transfers'
      };
      
      const path = navigationMap[data.name];
      if (path) {
        notify.info(`Navegando a ${data.name}...`);
        setTimeout(() => navigate(path), 500);
      }
    }
  };

  // Exportar datos del gráfico
  const handleExportChart = async () => {
    await handleExport(async () => {
      const exportData = enrichedData.map(item => ({
        'Servicio': item.name,
        'Porcentaje': `${item.value}%`,
        'Reservas': item.bookings,
        'Clientes': item.customers,
        'Ingresos': `S/. ${item.revenue?.toLocaleString()}`,
        'Crecimiento': `${item.growth}%`,
        'Tendencia': item.trend === 'up' ? 'Ascendente' : 'Descendente'
      }));
      
      UniversalExportService.exportToExcel(
        exportData, 
        `distribucion_servicios_${filterPeriod}`, 
        'Distribución de Servicios'
      );
    }, 'Excel');
  };

  // Animación personalizada para las celdas
  const AnimatedCell = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, ...props }) => {
    const [animatedRadius, setAnimatedRadius] = useState(innerRadius);
    const isHovered = hoveredSegment === index;
    const isSelected = selectedSegment?.id === index;

    useEffect(() => {
      if (isHovered || isSelected) {
        setAnimatedRadius(outerRadius + 5);
      } else {
        setAnimatedRadius(outerRadius);
      }
    }, [isHovered, isSelected, outerRadius]);

    return (
      <Cell 
        {...props} 
        style={{
          filter: isHovered ? 'brightness(1.1)' : isSelected ? 'brightness(0.9)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      />
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header mejorado */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChartPieIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">
                Análisis interactivo de servicios - {filterPeriod === 'month' ? 'Este mes' : 'Este año'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showFilters && (
              <>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="quarter">Este trimestre</option>
                  <option value="year">Este año</option>
                </select>
                
                <button
                  onClick={() => setDetailView(!detailView)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver/ocultar detalles"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico principal */}
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={enrichedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  onClick={handleSegmentClick}
                  onMouseEnter={(data, index) => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {enrichedData.map((entry, index) => (
                    <AnimatedCell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      index={index}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centro del gráfico con información */}
            <div className="relative -mt-80 pointer-events-none">
              <div className="flex flex-col items-center justify-center h-80">
                <div className="bg-white rounded-full p-4 shadow-sm border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {enrichedData.reduce((sum, item) => sum + item.bookings, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Reservas</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {filterPeriod === 'month' ? 'Este mes' : 'Este año'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de detalles */}
          <div className="space-y-4">
            {/* Leyenda interactiva */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <InformationCircleIcon className="w-4 h-4" />
                Servicios
              </h4>
              {enrichedData.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedSegment?.id === index
                      ? 'border-blue-500 bg-blue-50'
                      : hoveredSegment === index
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSegmentClick(item, index)}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-900 text-sm">
                        {item.name}
                      </span>
                    </div>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Participación:</span>
                      <span className="font-semibold text-gray-900">{item.value}%</span>
                    </div>
                    
                    {detailView && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Reservas:</span>
                          <span className="font-medium">{item.bookings}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Ingresos:</span>
                          <span className="font-medium">S/. {item.revenue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs items-center">
                          <span className="text-gray-600">Tendencia:</span>
                          <div className="flex items-center gap-1">
                            {item.trend === 'up' ? (
                              <ArrowTrendingUpIcon className="w-3 h-3 text-green-500" />
                            ) : (
                              <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                            )}
                            <span className={`text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                              {item.growth > 0 ? '+' : ''}{item.growth}%
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Información del segmento seleccionado */}
            {selectedSegment && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Detalles de {selectedSegment.name}</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Clientes únicos:</span>
                    <span className="font-medium">{selectedSegment.customers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio por reserva:</span>
                    <span className="font-medium">
                      S/. {Math.floor(selectedSegment.revenue / selectedSegment.bookings).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de conversión:</span>
                    <span className="font-medium">
                      {((selectedSegment.bookings / selectedSegment.customers) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveServiceDistribution;