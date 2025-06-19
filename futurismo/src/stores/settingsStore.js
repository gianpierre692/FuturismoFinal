import { create } from 'zustand';

// Configuraciones por defecto del sistema
const defaultSettings = {
  // Configuración general
  general: {
    companyName: 'Futurismo Tours',
    companyPhone: '+51 999 999 999',
    companyEmail: 'info@futurismo.com',
    companyAddress: 'Av. Larco 123, Miraflores, Lima',
    companyWebsite: 'https://futurismo.com',
    currency: 'USD',
    timezone: 'America/Lima',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  },

  // Configuración de tours y servicios
  tours: {
    maxCapacityPerTour: 20,
    minAdvanceBooking: 24, // horas
    maxAdvanceBooking: 365, // días
    cancellationPolicy: 24, // horas antes para cancelación gratuita
    defaultDuration: 4, // horas
    allowPartialPayments: true,
    requireGuideAssignment: true,
    autoAssignGuides: false,
    workingHours: {
      start: '06:00',
      end: '20:00'
    },
    priceRanges: {
      budget: { min: 0, max: 50 },
      standard: { min: 50, max: 100 },
      premium: { min: 100, max: 200 },
      luxury: { min: 200, max: 999 }
    }
  },

  // Configuración de agencias
  agencies: {
    defaultCreditLimit: 5000,
    requireCreditApproval: true,
    commissionRate: 10, // porcentaje
    paymentTerms: 30, // días
    allowDirectBooking: true,
    requireContractSigning: true,
    maxActiveReservations: 50
  },

  // Configuración de guías
  guides: {
    maxToursPerDay: 2,
    restTimeBetweenTours: 2, // horas
    allowOverlappingTours: false,
    requireCertification: true,
    freelanceRequireAgenda: true,
    evaluationPeriod: 90, // días
    minRatingRequired: 4.0,
    autoSuspendLowRating: false
  },

  // Configuración de notificaciones
  notifications: {
    email: {
      enabled: true,
      newReservation: true,
      cancellation: true,
      reminder24h: true,
      reminder2h: true,
      tourComplete: true,
      paymentReceived: true,
      lowCredit: true,
      systemAlerts: true
    },
    sms: {
      enabled: false,
      newReservation: false,
      cancellation: true,
      reminder2h: true,
      emergencyOnly: true
    },
    push: {
      enabled: true,
      newReservation: true,
      tourUpdates: true,
      chat: true,
      systemAlerts: true
    },
    whatsapp: {
      enabled: false,
      newReservation: false,
      reminder24h: false,
      tourComplete: false
    }
  },

  // Configuración de monitoreo
  monitoring: {
    enableRealTimeTracking: true,
    updateIntervalSeconds: 30,
    enableGeofencing: true,
    alertRadiusMeters: 500,
    enableEmergencyButton: true,
    enableOfflineMode: true,
    batteryAlertThreshold: 20,
    enableAutoCheckpoints: true
  },

  // Configuración de reportes
  reports: {
    enableAutoGeneration: true,
    dailyReportTime: '18:00',
    weeklyReportDay: 'monday',
    monthlyReportDay: 1,
    includePhotos: true,
    includeCustomerFeedback: true,
    enableDataExport: true,
    retentionPeriodMonths: 24
  },

  // Configuración de seguridad
  security: {
    sessionTimeoutMinutes: 120,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    enableTwoFactor: false,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    enableIPWhitelist: false,
    enableAuditLog: true
  },

  // Configuración de integración
  integrations: {
    googleMaps: {
      enabled: true,
      apiKey: '',
      enableDirections: true,
      enablePlaces: true
    },
    whatsapp: {
      enabled: false,
      businessPhone: '',
      apiToken: ''
    },
    mailchimp: {
      enabled: false,
      apiKey: '',
      listId: ''
    },
    stripe: {
      enabled: false,
      publicKey: '',
      secretKey: ''
    }
  }
};

const useSettingsStore = create((set, get) => ({
  // Estado
  settings: defaultSettings,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,

  // Acciones generales
  loadSettings: async () => {
    set({ isLoading: true });
    try {
      // Simular carga desde API
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  saveSettings: async () => {
    set({ isLoading: true });
    try {
      // Simular guardado en API
      await new Promise(resolve => setTimeout(resolve, 1500));
      set({ hasUnsavedChanges: false, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  resetSettings: () => {
    set({ 
      settings: defaultSettings, 
      hasUnsavedChanges: true 
    });
  },

  // Acciones específicas por categoría
  updateGeneralSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        general: { ...state.settings.general, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateToursSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        tours: { ...state.settings.tours, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateAgenciesSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        agencies: { ...state.settings.agencies, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateGuidesSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        guides: { ...state.settings.guides, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateNotificationsSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        notifications: { ...state.settings.notifications, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateMonitoringSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        monitoring: { ...state.settings.monitoring, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateReportsSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        reports: { ...state.settings.reports, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateSecuritySettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        security: { ...state.settings.security, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  updateIntegrationsSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        integrations: { ...state.settings.integrations, ...updates }
      },
      hasUnsavedChanges: true
    }));
  },

  // Getters específicos
  getGeneralSettings: () => {
    return get().settings.general;
  },

  getToursSettings: () => {
    return get().settings.tours;
  },

  getNotificationSettings: () => {
    return get().settings.notifications;
  },

  // Validaciones
  validateSettings: () => {
    const { settings } = get();
    const errors = {};

    // Validar configuración general
    if (!settings.general.companyName.trim()) {
      errors.companyName = 'El nombre de la empresa es requerido';
    }

    if (!settings.general.companyEmail.trim() || !/\S+@\S+\.\S+/.test(settings.general.companyEmail)) {
      errors.companyEmail = 'Email de empresa inválido';
    }

    // Validar configuración de tours
    if (settings.tours.maxCapacityPerTour < 1) {
      errors.maxCapacity = 'La capacidad máxima debe ser mayor a 0';
    }

    if (settings.tours.minAdvanceBooking < 1) {
      errors.minAdvanceBooking = 'El tiempo mínimo de reserva debe ser mayor a 0';
    }

    // Validar configuración de seguridad
    if (settings.security.passwordMinLength < 6) {
      errors.passwordMinLength = 'La longitud mínima de contraseña debe ser al menos 6';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Funciones de utilidad
  exportSettings: () => {
    const { settings } = get();
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `futurismo-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  importSettings: (jsonData) => {
    try {
      const importedSettings = JSON.parse(jsonData);
      set({ 
        settings: { ...defaultSettings, ...importedSettings },
        hasUnsavedChanges: true 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Formato de archivo inválido' };
    }
  },

  // Estados de carga y error
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Reset
  resetStore: () => set({
    settings: defaultSettings,
    isLoading: false,
    error: null,
    hasUnsavedChanges: false
  })
}));

export { useSettingsStore };
export default useSettingsStore;