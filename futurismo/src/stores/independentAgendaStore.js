import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { format, startOfDay, endOfDay, isWithinInterval, parseISO, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

const VISIBILITY_LEVELS = {
  PRIVATE: 'private',        // Solo el guía lo ve
  OCCUPIED: 'occupied',      // Admin ve "ocupado" sin detalles  
  COMPANY: 'company',        // Todos ven detalles (tours oficiales)
  PUBLIC: 'public'           // Cliente puede ver disponibilidad
};

const EVENT_TYPES = {
  PERSONAL: 'personal',
  COMPANY_TOUR: 'company_tour', 
  OCCUPIED: 'occupied',
  AVAILABLE: 'available'
};

// Mock data para desarrollo y testing
const generateMockData = () => {
  const today = new Date();
  const mockData = {
    personalEvents: {},
    assignedTours: {},
    workingHours: {}
  };

  // Guías mock
  const guides = ['1', '2', '3', 'user123'];

  guides.forEach(guideId => {
    mockData.personalEvents[guideId] = {};
    mockData.assignedTours[guideId] = {};
    
    // Horarios de trabajo
    mockData.workingHours[guideId] = {
      lunes: { enabled: true, start: '09:00', end: '17:00' },
      martes: { enabled: true, start: '09:00', end: '17:00' },
      miercoles: { enabled: true, start: '09:00', end: '17:00' },
      jueves: { enabled: true, start: '09:00', end: '17:00' },
      viernes: { enabled: true, start: '09:00', end: '17:00' },
      sabado: { enabled: true, start: '10:00', end: '14:00' },
      domingo: { enabled: false, start: '10:00', end: '14:00' }
    };

    // Generar eventos para los próximos 30 días
    for (let i = -15; i <= 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      // Agregar más eventos para hoy para mostrar funcionalidad
      const isToday = i === 0;

      // Eventos personales (solo algunos días, más frecuentes para hoy)
      if (Math.random() > (isToday ? 0.3 : 0.7)) {
        mockData.personalEvents[guideId][dateKey] = [
          {
            id: `personal_${guideId}_${i}_1`,
            title: ['Cita médica', 'Compromiso familiar', 'Trámites personales', 'Descanso'][Math.floor(Math.random() * 4)],
            description: 'Evento personal',
            startTime: ['09:00', '14:00', '16:00'][Math.floor(Math.random() * 3)],
            endTime: ['11:00', '16:00', '18:00'][Math.floor(Math.random() * 3)],
            date: dateKey,
            type: EVENT_TYPES.PERSONAL,
            visibility: VISIBILITY_LEVELS.PRIVATE,
            location: 'Personal',
            createdAt: new Date(),
            guideId
          }
        ];
      }

      // Tiempo ocupado (algunos días)
      if (Math.random() > 0.8) {
        if (!mockData.personalEvents[guideId][dateKey]) {
          mockData.personalEvents[guideId][dateKey] = [];
        }
        mockData.personalEvents[guideId][dateKey].push({
          id: `occupied_${guideId}_${i}_1`,
          title: 'Ocupado',
          startTime: ['10:00', '13:00', '15:00'][Math.floor(Math.random() * 3)],
          endTime: ['12:00', '15:00', '17:00'][Math.floor(Math.random() * 3)],
          date: dateKey,
          type: EVENT_TYPES.OCCUPIED,
          visibility: VISIBILITY_LEVELS.OCCUPIED,
          createdAt: new Date(),
          guideId
        });
      }

      // Tours asignados por empresa (varios días, más frecuentes para hoy)
      if (Math.random() > (isToday ? 0.2 : 0.6)) {
        const tours = [
          { title: 'City Tour Cusco', client: 'Familia García', price: '150', location: 'Plaza de Armas' },
          { title: 'Machu Picchu Full Day', client: 'Sr. Johnson', price: '300', location: 'Estación San Pedro' },
          { title: 'Valle Sagrado', client: 'Grupo Estudiantes', price: '200', location: 'Hotel Centro' },
          { title: 'Salineras de Maras', client: 'Pareja López', price: '120', location: 'Plaza San Francisco' },
          { title: 'Pisaq Market Tour', client: 'Sra. Williams', price: '80', location: 'Mercado San Pedro' }
        ];

        const tour = tours[Math.floor(Math.random() * tours.length)];
        mockData.assignedTours[guideId][dateKey] = [
          {
            id: `tour_${guideId}_${i}_1`,
            title: tour.title,
            client: tour.client,
            description: `Tour completo de ${tour.title.toLowerCase()}`,
            startTime: ['08:00', '09:00', '14:00'][Math.floor(Math.random() * 3)],
            endTime: ['13:00', '17:00', '18:00'][Math.floor(Math.random() * 3)],
            date: dateKey,
            type: EVENT_TYPES.COMPANY_TOUR,
            visibility: VISIBILITY_LEVELS.COMPANY,
            location: tour.location,
            price: tour.price,
            status: ['confirmed', 'pending', 'tentative'][Math.floor(Math.random() * 3)],
            assignedAt: new Date(),
            guideId
          }
        ];

        // Algunos días con múltiples tours
        if (Math.random() > 0.8) {
          const secondTour = tours[Math.floor(Math.random() * tours.length)];
          mockData.assignedTours[guideId][dateKey].push({
            id: `tour_${guideId}_${i}_2`,
            title: secondTour.title,
            client: secondTour.client,
            description: `Segundo tour del día`,
            startTime: '15:00',
            endTime: '18:00',
            date: dateKey,
            type: EVENT_TYPES.COMPANY_TOUR,
            visibility: VISIBILITY_LEVELS.COMPANY,
            location: secondTour.location,
            price: secondTour.price,
            status: 'confirmed',
            assignedAt: new Date(),
            guideId
          });
        }
      }

      // Eventos de todo el día (ocasionales)
      if (Math.random() > 0.95) {
        if (!mockData.personalEvents[guideId][dateKey]) {
          mockData.personalEvents[guideId][dateKey] = [];
        }
        mockData.personalEvents[guideId][dateKey].push({
          id: `allday_${guideId}_${i}_1`,
          title: ['Día libre', 'Capacitación', 'Evento familiar'][Math.floor(Math.random() * 3)],
          description: 'Evento de todo el día',
          allDay: true,
          startTime: null, // Eventos de todo el día no tienen hora específica
          endTime: null,
          date: dateKey,
          type: EVENT_TYPES.PERSONAL,
          visibility: VISIBILITY_LEVELS.PRIVATE,
          createdAt: new Date(),
          guideId
        });
      }
    }
  });

  // Agregar eventos específicos para hoy para mostrar funcionalidad
  const todayKey = format(today, 'yyyy-MM-dd');
  
  // Usuario 'user123' (guía freelance logueado) - eventos de hoy
  if (!mockData.personalEvents['user123'][todayKey]) {
    mockData.personalEvents['user123'][todayKey] = [];
  }
  if (!mockData.assignedTours['user123'][todayKey]) {
    mockData.assignedTours['user123'][todayKey] = [];
  }

  // Agregar eventos personales de hoy
  mockData.personalEvents['user123'][todayKey].push({
    id: `personal_today_1`,
    title: 'Cita dentista',
    description: 'Revisión dental programada',
    startTime: '08:00',
    endTime: '09:00',
    date: todayKey,
    type: EVENT_TYPES.PERSONAL,
    visibility: VISIBILITY_LEVELS.PRIVATE,
    location: 'Clínica Dental San Pedro',
    createdAt: new Date(),
    guideId: 'user123'
  });

  // Agregar tiempo ocupado para hoy
  mockData.personalEvents['user123'][todayKey].push({
    id: `occupied_today_1`,
    title: 'Ocupado',
    startTime: '12:00',
    endTime: '13:30',
    date: todayKey,
    type: EVENT_TYPES.OCCUPIED,
    visibility: VISIBILITY_LEVELS.OCCUPIED,
    createdAt: new Date(),
    guideId: 'user123'
  });

  // Agregar tours de empresa para hoy
  mockData.assignedTours['user123'][todayKey].push({
    id: `tour_today_1`,
    title: 'City Tour Cusco',
    client: 'Familia Rodríguez',
    description: 'Tour completo por el centro histórico de Cusco',
    startTime: '09:30',
    endTime: '12:00',
    date: todayKey,
    type: EVENT_TYPES.COMPANY_TOUR,
    visibility: VISIBILITY_LEVELS.COMPANY,
    location: 'Plaza de Armas',
    price: '150',
    status: 'confirmed',
    assignedAt: new Date(),
    guideId: 'user123'
  });

  mockData.assignedTours['user123'][todayKey].push({
    id: `tour_today_2`,
    title: 'Qorikancha y San Pedro',
    client: 'Sr. Anderson',
    description: 'Visita al templo del sol y mercado tradicional',
    startTime: '14:00',
    endTime: '17:00',
    date: todayKey,
    type: EVENT_TYPES.COMPANY_TOUR,
    visibility: VISIBILITY_LEVELS.COMPANY,
    location: 'Qorikancha',
    price: '120',
    status: 'confirmed',
    assignedAt: new Date(),
    guideId: 'user123'
  });

  // Para el guía '1' (Carlos Mendoza) - eventos para que admin vea disponibilidad
  if (!mockData.personalEvents['1'][todayKey]) {
    mockData.personalEvents['1'][todayKey] = [];
  }
  if (!mockData.assignedTours['1'][todayKey]) {
    mockData.assignedTours['1'][todayKey] = [];
  }

  mockData.personalEvents['1'][todayKey].push({
    id: `occupied_carlos_today`,
    title: 'Ocupado',
    startTime: '10:00',
    endTime: '11:30',
    date: todayKey,
    type: EVENT_TYPES.OCCUPIED,
    visibility: VISIBILITY_LEVELS.OCCUPIED,
    createdAt: new Date(),
    guideId: '1'
  });

  mockData.assignedTours['1'][todayKey].push({
    id: `tour_carlos_today`,
    title: 'Machu Picchu Full Day',
    client: 'Familia Johnson',
    description: 'Tour completo a Machu Picchu con tren',
    startTime: '06:00',
    endTime: '19:00',
    date: todayKey,
    type: EVENT_TYPES.COMPANY_TOUR,
    visibility: VISIBILITY_LEVELS.COMPANY,
    location: 'Estación San Pedro',
    price: '300',
    status: 'confirmed',
    assignedAt: new Date(),
    guideId: '1'
  });

  return mockData;
};

const useIndependentAgendaStore = create(
  persist(
    devtools(
      (set, get) => {
        // Generar datos mock al inicializar
        const mockData = generateMockData();
        
        return {
          // Estado principal
          currentView: 'week', // day, week, month, year
          selectedDate: new Date(),
          currentGuide: '1', // Seleccionar primer guía por defecto
          
          // Eventos personales del guía (privados) - Con datos mock
          personalEvents: mockData.personalEvents,
          
          // Estados de disponibilidad por guía
          availabilitySlots: {},
          
          // Tours asignados por empresa (compartidos) - Con datos mock
          assignedTours: mockData.assignedTours,
          
          // Horarios de trabajo por guía - Con datos mock
          workingHours: mockData.workingHours,
          
          // Configuración de vista
          viewPreferences: {
            showWeekends: true,
            workingHoursOnly: false,
            timeFormat: '24h',
            firstDayOfWeek: 1 // Lunes
          },
        
          // Acciones principales
          actions: {
          // === NAVEGACIÓN Y VISTAS ===
          setCurrentView: (view) => set({ currentView: view }),
          
          setSelectedDate: (date) => set({ selectedDate: new Date(date) }),
          
          setCurrentGuide: (guideId) => set({ currentGuide: guideId }),
          
          // === EVENTOS PERSONALES (SOLO GUÍA) ===
          addPersonalEvent: (guideId, event) => {
            const { personalEvents } = get();
            const eventDate = event.date ? new Date(event.date) : new Date();
            const dateKey = !isNaN(eventDate) ? format(eventDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
            const newEvent = {
              ...event,
              id: `personal_${Date.now()}`,
              type: EVENT_TYPES.PERSONAL,
              visibility: VISIBILITY_LEVELS.PRIVATE,
              createdAt: new Date(),
              guideId
            };
            
            set({
              personalEvents: {
                ...personalEvents,
                [guideId]: {
                  ...personalEvents[guideId],
                  [dateKey]: [
                    ...(personalEvents[guideId]?.[dateKey] || []),
                    newEvent
                  ]
                }
              }
            });
            
            return newEvent;
          },
          
          updatePersonalEvent: (guideId, eventId, updates) => {
            const { personalEvents } = get();
            const guideEvents = personalEvents[guideId] || {};
            
            const updatedEvents = {};
            Object.entries(guideEvents).forEach(([dateKey, events]) => {
              updatedEvents[dateKey] = events.map(event => 
                event.id === eventId ? { ...event, ...updates, updatedAt: new Date() } : event
              );
            });
            
            set({
              personalEvents: {
                ...personalEvents,
                [guideId]: updatedEvents
              }
            });
          },
          
          deletePersonalEvent: (guideId, eventId) => {
            const { personalEvents } = get();
            const guideEvents = personalEvents[guideId] || {};
            
            const updatedEvents = {};
            Object.entries(guideEvents).forEach(([dateKey, events]) => {
              updatedEvents[dateKey] = events.filter(event => event.id !== eventId);
            });
            
            set({
              personalEvents: {
                ...personalEvents,
                [guideId]: updatedEvents
              }
            });
          },
          
          // === TIEMPO OCUPADO (VISIBLE PARA ADMIN COMO "OCUPADO") ===
          markTimeAsOccupied: (guideId, timeSlot) => {
            const { personalEvents } = get();
            const dateKey = format(new Date(timeSlot.date), 'yyyy-MM-dd');
            const occupiedEvent = {
              id: `occupied_${Date.now()}`,
              title: 'Ocupado',
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
              date: timeSlot.date,
              type: EVENT_TYPES.OCCUPIED,
              visibility: VISIBILITY_LEVELS.OCCUPIED,
              createdAt: new Date(),
              guideId
            };
            
            set({
              personalEvents: {
                ...personalEvents,
                [guideId]: {
                  ...personalEvents[guideId],
                  [dateKey]: [
                    ...(personalEvents[guideId]?.[dateKey] || []),
                    occupiedEvent
                  ]
                }
              }
            });
            
            return occupiedEvent;
          },
          
          // === HORARIOS DE TRABAJO ===
          setWorkingHours: (guideId, schedule) => {
            const { workingHours } = get();
            set({
              workingHours: {
                ...workingHours,
                [guideId]: {
                  ...schedule,
                  updatedAt: new Date()
                }
              }
            });
          },
          
          // === TOURS ASIGNADOS POR EMPRESA ===
          assignTourToGuide: (guideId, tour) => {
            const { assignedTours } = get();
            const dateKey = format(new Date(tour.date), 'yyyy-MM-dd');
            const newTour = {
              ...tour,
              id: `tour_${Date.now()}`,
              type: EVENT_TYPES.COMPANY_TOUR,
              visibility: VISIBILITY_LEVELS.COMPANY,
              assignedAt: new Date(),
              guideId
            };
            
            set({
              assignedTours: {
                ...assignedTours,
                [guideId]: {
                  ...assignedTours[guideId],
                  [dateKey]: [
                    ...(assignedTours[guideId]?.[dateKey] || []),
                    newTour
                  ]
                }
              }
            });
            
            return newTour;
          },
          
          updateAssignedTour: (guideId, tourId, updates) => {
            const { assignedTours } = get();
            const guideTours = assignedTours[guideId] || {};
            
            const updatedTours = {};
            Object.entries(guideTours).forEach(([dateKey, tours]) => {
              updatedTours[dateKey] = tours.map(tour => 
                tour.id === tourId ? { ...tour, ...updates, updatedAt: new Date() } : tour
              );
            });
            
            set({
              assignedTours: {
                ...assignedTours,
                [guideId]: updatedTours
              }
            });
          },
          
          // === CONSULTAS DE DISPONIBILIDAD (PARA ADMIN) ===
          getGuideAvailability: (guideId, date) => {
            const { personalEvents, assignedTours, workingHours } = get();
            const dateKey = format(new Date(date), 'yyyy-MM-dd');
            
            // Obtener eventos del día
            const personalEventsOfDay = personalEvents[guideId]?.[dateKey] || [];
            const toursOfDay = assignedTours[guideId]?.[dateKey] || [];
            const allEvents = [...personalEventsOfDay, ...toursOfDay];
            
            // Horarios de trabajo del guía
            const guideWorkingHours = workingHours[guideId];
            
            // Retornar disponibilidad para admin
            return {
              date: dateKey,
              guideId,
              workingHours: guideWorkingHours,
              occupiedSlots: allEvents.filter(event => 
                event.visibility === VISIBILITY_LEVELS.OCCUPIED || 
                event.visibility === VISIBILITY_LEVELS.COMPANY
              ).map(event => ({
                id: event.id,
                startTime: event.startTime,
                endTime: event.endTime,
                title: event.visibility === VISIBILITY_LEVELS.OCCUPIED ? 'Ocupado' : event.title,
                type: event.type,
                visibility: event.visibility
              })),
              availableSlots: get().actions.calculateAvailableSlots(guideId, date)
            };
          },
          
          // === VISTA COMPLETA PARA GUÍA ===
          getGuideCompleteAgenda: (guideId, date) => {
            const { personalEvents, assignedTours } = get();
            const dateKey = format(new Date(date), 'yyyy-MM-dd');
            
            const personalEventsOfDay = personalEvents[guideId]?.[dateKey] || [];
            const toursOfDay = assignedTours[guideId]?.[dateKey] || [];
            
            return {
              date: dateKey,
              guideId,
              allEvents: [...personalEventsOfDay, ...toursOfDay].sort((a, b) => {
                // Eventos de todo el día van primero
                if (a.allDay && !b.allDay) return -1;
                if (!a.allDay && b.allDay) return 1;
                if (a.allDay && b.allDay) return 0;
                
                // Para eventos con hora, usar startTime (con fallback a '00:00')
                const aTime = a.startTime || '00:00';
                const bTime = b.startTime || '00:00';
                return aTime.localeCompare(bTime);
              })
            };
          },
          
          // === CÁLCULO DE SLOTS DISPONIBLES ===
          calculateAvailableSlots: (guideId, date) => {
            const { personalEvents, assignedTours, workingHours } = get();
            const dateKey = format(new Date(date), 'yyyy-MM-dd');
            
            // Obtener horarios de trabajo
            const guideWorkingHours = workingHours[guideId];
            if (!guideWorkingHours) return [];
            
            // Obtener todos los eventos ocupados
            const personalEventsOfDay = personalEvents[guideId]?.[dateKey] || [];
            const toursOfDay = assignedTours[guideId]?.[dateKey] || [];
            const occupiedEvents = [...personalEventsOfDay, ...toursOfDay];
            
            // Calcular slots disponibles (lógica simplificada)
            const dayOfWeek = format(new Date(date), 'EEEE', { locale: es }).toLowerCase();
            const workingHoursForDay = guideWorkingHours[dayOfWeek];
            
            if (!workingHoursForDay || !workingHoursForDay.enabled) return [];
            
            // TODO: Implementar lógica completa de cálculo de slots disponibles
            // Por ahora retorna estructura básica
            return [
              {
                startTime: workingHoursForDay.start,
                endTime: workingHoursForDay.end,
                duration: 60 // minutos
              }
            ];
          },
          
          // === GESTIÓN DE PREFERENCIAS ===
          updateViewPreferences: (preferences) => {
            const { viewPreferences } = get();
            set({
              viewPreferences: {
                ...viewPreferences,
                ...preferences
              }
            });
          },
          
          // === UTILIDADES ===
          getEventsForDateRange: (guideId, startDate, endDate) => {
            const { personalEvents, assignedTours } = get();
            const events = [];
            
            let currentDate = new Date(startDate);
            while (currentDate <= new Date(endDate)) {
              const dateKey = format(currentDate, 'yyyy-MM-dd');
              const personalEventsOfDay = personalEvents[guideId]?.[dateKey] || [];
              const toursOfDay = assignedTours[guideId]?.[dateKey] || [];
              
              events.push(...personalEventsOfDay, ...toursOfDay);
              currentDate = addDays(currentDate, 1);
            }
            
            return events;
          },
          
          // === LIMPIEZA Y MANTENIMIENTO ===
          clearOldEvents: (guideId, daysToKeep = 30) => {
            const { personalEvents, assignedTours } = get();
            const cutoffDate = subDays(new Date(), daysToKeep);
            
            // Limpiar eventos personales antiguos
            const cleanedPersonalEvents = {};
            Object.entries(personalEvents[guideId] || {}).forEach(([dateKey, events]) => {
              if (new Date(dateKey) >= cutoffDate) {
                cleanedPersonalEvents[dateKey] = events;
              }
            });
            
            // Limpiar tours antiguos
            const cleanedTours = {};
            Object.entries(assignedTours[guideId] || {}).forEach(([dateKey, tours]) => {
              if (new Date(dateKey) >= cutoffDate) {
                cleanedTours[dateKey] = tours;
              }
            });
            
            set({
              personalEvents: {
                ...personalEvents,
                [guideId]: cleanedPersonalEvents
              },
              assignedTours: {
                ...assignedTours,
                [guideId]: cleanedTours
              }
            });
          }
        }
      };
    },
    { 
      name: 'IndependentAgendaStore' 
    }
  ),
  {
    name: 'independent-agenda-store',
    version: 2, // Cambiar versión para forzar regeneración de mock data con startTime corregido
    partialize: (state) => ({
      personalEvents: state.personalEvents,
      availabilitySlots: state.availabilitySlots,
      assignedTours: state.assignedTours,
      workingHours: state.workingHours,
      viewPreferences: state.viewPreferences
    })
  }
));

export default useIndependentAgendaStore;
export { VISIBILITY_LEVELS, EVENT_TYPES };