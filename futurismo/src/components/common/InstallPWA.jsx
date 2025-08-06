import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import Logger from '../../utils/logger';

const InstallPWA = () => {
  const { t } = useTranslation();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Detectar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Ya está instalada
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Mostrar prompt para iOS si no está instalada
    if (isIOSDevice) {
      const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;
      if (!isInStandaloneMode) {
        // Mostrar solo una vez por sesión
        if (!sessionStorage.getItem('iosInstallPromptShown')) {
          setTimeout(() => {
            setShowInstallPrompt(true);
            sessionStorage.setItem('iosInstallPromptShown', 'true');
          }, 3000);
        }
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!isIOS && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        Logger.debug('PWA instalada');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Guardar en localStorage que fue descartado
    localStorage.setItem('pwaInstallDismissed', 'true');
  };

  if (!showInstallPrompt) return null;

  return (
    <>
      {/* Banner superior para escritorio/Android */}
      {!isIOS && (
        <div className="fixed top-0 left-0 right-0 bg-primary-600 text-white p-4 shadow-lg z-50 animate-slide-down">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowDownTrayIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">Instala Futurismo</p>
                <p className="text-sm text-primary-100">
                  Accede más rápido y trabaja sin conexión
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para iOS */}
      {isIOS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Instalar Futurismo
                </h3>
                <p className="text-gray-600 mt-1">
                  Agrégala a tu pantalla de inicio
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    1. Toca el botón compartir
                  </p>
                  <p className="text-sm text-gray-600">
                    En la barra inferior de Safari
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    2. Selecciona "Agregar a inicio"
                  </p>
                  <p className="text-sm text-gray-600">
                    Desplázate si es necesario
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    3. Toca "Agregar"
                  </p>
                  <p className="text-sm text-gray-600">
                    ¡Y listo! Accede desde tu inicio
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Beneficios:</span> Acceso rápido, 
                notificaciones instantáneas y funciona sin conexión.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;