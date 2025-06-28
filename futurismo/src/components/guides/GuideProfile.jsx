import { XMarkIcon, PencilIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon, TrophyIcon, GlobeAltIcon, AcademicCapIcon, UserIcon, StarIcon, ClockIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import useGuidesStore from '../../stores/guidesStore';

const GuideProfile = ({ guide, onClose, onEdit }) => {
  const { languages = [], museums = [] } = useGuidesStore();

  const getLanguageInfo = (langCode) => {
    return languages.find(lang => lang.code === langCode) || { name: langCode, flag: '🌐' };
  };

  const getMuseumInfo = (museumName) => {
    return { name: museumName || 'Museo sin nombre' };
  };

  const getLevelBadge = (level) => {
    const levels = {
      'principiante': { color: 'bg-yellow-100 text-yellow-800', text: 'Principiante', icon: '🌱' },
      'intermedio': { color: 'bg-blue-100 text-blue-800', text: 'Intermedio', icon: '📈' },
      'avanzado': { color: 'bg-green-100 text-green-800', text: 'Avanzado', icon: '🎯' },
      'experto': { color: 'bg-purple-100 text-purple-800', text: 'Experto', icon: '👑' },
      'nativo': { color: 'bg-indigo-100 text-indigo-800', text: 'Nativo', icon: '🏠' }
    };
    
    const levelInfo = levels[level] || { color: 'bg-gray-100 text-gray-800', text: level, icon: '📋' };
    return { ...levelInfo };
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl"
          >
            {(guide?.fullName || 'G').split(' ').map(name => name[0]).join('').substring(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{guide?.fullName || 'Sin nombre'}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                guide?.guideType === 'planta' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {guide?.guideType === 'planta' ? 'Guía de Planta' : 'Guía Freelance'}
              </span>
              <div className="flex items-center space-x-1">
                {getRatingStars(guide?.stats?.rating || 0)}
                <span className="text-sm text-gray-600 ml-1">({guide?.stats?.rating || 0}/5)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit(guide)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información personal */}
        <div className="lg:col-span-1 space-y-6">
          {/* Información de contacto */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
              Información Personal
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-medium">DNI</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{guide?.dni || 'Sin DNI'}</p>
                  <p className="text-sm text-gray-600">Documento de identidad</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{guide?.phone || 'Sin teléfono'}</p>
                  <p className="text-sm text-gray-600">Teléfono</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{guide?.email || 'Sin email'}</p>
                  <p className="text-sm text-gray-600">Correo electrónico</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                  <MapPinIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{guide?.address || 'Sin dirección'}</p>
                  <p className="text-sm text-gray-600">Dirección</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Estadísticas
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{guide?.stats?.toursCompleted || 0}</p>
                <p className="text-sm text-blue-700">Tours Completados</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{guide?.stats?.yearsExperience || 0}</p>
                <p className="text-sm text-green-700">Años de Experiencia</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrophyIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">{guide?.stats?.certifications || 0}</p>
                <p className="text-sm text-yellow-700">Certificaciones</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">{guide?.stats?.rating || 0}</p>
                <p className="text-sm text-purple-700">Calificación</p>
              </div>
            </div>
          </div>

          {/* Fechas importantes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-indigo-500" />
              Información Adicional
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  guide?.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {guide?.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fecha de registro</span>
                <span className="text-sm font-medium text-gray-900">
                  {guide?.createdAt ? new Date(guide.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última actualización</span>
                <span className="text-sm font-medium text-gray-900">
                  {guide?.updatedAt 
                    ? new Date(guide.updatedAt).toLocaleDateString('es-ES')
                    : 'No actualizado'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Especializaciones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Especialización en idiomas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-500" />
              Especialización en Idiomas ({guide?.specializations?.languages?.length || 0})
            </h3>
            
            {(guide?.specializations?.languages?.length || 0) === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay idiomas registrados</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(guide?.specializations?.languages || []).map((lang, index) => {
                  const languageInfo = getLanguageInfo(lang.code);
                  const levelInfo = getLevelBadge(lang.level);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{languageInfo.flag}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{languageInfo.name}</h4>
                            <p className="text-sm text-gray-600">Idioma</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Nivel de dominio:</span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${levelInfo.color} flex items-center space-x-1`}>
                          <span>{levelInfo.icon}</span>
                          <span>{levelInfo.text}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Conocimiento de museos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2 text-purple-500" />
              Conocimiento de Museos ({guide?.specializations?.museums?.length || 0})
            </h3>
            
            {(guide?.specializations?.museums?.length || 0) === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay museos registrados</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(guide?.specializations?.museums || []).map((museum, index) => {
                  const museumInfo = getMuseumInfo(museum.name);
                  const levelInfo = getLevelBadge(museum.expertise);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 line-clamp-2">{museumInfo.name}</h4>
                            <p className="text-sm text-gray-600">Museo</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Nivel de expertise:</span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${levelInfo.color} flex items-center space-x-1`}>
                          <span>{levelInfo.icon}</span>
                          <span>{levelInfo.text}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen de competencias */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TargetIcon className="w-5 h-5 mr-2 text-indigo-500" />
              Resumen de Competencias
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Multilingüe</h4>
                <p className="text-sm text-gray-600">
                  Domina {guide?.specializations?.languages?.length || 0} idioma{(guide?.specializations?.languages?.length || 0) !== 1 ? 's' : ''}
                </p>
                <div className="mt-2 flex justify-center space-x-1">
                  {(guide?.specializations?.languages || []).slice(0, 3).map((lang, index) => {
                    const languageInfo = getLanguageInfo(lang.code);
                    return (
                      <span key={index} className="text-lg">{languageInfo.flag}</span>
                    );
                  })}
                  {(guide?.specializations?.languages?.length || 0) > 3 && (
                    <span className="text-sm text-gray-500">+{(guide?.specializations?.languages?.length || 0) - 3}</span>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Especialista</h4>
                <p className="text-sm text-gray-600">
                  Conoce {guide?.specializations?.museums?.length || 0} museo{(guide?.specializations?.museums?.length || 0) !== 1 ? 's' : ''}
                </p>
                <div className="mt-2">
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {guide?.specializations?.museums?.length || 0} especialización{(guide?.specializations?.museums?.length || 0) !== 1 ? 'es' : ''}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Experimentado</h4>
                <p className="text-sm text-gray-600">
                  {guide?.stats?.yearsExperience || 0} años de experiencia
                </p>
                <div className="mt-2">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {guide?.stats?.toursCompleted || 0} tours completados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;