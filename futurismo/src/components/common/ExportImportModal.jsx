import React, { useState } from 'react';
import {
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  TableCellsIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import UniversalExportService from '../../services/universalExportService';

const ExportImportModal = ({ 
  isOpen, 
  onClose, 
  data = [], 
  dataType = 'users', // 'users', 'reservations', 'guides', 'generic'
  title = 'Exportar/Importar Datos',
  onImportSuccess = null,
  customExportOptions = null
}) => {
  const [activeTab, setActiveTab] = useState('export');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [exportResult, setExportResult] = useState(null);

  if (!isOpen) return null;

  const handleExcelExport = async () => {
    setIsExporting(true);
    setExportResult(null);
    
    try {
      let result;
      
      if (customExportOptions?.excelExporter) {
        result = await customExportOptions.excelExporter(data);
      } else {
        switch (dataType) {
          case 'users':
            result = UniversalExportService.exportUsersToExcel(data);
            break;
          case 'reservations':
            result = UniversalExportService.exportReservationsToExcel(data);
            break;
          case 'guides':
            result = UniversalExportService.exportGuidesToExcel(data);
            break;
          default:
            result = UniversalExportService.exportToExcel(data, dataType);
        }
      }
      
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, error: error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFExport = async () => {
    setIsExporting(true);
    setExportResult(null);
    
    try {
      let result;
      
      if (customExportOptions?.pdfExporter) {
        result = await customExportOptions.pdfExporter(data);
      } else {
        switch (dataType) {
          case 'users':
            result = UniversalExportService.exportUsersToPDF(data);
            break;
          case 'reservations':
            result = UniversalExportService.exportReservationsToPDF(data);
            break;
          case 'guides':
            result = UniversalExportService.exportGuidesToPDF(data);
            break;
          default:
            result = UniversalExportService.exportToPDF(data, { 
              filename: dataType,
              title: `Reporte de ${title}`
            });
        }
      }
      
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, error: error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await UniversalExportService.importFromExcel(file);
      setImportResult(result);
      
      if (result.success && onImportSuccess) {
        onImportSuccess(result.data);
      }
    } catch (error) {
      setImportResult({ success: false, error: error.message });
    } finally {
      setIsImporting(false);
      event.target.value = ''; // Reset file input
    }
  };

  const downloadTemplate = () => {
    switch (dataType) {
      case 'users':
        UniversalExportService.downloadUserTemplate();
        break;
      case 'reservations':
        UniversalExportService.downloadReservationTemplate();
        break;
      case 'guides':
        UniversalExportService.downloadGuideTemplate();
        break;
      default:
        // Generic template with first row structure
        if (data.length > 0) {
          const template = [Object.keys(data[0]).reduce((obj, key) => ({ ...obj, [key]: '' }), {})];
          UniversalExportService.exportToExcel(template, `plantilla_${dataType}`, 'Plantilla');
        }
    }
  };

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'users': return 'Usuarios';
      case 'reservations': return 'Reservaciones';
      case 'guides': return 'Guías';
      case 'providers': return 'Proveedores';
      default: return 'Datos';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <DocumentArrowDownIcon className="h-5 w-5 inline mr-2" />
            Exportar Datos
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <DocumentArrowUpIcon className="h-5 w-5 inline mr-2" />
            Importar Datos
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Tienes <span className="font-semibold text-blue-600">{data.length}</span> registros de {getDataTypeLabel().toLowerCase()} para exportar
                </p>
              </div>

              {/* Export Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExcelExport}
                  disabled={isExporting || data.length === 0}
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <TableCellsIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">Excel (.xlsx)</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Exportar datos en formato Excel para análisis y edición
                    </p>
                  </div>
                  {isExporting && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                      <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </button>

                <button
                  onClick={handlePDFExport}
                  disabled={isExporting || data.length === 0}
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <DocumentTextIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">PDF</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Exportar datos en formato PDF para reportes e impresión
                    </p>
                  </div>
                  {isExporting && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                      <div className="animate-spin h-6 w-6 border-2 border-red-600 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* Export Result */}
              {exportResult && (
                <div className={`p-4 rounded-lg border ${
                  exportResult.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {exportResult.success ? (
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    )}
                    <span className="text-sm">
                      {exportResult.success ? exportResult.message : `Error: ${exportResult.error}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              <div className="text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Importar {getDataTypeLabel()}
                </h3>
                <p className="mt-2 text-gray-600">
                  Selecciona un archivo Excel (.xlsx) para importar datos
                </p>
              </div>

              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">¿Primera vez importando?</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Descarga nuestra plantilla Excel para asegurar el formato correcto
                </p>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Descargar Plantilla
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileImport}
                  disabled={isImporting}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer ${isImporting ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <TableCellsIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <span className="text-blue-600 font-medium hover:text-blue-500">
                      {isImporting ? 'Procesando...' : 'Seleccionar archivo Excel'}
                    </span>
                    <p className="text-gray-500 text-sm mt-1">
                      Formatos soportados: .xlsx, .xls
                    </p>
                  </div>
                </label>
                
                {isImporting && (
                  <div className="mt-4">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                )}
              </div>

              {/* Import Result */}
              {importResult && (
                <div className={`p-4 rounded-lg border ${
                  importResult.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-start">
                    {importResult.success ? (
                      <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2 mt-0.5" />
                    )}
                    <div className="text-sm">
                      {importResult.success ? (
                        <div>
                          <p className="font-medium">{importResult.message}</p>
                          {importResult.data && (
                            <div className="mt-2">
                              {Object.keys(importResult.data).map(sheetName => (
                                <p key={sheetName} className="text-xs">
                                  Hoja "{sheetName}": {importResult.data[sheetName].length} registros
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p>Error: {importResult.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Import Guidelines */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Pautas de Importación:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• La primera fila debe contener los nombres de las columnas</li>
                  <li>• Usa la plantilla proporcionada para evitar errores</li>
                  <li>• Los campos obligatorios deben estar completos</li>
                  <li>• Revisa el formato de fechas (DD/MM/YYYY)</li>
                  <li>• Los emails deben tener formato válido</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportImportModal;