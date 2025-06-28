import { useState } from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon, PhotoIcon, FunnelIcon, CheckCircleIcon, ClockIcon, XCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import exportService from '../../services/exportService';

const ExportPanel = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Información Completa', icon: ChartBarIcon, color: 'text-blue-600' },
    { value: 'pendiente', label: 'Solo Pendientes', icon: ClockIcon, color: 'text-yellow-600' },
    { value: 'confirmada', label: 'Solo Confirmadas', icon: CheckCircleIcon, color: 'text-green-600' },
    { value: 'cancelada', label: 'Solo Canceladas', icon: XCircleIcon, color: 'text-red-600' }
  ];

  const exportFormats = [
    { 
      format: 'excel', 
      label: 'Excel', 
      icon: DocumentTextIcon, 
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Ideal para análisis detallado'
    },
    { 
      format: 'pdf', 
      label: 'PDF', 
      icon: DocumentTextIcon, 
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Perfecto para reportes formales'
    },
    { 
      format: 'csv', 
      label: 'CSV', 
      icon: PhotoIcon, 
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Compatible con cualquier sistema'
    }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular procesamiento
      
      // Obtener estadísticas del filtro actual para el mensaje
      const stats = exportService.getFilteredStats(selectedStatus);
      const statusLabel = statusOptions.find(opt => opt.value === selectedStatus)?.label || 'Información';
      
      // Exportar con el filtro seleccionado
      exportService.exportData(format, selectedStatus);
      
      // Mostrar mensaje de éxito detallado
      alert(`✅ ${statusLabel} exportada exitosamente!\n\n` +
            `📊 Datos exportados:\n` +
            `• ${stats.totalReservations} reservas\n` +
            `• ${stats.totalTourists} turistas\n` +
            `• $${stats.totalRevenue.toLocaleString()} en ingresos\n` +
            `• Formato: ${format.toUpperCase()}\n\n` +
            `📁 El archivo se descargó automáticamente.`);
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('❌ Error al exportar los datos. Intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Obtener estadísticas del filtro actual
  const stats = exportService.getFilteredStats(selectedStatus);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <ArrowDownTrayIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Exportar Datos</h3>
          <p className="text-sm text-gray-600">Descarga reportes según tus necesidades</p>
        </div>
      </div>

      {/* Filtro de Estado */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FunnelIcon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtrar por Estado</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statusOptions.map((option) => {
            const optionStats = exportService.getFilteredStats(option.value);
            return (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedStatus === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <option.icon className={`w-5 h-5 ${option.color}`} />
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-700">{optionStats.totalReservations}</div>
                    <div className="text-xs text-gray-500">reservas</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Información adicional del filtro seleccionado */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">📋 Filtro activo:</span> {statusOptions.find(opt => opt.value === selectedStatus)?.label}
            {selectedStatus !== 'all' && (
              <span className="ml-2">
                • Solo se exportarán las reservas con estado "{selectedStatus}"
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Estadísticas del Filtro Actual */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Vista Previa de Datos</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary-600">{stats.totalReservations}</div>
            <div className="text-xs text-gray-600">Reservas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.totalTourists}</div>
            <div className="text-xs text-gray-600">Turistas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Ingresos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">${Math.round(stats.avgTicket).toLocaleString()}</div>
            <div className="text-xs text-gray-600">Ticket Promedio</div>
          </div>
        </div>
      </div>

      {/* Botones de Exportación */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Formato de Exportación</h4>
        {exportFormats.map((format) => (
          <button
            key={format.format}
            onClick={() => handleExport(format.format)}
            disabled={isExporting || stats.totalReservations === 0}
            className={`w-full flex items-center justify-between p-4 rounded-lg text-white font-medium transition-all ${format.color} ${
              isExporting || stats.totalReservations === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'transform hover:scale-105'
            }`}
          >
            <div className="flex items-center gap-3">
              <format.icon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">
                  Exportar {stats.totalReservations} reserva{stats.totalReservations !== 1 ? 's' : ''} como {format.label}
                </div>
                <div className="text-sm opacity-90">
                  {format.description} • {statusOptions.find(opt => opt.value === selectedStatus)?.label}
                </div>
              </div>
            </div>
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ArrowDownTrayIcon className="w-5 h-5" />
            )}
          </button>
        ))}
      </div>

      {/* Nota informativa */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">💡 Tip:</span> Los archivos se descargarán automáticamente con la fecha actual en el nombre.
        </p>
      </div>
    </div>
  );
};

export default ExportPanel;