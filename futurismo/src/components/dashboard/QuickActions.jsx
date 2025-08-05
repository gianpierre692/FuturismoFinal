import { PlusIcon, CalendarIcon, UserGroupIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, ArrowDownTrayIcon, CogIcon, QuestionMarkCircleIcon, PaperAirplaneIcon, MapIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import { generateWhatsAppURL, canBookDirectly } from '../../utils/formatters';
import InteractiveButton from '../common/InteractiveButton';
import QuickActionModal from '../common/QuickActionModal';
import { useState } from 'react';
import Logger from '../../utils/logger';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // Function to show notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Modal handlers
  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // ONE-CLICK: Crear nueva reserva con modal
  const handleNewReservation = () => {
    openModal('newReservation');
  };

  // ONE-CLICK: Vista rápida del calendario (modal con disponibilidad)
  const handleViewCalendar = () => {
    // Mostrar disponibilidad de hoy en modal
    const availableSlots = [
      { time: '09:00', tour: 'City Tour Lima', available: 3 },
      { time: '11:00', tour: 'Gastronómico', available: 5 },
      { time: '14:00', tour: 'Palomino', available: 8 },
      { time: '16:00', tour: 'City Tour Lima', available: 2 }
    ];
    
    showNotification(`Disponibilidad hoy: ${availableSlots.length} slots libres`, 'info');
    
    // Crear modal personalizado para disponibilidad
    const today = new Date().toLocaleDateString('es-PE');
    const modalContent = availableSlots.map(slot => 
      `${slot.time} - ${slot.tour} (${slot.available} espacios)`
    ).join('\n');
    
    alert(`📅 Disponibilidad ${today}:\n\n${modalContent}\n\n¡Haz clic en "Nueva Reserva" para crear una!`);
  };

  // Función para generar reporte instantáneo
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    showNotification('Generando reporte...', 'info');
    
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear un blob con datos de ejemplo (en producción esto vendría del backend)
      const reportData = {
        fecha: new Date().toLocaleDateString(),
        agencia: user?.name || 'Agencia',
        reservas: 127,
        ingresos: 89500,
        turistas: 342
      };
      
      const csvContent = `Reporte de Actividad - ${reportData.fecha}
Agencia,${reportData.agencia}
Total Reservas,${reportData.reservas}
Ingresos Totales,$${reportData.ingresos}
Total Turistas,${reportData.turistas}
Generado el,${new Date().toLocaleString()}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      showNotification('¡Reporte generado y descargado exitosamente!', 'success');
      
    } catch (error) {
      Logger.error('Error generando reporte:', { error: error.message });
      showNotification('Error al generar el reporte', 'error');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // ONE-CLICK: Consulta directa con modal
  const handleDirectConsult = () => {
    openModal('quickChat');
  };

  // ONE-CLICK: Asignar guía con modal
  const handleAssignGuide = () => {
    openModal('assignGuide');
  };

  // ONE-CLICK: Monitoreo rápido con modal
  const handleQuickMonitoring = () => {
    openModal('quickMonitoring');
  };

  // Modal submit handlers
  const handleModalSubmit = async (modalType, formData) => {
    switch (modalType) {
      case 'newReservation':
        showNotification('✅ Reserva creada exitosamente', 'success');
        // Aquí se enviaría al backend
        break;
      
      case 'assignGuide':
        showNotification('✅ Guía asignado correctamente', 'success');
        break;
      
      case 'quickChat':
        showNotification('✅ Consulta enviada al chat', 'success');
        break;
      
      default:
        showNotification('Acción completada', 'success');
    }
  };

  // Funciones para Admin
  const handleManageUsers = () => {
    navigate('/users', { 
      state: { 
        action: 'manage',
        tab: 'active' 
      } 
    });
  };

  const handleGlobalMonitoring = () => {
    navigate('/monitoring', { 
      state: { 
        view: 'global',
        showAll: true 
      } 
    });
  };

  const handleSystemBackup = async () => {
    try {
      // Simular backup del sistema
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        tables: ['users', 'reservations', 'tours', 'guides'],
        size: '2.4MB'
      };
      
      const jsonContent = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      alert('Backup del sistema generado exitosamente');
    } catch (error) {
      Logger.error('Error generando backup:', { error: error.message });
      alert('Error al generar backup del sistema');
    }
  };

  // Acciones diferentes según el rol
  const getActions = () => {
    if (user?.role === 'agency') {
      return [
    {
      id: 1,
      title: t('quickActions.newReservation'),
      description: t('quickActions.quickForm'),
      icon: PlusIcon,
      color: 'bg-primary-500 hover:bg-primary-600 text-white',
      onClick: handleNewReservation,
      oneClick: true
    },
    {
      id: 2,
      title: t('quickActions.todayAvailability'),
      description: t('quickActions.viewFreeSlots'),
      icon: CalendarIcon,  
      color: 'bg-secondary-500 hover:bg-secondary-600 text-white',
      onClick: handleViewCalendar,
      oneClick: true
    },
    {
      id: 3,
      title: t('quickActions.activeTours'),
      description: t('quickActions.quickView'),
      icon: EyeIcon,
      color: 'bg-success-500 hover:bg-success-600 text-white',
      onClick: handleQuickMonitoring,
      oneClick: true
    },
    {
      id: 4,
      title: t('quickActions.quickConsult'),
      description: t('quickActions.sendMessage'),
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      onClick: handleDirectConsult,
      oneClick: true
    },
    {
      id: 5,
      title: t('quickActions.generateReport'),
      description: t('quickActions.downloadCSV'),
      icon: DocumentTextIcon,
      color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
      onClick: handleGenerateReport,
      loading: isGeneratingReport,
      oneClick: true
    },
    {
      id: 6,
      title: t('quickActions.assignGuide'),
      description: t('quickActions.quickAssignment'),
      icon: UserGroupIcon,
      color: 'bg-gray-500 hover:bg-gray-600 text-white',
      onClick: handleAssignGuide,
      oneClick: true
    }
  ];
    } else { // admin
      return [
        {
          id: 1,
          title: t('quickActions.manageUsers'),
          description: 'Gestionar cuentas activas',
          icon: UserGroupIcon,
          color: 'bg-primary-500 hover:bg-primary-600 text-white',
          onClick: handleManageUsers
        },
        {
          id: 2,
          title: t('navigation.settings'),
          description: 'Configuración del sistema',
          icon: CogIcon,
          color: 'bg-secondary-500 hover:bg-secondary-600 text-white',
          onClick: () => navigate('/settings')
        },
        {
          id: 3,
          title: t('quickActions.globalMonitoring'),
          description: 'Vista global de todos los tours',
          icon: MapIcon,
          color: 'bg-success-500 hover:bg-success-600 text-white',
          onClick: handleGlobalMonitoring
        },
        {
          id: 4,
          title: t('quickActions.generalReports'),
          description: 'Análisis completo del sistema',
          icon: DocumentTextIcon,
          color: 'bg-purple-500 hover:bg-purple-600 text-white',
          onClick: handleGenerateReport,
          loading: isGeneratingReport
        },
        {
          id: 5,
          title: t('quickActions.announcements'),
          description: 'Enviar avisos masivos',
          icon: ChatBubbleLeftRightIcon,
          color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
          onClick: () => navigate('/chat', { 
            state: { 
              action: 'broadcast',
              type: 'announcement' 
            } 
          })
        },
        {
          id: 6,
          title: 'Backup Sistema',
          description: 'Respaldar datos del sistema',
          icon: ArrowDownTrayIcon,
          color: 'bg-gray-500 hover:bg-gray-600 text-white',
          onClick: handleSystemBackup
        }
      ];
    }
  };

  const actions = getActions();

  const shortcuts = [
    { key: 'Ctrl + N', action: t('quickActions.newReservationShortcut') },
    { key: 'Ctrl + M', action: t('quickActions.openMap') },
    { key: 'Ctrl + /', action: t('quickActions.quickSearch') },
    { key: 'Esc', action: t('quickActions.closeModal') }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold group-hover:text-gray-800 transition-colors">{t('quickActions.quickActions')}</h3>
        <InteractiveButton
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-600 p-2"
          icon={CogIcon}
        />
      </div>

      {/* Grid de acciones */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <div key={action.id} className="relative">
            <button
              onClick={action.onClick}
              disabled={action.loading || false}
              className={`w-full p-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 min-h-[120px] group ${action.color} ${action.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-center space-y-2">
                <action.icon className="w-8 h-8 mb-2 mx-auto group-hover:scale-110 transition-transform duration-200" />
                <h4 className="font-medium text-sm group-hover:scale-105 transition-transform duration-200">
                  {action.title}
                </h4>
                <p className="text-xs opacity-90 group-hover:opacity-100 transition-opacity duration-200">{action.description}</p>
              </div>
              
              {/* Loading spinner */}
              {action.loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
            
            {/* Badge para indicar si es requerido */}
            {action.badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg animate-pulse">
                {action.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Sección de ayuda rápida */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">{t('quickActions.keyboardShortcuts')}</h4>
          <InteractiveButton
            variant="ghost"
            size="sm"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            icon={QuestionMarkCircleIcon}
          >
            {t('quickActions.viewAll')}
          </InteractiveButton>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 group">
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{shortcut.action}</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono group-hover:bg-gray-200 group-hover:scale-105 transition-all duration-150">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Enlaces útiles */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('quickActions.usefulLinks')}</h4>
        <div className="flex flex-wrap gap-2">
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-all duration-150 hover:scale-105"
          >
            {t('quickActions.helpCenter')}
          </a>
          <span className="text-gray-300 self-center">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-all duration-150 hover:scale-105"
          >
            {t('quickActions.apiDocumentation')}
          </a>
          <span className="text-gray-300 self-center">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-all duration-150 hover:scale-105"
          >
            {t('quickActions.termsOfService')}
          </a>
          <span className="text-gray-300 self-center">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1.5 rounded-md hover:bg-primary-50 transition-all duration-150 hover:scale-105"
          >
            {t('quickActions.contactSupport')}
          </a>
        </div>
      </div>

      {/* Notificación de actualización */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded-full group-hover:scale-110 transition-transform duration-200">
            <PaperAirplaneIcon className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 group-hover:text-blue-800 transition-colors">
              {t('quickActions.newUpdateAvailable')}
            </p>
            <p className="text-xs text-blue-700 mt-1 group-hover:text-blue-600 transition-colors">
              {t('quickActions.version2Info')}
            </p>
            <InteractiveButton
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2 p-0 h-auto"
            >
              {t('quickActions.viewMoreDetails')}
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
          notification ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
        }`}>
          <div className={`
            ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
              notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
              'bg-blue-50 border-blue-200 text-blue-800'}
            border-l-4 rounded-lg shadow-lg p-4 relative overflow-hidden
            hover:shadow-xl transition-shadow duration-200
          `}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <div className="w-5 h-5 text-green-600">✓</div>
                )}
                {notification.type === 'error' && (
                  <div className="w-5 h-5 text-red-600">✕</div>
                )}
                {notification.type === 'info' && (
                  <div className="w-5 h-5 text-blue-600">ℹ</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors duration-150"
              >
                <div className="w-4 h-4">✕</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Modals */}
      <QuickActionModal
        isOpen={activeModal !== null}
        onClose={closeModal}
        type={activeModal}
        onSubmit={(formData) => handleModalSubmit(activeModal, formData)}
      />
    </div>
  );
};

export default QuickActions;