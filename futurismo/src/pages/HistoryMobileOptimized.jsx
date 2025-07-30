import { useState } from 'react';
import { 
  CalendarDaysIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  FunnelIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  DocumentArrowDownIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HistoryMobileOptimized = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showFilters, setShowFilters] = useState(false);

  // Datos de ejemplo
  const stats = {
    total: 47,
    completed: 42,
    cancelled: 5,
    completionRate: 89,
    earnings: 3240
  };

  const recentTrips = [
    {
      id: 1,
      date: '2024-01-29',
      time: '09:00',
      tour: 'City Tour Lima',
      tourists: 12,
      status: 'completed',
      earnings: 180
    },
    {
      id: 2,
      date: '2024-01-29',
      time: '14:00',
      tour: 'Islas Palomino',
      tourists: 8,
      status: 'completed',
      earnings: 240
    },
    {
      id: 3,
      date: '2024-01-28',
      time: '10:00',
      tour: 'Tour Gastronómico',
      tourists: 6,
      status: 'cancelled',
      reason: 'Mal tiempo'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER MÓVIL COMPACTO */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Historial</h1>
          
          <button className="p-2 -mr-2 rounded-lg hover:bg-gray-100">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* TABS DE PERÍODO */}
      <div className="bg-white border-b">
        <div className="flex px-4 gap-4 overflow-x-auto scrollbar-hide">
          {['Hoy', 'Semana', 'Mes', 'Año'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`py-3 px-1 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* STATS CARDS HORIZONTALES */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Stat principal */}
          <div className="p-4 bg-gradient-to-r from-primary to-primary-dark text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Ganancia {selectedPeriod}</p>
                <p className="text-2xl font-bold">S/ {stats.earnings}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Tasa éxito</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
            </div>
          </div>
          
          {/* Stats secundarias */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="p-3 text-center">
              <CalendarDaysIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
              <p className="text-xl font-semibold">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="p-3 text-center">
              <CheckCircleIcon className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <p className="text-xl font-semibold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-500">Completados</p>
            </div>
            <div className="p-3 text-center">
              <XCircleIcon className="w-5 h-5 mx-auto mb-1 text-red-500" />
              <p className="text-xl font-semibold text-red-600">{stats.cancelled}</p>
              <p className="text-xs text-gray-500">Cancelados</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTROS Y ACCIONES */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-lg border border-gray-200"
        >
          <FunnelIcon className="w-4 h-4" />
          Filtros
          {showFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
        </button>
        
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-lg border border-gray-200">
            <ShareIcon className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white rounded-lg border border-gray-200">
            <DocumentArrowDownIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LISTA DE VIAJES OPTIMIZADA */}
      <div className="px-4 pb-20">
        <div className="space-y-3">
          {recentTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        
        {/* Load more */}
        <button className="w-full mt-4 py-3 text-sm text-primary font-medium">
          Cargar más viajes
        </button>
      </div>

      {/* BOTTOM NAVIGATION (si aplica) */}
      <BottomNav />
    </div>
  );
};

// COMPONENTE DE CARD OPTIMIZADO PARA MÓVIL
const TripCard = ({ trip }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{trip.tour}</h3>
          <p className="text-sm text-gray-500">
            {trip.date} • {trip.time} • {trip.tourists} turistas
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[trip.status]}`}>
          {trip.status === 'completed' ? 'Completado' : 'Cancelado'}
        </span>
      </div>
      
      {trip.earnings && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">Ganancia</span>
          <span className="font-semibold text-green-600">S/ {trip.earnings}</span>
        </div>
      )}
      
      {trip.reason && (
        <p className="text-sm text-red-600 mt-2">Razón: {trip.reason}</p>
      )}
    </div>
  );
};

// BOTTOM NAVIGATION MOBILE
const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="grid grid-cols-5 gap-1">
        <a href="/dashboard" className="flex flex-col items-center py-2 text-gray-400">
          <HomeIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Inicio</span>
        </a>
        <a href="/monitoring" className="flex flex-col items-center py-2 text-gray-400">
          <MapIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Mapa</span>
        </a>
        <a href="/agenda" className="flex flex-col items-center py-2 text-gray-400">
          <CalendarIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Agenda</span>
        </a>
        <a href="/history" className="flex flex-col items-center py-2 text-primary">
          <ClockIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Historial</span>
        </a>
        <a href="/profile" className="flex flex-col items-center py-2 text-gray-400">
          <UserIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Perfil</span>
        </a>
      </div>
    </nav>
  );
};

export default HistoryMobileOptimized;