import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, ArrowPathIcon, BuildingOffice2Icon, MapIcon, ShieldCheckIcon, UserCircleIcon, UserPlusIcon, StarIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon, ChevronDownIcon, LanguageIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

// Componente de calificación con estrellas y experiencia multi-idioma (fuera del componente principal)
const StarRating = ({ museum, rating, experiences, onRatingChange, onExperienceChange, onAddLanguage, onRemoveLanguage, t }) => {
  const availableLanguages = [
    { code: 'es', name: t('auth.spanishExperience'), flag: '🇪🇸' },
    { code: 'en', name: t('auth.englishExperience'), flag: '🇺🇸' }
  ];

  const currentLanguages = (experiences && typeof experiences === 'object') ? Object.keys(experiences) : [];
  const unusedLanguages = availableLanguages.filter(lang => !currentLanguages.includes(lang.code));

  return (
    <div className="space-y-4 mt-2">
      {/* Calificación con estrellas */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600 mr-2">{t('auth.rateExperience')}</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(museum, star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            {star <= (rating || 0) ? (
              <StarIconSolid className="w-4 h-4 text-yellow-400" />
            ) : (
              <StarIcon className="w-4 h-4 text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {rating ? `${rating} ${t('auth.stars')}` : ''}
        </span>
      </div>

      {/* Experiencias por idioma */}
      <div className="space-y-3">
        <label className="text-xs text-gray-600 block">{t('auth.describeExperience')}</label>
        
        {/* Experiencias existentes */}
        {currentLanguages.map((langCode) => {
          const language = availableLanguages.find(l => l.code === langCode);
          return (
            <div key={langCode} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{language?.flag}</span>
                  <span className="text-xs font-medium text-gray-700">{language?.name}</span>
                </div>
                {currentLanguages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveLanguage(museum, langCode)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    title={t('auth.removeLanguageExperience')}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              <textarea
                value={(experiences && experiences[langCode]) || ''}
                onChange={(e) => onExperienceChange(museum, langCode, e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows="3"
                placeholder={t('auth.experiencePlaceholder')}
              />
            </div>
          );
        })}

        {/* Botón para agregar otro idioma */}
        {unusedLanguages.length > 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">{t('auth.addLanguageExperience')}</p>
              <div className="flex justify-center gap-2">
                {unusedLanguages.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => onAddLanguage(museum, language.code)}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors"
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                    <PlusIcon className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Si no hay experiencias, inicializar automáticamente español */}
        {currentLanguages.length === 0 && (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🇪🇸</span>
              <span className="text-xs font-medium text-gray-700">{t('auth.spanishExperience')}</span>
            </div>
            <textarea
              value=""
              onChange={(e) => {
                // Inicializar español automáticamente
                onExperienceChange(museum, 'es', e.target.value);
              }}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows="3"
              placeholder={t('auth.experiencePlaceholder')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

import useAuthStore from '../stores/authStore';
import { loginSchema, freelanceGuideRegisterSchema } from '../utils/validators';
import ImageUpload from '../components/common/ImageUpload';
import LanguageToggle from '../components/common/LanguageToggle';

const LoginRegister = () => {
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedMuseums, setSelectedMuseums] = useState([]);
  const [museumRatings, setMuseumRatings] = useState({});
  const [museumExperiences, setMuseumExperiences] = useState({});
  const [museumSearchTerm, setMuseumSearchTerm] = useState('');
  const [showMuseumDropdown, setShowMuseumDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const museumDropdownRef = useRef(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
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
      museums: [],
      museumRatings: {},
      museumExperiences: {},
      acceptTerms: false,
      profileImage: null
    } : {
      email: '',
      password: '',
      remember: false
    }
  });

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (museumDropdownRef.current && !museumDropdownRef.current.contains(event.target)) {
        setShowMuseumDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      if (isRegistering) {
        const registerData = {
          ...data,
          role: 'guide',
          guideType: 'freelance',
          languages: selectedLanguages,
          specialties: selectedSpecialties,
          museums: selectedMuseums,
          museumRatings: museumRatings,
          museumExperiences: museumExperiences,
          profileImage: profileImage
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
    setSelectedLanguages([]);
    setSelectedSpecialties([]);
    setSelectedMuseums([]);
    setMuseumRatings({});
    setMuseumExperiences({});
    setMuseumSearchTerm('');
    setShowMuseumDropdown(false);
    setProfileImage(null);
    setImageError(null);
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

  const museumOptions = [
    { value: 'larco', label: t('auth.larcoMuseum') },
    { value: 'gold', label: t('auth.goldMuseum') },
    { value: 'national', label: t('auth.nationalMuseum') },
    { value: 'art', label: t('auth.artMuseum') },
    { value: 'archaeology', label: t('auth.archaeologyMuseum') },
    { value: 'history', label: t('auth.historyMuseum') },
    { value: 'contemporary', label: t('auth.contemporaryArt') },
    { value: 'colonial', label: t('auth.colonialArt') }
  ];

  const handleLanguageToggle = (language) => {
    const updatedLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(updatedLanguages);
    setValue('languages', updatedLanguages);
  };

  const handleSpecialtyToggle = (specialty) => {
    const updatedSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    setSelectedSpecialties(updatedSpecialties);
    setValue('specialties', updatedSpecialties);
  };

  const handleAddMuseum = (museum) => {
    if (!selectedMuseums.includes(museum)) {
      const updatedMuseums = [...selectedMuseums, museum];
      setSelectedMuseums(updatedMuseums);
      setValue('museums', updatedMuseums);

      // Inicializar experiencia en español por defecto
      const updatedExperiences = {
        ...museumExperiences,
        [museum]: {
          es: ''
        }
      };
      setMuseumExperiences(updatedExperiences);
      setValue('museumExperiences', updatedExperiences);
    }
    setMuseumSearchTerm('');
    setShowMuseumDropdown(false);
  };

  const handleRemoveMuseum = (museum) => {
    const updatedMuseums = selectedMuseums.filter(m => m !== museum);
    setSelectedMuseums(updatedMuseums);
    setValue('museums', updatedMuseums);

    // Eliminar calificación y experiencia del museo removido
    const updatedRatings = { ...museumRatings };
    const updatedExperiences = { ...museumExperiences };
    delete updatedRatings[museum];
    delete updatedExperiences[museum];
    setMuseumRatings(updatedRatings);
    setMuseumExperiences(updatedExperiences);
    setValue('museumRatings', updatedRatings);
    setValue('museumExperiences', updatedExperiences);
  };

  // Filtrar museos basado en la búsqueda
  const filteredMuseums = museumOptions.filter(museum =>
    !selectedMuseums.includes(museum.value) &&
    museum.label.toLowerCase().includes(museumSearchTerm.toLowerCase())
  );

  const handleRatingChange = (museum, rating) => {
    const updatedRatings = {
      ...museumRatings,
      [museum]: rating
    };
    setMuseumRatings(updatedRatings);
    setValue('museumRatings', updatedRatings);
  };

  const handleExperienceChange = (museum, language, experience) => {
    const updatedExperiences = {
      ...museumExperiences,
      [museum]: {
        ...(museumExperiences[museum] || {}),
        [language]: experience
      }
    };
    setMuseumExperiences(updatedExperiences);
    setValue('museumExperiences', updatedExperiences);
  };

  const addExperienceLanguage = (museum, language) => {
    const updatedExperiences = {
      ...museumExperiences,
      [museum]: {
        ...(museumExperiences[museum] || {}),
        [language]: ''
      }
    };
    setMuseumExperiences(updatedExperiences);
    setValue('museumExperiences', updatedExperiences);
  };

  const removeExperienceLanguage = (museum, language) => {
    const updatedExperiences = { ...museumExperiences };
    if (updatedExperiences[museum]) {
      delete updatedExperiences[museum][language];
      // Si no quedan idiomas, eliminar el museo completamente
      if (Object.keys(updatedExperiences[museum]).length === 0) {
        delete updatedExperiences[museum];
      }
    }
    setMuseumExperiences(updatedExperiences);
    setValue('museumExperiences', updatedExperiences);
  };

  const handleImageSelect = (file, error) => {
    if (error) {
      setImageError(error);
      setProfileImage(null);
      setValue('profileImage', null);
    } else {
      setImageError(null);
      setProfileImage(file);
      setValue('profileImage', file);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <div className={`w-full ${isRegistering ? 'max-w-4xl' : 'max-w-md'}`}>
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <span className="text-3xl text-white">🌎</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Futurismo</h1>
          <p className="text-gray-600 mt-2">{t('auth.systemTitle')}</p>
        </div>

        {/* Selector de idioma */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
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
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-2"
            >
              {isRegistering ? (
                <>
                  <ArrowPathIcon className="w-4 h-4" />
                  {t('auth.alreadyHaveAccount')}
                </>
              ) : (
                <>
                  <UserPlusIcon className="w-4 h-4" />
                  {t('auth.dontHaveAccount')}
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isRegistering ? (
              // Formulario de registro
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre completo */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="label">
                    {t('auth.name')}
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className={`input ${errors.name ? 'input-error' : ''}`}
                    placeholder="Juan Pérez García"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

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
                    placeholder="juan@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="label">
                    {t('auth.phone')}
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className={`input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="+51 987654321"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* DNI */}
                <div>
                  <label htmlFor="dni" className="label">
                    {t('auth.dni')}
                  </label>
                  <input
                    {...register('dni')}
                    type="text"
                    id="dni"
                    className={`input ${errors.dni ? 'input-error' : ''}`}
                    placeholder="12345678"
                  />
                  {errors.dni && (
                    <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
                  )}
                </div>

                {/* Ciudad */}
                <div>
                  <label htmlFor="city" className="label">
                    {t('auth.city')}
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    id="city"
                    className={`input ${errors.city ? 'input-error' : ''}`}
                    placeholder="Lima, Perú"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="label">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 stroke-2" />
                      ) : (
                        <EyeIcon className="w-5 h-5 stroke-2" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="label">
                    {t('auth.confirmPassword')}
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    id="confirmPassword"
                    className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Años de experiencia */}
                <div className="md:col-span-2">
                  <label htmlFor="experience" className="label">
                    {t('auth.experience')}
                  </label>
                  <input
                    {...register('experience')}
                    type="number"
                    id="experience"
                    min="0"
                    max="50"
                    className={`input ${errors.experience ? 'input-error' : ''}`}
                    placeholder="5"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>

                {/* Foto de perfil */}
                <div className="md:col-span-2">
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    initialImage={profileImage}
                    error={imageError || errors.profileImage?.message}
                  />
                </div>

                {/* Idiomas */}
                <div className="md:col-span-2">
                  <label className="label">{t('auth.languages')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {languageOptions.map((language) => (
                      <label
                        key={language.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedLanguages.includes(language.value)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language.value)}
                          onChange={() => handleLanguageToggle(language.value)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{language.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.languages && (
                    <p className="mt-1 text-sm text-red-600">{errors.languages.message}</p>
                  )}
                </div>

                {/* Especialidades */}
                <div className="md:col-span-2">
                  <label className="label">{t('auth.specialties')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {specialtyOptions.map((specialty) => (
                      <label
                        key={specialty.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedSpecialties.includes(specialty.value)
                            ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSpecialties.includes(specialty.value)}
                          onChange={() => handleSpecialtyToggle(specialty.value)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{specialty.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specialties && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialties.message}</p>
                  )}
                </div>

                {/* Experiencia en Museos */}
                <div className="md:col-span-2">
                  <label className="label">{t('auth.museumExperience')}</label>
                  
                  {/* Select con búsqueda */}
                  <div className="relative mt-2" ref={museumDropdownRef}>
                    <div className="relative">
                      <input
                        type="text"
                        value={museumSearchTerm}
                        onChange={(e) => {
                          setMuseumSearchTerm(e.target.value);
                          setShowMuseumDropdown(true);
                        }}
                        onFocus={() => setShowMuseumDropdown(true)}
                        className="w-full input pr-10"
                        placeholder={t('auth.searchMuseums')}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Dropdown de museos */}
                    {showMuseumDropdown && filteredMuseums.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredMuseums.map((museum) => (
                          <button
                            key={museum.value}
                            type="button"
                            onClick={() => handleAddMuseum(museum.value)}
                            className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-2 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4 text-orange-600" />
                            {museum.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Museos seleccionados */}
                  {selectedMuseums.length > 0 && (
                    <div className="space-y-4 mt-4">
                      {selectedMuseums.map((museumValue) => {
                        const museum = museumOptions.find(m => m.value === museumValue);
                        return (
                          <div key={museumValue} className="border border-orange-200 rounded-lg bg-orange-50">
                            {/* Header del museo seleccionado */}
                            <div className="flex items-center justify-between p-3 border-b border-orange-200">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="font-medium text-orange-700">{museum?.label}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveMuseum(museumValue)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                title={t('auth.removeMuseum')}
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {/* Calificación y experiencia */}
                            <div className="p-3">
                              <StarRating
                                museum={museumValue}
                                rating={museumRatings[museumValue]}
                                experiences={museumExperiences[museumValue]}
                                onRatingChange={handleRatingChange}
                                onExperienceChange={handleExperienceChange}
                                onAddLanguage={addExperienceLanguage}
                                onRemoveLanguage={removeExperienceLanguage}
                                t={t}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {errors.museums && (
                    <p className="mt-1 text-sm text-red-600">{errors.museums.message}</p>
                  )}
                </div>

                {/* Términos y condiciones */}
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      {...register('acceptTerms')}
                      type="checkbox"
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('auth.acceptTerms')}</span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>
            ) : (
              // Formulario de login
              <>
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
                      className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 stroke-2" />
                      ) : (
                        <EyeIcon className="w-5 h-5 stroke-2" />
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
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  {isRegistering ? t('auth.registering') : t('auth.loggingIn')}
                </>
              ) : (
                isRegistering ? t('auth.register') : t('auth.login')
              )}
            </button>
          </form>

          {/* Demo credentials - Solo para login */}
          {!isRegistering && (
            <>
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
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          {t('auth.copyright')}
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;