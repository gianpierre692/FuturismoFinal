import { useState } from 'react';
import { CreditCardIcon, PencilIcon, CheckIcon, XMarkIcon, PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const PaymentDataSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Cuenta Bancaria',
      bank: 'Banco de Crédito del Perú',
      accountNumber: '194-1234567-8-90',
      accountType: 'Cuenta Corriente',
      currency: 'PEN',
      holderName: 'Viajes El Dorado SAC',
      isMain: true
    },
    {
      id: 2,
      type: 'Cuenta Bancaria',
      bank: 'Interbank',
      accountNumber: '200-9876543-2-10',
      accountType: 'Cuenta Corriente',
      currency: 'USD',
      holderName: 'Viajes El Dorado SAC',
      isMain: false
    },
    {
      id: 3,
      type: 'Tarjeta de Crédito',
      bank: 'Banco Continental',
      cardNumber: '4532-****-****-9876',
      cardType: 'Visa',
      expiryDate: '12/2025',
      holderName: 'Carlos Mendoza',
      isMain: false
    }
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: '',
    bank: '',
    accountNumber: '',
    accountType: '',
    currency: 'PEN',
    holderName: '',
    isMain: false
  });

  const maskCardNumber = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\D/g, '');
    return cleaned.slice(0, 4) + '-****-****-' + cleaned.slice(-4);
  };

  const toggleShowCardNumber = (id) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.type && newPaymentMethod.bank && newPaymentMethod.holderName) {
      const method = {
        id: Date.now(),
        ...newPaymentMethod
      };
      setPaymentMethods([...paymentMethods, method]);
      setNewPaymentMethod({
        type: '',
        bank: '',
        accountNumber: '',
        accountType: '',
        currency: 'PEN',
        holderName: '',
        isMain: false
      });
    }
  };

  const handleDeletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetAsMain = (id) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isMain: method.id === id
    }));
    setPaymentMethods(updatedMethods);
  };

  const handleSave = () => {
    console.log('Guardando datos de pago:', paymentMethods);
    setIsEditing(false);
    alert('✅ Datos de pago actualizados correctamente');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCardIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Datos de pago</h3>
            <p className="text-sm text-gray-500">Cuentas bancarias y métodos de pago</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expandir sección' : 'Contraer sección'}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!isCollapsed && (
          !isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              Cancelar
            </button>
          </div>
          )
        )}
      </div>

      {/* Lista de métodos de pago */}
      {!isCollapsed && (
        <div>
          <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id} 
            className={`border rounded-lg p-4 ${method.isMain ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  method.type === 'Cuenta Bancaria' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {method.type}
                </span>
                {method.isMain && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Principal
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  {!method.isMain && (
                    <button
                      onClick={() => handleSetAsMain(method.id)}
                      className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                    >
                      Marcar principal
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banco/Entidad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={method.bank}
                    onChange={(e) => {
                      const updatedMethods = paymentMethods.map(m => 
                        m.id === method.id ? { ...m, bank: e.target.value } : m
                      );
                      setPaymentMethods(updatedMethods);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{method.bank}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {method.type === 'Cuenta Bancaria' ? 'Número de cuenta' : 'Número de tarjeta'}
                </label>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={method.accountNumber || method.cardNumber}
                      onChange={(e) => {
                        const field = method.type === 'Cuenta Bancaria' ? 'accountNumber' : 'cardNumber';
                        const updatedMethods = paymentMethods.map(m => 
                          m.id === method.id ? { ...m, [field]: e.target.value } : m
                        );
                        setPaymentMethods(updatedMethods);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <>
                      <p className="text-gray-900 flex-1">
                        {showCardNumbers[method.id] ? 
                          (method.accountNumber || method.cardNumber) : 
                          maskCardNumber(method.accountNumber || method.cardNumber)
                        }
                      </p>
                      <button
                        onClick={() => toggleShowCardNumber(method.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showCardNumbers[method.id] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {method.type === 'Cuenta Bancaria' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de cuenta
                    </label>
                    {isEditing ? (
                      <select
                        value={method.accountType}
                        onChange={(e) => {
                          const updatedMethods = paymentMethods.map(m => 
                            m.id === method.id ? { ...m, accountType: e.target.value } : m
                          );
                          setPaymentMethods(updatedMethods);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Cuenta Corriente">Cuenta Corriente</option>
                        <option value="Cuenta de Ahorros">Cuenta de Ahorros</option>
                        <option value="Cuenta CTS">Cuenta CTS</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{method.accountType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda
                    </label>
                    {isEditing ? (
                      <select
                        value={method.currency}
                        onChange={(e) => {
                          const updatedMethods = paymentMethods.map(m => 
                            m.id === method.id ? { ...m, currency: e.target.value } : m
                          );
                          setPaymentMethods(updatedMethods);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="PEN">Soles (PEN)</option>
                        <option value="USD">Dólares (USD)</option>
                        <option value="EUR">Euros (EUR)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{method.currency}</p>
                    )}
                  </div>
                </>
              )}

              {method.type === 'Tarjeta de Crédito' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de tarjeta
                    </label>
                    {isEditing ? (
                      <select
                        value={method.cardType}
                        onChange={(e) => {
                          const updatedMethods = paymentMethods.map(m => 
                            m.id === method.id ? { ...m, cardType: e.target.value } : m
                          );
                          setPaymentMethods(updatedMethods);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="American Express">American Express</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{method.cardType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de vencimiento
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="MM/YYYY"
                        value={method.expiryDate}
                        onChange={(e) => {
                          const updatedMethods = paymentMethods.map(m => 
                            m.id === method.id ? { ...m, expiryDate: e.target.value } : m
                          );
                          setPaymentMethods(updatedMethods);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{method.expiryDate}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titular
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={method.holderName}
                    onChange={(e) => {
                      const updatedMethods = paymentMethods.map(m => 
                        m.id === method.id ? { ...m, holderName: e.target.value } : m
                      );
                      setPaymentMethods(updatedMethods);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{method.holderName}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Formulario para agregar nuevo método de pago */}
        {isEditing && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Agregar nuevo método de pago</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <select
                    value={newPaymentMethod.type}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tipo de método *</option>
                    <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Banco/Entidad *"
                    value={newPaymentMethod.bank}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, bank: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Titular *"
                    value={newPaymentMethod.holderName}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, holderName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleAddPaymentMethod}
                  disabled={!newPaymentMethod.type || !newPaymentMethod.bank || !newPaymentMethod.holderName}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="w-4 h-4" />
                  Agregar método
                </button>
              </div>
            </div>
          </div>
          )}
          </div>

          {/* Nota informativa */}
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              <span className="font-medium">🔒 Seguridad:</span> Toda la información financiera está protegida con encriptación de nivel bancario. Solo el personal autorizado puede acceder a estos datos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDataSection;