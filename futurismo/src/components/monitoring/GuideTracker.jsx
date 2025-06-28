import { useState } from 'react';
import { UserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon, BoltIcon, SignalIcon, MapIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';

const GuideTracker = ({ guide }) => {
  const [activeTab, setActiveTab] = useState('info');

  // Datos mock del guía
  const mockGuide = guide || {
    id: '1',
    name: 'Carlos Mendoza',
    phone: '+51 987654321',
    email: 'carlos.mendoza@futurismo.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'activo',
    currentTour: {
      name: 'City Tour Lima Histórica',
      startTime: new Date(Date.now() - 3600000),
      tourists: 12,
      progress: 60
    },
    device: {
      battery: 75,
      signal: 'buena',
      lastUpdate: new Date(Date.now() - 300000)
    },
    stats: {
      toursToday: 2,
      toursTotals: 156,
      rating: 4.8,
      punctuality: 95
    },
    recentActivity: [
      {
        id: 1,
        type: 'checkpoint',
        message: 'Llegó a Plaza de Armas',
        time: new Date(Date.now() - 1800000),
        icon: CheckCircleIcon,
        color: 'text-green-600'
      },
      {
        id: 2,
        type: 'delay',
        message: 'Retraso de 10 minutos por tráfico',
        time: new Date(Date.now() - 2700000),
        icon: ExclamationTriangleIcon,
        color: 'text-yellow-600'
      },
      {
        id: 3,
        type: 'start',
        message: 'Inició tour City Tour Lima',
        time: new Date(Date.now() - 3600000),
        icon: MapIcon,
        color: 'text-blue-600'
      }
    ]
  };

  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'excelente': return 'text-green-600';
      case 'buena': return 'text-blue-600';
      case 'regular': return 'text-yellow-600';
      case 'mala': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBatteryColor = (level) => {
    if (level > 60) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header del guía */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={mockGuide.avatar}
                alt={mockGuide.name}
                className="w-16 h-16 rounded-full"
              />
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                mockGuide.status === 'activo' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{mockGuide.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{mockGuide.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{mockGuide.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de dispositivo */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`flex items-center gap-1 ${getBatteryColor(mockGuide.device.battery)}`}>
                <BoltIcon className="w-5 h-5" />
                <span className="font-semibold">{mockGuide.device.battery}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Batería</p>
            </div>
            <div className="text-center">
              <div className={`flex items-center gap-1 ${getSignalIcon(mockGuide.device.signal)}`}>
                <SignalIcon className="w-5 h-5" />
                <span className="font-semibold capitalize">{mockGuide.device.signal}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Señal</p>
            </div>
          </div>
        </div>

        {/* Tour actual */}
        {mockGuide.currentTour && (
          <div className="mt-4 p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-900">Tour Actual</p>
                <p className="text-lg font-semibold text-primary-800">{mockGuide.currentTour.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-primary-700">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>Inicio: {formatters.formatTime(mockGuide.currentTour.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <span>{mockGuide.currentTour.tourists} turistas</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#1E40AF"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - mockGuide.currentTour.progress / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {mockGuide.currentTour.progress}%
                  </span>
                </div>
                <p className="text-xs text-primary-700 mt-1">Progreso</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'info' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'activity' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('activity')}
          >
            Actividad Reciente
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'stats' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Estadísticas
          </button>
        </div>
      </div>

      {/* Contenido de tabs */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Última actualización</p>
              <p className="font-medium">{formatters.formatDateTime(mockGuide.device.lastUpdate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado del dispositivo</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">GPS</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <CheckCircleIcon className="w-4 h-4" />
                    Activo
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conexión a Internet</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <CheckCircleIcon className="w-4 h-4" />
                    Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modo ahorro de batería</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-gray-600">
                    <XCircleIcon className="w-4 h-4" />
                    Desactivado
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            {mockGuide.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`mt-1 ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">{formatters.formatRelativeTime(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mockGuide.stats.toursToday}</p>
              <p className="text-sm text-gray-600">Tours hoy</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mockGuide.stats.toursTotals}</p>
              <p className="text-sm text-gray-600">Tours totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">⭐ {mockGuide.stats.rating}</p>
              <p className="text-sm text-gray-600">Calificación</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mockGuide.stats.punctuality}%</p>
              <p className="text-sm text-gray-600">Puntualidad</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideTracker;