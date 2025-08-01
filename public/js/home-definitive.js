// SOLUCIÓN DEFINITIVA PARA MOSTRAR IMÁGENES REALES DE GOOGLE MY BUSINESS
// Esta solución reemplaza completamente cualquier contenido existente

console.log('🚀 INICIANDO SOLUCIÓN DEFINITIVA - Yo Compro Acacías');

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
            
            const businesses = data.businesses || data;
            
            if (!businesses || businesses.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ff6b6b;">❌ No se encontraron negocios</div>';
                return;
            }
            
            // PASO 3: RENDERIZAR NEGOCIOS CON IMÁGENES REALES
            renderBusinessesWithRealImages(businesses, container);
        })
        .catch(error => {
            console.error('❌ Error cargando negocios:', error);
            container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #ff6b6b;">❌ Error cargando negocios: ' + error.message + '</div>';
        });
});

// VARIABLES DE PAGINACIÓN
let currentPage = 1;
const businessesPerPage = 12;
let allBusinesses = [];

// ELIMINAR DUPLICADOS
function removeDuplicateBusinesses(businesses) {
    console.log('🔍 Verificando duplicados en ' + businesses.length + ' negocios...');
    
    const seen = new Set();
    const uniqueBusinesses = [];
    let duplicatesFound = 0;
    
    businesses.forEach(business => {
        // Crear clave única basada en nombre y dirección
        const name = (business.nombre_negocio || business.name || '').toLowerCase().trim();
        const address = (business.direccion || business.address || '').toLowerCase().trim();
        const uniqueKey = name + '|' + address;
        
        if (!seen.has(uniqueKey) && name) {
            seen.add(uniqueKey);
            uniqueBusinesses.push(business);
        } else {
            duplicatesFound++;
            console.log('❌ Duplicado eliminado: ' + name);
        }
    });
    
    console.log('🧩 Duplicados eliminados: ' + duplicatesFound);
    console.log('✅ Negocios únicos: ' + uniqueBusinesses.length);
    
    return uniqueBusinesses;
}

// RENDERIZAR NEGOCIOS CON PAGINACIÓN
function renderBusinessesOptimized(businesses, container) {
    console.log('🚀 Iniciando renderizado optimizado de ' + businesses.length + ' negocios');
    
    // Eliminar duplicados antes de renderizar
    const uniqueBusinesses = removeDuplicateBusinesses(businesses);
    
    // Guardar todos los negocios para paginación
    allBusinesses = uniqueBusinesses;
    
    // Renderizar primera página
    renderPage(1, container);
}

// RENDERIZAR PÁGINA ESPECÍFICA
function renderPage(pageNumber, container) {
    console.log('📄 Renderizando página ' + pageNumber);
    
    currentPage = pageNumber;
    const startIndex = (pageNumber - 1) * businessesPerPage;
    const endIndex = startIndex + businessesPerPage;
    const pageBusinesses = allBusinesses.slice(startIndex, endIndex);
    
    let businessesWithImages = 0;
    let businessesWithoutImages = 0;
    
    const businessHTML = pageBusinesses.map(business => {
        const id = business.business_id || business.id || 'unknown';
        const name = business.nombre_negocio || business.name || 'Negocio Local';
        const category = business.categoria_principal || business.categoria || 'General';
        const address = business.direccion || business.address || 'Acacías, Meta';
        const rating = business.calificacion_promedio || '';
        
        // EXTRAER IMAGEN REAL DE GOOGLE MY BUSINESS
        let imageHTML = '';
        let hasRealImage = false;
        
        // SOLUCIÓN ROBUSTA PARA DETECTAR IMÁGENES REALES
        if (business.imagenes && business.imagenes !== 'null' && business.imagenes !== null) {
            try {
                let imageUrl = null;
                let rawData = business.imagenes;
                
                console.log('🔍 Procesando imágenes para ' + name + ':', typeof rawData);
                
                // MÚLTIPLES ESTRATEGIAS DE PARSING
                if (typeof rawData === 'string') {
                    // Estrategia 1: Buscar URL directamente en el string
                    const urlMatch = rawData.match(/https:\/\/maps\.googleapis\.com[^"\\]*/g);
                    if (urlMatch && urlMatch[0]) {
                        imageUrl = urlMatch[0];
                        console.log('🎯 URL encontrada por regex: ' + imageUrl.substring(0, 50) + '...');
                    } else {
                        // Estrategia 2: Parsing JSON progresivo
                        let cleanData = rawData;
                        
                        // Remover comillas externas
                        if (cleanData.startsWith('"') && cleanData.endsWith('"')) {
                            cleanData = cleanData.slice(1, -1);
                        }
                        
                        // Intentar parsear JSON
                        try {
                            const parsed = JSON.parse(cleanData);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                const firstImg = parsed[0];
                                imageUrl = typeof firstImg === 'object' ? firstImg.url : firstImg;
                                console.log('🎯 URL encontrada por JSON: ' + (imageUrl ? imageUrl.substring(0, 50) + '...' : 'null'));
                            }
                        } catch (jsonError) {
                            console.log('⚠️ JSON parse falló, usando regex como fallback');
                        }
                    }
                } else if (Array.isArray(rawData) && rawData.length > 0) {
                    // Ya es array
                    const firstImg = rawData[0];
                    imageUrl = typeof firstImg === 'object' ? firstImg.url : firstImg;
                    console.log('🎯 URL encontrada en array: ' + (imageUrl ? imageUrl.substring(0, 50) + '...' : 'null'));
                }
                
                // Si encontramos una URL válida, usarla
                if (imageUrl && (imageUrl.includes('googleapis.com') || imageUrl.startsWith('http'))) {
                    hasRealImage = true;
                    businessesWithImages++;
                    console.log('✅ ' + name + ': IMAGEN REAL APLICADA');
                    
                    imageHTML = `
                        <div style="width: 100%; height: 200px; overflow: hidden; border-radius: 12px 12px 0 0; background: #f0f0f0; position: relative;">
                            <img src="${imageUrl}" 
                                 alt="${name}" 
                                 style="width: 100%; height: 100%; object-fit: cover; display: block; position: absolute; top: 0; left: 0;"
                                 onload="console.log('✅ Imagen cargada exitosamente: ${name}')"
                                 onerror="this.parentElement.innerHTML='<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;background:linear-gradient(135deg,#10b981,#059669);color:white;font-size:2rem;&quot;>🏪</div>';">
                        </div>`;
                } else {
                    console.log('❌ ' + name + ': No se pudo extraer URL válida');
                }
            } catch (e) {
                console.error('❌ Error procesando imágenes para ' + name + ':', e);
                console.log('🔍 Datos raw completos:', business.imagenes);
            }
        }
        
        // Si no hay imagen real, usar fallback CON FONDO VERDE
        if (!hasRealImage) {
            businessesWithoutImages++;
            console.log('🟢 ' + name + ': Aplicando fondo VERDE (sin morado)');
            imageHTML = `
                <div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-size: 2.5rem; border-radius: 12px 12px 0 0;">
                    🏪
                </div>`;
        }
        
        return `
            <div style="background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; height: 320px; display: flex; flex-direction: column;"
                 onclick="window.location.href='/negocio/${id}'"
                 onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';">
                ${imageHTML}
                <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                    <h3 style="margin: 0 0 8px 0; font-size: 1.2rem; font-weight: 600; color: #333; line-height: 1.3;">${name}</h3>
                    <p style="margin: 0 0 6px 0; color: #666; font-size: 0.9rem; font-weight: 500;">${category}</p>
                    <p style="margin: 0 0 12px 0; color: #888; font-size: 0.85rem; flex: 1; line-height: 1.4;">📍 ${address}</p>
                    ${rating ? `<div style="color: #f39c12; font-size: 0.9rem; font-weight: 500;">⭐ ${rating}</div>` : '<div style="color: #ddd; font-size: 0.9rem;">⭐⭐⭐⭐⭐</div>'}
                </div>
            </div>`;
    }).join('');
    
    // APLICAR ESTILOS DE GRID OPTIMIZADOS
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    container.style.gap = '24px';
    container.style.padding = '20px 0';
    
    // INSERTAR HTML GENERADO
    container.innerHTML = businessHTML;
    
    // AGREGAR CONTROLES DE PAGINACIÓN
    addPaginationControls(container);
    
    // MOSTRAR ESTADÍSTICAS
    console.log('📊 ESTADÍSTICAS DE RENDERIZADO:');
    console.log('✅ Negocios con imágenes reales:', businessesWithImages);
    console.log('🏪 Negocios con fallback:', businessesWithoutImages);
    console.log('📋 Total en página:', pageBusinesses.length);
    console.log('📄 Página actual:', currentPage + ' de ' + Math.ceil(allBusinesses.length / businessesPerPage));
    console.log('🎉 RENDERIZADO COMPLETADO EXITOSAMENTE');
}

// AGREGAR CONTROLES DE PAGINACIÓN
function addPaginationControls(container) {
    const totalPages = Math.ceil(allBusinesses.length / businessesPerPage);
    
    if (totalPages <= 1) return; // No mostrar paginación si solo hay 1 página
    
    // LIMPIAR CONTROLES ANTERIORES
    const existingPagination = container.parentElement.querySelector('.pagination-controls');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // Crear contenedor de paginación
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-controls';
    paginationContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        margin: 40px 0 20px 0;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    
    // Botón anterior
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '← Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.style.cssText = `
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        background: ${currentPage === 1 ? '#e5e7eb' : '#3b82f6'};
        color: ${currentPage === 1 ? '#9ca3af' : 'white'};
        font-weight: 600;
        cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
        transition: all 0.2s ease;
    `;
    
    if (currentPage > 1) {
        prevButton.onmouseover = () => prevButton.style.background = '#2563eb';
        prevButton.onmouseout = () => prevButton.style.background = '#3b82f6';
        prevButton.onclick = () => {
            renderPage(currentPage - 1, container);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
    
    // Información de página
    const pageInfo = document.createElement('span');
    pageInfo.innerHTML = `Página ${currentPage} de ${totalPages} (${allBusinesses.length} negocios)`;
    pageInfo.style.cssText = `
        font-weight: 600;
        color: #374151;
        margin: 0 16px;
        font-size: 0.95rem;
    `;
    
    // Botón siguiente
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Siguiente →';
    nextButton.disabled = currentPage === totalPages;
    nextButton.style.cssText = `
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        background: ${currentPage === totalPages ? '#e5e7eb' : '#3b82f6'};
        color: ${currentPage === totalPages ? '#9ca3af' : 'white'};
        font-weight: 600;
        cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
        transition: all 0.2s ease;
    `;
    
    if (currentPage < totalPages) {
        nextButton.onmouseover = () => nextButton.style.background = '#2563eb';
        nextButton.onmouseout = () => nextButton.style.background = '#3b82f6';
        nextButton.onclick = () => {
            renderPage(currentPage + 1, container);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
    
    // Agregar elementos al contenedor
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextButton);
    
    // Insertar después del grid de negocios
    container.parentElement.insertBefore(paginationContainer, container.nextSibling);
}

// ACTUALIZAR FUNCIÓN PRINCIPAL PARA USAR PAGINACIÓN
function renderBusinessesWithRealImages(businesses, container) {
    console.log('🎨 Iniciando renderizado con paginación...');
    renderBusinessesOptimized(businesses, container);
}

console.log('✅ Script definitivo con paginación cargado y listo');
