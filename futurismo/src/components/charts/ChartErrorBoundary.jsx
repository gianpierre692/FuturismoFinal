import React from 'react';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded border border-gray-200">
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2 text-2xl">📊</div>
            <p className="text-sm text-gray-500">Gráfico no disponible</p>
            <p className="text-xs text-gray-400 mt-1">Error al renderizar</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;