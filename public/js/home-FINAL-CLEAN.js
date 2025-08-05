// ===================================================
// SOLUCIÓN DEFINITIVA - YO COMPRO ACACÍAS
// Versión: FINAL CLEAN - Sin duplicación, con paginación
// ===================================================

console.log('🚀 INICIANDO SOLUCIÓN DEFINITIVA FINAL');

// Variables globales
let allBusinesses = [];
let currentPage = 1;
const businessesPerPage = 12;
let isLoading = false;

// Función principal que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM cargado - Iniciando carga de negocios');
    
    // PASO 1: VERIFICAR QUE NO HAY MÚLTIPLES INICIALIZACIONES
    if (window.businessesLoaded) {
        console.log('⚠️ Negocios ya cargados, evitando duplicación');
        return;
    }
    window.businessesLoaded = true;
    
    // PASO 2: OBTENER CONTENEDOR
    const container = document.getElementById('allBusinessesGrid');
    if (!container) {
        console.error('❌ Container allBusinessesGrid no encontrado');
        return;
    }
    
    // PASO 3: LIMPIAR COMPLETAMENTE EL CONTENEDOR
    container.innerHTML = '';
    
    // PASO 4: CARGAR NEGOCIOS
    loadBusinesses();
});

async function loadBusinesses() {
    if (isLoading) {
        console.log('⚠️ Ya hay una carga en progreso');
        return;
    }
    
    isLoading = true;
    const container = document.getElementById('allBusinessesGrid');
    
    try {
        // Mostrar loading
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666; font-size: 1.2rem;">🔄 Cargando negocios...</div>';
        
        console.log('📞 Llamando a /api/businesses...');
        const response = await fetch('/api/businesses');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        
        if (data.success && data.businesses && Array.isArray(data.businesses)) {
            allBusinesses = data.businesses.filter(business => business.visible_en_directorio);
            console.log(`✅ ${allBusinesses.length} negocios cargados`);
            
            // Renderizar primera página
            renderPage(1);
            setupPagination();
            updateCounter();
            
            // Ocultar indicador de carga
            const loadingSpinner = document.getElementById('loadingSpinner');
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
                console.log('✅ Indicador de carga ocultado');
            }
            
        } else {
            throw new Error('Formato de datos inválido');
        }
        
    } catch (error) {
        console.error('❌ Error cargando negocios:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #ff6b6b;">
                <h3>❌ Error al cargar negocios</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔄 Reintentar
                </button>
            </div>
        `;
        
        // Ocultar indicador de carga también en caso de error
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
            console.log('✅ Indicador de carga ocultado (error)');
        }
    } finally {
        isLoading = false;
    }
}

function renderPage(pageNumber) {
    const container = document.getElementById('allBusinessesGrid');
    if (!container) return;
    
    currentPage = pageNumber;
    const startIndex = (pageNumber - 1) * businessesPerPage;
    const endIndex = startIndex + businessesPerPage;
    const businessesToShow = allBusinesses.slice(startIndex, endIndex);
    
    console.log(`📄 Renderizando página ${pageNumber}: ${businessesToShow.length} negocios`);
    
    // LIMPIAR COMPLETAMENTE EL CONTENEDOR
    container.innerHTML = '';
    
    // Crear grid
    businessesToShow.forEach((business, index) => {
        const globalIndex = startIndex + index + 1;
        const businessCard = createBusinessCard(business, globalIndex);
        container.appendChild(businessCard);
    });
    
    console.log(`✅ Página ${pageNumber} renderizada con ${businessesToShow.length} negocios`);
}

function createBusinessCard(business, globalIndex) {
    const card = document.createElement('div');
    card.className = 'business-card';
    card.style.cursor = 'pointer';
    card.onclick = () => window.location.href = `/business.html?id=${business.id}`;
    
    // Procesar imágenes
    let images = [];
    try {
        if (typeof business.imagenes === 'string') {
            images = JSON.parse(business.imagenes);
        } else if (Array.isArray(business.imagenes)) {
            images = business.imagenes;
        }
    } catch (e) {
        console.warn(`⚠️ Error parsing images for ${business.nombre_negocio}:`, e);
    }
    
    const firstImage = images.length > 0 ? images[0] : null;
    const backgroundStyle = firstImage 
        ? `background-image: url('${firstImage}'); background-size: cover; background-position: center;`
        : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';
    
    const fallbackIcon = firstImage ? '' : '🏪';
    const imageCount = images.length > 1 ? `<div class="image-count">${images.length} fotos</div>` : '';
    
    card.innerHTML = `
        <div class="business-image" style="${backgroundStyle}; height: 200px; position: relative; border-radius: 8px 8px 0 0;">
            <div class="business-category" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(0,0,0,0.7); color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem;">
                ${business.categoria}
            </div>
            ${imageCount}
            ${fallbackIcon ? `<div class="fallback-icon" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem;">${fallbackIcon}</div>` : ''}
            <div class="business-number" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.7); color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">
                #${globalIndex}
            </div>
        </div>
        <div class="business-info" style="padding: 1rem;">
            <h3 class="business-name" style="margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 600;">
                ${business.nombre_negocio}
            </h3>
            <p class="business-address" style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem;">
                📍 ${business.direccion}
            </p>
            <div class="business-rating" style="margin: 0 0 0.5rem 0;">
                ${'⭐'.repeat(Math.floor(business.calificacion))}
                <span class="rating-number" style="margin-left: 0.5rem; color: #666; font-size: 0.9rem;">
                    ${business.calificacion}
                </span>
            </div>
            <p class="business-hours" style="margin: 0; color: #666; font-size: 0.9rem;">
                🕰️ ${business.horarios}
            </p>
            ${business.telefono ? `<p class="business-phone" style="margin: 0.5rem 0 0 0; color: #666; font-size: 0.9rem;">📞 ${business.telefono}</p>` : ''}
        </div>
    `;
    
    // Estilos de la tarjeta
    card.style.cssText = `
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
        background: white;
        margin-bottom: 1rem;
    `;
    
    // Hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
    
    return card;
}

function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(allBusinesses.length / businessesPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Botón anterior
    const prevButton = document.createElement('button');
    prevButton.textContent = '« Anterior';
    prevButton.className = 'pagination-btn';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevButton);
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageButton.onclick = () => changePage(i);
        paginationContainer.appendChild(pageButton);
    }
    
    // Botón siguiente
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente »';
    nextButton.className = 'pagination-btn';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextButton);
    
    console.log(`📄 Paginación configurada: ${totalPages} páginas`);
}

function changePage(newPage) {
    const totalPages = Math.ceil(allBusinesses.length / businessesPerPage);
    
    if (newPage < 1 || newPage > totalPages) return;
    
    renderPage(newPage);
    setupPagination();
    updateCounter();
    
    // Scroll al contenedor
    const container = document.getElementById('allBusinessesGrid');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
    }
    
    console.log(`📄 Cambiado a página ${newPage}`);
}

function updateCounter() {
    const counterElement = document.getElementById('businessCounter');
    if (counterElement) {
        const startIndex = (currentPage - 1) * businessesPerPage + 1;
        const endIndex = Math.min(currentPage * businessesPerPage, allBusinesses.length);
        counterElement.textContent = `Mostrando ${startIndex}-${endIndex} de ${allBusinesses.length} negocios`;
    }
}

// Funciones de búsqueda
window.searchBusinesses = function(query) {
    if (!query.trim()) {
        renderPage(1);
        setupPagination();
        updateCounter();
        return;
    }
    
    const filtered = allBusinesses.filter(business => 
        business.nombre_negocio.toLowerCase().includes(query.toLowerCase()) ||
        business.categoria.toLowerCase().includes(query.toLowerCase()) ||
        business.direccion.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log(`🔍 Búsqueda "${query}": ${filtered.length} resultados`);
    
    // Mostrar resultados filtrados temporalmente
    const originalBusinesses = allBusinesses;
    allBusinesses = filtered;
    renderPage(1);
    setupPagination();
    updateCounter();
    
    // Restaurar después de 10 segundos
    setTimeout(() => {
        if (allBusinesses === filtered) {
            allBusinesses = originalBusinesses;
            renderPage(1);
            setupPagination();
            updateCounter();
        }
    }, 10000);
};

console.log('✅ Script FINAL CLEAN cargado correctamente');
