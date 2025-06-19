import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, Building2, Map, Shield, UserCheck } from 'lucide-react';

// Store y validación
import useAuthStore from '../stores/authStore';
import { loginSchema } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      
      if (result.success) {
        toast.success('¡Bienvenido a Futurismo!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error inesperado. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <span className="text-3xl text-white">🌎</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Futurismo</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión Turística B2B</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Correo electrónico
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="agencia@ejemplo.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Recordarme</span>
              </label>
              
              <a href="#" className="text-sm text-primary hover:text-primary-600">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              Acceso rápido - Usuarios de prueba:
            </p>
            <div className="space-y-2">
              {/* Botón Agencia */}
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'agencia@test.com');
                  setValue('password', 'agencia123');
                  setValue('remember', true);
                  handleSubmit(onSubmit)();
                }}
                className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary-600" />
                      Agencia de Viajes
                    </p>
                    <p className="text-sm text-gray-600">agencia@test.com</p>
                  </div>
                  <span className="text-xs text-primary-600 font-medium bg-primary-100 px-2 py-1 rounded">
                    B2B
                  </span>
                </div>
              </button>

              {/* Botón Guía */}
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'guia@test.com');
                  setValue('password', 'guia123');
                  setValue('remember', true);
                  handleSubmit(onSubmit)();
                }}
                className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Map className="w-4 h-4 text-secondary-600" />
                      Guía Turístico
                    </p>
                    <p className="text-sm text-gray-600">guia@test.com</p>
                  </div>
                  <span className="text-xs text-secondary-600 font-medium bg-secondary-100 px-2 py-1 rounded">
                    Operativo
                  </span>
                </div>
              </button>

              {/* Botón Guía Freelance */}
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'freelance@test.com');
                  setValue('password', 'freelance123');
                  setValue('remember', true);
                  handleSubmit(onSubmit)();
                }}
                className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      Guía Freelance
                    </p>
                    <p className="text-sm text-gray-600">freelance@test.com</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                    Freelance
                  </span>
                </div>
              </button>

              {/* Botón Admin */}
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'admin@futurismo.com');
                  setValue('password', 'admin123');
                  setValue('remember', true);
                  handleSubmit(onSubmit)();
                }}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-600" />
                      Administrador
                    </p>
                    <p className="text-sm text-gray-600">admin@futurismo.com</p>
                  </div>
                  <span className="text-xs text-gray-600 font-medium bg-gray-200 px-2 py-1 rounded">
                    Admin
                  </span>
                </div>
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Credenciales válidas para cada rol específico
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          © 2024 Futurismo. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;