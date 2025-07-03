import React, { useState, useEffect } from 'react';
import { 
  StarIcon as Star, 
  ArrowTrendingUpIcon as TrendingUp, 
  UsersIcon as Users, 
  TrophyIcon as Award, 
  ChartBarIcon as BarChart3, 
  FunnelIcon as Filter, 
  CalendarIcon as Calendar, 
  ArrowDownTrayIcon as Download 
} from '@heroicons/react/24/outline';

const RatingDashboard = ({ ratingsData = [], staffEvaluations = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');

  const serviceAreas = [
    { key: 'customerService', label: 'Atención al Cliente' },
    { key: 'operations', label: 'Operativa' },
    { key: 'punctuality', label: 'Puntualidad' },
    { key: 'communication', label: 'Comunicación' },
    { key: 'logistics', label: 'Logística' },
    { key: 'safety', label: 'Seguridad' }
  ];

  const periods = [
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mes' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Último Año' }
  ];

  // Mock data for demonstration
  const mockStats = {
    totalRatings: 1247,
    averageRating: 4.3,
    staffEvaluated: 25,
    improvementTrend: '+12%'
  };

  const mockAreaStats = {
    customerService: { average: 4.5, count: 245, trend: '+5%' },
    operations: { average: 4.2, count: 189, trend: '+8%' },
    punctuality: { average: 4.1, count: 203, trend: '+3%' },
    communication: { average: 4.4, count: 167, trend: '+10%' },
    logistics: { average: 4.0, count: 134, trend: '+2%' },
    safety: { average: 4.6, count: 156, trend: '+7%' }
  };

  const mockStaffStats = [
    { id: 1, name: 'Carlos Mendez', role: 'Guía Turístico', rating: 4.8, evaluations: 15 },
    { id: 2, name: 'Ana García', role: 'Coordinadora', rating: 4.6, evaluations: 12 },
    { id: 3, name: 'Luis Torres', role: 'Chofer', rating: 4.4, evaluations: 18 },
    { id: 4, name: 'María López', role: 'Recepcionista', rating: 4.7, evaluations: 14 }
  ];

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
            fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end">
          <Icon className="text-blue-600 mb-2" size={24} />
          {trend && (
            <span className={`text-xs font-medium ${
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Valoraciones
          </h1>
          <p className="text-gray-600">
            Análisis de valoraciones por servicios y evaluaciones de personal
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">Todas las Áreas</option>
              {serviceAreas.map(area => (
                <option key={area.key} value={area.key}>
                  {area.label}
                </option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2">
              <Download size={14} />
              Exportar
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Valoraciones"
            value={mockStats.totalRatings}
            subtitle="En el período seleccionado"
            icon={BarChart3}
            trend={mockStats.improvementTrend}
          />
          <StatCard
            title="Valoración Promedio"
            value={mockStats.averageRating}
            subtitle="De 5 estrellas"
            icon={Star}
            trend="+0.3"
          />
          <StatCard
            title="Personal Evaluado"
            value={mockStats.staffEvaluated}
            subtitle="Empleados activos"
            icon={Users}
            trend="+15%"
          />
          <StatCard
            title="Tendencia General"
            value="Positiva"
            subtitle="Mejora continua"
            icon={TrendingUp}
            trend={mockStats.improvementTrend}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Areas Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Rendimiento por Áreas de Servicio
            </h3>
            <div className="space-y-4">
              {serviceAreas.map(area => (
                <div key={area.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{area.label}</p>
                    <p className="text-sm text-gray-600">
                      {mockAreaStats[area.key].count} valoraciones
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {mockAreaStats[area.key].average}
                      </span>
                      {renderStars(mockAreaStats[area.key].average)}
                    </div>
                    <span className={`text-xs font-medium ${
                      mockAreaStats[area.key].trend.startsWith('+') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {mockAreaStats[area.key].trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Rendimiento del Personal
            </h3>
            <div className="space-y-4">
              {mockStaffStats.map(staff => (
                <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{staff.name}</p>
                    <p className="text-sm text-gray-600">{staff.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {staff.rating}
                      </span>
                      {renderStars(staff.rating)}
                    </div>
                    <p className="text-xs text-gray-600">
                      {staff.evaluations} evaluaciones
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rating Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Distribución de Valoraciones
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${rating * 20}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {Math.round(mockStats.totalRatings * (rating / 15))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingDashboard;