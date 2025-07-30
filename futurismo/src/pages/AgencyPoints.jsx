import { useState } from 'react';
import { 
  StarIcon, 
  ArrowTrendingUpIcon, 
  TrophyIcon, 
  GiftIcon, 
  CalendarIcon, 
  UserIcon, 
  CreditCardIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  ClockIcon,
  ShoppingBagIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useAgencyStore from '../stores/agencyStore';
import toast from 'react-hot-toast';

const AgencyPoints = () => {
  const { currentAgency, actions } = useAgencyStore();
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('store'); // 'store', 'history'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const pointsHistory = actions.getPointsHistory();
  const pointsBalance = actions.getPointsBalance();

  // Mock data de beneficios para agencias
  const [benefits, setBenefits] = useState([
    {
      id: 1,
      name: 'Descuento 15% en Comisiones',
      description: 'Descuento del 15% en comisiones por servicios durante 3 meses',
      points: 2000,
      category: 'discounts',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    },
    {
      id: 2,
      name: 'Marketing Digital Premium',
      description: 'Paquete de marketing digital por 6 meses con publicidad pagada',
      points: 5000,
      category: 'marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-11-30'
    },
    {
      id: 3,
      name: 'Certificación Empresarial',
      description: 'Certificación oficial como agencia de turismo premium',
      points: 3500,
      category: 'certification',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    },
    {
      id: 4,
      name: 'Herramientas de Gestión',
      description: 'Suite completa de herramientas de gestión empresarial por 1 año',
      points: 4000,
      category: 'tools',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-10-31'
    },
    {
      id: 5,
      name: 'Capacitación para Staff',
      description: 'Capacitación profesional para todo el equipo de la agencia',
      points: 2500,
      category: 'training',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    },
    {
      id: 6,
      name: 'Seguro Empresarial Premium',
      description: 'Cobertura de seguro premium para la agencia por 1 año',
      points: 6000,
      category: 'insurance',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&h=200&fit=crop',
      available: true,
      validUntil: '2024-12-31'
    }
  ]);

  // Historial de canjes de beneficios
  const [redemptionHistory, setRedemptionHistory] = useState([
    {
      id: 1,
      benefitName: 'Descuento 15% en Comisiones',
      points: 2000,
      redeemedAt: '2024-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: 2,
      benefitName: 'Capacitación para Staff',
      points: 2500,
      redeemedAt: '2024-01-10T14:20:00Z',
      status: 'completed'
    }
  ]);

  const [newBenefit, setNewBenefit] = useState({
    name: '',
    description: '',
    points: '',
    category: 'discounts',
    validUntil: ''
  });

  const categories = [
    { id: 'all', name: 'Todos', icon: ShoppingBagIcon },
    { id: 'discounts', name: 'Descuentos', icon: TagIcon },
    { id: 'marketing', name: 'Marketing', icon: TrophyIcon },
    { id: 'certification', name: 'Certificaciones', icon: StarIcon },
    { id: 'tools', name: 'Herramientas', icon: CreditCardIcon },
    { id: 'training', name: 'Capacitación', icon: UserIcon },
    { id: 'insurance', name: 'Seguros', icon: GiftIcon }
  ];

  const filteredHistory = filterType === 'all' 
    ? pointsHistory 
    : pointsHistory.filter(t => t.type === filterType);

  const filteredBenefits = selectedCategory === 'all' 
    ? benefits 
    : benefits.filter(b => b.category === selectedCategory);

  const getTransactionIcon = (type) => {
    return type === 'earned' ? 
      <StarIcon className="w-4 h-4 text-green-600" /> : 
      <GiftIcon className="w-4 h-4 text-red-600" />;
  };

  const getTransactionColor = (type) => {
    return type === 'earned' ? 
      'text-green-600' : 
      'text-red-600';
  };

  const exportHistory = () => {
    console.log('Exportando historial de puntos...', filteredHistory);
    // Implementar exportación
  };

  const handleRedeemBenefit = (benefit) => {
    if (pointsBalance.balance < benefit.points) {
      toast.error('No tienes suficientes puntos para canjear este beneficio');
      return;
    }

    const newRedemption = {
      id: Date.now(),
      benefitName: benefit.name,
      points: benefit.points,
      redeemedAt: new Date().toISOString(),
      status: 'active'
    };

    setRedemptionHistory(prev => [newRedemption, ...prev]);
    // Aquí deberías actualizar el balance real a través del store
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
    setNewBenefit({ name: '', description: '', points: '', category: 'discounts', validUntil: '' });
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <StarIcon className="w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-3 text-yellow-500" />
              Sistema de Puntos
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gestiona puntos, canjea beneficios y revisa tu historial
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {activeTab === 'store' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Agregar Beneficio</span>
                <span className="sm:hidden">Agregar</span>
              </button>
            )}
            <button
              onClick={exportHistory}
              className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm sm:text-base"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'store'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShoppingBagIcon className="w-4 h-4 inline mr-2" />
            Tienda de Beneficios
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ClockIcon className="w-4 h-4 inline mr-2" />
            Historial
          </button>
        </div>

        {/* Información sobre puntos automáticos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <TrophyIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Sistema de Puntos Automático</h3>
              <p className="text-sm text-blue-700 mt-1">
                Los puntos se otorgan automáticamente cuando consumes servicios. 
                La cantidad de puntos depende del valor del servicio contratado.
              </p>
              <div className="mt-2 text-xs text-blue-600">
                <strong>Fórmula:</strong> (10 base + valor/100 + servicios adicionales) × multiplicador del tier
              </div>
            </div>
          </div>
        </div>

      {/* Resumen de puntos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <StarIcon className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {pointsBalance.balance.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Balance Actual</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ArrowTrendingUpIcon className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {pointsBalance.totalEarned.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total Ganados</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <GiftIcon className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {pointsBalance.totalRedeemed.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Total Canjeados</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrophyIcon className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {currentAgency.tier === 'gold' ? 'Oro' : 
                 currentAgency.tier === 'silver' ? 'Plata' : 
                 currentAgency.tier === 'bronze' ? 'Bronce' : 'Platino'}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Nivel Actual</p>
            </div>
          </div>
        </div>
      </div>

        {/* Contenido basado en pestaña activa */}
        {activeTab === 'store' ? (
          <div>
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
                        ? 'bg-blue-600 text-white'
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
                        pointsBalance.balance >= benefit.points 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pointsBalance.balance >= benefit.points ? 'Disponible' : 'Insuficiente'}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nombre del beneficio"
                        />
                        <textarea
                          value={editingBenefit.description}
                          onChange={(e) => setEditingBenefit(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="2"
                          placeholder="Descripción"
                        />
                        <input
                          type="number"
                          value={editingBenefit.points}
                          onChange={(e) => setEditingBenefit(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <StarIcon className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-blue-600">{benefit.points.toLocaleString()}</span>
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
                          disabled={pointsBalance.balance < benefit.points}
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            pointsBalance.balance >= benefit.points
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {pointsBalance.balance >= benefit.points ? 'Canjear' : 'Puntos insuficientes'}
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
                  <GiftIcon className="w-5 h-5 mr-2 text-purple-500" />
                  Mis Beneficios Canjeados
                </h3>
              </div>

              <div className="p-6">
                {redemptionHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No hay beneficios canjeados
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
                            <StarIcon className="w-4 h-4 text-blue-600" />
                            <span className="font-bold text-blue-600">-{redemption.points}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            redemption.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : redemption.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {redemption.status === 'active' ? 'Activo' : 
                             redemption.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Historial de transacciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />
              Historial de Transacciones
            </h3>
            
            <div className="flex items-center space-x-3">
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">Todas las transacciones</option>
                <option value="earned">Puntos ganados</option>
                <option value="redeemed">Puntos canjeados</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay transacciones
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Aún no hay historial de puntos para mostrar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {transaction.reason}
                        </h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>
                              {format(new Date(transaction.createdAt), 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>
                              {transaction.processedBy === 'manual' ? 'Manual' : 'Sistema'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                      </p>
                      <p className="text-sm text-gray-600">puntos</p>
                    </div>
                  </div>

                  {transaction.relatedReservation && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CreditCardIcon className="w-4 h-4" />
                        <span>Relacionado con reserva: {transaction.relatedReservation}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
            </div>
          </div>
        )}

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
                    <GiftIcon className="w-6 h-6 text-blue-600 mr-2" />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Descuento 20% en servicios"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={newBenefit.description}
                        onChange={(e) => setNewBenefit(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Describe el beneficio para las agencias..."
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2000"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="discounts">Descuentos</option>
                        <option value="marketing">Marketing</option>
                        <option value="certification">Certificaciones</option>
                        <option value="tools">Herramientas</option>
                        <option value="training">Capacitación</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleAddBenefit}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
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
    </div>
  );
};

export default AgencyPoints;