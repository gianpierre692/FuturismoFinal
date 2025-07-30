import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Detectar cambios de tamaño
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Detectar scroll
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed z-[60] rounded-full bg-primary-600 text-white shadow-xl 
        hover:bg-primary-700 transition-all duration-300 transform
        hover:scale-110 active:scale-95 border-2 border-white
        ${isMobile 
          ? 'bottom-[88px] right-4 w-12 h-12' // En móvil: 88px desde abajo (16px arriba del nav de 64px + 8px margen)
          : 'bottom-8 right-8 w-14 h-14'      // En desktop: posición normal
        }
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
      `}
      aria-label="Volver arriba"
    >
      <ChevronUpIcon className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} mx-auto`} />
    </button>
  );
};

export default BackToTopButton;