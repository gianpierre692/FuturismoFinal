import { useState, useEffect } from 'react';
import { 
  StarIcon, 
  GiftIcon, 
  ShoppingBagIcon, 
  CreditCardIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const PointsStore = () => {
  const [userPoints, setUserPoints] = useState(2580); // Puntos del usuario
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data de beneficios disponibles
  const [benefits, setBenefits] = useState([
    {
      id: 1,
      name: 'Descuento 10% Equipos',
      description: 'Descuento del 10% en equipos de guía profesional',
      points: 500,
      category: 'equipment',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    },
    {
      id: 2,
      name: 'Curso de Primeros Auxilios',
      description: 'Curso certificado de primeros auxilios para guías turísticos',
      points: 1200,
      category: 'training',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-11-30'
    },
    {
      id: 3,
      name: 'Kit de Emergencia',
      description: 'Kit completo de emergencia para tours de aventura',
      points: 800,
      category: 'equipment',
      image: 'https://images.unsplash.com/photo-1603398938235-e8bb8c11c1d8?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    },
    {
      id: 4,
      name: 'Certificación Bilingüe',
      description: 'Certificación oficial para guías bilingües',
      points: 2000,
      category: 'certification',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-10-31'
    },
    {
      id: 5,
      name: 'Uniforme Profesional',
      description: 'Uniforme completo con logo de la empresa',
      points: 600,
      category: 'equipment',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    },
    {
      id: 6,
      name: 'Seguro Premium',
      description: 'Seguro premium para guías por 6 meses',
      points: 1500,
      category: 'insurance',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    }
  ]);

  // Historial de canjes
  const [redemptionHistory, setRedemptionHistory] = useState([
    {
      id: 1,
      benefitName: 'Descuento 10% Equipos',
      points: 500,
      redeemedAt: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: 2,
      benefitName: 'Kit de Emergencia',
      points: 800,
      redeemedAt: '2024-01-10T14:20:00Z',
      status: 'pending'
    }
  ]);

  const [newBenefit, setNewBenefit] = useState({
    name: '',
    description: '',
    points: '',
    category: 'equipment',
    validUntil: ''
  });

  const categories = [
    { id: 'all', name: 'Todos', icon: ShoppingBagIcon },
    { id: 'equipment', name: 'Equipos', icon: ShoppingBagIcon },
    { id: 'training', name: 'Capacitación', icon: StarIcon },
    { id: 'certification', name: 'Certificaciones', icon: TagIcon },
    { id: 'insurance', name: 'Seguros', icon: CreditCardIcon }
  ];

  const filteredBenefits = selectedCategory === 'all' 
    ? benefits 
    : benefits.filter(b => b.category === selectedCategory);

  const handleRedeemBenefit = (benefit) => {
    if (userPoints < benefit.points) {
      toast.error('No tienes suficientes puntos para canjear este beneficio');
      return;
    }

    const newRedemption = {
      id: Date.now(),
      benefitName: benefit.name,
      points: benefit.points,
      redeemedAt: new Date().toISOString(),
      status: 'pending'
    };

    setRedemptionHistory(prev => [newRedemption, ...prev]);
    setUserPoints(prev => prev - benefit.points);
    toast.success(`¡Beneficio "${benefit.name}" canjeado exitosamente!`);
  };

  const handleAddBenefit = () => {
    if (!newBenefit.name || !newBenefit.points) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    const benefit = {
      id: Date.now(),
      ...newBenefit,
      points: parseInt(newBenefit.points),
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop',
      available: true
    };

    setBenefits(prev => [...prev, benefit]);
    setNewBenefit({ name: '', description: '', points: '', category: 'equipment', validUntil: '' });
    setShowAddModal(false);
    toast.success('Beneficio agregado exitosamente');
  };

  const handleEditBenefit = (benefit) => {
    setEditingBenefit({ ...benefit });
  };

  const handleSaveEdit = () => {
    setBenefits(prev => prev.map(b => 
      b.id === editingBenefit.id ? editingBenefit : b
    ));
    setEditingBenefit(null);
    toast.success('Beneficio actualizado');
  };

  const handleDeleteBenefit = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este beneficio?')) {
      setBenefits(prev => prev.filter(b => b.id !== id));
      toast.success('Beneficio eliminado');
    }
  };

  const getBenefitCategoryName = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <GiftIcon className="w-8 h-8 mr-3 text-purple-600" />
              Tienda de Puntos
            </h1>
            <p className="text-gray-600 mt-1">
              Canjea tus puntos por beneficios exclusivos para guías freelance
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Agregar Beneficio</span>
          </button>
        </div>

        {/* Puntos disponibles */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Tus Puntos Disponibles</h2>
              <div className="flex items-center space-x-2">
                <StarIcon className="w-8 h-8 text-yellow-300" />
                <span className="text-3xl font-bold">{userPoints.toLocaleString()}</span>
                <span className="text-lg">puntos</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Canjeados este mes</p>
              <p className="text-2xl font-bold">1,300</p>
            </div>
          </div>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBenefits.map((benefit) => (
            <div key={benefit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={benefit.image} 
                  alt={benefit.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userPoints >= benefit.points 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userPoints >= benefit.points ? 'Disponible' : 'Insuficiente'}
                  </span>
                </div>
                {editingBenefit?.id === benefit.id ? null : (
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <button
                      onClick={() => handleEditBenefit(benefit)}
                      className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                    >
                      <PencilIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteBenefit(benefit.id)}
                      className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4">
                {editingBenefit?.id === benefit.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingBenefit.name}
                      onChange={(e) => setEditingBenefit(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nombre del beneficio"
                    />
                    <textarea
                      value={editingBenefit.description}
                      onChange={(e) => setEditingBenefit(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="2"
                      placeholder="Descripción"
                    />
                    <input
                      type="number"
                      value={editingBenefit.points}
                      onChange={(e) => setEditingBenefit(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Puntos requeridos"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={() => setEditingBenefit(null)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-purple-600">{benefit.points.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">puntos</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getBenefitCategoryName(benefit.category)}
                      </span>
                    </div>

                    {benefit.validUntil && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-3">
                        <ClockIcon className="w-3 h-3" />
                        <span>Válido hasta {format(new Date(benefit.validUntil), 'd/MM/yyyy')}</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleRedeemBenefit(benefit)}
                      disabled={userPoints < benefit.points}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        userPoints >= benefit.points
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {userPoints >= benefit.points ? 'Canjear' : 'Puntos insuficientes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Historial de canjes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />
              Historial de Canjes
            </h3>
          </div>

          <div className="p-6">
            {redemptionHistory.length === 0 ? (
              <div className="text-center py-8">
                <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay canjes realizados
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tus canjes aparecerán aquí una vez que empieces a usar tus puntos.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {redemptionHistory.map((redemption) => (
                  <div
                    key={redemption.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{redemption.benefitName}</h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(redemption.redeemedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <StarIcon className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-purple-600">-{redemption.points}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        redemption.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {redemption.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar beneficio */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center mb-4">
                  <GiftIcon className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Agregar Nuevo Beneficio
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del beneficio *
                    </label>
                    <input
                      type="text"
                      value={newBenefit.name}
                      onChange={(e) => setNewBenefit(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ej: Descuento 15% en equipos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={newBenefit.description}
                      onChange={(e) => setNewBenefit(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="3"
                      placeholder="Describe el beneficio..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntos requeridos *
                    </label>
                    <input
                      type="number"
                      value={newBenefit.points}
                      onChange={(e) => setNewBenefit(prev => ({ ...prev, points: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={newBenefit.category}
                      onChange={(e) => setNewBenefit(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="equipment">Equipos</option>
                      <option value="training">Capacitación</option>
                      <option value="certification">Certificaciones</option>
                      <option value="insurance">Seguros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Válido hasta (opcional)
                    </label>
                    <input
                      type="date"
                      value={newBenefit.validUntil}
                      onChange={(e) => setNewBenefit(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleAddBenefit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Agregar Beneficio
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsStore;