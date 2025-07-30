import { cn } from '../../utils/cn';

/**
 * ResponsiveContainer - Contenedor que previene overflow horizontal
 * Usar este componente para envolver cualquier contenido que pueda causar problemas de responsive
 */
export const ResponsiveContainer = ({ 
  children, 
  className = '',
  as: Component = 'div',
  maxWidth = 'max-w-full'
}) => {
  return (
    <Component 
      className={cn(
        'overflow-x-hidden',
        'overflow-y-visible',
        maxWidth,
        'relative',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const ResponsiveCard = ({ 
  children, 
  className = '',
  noPadding = false 
}) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-sm',
        'overflow-hidden', // Importante para prevenir overflow
        'max-w-full',
        'relative',
        !noPadding && 'p-4 sm:p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export const ResponsiveGrid = ({ 
  children, 
  className = '',
  cols = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4
  }
}) => {
  const gridCols = `grid-cols-${cols.default} sm:grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg}`;
  
  return (
    <div 
      className={cn(
        'grid gap-4',
        'max-w-full',
        'overflow-hidden',
        gridCols,
        className
      )}
    >
      {children}
    </div>
  );
};

export const ResponsiveFlex = ({ 
  children, 
  className = '',
  direction = 'row',
  wrap = true
}) => {
  return (
    <div 
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        wrap && 'flex-wrap',
        'max-w-full',
        'overflow-hidden',
        '[&>*]:min-w-0', // Previene que los children causen overflow
        '[&>*]:flex-shrink',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;