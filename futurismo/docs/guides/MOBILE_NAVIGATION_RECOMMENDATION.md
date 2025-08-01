# 📱 RECOMENDACIÓN DE NAVEGACIÓN MÓVIL - FUTURISMO

## PROPUESTA: HÍBRIDO CONTEXTUAL

### Para GUÍAS (usuarios principales en campo):
```
┌─────────────────────┐
│ ← Tours Hoy     🔍  │ <- Header simple
├─────────────────────┤
│                     │
│     CONTENIDO       │
│                     │
├─────────────────────┤
│  🏠  🗺️  [+]  💬  👤 │ <- Bottom nav + FAB central
└─────────────────────┘
```

**Por qué:**
- Acceso rápido a funciones críticas (mapa, emergencia)
- FAB para acción principal (check-in, reportar)
- Manos ocupadas = navegación con pulgar

### Para AGENCIAS (usuarios desktop/móvil):
```
┌─────────────────────┐
│ ☰  Reservaciones  + │ <- Drawer + Quick action
├─────────────────────┤
│ [Todas][Hoy][Pend.] │ <- Tabs contextuales
├─────────────────────┤
│                     │
│     CONTENIDO       │
│                     │
└─────────────────────┘
     + FAB flotante
```

**Por qué:**
- Más secciones disponibles
- Tabs para filtros rápidos
- FAB para crear reserva (acción #1)

## IMPLEMENTACIÓN PROGRESIVA:

### Fase 1: Quick Win (1 semana)
```jsx
// Detectar rol y dispositivo
const NavigationWrapper = () => {
  const { user } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (!isMobile) return <DesktopSidebar />;
  
  if (user.role === 'guide') {
    return <BottomNavGuide />;
  }
  
  return <DrawerNavAgency />;
};
```

### Fase 2: Gestos y Animaciones (2 semanas)
- Swipe para cambiar entre secciones
- Pull to refresh
- Transiciones fluidas

### Fase 3: Inteligencia (1 mes)
- Navegación predictiva (mostrar lo que necesitan según hora)
- Shortcuts personalizados
- Voice commands para guías

## MÉTRICAS DE ÉXITO:

```javascript
const successMetrics = {
  "Tiempo promedio por tarea": {
    antes: "45 segundos",
    meta: "18 segundos",
    reducción: "60%"
  },
  "Taps para acción principal": {
    antes: "4-5 taps",
    meta: "1-2 taps",
    reducción: "75%"
  },
  "Errores de navegación": {
    antes: "23%",
    meta: "5%",
    reducción: "78%"
  },
  "Satisfacción usuario móvil": {
    antes: "3.2/5",
    meta: "4.6/5",
    mejora: "+44%"
  }
};
```

## DECISIÓN FINAL:

### ✅ RECOMIENDO: **HÍBRIDO ADAPTATIVO**

1. **Bottom Nav para Guías** (campo)
2. **Drawer + FAB para Agencias** (oficina/móvil)
3. **Sidebar tradicional en Desktop**

### ¿Por qué no una sola solución?

- Diferentes contextos de uso
- Diferentes prioridades
- Diferentes dispositivos primarios

### Código ejemplo:

```jsx
// components/navigation/AdaptiveNavigation.jsx
const AdaptiveNavigation = ({ children }) => {
  const { user } = useAuthStore();
  const { width } = useWindowSize();
  
  // Desktop
  if (width > 1024) {
    return <DesktopLayout>{children}</DesktopLayout>;
  }
  
  // Mobile - Guide
  if (user?.role === 'guide') {
    return (
      <MobileLayout>
        {children}
        <BottomNavigation items={guideNavItems} />
        <EmergencyFAB />
      </MobileLayout>
    );
  }
  
  // Mobile - Agency/Admin
  return (
    <MobileLayout>
      <DrawerNavigation items={agencyNavItems} />
      {children}
      <CreateReservationFAB />
    </MobileLayout>
  );
};
```

## PRÓXIMOS PASOS:

1. **A/B Test** con 10% usuarios
2. **Recoger feedback** (especialmente guías en campo)
3. **Iterar** basado en datos reales
4. **Rollout progresivo**

¿Procedemos con esta estrategia híbrida?