import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, BarChart, Bar, ComposedChart, Area, AreaChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import InteractiveButton from '../common/InteractiveButton';
import InteractiveCard from '../common/InteractiveCard';

const MonthlyIncomeChart = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState('area'); // area, bar, line, composed
  const [timeframe, setTimeframe] = useState('thisMonth'); // thisMonth, lastMonth, comparison
  const [showDetails, setShowDetails] = useState(false);

  // Datos más detallados para el mes
  const monthlyData = useMemo(() => {
    const baseData = {
      thisMonth: [
        { 
          day: 'Ene', 
          dayFull: 'Enero',
          ingresos: 125000, 
          reservas: 285, 
          promedio: 439,
          tours: ['City Tour', 'Gastronómico', 'Palomino'], 
          turistas: 812,
          meta: 100000,
          porcentajeMeta: 125
        },
        { 
          day: 'Feb', 
          dayFull: 'Febrero',
          ingresos: 118000, 
          reservas: 262, 
          promedio: 450,
          tours: ['Palomino', 'City Tour', 'Pachacámac'], 
          turistas: 765,
          meta: 100000,
          porcentajeMeta: 118
        },
        { 
          day: 'Mar', 
          dayFull: 'Marzo',
          ingresos: 142000, 
          reservas: 310, 
          promedio: 458,
          tours: ['Gastronómico', 'Pachacámac', 'City Tour'], 
          turistas: 890,
          meta: 120000,
          porcentajeMeta: 118.3
        },
        { 
          day: 'Abr', 
          dayFull: 'Abril',
          ingresos: 136000, 
          reservas: 298, 
          promedio: 456,
          tours: ['City Tour', 'Palomino', 'Líneas de Nazca'], 
          turistas: 845,
          meta: 120000,
          porcentajeMeta: 113.3
        },
        { 
          day: 'May', 
          dayFull: 'Mayo',
          ingresos: 148000, 
          reservas: 325, 
          promedio: 455,
          tours: ['Gastronómico', 'City Tour', 'Palomino'], 
          turistas: 920,
          meta: 140000,
          porcentajeMeta: 105.7
        },
        { 
          day: 'Jun', 
          dayFull: 'Junio',
          ingresos: 156000, 
          reservas: 342, 
          promedio: 456,
          tours: ['Todos los tours'], 
          turistas: 968,
          meta: 140000,
          porcentajeMeta: 111.4
        },
        { 
          day: 'Jul', 
          dayFull: 'Julio',
          ingresos: 165000, 
          reservas: 356, 
          promedio: 463,
          tours: ['City Tour', 'Gastronómico', 'Pachacámac'], 
          turistas: 1012,
          meta: 150000,
          porcentajeMeta: 110
        }
      ],
      lastMonth: [
        { day: 'Ene', ingresos: 98000, reservas: 245, promedio: 400 },
        { day: 'Feb', ingresos: 105000, reservas: 238, promedio: 441 },
        { day: 'Mar', ingresos: 128000, reservas: 285, promedio: 449 },
        { day: 'Abr', ingresos: 122000, reservas: 275, promedio: 444 },
        { day: 'May', ingresos: 138000, reservas: 302, promedio: 457 },
        { day: 'Jun', ingresos: 145000, reservas: 318, promedio: 456 },
        { day: 'Jul', ingresos: 152000, reservas: 330, promedio: 461 }
      ]
    };

    if (timeframe === 'comparison') {
      return baseData.thisMonth.map((current, index) => ({
        ...current,
        ingresosAnterior: baseData.lastMonth[index].ingresos,
        reservasAnterior: baseData.lastMonth[index].reservas,
        diferencia: current.ingresos - baseData.lastMonth[index].ingresos,
        porcentajeCambio: ((current.ingresos - baseData.lastMonth[index].ingresos) / baseData.lastMonth[index].ingresos * 100).toFixed(1)
      }));
    }

    return baseData[timeframe];
  }, [timeframe]);

  // Calcular estadísticas del mes
  const monthStats = useMemo(() => {
    const total = monthlyData.reduce((sum, day) => sum + day.ingresos, 0);
    const totalReservas = monthlyData.reduce((sum, day) => sum + day.reservas, 0);
    const promedio = total / monthlyData.length;
    const mejorDia = monthlyData.reduce((best, day) => day.ingresos > best.ingresos ? day : best);
    const metaTotal = monthlyData.reduce((sum, day) => sum + (day.meta || 4000), 0);
    const porcentajeMeta = (total / metaTotal * 100).toFixed(1);

    return {
      total,
      totalReservas,
      promedio: promedio.toFixed(0),
      mejorDia: mejorDia.dayFull || mejorDia.day,
      mejorDiaIngreso: mejorDia.ingresos,
      porcentajeMeta
    };
  }, [monthlyData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <InteractiveCard className="bg-white p-4 shadow-xl border border-gray-200 min-w-[250px]">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4 text-primary-600" />
              {data.dayFull || label}
            </h4>
            
            {payload.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{entry.name}:</span>
                <span className="font-medium" style={{ color: entry.color }}>
                  {entry.name.includes('$') || entry.name.includes('Ingreso') 
                    ? `$${entry.value.toLocaleString()}` 
                    : entry.value}
                </span>
              </div>
            ))}
            
            {data.tours && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs text-gray-500 mb-1">Tours activos:</p>
                <p className="text-xs text-gray-700">{data.tours.join(', ')}</p>
              </div>
            )}
            
            {data.porcentajeMeta && (
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Meta cumplida:</span>
                  <span className={`text-xs font-medium ${
                    data.porcentajeMeta >= 100 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {data.porcentajeMeta}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </InteractiveCard>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: monthlyData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (viewType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              {timeframe === 'comparison' && (
                <linearGradient id="colorAnterior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B7280" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6B7280" stopOpacity={0.05}/>
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIngresos)"
              name="Ingresos ($)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#3B82F6' }}
            />
            {timeframe === 'comparison' && (
              <Area
                type="monotone"
                dataKey="ingresosAnterior"
                stroke="#6B7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorAnterior)"
                name="Mes Anterior ($)"
                dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
              />
            )}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis 
              stroke="#6B7280"
              tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="ingresos" 
              fill="#3B82F6" 
              name="Ingresos ($)"
              radius={[4, 4, 0, 0]}
            />
            {timeframe === 'comparison' && (
              <Bar 
                dataKey="ingresosAnterior" 
                fill="#6B7280" 
                name="Mes Anterior ($)"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        );

      case 'line': 
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis 
              stroke="#6B7280"
              tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#3B82F6' }}
              name="Ingresos ($)"
            />
            {timeframe === 'comparison' && (
              <Line
                type="monotone"
                dataKey="ingresosAnterior"
                stroke="#6B7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                name="Mes Anterior ($)"
              />
            )}
          </LineChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis 
              yAxisId="left"
              stroke="#6B7280"
              tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#10B981"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="ingresos" 
              fill="#3B82F6" 
              name="Ingresos ($)"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="reservas"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Reservas"
              yAxisId="right"
            />
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <InteractiveCard className="bg-white p-6 group">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <CurrencyDollarIcon className="w-6 h-6 text-primary-600 group-hover:animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {t('dashboard.monthlyIncome')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('dashboard.dailyIncomeAnalysis')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector de período */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="thisMonth">{t('dashboard.timeRanges.thisMonth')}</option>
            <option value="lastMonth">{t('dashboard.timeRanges.lastMonth')}</option>
            <option value="comparison">{t('dashboard.timeRanges.comparison')}</option>
          </select>

          {/* Tipo de gráfico */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'area', label: t('dashboard.chartTypes.area'), icon: ChartBarIcon },
              { key: 'bar', label: t('dashboard.chartTypes.bar'), icon: ChartBarIcon },
              { key: 'line', label: t('dashboard.chartTypes.line'), icon: ArrowTrendingUpIcon },
              { key: 'composed', label: t('dashboard.chartTypes.mixed'), icon: EyeIcon }
            ].map(({ key, label, icon: Icon }) => (
              <InteractiveButton
                key={key}
                variant="ghost"
                size="sm"
                className={`px-3 py-1.5 text-sm font-medium ${
                  viewType === key
                    ? 'bg-white !text-gray-900 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                } transition-all duration-200`}
                onClick={() => setViewType(key)}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              </InteractiveButton>
            ))}
          </div>

          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            <div className="flex items-center gap-1.5">
              {showDetails ? <EyeIcon className="w-4 h-4" /> : <ArrowPathIcon className="w-4 h-4" />}
              <span>{showDetails ? t('common.hide') : t('common.details')}</span>
            </div>
          </InteractiveButton>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <InteractiveCard className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 group/stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-primary-600 font-medium">{t('dashboard.monthTotal')}</p>
              <p className="text-xl font-bold text-primary-800 group-hover/stat:scale-105 transition-transform">
                ${monthStats.total.toLocaleString()}
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-primary-400 group-hover/stat:text-primary-600 group-hover/stat:animate-pulse transition-all" />
          </div>
        </InteractiveCard>

        <InteractiveCard className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 group/stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">{t('dashboard.dailyAverage')}</p>
              <p className="text-xl font-bold text-green-800 group-hover/stat:scale-105 transition-transform">
                ${monthStats.promedio}
              </p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-green-400 group-hover/stat:text-green-600 group-hover/stat:animate-bounce transition-all" />
          </div>
        </InteractiveCard>

        <InteractiveCard className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 group/stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">{t('dashboard.bestDay')}</p>
              <p className="text-sm font-bold text-purple-800 group-hover/stat:scale-105 transition-transform">
                {monthStats.mejorDia}
              </p>
              <p className="text-xs text-purple-600">${monthStats.mejorDiaIngreso.toLocaleString()}</p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-purple-400 group-hover/stat:text-purple-600 group-hover/stat:animate-spin transition-all" />
          </div>
        </InteractiveCard>

        <InteractiveCard className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 group/stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-medium">{t('dashboard.goalAchieved')}</p>
              <p className={`text-xl font-bold group-hover/stat:scale-105 transition-transform ${
                parseFloat(monthStats.porcentajeMeta) >= 100 ? 'text-green-800' : 'text-orange-800'
              }`}>
                {monthStats.porcentajeMeta}%
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover/stat:scale-110 transition-transform ${
              parseFloat(monthStats.porcentajeMeta) >= 100 ? 'bg-green-200 text-green-600' : 'bg-orange-200 text-orange-600'
            }`}>
              {parseFloat(monthStats.porcentajeMeta) >= 100 ? '✓' : '!'}
            </div>
          </div>
        </InteractiveCard>
      </div>

      {/* Gráfico principal */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Detalles por Día</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyData.map((day, index) => (
              <InteractiveCard key={index} className="p-4 border border-gray-200 group/detail">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 group-hover/detail:text-primary-600 transition-colors">
                    {day.dayFull || day.day}
                  </h5>
                  {day.porcentajeCambio && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      parseFloat(day.porcentajeCambio) >= 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {day.porcentajeCambio > 0 ? '+' : ''}{day.porcentajeCambio}%
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ingresos:</span>
                    <span className="font-medium">${day.ingresos.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reservas:</span>
                    <span className="font-medium">{day.reservas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Promedio:</span>
                    <span className="font-medium">${day.promedio}</span>
                  </div>
                  {day.turistas && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Turistas:</span>
                      <span className="font-medium">{day.turistas}</span>
                    </div>
                  )}
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      )}
    </InteractiveCard>
  );
};

export default MonthlyIncomeChart;