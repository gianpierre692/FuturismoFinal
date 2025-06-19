import React, { useState } from 'react';
import { 
  MapIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useSettingsStore } from '../../stores/settingsStore';

const ToursSettings = () => {
  const { 
    settings,
    updateToursSettings,
    hasUnsavedChanges,
    saveSettings,
    isLoading
  } = useSettingsStore();

  const [formData, setFormData] = useState(settings.tours);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleWorkingHoursChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value
      }
    }));
  };

  const handlePriceRangeChange = (range, field, value) => {
    setFormData(prev => ({
      ...prev,
      priceRanges: {
        ...prev.priceRanges,
        [range]: {
          ...prev.priceRanges[range],
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    updateToursSettings(formData);
    await saveSettings();
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.maxCapacityPerTour < 1) {
      newErrors.maxCapacityPerTour = 'La capacidad máxima debe ser mayor a 0';
    }

    if (formData.minAdvanceBooking < 1) {
      newErrors.minAdvanceBooking = 'El tiempo mínimo debe ser mayor a 0';
    }

    if (formData.maxAdvanceBooking < formData.minAdvanceBooking) {
      newErrors.maxAdvanceBooking = 'El tiempo máximo debe ser mayor al mínimo';
    }

    if (formData.defaultDuration < 0.5) {
      newErrors.defaultDuration = 'La duración debe ser al menos 30 minutos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-6">
          <MapIcon className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Configuración de Tours y Servicios
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configuraciones básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-4 border-b pb-2">
                Configuraciones Básicas
              </h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad Máxima por Tour *
              </label>
              <div className="relative">
                <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="maxCapacityPerTour"
                  value={formData.maxCapacityPerTour}
                  onChange={handleChange}
                  min="1"
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.maxCapacityPerTour ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="20"
                />
              </div>
              {errors.maxCapacityPerTour && (
                <p className="mt-1 text-sm text-red-600">{errors.maxCapacityPerTour}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración por Defecto (horas) *
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="defaultDuration"
                  value={formData.defaultDuration}
                  onChange={handleChange}
                  min="0.5"
                  step="0.5"
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.defaultDuration ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="4"
                />
              </div>
              {errors.defaultDuration && (
                <p className="mt-1 text-sm text-red-600">{errors.defaultDuration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reserva Mínima Anticipada (horas) *
              </label>
              <input
                type="number"
                name="minAdvanceBooking"
                value={formData.minAdvanceBooking}
                onChange={handleChange}
                min="1"
                className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minAdvanceBooking ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="24"
              />
              {errors.minAdvanceBooking && (
                <p className="mt-1 text-sm text-red-600">{errors.minAdvanceBooking}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reserva Máxima Anticipada (días) *
              </label>
              <input
                type="number"
                name="maxAdvanceBooking"
                value={formData.maxAdvanceBooking}
                onChange={handleChange}
                min="1"
                className={`px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxAdvanceBooking ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="365"
              />
              {errors.maxAdvanceBooking && (
                <p className="mt-1 text-sm text-red-600">{errors.maxAdvanceBooking}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Política de Cancelación (horas antes)
              </label>
              <input
                type="number"
                name="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={handleChange}
                min="0"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="24"
              />
              <p className="mt-1 text-xs text-gray-500">
                Horas antes del tour para cancelación gratuita
              </p>
            </div>
          </div>

          {/* Horarios de trabajo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-4 border-b pb-2">
                Horarios de Trabajo
              </h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Inicio
              </label>
              <input
                type="time"
                value={formData.workingHours.start}
                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Fin
              </label>
              <input
                type="time"
                value={formData.workingHours.end}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Configuraciones de precios */}
          <div className="space-y-4">
            <div className="col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-4 border-b pb-2">
                Rangos de Precios (USD)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(formData.priceRanges).map(([range, values]) => (
                <div key={range} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 capitalize">
                    {range === 'budget' ? 'Económico' : 
                     range === 'standard' ? 'Estándar' :
                     range === 'premium' ? 'Premium' : 'Lujo'}
                  </h5>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600">Mínimo</label>
                      <input
                        type="number"
                        value={values.min}
                        onChange={(e) => handlePriceRangeChange(range, 'min', e.target.value)}
                        min="0"
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Máximo</label>
                      <input
                        type="number"
                        value={values.max}
                        onChange={(e) => handlePriceRangeChange(range, 'max', e.target.value)}
                        min="0"
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuraciones adicionales */}
          <div className="space-y-4">
            <div className="col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-4 border-b pb-2">
                Configuraciones Adicionales
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowPartialPayments"
                    checked={formData.allowPartialPayments}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Permitir pagos parciales
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requireGuideAssignment"
                    checked={formData.requireGuideAssignment}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Requerir asignación de guía
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoAssignGuides"
                    checked={formData.autoAssignGuides}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Auto-asignar guías disponibles
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => setFormData(settings.tours)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>

        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Tienes cambios sin guardar. No olvides guardar antes de salir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursSettings;