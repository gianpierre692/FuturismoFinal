import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  KeyIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useUsersStore } from '../../stores/usersStore';

// Esquema de validación
const userSchema = yup.object({
  username: yup
    .string()
    .required('El nombre de usuario es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  firstName: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  lastName: yup
    .string()
    .required('El apellido es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido'),
  role: yup
    .string()
    .required('El rol es requerido'),
  department: yup
    .string()
    .required('El departamento es requerido'),
  position: yup
    .string()
    .required('El cargo es requerido'),
  status: yup
    .string()
    .required('El estado es requerido'),
  password: yup
    .string()
    .when('isEdit', {
      is: false,
      then: (schema) => schema.required('La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
      otherwise: (schema) => schema.min(6, 'Mínimo 6 caracteres')
    }),
  confirmPassword: yup
    .string()
    .when('password', {
      is: (password) => password && password.length > 0,
      then: (schema) => schema
        .required('Confirme la contraseña')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    })
});

const UserForm = ({ user = null, onSubmit, onCancel, isLoading = false }) => {
  const {
    getRoles,
    getPermissionsByModule,
    createUser,
    updateUser,
    validateUserData
  } = useUsersStore();

  const [roles, setRoles] = useState([]);
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(userSchema.concat(yup.object({ isEdit: yup.boolean().default(isEdit) }))),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      role: user?.role || '',
      department: user?.department || '',
      position: user?.position || '',
      status: user?.status || 'activo',
      avatar: user?.avatar || '',
      isEdit
    }
  });

  const selectedRole = watch('role');

  useEffect(() => {
    const systemRoles = getRoles();
    const permissions = getPermissionsByModule();
    setRoles(systemRoles);
    setPermissionsByModule(permissions);
    
    if (user?.permissions) {
      setSelectedPermissions(user.permissions);
    }
  }, []);

  // Auto-asignar permisos según el rol seleccionado
  useEffect(() => {
    if (selectedRole && !isEdit) {
      const rolePermissions = getRoleDefaultPermissions(selectedRole);
      setSelectedPermissions(rolePermissions);
    }
  }, [selectedRole, isEdit]);

  const getRoleDefaultPermissions = (roleId) => {
    const defaultPermissions = {
      admin: [
        'users.create', 'users.read', 'users.update', 'users.delete',
        'reservations.manage', 'guides.manage', 'reports.view', 'system.admin'
      ],
      supervisor: [
        'users.read', 'reservations.manage', 'guides.read', 'guides.assign',
        'monitoring.view', 'reports.view'
      ],
      ventas: [
        'reservations.create', 'reservations.read', 'reservations.update',
        'clients.manage', 'reports.basic'
      ],
      contador: [
        'reports.financial', 'reservations.read', 'clients.read', 'payments.manage'
      ],
      recepcionista: [
        'reservations.read', 'clients.read', 'guides.read', 'chat.access'
      ],
      marketing: [
        'reports.marketing', 'clients.read', 'reservations.read'
      ]
    };
    
    return defaultPermissions[roleId] || [];
  };

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleFormSubmit = async (data) => {
    const userData = {
      ...data,
      permissions: selectedPermissions,
      preferences: user?.preferences || {
        language: 'es',
        timezone: 'America/Lima',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    };

    // Validar datos del usuario
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      // Mostrar errores de validación
      Object.keys(validation.errors).forEach(field => {
        setValue(field, userData[field], { shouldValidate: true });
      });
      return;
    }

    try {
      if (isEdit) {
        updateUser(user.id, userData);
      } else {
        createUser(userData);
      }
      
      if (onSubmit) {
        onSubmit(userData);
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const departments = [
    'Administración',
    'Operaciones',
    'Ventas',
    'Finanzas',
    'Atención al Cliente',
    'Marketing',
    'Recursos Humanos',
    'TI'
  ];

  const tabs = [
    { id: 'basic', name: 'Información Básica', icon: UserIcon },
    { id: 'permissions', name: 'Permisos', icon: KeyIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Información Básica */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre de usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Usuario *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    {...register('username')}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="usuario123"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="usuario@empresa.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Juan"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Pérez"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+51 999999999"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  {...register('role')}
                  className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.role ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento *
                </label>
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    {...register('department')}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.department ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar departamento</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo *
                </label>
                <div className="relative">
                  <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    {...register('position')}
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.position ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ejecutivo de Ventas"
                  />
                </div>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                )}
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  {...register('status')}
                  className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.status ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Contraseña (solo para nuevo usuario o si se quiere cambiar) */}
            {(!isEdit || showPassword) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña {!isEdit && '*'}
                  </label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className={`pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña {!isEdit && '*'}
                  </label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className={`pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Botón para mostrar campos de contraseña en edición */}
            {isEdit && !showPassword && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowPassword(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Cambiar contraseña
                </button>
              </div>
            )}
          </div>
        )}

        {/* Permisos */}
        {activeTab === 'permissions' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Permisos del Usuario
            </h3>

            {Object.entries(permissionsByModule).map(([module, permissions]) => (
              <div key={module} className="space-y-3">
                <h4 className="font-medium text-gray-900 border-b pb-2">{module}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {selectedPermissions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay permisos seleccionados. El usuario tendrá acceso muy limitado al sistema.
              </p>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            <XMarkIcon className="h-4 w-4 mr-2 inline" />
            Cancelar
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            <CheckIcon className="h-4 w-4 mr-2 inline" />
            {isLoading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Usuario')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;