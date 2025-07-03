import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon as MessageCircle,
  ArrowTrendingUpIcon as TrendingUp,
  UsersIcon as Users,
  LightBulbIcon as Lightbulb,
  HandThumbUpIcon as ThumbsUp,
  HandThumbDownIcon as ThumbsDown,
  FunnelIcon as Filter,
  MagnifyingGlassIcon as Search,
  EyeIcon as Eye,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
  ExclamationTriangleIcon as AlertCircle,
  ChartBarIcon as BarChart3,
  ChartPieIcon as PieChart,
  ArrowDownTrayIcon as Download
} from '@heroicons/react/24/outline';

const FeedbackDashboard = ({ feedbackData = [], staffFeedback = [] }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const serviceAreas = [
    { key: 'customerService', label: 'Atención al Cliente' },
    { key: 'operations', label: 'Operativa' },
    { key: 'punctuality', label: 'Puntualidad' },
    { key: 'communication', label: 'Comunicación' },
    { key: 'logistics', label: 'Logística' },
    { key: 'safety', label: 'Seguridad' }
  ];

  const statusTypes = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'reviewed', label: 'Revisado', color: 'bg-blue-100 text-blue-800', icon: Eye },
    { value: 'in_progress', label: 'En Progreso', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    { value: 'implemented', label: 'Implementado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'rejected', label: 'Rechazado', color: 'bg-red-100 text-red-800', icon: ThumbsDown }
  ];

  // Mock data for demonstration
  const mockStats = {
    totalFeedback: 342,
    serviceFeedback: 198,
    staffFeedback: 144,
    avgResponseTime: '2.3 días',
    implementationRate: '67%',
    satisfactionScore: 4.2
  };

  const mockServiceFeedback = [
    {
      id: 1,
      area: 'customerService',
      type: 'suggestion',
      title: 'Mejorar tiempo de respuesta',
      description: 'Sería útil tener un sistema de chat en tiempo real',
      submittedBy: 'Cliente A',
      timestamp: '2024-01-15',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      area: 'operations',
      type: 'negative',
      title: 'Problemas con coordinación',
      description: 'Hubo confusión en los horarios de recogida',
      submittedBy: 'Cliente B',
      timestamp: '2024-01-14',
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: 3,
      area: 'safety',
      type: 'positive',
      title: 'Excelentes medidas de seguridad',
      description: 'Me sentí muy seguro durante todo el tour',
      submittedBy: 'Cliente C',
      timestamp: '2024-01-13',
      status: 'reviewed',
      priority: 'low'
    }
  ];

  const mockStaffFeedback = [
    {
      id: 1,
      staffName: 'Carlos Mendez',
      staffRole: 'Guía Turístico',
      category: 'communication',
      type: 'recognition',
      title: 'Excelente comunicación',
      description: 'Carlos explicó todo muy claramente y fue muy paciente',
      submittedBy: 'Supervisor A',
      timestamp: '2024-01-15',
      status: 'reviewed'
    },
    {
      id: 2,
      staffName: 'Ana García',
      staffRole: 'Coordinadora',
      category: 'performance',
      type: 'suggestion',
      title: 'Mejorar seguimiento',
      description: 'Podría beneficiarse de un sistema de seguimiento más estructurado',
      submittedBy: 'Manager B',
      timestamp: '2024-01-14',
      status: 'pending'
    }
  ];

  const getStatusInfo = (status) => {
    return statusTypes.find(s => s.value === status) || statusTypes[0];
  };

  const getAreaLabel = (areaKey) => {
    return serviceAreas.find(a => a.key === areaKey)?.label || areaKey;
  };

  const getFeedbackTypeIcon = (type) => {
    switch(type) {
      case 'suggestion': return <Lightbulb className="text-blue-600" size={16} />;
      case 'recognition': return <ThumbsUp className="text-green-600" size={16} />;
      case 'positive': return <ThumbsUp className="text-green-600" size={16} />;
      case 'negative': return <ThumbsDown className="text-red-600" size={16} />;
      default: return <MessageCircle className="text-gray-600" size={16} />;
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end">
          <Icon className={`text-${color}-600 mb-2`} size={24} />
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

  const FeedbackCard = ({ feedback, type = 'service' }) => {
    const statusInfo = getStatusInfo(feedback.status);
    const StatusIcon = statusInfo.icon;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getFeedbackTypeIcon(feedback.type)}
            <h4 className="font-semibold text-gray-800">{feedback.title}</h4>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
            <StatusIcon size={12} />
            {statusInfo.label}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{feedback.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            {type === 'service' && (
              <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                {getAreaLabel(feedback.area)}
              </span>
            )}
            {type === 'staff' && (
              <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                {feedback.staffName} - {feedback.category}
              </span>
            )}
            <span>Por: {feedback.submittedBy}</span>
          </div>
          <span>{feedback.timestamp}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Opiniones y Sugerencias
          </h1>
          <p className="text-gray-600">
            Gestión de retroalimentación sobre servicios y personal
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Opiniones"
            value={mockStats.totalFeedback}
            subtitle="Este mes"
            icon={MessageCircle}
            trend="+23%"
            color="blue"
          />
          <StatCard
            title="Retroalimentación Servicios"
            value={mockStats.serviceFeedback}
            subtitle="Áreas evaluadas"
            icon={BarChart3}
            trend="+18%"
            color="green"
          />
          <StatCard
            title="Retroalimentación Personal"
            value={mockStats.staffFeedback}
            subtitle="Evaluaciones de staff"
            icon={Users}
            trend="+12%"
            color="purple"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">Todos</option>
              <option value="service">Servicios</option>
              <option value="staff">Personal</option>
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

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">Todos los Estados</option>
              {statusTypes.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2">
                <Download size={14} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Service Feedback */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Retroalimentación de Servicios
              </h3>
              <span className="text-sm text-gray-500">
                {mockServiceFeedback.length} opiniones
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockServiceFeedback.map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} type="service" />
              ))}
            </div>
          </div>

          {/* Staff Feedback */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Retroalimentación de Personal
              </h3>
              <span className="text-sm text-gray-500">
                {mockStaffFeedback.length} evaluaciones
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockStaffFeedback.map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} type="staff" />
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feedback by Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Distribución por Áreas
            </h3>
            <div className="space-y-3">
              {serviceAreas.map(area => (
                <div key={area.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{area.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">
                      {Math.floor(Math.random() * 50) + 10}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Estado de Retroalimentación
            </h3>
            <div className="space-y-3">
              {statusTypes.map(status => {
                const StatusIcon = status.icon;
                return (
                  <div key={status.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{status.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800 w-8">
                        {Math.floor(Math.random() * 30) + 5}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;