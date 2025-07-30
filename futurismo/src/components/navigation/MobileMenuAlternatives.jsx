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
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

// ALTERNATIVA 1: Grid Menu (Estilo iOS/Android)
export const GridMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: HomeIcon, label: 'Inicio', path: '/dashboard', color: 'bg-blue-500' },
    { icon: CalendarIcon, label: 'Reservas', path: '/reservations', color: 'bg-green-500' },
    { icon: MapIcon, label: 'Monitoreo', path: '/monitoring', color: 'bg-purple-500' },
    { icon: MagnifyingGlassIcon, label: 'Buscar Guías', path: '/marketplace', color: 'bg-orange-500' },
    { icon: BriefcaseIcon, label: 'Contratos', path: '/marketplace/requests', color: 'bg-pink-500' },
    { icon: ChartBarIcon, label: 'Reportes', path: '/reports', color: 'bg-indigo-500' },
    { icon: ClockIcon, label: 'Historial', path: '/history', color: 'bg-teal-500' },
    { icon: ChatBubbleLeftRightIcon, label: 'Chat', path: '/chat', color: 'bg-red-500' },
    { icon: UserCircleIcon, label: 'Perfil', path: '/profile', color: 'bg-gray-500' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Menú</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                window.location.href = item.path;
                onClose();
              }}
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

// ALTERNATIVA 2: Radial Menu (Circular)
export const RadialMenu = ({ isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const menuItems = [
    { icon: HomeIcon, label: 'Inicio', angle: 0 },
    { icon: CalendarIcon, label: 'Reservas', angle: 45 },
    { icon: MapIcon, label: 'Monitoreo', angle: 90 },
    { icon: MagnifyingGlassIcon, label: 'Buscar', angle: 135 },
    { icon: ChartBarIcon, label: 'Reportes', angle: 180 },
    { icon: ChatBubbleLeftRightIcon, label: 'Chat', angle: 225 },
    { icon: ClockIcon, label: 'Historial', angle: 270 },
    { icon: UserCircleIcon, label: 'Perfil', angle: 315 }
  ];

  if (!isOpen) return null;

  const radius = 120;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="fixed bottom-20 right-6">
        {/* Central button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`relative z-10 w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center transition-transform ${
            isExpanded ? 'rotate-45' : ''
          }`}
        >
          <Squares2X2Icon className="w-8 h-8 text-white" />
        </button>

        {/* Menu items */}
        {isExpanded && menuItems.map((item, idx) => {
          const angleRad = (item.angle * Math.PI) / 180;
          const x = radius * Math.cos(angleRad);
          const y = radius * Math.sin(angleRad);
          
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = '/dashboard';
              }}
              className="absolute w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
              style={{
                transform: `translate(${-x}px, ${-y}px)`,
                opacity: isExpanded ? 1 : 0,
                pointerEvents: isExpanded ? 'auto' : 'none'
              }}
            >
              <item.icon className="w-6 h-6 text-gray-700" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ALTERNATIVA 3: Tab Bar Expandible
export const ExpandableTabBar = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const sections = [
    {
      id: 'operations',
      label: 'Operaciones',
      icon: BriefcaseIcon,
      items: [
        { icon: CalendarIcon, label: 'Reservas', path: '/reservations' },
        { icon: MapIcon, label: 'Monitoreo', path: '/monitoring' },
        { icon: ClockIcon, label: 'Historial', path: '/history' }
      ]
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: MagnifyingGlassIcon,
      items: [
        { icon: MagnifyingGlassIcon, label: 'Buscar Guías', path: '/marketplace' },
        { icon: BriefcaseIcon, label: 'Mis Contratos', path: '/marketplace/requests' }
      ]
    },
    {
      id: 'analytics',
      label: 'Análisis',
      icon: ChartBarIcon,
      items: [
        { icon: ChartBarIcon, label: 'Reportes', path: '/reports' },
        { icon: ChartBarIcon, label: 'Estadísticas', path: '/stats' }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 z-50">
      {/* Expanded content */}
      {expandedSection && (
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-3">
            {sections
              .find(s => s.id === expandedSection)
              ?.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => window.location.href = item.path}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50"
                >
                  <item.icon className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </button>
              ))}
          </div>
        </div>
      )}
      
      {/* Main tab bar */}
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
        <button
          onClick={onClose}
          className="flex flex-col items-center p-2 rounded-lg text-gray-500"
        >
          <XMarkIcon className="w-6 h-6 mb-1" />
          <span className="text-xs">Cerrar</span>
        </button>
      </div>
    </div>
  );
};

// ALTERNATIVA 4: Slide Panels (WhatsApp style)
export const SlidePanels = ({ isOpen, onClose }) => {
  const [activePanel, setActivePanel] = useState('main');
  
  const panels = {
    main: [
      { icon: HomeIcon, label: 'Inicio', action: () => window.location.href = '/dashboard' },
      { icon: BriefcaseIcon, label: 'Operaciones', action: () => setActivePanel('operations') },
      { icon: MagnifyingGlassIcon, label: 'Marketplace', action: () => setActivePanel('marketplace') },
      { icon: ChartBarIcon, label: 'Análisis', action: () => setActivePanel('analytics') },
      { icon: UserCircleIcon, label: 'Mi Cuenta', action: () => setActivePanel('account') }
    ],
    operations: [
      { icon: CalendarIcon, label: 'Reservaciones', path: '/reservations' },
      { icon: MapIcon, label: 'Monitoreo en Vivo', path: '/monitoring' },
      { icon: ClockIcon, label: 'Historial', path: '/history' }
    ],
    marketplace: [
      { icon: MagnifyingGlassIcon, label: 'Buscar Guías', path: '/marketplace' },
      { icon: BriefcaseIcon, label: 'Mis Contrataciones', path: '/marketplace/requests' }
    ],
    analytics: [
      { icon: ChartBarIcon, label: 'Reportes', path: '/reports' },
      { icon: ChartBarIcon, label: 'Estadísticas', path: '/stats' }
    ],
    account: [
      { icon: UserCircleIcon, label: 'Mi Perfil', path: '/profile' },
      { icon: ChatBubbleLeftRightIcon, label: 'Mensajes', path: '/chat' }
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {activePanel !== 'main' && (
            <button
              onClick={() => setActivePanel('main')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              ← Atrás
            </button>
          )}
          <h2 className="text-lg font-semibold flex-1 text-center">
            {activePanel === 'main' ? 'Menú' : activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {panels[activePanel].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  window.location.href = item.path;
                  onClose();
                }
              }}
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

// ALTERNATIVA 5: Command Palette (Spotlight style)
export const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  
  const allCommands = [
    { icon: CalendarIcon, label: 'Nueva Reserva', shortcut: 'Ctrl+N', path: '/reservations/new' },
    { icon: MapIcon, label: 'Ver Monitoreo', shortcut: 'Ctrl+M', path: '/monitoring' },
    { icon: MagnifyingGlassIcon, label: 'Buscar Guía', shortcut: 'Ctrl+G', path: '/marketplace' },
    { icon: ChartBarIcon, label: 'Generar Reporte', shortcut: 'Ctrl+R', path: '/reports' },
    { icon: ChatBubbleLeftRightIcon, label: 'Abrir Chat', shortcut: 'Ctrl+C', path: '/chat' },
    { icon: UserCircleIcon, label: 'Mi Perfil', shortcut: 'Ctrl+P', path: '/profile' }
  ];

  const filteredCommands = allCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4" onClick={onClose}>
      <div 
        className="max-w-lg mx-auto mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="p-4 border-b">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar comando..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Commands list */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => {
                window.location.href = cmd.path;
                onClose();
              }}
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

export default function MenuShowcase() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Alternativas de Menú Móvil</h2>
      
      <button 
        onClick={() => setActiveMenu('grid')}
        className="w-full p-4 bg-blue-500 text-white rounded-lg"
      >
        1. Grid Menu (iOS/Android Style)
      </button>
      
      <button 
        onClick={() => setActiveMenu('radial')}
        className="w-full p-4 bg-purple-500 text-white rounded-lg"
      >
        2. Radial Menu (Circular)
      </button>
      
      <button 
        onClick={() => setActiveMenu('expandable')}
        className="w-full p-4 bg-green-500 text-white rounded-lg"
      >
        3. Tab Bar Expandible
      </button>
      
      <button 
        onClick={() => setActiveMenu('slide')}
        className="w-full p-4 bg-orange-500 text-white rounded-lg"
      >
        4. Slide Panels (WhatsApp Style)
      </button>
      
      <button 
        onClick={() => setActiveMenu('command')}
        className="w-full p-4 bg-pink-500 text-white rounded-lg"
      >
        5. Command Palette (Spotlight Style)
      </button>

      {/* Render active menu */}
      {activeMenu === 'grid' && <GridMenu isOpen={true} onClose={() => setActiveMenu(null)} />}
      {activeMenu === 'radial' && <RadialMenu isOpen={true} onClose={() => setActiveMenu(null)} />}
      {activeMenu === 'expandable' && <ExpandableTabBar isOpen={true} onClose={() => setActiveMenu(null)} />}
      {activeMenu === 'slide' && <SlidePanels isOpen={true} onClose={() => setActiveMenu(null)} />}
      {activeMenu === 'command' && <CommandPalette isOpen={true} onClose={() => setActiveMenu(null)} />}
    </div>
  );
}