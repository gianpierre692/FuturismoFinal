import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import Logger from '../../utils/logger';

const BookingFlow = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getGuideById, createServiceRequest } = useMarketplaceStore();
  
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Datos de la reserva
  const [bookingData, setBookingData] = useState({
    // Paso 1: Información básica
    tourType: '',
    tourName: '',
    tourDate: '',
    startTime: '',
    duration: 4, // horas
    participants: 1,
    
    // Paso 2: Detalles
    pickupLocation: '',
    destinations: [],
    specialRequirements: '',
    includesTransport: false,
    includesMeals: false,
    
    // Paso 3: Confirmación
    paymentMethod: 'cash',
    agreeTerms: false
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadGuideData();
  }, [guideId]);

  const loadGuideData = async () => {
    try {
      const guideData = await getGuideById(guideId);
      setGuide(guideData);
    } catch (error) {
      Logger.error('Error loading guide:', error);
      toast.error('Error al cargar información del guía');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!guide) return 0;
    const hourlyRate = guide.pricing?.hourlyRate || 50;
    const baseTotal = hourlyRate * bookingData.duration;
    const transportCost = bookingData.includesTransport ? 50 : 0;
    const mealsCost = bookingData.includesMeals ? (20 * bookingData.participants) : 0;
    return baseTotal + transportCost + mealsCost;
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return bookingData.tourType && 
               bookingData.tourName && 
               bookingData.tourDate && 
               bookingData.startTime;
      case 2:
        return bookingData.pickupLocation && 
               bookingData.destinations.length > 0;
      case 3:
        return bookingData.agreeTerms;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Por favor completa todos los campos requeridos');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      const request = {
        guideId: guide.id,
        agencyId: user.id,
        serviceDetails: {
          tourType: bookingData.tourType,
          tourName: bookingData.tourName,
          date: bookingData.tourDate,
          time: bookingData.startTime,
          duration: bookingData.duration,
          participants: bookingData.participants,
          location: bookingData.pickupLocation,
          destinations: bookingData.destinations,
          specialRequirements: bookingData.specialRequirements,
          includesTransport: bookingData.includesTransport,
          includesMeals: bookingData.includesMeals
        },
        pricing: {
          basePrice: guide.pricing?.hourlyRate * bookingData.duration,
          totalPrice: calculateTotal()
        },
        paymentMethod: bookingData.paymentMethod,
        status: 'pending'
      };

      await createServiceRequest(request);
      toast.success('¡Solicitud enviada correctamente!');
      navigate('/marketplace/bookings');
    } catch (error) {
      Logger.error('Error creating booking:', error);
      toast.error('Error al crear la reserva');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Guía no encontrado</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="text-primary hover:underline"
        >
          Volver al marketplace
        </button>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Información', icon: CalendarIcon },
    { id: 2, name: 'Detalles', icon: MapPinIcon },
    { id: 3, name: 'Confirmación', icon: CheckCircleIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold">Solicitar Servicio</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="relative">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${currentStep >= step.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-400'}
                `}>
                  <step.icon className="h-5 w-5" />
                </div>
                {currentStep > step.id && (
                  <CheckCircleIcon className="absolute -bottom-1 -right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Guide Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={guide.profile?.avatar || '/api/placeholder/60/60'}
              alt={guide.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{guide.fullName}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span>{guide.ratings?.overall || 4.9}</span>
                </div>
                <span>•</span>
                <span>{guide.marketplaceStats?.totalBookings || 0} tours completados</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${guide.pricing?.hourlyRate || 50}
              </p>
              <p className="text-sm text-gray-500">por hora</p>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Paso 1: Información básica */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información del Tour
              </h2>

              {/* Tipo de tour */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de tour *
                </label>
                <select
                  value={bookingData.tourType}
                  onChange={(e) => handleInputChange('tourType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="cultural">Cultural</option>
                  <option value="aventura">Aventura</option>
                  <option value="gastronomico">Gastronómico</option>
                  <option value="mistico">Místico</option>
                  <option value="fotografico">Fotográfico</option>
                </select>
              </div>

              {/* Nombre del tour */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del tour *
                </label>
                <input
                  type="text"
                  value={bookingData.tourName}
                  onChange={(e) => handleInputChange('tourName', e.target.value)}
                  placeholder="Ej: City Tour Cusco"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Fecha y hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={bookingData.tourDate}
                    onChange={(e) => handleInputChange('tourDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de inicio *
                  </label>
                  <input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Duración y participantes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (horas)
                  </label>
                  <select
                    value={bookingData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 10, 12].map(hours => (
                      <option key={hours} value={hours}>{hours} horas</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de participantes
                  </label>
                  <input
                    type="number"
                    value={bookingData.participants}
                    onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 1)}
                    min="1"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Detalles */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles del Servicio
              </h2>

              {/* Lugar de recojo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lugar de recojo *
                </label>
                <input
                  type="text"
                  value={bookingData.pickupLocation}
                  onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                  placeholder="Ej: Hotel Cusco Plaza, Av. Sol 123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Destinos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinos a visitar *
                </label>
                <textarea
                  value={bookingData.destinations.join('\n')}
                  onChange={(e) => handleInputChange('destinations', e.target.value.split('\n').filter(d => d.trim()))}
                  placeholder="Ingresa un destino por línea&#10;Ej:&#10;Plaza de Armas&#10;Catedral&#10;Qorikancha"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Requerimientos especiales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requerimientos especiales
                </label>
                <textarea
                  value={bookingData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Alergias, necesidades especiales, preferencias..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Servicios adicionales */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingData.includesTransport}
                    onChange={(e) => handleInputChange('includesTransport', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <div>
                    <span className="font-medium">Incluir transporte</span>
                    <span className="text-sm text-gray-500 ml-2">(+$50)</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingData.includesMeals}
                    onChange={(e) => handleInputChange('includesMeals', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <div>
                    <span className="font-medium">Incluir alimentación</span>
                    <span className="text-sm text-gray-500 ml-2">(+$20 por persona)</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen y Confirmación
              </h2>

              {/* Resumen de la reserva */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tour:</span>
                  <span className="font-medium">{bookingData.tourName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {new Date(bookingData.tourDate).toLocaleDateString('es-PE')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{bookingData.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">{bookingData.duration} horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Participantes:</span>
                  <span className="font-medium">{bookingData.participants}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Servicio base:</span>
                    <span className="font-medium">
                      ${guide.pricing?.hourlyRate * bookingData.duration}
                    </span>
                  </div>
                  {bookingData.includesTransport && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Transporte:</span>
                      <span className="font-medium">$50</span>
                    </div>
                  )}
                  {bookingData.includesMeals && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Alimentación:</span>
                      <span className="font-medium">
                        ${20 * bookingData.participants}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-lg font-bold mt-3 pt-3 border-t">
                    <span>Total:</span>
                    <span className="text-primary-600">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de pago
                </label>
                <select
                  value={bookingData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia bancaria</option>
                  <option value="card">Tarjeta de crédito/débito</option>
                </select>
              </div>

              {/* Términos y condiciones */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 mb-1">Importante:</p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• El pago se realizará directamente al guía</li>
                      <li>• Cancelación gratuita hasta 24 horas antes</li>
                      <li>• El guía confirmará la disponibilidad en máximo 2 horas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded mt-1"
                />
                <span className="text-sm text-gray-600">
                  Acepto los términos y condiciones del servicio y autorizo a Futurismo a compartir mi información de contacto con el guía seleccionado.
                </span>
              </label>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={currentStep === 1 ? () => navigate(-1) : handlePrevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              {currentStep === 1 ? 'Cancelar' : 'Anterior'}
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                Confirmar Solicitud
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;