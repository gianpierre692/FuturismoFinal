const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧹 Limpiando caché de Vite y dependencias...\n');

// Detectar sistema operativo
const isWindows = process.platform === 'win32';

// Directorios a limpiar
const dirsToClean = [
  'node_modules/.vite',
  '.vite',
  'dist',
  'node_modules/.cache'
];

// Limpiar directorios
dirsToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Eliminando ${dir}...`);
    try {
      if (isWindows) {
        execSync(`rd /s /q "${fullPath}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${fullPath}"`, { stdio: 'inherit' });
      }
      console.log(`✅ ${dir} eliminado`);
    } catch (error) {
      console.error(`❌ Error eliminando ${dir}:`, error.message);
    }
  }
});

console.log('\n🔄 Reinstalando dependencias...\n');

// Reinstalar dependencias
try {
  console.log('Ejecutando npm install...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('\n✅ Dependencias instaladas correctamente');
} catch (error) {
  console.error('❌ Error instalando dependencias:', error.message);
  process.exit(1);
}

console.log('\n✨ Limpieza completada!');
console.log('\nAhora puedes ejecutar:');
console.log('  npm run dev');