// Simple Business Landing Page JavaScript - Optimized for immediate execution

let businessData = null;
let businessId = null;

// Initialize immediately when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando business page simple...');
    initBusinessPage();
});

function initBusinessPage() {
    // Get business ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    businessId = parseInt(urlParams.get('id'));
    
    console.log(`🎯 Business ID: ${businessId}`);
    
    if (!businessId) {
        showError('ID de negocio no válido');
        return;
    }
    
    // Load business data
    loadBusinessData();
}

async function loadBusinessData() {
    try {
        console.log(`📊 Cargando datos para negocio ID: ${businessId}`);
        
        // First try embedded data for immediate rendering
        if (typeof EMBEDDED_BUSINESSES !== 'undefined' && EMBEDDED_BUSINESSES.length > 0) {
            const embeddedBusiness = EMBEDDED_BUSINESSES.find(b => parseInt(b.id) === businessId);
            if (embeddedBusiness) {
                console.log(`✅ Usando datos embebidos para: ${embeddedBusiness.nombre_negocio}`);
                businessData = embeddedBusiness;
                renderBusiness(embeddedBusiness);
                return;
            }
        }
        
        // Fetch with shorter timeout as fallback
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/.netlify/functions/businesses-real', {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 Datos recibidos del backend:', data);
        
        if (!data.success || !Array.isArray(data.data)) {
            throw new Error('Formato de respuesta inválido');
        }
        
        // Find business by ID
        const business = data.data.find(b => parseInt(b.id) === businessId);
        
        if (!business) {
            console.error(`❌ Negocio con ID ${businessId} no encontrado en backend`);
            throw new Error(`Negocio con ID ${businessId} no encontrado`);
        }
        
        console.log(`✅ Negocio encontrado en backend: ${business.nombre_negocio}`);
        businessData = business;
        
        // Render business data
        renderBusiness(business);
        
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        
        // Final fallback to static data
        const staticBusinesses = [
            {
                id: 1,
                nombre_negocio: "Fábrica de arepas el buen sabor llanero",
                categoria: "Restaurante",
                direccion: "Cra. 18 #N° 17-45, Acacías, Meta",
                telefono: "311 8117545",
                website: "",
                horarios: "Lunes a Domingo: 6:00 AM - 8:00 PM",
                calificacion: 5.0,
                imagenes: JSON.stringify([
                    "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpeo5PSqPMOjFRKidta9lXKbaXgkTNev6ZUsOHT5gxx-xbBhx2wPntodE7KyJlUdwF-eYaMzMaWWXiTXx1sIeA8UUZlkLPMi_pP4I7QVLmU-x8Hyo-t4QGipr_AzmWyWxnUNi_6ll9ASLphrzQoosIrdPDJM9e5DsHrgtuFz2YuQelgGzJmhSAIMJuhhxlSnJNA9uvsX2wxvwiMeaEmpNL15jlzuJBqb76ha7BGAqLFqxQTyumU4ijNoNDdt5kxI0zIfwXtf-oj-xTAc0pYdv6dbctZCmWr7Z5yHOKlfq-zJPg&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800",
                    "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpf-iywcpBL-RvS6Wu5B-2ZKAF0LCfciL29LVon_8Mi-ibvpJtkPXY0nIPBihRBvbmXxKFQL18PSXskhcZ4S-CSH0-npaFvdB5LN8_or3tXbDR20HosI_Veupg1slqDCwb_l7XOY1efJ45EZw7d4MrjnFGxC0A8pZl3CJ99N-IM-gz4uEgTn7aXilqryM-pHFQQQu1exm9XzuSnAdKtlCAlUW4Mx6k00AxFsO5nmzKooyjwyD_ya95XDvKO-ARmtw2emXF_25EaWMR01qilrtfRrQwlVQoRgBHVwIG1PFeSvRDly1g0CED2bwviyL-sX9iUTIQNOFQerS9fSUDRfa7aHQYSr4C8gUtYdOx6jJnm4HuzHlpuTumAZjYXND6HOy6ySVZNK0xQG9NbI6_HLQJDhqVTPmW6I6RZNhSipCRpIz1RF&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800",
                    "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpd65RJTxlN5hOjP5IksEK3L1MDdUefU1AkdsVceseYmbqFxv7-Oq0aJa9H3XcFNViSto419DnDiy_T40dTK1VcRyGyZWc0vEX7pfyFEY1PNt539fuks_wVnAwVemWBsr25AYrwQSVscUzSFtInJNGiOtgnyzmblSJSSSfiYnocMCXyDrbkJmEoZZvNJkHBQfpxzAQvY2h8CiqiNE-VhjqsGmvJS7mDnawXn2llw7D-uevJxTmMO_FKmxYRFuIvV8BrchinYDCADYjNSnrTZdiN21Y10Y_ko6tpMutN2Wm83vk3ifQULE6fL18j21CfAqR1DLVllUqJ1GnXsH2ZAKwNEmbt2ChxJpAUHryvK1I_E4YTMbfd8JHsduaoFO-GULC3L_UI7MpNnGn9S3wC6qcd2J9cmjgLn6obAXd-ucHc0zU_6&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800"
                ]),
                descripcion: "Deliciosas arepas tradicionales llaneras hechas con ingredientes frescos y auténticos sabores de la región."
            },
            {
                id: 2,
                nombre_negocio: "Restaurante El Sabor Llanero",
                categoria: "Restaurante",
                direccion: "Calle 15 #12-34, Acacías, Meta",
                telefono: "320 4567890",
                website: "",
                horarios: "Lunes a Domingo: 11:00 AM - 10:00 PM",
                calificacion: 4.5,
                imagenes: JSON.stringify([
                    "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpeo5PSqPMOjFRKidta9lXKbaXgkTNev6ZUsOHT5gxx-xbBhx2wPntodE7KyJlUdwF-eYaMzMaWWXiTXx1sIeA8UUZlkLPMi_pP4I7QVLmU-x8Hyo-t4QGipr_AzmWyWxnUNi_6ll9ASLphrzQoosIrdPDJM9e5DsHrgtuFz2YuQelgGzJmhSAIMJuhhxlSnJNA9uvsX2wxvwiMeaEmpNL15jlzuJBqb76ha7BGAqLFqxQTyumU4ijNoNDdt5kxI0zIfwXtf-oj-xTAc0pYdv6dbctZCmWr7Z5yHOKlfq-zJPg&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800",
                    "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpf-iywcpBL-RvS6Wu5B-2ZKAF0LCfciL29LVon_8Mi-ibvpJtkPXY0nIPBihRBvbmXxKFQL18PSXskhcZ4S-CSH0-npaFvdB5LN8_or3tXbDR20HosI_Veupg1slqDCwb_l7XOY1efJ45EZw7d4MrjnFGxC0A8pZl3CJ99N-IM-gz4uEgTn7aXilqryM-pHFQQQu1exm9XzuSnAdKtlCAlUW4Mx6k00AxFsO5nmzKooyjwyD_ya95XDvKO-ARmtw2emXF_25EaWMR01qilrtfRrQwlVQoRgBHVwIG1PFeSvRDly1g0CED2bwviyL-sX9iUTIQNOFQerS9fSUDRfa7aHQYSr4C8gUtYdOx6jJnm4HuzHlpuTumAZjYXND6HOy6ySVZNK0xQG9NbI6_HLQJDhqVTPmW6I6RZNhSipCRpIz1RF&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800",
                    "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpd65RJTxlN5hOjP5IksEK3L1MDdUefU1AkdsVceseYmbqFxv7-Oq0aJa9H3XcFNViSto419DnDiy_T40dTK1VcRyGyZWc0vEX7pfyFEY1PNt539fuks_wVnAwVemWBsr25AYrwQSVscUzSFtInJNGiOtgnyzmblSJSSSfiYnocMCXyDrbkJmEoZZvNJkHBQfpxzAQvY2h8CiqiNE-VhjqsGmvJS7mDnawXn2llw7D-uevJxTmMO_FKmxYRFuIvV8BrchinYDCADYjNSnrTZdiN21Y10Y_ko6tpMutN2Wm83vk3ifQULE6fL18j21CfAqR1DLVllUqJ1GnXsH2ZAKwNEmbt2ChxJpAUHryvK1I_E4YTMbfd8JHsduaoFO-GULC3L_UI7MpNnGn9S3wC6qcd2J9cmjgLn6obAXd-ucHc0zU_6&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800"
                ]),
                descripcion: "Auténtica comida llanera con los mejores cortes de carne y platos tradicionales de la región."
            }
        ];
        
        const staticBusiness = staticBusinesses.find(b => b.id === businessId);
        
        if (staticBusiness) {
            console.log(`✅ Usando datos estáticos finales para: ${staticBusiness.nombre_negocio}`);
            businessData = staticBusiness;
            renderBusiness(staticBusiness);
        } else {
            showError('Negocio no encontrado');
        }
    }
}

function renderBusiness(business) {
    console.log('🎨 Renderizando negocio...');
    
    try {
        // Update page title
        document.title = `${business.nombre_negocio} - Yo Compro Acacías`;
        
        // Update hero section
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            heroTitle.textContent = business.nombre_negocio;
        }
        
        const heroSubtitle = document.getElementById('heroSubtitle');
        if (heroSubtitle) {
            const category = business.categoria || 'negocio local';
            heroSubtitle.textContent = `Descubre este increíble ${category.toLowerCase()} en Acacías, Meta`;
        }
        
        // Update rating
        const ratingElements = document.querySelectorAll('#businessRating');
        ratingElements.forEach(element => {
            if (element) {
                element.textContent = business.calificacion ? business.calificacion.toFixed(1) : 'N/A';
            }
        });
        
        // Update business name in sections
        const businessNameTitle = document.getElementById('businessNameTitle');
        if (businessNameTitle) {
            businessNameTitle.textContent = business.nombre_negocio.toUpperCase();
        }
        
        // Update address
        const addressElements = document.querySelectorAll('#businessAddress, #businessAddressDetail');
        addressElements.forEach(element => {
            if (element) {
                element.textContent = business.direccion || 'Ubicado en Acacías, Meta';
            }
        });
        
        // Update description
        const descriptionElements = document.querySelectorAll('#businessDescription');
        descriptionElements.forEach(element => {
            if (element) {
                element.textContent = business.descripcion || `${business.nombre_negocio} es un negocio local comprometido con la excelencia.`;
            }
        });
        
        // Update phone
        const businessPhone = document.getElementById('businessPhone');
        const phoneSection = document.getElementById('phoneSection');
        if (business.telefono && business.telefono !== 'Teléfono no disponible') {
            if (businessPhone) businessPhone.textContent = business.telefono;
            if (phoneSection) phoneSection.style.display = 'flex';
        } else {
            if (phoneSection) phoneSection.style.display = 'none';
        }
        
        // Update website
        const businessWebsite = document.getElementById('businessWebsite');
        const websiteSection = document.getElementById('websiteSection');
        if (business.website) {
            if (businessWebsite) {
                businessWebsite.href = business.website;
                businessWebsite.textContent = 'Visitar sitio web';
            }
            if (websiteSection) websiteSection.style.display = 'flex';
        } else {
            if (websiteSection) websiteSection.style.display = 'none';
        }
        
        // Update hours
        const businessHours = document.getElementById('businessHours');
        if (businessHours) {
            businessHours.innerHTML = `<p>${business.horarios || 'Horarios no disponibles'}</p>`;
        }
        
        // Render images
        renderImages(business);
        
        // Setup action buttons
        setupActionButtons(business);
        
        // Hide loading and show content
        hideLoading();
        
        console.log('✅ Renderizado completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error en renderizado:', error);
        showError('Error mostrando información del negocio');
    }
}

function renderImages(business) {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    let images = business.imagenes;
    
    // Parse images if they're in JSON string format
    if (typeof images === 'string') {
        try {
            images = JSON.parse(images);
        } catch (e) {
            console.warn('Error parsing images JSON:', e);
            images = [];
        }
    }
    
    if (images && Array.isArray(images) && images.length > 0) {
        let boxesHTML = '';
        
        for (let i = 0; i < Math.min(3, images.length); i++) {
            const image = images[i];
            
            if (image) {
                boxesHTML += `
                    <div class="image-box" onclick="window.open('${image}', '_blank')">
                        <img src="${image}" 
                             alt="Imagen de ${business.nombre_negocio}" 
                             class="box-image" 
                             loading="lazy"
                             onerror="this.parentElement.classList.add('error');">
                        <div class="image-number">${i + 1}</div>
                    </div>
                `;
            }
        }
        
        carouselTrack.innerHTML = boxesHTML;
        carouselTrack.className = 'image-grid';
        
        // Hide navigation controls for grid layout
        const indicators = document.getElementById('carouselIndicators');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (indicators) indicators.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        // Show gallery section
        const gallery = document.getElementById('businessGallery');
        if (gallery) gallery.style.display = 'block';
    }
}

function setupActionButtons(business) {
    // Main action button
    const mainActionBtn = document.getElementById('mainActionBtn');
    if (mainActionBtn) {
        if (business.telefono && business.telefono !== 'Teléfono no disponible') {
            mainActionBtn.innerHTML = '<i class="fas fa-phone"></i> LLAMAR AHORA';
            mainActionBtn.onclick = () => window.location.href = `tel:${business.telefono}`;
        } else if (business.website) {
            mainActionBtn.innerHTML = '<i class="fas fa-globe"></i> VISITAR SITIO';
            mainActionBtn.onclick = () => window.open(business.website, '_blank');
        } else {
            mainActionBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> VER UBICACIÓN';
            mainActionBtn.onclick = () => openDirections(business.direccion);
        }
    }
    
    // Call button
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        if (business.telefono && business.telefono !== 'Teléfono no disponible') {
            callBtn.style.display = 'block';
            callBtn.onclick = () => window.location.href = `tel:${business.telefono}`;
        } else {
            callBtn.style.display = 'none';
        }
    }
    
    // Website button
    const websiteBtn = document.getElementById('websiteBtn');
    if (websiteBtn) {
        if (business.website) {
            websiteBtn.style.display = 'block';
            websiteBtn.onclick = () => window.open(business.website, '_blank');
        } else {
            websiteBtn.style.display = 'none';
        }
    }
    
    // Directions buttons
    const directionsBtns = document.querySelectorAll('#directionsBtn, #directionsActionBtn');
    directionsBtns.forEach(btn => {
        if (btn) {
            btn.onclick = () => openDirections(business.direccion);
        }
    });
}

function openDirections(address) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}

function hideLoading() {
    const loadingState = document.getElementById('loadingState');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingState) loadingState.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
}

function showError(message) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingState) loadingState.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    if (errorState) errorState.style.display = 'flex';
    
    const errorContent = document.querySelector('.error-content p');
    if (errorContent) errorContent.textContent = message;
    
    console.error(`❌ Mostrando error: ${message}`);
}
