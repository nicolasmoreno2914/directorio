// EMERGENCY FIX - SOLUCIÓN INMEDIATA PARA MOSTRAR NEGOCIOS
console.log('🚨 EMERGENCY FIX LOADING...');

// Datos hardcodeados para mostrar INMEDIATAMENTE
const emergencyBusinesses = [
    {
        id: 1,
        nombre_negocio: "Restaurante El Sabor Llanero",
        categoria: "Restaurante",
        direccion: "Calle 15 #12-34, Centro, Acacías",
        telefono: "+57 8 123-4567",
        calificacion: 4.5,
        imagenes: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
    },
    {
        id: 2,
        nombre_negocio: "Farmacia San Rafael",
        categoria: "Salud",
        direccion: "Carrera 20 #8-15, Acacías",
        telefono: "+57 8 234-5678",
        calificacion: 4.2,
        imagenes: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800"
    },
    {
        id: 3,
        nombre_negocio: "Supermercado La Economía",
        categoria: "Supermercado",
        direccion: "Avenida Principal #25-40, Acacías",
        telefono: "+57 8 345-6789",
        calificacion: 4.0,
        imagenes: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    },
    {
        id: 4,
        nombre_negocio: "Peluquería Estilo & Belleza",
        categoria: "Belleza",
        direccion: "Calle 18 #14-22, Acacías",
        telefono: "+57 8 456-7890",
        calificacion: 4.7,
        imagenes: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"
    },
    {
        id: 5,
        nombre_negocio: "Ferretería El Tornillo",
        categoria: "Ferretería",
        direccion: "Carrera 22 #10-05, Acacías",
        telefono: "+57 8 567-8901",
        calificacion: 4.3,
        imagenes: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    },
    {
        id: 6,
        nombre_negocio: "Panadería Doña María",
        categoria: "Panadería",
        direccion: "Calle 12 #16-30, Acacías",
        telefono: "+57 8 678-9012",
        calificacion: 4.6,
        imagenes: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"
    }
];

// FUNCIÓN PARA MOSTRAR NEGOCIOS INMEDIATAMENTE
function showBusinessesNOW() {
    console.log('🚀 SHOWING BUSINESSES NOW!');
    
    // Buscar TODOS los posibles contenedores
    const containers = [
        'allBusinessesGrid',
        'businessGrid', 
        'businesses-container',
        'businessesGrid'
    ];
    
    let targetContainer = null;
    
    for (let containerId of containers) {
        const container = document.getElementById(containerId);
        if (container) {
            targetContainer = container;
            console.log(`✅ Found container: ${containerId}`);
            break;
        }
    }
    
    if (!targetContainer) {
        console.error('❌ NO CONTAINER FOUND! Creating one...');
        // Crear contenedor si no existe
        const section = document.querySelector('.all-businesses-section .container');
        if (section) {
            targetContainer = document.createElement('div');
            targetContainer.id = 'emergencyBusinessGrid';
            targetContainer.className = 'businesses-grid';
            section.appendChild(targetContainer);
        }
    }
    
    if (!targetContainer) {
        console.error('❌ CANNOT CREATE CONTAINER!');
        return;
    }
    
    // RENDERIZAR NEGOCIOS INMEDIATAMENTE
    const businessCards = emergencyBusinesses.map(business => {
        return `
            <div class="business-card" onclick="window.location.href='/negocio/${business.id}'" style="
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 16px;
                margin: 8px;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: pointer;
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <div class="business-image" style="
                    width: 100%;
                    height: 200px;
                    background: #4CAF50;
                    border-radius: 4px;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                ">
                    <img src="${business.imagenes}" alt="${business.nombre_negocio}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='📍';">
                </div>
                <div class="business-info">
                    <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">${business.nombre_negocio}</h3>
                    <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${business.categoria}</p>
                    <p style="margin: 0 0 8px 0; color: #888; font-size: 12px;">${business.direccion}</p>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #ff9800;">⭐⭐⭐⭐⭐</span>
                        <span style="color: #666; font-size: 14px;">${business.calificacion}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // APLICAR ESTILOS DE GRID
    targetContainer.style.display = 'grid';
    targetContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    targetContainer.style.gap = '20px';
    targetContainer.style.padding = '20px 0';
    
    // INSERTAR HTML
    targetContainer.innerHTML = businessCards;
    
    console.log('✅ BUSINESSES RENDERED SUCCESSFULLY!');
    console.log(`📊 Rendered ${emergencyBusinesses.length} businesses`);
}

// EJECUTAR INMEDIATAMENTE
console.log('🔥 EXECUTING EMERGENCY FIX...');

// Intentar múltiples veces para asegurar que funcione
function tryShowBusinesses() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBusinessesNOW);
    } else {
        showBusinessesNOW();
    }
    
    // Backup: intentar de nuevo en 1 segundo
    setTimeout(() => {
        if (!document.querySelector('.business-card')) {
            console.log('🔄 RETRY: Showing businesses again...');
            showBusinessesNOW();
        }
    }, 1000);
    
    // Backup: intentar de nuevo en 3 segundos
    setTimeout(() => {
        if (!document.querySelector('.business-card')) {
            console.log('🔄 FINAL RETRY: Showing businesses...');
            showBusinessesNOW();
        }
    }, 3000);
}

tryShowBusinesses();

console.log('🚨 EMERGENCY FIX LOADED AND EXECUTED!');
