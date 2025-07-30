import PropTypes from 'prop-types';

/**
 * Componente de tabla responsive que se adapta a móvil
 * En móvil muestra los datos en formato de cards
 * En desktop muestra tabla tradicional
 */
const ResponsiveTable = ({ 
  columns, 
  data, 
  mobileColumns = [], // Columnas a mostrar en móvil
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  className = ''
}) => {
  // Si no se especifican columnas móviles, usar las primeras 3
  const mobileCols = mobileColumns.length > 0 ? mobileColumns : columns.slice(0, 3);

  return (
    <>
      {/* Vista Desktop - Tabla tradicional */}
      <div className={`hidden sm:block overflow-x-auto ${className}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-4 whitespace-nowrap text-sm ${column.cellClassName || ''}`}
                    >
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista Móvil - Cards */}
      <div className="sm:hidden space-y-3">
        {data.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`bg-white p-4 rounded-lg shadow ${
                onRowClick ? 'cursor-pointer active:bg-gray-50' : ''
              }`}
            >
              {/* Mostrar solo columnas principales en móvil */}
              {mobileCols.map((column, colIndex) => (
                <div key={colIndex} className="mb-2 last:mb-0">
                  <span className="text-xs text-gray-500 uppercase">{column.header}:</span>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </div>
                </div>
              ))}
              
              {/* Mostrar indicador si hay más información */}
              {columns.length > mobileCols.length && onRowClick && (
                <div className="mt-3 text-xs text-primary-600 font-medium">
                  Ver más detalles →
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

ResponsiveTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
      className: PropTypes.string,
      cellClassName: PropTypes.string
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  mobileColumns: PropTypes.array,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string,
  className: PropTypes.string
};

export default ResponsiveTable;