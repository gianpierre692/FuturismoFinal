import { useState } from 'react';
import { 
  Calendar, Clock, Users, MapPin, DollarSign, 
  MoreVertical, Eye, Edit, Trash, FileText,
  Search, Filter, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import { formatters } from '../../utils/formatters';
import { useReservationsStore } from '../../stores/reservationsStore';
import { useAuthStore } from '../../stores/authStore';
import ReservationDetail from './ReservationDetail';

const ReservationList = () => {
  const { reservations } = useReservationsStore();
  const { user } = useAuthStore();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActions, setShowActions] = useState(null);

  const itemsPerPage = 10;

  // Mock data para demostración
  const mockReservations = [
    {
      id: 'RES001',
      tourName: 'City Tour Lima Histórica',
      clientName: 'Juan Pérez',
      clientPhone: '+51 987654321',
      date: new Date('2024-02-15'),
      time: '09:00',
      adults: 2,
      children: 1,
      total: 105,
      status: 'confirmada',
      pickupLocation: 'Hotel Marriott Miraflores',
      createdAt: new Date('2024-02-01'),
      paymentStatus: 'pagado',
      groups: [
        {
          representativeName: 'Juan Pérez',
          representativePhone: '+51 987654321',
          companionsCount: 2
        },
        {
          representativeName: 'Carlos García',
          representativePhone: '+51 987654322',
          companionsCount: 1
        }
      ]
    },
    {
      id: 'RES002',
      tourName: 'Tour Gastronómico Miraflores',
      clientName: 'María García',
      clientPhone: '+51 976543210',
      date: new Date('2024-02-16'),
      time: '12:00',
      adults: 4,
      children: 0,
      total: 260,
      status: 'pendiente',
      pickupLocation: 'Parque Kennedy',
      createdAt: new Date('2024-02-05'),
      paymentStatus: 'pendiente'
    },
    {
      id: 'RES003',
      tourName: 'Islas Palomino',
      clientName: 'Carlos Rodríguez',
      clientPhone: '+51 965432198',
      date: new Date('2024-02-18'),
      time: '06:00',
      adults: 3,
      children: 2,
      total: 340,
      status: 'confirmada',
      pickupLocation: 'Hotel Hilton',
      createdAt: new Date('2024-02-08'),
      paymentStatus: 'pagado'
    },
    {
      id: 'RES004',
      tourName: 'Pachacámac y Barranco',
      clientName: 'Ana López',
      clientPhone: '+51 954321876',
      date: new Date('2024-02-14'),
      time: '14:00',
      adults: 2,
      children: 0,
      total: 90,
      status: 'cancelada',
      pickupLocation: 'JW Marriott',
      createdAt: new Date('2024-01-28'),
      paymentStatus: 'reembolsado'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: 'badge-yellow',
      confirmada: 'badge-green',
      cancelada: 'badge-red',
      completada: 'badge-blue'
    };
    return badges[status] || 'badge-gray';
  };

  const getPaymentBadge = (status) => {
    const badges = {
      pendiente: 'badge-yellow',
      pagado: 'badge-green',
      reembolsado: 'badge-blue'
    };
    return badges[status] || 'badge-gray';
  };

  // Filtrar reservaciones
  const filteredReservations = mockReservations.filter(reservation => {
    const matchesSearch = 
      reservation.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetail = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetail(true);
    setShowActions(null);
  };

  const handleEdit = (reservation) => {
    // Implementar edición
    console.log('Editar reserva:', reservation.id);
    setShowActions(null);
  };

  const handleDelete = (reservation) => {
    // Implementar eliminación
    if (window.confirm('¿Está seguro de eliminar esta reserva?')) {
      console.log('Eliminar reserva:', reservation.id);
    }
    setShowActions(null);
  };

  const handleExport = () => {
    // Implementar exportación
    console.log('Exportar reservaciones');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header con búsqueda y filtros */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por tour, cliente o código..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="completada">Completada</option>
              </select>

              <button 
                onClick={handleExport}
                className="btn btn-outline flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de reservaciones */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour / Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pasajeros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{reservation.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reservation.tourName}</p>
                      <p className="text-sm text-gray-500">{reservation.clientName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900">
                        <Calendar className="w-4 h-4" />
                        {formatters.formatDate(reservation.date)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        {reservation.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {reservation.adults}
                        {reservation.children > 0 && ` + ${reservation.children}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${reservation.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getPaymentBadge(reservation.paymentStatus)}`}>
                      {reservation.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === reservation.id ? null : reservation.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showActions === reservation.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => handleViewDetail(reservation)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Detalles
                          </button>
                          {/* Solo agencias pueden editar sus propias reservas */}
                          {user?.role === 'agency' && (
                            <>
                              <button
                                onClick={() => handleEdit(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <FileText className="w-4 h-4" />
                                Generar Voucher
                              </button>
                            </>
                          )}
                          {/* Solo admins pueden eliminar */}
                          {user?.role === 'admin' && (
                            <>
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash className="w-4 h-4" />
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredReservations.length)} de {filteredReservations.length} reservaciones
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {showDetail && (
        <ReservationDetail 
          reservation={selectedReservation}
          onClose={() => {
            setShowDetail(false);
            setSelectedReservation(null);
          }}
        />
      )}
    </>
  );
};

export default ReservationList;