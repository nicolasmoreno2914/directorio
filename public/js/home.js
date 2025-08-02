// Simplified Home page functionality
class HomePage {
    constructor() {
        // Prevent multiple initializations
        if (window.homePageInitialized) {
            console.log('⚠️ HomePage already initialized');
            return window.homePageInstance;
        }
        
        console.log('🚀 Initializing HomePage...');
        
        this.app = window.YoComproAcacias;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasLoadedInitialData = false;
        
        window.homePageInitialized = true;
        window.homePageInstance = this;
        
        // Simple initialization without complex async operations
        this.simpleInit();
    }

    simpleInit() {
        console.log('🔧 Simple initialization starting...');
        
        // Inicializar optimizaciones de scroll
        this.optimizeScrollPerformance();
        
        // Only load data once
        if (!this.hasLoadedInitialData) {
            this.hasLoadedInitialData = true;
            this.loadBusinessesOnce();
        }
        
        console.log('✅ Simple initialization complete');
    }
    
    async loadBusinessesOnce() {
        try {
            console.log('📊 Loading businesses once...');
            
            // CARGAR CANTIDAD MODERADA PARA SCROLL FLUIDO
            const response = await fetch('/api/businesses?page=1&limit=24');
            const data = await response.json();
            
            if (data && data.data) {
                console.log(`✅ Loaded ${data.data.length} businesses`);
                this.renderBusinessesOptimized(data.data);
            } else if (data && Array.isArray(data)) {
                console.log(`✅ Loaded ${data.length} businesses`);
                this.renderBusinessesOptimized(data);
            } else {
                console.log('⚠️ No businesses data found');
            }
        } catch (error) {
            console.error('❌ Error loading businesses:', error);
            this.showErrorMessage('Error cargando negocios: ' + error.message);
        }
    }

    renderBusinessesOptimized(businesses) {
        console.log('🎨 Rendering businesses optimized...');
        
        const container = document.getElementById('allBusinessesGrid');
        if (!container) {
            console.error('❌ Business grid container not found');
            return;
        }

        if (!businesses || businesses.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron negocios</p>
                </div>
            `;
            return;
        }

        // Render businesses with optimized HTML
        const businessCards = businesses.map(business => {
            const images = this.parseImages(business.imagenes);
            const firstImage = images && images.length > 0 ? images[0] : null;
            
            return `
                <div class="business-card" onclick="window.location.href='/negocio/${business.id}'">
                    <div class="business-image">
                        ${firstImage ? 
                            `<img src="${firstImage}" alt="${business.nombre_negocio}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.backgroundColor='#4CAF50';">` :
                            `<div class="business-icon" style="background-color: #4CAF50;">📍</div>`
                        }
                    </div>
                    <div class="business-info">
                        <h3 class="business-name">${business.nombre_negocio}</h3>
                        <p class="business-category">${business.categoria || 'Sin categoría'}</p>
                        <p class="business-address">${business.direccion || 'Dirección no disponible'}</p>
                        ${business.calificacion ? `
                            <div class="business-rating">
                                <span class="stars">${'⭐'.repeat(Math.floor(business.calificacion))}</span>
                                <span class="rating-number">${business.calificacion}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = businessCards;
        console.log(`✅ Rendered ${businesses.length} business cards`);
    }

    parseImages(imageData) {
        if (!imageData) return [];
        
        try {
            if (typeof imageData === 'string') {
                // Try to parse as JSON
                const parsed = JSON.parse(imageData);
                return Array.isArray(parsed) ? parsed : [parsed];
            } else if (Array.isArray(imageData)) {
                return imageData;
            }
        } catch (error) {
            console.log('Could not parse images:', error);
        }
        
        return [];
    }

    showErrorMessage(message) {
        const container = document.getElementById('allBusinessesGrid');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="color: red; text-align: center; padding: 20px;">
                    <p>❌ ${message}</p>
                </div>
            `;
        }
    }

    optimizeScrollPerformance() {
        // Aplicar optimizaciones de scroll
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        
        // Desactivar smooth scroll en todos los elementos
        const style = document.createElement('style');
        style.textContent = `
            * {
                scroll-behavior: auto !important;
                -webkit-overflow-scrolling: auto !important;
            }
            
            .business-card {
                transition: none !important;
                will-change: auto !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('⚡ Scroll performance optimized');
    }

    async loadStats() {
        try {
            const stats = await this.app.getStats();
            this.renderStats(stats.resumen);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    renderStats(stats) {
        // Render stats if needed
        console.log('📊 Stats loaded:', stats);
    }
}

// Initialize HomePage when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.homePageInitialized) {
            new HomePage();
        }
    });
} else {
    // DOM is already ready
    if (!window.homePageInitialized) {
        new HomePage();
    }
}

// Simple global functions
function navigateToCategory(categoryName) {
    console.log('Navigating to category:', categoryName);
    // Add category navigation logic here
}

console.log('✅ Home.js loaded successfully');
