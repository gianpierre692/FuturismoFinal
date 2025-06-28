import { XMarkIcon, ArrowDownTrayIcon, PencilIcon, PhoneIcon, ClockIcon, ExclamationTriangleIcon, CheckCircleIcon, UserGroupIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const ProtocolViewer = ({ protocol, onClose, onEdit, onDownload }) => {
  const { user } = useAuthStore();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContactTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'coordinator': return '👔';
      case 'management': return '🏢';
      case 'police': return '👮';
      case 'medical': return '🏥';
      case 'insurance': return '📋';
      case 'towing': return '🚛';
      case 'weather': return '🌦️';
      case 'local': return '🏛️';
      case 'operations': return '⚙️';
      default: return '📞';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{protocol.icon}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {protocol.title}
                </h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span 
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(protocol.priority)}`}
                  >
                    Prioridad {protocol.priority?.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Categoría: {protocol.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
            
            {user?.role === 'admin' && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Descripción */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Descripción del Protocolo
              </h3>
              <p className="text-blue-800">{protocol.description}</p>
              <div className="mt-3 text-sm text-blue-700">
                <span className="font-medium">Última actualización:</span> {protocol.lastUpdated}
              </div>
            </div>

            {/* Pasos del protocolo */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Pasos a Seguir
              </h3>
              
              <div className="space-y-3">
                {protocol.content.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contactos de emergencia */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-red-500" />
                Contactos de Emergencia
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {protocol.content.contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getContactTypeIcon(contact.type)}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">{contact.name}</h4>
                        <p className="text-red-700 font-mono text-lg font-bold">
                          {contact.phone}
                        </p>
                        <p className="text-red-600 text-sm capitalize">
                          {contact.type}
                        </p>
                      </div>
                      <a
                        href={`tel:${contact.phone}`}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Llamar ahora"
                      >
                        <PhoneIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materiales necesarios */}
            {protocol.content.materials && protocol.content.materials.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />
                  Materiales Necesarios
                </h3>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {protocol.content.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-purple-800"
                      >
                        <CheckCircleIcon className="w-4 h-4 text-purple-600" />
                        <span>{material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Advertencias importantes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Recordatorios Importantes
                  </h4>
                  <ul className="text-yellow-800 space-y-1 text-sm">
                    <li>• Mantén la calma en todo momento</li>
                    <li>• La seguridad de los turistas es la máxima prioridad</li>
                    <li>• Documenta todos los incidentes</li>
                    <li>• Comunícate inmediatamente con el coordinador</li>
                    <li>• Sigue los protocolos paso a paso</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {protocol.content.steps.length}
                  </div>
                  <div className="text-sm text-gray-600">Pasos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {protocol.content.contacts.length}
                  </div>
                  <div className="text-sm text-gray-600">Contactos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {protocol.content.materials?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Materiales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {protocol.priority === 'alta' ? '🔴' : protocol.priority === 'media' ? '🟡' : '🟢'}
                  </div>
                  <div className="text-sm text-gray-600">Prioridad</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>Protocolo actualizado el {protocol.lastUpdated}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolViewer;