# 🚀 PLAN RÁPIDO DE REFACTORIZACIÓN

## 🎯 Top 10 - Qué Refactorizar Primero (Máximo Impacto)

### 1. **Unificar los 5 LiveMaps → 1 LiveMap** (2 días)
```javascript
// ANTES: 5 archivos separados
// DESPUÉS: 
<LiveMap 
  strategy="resilient" // o "simple", "cdn", "unified"
  showControls={true}
  markers={tourMarkers}
/>
```

### 2. **Unificar Dashboard Desktop/Mobile** (1 día)
```javascript
// ANTES: 4 archivos
// DESPUÉS: 1 archivo responsive
const Dashboard = () => {
  const { isMobile } = useMediaQuery('(max-width: 768px)');
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};
```

### 3. **Eliminar Credenciales del Código** (30 min)
```javascript
// Mover todo a .env.local
VITE_DEV_ADMIN_EMAIL=admin@futurismo.com
VITE_DEV_ADMIN_PASS=admin123
```

### 4. **Crear Hook useApi** (1 día)
```javascript
// Centralizar todas las llamadas API
const { data, loading, error } = useApi('/reservations', {
  method: 'GET',
  params: filters
});
```

### 5. **Reorganizar Estructura de Páginas** (2 horas)
```
pages/
├── admin/      # Todo lo de admin aquí
├── agency/     # Todo lo de agencia aquí
├── guide/      # Todo lo de guías aquí
└── shared/     # Páginas compartidas
```

### 6. **Implementar Sistema de Errores Global** (4 horas)
```javascript
// Un solo ErrorBoundary en App.jsx
<ErrorBoundary fallback={<ErrorPage />}>
  <Routes>...</Routes>
</ErrorBoundary>
```

### 7. **Crear Componentes Base** (1 día)
```javascript
// components/ui/
- Button.jsx      // Todos los botones
- Input.jsx       // Todos los inputs
- Card.jsx        // Todas las tarjetas
- Table.jsx       // Todas las tablas
```

### 8. **Limpiar Imports y Exports** (2 horas)
```javascript
// Crear archivos index.js en cada carpeta
// components/common/index.js
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// Usar así:
import { Button, Input, Card } from '@/components/common';
```

### 9. **Unificar Validaciones** (4 horas)
```javascript
// utils/validations/index.js
export const validationSchemas = {
  login: loginSchema,
  reservation: reservationSchema,
  user: userSchema
};

// Usar en cualquier lugar:
import { validationSchemas } from '@/utils/validations';
```

### 10. **Eliminar Código Muerto** (2 horas)
```bash
# Script para encontrar archivos no usados
npx unimported

# O manualmente buscar:
- Componentes no importados
- Funciones comentadas
- TODOs antiguos
```

## 📋 Orden de Ejecución Recomendado

### **Semana 1: Alto Impacto**
1. ✅ Eliminar credenciales (30 min)
2. ✅ Unificar LiveMaps (2 días)
3. ✅ Reorganizar páginas (2 horas)
4. ✅ Unificar Dashboard (1 día)

### **Semana 2: Arquitectura**
5. ✅ Crear componentes base (1 día)
6. ✅ Implementar useApi hook (1 día)
7. ✅ Sistema de errores global (4 horas)
8. ✅ Limpiar imports (2 horas)

### **Semana 3: Limpieza**
9. ✅ Unificar validaciones (4 horas)
10. ✅ Eliminar código muerto (2 horas)
11. ✅ Documentar cambios
12. ✅ Actualizar CLAUDE.md

## 🛠️ Comandos Útiles

```bash
# Encontrar archivos duplicados
find . -name "*.jsx" | grep -E "(Mobile|Desktop|Simple)" | sort

# Buscar console.logs
grep -r "console.log" src/

# Encontrar TODOs
grep -r "TODO" src/

# Analizar bundle size
npm run build -- --analyze

# Formatear todo el código
npm run format

# Encontrar archivos no usados
npx unimported
```

## ⚡ Quick Wins (Hacer HOY)

1. **Instalar herramientas** (10 min)
```bash
npm install -D @trivago/prettier-plugin-sort-imports
```

2. **Configurar aliases** (20 min)
```javascript
// vite.config.js
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@pages': '/src/pages',
    '@utils': '/src/utils',
    '@hooks': '/src/hooks',
    '@services': '/src/services',
    '@stores': '/src/stores'
  }
}
```

3. **Crear .prettierrc** (5 min)
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "importOrder": ["^@/", "^[./]"],
  "importOrderSeparation": true
}
```

4. **Actualizar ESLint** (10 min)
```json
{
  "rules": {
    "no-console": "error",
    "no-unused-vars": "error",
    "react/prop-types": "error"
  }
}
```

## 🎉 Resultado Final

- **50% menos archivos**
- **Código 3x más mantenible**
- **0 duplicación**
- **100% más confianza al deployar**

---

💡 **Consejo**: Empieza con los LiveMaps. Es lo más visible y te dará momentum para seguir.