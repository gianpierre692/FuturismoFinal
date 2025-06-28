import React, { useState } from 'react';
import { DocumentTextIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, EyeIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const DocumentsSection = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Licencia de Funcionamiento',
      type: 'business_license',
      fileName: 'licencia-funcionamiento-2024.pdf',
      size: '1.2 MB',
      uploadDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'approved',
      category: 'legal'
    },
    {
      id: 2,
      name: 'Certificado Tributario',
      type: 'tax_certificate',
      fileName: 'certificado-tributario-sunat.pdf',
      size: '856 KB',
      uploadDate: '2024-02-20',
      expiryDate: '2024-12-31',
      status: 'approved',
      category: 'fiscal'
    },
    {
      id: 3,
      name: 'Póliza de Seguros',
      type: 'insurance_policy',
      fileName: 'poliza-seguros-2024.pdf',
      size: '2.1 MB',
      uploadDate: '2024-03-10',
      expiryDate: '2025-03-10',
      status: 'approved',
      category: 'insurance'
    },
    {
      id: 4,
      name: 'Permiso de Operación Turística',
      type: 'tourism_permit',
      fileName: 'permiso-operacion-mincetur.pdf',
      size: '1.8 MB',
      uploadDate: '2024-06-20',
      expiryDate: '2025-06-20',
      status: 'pending',
      category: 'tourism'
    },
    {
      id: 5,
      name: 'Constitución de Empresa',
      type: 'company_charter',
      fileName: 'constitucion-empresa.pdf',
      size: '975 KB',
      uploadDate: '2024-01-10',
      expiryDate: null,
      status: 'approved',
      category: 'legal'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  const categories = {
    all: 'Todos los documentos',
    legal: 'Documentos Legales',
    fiscal: 'Documentos Fiscales',
    insurance: 'Seguros',
    tourism: 'Turismo'
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Aprobado' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Pendiente' },
      rejected: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon, text: 'Rechazado' },
      expired: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon, text: 'Expirado' }
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin vencimiento';
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (size) => {
    return size;
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const filteredDocuments = documents.filter(doc => 
    selectedCategory === 'all' || doc.category === selectedCategory
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simular carga de archivo
      setTimeout(() => {
        const newDoc = {
          id: Date.now(),
          name: file.name.replace(/\.[^/.]+$/, "").replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: 'custom',
          fileName: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          expiryDate: null,
          status: 'pending',
          category: 'legal'
        };
        setDocuments([...documents, newDoc]);
        setIsUploading(false);
        alert('✅ Documento subido correctamente. En revisión.');
      }, 2000);
    }
  };

  const handleDownload = (doc) => {
    alert(`📁 Descargando: ${doc.fileName}`);
  };

  const handleView = (doc) => {
    alert(`👁️ Visualizando: ${doc.fileName}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-orange-100 rounded-lg">
            <DocumentTextIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Documentos</h3>
            <p className="text-sm text-gray-500">Gestión de documentos legales y certificados</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expandir sección' : 'Contraer sección'}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="flex gap-3">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById('file-upload').click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Subiendo...
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-4 h-4" />
                Subir documento
              </>
            )}
          </button>
          </div>
        )}
      </div>

      {/* Filtros por categoría */}
      {!isCollapsed && (
        <div>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({key === 'all' ? documents.length : documents.filter(d => d.category === key).length})
                </button>
              ))}
            </div>
          </div>

          {/* Lista de documentos */}
          <div className="space-y-4">
        {filteredDocuments.map((doc) => {
          const statusBadge = getStatusBadge(doc.status);
          const expiring = isExpiringSoon(doc.expiryDate);
          const expired = isExpired(doc.expiryDate);
          
          return (
            <div 
              key={doc.id} 
              className={`border rounded-lg p-4 ${
                expired ? 'border-red-300 bg-red-50' : 
                expiring ? 'border-yellow-300 bg-yellow-50' : 
                'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="text-md font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-500">{doc.fileName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tamaño:</span>
                      <p className="font-medium text-gray-900">{formatFileSize(doc.size)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Subido:</span>
                      <p className="font-medium text-gray-900">{formatDate(doc.uploadDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vencimiento:</span>
                      <p className={`font-medium ${
                        expired ? 'text-red-600' : expiring ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {formatDate(doc.expiryDate)}
                        {expiring && !expired && ' ⚠️'}
                        {expired && ' ❌'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Estado:</span>
                      <div className="flex items-center gap-1 mt-1">
                        {React.createElement(statusBadge.icon, { className: "w-4 h-4" })}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleView(doc)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="Ver documento"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="Descargar"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alertas de vencimiento */}
              {expiring && !expired && (
                <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                    Este documento vence pronto. Considera renovarlo.
                  </p>
                </div>
              )}
              
              {expired && (
                <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-sm text-red-800">
                    <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                    Este documento ha expirado. Renuévalo inmediatamente.
                  </p>
                </div>
              )}
            </div>
          );
        })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay documentos en esta categoría</p>
              <button
                onClick={() => document.getElementById('file-upload').click()}
                className="mt-3 text-blue-600 hover:text-blue-700"
              >
                Subir primer documento
              </button>
            </div>
          )}

          {/* Información sobre tipos de archivos */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <span className="font-medium">📎 Formatos aceptados:</span> PDF, DOC, DOCX, JPG, JPEG, PNG. 
              Tamaño máximo: 10MB por archivo. Los documentos son revisados en un plazo de 24-48 horas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;