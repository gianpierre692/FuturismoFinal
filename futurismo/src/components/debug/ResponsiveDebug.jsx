import { useState, useEffect } from 'react';

const ResponsiveDebug = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = () => {
    if (windowSize.width < 640) return 'xs';
    if (windowSize.width < 768) return 'sm';
    if (windowSize.width < 1024) return 'md';
    if (windowSize.width < 1280) return 'lg';
    return 'xl';
  };

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-20 left-4 bg-black text-white p-2 rounded-lg text-xs z-50 opacity-75">
      <div>Width: {windowSize.width}px</div>
      <div>Height: {windowSize.height}px</div>
      <div>Breakpoint: {getBreakpoint()}</div>
      <div>Mobile: {windowSize.width < 768 ? 'Yes' : 'No'}</div>
    </div>
  );
};

export default ResponsiveDebug;