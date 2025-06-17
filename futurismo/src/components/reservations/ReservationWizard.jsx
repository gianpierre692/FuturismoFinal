import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  MapPin, Calendar, Users, Clock, DollarSign, 
  ChevronRight, ChevronLeft, Check, AlertCircle,
  User, Phone, Mail, Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReservationsStore } from '../../stores/reservationsStore';
import { formatters } from '../../utils/formatters';
import { validators } from '../../utils/validators';
import toast from 'react-hot-toast';

// Esquemas de validación para cada paso
const step1Schema = yup.object({
  serviceType: yup.string().required('El tipo de servicio es requerido'),
  tourId: yup.string().required('Debe seleccionar un tour'),
  date: yup.date().required('La fecha es requerida').min(new Date(), 'La fecha debe ser futura'),
  time: yup.string().required('La hora es requerida'),
  duration: yup.number().required('La duración es requerida').min(1, 'La duración mínima es 1 hora')
});

const step2Schema = yup.object({
  adults: yup.number().required('Número de adultos requerido').min(1, 'Mínimo 1 adulto'),
  children: yup.number().min(0, 'No puede ser negativo'),
  pickupLocation: yup.string().required('El lugar de recojo es requerido'),
  specialRequirements: yup.string(),
  contactName: yup.string().required('El nombre de contacto es requerido'),
  contactPhone: yup.string()
    .required('El teléfono es requerido')
    .test('phone', 'Teléfono inválido', value => validators.validatePhone(value || '')),
  contactEmail: yup.string()
    .required('El email es requerido')
    .email('Email inválido')
});

const step3Schema = yup.object({
  paymentMethod: yup.string().required('Seleccione un método de pago'),
  billingName: yup.string().required('Nombre para facturación requerido'),
  billingDocument: yup.string().required('Documento requerido'),
  billingAddress: yup.string().required('Dirección requerida'),
  acceptTerms: yup.boolean().oneOf([true], 'Debe aceptar los términos y condiciones')
});

const ReservationWizard = ({ onClose }) => {
  const navigate = useNavigate();
  const { createReservation } = useReservationsStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data para tours disponibles
  const availableTours = [
    { id: '1', name: 'City Tour Lima Histórica', price: 35, duration: 4 },
    { id: '2', name: 'Tour Gastronómico Miraflores', price: 65, duration: 5 },
    { id: '3', name: 'Pachacámac y Barranco', price: 45, duration: 6 },
    { id: '4', name: 'Islas Palomino', price: 85, duration: 8 }
  ];

  const steps = [
    { number: 1, title: 'Servicio', icon: MapPin },
    { number: 2, title: 'Detalles', icon: Users },
    { number: 3, title: 'Confirmación', icon: Check }
  ];

  // Configuración de formularios para cada paso
  const getStepConfig = () => {
    switch (currentStep) {
      case 1:
        return {
          schema: step1Schema,
          defaultValues: {
            serviceType: formData.serviceType || 'tour',
            tourId: formData.tourId || '',
            date: formData.date || '',
            time: formData.time || '',
            duration: formData.duration || 4
          }
        };
      case 2:
        return {
          schema: step2Schema,
          defaultValues: {
            adults: formData.adults || 1,
            children: formData.children || 0,
            pickupLocation: formData.pickupLocation || '',
            specialRequirements: formData.specialRequirements || '',
            contactName: formData.contactName || '',
            contactPhone: formData.contactPhone || '',
            contactEmail: formData.contactEmail || ''
          }
        };
      case 3:
        return {
          schema: step3Schema,
          defaultValues: {
            paymentMethod: formData.paymentMethod || 'transfer',
            billingName: formData.billingName || '',
            billingDocument: formData.billingDocument || '',
            billingAddress: formData.billingAddress || '',
            acceptTerms: formData.acceptTerms || false
          }
        };
      default:
        return { schema: yup.object(), defaultValues: {} };
    }
  };

  const stepConfig = getStepConfig();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(stepConfig.schema),
    defaultValues: stepConfig.defaultValues
  });

  const selectedTour = watch('tourId');
  const adults = watch('adults') || 1;
  const children = watch('children') || 0;

  const calculateTotal = () => {
    const tour = availableTours.find(t => t.id === selectedTour);
    if (!tour) return 0;
    return (adults * tour.price) + (children * tour.price * 0.5);
  };

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit({ ...formData, ...data });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async (finalData) => {
    setIsSubmitting(true);
    try {
      const reservation = {
        ...finalData,
        total: calculateTotal(),
        status: 'pendiente',
        createdAt: new Date()
      };

      await createReservation(reservation);
      toast.success('Reserva creada exitosamente');
      
      // Navegar a la página de confirmación o cerrar el wizard
      if (onClose) {
        onClose();
      } else {
        navigate('/reservations');
      }
    } catch (error) {
      toast.error('Error al crear la reserva');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.number 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-600'}
                `}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit(handleNext)} className="bg-white rounded-lg shadow-lg p-6">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Selecciona el Servicio</h3>

            <div>
              <label className="label">Tipo de Servicio</label>
              <select {...register('serviceType')} className="input">
                <option value="tour">Tour Regular</option>
                <option value="private">Tour Privado</option>
                <option value="transfer">Traslado</option>
              </select>
              {errors.serviceType && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
              )}
            </div>

            <div>
              <label className="label">Tour</label>
              <select {...register('tourId')} className="input">
                <option value="">Selecciona un tour</option>
                {availableTours.map(tour => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name} - ${tour.price}/persona
                  </option>
                ))}
              </select>
              {errors.tourId && (
                <p className="mt-1 text-sm text-red-600">{errors.tourId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha</label>
                <input 
                  type="date" 
                  {...register('date')} 
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="label">Hora</label>
                <input type="time" {...register('time')} className="input" />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">Duración (horas)</label>
              <input 
                type="number" 
                {...register('duration')} 
                className="input"
                min="1"
                max="12"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Detalles de la Reserva</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Adultos</label>
                <input 
                  type="number" 
                  {...register('adults')} 
                  className="input"
                  min="1"
                />
                {errors.adults && (
                  <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
                )}
              </div>

              <div>
                <label className="label">Niños</label>
                <input 
                  type="number" 
                  {...register('children')} 
                  className="input"
                  min="0"
                />
                {errors.children && (
                  <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">Lugar de Recojo</label>
              <input 
                type="text" 
                {...register('pickupLocation')} 
                className="input"
                placeholder="Ej: Hotel Marriott Miraflores"
              />
              {errors.pickupLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
              )}
            </div>

            <div>
              <label className="label">Requerimientos Especiales</label>
              <textarea 
                {...register('specialRequirements')} 
                className="input"
                rows="3"
                placeholder="Alergias, dieta especial, movilidad reducida, etc."
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Información de Contacto</h4>
              
              <div>
                <label className="label">Nombre Completo</label>
                <input 
                  type="text" 
                  {...register('contactName')} 
                  className="input"
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="label">Teléfono</label>
                  <input 
                    type="tel" 
                    {...register('contactPhone')} 
                    className="input"
                    placeholder="+51 999999999"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  <input 
                    type="email" 
                    {...register('contactEmail')} 
                    className="input"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Confirmación y Pago</h3>

            {/* Resumen de la reserva */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Resumen de la Reserva</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour:</span>
                  <span className="font-medium">
                    {availableTours.find(t => t.id === formData.tourId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{formatters.formatDate(formData.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pasajeros:</span>
                  <span className="font-medium">
                    {formData.adults} adultos{formData.children > 0 && `, ${formData.children} niños`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Método de Pago</label>
              <select {...register('paymentMethod')} className="input">
                <option value="transfer">Transferencia Bancaria</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta de Crédito/Débito</option>
              </select>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Datos de Facturación</h4>
              
              <div>
                <label className="label">Nombre o Razón Social</label>
                <input 
                  type="text" 
                  {...register('billingName')} 
                  className="input"
                />
                {errors.billingName && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="label">RUC/DNI</label>
                  <input 
                    type="text" 
                    {...register('billingDocument')} 
                    className="input"
                  />
                  {errors.billingDocument && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingDocument.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Dirección</label>
                  <input 
                    type="text" 
                    {...register('billingAddress')} 
                    className="input"
                  />
                  {errors.billingAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingAddress.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  {...register('acceptTerms')}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  Acepto los términos y condiciones del servicio y autorizo el uso de mis datos 
                  personales según la política de privacidad.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Información importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Información Importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>La reserva será confirmada una vez validado el pago</li>
                    <li>Recibirá un email con los detalles y voucher</li>
                    <li>Cancelación gratuita hasta 24 horas antes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="btn btn-outline flex items-center gap-2"
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={isSubmitting}
          >
            {currentStep === 3 ? (
              <>
                {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationWizard;