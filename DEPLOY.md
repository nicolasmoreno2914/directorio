# Despliegue en Netlify - Yo Compro Acacías

## Archivos preparados para despliegue

✅ **netlify.toml** - Configuración de Netlify con redirects y funciones
✅ **netlify/functions/** - Funciones serverless para API
✅ **public/** - Archivos estáticos del frontend
✅ **package.json** - Dependencias necesarias
✅ **.gitignore** - Archivos excluidos del despliegue

## Instrucciones de despliegue

### Opción 1: Despliegue por arrastrar y soltar
1. Comprimir la carpeta `public/` en un archivo ZIP
2. Ir a [netlify.com](https://netlify.com) y crear una cuenta
3. Arrastrar el ZIP a la zona de despliegue
4. Netlify automáticamente detectará la configuración

### Opción 2: Despliegue desde GitHub
1. Subir este proyecto a un repositorio de GitHub
2. Conectar el repositorio con Netlify
3. Netlify automáticamente desplegará usando `netlify.toml`

### Opción 3: Netlify CLI (si está disponible)
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Autenticarse
netlify login

# Desplegar
netlify deploy --prod --dir=public
```

## Variables de entorno en Netlify

Configurar estas variables en el panel de Netlify:
- `GOOGLE_API_KEY` - Tu clave de API de Google Places
- `NODE_ENV` - production

## URLs de la aplicación desplegada

- **Frontend**: https://[tu-sitio].netlify.app
- **API de negocios**: https://[tu-sitio].netlify.app/api/businesses
- **API de negocio individual**: https://[tu-sitio].netlify.app/api/business/[id]
- **Proxy de imágenes**: https://[tu-sitio].netlify.app/api/image-proxy?url=[url]

## Funcionalidades incluidas

✅ Carrusel de imágenes de Google My Business
✅ Base de datos SQLite con 61 negocios reales
✅ Funciones serverless para API
✅ Proxy de imágenes sin problemas CORS
✅ Responsive design
✅ Landing pages individuales por negocio
