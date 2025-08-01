# 🎩 ADMINISTRADOR - Casos de Uso Detallados

## 📋 **OVERVIEW**
**Actor Principal**: Administrador del Sistema  
**Rol**: Control total y supervisión de la plataforma B2B  
**Objetivo**: Garantizar operación eficiente, rentable y segura del ecosistema turístico  
**Acceso**: 24/7 con privilegios completos

---

## 🎯 **CASOS DE USO CRÍTICOS (Prioridad 1)**

### **CU-ADM-001: Monitorear Tours Activos en Tiempo Real**

#### **Descripción**: Como administrador, necesito ver TODOS los tours que están sucediendo AHORA MISMO para supervisar operaciones y detectar problemas inmediatamente.

#### **Precondiciones**:
- Usuario autenticado con rol administrador
- Tours activos en el sistema con GPS habilitado
- WebSocket connection establecida para actualizaciones en tiempo real

#### **Flujo Principal**:
1. Admin accede a "Dashboard Operacional"
2. **Vista Principal muestra**:
   ```
   🔴 TOURS ACTIVOS AHORA: 23
   ├── 🟢 Sin problemas: 18 tours
   ├── 🟡 Con alertas: 4 tours  
   └── 🔴 Emergencias: 1 tour
   ```

3. **Mapa en Tiempo Real**:
   - 📍 Ubicación GPS de cada guía activo
   - 🚶‍♂️ Ruta trazada del tour (inicio → progreso → destino)
   - ⏱️ Tiempo transcurrido vs tiempo estimado
   - 👥 Número de turistas en cada grupo
   - 📱 Estado de conexión del guía (online/offline)

4. **Panel de Control Rápido**:
   - ⚠️ **Alertas automáticas** (retrasos >30min, desviación de ruta)
   - 💬 **Chat directo** con cualquier guía activo
   - 📞 **Contacto de emergencia** un clic
   - 🔄 **Refrescar automático** cada 30 segundos

#### **Postcondiciones**:
- Dashboard actualizado en tiempo real
- Alertas críticas enviadas a móvil del admin  
- Log completo de todas las acciones de supervisión

#### **Casos Alternativos**:
- **CU-ADM-001.1**: Si GPS falla → Sistema alerta y requiere check-in manual del guía
- **CU-ADM-001.2**: Si no hay tours activos → Dashboard muestra próximos tours (siguientes 2 horas)

#### **Criterios de Aceptación**:
```gherkin
DADO que hay tours activos en el sistema
CUANDO accedo al Dashboard Operacional
ENTONCES veo todos los tours activos en tiempo real
  Y cada tour muestra ubicación GPS actualizada
  Y veo alertas automáticas de problemas
  Y puedo contactar a cualquier guía directamente
  Y la información se actualiza automáticamente cada 30 segundos
```

---

### **CU-ADM-002: Gestión de Alertas Críticas**

#### **Descripción**: Como administrador, necesito recibir y gestionar alertas de retrasos, cancelaciones y emergencias para tomar acción inmediata.

#### **Precondiciones**:
- Sistema de alertas configurado y funcional
- Notificaciones push habilitadas en dispositivo admin
- Protocolos de emergencia definidos

#### **Flujo Principal**:
1. **Sistema detecta situación crítica** (automático):
   - 🔴 **Emergencia**: Guía presiona botón pánico
   - 🟡 **Retraso**: Tour con >30min de atraso
   - ⚠️ **Cancelación**: Tour cancelado <2 horas antes
   - 📱 **Desconexión**: Guía sin señal >15min

2. **Alerta Inmediata al Admin**:
   ```
   🚨 EMERGENCIA - Tour #1234
   Guía: María González
   Ubicación: Cusco Centro - Plaza San Blas
   Turistas: 6 personas (2 menores)  
   Reporta: "Turista con problema médico"
   ⏰ Hace 2 minutos
   
   [📞 LLAMAR GUÍA] [🚑 PROTOCOLOS] [📋 VER DETALLE]
   ```

3. **Panel de Gestión de Crisis**:
   - 🎯 **Priorizar alertas** por severidad
   - 📋 **Asignar responsables** (admin secundario, coordinador)
   - ⏱️ **Timer de respuesta** (tiempo máximo para resolver)
   - 📝 **Log de acciones** tomadas
   - ✅ **Marcar como resuelto** con resumen

4. **Escalamiento Automático**:
   - Si admin no responde en 5min → Alerta a admin backup
   - Si admin no responde en 15min → Alerta a todos los admins
   - Emergencias médicas → Auto-contactar servicios de emergencia

#### **Postcondiciones**:
- Todas las alertas registradas con timestamp
- Acciones tomadas documentadas  
- Reportes automáticos para análisis posterior
- Feedback enviado a agencias involucradas

#### **Criterios de Aceptación**:
```gherkin
DADO que ocurre una situación crítica en un tour
CUANDO el sistema detecta el problema
ENTONCES recibo alerta inmediata con todos los detalles
  Y puedo tomar acción directa desde la alerta
  Y el sistema escala automáticamente si no respondo
  Y todas las acciones quedan documentadas
```

---

### **CU-ADM-003: Dashboard Financiero - Comisiones y Tendencias**

#### **Descripción**: Como administrador, necesito monitorear la salud financiera del negocio en tiempo real para tomar decisiones estratégicas.

#### **Precondiciones**:
- Datos financieros actualizados en tiempo real
- Integración con sistema de pagos configurada
- Permisos de acceso a información financiera

#### **Flujo Principal**:
1. Admin accede a "Dashboard Financiero"
2. **Métricas Principales (Tiempo Real)**:
   ```
   💰 INGRESOS HOY: $12,450
   ├── Comisiones tours: $8,200 (66%)
   ├── Suscripciones agencias: $2,100 (17%)  
   ├── Comisiones marketplace: $1,950 (16%)
   └── Otros ingresos: $200 (1%)
   
   📊 COMPARACIÓN:
   ├── Ayer: +15% ⬆️
   ├── Semana pasada: +8% ⬆️  
   └── Mes pasado: -3% ⬇️
   ```

3. **Análisis de Tendencias**:
   - 📈 **Gráfico interactivo**: Ingresos últimos 30 días
   - 🎯 **Top Agencias**: Las 10 que más comisiones generan
   - 🌟 **Top Guías**: Los 10 que más tours completan
   - 🗺️ **Top Rutas**: Las 5 más rentables
   - ⏰ **Horarios pico**: Franjas de mayor actividad

4. **Alertas Financieras**:
   - 🔻 **Caída >20%** en ingresos diarios
   - 💳 **Pagos pendientes** >$5,000 por agencia
   - 📉 **Agencias inactivas** >7 días
   - 🎯 **Oportunidades**: Rutas con alta demanda/pocos guías

#### **Postcondiciones**:
- Reportes automáticos generados diariamente
- Alertas financieras configuradas y activas
- Datos exportables para análisis externo

#### **Criterios de Aceptación**:
```gherkin
DADO que accedo al dashboard financiero
CUANDO veo las métricas principales
ENTONCES veo ingresos del día actualizados en tiempo real
  Y puedo comparar con períodos anteriores
  Y recibo alertas automáticas de anomalías financieras
  Y puedo analizar tendencias y oportunidades
```

---

## 🛠️ **CASOS DE USO OPERATIVOS (Prioridad 2)**

### **CU-ADM-004: Gestión de Conflictos Tripartitos**

#### **Descripción**: Como administrador, necesito mediar y resolver conflictos entre agencias ↔ guías ↔ turistas de manera eficiente y justa.

#### **Flujo Principal**:
1. **Conflicto Reportado** (cualquier parte puede iniciar):
   - 📝 **Agencia reporta**: "Guía llegó 45min tarde"
   - 💬 **Guía reporta**: "Agencia cambió itinerario sin avisar"  
   - ⭐ **Turista reporta**: "Servicio no fue como esperaba"

2. **Centro de Resolución de Conflictos**:
   ```
   🔍 CASO #2024-001
   Fecha: 15 Enero 2025
   Tour: Cusco City Tour
   
   👥 INVOLUCRADOS:
   - Agencia: "Andes Explorer" (Rating: 4.2★)
   - Guía: "Carlos Mendoza" (Rating: 4.7★)  
   - Turistas: Familia Johnson (4 personas)
   
   📋 RECLAMO:
   "El guía canceló el tour 1 hora antes por enfermedad,
   pero no propuso alternativa. Perdimos reserva de hotel."
   
   💾 EVIDENCIA:
   - Chat entre agencia y guía
   - GPS del guía (ubicación ese día)
   - Historial de cancelaciones del guía
   ```

3. **Herramientas de Mediación**:
   - 💬 **Chat tripartito** moderado por admin
   - 📊 **Historial completo** de interacciones
   - 🎯 **Política aplicable** automáticamente sugerida
   - 💰 **Calculadora de compensaciones**
   - ⚖️ **Precedentes similares** en el sistema

4. **Resolución y Seguimiento**:
   - ✅ **Acuerdo documentado** con firmas digitales
   - 💳 **Compensaciones automáticas** (si aplica)
   - 📊 **Actualización de ratings** según resolución
   - 📋 **Caso cerrado** con lecciones aprendidas

#### **Criterios de Aceptación**:
```gherkin
DADO que se reporta un conflicto entre las partes
CUANDO accedo al centro de resolución
ENTONCES veo toda la información relevante centralizada
  Y puedo mediar con herramientas de comunicación
  Y puedo aplicar políticas y precedentes
  Y la resolución queda documentada permanentemente
```

---

### **CU-ADM-005: Reasignación Inteligente de Tours Cancelados**

#### **Descripción**: Como administrador, necesito reasignar tours cancelados de último momento para minimizar pérdidas y mantener satisfacción del cliente.

#### **Flujo Principal**:
1. **Cancelación Detectada**:
   ```
   ⚠️ CANCELACIÓN URGENTE
   Tour: Machu Picchu Express
   Fecha: Hoy - 14:00 hrs
   Guía original: María López (enfermedad)
   Afectados: 8 turistas alemanes
   Valor: $1,200
   ```

2. **Sistema de Reasignación Inteligente**:
   - 🔍 **Busca automáticamente** guías disponibles:
     - Misma especialidad (Machu Picchu)
     - Disponibles en horario exacto
     - Idioma alemán (preferible)
     - Rating similar o superior
     - Ubicación cercana (<30min)

3. **Opciones de Reasignación**:
   ```
   🎯 CANDIDATOS ENCONTRADOS:
   
   1. ⭐ Carlos Ruiz (4.8★)
      ✅ Especialista Machu Picchu  
      ✅ Habla alemán fluido
      ✅ Disponible 13:30-18:00
      🚗 A 15min del punto de encuentro
      
   2. 🥈 Ana García (4.6★)  
      ✅ Especialista historia inca
      ⚠️ Alemán básico + inglés fluido
      ✅ Disponible todo el día
      🚗 A 25min del punto de encuentro
   ```

4. **Proceso de Reasignación**:
   - 📱 **Contacto automático** con guía seleccionado
   - ⏱️ **Timer de respuesta**: 10min para confirmar
   - 📨 **Notificación inmediata** a agencia y turistas
   - 💰 **Ajuste automático** de tarifas (si es necesario)
   - 📋 **Documentación completa** del cambio

#### **Criterios de Aceptación**:
```gherkin
DADO que un tour se cancela de último momento
CUANDO busco opciones de reasignación
ENTONCES el sistema me sugiere alternativas automáticamente
  Y puedo contactar y confirmar con guías disponibles
  Y todas las partes son notificadas inmediatamente
  Y el proceso queda completamente documentado
```

---

### **CU-ADM-006: Monitoreo de Guías Inactivos**

#### **Descripción**: Como administrador, necesito identificar qué guías no se han conectado hoy para tomar acciones proactivas antes de que afecten tours programados.

#### **¿Por qué es crítico?**
- Un guía inactivo puede tener tours asignados para hoy
- Detección temprana permite reasignación sin crisis
- Identifica patrones de ausentismo problemático

#### **Precondiciones**:
- Sistema de tracking de actividad funcionando
- Base de datos de guías actualizada
- Horarios laborales definidos por guía

#### **Flujo Principal**:
1. Admin accede a "Guías Inactivos Hoy"
2. **Vista de Control de Presencia**:
   ```
   🔍 GUÍAS INACTIVOS HOY (07:30 AM)
   
   🔴 CRÍTICO - Con tours programados:
   ├── María González (Sin conexión desde ayer 18:45)
   │   └── 📅 Tour 14:00: Cusco City (4 turistas)
   │   └── 📅 Tour 16:30: Machu Picchu (8 turistas)
   │
   ├── Carlos Mendoza (Sin conexión desde 22:15)
   │   └── 📅 Tour 15:00: Valle Sagrado (6 turistas)
   
   🟡 ADVERTENCIA - Sin tours pero inusual:
   ├── Ana López (Normalmente online 08:00, hoy no)
   ├── Luis Paredes (3 días sin conexión)
   
   🟢 NORMAL - Día libre o esperado:
   ├── Pedro Silva (Día libre programado)
   ├── Carmen Torres (Vacaciones hasta 20/01)
   ```

3. **Información Detallada por Guía**:
   - 📱 **Última conexión**: Fecha y hora exacta
   - 📊 **Patrón histórico**: "Normalmente online a las 08:15"
   - 🎯 **Tours en riesgo**: Lista con horarios y número de turistas
   - 📞 **Intentos de contacto**: Log de llamadas/mensajes
   - ⚠️ **Nivel de riesgo**: Crítico/Advertencia/Normal

4. **Acciones Disponibles**:
   - 📱 **Contactar inmediatamente**: Llamada, SMS, WhatsApp
   - 🔄 **Buscar reemplazo**: Sistema de reasignación automática
   - ⏰ **Programar recordatorio**: Si es muy temprano para contactar
   - 📝 **Marcar como contactado**: Para evitar duplicados
   - 🚫 **Reportar como problemático**: Para seguimiento

#### **Postcondiciones**:
- Todos los contactos quedan registrados con timestamp
- Tours en riesgo priorizados para seguimiento
- Alertas escaladas según criticidad

#### **Casos Alternativos**:
- **CU-ADM-006.1**: Si guía responde tarde → Confirmar disponibilidad para tours del día
- **CU-ADM-006.2**: Si guía no responde → Iniciar protocolo de reasignación automática
- **CU-ADM-006.3**: Si es problema recurrente → Crear expediente disciplinario

#### **Criterios de Aceptación**:
```gherkin
DADO que es un día laboral y hay guías registrados
CUANDO accedo al monitor de guías inactivos
ENTONCES veo una lista categorizada por nivel de riesgo
  Y puedo ver qué tours están en peligro por cada guía inactivo
  Y puedo contactar directamente desde la interfaz
  Y el sistema me sugiere acciones basadas en la criticidad
  Y todos mis intentos de contacto quedan registrados
```

---

### **CU-ADM-007: Gestión de Pagos Pendientes de Agencias**

#### **Descripción**: Como administrador, necesito monitorear y gestionar agencias con pagos atrasados para mantener flujo de caja saludable sin dañar relaciones comerciales.

#### **¿Por qué es crítico?**
- El flujo de caja es vital para pagar a guías
- Agencias morosas pueden acumular deudas significativas
- Detección temprana permite negociación antes de escalamiento

#### **Precondiciones**:
- Sistema de facturación integrado y actualizado
- Términos de pago definidos por agencia
- Historial de pagos disponible

#### **Flujo Principal**:
1. Admin accede a "Control de Pagos Pendientes"
2. **Dashboard de Cobranza**:
   ```
   💰 RESUMEN FINANCIERO
   ├── Total por cobrar: $45,670
   ├── Vencido >30 días: $12,400 (27%)
   ├── Vencido >60 días: $8,900 (19%)
   └── Crítico >90 días: $3,200 (7%)
   
   🚨 AGENCIAS EN RIESGO:
   
   🔴 CRÍTICO (Acción inmediata):
   ├── Andes Explorer - $5,670 (94 días vencido)
   │   ├── Última factura: #2024-001 (15 Nov 2024)
   │   ├── Intentos contacto: 8 (último: 5 días)
   │   ├── Tours activos: 12 (valor: $2,800)
   │   └── 🚫 Sugerencia: Suspender nuevas reservas
   │
   ├── Cusco Adventures - $2,890 (87 días vencido)
   │   ├── Patrón: Siempre paga tarde 60-90 días
   │   ├── Historial: 12 meses, 8 pagos tardíos
   │   └── 📞 Requiere: Llamada del gerente general
   
   🟡 ADVERTENCIA (Seguimiento cercano):
   ├── Mountain Tours - $3,400 (35 días vencido)
   ├── Sacred Valley Co. - $1,900 (28 días vencido)
   
   🟢 NORMAL (Dentro de términos):
   ├── 23 agencias al día
   └── Promedio pago: 18 días
   ```

3. **Información Detallada por Agencia**:
   - 💳 **Facturas pendientes**: Número, fecha, monto específico
   - 📊 **Historial de pagos**: Patrón de comportamiento
   - 📈 **Volumen de negocio**: Tours/mes, ingresos generados
   - 📞 **Log de cobranza**: Intentos, respuestas, compromisos
   - ⚖️ **Nivel de riesgo**: Bajo/Medio/Alto/Crítico
   - 🎯 **Estrategia sugerida**: Basada en perfil y historial

4. **Herramientas de Cobranza**:
   - 📧 **Email automático**: Recordatorios escalonados
   - 📱 **WhatsApp directo**: Para casos urgentes  
   - 📋 **Plan de pagos**: Generador de acuerdos flexibles
   - 🚫 **Suspensión gradual**: Límites automáticos de crédito
   - ⚖️ **Escalamiento legal**: Documentación para cobranza judicial

5. **Acciones Preventivas**:
   - 🔍 **Alertas tempranas**: Al día 15 de vencimiento
   - 💳 **Límites dinámicos**: Reducir crédito automáticamente
   - 📊 **Scoring crediticio**: Basado en historial de pagos
   - 🎯 **Incentivos por pronto pago**: Descuentos por pago adelantado

#### **Postcondiciones**:
- Todas las gestiones de cobranza documentadas
- Alertas automáticas configuradas por agencia
- Reportes de morosidad generados semanalmente
- Estrategias personalizadas por perfil de pagador

#### **Casos Alternativos**:
- **CU-ADM-007.1**: Si agencia solicita plan de pagos → Generar propuesta automática
- **CU-ADM-007.2**: Si agencia está en crisis → Evaluar suspensión temporal vs apoyo
- **CU-ADM-007.3**: Si es cliente VIP moroso → Escalamiento especial a gerencia

#### **Criterios de Aceptación**:
```gherkin
DADO que existen facturas vencidas de agencias
CUANDO accedo al control de pagos pendientes  
ENTONCES veo un resumen categorizado por nivel de riesgo
  Y puedo ver el detalle financiero de cada agencia
  Y tengo herramientas para gestionar cobranza efectivamente
  Y puedo tomar acciones preventivas para evitar morosos
  Y el sistema sugiere estrategias basadas en el perfil histórico
```

---

### **CU-ADM-008: Sistema de Suspensión Inteligente de Usuarios**

#### **Descripción**: Como administrador, necesito suspender usuarios problemáticos (agencias o guías) con diferentes niveles de restricción según la gravedad, manteniendo debido proceso y posibilidad de rehabilitación.

#### **¿Por qué es crítico?**
- Proteger la calidad del servicio y reputación de la plataforma
- Mantener estándares altos sin ser draconianos
- Proceso justo y transparente que evite conflictos legales

#### **Precondiciones**:
- Usuario identificado con comportamiento problemático
- Evidencia documentada de infracciones
- Políticas de suspensión claramente definidas
- Sistema de notificaciones funcionando

#### **Flujo Principal**:
1. Admin identifica usuario problemático
2. **Centro de Control Disciplinario**:
   ```
   🚫 GESTIÓN DE SUSPENSIONES
   
   📋 CASOS ACTIVOS:
   ├── 🔴 Pendientes de acción: 3 casos
   ├── 🟡 En proceso de apelación: 2 casos  
   ├── 🟢 Resueltos esta semana: 8 casos
   
   🎯 USUARIOS EN REVISIÓN:
   
   🔴 ALTA PRIORIDAD:
   ├── María González (Guía) - ID: G2024-001
   │   ├── Infracciones: 5 cancelaciones último momento (30 días)
   │   ├── Impacto: 28 turistas afectados, $3,400 en pérdidas
   │   ├── Estado: Advertencia final (desde 15 Ene)
   │   └── 🚫 Acción recomendada: Suspensión temporal 15 días
   │
   ├── Andes Explorer (Agencia) - ID: A2024-012  
   │   ├── Infracciones: Pagos vencidos $5,670 (94 días)
   │   ├── Impacto: Flujo de caja comprometido
   │   ├── Tours activos: 12 ($2,800 en riesgo)
   │   └── 🚫 Acción recomendada: Suspensión de nuevas reservas
   
   🟡 MONITOREO:
   ├── Carlos Ruiz (Guía) - 3 quejas de turistas (mes)
   ├── Valley Tours (Agencia) - Rating bajando (4.2→3.8)
   ```

3. **Niveles de Suspensión Disponibles**:
   
   **NIVEL 1 - Advertencia Formal:**
   - ⚠️ Notificación oficial documentada
   - 📧 Email + SMS + notificación en app
   - 📋 Plan de mejora requerido
   - ⏰ Plazo de corrección: 7-14 días
   
   **NIVEL 2 - Restricción Parcial:**
   - 🚫 Límite de tours simultáneos (50% reducción)
   - 💰 Retención parcial de pagos (20%)
   - 📊 Monitoreo intensivo (reportes diarios)
   - ⏰ Duración: 7-30 días
   
   **NIVEL 3 - Suspensión Temporal:**
   - 🚫 No puede recibir nuevas reservas
   - 📅 Tours existentes se mantienen (honrar compromisos)
   - 💳 Pagos retenidos hasta resolución
   - ⏰ Duración: 15-90 días
   
   **NIVEL 4 - Suspensión Total:**
   - 🚫 Cancelación de todos los tours activos
   - 🔒 Bloqueo completo de la cuenta
   - ⚖️ Proceso de reasignación masiva
   - ⏰ Duración: 90 días - permanente

4. **Proceso de Suspensión**:
   ```
   📋 WIZARD DE SUSPENSIÓN:
   
   Paso 1: Seleccionar infracciones
   ☑️ Cancelaciones frecuentes (5 en 30 días)
   ☑️ Rating bajo consistente (<3.5 por 60 días)  
   ☐ Problemas de seguridad
   ☐ Fraude o mal uso del sistema
   
   Paso 2: Nivel recomendado por IA
   🤖 "Basado en historial y gravedad: NIVEL 2 - Restricción Parcial"
   
   Paso 3: Configurar suspensión
   ├── Duración: [15] días  
   ├── Fecha inicio: [Inmediato / Programar]
   ├── Afectar tours existentes: [SÍ / NO]
   └── Mensaje personalizado: [Texto libre]
   
   Paso 4: Notificación automática
   📧 Email formal con detalles y proceso de apelación
   📱 SMS de confirmación  
   🔔 Notificación push en app
   📋 Documento PDF con términos y condiciones
   ```

5. **Sistema de Apelaciones**:
   - 📝 **Formulario de apelación** integrado
   - 📎 **Carga de evidencia** (documentos, testimonios)
   - ⏰ **Plazo para apelar**: 7 días calendario
   - 👥 **Comité de revisión**: Admin + 2 supervisores
   - 📊 **Decisión en máximo**: 15 días hábiles

#### **Herramientas de Gestión**:
- 📊 **Historial completo**: Todas las suspensiones del usuario
- 🎯 **Impacto calculado**: Tours/ingresos afectados
- 📈 **Dashboard de rehabilitación**: Progreso post-suspensión
- 🔍 **Análisis de patrones**: Detección de problemas sistémicos
- 📧 **Comunicación automatizada**: Templates por tipo de infracción

#### **Postcondiciones**:
- Usuario notificado a través de múltiples canales
- Restricciones aplicadas automáticamente en el sistema
- Tours afectados reasignados si es necesario
- Proceso de apelación activado automáticamente
- Métricas de calidad actualizadas

#### **Casos Alternativos**:
- **CU-ADM-008.1**: Si usuario apela → Pausar suspensión hasta resolución
- **CU-ADM-008.2**: Si es suspensión masiva → Protocolo de crisis operativa
- **CU-ADM-008.3**: Si afecta cliente VIP → Escalamiento a gerencia general

#### **Criterios de Aceptación**:
```gherkin
DADO que un usuario tiene comportamiento problemático documentado
CUANDO inicio el proceso de suspensión
ENTONCES puedo seleccionar el nivel apropiado según la gravedad
  Y el sistema calcula automáticamente el impacto
  Y se envían notificaciones por múltiples canales
  Y se activa automáticamente el proceso de apelación
  Y las restricciones se aplican inmediatamente en el sistema
  Y queda documentado todo el proceso para auditoría
```

#### **Consideraciones Legales**:
- 📋 **Debido proceso**: Notificación previa y derecho a defensa
- 📝 **Documentación completa**: Para posibles disputas legales
- ⚖️ **Proporcionalidad**: Castigo acorde a la falta
- 🔄 **Revisión periódica**: Casos de suspensión prolongada
- 📞 **Contacto humano**: Siempre disponible para explicaciones

---

### **CU-ADM-009: Sistema de Aprobación de Agencias Nuevas**

#### **Descripción**: Como administrador, necesito revisar y aprobar solicitudes de nuevas agencias de manera eficiente pero rigurosa, asegurando que solo ingresen operadores legítimos y de calidad.

#### **¿Por qué es crítico?**
- La calidad de las agencias determina la reputación de la plataforma
- Agencias fraudulentas pueden causar daños irreparables
- Proceso eficiente evita perder oportunidades de negocio legítimas

#### **Precondiciones**:
- Solicitudes de registro recibidas y en cola
- Sistema de verificación documental funcionando
- Checklist de requisitos actualizado
- Templates de comunicación configurados

#### **Flujo Principal**:
1. Admin accede a "Centro de Aprobación de Agencias"
2. **Dashboard de Solicitudes Pendientes**:
   ```
   📋 COLA DE APROBACIONES
   
   📊 RESUMEN:
   ├── 🔴 Urgentes (>7 días): 3 solicitudes
   ├── 🟡 En proceso: 8 solicitudes  
   ├── 🟢 Nuevas hoy: 5 solicitudes
   └── ⏱️ Tiempo promedio revisión: 3.2 días
   
   🎯 SOLICITUDES PRIORITARIAS:
   
   🔴 URGENTE - Esperando 12 días:
   ├── "Andes Premium Tours" (Lima)
   │   ├── Tipo: Agencia establecida (8 años)
   │   ├── Volumen esperado: 150 tours/mes
   │   ├── Inversión inicial: $25,000
   │   ├── Estado: ⚠️ Documentación incompleta
   │   └── 📞 Contactos: 5 llamadas, última hace 2 días
   
   🟡 EN REVISIÓN:
   ├── "Sacred Valley Adventures" (Cusco)  
   │   ├── Tipo: Startup (nueva empresa)
   │   ├── Volumen esperado: 50 tours/mes
   │   ├── Estado: 🔍 Verificación legal en proceso
   │   └── ✅ Documentos: 8/10 completos
   │
   ├── "Mountain Explorer Co." (Arequipa)
   │   ├── Tipo: Expansión (operan en Bolivia)
   │   ├── Estado: 📞 Entrevista programada mañana
   │   └── ✅ Referencias: 3/3 positivas
   ```

3. **Sistema de Revisión Integral**:
   
   **PASO 1 - Verificación Automática:**
   ```
   🤖 VALIDACIÓN AUTOMÁTICA:
   
   ✅ INFORMACIÓN BÁSICA:
   ├── ✅ RUC válido y activo (SUNAT)
   ├── ✅ Licencia de funcionamiento vigente
   ├── ✅ Registro en MINCETUR activo
   ├── ⚠️ Póliza de seguro (vence en 30 días)
   └── ❌ Certificado ISO (no requerido pero recomendado)
   
   ✅ VERIFICACIÓN DIGITAL:
   ├── ✅ Website funcional y profesional
   ├── ✅ Redes sociales activas (>1000 followers)
   ├── ✅ Reviews en Google/TripAdvisor (4.2★ promedio)
   └── ✅ Sin reportes negativos en SBS/INDECOPI
   
   🎯 SCORE AUTOMÁTICO: 8.5/10 (Recomendado para aprobación)
   ```

   **PASO 2 - Revisión Manual del Admin:**
   ```
   📋 CHECKLIST DE CALIDAD:
   
   📄 DOCUMENTACIÓN:
   ☑️ Constitución de empresa (PDF verificado)
   ☑️ Estados financieros últimos 2 años
   ☑️ Referencias comerciales (3 mínimo)
   ☑️ Certificaciones de guías empleados
   ☐ Plan de operaciones detallado (pendiente)
   ☐ Póliza de responsabilidad civil actualizada
   
   👥 EQUIPO Y CAPACIDAD:
   ├── Personal: 12 empleados (8 guías certificados)
   ├── Oficinas: Cusco centro + sucursal Machu Picchu  
   ├── Flota: 6 vehículos propios + convenios
   └── Especialidades: Historia inca, turismo aventura
   
   💰 CAPACIDAD FINANCIERA:
   ├── Capital declarado: $150,000
   ├── Facturación anual: $480,000 (2023)
   ├── Referencias bancarias: 2 bancos A1
   └── 🟢 Solvencia confirmada
   ```

   **PASO 3 - Entrevista Virtual (Opcional):**
   - 📹 **Videollamada con representantes** (30 min)
   - 🎯 **Evaluación de conocimiento** del mercado
   - 💼 **Presentación del plan de negocio**
   - 🤝 **Alineación con valores** de la plataforma

4. **Decisión y Comunicación**:
   
   **APROBACIÓN EXITOSA:**
   ```
   ✅ AGENCIA APROBADA
   
   📧 Notificación automática incluye:
   ├── Mensaje de bienvenida personalizado
   ├── Credenciales de acceso temporal
   ├── Manual de onboarding (PDF)
   ├── Calendario de capacitación inicial
   ├── Contacto del Account Manager asignado
   └── Kit de marketing co-branding
   
   🚀 Proceso automático post-aprobación:
   ├── Creación de cuenta con permisos básicos
   ├── Asignación de Account Manager
   ├── Programación de llamada de bienvenida
   └── Acceso a plataforma de entrenamiento
   ```

   **RECHAZO FUNDAMENTADO:**
   ```
   ❌ SOLICITUD RECHAZADA
   
   📧 Comunicación incluye:
   ├── Razones específicas del rechazo
   ├── Áreas que necesitan mejorar
   ├── Posibilidad de re-aplicar en 90 días
   ├── Recursos para cumplir requisitos
   └── Contacto para consultas adicionales
   
   Razones comunes de rechazo:
   ├── Documentación legal incompleta/inválida
   ├── Capacidad financiera insuficiente
   ├── Antecedentes negativos verificados
   ├── Falta de experiencia demostrable
   └── No alineación con estándares de calidad
   ```

5. **Herramientas de Apoyo**:
   - 🔍 **Investigación automática**: Google, redes sociales, registros públicos
   - 📞 **Dialer integrado**: Para llamadas de verificación
   - 📝 **Templates de email**: Respuestas rápidas personalizables
   - 📊 **Scoring predictivo**: IA que evalúa probabilidad de éxito
   - 📋 **Notas colaborativas**: Para decisiones en equipo

#### **Métricas de Desempeño**:
- ⏱️ **Tiempo promedio de aprobación**: Meta <5 días
- 📈 **Tasa de aprobación**: 65-75% (balance calidad/crecimiento)
- 🎯 **Agencias exitosas**: >80% activas después de 6 meses
- 📞 **Satisfacción del proceso**: >4.5/5 en encuesta post-decisión

#### **Postcondiciones**:
- Decisión comunicada en máximo 7 días hábiles
- Si aprobada: Onboarding iniciado automáticamente
- Si rechazada: Feedback constructivo proporcionado
- Expediente completo archivado para auditoría
- Métricas actualizadas para mejorar proceso

#### **Casos Alternativos**:
- **CU-ADM-009.1**: Si documentos incompletos → Solicitar específicamente los faltantes con plazo
- **CU-ADM-009.2**: Si referencia negativa → Investigación adicional antes de rechazar
- **CU-ADM-009.3**: Si caso borderline → Consulta con comité de admisiones

#### **Criterios de Aceptación**:
```gherkin
DADO que hay solicitudes de nuevas agencias pendientes
CUANDO accedo al centro de aprobación
ENTONCES veo todas las solicitudes organizadas por prioridad
  Y puedo revisar la verificación automática completada
  Y tengo herramientas para investigación manual adicional
  Y puedo tomar decisión informada (aprobar/rechazar/solicitar más info)
  Y la comunicación se envía automáticamente según mi decisión
  Y el proceso de onboarding inicia automáticamente si apruebo
```

#### **Consideraciones Especiales**:

**🔐 SEGURIDAD Y COMPLIANCE:**
- Verificación anti-lavado de dinero (AML)
- Validación contra listas de sanciones internacionales
- Cumplimiento de regulaciones turísticas locales
- Protección de datos personales (GDPR compliance)

**🎯 CRITERIOS DE CALIDAD:**
- Experiencia mínima: 2 años en turismo
- Capital mínimo: $50,000 o respaldo financiero equivalente
- Seguro de responsabilidad civil vigente
- Al menos 3 guías certificados en planilla

**🚀 ONBOARDING FAST-TRACK:**
- Agencias con certificación internacional → Revisión acelerada
- Referencias de agencias existentes → Proceso preferencial  
- Inversión >$100k → Atención personalizada de gerencia

---

## 📊 **DASHBOARD ADMINISTRATIVO - Vista Unificada**

### **Layout Propuesto**:
```
┌─────────────────────────────────────────────────────────────┐
│ 🎩 CENTRO DE COMANDO - Admin Dashboard                      │
├─────────────────────────────────────────────────────────────┤
│ 🔴 CRÍTICO    🟡 ATENCIÓN    🟢 NORMAL    📊 MÉTRICAS      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚡ ALERTAS ACTIVAS                  💰 FINANZAS HOY        │
│ ├── 🚨 1 Emergencia                ├── $12,450 ingresos    │
│ ├── ⚠️ 3 Retrasos                  ├── +15% vs ayer        │  
│ └── 📱 2 Desconexiones             └── 89% collect rate    │
│                                                             │
│ 🗺️ TOURS ACTIVOS (23)              👥 USUARIOS ACTIVOS    │
│ [Mapa interactivo en tiempo real]   ├── 45 guías online    │
│                                     ├── 12 agencias        │
│                                     └── 156 turistas       │
│                                                             │
│ 📋 TAREAS PENDIENTES                🎯 ACCIONES RÁPIDAS   │
│ ├── 5 Conflictos sin resolver       ├── [Enviar Broadcast] │
│ ├── 12 Agencias pendientes          ├── [Ver Reportes]     │
│ └── 3 Pagos por aprobar             └── [Analizar Trends]  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **CONSIDERACIONES TÉCNICAS**

### **APIs Críticas para Admin**:
```javascript
// Tiempo Real
GET /api/admin/tours/active          // Tours activos ahora
GET /api/admin/alerts/critical       // Alertas críticas
WS  /ws/admin/realtime              // WebSocket updates

// Financiero  
GET /api/admin/finances/dashboard    // Métricas financieras
GET /api/admin/commissions/pending   // Comisiones pendientes
GET /api/admin/analytics/trends      // Tendencias

// Operativo
POST /api/admin/tours/reassign       // Reasignar tour
POST /api/admin/conflicts/resolve    // Resolver conflicto
POST /api/admin/users/suspend        // Suspender usuario
POST /api/admin/notifications/broadcast // Enviar masivo
```

### **Arquitectura de Alertas**:
- **Redis Pub/Sub**: Para alertas en tiempo real
- **WebSocket**: Conexión permanente admin
- **Push Notifications**: Móvil del admin
- **SMS Gateway**: Emergencias críticas
- **Email Queue**: Reportes automáticos

---

## 🎯 **MÉTRICAS DE ÉXITO**

### **Operacionales**:
- **Tiempo de respuesta a emergencias**: <3 minutos
- **Resolución de conflictos**: <24 horas promedio  
- **Reasignaciones exitosas**: >90% de tours cancelados
- **Uptime del sistema**: >99.5%

### **Financieras**:
- **Precisión de reportes**: 100% exactitud
- **Tiempo de procesamiento pagos**: <48 horas
- **Detección de anomalías**: >95% de casos críticos

### **Satisfacción**:
- **NPS administradores**: >8/10
- **Tiempo de capacitación nuevos admins**: <1 semana
- **Errores operativos**: <2% mensual

---

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"id": "1", "content": "Create detailed use cases for Administrator role", "status": "completed", "priority": "high"}, {"id": "2", "content": "Define technical requirements for admin dashboard", "status": "completed", "priority": "medium"}, {"id": "3", "content": "Map admin use cases to existing components", "status": "pending", "priority": "medium"}]