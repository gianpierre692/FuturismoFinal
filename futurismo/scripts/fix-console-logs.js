#!/usr/bin/env node

/**
 * Script para reemplazar automáticamente console.* con Logger
 * Uso: node scripts/fix-console-logs.js
 */

const fs = require('fs');
const path = require('path');

// Configuración
const srcDir = path.join(__dirname, '..', 'src');
const loggerRelativePaths = {
  'components': '../../utils/logger',
  'pages': '../utils/logger',
  'services': '../utils/logger',
  'stores': '../utils/logger',
  'hooks': '../utils/logger',
  'utils': './logger'
};

// Patrones de reemplazo
const replacements = [
  { pattern: /console\.log\(/g, replacement: 'Logger.debug(' },
  { pattern: /console\.error\(/g, replacement: 'Logger.error(' },
  { pattern: /console\.warn\(/g, replacement: 'Logger.warn(' },
  { pattern: /console\.info\(/g, replacement: 'Logger.info(' },
];

// Archivos a excluir
const excludeFiles = [
  'logger.js',
  'main.jsx', // PWA logs específicos
];

function getLoggerImportPath(filePath) {
  const relativePath = path.relative(srcDir, filePath);
  const parts = relativePath.split(path.sep);
  
  // Determinar la ruta correcta según la ubicación del archivo
  for (const [folder, importPath] of Object.entries(loggerRelativePaths)) {
    if (parts[0] === folder) {
      // Ajustar según la profundidad
      const depth = parts.length - 1;
      if (depth > 1 && folder === 'components') {
        return '../'.repeat(depth) + 'utils/logger';
      }
      return importPath;
    }
  }
  
  return '../utils/logger';
}

function processFile(filePath) {
  const fileName = path.basename(filePath);
  
  // Saltar archivos excluidos
  if (excludeFiles.includes(fileName)) {
    console.log(`⏭️  Saltando: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let modified = false;

  // Verificar si tiene console.*
  const hasConsole = replacements.some(({ pattern }) => content.match(pattern));
  if (!hasConsole) {
    return false;
  }

  // Verificar si ya tiene import de Logger
  const hasLoggerImport = content.includes("import Logger from");
  
  // Aplicar reemplazos
  replacements.forEach(({ pattern, replacement }) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    // Agregar import de Logger si no existe
    if (!hasLoggerImport) {
      const loggerPath = getLoggerImportPath(filePath);
      const loggerImport = `import Logger from '${loggerPath}';\n`;
      
      // Buscar dónde insertar el import
      const importMatches = content.match(/^import .* from .*;$/gm);
      if (importMatches && importMatches.length > 0) {
        // Insertar después del último import
        const lastImport = importMatches[importMatches.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) + '\n' + loggerImport + content.slice(lastImportIndex);
      } else {
        // Si no hay imports, agregar al principio
        content = loggerImport + '\n' + content;
      }
    }

    // Guardar archivo modificado
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Procesado: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }

  return false;
}

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursivamente buscar en subdirectorios
      findFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Buscar todos los archivos .js y .jsx
console.log('🔍 Buscando archivos...');
const files = findFiles(srcDir);
console.log(`📁 Encontrados ${files.length} archivos para procesar\n`);

let modifiedCount = 0;
files.forEach(file => {
  if (processFile(file)) {
    modifiedCount++;
  }
});

console.log(`\n✨ Completado! ${modifiedCount} archivos modificados.`);
console.log(`\n📌 Próximos pasos:`);
console.log(`1. Revisa los cambios con: git diff`);
console.log(`2. Verifica que las rutas de import sean correctas`);
console.log(`3. Ejecuta: npm run dev para verificar que todo funcione`);
console.log(`4. Ajusta niveles de log según necesites (debug → info)`);
console.log(`5. Commit los cambios: git add . && git commit -m "refactor: replace console.log with Logger"`);