import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const Historial = () => {
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const [historicalTours] = useState([
    {
      id: 1,
      title: 'Tour Valle Sagrado',
      date: subDays(new Date(), 1),
      time: '09:00',
      duration: '8 horas',
      tourists: 8,
      pickupLocation: 'Hotel Belmond, San Blas',
      status: 'completado',
      agency: 'Peru Adventures',
      rating: 4.8,
      earnings: 280,
      photos: 12,
      feedback: 'Excelente tour, el guía fue muy profesional y conocedor.'
    },
    {
      id: 2,
      title: 'City Tour Cusco',
      date: subDays(new Date(), 3),
      time: '14:00',
      duration: '4 horas',
      tourists: 12,
      pickupLocation: 'Plaza San Francisco',
      status: 'completado',
      agency: 'Andes Explorer',
      rating: 4.9,
      earnings: 180,
      photos: 8,
      feedback: 'Tour muy informativo, recomendado.'
    },
    {
      id: 3,
      title: 'Tour Machu Picchu',
      date: subDays(new Date(), 5),
      time: '05:30',
      duration: '12 horas',
      tourists: 6,
      pickupLocation: 'Estación San Pedro',
      status: 'completado',
      agency: 'Sacred Valley Tours',
      rating: 5.0,
      earnings: 450,
      photos: 25,
      feedback: 'Experiencia inolvidable, el mejor tour que he tomado.'
    },
    {
      id: 4,
      title: 'Tour Gastronómico',
      date: subDays(new Date(), 7),
      time: '19:00',
      duration: '3 horas',
      tourists: 4,
      pickupLocation: 'Mercado Central',
      status: 'cancelado',
      agency: 'Food & Culture',
      rating: null,
      earnings: 0,
      photos: 0,
      cancelReason: 'Mal clima'
    },
    {
      id: 5,
      title: 'Tour Sacsayhuamán',
      date: subWeeks(new Date(), 2),
      time: '10:00',
      duration: '5 horas',
      tourists: 15,
      pickupLocation: 'Plaza de Armas',
      status: 'completado',
      agency: 'Inca Heritage',
      rating: 4.7,
      earnings: 320,
      photos: 18,
      feedback: 'Muy buena explicación histórica.'
    },
    {
      id: 6,
      title: 'Tour Laguna Humantay',
      date: subWeeks(new Date(), 3),
      time: '04:00',
      duration: '14 horas',
      tourists: 10,
      pickupLocation: 'Plaza de Armas',
      status: 'completado',
      agency: 'Mountain Adventures',
      rating: 4.6,
      earnings: 380,
      photos: 22,
      feedback: 'Tour desafiante pero muy gratificante.'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completado': return CheckCircleIcon;
      case 'cancelado': return XCircleIcon;
      default: return CalendarIcon;
    }
  };

  const filteredTours = historicalTours.filter(tour => {
    const tourDate = tour.date;
    const now = new Date();
    
    let periodFilter = true;
    switch (selectedPeriod) {
      case 'semana':
        periodFilter = tourDate >= subDays(now, 7);
        break;
      case 'mes':
        periodFilter = tourDate >= subDays(now, 30);
        break;
      case 'trimestre':
        periodFilter = tourDate >= subDays(now, 90);
        break;
      default:
        periodFilter = true;
    }

    let statusFilter = true;
    switch (selectedFilter) {
      case 'completados':
        statusFilter = tour.status === 'completado';
        break;
      case 'cancelados':
        statusFilter = tour.status === 'cancelado';
        break;
      case 'alta_calificacion':
        statusFilter = tour.rating >= 4.5;
        break;
      default:
        statusFilter = true;
    }

    return periodFilter && statusFilter;
  });

  const totalEarnings = filteredTours.reduce((sum, tour) => sum + tour.earnings, 0);
  const completedTours = filteredTours.filter(tour => tour.status === 'completado').length;
  const avgRating = filteredTours
    .filter(tour => tour.rating)
    .reduce((sum, tour, _, arr) => sum + tour.rating / arr.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Historial de Tours
              </h1>
              <p className="text-sm text-gray-600">
                Revisa tu historial de tours realizados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Tours Completados</p>
                <p className="text-2xl font-semibold text-gray-900">{completedTours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Ganancias Totales</p>
                <p className="text-2xl font-semibold text-gray-900">S/. {totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Calificación Promedio</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'} ⭐
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PhotoIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Fotos Subidas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredTours.reduce((sum, tour) => sum + tour.photos, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro de Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'semana', label: 'Última Semana' },
                  { key: 'mes', label: 'Último Mes' },
                  { key: 'trimestre', label: 'Último Trimestre' },
                  { key: 'todos', label: 'Todo el Tiempo' }
                ].map(period => (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedPeriod === period.key
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro de Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'todos', label: 'Todos' },
                  { key: 'completados', label: 'Completados' },
                  { key: 'cancelados', label: 'Cancelados' },
                  { key: 'alta_calificacion', label: 'Alta Calificación (4.5+)' }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedFilter === filter.key
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Tours Históricos */}
        <div className="space-y-4">
          {filteredTours.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay tours en el historial
              </h3>
              <p className="text-gray-600">
                No se encontraron tours con los filtros seleccionados.
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
                            {format(tour.date, 'EEEE, dd MMM yyyy', { locale: es })}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {tour.time} ({tour.duration})
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
                          {tour.status === 'completado' ? 'Completado' : 'Cancelado'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Agencia</p>
                        <p className="text-sm text-gray-600">{tour.agency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Lugar de Recojo</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          {tour.pickupLocation}
                        </div>
                      </div>
                      {tour.status === 'completado' && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Ganancias</p>
                          <p className="text-sm font-semibold text-green-600">S/. {tour.earnings}</p>
                        </div>
                      )}
                    </div>

                    {tour.status === 'completado' && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                              <span className="text-lg font-semibold">{tour.rating}</span>
                            </div>
                            <p className="text-xs text-gray-600">Calificación</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <PhotoIcon className="w-5 h-5 text-purple-500 mr-1" />
                              <span className="text-lg font-semibold">{tour.photos}</span>
                            </div>
                            <p className="text-xs text-gray-600">Fotos Subidas</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <UserGroupIcon className="w-5 h-5 text-blue-500 mr-1" />
                              <span className="text-lg font-semibold">{tour.tourists}</span>
                            </div>
                            <p className="text-xs text-gray-600">Turistas</p>
                          </div>
                        </div>
                        {tour.feedback && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">Comentarios del cliente:</p>
                            <p className="text-sm text-gray-600 italic">"{tour.feedback}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    {tour.status === 'cancelado' && tour.cancelReason && (
                      <div className="bg-red-50 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-red-800 mb-1">Motivo de cancelación:</p>
                        <p className="text-sm text-red-700">{tour.cancelReason}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          Ver Detalles
                        </button>
                        {tour.status === 'completado' && tour.photos > 0 && (
                          <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-1">
                            <PhotoIcon className="w-4 h-4" />
                            Ver Fotos
                          </button>
                        )}
                        <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1">
                          <DocumentTextIcon className="w-4 h-4" />
                          Descargar Reporte
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

export default Historial;