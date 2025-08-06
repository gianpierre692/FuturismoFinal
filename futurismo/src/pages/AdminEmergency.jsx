import { useState, useEffect } from 'react';
import { ShieldCheckIcon, ArchiveBoxIcon, CogIcon, UserGroupIcon, ExclamationTriangleIcon, DocumentTextIcon, ArrowDownTrayIcon, PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon, CheckCircleIcon, PhoneIcon, ChartBarIcon, EyeIcon, XMarkIcon, EllipsisVerticalIcon, ClipboardDocumentListIcon, BeakerIcon } from '@heroicons/react/24/outline';
import useEmergencyStore from '../stores/emergencyStore';
import ProtocolEditor from '../components/emergency/ProtocolEditor';
import MaterialsManager from '../components/emergency/MaterialsManager';
import emergencyPDFService from '../services/emergencyPDFService';
import Logger from '../utils/logger';

const AdminEmergency = () => {
  const { protocols, materials, categories, actions } = useEmergencyStore();
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'protocols', 'materials', 'analytics'
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [isEditingProtocol, setIsEditingProtocol] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showProtocolDetails, setShowProtocolDetails] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estadísticas
  const stats = {
    totalProtocols: protocols.length,
    highPriorityProtocols: protocols.filter(p => p.priority === 'alta').length,
    totalMaterials: materials.length,
    mandatoryMaterials: materials.filter(m => m.mandatory).length,
    categoriesCount: categories.length
  };

  // Filtrar protocolos
  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = !searchQuery || 
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || protocol.category === filterCategory;
    const matchesPriority = !filterPriority || protocol.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleDownloadAllProtocols = async () => {
    try {
      await emergencyPDFService.downloadAllProtocolsPDF(protocols);
    } catch (error) {
      Logger.error('Error descargando protocolos:', error);
      alert('Error al generar el PDF de protocolos');
    }
  };

  const handleDownloadGuideKit = async () => {
    try {
      await emergencyPDFService.downloadGuideEmergencyKit();
    } catch (error) {
      Logger.error('Error descargando kit:', error);
      alert('Error al generar el PDF del kit');
    }
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId) || { 
      name: categoryId, 
      icon: '📋', 
      color: '#6B7280' 
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isEditingProtocol) {
    return (
      <ProtocolEditor
        protocol={selectedProtocol}
        onClose={() => {
          setIsEditingProtocol(false);
          setSelectedProtocol(null);
        }}
        onSave={(updatedProtocol) => {
          if (selectedProtocol) {
            actions.updateProtocol(selectedProtocol.id, updatedProtocol);
          } else {
            actions.addProtocol(updatedProtocol);
          }
          setIsEditingProtocol(false);
          setSelectedProtocol(null);
        }}
      />
    );
  }

  if (showMaterials) {
    return (
      <MaterialsManager
        onClose={() => setShowMaterials(false)}
        isAdmin={true}
      />
    );
  }

  // Mobile Components
  const MobileProtocolCard = ({ protocol }) => {
    const category = getCategoryInfo(protocol.category);
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{protocol.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{protocol.title}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{category.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(protocol.priority)}`}>
                  {protocol.priority?.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {protocol.content.steps.length} pasos
                </span>
              </div>
            </div>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{protocol.description}</p>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowProtocolDetails(protocol)}
            className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Ver Detalles
          </button>
          <button
            onClick={() => {
              setSelectedProtocol(protocol);
              setIsEditingProtocol(true);
            }}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const MobileFilters = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl max-h-[70vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <button onClick={() => setShowMobileFilters(false)}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setFilterCategory('');
                setFilterPriority('');
                setShowMobileFilters(false);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
            >
              Limpiar
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileProtocolDetails = ({ protocol, onClose }) => {
    const category = getCategoryInfo(protocol.category);
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold truncate flex-1">{protocol.title}</h2>
            <button onClick={onClose} className="p-2">
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{protocol.icon}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(protocol.priority)}`}>
                  Prioridad {protocol.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">{protocol.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>{category.icon} {category.name}</span>
                <span>•</span>
                <span>Actualizado: {protocol.lastUpdated}</span>
              </div>
            </div>
            
            {/* Steps */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Pasos del Protocolo</h3>
              <div className="space-y-2">
                {protocol.content.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-white rounded-lg border">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-700 flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contacts */}
            {protocol.content.contacts.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contactos de Emergencia</h3>
                <div className="space-y-2">
                  {protocol.content.contacts.map((contact, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{contact.name}</span>
                        <span className="text-gray-600 font-medium">
                          {contact.phone}
                        </span>
                      </div>
                      {contact.available && (
                        <p className="text-xs text-gray-500 mt-1">{contact.available}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedProtocol(protocol);
                setIsEditingProtocol(true);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Editar Protocolo
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <ShieldCheckIcon className="w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-3 text-red-500" />
            <span className="hidden sm:inline">Administración de Emergencias</span>
            <span className="sm:hidden">Emergencias</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
            Panel de control para gestión de protocolos y materiales de emergencia
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadGuideKit}
            className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Kit Completo</span>
            <span className="sm:hidden">Kit</span>
          </button>

          <button
            onClick={handleDownloadAllProtocols}
            className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <DocumentTextIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Manual PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 overflow-hidden">
        <nav className="flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChartBarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Resumen General</span>
            <span className="sm:hidden">Resumen</span>
          </button>
          
          <button
            onClick={() => setActiveTab('protocols')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'protocols'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Protocolos</span>
            <span className="text-xs">({protocols.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'materials'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArchiveBoxIcon className="w-4 h-4" />
            <span>Materiales</span>
            <span className="text-xs">({materials.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChartBarIcon className="w-4 h-4" />
            <span>Analíticas</span>
          </button>
        </nav>
      </div>

      {/* Contenido de las tabs */}
      {activeTab === 'overview' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <ShieldCheckIcon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Protocolos</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stats.totalProtocols}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Alta Prior.</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stats.highPriorityProtocols}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <ArchiveBoxIcon className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Materiales</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stats.totalMaterials}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Obligatorios</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stats.mandatoryMaterials}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
                  <CogIcon className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Categorías</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stats.categoriesCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => setIsEditingProtocol(true)}
                className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <PlusIcon className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900 text-sm sm:text-base">Nuevo Protocolo</h4>
                    <p className="text-xs sm:text-sm text-green-700">Crear protocolo de emergencia</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowMaterials(true)}
                className="p-3 sm:p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <ArchiveBoxIcon className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-purple-900 text-sm sm:text-base">Gestionar Materiales</h4>
                    <p className="text-xs sm:text-sm text-purple-700">Administrar equipos necesarios</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleDownloadAllProtocols}
                className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left col-span-1 sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center space-x-3">
                  <ArrowDownTrayIcon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900 text-sm sm:text-base">Generar Manual</h4>
                    <p className="text-xs sm:text-sm text-blue-700">Descargar manual completo</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Protocolos recientes */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Protocolos Recientes</h3>
                <button
                  onClick={() => setActiveTab('protocols')}
                  className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                >
                  Ver todos →
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {protocols.slice(0, 3).map(protocol => {
                  const category = getCategoryInfo(protocol.category);
                  return (
                    <div key={protocol.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className="text-xl sm:text-2xl flex-shrink-0">{protocol.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{protocol.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{category.name} • {protocol.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <span 
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(protocol.priority)}`}
                        >
                          {protocol.priority?.toUpperCase()}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProtocol(protocol);
                            setIsEditingProtocol(true);
                          }}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'protocols' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Filtros y acciones */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                <div className="relative flex-1 sm:flex-initial">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar protocolos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  {isMobile ? (
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <FunnelIcon className="w-4 h-4" />
                      <span>Filtros</span>
                    </button>
                  ) : (
                    <>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Todas las categorías</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Todas las prioridades</option>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                      </select>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsEditingProtocol(true)}
                className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Protocolo</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            </div>
          </div>

          {/* Lista de protocolos */}
          {isMobile ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredProtocols.map(protocol => (
                <MobileProtocolCard key={protocol.id} protocol={protocol} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pasos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contactos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actualizado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProtocols.map(protocol => {
                    const category = getCategoryInfo(protocol.category);
                    return (
                      <tr key={protocol.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{protocol.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{protocol.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{protocol.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span className="text-sm text-gray-900">{category.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(protocol.priority)}`}
                          >
                            {protocol.priority?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {protocol.content.steps.length} pasos
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {protocol.content.contacts.length} contactos
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {protocol.lastUpdated}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProtocol(protocol);
                                setIsEditingProtocol(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar protocolo"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => {
                                if (confirm('¿Estás seguro de eliminar este protocolo?')) {
                                  actions.deleteProtocol(protocol.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar protocolo"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {filteredProtocols.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron protocolos
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterCategory || filterPriority ? 
                  'Intenta ajustar los filtros de búsqueda' : 
                  'Comienza creando tu primer protocolo de emergencia'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsEditingProtocol(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <PlusIcon className="w-4 h-4 inline mr-2" />
                  Crear Protocolo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-6">
          <MaterialsManager onClose={() => {}} isAdmin={true} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Distribución por categorías */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Categorías</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryProtocols = protocols.filter(p => p.category === category.id).length;
                const categoryMaterials = materials.filter(m => m.category === category.id).length;
                
                return (
                  <div key={category.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protocolos:</span>
                        <span className="font-medium">{categoryProtocols}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Materiales:</span>
                        <span className="font-medium">{categoryMaterials}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Análisis de prioridades */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis de Prioridades</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['alta', 'media', 'baja'].map(priority => {
                const count = protocols.filter(p => p.priority === priority).length;
                const percentage = ((count / protocols.length) * 100).toFixed(1);
                
                return (
                  <div key={priority} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">{priority}</span>
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(priority)}`}
                      >
                        {count}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentage}% del total
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Filters Modal */}
      {showMobileFilters && <MobileFilters />}
      
      {/* Mobile Protocol Details */}
      {showProtocolDetails && (
        <MobileProtocolDetails 
          protocol={showProtocolDetails} 
          onClose={() => setShowProtocolDetails(null)}
        />
      )}
    </div>
  );
};

export default AdminEmergency;