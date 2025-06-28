import { useState } from 'react';
import { XMarkIcon, PlusIcon, DocumentCheckIcon, TrashIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon, AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useForm, useFieldArray } from 'react-hook-form';
import useGuidesStore from '../../stores/guidesStore';

const GuideForm = ({ guide, onSave, onCancel }) => {
  const { languages = [], museums = [] } = useGuidesStore();
  const [activeTab, setActiveTab] = useState('personal'); // personal, languages, museums

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: guide?.fullName || '',
      dni: guide?.dni || '',
      phone: guide?.phone || '',
      email: guide?.email || '',
      address: guide?.address || '',
      guideType: guide?.guideType || 'freelance',
      languages: guide?.specializations?.languages || [{ code: '', level: 'principiante' }],
      museums: guide?.specializations?.museums || [{ name: '', expertise: 'principiante' }]
    }
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage
  } = useFieldArray({
    control,
    name: 'languages'
  });

  const {
    fields: museumFields,
    append: appendMuseum,
    remove: removeMuseum
  } = useFieldArray({
    control,
    name: 'museums'
  });

  const watchedLanguages = watch('languages');
  const watchedMuseums = watch('museums');

  const onSubmit = (data) => {
    const guideData = {
      fullName: data.fullName,
      dni: data.dni,
      phone: data.phone,
      email: data.email,
      address: data.address,
      guideType: data.guideType,
      specializations: {
        languages: data.languages.filter(lang => lang.code && lang.level),
        museums: data.museums.filter(museum => museum.name && museum.expertise)
      }
    };

    onSave(guideData);
  };

  const levelOptions = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
    { value: 'experto', label: 'Experto' },
    { value: 'nativo', label: 'Nativo' }
  ];

  const getAvailableLanguages = (currentIndex) => {
    const selectedCodes = watchedLanguages
      .map((lang, index) => index !== currentIndex ? lang.code : null)
      .filter(Boolean);
    
    return languages.filter(lang => !selectedCodes.includes(lang.code));
  };

  // Ya no necesitamos filtrar museos disponibles porque ahora es texto libre

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: UserIcon },
    { id: 'languages', label: 'Idiomas', icon: GlobeAltIcon },
    { id: 'museums', label: 'Conocimiento de Museos', icon: AcademicCapIcon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {guide ? 'Editar Guía' : 'Nuevo Guía'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {/* Tab: Información Personal */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('fullName', { required: 'El nombre completo es requerido' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: María Elena Torres Vásquez"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI *
                    </label>
                    <input
                      {...register('dni', { 
                        required: 'El DNI es requerido',
                        pattern: {
                          value: /^\d{8}$/,
                          message: 'El DNI debe tener 8 dígitos'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12345678"
                      maxLength="8"
                    />
                    {errors.dni && (
                      <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      {...register('phone', { required: 'El teléfono es requerido' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+51 987 654 321"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      {...register('email', { 
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo electrónico inválido'
                        }
                      })}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="maria.torres@futurismo.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    {...register('address', { required: 'La dirección es requerida' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Av. Grau 123, Miraflores, Lima"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Guía *
                  </label>
                  <select
                    {...register('guideType', { required: 'El tipo de guía es requerido' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="planta">Guía de Planta</option>
                    <option value="freelance">Guía Freelance</option>
                  </select>
                  {errors.guideType && (
                    <p className="mt-1 text-sm text-red-600">{errors.guideType.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Idiomas */}
            {activeTab === 'languages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">
                    Especialización en Idiomas
                  </h4>
                  <button
                    type="button"
                    onClick={() => appendLanguage({ code: '', level: 'principiante' })}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Agregar Idioma</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {languageFields.map((field, index) => {
                    const availableLanguages = getAvailableLanguages(index);
                    
                    return (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Idioma
                            </label>
                            <select
                              {...register(`languages.${index}.code`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Seleccionar idioma</option>
                              {availableLanguages.map(language => (
                                <option key={language.code} value={language.code}>
                                  {language.flag} {language.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nivel de Dominio
                            </label>
                            <select
                              {...register(`languages.${index}.level`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {levelOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {languageFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLanguage(index)}
                              className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Museos */}
            {activeTab === 'museums' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">
                    Conocimiento de Museos
                  </h4>
                  <button
                    type="button"
                    onClick={() => appendMuseum({ name: '', expertise: 'principiante' })}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Agregar Museo</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {museumFields.map((field, index) => {
                    return (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre del Museo
                            </label>
                            <input
                              {...register(`museums.${index}.name`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ej: Museo Nacional de Antropología"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nivel de Expertise
                            </label>
                            <select
                              {...register(`museums.${index}.expertise`)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {levelOptions.filter(opt => opt.value !== 'nativo').map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {museumFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMuseum(index)}
                              className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <DocumentCheckIcon className="w-4 h-4" />
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideForm;