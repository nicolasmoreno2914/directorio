// PROTECCIÓN SSR AGRESIVA Y DEFINITIVA
(function() {
    'use strict';
    
    console.log('🛡️ INICIANDO PROTECCIÓN SSR AGRESIVA...');
    
    // Variables globales de protección
    window.SSR_PROTECTED = false;
    window.SSR_CONTAINER_FROZEN = false;
    
    // Verificar y proteger contenido SSR
    function protectSSRContent() {
        const container = document.getElementById('allBusinessesGrid');
        
        if (container && container.hasAttribute('data-ssr-images')) {
            const ssrCount = container.getAttribute('data-ssr-count');
            console.log(`🎯 SSR DETECTADO: ${ssrCount} negocios con imágenes reales`);
            
            // PROTEGER IMÁGENES <img> ESTÁTICAS ESPECÍFICAMENTE
            const ssrImages = container.querySelectorAll('img.ssr-google-image');
            console.log(`🖼️ PROTEGIENDO ${ssrImages.length} imágenes <img> estáticas`);
            
            ssrImages.forEach((img, index) => {
                const businessName = img.getAttribute('data-business');
                const imageUrl = img.getAttribute('data-ssr-url');
                console.log(`🔒 Protegiendo imagen ${index + 1}: ${businessName}`);
                
                // CONGELAR LA IMAGEN
                Object.freeze(img);
                Object.seal(img);
                
                // PROTEGER ATRIBUTOS CRÍTICOS
                Object.defineProperty(img, 'src', {
                    value: imageUrl,
                    writable: false,
                    configurable: false
                });
                
                Object.defineProperty(img, 'style', {
                    value: img.style,
                    writable: false,
                    configurable: false
                });
            });
            
            // CONGELAR COMPLETAMENTE EL CONTENEDOR
            Object.freeze(container);
            Object.seal(container);
            
            // BLOQUEAR MODIFICACIONES AL DOM
            const originalInnerHTML = container.innerHTML;
            Object.defineProperty(container, 'innerHTML', {
                get: function() { return originalInnerHTML; },
                set: function() { 
                    console.log('🚫 INTENTO DE MODIFICACIÓN BLOQUEADO - Manteniendo SSR');
                    return originalInnerHTML;
                },
                configurable: false
            });
            
            // SOBRESCRIBIR MÉTODOS DE MANIPULACIÓN DOM
            container.appendChild = function() {
                console.log('🚫 appendChild BLOQUEADO - Manteniendo SSR');
                return null;
            };
            
            container.removeChild = function() {
                console.log('🚫 removeChild BLOQUEADO - Manteniendo SSR');
                return null;
            };
            
            container.replaceChild = function() {
                console.log('🚫 replaceChild BLOQUEADO - Manteniendo SSR');
                return null;
            };
            
            // BLOQUEAR FUNCIONES GLOBALES DE RENDERIZADO
            window.renderBusinesses = function() {
                console.log('🛡️ renderBusinesses BLOQUEADO - SSR protegido');
                return;
            };
            
            window.loadBusinesses = function() {
                console.log('🛡️ loadBusinesses BLOQUEADO - SSR protegido');
                return;
            };
            
            // BLOQUEAR FETCH A API DE NEGOCIOS
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
                if (url && url.includes('/api/businesses')) {
                    console.log('🚫 FETCH BLOQUEADO - Manteniendo imágenes SSR');
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({ businesses: [] })
                    });
                }
                return originalFetch.apply(this, arguments);
            };
            
            // MARCAR COMO PROTEGIDO
            window.SSR_PROTECTED = true;
            window.SSR_CONTAINER_FROZEN = true;
            
            console.log('✅ PROTECCIÓN SSR AGRESIVA ACTIVADA');
            console.log('🔒 Contenedor congelado y APIs bloqueadas');
            console.log('🖼️ Imágenes reales de Google My Business preservadas');
            
            return true;
        }
        
        return false;
    }
    
    // EJECUTAR PROTECCIÓN MÚLTIPLES VECES
    function executeProtection() {
        if (!window.SSR_PROTECTED) {
            protectSSRContent();
        }
    }
    
    // PROTECCIÓN INMEDIATA
    executeProtection();
    
    // PROTECCIÓN EN DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeProtection);
    }
    
    // PROTECCIÓN CONTINUA CON MUTATIONOBSERVER
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            executeProtection();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
    
    // PROTECCIÓN CON TIMEOUT (por si acaso)
    setTimeout(executeProtection, 100);
    setTimeout(executeProtection, 500);
    setTimeout(executeProtection, 1000);
    
    console.log('🛡️ Protección SSR agresiva configurada');
    
})();
