# 🔧 Configuración Google My Business - Variables de Entorno

## 📋 Variables Requeridas para Netlify

Para que la integración de Google My Business funcione correctamente, necesitas configurar estas variables de entorno en Netlify:

### **1. Variables OAuth2**
```
GOOGLE_CLIENT_ID=tu_client_id_oauth2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret_oauth2
GOOGLE_REDIRECT_URI=https://directoriocomercial.netlify.app/auth/google/callback
```

### **2. Variables API**
```
GOOGLE_API_KEY=tu_api_key_existente
```

## 🔗 Cómo Obtener las Credenciales OAuth2

### **Paso 1: Ir a Google Cloud Console**
```
https://console.cloud.google.com/apis/credentials?project=931036097890
```

### **Paso 2: Crear Credenciales OAuth2**
1. Clic en **"+ CREAR CREDENCIALES"**
2. Seleccionar **"ID de cliente de OAuth 2.0"**
3. Tipo de aplicación: **"Aplicación web"**
4. Nombre: `Yo Compro Acacías - GMB Integration`

### **Paso 3: Configurar URLs**
**Orígenes autorizados de JavaScript:**
```
https://directoriocomercial.netlify.app
```

**URIs de redirección autorizados:**
```
https://directoriocomercial.netlify.app/auth/google/callback
```

### **Paso 4: Configurar Pantalla de Consentimiento**
1. Ir a **"Pantalla de consentimiento de OAuth"**
2. Tipo: **"Externo"**
3. Información de la aplicación:
   - Nombre: `Yo Compro Acacías`
   - Correo de soporte: tu email
   - Correo de contacto: tu email

### **Paso 5: Agregar Ámbitos (Scopes)**
```
https://www.googleapis.com/auth/business.manage
https://www.googleapis.com/auth/plus.business.manage
https://www.googleapis.com/auth/userinfo.profile
```

## ⚙️ Configurar Variables en Netlify

### **Método 1: Dashboard de Netlify**
1. Ve a tu sitio en Netlify Dashboard
2. **Site settings** → **Environment variables**
3. Agregar cada variable una por una

### **Método 2: Netlify CLI**
```bash
netlify env:set GOOGLE_CLIENT_ID "tu_client_id_aqui"
netlify env:set GOOGLE_CLIENT_SECRET "tu_client_secret_aqui"
netlify env:set GOOGLE_REDIRECT_URI "https://directoriocomercial.netlify.app/auth/google/callback"
```

## 🧪 Probar la Integración

### **1. Acceder al Panel de Administración**
```
https://directoriocomercial.netlify.app/admin.html
```

### **2. Ir a la Pestaña "Google My Business"**
- Verificar estado de APIs
- Conectar cuenta de Google
- Probar búsqueda de negocios
- Sincronizar perfiles sociales

### **3. Funcionalidades Disponibles**
- ✅ Autenticación OAuth2 con Google
- ✅ Búsqueda de negocios en Google Places
- ✅ Obtención de perfiles sociales reales
- ✅ Sincronización masiva de redes sociales
- ✅ Panel de administración completo
- ✅ Integración automática en landing pages

## 🔍 Solución de Problemas

### **Error: "redirect_uri_mismatch"**
- Verificar que la URL de redirección en Google Cloud Console sea exactamente:
  `https://directoriocomercial.netlify.app/auth/google/callback`

### **Error: "invalid_client"**
- Verificar que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén correctos
- Verificar que las variables estén configuradas en Netlify

### **Error: "access_denied"**
- El usuario canceló la autenticación
- Verificar que los scopes estén configurados correctamente

### **Error: "insufficient_permissions"**
- Verificar que los scopes incluyan `business.manage`
- Verificar que la cuenta de Google tenga acceso a Google My Business

## 📊 Datos Que Se Obtienen

### **Información Básica del Negocio**
- Nombre oficial
- Dirección completa
- Teléfono
- Sitio web
- Estado del negocio
- Calificaciones

### **Perfiles Sociales**
- Facebook (si está disponible)
- Instagram (si está disponible)
- Twitter (si está disponible)
- WhatsApp Business (si está disponible)
- Otros enlaces sociales

### **Imágenes**
- Fotos del negocio
- Logo oficial
- Imágenes de productos/servicios

## 🚀 Próximos Pasos

1. **Configurar variables de entorno** en Netlify
2. **Crear credenciales OAuth2** en Google Cloud Console
3. **Probar la integración** en el panel de administración
4. **Sincronizar perfiles sociales** de todos los negocios
5. **Validar** que las redes sociales aparezcan en las landing pages

---

**¿Necesitas ayuda?** Revisa los logs en Netlify Functions o contacta al desarrollador.
