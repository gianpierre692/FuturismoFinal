import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon, FunnelIcon, CheckCircleIcon, ClockIcon, XCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import exportService from '../../services/exportService';
import UniversalExportService from '../../services/universalExportService';
import Logger from '../../utils/logger';

const ExportPanel = () => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const statusOptions = [
    { value: 'all', label: t('dashboard.completeInformation'), icon: ChartBarIcon, color: 'text-blue-600' },
    { value: 'pendiente', label: t('dashboard.onlyPending'), icon: ClockIcon, color: 'text-yellow-600' },
    { value: 'confirmada', label: t('dashboard.onlyConfirmed'), icon: CheckCircleIcon, color: 'text-green-600' },
    { value: 'cancelada', label: t('dashboard.onlyCancelled'), icon: XCircleIcon, color: 'text-red-600' }
  ];

  const exportFormats = [
    { 
      format: 'excel', 
      label: 'Excel', 
      icon: TableCellsIcon, 
      color: 'bg-green-500 hover:bg-green-600',
      description: t('dashboard.excelDescription')
    },
    { 
      format: 'pdf', 
      label: 'PDF', 
      icon: DocumentTextIcon, 
      color: 'bg-red-500 hover:bg-red-600',
      description: t('dashboard.pdfDescription')
    }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular procesamiento
      
      // Obtener estadísticas del filtro actual para el mensaje
      const stats = exportService.getFilteredStats(selectedStatus);
      const statusLabel = statusOptions.find(opt => opt.value === selectedStatus)?.label || 'Información';
      
      // Preparar datos para exportar
      const reservationData = exportService.getExportData(selectedStatus);
      
      if (format === 'excel') {
        // Exportar a Excel
        UniversalExportService.exportToExcel(
          reservationData,
          `reservas_${selectedStatus}_${format}`,
          statusLabel
        );
      } else if (format === 'pdf') {
        // Usar el servicio de exportación que ya tiene la lógica PDF correcta
        exportService.exportData('pdf', selectedStatus);
      }
      
      // Éxito - el archivo se descarga automáticamente
    } catch (error) {
      Logger.error('Error al exportar:', error);
      // Error silencioso - ya se registró con Logger
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
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.exportData')}</h3>
          <p className="text-sm text-gray-600">{t('dashboard.downloadReports')}</p>
        </div>
      </div>

      {/* Filtro de Estado */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FunnelIcon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{t('dashboard.filterByStatus')}</span>
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
            <span className="font-medium">📋 {t('dashboard.activeFilter')}:</span> {statusOptions.find(opt => opt.value === selectedStatus)?.label}
            {selectedStatus !== 'all' && (
              <span className="ml-2">
                • {t('dashboard.onlyReservationsWillExport')} "{selectedStatus}"
              </span>
            )}
          </p>
        </div>
      </div>


      {/* Botones de Exportación */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">{t('dashboard.exportFormat')}</h4>
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
                  {t('dashboard.exportCount', { 
                    count: stats.totalReservations, 
                    format: format.label 
                  })}
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
          <span className="font-medium">💡 {t('dashboard.tip')}:</span> {t('dashboard.downloadTip')}
        </p>
      </div>
    </div>
  );
};

export default ExportPanel;