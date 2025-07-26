import { useRef, useEffect, useCallback } from 'react';
import Logger from '../utils/logger.js';

/**
 * useAbortController - Hook para manejar cancelación de requests
 * 
 * BENEFICIO: Previene memory leaks cuando componentes se desmontan
 * Cancela requests automáticamente
 */
const useAbortController = () => {
  const abortControllersRef = useRef(new Set());

  // Crear nuevo abort controller
  const createAbortController = useCallback((id = 'default') => {
    const controller = new AbortController();
    const controllerWithId = { controller, id };
    
    abortControllersRef.current.add(controllerWithId);
    
    // Limpiar cuando se complete/cancele
    const originalAbort = controller.abort.bind(controller);
    controller.abort = () => {
      originalAbort();
      abortControllersRef.current.delete(controllerWithId);
      Logger.debug(`Request aborted: ${id}`);
    };
    
    return controller;
  }, []);

  // Cancelar request específico
  const abortRequest = useCallback((id) => {
    const controllerEntry = Array.from(abortControllersRef.current)
      .find(entry => entry.id === id);
    
    if (controllerEntry) {
      controllerEntry.controller.abort();
    }
  }, []);

  // Cancelar todos los requests
  const abortAll = useCallback(() => {
    abortControllersRef.current.forEach(({ controller, id }) => {
      if (!controller.signal.aborted) {
        controller.abort();
        Logger.debug(`Auto-aborted request: ${id}`);
      }
    });
    abortControllersRef.current.clear();
  }, []);

  // Limpiar todos los controllers al desmontar
  useEffect(() => {
    return () => {
      abortAll();
    };
  }, [abortAll]);

  // Helper para fetch con abort automático
  const abortableFetch = useCallback((url, options = {}, id) => {
    const controller = createAbortController(id || `fetch-${Date.now()}`);
    
    const enhancedOptions = {
      ...options,
      signal: controller.signal
    };

    const fetchPromise = fetch(url, enhancedOptions)
      .then(response => {
        // Remover controller al completarse exitosamente
        abortControllersRef.current.forEach(entry => {
          if (entry.controller === controller) {
            abortControllersRef.current.delete(entry);
          }
        });
        return response;
      })
      .catch(error => {
        // No lanzar error si fue cancelación intencional
        if (error.name === 'AbortError') {
          Logger.debug('Request was aborted intentionally');
          return null;
        }
        
        // Remover controller al fallar
        abortControllersRef.current.forEach(entry => {
          if (entry.controller === controller) {
            abortControllersRef.current.delete(entry);
          }
        });
        
        throw error;
      });

    // Agregar método abort al promise
    fetchPromise.abort = () => controller.abort();
    
    return fetchPromise;
  }, [createAbortController]);

  return {
    createAbortController,
    abortRequest,
    abortAll,
    abortableFetch,
    // Estado para debugging
    get activeRequestsCount() {
      return abortControllersRef.current.size;
    }
  };
};

export default useAbortController;