import { useState } from 'react';
import { 
  HomeIcon, 
  CalendarIcon, 
  MapIcon, 
  ClockIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  PowerIcon,
  BellIcon,
  StarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ArrowRightIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const MenuStructureComparison = () => {
  const [selectedRole, setSelectedRole] = useState('agency');
  const [expandedModel, setExpandedModel] = useState(null);

  // Estructura de menú por rol
  const menuStructures = {
    agency: {
      gridMenu: {
        title: "Grid Menu - Agencia",
        description: "Todos los items visibles en una cuadrícula 3x3",
        pros: ["Acceso directo a todo", "Visual e intuitivo", "Sin jerarquías complejas"],
        cons: ["Limitado a 9-12 items", "Sin agrupación lógica"],
        structure: [
          { icon: HomeIcon, label: 'Dashboard', color: 'bg-blue-500' },
          { icon: CalendarIcon, label: 'Reservas', color: 'bg-green-500' },
          { icon: MapIcon, label: 'Monitoreo', color: 'bg-purple-500' },
          { icon: MagnifyingGlassIcon, label: 'Buscar Guías', color: 'bg-orange-500' },
          { icon: BriefcaseIcon, label: 'Contratos', color: 'bg-pink-500' },
          { icon: ChartBarIcon, label: 'Reportes', color: 'bg-indigo-500' },
          { icon: ClockIcon, label: 'Historial', color: 'bg-teal-500' },
          { icon: ChatBubbleLeftRightIcon, label: 'Chat', color: 'bg-red-500' },
          { icon: UserCircleIcon, label: 'Perfil', color: 'bg-gray-500' }
        ]
      },
      slidePanels: {
        title: "Slide Panels - Agencia",
        description: "Navegación jerárquica con categorías",
        pros: ["Organización clara", "Escalable", "Breadcrumb natural"],
        cons: ["Más clics para llegar", "Curva de aprendizaje"],
        structure: {
          main: [
            { icon: HomeIcon, label: 'Inicio', direct: true },
            { icon: BriefcaseIcon, label: 'Operaciones', hasSubmenu: true },
            { icon: MagnifyingGlassIcon, label: 'Marketplace', hasSubmenu: true },
            { icon: ChartBarIcon, label: 'Análisis', hasSubmenu: true },
            { icon: UserCircleIcon, label: 'Mi Cuenta', hasSubmenu: true }
          ],
          submenus: {
            'Operaciones': [
              { icon: CalendarIcon, label: 'Reservaciones' },
              { icon: MapIcon, label: 'Monitoreo en Vivo' },
              { icon: ClockIcon, label: 'Historial' },
              { icon: DocumentTextIcon, label: 'Documentos' }
            ],
            'Marketplace': [
              { icon: MagnifyingGlassIcon, label: 'Buscar Guías' },
              { icon: BriefcaseIcon, label: 'Mis Contrataciones' },
              { icon: StarIcon, label: 'Guías Favoritos' }
            ],
            'Análisis': [
              { icon: ChartBarIcon, label: 'Dashboard Analytics' },
              { icon: DocumentTextIcon, label: 'Reportes' },
              { icon: CurrencyDollarIcon, label: 'Finanzas' }
            ],
            'Mi Cuenta': [
              { icon: UserCircleIcon, label: 'Mi Perfil' },
              { icon: BellIcon, label: 'Notificaciones' },
              { icon: ChatBubbleLeftRightIcon, label: 'Mensajes' },
              { icon: CogIcon, label: 'Configuración' },
              { icon: PowerIcon, label: 'Cerrar Sesión' }
            ]
          }
        }
      },
      expandableTabBar: {
        title: "Tab Bar Expandible - Agencia",
        description: "Barra inferior con secciones expandibles",
        pros: ["Siempre visible", "Acceso rápido a categorías", "Compacto"],
        cons: ["Espacio limitado", "Puede ser confuso"],
        structure: [
          {
            section: 'Operaciones',
            icon: BriefcaseIcon,
            items: [
              { icon: CalendarIcon, label: 'Reservas' },
              { icon: MapIcon, label: 'Monitoreo' },
              { icon: ClockIcon, label: 'Historial' }
            ]
          },
          {
            section: 'Marketplace',
            icon: MagnifyingGlassIcon,
            items: [
              { icon: MagnifyingGlassIcon, label: 'Buscar' },
              { icon: BriefcaseIcon, label: 'Contratos' }
            ]
          },
          {
            section: 'Análisis',
            icon: ChartBarIcon,
            items: [
              { icon: ChartBarIcon, label: 'Reportes' },
              { icon: CurrencyDollarIcon, label: 'Finanzas' }
            ]
          }
        ]
      }
    },
    guide: {
      gridMenu: {
        title: "Grid Menu - Guía",
        description: "Opciones esenciales en cuadrícula 3x2",
        pros: ["Simple y directo", "Fácil de memorizar", "Acceso con una mano"],
        cons: ["Sin opciones avanzadas visibles"],
        structure: [
          { icon: HomeIcon, label: 'Inicio', color: 'bg-blue-500' },
          { icon: CalendarIcon, label: 'Mi Agenda', color: 'bg-green-500' },
          { icon: MapIcon, label: 'Tour Actual', color: 'bg-purple-500' },
          { icon: ClockIcon, label: 'Historial', color: 'bg-orange-500' },
          { icon: ChatBubbleLeftRightIcon, label: 'Chat', color: 'bg-red-500' },
          { icon: UserCircleIcon, label: 'Perfil', color: 'bg-gray-500' }
        ]
      },
      radialMenu: {
        title: "Radial Menu - Guía",
        description: "Menú circular con acciones principales",
        pros: ["Innovador", "Acceso rápido", "No obstruye pantalla"],
        cons: ["Menos familiar", "Limitado a 8 items"],
        structure: [
          { icon: HomeIcon, label: 'Inicio', angle: 0 },
          { icon: CalendarIcon, label: 'Agenda', angle: 45 },
          { icon: MapIcon, label: 'Mapa', angle: 90 },
          { icon: ShieldCheckIcon, label: 'SOS', angle: 135, urgent: true },
          { icon: ClockIcon, label: 'Historial', angle: 180 },
          { icon: ChatBubbleLeftRightIcon, label: 'Chat', angle: 225 },
          { icon: StarIcon, label: 'Puntos', angle: 270 },
          { icon: UserCircleIcon, label: 'Perfil', angle: 315 }
        ]
      },
      bottomNavPlusFAB: {
        title: "Bottom Nav + FAB - Guía",
        description: "Navegación inferior con botón flotante contextual",
        pros: ["Siempre visible", "FAB para emergencias", "Patrón familiar"],
        cons: ["Ocupa espacio fijo", "Limitado a 5 items"],
        structure: {
          bottomItems: [
            { icon: HomeIcon, label: 'Inicio' },
            { icon: MapIcon, label: 'Mapa' },
            { icon: CalendarIcon, label: 'Agenda' },
            { icon: ClockIcon, label: 'Historial' },
            { icon: UserCircleIcon, label: 'Más' }
          ],
          fab: {
            normal: { icon: ShieldCheckIcon, label: 'Check-in', color: 'bg-green-500' },
            emergency: { icon: ShieldCheckIcon, label: 'SOS', color: 'bg-red-500' }
          }
        }
      }
    },
    admin: {
      commandPalette: {
        title: "Command Palette - Admin",
        description: "Búsqueda y comandos rápidos tipo Spotlight",
        pros: ["Muy eficiente", "Atajos de teclado", "Búsqueda inteligente"],
        cons: ["Requiere aprendizaje", "No visual"],
        structure: [
          { command: 'Nueva Reserva', shortcut: 'Ctrl+N', category: 'Acciones' },
          { command: 'Ver Dashboard', shortcut: 'Ctrl+D', category: 'Navegación' },
          { command: 'Buscar Usuario', shortcut: 'Ctrl+U', category: 'Búsquedas' },
          { command: 'Generar Reporte Mensual', shortcut: 'Ctrl+R', category: 'Reportes' },
          { command: 'Ver Logs del Sistema', shortcut: 'Ctrl+L', category: 'Sistema' },
          { command: 'Configuración', shortcut: 'Ctrl+,', category: 'Sistema' }
        ]
      },
      slidePanels: {
        title: "Slide Panels - Admin",
        description: "Navegación completa con todas las opciones",
        pros: ["Acceso a todo", "Bien organizado", "Escalable"],
        cons: ["Puede ser abrumador", "Múltiples niveles"],
        structure: {
          main: [
            { icon: HomeIcon, label: 'Dashboard', direct: true },
            { icon: UserGroupIcon, label: 'Usuarios', hasSubmenu: true },
            { icon: BuildingOffice2Icon, label: 'Gestión', hasSubmenu: true },
            { icon: ChartBarIcon, label: 'Analytics', hasSubmenu: true },
            { icon: CogIcon, label: 'Sistema', hasSubmenu: true }
          ],
          submenus: {
            'Usuarios': [
              { icon: UserGroupIcon, label: 'Lista de Usuarios' },
              { icon: UserCircleIcon, label: 'Roles y Permisos' },
              { icon: DocumentTextIcon, label: 'Logs de Actividad' }
            ],
            'Gestión': [
              { icon: CalendarIcon, label: 'Todas las Reservas' },
              { icon: MapIcon, label: 'Centro de Monitoreo' },
              { icon: BriefcaseIcon, label: 'Proveedores' },
              { icon: ShieldCheckIcon, label: 'Protocolos' }
            ],
            'Analytics': [
              { icon: ChartBarIcon, label: 'Dashboard General' },
              { icon: DocumentTextIcon, label: 'Reportes' },
              { icon: CurrencyDollarIcon, label: 'Finanzas' },
              { icon: StarIcon, label: 'KPIs' }
            ],
            'Sistema': [
              { icon: CogIcon, label: 'Configuración' },
              { icon: ShieldCheckIcon, label: 'Seguridad' },
              { icon: DocumentTextIcon, label: 'Logs' },
              { icon: PowerIcon, label: 'Mantenimiento' }
            ]
          }
        }
      }
    }
  };

  const currentStructures = menuStructures[selectedRole];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Comparación de Estructuras de Menú</h1>
        
        {/* Role Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Selecciona el rol:</h2>
          <div className="flex gap-2">
            {['agency', 'guide', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRole === role 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role === 'agency' ? 'Agencia' : role === 'guide' ? 'Guía' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Structures */}
        <div className="space-y-6">
          {Object.entries(currentStructures).map(([key, model]) => (
            <div key={key} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedModel(expandedModel === key ? null : key)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{model.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                  </div>
                  <ChevronRightIcon 
                    className={`w-5 h-5 transition-transform ${
                      expandedModel === key ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedModel === key && (
                <div className="border-t border-gray-100 p-4">
                  {/* Pros y Contras */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">✅ Ventajas</h4>
                      <ul className="space-y-1">
                        {model.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-green-700">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-2">❌ Desventajas</h4>
                      <ul className="space-y-1">
                        {model.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-red-700">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Visual Structure */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Estructura Visual:</h4>
                    
                    {/* Grid Menu */}
                    {key === 'gridMenu' && (
                      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                        {model.structure.map((item, idx) => (
                          <div 
                            key={idx}
                            className="bg-white rounded-lg p-3 text-center"
                          >
                            <div className={`${item.color} bg-opacity-10 rounded-lg p-3 mb-2`}>
                              <item.icon className={`w-6 h-6 mx-auto ${item.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="text-xs">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Slide Panels */}
                    {key === 'slidePanels' && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-3">
                          <h5 className="font-medium mb-2">Menú Principal:</h5>
                          {model.structure.main.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-gray-600" />
                                <span className="text-sm">{item.label}</span>
                              </div>
                              {item.hasSubmenu && <ArrowRightIcon className="w-4 h-4 text-gray-400" />}
                            </div>
                          ))}
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                          {Object.entries(model.structure.submenus).slice(0, 2).map(([title, items]) => (
                            <div key={title} className="bg-white rounded-lg p-3">
                              <h5 className="font-medium text-sm mb-2">→ {title}:</h5>
                              {items.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-1 text-sm text-gray-600">
                                  <item.icon className="w-4 h-4" />
                                  <span>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expandable Tab Bar */}
                    {key === 'expandableTabBar' && (
                      <div>
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="flex justify-around">
                            {model.structure.map((section, idx) => (
                              <div key={idx} className="text-center">
                                <section.icon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                                <span className="text-xs">{section.section}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <h5 className="text-sm font-medium mb-2">Expandido (ejemplo):</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {model.structure[0].items.map((item, idx) => (
                              <div key={idx} className="text-center p-2">
                                <item.icon className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                <span className="text-xs">{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Radial Menu */}
                    {key === 'radialMenu' && (
                      <div className="relative h-64 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">MENU</span>
                        </div>
                        {model.structure.map((item, idx) => {
                          const angleRad = (item.angle * Math.PI) / 180;
                          const radius = 80;
                          const x = radius * Math.cos(angleRad);
                          const y = radius * Math.sin(angleRad);
                          
                          return (
                            <div
                              key={idx}
                              className={`absolute w-12 h-12 ${
                                item.urgent ? 'bg-red-100' : 'bg-white'
                              } rounded-full shadow-md flex items-center justify-center`}
                              style={{
                                transform: `translate(${x}px, ${-y}px)`
                              }}
                            >
                              <item.icon className={`w-6 h-6 ${
                                item.urgent ? 'text-red-600' : 'text-gray-600'
                              }`} />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Bottom Nav + FAB */}
                    {key === 'bottomNavPlusFAB' && (
                      <div>
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="flex justify-around">
                            {model.structure.bottomItems.map((item, idx) => (
                              <div key={idx} className="text-center">
                                <item.icon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                                <span className="text-xs">{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-around">
                          <div className="text-center">
                            <div className={`w-14 h-14 ${model.structure.fab.normal.color} rounded-full flex items-center justify-center mb-1`}>
                              <model.structure.fab.normal.icon className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-xs">Normal</span>
                          </div>
                          <div className="text-center">
                            <div className={`w-14 h-14 ${model.structure.fab.emergency.color} rounded-full flex items-center justify-center mb-1 animate-pulse`}>
                              <model.structure.fab.emergency.icon className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-xs">Emergencia</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Command Palette */}
                    {key === 'commandPalette' && (
                      <div className="bg-white rounded-lg p-3">
                        <div className="bg-gray-100 rounded p-2 mb-3">
                          <input 
                            type="text" 
                            placeholder="Buscar comando..." 
                            className="w-full bg-transparent outline-none text-sm"
                          />
                        </div>
                        {model.structure.map((cmd, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div>
                              <span className="text-sm font-medium">{cmd.command}</span>
                              <span className="text-xs text-gray-500 ml-2">{cmd.category}</span>
                            </div>
                            <kbd className="text-xs bg-gray-100 px-2 py-1 rounded">{cmd.shortcut}</kbd>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recomendaciones */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 Recomendaciones</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Agencias:</strong> Grid Menu para simplicidad o Slide Panels para organización completa</p>
            <p><strong>Guías:</strong> Bottom Nav + FAB para acceso rápido y emergencias</p>
            <p><strong>Admin:</strong> Command Palette + Slide Panels para máxima eficiencia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuStructureComparison;