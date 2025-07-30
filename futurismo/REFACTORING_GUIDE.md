# 🔧 GUÍA DE REFACTORIZACIÓN - FUTURISMO FRONTEND

## 📋 Resumen Ejecutivo

Este documento detalla el plan completo para refactorizar el código frontend de Futurismo hacia un código más limpio, mantenible y escalable.

## 🎯 Objetivos

1. **Eliminar duplicación** de componentes y páginas
2. **Unificar patrones** de desarrollo
3. **Mejorar estructura** de carpetas
4. **Establecer estándares** claros
5. **Reducir deuda técnica** acumulada

## 🔍 Problemas Identificados

### 1. Componentes Duplicados
```
❌ ACTUAL                          ✅ OBJETIVO
LiveMap.jsx                        LiveMap.jsx (unificado)
LiveMapCDN.jsx                     con props: strategy="cdn|resilient|simple"
LiveMapResilient.jsx               
LiveMapSimple.jsx                  
LiveMapUnified.jsx                 
```

### 2. Páginas Desktop/Mobile Separadas
```
❌ ACTUAL                          ✅ OBJETIVO
Dashboard.jsx                      Dashboard.jsx (responsive)
DashboardDesktop.jsx              con hooks useResponsive()
DashboardMobile.jsx               
DashboardSimple.jsx               
```

### 3. Estructura Inconsistente
```
❌ ACTUAL                          ✅ OBJETIVO
pages/                             pages/
├── admin/Reports.jsx              ├── admin/
├── AgencyReports.jsx              │   └── Reports.jsx
├── AgencyReportsMobile.jsx        ├── agency/
└── guide/                         │   └── Reports.jsx
                                   └── guide/
```

## 📂 Nueva Estructura Propuesta

```
src/
├── components/
│   ├── common/              # Componentes reutilizables
│   ├── features/            # Componentes por funcionalidad
│   │   ├── auth/
│   │   ├── reservations/
│   │   ├── monitoring/
│   │   ├── chat/
│   │   └── marketplace/
│   └── layouts/             # Layouts y navegación
│       ├── Layout.jsx
│       ├── Navigation.jsx
│       └── MobileNavigation.jsx
├── pages/
│   ├── admin/
│   ├── agency/
│   ├── guide/
│   └── public/
├── hooks/                   # Custom hooks
│   ├── api/                # Hooks para API calls
│   ├── ui/                 # Hooks de UI
│   └── business/           # Hooks de lógica de negocio
├── services/
├── stores/
├── utils/
└── constants/              # Constantes y configuración
```

## 🚀 Plan de Refactorización (4 Semanas)

### Semana 1: Preparación y Componentes Core

#### Día 1-2: Setup y Estándares
```bash
# 1. Crear archivos de configuración
touch .prettierrc
touch jsconfig.json
touch CODING_STANDARDS.md

# 2. Actualizar ESLint para ser más estricto
npm install -D eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

**Tareas:**
- [ ] Configurar aliases de importación (@components, @pages, etc.)
- [ ] Definir guía de estilo de código
- [ ] Crear componentes base (Button, Input, Card)
- [ ] Implementar sistema de diseño con Tailwind

#### Día 3-5: Unificar Componentes de Mapas
```javascript
// Crear un único LiveMap con estrategias
const LiveMap = ({ strategy = 'default', ...props }) => {
  const strategies = {
    default: DefaultMapStrategy,
    resilient: ResilientMapStrategy,
    simple: SimpleMapStrategy,
    cdn: CDNMapStrategy
  };
  
  const MapComponent = strategies[strategy];
  return <MapComponent {...props} />;
};
```

### Semana 2: Páginas y Responsive Design

#### Día 1-3: Implementar Sistema Responsive
```javascript
// hooks/ui/useResponsive.js
export const useResponsive = () => {
  const [device, setDevice] = useState(getDevice());
  
  useEffect(() => {
    // Listener para cambios de tamaño
  }, []);
  
  return {
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    device
  };
};
```

#### Día 4-5: Unificar Páginas Desktop/Mobile
```javascript
// pages/Dashboard.jsx (unificado)
const Dashboard = () => {
  const { isMobile } = useResponsive();
  
  return (
    <DashboardLayout>
      {isMobile ? <MobileView /> : <DesktopView />}
    </DashboardLayout>
  );
};
```

### Semana 3: Servicios y Estado

#### Día 1-2: Refactorizar Stores
```javascript
// stores/index.js - Crear store centralizado
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set) => ({
        // Combinar stores relacionados
      }),
      { name: 'futurismo-store' }
    )
  )
);
```

#### Día 3-5: Crear Capa de Servicios
```javascript
// services/api/reservations.service.js
class ReservationsService {
  async getAll(filters) {
    return api.get('/reservations', { params: filters });
  }
  
  async create(data) {
    return api.post('/reservations', data);
  }
}

export default new ReservationsService();
```

### Semana 4: Testing y Documentación

#### Día 1-3: Implementar Testing Básico
```bash
# Instalar dependencias
npm install -D vitest @testing-library/react @testing-library/user-event

# Crear tests para componentes críticos
src/
├── components/
│   └── features/
│       └── reservations/
│           ├── ReservationWizard.jsx
│           └── ReservationWizard.test.jsx
```

#### Día 4-5: Documentación y Limpieza
- [ ] Actualizar README.md
- [ ] Documentar componentes con JSDoc
- [ ] Eliminar código muerto
- [ ] Actualizar CLAUDE.md

## 🛠️ Tareas Específicas de Refactorización

### 1. Eliminar Credenciales Hardcodeadas
```javascript
// ❌ ANTES
const testCredentials = {
  admin: 'admin@futurismo.com',
  password: 'admin123'
};

// ✅ DESPUÉS
const testCredentials = {
  admin: import.meta.env.VITE_TEST_ADMIN_EMAIL,
  password: import.meta.env.VITE_TEST_ADMIN_PASS
};
```

### 2. Unificar Formularios
```javascript
// Crear un FormBuilder genérico
const FormBuilder = ({ fields, onSubmit, validation }) => {
  // Lógica reutilizable para todos los formularios
};

// Usar en vez de UserForm y UserFormSimple
<FormBuilder 
  fields={userFields}
  validation={userSchema}
  onSubmit={handleSubmit}
/>
```

### 3. Implementar Lazy Loading Consistente
```javascript
// utils/lazyImport.js
export const lazyImport = (path) => {
  return lazy(() => 
    import(path).catch(() => 
      import('./components/common/ErrorFallback')
    )
  );
};
```

### 4. Crear Sistema de Feature Flags
```javascript
// config/features.js
export const features = {
  USE_NEW_MAP: import.meta.env.VITE_USE_NEW_MAP === 'true',
  ENABLE_CHAT: import.meta.env.VITE_ENABLE_CHAT === 'true',
};

// Uso
{features.USE_NEW_MAP && <NewMapComponent />}
```

## 📊 Métricas de Éxito

### Antes de Refactorización
- 5 versiones de LiveMap
- 4 versiones de Dashboard
- 0% coverage de tests
- ~50 componentes duplicados

### Después de Refactorización
- 1 LiveMap configurable
- 1 Dashboard responsive
- 70% coverage en componentes críticos
- 0 componentes duplicados

## 🚨 Riesgos y Mitigación

1. **Riesgo**: Romper funcionalidad existente
   **Mitigación**: Implementar tests antes de refactorizar

2. **Riesgo**: Merge conflicts con desarrollo activo
   **Mitigación**: Refactorizar por módulos pequeños

3. **Riesgo**: Resistencia del equipo
   **Mitigación**: Involucrar al equipo en decisiones

## ✅ Checklist de Refactorización

### Componentes
- [ ] Unificar LiveMap (5 → 1)
- [ ] Unificar Dashboard (4 → 1)
- [ ] Unificar UserForm (2 → 1)
- [ ] Unificar PDFService (2 → 1)
- [ ] Eliminar componentes no usados

### Estructura
- [ ] Reorganizar páginas por rol
- [ ] Crear carpeta constants
- [ ] Mover hooks a subcarpetas
- [ ] Unificar estructura de features

### Código
- [ ] Eliminar console.logs
- [ ] Eliminar credenciales hardcodeadas
- [ ] Implementar PropTypes o TypeScript
- [ ] Añadir JSDoc a funciones principales

### Testing
- [ ] Configurar Vitest
- [ ] Tests para autenticación
- [ ] Tests para reservas
- [ ] Tests para componentes críticos

### Documentación
- [ ] Actualizar README
- [ ] Crear CONTRIBUTING.md
- [ ] Documentar arquitectura
- [ ] Actualizar CLAUDE.md

## 🎯 Resultado Esperado

Un código base:
- **Mantenible**: Fácil de entender y modificar
- **Escalable**: Preparado para crecer
- **Testeable**: Con cobertura adecuada
- **Documentado**: Auto-explicativo
- **Performante**: Optimizado y eficiente

## 🚀 Comenzar Ahora

```bash
# 1. Crear branch de refactorización
git checkout -b refactor/clean-architecture

# 2. Instalar herramientas
npm install -D @trivago/prettier-plugin-sort-imports

# 3. Comenzar con el componente más crítico
# Recomiendo: LiveMap unificado
```

---

💡 **Nota**: Esta refactorización debe hacerse gradualmente, sin detener el desarrollo de nuevas features. Cada PR debe ser pequeño y enfocado en un área específica.