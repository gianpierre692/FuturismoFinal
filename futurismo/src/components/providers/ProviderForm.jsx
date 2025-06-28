import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { XMarkIcon, DocumentCheckIcon, BuildingOffice2Icon, PhoneIcon, EnvelopeIcon, MapPinIcon, StarIcon, UserGroupIcon, CurrencyDollarIcon, TagIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import useProvidersStore from '../../stores/providersStore';

// Esquema de validación
const providerSchema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  category: yup.string().required('La categoría es requerida'),
  location: yup.string().required('La ubicación es requerida'),
  'contact.contactPerson': yup.string().required('El contacto es requerido'),
  'contact.phone': yup.string().required('El teléfono es requerido'),
  'contact.email': yup.string().email('Email inválido').required('El email es requerido'),
  'contact.address': yup.string().required('La dirección es requerida'),
  'pricing.basePrice': yup.number().positive('Debe ser mayor a 0').required('El precio es requerido'),
  'pricing.type': yup.string().required('El tipo de precio es requerido'),
  rating: yup.number().min(0).max(5).required('La calificación es requerida'),
  capacity: yup.number().positive('Debe ser mayor a 0')
});

const ProviderForm = ({ provider, onSave, onCancel }) => {
  const { locations, categories } = useProvidersStore();
  const [services, setServices] = useState(provider?.services || ['']);
  const [specialties, setSpecialties] = useState(provider?.specialties || []);
  const [languages, setLanguages] = useState(provider?.languages || []);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(providerSchema),
    defaultValues: {
      name: provider?.name || '',
      category: provider?.category || '',
      location: provider?.location || '',
      contact: {
        contactPerson: provider?.contact?.contactPerson || '',
        phone: provider?.contact?.phone || '',
        email: provider?.contact?.email || '',
        address: provider?.contact?.address || ''
      },
      pricing: {
        basePrice: provider?.pricing?.basePrice || 0,
        type: provider?.pricing?.type || 'per_person',
        currency: provider?.pricing?.currency || 'PEN'
      },
      rating: provider?.rating || 4.0,
      capacity: provider?.capacity || ''
    }
  });

  const selectedCategory = watch('category');

  // Inicializar servicios cuando se carga el proveedor
  useEffect(() => {
    if (provider) {
      setServices(provider.services || ['']);
      setSpecialties(provider.specialties || []);
      setLanguages(provider.languages || []);
    }
  }, [provider]);

  const handleAddService = () => {
    setServices([...services, '']);
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index, value) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (index) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      services: services.filter(s => s.trim()),
      specialties: specialties,
      languages: languages,
      active: true
    };
    
    onSave(formattedData);
  };

  const pricingTypes = [
    { value: 'per_night', label: 'Por noche' },
    { value: 'per_person', label: 'Por persona' },
    { value: 'per_day', label: 'Por día' },
    { value: 'per_hour', label: 'Por hora' }
  ];

  const availableLanguages = [
    'Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 
    'Portugués', 'Quechua', 'Aymara', 'Japonés', 'Mandarín'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {provider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h2>
          <button
            onClick={onCancel}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proveedor *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Hotel Las Dunas"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  {...register('category')}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación *
                </label>
                <select
                  {...register('location')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar ubicación</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}, {location.region}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...register('rating')}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">/5</span>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                )}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-blue-500" />
                Información de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persona de Contacto *
                  </label>
                  <input
                    type="text"
                    {...register('contact.contactPerson')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: María González"
                  />
                  {errors.contact?.contactPerson && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    {...register('contact.phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: +51 956 123 456"
                  />
                  {errors.contact?.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('contact.email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: contacto@proveedor.com"
                  />
                  {errors.contact?.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    {...register('contact.address')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Av. Principal 123"
                  />
                  {errors.contact?.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Precios y capacidad */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-500" />
                Precios y Capacidad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Base *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('pricing.basePrice')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 120.00"
                  />
                  {errors.pricing?.basePrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.pricing.basePrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Precio *
                  </label>
                  <select
                    {...register('pricing.type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {pricingTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('capacity')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 50"
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Servicios */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <TagIcon className="w-5 h-5 mr-2 text-purple-500" />
                Servicios Ofrecidos
              </h3>
              
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Hospedaje, Desayuno, etc."
                    />
                    {services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddService}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Agregar servicio</span>
                </button>
              </div>
            </div>

            {/* Especialidades y idiomas (solo para guías) */}
            {selectedCategory === 'guias_locales' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Especialidades e Idiomas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Especialidades */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidades
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Machu Picchu, Valle Sagrado"
                        />
                        <button
                          type="button"
                          onClick={handleAddSpecialty}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {specialty}
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialty(index)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Idiomas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idiomas
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <select
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar idioma</option>
                          {availableLanguages.filter(lang => !languages.includes(lang)).map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleAddLanguage}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {languages.map((language, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {language}
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(index)}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
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
            <span>{provider ? 'Actualizar' : 'Guardar'} Proveedor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderForm;