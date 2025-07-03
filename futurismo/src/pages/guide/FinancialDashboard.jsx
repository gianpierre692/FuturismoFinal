import React, { useState, useMemo } from 'react';
import {
  CurrencyDollarIcon,
  PlusIcon,
  MinusIcon,
  CalculatorIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para la calculadora
  const [calculatorData, setCalculatorData] = useState({
    income: '',
    transportExpenses: '',
    foodExpenses: '',
    otherExpenses: ''
  });
  
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: 'transport',
      description: 'Gasolina para tour Miraflores',
      amount: 120,
      date: '2024-01-15',
      tourId: 'TOUR-001'
    },
    {
      id: 2,
      category: 'food',
      description: 'Almuerzo durante tour',
      amount: 85,
      date: '2024-01-15',
      tourId: 'TOUR-001'
    },
    {
      id: 3,
      category: 'materials',
      description: 'Folletos informativos',
      amount: 45,
      date: '2024-01-14',
      tourId: null
    }
  ]);

  const [income, setIncome] = useState([
    {
      id: 1,
      description: 'Tour Miraflores - Familia González',
      amount: 680,
      date: '2024-01-15',
      tourId: 'TOUR-001',
      type: 'tour'
    },
    {
      id: 2,
      description: 'Tour Centro de Lima - Empresa ABC',
      amount: 490,
      date: '2024-01-14',
      tourId: 'TOUR-002',
      type: 'tour'
    }
  ]);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const expenseCategories = [
    { value: 'transport', label: 'Transporte', icon: '🚗', color: 'bg-blue-100 text-blue-800' },
    { value: 'food', label: 'Alimentación', icon: '🍽️', color: 'bg-green-100 text-green-800' },
    { value: 'materials', label: 'Materiales', icon: '📋', color: 'bg-purple-100 text-purple-800' },
    { value: 'accommodation', label: 'Hospedaje', icon: '🏨', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'equipment', label: 'Equipamiento', icon: '🎒', color: 'bg-red-100 text-red-800' },
    { value: 'communication', label: 'Comunicación', icon: '📱', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'insurance', label: 'Seguros', icon: '🛡️', color: 'bg-gray-100 text-gray-800' },
    { value: 'other', label: 'Otros', icon: '💼', color: 'bg-pink-100 text-pink-800' }
  ];

  // Cálculos financieros
  const financialStats = useMemo(() => {
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

    // Gastos por categoría
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expenseCategories.find(cat => cat.value === expense.category);
      const categoryName = category ? category.label : 'Otros';
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {});

    // Estadísticas mensuales (mock para enero 2024)
    const monthlyData = {
      income: totalIncome,
      expenses: totalExpenses,
      profit: netProfit,
      toursCount: income.length
    };

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      expensesByCategory,
      monthlyData
    };
  }, [income, expenses, expenseCategories]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Funciones para la calculadora
  const handleCalculatorChange = (field, value) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Cálculos dinámicos de la calculadora
  const calculatorResults = useMemo(() => {
    const income = parseFloat(calculatorData.income) || 0;
    const transportExpenses = parseFloat(calculatorData.transportExpenses) || 0;
    const foodExpenses = parseFloat(calculatorData.foodExpenses) || 0;
    const otherExpenses = parseFloat(calculatorData.otherExpenses) || 0;
    
    const totalExpenses = transportExpenses + foodExpenses + otherExpenses;
    const netProfit = income - totalExpenses;
    const profitMargin = income > 0 ? ((netProfit / income) * 100).toFixed(1) : 0;
    
    return {
      income,
      totalExpenses,
      netProfit,
      profitMargin: parseFloat(profitMargin),
      transportExpenses,
      foodExpenses,
      otherExpenses
    };
  }, [calculatorData]);

  // Función para guardar el cálculo como transacciones
  const saveCalculationAsTransactions = () => {
    if (calculatorResults.income <= 0) {
      alert('Por favor, ingresa un monto de ingresos válido.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const tourId = `CALC-${Date.now()}`;

    // Agregar ingreso
    const newIncome = {
      id: Date.now(),
      description: `Tour calculado - ${new Date().toLocaleDateString()}`,
      amount: calculatorResults.income,
      date: today,
      tourId: tourId,
      type: 'tour'
    };
    setIncome(prev => [...prev, newIncome]);

    // Agregar gastos si existen
    const newExpenses = [];
    
    if (calculatorResults.transportExpenses > 0) {
      newExpenses.push({
        id: Date.now() + 1,
        category: 'transport',
        description: 'Gastos de transporte (calculadora)',
        amount: calculatorResults.transportExpenses,
        date: today,
        tourId: tourId
      });
    }

    if (calculatorResults.foodExpenses > 0) {
      newExpenses.push({
        id: Date.now() + 2,
        category: 'food',
        description: 'Gastos de alimentación (calculadora)',
        amount: calculatorResults.foodExpenses,
        date: today,
        tourId: tourId
      });
    }

    if (calculatorResults.otherExpenses > 0) {
      newExpenses.push({
        id: Date.now() + 3,
        category: 'other',
        description: 'Otros gastos (calculadora)',
        amount: calculatorResults.otherExpenses,
        date: today,
        tourId: tourId
      });
    }

    if (newExpenses.length > 0) {
      setExpenses(prev => [...prev, ...newExpenses]);
    }

    // Limpiar calculadora y cambiar a tab de transacciones
    setCalculatorData({
      income: '',
      transportExpenses: '',
      foodExpenses: '',
      otherExpenses: ''
    });
    
    setActiveTab('transactions');
    alert('¡Cálculo guardado exitosamente en tus transacciones!');
  };

  const getCategoryInfo = (categoryValue) => {
    return expenseCategories.find(cat => cat.value === categoryValue) || expenseCategories[expenseCategories.length - 1];
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend = null }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
              <span className="text-xs font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  const ExpenseForm = ({ onClose, item = null }) => {
    const [formData, setFormData] = useState({
      category: item?.category || 'transport',
      description: item?.description || '',
      amount: item?.amount || '',
      date: item?.date || new Date().toISOString().split('T')[0],
      tourId: item?.tourId || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (item) {
        setExpenses(prev => prev.map(exp => 
          exp.id === item.id ? { ...exp, ...formData } : exp
        ));
      } else {
        const newExpense = {
          id: Date.now(),
          ...formData,
          amount: parseFloat(formData.amount)
        };
        setExpenses(prev => [...prev, newExpense]);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {item ? 'Editar Gasto' : 'Registrar Gasto'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                {expenseCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Gasolina para tour..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Tour (opcional)
              </label>
              <input
                type="text"
                value={formData.tourId}
                onChange={(e) => setFormData({...formData, tourId: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="TOUR-001"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                {item ? 'Actualizar' : 'Registrar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const IncomeForm = ({ onClose, item = null }) => {
    const [formData, setFormData] = useState({
      description: item?.description || '',
      amount: item?.amount || '',
      date: item?.date || new Date().toISOString().split('T')[0],
      tourId: item?.tourId || '',
      type: item?.type || 'tour'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (item) {
        setIncome(prev => prev.map(inc => 
          inc.id === item.id ? { ...inc, ...formData } : inc
        ));
      } else {
        const newIncome = {
          id: Date.now(),
          ...formData,
          amount: parseFloat(formData.amount)
        };
        setIncome(prev => [...prev, newIncome]);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {item ? 'Editar Ingreso' : 'Registrar Ingreso'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="tour">Tour Guiado</option>
                <option value="consulting">Consultoría</option>
                <option value="training">Capacitación</option>
                <option value="other">Otros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Tour Guatapé - Cliente ABC..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Tour
              </label>
              <input
                type="text"
                value={formData.tourId}
                onChange={(e) => setFormData({...formData, tourId: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="TOUR-001"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                {item ? 'Actualizar' : 'Registrar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Control Financiero
              </h1>
              <p className="text-gray-600">
                Gestiona tus ingresos y gastos como guía freelance
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowIncomeForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Registrar Ingreso
              </button>
              <button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <MinusIcon className="w-4 h-4" />
                Registrar Gasto
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
                { id: 'calculator', label: 'Calculadora', icon: CalculatorIcon },
                { id: 'transactions', label: 'Transacciones', icon: BanknotesIcon },
                { id: 'reports', label: 'Reportes', icon: DocumentArrowDownIcon }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Ingresos Totales"
                value={formatCurrency(financialStats.totalIncome)}
                subtitle="Este mes"
                icon={ArrowTrendingUpIcon}
                color="green"
                trend={12.5}
              />
              <StatCard
                title="Gastos Totales"
                value={formatCurrency(financialStats.totalExpenses)}
                subtitle="Este mes"
                icon={ArrowTrendingDownIcon}
                color="red"
                trend={-8.2}
              />
              <StatCard
                title="Ganancia Neta"
                value={formatCurrency(financialStats.netProfit)}
                subtitle={`Margen: ${financialStats.profitMargin}%`}
                icon={CurrencyDollarIcon}
                color={financialStats.netProfit >= 0 ? "green" : "red"}
              />
              <StatCard
                title="Tours Realizados"
                value={financialStats.monthlyData.toursCount}
                subtitle="Este mes"
                icon={CalendarIcon}
                color="blue"
              />
            </div>

            {/* Gastos por Categoría */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Gastos por Categoría
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(financialStats.expensesByCategory).map(([category, amount]) => {
                  const categoryInfo = expenseCategories.find(cat => cat.label === category);
                  return (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryInfo?.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Calculadora de Rentabilidad por Tour
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingreso del Tour
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                    <input
                      type="number"
                      value={calculatorData.income}
                      onChange={(e) => handleCalculatorChange('income', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="680"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gastos de Transporte
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                    <input
                      type="number"
                      value={calculatorData.transportExpenses}
                      onChange={(e) => handleCalculatorChange('transportExpenses', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="120"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gastos de Alimentación
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                    <input
                      type="number"
                      value={calculatorData.foodExpenses}
                      onChange={(e) => handleCalculatorChange('foodExpenses', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="85"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Otros Gastos
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                    <input
                      type="number"
                      value={calculatorData.otherExpenses}
                      onChange={(e) => handleCalculatorChange('otherExpenses', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="45"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCalculatorData({
                        income: '',
                        transportExpenses: '',
                        foodExpenses: '',
                        otherExpenses: ''
                      })}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Limpiar
                    </button>
                    <button 
                      onClick={() => {
                        // El cálculo ya es automático, pero podemos agregar alguna funcionalidad extra
                        if (calculatorResults.income > 0) {
                          alert(`Rentabilidad calculada: ${calculatorResults.profitMargin}% de margen de ganancia`);
                        } else {
                          alert('Por favor, ingresa el monto de ingresos para calcular la rentabilidad.');
                        }
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Ver Resumen
                    </button>
                  </div>
                  <button 
                    onClick={saveCalculationAsTransactions}
                    disabled={calculatorResults.income <= 0}
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      calculatorResults.income > 0 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    💾 Guardar como Transacciones
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-gray-800">Resumen del Cálculo</h4>
                  {calculatorResults.income > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      calculatorResults.netProfit >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {calculatorResults.netProfit >= 0 ? '✓ Rentable' : '⚠️ Con Pérdidas'}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ingresos:</span>
                    <span className="font-medium">
                      {calculatorResults.income > 0 ? formatCurrency(calculatorResults.income) : 'S/ 0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gastos Totales:</span>
                    <span className="font-medium">
                      {calculatorResults.totalExpenses > 0 ? formatCurrency(calculatorResults.totalExpenses) : 'S/ 0.00'}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Ganancia Neta:</span>
                    <span className={`${calculatorResults.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calculatorResults.netProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margen de Ganancia:</span>
                    <span className={`font-medium ${calculatorResults.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculatorResults.profitMargin}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Ingresos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Ingresos Recientes</h3>
                <button
                  onClick={() => setShowIncomeForm(true)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  + Agregar Ingreso
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Descripción</th>
                      <th className="px-4 py-3">Tour ID</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {income.map(item => (
                      <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{formatDate(item.date)}</td>
                        <td className="px-4 py-3">{item.description}</td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {item.tourId}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-green-600">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowIncomeForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setIncome(prev => prev.filter(i => i.id !== item.id))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gastos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Gastos Recientes</h3>
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  + Agregar Gasto
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3">Descripción</th>
                      <th className="px-4 py-3">Tour ID</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(expense => {
                      const categoryInfo = getCategoryInfo(expense.category);
                      return (
                        <tr key={expense.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{formatDate(expense.date)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${categoryInfo.color}`}>
                              {categoryInfo.icon} {categoryInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">{expense.description}</td>
                          <td className="px-4 py-3">
                            {expense.tourId ? (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {expense.tourId}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-red-600">
                            {formatCurrency(expense.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem(expense);
                                  setShowExpenseForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setExpenses(prev => prev.filter(e => e.id !== expense.id))}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Reportes Financieros</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <DocumentArrowDownIcon className="w-4 h-4" />
                Exportar PDF
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Resumen Mensual</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span>Total de Ingresos:</span>
                    <span className="font-medium text-green-600">{formatCurrency(financialStats.totalIncome)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Total de Gastos:</span>
                    <span className="font-medium text-red-600">{formatCurrency(financialStats.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b font-bold">
                    <span>Ganancia Neta:</span>
                    <span className={financialStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(financialStats.netProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Margen de Ganancia:</span>
                    <span className="font-medium">{financialStats.profitMargin}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Métricas de Rendimiento</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span>Tours Realizados:</span>
                    <span className="font-medium">{income.length}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Ingreso Promedio por Tour:</span>
                    <span className="font-medium">
                      {formatCurrency(income.length > 0 ? financialStats.totalIncome / income.length : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Gasto Promedio por Tour:</span>
                    <span className="font-medium">
                      {formatCurrency(income.length > 0 ? financialStats.totalExpenses / income.length : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Ganancia Promedio por Tour:</span>
                    <span className="font-medium">
                      {formatCurrency(income.length > 0 ? financialStats.netProfit / income.length : 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forms */}
        {showExpenseForm && (
          <ExpenseForm
            onClose={() => {
              setShowExpenseForm(false);
              setEditingItem(null);
            }}
            item={editingItem}
          />
        )}

        {showIncomeForm && (
          <IncomeForm
            onClose={() => {
              setShowIncomeForm(false);
              setEditingItem(null);
            }}
            item={editingItem}
          />
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;