// ===================================================
// BACKUP COMPLETO - YO COMPRO ACACÍAS
// Fecha: 2025-08-01
// Versión: Con paginación (12 por página) + eliminación de duplicados
// Estado: COMPLETAMENTE FUNCIONAL
// ===================================================

// SOLUCIÓN DEFINITIVA PARA MOSTRAR IMÁGENES REALES DE GOOGLE MY BUSINESS
// Esta solución reemplaza completamente cualquier contenido existente

console.log('🚀 INICIANDO SOLUCIÓN DEFINITIVA - Yo Compro Acacías');

// Variables globales para paginación
let allBusinesses = [];
let currentPage = 1;
const businessesPerPage = 12;

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM cargado, iniciando solución definitiva');
    
    // PASO 1: LIMPIAR COMPLETAMENTE EL CONTENEDOR
    const container = document.getElementById('allBusinessesGrid');
    if (!container) {
        console.error('❌ Container allBusinessesGrid no encontrado');
        return;
    }
    
    // Mostrar mensaje de carga
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">🔄 Cargando negocios con imágenes reales...</div>';
    
    // PASO 2: CARGAR DATOS DESDE LA API
    fetch('/api/businesses')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la API: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ API respondió exitosamente');
            console.log('📊 Total de negocios:', data.businesses ? data.businesses.length : data.length);
            
            const businesses = data.businesses || data.data || data;
            
            if (!businesses || businesses.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ff6b6b;">❌ No se encontraron negocios</div>';
                return;
            }
            
            // PASO 3: RENDERIZAR NEGOCIOS CON IMÁGENES REALES
            renderBusinessesWithRealImages(businesses, container);
        })
        .catch(error => {
            console.error('❌ Error cargando negocios:', error);
            container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #ff6b6b;">❌ Error cargando negocios: ${error.message}</div>`;
        });
});

// ELIMINAR DUPLICADOS
function removeDuplicateBusinesses(businesses) {
    console.log('🔍 Eliminando duplicados...');
    const seen = new Set();
    const unique = [];
    
    for (const business of businesses) {
        // Crear clave única basada en nombre y dirección
        const key = `${business.nombre_negocio?.toLowerCase()?.trim()}-${business.direccion?.toLowerCase()?.trim()}`;
        
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(business);
        } else {
            console.log(`🗑️ Duplicado eliminado: ${business.nombre_negocio}`);
        }
    }
    
    console.log(`✅ Duplicados eliminados: ${businesses.length - unique.length}`);
    console.log(`📊 Negocios únicos: ${unique.length}`);
    
    return unique;
}

// RENDERIZAR NEGOCIOS CON PAGINACIÓN
function renderBusinessesOptimized(businesses, container) {
    console.log('🎨 Renderizando negocios con paginación...');
    
    // Eliminar duplicados
    allBusinesses = removeDuplicateBusinesses(businesses);
    
    // Renderizar primera página
    renderPage(1, container);
}

// RENDERIZAR PÁGINA ESPECÍFICA
function renderPage(pageNumber, container) {
    console.log(`📄 Renderizando página ${pageNumber}`);
    
    currentPage = pageNumber;
    const startIndex = (pageNumber - 1) * businessesPerPage;
    const endIndex = startIndex + businessesPerPage;
    const pageBusinesses = allBusinesses.slice(startIndex, endIndex);
    
    console.log(`📊 Mostrando negocios ${startIndex + 1}-${Math.min(endIndex, allBusinesses.length)} de ${allBusinesses.length}`);
    
    // Generar HTML para los negocios de esta página
    const businessCards = pageBusinesses.map(business => {
        // Procesar imágenes
        let images = [];
        if (business.imagenes) {
            try {
                if (typeof business.imagenes === 'string') {
                    images = JSON.parse(business.imagenes);
                } else if (Array.isArray(business.imagenes)) {
                    images = business.imagenes;
                }
            } catch (e) {
                console.warn('Error parseando imágenes para', business.nombre_negocio, e);
                images = [];
            }
        }
        
        // Usar la primera imagen disponible
        const firstImage = images && images.length > 0 ? images[0] : null;
        let imageHTML = '';
        
        if (firstImage) {
            // Verificar si es una URL válida
            const imageUrl = typeof firstImage === 'object' ? firstImage.url : firstImage;
            if (imageUrl && imageUrl.startsWith('http')) {
                imageHTML = `
                    <img src="${imageUrl}" 
                         alt="${business.nombre_negocio}" 
                         class="business-image" 
                         loading="lazy"
                         onerror="this.style.display='none'; this.parentElement.style.backgroundColor='#4CAF50'; this.parentElement.innerHTML='📍';">
                `;
            }
        }
        
        // Si no hay imagen, usar fondo verde con ícono
        if (!imageHTML) {
            imageHTML = '<div class="business-icon" style="background: linear-gradient(135deg, #10b981, #059669); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; border-radius: 8px;">🏪</div>';
        }
        
        return `
            <div class="business-card" onclick="window.location.href='/negocio/${business.id || business.business_id}'" style="
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 16px;
                background: white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.2s ease;
                height: 100%;
                display: flex;
                flex-direction: column;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)';">
                <div class="business-image-container" style="
                    width: 100%;
                    height: 200px;
                    margin-bottom: 12px;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                ">
                    ${imageHTML}
                </div>
                <div class="business-info" style="flex: 1; display: flex; flex-direction: column;">
                    <h3 class="business-name" style="
                        margin: 0 0 8px 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: #1f2937;
                        line-height: 1.3;
                    ">${business.nombre_negocio}</h3>
                    <p class="business-category" style="
                        margin: 0 0 6px 0;
                        font-size: 14px;
                        color: #6b7280;
                        font-weight: 500;
                    ">${business.categoria || business.categoria_principal || 'Sin categoría'}</p>
                    <p class="business-address" style="
                        margin: 0 0 12px 0;
                        font-size: 13px;
                        color: #9ca3af;
                        line-height: 1.4;
                        flex: 1;
                    ">${business.direccion || 'Dirección no disponible'}</p>
                    ${business.calificacion || business.calificacion_promedio ? `
                        <div class="business-rating" style="
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            margin-top: auto;
                        ">
                            <span class="stars" style="color: #fbbf24; font-size: 14px;">${'⭐'.repeat(Math.floor(business.calificacion || business.calificacion_promedio))}</span>
                            <span class="rating-number" style="font-size: 14px; color: #6b7280; font-weight: 500;">${business.calificacion || business.calificacion_promedio}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Aplicar estilos de grid al contenedor
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    container.style.gap = '20px';
    container.style.padding = '20px 0';
    
    // Insertar HTML
    container.innerHTML = businessCards;
    
    // Agregar controles de paginación
    addPaginationControls(container);
    
    // Scroll al inicio de la sección
    const section = container.closest('.all-businesses-section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    console.log(`✅ Página ${pageNumber} renderizada con ${pageBusinesses.length} negocios`);
}

// AGREGAR CONTROLES DE PAGINACIÓN
function addPaginationControls(container) {
    const totalPages = Math.ceil(allBusinesses.length / businessesPerPage);
    
    if (totalPages <= 1) {
        return; // No mostrar paginación si solo hay una página
    }
    
    const paginationHTML = `
        <div class="pagination-controls" style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
            margin-top: 32px;
            padding: 20px;
        ">
            <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''} style="
                padding: 10px 20px;
                background: ${currentPage === 1 ? '#e5e7eb' : '#3b82f6'};
                color: ${currentPage === 1 ? '#9ca3af' : 'white'};
                border: none;
                border-radius: 8px;
                font-weight: 500;
                cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
                transition: all 0.2s ease;
            " ${currentPage === 1 ? '' : 'onmouseover="this.style.backgroundColor=\'#2563eb\'" onmouseout="this.style.backgroundColor=\'#3b82f6\'"'}>← Anterior</button>
            
            <span style="
                font-size: 14px;
                color: #6b7280;
                font-weight: 500;
            ">Página ${currentPage} de ${totalPages} (${allBusinesses.length} negocios total)</span>
            
            <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''} style="
                padding: 10px 20px;
                background: ${currentPage === totalPages ? '#e5e7eb' : '#3b82f6'};
                color: ${currentPage === totalPages ? '#9ca3af' : 'white'};
                border: none;
                border-radius: 8px;
                font-weight: 500;
                cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
                transition: all 0.2s ease;
            " ${currentPage === totalPages ? '' : 'onmouseover="this.style.backgroundColor=\'#2563eb\'" onmouseout="this.style.backgroundColor=\'#3b82f6\'"'}>Siguiente →</button>
        </div>
    `;
    
    // Agregar paginación después del contenedor
    container.insertAdjacentHTML('afterend', paginationHTML);
    
    // Agregar event listeners
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn && !prevBtn.disabled) {
        prevBtn.addEventListener('click', () => {
            // Remover paginación anterior
            const oldPagination = document.querySelector('.pagination-controls');
            if (oldPagination) oldPagination.remove();
            
            renderPage(currentPage - 1, container);
        });
    }
    
    if (nextBtn && !nextBtn.disabled) {
        nextBtn.addEventListener('click', () => {
            // Remover paginación anterior
            const oldPagination = document.querySelector('.pagination-controls');
            if (oldPagination) oldPagination.remove();
            
            renderPage(currentPage + 1, container);
        });
    }
}

// ACTUALIZAR FUNCIÓN PRINCIPAL PARA USAR PAGINACIÓN
function renderBusinessesWithRealImages(businesses, container) {
    renderBusinessesOptimized(businesses, container);
}

console.log('✅ Script definitivo con paginación cargado y listo');

// ===================================================
// FIN DEL BACKUP COMPLETO
// ===================================================
