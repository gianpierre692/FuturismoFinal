import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';
import SafeChart from '../components/charts/SafeChart';
import UniversalExportService from '../services/universalExportService';
import ExcelButton from '../components/common/ExcelButton';

const AgencyReportsMobile = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Mock data - en producción vendría del API
  const reportData = {
    summary: {
      totalRevenue: 1692.00,
      totalReservations: 9,
      totalParticipants: 44,
      averageOrderValue: 188.00
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleExportExcel = () => {
    const exportData = [
      { 
        'Fecha': format(selectedMonth, 'MMMM yyyy', { locale: es }),
        'Ingresos Totales': formatCurrency(reportData.summary.totalRevenue),
        'Total Reservas': reportData.summary.totalReservations,
        'Total Participantes': reportData.summary.totalParticipants,
        'Valor Promedio': formatCurrency(reportData.summary.averageOrderValue)
      }
    ];

    // Agregar datos diarios
    chartData.forEach(day => {
      exportData.push({
        'Día': day.day,
        'Ingresos': formatCurrency(day.revenue),
        'Reservas': day.reservations,
        'Participantes': day.participants
      });
    });

    UniversalExportService.exportToExcel(exportData, 'reporte_agencia', 'Reporte Mensual');
    toast.success('Reporte Excel exportado exitosamente');
    setShowExportOptions(false);
  };

  const handleExportPDF = () => {
    const pdfData = [
      ['Métrica', 'Valor'],
      ['Ingresos Totales', formatCurrency(reportData.summary.totalRevenue)],
      ['Total Reservas', reportData.summary.totalReservations],
      ['Total Participantes', reportData.summary.totalParticipants],
      ['Valor Promedio', formatCurrency(reportData.summary.averageOrderValue)]
    ];

    UniversalExportService.exportToPDF(pdfData, {
      filename: 'reporte_agencia',
      title: `Reporte de Agencia - ${format(selectedMonth, 'MMMM yyyy', { locale: es })}`,
      columns: [{ header: 'Métrica' }, { header: 'Valor' }]
    });
    
    toast.success('Reporte PDF exportado exitosamente');
    setShowExportOptions(false);
  };

  const chartData = [
    { day: '1', revenue: 450, reservations: 2, participants: 12 },
    { day: '5', revenue: 680, reservations: 3, participants: 18 },
    { day: '10', revenue: 0, reservations: 0, participants: 0 },
    { day: '15', revenue: 562, reservations: 4, participants: 14 },
    { day: '20', revenue: 0, reservations: 0, participants: 0 },
    { day: '25', revenue: 0, reservations: 0, participants: 0 },
    { day: '30', revenue: 0, reservations: 0, participants: 0 }
  ];

  return (
    <div className="fixed inset-0 top-14 flex flex-col bg-white">
      {/* Header con controles */}
      <div className="bg-white shadow-sm z-20 flex-shrink-0">
        <div className="px-4 py-3">
          {/* Selector de tipo de reporte y período */}
          <div className="flex items-center justify-between mb-3">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="flex-1 mr-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="monthly">Reporte Mensual</option>
              <option value="yearly">Reporte Anual</option>
            </select>
            
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>

          {/* Selector de mes */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <button 
              onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronDownIcon className="w-5 h-5 rotate-90" />
            </button>
            <span className="font-medium">
              {format(selectedMonth, 'MMMM yyyy', { locale: es })}
            </span>
            <button 
              onClick={() => setSelectedMonth(subMonths(selectedMonth, -1))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronDownIcon className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>

        {/* Opciones de exportación */}
        {showExportOptions && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="mt-3 space-y-2">
              <ExcelButton
                onClick={handleExportExcel}
                className="w-full py-3 text-sm"
                text="como Excel"
                fullText={true}
              />
              <button
                onClick={handleExportPDF}
                className="w-full py-3 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <DocumentTextIcon className="h-4 w-4" />
                Exportar como PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Total Reservas</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {reportData.summary.totalReservations}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Ingresos Totales</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(reportData.summary.totalRevenue)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">Total Turistas</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {reportData.summary.totalParticipants}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-xs text-gray-600">Ticket Promedio</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(reportData.summary.averageOrderValue)}
            </p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Ventas del Mes
          </h3>
          <div className="h-48">
            <SafeChart>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SafeChart>
          </div>
        </div>

        {/* Top Tours */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Tours Más Vendidos
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">City Tour Cusco</p>
                <p className="text-xs text-gray-500">5 reservas</p>
              </div>
              <p className="font-semibold text-gray-900">$850</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Valle Sagrado</p>
                <p className="text-xs text-gray-500">3 reservas</p>
              </div>
              <p className="font-semibold text-gray-900">$620</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Machu Picchu</p>
                <p className="text-xs text-gray-500">1 reserva</p>
              </div>
              <p className="font-semibold text-gray-900">$222</p>
            </div>
          </div>
        </div>

        {/* Padding bottom para evitar que el contenido quede bajo la navegación */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default AgencyReportsMobile;