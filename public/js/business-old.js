// Ultra-Fast Business Landing Page JavaScript

// Simple function-based approach - optimized for speed
let businessData = null;
let businessId = null;
let isLoading = false;

// Initialize when DOM is ready - with performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Prevent multiple initializations
    if (isLoading) return;
    isLoading = true;
    
    console.log('🚀 Fast init business page...');
    initBusinessPage();
});

function initBusinessPage() {
    // Get business ID from URL
    businessId = getBusinessIdFromUrl();
    
    if (!businessId) {
        showError('ID de negocio no válido');
        return;
    }
    
    console.log(`🎯 Business ID: ${businessId}`);
    
    // Load business data
    loadBusinessData();
}

function getBusinessIdFromUrl() {
    // Leer parámetro 'id' de la URL (?id=valor)
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get('id');
    console.log(`🔍 Extrayendo ID de URL: ${businessId}`);
    return businessId;
}

async function loadBusinessData() {
    try {
        console.log(`📊 Loading business data for: ${businessId}`);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        // Usar endpoint que está funcionando correctamente
        const response = await fetch('/.netlify/functions/businesses-real', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 Datos rápidos recibidos:', data);
        
        if (!data.success || !Array.isArray(data.data)) {
            throw new Error('Formato de respuesta inválido');
        }
        
        // Buscar el negocio específico por ID
        const business = data.data.find(b => b.id == businessId);
        
        if (!business) {
            throw new Error(`Negocio con ID ${businessId} no encontrado`);
        }
        
        console.log(`✅ Negocio encontrado: ${business.nombre_negocio}`);
        console.log(`📸 Tiene imágenes reales: ${business.tiene_imagenes_reales}`);
        console.log(`🏪 Fuente de datos: ${business.fuente_datos}`);
        
        businessData = business;
        
        // Render business data
        renderBusinessData(business);
        
    } catch (error) {
        console.error('❌ Error cargando datos del negocio:', error);
        
        // Fallback a datos estáticos si el endpoint falla
        console.log('🔄 Intentando con datos estáticos de respaldo...');
        
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
                    "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg",
                    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
                    "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg"
                ]),
                visible_en_directorio: 1,
                lat: 3.9889,
                lon: -73.7561,
                descripcion: "Deliciosas arepas tradicionales llaneras hechas con ingredientes frescos y auténticos sabores de la región.",
                google_place_id: "ChIJtest123456789",
                tiene_imagenes_reales: true,
                fuente_datos: "static_fallback"
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
                    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
                    "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg",
                    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg"
                ]),
                visible_en_directorio: 1,
                lat: 3.9889,
                lon: -73.7561,
                descripcion: "Auténtica comida llanera con los mejores cortes de carne y platos tradicionales de la región.",
                google_place_id: "ChIJtest123456790",
                tiene_imagenes_reales: true,
                fuente_datos: "static_fallback"
            }
        ];
        
        const staticBusiness = staticBusinesses.find(b => b.id == businessId);
        
        if (staticBusiness) {
            console.log(`✅ Usando datos estáticos para: ${staticBusiness.nombre_negocio}`);
            businessData = staticBusiness;
            renderBusinessData(staticBusiness);
        } else {
            showError('Negocio no encontrado');
        }
    }
}

function renderBusinessData(business) {
    console.log('🎨 Renderizando datos del negocio...');
    
    // Update page title
    document.title = `${business.nombre_negocio} - Yo Compro Acacías`;
    
    // Update hero section
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.textContent = business.nombre_negocio;
    
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) {
        const category = business.categoria || 'negocio local';
        heroSubtitle.textContent = `Descubre este increíble ${category.toLowerCase()} en Acacías, Meta`;
    }
    
    // Update rating
    const ratingElements = document.querySelectorAll('#businessRating');
    ratingElements.forEach(element => {
        element.textContent = business.calificacion ? business.calificacion.toFixed(1) : 'N/A';
    });
    
    // Update business name in why section
    const businessNameTitle = document.getElementById('businessNameTitle');
    if (businessNameTitle) businessNameTitle.textContent = business.nombre_negocio.toUpperCase();
    
    // Update address
    const addressElements = document.querySelectorAll('#businessAddress, #businessAddressDetail');
    addressElements.forEach(element => {
        element.textContent = business.direccion || 'Ubicado en Acacías, Meta';
    });
    
    // Update description
    const descriptionElements = document.querySelectorAll('#businessDescription');
    descriptionElements.forEach(element => {
        element.textContent = business.descripcion || `${business.nombre_negocio} es un negocio local comprometido con la excelencia.`;
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
    
    console.log('✅ Renderizado completado');
}

function renderImages(business) {
    let images = business.imagenes;
    
    if (typeof images === 'string') {
        try {
            images = JSON.parse(images);
        } catch (e) {
            console.warn('Error parsing images JSON:', e);
            images = [];
        }
    }
    
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    if (images && Array.isArray(images) && images.length > 0) {
        let boxesHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const image = images[i];
            
            if (image) {
                boxesHTML += `
                    <div class="image-box" onclick="window.open('${image}', '_blank')">
                        <img src="${image}" 
                             alt="Imagen de ${business.nombre_negocio}" 
                             class="box-image" 
                             loading="lazy"
                             onerror="this.parentElement.classList.add('error');"
                             onload="console.log('✅ Imagen cargada en caja ${i + 1}');">
                        <div class="image-number">${i + 1}</div>
                    </div>
                `;
            } else {
                boxesHTML += `
                    <div class="image-box empty">
                        <div class="placeholder-content">
                            <div class="placeholder-icon">🏪</div>
                            <div class="placeholder-text">Sin imagen</div>
                        </div>
                        <div class="image-number">${i + 1}</div>
                    </div>
                `;
            }
        }
        
        carouselTrack.innerHTML = boxesHTML;
        carouselTrack.className = 'image-grid';
        
        // Hide navigation controls
        const indicators = document.getElementById('carouselIndicators');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (indicators) indicators.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        document.getElementById('businessGallery').style.display = 'block';
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
            mainActionBtn.onclick = () => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.direccion)}`;
                window.open(url, '_blank');
            };
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
        btn.onclick = () => {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.direccion)}`;
            window.open(url, '_blank');
        };
    });
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
}
