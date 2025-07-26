# 🛡️ GUÍA COMPLETA DE VALIDACIÓN - FUTURISMO

## 📋 **SISTEMA IMPLEMENTADO**

El sistema de validación está diseñado con múltiples capas de seguridad:

1. **Frontend Validation** (Inmediata)
2. **Input Sanitization** (Limpieza)
3. **API Response Validation** (Respuestas)
4. **WebSocket Validation** (Tiempo real)
5. **Configuration Validation** (Entorno)

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   USER INPUT    │───▶│   SANITIZATION   │───▶│   VALIDATION    │
│                 │    │                  │    │                 │
│ • Forms         │    │ • XSS Prevention │    │ • Schema Check  │
│ • API Calls     │    │ • SQL Injection  │    │ • Type Check    │
│ • WebSocket     │    │ • Data Cleanup   │    │ • Business Rule │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 📂 **ESTRUCTURA DE ARCHIVOS**

```
src/
├── utils/
│   ├── validation.js          # ✅ Sistema principal de validación
│   ├── inputSanitizer.js      # ✅ Sanitización de entrada
│   ├── apiValidator.js        # ✅ Validación de API responses
│   ├── websocketValidator.js  # ✅ Validación de WebSocket
│   └── configValidator.js     # ✅ Validación de configuración
├── hooks/
│   └── useFormValidation.js   # ✅ Hook para formularios
├── components/
│   └── forms/
│       └── ValidatedTourForm.jsx # ✅ Ejemplo de uso
└── VALIDATION_GUIDE.md        # ✅ Esta guía
```

---

## 🚀 **GUÍA DE USO RÁPIDO**

### **1. Validación de Formularios**

```javascript
import useFormValidation from '../hooks/useFormValidation.js';

const MyForm = () => {
  const {
    formData,
    errors,
    isValid,
    updateField,
    handleSubmit
  } = useFormValidation({}, {
    schemaName: 'tour', // Esquema predefinido
    validateOnChange: true,
    sanitizeOnChange: true
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(async (data) => {
        await saveToAPI(data);
      });
    }}>
      <input
        value={formData.name || ''}
        onChange={(e) => updateField('name', e.target.value)}
      />
      {errors.name && <span>{errors.name[0]}</span>}
    </form>
  );
};
```

### **2. Sanitización de Datos**

```javascript
import InputSanitizer from '../utils/inputSanitizer.js';

// Sanitizar texto
const clean = InputSanitizer.sanitizeText(userInput, {
  maxLength: 100,
  allowHtml: false
});

// Sanitizar email
const email = InputSanitizer.sanitizeEmail(rawEmail);

// Sanitizar objeto completo
const cleanData = InputSanitizer.sanitizeObject(formData, {
  name: { type: 'name' },
  email: { type: 'email' },
  phone: { type: 'phone' }
});
```

### **3. Validación de API**

```javascript
import { validateHttpResponse } from '../utils/apiValidator.js';

const response = await fetch('/api/tours');
const validation = await validateHttpResponse(response, 'tour');

if (validation.isValid) {
  setTours(validation.sanitizedData);
} else {
  console.error('API response invalid:', validation.errors);
}
```

### **4. Validación WebSocket**

```javascript
import webSocketValidator from '../utils/websocketValidator.js';

// Validar mensaje entrante
const result = webSocketValidator.validateIncomingMessage(
  message, 
  clientId,
  { enforceRateLimit: true, sanitize: true }
);

if (result.isValid) {
  processMessage(result.sanitizedData);
} else {
  console.warn('Invalid WebSocket message:', result.errors);
}
```

---

## 🎯 **ESQUEMAS PREDEFINIDOS**

### **Tours**
```javascript
const tourSchema = {
  code: [
    { rule: 'required' },
    { rule: 'custom', validator: tourismValidators.tourCode }
  ],
  name: [
    { rule: 'required' },
    { rule: 'length', min: 3, max: 100 }
  ],
  price: [
    { rule: 'required' },
    { rule: 'custom', validator: tourismValidators.price }
  ],
  // ... más campos
};
```

### **Guías**
```javascript
const guideSchema = {
  name: [
    { rule: 'required' },
    { rule: 'length', min: 2, max: 50 }
  ],
  email: [
    { rule: 'required' },
    { rule: 'custom', validator: tourismValidators.email }
  ],
  dni: [
    { rule: 'required' },
    { rule: 'custom', validator: tourismValidators.dni }
  ]
};
```

---

## 🛠️ **VALIDADORES ESPECÍFICOS**

### **Turismo**
- `tourCode()` - Códigos como TOUR001, MP123456
- `email()` - Emails válidos
- `phoneNumber()` - Teléfonos peruanos (+51987654321)
- `dni()` - DNI peruano con algoritmo de verificación
- `coordinates()` - Coordenadas GPS válidas
- `tourDate()` - Fechas futuras válidas
- `price()` - Precios entre 0 y 10,000
- `groupCapacity()` - Capacidad 1-50 personas

### **Ejemplos de Uso**
```javascript
import { tourismValidators } from '../utils/validation.js';

// Validar código de tour
const codeResult = tourismValidators.tourCode('TOUR001');
// { isValid: true }

// Validar DNI
const dniResult = tourismValidators.dni('12345678');
// { isValid: false, message: 'DNI inválido' }

// Validar coordenadas
const coordsResult = tourismValidators.coordinates({
  lat: -13.5319,
  lng: -71.9675
});
// { isValid: true }
```

---

## 🔒 **CARACTERÍSTICAS DE SEGURIDAD**

### **Sanitización XSS**
```javascript
// ANTES (Peligroso)
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// DESPUÉS (Seguro)
import SafeHtml from '../components/common/SafeHtml';
<SafeHtml html={userContent} />
```

### **Rate Limiting WebSocket**
```javascript
// Límites por tipo de mensaje
const limits = {
  'tour:location-update': 60, // 60 por minuto
  'emergency:alert': 5,       // 5 por minuto
  'default': 100              // General
};
```

### **Detección de Patrones Sospechosos**
- Mensajes repetitivos
- Movimientos imposibles (>200 km/h)
- Timestamps incorrectos
- Contenido malicioso

---

## 📊 **VALIDACIÓN DE CONFIGURACIÓN**

```javascript
import configValidator from '../utils/configValidator.js';

// Validar toda la configuración
const result = configValidator.validateAll();

if (!result.isValid) {
  console.error('Config errors:', result.errors);
}

// Obtener configuración validada
const config = configValidator.getValidatedConfig();

// Verificar características
if (configValidator.isFeatureEnabled('websocket')) {
  initWebSocket();
}
```

---

## 🎨 **COMPONENTES DE EJEMPLO**

### **Formulario Validado Completo**
Ver: `src/components/forms/ValidatedTourForm.jsx`

Características:
- ✅ Validación en tiempo real
- ✅ Sanitización automática
- ✅ Feedback visual
- ✅ Validación asíncrona
- ✅ Estados de campo
- ✅ Manejo de errores

---

## 🚨 **CASOS DE USO CRÍTICOS**

### **1. Creación de Tours**
```javascript
const {
  formData,
  handleSubmit,
  isValid
} = useFormValidation({}, {
  schemaName: 'tour',
  asyncValidators: {
    code: async (code) => {
      const exists = await checkTourCodeExists(code);
      return { isValid: !exists, errors: exists ? ['Código existe'] : [] };
    }
  }
});
```

### **2. Actualización de Ubicación**
```javascript
// WebSocket message validation
const locationUpdate = {
  type: 'tour:location-update',
  payload: {
    tourId: 'TOUR001',
    coordinates: { lat: -13.5319, lng: -71.9675 },
    timestamp: new Date().toISOString()
  }
};

const result = webSocketValidator.validateOutgoingMessage(locationUpdate);
```

### **3. Login Seguro**
```javascript
const {
  formData,
  errors,
  handleSubmit
} = useFormValidation({}, {
  schema: {
    email: [
      { rule: 'required' },
      { rule: 'custom', validator: tourismValidators.email }
    ],
    password: [
      { rule: 'required' },
      { rule: 'length', min: 8 }
    ]
  }
});
```

---

## 📈 **MONITOREO Y DEBUGGING**

### **Stats de Validación**
```javascript
// Estadísticas del validador WebSocket
const stats = webSocketValidator.getStats();
console.log('Validation stats:', stats);

// Estadísticas de configuración
const configStats = configValidator.getConfigStats();
console.log('Config stats:', configStats);
```

### **Logging**
```javascript
import Logger from '../utils/logger.js';

// Los validadores automáticamente logean:
Logger.warn('Validation failed:', errors);
Logger.debug('Suspicious activity detected:', details);
Logger.error('Configuration invalid:', issues);
```

---

## 🎯 **MEJORES PRÁCTICAS**

### **✅ DO (Hacer)**
- Usar esquemas predefinidos cuando sea posible
- Sanitizar SIEMPRE antes de validar
- Validar en el frontend Y backend
- Usar validación asíncrona para verificaciones de servidor
- Implementar rate limiting para WebSocket
- Logging de eventos sospechosos

### **❌ DON'T (No hacer)**
- Confiar solo en validación frontend
- Usar `dangerouslySetInnerHTML` sin sanitizar
- Ignorar errores de validación
- Validar sin sanitizar primero
- Permitir mensajes WebSocket sin límites
- Hardcodear configuración sensible

---

## 🔧 **PERSONALIZACIÓN**

### **Crear Validador Personalizado**
```javascript
import Validator from '../utils/validation.js';

const customValidator = (value) => {
  if (value.startsWith('CUSTOM_')) {
    return { isValid: true };
  }
  return { 
    isValid: false, 
    message: 'Debe empezar con CUSTOM_' 
  };
};

// Usar en esquema
const schema = {
  customField: [
    { rule: 'custom', validator: customValidator }
  ]
};
```

### **Registrar Esquema WebSocket**
```javascript
import { WebSocketValidator } from '../utils/websocketValidator.js';

WebSocketValidator.registerMessageSchema('custom:message', {
  type: { type: 'string', required: true },
  payload: {
    type: 'object',
    required: true,
    properties: {
      customField: { type: 'string', required: true }
    }
  }
});
```

---

## 🎉 **RESULTADO FINAL**

Con este sistema implementado tienes:

- ✅ **Frontend ultra-seguro** contra XSS, injection
- ✅ **Validación robusta** en tiempo real
- ✅ **API responses seguras** y validadas
- ✅ **WebSocket protegido** con rate limiting
- ✅ **Configuración validada** automáticamente
- ✅ **Logging completo** de eventos
- ✅ **Performance optimizada** con debouncing
- ✅ **UX excelente** con feedback visual

**¡Frontend production-ready al 100%! 🚀**