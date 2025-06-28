import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { XMarkIcon, DocumentCheckIcon, PlusIcon, TrashIcon, ExclamationTriangleIcon, ShieldCheckIcon, PhoneIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import useEmergencyStore from '../../stores/emergencyStore';

const ProtocolEditor = ({ protocol, onClose, onSave }) => {
  const { categories } = useEmergencyStore();
  const [selectedIcon, setSelectedIcon] = useState('🚨');

  const iconOptions = [
    '🚨', '🚑', '⛈️', '🚗', '🔍', '📡', '🏥', '👮', 
    '🚒', '⚠️', '📋', '🛡️', '📞', '💊', '🩹', '🔧'
  ];

  const contactTypes = [
    { value: 'emergency', label: 'Emergencia' },
    { value: 'coordinator', label: 'Coordinador' },
    { value: 'management', label: 'Gerencia' },
    { value: 'police', label: 'Policía' },
    { value: 'medical', label: 'Médico' },
    { value: 'insurance', label: 'Seguro' },
    { value: 'towing', label: 'Grúa' },
    { value: 'weather', label: 'Meteorológico' },
    { value: 'local', label: 'Local' },
    { value: 'operations', label: 'Operaciones' }
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: protocol?.title || '',
      description: protocol?.description || '',
      category: protocol?.category || '',
      priority: protocol?.priority || 'media',
      icon: protocol?.icon || '🚨',
      steps: protocol?.content?.steps?.map(step => ({ text: step })) || [{ text: '' }],
      contacts: protocol?.content?.contacts || [{ name: '', phone: '', type: 'emergency' }],
      materials: protocol?.content?.materials?.map(material => ({ name: material })) || [{ name: '' }]
    }
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep
  } = useFieldArray({
    control,
    name: 'steps'
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact
  } = useFieldArray({
    control,
    name: 'contacts'
  });

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial
  } = useFieldArray({
    control,
    name: 'materials'
  });

  const watchedIcon = watch('icon');

  useEffect(() => {
    setSelectedIcon(watchedIcon);
  }, [watchedIcon]);

  const onSubmit = (data) => {
    const protocolData = {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      icon: data.icon,
      content: {
        steps: data.steps.map(step => step.text).filter(text => text.trim() !== ''),
        contacts: data.contacts.filter(contact => contact.name && contact.phone),
        materials: data.materials.map(material => material.name).filter(name => name.trim() !== '')
      }
    };

    onSave(protocolData);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'border-red-300 bg-red-50';
      case 'media': return 'border-yellow-300 bg-yellow-50';
      case 'baja': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-500" />
            {protocol ? 'Editar Protocolo' : 'Nuevo Protocolo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Protocolo *
                </label>
                <input
                  {...register('title', { required: 'El título es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Protocolo Médico de Emergencia"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  {...register('category', { required: 'La categoría es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  {...register('priority')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getPriorityColor(watch('priority'))}`}
                >
                  <option value="baja">🟢 Baja</option>
                  <option value="media">🟡 Media</option>
                  <option value="alta">🔴 Alta</option>
                </select>
              </div>

              {/* Icono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono
                </label>
                <div className="flex items-center space-x-2">
                  <div className="text-3xl p-2 border border-gray-300 rounded-lg bg-gray-50">
                    {selectedIcon}
                  </div>
                  <select
                    {...register('icon')}
                    onChange={(e) => {
                      setValue('icon', e.target.value);
                      setSelectedIcon(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                {...register('description', { required: 'La descripción es requerida' })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe cuándo y cómo aplicar este protocolo..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Pasos del protocolo */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                  Pasos del Protocolo
                </h3>
                <button
                  type="button"
                  onClick={() => appendStep({ text: '' })}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Agregar Paso</span>
                </button>
              </div>

              <div className="space-y-3">
                {stepFields.map((field, index) => (
                  <div key={field.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <textarea
                        {...register(`steps.${index}.text`, { required: 'El paso es requerido' })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe el paso a seguir..."
                      />
                      {errors.steps?.[index]?.text && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.steps[index].text.message}
                        </p>
                      )}
                    </div>
                    {stepFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contactos de emergencia */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-2 text-red-500" />
                  Contactos de Emergencia
                </h3>
                <button
                  type="button"
                  onClick={() => appendContact({ name: '', phone: '', type: 'emergency' })}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Agregar Contacto</span>
                </button>
              </div>

              <div className="space-y-4">
                {contactFields.map((field, index) => (
                  <div key={field.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Contacto
                        </label>
                        <input
                          {...register(`contacts.${index}.name`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Ej: Emergencias Nacionales"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          {...register(`contacts.${index}.phone`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Ej: +51 999 888 777"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <div className="flex items-center space-x-2">
                          <select
                            {...register(`contacts.${index}.type`)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            {contactTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          {contactFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContact(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materiales necesarios */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />
                  Materiales Necesarios
                </h3>
                <button
                  type="button"
                  onClick={() => appendMaterial({ name: '' })}
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Agregar Material</span>
                </button>
              </div>

              <div className="space-y-2">
                {materialFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        {...register(`materials.${index}.name`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: Botiquín de primeros auxilios"
                      />
                    </div>
                    {materialFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Advertencia */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">
                    Importante
                  </h4>
                  <p className="text-yellow-800 text-sm">
                    Asegúrate de que todos los pasos sean claros y específicos. Los protocolos de emergencia 
                    deben ser fáciles de seguir bajo situaciones de estrés.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            * Campos obligatorios
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <DocumentCheckIcon className="w-4 h-4" />
              <span>{protocol ? 'Actualizar' : 'Guardar'} Protocolo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolEditor;