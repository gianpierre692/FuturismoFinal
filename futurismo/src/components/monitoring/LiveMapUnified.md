# LiveMapUnified - Documentación

## Descripción
`LiveMapUnified` es el componente unificado para todos los mapas en tiempo real del sistema. Reemplaza las 5 implementaciones anteriores con un solo componente configurable.

## Uso

```jsx
import LiveMapUnified from '@/components/monitoring/LiveMapUnified';

// Modo simple (sin librerías externas, ideal para móviles)
<LiveMapUnified 
  mode="simple"
  updateInterval={5000}
  showSidebar={false}
  height="h-full"
/>

// Modo CDN (carga Leaflet desde CDN, buena performance)
<LiveMapUnified 
  mode="cdn"
  updateInterval={5000}
  showSidebar={true}
  height="h-[600px]"
/>

// Modo NPM (usa React Leaflet instalado)
<LiveMapUnified 
  mode="npm"
  updateInterval={30000}
  showSidebar={true}
  filters={{ status: 'active' }}
  onServiceSelect={handleServiceSelect}
/>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| mode | `'simple' \| 'cdn' \| 'npm'` | `'cdn'` | Modo de renderizado del mapa |
| filters | `object` | `{}` | Filtros para servicios (status, search) |
| onServiceSelect | `function` | - | Callback cuando se selecciona un servicio |
| updateInterval | `number` | `30000` | Intervalo de actualización en ms |
| showSidebar | `boolean` | `true` | Mostrar/ocultar panel lateral |
| height | `string` | `'h-[600px]'` | Clase Tailwind para altura |

## Modos

### Simple (`mode="simple"`)
- Sin dependencias externas
- Mapa simulado con HTML/CSS
- Ideal para dispositivos móviles
- Menor consumo de recursos

### CDN (`mode="cdn"`)
- Carga Leaflet desde CDN
- Balance entre funcionalidad y performance
- Recomendado para la mayoría de casos

### NPM (`mode="npm"`)
- Usa React Leaflet instalado
- Todas las funcionalidades
- Mayor consumo de recursos

## Migración

Si tenías código usando los componentes antiguos:

```jsx
// Antes
import LiveMapResilient from '../components/monitoring/LiveMapResilient';
<LiveMapResilient 
  enableOfflineCache={true}
  showHealthStatus={true}
/>

// Ahora
import LiveMapUnified from '../components/monitoring/LiveMapUnified';
<LiveMapUnified 
  mode="cdn"
  // Las props antiguas ya no son necesarias
/>
```

## Componentes Eliminados
- `LiveMap.jsx`
- `LiveMapCDN.jsx`
- `LiveMapResilient.jsx`
- `LiveMapSimple.jsx`

Todos han sido unificados en `LiveMapUnified.jsx`.