import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';
import InteractiveButton from '../common/InteractiveButton';
import InteractiveCard from '../common/InteractiveCard';

const ServiceChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('month');

  // Datos mock para los gráficos
  const lineData = [
    { name: 'Ene', reservas: 65, turistas: 780, ingresos: 27300 },
    { name: 'Feb', reservas: 78, turistas: 936, ingresos: 32760 },
    { name: 'Mar', reservas: 92, turistas: 1104, ingresos: 38640 },
    { name: 'Abr', reservas: 81, turistas: 972, ingresos: 34020 },
    { name: 'May', reservas: 98, turistas: 1176, ingresos: 41160 },
    { name: 'Jun', reservas: 105, turistas: 1260, ingresos: 44100 },
    { name: 'Jul', reservas: 112, turistas: 1344, ingresos: 47040 }
  ];

  const barData = [
    { tour: 'City Tour Lima', reservas: 45, ingresos: 15750 },
    { tour: 'Gastronómico', reservas: 38, ingresos: 24700 },
    { tour: 'Islas Palomino', reservas: 32, ingresos: 27200 },
    { tour: 'Pachacámac', reservas: 28, ingresos: 12600 },
    { tour: 'Líneas de Nazca', reservas: 22, ingresos: 17600 }
  ];

  const pieData = [
    { name: 'Tours Regulares', value: 65, color: '#1E40AF' },
    { name: 'Tours Privados', value: 25, color: '#F59E0B' },
    { name: 'Traslados', value: 10, color: '#10B981' }
  ];

  const kpiData = {
    totalReservas: {
      actual: 112,
      anterior: 98,
      crecimiento: 14.3
    },
    totalTuristas: {
      actual: 1344,
      anterior: 1176,
      crecimiento: 14.3
    },
    ingresosTotales: {
      actual: 47040,
      anterior: 41160,
      crecimiento: 14.3
    },
    tasaOcupacion: {
      actual: 87.5,
      anterior: 82.3,
      crecimiento: 6.3
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'ingresos' ? `$${formatters.formatCurrency(entry.value)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <InteractiveCard className="bg-white p-6 group">
      {/* Header con controles */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold group-hover:text-primary-600 transition-colors duration-300">Análisis de Servicios</h3>
        
        <div className="flex items-center gap-4">
          {/* Selector de rango de tiempo */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>

          {/* Selector de tipo de gráfico */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <InteractiveButton
              variant={chartType === 'line' ? 'primary' : 'ghost'}
              size="sm"
              className={`px-3 py-1 text-sm font-medium ${
                chartType === 'line'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setChartType('line')}
            >
              Líneas
            </InteractiveButton>
            <InteractiveButton
              variant={chartType === 'bar' ? 'primary' : 'ghost'}
              size="sm"
              className={`px-3 py-1 text-sm font-medium ${
                chartType === 'bar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setChartType('bar')}
            >
              Barras
            </InteractiveButton>
            <InteractiveButton
              variant={chartType === 'pie' ? 'primary' : 'ghost'}
              size="sm"
              className={`px-3 py-1 text-sm font-medium ${
                chartType === 'pie'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setChartType('pie')}
            >
              Torta
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InteractiveCard className="bg-primary-50 p-4 group/kpi cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-primary-900 group-hover/kpi:text-primary-800 transition-colors">Total Reservas</p>
            <div className={`flex items-center text-xs font-medium group-hover/kpi:scale-110 transition-transform duration-200 ${
              kpiData.totalReservas.crecimiento >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.totalReservas.crecimiento >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1 animate-bounce" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1 animate-pulse" />
              )}
              {Math.abs(kpiData.totalReservas.crecimiento)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-800 group-hover/kpi:scale-105 transition-transform duration-200">{kpiData.totalReservas.actual}</p>
          <p className="text-xs text-primary-700 mt-1 group-hover/kpi:text-primary-600 transition-colors">
            vs. {kpiData.totalReservas.anterior} mes anterior
          </p>
        </InteractiveCard>

        <InteractiveCard className="bg-secondary-50 p-4 group/kpi cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-secondary-900 group-hover/kpi:text-secondary-800 transition-colors">Total Turistas</p>
            <div className={`flex items-center text-xs font-medium group-hover/kpi:scale-110 transition-transform duration-200 ${
              kpiData.totalTuristas.crecimiento >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.totalTuristas.crecimiento >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1 animate-bounce" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1 animate-pulse" />
              )}
              {Math.abs(kpiData.totalTuristas.crecimiento)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-secondary-800 group-hover/kpi:scale-105 transition-transform duration-200">{kpiData.totalTuristas.actual}</p>
          <p className="text-xs text-secondary-700 mt-1 group-hover/kpi:text-secondary-600 transition-colors">
            vs. {kpiData.totalTuristas.anterior} mes anterior
          </p>
        </InteractiveCard>

        <InteractiveCard className="bg-success-50 p-4 group/kpi cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-success-900 group-hover/kpi:text-success-800 transition-colors">Ingresos Totales</p>
            <div className={`flex items-center text-xs font-medium group-hover/kpi:scale-110 transition-transform duration-200 ${
              kpiData.ingresosTotales.crecimiento >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.ingresosTotales.crecimiento >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1 animate-bounce" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1 animate-pulse" />
              )}
              {Math.abs(kpiData.ingresosTotales.crecimiento)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-success-800 group-hover/kpi:scale-105 transition-transform duration-200">
            ${formatters.formatCurrency(kpiData.ingresosTotales.actual)}
          </p>
          <p className="text-xs text-success-700 mt-1 group-hover/kpi:text-success-600 transition-colors">
            vs. ${formatters.formatCurrency(kpiData.ingresosTotales.anterior)} mes anterior
          </p>
        </InteractiveCard>

        <InteractiveCard className="bg-purple-50 p-4 group/kpi cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900 group-hover/kpi:text-purple-800 transition-colors">Tasa Ocupación</p>
            <div className={`flex items-center text-xs font-medium group-hover/kpi:scale-110 transition-transform duration-200 ${
              kpiData.tasaOcupacion.crecimiento >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.tasaOcupacion.crecimiento >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1 animate-bounce" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1 animate-pulse" />
              )}
              {Math.abs(kpiData.tasaOcupacion.crecimiento)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-800 group-hover/kpi:scale-105 transition-transform duration-200">{kpiData.tasaOcupacion.actual}%</p>
          <p className="text-xs text-purple-700 mt-1 group-hover/kpi:text-purple-600 transition-colors">
            vs. {kpiData.tasaOcupacion.anterior}% mes anterior
          </p>
        </InteractiveCard>
      </div>

      {/* Gráfico principal */}
      <div className="h-80">
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="reservas" 
                stroke="#1E40AF" 
                strokeWidth={2}
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Reservas"
              />
              <Line 
                type="monotone" 
                dataKey="turistas" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Turistas"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="tour" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="reservas" fill="#1E40AF" name="Reservas" />
              <Bar dataKey="ingresos" fill="#10B981" name="Ingresos ($)" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Resumen inferior */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group cursor-pointer">
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Tour más popular</p>
            <p className="font-semibold text-gray-900 group-hover:text-primary-600 group-hover:scale-105 transition-all duration-200">City Tour Lima</p>
          </div>
          <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group cursor-pointer">
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Promedio por reserva</p>
            <p className="font-semibold text-gray-900 group-hover:text-green-600 group-hover:scale-105 transition-all duration-200">$420</p>
          </div>
          <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group cursor-pointer">
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Mejor día</p>
            <p className="font-semibold text-gray-900 group-hover:text-blue-600 group-hover:scale-105 transition-all duration-200">Sábados</p>
          </div>
          <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group cursor-pointer">
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">Tasa conversión</p>
            <p className="font-semibold text-gray-900 group-hover:text-purple-600 group-hover:scale-105 transition-all duration-200">23.5%</p>
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
};

export default ServiceChart;