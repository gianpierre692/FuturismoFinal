// Script para estandarizar exports en stores
const fs = require('fs');
const path = require('path');

const storesDir = path.join(__dirname, 'src/stores');

// Leer todos los archivos de stores
fs.readdirSync(storesDir).forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(storesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar pattern de doble export
    const doubleExportPattern = /export \{ (\w+) \};\s*export default \1;/g;
    
    if (doubleExportPattern.test(content)) {
      // Remover el named export, mantener solo default
      content = content.replace(/export \{ \w+ \};\s*/g, '');
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${file}`);
    }
  }
});

console.log('🎉 Stores exports standardized!');