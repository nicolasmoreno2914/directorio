// OPTIMIZACIÓN SIMPLE Y EFECTIVA PARA SCROLL FLUIDO
// Este script se ejecuta para eliminar el scroll trabado

(function() {
    'use strict';
    
    // Aplicar optimizaciones de scroll inmediatamente
    function applyScrollOptimizations() {
        // FORZAR SCROLL NATIVO RÁPIDO
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        
        // Crear estilos optimizados para scroll fluido
        const scrollOptimizationStyle = document.createElement('style');
        scrollOptimizationStyle.id = 'scroll-optimization';
        scrollOptimizationStyle.textContent = `
            /* OPTIMIZACIÓN SIMPLE DE SCROLL - ELIMINAR TRABADO */
            * {
                scroll-behavior: auto !important;
            }
            
            /* ELIMINAR TRANSICIONES QUE CAUSAN TRABADO */
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
            
            /* OPTIMIZAR IMÁGENES PARA SCROLL */
            img {
                will-change: auto !important;
                transform: translateZ(0);
            }
            
            /* ELIMINAR ANIMACIONES INNECESARIAS */
            .category-card,
            .featured-item {
                transition: none !important;
                transform: none !important;
                will-change: auto !important;
            }
            
            /* OPTIMIZAR GRIDS PARA SCROLL FLUIDO */
            .businesses-grid,
            .categories-grid {
                contain: layout;
                will-change: auto;
            }
        `;
        
        // Agregar estilos al head
        document.head.appendChild(scrollOptimizationStyle);
        
        console.log('✅ Optimización de scroll aplicada - scroll fluido activado');
    }
    
    // Aplicar optimizaciones cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyScrollOptimizations);
    } else {
        applyScrollOptimizations();
    }
    
    // También aplicar cuando la página esté completamente cargada
    window.addEventListener('load', applyScrollOptimizations);
    
})();
