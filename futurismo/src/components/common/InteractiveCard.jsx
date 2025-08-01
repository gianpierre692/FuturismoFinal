import { useState } from 'react';

const InteractiveCard = ({
  children,
  onClick,
  hover = true,
  clickable = false,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (clickable) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  const baseClass = `
    bg-white rounded-xl border border-gray-200 shadow-sm
    transition-all duration-200 ease-out
    ${hover ? 'hover:shadow-md hover:-translate-y-0.5' : ''}
    ${clickable ? 'cursor-pointer active:scale-98' : ''}
    ${isPressed ? 'scale-95 shadow-inner' : ''}
    ${className}
  `.trim();

  return (
    <div
      className={baseClass}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      {...props}
    >
      {children}
      
      {/* Hover glow effect */}
      {hover && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
};

export default InteractiveCard;