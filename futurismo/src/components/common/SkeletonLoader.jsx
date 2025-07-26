import { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * SkeletonLoader - Componentes skeleton para mejor percepción de carga
 * 
 * BENEFICIO: Usuario percibe carga más rápida, mejor UX durante lazy loading
 * Mantiene el layout mientras carga el contenido real
 */

// Skeleton básico animado
const Skeleton = memo(({ className = '', width, height }) => (
  <div 
    className={`bg-gray-200 animate-pulse rounded ${className}`}
    style={{ width, height }}
  />
));

Skeleton.displayName = 'Skeleton';

// Skeleton para mapas
const MapSkeleton = memo(() => (
  <div className="w-full h-[600px] bg-gray-100 rounded-lg relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
    
    {/* Simular controles del mapa */}
    <div className="absolute top-4 right-4 space-y-2">
      <Skeleton className="w-8 h-8" />
      <Skeleton className="w-8 h-8" />
    </div>
    
    {/* Simular marcadores */}
    <div className="absolute top-1/4 left-1/3">
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
    <div className="absolute top-1/2 right-1/3">
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
    <div className="absolute bottom-1/3 left-1/2">
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
    
    {/* Texto de carga */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  </div>
));

MapSkeleton.displayName = 'MapSkeleton';

// Skeleton para formularios
const FormSkeleton = memo(({ fields = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    ))}
    <div className="flex gap-3 pt-4">
      <Skeleton className="h-10 w-24 rounded-md" />
      <Skeleton className="h-10 w-20 rounded-md" />
    </div>
  </div>
));

FormSkeleton.displayName = 'FormSkeleton';

// Skeleton para tabla/lista
const TableSkeleton = memo(({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex gap-4 p-4 bg-gray-50 rounded-t-lg">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4 flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
));

TableSkeleton.displayName = 'TableSkeleton';

// Skeleton para dashboard cards
const DashboardSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

// Skeleton para chat
const ChatSkeleton = memo(() => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-xs rounded-lg p-3 ${
          index % 2 === 0 ? 'bg-gray-100' : 'bg-blue-100'
        }`}>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ))}
  </div>
));

ChatSkeleton.displayName = 'ChatSkeleton';

// Skeleton para calendario
const CalendarSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow">
    {/* Header del calendario */}
    <div className="flex items-center justify-between p-4 border-b">
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
    
    {/* Grid del calendario */}
    <div className="p-4">
      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
      
      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <div key={index} className="h-20 p-2 border rounded">
            <Skeleton className="h-4 w-6 mb-2" />
            {index % 3 === 0 && <Skeleton className="h-2 w-full" />}
          </div>
        ))}
      </div>
    </div>
  </div>
));

CalendarSkeleton.displayName = 'CalendarSkeleton';

// Componente principal que exporta todos los skeletons
const SkeletonLoader = {
  Map: MapSkeleton,
  Form: FormSkeleton,
  Table: TableSkeleton,
  Dashboard: DashboardSkeleton,
  Chat: ChatSkeleton,
  Calendar: CalendarSkeleton,
  Basic: Skeleton
};

// PropTypes
Skeleton.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

FormSkeleton.propTypes = {
  fields: PropTypes.number
};

TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number
};

export default SkeletonLoader;