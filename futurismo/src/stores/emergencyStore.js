import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const useEmergencyStore = create()(
  devtools(
    persist(
      (set, get) => ({
        protocols: [
          {
            id: 'protocolo_medico',
            title: 'Protocolo Médico de Emergencia',
            category: 'medico',
            priority: 'alta',
            description: 'Procedimientos para emergencias médicas durante tours',
            icon: '🚑',
            lastUpdated: '2024-01-15',
            content: {
              steps: [
                'Evaluar la situación y seguridad del entorno',
                'Verificar estado de conciencia del afectado',
                'Llamar inmediatamente a emergencias (105)',
                'Contactar coordinador de tours',
                'Aplicar primeros auxilios básicos si está capacitado',
                'Documentar el incidente',
                'Coordinar traslado si es necesario'
              ],
              contacts: [
                { name: 'Emergencias Nacionales', phone: '105', type: 'emergency' },
                { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
                { name: 'Gerencia', phone: '+51 999 888 778', type: 'management' },
                { name: 'Seguro Médico', phone: '+51 999 888 780', type: 'insurance' }
              ],
              materials: [
                'Botiquín de primeros auxilios',
                'Lista de contactos de emergencia',
                'Información médica de participantes',
                'Linterna y silbato',
                'Mantas térmicas'
              ]
            }
          },
          {
            id: 'protocolo_climatico',
            title: 'Protocolo de Emergencia Climática',
            category: 'climatico',
            priority: 'alta',
            description: 'Procedimientos para condiciones climáticas adversas',
            icon: '⛈️',
            lastUpdated: '2024-01-15',
            content: {
              steps: [
                'Monitorear condiciones climáticas constantemente',
                'Identificar refugios seguros en la ruta',
                'Comunicar situación al coordinador',
                'Reagrupar al grupo en lugar seguro',
                'Evaluar continuidad del tour',
                'Coordinar plan de contingencia',
                'Mantener comunicación constante'
              ],
              contacts: [
                { name: 'SENAMHI', phone: '115', type: 'weather' },
                { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
                { name: 'Defensa Civil', phone: '116', type: 'emergency' }
              ],
              materials: [
                'Radio de comunicación',
                'Impermeables de emergencia',
                'Brújula y GPS',
                'Linternas adicionales',
                'Silbato de emergencia'
              ]
            }
          },
          {
            id: 'protocolo_vehicular',
            title: 'Protocolo de Emergencia Vehicular',
            category: 'transporte',
            priority: 'media',
            description: 'Procedimientos para accidentes o fallas de vehículos',
            icon: '🚗',
            lastUpdated: '2024-01-15',
            content: {
              steps: [
                'Asegurar la zona del incidente',
                'Verificar estado de todos los pasajeros',
                'Llamar a emergencias si hay heridos',
                'Contactar servicio de grúa y seguros',
                'Documentar daños con fotografías',
                'Coordinar transporte alternativo',
                'Informar a coordinador y agencia'
              ],
              contacts: [
                { name: 'Policía de Carreteras', phone: '105', type: 'police' },
                { name: 'Seguro Vehicular', phone: '+51 999 888 785', type: 'insurance' },
                { name: 'Servicio de Grúa', phone: '+51 999 888 786', type: 'towing' },
                { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' }
              ],
              materials: [
                'Kit de herramientas básicas',
                'Triángulos de seguridad',
                'Chaleco reflectivo',
                'Extintor',
                'Botiquín vehicular'
              ]
            }
          },
          {
            id: 'protocolo_perdida',
            title: 'Protocolo de Persona Perdida',
            category: 'seguridad',
            priority: 'alta',
            description: 'Procedimientos cuando un turista se pierde del grupo',
            icon: '🔍',
            lastUpdated: '2024-01-15',
            content: {
              steps: [
                'Realizar conteo inmediato del grupo',
                'Determinar cuándo y dónde se vio por última vez',
                'Asignar búsqueda en área inmediata',
                'Contactar inmediatamente al coordinador',
                'Llamar a autoridades locales',
                'Mantener al resto del grupo seguro',
                'Documentar cronología de eventos'
              ],
              contacts: [
                { name: 'Policía Nacional', phone: '105', type: 'police' },
                { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
                { name: 'Autoridades Locales', phone: 'Variable', type: 'local' },
                { name: 'Gerencia 24h', phone: '+51 999 888 779', type: 'management' }
              ],
              materials: [
                'Lista actualizada de participantes',
                'Silbato de emergencia',
                'Linterna potente',
                'Radio de comunicación',
                'Fotografías del grupo'
              ]
            }
          },
          {
            id: 'protocolo_comunicacion',
            title: 'Protocolo de Pérdida de Comunicación',
            category: 'comunicacion',
            priority: 'media',
            description: 'Procedimientos cuando se pierde comunicación',
            icon: '📡',
            lastUpdated: '2024-01-15',
            content: {
              steps: [
                'Intentar comunicación por todos los medios disponibles',
                'Moverse a zona con mejor señal si es seguro',
                'Utilizar radio de emergencia si está disponible',
                'Seguir plan de contingencia predefinido',
                'Mantener al grupo informado y tranquilo',
                'Dirigirse al punto de encuentro establecido',
                'Documentar período sin comunicación'
              ],
              contacts: [
                { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
                { name: 'Base de Operaciones', phone: '+51 999 888 781', type: 'operations' },
                { name: 'Emergencia 24h', phone: '+51 999 888 779', type: 'emergency' }
              ],
              materials: [
                'Radio de emergencia',
                'Teléfono satelital (si disponible)',
                'Puntos WiFi identificados',
                'Plan de contingencia impreso',
                'Mapas offline'
              ]
            }
          }
        ],
        
        materials: [
          {
            id: 'botiquin_basico',
            name: 'Botiquín Básico de Primeros Auxilios',
            category: 'medico',
            mandatory: true,
            items: [
              'Vendas elásticas (2 rollos)',
              'Gasas estériles (10 unidades)',
              'Esparadrapo (2 rollos)',
              'Alcohol y agua oxigenada',
              'Analgésicos básicos',
              'Termómetro digital',
              'Tijeras y pinzas',
              'Guantes desechables (5 pares)'
            ]
          },
          {
            id: 'comunicacion',
            name: 'Equipo de Comunicación',
            category: 'comunicacion',
            mandatory: true,
            items: [
              'Radio transmisor',
              'Teléfono móvil con batería extra',
              'Silbato de emergencia',
              'Linterna LED con pilas extra',
              'Cargador portátil'
            ]
          },
          {
            id: 'documentacion',
            name: 'Documentación de Emergencia',
            category: 'documentos',
            mandatory: true,
            items: [
              'Lista de participantes con contactos',
              'Protocolos impresos',
              'Contactos de emergencia locales',
              'Números de seguros',
              'Mapas de la zona'
            ]
          },
          {
            id: 'seguridad_personal',
            name: 'Seguridad Personal',
            category: 'seguridad',
            mandatory: false,
            items: [
              'Chaleco reflectivo',
              'Casco de seguridad (según actividad)',
              'Silbato adicional',
              'Mantas térmicas (2 unidades)',
              'Agua potable extra (2 litros)'
            ]
          }
        ],

        categories: [
          { id: 'medico', name: 'Médico', icon: '🚑', color: '#EF4444' },
          { id: 'climatico', name: 'Climático', icon: '⛈️', color: '#3B82F6' },
          { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#F59E0B' },
          { id: 'seguridad', name: 'Seguridad', icon: '🔍', color: '#8B5CF6' },
          { id: 'comunicacion', name: 'Comunicación', icon: '📡', color: '#10B981' }
        ],

        // Acciones
        actions: {
          getProtocols: () => get().protocols,
          
          getProtocolById: (id) => get().protocols.find(p => p.id === id),
          
          getProtocolsByCategory: (category) => 
            get().protocols.filter(p => p.category === category),
          
          getMaterials: () => get().materials,
          
          getMaterialsByCategory: (category) =>
            get().materials.filter(m => m.category === category),
          
          getMandatoryMaterials: () =>
            get().materials.filter(m => m.mandatory),
          
          addProtocol: (protocol) => set((state) => ({
            protocols: [...state.protocols, {
              ...protocol,
              id: `protocolo_${Date.now()}`,
              lastUpdated: new Date().toISOString().split('T')[0]
            }]
          })),
          
          updateProtocol: (id, updates) => set((state) => ({
            protocols: state.protocols.map(p => 
              p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : p
            )
          })),
          
          deleteProtocol: (id) => set((state) => ({
            protocols: state.protocols.filter(p => p.id !== id)
          })),
          
          addMaterial: (material) => set((state) => ({
            materials: [...state.materials, {
              ...material,
              id: `material_${Date.now()}`
            }]
          })),
          
          updateMaterial: (id, updates) => set((state) => ({
            materials: state.materials.map(m => 
              m.id === id ? { ...m, ...updates } : m
            )
          })),
          
          deleteMaterial: (id) => set((state) => ({
            materials: state.materials.filter(m => m.id !== id)
          })),
          
          searchProtocols: (query) => {
            const protocols = get().protocols;
            if (!query) return protocols;
            
            return protocols.filter(p => 
              p.title.toLowerCase().includes(query.toLowerCase()) ||
              p.description.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase())
            );
          }
        }
      }),
      {
        name: 'emergency-storage',
        version: 1
      }
    ),
    {
      name: 'emergency-store'
    }
  )
);

export default useEmergencyStore;