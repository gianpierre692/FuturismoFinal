import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

// Datos mock para desarrollo
const generateMockReservations = () => {
  const reservations = [];
  const today = new Date();
  
  // Generar reservas para los últimos 30 días y próximos 30 días
  for (let i = -30; i <= 30; i++) {
    const date = addDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // Probabilidad de tener reservas (más alta para días recientes)
    if (Math.random() > 0.7) {
      const numReservations = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numReservations; j++) {
        const reservation = {
          id: `res_${dateKey}_${j}`,
          agencyId: 'agency1', // ID de la agencia actual
          date: dateKey,
          serviceType: ['City Tour', 'Machu Picchu', 'Valle Sagrado', 'Islas Ballestas', 'Nazca Lines'][Math.floor(Math.random() * 5)],
          clientName: ['Familia García', 'Sr. Johnson', 'Pareja López', 'Grupo Estudiantes', 'Sra. Williams'][Math.floor(Math.random() * 5)],
          participants: Math.floor(Math.random() * 8) + 1,
          totalAmount: (Math.floor(Math.random() * 300) + 50),
          status: ['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
          guideAssigned: Math.random() > 0.5 ? ['Carlos Mendoza', 'María Torres', 'Ana Quispe'][Math.floor(Math.random() * 3)] : null,
          time: ['08:00', '09:00', '14:00', '15:00'][Math.floor(Math.random() * 4)],
          duration: Math.floor(Math.random() * 6) + 2, // 2-8 horas
          commission: Math.floor(Math.random() * 50) + 10, // Comisión de la agencia
          points: Math.floor(Math.random() * 20) + 5, // Puntos ganados
          createdAt: new Date(date),
          updatedAt: new Date()
        };
        
        reservations.push(reservation);
      }
    }
  }
  
  return reservations;
};

// Generar transacciones de puntos mock
const generateMockPointsTransactions = () => {
  const transactions = [];
  const today = new Date();
  
  for (let i = -60; i <= 0; i++) {
    const date = addDays(today, i);
    
    if (Math.random() > 0.8) {
      transactions.push({
        id: `pt_${Date.now()}_${i}`,
        agencyId: 'agency1',
        type: Math.random() > 0.3 ? 'earned' : 'redeemed',
        amount: Math.floor(Math.random() * 50) + 5,
        reason: ['Reserva confirmada', 'Tour completado', 'Bonus mensual', 'Canje descuento', 'Promoción especial'][Math.floor(Math.random() * 5)],
        relatedReservation: Math.random() > 0.5 ? `res_${format(date, 'yyyy-MM-dd')}_0` : null,
        date: format(date, 'yyyy-MM-dd'),
        createdAt: date,
        processedBy: 'system'
      });
    }
  }
  
  return transactions;
};

const useAgencyStore = create(
  persist(
    (set, get) => ({
      // Estado
      currentAgency: {
        id: 'agency1',
        name: 'Turismo Aventura S.A.C.',
        email: 'agencia@test.com',
        phone: '+51 987 654 321',
        address: 'Av. Sol 123, Cusco',
        pointsBalance: 450,
        totalEarned: 1250,
        totalRedeemed: 800,
        memberSince: '2022-01-15',
        tier: 'gold' // bronze, silver, gold, platinum
      },
      
      reservations: generateMockReservations(),
      pointsTransactions: generateMockPointsTransactions(),
      availableSlots: {},
      
      // Acciones
      actions: {
        // === GESTIÓN DE RESERVAS ===
        getReservations: (filters = {}) => {
          const { reservations } = get();
          let filtered = [...reservations];
          
          if (filters.startDate && filters.endDate) {
            filtered = filtered.filter(res => 
              res.date >= filters.startDate && res.date <= filters.endDate
            );
          }
          
          if (filters.status) {
            filtered = filtered.filter(res => res.status === filters.status);
          }
          
          if (filters.serviceType) {
            filtered = filtered.filter(res => 
              res.serviceType.toLowerCase().includes(filters.serviceType.toLowerCase())
            );
          }
          
          return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        },
        
        getReservationsByDate: (date) => {
          const { reservations } = get();
          const dateKey = format(new Date(date), 'yyyy-MM-dd');
          return reservations.filter(res => res.date === dateKey);
        },
        
        addReservation: (reservationData) => {
          const newReservation = {
            id: `res_${Date.now()}`,
            agencyId: get().currentAgency.id,
            ...reservationData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          set(state => ({
            reservations: [...state.reservations, newReservation]
          }));
          
          return newReservation;
        },
        
        updateReservation: (reservationId, updates) => {
          const state = get();
          const reservation = state.reservations.find(res => res.id === reservationId);
          
          // Si la reserva cambia de 'pending' a 'confirmed', agregar puntos automáticamente
          if (reservation && reservation.status === 'pending' && updates.status === 'confirmed') {
            const pointsToEarn = get().actions.calculatePointsForReservation(reservation);
            
            // Agregar transacción de puntos automática
            const pointsTransaction = {
              id: `pt_auto_${Date.now()}`,
              agencyId: state.currentAgency.id,
              type: 'earned',
              amount: pointsToEarn,
              reason: `Reserva confirmada - ${reservation.serviceType}`,
              relatedReservation: reservationId,
              date: format(new Date(), 'yyyy-MM-dd'),
              createdAt: new Date(),
              processedBy: 'system'
            };
            
            set(state => ({
              reservations: state.reservations.map(res =>
                res.id === reservationId 
                  ? { ...res, ...updates, updatedAt: new Date() }
                  : res
              ),
              pointsTransactions: [...state.pointsTransactions, pointsTransaction]
            }));
            
            // Actualizar balance de puntos en currentAgency
            const newBalance = get().actions.getPointsBalance();
            set(state => ({
              currentAgency: {
                ...state.currentAgency,
                pointsBalance: newBalance.balance,
                totalEarned: newBalance.totalEarned,
                totalRedeemed: newBalance.totalRedeemed
              }
            }));
          } else {
            // Actualización normal sin cambio de estado a confirmado
            set(state => ({
              reservations: state.reservations.map(res =>
                res.id === reservationId 
                  ? { ...res, ...updates, updatedAt: new Date() }
                  : res
              )
            }));
          }
        },
        
        // Calcular puntos basados en la reserva
        calculatePointsForReservation: (reservation) => {
          const basePoints = 10; // Puntos base por reserva
          const amountMultiplier = Math.floor(reservation.totalAmount / 100); // 1 punto por cada 100 soles
          const participantBonus = Math.floor(reservation.participants / 2); // Bonus por número de participantes
          
          // Multiplicador por tipo de servicio
          const serviceMultipliers = {
            'City Tour': 1,
            'Machu Picchu': 2,
            'Valle Sagrado': 1.5,
            'Islas Ballestas': 1.2,
            'Nazca Lines': 1.8
          };
          
          const serviceMultiplier = serviceMultipliers[reservation.serviceType] || 1;
          
          return Math.floor((basePoints + amountMultiplier + participantBonus) * serviceMultiplier);
        },
        
        deleteReservation: (reservationId) => {
          set(state => ({
            reservations: state.reservations.filter(res => res.id !== reservationId)
          }));
        },
        
        // === REPORTES Y ESTADÍSTICAS ===
        getMonthlyReport: (year, month) => {
          const { reservations } = get();
          const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
          const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd');
          
          const monthReservations = reservations.filter(res => 
            res.date >= startDate && 
            res.date <= endDate && 
            res.status === 'confirmed'
          );
          
          const totalRevenue = monthReservations.reduce((sum, res) => sum + res.totalAmount, 0);
          const totalCommission = monthReservations.reduce((sum, res) => sum + (res.commission || 0), 0);
          const totalParticipants = monthReservations.reduce((sum, res) => sum + res.participants, 0);
          
          // Agrupar por tipo de servicio
          const serviceBreakdown = monthReservations.reduce((acc, res) => {
            if (!acc[res.serviceType]) {
              acc[res.serviceType] = {
                count: 0,
                revenue: 0,
                participants: 0
              };
            }
            acc[res.serviceType].count++;
            acc[res.serviceType].revenue += res.totalAmount;
            acc[res.serviceType].participants += res.participants;
            return acc;
          }, {});
          
          // Datos por día para gráficos
          const dailyData = eachDayOfInterval({
            start: new Date(year, month - 1, 1),
            end: new Date(year, month, 0)
          }).map(date => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const dayReservations = monthReservations.filter(res => res.date === dateKey);
            return {
              date: dateKey,
              revenue: dayReservations.reduce((sum, res) => sum + res.totalAmount, 0),
              reservations: dayReservations.length,
              participants: dayReservations.reduce((sum, res) => sum + res.participants, 0)
            };
          });
          
          return {
            period: { year, month },
            summary: {
              totalReservations: monthReservations.length,
              totalRevenue,
              totalCommission,
              totalParticipants,
              averageOrderValue: monthReservations.length > 0 ? totalRevenue / monthReservations.length : 0
            },
            serviceBreakdown,
            dailyData
          };
        },
        
        getYearlyComparison: (year) => {
          const months = Array.from({ length: 12 }, (_, i) => {
            const report = get().actions.getMonthlyReport(year, i + 1);
            return {
              month: i + 1,
              monthName: format(new Date(year, i, 1), 'MMMM', { locale: es }),
              ...report.summary
            };
          });
          
          return months;
        },
        
        // === SISTEMA DE PUNTOS ===
        getPointsBalance: () => {
          const { pointsTransactions } = get();
          const earned = pointsTransactions
            .filter(pt => pt.type === 'earned')
            .reduce((sum, pt) => sum + pt.amount, 0);
          
          const redeemed = pointsTransactions
            .filter(pt => pt.type === 'redeemed')
            .reduce((sum, pt) => sum + pt.amount, 0);
          
          return {
            balance: earned - redeemed,
            totalEarned: earned,
            totalRedeemed: redeemed
          };
        },
        
        addPointsTransaction: (transactionData) => {
          const newTransaction = {
            id: `pt_${Date.now()}`,
            agencyId: get().currentAgency.id,
            ...transactionData,
            date: format(new Date(), 'yyyy-MM-dd'),
            createdAt: new Date()
          };
          
          set(state => ({
            pointsTransactions: [...state.pointsTransactions, newTransaction]
          }));
          
          // Actualizar balance en currentAgency
          const newBalance = get().actions.getPointsBalance();
          set(state => ({
            currentAgency: {
              ...state.currentAgency,
              pointsBalance: newBalance.balance,
              totalEarned: newBalance.totalEarned,
              totalRedeemed: newBalance.totalRedeemed
            }
          }));
          
          return newTransaction;
        },
        
        getPointsHistory: (limit = 50) => {
          const { pointsTransactions } = get();
          return pointsTransactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
        },
        
        // === DISPONIBILIDAD ===
        getAvailableSlots: (date) => {
          const { availableSlots } = get();
          const dateKey = format(new Date(date), 'yyyy-MM-dd');
          return availableSlots[dateKey] || [];
        },
        
        setAvailableSlots: (date, slots) => {
          const dateKey = format(new Date(date), 'yyyy-MM-dd');
          set(state => ({
            availableSlots: {
              ...state.availableSlots,
              [dateKey]: slots
            }
          }));
        },
        
        // === CONFIGURACIÓN DE AGENCIA ===
        updateAgencyProfile: (updates) => {
          set(state => ({
            currentAgency: {
              ...state.currentAgency,
              ...updates,
              updatedAt: new Date()
            }
          }));
        },
        
        // === UTILIDADES ===
        getCalendarData: (startDate, endDate) => {
          const reservations = get().actions.getReservations({ startDate, endDate });
          const calendarData = {};
          
          // Inicializar todos los días del rango
          let currentDate = new Date(startDate);
          const end = new Date(endDate);
          
          while (currentDate <= end) {
            const dateKey = format(currentDate, 'yyyy-MM-dd');
            calendarData[dateKey] = {
              date: dateKey,
              reservations: [],
              totalRevenue: 0,
              totalParticipants: 0,
              hasAvailability: true
            };
            currentDate = addDays(currentDate, 1);
          }
          
          // Llenar con datos de reservas
          reservations.forEach(reservation => {
            if (calendarData[reservation.date]) {
              calendarData[reservation.date].reservations.push(reservation);
              if (reservation.status === 'confirmed') {
                calendarData[reservation.date].totalRevenue += reservation.totalAmount;
                calendarData[reservation.date].totalParticipants += reservation.participants;
              }
            }
          });
          
          return calendarData;
        }
      }
    }),
    {
      name: 'agency-store',
      partialize: (state) => ({
        currentAgency: state.currentAgency,
        reservations: state.reservations,
        pointsTransactions: state.pointsTransactions,
        availableSlots: state.availableSlots
      })
    }
  )
);

export { useAgencyStore };
export default useAgencyStore;