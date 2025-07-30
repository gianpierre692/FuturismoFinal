import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  DocumentIcon,
  UserIcon,
  CalendarIcon,
  MapIcon,
  ChartBarIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Escuchar Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus en input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // BASE DE COMANDOS Y BÚSQUEDAS
  const searchableItems = [
    // Navegación
    { type: 'nav', icon: MapIcon, title: 'Monitoreo en Vivo', path: '/monitoring', keywords: ['mapa', 'tracking', 'gps'] },
    { type: 'nav', icon: CalendarIcon, title: 'Reservas', path: '/reservations', keywords: ['booking', 'reservar'] },
    { type: 'nav', icon: ChartBarIcon, title: 'Reportes', path: '/reports', keywords: ['analytics', 'estadísticas'] },
    
    // Acciones
    { type: 'action', icon: DocumentIcon, title: 'Nueva Reserva', action: () => navigate('/reservations/new'), keywords: ['crear', 'add'] },
    { type: 'action', icon: UserIcon, title: 'Buscar Guía', action: () => navigate('/marketplace'), keywords: ['guide', 'contratar'] },
    
    // Comandos
    { type: 'command', icon: CommandLineIcon, title: 'Exportar Reporte del Día', action: exportTodayReport, keywords: ['export', 'pdf'] },
    { type: 'command', icon: CommandLineIcon, title: 'Modo Oscuro', action: toggleDarkMode, keywords: ['dark', 'theme'] },
    
    // Búsquedas recientes (dinámico)
    ...getRecentSearches(),
    
    // Datos (simulado - vendría de API)
    { type: 'data', icon: UserIcon, title: 'Carlos Mendoza', subtitle: 'Guía', path: '/guides/123' },
    { type: 'data', icon: DocumentIcon, title: 'RES-2024-001', subtitle: 'City Tour Lima', path: '/reservations/001' }
  ];

  // Buscar según query
  useEffect(() => {
    if (!query) {
      setResults(searchableItems.slice(0, 5)); // Mostrar sugerencias
      return;
    }

    const filtered = searchableItems.filter(item => {
      const searchText = `${item.title} ${item.subtitle || ''} ${item.keywords?.join(' ') || ''}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    setResults(filtered.slice(0, 8)); // Máximo 8 resultados
  }, [query]);

  const handleSelect = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
    
    // Guardar en búsquedas recientes
    saveRecentSearch(item);
    
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar comandos, páginas, guías, reservas..."
              className="flex-1 outline-none text-lg"
            />
            <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No se encontraron resultados para "{query}"
              </div>
            ) : (
              <div className="py-2">
                {results.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        item.type === 'nav' ? 'bg-primary-100 text-primary-600' :
                        item.type === 'action' ? 'bg-green-100 text-green-600' :
                        item.type === 'command' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-sm text-gray-500">{item.subtitle}</p>
                        )}
                      </div>
                      {item.type === 'command' && (
                        <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">⌘</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            <span className="mr-4">↑↓ Navegar</span>
            <span className="mr-4">↵ Seleccionar</span>
            <span>⌘K Abrir búsqueda</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Funciones auxiliares
const getRecentSearches = () => {
  const recent = localStorage.getItem('recentSearches');
  return recent ? JSON.parse(recent) : [];
};

const saveRecentSearch = (item) => {
  const recent = getRecentSearches();
  const updated = [item, ...recent.filter(r => r.title !== item.title)].slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(updated));
};

const exportTodayReport = () => {
  console.log('Exporting today report...');
  // Lógica de exportación
};

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
};

export default CommandPalette;