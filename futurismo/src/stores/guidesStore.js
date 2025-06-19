import { create } from 'zustand';
import { getMockData, mockGuides } from '../data/mockData';

const useGuidesStore = create((set, get) => ({
  // Estado
  guides: mockGuides,
  isLoading: false,
  error: null,

  // Acciones para obtener guías
  getGuides: (filters = {}) => {
    const { guides } = get();
    
    let filtered = [...guides];
    
    if (filters.tipo) {
      filtered = filtered.filter(guide => guide.tipo === filters.tipo);
    }
    
    if (filters.availability) {
      filtered = filtered.filter(guide => guide.availability === filters.availability);
    }
    
    if (filters.language) {
      filtered = filtered.filter(guide => guide.languages.includes(filters.language));
    }
    
    if (filters.specialty) {
      filtered = filtered.filter(guide => guide.specialties.includes(filters.specialty));
    }
    
    return filtered;
  },

  // Obtener guías disponibles para una fecha y hora específica
  getAvailableGuides: (fecha, hora) => {
    return getMockData.guidesAvailableForDateTime(fecha, hora);
  },

  // Obtener un guía por ID
  getGuideById: (guideId) => {
    const { guides } = get();
    return guides.find(guide => guide.id === guideId);
  },

  // Obtener agenda de un guía freelance
  getGuideAgenda: (guideId, fecha) => {
    const guide = get().getGuideById(guideId);
    if (!guide || guide.tipo !== 'freelance' || !guide.agenda) {
      return null;
    }
    
    const fechaStr = fecha.toISOString().split('T')[0];
    return guide.agenda[fechaStr] || { disponible: false, horarios: [] };
  },

  // Actualizar agenda de un guía freelance
  updateGuideAgenda: (guideId, fecha, agendaData) => {
    set((state) => {
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const updatedGuides = state.guides.map(guide => {
        if (guide.id === guideId && guide.tipo === 'freelance') {
          return {
            ...guide,
            agenda: {
              ...guide.agenda,
              [fechaStr]: agendaData
            }
          };
        }
        return guide;
      });
      
      return { guides: updatedGuides };
    });
  },

  // Actualizar disponibilidad general de un guía
  updateGuideAvailability: (guideId, availability) => {
    set((state) => ({
      guides: state.guides.map(guide =>
        guide.id === guideId 
          ? { ...guide, availability }
          : guide
      )
    }));
  },

  // Asignar guía a un servicio/reserva
  assignGuideToService: (guideId, serviceData) => {
    set((state) => ({
      guides: state.guides.map(guide =>
        guide.id === guideId 
          ? { 
              ...guide, 
              availability: 'ocupado',
              currentService: serviceData
            }
          : guide
      )
    }));
  },

  // Liberar guía de un servicio
  releaseGuideFromService: (guideId) => {
    set((state) => ({
      guides: state.guides.map(guide =>
        guide.id === guideId 
          ? { 
              ...guide, 
              availability: 'disponible',
              currentService: null
            }
          : guide
      )
    }));
  },

  // Obtener estadísticas de guías
  getGuidesStatistics: () => {
    const { guides } = get();
    
    const totalGuides = guides.length;
    const plantaGuides = guides.filter(g => g.tipo === 'planta').length;
    const freelanceGuides = guides.filter(g => g.tipo === 'freelance').length;
    const disponibles = guides.filter(g => g.availability === 'disponible').length;
    const ocupados = guides.filter(g => g.availability === 'ocupado').length;
    
    return {
      total: totalGuides,
      planta: plantaGuides,
      freelance: freelanceGuides,
      disponibles,
      ocupados,
      ocupancyRate: totalGuides > 0 ? (ocupados / totalGuides * 100).toFixed(1) : 0
    };
  },

  // Obtener disponibilidad de freelance para una semana
  getFreelanceWeeklyAvailability: (startDate) => {
    const { guides } = get();
    const freelanceGuides = guides.filter(g => g.tipo === 'freelance');
    const weeklyData = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const fechaStr = currentDate.toISOString().split('T')[0];
      
      const dayData = {
        fecha: currentDate,
        fechaStr,
        guides: freelanceGuides.map(guide => ({
          ...guide,
          agendaDelDia: guide.agenda?.[fechaStr] || { disponible: false, horarios: [] }
        }))
      };
      
      weeklyData.push(dayData);
    }
    
    return weeklyData;
  },

  // Buscar conflictos de horarios
  checkScheduleConflicts: (guideId, fecha, horaInicio, horaFin) => {
    const guide = get().getGuideById(guideId);
    
    if (!guide) return { hasConflict: true, reason: 'Guía no encontrado' };
    
    // Guías de planta: solo verificar disponibilidad general
    if (guide.tipo === 'planta') {
      return {
        hasConflict: guide.availability !== 'disponible',
        reason: guide.availability !== 'disponible' ? 'Guía no disponible' : null
      };
    }
    
    // Guías freelance: verificar agenda específica
    const agenda = get().getGuideAgenda(guideId, fecha);
    
    if (!agenda || !agenda.disponible) {
      return { hasConflict: true, reason: 'Guía no disponible este día' };
    }
    
    // Verificar si el horario solicitado está dentro de los horarios disponibles
    const isTimeSlotAvailable = agenda.horarios.some(horario => {
      const [inicio, fin] = horario.split('-');
      return horaInicio >= inicio && horaFin <= fin;
    });
    
    return {
      hasConflict: !isTimeSlotAvailable,
      reason: !isTimeSlotAvailable ? 'Horario no disponible' : null
    };
  },

  // Obtener recomendaciones de guías
  getGuideRecommendations: (requirements = {}) => {
    const { guides } = get();
    
    let scored = guides.map(guide => {
      let score = 0;
      
      // Puntuación base por rating
      score += guide.rating * 10;
      
      // Puntuación por experiencia
      score += Math.min(guide.experience, 10) * 2;
      
      // Puntuación por idiomas requeridos
      if (requirements.languages) {
        const matchingLanguages = guide.languages.filter(lang => 
          requirements.languages.includes(lang)
        ).length;
        score += matchingLanguages * 15;
      }
      
      // Puntuación por especialidades requeridas
      if (requirements.specialties) {
        const matchingSpecialties = guide.specialties.filter(spec => 
          requirements.specialties.includes(spec)
        ).length;
        score += matchingSpecialties * 20;
      }
      
      // Penalización por tipo si se prefiere uno específico
      if (requirements.preferredType) {
        if (guide.tipo === requirements.preferredType) {
          score += 10;
        } else {
          score -= 5;
        }
      }
      
      // Puntuación por disponibilidad
      if (guide.availability === 'disponible') {
        score += 25;
      }
      
      return { ...guide, score };
    });
    
    // Ordenar por puntuación descendente
    return scored.sort((a, b) => b.score - a.score);
  },

  // Configurar carga de datos
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Limpiar errores
  clearError: () => set({ error: null }),
  
  // Reinicializar store
  resetStore: () => set({
    guides: mockGuides,
    isLoading: false,
    error: null
  })
}));

export { useGuidesStore };
export default useGuidesStore;