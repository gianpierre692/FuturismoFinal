import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PlusIcon, 
  UserGroupIcon, 
  ClockIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import FantasticalLayout from '../calendar/FantasticalLayout';
import CalendarSidebar from '../calendar/Sidebar/CalendarSidebar';
import DayView from '../calendar/Views/DayView';
import WeekView from '../calendar/Views/WeekView';
import MonthView from '../calendar/Views/MonthView';
import useIndependentAgendaStore from '../../stores/independentAgendaStore';
import useAuthStore from '../../stores/authStore';
import Logger from '../../utils/logger';

const AdminAvailabilityView = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentView,
    currentGuide,
    selectedDate,
    actions: { 
      getGuideAvailability, 
      assignTourToGuide,
      setCurrentGuide 
    }
  } = useIndependentAgendaStore();

  const [isAssignTourModalOpen, setIsAssignTourModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [tourForm, setTourForm] = useState({
    title: '',
    client: '',
    location: '',
    duration: 4,
    description: '',
    price: '',
    status: 'pending'
  });

  // Guías data - sincronizado con mock data del store
  const guides = [
    { 
      id: '1', 
      name: 'Carlos Mendoza', 
      online: true, 
      role: 'freelance',
      phone: '+51 987 654 321',
      specialities: ['Machu Picchu', 'Valle Sagrado'],
      rating: 4.8,
      avatar: '/avatars/carlos.jpg'
    },
    { 
      id: '2', 
      name: 'Ana García', 
      online: false, 
      role: 'freelance',
      phone: '+51 987 654 322',
      specialities: ['City Tour', 'Museos'],
      rating: 4.9,
      avatar: '/avatars/ana.jpg'
    },
    { 
      id: '3', 
      name: 'Luis Rivera', 
      online: true, 
      role: 'freelance',
      phone: '+51 987 654 323',
      specialities: ['Aventura', 'Trekking'],
      rating: 4.7,
      avatar: '/avatars/luis.jpg'
    },
    { 
      id: 'user123', 
      name: 'María Torres', 
      online: true, 
      role: 'freelance',
      phone: '+51 987 654 324',
      specialities: ['Historia', 'Cultura'],
      rating: 4.9,
      avatar: '/avatars/maria.jpg'
    }
  ];

  const currentGuideInfo = guides.find(g => g.id === currentGuide) || guides[0];

  useEffect(() => {
    // Auto-seleccionar primer guía si no hay ninguno seleccionado
    if (!currentGuide && guides.length > 0) {
      setCurrentGuide(guides[0].id);
    }
  }, [currentGuide, setCurrentGuide]);

  const handleAssignTour = () => {
    if (!tourForm.title || !selectedTimeSlot || !currentGuide) return;

    const newTour = {
      ...tourForm,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
      guideId: currentGuide,
      assignedBy: user.id,
      assignedAt: new Date()
    };

    assignTourToGuide(currentGuide, newTour);

    // Reset form
    setTourForm({
      title: '',
      client: '',
      location: '',
      duration: 4,
      description: '',
      price: '',
      status: 'pending'
    });
    setSelectedTimeSlot(null);
    setIsAssignTourModalOpen(false);
  };

  const handleTimeSlotSelect = (date, timeString) => {
    // Convertir timeString a objeto de slot
    const [hours, minutes] = timeString.split(':').map(Number);
    const endHours = hours + tourForm.duration;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    const timeSlot = {
      date: date,
      startTime: timeString,
      endTime: endTime
    };
    
    setSelectedTimeSlot(timeSlot);
    setIsAssignTourModalOpen(true);
  };

  const handleEventClick = (event) => {
    Logger.debug('Admin clicked on event:', event);
    // Mostrar detalles del evento o permitir modificación si es tour de empresa
  };

  const handleDateClick = (date) => {
    // Cambiar a vista día de esa fecha específica
    Logger.debug('Admin clicked on date:', date);
  };

  const renderCurrentView = () => {
    const commonProps = {
      onTimeSlotClick: handleTimeSlotSelect,
      onDateClick: handleDateClick,
      onEventClick: handleEventClick
    };

    switch (currentView) {
      case 'day':
        return <DayView {...commonProps} />;
      case 'week':
        return <WeekView {...commonProps} />;
      case 'month':
        return <MonthView {...commonProps} />;
      default:
        return <DayView {...commonProps} />;
    }
  };

  const sidebar = (
    <div className="h-full flex flex-col">
      <CalendarSidebar />
      
      {/* Info del guía seleccionado */}
      {currentGuideInfo && (
        <div className="p-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t('admin.availability.selectedGuide')}</h4>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {currentGuideInfo.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {currentGuideInfo.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900">{currentGuideInfo.name}</p>
                <p className="text-xs text-gray-500">⭐ {currentGuideInfo.rating}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>{currentGuideInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🎯</span>
                <span>{currentGuideInfo.specialities.join(', ')}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-3">
              <button 
                onClick={() => navigate('/chat')}
                className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                <ChatBubbleLeftRightIcon className="w-3 h-3" />
                <span>{t('admin.availability.goToChat')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de todos los guías */}
      <div className="p-4 border-t border-gray-100 flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('admin.availability.allGuides')}</h4>
        <div className="space-y-2">
          {guides.map(guide => (
            <button
              key={guide.id}
              onClick={() => setCurrentGuide(guide.id)}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
                currentGuide === guide.id 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {guide.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {guide.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{guide.name}</p>
                <p className="text-xs text-gray-500">⭐ {guide.rating}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <FantasticalLayout
        sidebar={sidebar}
        viewComponent={renderCurrentView()}
      />

      {/* Modal Asignar Tour */}
      <Transition appear show={isAssignTourModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsAssignTourModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {t('admin.availability.assignTourTo')} {currentGuideInfo?.name}
                  </Dialog.Title>

                  {selectedTimeSlot && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        📅 {format(selectedDate, 'EEEE, d \'de\' MMMM', { locale: i18n.language === 'es' ? es : enUS })}
                      </p>
                      <p className="text-sm text-blue-600">
                        🕒 {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.availability.tourName')} *
                      </label>
                      <input
                        type="text"
                        value={tourForm.title}
                        onChange={(e) => setTourForm({...tourForm, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('admin.availability.tourNamePlaceholder')}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.availability.client')} *
                        </label>
                        <input
                          type="text"
                          value={tourForm.client}
                          onChange={(e) => setTourForm({...tourForm, client: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={t('admin.availability.clientPlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.availability.duration')}
                        </label>
                        <input
                          type="number"
                          value={tourForm.duration}
                          onChange={(e) => setTourForm({...tourForm, duration: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.availability.meetingPoint')}
                      </label>
                      <input
                        type="text"
                        value={tourForm.location}
                        onChange={(e) => setTourForm({...tourForm, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('admin.availability.meetingPointPlaceholder')}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.availability.price')}
                        </label>
                        <input
                          type="number"
                          value={tourForm.price}
                          onChange={(e) => setTourForm({...tourForm, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.availability.initialStatus')}
                        </label>
                        <select
                          value={tourForm.status}
                          onChange={(e) => setTourForm({...tourForm, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pending">{t('common.pending')}</option>
                          <option value="confirmed">{t('common.confirmed')}</option>
                          <option value="tentative">{t('admin.availability.tentative')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.availability.descriptionNotes')}
                      </label>
                      <textarea
                        value={tourForm.description}
                        onChange={(e) => setTourForm({...tourForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('admin.availability.descriptionPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      onClick={() => setIsAssignTourModalOpen(false)}
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      onClick={handleAssignTour}
                    >
                      {t('admin.availability.assignTour')}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};


export default AdminAvailabilityView;