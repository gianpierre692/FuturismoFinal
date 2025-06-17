import { create } from 'zustand';
import { SERVICE_TYPES, FORM_STATES } from '../utils/constants';

const initialFormData = {
  serviceType: '',
  date: '',
  time: '',
  touristsCount: 1,
  tourists: [],
  // Campos específicos por tipo de servicio
  origin: '',
  destination: '',
  flightNumber: '',
  tourName: '',
  duration: 1,
  pickupLocation: '',
  includesLunch: false,
  packageName: '',
  days: 2,
  accommodation: '',
  mealPlan: '',
  specialRequirements: ''
};

const useReservationsStore = create((set, get) => ({
  // Estado
  formData: initialFormData,
  currentStep: 1, // 1: servicio, 2: turistas, 3: confirmación
  formState: FORM_STATES.IDLE,
  validationErrors: {},
  isSubmitting: false,
  reservations: [],
  draftReservation: null,

  // Acciones del formulario
  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
  },

  setServiceType: (serviceType) => {
    set((state) => ({
      formData: { 
        ...initialFormData, // Reset form but keep common fields
        serviceType,
        date: state.formData.date,
        time: state.formData.time,
        touristsCount: state.formData.touristsCount
      }
    }));
  },

  addTourist: (tourist) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tourists: [...state.formData.tourists, tourist]
      }
    }));
  },

  updateTourist: (index, tourist) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tourists: state.formData.tourists.map((t, i) => 
          i === index ? tourist : t
        )
      }
    }));
  },

  removeTourist: (index) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tourists: state.formData.tourists.filter((_, i) => i !== index)
      }
    }));
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, validateCurrentStep } = get();
    
    if (validateCurrentStep()) {
      set({ currentStep: Math.min(currentStep + 1, 3) });
      return true;
    }
    
    return false;
  },

  previousStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1)
    }));
  },

  validateCurrentStep: () => {
    const { currentStep, formData } = get();
    const errors = {};
    
    switch (currentStep) {
      case 1: // Validar información del servicio
        if (!formData.serviceType) {
          errors.serviceType = 'Selecciona un tipo de servicio';
        }
        if (!formData.date) {
          errors.date = 'La fecha es requerida';
        }
        if (!formData.time) {
          errors.time = 'La hora es requerida';
        }
        
        // Validaciones específicas por tipo
        if (formData.serviceType === SERVICE_TYPES.TRANSFER) {
          if (!formData.origin) errors.origin = 'El origen es requerido';
          if (!formData.destination) errors.destination = 'El destino es requerido';
        } else if (formData.serviceType === SERVICE_TYPES.TOUR) {
          if (!formData.tourName) errors.tourName = 'El nombre del tour es requerido';
          if (!formData.pickupLocation) errors.pickupLocation = 'El lugar de recojo es requerido';
        } else if (formData.serviceType === SERVICE_TYPES.PACKAGE) {
          if (!formData.packageName) errors.packageName = 'El nombre del paquete es requerido';
          if (!formData.accommodation) errors.accommodation = 'El alojamiento es requerido';
        }
        break;
        
      case 2: // Validar turistas
        if (formData.tourists.length === 0) {
          errors.tourists = 'Agrega al menos un turista';
        } else if (formData.tourists.length !== formData.touristsCount) {
          errors.tourists = `Debes agregar ${formData.touristsCount} turista(s)`;
        }
        
        // Validar cada turista
        formData.tourists.forEach((tourist, index) => {
          if (!tourist.name) {
            errors[`tourist_${index}_name`] = 'El nombre es requerido';
          }
          if (!tourist.passport) {
            errors[`tourist_${index}_passport`] = 'El pasaporte es requerido';
          }
          if (!tourist.email) {
            errors[`tourist_${index}_email`] = 'El email es requerido';
          }
        });
        break;
    }
    
    set({ validationErrors: errors });
    return Object.keys(errors).length === 0;
  },

  createDraftReservation: () => {
    const { formData } = get();
    
    const draft = {
      id: `DRAFT-${Date.now()}`,
      code: `FT${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    set({ draftReservation: draft });
    return draft;
  },

  submitReservation: async () => {
    set({ isSubmitting: true, formState: FORM_STATES.LOADING });
    
    try {
      const { draftReservation } = get();
      
      // Simulación de envío - En producción sería una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Agregar a las reservas
      set((state) => ({
        reservations: [...state.reservations, {
          ...draftReservation,
          status: 'confirmed',
          confirmedAt: new Date().toISOString()
        }],
        formState: FORM_STATES.SUCCESS,
        isSubmitting: false
      }));
      
      // Limpiar formulario después de éxito
      setTimeout(() => {
        get().resetForm();
      }, 3000);
      
      return { success: true, reservation: draftReservation };
    } catch (error) {
      set({ 
        formState: FORM_STATES.ERROR,
        isSubmitting: false
      });
      
      return { success: false, error: error.message };
    }
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      currentStep: 1,
      formState: FORM_STATES.IDLE,
      validationErrors: {},
      draftReservation: null
    });
  },

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  clearValidationErrors: () => set({ validationErrors: {} }),

  // Obtener reservaciones
  getReservationsByStatus: (status) => {
    const { reservations } = get();
    return reservations.filter(r => r.status === status);
  },

  getReservationById: (id) => {
    const { reservations } = get();
    return reservations.find(r => r.id === id);
  }
}));

export { useReservationsStore };
export default useReservationsStore;