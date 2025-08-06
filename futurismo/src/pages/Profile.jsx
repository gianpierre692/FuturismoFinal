import { useState, useEffect } from 'react';
import { FreelanceAvailabilityView } from '../components/common/GuideAvailability';
import { UserIcon, CalendarIcon, CogIcon, BuildingOfficeIcon, PhoneIcon, CreditCardIcon, ShieldCheckIcon, DocumentTextIcon, LockClosedIcon, PowerIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../stores/authStore';
import CompanyDataSection from '../components/profile/CompanyDataSection';
import ContactDataSection from '../components/profile/ContactDataSection';
import PaymentDataSection from '../components/profile/PaymentDataSection';
import AccountStatusSection from '../components/profile/AccountStatusSection';
import DocumentsSection from '../components/profile/DocumentsSection';
import FeedbackSection from '../components/profile/FeedbackSectionSimple';
import ImageUpload from '../components/common/ImageUpload';
import ProfileMobile from './ProfileMobile';
import Logger from '../utils/logger';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [uploadError, setUploadError] = useState(null);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manejar cambio de imagen de perfil
  const handleImageSelect = (file, error) => {
    if (error) {
      setUploadError(error);
      return;
    }

    if (file) {
      // En producción aquí harías el upload al servidor
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setUploadError(null);
        
        // Simular actualización del usuario en el store
        // En producción actualizarías el usuario en authStore con la nueva imagen
        Logger.debug('Imagen de perfil actualizada:', file.name);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(null);
    }
  };

  // Usar versión móvil para pantallas pequeñas
  if (isMobile) {
    return <ProfileMobile />;
  }

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
        <div className="flex items-center gap-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-white/70" />
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{config.title}</h2>
            <p className="text-white/80 mb-2">{config.subtitle}</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-white/70">{t('profile.activeUser')}</p>
                <p className="text-lg font-semibold">{user?.name || 'Usuario'}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>
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
    <div className="page-container">
      <div className="page-content-none">
        <div className="page-header-none">
          <h1 className="page-title">{t('profile.administration')}</h1>
        </div>
      
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

          {/* Foto de perfil */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  Foto de Perfil
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Sube una foto para personalizar tu perfil y mejorar tu presencia profesional
                </p>
              </div>
              
              {/* Indicador de ejemplo */}
              <div className="flex-shrink-0 text-center">
                <div className="w-16 h-16 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50">
                  <span className="text-xs text-blue-600 font-medium">800x800</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Ideal</p>
              </div>
            </div>
            
            <div className="max-w-md">
              <ImageUpload
                onImageSelect={handleImageSelect}
                initialImage={profileImage}
                error={uploadError}
              />
            </div>
          </div>

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
    </div>
  );
};

export default Profile;