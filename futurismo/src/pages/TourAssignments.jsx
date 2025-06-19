import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import AssignmentManager from '../components/assignments/AssignmentManager';

const TourAssignments = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'assigned', 'tomorrow'
  const [searchTerm, setSearchTerm] = useState('');

  // Datos mock de reservas pendientes de asignación
  useEffect(() => {
    const mockReservations = [
      {
        id: 'RES-001',
        tourName: 'City Tour Lima Centro Histórico',
        date: '2024-02-20',
        time: '09:00',
        groupSize: 8,
        agency: {
          id: 'AG-001',
          name: 'Viajes El Dorado SAC',
          contact: 'Ana López',
          phone: '+51 912 345 678',
          whatsapp: '+51912345678',
          email: 'ventas@viajeseldorado.com'
        },
        pickupLocation: {
          name: 'Hotel Costa del Sol Wyndham',
          address: 'Av. Salaverry 3060, San Isidro',
          reference: 'Recepción principal'
        },
        status: 'pending',
        createdAt: '2024-02-19T10:00:00',
        priority: 'high'
      },
      {
        id: 'RES-002',
        tourName: 'Tour Islas Ballestas y Paracas',
        date: '2024-02-20',
        time: '07:00',
        groupSize: 12,
        agency: {
          id: 'AG-002',
          name: 'Peru Travel Experience',
          contact: 'Roberto Díaz',
          phone: '+51 923 456 789',
          whatsapp: '+51923456789',
          email: 'roberto@perutravel.com'
        },
        pickupLocation: {
          name: 'Hotel Sheraton Lima',
          address: 'Av. Paseo de la República 170, Lima',
          reference: 'Lobby principal'
        },
        status: 'assigned',
        assignedAt: '2024-02-19T15:30:00',
        priority: 'medium'
      },
      {
        id: 'RES-003',
        tourName: 'Tour Gastronómico por Barranco',
        date: '2024-02-21',
        time: '18:00',
        groupSize: 6,
        agency: {
          id: 'AG-003',
          name: 'Lima Discovery Tours',
          contact: 'María González',
          phone: '+51 934 567 890',
          whatsapp: '+51934567890',
          email: 'maria@limadiscovery.com'
        },
        pickupLocation: {
          name: 'Plaza San Martín',
          address: 'Jirón de la Unión, Cercado de Lima',
          reference: 'Monumento central'
        },
        status: 'pending',
        createdAt: '2024-02-19T14:15:00',
        priority: 'low'
      },
      {
        id: 'RES-004',
        tourName: 'Cusco y Machu Picchu 3D/2N',
        date: '2024-02-20',
        time: '06:00',
        groupSize: 4,
        agency: {
          id: 'AG-004',
          name: 'Andes Explorer',
          contact: 'Carlos Mendoza',
          phone: '+51 945 678 901',
          whatsapp: '+51945678901',
          email: 'carlos@andesexplorer.com'
        },
        pickupLocation: {
          name: 'Aeropuerto Jorge Chávez',
          address: 'Av. Elmer Faucett s/n, Callao',
          reference: 'Terminal de llegadas nacionales'
        },
        status: 'urgent',
        createdAt: '2024-02-19T16:45:00',
        priority: 'urgent'
      }
    ];
    setReservations(mockReservations);
  }, []);

  const filteredReservations = reservations.filter(reservation => {
    // Filtrar por estado
    if (filter === 'pending' && reservation.status !== 'pending' && reservation.status !== 'urgent') return false;
    if (filter === 'assigned' && reservation.status !== 'assigned') return false;
    if (filter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const reservationDate = new Date(reservation.date);
      if (reservationDate.toDateString() !== tomorrow.toDateString()) return false;
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        reservation.tourName.toLowerCase().includes(search) ||
        reservation.agency.name.toLowerCase().includes(search) ||
        reservation.agency.contact.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'assigned': return 'bg-green-100 text-green-800 border-green-300';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'assigned': return <CheckCircleIcon className="h-4 w-4" />;
      case 'urgent': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAssignmentComplete = (assignment) => {
    // Actualizar el estado de la reserva a 'assigned'
    setReservations(prev => 
      prev.map(res => 
        res.id === selectedReservation.id 
          ? { ...res, status: 'assigned', assignedAt: new Date().toISOString() }
          : res
      )
    );
    setSelectedReservation(null);
  };

  const getFilteredCount = (filterType) => {
    return reservations.filter(res => {
      switch (filterType) {
        case 'pending': return res.status === 'pending' || res.status === 'urgent';
        case 'assigned': return res.status === 'assigned';
        case 'tomorrow': {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const reservationDate = new Date(res.date);
          return reservationDate.toDateString() === tomorrow.toDateString();
        }
        default: return true;
      }
    }).length;
  };

  if (selectedReservation) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedReservation(null)}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Volver
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Asignar Tour - {selectedReservation.id}
            </h1>
          </div>
          
          <AssignmentManager 
            reservation={selectedReservation}
            onAssignmentComplete={handleAssignmentComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Asignación de Tours
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona las asignaciones de guías, choferes y vehículos
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{getFilteredCount('pending')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Asignados</p>
                <p className="text-2xl font-bold text-gray-900">{getFilteredCount('assigned')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Mañana</p>
                <p className="text-2xl font-bold text-gray-900">{getFilteredCount('tomorrow')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                {[
                  { key: 'all', label: 'Todos', count: reservations.length },
                  { key: 'pending', label: 'Pendientes', count: getFilteredCount('pending') },
                  { key: 'assigned', label: 'Asignados', count: getFilteredCount('assigned') },
                  { key: 'tomorrow', label: 'Mañana', count: getFilteredCount('tomorrow') }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por tour, agencia o contacto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${getPriorityColor(reservation.priority)}`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.tourName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reservation.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reservation.date).toLocaleDateString('es-PE', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.agency.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.agency.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {reservation.groupSize} personas
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="ml-1">
                          {reservation.status === 'pending' && 'Pendiente'}
                          {reservation.status === 'assigned' && 'Asignado'}
                          {reservation.status === 'urgent' && 'Urgente'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          reservation.status === 'assigned'
                            ? 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                        }`}
                      >
                        {reservation.status === 'assigned' ? 'Ver Asignación' : 'Asignar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reservas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No se encontraron reservas con los filtros aplicados.' : 'No hay reservas pendientes de asignación.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourAssignments;