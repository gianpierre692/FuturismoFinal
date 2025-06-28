import { useState } from 'react';
import { PlusIcon, ListBulletIcon, CalendarIcon } from '@heroicons/react/24/outline';
import ReservationWizard from '../components/reservations/ReservationWizard';
import ReservationList from '../components/reservations/ReservationList';
import ReservationCalendar from '../components/reservations/ReservationCalendar';

const Reservations = () => {
  const [view, setView] = useState('list'); // 'list', 'new', 'calendar'
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
        
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setView('list')}
            >
              <ListBulletIcon className="w-4 h-4 inline mr-2" />
              Lista
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Calendario
            </button>
          </div>

          <button 
            onClick={() => setShowWizard(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {showWizard ? (
          <ReservationWizard onClose={() => setShowWizard(false)} />
        ) : (
          <>
            {view === 'list' && <ReservationList />}
            
            {view === 'calendar' && (
              <ReservationCalendar 
                onNewReservation={() => setShowWizard(true)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reservations;