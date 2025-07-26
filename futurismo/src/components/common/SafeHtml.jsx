import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Logger from '../../utils/logger.js';

/**
 * SafeHtml - Componente para renderizar HTML de forma segura
 * 
 * BENEFICIO: Previene XSS, sanitiza contenido HTML
 * Reemplaza dangerouslySetInnerHTML con versión segura
 */

// Lista blanca de tags permitidos
const ALLOWED_TAGS = [
  'p', 'div', 'span', 'br', 'strong', 'b', 'em', 'i', 'u', 
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img'
];

// Lista blanca de atributos permitidos
const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  '*': ['class', 'id', 'style'] // Atributos permitidos para todos los tags
};

// Patrones peligrosos para detectar
const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /vbscript:/gi,
  /data:(?!image\/)/gi, // Permitir data: solo para imágenes
  /on\w+\s*=/gi, // Event handlers (onclick, onload, etc.)
  /<script/gi,
  /<iframe/gi,
  /<embed/gi,
  /<object/gi,
  /<form/gi,
  /<input/gi,
  /<button/gi
];

// Función básica de sanitización
const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Detectar patrones peligrosos
  const isDangerous = DANGEROUS_PATTERNS.some(pattern => pattern.test(html));
  if (isDangerous) {
    Logger.warn('Dangerous HTML content detected and blocked', { html: html.substring(0, 100) });
    return '<!-- Contenido HTML bloqueado por seguridad -->';
  }

  // Crear un elemento temporal para parsing
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Función recursiva para limpiar nodos
  const cleanNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tagName = node.tagName.toLowerCase();

    // Verificar si el tag está permitido
    if (!ALLOWED_TAGS.includes(tagName)) {
      Logger.debug(`Removed disallowed tag: ${tagName}`);
      // Devolver solo el contenido de texto
      return node.textContent || '';
    }

    // Crear elemento limpio
    const cleanElement = document.createElement(tagName);

    // Limpiar atributos
    const allowedAttrs = [
      ...(ALLOWED_ATTRIBUTES[tagName] || []),
      ...(ALLOWED_ATTRIBUTES['*'] || [])
    ];

    Array.from(node.attributes).forEach(attr => {
      if (allowedAttrs.includes(attr.name.toLowerCase())) {
        // Validar valor del atributo
        let value = attr.value;

        // Validaciones específicas
        if (attr.name === 'href') {
          // Solo permitir HTTP(S) y mailto
          if (!/^(https?:\/\/|mailto:|#)/.test(value)) {
            Logger.debug(`Blocked unsafe href: ${value}`);
            return;
          }
        }

        if (attr.name === 'src') {
          // Solo permitir HTTP(S) y data: para imágenes
          if (!/^(https?:\/\/|data:image\/)/.test(value)) {
            Logger.debug(`Blocked unsafe src: ${value}`);
            return;
          }
        }

        cleanElement.setAttribute(attr.name, value);
      } else {
        Logger.debug(`Removed disallowed attribute: ${attr.name}`);
      }
    });

    // Limpiar hijos recursivamente
    Array.from(node.childNodes).forEach(child => {
      const cleanedChild = cleanNode(child);
      if (typeof cleanedChild === 'string') {
        cleanElement.appendChild(document.createTextNode(cleanedChild));
      } else if (cleanedChild instanceof Node) {
        cleanElement.appendChild(cleanedChild);
      }
    });

    return cleanElement;
  };

  // Limpiar todos los nodos
  const cleanedDiv = document.createElement('div');
  Array.from(tempDiv.childNodes).forEach(child => {
    const cleanedChild = cleanNode(child);
    if (typeof cleanedChild === 'string') {
      cleanedDiv.appendChild(document.createTextNode(cleanedChild));
    } else if (cleanedChild instanceof Node) {
      cleanedDiv.appendChild(cleanedChild);
    }
  });

  return cleanedDiv.innerHTML;
};

const SafeHtml = memo(({ 
  html, 
  className = '', 
  fallback = null,
  maxLength = 10000,
  tag: Tag = 'div',
  ...props 
}) => {
  const sanitizedHtml = useMemo(() => {
    if (!html) return '';

    // Limitar longitud para prevenir DoS
    const truncatedHtml = html.length > maxLength 
      ? html.substring(0, maxLength) + '...' 
      : html;

    try {
      return sanitizeHtml(truncatedHtml);
    } catch (error) {
      Logger.error('Error sanitizing HTML:', error);
      return '';
    }
  }, [html, maxLength]);

  // Si no hay contenido, mostrar fallback
  if (!sanitizedHtml) {
    return fallback;
  }

  return (
    <Tag 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      {...props}
    />
  );
});

SafeHtml.displayName = 'SafeHtml';

SafeHtml.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallback: PropTypes.node,
  maxLength: PropTypes.number,
  tag: PropTypes.string
};

// Hook para usar sanitización en otros lugares
export const useSanitizedHtml = (html, options = {}) => {
  return useMemo(() => {
    const { maxLength = 10000 } = options;
    
    if (!html) return '';
    
    const truncatedHtml = html.length > maxLength 
      ? html.substring(0, maxLength) + '...' 
      : html;
    
    try {
      return sanitizeHtml(truncatedHtml);
    } catch (error) {
      Logger.error('Error in useSanitizedHtml:', error);
      return '';
    }
  }, [html, options.maxLength]);
};

// Función helper para validar HTML antes de usar
export const isHtmlSafe = (html) => {
  if (!html || typeof html !== 'string') return true;
  
  return !DANGEROUS_PATTERNS.some(pattern => pattern.test(html));
};

export default SafeHtml;