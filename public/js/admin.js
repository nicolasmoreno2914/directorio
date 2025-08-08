class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.currentTab = 'overview';
        this.businesses = [];
        this.quotaStats = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Refresh buttons
        document.getElementById('refreshBusinesses')?.addEventListener('click', () => {
            this.loadBusinesses();
        });

        document.getElementById('refreshQuota')?.addEventListener('click', () => {
            this.loadQuotaStats();
        });

        // Business filter
        document.getElementById('businessFilter')?.addEventListener('change', (e) => {
            this.filterBusinesses(e.target.value);
        });

        // Quota limits form
        document.getElementById('quotaLimitsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateQuotaLimits();
        });

        // Google My Business events
        document.getElementById('connectGmbBtn')?.addEventListener('click', () => {
            this.connectGoogleMyBusiness();
        });

        document.getElementById('disconnectGmb')?.addEventListener('click', () => {
            this.disconnectGoogleMyBusiness();
        });

        document.getElementById('testPlacesApi')?.addEventListener('click', () => {
            this.testPlacesAPI();
        });

        document.getElementById('testBusinessInfoApi')?.addEventListener('click', () => {
            this.testBusinessInfoAPI();
        });

        document.getElementById('businessSearchForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchGoogleBusinesses();
        });

        document.getElementById('syncAllSocialProfiles')?.addEventListener('click', () => {
            this.syncAllSocialProfiles();
        });

        document.getElementById('testGmbIntegration')?.addEventListener('click', () => {
            this.testGmbIntegration();
        });

        // Settings form
        document.getElementById('searchConfigForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateQuotaLimits();
        });

        // Sync controls
        document.getElementById('checkSyncBtn')?.addEventListener('click', () => {
            this.checkSyncAvailability();
        });

        document.getElementById('executeSyncBtn')?.addEventListener('click', () => {
            this.executeSynchronization();
        });

        // Settings form
        document.getElementById('searchConfigForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateSearchConfig();
        });

        // Modal controls
        document.querySelector('.modal-close')?.addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modalCancel')?.addEventListener('click', () => {
            this.hideModal();
        });
    }

    checkAuthStatus() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            this.isAuthenticated = true;
            this.showDashboard();
            this.loadDashboardData();
        } else {
            this.showLogin();
        }
    }

    async handleLogin() {
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            this.showLoading(true);
            
            const response = await fetch('/.netlify/functions/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('adminToken', data.token);
                this.isAuthenticated = true;
                this.showDashboard();
                this.loadDashboardData();
            } else {
                errorDiv.textContent = data.error || 'Contraseña incorrecta';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'Error de conexión. Intenta nuevamente.';
            errorDiv.style.display = 'block';
        } finally {
            this.showLoading(false);
        }
    }

    handleLogout() {
        localStorage.removeItem('adminToken');
        this.isAuthenticated = false;
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('password').value = '';
        document.getElementById('loginError').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific data
        switch(tabName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'businesses':
                this.loadBusinesses();
                break;
            case 'quota':
                this.loadQuotaStats();
                break;
            case 'sync':
                this.loadSyncStatus();
                break;
            case 'google-mb':
                this.loadGmbData();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    async loadDashboardData() {
        await Promise.all([
            this.loadOverviewData(),
            this.loadBusinesses(),
            this.loadQuotaStats(),
            this.loadSyncStatus(),
            this.loadSettings()
        ]);
    }

    async loadOverviewData() {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/overview', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateOverviewStats(data);
            }
        } catch (error) {
            console.error('Error loading overview:', error);
        }
    }

    updateOverviewStats(data) {
        document.getElementById('totalBusinesses').textContent = data.totalBusinesses || 0;
        document.getElementById('visibleBusinesses').textContent = data.visibleBusinesses || 0;
        document.getElementById('apiRequests').textContent = data.monthlyRequests || 0;
        document.getElementById('estimatedCost').textContent = `$${(data.estimatedCost || 0).toFixed(4)}`;

        // Update recent activity
        const activityList = document.getElementById('recentActivity');
        activityList.innerHTML = '';

        if (data.recentActivity && data.recentActivity.length > 0) {
            data.recentActivity.forEach(activity => {
                const item = this.createActivityItem(activity);
                activityList.appendChild(item);
            });
        } else {
            activityList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No hay actividad reciente</p>';
        }
    }

    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';

        const iconColors = {
            'nearby_search': '#667eea',
            'place_details': '#28a745',
            'place_photos': '#ffc107',
            'sync': '#dc3545',
            'business_update': '#17a2b8'
        };

        const iconNames = {
            'nearby_search': 'fas fa-search',
            'place_details': 'fas fa-info-circle',
            'place_photos': 'fas fa-camera',
            'sync': 'fas fa-sync-alt',
            'business_update': 'fas fa-edit'
        };

        item.innerHTML = `
            <div class="activity-icon" style="background: ${iconColors[activity.type] || '#6c757d'}">
                <i class="${iconNames[activity.type] || 'fas fa-circle'}"></i>
            </div>
            <div class="activity-info">
                <h4>${this.getActivityTitle(activity)}</h4>
                <p>${new Date(activity.timestamp).toLocaleString()}</p>
            </div>
        `;

        return item;
    }

    getActivityTitle(activity) {
        const titles = {
            'nearby_search': 'Búsqueda de negocios',
            'place_details': 'Consulta de detalles',
            'place_photos': 'Descarga de fotos',
            'sync': 'Sincronización ejecutada',
            'business_update': 'Negocio actualizado'
        };

        return titles[activity.type] || 'Actividad desconocida';
    }

    async loadBusinesses() {
        try {
            this.showLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/.netlify/functions/admin-businesses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.businesses = data.businesses || [];
                this.renderBusinesses();
                
                // Update stats in overview
                document.getElementById('totalBusinesses').textContent = data.total || 0;
                document.getElementById('visibleBusinesses').textContent = data.visible || 0;
            } else {
                this.showNotification('Error al cargar negocios', 'error');
            }
        } catch (error) {
            console.error('Error loading businesses:', error);
            this.showNotification('Error de conexión al cargar negocios', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderBusinesses() {
        const container = document.getElementById('businessesGrid');
        container.innerHTML = '';

        if (this.businesses.length === 0) {
            container.innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">No hay negocios registrados</p>';
            return;
        }

        // Create table structure
        const table = document.createElement('div');
        table.className = 'businesses-table';
        table.style.cssText = `
            width: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        `;

        // Table header
        const header = document.createElement('div');
        header.className = 'table-header';
        header.style.cssText = `
            display: grid;
            grid-template-columns: 2fr 2fr 1fr;
            gap: 20px;
            padding: 20px;
            background: #f8f9fa;
            font-weight: 600;
            color: #495057;
            border-bottom: 1px solid #dee2e6;
        `;
        header.innerHTML = `
            <div>Nombre del Negocio</div>
            <div>Enlace</div>
            <div style="text-align: center;">Estado</div>
        `;
        table.appendChild(header);

        // Table rows
        this.businesses.forEach((business, index) => {
            const row = this.createBusinessRow(business, index);
            table.appendChild(row);
        });

        container.appendChild(table);
    }

    createBusinessRow(business, index) {
        const row = document.createElement('div');
        row.className = 'business-row';
        row.style.cssText = `
            display: grid;
            grid-template-columns: 2fr 2fr 1fr;
            gap: 20px;
            padding: 20px;
            border-bottom: 1px solid #dee2e6;
            align-items: center;
            transition: background-color 0.2s;
        `;
        
        // Hover effect
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f8f9fa';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = 'transparent';
        });

        // Business name column
        const nameColumn = document.createElement('div');
        nameColumn.style.cssText = `
            font-weight: 500;
            color: #495057;
            font-size: 14px;
        `;
        nameColumn.innerHTML = `
            <div style="margin-bottom: 4px;">${business.nombre_negocio}</div>
            <div style="font-size: 12px; color: #6c757d;">${business.categoria || 'Sin categoría'}</div>
        `;

        // Link column
        const linkColumn = document.createElement('div');
        linkColumn.innerHTML = `
            <a href="${business.link}" target="_blank" 
               style="color: #007bff; text-decoration: none; font-size: 13px; word-break: break-all;"
               onmouseover="this.style.textDecoration='underline'"
               onmouseout="this.style.textDecoration='none'">
                ${business.link}
            </a>
        `;

        // Status toggle column
        const statusColumn = document.createElement('div');
        statusColumn.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.style.cssText = `
            width: 60px;
            height: 30px;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            background: ${business.visible_en_directorio ? '#28a745' : '#dc3545'};
            outline: none;
        `;
        
        const toggleCircle = document.createElement('div');
        toggleCircle.style.cssText = `
            width: 26px;
            height: 26px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: ${business.visible_en_directorio ? '32px' : '2px'};
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        
        toggleButton.appendChild(toggleCircle);
        
        // Add click handler for toggle
        toggleButton.addEventListener('click', () => {
            this.toggleBusinessVisibility(business.id, !business.visible_en_directorio, toggleButton, toggleCircle);
        });
        
        // Add tooltip
        toggleButton.title = business.visible_en_directorio ? 'Clic para ocultar' : 'Clic para mostrar';
        
        statusColumn.appendChild(toggleButton);

        // Append columns to row
        row.appendChild(nameColumn);
        row.appendChild(linkColumn);
        row.appendChild(statusColumn);

        return row;
    }

    async toggleBusinessVisibility(businessId, newVisibility, toggleButton, toggleCircle) {
        try {
            // Disable button during request
            toggleButton.disabled = true;
            toggleButton.style.opacity = '0.6';
            
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/.netlify/functions/admin-businesses', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    businessId: businessId,
                    visible: newVisibility
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update UI immediately
                toggleButton.style.background = newVisibility ? '#28a745' : '#dc3545';
                toggleCircle.style.left = newVisibility ? '32px' : '2px';
                toggleButton.title = newVisibility ? 'Clic para ocultar' : 'Clic para mostrar';
                
                // Update business data in memory
                const business = this.businesses.find(b => b.id === businessId);
                if (business) {
                    business.visible_en_directorio = newVisibility;
                }
                
                // Update stats
                const visibleCount = this.businesses.filter(b => b.visible_en_directorio).length;
                document.getElementById('visibleBusinesses').textContent = visibleCount;
                
                // Show success notification
                this.showNotification(
                    `Negocio ${newVisibility ? 'activado' : 'desactivado'} correctamente`, 
                    'success'
                );
            } else {
                this.showNotification(data.error || 'Error al actualizar negocio', 'error');
            }
        } catch (error) {
            console.error('Error toggling business visibility:', error);
            this.showNotification('Error de conexión al actualizar negocio', 'error');
        } finally {
            // Re-enable button
            toggleButton.disabled = false;
            toggleButton.style.opacity = '1';
        }
    }

    filterBusinesses(filter) {
        const cards = document.querySelectorAll('.business-card');
        
        cards.forEach(card => {
            const businessId = card.dataset.businessId;
            const business = this.businesses.find(b => b.id == businessId);
            
            if (!business) return;

            let show = true;
            
            switch(filter) {
                case 'visible':
                    show = business.visible_en_directorio;
                    break;
                case 'hidden':
                    show = !business.visible_en_directorio;
                    break;
                case 'all':
                default:
                    show = true;
                    break;
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    async loadQuotaStats() {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/quota-stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.quotaStats = data.quota_stats;
                this.renderQuotaStats();
            }
        } catch (error) {
            console.error('Error loading quota stats:', error);
        }
    }

    renderQuotaStats() {
        if (!this.quotaStats) return;

        // Monthly quota
        const monthlyContainer = document.getElementById('monthlyQuota');
        monthlyContainer.innerHTML = '';

        Object.entries(this.quotaStats.monthly.usage).forEach(([type, used]) => {
            const limit = this.quotaStats.monthly.limits[type];
            const percentage = (used / limit) * 100;
            
            const bar = this.createQuotaBar(type, used, limit, percentage);
            monthlyContainer.appendChild(bar);
        });

        // Daily quota
        const dailyContainer = document.getElementById('dailyQuota');
        dailyContainer.innerHTML = '';

        Object.entries(this.quotaStats.daily.usage).forEach(([type, used]) => {
            const limit = this.quotaStats.daily.limits[type];
            const percentage = (used / limit) * 100;
            
            const bar = this.createQuotaBar(type, used, limit, percentage);
            dailyContainer.appendChild(bar);
        });

        // Update form with current limits
        document.getElementById('monthlySearchLimit').value = this.quotaStats.monthly.limits.nearby_search;
        document.getElementById('monthlyDetailsLimit').value = this.quotaStats.monthly.limits.place_details;
        document.getElementById('dailySearchLimit').value = this.quotaStats.daily.limits.nearby_search;
        document.getElementById('dailyDetailsLimit').value = this.quotaStats.daily.limits.place_details;
    }

    createQuotaBar(type, used, limit, percentage) {
        const container = document.createElement('div');
        container.className = 'quota-bar';

        const typeNames = {
            'nearby_search': 'Búsquedas',
            'place_details': 'Detalles',
            'place_photos': 'Fotos'
        };

        let fillClass = '';
        if (percentage >= 90) fillClass = 'danger';
        else if (percentage >= 70) fillClass = 'warning';

        container.innerHTML = `
            <div class="quota-bar-label">
                <span>${typeNames[type] || type}</span>
                <span>${used}/${limit} (${percentage.toFixed(1)}%)</span>
            </div>
            <div class="quota-bar-progress">
                <div class="quota-bar-fill ${fillClass}" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
        `;

        return container;
    }

    async updateQuotaLimits() {
        try {
            const token = localStorage.getItem('adminToken');
            
            const limits = {
                monthly_nearby_search: parseInt(document.getElementById('monthlySearchLimit').value),
                monthly_place_details: parseInt(document.getElementById('monthlyDetailsLimit').value),
                daily_nearby_search: parseInt(document.getElementById('dailySearchLimit').value),
                daily_place_details: parseInt(document.getElementById('dailyDetailsLimit').value)
            };

            const response = await fetch('/api/admin/quota-limits', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ limits })
            });

            if (response.ok) {
                this.showNotification('Límites actualizados correctamente', 'success');
                this.loadQuotaStats();
            } else {
                throw new Error('Error updating limits');
            }
        } catch (error) {
            console.error('Error updating quota limits:', error);
            this.showNotification('Error al actualizar límites', 'error');
        }
    }

    async loadSyncStatus() {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/sync-status', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateSyncStatus(data);
            }
        } catch (error) {
            console.error('Error loading sync status:', error);
        }
    }

    updateSyncStatus(data) {
        const statusElement = document.getElementById('syncStatus');
        const lastSyncElement = document.getElementById('lastSync');

        if (data.lastSync) {
            statusElement.innerHTML = `
                <span class="status-indicator online"></span>
                <span>Sincronización activa</span>
            `;
            lastSyncElement.textContent = `Última sincronización: ${new Date(data.lastSync).toLocaleString()}`;
        } else {
            statusElement.innerHTML = `
                <span class="status-indicator offline"></span>
                <span>Sin sincronizar</span>
            `;
            lastSyncElement.textContent = 'Última sincronización: Nunca';
        }
    }

    async checkSyncAvailability() {
        try {
            this.showLoading(true);
            const token = localStorage.getItem('adminToken');
            
            const response = await fetch('/api/admin/sync-check?businesses=100', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            const resultDiv = document.getElementById('syncCheckResult');
            const executeBtn = document.getElementById('executeSyncBtn');

            if (data.sync_check.allowed) {
                resultDiv.className = 'check-result success';
                resultDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <strong>Sincronización disponible</strong><br>
                    Se pueden procesar hasta ${data.estimated_businesses} negocios.<br>
                    Requests estimados: ${JSON.stringify(data.sync_check.estimated_requests)}
                `;
                executeBtn.disabled = false;
            } else {
                resultDiv.className = 'check-result error';
                resultDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Sincronización bloqueada</strong><br>
                    ${this.formatSyncErrors(data.sync_check.checks)}
                `;
                executeBtn.disabled = true;
            }
        } catch (error) {
            console.error('Error checking sync:', error);
            document.getElementById('syncCheckResult').className = 'check-result error';
            document.getElementById('syncCheckResult').innerHTML = `
                <i class="fas fa-times-circle"></i>
                Error al verificar disponibilidad
            `;
        } finally {
            this.showLoading(false);
        }
    }

    formatSyncErrors(checks) {
        const errors = [];
        Object.entries(checks).forEach(([type, check]) => {
            if (!check.allowed) {
                const typeNames = {
                    'nearby_search': 'Búsquedas',
                    'place_details': 'Detalles',
                    'place_photos': 'Fotos'
                };
                
                const reasonNames = {
                    'monthly_limit_exceeded': 'Límite mensual excedido',
                    'daily_limit_exceeded': 'Límite diario excedido'
                };

                errors.push(`${typeNames[type]}: ${reasonNames[check.reason]} (${check.current}/${check.limit})`);
            }
        });
        return errors.join('<br>');
    }

    async executeSynchronization() {
        const confirmed = await this.showConfirmModal(
            'Confirmar Sincronización',
            '¿Estás seguro de ejecutar la sincronización? Esta acción consumirá requests de tu cuota de Google Places API.'
        );

        if (!confirmed) return;

        try {
            this.showLoading(true);
            const token = localStorage.getItem('adminToken');
            
            const response = await fetch('/api/admin/sync', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            const resultDiv = document.getElementById('syncResult');

            if (response.ok && data.success) {
                resultDiv.className = 'sync-result success';
                resultDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <strong>Sincronización completada</strong><br>
                    Negocios obtenidos: ${data.results.total_fetched}<br>
                    Creados: ${data.results.created}, Actualizados: ${data.results.updated}<br>
                    Costo estimado: $${data.quota_usage.estimated_cost.toFixed(4)}
                `;
                
                // Refresh data
                this.loadDashboardData();
            } else {
                resultDiv.className = 'sync-result error';
                resultDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Error en sincronización</strong><br>
                    ${data.error || 'Error desconocido'}
                `;
            }
        } catch (error) {
            console.error('Error executing sync:', error);
            document.getElementById('syncResult').className = 'sync-result error';
            document.getElementById('syncResult').innerHTML = `
                <i class="fas fa-times-circle"></i>
                Error al ejecutar sincronización
            `;
        } finally {
            this.showLoading(false);
        }
    }

    async loadSettings() {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateSettings(data);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    updateSettings(data) {
        // API Status
        const apiStatus = document.getElementById('apiStatus');
        if (data.apiConnected) {
            apiStatus.innerHTML = `
                <span class="status-indicator online"></span>
                <span>Conectado</span>
            `;
        } else {
            apiStatus.innerHTML = `
                <span class="status-indicator offline"></span>
                <span>Desconectado</span>
            `;
        }

        // Billing Status
        const billingStatus = document.getElementById('billingStatus');
        if (data.billingEnabled) {
            billingStatus.innerHTML = `
                <span class="status-indicator online"></span>
                <span>Habilitada</span>
            `;
        } else {
            billingStatus.innerHTML = `
                <span class="status-indicator warning"></span>
                <span>No habilitada</span>
            `;
        }

        // Form values
        document.getElementById('searchRadius').value = data.searchRadius || 10;
        document.getElementById('maxBusinesses').value = data.maxBusinesses || 100;
    }

    async updateSearchConfig() {
        try {
            const token = localStorage.getItem('adminToken');
            
            const config = {
                searchRadius: parseInt(document.getElementById('searchRadius').value),
                maxBusinesses: parseInt(document.getElementById('maxBusinesses').value)
            };

            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                this.showNotification('Configuración actualizada correctamente', 'success');
            } else {
                throw new Error('Error updating settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            this.showNotification('Error al actualizar configuración', 'error');
        }
    }

    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            ${message}
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showConfirmModal(title, message) {
        return new Promise((resolve) => {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalMessage').textContent = message;
            document.getElementById('confirmModal').style.display = 'flex';

            const handleConfirm = () => {
                this.hideModal();
                resolve(true);
                document.getElementById('modalConfirm').removeEventListener('click', handleConfirm);
                document.getElementById('modalCancel').removeEventListener('click', handleCancel);
            };

            const handleCancel = () => {
                this.hideModal();
                resolve(false);
                document.getElementById('modalConfirm').removeEventListener('click', handleConfirm);
                document.getElementById('modalCancel').removeEventListener('click', handleCancel);
            };

            document.getElementById('modalConfirm').addEventListener('click', handleConfirm);
            document.getElementById('modalCancel').addEventListener('click', handleCancel);
        });
    }

    hideModal() {
        document.getElementById('confirmModal').style.display = 'none';
    }

    viewBusinessDetails(businessId) {
        const business = this.businesses.find(b => b.id == businessId);
        if (business) {
            // Open business details in new tab
            window.open(`/negocio/${business.id}`, '_blank');
        }
    }

    editBusiness(businessId) {
        // TODO: Implement business editing functionality
        this.showNotification('Funcionalidad de edición próximamente', 'info');
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Add notification styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: 500;
    z-index: 3000;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 300px;
    animation: slideIn 0.3s ease;
}

.notification-success {
    background: #28a745;
}

.notification-error {
    background: #dc3545;
}

.notification-info {
    background: #17a2b8;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
