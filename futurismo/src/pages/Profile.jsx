import { useState } from 'react';
import { FreelanceAvailabilityView } from '../components/common/GuideAvailability';
import { UserIcon, CalendarIcon, CogIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Mi Perfil', icon: UserIcon },
    { id: 'guides', name: 'Disponibilidad Guías', icon: CalendarIcon },
    { id: 'settings', name: 'Configuración', icon: CogIcon }
  ];

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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <p className="text-gray-600">Configuración de perfil personal - Por implementar</p>
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