# Futurismo - Sistema de Gestión Turística B2B

Sistema de gestión turística B2B desarrollado con React, Vite y TailwindCSS.

## Características Principales

- 🗺️ **Monitoreo en Tiempo Real**: Visualización de tours activos con mapas interactivos usando Leaflet
- 📅 **Sistema de Reservas**: Wizard de 3 pasos para crear reservas de forma intuitiva
- 📊 **Dashboard Analítico**: Gráficos y estadísticas con Recharts
- 💬 **Chat en Tiempo Real**: Comunicación instantánea entre agencias y guías
- 🔐 **Autenticación JWT**: Sistema seguro de login con gestión de tokens
- 📱 **Diseño Responsive**: Interfaz adaptable a dispositivos móviles

## Tecnologías Utilizadas

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 5.4.0
- **Estilos**: TailwindCSS 3.4.1
- **Estado**: Zustand 4.5.0
- **Routing**: React Router DOM 6.24.0
- **Mapas**: Leaflet 1.9.4
- **Gráficos**: Recharts 2.12.7
- **WebSocket**: Socket.io-client 4.7.5
- **Formularios**: React Hook Form 7.52.0 + Yup
- **HTTP**: Axios 1.7.2

## Requisitos Previos

- Node.js 22.14.0 o superior
- npm 10.0.0 o superior

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd futurismo
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

## Ejecución

### Modo desarrollo:
```bash
npm run dev
# o
npm start
```

### Compilar para producción:
```bash
npm run build
```

### Vista previa de producción:
```bash
npm run preview
```

## Estructura del Proyecto

```
futurismo/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── auth/       # Componentes de autenticación
│   │   ├── chat/       # Sistema de chat
│   │   ├── common/     # Componentes comunes
│   │   ├── dashboard/  # Componentes del dashboard
│   │   ├── monitoring/ # Componentes de monitoreo
│   │   └── reservations/ # Componentes de reservas
│   ├── data/           # Datos mock para desarrollo
│   ├── pages/          # Páginas principales
│   ├── services/       # Servicios (API, WebSocket, etc)
│   ├── stores/         # Stores de Zustand
│   ├── styles/         # Estilos globales
│   ├── utils/          # Utilidades y helpers
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Punto de entrada
├── .env.example        # Variables de entorno ejemplo
├── package.json        # Dependencias y scripts
├── tailwind.config.js  # Configuración de TailwindCSS
└── vite.config.js      # Configuración de Vite
```

## Credenciales de Prueba

Para acceder al sistema en modo desarrollo:

- **Email**: demo@futurismo.com
- **Password**: demo123

## Funcionalidades por Página

### Dashboard
- Estadísticas en tiempo real
- Gráficos de rendimiento
- Actividad reciente
- Acciones rápidas

### Monitoreo
- Mapa interactivo con tours activos
- Tracking de guías en tiempo real
- Progreso de tours
- Información detallada de cada servicio

### Reservas
- Wizard de 3 pasos para nuevas reservas
- Lista de reservas con filtros
- Gestión de estados
- Generación de vouchers

### Chat
- Conversaciones con guías y clientes
- Mensajes en tiempo real
- Compartir ubicaciones y archivos
- Historial de conversaciones

### Historial
- Registro completo de servicios
- Filtros avanzados
- Exportación de datos

### Perfil
- Configuración de cuenta
- Preferencias de notificaciones

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run dev` - Alias de npm start
- `npm run build` - Compila para producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Ejecuta el linter (si está configurado)

## Solución de Problemas

### Error de módulos al iniciar

Si encuentras errores relacionados con módulos faltantes:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto en uso

Si el puerto 3000 está en uso, Vite automáticamente usará el siguiente disponible (3001, 3002, etc).

## Colores del Tema

- **Primary**: #1E40AF (Azul)
- **Secondary**: #F59E0B (Naranja)
- **Success**: #10B981 (Verde)

## Notas de Desarrollo

- El proyecto incluye datos mock para facilitar el desarrollo
- Las conexiones WebSocket están configuradas para reconectarse automáticamente
- El estado de autenticación persiste en localStorage
- Los tokens JWT se validan automáticamente al cargar la aplicación

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es propiedad de Futurismo. Todos los derechos reservados.

---

🚀 Desarrollado con ❤️ por el equipo de Futurismo