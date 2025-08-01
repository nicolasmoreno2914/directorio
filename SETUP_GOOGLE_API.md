# 🔧 Configuración de Google Business Profile API

## Pasos para conectar con negocios reales de Acacías

### 1. 📋 Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto llamado "Yo Compro Acacías"
3. Habilita las siguientes APIs:
   - **Google My Business API**
   - **Places API (New)**
   - **Maps JavaScript API**

### 2. 🔑 Crear Credenciales

#### Opción A: Cuenta de Servicio (Recomendado)
1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "Cuenta de servicio"
3. Nombre: `yo-compro-acacias-service`
4. Descarga el archivo JSON de credenciales
5. Guárdalo como `./config/google-service-account.json`

#### Opción B: Clave API
1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "Clave de API"
3. Copia la clave generada

### 3. ⚙️ Configurar Variables de Entorno

Edita el archivo `.env` con tus credenciales:

```bash
# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/yo_compro_acacias
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yo_compro_acacias
DB_USER=postgres
DB_PASSWORD=tu_password

# Google Business Profile API Configuration
GOOGLE_APPLICATION_CREDENTIALS=./config/google-service-account.json
GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID=tu_account_id_de_google_business
GOOGLE_API_KEY=tu_api_key_de_google

# Location Configuration for Acacías
TARGET_LOCATION_LAT=3.9889
TARGET_LOCATION_LNG=-73.7561
SEARCH_RADIUS_KM=10
MAX_BUSINESSES_PER_SYNC=100

# Server Configuration
PORT=3000
NODE_ENV=development

# Default Municipality
DEFAULT_MUNICIPALITY=Acacías
DEFAULT_DEPARTMENT=Meta
DEFAULT_COUNTRY=Colombia

# Admin Configuration
ADMIN_PASSWORD=tu_password_admin

# Sync Configuration
SYNC_ENABLED=true
SYNC_TIME=02:00
MAX_BUSINESSES_PER_SYNC=100
```

### 4. 🗄️ Configurar PostgreSQL

#### Instalar PostgreSQL (si no lo tienes):
```bash
# macOS con Homebrew
brew install postgresql
brew services start postgresql

# Crear base de datos
createdb yo_compro_acacias
```

#### O usar PostgreSQL en Docker:
```bash
docker run --name postgres-acacias \
  -e POSTGRES_DB=yo_compro_acacias \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=tu_password \
  -p 5432:5432 \
  -d postgres:15
```

### 5. 🚀 Ejecutar la Sincronización

Una vez configurado todo:

```bash
# Sincronización manual
npm run sync

# Iniciar servidor con sincronización automática
npm start
```

### 6. 📊 Verificar Resultados

El sistema buscará automáticamente:
- ✅ Todos los negocios en un radio de 10km de Acacías
- ✅ Solo negocios con estado "OPERATIONAL"
- ✅ Información completa: nombre, dirección, teléfono, horarios, fotos
- ✅ Categorización automática según nuestras categorías
- ✅ Calificaciones y reseñas de Google

### 🔍 Troubleshooting

#### Error de Autenticación:
```
Error: Could not load the default credentials
```
**Solución:** Verifica que el archivo `google-service-account.json` esté en la ruta correcta.

#### Error de Cuota API:
```
Error: Quota exceeded
```
**Solución:** Verifica los límites de tu proyecto en Google Cloud Console.

#### No se encuentran negocios:
```
Found 0 businesses in Acacías
```
**Solución:** Ajusta el `SEARCH_RADIUS_KM` o verifica las coordenadas de Acacías.

### 📞 Soporte

Si necesitas ayuda con la configuración, revisa:
- [Documentación Google My Business API](https://developers.google.com/my-business/content/prereqs)
- [Documentación Places API](https://developers.google.com/maps/documentation/places/web-service)
