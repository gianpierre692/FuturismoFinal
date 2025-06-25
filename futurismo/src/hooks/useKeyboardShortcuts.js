import { useEffect } from 'react';

const useKeyboardShortcuts = (callbacks = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { ctrlKey, metaKey, shiftKey, key } = event;
      const isModified = ctrlKey || metaKey; // Ctrl en Windows/Linux, Cmd en Mac

      // Prevenir atajos cuando se está escribiendo en inputs
      if (
        event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true'
      ) {
        return;
      }

      // Ctrl/Cmd + N = Agregar evento
      if (isModified && !shiftKey && key.toLowerCase() === 'n') {
        event.preventDefault();
        callbacks.onAddEvent?.();
        return;
      }

      // Ctrl/Cmd + Shift + N = Marcar tiempo ocupado
      if (isModified && shiftKey && key.toLowerCase() === 'n') {
        event.preventDefault();
        callbacks.onMarkOccupied?.();
        return;
      }

      // Ctrl/Cmd + D = Cambiar a vista día
      if (isModified && key.toLowerCase() === 'd') {
        event.preventDefault();
        callbacks.onSetDayView?.();
        return;
      }

      // Ctrl/Cmd + W = Cambiar a vista semana
      if (isModified && key.toLowerCase() === 'w') {
        event.preventDefault();
        callbacks.onSetWeekView?.();
        return;
      }

      // Ctrl/Cmd + M = Cambiar a vista mes
      if (isModified && key.toLowerCase() === 'm') {
        event.preventDefault();
        callbacks.onSetMonthView?.();
        return;
      }

      // T = Ir a hoy
      if (!isModified && key.toLowerCase() === 't') {
        event.preventDefault();
        callbacks.onGoToToday?.();
        return;
      }

      // Flecha izquierda = Navegar atrás
      if (!isModified && key === 'ArrowLeft') {
        event.preventDefault();
        callbacks.onNavigatePrevious?.();
        return;
      }

      // Flecha derecha = Navegar adelante
      if (!isModified && key === 'ArrowRight') {
        event.preventDefault();
        callbacks.onNavigateNext?.();
        return;
      }

      // Escape = Cerrar modales
      if (key === 'Escape') {
        callbacks.onEscape?.();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callbacks]);

  // Retornar lista de atajos disponibles para mostrar al usuario
  return {
    shortcuts: [
      { key: 'Ctrl/Cmd + N', description: 'Agregar evento personal' },
      { key: 'Ctrl/Cmd + Shift + N', description: 'Marcar tiempo ocupado' },
      { key: 'Ctrl/Cmd + D', description: 'Vista día' },
      { key: 'Ctrl/Cmd + W', description: 'Vista semana' },
      { key: 'Ctrl/Cmd + M', description: 'Vista mes' },
      { key: 'T', description: 'Ir a hoy' },
      { key: '←/→', description: 'Navegar fechas' },
      { key: 'Esc', description: 'Cerrar modal' }
    ]
  };
};

export default useKeyboardShortcuts;