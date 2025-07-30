import { useState, useEffect, useMemo } from 'react';
import AgencyReportsMobile from './AgencyReportsMobile';
import { ChartBarIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, UserGroupIcon, CalendarIcon, ArrowDownTrayIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  BarChart as Chart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import useAgencyStore from '../stores/agencyStore';
import UniversalExportService from '../services/universalExportService';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ExcelButton from '../components/common/ExcelButton';

const AgencyReports = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <AgencyReportsMobile />;
  }

  const { actions } = useAgencyStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportType, setReportType] = useState('monthly'); // monthly, yearly
  const [chartType, setChartType] = useState('revenue'); // revenue, reservations, participants
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Obtener datos del reporte
  const reportData = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    
    if (reportType === 'monthly') {
      return actions.getMonthlyReport(year, month);
    } else {
      return {
        yearlyData: actions.getYearlyComparison(year),
        year
      };
    }
  }, [selectedDate, reportType, actions]);

  const navigateDate = (direction) => {
    if (direction === 'prev') {
      setSelectedDate(prev => reportType === 'monthly' ? subMonths(prev, 1) : new Date(prev.getFullYear() - 1, 0, 1));
    } else {
      setSelectedDate(prev => reportType === 'monthly' ? addMonths(prev, 1) : new Date(prev.getFullYear() + 1, 0, 1));
    }
  };

  // Colores para gráficos
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Preparar datos para gráfico de barras diario (solo para vista mensual)
  const dailyChartData = useMemo(() => {
    if (reportType !== 'monthly' || !reportData.dailyData) return [];
    
    return reportData.dailyData.map(day => ({
      day: format(new Date(day.date), 'd MMM', { locale: es }),
      dayNumber: format(new Date(day.date), 'd'),
      date: day.date,
      revenue: day.revenue || 0,
      reservations: day.reservations || 0,
      participants: day.participants || 0
    }));
  }, [reportData, reportType]);

  // Preparar datos para gráfico de servicios
  const serviceChartData = useMemo(() => {
    if (reportType !== 'monthly' || !reportData.serviceBreakdown) return [];
    
    return Object.entries(reportData.serviceBreakdown).map(([service, data], index) => ({
      name: service,
      revenue: data.revenue,
      reservations: data.count,
      participants: data.participants,
      fill: colors[index % colors.length]
    }));
  }, [reportData, reportType]);

  // Preparar datos para gráfico anual
  const yearlyChartData = useMemo(() => {
    if (reportType !== 'yearly' || !reportData.yearlyData) return [];
    
    return reportData.yearlyData.map(month => ({
      month: month.monthName,
      revenue: month.totalRevenue,
      reservations: month.totalReservations,
      participants: month.totalParticipants
    }));
  }, [reportData, reportType]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  };

  const exportToExcel = () => {
    let sheetsData = [];
    
    if (reportType === 'monthly' && reportData.summary) {
      // Hoja de resumen
      const summaryData = [{
        'Métrica': 'Total Reservas',
        'Valor': reportData.summary.totalReservations
      }, {
        'Métrica': 'Ingresos Totales',
        'Valor': formatCurrency(reportData.summary.totalRevenue)
      }, {
        'Métrica': 'Total Turistas',
        'Valor': reportData.summary.totalParticipants
      }, {
        'Métrica': 'Ticket Promedio',
        'Valor': formatCurrency(reportData.summary.averageOrderValue)
      }];
      
      sheetsData.push({
        sheetName: 'Resumen Mensual',
        data: summaryData
      });
      
      // Hoja de datos diarios
      if (dailyChartData.length > 0) {
        sheetsData.push({
          sheetName: 'Ventas Diarias',
          data: dailyChartData.map(day => ({
            'Fecha': day.date,
            'Día': day.day,
            'Ingresos': formatCurrency(day.revenue),
            'Reservas': day.reservations,
            'Turistas': day.participants
          }))
        });
      }
      
      // Hoja de servicios
      if (serviceChartData.length > 0) {
        sheetsData.push({
          sheetName: 'Por Servicio',
          data: serviceChartData.map(service => ({
            'Servicio': service.name,
            'Reservas': service.reservations,
            'Turistas': service.participants,
            'Ingresos': formatCurrency(service.revenue),
            'Promedio': formatCurrency(service.reservations > 0 ? service.revenue / service.reservations : 0)
          }))
        });
      }
    } else if (reportType === 'yearly' && reportData.yearlyData) {
      // Datos anuales
      sheetsData.push({
        sheetName: `Resumen ${reportData.year}`,
        data: reportData.yearlyData.map(month => ({
          'Mes': month.monthName,
          'Reservas': month.totalReservations,
          'Turistas': month.totalParticipants,
          'Ingresos': formatCurrency(month.totalRevenue),
          'Promedio': formatCurrency(month.averageOrderValue)
        }))
      });
    }
    
    UniversalExportService.exportMultiSheetExcel(
      sheetsData, 
      `reporte_${reportType}_${format(selectedDate, 'yyyy-MM-dd')}`
    );
    toast.success('Reporte Excel exportado exitosamente');
    setShowExportOptions(false);
  };
  
  const exportToPDF = () => {
    const pdfData = [];
    let title = '';
    
    if (reportType === 'monthly' && reportData.summary) {
      title = `Reporte Mensual - ${format(selectedDate, 'MMMM yyyy', { locale: es })}`;
      
      // Agregar resumen
      pdfData.push(
        ['Total Reservas', reportData.summary.totalReservations.toString()],
        ['Ingresos Totales', formatCurrency(reportData.summary.totalRevenue)],
        ['Total Turistas', reportData.summary.totalParticipants.toString()],
        ['Ticket Promedio', formatCurrency(reportData.summary.averageOrderValue)]
      );
    } else if (reportType === 'yearly' && reportData.yearlyData) {
      title = `Reporte Anual ${reportData.year}`;
      
      // Agregar datos mensuales
      reportData.yearlyData.forEach(month => {
        pdfData.push([
          month.monthName,
          month.totalReservations.toString(),
          month.totalParticipants.toString(),
          formatCurrency(month.totalRevenue)
        ]);
      });
    }
    
    UniversalExportService.exportToPDF(pdfData, {
      filename: `reporte_${reportType}_${format(selectedDate, 'yyyy-MM-dd')}`,
      title,
      columns: reportType === 'monthly' 
        ? [{ header: 'Métrica' }, { header: 'Valor' }]
        : [{ header: 'Mes' }, { header: 'Reservas' }, { header: 'Turistas' }, { header: 'Ingresos' }]
    });
    
    toast.success('Reporte PDF exportado exitosamente');
    setShowExportOptions(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="w-8 h-8 mr-3 text-green-500" />
            Reportes de Ventas
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de tus ventas y rendimiento
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="monthly">Reporte Mensual</option>
              <option value="yearly">Reporte Anual</option>
            </select>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <ExcelButton
                  onClick={exportToExcel}
                  className="w-full justify-start rounded-b-none hover:rounded-t-lg"
                  text="Excel"
                  fullText={true}
                />
                <button
                  onClick={exportToPDF}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 rounded-b-lg border-t border-gray-100"
                >
                  <DocumentTextIcon className="w-5 h-5 text-red-600" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegación de fecha */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold capitalize">
            {reportType === 'monthly' 
              ? format(selectedDate, 'MMMM yyyy', { locale: es })
              : `Año ${selectedDate.getFullYear()}`
            }
          </h2>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      {reportType === 'monthly' && reportData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary.totalReservations}
                </p>
                <p className="text-sm text-gray-600">Total Reservas</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.totalRevenue)}
                </p>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.summary.totalParticipants}
                </p>
                <p className="text-sm text-gray-600">Total Turistas</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.summary.averageOrderValue)}
                </p>
                <p className="text-sm text-gray-600">Ticket Promedio</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico principal */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {reportType === 'monthly' ? 'Ventas Diarias' : 'Ventas Mensuales'}
            </h3>
            <div className="flex items-center space-x-2">
              {reportType === 'monthly' && (
                <>
                  {chartType === 'revenue' && <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />}
                  {chartType === 'reservations' && <CalendarIcon className="w-5 h-5 text-blue-600" />}
                  {chartType === 'participants' && <UserGroupIcon className="w-5 h-5 text-green-600" />}
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="revenue">Ingresos</option>
                    <option value="reservations">Reservas</option>
                    <option value="participants">Turistas</option>
                  </select>
                </>
              )}
              {reportType === 'yearly' && <ChartBarIcon className="w-5 h-5 text-blue-600" />}
            </div>
          </div>
          
          <div className="h-48">
            {reportType === 'monthly' && dailyChartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ChartBarIcon className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-sm font-medium">No hay datos de ventas para este período</p>
                <p className="text-xs mt-1 text-gray-400">Las ventas aparecerán aquí cuando se registren reservas</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              {reportType === 'monthly' ? (
                <Chart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [
                      chartType === 'revenue' ? formatCurrency(value) : value,
                      chartType === 'revenue' ? 'Ingresos' : 
                      chartType === 'reservations' ? 'Reservas' : 'Turistas'
                    ]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey={chartType} 
                    fill={chartType === 'revenue' ? '#8B5CF6' : chartType === 'reservations' ? '#3B82F6' : '#10B981'}
                    radius={[4, 4, 0, 0]}
                  />
                </Chart>
            ) : (
              <LineChart data={yearlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Ingresos' : 
                    name === 'reservations' ? 'Reservas' : 'Turistas'
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="reservations" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
              )}
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico de distribución por servicios (solo mensual) */}
        {reportType === 'monthly' && serviceChartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Distribución por Servicios</h3>
              <ChartPieIcon className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="revenue"
                  data={serviceChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {serviceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value), 'Ingresos']} />
              </PieChart>
            </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Tabla detallada por servicios */}
      {reportType === 'monthly' && serviceChartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalle por Tipo de Servicio
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceChartData.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: service.fill }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {service.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.reservations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.participants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(service.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(service.reservations > 0 ? service.revenue / service.reservations : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabla anual */}
      {reportType === 'yearly' && reportData.yearlyData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen Anual {reportData.year}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.yearlyData.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {month.monthName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.totalReservations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.totalParticipants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(month.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(month.averageOrderValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyReports;