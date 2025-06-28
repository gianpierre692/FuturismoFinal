import { useState } from 'react';
import { FreelanceAvailabilityView } from '../components/common/GuideAvailability';
import { UserIcon, CalendarIcon, CogIcon, BuildingOfficeIcon, PhoneIcon, CreditCardIcon, ShieldCheckIcon, DocumentTextIcon, LockClosedIcon, PowerIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
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

  // Configurar tabs - Secciones dinámicas según el rol
  const getTabsForRole = () => {
    const baseSections = ['company', 'contact', 'payment', 'status', 'documents'];
    const sections = (user?.role === 'agency' || user?.role === 'admin') 
      ? [...baseSections, 'feedback'] 
      : baseSections;
      
    return [
      { id: 'profile', name: 'Mi Perfil', icon: UserIcon, sections },
      { id: 'guides', name: 'Disponibilidad Guías', icon: CalendarIcon },
      { id: 'settings', name: 'Configuración', icon: CogIcon }
    ];
  };

  const tabs = getTabsForRole();

  // Función para generar el encabezado según el rol
  const getProfileHeader = () => {
    const roleLabels = {
      'agency': {
        title: 'Perfil de Agencia',
        subtitle: 'Gestiona toda la información de tu agencia de viajes',
        gradient: 'from-blue-600 to-purple-600'
      },
      'guide': {
        title: 'Perfil de Guía',
        subtitle: 'Gestiona tu información profesional y servicios de guía',
        gradient: 'from-green-600 to-teal-600'
      },
      'admin': {
        title: 'Perfil de Administrador',
        subtitle: 'Gestiona tu información y configuración del sistema',
        gradient: 'from-red-600 to-pink-600'
      },
      'default': {
        title: 'Mi Perfil',
        subtitle: 'Gestiona tu información personal y preferencias',
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
            <p className="text-sm text-blue-100">Usuario activo</p>
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
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Administración</h1>
      
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
                <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
                <p className="text-sm text-gray-500">Opciones de seguridad y sesión</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePasswordChange}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <LockClosedIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Cambiar contraseña</p>
                  <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
              >
                <PowerIcon className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-900">Cerrar sesión</p>
                  <p className="text-sm text-red-500">Salir de tu cuenta actual</p>
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
          <h2 className="text-xl font-semibold mb-4">Configuración del Sistema</h2>
          <p className="text-gray-600">Configuración general y notificaciones - Por implementar</p>
        </div>
      )}
    </div>
  );
};

export default Profile;