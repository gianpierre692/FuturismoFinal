import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';
import { format, isToday, isTomorrow, isAfter, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

const MisTours = () => {
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [tours] = useState([
    {
      id: 1,
      title: 'Tour Valle Sagrado',
      date: new Date(),
      time: '09:00',
      duration: '8 horas',
      tourists: 8,
      pickupLocation: 'Hotel Belmond, San Blas',
      status: 'en_progreso',
      agency: 'Peru Adventures',
      contactPhone: '+51 987654321',
      estimatedEnd: '17:00'
    },
    {
      id: 2,
      title: 'City Tour Cusco',
      date: addDays(new Date(), 1),
      time: '14:00',
      duration: '4 horas',
      tourists: 12,
      pickupLocation: 'Plaza San Francisco',
      status: 'programado',
      agency: 'Andes Explorer',
      contactPhone: '+51 987654322',
      estimatedEnd: '18:00'
    },
    {
      id: 3,
      title: 'Tour Machu Picchu',
      date: addDays(new Date(), 2),
      time: '05:30',
      duration: '12 horas',
      tourists: 6,
      pickupLocation: 'Estación San Pedro',
      status: 'programado',
      agency: 'Sacred Valley Tours',
      contactPhone: '+51 987654323',
      estimatedEnd: '18:30'
    },
    {
      id: 4,
      title: 'Tour Gastronómico',
      date: new Date(Date.now() - 86400000),
      time: '19:00',
      duration: '3 horas',
      tourists: 4,
      pickupLocation: 'Mercado Central',
      status: 'completado',
      agency: 'Food & Culture',
      contactPhone: '+51 987654324',
      estimatedEnd: '22:00'
    },
    {
      id: 5,
      title: 'Tour Sacsayhuamán',
      date: new Date(Date.now() - 172800000),
      time: '10:00',
      duration: '5 horas',
      tourists: 15,
      pickupLocation: 'Plaza de Armas',
      status: 'completado',
      agency: 'Inca Heritage',
      contactPhone: '+51 987654325',
      estimatedEnd: '15:00'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'programado': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-green-100 text-green-800';
      case 'completado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'programado': return 'Programado';
      case 'en_progreso': return 'En Progreso';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'programado': return ClockIcon;
      case 'en_progreso': return PlayIcon;
      case 'completado': return CheckCircleIcon;
      case 'cancelado': return ExclamationCircleIcon;
      default: return InformationCircleIcon;
    }
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return format(date, 'EEEE, dd MMM', { locale: es });
  };

  const filteredTours = tours.filter(tour => {
    switch (selectedFilter) {
      case 'hoy':
        return isToday(tour.date);
      case 'proximos':
        return isAfter(tour.date, new Date()) || isToday(tour.date);
      case 'completados':
        return tour.status === 'completado';
      case 'en_progreso':
        return tour.status === 'en_progreso';
      default:
        return true;
    }
  });

  if (user?.role !== 'guide') {
    return (
      <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
            <CalendarIcon className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Mis Tours
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Esta función está disponible solo para guías.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Mis Tours
              </h1>
              <p className="text-sm text-gray-600">
                Gestiona y revisa tus tours asignados
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {filteredTours.length} tours
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'todos', label: 'Todos', count: tours.length },
              { key: 'hoy', label: 'Hoy', count: tours.filter(t => isToday(t.date)).length },
              { key: 'proximos', label: 'Próximos', count: tours.filter(t => isAfter(t.date, new Date()) || isToday(t.date)).length },
              { key: 'en_progreso', label: 'En Progreso', count: tours.filter(t => t.status === 'en_progreso').length },
              { key: 'completados', label: 'Completados', count: tours.filter(t => t.status === 'completado').length }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Tours */}
        <div className="space-y-4">
          {filteredTours.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay tours para mostrar
              </h3>
              <p className="text-gray-600">
                {selectedFilter === 'todos' 
                  ? 'Aún no tienes tours asignados.'
                  : `No hay tours en la categoría "${selectedFilter === 'hoy' ? 'Hoy' : selectedFilter === 'proximos' ? 'Próximos' : selectedFilter === 'en_progreso' ? 'En Progreso' : 'Completados'}".`
                }
              </p>
            </div>
          ) : (
            filteredTours.map(tour => {
              const StatusIcon = getStatusIcon(tour.status);
              return (
                <div key={tour.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {tour.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {getDateLabel(tour.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {tour.time} - {tour.estimatedEnd}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserGroupIcon className="w-4 h-4" />
                            {tour.tourists} turistas
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(tour.status)}`}>
                          <StatusIcon className="w-4 h-4" />
                          {getStatusLabel(tour.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Lugar de Recojo</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          {tour.pickupLocation}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Agencia</p>
                        <p className="text-sm text-gray-600">{tour.agency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Duración</p>
                        <p className="text-sm text-gray-600">{tour.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Contacto</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          {tour.contactPhone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        {tour.status === 'en_progreso' && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            Ver en Monitoreo
                          </button>
                        )}
                        {tour.status === 'programado' && isToday(tour.date) && (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Iniciar Tour
                          </button>
                        )}
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          Ver Detalles
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: #{tour.id}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MisTours;