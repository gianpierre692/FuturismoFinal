import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getMockData } from '../../data/mockData';
import { useGuidesStore } from '../../stores/guidesStore';

const GuideAvailability = ({ guideId, viewMode = 'edit', onAvailabilityChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { getGuideAgenda, updateGuideAgenda } = useGuidesStore();

  useEffect(() => {
    loadAvailability();
  }, [guideId, selectedDate]);

  const loadAvailability = () => {
    setIsLoading(true);
    const agenda = getGuideAgenda(guideId, selectedDate);
    setAvailability(agenda);
    setIsLoading(false);
  };

  const updateAvailability = (newAvailability) => {
    setAvailability(newAvailability);
    updateGuideAgenda(guideId, selectedDate, newAvailability);
    if (onAvailabilityChange) {
      onAvailabilityChange(selectedDate, newAvailability);
    }
  };

  const addTimeSlot = () => {
    const newSlot = prompt('Ingresa el horario (ej: 09:00-13:00):');
    if (newSlot && /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(newSlot)) {
      const updatedAvailability = {
        ...availability,
        disponible: true,
        horarios: [...(availability?.horarios || []), newSlot]
      };
      updateAvailability(updatedAvailability);
    }
  };

  const removeTimeSlot = (index) => {
    const updatedAvailability = {
      ...availability,
      horarios: availability.horarios.filter((_, i) => i !== index)
    };
    if (updatedAvailability.horarios.length === 0) {
      updatedAvailability.disponible = false;
    }
    updateAvailability(updatedAvailability);
  };

  const toggleAvailability = () => {
    const updatedAvailability = {
      disponible: !availability?.disponible,
      horarios: availability?.disponible ? [] : ['09:00-17:00']
    };
    updateAvailability(updatedAvailability);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Agenda de Disponibilidad
        </h3>
        {viewMode === 'edit' && (
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              availability?.disponible
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {availability?.disponible ? 'Marcar No Disponible' : 'Marcar Disponible'}
          </button>
        )}
      </div>

      {/* Navegación de fecha */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-900">
            {formatDate(selectedDate)}
          </h4>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="mt-1 text-sm text-gray-600 border-none bg-transparent text-center"
          />
        </div>
        <button
          onClick={() => changeDate(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Estado de disponibilidad */}
      <div className="mb-6">
        <div className={`flex items-center p-4 rounded-lg ${
          availability?.disponible
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {availability?.disponible ? (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Disponible</span>
            </>
          ) : (
            <>
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">No Disponible</span>
            </>
          )}
        </div>
      </div>

      {/* Horarios disponibles */}
      {availability?.disponible && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-md font-medium text-gray-900 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2 text-gray-600" />
              Horarios Disponibles
            </h5>
            {viewMode === 'edit' && (
              <button
                onClick={addTimeSlot}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Agregar Horario
              </button>
            )}
          </div>

          <div className="space-y-2">
            {availability.horarios?.length > 0 ? (
              availability.horarios.map((horario, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <span className="text-gray-700 font-medium">{horario}</span>
                  {viewMode === 'edit' && (
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">
                No hay horarios específicos definidos
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para ver la disponibilidad de múltiples guías freelance
export const FreelanceAvailabilityView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [freelanceGuides, setFreelanceGuides] = useState([]);
  
  const { getGuides, getGuideAgenda } = useGuidesStore();

  useEffect(() => {
    const guides = getGuides({ tipo: 'freelance' });
    setFreelanceGuides(guides);
  }, [getGuides]);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
          Disponibilidad de Guías Freelance
        </h3>

        {/* Navegación de fecha */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900">
              {formatDate(selectedDate)}
            </h4>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="mt-1 text-sm text-gray-600 border-none bg-transparent text-center"
            />
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>

        {/* Lista de guías freelance */}
        <div className="space-y-4">
          {freelanceGuides.map((guide) => {
            const agenda = getGuideAgenda(guide.id, selectedDate);
            return (
              <div
                key={guide.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{guide.name}</h4>
                    <p className="text-sm text-gray-600">
                      {guide.specialties.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {agenda?.disponible ? (
                    <div>
                      <div className="flex items-center text-green-600 mb-1">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Disponible</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {agenda.horarios.join(', ') || 'Todo el día'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">No Disponible</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuideAvailability;