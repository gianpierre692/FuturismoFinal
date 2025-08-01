🧭 1. Inicio de Sesión y Rol Asignado
Actor: Todos
Lógica:

Usuario accede a la plataforma.

Se autentica (JWT + Refresh Token).

Según el rol (Administrador, Agencia, Guía), se le redirige al dashboard correspondiente.

🧳 2. Exploración y Reserva de Servicios
Actor: Agencia
Lógica:

Explora servicios turísticos disponibles (por tipo, fecha, disponibilidad).

Selecciona uno (Regular, Full Day, Transfer, o Paquete).

Inicia wizard de reserva:

Paso 1: Selección del servicio.

Paso 2: Ingreso de detalles de turistas.

Paso 3: Confirmación y pago.

Recibe voucher digital.

Se asigna automáticamente un guía o se elige del marketplace.

🛰️ 3. Monitoreo de Tours Activos
Actor: Agencia, Administrador
Lógica:

Acceden al mapa en tiempo real (Leaflet).

Observan:

Posición GPS del guía.

Ruta trazada.

Estado del tour (iniciado, pausado, finalizado).

Pueden interactuar vía chat o recibir alertas de emergencia.

🎯 4. Operación del Guía (Planta o Freelance)
Actor: Guía
Lógica:

Inicia sesión y ve su agenda.

Confirma disponibilidad.

Durante un tour:

Activa GPS en la app.

Recibe detalles del grupo.

Envía actualizaciones en vivo.

En caso de emergencia, activa protocolo y notificaciones.

🧑‍💻 5. Contratación de Guías Freelance
Actor: Agencia
Lógica:

Accede al marketplace.

Filtra por idioma, especialidad, ubicación.

Revisa perfiles (certificados, fotos, calificaciones).

Verifica disponibilidad.

Envía solicitud.

Coordina vía chat.

💬 6. Comunicación en Tiempo Real
Actor: Todos
Lógica:

Cada actor tiene su lista de contactos habilitados.

Envían mensajes, ubicaciones, archivos.

Reciben notificaciones push.

Todo con historial y logs seguros.

🛟 7. Emergencias
Actor: Guía, Agencia, Admin
Lógica:

Desde el tour o chat, se activa una alerta.

Se notifica a los actores correspondientes.

Se muestran recursos y contactos por zona.

Admin puede visualizar todas las alertas centralizadas.

💰 8. Sistema de Puntos y Recompensas
Actor: Agencia
Lógica:

Por cada reserva confirmada, se acumulan puntos.

Los puntos son canjeables por beneficios.

Existen niveles de membresía según acumulación.

📈 9. Dashboard y Análisis
Actor: Todos
Lógica:

Cada actor ve datos personalizados:

Tours activos, ingresos, puntualidad, etc.

Visualizaciones en tiempo real (Recharts).

Comparativas mensuales.

🧠 10. Administración y Gestión
Actor: Administrador
Lógica:

Gestiona:

Usuarios y roles.

Tours y servicios.

Guías y agencias.

Accede a reportes, estadísticas globales y estados del sistema.

🔁 11. Resiliencia del Sistema
Actor: Sistema (automático)
Lógica:

Si se pierde conexión:

Se activa cache offline.

Reconexión automática de WebSockets.

Validaciones de datos:

En frontend, backend y durante respuesta de APIs.