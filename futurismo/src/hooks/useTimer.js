import { useRef, useEffect, useCallback } from 'react';
import Logger from '../utils/logger.js';

/**
 * useTimer - Hook para manejar timers con cleanup automático
 * 
 * BENEFICIO: Previene memory leaks, cleanup automático
 * Timers se cancelan al desmontar componente
 */
const useTimer = () => {
  const timersRef = useRef(new Set());

  // Crear timeout con cleanup automático
  const setTimeout = useCallback((callback, delay, id) => {
    const timerId = window.setTimeout(() => {
      try {
        callback();
      } catch (error) {
        Logger.error('Error in setTimeout callback:', error);
      } finally {
        // Remover del set cuando se ejecute
        timersRef.current.delete(timerId);
      }
    }, delay);

    timersRef.current.add(timerId);
    
    if (id) {
      Logger.debug(`Timer created: ${id} (${delay}ms)`);
    }

    return timerId;
  }, []);

  // Crear interval con cleanup automático
  const setInterval = useCallback((callback, interval, id) => {
    const timerId = window.setInterval(() => {
      try {
        callback();
      } catch (error) {
        Logger.error('Error in setInterval callback:', error);
        // En caso de error, cancelar el interval
        clearInterval(timerId);
      }
    }, interval);

    timersRef.current.add(timerId);
    
    if (id) {
      Logger.debug(`Interval created: ${id} (${interval}ms)`);
    }

    return timerId;
  }, []);

  // Cancelar timeout específico
  const clearTimeout = useCallback((timerId, id) => {
    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(timerId);
      
      if (id) {
        Logger.debug(`Timeout cleared: ${id}`);
      }
    }
  }, []);

  // Cancelar interval específico
  const clearInterval = useCallback((timerId, id) => {
    if (timerId) {
      window.clearInterval(timerId);
      timersRef.current.delete(timerId);
      
      if (id) {
        Logger.debug(`Interval cleared: ${id}`);
      }
    }
  }, []);

  // Cancelar todos los timers
  const clearAll = useCallback(() => {
    timersRef.current.forEach(timerId => {
      window.clearTimeout(timerId); // clearTimeout funciona para ambos
      window.clearInterval(timerId);
    });
    
    const count = timersRef.current.size;
    timersRef.current.clear();
    
    if (count > 0) {
      Logger.debug(`Cleared ${count} timers on cleanup`);
    }
  }, []);

  // Debounced function con cleanup
  const debounce = useCallback((func, delay, id) => {
    let timeoutId = null;
    
    const debouncedFunction = (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        try {
          func.apply(null, args);
        } catch (error) {
          Logger.error('Error in debounced function:', error);
        }
      }, delay, id ? `debounce-${id}` : undefined);
    };

    // Método para cancelar manualmente
    debouncedFunction.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId, id ? `debounce-${id}` : undefined);
        timeoutId = null;
      }
    };

    return debouncedFunction;
  }, [setTimeout, clearTimeout]);

  // Throttled function con cleanup
  const throttle = useCallback((func, limit, id) => {
    let inThrottle = false;
    let timeoutId = null;
    
    const throttledFunction = (...args) => {
      if (!inThrottle) {
        try {
          func.apply(null, args);
        } catch (error) {
          Logger.error('Error in throttled function:', error);
        }
        
        inThrottle = true;
        
        timeoutId = setTimeout(() => {
          inThrottle = false;
        }, limit, id ? `throttle-${id}` : undefined);
      }
    };

    // Método para cancelar manualmente
    throttledFunction.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId, id ? `throttle-${id}` : undefined);
        timeoutId = null;
        inThrottle = false;
      }
    };

    return throttledFunction;
  }, [setTimeout, clearTimeout]);

  // Delay con Promise (cancelable)
  const delay = useCallback((ms, id) => {
    let timeoutId;
    
    const promise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        resolve();
      }, ms, id ? `delay-${id}` : undefined);
    });

    // Agregar método cancel
    promise.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId, id ? `delay-${id}` : undefined);
      }
    };

    return promise;
  }, [setTimeout, clearTimeout]);

  // Cleanup automático al desmontar
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  return {
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    clearAll,
    debounce,
    throttle,
    delay,
    // Estado para debugging
    get activeTimersCount() {
      return timersRef.current.size;
    }
  };
};

export default useTimer;