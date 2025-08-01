// SCRIPT PARA APLICAR IMÁGENES REALES Y FONDO VERDE EN MINIATURAS
console.log('🎨 Iniciando corrección de miniaturas...');

// Función para aplicar cambios a las miniaturas
function applyThumbnailFix() {
    const container = document.getElementById('allBusinessesGrid');
    if (!container) {
        console.log('❌ Container no encontrado');
        return;
    }

    // Obtener datos de negocios
    fetch('/api/businesses?page=1&limit=50')
        .then(response => response.json())
        .then(data => {
            if (!data || !data.businesses) {
                console.error('❌ Datos de negocios no válidos:', data);
                return;
            }
            console.log(`✅ Cargando ${data.businesses.length} negocios para miniaturas`);
            
            // Limpiar container
            container.innerHTML = '';
            
            // Crear HTML para cada negocio
            const htmlParts = [];
            
            data.businesses.forEach((business, index) => {
                const businessId = business.business_id || business.id || index;
                const nombre = business.nombre_negocio || business.name || 'Negocio Local';
                const categoria = business.categoria_principal || business.categoria || business.category || 'General';
                const direccion = business.direccion || business.address || 'Acacías, Meta';
                const rating = business.calificacion_promedio || '';
                
                // OBTENER IMAGEN REAL
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
                    
                    // Verificar si hay imágenes válidas
                    if (Array.isArray(images) && images.length > 0) {
                        const firstImage = images[0];
                        const imageUrl = typeof firstImage === 'object' ? firstImage.url : firstImage;
                        
                        if (imageUrl && (imageUrl.includes('googleapis.com') || imageUrl.startsWith('http'))) {
                            hasRealImage = true;
                            console.log('🖼️ ' + nombre + ': Usando imagen real');
                            imageHTML = `
                                <div class="business-image" style="height: 180px; overflow: hidden; border-radius: 12px 12px 0 0;">
                                    <img src="${imageUrl}" alt="${nombre}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy" 
                                    onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, #10b981 0%, #059669 100%)'; this.parentElement.innerHTML='<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem;color:white;&quot;>🏪</div>';" />
                                </div>`;
                        }
                    }
                }
                
                // Fallback con fondo verde si no hay imagen real
                if (!hasRealImage) {
                    console.log('🟢 ' + nombre + ': Usando fondo verde (SIN MORADO)');
                    imageHTML = `
                        <div class="business-image" style="height: 180px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important; font-size: 2.5rem; color: white; border-radius: 12px 12px 0 0;">
                            🏪
                        </div>`;
                }
                
                htmlParts.push(`
                    <div class="business-card" onclick="window.location.href='/negocio/${businessId}'" style="cursor: pointer;">
                        ${imageHTML}
                        <div class="business-info">
                            <h3>${nombre}</h3>
                            <span class="category">${categoria}</span>
                            <p class="location">📍 ${direccion}</p>
                            ${rating ? `<div class="rating">⭐ ${rating}</div>` : '<div class="rating">⭐⭐⭐⭐⭐</div>'}
                        </div>
                    </div>
                `);
            });
            
            // Insertar todo de una vez
            container.innerHTML = htmlParts.join('');
            console.log(`✅ ${data.businesses.length} miniaturas actualizadas con imágenes reales y fondo verde`);
        })
        .catch(error => {
            console.error('❌ Error cargando negocios:', error);
        });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyThumbnailFix);
} else {
    applyThumbnailFix();
}

// También ejecutar después de un breve delay para asegurar que se aplique
setTimeout(applyThumbnailFix, 1000);
