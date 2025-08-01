# Yo Compro Acacías - Directorio Comercial Digital

Plataforma oficial de directorio comercial para la Alcaldía de Acacías, Meta - Colombia. Sistema automatizado de sincronización con Google Business Profile para promover el comercio local.

## 🚀 Características Principales

- **Sincronización Automática**: Integración con Google Business Profile API para actualización diaria de negocios
- **Filtrado Geográfico**: Solo muestra negocios ubicados en Acacías, Meta
- **Landing Pages Móviles**: Página individual optimizada para cada negocio
- **Panel Administrativo**: Control de visibilidad de negocios por parte de la Alcaldía
- **Búsqueda Avanzada**: Búsqueda por nombre, categoría o palabras clave
- **Compartir Social**: Funcionalidad de compartir negocios en redes sociales
- **Códigos QR**: Generación automática de códigos QR para cada negocio
- **Estadísticas en Tiempo Real**: Dashboard con métricas del directorio

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **MongoDB** con Mongoose
- **Google Business Profile API**
- **Node-cron** para sincronización automática
- **QRCode** para generación de códigos QR

### Frontend
- **HTML5** semántico y accesible
- **CSS3** con variables personalizadas y diseño responsive
- **JavaScript ES6+** vanilla
- **Font Awesome** para iconografía
- **Google Fonts** (Inter)

## 📋 Requisitos Previos

- Node.js 16+ 
- MongoDB 4.4+
- Cuenta de Google Cloud Platform
- Service Account con acceso a Google Business Profile API

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd directorio
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/yo-compro-acacias

# Google Business Profile API
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID=your_account_id

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración por defecto
DEFAULT_MUNICIPALITY=Acacías
DEFAULT_DEPARTMENT=Meta
DEFAULT_COUNTRY=Colombia

# Admin
ADMIN_PASSWORD=tu_contraseña_segura
```

4. **Configurar Google Business Profile API**
   - Crear proyecto en Google Cloud Console
   - Habilitar Google Business Profile API
   - Crear Service Account y descargar credenciales JSON
   - Configurar permisos necesarios

5. **Iniciar MongoDB**
```bash
# En macOS con Homebrew
brew services start mongodb-community

# En Ubuntu/Debian
sudo systemctl start mongod
```

6. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔄 Sincronización de Datos

### Sincronización Manual
```bash
npm run sync
```

### Sincronización Automática
La aplicación ejecuta sincronización automática diariamente a las 2:00 AM (configurable).

## 📁 Estructura del Proyecto

```
directorio/
├── models/                 # Modelos de MongoDB
│   ├── Business.js        # Modelo de negocios
│   └── Config.js          # Configuraciones del sistema
├── routes/                # Rutas de la API
│   ├── businesses.js      # Endpoints de negocios
│   ├── admin.js           # Panel administrativo
│   └── stats.js           # Estadísticas
├── services/              # Servicios externos
│   └── googleBusinessService.js  # Integración con Google
├── scripts/               # Scripts utilitarios
│   └── sync-businesses.js # Script de sincronización
├── public/                # Archivos estáticos
│   ├── css/              # Estilos CSS
│   ├── js/               # JavaScript del frontend
│   ├── assets/           # Imágenes y recursos
│   ├── index.html        # Página principal
│   └── business.html     # Template de negocio
├── server.js             # Servidor principal
├── package.json          # Dependencias y scripts
└── README.md            # Documentación
```

## 🌐 Endpoints de la API

### Negocios Públicos
- `GET /api/businesses` - Listar negocios visibles
- `GET /api/businesses/:slug` - Obtener negocio por slug
- `POST /api/businesses/:slug/share` - Registrar compartido
- `GET /api/businesses/:slug/qr` - Descargar código QR
- `GET /api/businesses/meta/categories` - Obtener categorías

### Estadísticas
- `GET /api/stats` - Estadísticas generales
- `GET /api/stats/categoria/:categoria` - Stats por categoría

### Administración
- `POST /api/admin/login` - Autenticación admin
- `GET /api/admin/config` - Obtener configuración
- `PUT /api/admin/config/:key` - Actualizar configuración
- `GET /api/admin/businesses` - Listar todos los negocios
- `PUT /api/admin/businesses/:id/visibility` - Cambiar visibilidad
- `PUT /api/admin/businesses/bulk/visibility` - Cambio masivo
- `POST /api/admin/sync` - Sincronización manual
- `GET /api/admin/sync/stats` - Estadísticas de sincronización

## 🎨 Páginas Web

### Página Principal (`/`)
- Buscador principal
- Dashboard de estadísticas
- Navegación por categorías
- Negocios destacados

### Landing de Negocio (`/:slug`)
- Información completa del negocio
- Galería de fotos
- Mapa y direcciones
- Reseñas de Google
- Botones de compartir y QR

## 👨‍💼 Panel Administrativo

Acceso en `/admin` con las siguientes funciones:

- **Configuración del Sistema**: Cambiar municipio objetivo, horarios de sync
- **Gestión de Visibilidad**: Habilitar/deshabilitar negocios en el directorio
- **Sincronización Manual**: Ejecutar sync inmediata desde la interfaz
- **Estadísticas Avanzadas**: Métricas detalladas y reportes

## 🔧 Configuraciones Disponibles

| Clave | Descripción | Valor por Defecto |
|-------|-------------|-------------------|
| `target_municipality` | Municipio objetivo | Acacías |
| `target_department` | Departamento objetivo | Meta |
| `target_country` | País objetivo | Colombia |
| `sync_enabled` | Habilitar sync automática | true |
| `sync_time` | Hora de sincronización | 02:00 |
| `max_businesses_per_sync` | Máximo negocios por sync | 100 |

## 📱 Características Móviles

- **Diseño Mobile-First**: Optimizado para dispositivos móviles
- **PWA Ready**: Preparado para Progressive Web App
- **Touch Friendly**: Interfaz táctil optimizada
- **Carga Rápida**: Optimizado para conexiones lentas

## 🔒 Seguridad

- **Rate Limiting**: Protección contra abuso de API
- **Helmet.js**: Headers de seguridad HTTP
- **Input Validation**: Validación de datos de entrada
- **CORS**: Configuración de origen cruzado
- **Environment Variables**: Configuración sensible protegida

## 🚀 Despliegue en Producción

1. **Variables de Entorno**
```bash
NODE_ENV=production
MONGODB_URI=mongodb://tu-servidor/yo-compro-acacias
PORT=3000
```

2. **Proceso Manager (PM2)**
```bash
npm install -g pm2
pm2 start server.js --name "yo-compro-acacias"
pm2 startup
pm2 save
```

3. **Nginx (Proxy Reverso)**
```nginx
server {
    listen 80;
    server_name yocomproacacias.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoreo

- **Logs del Sistema**: Usar `pm2 logs` para ver logs en tiempo real
- **Métricas de MongoDB**: Monitorear uso de base de datos
- **API de Google**: Vigilar cuotas y límites de uso
- **Performance**: Monitorear tiempos de respuesta

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: info@acacias-meta.gov.co
- **Teléfono**: (8) 123-4567
- **Sitio Web**: https://acacias-meta.gov.co

---

**Desarrollado con ❤️ para la Alcaldía de Acacías, Meta - Colombia**
