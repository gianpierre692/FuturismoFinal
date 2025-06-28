# PLAN DE TRABAJO - RESOLUCIÓN DE CONFLICTOS DE LIBRERÍAS
## Proyecto: FUTURISMO

### 📋 RESUMEN EJECUTIVO
Este plan detalla la estrategia para resolver todos los conflictos identificados entre librerías, organizados en 5 fases prioritarias con estimación de tiempo y riesgo.

---

## 🚨 FASE 1: FIXES CRÍTICOS (1-2 horas)
**Objetivo**: Resolver problemas que rompen funcionalidad y vulnerabilidades de seguridad altas

### 1.1 Corregir Dashboard.jsx - Gráficos Rotos
**Prioridad**: 🔴 CRÍTICA  
**Tiempo estimado**: 15 minutos  
**Archivos afectados**: 
- `src/pages/Dashboard.jsx`

**Acciones**:
```javascript
// Línea 10 - Agregar BarChart al import existente
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Reemplazar en líneas 212, 241, 262:
// DE: <ChartBarIcon data={monthlyData}>
// A:  <BarChart data={monthlyData}>
```

### 1.2 Actualizar axios - Vulnerabilidad SSRF
**Prioridad**: 🔴 CRÍTICA  
**Tiempo estimado**: 10 minutos  
**Comando**:
```bash
npm update axios
# Verificar que se actualice a versión 1.7.7 o superior
```

### 1.3 Reemplazar xlsx - Vulnerabilidades Múltiples
**Prioridad**: 🔴 CRÍTICA  
**Tiempo estimado**: 45 minutos  
**Archivos afectados**:
- `src/services/xlsxService.js`
- Cualquier componente que use Excel

**Opciones**:
1. **Opción A**: Migrar a `exceljs` (más seguro)
   ```bash
   npm uninstall xlsx
   npm install exceljs
   ```
2. **Opción B**: Usar SheetJS CE (versión comunitaria)
   ```bash
   npm uninstall xlsx
   npm install xlsx@https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
   ```

---

## 🧹 FASE 2: LIMPIEZA DE DEPENDENCIAS (30-45 minutos)
**Objetivo**: Eliminar librerías no utilizadas y reducir bundle size

### 2.1 Desinstalar Librerías No Utilizadas
**Prioridad**: 🟡 ALTA  
**Tiempo estimado**: 15 minutos  
**Comando**:
```bash
npm uninstall framer-motion lucide-react react-image-gallery sweetalert2 sweetalert2-react-content
```

**Ahorro esperado**: ~500KB en bundle size

### 2.2 Limpiar imports CSS no utilizados
**Prioridad**: 🟡 ALTA  
**Tiempo estimado**: 20 minutos  
**Archivo**: `src/styles/globals.css`

**Acción**: Eliminar o comentar:
```css
/* @import 'react-image-gallery/styles/css/image-gallery.css'; */
```

**Verificar**: Si se usa react-datepicker y skeleton, mantener esos imports

---

## 🔧 FASE 3: CONSOLIDACIÓN DE FUNCIONALIDAD (1-2 horas)
**Objetivo**: Eliminar duplicación y estandarizar soluciones

### 3.1 Unificar Sistema de Generación PDF
**Prioridad**: 🟠 MEDIA  
**Tiempo estimado**: 1 hora  
**Análisis necesario**:

**Comparación**:
| Característica | jsPDF | @react-pdf/renderer |
|---|---|---|
| Uso actual | `pdfService.js` | `TourAssignmentBrochurePDF.jsx` |
| Tamaño | ~400KB | ~1.2MB |
| Complejidad | Simple, imperativo | Complejo, declarativo |
| Recomendación | Para reportes simples | Para documentos complejos |

**Decisión sugerida**: 
- Si solo necesitan reportes tabulares → Mantener solo jsPDF
- Si necesitan layouts complejos → Mantener solo @react-pdf/renderer

### 3.2 Limpiar Imports No Utilizados
**Prioridad**: 🟠 MEDIA  
**Tiempo estimado**: 30 minutos  
**Herramienta sugerida**:
```bash
# Instalar herramienta de análisis
npm install -D eslint-plugin-unused-imports

# Configurar y ejecutar
```

---

## 🚀 FASE 4: OPTIMIZACIÓN (1 hora)
**Objetivo**: Resolver warnings y optimizar performance

### 4.1 Resolver Warnings de Recharts
**Prioridad**: 🟢 BAJA  
**Tiempo estimado**: 30 minutos  

**Opciones**:
1. **Mantener supresión actual** (main.jsx) hasta migrar a React 19
2. **Actualizar Recharts** cuando lance versión compatible
3. **Crear wrapper components** sin defaultProps

### 4.2 Auditar Bundle Size Final
**Prioridad**: 🟢 BAJA  
**Tiempo estimado**: 30 minutos  
**Comandos**:
```bash
# Analizar bundle
npm run build
npx vite-bundle-visualizer

# Métricas esperadas post-limpieza:
# - Reducción de ~40% en vendor chunk
# - Mejora en tiempo de carga inicial
```

---

## ✅ FASE 5: TESTING Y VALIDACIÓN (2 horas)
**Objetivo**: Verificar que todos los cambios funcionan correctamente

### 5.1 Testing Manual Exhaustivo
**Prioridad**: 🔴 CRÍTICA  
**Tiempo estimado**: 1.5 horas  

**Checklist de Verificación**:
- [ ] Dashboard - Todos los gráficos funcionan
- [ ] Reportes - Generación de Excel funciona
- [ ] PDFs - Todos los documentos se generan
- [ ] Sin errores en consola
- [ ] Performance mejorada
- [ ] Todos los componentes renderizan correctamente

### 5.2 Testing Automatizado
**Prioridad**: 🟡 ALTA  
**Tiempo estimado**: 30 minutos  
```bash
# Si existen tests
npm test

# Verificar build de producción
npm run build
npm run preview
```

---

## 📊 MÉTRICAS DE ÉXITO

### Antes:
- 🔴 Gráficos rotos en Dashboard
- 🔴 3 vulnerabilidades de seguridad altas
- 🟡 Bundle size inflado (~500KB extra)
- 🟡 Duplicación de funcionalidad
- ⚠️ Warnings en consola

### Después:
- ✅ Todos los gráficos funcionando
- ✅ 0 vulnerabilidades de seguridad
- ✅ Bundle size reducido ~40%
- ✅ Una solución por funcionalidad
- ✅ Consola limpia

---

## ⏱️ TIEMPO TOTAL ESTIMADO
- **Mínimo**: 5 horas (solo críticos)
- **Recomendado**: 7-8 horas (plan completo)
- **Con interrupciones**: 2 días

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

1. **DÍA 1 - Mañana** (2-3 horas)
   - FASE 1 completa (Fixes críticos)
   - FASE 2 completa (Limpieza)
   - Testing básico

2. **DÍA 1 - Tarde** (2-3 horas)
   - FASE 3 completa (Consolidación)
   - FASE 4 parcial (Optimización)

3. **DÍA 2 - Mañana** (2 horas)
   - FASE 4 completa
   - FASE 5 completa (Testing exhaustivo)
   - Documentación de cambios

---

## 📝 NOTAS IMPORTANTES

1. **Hacer backup completo antes de empezar**
2. **Trabajar en branch separado** (`fix/library-conflicts`)
3. **Commit después de cada fase** para poder revertir si es necesario
4. **Probar en desarrollo** antes de mergear a main
5. **Documentar decisiones** tomadas durante el proceso

---

## 🚀 COMANDOS RÁPIDOS PARA COPIAR

```bash
# Backup inicial
git checkout -b fix/library-conflicts
git add .
git commit -m "backup: antes de resolver conflictos de librerías"

# Fase 1
npm update axios

# Fase 2
npm uninstall framer-motion lucide-react react-image-gallery sweetalert2 sweetalert2-react-content

# Verificación final
npm run build
npm audit
```