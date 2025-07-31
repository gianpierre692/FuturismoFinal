import React, { useState, useEffect } from 'react';
import { 
  CogIcon,
  BuildingOfficeIcon,
  MapIcon,
  UsersIcon,
  BellIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

import GeneralSettings from '../components/settings/GeneralSettings';
import ToursSettings from '../components/settings/ToursSettings';
import NotificationsSettings from '../components/settings/NotificationsSettings';
import { useSettingsStore } from '../stores/settingsStore';
import useAuthStore from '../stores/authStore';
import UniversalExportService from '../services/universalExportService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const { hasUnsavedChanges, exportSettings, importSettings } = useSettingsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    {
      id: 'general',
      name: 'General',
      icon: BuildingOfficeIcon,
      description: 'Información de la empresa y configuraciones básicas'
    },
    {
      id: 'tours',
      name: 'Tours',
      icon: MapIcon,
      description: 'Configuración de tours y servicios'
    },
    {
      id: 'agencies',
      name: 'Agencias',
      icon: UsersIcon,
      description: 'Configuración específica para agencias'
    },
    {
      id: 'guides',
      name: 'Guías',
      icon: UsersIcon,
      description: 'Configuración para guías turísticos'
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      icon: BellIcon,
      description: 'Configuración de notificaciones por canal'
    }
  ];

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = importSettings(e.target.result);
        if (result.success) {
          setShowImportSuccess(true);
          setTimeout(() => setShowImportSuccess(false), 3000);
        } else {
          alert(`Error al importar: ${result.error}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportSettings = () => {
    const settingsData = [{
      'Configuración': 'General',
      'Datos': JSON.stringify(settings?.general || {}, null, 2)
    }, {
      'Configuración': 'Tours',
      'Datos': JSON.stringify(settings?.tours || {}, null, 2)
    }, {
      'Configuración': 'Notificaciones',
      'Datos': JSON.stringify(settings?.notifications || {}, null, 2)
    }];
    
    UniversalExportService.exportToExcel(settingsData, 'configuracion_sistema', 'Configuraciones');
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleExportPDF = () => {
    const settingsData = [
      ['Configuración General', JSON.stringify(settings?.general || {}, null, 2)],
      ['Configuración Tours', JSON.stringify(settings?.tours || {}, null, 2)],
      ['Configuración Notificaciones', JSON.stringify(settings?.notifications || {}, null, 2)]
    ];
    
    UniversalExportService.exportToPDF(settingsData, {
      filename: 'configuracion_sistema',
      title: 'Configuración del Sistema',
      columns: [{ header: 'Tipo' }, { header: 'Configuración' }]
    });
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'tours':
        return <ToursSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'agencies':
        return <ComingSoonTab name="Agencias" />;
      case 'guides':
        return <ComingSoonTab name="Guías" />;
      default:
        return <GeneralSettings />;
    }
  };

  const ComingSoonTab = ({ name }) => (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border">
      <div className="text-center">
        <CogIcon className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
        <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">
          Configuración de {name}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Esta sección estará disponible próximamente. Estamos trabajando en implementar 
          todas las configuraciones específicas para {name.toLowerCase()}.
        </p>
        <div className="mt-6">
          <button
            onClick={() => setActiveTab('general')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver a Configuración General
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-80 max-w-[85vw] h-full shadow-xl">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            Categorías de Configuración
          </h3>
          <button onClick={() => setShowMobileSidebar(false)}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          <div className="space-y-1 p-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <IconComponent className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {tab.name}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isActive ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                    {isActive && <ChevronRightIcon className="w-4 h-4 text-blue-600 mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="flex-1" onClick={() => setShowMobileSidebar(false)} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CogIcon className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                <span className="hidden sm:inline">Configuración del Sistema</span>
                <span className="sm:hidden">Configuración</span>
              </h1>
            </div>
            
            {isMobile && (
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Solo mostrar botones de exportar/importar para administradores */}
          {user?.role === 'admin' && (
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleExportSettings}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
                <span>Excel</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
                <span>PDF</span>
              </button>
              
              <label className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                <ArrowUpTrayIcon className="w-4 h-4 mr-1.5" />
                <span>Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="sr-only"
                />
              </label>
            </div>
          )}
        </div>

        {/* Warning banner */}
        {hasUnsavedChanges && (
          <div className="mb-4 sm:mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 sm:mr-3 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-yellow-800">
                Tienes cambios sin guardar en las configuraciones. 
                <span className="hidden sm:inline">No olvides guardar antes de cambiar de pestaña o salir.</span>
                <span className="sm:hidden">Recuerda guardar los cambios.</span>
              </p>
            </div>
          </div>
        )}

        {/* Success notifications */}
        {showImportSuccess && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
              <p className="text-xs sm:text-sm text-green-800">
                Configuraciones importadas exitosamente
              </p>
            </div>
          </div>
        )}
        
        {showExportSuccess && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
              <p className="text-xs sm:text-sm text-green-800">
                Configuraciones exportadas exitosamente
              </p>
            </div>
          </div>
        )}

        {/* Mobile current tab indicator */}
        {isMobile && (
          <div className="mb-4 bg-white rounded-lg shadow-sm border p-3">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center">
                {(() => {
                  const currentTab = tabs.find(t => t.id === activeTab);
                  const IconComponent = currentTab?.icon || CogIcon;
                  return (
                    <>
                      <IconComponent className="h-5 w-5 text-blue-600 mr-3" />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {currentTab?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {currentTab?.description}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="lg:w-80">
              <nav className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-sm font-medium text-gray-900">
                    Categorías de Configuración
                  </h3>
                </div>
                
                <div className="space-y-1 p-2">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const IconComponent = tab.icon;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <IconComponent className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className={`text-sm font-medium ${
                              isActive ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {tab.name}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isActive ? 'text-blue-700' : 'text-gray-500'
                            }`}>
                              {tab.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>

        {/* Information panel */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 mt-0.5 mr-3 sm:mr-4 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-blue-800">
              <h4 className="font-medium mb-2">Acerca de las Configuraciones</h4>
              <div className="space-y-2">
                <p className="hidden sm:block">
                  Estas configuraciones controlan el comportamiento global del sistema Futurismo Tours. 
                  Los cambios se aplicarán inmediatamente y afectarán a todos los usuarios.
                </p>
                <p className="sm:hidden">
                  Estas configuraciones controlan el comportamiento global del sistema.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-3">
                  <li>Las configuraciones se guardan automáticamente<span className="hidden sm:inline"> cuando haces clic en "Guardar"</span></li>
                  <li>Puedes exportar/importar configuraciones<span className="hidden sm:inline"> para respaldos o migración</span></li>
                  <li className="hidden sm:list-item">Algunos cambios pueden requerir reiniciar sesiones activas</li>
                  <li className="hidden sm:list-item">Se recomienda probar cambios en un entorno de desarrollo primero</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Sidebar */}
        {isMobile && showMobileSidebar && <MobileSidebar />}
      </div>
    </div>
  );
};

export default Settings;