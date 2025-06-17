import { 
  X, Calendar, Clock, Users, MapPin, Phone, Mail, 
  DollarSign, FileText, Download, Send, Edit, 
  CheckCircle, AlertCircle, Building
} from 'lucide-react';
import { formatters } from '../../utils/formatters';

const ReservationDetail = ({ reservation, onClose }) => {
  if (!reservation) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'text-green-600 bg-green-50';
      case 'pendiente': return 'text-yellow-600 bg-yellow-50';
      case 'cancelada': return 'text-red-600 bg-red-50';
      case 'completada': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'pagado': return 'text-green-600 bg-green-50';
      case 'pendiente': return 'text-yellow-600 bg-yellow-50';
      case 'reembolsado': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSendVoucher = () => {
    // Implementar envío de voucher
    console.log('Enviar voucher por email');
  };

  const handleDownloadVoucher = () => {
    // Implementar descarga de voucher
    console.log('Descargar voucher PDF');
  };

  const handleConfirmPayment = () => {
    // Implementar confirmación de pago
    console.log('Confirmar pago');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Reserva #{reservation.id}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Creada el {formatters.formatDateTime(reservation.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Estados */}
            <div className="flex gap-4">
              <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(reservation.status)}`}>
                Estado: {reservation.status}
              </div>
              <div className={`px-4 py-2 rounded-full font-medium ${getPaymentColor(reservation.paymentStatus)}`}>
                Pago: {reservation.paymentStatus}
              </div>
            </div>

            {/* Información del Tour */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Información del Tour</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tour</p>
                  <p className="font-medium">{reservation.tourName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha y Hora</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{formatters.formatDate(reservation.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{reservation.time}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pasajeros</p>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">
                      {reservation.adults} adultos
                      {reservation.children > 0 && `, ${reservation.children} niños`}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lugar de Recojo</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{reservation.pickupLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Información del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium">{reservation.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{reservation.clientEmail}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{reservation.clientPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Información de Pago</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${reservation.total}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">${reservation.total}</span>
                </div>
              </div>

              {reservation.paymentStatus === 'pendiente' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Pago Pendiente</p>
                      <p className="text-yellow-700 mt-1">
                        El cliente debe realizar el pago antes del {formatters.formatDate(new Date(reservation.date.getTime() - 86400000))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notas adicionales */}
            {reservation.specialRequirements && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Requerimientos Especiales</h3>
                <p className="text-gray-700">{reservation.specialRequirements}</p>
              </div>
            )}

            {/* Historial de actividad */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Historial de Actividad</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reserva creada</p>
                    <p className="text-xs text-gray-500">{formatters.formatDateTime(reservation.createdAt)}</p>
                  </div>
                </div>
                {reservation.status === 'confirmada' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reserva confirmada</p>
                      <p className="text-xs text-gray-500">Hace 2 días</p>
                    </div>
                  </div>
                )}
                {reservation.paymentStatus === 'pagado' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pago confirmado</p>
                      <p className="text-xs text-gray-500">Hace 1 día</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleDownloadVoucher}
              className="btn btn-outline flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar Voucher
            </button>
            <button
              onClick={handleSendVoucher}
              className="btn btn-outline flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar por Email
            </button>
          </div>

          <div className="flex gap-3">
            {reservation.paymentStatus === 'pendiente' && (
              <button
                onClick={handleConfirmPayment}
                className="btn btn-success flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirmar Pago
              </button>
            )}
            <button className="btn btn-primary flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Editar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail;