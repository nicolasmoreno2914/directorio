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
        console.error('❌ No business ID found in URL');
        showError('ID de negocio no válido');
        return;
    }
    
    console.log(`🏷️ Business ID: ${businessId}`);
    
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
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        // Primero obtener todos los negocios con datos reales
        const response = await fetch('/.netlify/functions/businesses-real', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 Datos reales recibidos:', data);
        
        if (!data.success || !Array.isArray(data.data)) {
            throw new Error('Formato de datos inválido');
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
        renderBusinessInfo();
        hideLoading();
        
        // Generate QR in background (non-blocking)
        setTimeout(() => generateQRCode(), 100);
        
    } catch (error) {
        console.error('❌ Error loading business:', error);
        showError('Error cargando la información del negocio');
    } finally {
        isLoading = false;
    }
}

function renderBusinessInfo() {
    if (!businessData) {
        console.error('❌ No business data to render');
        return;
    }
    
    console.log('🎨 Rendering modern business info...');
    
    // Update page title
    document.title = `${businessData.nombre_negocio} - Yo Compro Acacías`;
    
    // Update hero section
    updateHeroSection();
    
    // Update stats section
    updateStatsSection();
    
    // Update why section
    updateWhySection();
    
    // Update contact details
    updateContactDetails();
    
    // Update business hours
    updateBusinessHours();
    
    // Update social media links
    updateSocialMediaLinks();
    
    // Renderizar imágenes en el nuevo carrusel elegante
    let images = businessData.imagenes;
    
    // Si las imágenes están como string JSON, parsearlas (puede estar doblemente escapado)
    if (typeof images === 'string') {
        try {
            // Primer parse
            images = JSON.parse(images);
            
            // Si sigue siendo string, hacer segundo parse (doble escape)
            if (typeof images === 'string') {
                images = JSON.parse(images);
            }
            
            console.log('✅ Imágenes parseadas correctamente:', images.length, 'imágenes');
        } catch (e) {
            console.error('Error parsing images JSON:', e);
            images = [];
        }
    }
    
    // Siempre mostrar el carrusel, incluso si no hay imágenes
    if (images && Array.isArray(images) && images.length > 0) {
        renderBusinessImages(images);
    } else {
        // Mostrar carrusel vacío o con imagen placeholder
        showEmptyCarousel();
    }
    
    // Setup action buttons
    setupActionButtons();
    
    console.log('✅ Modern business info rendered successfully');
}

function updateHeroSection() {
    // Update hero title
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        heroTitle.textContent = businessData.nombre_negocio;
    }
    
    // Update hero subtitle
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) {
        const category = businessData.categoria_principal || 'negocio local';
        heroSubtitle.textContent = `Descubre este increíble ${category.toLowerCase()} en Acacías, Meta`;
    }
    
    // Update business logo based on category
    const businessLogo = document.getElementById('businessLogo');
    if (businessLogo) {
        const icon = getCategoryIcon(businessData.categoria_principal);
        businessLogo.innerHTML = `<i class="${icon}"></i>`;
    }
}

function updateStatsSection() {
    // Update rating
    const ratingElements = document.querySelectorAll('#businessRating');
    ratingElements.forEach(element => {
        const rating = businessData.calificacion_promedio;
        element.textContent = rating && rating > 0 ? rating.toFixed(1) : 'N/A';
    });
    
    // Update reviews count
    const reviewElements = document.querySelectorAll('#businessReviews');
    reviewElements.forEach(element => {
        const count = businessData.total_resenas || 0;
        element.textContent = count.toString();
    });
}

function updateWhySection() {
    // Update business name in title
    const businessNameTitle = document.getElementById('businessNameTitle');
    if (businessNameTitle) {
        businessNameTitle.textContent = businessData.nombre_negocio.toUpperCase();
    }
    
    // Update address in why section
    const addressElements = document.querySelectorAll('#businessAddress');
    addressElements.forEach(element => {
        element.textContent = businessData.direccion || 'Ubicado en Acacías, Meta';
    });
    
    // Update description in why section
    const descriptionElements = document.querySelectorAll('#businessDescription');
    descriptionElements.forEach(element => {
        const description = businessData.descripcion || 
            `${businessData.nombre_negocio} es un negocio local comprometido con la excelencia en productos y servicios.`;
        element.textContent = description;
    });
}

function updateContactDetails() {
    // Update detailed address
    const businessAddressDetail = document.getElementById('businessAddressDetail');
    if (businessAddressDetail) {
        businessAddressDetail.textContent = businessData.direccion || 'Dirección no disponible';
    }
    
    // Update phone
    const businessPhone = document.getElementById('businessPhone');
    const phoneSection = document.getElementById('phoneSection');
    if (businessData.telefono) {
        if (businessPhone) businessPhone.textContent = businessData.telefono;
        if (phoneSection) phoneSection.style.display = 'flex';
    } else {
        if (phoneSection) phoneSection.style.display = 'none';
    }
    
    // Update website
    const businessWebsite = document.getElementById('businessWebsite');
    const websiteSection = document.getElementById('websiteSection');
    if (businessData.website) {
        if (businessWebsite) {
            businessWebsite.href = businessData.website;
            businessWebsite.textContent = 'Visitar sitio web';
        }
        if (websiteSection) websiteSection.style.display = 'flex';
    } else {
        if (websiteSection) websiteSection.style.display = 'none';
    }
}

function updateBusinessHours() {
    const businessHours = document.getElementById('businessHours');
    if (businessHours) {
        if (businessData.horarios) {
            if (typeof businessData.horarios === 'string') {
                businessHours.innerHTML = `<p>${businessData.horarios}</p>`;
            } else {
                businessHours.innerHTML = '<p>Horarios disponibles - Consultar directamente</p>';
            }
        } else {
            businessHours.innerHTML = '<p>Horarios no disponibles - Contactar para más información</p>';
        }
    }
}

function renderBusinessImages(images) {
    console.log('🎯 Renderizando SOLO imágenes reales del negocio:', images);
    
    // Verificar si el negocio tiene imágenes reales
    const hasRealImages = businessData.tiene_imagenes_reales || false;
    
    if (!hasRealImages || !images || images.length === 0) {
        console.log('🟢 Sin imágenes reales - Mostrando placeholder');
        showEmptyCarousel();
        return;
    }
    
    // Procesar solo imágenes reales (no genéricas)
    let validImages = [];
    
    try {
        // Si images es un string JSON, parsearlo
        let imageArray = images;
        if (typeof images === 'string') {
            imageArray = JSON.parse(images);
        }
        
        // Procesar solo URLs reales del negocio
        validImages = imageArray.filter(imgUrl => {
            if (typeof imgUrl !== 'string' || !imgUrl.startsWith('http')) {
                console.warn('⚠️ URL de imagen inválida:', imgUrl);
                return false;
            }
            return true;
        }).map(imgUrl => {
            let processedUrl = imgUrl;
            
            // Si es imagen de Google Maps/My Business, usar proxy
            if (imgUrl.includes('googleapis.com') || imgUrl.includes('maps.googleapis.com')) {
                processedUrl = `/.netlify/functions/image-proxy?url=${encodeURIComponent(imgUrl)}`;
                console.log('📸 Imagen real de Google My Business procesada');
            }
            
            return {
                url: processedUrl,
                originalUrl: imgUrl,
                alt: `Imagen real de ${businessData.nombre_negocio}`
            };
        });
        
    } catch (e) {
        console.error('❌ Error procesando imágenes reales:', e);
        showEmptyCarousel();
        return;
    }
    
    console.log(`✅ ${validImages.length} imágenes válidas procesadas`);
    
    if (validImages.length === 0) {
        showEmptyCarousel();
        return;
    }
    
    // Priorizar imágenes de Google My Business
    const prioritizedImages = validImages.sort((a, b) => {
        if (a.source === 'google_my_business' && b.source !== 'google_my_business') return -1;
        if (b.source === 'google_my_business' && a.source !== 'google_my_business') return 1;
        return 0;
    });
    
    console.log(`✅ Mostrando TODAS las ${prioritizedImages.length} imágenes en carrusel de 3 por slide`);
    
    // Variables globales para el carrusel
    totalImages = prioritizedImages.length;
    imagesPerSlide = 3;
    totalSlides = Math.ceil(totalImages / imagesPerSlide);
    currentSlide = 0;
    
    // Generar slides con 3 imágenes cada uno
    const carouselTrack = document.getElementById('carouselTrack');
    let slidesHTML = '';
    
    for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
        const startIndex = slideIndex * imagesPerSlide;
        const endIndex = Math.min(startIndex + imagesPerSlide, totalImages);
        const slideImages = prioritizedImages.slice(startIndex, endIndex);
        
        let slideHTML = '<div class="carousel-slide">';
        
        slideImages.forEach((image, index) => {
            const globalIndex = startIndex + index;
            console.log(`🖼️ Procesando imagen ${globalIndex + 1}:`, image.url);
            
            slideHTML += `
                <div class="carousel-item" onclick="openImageModal('${image.url}', '${image.alt || 'Imagen del negocio'}')">
                    <img src="${image.url}" 
                         alt="${image.alt || 'Imagen del negocio'}" 
                         class="carousel-image" 
                         loading="lazy"
                         crossorigin="anonymous"
                         referrerpolicy="no-referrer-when-downgrade"
                         onerror="console.error('Error cargando imagen:', this.src); this.style.display='none';"
                         onload="console.log('✅ Imagen cargada:', this.src);">
                    <div class="image-counter">${globalIndex + 1}/${totalImages}</div>
                </div>
            `;
        });
        
        // Rellenar con espacios vacíos si es necesario
        while (slideImages.length < imagesPerSlide && slideIndex < totalSlides - 1) {
            slideHTML += '<div class="carousel-item" style="visibility: hidden;"></div>';
            slideImages.push(null);
        }
        
        slideHTML += '</div>';
        slidesHTML += slideHTML;
    }
    
    carouselTrack.innerHTML = slidesHTML;
    
    // El ancho del track se maneja desde CSS (400% para 4 slides)
    
    // Generar indicadores basados en slides
    const indicatorsHTML = Array.from({length: totalSlides}, (_, index) => {
        return `<div class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>`;
    }).join('');
    
    document.getElementById('carouselIndicators').innerHTML = indicatorsHTML;
    
    // Mostrar la galería
    document.getElementById('businessGallery').style.display = 'block';
    
    // Inicializar carrusel
    initializeCarousel(totalImages);
    
    console.log(`✅ Carrusel inicializado con ${totalSlides} slides de 3 imágenes cada uno`);
}

function getCategoryIcon(category) {
    const icons = {
        'Comida': 'fas fa-utensils',
        'Restaurante': 'fas fa-utensils',
        'Belleza': 'fas fa-cut',
        'Salud': 'fas fa-heartbeat',
        'Servicios': 'fas fa-cogs',
        'Tecnología': 'fas fa-laptop',
        'Educación': 'fas fa-graduation-cap',
        'Deportes': 'fas fa-dumbbell',
        'Ropa': 'fas fa-tshirt',
        'Hogar': 'fas fa-home',
        'Automotriz': 'fas fa-car',
        'Finanzas': 'fas fa-university',
        'Entretenimiento': 'fas fa-film'
    };
    
    return icons[category] || 'fas fa-store';
}

// FUNCIONES DEL CARRUSEL DE IMÁGENES REMOVIDAS - IMPLEMENTADAS AL FINAL DEL ARCHIVO

// OPTIMIZACIONES CRÍTICAS DE SCROLL PARA LANDING PAGES

// Optimizar scroll con throttling y passive listeners
function optimizeBusinessPageScroll() {
    // Deshabilitar scroll smooth temporal durante interacciones rápidas
    let isScrolling = false;
    let scrollTimeout;
    
    const handleScroll = () => {
        if (!isScrolling) {
            // Deshabilitar temporalmente smooth scroll durante scroll rápido
            document.documentElement.style.scrollBehavior = 'auto';
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Rehabilitar smooth scroll cuando termine
            document.documentElement.style.scrollBehavior = 'smooth';
            isScrolling = false;
        }, 150);
    };
    
    // Event listener pasivo para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optimizar wheel events para prevenir conflictos
    window.addEventListener('wheel', (e) => {
        // Prevenir comportamientos extraños de scroll
        if (Math.abs(e.deltaY) < 5) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Responsive: ajustar carrusel en cambio de tamaño de ventana (throttled)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const newImagesPerSlide = window.innerWidth <= 768 ? 1 : 3;
        if (newImagesPerSlide !== imagesPerSlide) {
            imagesPerSlide = newImagesPerSlide;
            const carouselTrack = document.getElementById('carouselTrack');
            if (carouselTrack) {
                const totalImages = carouselTrack.children.length;
                initializeCarousel(totalImages);
            }
        }
    }, 100); // Throttle resize events
}, { passive: true });

// Inicializar optimizaciones de scroll cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    optimizeBusinessPageScroll();
    console.log('✅ Optimizaciones de scroll para landing page activadas');
});

function setupActionButtons() {
    // Main action button (call or website)
    const mainActionBtn = document.getElementById('mainActionBtn');
    if (mainActionBtn) {
        if (businessData.telefono) {
            mainActionBtn.innerHTML = '<i class="fas fa-phone"></i> LLAMAR AHORA';
            mainActionBtn.onclick = () => callBusiness(businessData.telefono);
        } else if (businessData.website) {
            mainActionBtn.innerHTML = '<i class="fas fa-globe"></i> VISITAR SITIO';
            mainActionBtn.onclick = () => visitWebsite(businessData.website);
        } else {
            mainActionBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> VER UBICACIÓN';
            mainActionBtn.onclick = () => getDirections(businessData.lat, businessData.lng, businessData.direccion);
        }
    }
    
    // Directions buttons
    const directionsBtns = document.querySelectorAll('#directionsBtn, #directionsActionBtn');
    directionsBtns.forEach(btn => {
        if (businessData.lat && businessData.lng) {
            btn.onclick = () => getDirections(businessData.lat, businessData.lng, businessData.direccion);
        } else {
            btn.style.display = 'none';
        }
    });
    
    // Call button in action cards
    const callBtn = document.getElementById('callBtn');
    if (callBtn) {
        if (businessData.telefono) {
            callBtn.style.display = 'block';
            callBtn.onclick = () => callBusiness(businessData.telefono);
        } else {
            callBtn.style.display = 'none';
        }
    }
    
    // Website button in action cards
    const websiteBtn = document.getElementById('websiteBtn');
    if (websiteBtn) {
        if (businessData.website) {
            websiteBtn.style.display = 'block';
            websiteBtn.onclick = () => visitWebsite(businessData.website);
        } else {
            websiteBtn.style.display = 'none';
        }
    }
}

function callBusiness(phone) {
    if (phone) {
        window.location.href = `tel:${phone}`;
    }
}

function visitWebsite(website) {
    if (website) {
        window.open(website, '_blank');
    }
}

function getDirections(lat, lng, address) {
    if (lat && lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    } else if (address) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    }
}

function generateQRCode() {
    // Skip QR generation if library not loaded to avoid blocking
    const canvas = document.getElementById('qrCode');
    if (canvas && typeof QRCode !== 'undefined') {
        try {
            const url = window.location.href;
            QRCode.toCanvas(canvas, url, {
                width: 120,
                height: 120,
                colorDark: '#1f2937',
                colorLight: '#ffffff',
                margin: 1
            }, (error) => {
                if (error) {
                    console.log('QR generation skipped');
                    canvas.style.display = 'none';
                }
            });
        } catch (e) {
            console.log('QR generation skipped - no blocking');
            canvas.style.display = 'none';
        }
    } else {
        // Hide QR section if library not available
        if (canvas) canvas.style.display = 'none';
    }
}

function hideLoading() {
    const loadingState = document.getElementById('loadingState');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingState) loadingState.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    
    console.log('✅ Loading hidden, content shown');
}

function showError(message) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingState) loadingState.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    if (errorState) errorState.style.display = 'flex';
    
    const errorContent = document.querySelector('.error-content p');
    if (errorContent) {
        errorContent.textContent = message;
    }
    
    console.error('❌ Error shown:', message);
}

// Global functions for HTML onclick events
function shareBusiness() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.add('active');
        const shareUrl = document.getElementById('shareUrl');
        if (shareUrl) {
            shareUrl.value = window.location.href;
        }
    }
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function shareWhatsApp() {
    if (businessData) {
        const text = `¡Mira este negocio en Acacías! ${businessData.nombre_negocio} - ${window.location.href}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}

function shareFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
}

function shareTwitter() {
    if (businessData) {
        const text = `¡Descubre ${businessData.nombre_negocio} en Acacías!`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    }
}

function copyLink() {
    const shareUrl = document.getElementById('shareUrl');
    if (shareUrl) {
        shareUrl.select();
        shareUrl.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            showToast('Enlace copiado al portapapeles');
        } catch (err) {
            console.error('Error copying link:', err);
        }
    }
}

function downloadQR() {
    const canvas = document.getElementById('qrCode');
    if (canvas && businessData) {
        const link = document.createElement('a');
        link.download = `${businessData.nombre_negocio}-QR.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
}

// FUNCIONES DEL CARRUSEL DE IMÁGENES - 3 IMÁGENES POR SLIDE
// Variables globales del carrusel
if (typeof currentSlide === 'undefined') {
    var currentSlide = 0;
    var totalImages = 0;
    var totalSlides = 0;
    var imagesPerSlide = 3; // Mostrar 3 imágenes por slide como originalmente
}

function initializeCarousel(imageCount) {
    // Configurar variables globales del carrusel
    totalImages = imageCount || 0;
    imagesPerSlide = 3; // Siempre 3 imágenes por slide
    totalSlides = Math.ceil(totalImages / imagesPerSlide);
    currentSlide = 0;
    
    console.log(`🎠 Inicializando carrusel: ${totalImages} imágenes, ${totalSlides} slides de ${imagesPerSlide} imágenes`);
    
    // Ajustar para móvil
    if (window.innerWidth <= 768) {
        imagesPerSlide = 2; // En móvil mostrar 2 por slide
        totalSlides = Math.ceil(totalImages / imagesPerSlide);
    }
    
    // Configurar el carrusel para mostrar 3 imágenes por slide
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        carouselTrack.style.display = 'flex';
        carouselTrack.style.transition = 'transform 0.3s ease';
        
        // Configurar cada item del carrusel para mostrar 3 por vez
        const items = carouselTrack.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.style.minWidth = `${100 / imagesPerSlide}%`;
            item.style.display = 'block'; // Mostrar todas las imágenes
            item.style.flex = '0 0 auto';
        });
    }
    
    // Actualizar posición y controles
    updateCarouselPosition();
    updateCarouselControls();
    
    // Agregar event listeners directos para las flechas
    setupCarouselEventListeners();
}

function scrollCarousel(direction) {
    console.log(`🎠 CLICK EN FLECHA: ${direction}`);
    console.log(`📊 Estado actual - currentSlide: ${currentSlide}, totalSlides: ${totalSlides}`);
    
    if (!totalSlides || totalSlides <= 1) {
        console.log('⚠️ No hay suficientes slides para navegar');
        return;
    }
    
    if (direction === 'next') {
        const oldSlide = currentSlide;
        currentSlide = (currentSlide + 1) % totalSlides;
        console.log(`➡️ NEXT: ${oldSlide} → ${currentSlide}`);
    } else if (direction === 'prev') {
        const oldSlide = currentSlide;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        console.log(`⬅️ PREV: ${oldSlide} → ${currentSlide}`);
    }
    
    // Aplicar el movimiento directamente
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        // Cada slide ocupa 25% del track total (100% / 4 slides = 25%)
        const translateX = -(currentSlide * 25);
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        console.log(`📏 Transform aplicado: translateX(${translateX}%) - Slide ${currentSlide + 1}/${totalSlides}`);
        
        // Actualizar indicadores
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        console.log(`✅ NAVEGACIÓN EXITOSA - Mostrando slide ${currentSlide + 1} de ${totalSlides}`);
    } else {
        console.error('❌ carouselTrack no encontrado!');
    }
}

function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;
    
    currentSlide = slideIndex;
    console.log(`🎠 Yendo a slide ${currentSlide + 1}/${totalSlides}`);
    
    updateCarouselPosition();
    updateCarouselIndicators();
    updateCarouselControls();
}

function updateCarouselPosition() {
    console.log(`📍 updateCarouselPosition - currentSlide: ${currentSlide}, totalSlides: ${totalSlides}`);
    
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) {
        console.error('❌ carouselTrack no encontrado!');
        return;
    }
    
    // Cada slide ocupa 25% del track total (100% / 4 slides = 25%)
    const translateX = -(currentSlide * 25);
    console.log(`📏 Aplicando transform: translateX(${translateX}%) - Slide ${currentSlide + 1}/${totalSlides}`);
    
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    console.log(`✅ Transform aplicado: ${carouselTrack.style.transform}`);
}

function updateCarouselIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function updateCarouselControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        // Mostrar controles si hay más de 1 slide
        const showControls = totalSlides > 1;
        prevBtn.style.display = showControls ? 'flex' : 'none';
        nextBtn.style.display = showControls ? 'flex' : 'none';
        
        // Actualizar estado visual
        prevBtn.style.opacity = currentSlide === 0 ? '0.6' : '1';
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.6' : '1';
    }
}

function setupCarouselEventListeners() {
    console.log('🔧 Configurando event listeners del carrusel...');
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        // Remover listeners existentes
        prevBtn.removeEventListener('click', handlePrevClick);
        // Agregar nuevo listener
        prevBtn.addEventListener('click', handlePrevClick);
        console.log('⬅️ Event listener agregado al botón PREV');
    } else {
        console.error('❌ Botón PREV no encontrado!');
    }
    
    if (nextBtn) {
        // Remover listeners existentes
        nextBtn.removeEventListener('click', handleNextClick);
        // Agregar nuevo listener
        nextBtn.addEventListener('click', handleNextClick);
        console.log('➡️ Event listener agregado al botón NEXT');
    } else {
        console.error('❌ Botón NEXT no encontrado!');
    }
}

function handlePrevClick(event) {
    event.preventDefault();
    console.log('🖱️ CLICK EN PREV DETECTADO!');
    console.log(`📊 Estado actual - currentSlide: ${currentSlide}, totalSlides: ${totalSlides}`);
    
    const oldSlide = currentSlide;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    console.log(`⬅️ PREV: ${oldSlide} → ${currentSlide}`);
    
    updateCarouselPosition();
    updateCarouselIndicators();
    updateCarouselControls();
    console.log(`✅ Navegación PREV completada`);
}

function handleNextClick(event) {
    event.preventDefault();
    console.log('🖱️ CLICK EN NEXT DETECTADO!');
    console.log(`📊 Estado actual - currentSlide: ${currentSlide}, totalSlides: ${totalSlides}`);
    
    const oldSlide = currentSlide;
    currentSlide = (currentSlide + 1) % totalSlides;
    console.log(`➡️ NEXT: ${oldSlide} → ${currentSlide}`);
    
    updateCarouselPosition();
    updateCarouselIndicators();
    updateCarouselControls();
    console.log(`✅ Navegación NEXT completada`);
}

// Función para abrir modal de imagen (si se implementa en el futuro)
function openImageModal(imageUrl, imageAlt) {
    console.log(`🖼️ Abriendo modal para: ${imageAlt}`);
    // Por ahora, abrir la imagen en una nueva pestaña
    window.open(imageUrl, '_blank');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1f2937;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 14px;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Modal para ver imágenes en grande
function openImageModal(imageUrl, imageAlt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <button class="image-modal-close" onclick="closeImageModal()">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageUrl}" alt="${imageAlt}" class="modal-image">
            <div class="image-modal-caption">${imageAlt}</div>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    };
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Agregar estilos del modal si no existen
    if (!document.getElementById('imageModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'imageModalStyles';
        styles.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            .image-modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                text-align: center;
            }
            .modal-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 8px;
            }
            .image-modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 1.5rem;
                padding: 8px 12px;
                border-radius: 50%;
                cursor: pointer;
                backdrop-filter: blur(10px);
            }
            .image-modal-caption {
                color: white;
                margin-top: 16px;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Función para mostrar carrusel vacío cuando no hay imágenes
function showEmptyCarousel() {
    console.log('📷 Mostrando carrusel vacío');
    
    // Mostrar la sección del carrusel
    const gallerySection = document.getElementById('businessGallery');
    if (gallerySection) {
        gallerySection.style.display = 'block';
    }
    
    // Crear un slide con mensaje de "no hay imágenes"
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        carouselTrack.innerHTML = `
            <div class="carousel-slide">
                <div class="carousel-item no-images">
                    <div class="no-images-placeholder">
                        <i class="fas fa-camera"></i>
                        <p>Próximamente más fotos</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Ocultar controles del carrusel
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.getElementById('carouselIndicators');
    
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (indicators) indicators.innerHTML = '';
}

// Funciones del carrusel de imágenes
let currentCarouselPosition = 0;

function scrollCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    const images = track.querySelectorAll('.carousel-image');
    const imageWidth = 150; // Ancho de cada imagen + margen
    const visibleImages = Math.floor(track.parentElement.offsetWidth / imageWidth);
    const maxPosition = Math.max(0, images.length - visibleImages);
    
    if (direction === 'next') {
        currentCarouselPosition = Math.min(currentCarouselPosition + 1, maxPosition);
    } else {
        currentCarouselPosition = Math.max(currentCarouselPosition - 1, 0);
    }
    
    const translateX = -currentCarouselPosition * imageWidth;
    track.style.transform = `translateX(${translateX}px)`;
    
    // Actualizar estado de los botones
    updateCarouselButtons();
}

function updateCarouselButtons() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const track = document.getElementById('carouselTrack');
    
    if (!prevBtn || !nextBtn || !track) return;
    
    const images = track.querySelectorAll('.carousel-image');
    const imageWidth = 150;
    const visibleImages = Math.floor(track.parentElement.offsetWidth / imageWidth);
    const maxPosition = Math.max(0, images.length - visibleImages);
    
    prevBtn.disabled = currentCarouselPosition === 0;
    nextBtn.disabled = currentCarouselPosition >= maxPosition;
    
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
}

// ===== SISTEMA DE CALIFICACIÓN CON REACCIONES EMOJI =====

// Variables globales para el sistema de reacciones
let currentBusinessId = null;
let userReaction = null;
let reactionCounts = {
    'me-gusta': 0,
    'me-divierte': 0,
    'me-encanta': 0,
    'me-sorprende': 0,
    'no-me-gusta': 0,
    'me-entristece': 0
};

// Inicializar sistema de reacciones
function initializeRatingSystem() {
    console.log('🎭 Inicializando sistema de reacciones');
    
    // Obtener ID del negocio actual
    currentBusinessId = getBusinessIdFromUrl();
    if (!currentBusinessId) {
        console.error('❌ No se pudo obtener el ID del negocio');
        return;
    }
    
    // Cargar datos de reacciones guardadas
    loadReactionData();
    
    // Configurar event listeners para las reacciones
    setupReactionListeners();
    
    // Actualizar la interfaz
    updateReactionDisplay();
    
    console.log('✅ Sistema de reacciones inicializado');
}

// Cargar datos de reacciones desde localStorage
function loadReactionData() {
    try {
        // Cargar conteos globales de reacciones para este negocio
        const savedCounts = localStorage.getItem(`reactions_${currentBusinessId}`);
        if (savedCounts) {
            reactionCounts = { ...reactionCounts, ...JSON.parse(savedCounts) };
        }
        
        // Cargar la reacción del usuario actual
        userReaction = localStorage.getItem(`user_reaction_${currentBusinessId}`);
        
        console.log('📊 Datos de reacciones cargados:', { reactionCounts, userReaction });
    } catch (error) {
        console.error('❌ Error cargando datos de reacciones:', error);
    }
}

// Guardar datos de reacciones en localStorage
function saveReactionData() {
    try {
        localStorage.setItem(`reactions_${currentBusinessId}`, JSON.stringify(reactionCounts));
        if (userReaction) {
            localStorage.setItem(`user_reaction_${currentBusinessId}`, userReaction);
        } else {
            localStorage.removeItem(`user_reaction_${currentBusinessId}`);
        }
        console.log('💾 Datos de reacciones guardados');
    } catch (error) {
        console.error('❌ Error guardando datos de reacciones:', error);
    }
}

// Configurar event listeners para las reacciones
function setupReactionListeners() {
    const reactionItems = document.querySelectorAll('.reaction-item');
    
    reactionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const reaction = item.getAttribute('data-reaction');
            handleReactionClick(reaction);
        });
        
        // Agregar efecto hover mejorado
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('selected')) {
                item.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('selected')) {
                item.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    console.log('🎯 Event listeners de reacciones configurados');
}

// Manejar clic en una reacción
function handleReactionClick(reaction) {
    console.log(`🎭 Reacción clickeada: ${reaction}`);
    
    // Si el usuario ya había seleccionado esta reacción, la deselecciona
    if (userReaction === reaction) {
        // Decrementar contador
        reactionCounts[reaction] = Math.max(0, reactionCounts[reaction] - 1);
        userReaction = null;
        console.log(`➖ Reacción ${reaction} removida`);
    } else {
        // Si tenía otra reacción, decrementar la anterior
        if (userReaction) {
            reactionCounts[userReaction] = Math.max(0, reactionCounts[userReaction] - 1);
        }
        
        // Incrementar la nueva reacción
        reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
        userReaction = reaction;
        console.log(`➕ Nueva reacción: ${reaction}`);
    }
    
    // Guardar cambios
    saveReactionData();
    
    // Actualizar interfaz
    updateReactionDisplay();
    
    // Mostrar feedback visual
    showReactionFeedback(reaction);
}

// Actualizar la visualización de las reacciones
function updateReactionDisplay() {
    const reactionItems = document.querySelectorAll('.reaction-item');
    let totalResponses = 0;
    
    reactionItems.forEach(item => {
        const reaction = item.getAttribute('data-reaction');
        const countElement = item.querySelector('.reaction-count');
        const count = reactionCounts[reaction] || 0;
        
        // Actualizar contador
        if (countElement) {
            countElement.textContent = count;
        }
        
        // Marcar como seleccionada si es la reacción del usuario
        if (userReaction === reaction) {
            item.classList.add('selected');
            item.style.transform = 'translateY(-2px) scale(1.05)';
        } else {
            item.classList.remove('selected');
            item.style.transform = 'translateY(0) scale(1)';
        }
        
        totalResponses += count;
    });
    
    // Actualizar total de respuestas
    const totalElement = document.getElementById('totalResponses');
    if (totalElement) {
        totalElement.textContent = totalResponses;
    }
    
    console.log(`📊 Interfaz actualizada - Total: ${totalResponses} respuestas`);
}

// Mostrar feedback visual cuando se hace clic en una reacción
function showReactionFeedback(reaction) {
    const reactionItem = document.querySelector(`[data-reaction="${reaction}"]`);
    if (!reactionItem) return;
    
    // Crear elemento de feedback
    const feedback = document.createElement('div');
    feedback.className = 'reaction-feedback';
    feedback.textContent = userReaction === reaction ? '¡Gracias!' : '¡Reacción cambiada!';
    feedback.style.cssText = `
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: #3b82f6;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        z-index: 1000;
        animation: feedbackPop 2s ease-out forwards;
        pointer-events: none;
    `;
    
    // Agregar animación CSS
    if (!document.getElementById('reactionFeedbackStyles')) {
        const styles = document.createElement('style');
        styles.id = 'reactionFeedbackStyles';
        styles.textContent = `
            @keyframes feedbackPop {
                0% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(10px) scale(0.8);
                }
                20% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-10px) scale(1.1);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px) scale(1);
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar feedback al elemento
    reactionItem.style.position = 'relative';
    reactionItem.appendChild(feedback);
    
    // Remover feedback después de la animación
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
}

// Inicializar el sistema de reacciones cuando la página esté lista
function initializeRatingOnPageLoad() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeRatingSystem, 500); // Pequeño delay para asegurar que todo esté renderizado
        });
    } else {
        setTimeout(initializeRatingSystem, 500);
    }
}

// Inicializar automáticamente
initializeRatingOnPageLoad();

console.log('🎭 Sistema de reacciones emoji cargado y listo');

function updateSocialMediaLinks() {
    if (!businessData) return;
    
    console.log('📱 Updating social media links...');
    
    // Obtener datos de redes sociales del negocio
    const socialData = businessData.redes_sociales || businessData.socialProfiles || {};
    
    // Mapeo de redes sociales disponibles
    const socialNetworks = {
        whatsapp: {
            id: 'whatsappLink',
            url: socialData.whatsapp || businessData.whatsapp_business || businessData.telefono,
            prefix: 'https://wa.me/',
            cleanPhone: true
        },
        facebook: {
            id: 'facebookLink',
            url: socialData.facebook || businessData.facebook_page
        },
        instagram: {
            id: 'instagramLink', 
            url: socialData.instagram || businessData.instagram_profile
        },
        tiktok: {
            id: 'tiktokLink',
            url: socialData.tiktok || businessData.tiktok_profile
        },
        youtube: {
            id: 'youtubeLink',
            url: socialData.youtube || businessData.youtube_channel
        },
        linkedin: {
            id: 'linkedinLink',
            url: socialData.linkedin || businessData.linkedin_profile
        },
        twitter: {
            id: 'twitterLink',
            url: socialData.twitter || businessData.twitter_profile
        }
    };
    
    let hasAnySocialMedia = false;
    
    // Procesar cada red social
    Object.keys(socialNetworks).forEach(network => {
        const config = socialNetworks[network];
        const linkElement = document.getElementById(config.id);
        
        if (linkElement && config.url) {
            let finalUrl = config.url;
            
            // Procesar URL según el tipo de red social
            if (network === 'whatsapp' && config.cleanPhone) {
                // Limpiar número de teléfono para WhatsApp
                const cleanPhone = finalUrl.replace(/\D/g, '');
                if (cleanPhone.length >= 10) {
                    finalUrl = `${config.prefix}${cleanPhone}`;
                } else {
                    finalUrl = null; // Número inválido
                }
            } else if (config.prefix && !finalUrl.startsWith('http')) {
                finalUrl = config.prefix + finalUrl;
            }
            
            // Mostrar enlace si la URL es válida
            if (finalUrl && (finalUrl.startsWith('http') || finalUrl.startsWith('https://wa.me/'))) {
                linkElement.href = finalUrl;
                linkElement.style.display = 'flex';
                hasAnySocialMedia = true;
                
                console.log(`✅ ${network}: ${finalUrl}`);
            } else {
                linkElement.style.display = 'none';
            }
        } else if (linkElement) {
            linkElement.style.display = 'none';
        }
    });
    
    // Mostrar u ocultar la sección completa de redes sociales
    const socialMediaSection = document.getElementById('socialMediaSection');
    if (socialMediaSection) {
        if (hasAnySocialMedia) {
            socialMediaSection.style.display = 'block';
            console.log('📱 Social media section shown');
        } else {
            socialMediaSection.style.display = 'none';
            console.log('📱 No social media found - section hidden');
        }
    }
}
