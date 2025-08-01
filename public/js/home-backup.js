// Simplified Home page functionality
class HomePage {
    constructor() {
        // Prevent multiple initializations
        if (window.homePageInitialized) {
            console.log('⚠️ HomePage already initialized');
            return window.homePageInstance;
        }
        
        console.log('🚀 Initializing HomePage...');
        
        this.app = window.YoComproAcacias;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasLoadedInitialData = false;
        
        window.homePageInitialized = true;
        window.homePageInstance = this;
        
        // Simple initialization without complex async operations
        this.simpleInit();
    }

    simpleInit() {
        console.log('🔧 Simple initialization starting...');
        
        // Inicializar optimizaciones de scroll
        this.optimizeScrollPerformance();
        
        // Only load data once
        if (!this.hasLoadedInitialData) {
            this.hasLoadedInitialData = true;
            this.loadBusinessesOnce();
        }
        
        console.log('✅ Simple initialization complete');
    }
    
    async loadBusinessesOnce() {
        try {
            console.log('📊 Loading businesses once...');
            
            // CARGAR CANTIDAD MODERADA PARA SCROLL FLUIDO
            const response = await fetch('/api/businesses?page=1&limit=24');
            const data = await response.json();
            
            if (data && data.businesses) {
                console.log(`✅ Loaded ${data.businesses.length} businesses`);
                this.renderBusinessesOptimized(data.businesses);
            }
        } catch (error) {
            console.error('❌ Error loading businesses:', error);
            this.renderErrorState();
        }
    }
    
    renderBusinessesOptimized(businesses) {
        const container = document.getElementById('allBusinessesGrid');
        if (!container) {
            console.error('❌ Container allBusinessesGrid not found');
            return;
        }

        // RENDERIZADO OPTIMIZADO CON IMÁGENES REALES DE GOOGLE MY BUSINESS
        const fragment = document.createDocumentFragment();
        
        businesses.forEach((business, index) => {
            const card = document.createElement('div');
            card.className = 'business-card';
            card.style.cursor = 'pointer';
            
            // OBTENER PRIMERA IMAGEN REAL DE GOOGLE MY BUSINESS
            let imageUrl = null;
            let imageAlt = business.nombre_negocio;
            
            // Priorizar imágenes de Google My Business
            if (business.imagenes) {
                let images = business.imagenes;
                
                // Si imagenes es string JSON, parsearlo
                if (typeof images === 'string') {
                    try {
                        images = JSON.parse(images);
                    } catch (e) {
                        console.log('⚠️ Error parsing images JSON for', business.nombre_negocio);
                        images = null;
                    }
                }
                
                // Si tenemos imágenes válidas, usar la primera
                if (images && Array.isArray(images) && images.length > 0) {
                    const firstImage = images[0];
                    imageUrl = firstImage.url || firstImage;
                    imageAlt = firstImage.alt || business.nombre_negocio;
                    console.log(`🖼️ ${business.nombre_negocio}: Usando imagen real de Google My Business`);
                }
            }
            
            // Generar HTML con imagen real o fallback
            let imageHTML;
            if (imageUrl) {
                // MOSTRAR IMAGEN REAL DE GOOGLE MY BUSINESS
                imageHTML = `
                    <div class="business-image">
                        <img src="${imageUrl}" 
                             alt="${imageAlt}" 
                             class="real-business-image"
                             onerror="this.parentElement.innerHTML='<div class=\"fallback-icon\">🏪</div>'">
                    </div>`;
            } else {
                // FALLBACK: ícono verde cuando no hay imagen de Google My Business
                console.log(`📍 ${business.nombre_negocio}: Sin imagen real, usando ícono verde`);
                imageHTML = `
                    <div class="business-image">
                        <div class="fallback-icon">🏪</div>
                    </div>`;
            }
            
            // Usar innerHTML para mejor rendimiento
            card.innerHTML = `
                ${imageHTML}
                <div class="business-info">
                    <h3>${business.nombre_negocio || 'Sin nombre'}</h3>
                    <span class="category">${business.categoria_principal || business.categoria || 'General'}</span>
                    <p class="location">📍 ${business.direccion || 'Acacías, Meta, Colombia'}</p>
                    <div class="rating">⭐⭐⭐⭐⭐ N/A</div>
                </div>
            `;
            
            // Event listener optimizado
            card.addEventListener('click', () => {
                window.location.href = `/negocio/${business.business_id || business.id}`;
            }, { passive: true });
            
            fragment.appendChild(card);
        });
        
        // Insertar todo de una vez
        container.innerHTML = '';
        container.appendChild(fragment);
        console.log(`✅ Optimized render with real images: ${businesses.length} businesses`);
    }

    renderBusinessesSimple(businesses) {
        const container = document.getElementById('allBusinessesGrid');
        if (!container) {
            console.log('⚠️ Business grid container not found');
            return;
        }
        
        // Usar DocumentFragment para mejor rendimiento
        const fragment = document.createDocumentFragment();
        
        businesses.forEach((business, index) => {
            // OBTENER PRIMERA IMAGEN REAL (igual que en business.js)
            let imageUrl = null;
            let imageAlt = business.nombre_negocio;
            
            // Priorizar imágenes de Google My Business como en las landings
            if (business.imagenes && business.imagenes.length > 0) {
                const prioritizedImages = business.imagenes.sort((a, b) => {
                    if (a.source === 'google_my_business' && b.source !== 'google_my_business') return -1;
                    if (b.source === 'google_my_business' && a.source !== 'google_my_business') return 1;
                    return 0;
                });
                
                const firstImage = prioritizedImages[0];
                imageUrl = firstImage.url || firstImage;
                imageAlt = firstImage.alt || business.nombre_negocio;
                
                console.log(`🖼️ ${business.nombre_negocio}: Usando imagen real:`, imageUrl.substring(0, 50) + '...');
            }
            
            // Fallback a ícono de categoría si no hay imagen real
            if (!imageUrl) {
                const categoryIcon = this.getCategoryIcon(business.categoria_principal);
                console.log(`📍 ${business.nombre_negocio}: Sin imagen real, usando ícono: ${categoryIcon}`);
            }
            
            const rating = business.calificacion_promedio || 0;
            const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'N/A';
            
            // Crear elemento de negocio optimizado
            const businessCard = document.createElement('div');
            businessCard.className = 'business-card';
            businessCard.style.transform = 'translateZ(0)'; // Acelerar renderizado
            businessCard.onclick = () => window.location.href = `/negocio/${business.business_id}`;
            
            // Implementar lazy loading para imágenes
            const shouldLazyLoad = index > 8; // Cargar inmediatamente solo las primeras 9
            
            // Generar HTML según si hay imagen real o no
            let imageHTML;
            if (imageUrl) {
                // MOSTRAR IMAGEN REAL
                imageHTML = `
                    <img ${shouldLazyLoad ? 'data-src' : 'src'}="${imageUrl}" 
                         ${shouldLazyLoad ? 'src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'200\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23f0f0f0\'/%3E%3C/svg%3E"' : ''}
                         alt="${imageAlt}" 
                         class="business-image real-image ${shouldLazyLoad ? 'lazy-load' : ''}"
                         loading="lazy"
                         decoding="async"
                         style="width: 100%; height: 200px; object-fit: cover; object-position: center;"
                         onerror="this.parentElement.innerHTML='<div class=\"fallback-icon\" style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; display: flex; align-items: center; justify-content: center; font-size: 3rem;\">${this.getCategoryIcon(business.categoria_principal)}</div>'">`;
            } else {
                // MOSTRAR ÍCONO DE CATEGORÍA
                const categoryIcon = this.getCategoryIcon(business.categoria_principal);
                imageHTML = `
                    <div class="business-image fallback-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                        ${categoryIcon}
                    </div>`;
            }
            
            businessCard.innerHTML = `
                ${imageHTML}
                <div class="business-content">
                    <h3 class="business-name">${business.nombre_negocio}</h3>
                    <span class="business-category">${business.categoria_principal}</span>
                    <div class="business-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${business.direccion || 'Dirección no disponible'}
                    </div>
                    <div class="business-rating">
                        <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                        <span class="rating-number">${ratingDisplay}</span>
                    </div>
                </div>
            `;
            
            fragment.appendChild(businessCard);
        });
        
        // Usar requestAnimationFrame para renderizado suave
        requestAnimationFrame(() => {
            container.innerHTML = '';
            container.appendChild(fragment);
            
            // Inicializar lazy loading
            this.initLazyLoading();
            
            console.log('✅ Businesses rendered with optimization');
        });
    }
    
    // LAZY LOADING DESHABILITADO PARA SCROLL FLUIDO
    initLazyLoading() {
        // Cargar todas las imágenes inmediatamente para evitar scroll trabado
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy-load');
            }
        });
        console.log('✅ Lazy loading deshabilitado para scroll fluido');
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.classList.remove('lazy-load');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px', // Cargar imágenes 50px antes de que sean visibles
                threshold: 0.01
            });

            // Observar todas las imágenes con lazy loading
            document.querySelectorAll('img.lazy-load').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores sin Intersection Observer
            this.fallbackLazyLoading();
        }
    }

    fallbackLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy-load');
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.classList.remove('lazy-load');
                img.classList.add('loaded');
            }
        });
    }

    // Optimizar renderizado con throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // OPTIMIZACIÓN SIMPLE Y EFECTIVA DE SCROLL
    optimizeScrollPerformance() {
        // FORZAR SCROLL NATIVO RÁPIDO
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        
        // Aplicar CSS optimizado para scroll fluido
        const scrollOptimizationStyle = document.createElement('style');
        scrollOptimizationStyle.textContent = `
            /* OPTIMIZACIÓN SIMPLE DE SCROLL */
            * {
                scroll-behavior: auto !important;
            }
            
            .business-card {
                transition: none !important;
                transform: none !important;
                will-change: auto !important;
            }
            
            .business-card:hover {
                transform: none !important;
                transition: none !important;
            }
            
            img {
                will-change: auto !important;
            }
        `;
        document.head.appendChild(scrollOptimizationStyle);
        
        console.log('✅ Optimización simple de scroll aplicada');
    }

    renderErrorState() {
        const container = document.getElementById('allBusinessesGrid');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>Error cargando negocios. <button onclick="window.location.reload()">Recargar página</button></p>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Admin button functionality
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                window.location.href = '/admin';
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const clearSearchBtn = document.getElementById('clearSearchBtn');

        if (searchInput) {
            searchInput.addEventListener('input', this.app.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 500));

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                this.handleSearch(query);
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Featured tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchFeaturedTab(btn.dataset.tab);
            });
        });
    }

    async loadInitialData() {
        try {
            console.log('🔄 Cargando datos iniciales...');
            
            // Load data sequentially to avoid conflicts
            await this.loadStats();
            await this.loadCategories();
            await this.loadAllBusinesses();
            
            console.log('✅ Datos iniciales cargados correctamente');
        } catch (error) {
            console.error('❌ Error loading initial data:', error);
            // Don't show error to user, just log it
        }
    }

    async loadStats() {
        try {
            const stats = await this.app.getStats();
            this.renderStats(stats.resumen);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    renderStats(stats) {
        const totalIntegrados = document.getElementById('totalIntegrados');
        const totalVisibles = document.getElementById('totalVisibles');
        const totalCategorias = document.getElementById('totalCategorias');

        if (totalIntegrados) totalIntegrados.textContent = stats.totalIntegrados || 0;
        if (totalVisibles) totalVisibles.textContent = stats.totalVisibles || 0;
        if (totalCategorias) totalCategorias.textContent = stats.totalCategorias || 0;
    }

    async loadCategories() {
        try {
            const categories = await this.app.getCategories();
            this.renderCategories(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategories(categories) {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        // Category icons mapping
        const categoryIcons = {
            'restaurante': 'fas fa-utensils',
            'comida': 'fas fa-hamburger',
            'tienda': 'fas fa-store',
            'supermercado': 'fas fa-shopping-cart',
            'farmacia': 'fas fa-pills',
            'salud': 'fas fa-heartbeat',
            'belleza': 'fas fa-cut',
            'ropa': 'fas fa-tshirt',
            'tecnología': 'fas fa-laptop',
            'servicios': 'fas fa-tools',
            'educación': 'fas fa-graduation-cap',
            'transporte': 'fas fa-car',
            'hogar': 'fas fa-home',
            'deportes': 'fas fa-dumbbell',
            'entretenimiento': 'fas fa-gamepad'
        };

        const getIcon = (categoryName) => {
            const name = categoryName.toLowerCase();
            for (const [key, icon] of Object.entries(categoryIcons)) {
                if (name.includes(key)) {
                    return icon;
                }
            }
            return 'fas fa-store'; // Default icon
        };

        categoriesGrid.innerHTML = categories.map(category => `
            <div class="category-card" onclick="window.YoComproAcacias.navigateToCategory('${category.name}')">
                <div class="category-icon">
                    <i class="${getIcon(category.name)}"></i>
                </div>
                <div class="category-name">${category.name}</div>
                <div class="category-count">${category.count} negocio${category.count !== 1 ? 's' : ''}</div>
            </div>
        `).join('');
    }

    async loadAllBusinesses() {
        try {
            console.log('📊 Cargando todos los negocios...');
            const results = await this.app.getBusinesses({ page: 1, limit: 12 });
            
            if (results && results.businesses) {
                console.log(`✅ ${results.businesses.length} negocios cargados`);
                this.renderAllBusinesses(results);
            } else {
                console.log('⚠️ No se encontraron negocios');
            }
        } catch (error) {
            console.error('❌ Error loading all businesses:', error);
            // Render empty state instead of throwing error
            const allBusinessesGrid = document.getElementById('allBusinessesGrid');
            if (allBusinessesGrid) {
                allBusinessesGrid.innerHTML = '<p>Error cargando negocios. Intenta recargar la página.</p>';
            }
        }
    }

    renderAllBusinesses(results) {
        const allBusinessesGrid = document.getElementById('allBusinessesGrid');
        const allBusinessesPagination = document.getElementById('allBusinessesPagination');
        
        if (!allBusinessesGrid) return;

        this.renderBusinessGrid(allBusinessesGrid, results.businesses);
        if (allBusinessesPagination && results.pages > 1) {
            this.renderAllBusinessesPagination(allBusinessesPagination, results);
        }
    }

    renderAllBusinessesPagination(container, results) {
        if (!container || results.pages <= 1) {
            container.innerHTML = '';
            return;
        }

        const currentPage = results.page;
        const totalPages = results.pages;
        let paginationHTML = '';

        // Previous button
        if (currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="homePage.loadAllBusinessesPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${isActive}" onclick="homePage.loadAllBusinessesPage(${i})">${i}</button>`;
        }

        // Next button
        if (currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="homePage.loadAllBusinessesPage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        container.innerHTML = paginationHTML;
    }

    async loadAllBusinessesPage(page) {
        try {
            const results = await this.app.getBusinesses({ page: page, limit: 12 });
            this.renderAllBusinesses(results);
            
            // Scroll to businesses section
            document.querySelector('.all-businesses-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        } catch (error) {
            console.error('Error loading businesses page:', error);
        }
    }

    async loadFeaturedBusinesses() {
        try {
            const stats = await this.app.getStats();
            this.renderFeaturedBusinesses(stats);
        } catch (error) {
            console.error('Error loading featured businesses:', error);
        }
    }

    renderFeaturedBusinesses(stats) {
        const featuredList = document.getElementById('featuredList');
        if (!featuredList) return;

        let businesses = [];
        
        if (this.featuredTab === 'mejor-calificados') {
            businesses = stats.mejorCalificados || [];
        } else if (this.featuredTab === 'mas-compartidos') {
            businesses = stats.masCompartidos || [];
        }

        if (businesses.length === 0) {
            featuredList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay negocios destacados disponibles</p>
                </div>
            `;
            return;
        }

        featuredList.innerHTML = businesses.map((business, index) => `
            <div class="featured-item" onclick="window.YoComproAcacias.navigateToBusiness('${business.slug}')">
                <div class="featured-rank">${index + 1}</div>
                <div class="featured-info">
                    <div class="featured-name">${business.nombre_negocio}</div>
                    <div class="featured-category">${business.categoria_principal}</div>
                    <div class="featured-meta">
                        ${this.featuredTab === 'mejor-calificados' ? `
                            <span class="rating-stars">${this.app.formatRating(business.calificacion_promedio)}</span>
                            <span>${business.calificacion_promedio.toFixed(1)}</span>
                        ` : `
                            <span class="shares-count">
                                <i class="fas fa-share"></i>
                                ${business.total_compartidos} compartidos
                            </span>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }

    switchFeaturedTab(tab) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        this.featuredTab = tab;
        this.loadFeaturedBusinesses();
    }

    async handleSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery === '') {
            this.clearSearch();
            return;
        }

        this.currentSearch = trimmedQuery;
        this.currentPage = 1;
        
        try {
            const results = await this.app.getBusinesses({
                search: trimmedQuery,
                page: this.currentPage
            });

            this.showSearchResults(results, trimmedQuery);
        } catch (error) {
            console.error('Error searching businesses:', error);
            this.app.showError('Error en la búsqueda');
        }
    }

    showSearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        const searchTitle = document.getElementById('searchTitle');
        const businessesGrid = document.getElementById('businessesGrid');
        const pagination = document.getElementById('pagination');

        // Hide other sections
        document.querySelector('.stats-section').style.display = 'none';
        document.querySelector('.categories-section').style.display = 'none';
        document.querySelector('.featured-section').style.display = 'none';

        // Show search results
        searchResults.style.display = 'block';
        
        if (searchTitle) {
            searchTitle.textContent = `Resultados para "${query}" (${results.total} encontrados)`;
        }

        this.renderBusinessGrid(businessesGrid, results.businesses);
        this.renderPagination(pagination, results);
    }

    renderBusinessGrid(container, businesses) {
        if (!container) return;

        if (businesses.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron resultados</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        container.innerHTML = businesses.map(business => {
            // Manejar imágenes de forma segura
            const imageUrl = (business.imagenes && business.imagenes.length > 0) 
                ? business.imagenes[0] 
                : '/assets/default-business.jpg';
            
            // Manejar calificación de forma segura
            const rating = business.calificacion_promedio || 0;
            const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'N/A';
            
            return `
                <div class="business-card" onclick="window.location.href='/negocio/${business.business_id}'">
                    <img src="${imageUrl}" 
                         alt="${business.nombre_negocio}" 
                         class="business-image"
                         onerror="this.src='/assets/default-business.jpg'">
                    <div class="business-content">
                        <h3 class="business-name">${business.nombre_negocio}</h3>
                        <span class="business-category">${business.categoria_principal}</span>
                        <div class="business-address">
                            <i class="fas fa-map-marker-alt"></i>
                            ${business.direccion || 'Dirección no disponible'}
                        </div>
                        <div class="business-rating">
                            <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                            <span class="rating-number">${ratingDisplay}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPagination(container, results) {
        if (!container || results.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const { currentPage, totalPages } = results;
        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button class="pagination-btn" ${currentPage <= 1 ? 'disabled' : ''} 
                    onclick="homePage.goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="homePage.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="homePage.goToPage(${i})">${i}</button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="homePage.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn" ${currentPage >= totalPages ? 'disabled' : ''} 
                    onclick="homePage.goToPage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        container.innerHTML = paginationHTML;
    }

    async goToPage(page) {
        if (page < 1) return;
        
        this.currentPage = page;
        
        try {
            const results = await this.app.getBusinesses({
                search: this.currentSearch,
                categoria: this.currentCategory,
                page: this.currentPage
            });

            const businessesGrid = document.getElementById('businessesGrid');
            const pagination = document.getElementById('pagination');
            
            this.renderBusinessGrid(businessesGrid, results.businesses);
            this.renderPagination(pagination, results);

            // Scroll to top of results
            document.getElementById('searchResults').scrollIntoView({ 
                behavior: 'smooth' 
            });
        } catch (error) {
            console.error('Error loading page:', error);
            this.app.showError('Error cargando página');
        }
    }

    clearSearch() {
        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset state
        this.currentSearch = '';
        this.currentCategory = '';
        this.currentPage = 1;

        // Hide search results
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }

        // Show other sections
        document.querySelector('.stats-section').style.display = 'block';
        document.querySelector('.categories-section').style.display = 'block';
        document.querySelector('.featured-section').style.display = 'block';
    }

    // Method to handle category navigation
    async navigateToCategory(categoryName) {
        this.currentCategory = categoryName;
        this.currentSearch = '';
        this.currentPage = 1;

        try {
            const results = await this.app.getBusinesses({
                categoria: categoryName,
                page: this.currentPage
            });

            this.showSearchResults(results, `Categoría: ${categoryName}`);
        } catch (error) {
            console.error('Error loading category:', error);
            this.app.showError('Error cargando categoría');
        }
    }
}

// Simple initialization - prevent multiple instances
if (!window.homePageInitialized) {
    console.log('🌐 Initializing HomePage from global scope...');
    const homePage = new HomePage();
    window.homePage = homePage;
    
    // Simple global functions
    window.navigateToCategory = function(categoryName) {
        console.log('Navigate to category:', categoryName);
    };
    
    console.log('✅ HomePage initialized successfully');
} else {
    console.log('⚠️ HomePage already initialized, skipping...');
}
