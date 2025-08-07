import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, ArrowPathIcon, BuildingOffice2Icon, MapIcon, ShieldCheckIcon, UserCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

// BuildingStorefrontIcon y validación
import useAuthStore from '../stores/authStore';
import { loginSchema, freelanceGuideRegisterSchema } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(isRegistering ? freelanceGuideRegisterSchema : loginSchema),
    defaultValues: isRegistering ? {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dni: '',
      city: '',
      languages: [],
      experience: 0,
      specialties: [],
      acceptTerms: false
    } : {
      email: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data) => {
    try {
      if (isRegistering) {
        const registerData = {
          ...data,
          role: 'guide',
          guideType: 'freelance'
        };
        const result = await registerUser(registerData);
        
        if (result.success) {
          toast.success(t('auth.registerSuccess'));
          navigate('/dashboard');
        } else {
          toast.error(result.error || t('auth.registerError'));
        }
      } else {
        const result = await login(data);
        
        if (result.success) {
          toast.success(t('auth.welcome'));
          navigate('/dashboard');
        } else {
          toast.error(result.error || t('auth.loginError'));
        }
      }
    } catch (error) {
      toast.error(t('auth.unexpectedError'));
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    reset();
    setShowPassword(false);
  };

  // Opciones para idiomas y especialidades
  const languageOptions = [
    { value: 'spanish', label: t('auth.spanish') },
    { value: 'english', label: t('auth.english') },
    { value: 'portuguese', label: t('auth.portuguese') },
    { value: 'french', label: t('auth.french') },
    { value: 'german', label: t('auth.german') },
    { value: 'italian', label: t('auth.italian') },
    { value: 'japanese', label: t('auth.japanese') },
    { value: 'chinese', label: t('auth.chinese') }
  ];

  const specialtyOptions = [
    { value: 'history', label: t('auth.historyTours') },
    { value: 'nature', label: t('auth.natureTours') },
    { value: 'culture', label: t('auth.culturalTours') },
    { value: 'adventure', label: t('auth.adventureTours') },
    { value: 'gastronomy', label: t('auth.gastronomyTours') },
    { value: 'city', label: t('auth.cityTours') },
    { value: 'photography', label: t('auth.photographyTours') },
    { value: 'religious', label: t('auth.religiousTours') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <span className="text-3xl text-white">🌎</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Futurismo</h1>
          <p className="text-gray-600 mt-2">{t('auth.systemTitle')}</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isRegistering ? t('auth.registerAsGuide') : t('auth.login')}
            </h2>
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {isRegistering ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                {t('auth.email')}
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
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`input pr-12 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
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
                <span className="ml-2 text-sm text-gray-700">{t('auth.rememberMe')}</span>
              </label>
              
              <a href="#" className="text-sm text-primary hover:text-primary-600">
                {t('auth.forgotPassword')}
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
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  {t('auth.loggingIn')}
                </>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              {t('auth.quickAccess')}
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
                      <BuildingOffice2Icon className="w-4 h-4 text-primary-600" />
                      {t('auth.travelAgency')}
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
                      <MapIcon className="w-4 h-4 text-secondary-600" />
                      {t('auth.tourGuide')}
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
                      <UserCircleIcon className="w-4 h-4 text-green-600" />
                      {t('auth.freelanceGuide')}
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
                      <ShieldCheckIcon className="w-4 h-4 text-gray-600" />
                      {t('auth.administrator')}
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
              {t('auth.validCredentials')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          {t('auth.copyright')}
        </p>
      </div>
    </div>
  );
};

export default Login;