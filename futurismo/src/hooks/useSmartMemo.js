import { useMemo, useRef, useCallback } from 'react';
import Logger from '../utils/logger.js';

/**
 * useSmartMemo - Hook para memoización inteligente con debugging
 * 
 * BENEFICIO: Detecta cuando memoización no es efectiva
 * Ayuda a optimizar performance
 */

// Cache para valores computados costosos
const expensiveComputationCache = new Map();

const useSmartMemo = (factory, deps, debugLabel) => {
  const computeCountRef = useRef(0);
  const lastDepsRef = useRef(deps);
  
  const memoizedValue = useMemo(() => {
    computeCountRef.current++;
    
    if (debugLabel && computeCountRef.current > 1) {
      const depsChanged = lastDepsRef.current.some((dep, index) => dep !== deps[index]);
      if (depsChanged) {
        Logger.debug(`Memo recomputed: ${debugLabel} (${computeCountRef.current} times)`, {
          previousDeps: lastDepsRef.current,
          currentDeps: deps
        });
      }
    }
    
    lastDepsRef.current = deps;
    
    const start = performance.now();
    const result = factory();
    const duration = performance.now() - start;
    
    if (duration > 10) { // Log si toma más de 10ms
      Logger.performance(`Expensive computation: ${debugLabel || 'anonymous'}`, duration);
    }
    
    return result;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return memoizedValue;
};

// Hook para memoización con cache persistente
const usePersistentMemo = (factory, deps, cacheKey) => {
  return useMemo(() => {
    const key = cacheKey || JSON.stringify(deps);
    
    if (expensiveComputationCache.has(key)) {
      Logger.debug(`Cache hit for: ${key}`);
      return expensiveComputationCache.get(key);
    }
    
    const start = performance.now();
    const result = factory();
    const duration = performance.now() - start;
    
    expensiveComputationCache.set(key, result);
    
    // Limpiar cache si es muy grande
    if (expensiveComputationCache.size > 100) {
      const firstKey = expensiveComputationCache.keys().next().value;
      expensiveComputationCache.delete(firstKey);
    }
    
    Logger.debug(`Cached computation: ${key} (${duration.toFixed(2)}ms)`);
    return result;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

// Hook para callback memoizado con debugging
const useSmartCallback = (callback, deps, debugLabel) => {
  const callCountRef = useRef(0);
  
  return useCallback((...args) => {
    callCountRef.current++;
    
    if (debugLabel && callCountRef.current % 100 === 0) {
      Logger.debug(`Callback called ${callCountRef.current} times: ${debugLabel}`);
    }
    
    return callback(...args);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

// Hook para detectar re-renders innecesarios
const useRenderCount = (componentName) => {
  const renderCountRef = useRef(0);
  
  renderCountRef.current++;
  
  if (renderCountRef.current > 10 && renderCountRef.current % 10 === 0) {
    Logger.warn(`Component ${componentName} has rendered ${renderCountRef.current} times`);
  }
  
  return renderCountRef.current;
};

// Hook para monitorear cambios en dependencies
const useWhatChanged = (deps, depNames = []) => {
  const prevDepsRef = useRef(deps);
  
  useMemo(() => {
    const changedDeps = deps.map((dep, index) => {
      const hasChanged = prevDepsRef.current[index] !== dep;
      return {
        name: depNames[index] || `dep${index}`,
        changed: hasChanged,
        previous: prevDepsRef.current[index],
        current: dep
      };
    }).filter(dep => dep.changed);
    
    if (changedDeps.length > 0) {
      Logger.debug('Dependencies changed:', changedDeps);
    }
    
    prevDepsRef.current = deps;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export {
  useSmartMemo,
  usePersistentMemo,
  useSmartCallback,
  useRenderCount,
  useWhatChanged
};

export default useSmartMemo;