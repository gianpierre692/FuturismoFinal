import React from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import FreelanceAgenda from '../components/agenda/FreelanceAgenda';
import AdminAgendaView from '../components/agenda/AdminAgendaView';
import useAuthStore from '../stores/authStore';

const Agenda = () => {
  const { user } = useAuthStore();

  // Verificar el tipo de usuario
  const isFreelanceGuide = user?.role === 'guide' && user?.guideType === 'freelance';
  const isAdmin = user?.role === 'admin';

  if (!isFreelanceGuide && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Gestión de Agenda
            </h1>
            <p className="text-gray-600 mb-6">
              Esta función está disponible para guías freelance y administradores.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Acceso a la Agenda</p>
                  <p>
                    Los guías freelance pueden gestionar su disponibilidad y horarios 
                    desde esta sección. Los administradores pueden coordinar y visualizar 
                    las agendas de todos los guías freelance. Los guías de planta tienen 
                    horarios fijos gestionados por el administrador.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <CalendarDaysIcon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Coordinación de Agendas' : 'Gestión de Agenda'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin 
                ? 'Visualiza y coordina las agendas de todos los guías freelance'
                : 'Administra tu disponibilidad y horarios como guía freelance'
              }
            </p>
          </div>
        </div>

        {/* User Info */}
        {isFreelanceGuide && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center">
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150?img=12'}
                alt={user?.name}
                className="h-12 w-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {user?.name}
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>Guía Freelance</span>
                  {user?.specialties && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{user.specialties.slice(0, 2).join(', ')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agenda Component */}
        {isFreelanceGuide ? <FreelanceAgenda /> : <AdminAgendaView />}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5 mr-4 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-2">
                {isAdmin ? 'Funciones de Coordinación' : 'Consejos para tu Agenda'}
              </h4>
              <ul className="space-y-1 list-disc list-inside">
                {isAdmin ? (
                  <>
                    <li>Visualiza la disponibilidad de todos los guías freelance</li>
                    <li>Filtra por guías específicos para coordinar asignaciones</li>
                    <li>Contacta directamente a los guías desde la interfaz</li>
                    <li>Monitorea patrones de disponibilidad para planificación</li>
                    <li>Usa las vistas semanal y mensual según necesites</li>
                  </>
                ) : (
                  <>
                    <li>Mantén tu agenda actualizada para recibir más reservas</li>
                    <li>Define horarios realistas considerando tiempo de traslado</li>
                    <li>Bloquea días de descanso o compromisos personales</li>
                    <li>Los clientes pueden ver tu disponibilidad en tiempo real</li>
                    <li>Puedes modificar tu agenda hasta 24 horas antes</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;