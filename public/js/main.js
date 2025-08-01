// Main JavaScript utilities and shared functions

class YoComproAcacias {
    constructor() {
        this.baseUrl = window.location.origin;
        this.apiUrl = `${this.baseUrl}/api`;
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.init();
    }

    init() {
        // Initialize common functionality
        this.setupErrorHandling();
        this.setupLoadingStates();
    }

    // API Methods
    async apiRequest(endpoint, options = {}) {
        const url = `${this.apiUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            this.showLoading();
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            this.showError('Error de conexión. Por favor, intenta de nuevo.');
            throw error;
        } finally {
            this.hideLoading();
        }
    }

    async getBusinesses(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.apiRequest(`/businesses?${queryString}`);
    }

    async getBusiness(slug) {
        return await this.apiRequest(`/businesses/${slug}`);
    }

    async getCategories() {
        return await this.apiRequest('/businesses/meta/categories');
    }

    async getStats() {
        return await this.apiRequest('/stats');
    }

    async shareBusiness(slug) {
        return await this.apiRequest(`/businesses/${slug}/share`, {
            method: 'POST'
        });
    }

    // UI Methods
    showLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
    }

    showError(message) {
        // Create or update error notification
        let errorDiv = document.getElementById('errorNotification');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorNotification';
            errorDiv.className = 'error-notification';
            document.body.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        errorDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        // Create or update success notification
        let successDiv = document.getElementById('successNotification');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'successNotification';
            successDiv.className = 'success-notification';
            document.body.appendChild(successDiv);
        }

        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        successDiv.style.display = 'block';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (successDiv) {
                successDiv.remove();
            }
        }, 3000);
    }

    // Utility Methods
    formatRating(rating) {
        const stars = Math.round(rating);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }

    formatAddress(address) {
        return address.length > 50 ? address.substring(0, 50) + '...' : address;
    }

    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9 -]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim('-'); // Remove leading/trailing hyphens
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccess('¡Enlace copiado al portapapeles!');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showSuccess('¡Enlace copiado al portapapeles!');
        } catch (err) {
            this.showError('No se pudo copiar el enlace');
        }

        document.body.removeChild(textArea);
    }

    // Social Sharing Methods
    shareOnWhatsApp(url, text) {
        const message = encodeURIComponent(`${text} ${url}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    }

    shareOnFacebook(url) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }

    shareOnTwitter(url, text) {
        const tweet = encodeURIComponent(`${text} ${url}`);
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
    }

    // Modal Methods
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Error Handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    setupLoadingStates() {
        // Hide loading spinner on page load
        window.addEventListener('load', () => {
            this.hideLoading();
        });
    }

    // Navigation
    navigateTo(path) {
        window.location.href = path;
    }

    navigateToHome() {
        this.navigateTo('/');
    }

    navigateToBusiness(slug) {
        this.navigateTo(`/${slug}`);
    }

    // Local Storage
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Format hours
    formatHours(hours) {
        const dayNames = {
            'lunes': 'Lunes',
            'martes': 'Martes',
            'miercoles': 'Miércoles',
            'jueves': 'Jueves',
            'viernes': 'Viernes',
            'sabado': 'Sábado',
            'domingo': 'Domingo'
        };

        const formatted = [];
        Object.entries(hours).forEach(([day, time]) => {
            if (time && dayNames[day]) {
                formatted.push(`${dayNames[day]}: ${time}`);
            }
        });

        return formatted;
    }
}

// Initialize the main app
const app = new YoComproAcacias();

// Export for use in other scripts
window.YoComproAcacias = app;
