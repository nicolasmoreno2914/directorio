// Gestión de autenticación con Google My Business
class GoogleAuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.accessToken = localStorage.getItem('google_access_token');
    this.refreshToken = localStorage.getItem('google_refresh_token');
    this.init();
  }

  async init() {
    // Verificar si ya tenemos tokens válidos
    if (this.accessToken) {
      try {
        await this.validateToken();
      } catch (error) {
        console.log('Token inválido, requiere nueva autenticación');
        this.clearTokens();
      }
    }

    // Manejar callback de OAuth2 si estamos en la página de callback
    if (window.location.pathname.includes('/auth/google/callback')) {
      await this.handleCallback();
    }
  }

  // Iniciar proceso de autenticación
  async startAuth() {
    try {
      const response = await fetch('/.netlify/functions/google-oauth/auth');
      const data = await response.json();
      
      if (data.authUrl) {
        // Redirigir a Google para autenticación
        window.location.href = data.authUrl;
      } else {
        throw new Error('No se pudo obtener URL de autenticación');
      }
    } catch (error) {
      console.error('Error iniciando autenticación:', error);
      this.showError('Error al conectar con Google. Inténtalo de nuevo.');
    }
  }

  // Manejar callback de Google
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Error de autenticación:', error);
      this.showError('Error en la autenticación con Google');
      return;
    }

    if (code) {
      try {
        const response = await fetch(`/.netlify/functions/google-oauth/callback?code=${code}`);
        const data = await response.json();

        if (data.success && data.tokens) {
          this.saveTokens(data.tokens);
          this.isAuthenticated = true;
          this.showSuccess('¡Autenticación exitosa! Ahora puedes obtener datos reales de Google My Business.');
          
          // Redirigir al admin o página principal
          setTimeout(() => {
            window.location.href = '/admin.html';
          }, 2000);
        } else {
          throw new Error(data.error || 'Error en el intercambio de tokens');
        }
      } catch (error) {
        console.error('Error en callback:', error);
        this.showError('Error procesando la autenticación');
      }
    }
  }

  // Validar token actual
  async validateToken() {
    if (!this.accessToken) return false;

    try {
      const response = await fetch('/.netlify/functions/google-oauth/profile', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.ok) {
        this.isAuthenticated = true;
        return true;
      } else {
        throw new Error('Token inválido');
      }
    } catch (error) {
      this.isAuthenticated = false;
      return false;
    }
  }

  // Guardar tokens de forma segura
  saveTokens(tokens) {
    if (tokens.access_token) {
      localStorage.setItem('google_access_token', tokens.access_token);
      this.accessToken = tokens.access_token;
    }
    
    if (tokens.refresh_token) {
      localStorage.setItem('google_refresh_token', tokens.refresh_token);
      this.refreshToken = tokens.refresh_token;
    }

    // Guardar timestamp de expiración
    if (tokens.expiry_date) {
      localStorage.setItem('google_token_expiry', tokens.expiry_date.toString());
    }
  }

  // Limpiar tokens
  clearTokens() {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_token_expiry');
    this.accessToken = null;
    this.refreshToken = null;
    this.isAuthenticated = false;
  }

  // Cerrar sesión
  logout() {
    this.clearTokens();
    this.showSuccess('Sesión cerrada correctamente');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  // Obtener datos reales de un negocio
  async getBusinessSocialProfiles(businessName, address) {
    if (!this.isAuthenticated) {
      throw new Error('No autenticado con Google My Business');
    }

    try {
      const response = await fetch(`/.netlify/functions/google-mybusiness/social-profiles?businessName=${encodeURIComponent(businessName)}&address=${encodeURIComponent(address || '')}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.socialProfiles || {};
      } else {
        throw new Error('Error obteniendo perfiles sociales');
      }
    } catch (error) {
      console.error('Error obteniendo datos de Google My Business:', error);
      throw error;
    }
  }

  // Buscar negocios en Google Places
  async searchBusinesses(query, location) {
    try {
      const locationParam = location ? `&location=${location}` : '';
      const response = await fetch(`/.netlify/functions/google-mybusiness/search-business?query=${encodeURIComponent(query)}${locationParam}`);

      if (response.ok) {
        const data = await response.json();
        return data.businesses || [];
      } else {
        throw new Error('Error buscando negocios');
      }
    } catch (error) {
      console.error('Error buscando negocios:', error);
      throw error;
    }
  }

  // Mostrar mensajes de éxito
  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  // Mostrar mensajes de error
  showError(message) {
    this.showMessage(message, 'error');
  }

  // Mostrar mensaje genérico
  showMessage(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.3s ease-out;
        }
        .notification-success { background: #d4edda; border-left: 4px solid #28a745; color: #155724; }
        .notification-error { background: #f8d7da; border-left: 4px solid #dc3545; color: #721c24; }
        .notification-info { background: #d1ecf1; border-left: 4px solid #17a2b8; color: #0c5460; }
        .notification-content { display: flex; align-items: center; gap: 10px; }
        .notification-close { background: none; border: none; font-size: 18px; cursor: pointer; margin-left: auto; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `;
      document.head.appendChild(styles);
    }

    // Agregar al DOM
    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Obtener estado de autenticación
  getAuthStatus() {
    return {
      isAuthenticated: this.isAuthenticated,
      hasTokens: !!(this.accessToken && this.refreshToken)
    };
  }
}

// Instancia global
window.googleAuth = new GoogleAuthManager();

// Funciones de utilidad globales
window.connectGoogleMyBusiness = () => {
  window.googleAuth.startAuth();
};

window.disconnectGoogleMyBusiness = () => {
  window.googleAuth.logout();
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleAuthManager;
}
