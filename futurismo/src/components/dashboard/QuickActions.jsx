import { PlusIcon, CalendarIcon, UserGroupIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, ArrowDownTrayIcon, CogIcon, QuestionMarkCircleIcon, PaperAirplaneIcon, MapIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { generateWhatsAppURL, canBookDirectly } from '../../utils/formatters';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  // Acciones diferentes según el rol
  const getActions = () => {
    if (user?.role === 'agency') {
      return [
    {
      id: 1,
      title: t('quickActions.newReservation'),
      description: t('quickActions.createNewReservation'),
      icon: PlusIcon,
      color: 'bg-primary-500 hover:bg-primary-600 text-white',
      onClick: () => navigate('/reservations')
    },
    {
      id: 2,
      title: t('quickActions.viewCalendar'),
      description: t('quickActions.checkAvailability'),
      icon: CalendarIcon,
      color: 'bg-secondary-500 hover:bg-secondary-600 text-white',
      onClick: () => navigate('/reservations')
    },
    {
      id: 3,
      title: t('quickActions.liveMonitoring'),
      description: t('quickActions.viewActiveTours'),
      icon: MapIcon,
      color: 'bg-success-500 hover:bg-success-600 text-white',
      onClick: () => navigate('/monitoring')
    },
    {
      id: 4,
      title: t('quickActions.consultFullDay'),
      description: t('quickActions.whatsappAfter5'),
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      onClick: () => {
        const currentHour = new Date().getHours();
        const message = currentHour >= 17 
          ? t('quickActions.fullDayConsultMessage')
          : t('quickActions.fullDayInfoMessage');
        window.open(generateWhatsAppURL(message), '_blank');
      },
      badge: !canBookDirectly() ? t('quickActions.required') : null
    },
    {
      id: 5,
      title: t('quickActions.generateReport'),
      description: t('quickActions.exportMonthData'),
      icon: DocumentTextIcon,
      color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
      onClick: () => navigate('/history')
    },
    {
      id: 6,
      title: t('quickActions.assignGuide'),
      description: t('quickActions.manageAssignments'),
      icon: UserGroupIcon,
      color: 'bg-gray-500 hover:bg-gray-600 text-white',
      onClick: () => navigate('/reservations')
    }
  ];
    } else { // admin
      return [
        {
          id: 1,
          title: t('quickActions.manageUsers'),
          description: t('quickActions.manageAccounts'),
          icon: UserGroupIcon,
          color: 'bg-primary-500 hover:bg-primary-600 text-white',
          onClick: () => navigate('/users')
        },
        {
          id: 2,
          title: t('navigation.settings'),
          description: t('quickActions.exportMonthData'),
          icon: CogIcon,
          color: 'bg-secondary-500 hover:bg-secondary-600 text-white',
          onClick: () => navigate('/settings')
        },
        {
          id: 3,
          title: t('quickActions.globalMonitoring'),
          description: t('quickActions.viewAllTours'),
          icon: MapIcon,
          color: 'bg-success-500 hover:bg-success-600 text-white',
          onClick: () => navigate('/monitoring')
        },
        {
          id: 4,
          title: t('quickActions.generalReports'),
          description: t('quickActions.completeAnalysis'),
          icon: DocumentTextIcon,
          color: 'bg-purple-500 hover:bg-purple-600 text-white',
          onClick: () => navigate('/history')
        },
        {
          id: 5,
          title: t('quickActions.announcements'),
          description: t('quickActions.sendMassNotices'),
          icon: ChatBubbleLeftRightIcon,
          color: 'bg-indigo-500 hover:bg-indigo-600 text-white',
          onClick: () => navigate('/chat')
        },
        {
          id: 6,
          title: t('quickActions.backup'),
          description: t('quickActions.systemBackup'),
          icon: ArrowDownTrayIcon,
          color: 'bg-gray-500 hover:bg-gray-600 text-white',
          onClick: () => console.log('Iniciar backup')
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
        <h3 className="text-lg font-semibold">{t('quickActions.quickActions')}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <CogIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Squares2X2Icon de acciones */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-4 rounded-lg transition-all transform hover:scale-105 ${action.color} group relative`}
          >
            <action.icon className="w-8 h-8 mb-2" />
            <h4 className="font-medium text-sm">{action.title}</h4>
            <p className="text-xs opacity-90 mt-1">{action.description}</p>
            
            {/* Badge para indicar si es requerido */}
            {action.badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                {action.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sección de ayuda rápida */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">{t('quickActions.keyboardShortcuts')}</h4>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            <QuestionMarkCircleIcon className="w-4 h-4" />
            {t('quickActions.viewAll')}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{shortcut.action}</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
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
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t('quickActions.helpCenter')}
          </a>
          <span className="text-gray-300">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t('quickActions.apiDocumentation')}
          </a>
          <span className="text-gray-300">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t('quickActions.termsOfService')}
          </a>
          <span className="text-gray-300">•</span>
          <a 
            href="#" 
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t('quickActions.contactSupport')}
          </a>
        </div>
      </div>

      {/* Notificación de actualización */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <PaperAirplaneIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">{t('quickActions.newUpdateAvailable')}</p>
            <p className="text-xs text-blue-700 mt-1">
              {t('quickActions.version2Info')}
            </p>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2">
              {t('quickActions.viewMoreDetails')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;