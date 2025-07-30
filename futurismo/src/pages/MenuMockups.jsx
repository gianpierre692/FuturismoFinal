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
  XMarkIcon,
  Bars3Icon,
  BellIcon,
  StarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CogIcon,
  PowerIcon,
  ChevronLeftIcon,
  PlusIcon,
  CameraIcon,
  MapPinIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const MenuMockups = () => {
  const [activeModel, setActiveModel] = useState('gridMenu');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState('agency');
  const [activePanel, setActivePanel] = useState('main');
  const [expandedSection, setExpandedSection] = useState(null);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Contenido de ejemplo para el fondo
  const DemoContent = () => (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido de vuelta</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-primary">{i * 25}</div>
            <div className="text-sm text-gray-600">Métrica {i}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // MODELO 1: Grid Menu
  const GridMenuMockup = () => {
    const items = selectedRole === 'guide' ? [
      { icon: HomeIcon, label: 'Inicio', color: 'bg-blue-500' },
      { icon: CalendarIcon, label: 'Mi Agenda', color: 'bg-green-500' },
      { icon: MapIcon, label: 'Tour Actual', color: 'bg-purple-500' },
      { icon: ClockIcon, label: 'Historial', color: 'bg-orange-500' },
      { icon: ChatBubbleLeftRightIcon, label: 'Chat', color: 'bg-red-500' },
      { icon: UserCircleIcon, label: 'Perfil', color: 'bg-gray-500' }
    ] : [
      { icon: HomeIcon, label: 'Dashboard', color: 'bg-blue-500' },
      { icon: CalendarIcon, label: 'Reservas', color: 'bg-green-500' },
      { icon: MapIcon, label: 'Monitoreo', color: 'bg-purple-500' },
      { icon: MagnifyingGlassIcon, label: 'Buscar Guías', color: 'bg-orange-500' },
      { icon: BriefcaseIcon, label: 'Contratos', color: 'bg-pink-500' },
      { icon: ChartBarIcon, label: 'Reportes', color: 'bg-indigo-500' },
      { icon: ClockIcon, label: 'Historial', color: 'bg-teal-500' },
      { icon: ChatBubbleLeftRightIcon, label: 'Chat', color: 'bg-red-500' },
      { icon: UserCircleIcon, label: 'Perfil', color: 'bg-gray-500' }
    ];

    return showMenu && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
        <div className="bg-white rounded-t-3xl w-full p-6 pb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menú</h2>
            <button 
              onClick={() => setShowMenu(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {items.map((item, idx) => (
              <button
                key={idx}
                className="flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className={`p-4 rounded-2xl ${item.color} bg-opacity-10 mb-3`}>
                  <item.icon className={`w-6 h-6 ${item.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xs text-gray-700 text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // MODELO 2: Slide Panels
  const SlidePanelsMockup = () => {
    const panels = {
      main: [
        { icon: HomeIcon, label: 'Inicio', action: () => {} },
        { icon: BriefcaseIcon, label: 'Operaciones', action: () => setActivePanel('operations') },
        { icon: MagnifyingGlassIcon, label: 'Marketplace', action: () => setActivePanel('marketplace') },
        { icon: ChartBarIcon, label: 'Análisis', action: () => setActivePanel('analytics') },
        { icon: UserCircleIcon, label: 'Mi Cuenta', action: () => setActivePanel('account') }
      ],
      operations: [
        { icon: CalendarIcon, label: 'Reservaciones' },
        { icon: MapIcon, label: 'Monitoreo en Vivo' },
        { icon: ClockIcon, label: 'Historial' }
      ],
      marketplace: [
        { icon: MagnifyingGlassIcon, label: 'Buscar Guías' },
        { icon: BriefcaseIcon, label: 'Mis Contrataciones' }
      ],
      analytics: [
        { icon: ChartBarIcon, label: 'Reportes' },
        { icon: CurrencyDollarIcon, label: 'Finanzas' }
      ],
      account: [
        { icon: UserCircleIcon, label: 'Mi Perfil' },
        { icon: CogIcon, label: 'Configuración' },
        { icon: PowerIcon, label: 'Cerrar Sesión' }
      ]
    };

    return showMenu && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
        <div className="bg-white w-80 h-full shadow-xl animate-slide-right">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-white">
            {activePanel !== 'main' && (
              <button
                onClick={() => setActivePanel('main')}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold flex-1 text-center">
              {activePanel === 'main' ? 'Menú' : activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
            </h2>
            <button 
              onClick={() => setShowMenu(false)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            {panels[activePanel]?.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-left flex-1">{item.label}</span>
                {item.action && <span className="text-gray-400">→</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // MODELO 3: Bottom Nav + FAB
  const BottomNavFABMockup = () => {
    const bottomItems = selectedRole === 'guide' ? [
      { icon: HomeIcon, label: 'Inicio', active: true },
      { icon: MapIcon, label: 'Mapa' },
      { icon: CalendarIcon, label: 'Agenda' },
      { icon: ClockIcon, label: 'Historial' },
      { icon: UserCircleIcon, label: 'Más' }
    ] : [
      { icon: HomeIcon, label: 'Inicio', active: true },
      { icon: CalendarIcon, label: 'Reservas' },
      { icon: MapIcon, label: 'Monitoreo' },
      { icon: ChartBarIcon, label: 'Reportes' },
      { icon: Bars3Icon, label: 'Más' }
    ];

    const fabActions = selectedRole === 'guide' ? [
      { icon: CameraIcon, label: 'Foto' },
      { icon: MapPinIcon, label: 'Ubicación' },
      { icon: CheckIcon, label: 'Check-in' }
    ] : [
      { icon: CalendarIcon, label: 'Nueva Reserva' },
      { icon: MagnifyingGlassIcon, label: 'Buscar Guía' }
    ];

    return (
      <>
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-5 h-16">
            {bottomItems.map((item, idx) => (
              <button
                key={idx}
                className={`flex flex-col items-center justify-center py-1 ${
                  item.active ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-0.5">{item.label}</span>
                {item.active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-b-full" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* FAB */}
        <div className="fixed bottom-20 right-4 z-50">
          {fabExpanded && fabActions.map((action, idx) => (
            <button
              key={idx}
              className="absolute bottom-16 right-0 mb-3 flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3 hover:shadow-xl transition-all"
              style={{ 
                bottom: `${(idx + 1) * 60}px`,
                animation: `slideIn 0.2s ease-out ${idx * 0.05}s backwards`
              }}
            >
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap order-1">
                {action.label}
              </span>
              <div className="p-2 bg-gray-100 rounded-full order-2">
                <action.icon className="w-5 h-5 text-gray-600" />
              </div>
            </button>
          ))}
          
          <button
            onClick={() => setFabExpanded(!fabExpanded)}
            className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
              selectedRole === 'guide' ? 'bg-green-500' : 'bg-primary'
            } text-white`}
          >
            {fabExpanded ? (
              <XMarkIcon className="w-6 h-6" />
            ) : selectedRole === 'guide' ? (
              <ShieldCheckIcon className="w-6 h-6" />
            ) : (
              <PlusIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </>
    );
  };

  // MODELO 4: Tab Bar Expandible
  const ExpandableTabBarMockup = () => {
    const sections = [
      {
        id: 'operations',
        label: 'Operaciones',
        icon: BriefcaseIcon,
        items: [
          { icon: CalendarIcon, label: 'Reservas' },
          { icon: MapIcon, label: 'Monitoreo' },
          { icon: ClockIcon, label: 'Historial' }
        ]
      },
      {
        id: 'marketplace',
        label: 'Marketplace',
        icon: MagnifyingGlassIcon,
        items: [
          { icon: MagnifyingGlassIcon, label: 'Buscar' },
          { icon: BriefcaseIcon, label: 'Contratos' }
        ]
      },
      {
        id: 'analytics',
        label: 'Análisis',
        icon: ChartBarIcon,
        items: [
          { icon: ChartBarIcon, label: 'Reportes' },
          { icon: CurrencyDollarIcon, label: 'Finanzas' }
        ]
      }
    ];

    return (
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 z-50">
        {expandedSection && (
          <div className="p-4 border-b border-gray-100 animate-slide-up">
            <div className="grid grid-cols-3 gap-3">
              {sections
                .find(s => s.id === expandedSection)
                ?.items.map((item, idx) => (
                  <button
                    key={idx}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                  >
                    <item.icon className="w-5 h-5 text-gray-600 mb-1" />
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-around py-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setExpandedSection(
                expandedSection === section.id ? null : section.id
              )}
              className={`flex flex-col items-center p-2 rounded-lg ${
                expandedSection === section.id ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <section.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // MODELO 5: Command Palette
  const CommandPaletteMockup = () => {
    const commands = [
      { icon: CalendarIcon, label: 'Nueva Reserva', shortcut: 'Ctrl+N' },
      { icon: MapIcon, label: 'Ver Monitoreo', shortcut: 'Ctrl+M' },
      { icon: MagnifyingGlassIcon, label: 'Buscar Guía', shortcut: 'Ctrl+G' },
      { icon: ChartBarIcon, label: 'Generar Reporte', shortcut: 'Ctrl+R' },
      { icon: ChatBubbleLeftRightIcon, label: 'Abrir Chat', shortcut: 'Ctrl+C' }
    ];

    const filteredCommands = commands.filter(cmd => 
      cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return showMenu && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center pt-20">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
          <div className="p-4 border-b">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar comando..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.map((cmd, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <cmd.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium">{cmd.label}</span>
                </div>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                  {cmd.shortcut}
                </kbd>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Phone Frame */}
      <div className="max-w-[375px] mx-auto bg-black rounded-[40px] p-3 shadow-2xl">
        <div className="bg-white rounded-[30px] overflow-hidden relative" style={{ height: '812px' }}>
          {/* Status Bar */}
          <div className="bg-white px-6 py-2 flex justify-between items-center text-xs">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-3 bg-black rounded-sm"></div>
              <div className="w-4 h-3 bg-black rounded-sm"></div>
              <div className="w-4 h-3 bg-black rounded-sm"></div>
            </div>
          </div>

          {/* App Header */}
          <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => setShowMenu(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">Futurismo</h1>
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </header>

          {/* Content */}
          <div className="h-full bg-gray-50 overflow-y-auto pb-20">
            <DemoContent />
          </div>

          {/* Render selected menu model */}
          {activeModel === 'gridMenu' && <GridMenuMockup />}
          {activeModel === 'slidePanels' && <SlidePanelsMockup />}
          {activeModel === 'bottomNavFAB' && <BottomNavFABMockup />}
          {activeModel === 'expandableTab' && <ExpandableTabBarMockup />}
          {activeModel === 'commandPalette' && <CommandPaletteMockup />}
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-[375px] mx-auto mt-8 space-y-4">
        {/* Role Selector */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Rol:</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedRole('agency')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedRole === 'agency' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Agencia
            </button>
            <button
              onClick={() => setSelectedRole('guide')}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedRole === 'guide' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Guía
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Modelo de Menú:</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveModel('gridMenu');
                setShowMenu(true);
              }}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                activeModel === 'gridMenu' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid Menu (iOS/Android)
            </button>
            <button
              onClick={() => {
                setActiveModel('slidePanels');
                setShowMenu(true);
                setActivePanel('main');
              }}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                activeModel === 'slidePanels' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Slide Panels (WhatsApp)
            </button>
            <button
              onClick={() => {
                setActiveModel('bottomNavFAB');
                setFabExpanded(false);
              }}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                activeModel === 'bottomNavFAB' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bottom Nav + FAB
            </button>
            <button
              onClick={() => {
                setActiveModel('expandableTab');
                setExpandedSection(null);
              }}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                activeModel === 'expandableTab' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tab Bar Expandible
            </button>
            <button
              onClick={() => {
                setActiveModel('commandPalette');
                setShowMenu(true);
                setSearchQuery('');
              }}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                activeModel === 'commandPalette' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Command Palette
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.3s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes slide-right {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MenuMockups;