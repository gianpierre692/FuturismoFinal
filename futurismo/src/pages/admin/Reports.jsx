import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TicketIcon,
  MapIcon,
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { reportsAPI } from '../../services/api';
import toast from 'react-hot-toast';

function Reports() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileDatePicker, setShowMobileDatePicker] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, destinations, providers, trends
  const [reportData, setReportData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProviders: 0,
    topDestinations: [],
    topProviders: [],
    bookingsByStatus: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    },
    revenueByMonth: [],
    growthRate: 12.5,
    avgBookingValue: 382.35,
    conversionRate: 68.5,
    customerSatisfaction: 4.6
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadReports();
  }, [startDate, endDate]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const today = new Date();
    
    switch(range) {
      case 'week':
        setStartDate(startOfWeek(today, { locale: es }));
        setEndDate(endOfWeek(today, { locale: es }));
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case 'custom':
        // Mantener las fechas personalizadas
        break;
      default:
        break;
    }
  };

  const loadReports = async () => {
    setLoading(true);

    // Simular una demora para mostrar el loading
    setTimeout(() => {
      // Usar datos mock directamente
      const mockData = {
        totalBookings: 85,
        totalRevenue: 32500,
        totalUsers: 156,
        totalProviders: 24,
        bookingsByStatus: {
          pending: 12,
          confirmed: 28,
          completed: 35,
          cancelled: 10
        },
        topDestinations: [
          { location: 'Machu Picchu', count: 45, growth: 15.2 },
          { location: 'Valle Sagrado', count: 32, growth: -5.8 },
          { location: 'Cusco City Tour', count: 28, growth: 8.4 },
          { location: 'Sacsayhuamán', count: 18, growth: 12.1 },
          { location: 'Ollantaytambo', count: 12, growth: -2.3 }
        ],
        topProviders: [
          { providerId: '1', providerName: 'Inca Rail', count: 25, revenue: 15000, rating: 4.8 },
          { providerId: '2', providerName: 'Peru Rail', count: 20, revenue: 12000, rating: 4.6 },
          { providerId: '3', providerName: 'Sky Airlines', count: 18, revenue: 9000, rating: 4.5 },
          { providerId: '4', providerName: 'Hotel Cusco Plaza', count: 15, revenue: 7500, rating: 4.7 },
          { providerId: '5', providerName: 'Restaurante Cicciolina', count: 12, revenue: 3000, rating: 4.9 }
        ],
        revenueByMonth: [
          { month: 'Ene', revenue: 28500 },
          { month: 'Feb', revenue: 31200 },
          { month: 'Mar', revenue: 32500 }
        ],
        growthRate: 12.5,
        avgBookingValue: 382.35,
        conversionRate: 68.5,
        customerSatisfaction: 4.6
      };
      
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  };

  const exportToCSV = () => {
    // Exportar directamente sin usar la API
    const headers = ['Métrica', 'Valor'];
    const rows = [
      ['Total Reservas', reportData.totalBookings],
      ['Ingresos Totales', `S/. ${(reportData.totalRevenue || 0).toFixed(2)}`],
      ['Total Usuarios', reportData.totalUsers],
      ['Total Proveedores', reportData.totalProviders],
      '',
      ['Estados de Reservas', ''],
      ...Object.entries(reportData.bookingsByStatus || {}).map(([status, count]) => [status, count]),
      '',
      ['Top Destinos', ''],
      ...(reportData.topDestinations || []).map(d => [d.location, d.count]),
      '',
      ['Top Proveedores', ''],
      ...(reportData.topProviders || []).map(p => [p.providerName, `S/. ${(p.revenue || 0).toFixed(2)}`])
    ];

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Reporte exportado exitosamente');
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend, compact = false }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };

    if (compact) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 truncate">{title}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              {trend && (
                <div className="flex items-center mt-1">
                  {trend > 0 ? (
                    <ArrowTrendingUpIcon className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(trend)}%
                  </span>
                </div>
              )}
            </div>
            <Icon className={`w-6 h-6 ${colorClasses[color]} p-1 rounded flex-shrink-0`} />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="mt-1 text-xs lg:text-sm text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                {trend > 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend)}% vs mes anterior
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 ${colorClasses[color]} rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  const MobileDatePicker = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl p-4 max-h-[50vh]">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        
        <h3 className="text-lg font-semibold mb-4">Seleccionar Período</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => {
              handleDateRangeChange('week');
              setShowMobileDatePicker(false);
            }}
            className={`w-full p-3 rounded-lg text-left ${
              dateRange === 'week' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50'
            } border`}
          >
            <div className="font-medium">Esta Semana</div>
            <div className="text-sm text-gray-600">
              {format(startOfWeek(new Date(), { locale: es }), 'dd MMM', { locale: es })} - 
              {format(endOfWeek(new Date(), { locale: es }), 'dd MMM', { locale: es })}
            </div>
          </button>

          <button
            onClick={() => {
              handleDateRangeChange('month');
              setShowMobileDatePicker(false);
            }}
            className={`w-full p-3 rounded-lg text-left ${
              dateRange === 'month' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50'
            } border`}
          >
            <div className="font-medium">Este Mes</div>
            <div className="text-sm text-gray-600">
              {format(new Date(), 'MMMM yyyy', { locale: es })}
            </div>
          </button>

          <button
            onClick={() => {
              handleDateRangeChange('custom');
              setShowMobileDatePicker(false);
            }}
            className={`w-full p-3 rounded-lg text-left ${
              dateRange === 'custom' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50'
            } border`}
          >
            <div className="font-medium">Personalizado</div>
            <div className="text-sm text-gray-600">Selecciona fechas específicas</div>
          </button>
        </div>

        <button
          onClick={() => setShowMobileDatePicker(false)}
          className="w-full mt-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  const MobileTabBar = () => (
    <div className="bg-white border-b sticky top-0 z-40">
      <div className="flex overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'General', icon: ChartBarIcon },
          { id: 'destinations', label: 'Destinos', icon: MapIcon },
          { id: 'providers', label: 'Proveedores', icon: UserGroupIcon },
          { id: 'trends', label: 'Tendencias', icon: PresentationChartLineIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[100px] flex flex-col items-center gap-1 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Tab Bar */}
      {isMobile && <MobileTabBar />}
      
      <div className="px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <ChartBarIcon className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Reportes</h1>
                  <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                    Análisis y métricas del negocio
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Mobile Date Selector */}
                {isMobile ? (
                  <button
                    onClick={() => setShowMobileDatePicker(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {dateRange === 'week' ? 'Semana' : dateRange === 'month' ? 'Mes' : 'Personalizado'}
                    </span>
                  </button>
                ) : (
                  /* Desktop Selector de rango */
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDateRangeChange('week')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        dateRange === 'week'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Semana
                    </button>
                    <button
                      onClick={() => handleDateRangeChange('month')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        dateRange === 'month'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mes
                    </button>
                    <button
                      onClick={() => handleDateRangeChange('custom')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        dateRange === 'custom'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Personalizado
                    </button>
                  </div>
                )}

                {/* Selector de fechas para rango personalizado */}
                {dateRange === 'custom' && !isMobile && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={format(startDate, 'yyyy-MM-dd')}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={format(endDate, 'yyyy-MM-dd')}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={loadReports}
                    className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    title="Actualizar"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    <DocumentArrowDownIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                    <span className="hidden sm:inline">Exportar CSV</span>
                    <span className="sm:hidden">CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Date Range Info */}
            {dateRange === 'custom' && isMobile && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={format(startDate, 'yyyy-MM-dd')}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="date"
                    value={format(endDate, 'yyyy-MM-dd')}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}
            
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              {format(startDate, 'dd MMM', { locale: es })} - {format(endDate, 'dd MMM yyyy', { locale: es })}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile && activeTab === 'overview' && (
                <>
                  {/* Compact Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      icon={TicketIcon}
                      title="Reservas"
                      value={reportData.totalBookings}
                      color="blue"
                      trend={reportData.growthRate}
                      compact={true}
                    />
                    <StatCard
                      icon={CurrencyDollarIcon}
                      title="Ingresos"
                      value={`S/. ${(reportData.totalRevenue || 0).toFixed(0)}`}
                      color="green"
                      trend={8.3}
                      compact={true}
                    />
                    <StatCard
                      icon={UserGroupIcon}
                      title="Usuarios"
                      value={reportData.totalUsers}
                      color="purple"
                      trend={3.5}
                      compact={true}
                    />
                    <StatCard
                      icon={MapIcon}
                      title="Proveedores"
                      value={reportData.totalProviders}
                      color="orange"
                      compact={true}
                    />
                  </div>

                  {/* KPIs */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Indicadores Clave</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valor Promedio</span>
                        <span className="font-semibold">S/. {reportData.avgBookingValue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tasa Conversión</span>
                        <span className="font-semibold">{reportData.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfacción</span>
                        <div className="flex items-center">
                          <span className="font-semibold mr-1">{reportData.customerSatisfaction}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Distribution */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Estados de Reservas</h3>
                    <div className="space-y-2">
                      {Object.entries(reportData.bookingsByStatus || {}).map(([status, count]) => {
                        const total = Object.values(reportData.bookingsByStatus).reduce((a, b) => a + b, 0);
                        const percentage = ((count / total) * 100).toFixed(1);
                        return (
                          <div key={status}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize text-gray-700">{status}</span>
                              <span className="font-medium">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  status === 'completed' ? 'bg-green-500' :
                                  status === 'confirmed' ? 'bg-blue-500' :
                                  status === 'pending' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Destinations Tab */}
              {isMobile && activeTab === 'destinations' && (
                <div className="space-y-3">
                  {(reportData.topDestinations || []).map((destination, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{destination.location}</h4>
                          <p className="text-sm text-gray-600">{destination.count} reservas</p>
                        </div>
                        <span className={`text-sm font-medium ${
                          destination.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {destination.growth > 0 ? '+' : ''}{destination.growth}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(destination.count / 45) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Providers Tab */}
              {isMobile && activeTab === 'providers' && (
                <div className="space-y-3">
                  {(reportData.topProviders || []).map((provider, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{provider.providerName}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${
                                i < Math.floor(provider.rating) ? 'text-yellow-500' : 'text-gray-300'
                              }`}>★</span>
                            ))}
                            <span className="text-sm text-gray-600 ml-1">({provider.rating})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">S/. {(provider.revenue || 0).toFixed(0)}</p>
                          <p className="text-xs text-gray-600">{provider.count} ventas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Trends Tab */}
              {isMobile && activeTab === 'trends' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Tendencia de Ingresos</h3>
                    <div className="space-y-2">
                      {(reportData.revenueByMonth || []).map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{item.month}</span>
                          <span className="font-semibold">S/. {(item.revenue || 0).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <h3 className="font-semibold mb-2">Resumen Ejecutivo</h3>
                    <p className="text-sm opacity-90">
                      El crecimiento del {reportData.growthRate}% este mes supera el objetivo. 
                      La satisfacción del cliente se mantiene alta en {reportData.customerSatisfaction}/5.
                    </p>
                  </div>
                </div>
              )}

              {/* Desktop View */}
              {!isMobile && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <StatCard
                      icon={TicketIcon}
                      title="Total Reservas"
                      value={reportData.totalBookings}
                      subtitle="En el período seleccionado"
                      color="blue"
                      trend={reportData.growthRate}
                    />
                    <StatCard
                      icon={CurrencyDollarIcon}
                      title="Ingresos Totales"
                      value={`S/. ${(reportData.totalRevenue || 0).toFixed(2)}`}
                      subtitle="Suma de todas las reservas"
                      color="green"
                      trend={8.3}
                    />
                    <StatCard
                      icon={UserGroupIcon}
                      title="Total Usuarios"
                      value={reportData.totalUsers}
                      subtitle="Usuarios registrados"
                      color="purple"
                      trend={3.5}
                    />
                    <StatCard
                      icon={MapIcon}
                      title="Total Proveedores"
                      value={reportData.totalProviders}
                      subtitle="Proveedores activos"
                      color="orange"
                    />
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Valor Promedio</span>
                        <PresentationChartLineIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">S/. {reportData.avgBookingValue}</p>
                      <p className="text-xs text-gray-500 mt-1">Por reserva</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Tasa Conversión</span>
                        <ChartPieIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{reportData.conversionRate}%</p>
                      <p className="text-xs text-green-600 mt-1">+2.3% vs mes anterior</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Satisfacción</span>
                        <UserGroupIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-gray-900 mr-2">{reportData.customerSatisfaction}</p>
                        <span className="text-yellow-500 text-xl">★</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Promedio de reseñas</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Crecimiento</span>
                        <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">+{reportData.growthRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">vs período anterior</p>
                    </div>
                  </div>

                  {/* Charts and Tables */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Booking Status */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Estados de Reservas</h2>
                      <div className="space-y-4">
                        {Object.entries(reportData.bookingsByStatus || {}).map(([status, count]) => {
                          const total = Object.values(reportData.bookingsByStatus).reduce((a, b) => a + b, 0);
                          const percentage = ((count / total) * 100).toFixed(1);
                          return (
                            <div key={status}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700 capitalize">{status}</span>
                                <span className="font-semibold">{count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full transition-all duration-500 ${
                                    status === 'completed' ? 'bg-green-500' :
                                    status === 'confirmed' ? 'bg-blue-500' :
                                    status === 'pending' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top Destinations */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Destinos</h2>
                      <div className="space-y-3">
                        {(reportData.topDestinations || []).map((destination, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                              <div>
                                <p className="font-medium text-gray-900">{destination.location}</p>
                                <p className="text-sm text-gray-600">{destination.count} reservas</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-medium ${
                                destination.growth > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {destination.growth > 0 ? '+' : ''}{destination.growth}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Providers Table */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Top Proveedores por Ingresos</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Ver todos →
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Proveedor
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Calificación
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reservas
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ingresos
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Promedio
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {(reportData.topProviders || []).map((provider, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-semibold">
                                        {provider.providerName.charAt(0)}
                                      </span>
                                    </div>
                                    <span className="ml-3 font-medium text-gray-900">
                                      {provider.providerName}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={`text-sm ${
                                        i < Math.floor(provider.rating) ? 'text-yellow-500' : 'text-gray-300'
                                      }`}>★</span>
                                    ))}
                                    <span className="ml-1 text-sm text-gray-600">({provider.rating})</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                                  {provider.count}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="font-semibold text-gray-900">
                                    S/. {(provider.revenue || 0).toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                                  S/. {((provider.revenue || 0) / provider.count).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Revenue Trend */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos</h2>
                      <div className="grid grid-cols-3 gap-4">
                        {(reportData.revenueByMonth || []).map((item, index) => (
                          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">{item.month}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">
                              S/. {(item.revenue || 0).toFixed(0)}
                            </p>
                            {index > 0 && (
                              <p className="text-xs text-green-600 mt-1">
                                +{(((item.revenue - reportData.revenueByMonth[index-1].revenue) / reportData.revenueByMonth[index-1].revenue) * 100).toFixed(1)}%
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Mobile Date Picker Modal */}
          {showMobileDatePicker && <MobileDatePicker />}
        </div>
      </div>
    </div>
  );
}

export default Reports;