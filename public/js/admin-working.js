// ===================================
// ADMIN PANEL SIMPLIFICADO Y FUNCIONAL
// ===================================

console.log('🚀 Cargando admin panel simplificado...');

class AdminPanelSimple {
    constructor() {
        console.log('🔧 Inicializando AdminPanelSimple...');
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        console.log('⚡ Inicializando eventos y estado...');
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        console.log('🎯 Configurando event listeners...');
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    checkAuthStatus() {
        console.log('🔐 Verificando estado de autenticación...');
        const token = localStorage.getItem('adminToken');
        
        // For debugging: clear any invalid tokens
        if (token && token === 'invalid-test-token') {
            console.log('🧹 Limpiando token inválido de pruebas...');
            localStorage.removeItem('adminToken');
        }
        
        const validToken = localStorage.getItem('adminToken');
        if (validToken && validToken !== 'invalid-test-token') {
            console.log('✅ Token válido encontrado, mostrando dashboard...');
            this.isAuthenticated = true;
            this.showDashboard();
            this.loadDashboardData();
        } else {
            console.log('❌ Sin token válido, mostrando login...');
            this.showLogin();
        }
    }

    async handleLogin() {
        console.log('🔑 Procesando login...');
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        if (!password) {
            this.showError('Por favor ingresa la contraseña');
            return;
        }

        try {
            console.log('📡 Enviando credenciales al servidor...');
            
            const response = await fetch('/.netlify/functions/admin-login-simple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'admin',
                    password: password
                })
            });

            console.log('📥 Respuesta del servidor:', response.status);
            const data = await response.json();
            console.log('📋 Datos recibidos:', data);

            if (response.ok && data.success) {
                console.log('🎉 Login exitoso!');
                localStorage.setItem('adminToken', data.token);
                this.isAuthenticated = true;
                this.showDashboard();
                this.loadDashboardData();
            } else {
                console.log('❌ Login fallido:', data.message);
                this.showError(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('💥 Error en login:', error);
            this.showError('Error de conexión. Intenta nuevamente.');
        }
    }

    handleLogout() {
        console.log('👋 Cerrando sesión...');
        localStorage.removeItem('adminToken');
        this.isAuthenticated = false;
        this.showLogin();
    }

    showLogin() {
        console.log('🔓 Mostrando pantalla de login...');
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (adminDashboard) adminDashboard.style.display = 'none';
        
        // Clear form
        const passwordInput = document.getElementById('password');
        if (passwordInput) passwordInput.value = '';
        
        this.hideError();
    }

    showDashboard() {
        console.log('📊 Mostrando dashboard...');
        const loginScreen = document.getElementById('loginScreen');
        const adminDashboard = document.getElementById('adminDashboard');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
    }

    showError(message) {
        console.log('⚠️ Mostrando error:', message);
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    switchTab(tabName) {
        console.log('📑 Cambiando a pestaña:', tabName);
        
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tabName}Tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    async loadDashboardData() {
        console.log('📈 Cargando datos del dashboard...');
        
        try {
            // Load businesses data
            const businessesResponse = await fetch('/.netlify/functions/businesses');
            if (businessesResponse.ok) {
                const businessesData = await businessesResponse.json();
                console.log('📋 Datos recibidos:', businessesData);
                
                // Handle different response formats
                let businesses = [];
                if (Array.isArray(businessesData)) {
                    businesses = businessesData;
                } else if (businessesData.businesses && Array.isArray(businessesData.businesses)) {
                    businesses = businessesData.businesses;
                } else if (businessesData.data && Array.isArray(businessesData.data)) {
                    businesses = businessesData.data;
                }
                
                console.log('📋 Negocios procesados:', businesses.length);
                this.updateStats(businesses);
                this.loadBusinessesTable(businesses);
            }
        } catch (error) {
            console.error('💥 Error cargando datos:', error);
            // Show fallback stats
            this.updateStats([]);
        }
    }

    updateStats(businesses) {
        console.log('📊 Actualizando estadísticas...');
        
        const totalBusinesses = businesses.length;
        const visibleBusinesses = businesses.filter(b => b.visible !== false).length;
        
        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card .stat-number');
        if (statCards[0]) statCards[0].textContent = totalBusinesses;
        if (statCards[1]) statCards[1].textContent = visibleBusinesses;
        if (statCards[2]) statCards[2].textContent = '0'; // API requests
        if (statCards[3]) statCards[3].textContent = '$0.00'; // Cost
    }

    loadBusinessesTable(businesses) {
        console.log('📋 Cargando tabla de negocios...');
        
        const tableBody = document.querySelector('#businessesTable tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        businesses.forEach(business => {
            const row = document.createElement('tr');
            const isVisible = business.visible !== false;
            
            row.innerHTML = `
                <td>
                    <div class="business-name">
                        <strong>${business.nombre_negocio || business.name || 'Sin nombre'}</strong>
                        <small>${business.categoria || 'Sin categoría'}</small>
                    </div>
                </td>
                <td>
                    <a href="/business.html?id=${business.id}" target="_blank" class="btn btn-sm btn-secondary">
                        <i class="fas fa-external-link-alt"></i>
                        Ver
                    </a>
                </td>
                <td>
                    <button class="toggle-btn ${isVisible ? 'active' : ''}" 
                            data-business-id="${business.id}"
                            onclick="window.adminPanel.toggleBusinessVisibility('${business.id}', ${!isVisible})">
                        <span class="toggle-slider"></span>
                        <span class="toggle-label">${isVisible ? 'Visible' : 'Oculto'}</span>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    async toggleBusinessVisibility(businessId, newVisibility) {
        console.log(`🔄 Cambiando visibilidad de negocio ${businessId} a ${newVisibility}`);
        
        try {
            const response = await fetch('/.netlify/functions/admin-visibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    businessId: businessId,
                    visible: newVisibility
                })
            });

            if (response.ok) {
                console.log('✅ Visibilidad actualizada');
                // Reload dashboard data
                this.loadDashboardData();
            } else {
                console.error('❌ Error actualizando visibilidad');
            }
        } catch (error) {
            console.error('💥 Error en toggle visibility:', error);
        }
    }
}

// ===================================
// FUNCIONES GLOBALES DE DEBUG
// ===================================

// Función para limpiar localStorage y forzar login (para debugging)
window.forceAdminLogin = function() {
    console.log('🧹 Forzando limpieza de tokens y login...');
    localStorage.removeItem('adminToken');
    if (window.adminPanel) {
        window.adminPanel.showLogin();
    }
    console.log('✅ Login forzado - usar admin/admin123');
};

// ===================================
// INICIALIZACIÓN
// ===================================

console.log('⏳ Esperando DOM...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM cargado, inicializando AdminPanelSimple...');
    
    // Clear any invalid tokens on page load
    const existingToken = localStorage.getItem('adminToken');
    if (existingToken && !existingToken.startsWith('valid-')) {
        console.log('🧹 Limpiando token inválido al cargar página...');
        localStorage.removeItem('adminToken');
    }
    
    window.adminPanel = new AdminPanelSimple();
    console.log('✅ AdminPanelSimple inicializado correctamente!');
    console.log('💡 Tip: Si necesitas forzar login, ejecuta: forceAdminLogin()');
});

console.log('📄 admin-working.js cargado completamente');
