# 🚀 GUÍA DE DEPLOYMENT - FUTURISMO FRONTEND

## 📋 **CHECKLIST PRE-DEPLOYMENT**

### **1. Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Configurar URLs de producción
VITE_API_URL=https://api.tudominio.com/v1
VITE_WS_URL=wss://ws.tudominio.com
VITE_ENVIRONMENT=production
VITE_ENABLE_MOCK_DATA=false
```

### **2. Configuración de Seguridad**
- ✅ Variables de entorno configuradas
- ✅ URLs de producción válidas
- ✅ Mock data deshabilitado
- ✅ Debug mode deshabilitado
- ✅ Credenciales de prueba (OK para frontend)

### **3. Optimizaciones Aplicadas**
- ✅ Lazy loading de componentes pesados
- ✅ Error boundaries estratégicos
- ✅ Memoización inteligente de mapas
- ✅ Validación de formularios
- ✅ WebSocket resiliente con fallbacks

## 🏗️ **COMANDOS DE BUILD**

### **Desarrollo**
```bash
npm run dev
```

### **Build de Producción**
```bash
# Limpiar dist anterior
rm -rf dist/

# Build optimizado
npm run build

# Preview del build
npm run preview
```

### **Análisis del Bundle**
```bash
# Instalar analyzer
npm install --save-dev rollup-plugin-visualizer

# Generar reporte
npm run build -- --mode analyze
```

## 🌐 **DEPLOYMENT EN HOSTING ESTÁTICO**

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Variables de entorno en Vercel Dashboard:
# VITE_API_URL=https://api.tudominio.com/v1
# VITE_WS_URL=wss://ws.tudominio.com
# VITE_ENVIRONMENT=production
```

### **Netlify**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build y deploy
npm run build
netlify deploy --prod --dir=dist
```

### **GitHub Pages**
```bash
# Configurar en package.json
"homepage": "https://usuario.github.io/futurismo"

# Build con base path
npm run build -- --base=/futurismo/
```

## 🔧 **CONFIGURACIÓN DE SERVIDOR**

### **Headers de Seguridad (.htaccess)**
```apache
# Cache estático
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css text/javascript application/javascript
</IfModule>

# SPA routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name tudominio.com;
    root /var/www/futurismo/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔍 **VERIFICACIÓN POST-DEPLOYMENT**

### **1. URLs y Conectividad**
```javascript
// Abrir Developer Tools y verificar:
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('WS URL:', import.meta.env.VITE_WS_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);
```

### **2. Funcionalidades Críticas**
- ✅ Login con credenciales de prueba
- ✅ Mapa carga correctamente
- ✅ WebSocket se conecta (o fallback funciona)
- ✅ Navegación entre páginas
- ✅ Error boundaries no muestran errores

### **3. Performance**
```bash
# Lighthouse audit
npx lighthouse https://tudominio.com

# Web Vitals
npm install -g @lhci/cli
lhci collect --upload-target=temporary-public-storage
```

## 🚨 **TROUBLESHOOTING**

### **Error: "Variables de entorno faltantes"**
```bash
# Verificar archivo .env.local existe
ls -la .env.local

# Verificar variables están configuradas
cat .env.local | grep VITE_API_URL
```

### **Error: "Cannot connect to API"**
```bash
# Verificar URL es accesible
curl -I https://api.tudominio.com/v1

# Verificar CORS está configurado en backend
curl -H "Origin: https://tudominio.com" https://api.tudominio.com/v1
```

### **Error: "WebSocket connection failed"**
```bash
# Verificar WebSocket endpoint
wscat -c wss://ws.tudominio.com

# El fallback HTTP polling debería activarse automáticamente
```

### **Error: "Página blanca después del deploy"**
```bash
# Verificar base path en vite.config.js
base: '/ruta-correcta/'

# Verificar rutas del servidor están configuradas para SPA
```

## 📊 **MONITOREO EN PRODUCCIÓN**

### **Error Tracking (Opcional)**
```javascript
// Integrar Sentry en main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.VITE_ENVIRONMENT
});
```

### **Analytics (Opcional)**
```javascript
// Google Analytics en public/index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## ✅ **CHECKLIST FINAL**

Antes de ir a producción, verificar:

- [ ] Variables de entorno configuradas
- [ ] Build genera dist/ sin errores
- [ ] Todas las rutas funcionan
- [ ] Mapa carga correctamente
- [ ] WebSocket conecta o fallback funciona
- [ ] Error boundaries capturan errores
- [ ] Performance > 90 en Lighthouse
- [ ] Funciona en móviles
- [ ] HTTPS configurado
- [ ] Headers de seguridad configurados

## 🎯 **RESULTADO ESPERADO**

Tu aplicación debería:
- ✅ Cargar en < 3 segundos
- ✅ Funcionar sin backend (modo mock)
- ✅ Nunca mostrar pantalla blanca por errores
- ✅ Ser responsive en todos los dispositivos
- ✅ Manejar fallos de red graciosamente

**¡Frontend listo para producción! 🚀**