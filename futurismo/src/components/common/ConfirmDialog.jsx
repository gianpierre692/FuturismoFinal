import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ExclamationTriangleIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  destructive = false,
  icon: CustomIcon,
  details
}) => {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (destructive && isOpen) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [destructive, isOpen]);

  const getIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-6 h-6" />;
    
    switch (type) {
      case 'danger':
      case 'delete':
        return <TrashIcon className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
      case 'success':
        return <CheckIcon className="w-6 h-6 text-green-600" />;
      case 'secure':
        return <ShieldCheckIcon className="w-6 h-6 text-blue-600" />;
      default:
        return <ExclamationTriangleIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
      case 'delete':
        return {
          bgIcon: 'bg-red-100',
          textPrimary: 'text-red-600',
          textSecondary: 'text-red-500',
          buttonPrimary: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          buttonSecondary: 'text-red-600 hover:text-red-500'
        };
      case 'warning':
        return {
          bgIcon: 'bg-yellow-100',
          textPrimary: 'text-yellow-600',
          textSecondary: 'text-yellow-500',
          buttonPrimary: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          buttonSecondary: 'text-yellow-600 hover:text-yellow-500'
        };
      case 'info':
        return {
          bgIcon: 'bg-blue-100',
          textPrimary: 'text-blue-600',
          textSecondary: 'text-blue-500',
          buttonPrimary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          buttonSecondary: 'text-blue-600 hover:text-blue-500'
        };
      case 'success':
        return {
          bgIcon: 'bg-green-100',
          textPrimary: 'text-green-600',
          textSecondary: 'text-green-500',
          buttonPrimary: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          buttonSecondary: 'text-green-600 hover:text-green-500'
        };
      default:
        return {
          bgIcon: 'bg-gray-100',
          textPrimary: 'text-gray-600',
          textSecondary: 'text-gray-500',
          buttonPrimary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
          buttonSecondary: 'text-gray-600 hover:text-gray-500'
        };
    }
  };

  const colors = getColors();

  const handleConfirm = async () => {
    if (countdown > 0) return;
    
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // El error será manejado por el toast
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors.bgIcon} sm:mx-0 sm:h-10 sm:w-10`}>
                    {getIcon()}
                  </div>
                  
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {title}
                    </Dialog.Title>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {message}
                      </p>
                      
                      {details && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-600">
                            {details}
                          </p>
                        </div>
                      )}
                      
                      {destructive && countdown > 0 && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-xs text-red-600 text-center">
                            Puedes confirmar en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ${
                      countdown > 0 || loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : colors.buttonPrimary
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    onClick={handleConfirm}
                    disabled={countdown > 0 || loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      confirmText
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    disabled={loading}
                  >
                    {cancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmDialog;