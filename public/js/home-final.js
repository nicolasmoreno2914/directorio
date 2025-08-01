(function() {
    'use strict';
    
    console.log('🚀 Yo Compro Acacías - Inicializando versión final con imágenes reales');
    
    // OPTIMIZACIÓN DE SCROLL INMEDIATA
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Variables globales
    let isLoading = false;
    
    // FUNCIÓN PRINCIPAL: CARGAR Y RENDERIZAR NEGOCIOS CON IMÁGENES REALES
    async function loadBusinessesWithRealImages() {
        if (isLoading) return;
        isLoading = true;
        
        try {
            console.log('📡 Cargando negocios desde API...');
            const response = await fetch('/api/businesses');
            
            if (!response.ok) {
                throw new Error('Error HTTP: ' + response.status);
            }
            
            const businesses = await response.json();
            console.log('✅ API respondió con ' + businesses.length + ' negocios');
            
            // Verificar que tenemos negocios con imágenes
            const businessesWithImages = businesses.filter(b => b.imagenes && b.imagenes.length > 0);
            console.log('🖼️ Negocios con imágenes reales: ' + businessesWithImages.length);
            
            // Renderizar inmediatamente
            renderBusinessesWithGoogleImages(businesses);
            
        } catch (error) {
            console.error('❌ Error cargando negocios:', error);
            showErrorMessage('Error cargando negocios. Intenta recargar la página.');
        } finally {
            isLoading = false;
        }
    }
    
    // RENDERIZAR NEGOCIOS CON IMÁGENES REALES DE GOOGLE MY BUSINESS
    function renderBusinessesWithGoogleImages(businesses) {
        const container = document.getElementById('allBusinessesGrid');
        if (!container) {
            console.error('❌ Container allBusinessesGrid no encontrado');
            return;
        }
        
        if (!businesses || businesses.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No se encontraron negocios</p>';
            return;
        }
        
        console.log('🎨 Renderizando ' + businesses.length + ' negocios con imágenes reales');
        
        // Crear HTML optimizado
        const htmlParts = [];
        
        businesses.forEach(function(business, index) {
            const businessId = business.business_id || business.id || index;
            const nombre = business.nombre_negocio || business.name || 'Negocio Local';
            const categoria = business.categoria_principal || business.categoria || business.category || 'General';
            const direccion = business.direccion || business.address || 'Acacías, Meta';
            const rating = business.calificacion_promedio || '';
            
            // EXTRAER IMAGEN REAL DE GOOGLE MY BUSINESS
            let imageHTML = '';
            let hasRealImage = false;
            
            if (business.imagenes) {
                let images = business.imagenes;
                
                // Parsear JSON si es string
                if (typeof images === 'string') {
                    try {
                        images = JSON.parse(images);
                    } catch (e) {
                        images = null;
                    }
                }
                
                // Verificar si hay imágenes válidas de Google
                if (Array.isArray(images) && images.length > 0) {
                    const firstImage = images[0];
                    const imageUrl = typeof firstImage === 'object' ? firstImage.url : firstImage;
                    
                    if (imageUrl && imageUrl.includes('googleapis.com')) {
                        hasRealImage = true;
                        console.log('🖼️ ' + nombre + ': Usando imagen real de Google My Business');
                        imageHTML = '<div class="business-image" style="height: 180px; overflow: hidden; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;"><img src="' + imageUrl + '" alt="' + nombre + '" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="eager" onerror="this.style.display=\'none\'; this.parentElement.innerHTML=\'<div style=\\\"display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem;color:white;\\\">🏪</div>\';"></div>';
                    }
                }
            }
            
            // Fallback si no hay imagen real
            if (!hasRealImage) {
                imageHTML = '<div class="business-image" style="height: 180px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-size: 2.5rem; color: white; border-radius: 8px 8px 0 0;">🏪</div>';
            }
            
            htmlParts.push(
                '<div class="business-card" onclick="window.location.href=\'/negocio/' + businessId + '\'" style="cursor: pointer; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; height: 280px; display: flex; flex-direction: column; transition: none !important; transform: none !important; margin-bottom: 1rem;">' +
                    imageHTML +
                    '<div class="business-info" style="padding: 16px; flex: 1; display: flex; flex-direction: column;">' +
                        '<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 600; color: #333; line-height: 1.3;">' + nombre + '</h3>' +
                        '<span class="category" style="color: #666; font-size: 0.9rem; margin-bottom: 4px;">' + categoria + '</span>' +
                        '<p class="location" style="margin: 0 0 8px 0; color: #888; font-size: 0.85rem; flex: 1;">📍 ' + direccion + '</p>' +
                        (rating ? '<div class="rating" style="color: #f39c12; font-size: 0.9rem;">⭐ ' + rating + '</div>' : '<div class="rating" style="color: #f39c12; font-size: 0.9rem;">⭐⭐⭐⭐⭐</div>') +
                    '</div>' +
                '</div>'
            );
        });
        
        // Insertar todo de una vez para máximo rendimiento
        container.innerHTML = htmlParts.join('');
        console.log('✅ ' + businesses.length + ' negocios renderizados exitosamente con imágenes reales de Google My Business');
    }
    
    // MOSTRAR MENSAJE DE ERROR
    function showErrorMessage(message) {
        const container = document.getElementById('allBusinessesGrid');
        if (container) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #ff6b6b; font-size: 1.1rem;">' + message + '</p>';
        }
    }
    
    // INICIALIZAR APLICACIÓN
    function initializeApp() {
        console.log('🎯 Inicializando aplicación...');
        loadBusinessesWithRealImages();
    }
    
    // EJECUTAR CUANDO EL DOM ESTÉ LISTO
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
    console.log('✅ Script final cargado exitosamente');
})();
