// 🚨 ADMIN PANEL FORZADO - SOLUCIÓN DEFINITIVA PARA NETLIFY
console.log('='.repeat(60));
console.log('🚀 ADMIN PANEL FORZADO - ARCHIVO JS EXTERNO CARGANDO!');
console.log('🔧 Solución definitiva para problemas de Netlify...');
console.log('Timestamp:', new Date().toISOString());
console.log('Location:', window.location.href);
console.log('='.repeat(60));

class AdminPanel {
    constructor() {
        console.log('🏗️ Construyendo AdminPanel...');
        this.isAuthenticated = false;
        this.businesses = [];
        this.quotaData = {};
        this.systemConfig = {};
        
        // Variables de paginación y filtros
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.totalPages = 1;
        this.filteredBusinesses = [];
        
        console.log('⚙️ Propiedades inicializadas, llamando init()...');
        this.init();
        console.log('✅ Constructor AdminPanel completado!');
    }

    init() {
        console.log('🔄 Iniciando AdminPanel...');
        this.bindEvents();
        this.checkAuthStatus();
        this.loadBusinesses();
        console.log('✅ AdminPanel inicializado completamente!');
    }

    bindEvents() {
        console.log('🔗 Vinculando eventos...');
        
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        console.log('✅ Eventos vinculados!');
    }

    checkAuthStatus() {
        console.log('🔐 Verificando estado de autenticación...');
        const token = localStorage.getItem('adminToken');
        if (token) {
            this.isAuthenticated = true;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        console.log('🔑 Mostrando pantalla de login...');
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        console.log('📊 Mostrando dashboard...');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        this.loadDashboardData();
    }

    login() {
        console.log('🔐 Intentando login...');
        const password = document.getElementById('adminPassword').value;
        
        if (password === 'admin123') {
            localStorage.setItem('adminToken', 'admin-authenticated');
            this.isAuthenticated = true;
            this.showDashboard();
            this.showNotification('Login exitoso', 'success');
        } else {
            this.showNotification('Contraseña incorrecta', 'error');
        }
    }

    logout() {
        console.log('🚪 Cerrando sesión...');
        localStorage.removeItem('adminToken');
        this.isAuthenticated = false;
        this.showLogin();
    }

    switchTab(tabId) {
        console.log(`📑 Cambiando a pestaña: ${tabId}`);
        
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Remover clase activa de todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar pestaña seleccionada
        const targetTab = document.getElementById(tabId + 'Tab');
        if (targetTab) {
            targetTab.style.display = 'block';
        }
        
        // Activar botón correspondiente
        const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // Cargar datos específicos de la pestaña
        this.loadTabData(tabId);
    }

    loadTabData(tabId) {
        console.log(`📂 Cargando datos para pestaña: ${tabId}`);
        
        switch(tabId) {
            case 'overview':
                this.loadDashboardData();
                break;
            case 'businesses':
                this.loadBusinesses();
                break;
            case 'quotas':
                this.loadQuotaData();
                break;
            case 'sync':
                this.loadSyncData();
                break;
            case 'google-mb':
                this.loadGoogleMBData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    async loadBusinesses() {
        console.log('🏢 Cargando negocios...');
        
        try {
            const response = await fetch('/.netlify/functions/businesses');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Datos recibidos:', data);
            
            if (Array.isArray(data)) {
                this.businesses = data.map(business => ({
                    ...business,
                    visible: business.visible !== false // Default visible
                }));
            } else if (data.businesses && Array.isArray(data.businesses)) {
                this.businesses = data.businesses.map(business => ({
                    ...business,
                    visible: business.visible !== false
                }));
            } else {
                console.warn('⚠️ Formato de datos inesperado, usando datos mock');
                this.businesses = this.getMockBusinesses();
            }
            
            console.log(`✅ ${this.businesses.length} negocios cargados`);
            this.renderBusinessTable();
            this.updateDashboardStats();
            
        } catch (error) {
            console.error('❌ Error cargando negocios:', error);
            this.businesses = this.getMockBusinesses();
            this.renderBusinessTable();
            this.updateDashboardStats();
            this.showNotification('Error cargando negocios, usando datos de respaldo', 'warning');
        }
    }

    getMockBusinesses() {
        return [
            { id: '1', name: 'Restaurante El Sabor', category: 'Comida', address: 'Calle 1 #2-3', phone: '123-456-7890', visible: true },
            { id: '2', name: 'Farmacia Central', category: 'Salud', address: 'Carrera 5 #10-15', phone: '098-765-4321', visible: true },
            { id: '3', name: 'Supermercado Familiar', category: 'Comida', address: 'Avenida Principal #20-25', phone: '555-123-4567', visible: false },
            { id: '4', name: 'Peluquería Estilo', category: 'Belleza', address: 'Calle 8 #15-20', phone: '777-888-9999', visible: true },
            { id: '5', name: 'Ferretería El Clavo', category: 'Servicios', address: 'Carrera 3 #5-10', phone: '111-222-3333', visible: true }
        ];
    }

    renderBusinessTable() {
        console.log('📋 Renderizando tabla de negocios...');
        const container = document.getElementById('businessTable');
        if (!container) {
            console.warn('⚠️ Contenedor businessTable no encontrado');
            return;
        }

        // Calcular paginación
        this.totalPages = Math.ceil(this.businesses.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentBusinesses = this.businesses.slice(startIndex, endIndex);

        const html = `
            <div class="business-controls">
                <div class="search-filter">
                    <input type="text" id="businessSearch" placeholder="Buscar negocios..." 
                           onkeyup="adminPanel.filterBusinesses()">
                    <select id="categoryFilter" onchange="adminPanel.filterBusinesses()">
                        <option value="">Todas las categorías</option>
                        <option value="Comida">Comida</option>
                        <option value="Salud">Salud</option>
                        <option value="Belleza">Belleza</option>
                        <option value="Servicios">Servicios</option>
                    </select>
                    <select id="statusFilter" onchange="adminPanel.filterBusinesses()">
                        <option value="">Todos los estados</option>
                        <option value="visible">Visibles</option>
                        <option value="hidden">Ocultos</option>
                    </select>
                </div>
                <div class="bulk-actions">
                    <button onclick="adminPanel.showAllBusinesses()" class="btn-primary">
                        👁️ Mostrar Todos
                    </button>
                    <button onclick="adminPanel.hideAllBusinesses()" class="btn-secondary">
                        🙈 Ocultar Todos
                    </button>
                    <button onclick="adminPanel.exportBusinesses()" class="btn-info">
                        📥 Exportar
                    </button>
                </div>
            </div>
            
            <div class="table-info">
                <span>Mostrando ${startIndex + 1}-${Math.min(endIndex, this.businesses.length)} de ${this.businesses.length} negocios</span>
            </div>
            
            <table class="business-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll" onchange="adminPanel.toggleSelectAll()"></th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentBusinesses.map(business => `
                        <tr data-business-id="${business.id}">
                            <td><input type="checkbox" class="business-checkbox" value="${business.id}"></td>
                            <td>
                                <strong>${business.name}</strong>
                                <br><small>ID: ${business.id}</small>
                            </td>
                            <td><span class="category-badge">${business.category}</span></td>
                            <td><small>${business.address || 'No disponible'}</small></td>
                            <td><small>${business.phone || 'No disponible'}</small></td>
                            <td>
                                <span class="status ${business.visible ? 'visible' : 'hidden'}">
                                    ${business.visible ? '👁️ Visible' : '🙈 Oculto'}
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button onclick="adminPanel.toggleBusinessVisibility('${business.id}')" 
                                            class="toggle-btn ${business.visible ? 'hide' : 'show'}" 
                                            title="${business.visible ? 'Ocultar' : 'Mostrar'} negocio">
                                        ${business.visible ? '🙈' : '👁️'}
                                    </button>
                                    <button onclick="adminPanel.viewBusiness('${business.id}')" 
                                            class="view-btn" title="Ver detalles">
                                        🔗
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            ${this.renderPagination()}
        `;
        
        container.innerHTML = html;
        console.log(`✅ Tabla renderizada: ${currentBusinesses.length} negocios en página ${this.currentPage}`);
    }

    renderPagination() {
        if (this.totalPages <= 1) return '';
        
        let html = '<div class="pagination">';
        
        if (this.currentPage > 1) {
            html += `<button onclick="adminPanel.changePage(${this.currentPage - 1})" class="page-btn">← Anterior</button>`;
        }
        
        for (let i = 1; i <= this.totalPages; i++) {
            html += `<button onclick="adminPanel.changePage(${i})" 
                class="page-btn ${i === this.currentPage ? 'active' : ''}">${i}</button>`;
        }
        
        if (this.currentPage < this.totalPages) {
            html += `<button onclick="adminPanel.changePage(${this.currentPage + 1})" class="page-btn">Siguiente →</button>`;
        }
        
        html += `<span class="page-info">Página ${this.currentPage} de ${this.totalPages}</span>`;
        html += '</div>';
        
        return html;
    }

    changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.renderBusinessTable();
        }
    }

    toggleBusinessVisibility(businessId) {
        console.log(`🔄 Cambiando visibilidad del negocio ${businessId}...`);
        const business = this.businesses.find(b => b.id === businessId);
        if (business) {
            business.visible = !business.visible;
            this.renderBusinessTable();
            this.updateDashboardStats();
            this.showNotification(`Negocio ${business.visible ? 'mostrado' : 'ocultado'}`, 'success');
        }
    }

    toggleSelectAll() {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.business-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    }

    showAllBusinesses() {
        const selectedIds = this.getSelectedBusinessIds();
        if (selectedIds.length === 0) {
            this.showNotification('Selecciona al menos un negocio', 'warning');
            return;
        }
        
        selectedIds.forEach(id => {
            const business = this.businesses.find(b => b.id === id);
            if (business) business.visible = true;
        });
        
        this.renderBusinessTable();
        this.updateDashboardStats();
        this.showNotification(`${selectedIds.length} negocios mostrados`, 'success');
    }

    hideAllBusinesses() {
        const selectedIds = this.getSelectedBusinessIds();
        if (selectedIds.length === 0) {
            this.showNotification('Selecciona al menos un negocio', 'warning');
            return;
        }
        
        selectedIds.forEach(id => {
            const business = this.businesses.find(b => b.id === id);
            if (business) business.visible = false;
        });
        
        this.renderBusinessTable();
        this.updateDashboardStats();
        this.showNotification(`${selectedIds.length} negocios ocultados`, 'success');
    }

    getSelectedBusinessIds() {
        const checkboxes = document.querySelectorAll('.business-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    viewBusiness(businessId) {
        const business = this.businesses.find(b => b.id === businessId);
        if (business) {
            const url = `https://directorioacacias.netlify.app/business.html?id=${businessId}`;
            window.open(url, '_blank');
        }
    }

    exportBusinesses() {
        const data = this.businesses.map(business => ({
            id: business.id,
            nombre: business.name,
            categoria: business.category,
            direccion: business.address || '',
            telefono: business.phone || '',
            visible: business.visible ? 'Sí' : 'No'
        }));
        
        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'negocios_acacias.csv');
        this.showNotification('Archivo exportado exitosamente', 'success');
    }

    convertToCSV(data) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
        return [headers, ...rows].join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    loadDashboardData() {
        console.log('📊 Cargando datos del dashboard...');
        this.updateDashboardStats();
    }

    updateDashboardStats() {
        console.log('📈 Actualizando estadísticas...');
        
        const totalBusinesses = this.businesses.length;
        const visibleBusinesses = this.businesses.filter(b => b.visible).length;
        
        // Actualizar estadísticas
        const totalElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        const visibleElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        
        if (totalElement) totalElement.textContent = totalBusinesses;
        if (visibleElement) visibleElement.textContent = visibleBusinesses;
        
        console.log(`✅ Stats: ${totalBusinesses} total, ${visibleBusinesses} visibles`);
    }

    loadQuotaData() {
        console.log('📊 Cargando datos de cuotas...');
        // Implementación futura
    }

    loadSyncData() {
        console.log('🔄 Cargando datos de sincronización...');
        // Implementación futura
    }

    loadGoogleMBData() {
        console.log('🔗 Cargando datos de Google My Business...');
        // Implementación futura
    }

    loadSettingsData() {
        console.log('⚙️ Cargando configuración...');
        // Implementación futura
    }

    showNotification(message, type = 'info') {
        console.log(`📢 Notificación [${type}]: ${message}`);
        
        // Crear notificación visual
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 🚀 INICIALIZACIÓN AUTOMÁTICA
console.log('🎯 Esperando DOM ready...');

function initAdminPanel() {
    console.log('🏁 Inicializando AdminPanel...');
    window.adminPanel = new AdminPanel();
    console.log('✅ AdminPanel inicializado y disponible globalmente!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
    initAdminPanel();
}

console.log('🚀 ADMIN PANEL FORZADO - ARCHIVO CARGADO COMPLETAMENTE!');
