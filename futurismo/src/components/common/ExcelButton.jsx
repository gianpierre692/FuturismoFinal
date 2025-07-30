import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ExcelButton = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  text = 'Excel',
  fullText = false,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 
        bg-green-600 hover:bg-green-700 
        text-white font-medium
        rounded-lg
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
      <span>{fullText ? `Exportar ${text}` : text}</span>
    </button>
  );
};

export default ExcelButton;