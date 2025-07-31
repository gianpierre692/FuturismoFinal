import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ToastNotification = ({ 
  toast, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(true);
    
    if (toast.duration && toast.duration > 0) {
      const interval = setInterval(() => {
        if (!isPaused) {
          setProgress(prev => {
            const newProgress = prev - (100 / (toast.duration / 100));
            if (newProgress <= 0) {
              handleClose();
              return 0;
            }
            return newProgress;
          });
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration, isPaused]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  const handleAction = () => {
    if (toast.action && toast.action.onClick) {
      toast.action.onClick();
    }
    handleClose();
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
      case 'loading':
        return <ArrowPathIcon className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-green-200',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-red-200',
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-white',
          border: 'border-yellow-200',
          progress: 'bg-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-white',
          border: 'border-blue-200',
          progress: 'bg-blue-500'
        };
      case 'loading':
        return {
          bg: 'bg-white',
          border: 'border-blue-200',
          progress: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          progress: 'bg-gray-500'
        };
    }
  };

  const colors = getColors();
  
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <Transition
      as={Fragment}
      show={isVisible}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full`}>
        <div 
          className={`${colors.bg} ${colors.border} border rounded-lg shadow-lg overflow-hidden`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Progress bar */}
          {toast.duration && toast.duration > 0 && (
            <div className="w-full bg-gray-200 h-1">
              <div 
                className={`h-1 ${colors.progress} transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              
              <div className="ml-3 w-0 flex-1">
                {toast.title && (
                  <p className="text-sm font-medium text-gray-900">
                    {toast.title}
                  </p>
                )}
                <p className={`text-sm text-gray-600 ${toast.title ? 'mt-1' : ''}`}>
                  {toast.message}
                </p>
                
                {toast.action && (
                  <div className="mt-3">
                    <button
                      onClick={handleAction}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                    >
                      {toast.action.label}
                    </button>
                  </div>
                )}
              </div>
              
              {toast.dismissible !== false && (
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={handleClose}
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Cerrar</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default ToastNotification;