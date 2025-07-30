/**
 * Utility para combinar clases de Tailwind de manera eficiente
 * Similar a clsx/classnames pero más simple
 */
export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}

export default cn;