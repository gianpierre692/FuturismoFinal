const InteractiveSkeleton = ({ 
  type = 'text',
  lines = 3,
  className = '',
  animated = true 
}) => {
  const baseClass = `bg-gray-200 rounded ${animated ? 'animate-pulse' : ''}`;

  const types = {
    text: () => (
      <div className={`space-y-3 ${className}`}>
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className={`${baseClass} h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
          </div>
        ))}
      </div>
    ),

    card: () => (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="rounded-full bg-gray-200 h-12 w-12" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    ),

    dashboard: () => (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    ),

    table: () => (
      <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
              ))}
            </div>
          </div>
          
          {/* Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-gray-100 p-4">
              <div className="flex space-x-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    avatar: () => (
      <div className={`${baseClass} rounded-full h-10 w-10 ${className}`} />
    ),

    button: () => (
      <div className={`${baseClass} h-10 w-24 ${className}`} />
    )
  };

  return types[type]();
};

export default InteractiveSkeleton;