import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/responsive-fixes.css';
import './styles/form-responsive.css';
import './utils/i18n';

// Configurar idioma para date-fns
import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';

setDefaultOptions({ locale: es });

// Service Worker deshabilitado - Esta es una aplicación web responsive, no una PWA

// PWA deshabilitada - Esta es una aplicación web responsive

// Warnings de Recharts suprimidos sin usar console

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);