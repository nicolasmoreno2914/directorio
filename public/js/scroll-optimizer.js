// SCROLL OPTIMIZER - Optimización extrema de rendimiento de scroll
(function() {
    'use strict';
    
    // Aplicar optimizaciones inmediatamente
    function applyScrollOptimizations() {
        // 1. Eliminar smooth scroll completamente
        const style = document.createElement('style');
        style.textContent = `
            /* OPTIMIZACIÓN EXTREMA DE SCROLL */
            * {
                scroll-behavior: auto !important;
                -webkit-overflow-scrolling: auto !important;
            }
            
            html, body {
                scroll-behavior: auto !important;
                overscroll-behavior: none;
                -webkit-overflow-scrolling: auto;
            }
            
            /* Optimizar transiciones y animaciones */
            .business-card,
            .category-card,
            .featured-item {
                transition: none !important;
                transform: none !important;
                will-change: auto !important;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
            }
            
            /* Optimizar imágenes para scroll */
            img {
                will-change: auto !important;
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
                image-rendering: optimizeSpeed;
                -webkit-image-rendering: optimizeSpeed;
            }
            
            /* Eliminar hover effects que causan reflow */
            .business-card:hover,
            .category-card:hover {
                transform: none !important;
                transition: none !important;
                animation: none !important;
            }
            
            /* Optimizar contenedores principales */
            .businesses-grid,
            .categories-grid {
                contain: layout style paint;
                will-change: auto;
            }
            
            /* Optimizar elementos que se repiten */
            .business-card {
                contain: layout style paint;
                transform: translateZ(0);
                -webkit-transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
        
        // 2. Optimizar eventos de scroll
        optimizeScrollEvents();
        
        // 3. Aplicar lazy loading inteligente
        applyLazyLoading();
        
        console.log('✅ Optimizaciones de scroll aplicadas');
    }
    
    // Optimizar eventos de scroll con throttling
    function optimizeScrollEvents() {
        let ticking = false;
        
        function updateOnScroll() {
            // Solo ejecutar si es necesario
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }
        
        // Reemplazar cualquier listener de scroll existente
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Aplicar lazy loading inteligente
    function applyLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observar imágenes que se agreguen dinámicamente
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const images = node.querySelectorAll('img[data-src]');
                            images.forEach(img => imageObserver.observe(img));
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Optimizar renderizado de listas grandes
    function optimizeListRendering() {
        const containers = document.querySelectorAll('.businesses-grid, .categories-grid');
        containers.forEach(container => {
            // Aplicar CSS containment para mejor rendimiento
            container.style.contain = 'layout style paint';
            container.style.willChange = 'auto';
        });
    }
    
    // Aplicar optimizaciones cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyScrollOptimizations);
    } else {
        applyScrollOptimizations();
    }
    
    // Aplicar optimizaciones adicionales después de la carga
    window.addEventListener('load', optimizeListRendering);
    
})();
