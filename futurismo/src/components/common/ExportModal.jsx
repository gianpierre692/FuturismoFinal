import { useState } from 'react';
import { XMarkIcon, DocumentTextIcon, ArrowDownTrayIcon, ChartBarIcon, ArrowTrendingUpIcon, UserGroupIcon, CurrencyDollarIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  onExport, 
  reservationCount = 0,
  filterStatus = 'all',
  stats = {}
}) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const formatOptions = [
    {
      id: 'excel',
      name: 'Excel',
      extension: '.xlsx',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      description: 'Perfecto para análisis detallado y manipulación de datos',
      features: ['Columnas organizadas', 'Fórmulas automáticas', 'Gráficos incluidos'],
      recommended: reservationCount > 20
    },
    {
      id: 'pdf',
      name: 'PDF',
      extension: '.pdf',
      icon: DocumentTextIcon,
      color: 'from-red-500 to-red-600',
      description: 'Ideal para reportes formales y presentaciones',
      features: ['Formato profesional', 'Estadísticas incluidas', 'Listo para imprimir'],
      recommended: filterStatus !== 'all'
    },
    {
      id: 'csv',
      name: 'CSV',
      extension: '.csv',
      icon: DocumentIcon,
      color: 'from-blue-500 to-blue-600',
      description: 'Compatible con cualquier sistema y base de datos',
      features: ['Máxima compatibilidad', 'Fácil importación', 'Peso ligero'],
      recommended: false
    }
  ];

  const getStatusLabel = () => {
    switch (filterStatus) {
      case 'all': return 'Todas las reservas';
      case 'pendiente': return 'Reservas pendientes';
      case 'confirmada': return 'Reservas confirmadas';
      case 'cancelada': return 'Reservas canceladas';
      case 'completada': return 'Reservas completadas';
      default: return 'Reservas filtradas';
    }
  };

  const handleExport = async () => {
    if (!selectedFormat) return;
    
    setIsExporting(true);
    try {
      await onExport(selectedFormat);
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (error) {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      setSelectedFormat(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 rounded-t-2xl">
            <button
              onClick={handleClose}
              disabled={isExporting}
              className="absolute right-4 top-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <ArrowDownTrayIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Exportar Reservas
                </h2>
                <p className="text-primary-100 mt-1">
                  {reservationCount} reserva{reservationCount !== 1 ? 's' : ''} • {getStatusLabel()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          {stats && Object.keys(stats).length > 0 && (
            <div className="px-8 py-4 bg-gray-50 border-b">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <ChartBarIcon className="w-4 h-4" />
                Vista previa de datos
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary-600 mb-1">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{stats.totalReservations || reservationCount}</div>
                  <div className="text-xs text-gray-500">Reservas</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <UserGroupIcon className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{stats.totalTourists || 0}</div>
                  <div className="text-xs text-gray-500">Turistas</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <CurrencyDollarIcon className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">${(stats.totalRevenue || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Ingresos</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">${Math.round(stats.avgTicket || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Promedio</div>
                </div>
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selecciona el formato de exportación
            </h3>
            
            <div className="space-y-3">
              {formatOptions.map((format) => (
                <div
                  key={format.id}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                    selectedFormat === format.id
                      ? 'border-primary-500 bg-primary-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  {/* Recommended Badge */}
                  {format.recommended && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ Recomendado
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${format.color} shadow-lg`}>
                        <format.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {format.name}
                          </h4>
                          <span className="text-sm text-gray-500 font-mono">
                            {format.extension}
                          </span>
                          {selectedFormat === format.id && (
                            <CheckCircleIcon className="w-5 h-5 text-primary-600 ml-auto" />
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {format.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {format.features.map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                El archivo se descargará automáticamente al procesar la exportación
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isExporting}
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleExport}
                  disabled={!selectedFormat || isExporting}
                  className={`px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedFormat && !isExporting
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-400'
                  }`}
                >
                  {isExporting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Exportando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Exportar Ahora
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;