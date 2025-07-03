import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TicketIcon,
  MapIcon,
  ClockIcon
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
    revenueByMonth: []
  });

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
          { location: 'Machu Picchu', count: 45 },
          { location: 'Valle Sagrado', count: 32 },
          { location: 'Cusco City Tour', count: 28 },
          { location: 'Sacsayhuamán', count: 18 },
          { location: 'Ollantaytambo', count: 12 }
        ],
        topProviders: [
          { providerId: '1', providerName: 'Inca Rail', count: 25, revenue: 15000 },
          { providerId: '2', providerName: 'Peru Rail', count: 20, revenue: 12000 },
          { providerId: '3', providerName: 'Sky Airlines', count: 18, revenue: 9000 },
          { providerId: '4', providerName: 'Hotel Cusco Plaza', count: 15, revenue: 7500 },
          { providerId: '5', providerName: 'Restaurante Cicciolina', count: 12, revenue: 3000 }
        ]
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

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Selector de rango */}
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

            {/* Selector de fechas para rango personalizado */}
            {dateRange === 'custom' && (
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

            {/* Botón exportar */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Exportar CSV
            </button>
          </div>
        </div>

        <p className="mt-2 text-gray-600">
          Mostrando datos desde {format(startDate, 'dd/MM/yyyy', { locale: es })} hasta {format(endDate, 'dd/MM/yyyy', { locale: es })}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={TicketIcon}
              title="Total Reservas"
              value={reportData.totalBookings}
              subtitle="En el período seleccionado"
              color="blue"
            />
            <StatCard
              icon={CurrencyDollarIcon}
              title="Ingresos Totales"
              value={`S/. ${(reportData.totalRevenue || 0).toFixed(2)}`}
              subtitle="Suma de todas las reservas"
              color="green"
            />
            <StatCard
              icon={UserGroupIcon}
              title="Total Usuarios"
              value={reportData.totalUsers}
              subtitle="Usuarios registrados"
              color="purple"
            />
            <StatCard
              icon={MapIcon}
              title="Total Proveedores"
              value={reportData.totalProviders}
              subtitle="Proveedores activos"
              color="orange"
            />
          </div>

          {/* Gráficos y tablas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estados de reservas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estados de Reservas</h2>
              <div className="space-y-3">
                {Object.entries(reportData.bookingsByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top destinos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Destinos</h2>
              <div className="space-y-3">
                {(reportData.topDestinations || []).map((destination, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{destination.location}</span>
                    <span className="font-semibold">{destination.count} reservas</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top proveedores */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Proveedores por Ingresos</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservas</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(reportData.topProviders || []).map((provider, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-900">{provider.providerName}</td>
                        <td className="px-4 py-3 text-gray-700">{provider.count}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">
                          S/. {(provider.revenue || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;