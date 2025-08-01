import PropTypes from 'prop-types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import InteractiveCard from '../common/InteractiveCard';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    success: 'bg-success-100 text-success-600',
    danger: 'bg-red-100 text-red-600'
  };

  const isPositiveTrend = trend && trend.startsWith('+');

  return (
    <InteractiveCard className="p-4 sm:p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2 group-hover:scale-105 transition-transform duration-200">
            {value}
          </p>
          
          {trend && (
            <div className="flex items-center mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
              {isPositiveTrend ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1 animate-bounce" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1 animate-pulse" />
              )}
              <span className={`text-sm font-medium ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">vs mes anterior</span>
            </div>
          )}
        </div>
        
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Progress line animation */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </InteractiveCard>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger'])
};

export default StatsCard;