import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useUsersStore } from '../../stores/usersStoreSimple';

const UserList = ({ onEdit, onView, onDelete }) => {
  const {
    getFilteredUsers,
    getUsersStatistics,
    getRoleStatistics,
    getRoles,
    toggleUserStatus,
    resetUserPassword,
    filters,
    setFilters,
    clearFilters
  } = useUsersStore();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [roles, setRoles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = () => {
    const filteredUsers = getFilteredUsers();
    const userStats = getUsersStatistics();
    const roleStatistics = getRoleStatistics();
    const systemRoles = getRoles();
    
    setUsers(filteredUsers);
    setStats(userStats);
    setRoleStats(roleStatistics);
    setRoles(systemRoles);
  };

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleStatusToggle = (userId) => {
    toggleUserStatus(userId);
    loadData();
  };

  const handlePasswordReset = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres resetear la contraseña de este usuario?')) {
      resetUserPassword(userId, 'temporal123');
      alert('Contraseña reseteada. Nueva contraseña temporal: temporal123');
    }
  };

  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role?.color || 'gray';
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || roleId;
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Nunca';
    const date = new Date(lastLogin);
    return date.toLocaleDateString('es-PE') + ' ' + date.toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const departments = [...new Set(users.map(user => user.department))];

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.administradores || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">Ag</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Agencias</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.agencias || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">G</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Guías Total</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.guias || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Planta / Freelance</p>
              <p className="text-lg font-bold text-gray-900">
                {roleStats.guiasPlanta || 0} / {roleStats.guiasFreelance || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={filters.search}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filtros
            </button>

            {Object.values(filters).some(v => v !== '') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todos los roles</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Guía
              </label>
              <select
                value={filters.guideType}
                onChange={(e) => handleFilterChange('guideType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todos los tipos</option>
                <option value="planta">Guía de Planta</option>
                <option value="freelance">Guía Freelance</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa/Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.firstName}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          @{user.username}
                        </div>
                        {user.role === 'agencia' && user.ruc && (
                          <div className="text-xs text-gray-400">
                            RUC: {user.ruc}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-800`}>
                      {getRoleName(user.role)}
                    </span>
                    {user.role === 'guia' && user.guideType && (
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.guideType === 'planta' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.guideType === 'planta' ? 'Planta' : 'Freelance'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-sm font-medium">{user.company}</div>
                    {user.role === 'guia' && user.specialties && (
                      <div className="text-xs text-gray-500">
                        {user.specialties.slice(0, 2).join(', ')}
                        {user.specialties.length > 2 && '...'}
                      </div>
                    )}
                    {user.role === 'agencia' && user.address && (
                      <div className="text-xs text-gray-500">
                        {user.address}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatLastLogin(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView && onView(user)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit && onEdit(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Editar usuario"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handlePasswordReset(user.id)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                        title="Resetear contraseña"
                      >
                        <KeyIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        className={`p-1 rounded ${
                          user.status === 'activo'
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={user.status === 'activo' ? 'Desactivar' : 'Activar'}
                      >
                        {user.status === 'activo' ? (
                          <XCircleIcon className="h-4 w-4" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => onDelete && onDelete(user)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Eliminar usuario"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(v => v !== '')
                ? 'No se encontraron usuarios con los filtros aplicados.'
                : 'Comienza creando un nuevo usuario.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;