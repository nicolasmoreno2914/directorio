/**
 * Business Advanced Landing Page - Google My Business Integration
 * Handles complete business profile display with GMB data
 */

class BusinessAdvanced {
    constructor() {
        this.businessId = null;
        this.businessData = null;
        this.gmbData = null;
        this.currentPhotoIndex = 0;
        this.photos = [];
        this.reactions = { like: 0, love: 0, wow: 0, haha: 0, sad: 0, angry: 0 };
        this.init();
    }

    async init() {
        try {
            this.businessId = this.getBusinessIdFromUrl();
            if (!this.businessId) {
                this.showError('ID de negocio no encontrado en la URL');
                return;
            }

            await this.loadBusinessData();
            await this.loadGoogleMyBusinessData();
            this.renderBusinessPage();
            this.setupEventListeners();
            this.loadReactions();
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing business page:', error);
            this.showError('Error al cargar la información del negocio');
        }
    }

    getBusinessIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadBusinessData() {
        try {
            const response = await fetch(`/api/businesses/${this.businessId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.businessData = await response.json();
        } catch (error) {
            console.error('Error loading business data:', error);
            this.businessData = this.getMockBusinessData();
        }
    }

    async loadGoogleMyBusinessData() {
        try {
            const gmbResponse = await fetch(`/api/google-my-business/${this.businessId}`);
            if (gmbResponse.ok) {
                this.gmbData = await gmbResponse.json();
                this.mergeGMBData();
            }
        } catch (error) {
            console.log('GMB integration pending quota approval:', error.message);
        }
    }

    mergeGMBData() {
        if (!this.gmbData) return;

        this.businessData = {
            ...this.businessData,
            displayName: this.gmbData.displayName || this.businessData.nombre_negocio,
            description: this.gmbData.profile?.description || this.businessData.descripcion,
            phoneNumbers: this.gmbData.phoneNumbers || { primaryPhone: this.businessData.telefono },
            websiteUri: this.gmbData.websiteUri || this.businessData.sitio_web,
            address: this.gmbData.storefrontAddress || this.businessData.direccion,
            photos: this.gmbData.photos || this.parseExistingPhotos(),
            averageRating: this.gmbData.averageRating || this.businessData.calificacion || 0,
            reviewCount: this.gmbData.reviewCount || 0,
            reviews: this.gmbData.reviews || [],
            socialProfiles: this.gmbData.socialProfiles || this.parseExistingSocial(),
            regularHours: this.gmbData.regularHours || this.parseExistingHours(),
            services: this.gmbData.services || [],
            analytics: this.gmbData.analytics || null
        };
    }

    parseExistingPhotos() {
        if (!this.businessData.imagenes) return [];
        try {
            const photos = JSON.parse(this.businessData.imagenes);
            return Array.isArray(photos) ? photos : [];
        } catch { return []; }
    }

    parseExistingSocial() {
        const social = {};
        if (this.businessData.facebook) social.facebook = this.businessData.facebook;
        if (this.businessData.instagram) social.instagram = this.businessData.instagram;
        if (this.businessData.whatsapp) social.whatsapp = this.businessData.whatsapp;
        return social;
    }

    parseExistingHours() {
        if (!this.businessData.horarios) return {};
        try {
            return JSON.parse(this.businessData.horarios);
        } catch { return {}; }
    }

    renderBusinessPage() {
        this.renderHeroSection();
        this.renderQuickActions();
        this.renderPhotoGallery();
        this.renderBusinessInfo();
        this.renderServices();
        this.renderSocialMedia();
        this.renderReviews();
        this.updateMetaTags();
    }

    renderHeroSection() {
        const business = this.businessData;
        
        document.getElementById('page-title').textContent = `${business.displayName || business.nombre_negocio} - Directorio Acacías`;
        
        const heroBackground = document.getElementById('hero-background');
        if (business.photos && business.photos.length > 0) {
            heroBackground.style.backgroundImage = `url(${business.photos[0]})`;
        }
        
        document.getElementById('business-name').textContent = business.displayName || business.nombre_negocio || 'Negocio';
        document.getElementById('business-category').textContent = business.primaryCategory || business.categoria || '';
        
        this.updateBusinessStatus();
        this.renderRating();
    }

    renderRating() {
        const rating = this.businessData.averageRating || 0;
        const reviewCount = this.businessData.reviewCount || 0;
        
        const starsContainer = document.getElementById('rating-stars');
        const ratingText = document.getElementById('rating-text');
        
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            const starClass = i <= Math.floor(rating) ? 'fas fa-star star' : 
                             i <= rating ? 'fas fa-star-half-alt star' : 'far fa-star star';
            starsHTML += `<i class="${starClass}"></i>`;
        }
        starsContainer.innerHTML = starsHTML;
        
        if (rating > 0) {
            ratingText.textContent = `${rating.toFixed(1)} (${reviewCount} opiniones)`;
        } else {
            ratingText.textContent = 'Sin calificaciones aún';
        }
    }

    renderQuickActions() {
        const business = this.businessData;
        
        const callBtn = document.getElementById('call-btn');
        if (business.phoneNumbers?.primaryPhone || business.telefono) {
            const phone = business.phoneNumbers?.primaryPhone || business.telefono;
            callBtn.href = `tel:${phone}`;
        }
        
        const directionsBtn = document.getElementById('directions-btn');
        if (business.address || business.direccion) {
            const address = business.address || business.direccion;
            directionsBtn.href = `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
            directionsBtn.target = '_blank';
        }
        
        const websiteBtn = document.getElementById('website-btn');
        if (business.websiteUri || business.sitio_web) {
            const website = business.websiteUri || business.sitio_web;
            websiteBtn.href = website;
            websiteBtn.target = '_blank';
        }
        
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (business.phoneNumbers?.primaryPhone || business.telefono) {
            const phone = (business.phoneNumbers?.primaryPhone || business.telefono).replace(/\D/g, '');
            const message = `Hola! Vi tu negocio en Directorio Acacías: ${business.displayName || business.nombre_negocio}`;
            whatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            whatsappBtn.target = '_blank';
        }
    }

    renderPhotoGallery() {
        const photos = this.businessData.photos || [];
        this.photos = photos;
        this.currentSlide = 0;
        
        if (photos.length === 0) {
            document.getElementById('photo-gallery').style.display = 'none';
            return;
        }
        
        this.createGallerySlides();
        this.updateGalleryControls();
        this.updatePhotoCounter();
    }

    createGallerySlides() {
        const photos = this.photos;
        const galleryTrack = document.getElementById('gallery-track');
        const photosPerSlide = 3;
        
        // Calculate number of slides needed
        this.totalSlides = Math.ceil(photos.length / photosPerSlide);
        
        let slidesHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const startIndex = i * photosPerSlide;
            const endIndex = Math.min(startIndex + photosPerSlide, photos.length);
            const slidePhotos = photos.slice(startIndex, endIndex);
            
            // Determine slide class based on number of photos
            let slideClass = 'gallery-slide';
            let photoClass = 'gallery-photo';
            
            if (slidePhotos.length === 1) {
                slideClass += ' single';
                photoClass += ' single-photo';
            } else if (slidePhotos.length === 2) {
                slideClass += ' double';
                photoClass += ' double-photo';
            }
            
            const slideHTML = slidePhotos.map((photo, index) => {
                const globalIndex = startIndex + index;
                return `<img src="${photo}" alt="Foto ${globalIndex + 1}" class="${photoClass}" data-index="${globalIndex}">`;
            }).join('');
            
            slidesHTML += `<div class="${slideClass}">${slideHTML}</div>`;
        }
        
        galleryTrack.innerHTML = slidesHTML;
        
        // Create indicators if more than one slide
        this.createGalleryIndicators();
    }

    createGalleryIndicators() {
        const indicatorsContainer = document.getElementById('gallery-indicators');
        
        if (this.totalSlides <= 1) {
            indicatorsContainer.style.display = 'none';
            return;
        }
        
        const indicatorsHTML = Array.from({ length: this.totalSlides }, (_, index) => 
            `<div class="gallery-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`
        ).join('');
        
        indicatorsContainer.innerHTML = indicatorsHTML;
        indicatorsContainer.style.display = 'flex';
    }

    setupEventListeners() {
        document.getElementById('prev-btn')?.addEventListener('click', () => this.previousSlide());
        document.getElementById('next-btn')?.addEventListener('click', () => this.nextSlide());
        
        // Photo click listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-photo')) {
                const index = parseInt(e.target.dataset.index);
                this.showPhotoModal(index);
            }
        });
        
        // Indicator click listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-indicator')) {
                const slide = parseInt(e.target.dataset.slide);
                this.goToSlide(slide);
            }
        });
        
        document.getElementById('share-btn')?.addEventListener('click', () => this.showShareModal());
        document.getElementById('close-share-modal')?.addEventListener('click', () => this.hideShareModal());
        
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reaction = e.currentTarget.dataset.reaction;
                this.toggleReaction(reaction);
            });
        });
    }

    previousSlide() {
        if (this.totalSlides <= 1) return;
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateGalleryPosition();
        this.updateGalleryControls();
        this.updatePhotoCounter();
    }

    nextSlide() {
        if (this.totalSlides <= 1) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateGalleryPosition();
        this.updateGalleryControls();
        this.updatePhotoCounter();
    }

    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
        this.currentSlide = slideIndex;
        this.updateGalleryPosition();
        this.updateGalleryControls();
        this.updatePhotoCounter();
    }

    updateGalleryPosition() {
        const galleryTrack = document.getElementById('gallery-track');
        const translateX = -this.currentSlide * 100;
        galleryTrack.style.transform = `translateX(${translateX}%)`;
    }

    updateGalleryControls() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (this.totalSlides <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        
        // Update indicators
        document.querySelectorAll('.gallery-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    updatePhotoCounter() {
        const photosPerSlide = 3;
        const startPhoto = this.currentSlide * photosPerSlide + 1;
        const endPhoto = Math.min((this.currentSlide + 1) * photosPerSlide, this.photos.length);
        
        const counterText = this.photos.length <= photosPerSlide ? 
            `${this.photos.length} foto${this.photos.length !== 1 ? 's' : ''}` :
            `${startPhoto}-${endPhoto} de ${this.photos.length} fotos`;
            
        document.getElementById('photo-counter').textContent = counterText;
    }

    showPhotoModal(index) {
        // TODO: Implement photo modal for full-screen view
        console.log(`Showing photo ${index + 1} in modal`);
    }

    showShareModal() {
        document.getElementById('share-modal').classList.add('show');
    }

    hideShareModal() {
        document.getElementById('share-modal').classList.remove('show');
    }

    loadReactions() {
        const saved = localStorage.getItem(`reactions_${this.businessId}`);
        if (saved) {
            this.reactions = JSON.parse(saved);
        }
        
        Object.keys(this.reactions).forEach(reaction => {
            const countElement = document.getElementById(`${reaction}-count`);
            if (countElement) {
                countElement.textContent = this.reactions[reaction];
            }
        });
        
        const userReaction = localStorage.getItem(`user_reaction_${this.businessId}`);
        if (userReaction) {
            const btn = document.querySelector(`[data-reaction="${userReaction}"]`);
            if (btn) btn.classList.add('active');
        }
    }

    toggleReaction(reaction) {
        const btn = document.querySelector(`[data-reaction="${reaction}"]`);
        const currentUserReaction = localStorage.getItem(`user_reaction_${this.businessId}`);
        
        if (currentUserReaction) {
            this.reactions[currentUserReaction]--;
            document.querySelector(`[data-reaction="${currentUserReaction}"]`).classList.remove('active');
            document.getElementById(`${currentUserReaction}-count`).textContent = this.reactions[currentUserReaction];
        }
        
        if (currentUserReaction === reaction) {
            localStorage.removeItem(`user_reaction_${this.businessId}`);
        } else {
            this.reactions[reaction]++;
            btn.classList.add('active');
            document.getElementById(`${reaction}-count`).textContent = this.reactions[reaction];
            localStorage.setItem(`user_reaction_${this.businessId}`, reaction);
        }
        
        localStorage.setItem(`reactions_${this.businessId}`, JSON.stringify(this.reactions));
    }

    updateMetaTags() {
        const business = this.businessData;
        const title = `${business.displayName || business.nombre_negocio} - Directorio Acacías`;
        const description = business.description || business.descripcion || `Información completa de ${business.displayName || business.nombre_negocio} en Acacías, Meta`;
        const image = business.photos && business.photos[0] ? business.photos[0] : '';
        
        document.getElementById('page-description').content = description;
        document.getElementById('og-title').content = title;
        document.getElementById('og-description').content = description;
        document.getElementById('og-image').content = image;
        document.getElementById('og-url').content = window.location.href;
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-state');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showError(message) {
        console.error(message);
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                <h2>Error</h2>
                <p>${message}</p>
                <a href="index.html" style="color: #2E7D32; text-decoration: none;">← Volver al directorio</a>
            </div>
        `;
    }

    getMockBusinessData() {
        return {
            id: this.businessId,
            nombre_negocio: 'Negocio de Ejemplo',
            categoria: 'Comercio Local',
            direccion: 'Acacías, Meta',
            telefono: '+57 300 123 4567',
            imagenes: '[]',
            calificacion: 4.5
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BusinessAdvanced();
});
