import { useState } from 'react';
import { FreelanceAvailabilityView } from '../components/common/GuideAvailability';
import { UserIcon, CalendarIcon, CogIcon, BuildingOfficeIcon, PhoneIcon, CreditCardIcon, ShieldCheckIcon, DocumentTextIcon, LockClosedIcon, PowerIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import CompanyDataSection from '../components/profile/CompanyDataSection';
import ContactDataSection from '../components/profile/ContactDataSection';
import PaymentDataSection from '../components/profile/PaymentDataSection';
import AccountStatusSection from '../components/profile/AccountStatusSection';
import DocumentsSection from '../components/profile/DocumentsSection';
import FeedbackSection from '../components/profile/FeedbackSectionSimple';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  // Configurar tabs - Secciones dinámicas según el rol
  const getTabsForRole = () => {
    const baseSections = ['company', 'contact', 'payment', 'status', 'documents'];
    const sections = (user?.role === 'agency' || user?.role === 'admin') 
      ? [...baseSections, 'feedback'] 
      : baseSections;
      
    return [
      { id: 'profile', name: t('profile.myProfile'), icon: UserIcon, sections },
      { id: 'guides', name: t('profile.guideAvailability'), icon: CalendarIcon },
      { id: 'settings', name: t('profile.configuration'), icon: CogIcon }
    ];
  };

  const tabs = getTabsForRole();

  // Función para generar el encabezado según el rol
  const getProfileHeader = () => {
    const roleLabels = {
      'agency': {
        title: t('profile.agencyProfile'),
        subtitle: t('profile.manageAgencyInfo'),
        gradient: 'from-blue-600 to-purple-600'
      },
      'guide': {
        title: t('profile.guideProfile'),
        subtitle: t('profile.manageGuideInfo'),
        gradient: 'from-green-600 to-teal-600'
      },
      'admin': {
        title: t('profile.adminProfile'),
        subtitle: t('profile.manageAdminInfo'),
        gradient: 'from-red-600 to-pink-600'
      },
      'default': {
        title: t('profile.myProfile'),
        subtitle: t('profile.manageAdminInfo'),
        gradient: 'from-gray-600 to-blue-600'
      }
    };

    const config = roleLabels[user?.role] || roleLabels.default;
    
    return (
      <div className={`bg-gradient-to-r ${config.gradient} rounded-lg p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
            <p className="text-blue-100">{config.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">{t('profile.activeUser')}</p>
            <p className="text-lg font-semibold">{user?.name || 'Usuario'}</p>
          </div>
        </div>
      </div>
    );
  };

  const handlePasswordChange = () => {
    alert('🔐 Funcionalidad de cambio de contraseña - Por implementar');
  };

  const handleLogout = () => {
    if (window.confirm(t('profile.logoutConfirm'))) {
      logout();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('profile.administration')}</h1>
      
      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Header del perfil - dinámico según el rol */}
          {getProfileHeader()}

          {/* Datos de empresa */}
          <CompanyDataSection />

          {/* Datos de contacto */}
          <ContactDataSection />

          {/* Datos de pago */}
          <PaymentDataSection />

          {/* Estado de la cuenta */}
          <AccountStatusSection />

          {/* Documentos */}
          <DocumentsSection />

          {/* Opiniones y sugerencias - Solo para agencias y admins */}
          {(user?.role === 'agency' || user?.role === 'admin') && (
            <FeedbackSection userRole={user?.role} />
          )}

          {/* Configuración de cuenta */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CogIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('profile.configuration')}</h3>
                <p className="text-sm text-gray-500">{t('profile.securityOptions')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePasswordChange}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <LockClosedIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{t('profile.changePassword')}</p>
                  <p className="text-sm text-gray-500">{t('profile.updatePassword')}</p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
              >
                <PowerIcon className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-900">{t('profile.logout')}</p>
                  <p className="text-sm text-red-500">{t('profile.logoutCurrent')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guides' && (
        <FreelanceAvailabilityView />
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('profile.systemConfig')}</h2>
          <p className="text-gray-600">{t('profile.generalConfig')}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;