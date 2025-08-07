// Google OAuth2 Integration for My Business API
// Configuración OAuth2 (credenciales desde archivo externo para seguridad)
const GOOGLE_CONFIG = window.GOOGLE_OAUTH_CONFIG || {
    client_id: 'CLIENT_ID_PLACEHOLDER',
    client_secret: 'CLIENT_SECRET_PLACEHOLDER',
    redirect_uri: 'https://directorioacacias.netlify.app/',
    scopes: [
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/plus.business.manage'
    ]
};

class GoogleMyBusinessIntegration {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        this.isInitialized = false;
        
        // Cargar tokens guardados si existen
        this.loadSavedTokens();
        
        // Detectar código de autorización en la URL
        this.handleAuthCallback();
    }

    // Cargar tokens guardados del localStorage
    loadSavedTokens() {
        try {
            const savedTokens = localStorage.getItem('gmb_tokens');
            if (savedTokens) {
                const tokens = JSON.parse(savedTokens);
                this.accessToken = tokens.access_token;
                this.refreshToken = tokens.refresh_token;
                this.tokenExpiry = new Date(tokens.expires_at);
                
                console.log('✅ Tokens de Google My Business cargados desde localStorage');
                this.isInitialized = true;
                
                // Verificar si el token está expirado
                if (this.isTokenExpired()) {
                    console.log('⚠️ Token expirado, intentando renovar...');
                    this.refreshAccessToken();
                }
            }
        } catch (error) {
            console.log('ℹ️ No hay tokens guardados, se requiere autorización inicial');
        }
    }

    // Verificar si el token está expirado
    isTokenExpired() {
        if (!this.tokenExpiry) return true;
        return new Date() >= this.tokenExpiry;
    }

    // Detectar código de autorización en la URL
    handleAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            console.error('❌ Error en autorización OAuth2:', error);
            this.showAuthModal('Error en la autorización: ' + error, true);
            return;
        }

        if (authCode && !this.isInitialized) {
            console.log('🔄 Código de autorización detectado, intercambiando por tokens...');
            this.exchangeCodeForTokens(authCode);
            
            // Limpiar la URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Intercambiar código de autorización por tokens
    async exchangeCodeForTokens(authCode) {
        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: GOOGLE_CONFIG.client_id,
                    client_secret: GOOGLE_CONFIG.client_secret,
                    code: authCode,
                    grant_type: 'authorization_code',
                    redirect_uri: GOOGLE_CONFIG.redirect_uri
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const tokens = await response.json();
            
            // Guardar tokens
            this.accessToken = tokens.access_token;
            this.refreshToken = tokens.refresh_token;
            this.tokenExpiry = new Date(Date.now() + (tokens.expires_in * 1000));
            
            // Guardar en localStorage
            localStorage.setItem('gmb_tokens', JSON.stringify({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: this.tokenExpiry.toISOString()
            }));
            
            console.log('✅ Tokens de Google My Business obtenidos y guardados exitosamente!');
            this.isInitialized = true;
            
            this.showAuthModal('¡Autorización exitosa! Google My Business conectado correctamente.', false);
            
            // Iniciar obtención de imágenes reales
            setTimeout(() => {
                this.startImageIntegration();
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error intercambiando código por tokens:', error);
            this.showAuthModal('Error obteniendo tokens: ' + error.message, true);
        }
    }

    // Renovar token de acceso usando refresh token
    async refreshAccessToken() {
        if (!this.refreshToken) {
            console.log('⚠️ No hay refresh token, se requiere nueva autorización');
            return false;
        }

        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: GOOGLE_CONFIG.client_id,
                    client_secret: GOOGLE_CONFIG.client_secret,
                    refresh_token: this.refreshToken,
                    grant_type: 'refresh_token'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const tokens = await response.json();
            
            // Actualizar tokens
            this.accessToken = tokens.access_token;
            this.tokenExpiry = new Date(Date.now() + (tokens.expires_in * 1000));
            
            // Actualizar localStorage
            const savedTokens = JSON.parse(localStorage.getItem('gmb_tokens') || '{}');
            savedTokens.access_token = tokens.access_token;
            savedTokens.expires_at = this.tokenExpiry.toISOString();
            localStorage.setItem('gmb_tokens', JSON.stringify(savedTokens));
            
            console.log('✅ Token de acceso renovado exitosamente');
            return true;
            
        } catch (error) {
            console.error('❌ Error renovando token:', error);
            return false;
        }
    }

    // Iniciar autorización OAuth2
    startAuthorization() {
        const params = new URLSearchParams({
            client_id: GOOGLE_CONFIG.client_id,
            redirect_uri: GOOGLE_CONFIG.redirect_uri,
            scope: GOOGLE_CONFIG.scopes.join(' '),
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent'
        });

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        
        console.log('🔐 Iniciando autorización OAuth2 para Google My Business...');
        window.location.href = authUrl;
    }

    // Mostrar modal de estado de autorización
    showAuthModal(message, isError = false) {
        // Crear modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;

        modalContent.innerHTML = `
            <div style="margin-bottom: 1rem;">
                ${isError ? '❌' : '✅'} 
            </div>
            <h3 style="margin: 0 0 1rem 0; color: ${isError ? '#dc3545' : '#28a745'};">
                ${isError ? 'Error de Autorización' : 'Autorización Exitosa'}
            </h3>
            <p style="margin: 0 0 1.5rem 0; color: #666; line-height: 1.5;">
                ${message}
            </p>
            <button onclick="this.closest('.modal').remove()" style="
                background: ${isError ? '#dc3545' : '#28a745'};
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
            ">
                ${isError ? 'Cerrar' : 'Continuar'}
            </button>
        `;

        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Auto-cerrar después de 5 segundos si no es error
        if (!isError) {
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 5000);
        }
    }

    // Iniciar integración de imágenes reales
    async startImageIntegration() {
        if (!this.isInitialized || this.isTokenExpired()) {
            console.log('⚠️ Token no válido para integración de imágenes');
            return;
        }

        console.log('🖼️ Iniciando integración de imágenes reales de Google My Business...');
        
        try {
            // Obtener cuentas de Google My Business
            const accounts = await this.getBusinessAccounts();
            
            if (accounts && accounts.length > 0) {
                console.log(`✅ ${accounts.length} cuenta(s) de Google My Business encontrada(s)`);
                
                // Obtener ubicaciones de la primera cuenta
                const locations = await this.getBusinessLocations(accounts[0].name);
                
                if (locations && locations.length > 0) {
                    console.log(`✅ ${locations.length} ubicación(es) encontrada(s)`);
                    
                    // Procesar imágenes de cada ubicación
                    await this.processBusinessImages(locations);
                }
            }
            
        } catch (error) {
            console.error('❌ Error en integración de imágenes:', error);
        }
    }

    // Obtener cuentas de Google My Business
    async getBusinessAccounts() {
        try {
            const response = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 && await this.refreshAccessToken()) {
                    // Reintentar con token renovado
                    return this.getBusinessAccounts();
                }
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();
            return data.accounts || [];
            
        } catch (error) {
            console.error('❌ Error obteniendo cuentas:', error);
            throw error;
        }
    }

    // Obtener ubicaciones de una cuenta
    async getBusinessLocations(accountName) {
        try {
            const response = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 && await this.refreshAccessToken()) {
                    // Reintentar con token renovado
                    return this.getBusinessLocations(accountName);
                }
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();
            return data.locations || [];
            
        } catch (error) {
            console.error('❌ Error obteniendo ubicaciones:', error);
            throw error;
        }
    }

    // Procesar imágenes de negocios
    async processBusinessImages(locations) {
        console.log('🔄 Procesando imágenes de negocios...');
        
        for (const location of locations) {
            try {
                // Obtener fotos de la ubicación
                const photos = await this.getLocationPhotos(location.name);
                
                if (photos && photos.length > 0) {
                    console.log(`📸 ${photos.length} foto(s) encontrada(s) para ${location.title}`);
                    
                    // Aquí puedes procesar las fotos y actualizarlas en tu plataforma
                    // Por ejemplo, actualizar las Netlify Functions con las URLs reales
                    
                } else {
                    console.log(`ℹ️ No se encontraron fotos para ${location.title}`);
                }
                
            } catch (error) {
                console.error(`❌ Error procesando fotos para ${location.title}:`, error);
            }
        }
    }

    // Obtener fotos de una ubicación
    async getLocationPhotos(locationName) {
        try {
            const response = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}/media`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 && await this.refreshAccessToken()) {
                    // Reintentar con token renovado
                    return this.getLocationPhotos(locationName);
                }
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();
            return data.mediaItems || [];
            
        } catch (error) {
            console.error('❌ Error obteniendo fotos:', error);
            throw error;
        }
    }

    // Verificar si está autorizado
    isAuthorized() {
        return this.isInitialized && !this.isTokenExpired();
    }

    // Método público para iniciar autorización
    authorize() {
        if (this.isAuthorized()) {
            console.log('✅ Ya está autorizado con Google My Business');
            this.startImageIntegration();
        } else {
            console.log('🔐 Iniciando proceso de autorización...');
            this.startAuthorization();
        }
    }
}

// Inicializar integración automáticamente
let gmbIntegration;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando integración de Google My Business...');
    gmbIntegration = new GoogleMyBusinessIntegration();
    
    // Exponer globalmente para uso manual si es necesario
    window.gmbIntegration = gmbIntegration;
    
    // Si ya está autorizado, iniciar integración de imágenes
    if (gmbIntegration.isAuthorized()) {
        console.log('✅ Google My Business ya autorizado, iniciando integración...');
        gmbIntegration.startImageIntegration();
    } else {
        console.log('ℹ️ Google My Business no autorizado. Usa gmbIntegration.authorize() para autorizar.');
    }
});

// Función global para autorizar manualmente
window.authorizeGoogleMyBusiness = () => {
    if (gmbIntegration) {
        gmbIntegration.authorize();
    }
};
