import { useState, useEffect } from 'react';
import { PlusIcon, ListBulletIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import ReservationWizard from '../components/reservations/ReservationWizard';
import ReservationList from '../components/reservations/ReservationList';
import ReservationCalendar from '../components/reservations/ReservationCalendar';
import ReservationsMobile from './ReservationsMobile';

const Reservations = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <ReservationsMobile />;
  }
  const [view, setView] = useState('list'); // 'list', 'new', 'calendar'
  const [showWizard, setShowWizard] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('reservations.reservations')}</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setView('list')}
            >
              <ListBulletIcon className="w-4 h-4 inline mr-2" />
              {t('reservations.list')}
            </button>
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              {t('reservations.calendar')}
            </button>
          </div>

          <button 
            onClick={() => setShowWizard(true)}
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm sm:text-base">{t('reservations.newReservation')}</span>
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