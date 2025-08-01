import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const InteractiveToast = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  action,
  actionLabel = 'Acción'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Entrada animada
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const types = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-out
      ${isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
    `}>
      <div className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border-l-4 rounded-lg shadow-lg p-4 relative overflow-hidden
        hover:shadow-xl transition-shadow duration-200
      `}>
        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20">
            <div 
              className="h-full bg-current opacity-40 transition-all ease-linear"
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Icon with pulse animation */}
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${config.iconColor} animate-pulse`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
            
            {/* Action button */}
            {action && (
              <button
                onClick={action}
                className={`
                  mt-2 text-xs font-semibold underline hover:no-underline
                  ${config.iconColor} hover:opacity-80 transition-opacity
                `}
              >
                {actionLabel}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10
              ${config.iconColor} transition-colors duration-150
            `}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default InteractiveToast;