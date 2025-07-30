# 🚨 SOLUCIÓN DE EMERGENCIA - Error de Hooks

## Problema
Error: "Invalid hook call" en LoginRegister.jsx línea 156

## Soluciones (Intentar en orden)

### 1. Reiniciar el servidor de desarrollo (90% de probabilidad de éxito)
```bash
# Detener el servidor (Ctrl+C)
# Limpiar caché y reiniciar
npm run clean:win && npm run start:fresh
```

### 2. Si persiste, limpiar node_modules
```bash
# Cerrar VS Code y cualquier proceso node
rd /s /q node_modules
del package-lock.json
npm install
npm run dev
```

### 3. Verificar que no haya duplicados de React
```bash
# Buscar duplicados
npm dedupe
npm ls react
```

### 4. Si aún falla, problema con HMR de Vite
```bash
# Agregar a vite.config.js
server: {
  hmr: {
    overlay: false
  }
}
```

### 5. Solución temporal (mientras investigas)
Agregar al inicio de main.jsx:
```javascript
// Temporal fix para problemas de HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.location.reload();
  });
}
```

## Causa Probable
El error ocurrió después de eliminar los archivos LiveMap. Vite puede tener referencias en caché a los archivos eliminados, causando conflictos en el árbol de dependencias.

## Prevención Futura
1. Siempre limpiar caché después de eliminar archivos
2. Usar `npm run clean:win` antes de cambios grandes
3. Considerar agregar script de limpieza automática