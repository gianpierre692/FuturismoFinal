/**
 * Formulario de Tour con Validación Completa
 * 
 * EJEMPLO DE USO del sistema de validación implementado
 * Demuestra todas las características:
 * - Validación en tiempo real
 * - Sanitización automática
 * - Esquemas predefinidos
 * - Manejo de errores
 * - Feedback visual
 */

import { useState, useCallback } from 'react';
import useFormValidation from '../../hooks/useFormValidation.js';
import { tourismValidators } from '../../utils/validation.js';
import Logger from '../../utils/logger.js';

const ValidatedTourForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  mode = 'create' // create | edit
}) => {
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validadores asíncronos personalizados
  const asyncValidators = {
    code: async (code) => {
      // Simular validación de código único en servidor
      if (mode === 'create') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const exists = ['TOUR001', 'TOUR002', 'MP123456'].includes(code);
            resolve({
              isValid: !exists,
              errors: exists ? ['Código de tour ya existe'] : []
            });
          }, 500);
        });
      }
      return { isValid: true, errors: [] };
    }
  };

  // Hook de validación con esquema predefinido
  const {
    formData,
    errors,
    warnings,
    fieldStates,
    isValid,
    isDirty,
    isSubmitting,
    updateField,
    validateField,
    handleSubmit,
    reset,
    getFieldProps
  } = useFormValidation(initialData, {
    schemaName: 'tour', // Usar esquema predefinido
    validateOnChange: true,
    validateOnBlur: true,
    sanitizeOnChange: true,
    debounceMs: 300,
    asyncValidators,
    onValidationComplete: (result) => {
      Logger.debug('Validación completada:', result);
    }
  });

  // Manejar envío del formulario
  const handleFormSubmit = useCallback(async (validatedData) => {
    setSubmitStatus('submitting');
    
    try {
      await onSubmit(validatedData);
      setSubmitStatus('success');
      
      if (mode === 'create') {
        reset(); // Limpiar formulario después de crear
      }
    } catch (error) {
      Logger.error('Error enviando formulario:', error);
      setSubmitStatus('error');
      throw error; // Re-throw para que useFormValidation lo maneje
    }
  }, [onSubmit, mode, reset]);

  // Componente de campo con validación
  const ValidatedField = ({ 
    name, 
    label, 
    type = 'text', 
    required = false,
    placeholder = '',
    ...props 
  }) => {
    const fieldProps = getFieldProps(name);
    const hasError = fieldProps.error && fieldProps.error.length > 0;
    const hasWarning = warnings[name] && warnings[name].length > 0;
    const isValidating = fieldStates[name] === 'validating';

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <input
            type={type}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${hasError ? 'border-red-500 bg-red-50' : ''}
              ${fieldProps.isValid ? 'border-green-500 bg-green-50' : ''}
              ${isValidating ? 'border-yellow-500' : ''}
              ${!hasError && !fieldProps.isValid ? 'border-gray-300' : ''}
            `}
            placeholder={placeholder}
            {...fieldProps}
            {...props}
          />
          
          {/* Indicador de estado */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isValidating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
            )}
            {fieldProps.isValid && !isValidating && (
              <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            {hasError && !isValidating && (
              <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </div>
        </div>

        {/* Errores */}
        {hasError && (
          <div className="mt-1">
            {fieldProps.error.map((error, index) => (
              <p key={index} className="text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Advertencias */}
        {hasWarning && (
          <div className="mt-1">
            {warnings[name].map((warning, index) => (
              <p key={index} className="text-sm text-yellow-600">
                ⚠️ {warning}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Estado del formulario para mostrar al usuario
  const getFormStatus = () => {
    if (submitStatus === 'submitting' || isSubmitting) {
      return { type: 'loading', message: 'Enviando...' };
    }
    if (submitStatus === 'success') {
      return { type: 'success', message: 'Tour guardado exitosamente' };
    }
    if (submitStatus === 'error') {
      return { type: 'error', message: 'Error al guardar el tour' };
    }
    if (!isValid && isDirty) {
      return { type: 'warning', message: 'Hay errores en el formulario' };
    }
    return null;
  };

  const formStatus = getFormStatus();

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {mode === 'create' ? 'Crear Nuevo Tour' : 'Editar Tour'}
      </h2>

      {/* Estado del formulario */}
      {formStatus && (
        <div className={`
          mb-6 p-4 rounded-md
          ${formStatus.type === 'success' ? 'bg-green-50 border border-green-200' : ''}
          ${formStatus.type === 'error' ? 'bg-red-50 border border-red-200' : ''}
          ${formStatus.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : ''}
          ${formStatus.type === 'loading' ? 'bg-blue-50 border border-blue-200' : ''}
        `}>
          <div className="flex items-center">
            {formStatus.type === 'loading' && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
            )}
            <span className={`
              text-sm font-medium
              ${formStatus.type === 'success' ? 'text-green-800' : ''}
              ${formStatus.type === 'error' ? 'text-red-800' : ''}
              ${formStatus.type === 'warning' ? 'text-yellow-800' : ''}
              ${formStatus.type === 'loading' ? 'text-blue-800' : ''}
            `}>
              {formStatus.message}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleFormSubmit);
      }}>
        {/* Código del tour */}
        <ValidatedField
          name="code"
          label="Código del Tour"
          required
          placeholder="ej: TOUR001, MP123456"
        />

        {/* Nombre del tour */}
        <ValidatedField
          name="name"
          label="Nombre del Tour"
          required
          placeholder="ej: Machu Picchu Full Day"
        />

        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            rows="4"
            placeholder="Descripción detallada del tour..."
            {...getFieldProps('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha de inicio */}
          <ValidatedField
            name="startDate"
            label="Fecha de Inicio"
            type="date"
            required
          />

          {/* Fecha de fin */}
          <ValidatedField
            name="endDate"
            label="Fecha de Fin"
            type="date"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capacidad */}
          <ValidatedField
            name="capacity"
            label="Capacidad"
            type="number"
            required
            placeholder="ej: 20"
            min="1"
            max="50"
          />

          {/* Precio */}
          <ValidatedField
            name="price"
            label="Precio (USD)"
            type="number"
            required
            placeholder="ej: 150.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Estado */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <select
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.status ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            `}
            {...getFieldProps('status')}
          >
            <option value="">Seleccionar estado</option>
            <option value="programado">Programado</option>
            <option value="en_curso">En Curso</option>
            <option value="pausado">Pausado</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status[0]}</p>
          )}
        </div>

        {/* Información de debug en desarrollo */}
        {import.meta.env.DEV && (
          <details className="mb-4 p-3 bg-gray-50 rounded">
            <summary className="cursor-pointer text-sm font-medium text-gray-600">
              Debug Info (Solo en desarrollo)
            </summary>
            <div className="mt-2 text-xs">
              <p><strong>Form Valid:</strong> {isValid ? '✅' : '❌'}</p>
              <p><strong>Is Dirty:</strong> {isDirty ? '✅' : '❌'}</p>
              <p><strong>Errors:</strong> {Object.keys(errors).length}</p>
              <p><strong>Warnings:</strong> {Object.keys(warnings).length}</p>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
{JSON.stringify({ formData, errors, warnings }, null, 2)}
              </pre>
            </div>
          </details>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={reset}
            disabled={!isDirty}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resetear
          </button>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              mode === 'create' ? 'Crear Tour' : 'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ValidatedTourForm;