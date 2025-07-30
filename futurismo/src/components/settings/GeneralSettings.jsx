import React, { useState } from 'react';
import { 
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  LanguageIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useSettingsStore } from '../../stores/settingsStore';

const GeneralSettings = () => {
  const { 
    settings,
    updateGeneralSettings,
    hasUnsavedChanges,
    saveSettings,
    isLoading
  } = useSettingsStore();

  const [formData, setFormData] = useState(settings.general);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    updateGeneralSettings(formData);
    await saveSettings();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es requerido';
    }

    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Email inválido';
    }

    if (!formData.companyPhone.trim()) {
      newErrors.companyPhone = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const currencyOptions = [
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'PEN', label: 'Sol Peruano (PEN)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ];

  const timezoneOptions = [
    { value: 'America/Lima', label: 'Lima, Perú (UTC-5)' },
    { value: 'America/New_York', label: 'Nueva York (UTC-5/UTC-4)' },
    { value: 'Europe/London', label: 'Londres (UTC+0/UTC+1)' }
  ];

  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-3" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Configuración General
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Información de la empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-full">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Información de la Empresa
              </h4>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Empresa *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`pl-16 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Futurismo Tours"
                />
              </div>
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Teléfono de la Empresa *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleChange}
                  className={`pl-16 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
                    errors.companyPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+51 999 999 999"
                />
              </div>
              {errors.companyPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.companyPhone}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email de la Empresa *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className={`pl-16 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
                    errors.companyEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="info@futurismo.com"
                />
              </div>
              {errors.companyEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.companyEmail}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Sitio Web
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <GlobeAltIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="pl-16 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                  placeholder="https://futurismo.com"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Dirección de la Empresa
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="pl-16 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                  placeholder="Av. Larco 123, Miraflores, Lima"
                />
              </div>
            </div>
          </div>

          {/* Configuraciones regionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="col-span-full">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Configuraciones Regionales
              </h4>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Moneda por Defecto
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="pl-16 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  {currencyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Zona Horaria
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="pl-16 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  {timezoneOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Idioma del Sistema
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <LanguageIcon className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="pl-16 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Formato de Fecha
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleChange}
                  className="pl-16 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  {dateFormatOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Formato de Hora
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  name="timeFormat"
                  value={formData.timeFormat}
                  onChange={handleChange}
                  className="pl-16 pr-10 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="12h">12 horas (AM/PM)</option>
                  <option value="24h">24 horas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setFormData(settings.general)}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed order-first sm:order-last transition-colors font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
        
        {hasUnsavedChanges && (
          <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Tienes cambios sin guardar. No olvides guardar antes de salir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettings;