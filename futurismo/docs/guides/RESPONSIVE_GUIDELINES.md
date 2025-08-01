# Guía de Diseño Responsive - Futurismo

## 📱 Breakpoints

Utilizamos los breakpoints estándar de Tailwind CSS:

- **Mobile**: < 640px
- **sm (Tablet)**: ≥ 640px
- **md (Tablet landscape)**: ≥ 768px
- **lg (Desktop)**: ≥ 1024px
- **xl (Desktop large)**: ≥ 1280px
- **2xl (Desktop extra large)**: ≥ 1536px

## 🎯 Principios de Diseño

### 1. Mobile First
Siempre diseñar primero para móvil y luego escalar:
```jsx
// ✅ Correcto
<div className="text-sm md:text-base lg:text-lg">

// ❌ Incorrecto
<div className="text-lg max-md:text-sm">
```

### 2. Touch Targets
Elementos interactivos mínimo 44x44px:
```jsx
<button className="min-h-[44px] min-w-[44px] p-3">
```

### 3. Contenido Adaptativo
```jsx
// Ocultar/mostrar según dispositivo
<span className="hidden sm:inline">Texto largo para desktop</span>
<span className="sm:hidden">Corto</span>
```

## 🛠️ Componentes Responsive

### Navegación
```jsx
// Mobile: Menú hamburguesa
// Desktop: Sidebar visible
<button onClick={toggleMenu} className="lg:hidden">
  <Bars3Icon />
</button>
```

### Tablas
En móvil convertir a cards:
```jsx
// Desktop: tabla
<table className="hidden sm:table">

// Mobile: cards
<div className="sm:hidden space-y-3">
  {data.map(item => <Card />)}
</div>
```

### Formularios
```jsx
// Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <input className="w-full" />
  <input className="w-full" />
</div>
```

### Modales
```jsx
// Móvil: pantalla completa
// Desktop: centrado con max-width
<div className="fixed inset-0 sm:inset-auto sm:max-w-lg">
```

## 📐 Espaciado Responsive

### Padding/Margin
```jsx
// Escalado progresivo
p-4 sm:p-6 lg:p-8
m-2 sm:m-4 lg:m-6

// Spacing entre elementos
gap-4 sm:gap-6
space-y-4 sm:space-y-6
```

### Tipografía
```jsx
// Títulos
text-2xl sm:text-3xl lg:text-4xl

// Texto normal
text-sm sm:text-base

// Subtítulos
text-xs sm:text-sm
```

## 🖼️ Imágenes y Media

### Imágenes Responsive
```jsx
<img 
  className="w-full h-auto object-cover"
  srcSet="image-mobile.jpg 640w, image-desktop.jpg 1280w"
  sizes="(max-width: 640px) 100vw, 50vw"
/>
```

### Aspect Ratio
```jsx
<div className="aspect-w-16 aspect-h-9">
  <img className="object-cover" />
</div>
```

## 🎨 Utilidades CSS Personalizadas

Hemos creado clases utilitarias en `src/styles/responsive.css`:

```css
.container-responsive    // Container con padding responsive
.text-responsive-lg      // Texto que escala
.grid-responsive-3       // Grid de 1-2-3 columnas
.card-responsive         // Card con padding responsive
.btn-responsive          // Botón con tamaño responsive
```

## 📋 Checklist de Desarrollo

- [ ] Probar en dispositivos reales (no solo DevTools)
- [ ] Verificar touch targets de 44x44px mínimo
- [ ] Asegurar que el texto sea legible sin zoom
- [ ] Probar orientación portrait y landscape
- [ ] Verificar scroll horizontal (no debe existir)
- [ ] Optimizar imágenes para diferentes resoluciones
- [ ] Probar con conexiones lentas (3G)
- [ ] Verificar contraste de colores
- [ ] Asegurar que funcione sin JavaScript
- [ ] Probar con lectores de pantalla

## 🔧 Herramientas de Testing

1. **Chrome DevTools** - Device Mode
2. **Firefox Responsive Design Mode**
3. **BrowserStack** - Dispositivos reales
4. **Lighthouse** - Auditoría de performance
5. **Wave** - Accesibilidad

## 💡 Tips y Trucos

### 1. Overflow Hidden en Móvil
```jsx
// Prevenir scroll horizontal
<div className="overflow-x-hidden">
```

### 2. Flexbox vs Grid
- Flexbox para layouts 1D (filas o columnas)
- Grid para layouts 2D complejos

### 3. Viewport Units con Cuidado
```css
/* Considerar el viewport dinámico en móviles */
height: 100vh; /* Puede causar problemas */
height: 100dvh; /* Mejor opción */
```

### 4. Performance en Móvil
- Lazy loading para imágenes
- Code splitting por rutas
- Minimizar JavaScript
- Optimizar animaciones

## 📱 Patrones Comunes

### Header Sticky
```jsx
<header className="sticky top-0 z-50 bg-white">
```

### Bottom Navigation (Mobile)
```jsx
<nav className="fixed bottom-0 left-0 right-0 sm:hidden">
```

### Drawer Menu
```jsx
<div className={`
  fixed inset-y-0 left-0 z-50
  transform ${open ? 'translate-x-0' : '-translate-x-full'}
  transition-transform duration-300
  lg:relative lg:translate-x-0
`}>
```

## 🚀 Optimizaciones

1. **Reducir JavaScript en Móvil**
   - Usar CSS para animaciones simples
   - Evitar librerías pesadas

2. **Imágenes Optimizadas**
   - WebP con fallback
   - Lazy loading nativo
   - Srcset para diferentes resoluciones

3. **Fonts Optimizados**
   - Subset de caracteres
   - Font-display: swap
   - Preload de fonts críticos

4. **CSS Crítico**
   - Inline CSS crítico
   - Defer CSS no crítico
   - Purge CSS no utilizado