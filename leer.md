PROMPT MEJORADO PARA CREAR FRONTEND EN REACT
Crea un proyecto frontend completo en React para un sistema de gestión turística B2B llamado "Futurismo". Este sistema permite a agencias de viajes monitorear en tiempo real los tours que opera Futurismo y gestionar reservas digitalmente.

CONFIGURACIÓN TÉCNICA:
- Node: 22.14.0
- npm: 10.9.2
- React: 18.3.1
- Vite: 5.4.0
- JavaScript (NO TypeScript)
- TailwindCSS: 3.4.1
- SweetAlert2: 11.10.5
- Zustand: 4.5.0
- Leaflet para mapas
- Chart.js para gráficos
- React Router DOM para navegación
- Axios para peticiones HTTP
- Socket.io-client para tiempo real
- Date-fns para manejo de fechas

ESTRUCTURA DEL PROYECTO:
src/
├── components/
│   ├── common/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── monitoring/
│   │   ├── LiveMap.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── ServiceTimeline.jsx
│   │   └── StatusBadge.jsx
│   ├── reservations/
│   │   ├── ReservationForm.jsx
│   │   ├── DynamicFormFields.jsx
│   │   ├── TouristList.jsx
│   │   └── ServiceSelector.jsx
│   ├── dashboard/
│   │   ├── StatsCard.jsx
│   │   ├── ServiceChart.jsx
│   │   └── RecentActivity.jsx
│   └── chat/
│       ├── ChatWidget.jsx
│       └── MessageList.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Monitoring.jsx
│   ├── Reservations.jsx
│   ├── History.jsx
│   └── Profile.jsx
├── stores/
│   ├── authStore.js
│   ├── servicesStore.js
│   ├── reservationsStore.js
│   └── notificationsStore.js
├── services/
│   ├── api.js
│   ├── websocket.js
│   └── mapService.js
├── utils/
│   ├── constants.js
│   ├── validators.js
│   └── formatters.js
├── styles/
│   └── globals.css
└── App.jsx
CARACTERÍSTICAS PRINCIPALES:

SISTEMA DE MONITOREO EN TIEMPO REAL:


Mapa interactivo con Leaflet mostrando ubicación de guías
Actualización cada 30 segundos vía WebSocket
Estados del servicio con colores: pendiente (gris), en camino (amarillo), en servicio (verde), finalizado (azul)
Vista de tarjetas y vista de mapa conmutable
Timeline visual del progreso del servicio
Búsqueda por código de servicio
Filtros por estado, fecha y tipo de servicio


SISTEMA DE RESERVAS:


Formulario dinámico que cambia según el tipo de servicio seleccionado
Campos: tipo de servicio, fecha, hora, cantidad de turistas
Lista expandible para datos de cada turista (nombre, pasaporte, email)
Validación en tiempo real con mensajes de error
Vista previa antes de enviar
Confirmación con SweetAlert2


DASHBOARD PRINCIPAL:


Cards con estadísticas: servicios activos, completados hoy, próximos
Gráfico de línea con servicios por día (últimos 7 días)
Lista de actividad reciente con actualizaciones en tiempo real
Indicadores de rendimiento (puntualidad, satisfacción estimada)


DISEÑO UI/UX:


Tema claro con colores: primario (#1E40AF), secundario (#F59E0B), éxito (#10B981)
Sidebar colapsable con iconos y tooltips
Header con notificaciones, perfil de agencia y logout
Diseño completamente responsive (mobile-first)
Animaciones suaves con Tailwind transitions
Skeleton loaders mientras carga data
Estados vacíos ilustrados


GESTIÓN DE ESTADO CON ZUSTAND:


authStore: login, logout, token, datos de agencia
servicesStore: servicios activos, histórico, filtros
reservationsStore: formulario, validaciones, envío
notificationsStore: push notifications, contador no leídas


NOTIFICACIONES Y FEEDBACK:


Toast notifications para acciones exitosas/errores
Badge con contador en el header
SweetAlert2 para confirmaciones importantes
Mensajes de error contextuales en formularios


CARACTERÍSTICAS ADICIONALES:


Modo oscuro opcional
Exportar reportes a PDF/Excel
Vista de impresión optimizada
Breadcrumbs para navegación
Paginación en tablas
Búsqueda global en el header

PÁGINAS DETALLADAS:
Login: Formulario con email/contraseña, logo Futurismo, "Recordarme"
Dashboard: Grid 3 columnas stats, gráfico principal, actividad lateral
Monitoring: Mapa 70% pantalla, lista servicios 30%, toggle vista
Reservations: Wizard 3 pasos (servicio → turistas → confirmación)
History: Tabla con filtros avanzados, acciones por fila, modal detalles
Profile: Datos agencia, configuración notificaciones, cambio contraseña
CONSIDERA:

Manejo de errores con try-catch y mensajes user-friendly
Loading states en todas las operaciones asíncronas
Debounce en búsquedas (300ms)
Lazy loading para optimización
PropTypes para validación de props
Comentarios en español para claridad
Datos mock para desarrollo inicial
Variables de entorno para API URLs

Crea este proyecto completo con todas las páginas, componentes y funcionalidades descritas, listo para conectar con un backend REST API.
