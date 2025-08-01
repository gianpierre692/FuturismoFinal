import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon, 
  UsersIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import ExcelButton from '../components/common/ExcelButton';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserFormSimple';
import ExportImportModal from '../components/common/ExportImportModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import useInteractiveAdmin from '../hooks/useInteractiveAdmin';
import { useUsersStore } from '../stores/usersStoreSimple';

const Users = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { deleteUser, getUsersStatistics, getAllUsers, importUsers } = useUsersStore();
  const { 
    isLoading, 
    confirmDialog, 
    confirmDelete, 
    handleSave, 
    handleExport,
    handleImport,
    handleBulkOperation,
    notify,
    closeConfirmDialog 
  } = useInteractiveAdmin();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setCurrentView('create');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setCurrentView('edit');
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setCurrentView('view');
  };

  const handleDeleteUser = async (user) => {
    const userName = `${user.firstName} ${user.lastName}`;
    await confirmDelete(userName, async () => {
      await deleteUser(user.id);
    });
  };

  const handleFormSubmit = async (userData) => {
    const isEdit = currentView === 'edit';
    await handleSave(
      async () => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentView('list');
        setSelectedUser(null);
      },
      'usuario',
      isEdit
    );
  };

  // Función para manejar operaciones en lote
  const handleBulkDelete = async () => {
    await handleBulkOperation(
      async (users) => {
        for (const user of users) {
          await deleteUser(user.id);
        }
      },
      selectedUsers,
      'Eliminar'
    );
    setSelectedUsers([]);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedUser(null);
  };

  const handleImportSuccess = async (importedData) => {
    if (importedData && Object.keys(importedData).length > 0) {
      const firstSheet = Object.values(importedData)[0];
      await handleImport(
        async () => {
          if (importUsers && typeof importUsers === 'function') {
            await importUsers(firstSheet);
          }
        },
        'usuarios.xlsx'
      );
      setShowExportModal(false);
    }
  };

  const handleExportUsers = async () => {
    await handleExport(async () => {
      const users = getAllUsers ? getAllUsers() : [];
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 1500));
      return users;
    });
  };

  const stats = getUsersStatistics ? getUsersStatistics() : {
    total: 45,
    active: 38,
    inactive: 7,
    byRole: {
      admin: 3,
      supervisor: 8,
      guide: 24,
      support: 10
    }
  };

  const renderHeader = () => {
    const titles = {
      list: 'Gestión de Usuarios',
      create: 'Nuevo Usuario',
      edit: `Editar Usuario`,
      view: `Detalles de Usuario`
    };

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          {currentView !== 'list' && (
            <button
              onClick={handleCancel}
              className="mr-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center">
            <UsersIcon className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {titles[currentView]}
            </h1>
          </div>
        </div>

        {currentView === 'list' && (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Mobile Search */}
            {isMobile && (
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              {/* Botón de eliminar en lote - solo si hay seleccionados */}
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  Eliminar ({selectedUsers.length})
                </button>
              )}
              
              <ExcelButton
                onClick={handleExportUsers}
                disabled={isLoading}
                text="Excel"
                className="text-sm sm:text-base"
              />
              
              <button
                onClick={() => setShowExportModal(true)}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm"
              >
                <DocumentArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Importar</span>
              </button>
              
              <button
                onClick={handleCreateUser}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Nuevo Usuario</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStatistics = () => {
    if (isMobile || currentView !== 'list') return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button 
          onClick={() => {
            setFilterRole('all');
            setFilterStatus('all');
            setSearchTerm('');
          }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </button>
        
        <button 
          onClick={() => {
            setFilterRole('all');
            setFilterStatus('active');
            setSearchTerm('');
          }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200 text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCircleIcon className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </button>

        <button 
          onClick={() => {
            setFilterRole('all');
            setFilterStatus('inactive');
            setSearchTerm('');
          }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all duration-200 text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <UserCircleIcon className="h-8 w-8 text-red-500 opacity-20" />
          </div>
        </button>

        <button 
          onClick={() => {
            setFilterRole('admin');
            setFilterStatus('all');
            setSearchTerm('');
          }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-purple-600">{stats.byRole?.admin || 0}</p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </button>
      </div>
    );
  };

  const renderFilters = () => {
    if (isMobile || currentView !== 'list') return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Desktop Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="guide">Guía</option>
              <option value="support">Soporte</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <FunnelIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Más filtros</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UserDetailsMobile = ({ user }) => {
    return (
      <div className="space-y-4">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.firstName}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-600">{user.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Contacto</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <PhoneIcon className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900">{user.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900">Desde {new Date(user.createdAt).toLocaleDateString('es-PE')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleEditUser(user)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Editar Usuario
          </button>
          <button
            onClick={() => handleDeleteUser(user)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    );
  };

  const UserDetailsDesktop = ({ user }) => {
    return (
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 lg:p-8">
          <div className="flex items-start space-x-6">
            <img
              src={user.avatar}
              alt={user.firstName}
              className="h-24 w-24 lg:h-32 lg:w-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-lg text-gray-600">{user.position}</p>
              <p className="text-gray-500">{user.department}</p>
              
              <div className="mt-4 flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
                
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <button
                onClick={() => handleEditUser(user)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CogIcon className="h-4 w-4 mr-2" />
                Editar Usuario
              </button>
              <button
                onClick={() => handleDeleteUser(user)}
                className="block w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
              Información de Contacto
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd className="text-sm text-gray-900">{user.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Usuario</dt>
                <dd className="text-sm text-gray-900">@{user.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="text-sm text-gray-900">Lima, Perú</dd>
              </div>
            </dl>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
              Información del Sistema
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Último Login</dt>
                <dd className="text-sm text-gray-900">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString('es-PE') + ' ' + 
                      new Date(user.lastLogin).toLocaleTimeString('es-PE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : 'Nunca'
                  }
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('es-PE')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Última Actualización</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString('es-PE')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ID de Usuario</dt>
                <dd className="text-sm text-gray-900 font-mono">{user.id}</dd>
              </div>
            </dl>
          </div>

          {/* Activity Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-gray-500" />
              Estadísticas de Actividad
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Sesiones Totales</dt>
                <dd className="text-sm text-gray-900">245</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tiempo Promedio</dt>
                <dd className="text-sm text-gray-900">2h 15m por sesión</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Acciones Realizadas</dt>
                <dd className="text-sm text-gray-900">1,542 acciones</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tasa de Actividad</dt>
                <dd className="text-sm text-gray-900">
                  <span className="text-green-600 font-semibold">85%</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Permissions */}
        {user.permissions && user.permissions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-500" />
              Permisos Asignados ({user.permissions.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {user.permissions.map((permission) => (
                <span
                  key={permission}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Inició sesión', time: 'Hace 2 horas', type: 'login' },
              { action: 'Actualizó perfil de cliente', time: 'Hace 3 horas', type: 'update' },
              { action: 'Creó nueva reserva', time: 'Hace 5 horas', type: 'create' },
              { action: 'Exportó reporte mensual', time: 'Ayer 16:30', type: 'export' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'login' ? 'bg-blue-500' :
                    activity.type === 'update' ? 'bg-yellow-500' :
                    activity.type === 'create' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                  <span className="text-sm text-gray-900">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
        {renderHeader()}
        {renderStatistics()}
        {renderFilters()}

        {currentView === 'list' && (
          <>
            <UserList
              onEdit={handleEditUser}
              onView={handleViewUser}
              onDelete={handleDeleteUser}
              searchTerm={searchTerm}
              filterRole={filterRole}
              filterStatus={filterStatus}
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              isLoading={isLoading}
            />

            {/* Mobile Stats Card */}
            {isMobile && (
              <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total Usuarios</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                    <p className="text-xs text-gray-600">Activos</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <UserForm
            user={selectedUser}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {currentView === 'view' && selectedUser && (
          isMobile ? 
            <UserDetailsMobile user={selectedUser} /> : 
            <UserDetailsDesktop user={selectedUser} />
        )}

        {/* Export/Import Modal */}
        <ExportImportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={getAllUsers ? getAllUsers() : []}
          dataType="users"
          title="Exportar/Importar Usuarios"
          onImportSuccess={handleImportSuccess}
        />

        {/* Info Card */}
        {currentView === 'list' && !isMobile && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <h4 className="font-semibold mb-2">Gestión Completa de Usuarios</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">Administra todos los aspectos relacionados con usuarios:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Creación y edición de perfiles completos</li>
                      <li>Asignación de roles y permisos granulares</li>
                      <li>Control de acceso y estados de usuario</li>
                      <li>Reseteo de contraseñas y credenciales</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2">Funcionalidades avanzadas disponibles:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Auditoría completa de actividades</li>
                      <li>Exportación masiva de usuarios (Excel/PDF)</li>
                      <li>Importación desde archivos Excel</li>
                      <li>Plantillas de importación descargables</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Componente de confirmación elegante */}
        {confirmDialog && (
          <ConfirmDialog
            isOpen={true}
            onClose={closeConfirmDialog}
            onConfirm={confirmDialog.onConfirm}
            title={confirmDialog.title}
            message={confirmDialog.message}
            type={confirmDialog.type}
            confirmText={confirmDialog.confirmText}
            cancelText={confirmDialog.cancelText}
            loading={isLoading}
            destructive={confirmDialog.destructive}
            details={confirmDialog.details}
          />
        )}
    </div>
  );
};

export default Users;