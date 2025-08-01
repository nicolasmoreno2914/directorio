// HOME.JS - VERSIÓN LIMPIA CON OPTIMIZACIÓN DE SCROLL Y IMÁGENES REALES
(function() {
    'use strict';
    
    // Variables globales
    let allBusinesses = [];
    let isLoading = false;
    
    // OPTIMIZACIÓN DE SCROLL - APLICAR INMEDIATAMENTE
    function optimizeScrollPerformance() {
        // Eliminar scroll suave y animaciones que causan trabado
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        
        // Aplicar estilos de optimización
        const style = document.createElement('style');
        style.textContent = `
            /* OPTIMIZACIÓN EXTREMA DE SCROLL */
            * {
                scroll-behavior: auto !important;
            }
            
            .business-card {
                transition: none !important;
                transform: none !important;
                will-change: auto !important;
            }
            
            .business-card:hover {
                transform: none !important;
                transition: none !important;
                animation: none !important;
            }
            
            .category-card,
            .featured-item {
                transition: none !important;
                transform: none !important;
                will-change: auto !important;
            }
            
            img {
                will-change: auto !important;
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ Optimización de scroll aplicada');
    }
    
    // Cargar negocios desde la API
    async function loadBusinesses() {
        if (isLoading) return;
        isLoading = true;
        
        try {
            console.log('🔄 Cargando negocios...');
            const response = await fetch('/api/businesses');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const businesses = await response.json();
            console.log(`✅ Cargados ${businesses.length} negocios`);
            
            allBusinesses = businesses;
            renderBusinesses(businesses);
            
        } catch (error) {
            console.error('❌ Error cargando negocios:', error);
            showMessage('Error cargando negocios. Intenta recargar la página.', '#ff6b6b');
        } finally {
            isLoading = false;
        }
    }
    
    // Renderizar negocios con imágenes reales de Google My Business
    function renderBusinesses(businesses) {
        const container = document.getElementById('businesses-container');
        if (!container) {
            console.error('❌ Container de negocios no encontrado');
            return;
        }
        
        if (!businesses || businesses.length === 0) {
            container.innerHTML = '<p class="no-results">No se encontraron negocios</p>';
            return;
        }
        
        console.log(`🎯 Renderizando ${businesses.length} negocios`);
        
        const html = businesses.map(business => {
            // Obtener la primera imagen real de Google My Business
            let imageHTML = '';
            
            if (business.imagenes && business.imagenes.length > 0) {
                // Parsear JSON si es string
                let images = business.imagenes;
                if (typeof images === 'string') {
                    try {
                        images = JSON.parse(images);
                    } catch (e) {
                        console.warn('Error parseando imágenes:', e);
                        images = [];
                    }
                }
                
                // Usar la primera imagen disponible
                if (Array.isArray(images) && images.length > 0) {
                    const firstImage = images[0];
                    const imageUrl = typeof firstImage === 'object' ? firstImage.url : firstImage;
                    
                    if (imageUrl) {
                        imageHTML = `<img src="${imageUrl}" alt="${business.nombre_negocio}" class="business-image" loading="eager">`;
                    }
                }
            }
            
            // Si no hay imagen, usar gradiente verde como fallback
            if (!imageHTML) {
                imageHTML = '<div class="business-icon">🏪</div>';
            }
            
            return `
                <div class="business-card" onclick="window.location.href='/negocio/${business.business_id}'">
                    <div class="business-image-container">
                        ${imageHTML}
                    </div>
                    <div class="business-info">
                        <h3 class="business-name">${business.nombre_negocio}</h3>
                        <p class="business-category">${business.categoria_principal || 'Sin categoría'}</p>
                        <p class="business-address">${business.direccion || 'Sin dirección'}</p>
                        ${business.calificacion_promedio ? `<div class="business-rating">⭐ ${business.calificacion_promedio}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('✅ Negocios renderizados exitosamente');
    }
    
    // Mostrar mensaje al usuario
    function showMessage(message, color = '#4CAF50') {
        console.log(`📢 ${message}`);
        // Implementar toast notification si es necesario
    }
    
    // Inicializar la aplicación
    function initializeApp() {
        console.log('🚀 Inicializando aplicación...');
        
        // Aplicar optimizaciones de scroll inmediatamente
        optimizeScrollPerformance();
        
        // Cargar negocios
        loadBusinesses();
        
        console.log('✅ Aplicación inicializada');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
})();
