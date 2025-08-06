import { useEffect } from 'react';
import Logger from '../../utils/logger';

/**
 * OverflowGuard - Componente que detecta y reporta overflow horizontal
 * Útil para debugging en desarrollo
 */
export const OverflowGuard = ({ children, name = 'Component' }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const checkOverflow = () => {
        const element = document.getElementById(`overflow-guard-${name}`);
        if (element) {
          const isOverflowing = element.scrollWidth > element.clientWidth;
          if (isOverflowing) {
            Logger.warn(
              `⚠️ Overflow detectado en ${name}:`,
              {
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth,
                overflow: element.scrollWidth - element.clientWidth
              }
            );
          }
        }
      };

      // Check on mount and resize
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      
      return () => window.removeEventListener('resize', checkOverflow);
    }
  }, [name]);

  return (
    <div 
      id={`overflow-guard-${name}`}
      className="overflow-x-hidden max-w-full"
    >
      {children}
    </div>
  );
};

export default OverflowGuard;