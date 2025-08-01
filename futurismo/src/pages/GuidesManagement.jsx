import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PencilIcon, 
  EyeIcon, 
  TrashIcon, 
  GlobeAltIcon, 
  AcademicCapIcon, 
  TrophyIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CheckBadgeIcon,
  ClockIcon,
  ChartBarIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  StarIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import useGuidesStore from '../stores/guidesStore';
import GuideForm from '../components/guides/GuideForm';
import GuideProfile from '../components/guides/GuideProfile';
import ExportImportModal from '../components/common/ExportImportModal';
import AdvancedDataTable from '../components/common/AdvancedDataTable';
import InteractiveButton from '../components/common/InteractiveButton';
import useNotificationsStore from '../stores/notificationsStore';

const GuidesManagement = () => {
  const { guides = [], languages = [], museums = [], actions } = useGuidesStore();
  const { addNotification } = useNotificationsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterMuseum, setFilterMuseum] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // all, active, inactive
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, profile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [selectedInactiveGuides, setSelectedInactiveGuides] = useState([]);

  const handleImportSuccess = (importedData) => {
    if (importedData && Object.keys(importedData).length > 0) {
      const firstSheet = Object.values(importedData)[0];
      if (actions?.importGuides && typeof actions.importGuides === 'function') {
        actions.importGuides(firstSheet);
      }
      setShowExportModal(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrar guías
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = !searchQuery || 
      guide?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide?.dni?.includes(searchQuery);
    
    const matchesType = !filterType || guide?.guideType === filterType;
    
    const matchesLanguage = !filterLanguage || 
      guide?.specializations?.languages?.some(lang => lang.code === filterLanguage);
    
    const matchesMuseum = !filterMuseum ||
      guide?.specializations?.museums?.some(museum => 
        museum.name?.toLowerCase().includes(filterMuseum.toLowerCase())
      );
    
    // Filtrar por estado de actividad
    const matchesStatus = !filterStatus || 
      (filterStatus === 'all') ||
      (filterStatus === 'active' && guide?.todayStatus === 'active') ||
      (filterStatus === 'inactive' && (!guide?.todayStatus || guide?.todayStatus === 'inactive'));
    
    return matchesSearch && matchesType && matchesLanguage && matchesMuseum && matchesStatus;
  });

  const handleAddGuide = () => {
    setEditingGuide(null);
    setIsEditing(true);
  };

  const handleEditGuide = (guide) => {
    setEditingGuide(guide);
    setIsEditing(true);
  };

  const handleViewProfile = (guide) => {
    setSelectedGuide(guide);
    setViewMode('profile');
  };

  const handleDeleteGuide = (guideId) => {
    if (confirm('¿Estás seguro de eliminar este guía?')) {
      actions.deleteGuide(guideId);
    }
  };

  const handleSaveGuide = (guideData) => {
    if (editingGuide) {
      actions.updateGuide(editingGuide.id, guideData);
    } else {
      actions.addGuide(guideData);
    }
    setIsEditing(false);
    setEditingGuide(null);
  };

  const getLanguageLabel = (langCode) => {
    return languages.find(lang => lang.code === langCode)?.name || langCode;
  };

  const getMuseumLabel = (museumName) => {
    return museumName || 'Museo sin nombre';
  };

  const getLevelBadge = (level) => {
    const levels = {
      'principiante': { color: 'bg-yellow-100 text-yellow-800', text: 'Principiante' },
      'intermedio': { color: 'bg-blue-100 text-blue-800', text: 'Intermedio' },
      'avanzado': { color: 'bg-green-100 text-green-800', text: 'Avanzado' },
      'experto': { color: 'bg-purple-100 text-purple-800', text: 'Experto' },
      'nativo': { color: 'bg-indigo-100 text-indigo-800', text: 'Nativo' }
    };
    
    const levelInfo = levels[level] || { color: 'bg-gray-100 text-gray-800', text: level };
    return (
      <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${levelInfo.color}`}>
        {levelInfo.text}
      </span>
    );
  };

  if (viewMode === 'profile' && selectedGuide) {
    return (
      <GuideProfile 
        guide={selectedGuide} 
        onClose={() => {
          setViewMode('grid');
          setSelectedGuide(null);
        }}
        onEdit={handleEditGuide}
      />
    );
  }

  if (isEditing) {
    return (
      <GuideForm
        guide={editingGuide}
        onSave={handleSaveGuide}
        onCancel={() => {
          setIsEditing(false);
          setEditingGuide(null);
        }}
      />
    );
  }

  // Mobile Guide Card
  const MobileGuideCard = ({ guide }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {(guide?.fullName || 'G').split(' ').map(name => name[0]).join('').substring(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {guide?.fullName || 'Sin nombre'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                guide?.guideType === 'planta' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {guide?.guideType === 'planta' ? 'Planta' : 'Freelance'}
              </span>
              <div className="flex items-center">
                <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600 ml-0.5">{guide?.stats?.rating || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5 mb-3 text-xs">
        <div className="flex items-center text-gray-600">
          <EnvelopeIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
          <span className="truncate">{guide?.email || 'Sin email'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <PhoneIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
          <span>{guide?.phone || 'Sin teléfono'}</span>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-700 mb-1">
          Idiomas ({guide?.specializations?.languages?.length || 0})
        </p>
        <div className="flex flex-wrap gap-1">
          {(guide?.specializations?.languages || []).slice(0, 2).map((lang, index) => (
            <span key={index} className="bg-blue-50 px-2 py-0.5 rounded text-xs">
              {getLanguageLabel(lang.code)}
            </span>
          ))}
          {(guide?.specializations?.languages?.length || 0) > 2 && (
            <span className="text-xs text-gray-500">
              +{(guide?.specializations?.languages?.length || 0) - 2}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-gray-50 p-1.5 rounded">
          <p className="text-sm font-semibold text-gray-900">{guide?.stats?.toursCompleted || 0}</p>
          <p className="text-xs text-gray-600">Tours</p>
        </div>
        <div className="bg-gray-50 p-1.5 rounded">
          <p className="text-sm font-semibold text-gray-900">{guide?.stats?.yearsExperience || 0}</p>
          <p className="text-xs text-gray-600">Años</p>
        </div>
        <div className="bg-gray-50 p-1.5 rounded">
          <p className="text-sm font-semibold text-gray-900">{guide?.stats?.certifications || 0}</p>
          <p className="text-xs text-gray-600">Cert.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleViewProfile(guide)}
          className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Ver Perfil
        </button>
        <button
          onClick={() => handleEditGuide(guide)}
          className="px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDeleteGuide(guide.id)}
          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Desktop List View with AdvancedDataTable
  const DesktopListView = () => (
    <AdvancedDataTable
      data={filteredGuides}
      columns={[
        {
          key: 'fullName',
          header: 'Guía',
          render: (guide) => (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {(guide?.fullName || 'G').split(' ').map(name => name[0]).join('').substring(0, 2)}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{guide?.fullName || 'Sin nombre'}</div>
                <div className="text-sm text-gray-500">{guide?.email}</div>
              </div>
            </div>
          )
        },
        {
          key: 'guideType',
          header: 'Tipo',
          render: (guide) => (
            <div className="space-y-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                guide?.guideType === 'planta' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {guide?.guideType === 'planta' ? 'Planta' : 'Freelance'}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  guide?.todayStatus === 'active' ? 'bg-green-100 text-green-700' :
                  guide?.todayStatus === 'on_tour' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {guide?.todayStatus === 'active' ? '● Disponible' :
                   guide?.todayStatus === 'on_tour' ? '● En Tour' :
                   '● Inactivo'}
                </span>
                {guide?.todayStatus === 'inactive' && guide?.inactiveReason && (
                  <span className="text-xs text-gray-500">- {guide.inactiveReason}</span>
                )}
              </div>
            </div>
          )
        },
        {
          key: 'languages',
          header: 'Idiomas',
          sortable: false,
          render: (guide) => (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {(guide?.specializations?.languages || []).slice(0, 3).map((lang, index) => (
                <span key={index} className="bg-blue-50 px-2 py-0.5 rounded text-xs">
                  {getLanguageLabel(lang.code)}
                </span>
              ))}
              {(guide?.specializations?.languages?.length || 0) > 3 && (
                <span className="text-xs text-gray-500">
                  +{(guide?.specializations?.languages?.length || 0) - 3}
                </span>
              )}
            </div>
          )
        },
        {
          key: 'stats',
          header: 'Estadísticas',
          sortable: false,
          render: (guide) => (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <ChartBarIcon className="w-4 h-4 mr-1 text-gray-400" />
                <span>{guide?.stats?.toursCompleted || 0} tours</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1 text-gray-400" />
                <span>{guide?.stats?.yearsExperience || 0} años</span>
              </div>
            </div>
          )
        },
        {
          key: 'rating',
          header: 'Calificación',
          sortType: 'numeric',
          accessor: (guide) => guide?.stats?.rating || 0,
          render: (guide) => (
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{guide?.stats?.rating || 0}/5</span>
            </div>
          )
        }
      ]}
      actions={[
        {
          label: 'Ver perfil',
          icon: <EyeIcon className="w-4 h-4" />,
          onClick: handleViewProfile,
          className: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
        },
        {
          label: 'Editar',
          icon: <PencilIcon className="w-4 h-4" />,
          onClick: handleEditGuide,
          className: 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
        },
        {
          label: 'Eliminar',
          icon: <TrashIcon className="w-4 h-4" />,
          onClick: (guide) => handleDeleteGuide(guide.id),
          className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
        }
      ]}
      filters={[
        {
          key: 'todayStatus',
          label: 'Estado Hoy',
          type: 'select',
          options: [
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Activos' },
            { value: 'on_tour', label: 'En Tour' },
            { value: 'inactive', label: 'Inactivos' }
          ],
          filterFn: (guide, value) => value === 'all' || guide.todayStatus === value
        },
        {
          key: 'guideType',
          label: 'Tipo de Guía',
          type: 'select',
          options: [
            { value: 'planta', label: 'Planta' },
            { value: 'freelance', label: 'Freelance' }
          ],
          filterFn: (guide, value) => guide.guideType === value
        },
        {
          key: 'language',
          label: 'Idioma',
          type: 'select',
          options: languages.map(lang => ({ value: lang.code, label: lang.name })),
          filterFn: (guide, value) => 
            guide?.specializations?.languages?.some(lang => lang.code === value)
        },
        {
          key: 'experience',
          label: 'Años de Experiencia (mínimo)',
          type: 'number',
          placeholder: 'Ej: 5',
          filterFn: (guide, value) => (guide?.stats?.yearsExperience || 0) >= parseInt(value)
        }
      ]}
      searchPlaceholder="Buscar por nombre, email, DNI..."
      pageSize={10}
      emptyMessage="No se encontraron guías con los filtros aplicados"
    />
  );

  // Calcular estadísticas
  const stats = {
    total: guides.length,
    active: guides.filter(g => g.todayStatus === 'active').length,
    onTour: guides.filter(g => g.todayStatus === 'on_tour').length,
    inactive: guides.filter(g => g.todayStatus === 'inactive').length
  };

  return (
    <div className="page-container bg-white">
      <div className="page-content-none">
        {/* Header */}
        <div className="page-header-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center">
              <UserGroupIcon className="w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-3 text-blue-500" />
              Gestión de Guías
            </h1>
            <p className="page-subtitle">
              Administra guías, idiomas y especialidades
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isMobile && viewMode === 'grid' && (
              <button
                onClick={() => setViewMode('list')}
                className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                title="Vista de lista"
              >
                <ViewColumnsIcon className="w-5 h-5" />
              </button>
            )}
            {!isMobile && viewMode === 'list' && (
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                title="Vista de cuadrícula"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Export/Import</span>
                <span className="sm:hidden">Export</span>
              </button>
              
              <button
                onClick={handleAddGuide}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Guía</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards con Estado de Hoy */}
        <div className="page-section-compact grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Guías</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => setFilterStatus('active')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-gray-500 mt-1">Activos hoy</p>
              </div>
              <CheckBadgeIcon className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => setFilterStatus('on_tour')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">En Tour</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.onTour}</p>
                <p className="text-xs text-gray-500 mt-1">Trabajando ahora</p>
              </div>
              <MapPinIcon className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-red-700 font-medium">Inactivos Hoy</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.inactive}</p>
                <p className="text-xs text-red-600 mt-1">Sin asignaciones</p>
                {stats.inactive > 0 && (
                  <button
                    onClick={() => {
                      const inactiveGuides = guides.filter(g => g.todayStatus === 'inactive');
                      setSelectedInactiveGuides(inactiveGuides);
                      setContactSubject('Disponibilidad para tours');
                      setContactMessage('Hola,\n\nNotamos que no has tenido asignaciones el día de hoy. Queremos verificar tu disponibilidad para próximos tours.\n\nPor favor, confírmanos si estás disponible para trabajar en los próximos días.\n\nSaludos,\nAdministración');
                      setShowContactModal(true);
                    }}
                    className="mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <ChatBubbleLeftRightIcon className="w-3 h-3" />
                    Contactar
                  </button>
                )}
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500 opacity-30" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">De Planta</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {guides.filter(g => g.guideType === 'planta').length}
                </p>
              </div>
              <CheckBadgeIcon className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Freelance</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {guides.filter(g => g.guideType === 'freelance').length}
                </p>
              </div>
              <GlobeAltIcon className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Idiomas</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{languages.length}</p>
              </div>
              <AcademicCapIcon className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="page-section-compact bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o DNI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mobile Filter Toggle */}
            {isMobile && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            )}

            {/* Filters */}
            {(showFilters || !isMobile) && (
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Todos los tipos</option>
                  <option value="planta">Guía de Planta</option>
                  <option value="freelance">Freelance</option>
                </select>

                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Todos los idiomas</option>
                  {languages.map(language => (
                    <option key={language.code} value={language.code}>
                      {language.flag} {language.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Buscar por museo..."
                  value={filterMuseum}
                  onChange={(e) => setFilterMuseum(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Guide List */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron guías
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Ajusta los filtros de búsqueda o crea un nuevo guía.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            {isMobile && (
              <div className="grid grid-cols-1 gap-4">
                {filteredGuides.map(guide => (
                  <MobileGuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}

            {/* Desktop Grid View */}
            {!isMobile && viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map(guide => (
                  <div
                    key={guide.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                            {(guide?.fullName || 'G').split(' ').map(name => name[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {guide?.fullName || 'Sin nombre'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                guide?.guideType === 'planta' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {guide?.guideType === 'planta' ? 'Planta' : 'Freelance'}
                              </span>
                              <div className="flex items-center">
                                <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">{guide?.stats?.rating || 0}/5</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 mr-2" />
                          <span className="truncate">{guide?.email || 'Sin email'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          <span>{guide?.phone || 'Sin teléfono'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          <span className="truncate">{guide?.address || 'Sin dirección'}</span>
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Idiomas ({guide?.specializations?.languages?.length || 0})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {(guide?.specializations?.languages || []).slice(0, 3).map((lang, index) => (
                            <div key={index} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs">
                              <span>{getLanguageLabel(lang.code)}</span>
                              {getLevelBadge(lang.level)}
                            </div>
                          ))}
                          {(guide?.specializations?.languages?.length || 0) > 3 && (
                            <span className="text-xs text-gray-500">
                              +{(guide?.specializations?.languages?.length || 0) - 3} más
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Museums */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Museos ({guide?.specializations?.museums?.length || 0})
                        </h4>
                        <div className="space-y-1">
                          {(guide?.specializations?.museums || []).slice(0, 2).map((museum, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate">{getMuseumLabel(museum.name)}</span>
                              {getLevelBadge(museum.expertise)}
                            </div>
                          ))}
                          {(guide?.specializations?.museums?.length || 0) > 2 && (
                            <span className="text-xs text-gray-500">
                              +{(guide?.specializations?.museums?.length || 0) - 2} más
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-lg font-semibold text-gray-900">{guide?.stats?.toursCompleted || 0}</p>
                          <p className="text-xs text-gray-600">Tours</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-lg font-semibold text-gray-900">{guide?.stats?.yearsExperience || 0}</p>
                          <p className="text-xs text-gray-600">Años</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-lg font-semibold text-gray-900">{guide?.stats?.certifications || 0}</p>
                          <p className="text-xs text-gray-600">Cert.</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewProfile(guide)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>Ver Perfil</span>
                        </button>
                        
                        <button
                          onClick={() => handleEditGuide(guide)}
                          className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          title="Editar guía"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Eliminar guía"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Desktop List View */}
            {!isMobile && viewMode === 'list' && <DesktopListView />}
          </>
        )}
        
        {/* Export/Import Modal */}
        <ExportImportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={guides || []}
          dataType="guides"
          title="Exportar/Importar Guías"
          onImportSuccess={handleImportSuccess}
        />

        {/* Contact Inactive Guides Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Contactar Guías Inactivos</h3>
                    <p className="text-sm text-gray-600">{selectedInactiveGuides.length} guías sin asignaciones hoy</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Lista de guías inactivos */}
              <div className="mb-6 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 font-medium mb-2">Guías que recibirán el mensaje:</p>
                <div className="space-y-2">
                  {selectedInactiveGuides.map(guide => (
                    <div key={guide.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                          {guide.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{guide.fullName}</p>
                          <p className="text-xs text-gray-500">{guide.email} • {guide.phone}</p>
                        </div>
                      </div>
                      <span className="text-xs text-red-600">{guide.inactiveReason || 'Sin asignaciones'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario de mensaje */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto del mensaje
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Ej: Verificación de disponibilidad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Canales de envío:</strong> El mensaje se enviará por email y SMS a todos los guías seleccionados.
                    También aparecerá en el chat interno del sistema.
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-6 flex justify-end gap-3">
                <InteractiveButton
                  variant="secondary"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancelar
                </InteractiveButton>
                <InteractiveButton
                  variant="primary"
                  icon={PaperAirplaneIcon}
                  onClick={() => {
                    // Simular envío de mensajes
                    selectedInactiveGuides.forEach(guide => {
                      console.log(`Enviando mensaje a ${guide.fullName}: ${contactSubject}`);
                    });
                    
                    addNotification({
                      type: 'success',
                      title: 'Mensajes enviados',
                      message: `Se enviaron ${selectedInactiveGuides.length} mensajes a guías inactivos`
                    });
                    
                    setShowContactModal(false);
                    setContactMessage('');
                    setContactSubject('');
                    setSelectedInactiveGuides([]);
                  }}
                  disabled={!contactSubject.trim() || !contactMessage.trim()}
                >
                  Enviar mensaje
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidesManagement;