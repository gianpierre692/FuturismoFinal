# 🛠️ BUENAS PRÁCTICAS - FUTURISMO FRONTEND

## 📋 **HOOKS OPTIMIZADOS IMPLEMENTADOS**

### **1. Logger Inteligente (src/utils/logger.js)**

**✅ USAR:**
```javascript
import Logger from '../utils/logger.js';

// En lugar de console.log
Logger.debug('Usuario logueado', { userId: user.id });
Logger.info('Mapa cargado exitosamente');
Logger.warn('Conexión inestable detectada');
Logger.error('Error crítico', error);

// Logs específicos
Logger.websocket('Conectando a WebSocket...');
Logger.map('Actualizando marcadores');
Logger.performance('Heavy calculation', 120); // 120ms
```

**❌ NO USAR:**
```javascript
// NO - Se mostrará en producción
console.log('Debug info', data);
console.error('Error:', error);
```

### **2. Timer con Cleanup Automático (useTimer)**

**✅ USAR:**
```javascript
import useTimer from '../hooks/useTimer';

const MyComponent = () => {
  const timer = useTimer();
  
  useEffect(() => {
    // Timer se limpia automáticamente al desmontar
    const timeoutId = timer.setTimeout(() => {
      // Lógica aquí
    }, 1000, 'my-timeout');
    
    const intervalId = timer.setInterval(() => {
      // Lógica aquí
    }, 5000, 'my-interval');
    
    // Cleanup manual si es necesario
    return () => {
      timer.clearTimeout(timeoutId);
    };
  }, [timer]);
  
  // Debounce automático
  const debouncedSearch = timer.debounce((query) => {
    searchAPI(query);
  }, 300, 'search');
};
```

**❌ NO USAR:**
```javascript
// NO - Memory leak si el componente se desmonta
useEffect(() => {
  const id = setTimeout(() => {
    // Lógica
  }, 1000);
  // Falta cleanup!
}, []);
```

### **3. Fetch con Abort Controller (useAbortController)**

**✅ USAR:**
```javascript
import useAbortController from '../hooks/useAbortController';

const MyComponent = () => {
  const { abortableFetch } = useAbortController();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await abortableFetch('/api/data', {
          method: 'GET'
        }, 'data-fetch');
        
        if (response) { // null si fue abortado
          const data = await response.json();
          setData(data);
        }
      } catch (error) {
        Logger.error('Fetch failed:', error);
      }
    };
    
    fetchData();
    // Requests se abortan automáticamente al desmontar
  }, [abortableFetch]);
};
```

**❌ NO USAR:**
```javascript
// NO - Request continúa aunque el componente se desmonte
useEffect(() => {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => setData(data)); // Error si componente desmontado
}, []);
```

### **4. Memoización Inteligente (useSmartMemo)**

**✅ USAR:**
```javascript
import { useSmartMemo } from '../hooks/useSmartMemo';

const MyComponent = ({ data, filters }) => {
  // Memoización con debugging
  const expensiveCalculation = useSmartMemo(() => {
    return data.map(item => heavyTransformation(item));
  }, [data], 'expensiveCalculation');
  
  // Detectar qué cambió
  useWhatChanged([data, filters], ['data', 'filters']);
  
  // Contar re-renders
  const renderCount = useRenderCount('MyComponent');
};
```

### **5. HTML Seguro (SafeHtml)**

**✅ USAR:**
```javascript
import SafeHtml from '../components/common/SafeHtml';

// En lugar de dangerouslySetInnerHTML
<SafeHtml 
  html={userContent} 
  className="content"
  fallback={<p>No content available</p>}
/>

// Hook para otros casos
const { sanitizedHtml } = useSanitizedHtml(rawHtml);
```

**❌ NO USAR:**
```javascript
// NO - Vulnerable a XSS
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

## 🎯 **PATRONES DE USO RECOMENDADOS**

### **Componente con Todas las Optimizaciones:**

```javascript
import { useState, useEffect, useCallback, memo } from 'react';
import useTimer from '../hooks/useTimer';
import useAbortController from '../hooks/useAbortController';
import { useSmartMemo, useRenderCount } from '../hooks/useSmartMemo';
import Logger from '../utils/logger';

const OptimizedComponent = memo(({ data, onUpdate }) => {
  // Debug renders
  const renderCount = useRenderCount('OptimizedComponent');
  
  // Hooks optimizados  
  const timer = useTimer();
  const { abortableFetch } = useAbortController();
  
  const [loading, setLoading] = useState(false);
  
  // Memoización inteligente
  const processedData = useSmartMemo(() => {
    return data.map(item => expensiveTransformation(item));
  }, [data], 'processedData');
  
  // Callback estable
  const handleUpdate = useCallback(async (id) => {
    setLoading(true);
    
    try {
      const response = await abortableFetch(`/api/update/${id}`, {
        method: 'POST'
      }, `update-${id}`);
      
      if (response && response.ok) {
        const result = await response.json();
        onUpdate(result);
        Logger.info('Update successful', { id });
      }
    } catch (error) {
      Logger.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  }, [abortableFetch, onUpdate]);
  
  // Timer con cleanup
  useEffect(() => {
    const intervalId = timer.setInterval(() => {
      Logger.debug('Periodic check');
    }, 30000, 'periodic-check');
    
    return () => timer.clearInterval(intervalId);
  }, [timer]);
  
  if (renderCount > 20) {
    Logger.warn(`Component re-rendered ${renderCount} times`);
  }
  
  return (
    <div>
      {/* Contenido del componente */}
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});

export default OptimizedComponent;
```

## 📊 **MIGRACIÓN PASO A PASO**

### **1. Reemplazar Console Logs:**
```bash
# Buscar todos los console.log
grep -r "console\." src/

# Reemplazar gradualmente con Logger
# console.log → Logger.debug
# console.warn → Logger.warn  
# console.error → Logger.error
```

### **2. Agregar Cleanup de Timers:**
```javascript
// ANTES
useEffect(() => {
  const id = setTimeout(() => {}, 1000);
}, []);

// DESPUÉS  
const timer = useTimer();
useEffect(() => {
  const id = timer.setTimeout(() => {}, 1000, 'my-timer');
}, [timer]);
```

### **3. Optimizar Fetch Requests:**
```javascript
// ANTES
useEffect(() => {
  fetch('/api/data').then(setData);
}, []);

// DESPUÉS
const { abortableFetch } = useAbortController();
useEffect(() => {
  abortableFetch('/api/data').then(response => {
    if (response) return response.json();
  }).then(data => data && setData(data));
}, [abortableFetch]);
```

### **4. Agregar Memoización Inteligente:**
```javascript
// ANTES
const expensiveCalc = data.map(heavyTransform);

// DESPUÉS
const expensiveCalc = useSmartMemo(() => 
  data.map(heavyTransform), [data], 'expensiveCalc'
);
```

## ✅ **CHECKLIST DE MIGRACIÓN**

Para cada componente:

- [ ] Reemplazar console.log con Logger
- [ ] Usar useTimer para setTimeout/setInterval
- [ ] Usar useAbortController para fetch
- [ ] Agregar useSmartMemo para cálculos costosos
- [ ] Reemplazar dangerouslySetInnerHTML con SafeHtml
- [ ] Verificar dependencies de useEffect/useCallback
- [ ] Agregar useRenderCount para debug

## 🎯 **RESULTADO ESPERADO**

Después de migrar:

- ✅ **0 console logs en producción**
- ✅ **0 memory leaks por timers**
- ✅ **0 fetch requests huérfanos**
- ✅ **Performance optimizada**
- ✅ **HTML seguro contra XSS**
- ✅ **Dependencies correctas**

**¡Frontend Production-Ready al 100%! 🚀**