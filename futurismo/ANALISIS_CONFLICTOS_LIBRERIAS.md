# ANÁLISIS EXHAUSTIVO DE CONFLICTOS ENTRE LIBRERÍAS - PROYECTO FUTURISMO

## RESUMEN EJECUTIVO

He realizado un análisis EXTREMADAMENTE EXHAUSTIVO del proyecto Futurismo y he identificado los siguientes conflictos críticos entre librerías:

## 1. CONFLICTOS CRÍTICOS IDENTIFICADOS

### 1.1 ERROR EN Dashboard.jsx - USO INCORRECTO DE ChartBarIcon COMO COMPONENTE DE GRÁFICO
**Archivos afectados**: 
- `/src/pages/Dashboard.jsx` (líneas 201, 217, 230, 246)

**Problema**: Se está usando `ChartBarIcon` de `@heroicons/react` como si fuera el componente `BarChart` de `recharts`.

**Síntomas**:
- Los gráficos de barras no se renderizan correctamente
- ChartBarIcon es un ícono SVG, no un componente de gráfico
- Se está pasando `data`, `CartesianGrid`, `XAxis`, etc. a un ícono

**Impacto**: Los gráficos de "Reservas por Mes" y "Turistas por Mes" no funcionan.

### 1.2 CONFLICTO DE VERSIONES - React 18.3.1 con librerías legacy
**Librerías afectadas**:
- `react-image-gallery@1.3.0` - Última actualización hace 2 años, puede tener problemas con React 18
- `react-datepicker@7.3.0` - Potencial conflicto con `date-fns@3.6.0`

**Síntomas**:
- Warnings de deprecación suprimidos en `main.jsx` (líneas 12-24)
- El código suprime específicamente: "Support for defaultProps will be removed"

### 1.3 CONFLICTO DE ESTILOS CSS
**Archivos afectados**:
- `/src/styles/globals.css` (líneas 1-4)

**Problema**: Importación directa de CSS de múltiples librerías externas:
```css
@import 'react-datepicker/dist/react-datepicker.css';
@import 'react-loading-skeleton/dist/skeleton.css';
@import 'react-image-gallery/styles/css/image-gallery.css';
```

**Impacto**: 
- Posibles conflictos de especificidad CSS
- Sobrescritura no intencional de estilos de Tailwind
- Personalización limitada de componentes

### 1.4 VULNERABILIDADES DE SEGURIDAD
**Librerías vulnerables identificadas**:
1. `axios@1.7.2` - Vulnerabilidad SSRF (Server-Side Request Forgery) - ALTA
2. `esbuild` (via vite) - Vulnerabilidad de desarrollo - MODERADA
3. `sweetalert2@11.10.5` - Comportamiento potencialmente no deseado
4. `xlsx@0.18.5` - Prototype Pollution y ReDoS - ALTA

### 1.5 DUPLICACIÓN DE FUNCIONALIDAD - ÍCONOS
**Librerías instaladas**:
- `@heroicons/react@2.2.0`
- `lucide-react@0.400.0`

**Problema**: Dos librerías de íconos instaladas pero lucide-react no se usa en ningún archivo.

**Impacto**: 
- Bundle size innecesariamente grande
- Confusión sobre qué librería usar

### 1.6 CONFLICTO POTENCIAL - LIBRERÍAS PDF
**Librerías instaladas**:
- `jspdf@3.0.1`
- `jspdf-autotable@5.0.2`
- `@react-pdf/renderer@3.4.4`

**Archivos que las usan**:
- `/src/services/pdfService.js` - usa jspdf y jspdf-autotable
- `/src/components/assignments/TourAssignmentBrochurePDF.jsx` - usa @react-pdf/renderer

**Problema**: Dos aproximaciones diferentes para generar PDFs en la misma aplicación.

### 1.7 LIBRERÍA INSTALADA PERO NO UTILIZADA
**Librerías sin uso detectado**:
- `framer-motion@11.2.10` - No se encontró ningún import
- `react-image-gallery@1.3.0` - CSS importado pero componente no usado
- `lucide-react@0.400.0` - No se encontró ningún import
- `sweetalert2@11.10.5` y `sweetalert2-react-content@5.0.7` - No se encontró ningún import

### 1.8 WARNINGS DE RECHARTS SUPRIMIDOS
**Archivo**: `/src/main.jsx` (líneas 12-24)

**Problema**: Se está suprimiendo el warning "Support for defaultProps will be removed"

**Causa**: `recharts@2.12.7` usa defaultProps que serán removidos en React 19.

## 2. IMPACTO EN LA APLICACIÓN

### 2.1 Rendimiento
- Bundle size inflado por librerías no utilizadas (~500KB+ extra)
- Carga innecesaria de CSS de múltiples fuentes
- Duplicación de funcionalidad (íconos, notificaciones)

### 2.2 Mantenibilidad
- Deuda técnica por librerías desactualizadas
- Vulnerabilidades de seguridad no resueltas
- Código confuso con componentes mal utilizados

### 2.3 Experiencia de Usuario
- Gráficos rotos en el Dashboard
- Posibles inconsistencias visuales por conflictos CSS
- Performance degradada por bundle size

## 3. ANÁLISIS DE DEPENDENCIAS

### 3.1 Árbol de dependencias React
Todas las librerías están usando React 18.3.1 correctamente (no hay conflictos de versión).

### 3.2 Dependencias problemáticas
```
axios@1.7.2 → Necesita actualización a 1.10.0+
xlsx@0.18.5 → Sin fix disponible, considerar alternativa
sweetalert2@11.10.5 → Downgrade a 11.6.13 o migrar a react-hot-toast
```

## 4. RECOMENDACIONES CRÍTICAS

### 4.1 FIXES INMEDIATOS REQUERIDOS

1. **Dashboard.jsx** - Reemplazar ChartBarIcon por BarChart:
   - Línea 201: `<ChartBarIcon data={monthlyData}>` → `<BarChart data={monthlyData}>`
   - Línea 217: `</ChartBarIcon>` → `</BarChart>`
   - Línea 230: `<ChartBarIcon data={monthlyData}>` → `<BarChart data={monthlyData}>`
   - Línea 246: `</ChartBarIcon>` → `</BarChart>`

2. **Importar BarChart correctamente**:
   - Agregar `BarChart` al import de recharts en línea 10

### 4.2 LIMPIEZA DE DEPENDENCIAS

1. **Remover librerías no utilizadas**:
   ```bash
   npm uninstall framer-motion lucide-react react-image-gallery sweetalert2 sweetalert2-react-content
   ```

2. **Actualizar librerías vulnerables**:
   ```bash
   npm update axios
   ```

3. **Considerar alternativas para xlsx**

### 4.3 CONSOLIDACIÓN DE FUNCIONALIDAD

1. **Elegir UNA librería de íconos**: Mantener solo @heroicons/react
2. **Elegir UN sistema de notificaciones**: Ya están usando react-hot-toast
3. **Estandarizar generación de PDFs**: Elegir entre jspdf o @react-pdf/renderer

## 5. ARCHIVOS NO REVISADOS

Debido a la estructura del proyecto, NO encontré los siguientes elementos mencionados:
- tsconfig.json - No existe (proyecto no usa TypeScript)
- .eslintrc - No existe en la raíz
- .prettierrc - No existe en la raíz
- babel.config.js - No existe en la raíz

## 6. CONCLUSIÓN

El proyecto tiene conflictos CRÍTICOS que afectan directamente la funcionalidad (Dashboard roto) y la seguridad (vulnerabilidades altas). Se requiere acción inmediata para resolver estos problemas.