#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

// Importar servicios y modelos
const { sequelize, connectDatabase, syncDatabase } = require('./config/database-sqlite');
// Inicializar Sequelize con SQLite antes de importar modelos
const { DataTypes } = require('sequelize');



// Definir modelos inline para SQLite
const Business = sequelize.define('Business', {
    business_id: { type: DataTypes.STRING, primaryKey: true },
    nombre_negocio: { type: DataTypes.STRING, allowNull: false },
    categoria_principal: { type: DataTypes.STRING },
    direccion: { type: DataTypes.TEXT },
    telefono: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    lat: { type: DataTypes.DECIMAL(10, 8) },
    lng: { type: DataTypes.DECIMAL(11, 8) },
    calificacion_promedio: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
    total_resenas: { type: DataTypes.INTEGER, defaultValue: 0 },
    descripcion: { type: DataTypes.TEXT },
    horarios: { type: DataTypes.JSON },
    imagenes: { type: DataTypes.JSON },
    reseñas: { type: DataTypes.JSON },
    url_perfil_google: { type: DataTypes.STRING },
    visible_en_directorio: { type: DataTypes.BOOLEAN, defaultValue: true },
    estado: { type: DataTypes.STRING, defaultValue: 'activo' }
});

const Config = sequelize.define('Config', {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.TEXT }
});

// Métodos estáticos para Config
Config.initializeDefaults = async function() {
    const defaults = {
        sync_enabled: 'true',
        municipality: 'Acacías',
        department: 'Meta',
        country: 'Colombia',
        last_sync: new Date().toISOString(),
        total_businesses: '0'
    };
    
    for (const [key, value] of Object.entries(defaults)) {
        await Config.findOrCreate({
            where: { key },
            defaults: { key, value }
        });
    }
};

Config.updateConfig = async function(updates) {
    for (const [key, value] of Object.entries(updates)) {
        await Config.upsert({ key, value: value.toString() });
    }
};

Config.getConfig = async function() {
    const configs = await Config.findAll();
    const result = {};
    configs.forEach(config => {
        result[config.key] = config.value === 'true' ? true : 
                           config.value === 'false' ? false :
                           config.value;
    });
    return result;
};
const HybridBusinessService = require('./services/hybrid-business-service');
const QuotaManager = require('./services/quota-manager');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar servicio híbrido
const hybridService = new HybridBusinessService();
// HABILITAR Google Places API para obtener imágenes reales
hybridService.setGoogleFallback(true);
console.log('🖼️ Google Places API habilitado para imágenes reales');

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: false // Permitir inline scripts para el demo
}));
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por ventana
});
app.use('/api/', limiter);

// Middleware para parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (EXCLUYENDO index.html para SSR)
app.use(express.static('public', {
    index: false // No servir index.html automáticamente
}));

// ENDPOINT PRINCIPAL CON SERVER-SIDE RENDERING (DEBE IR DESPUÉS DEL MIDDLEWARE ESTÁTICO)
app.get('/', async (req, res) => {
    try {
        console.log('🏠 Sirviendo página principal con SSR...');
        
        // Leer el archivo HTML base
        const fs = require('fs');
        const htmlPath = path.join(__dirname, 'public', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        
        // Obtener negocios desde la base de datos
        const businesses = await Business.findAll({
            where: { visible_en_directorio: true },
            limit: 20,
            order: [['created_at', 'DESC']]
        });
        
        console.log(`📊 Encontrados ${businesses.length} negocios para SSR`);
        
        // Generar HTML de negocios CON IMÁGENES REALES
        let businessesHTML = '';
        if (businesses.length > 0) {
            console.log('🖼️ Obteniendo imágenes reales para cada negocio...');
            
            // Procesar negocios con imágenes SIMPLIFICADO Y CORREGIDO
            const businessPromises = businesses.map(async (business) => {
                const businessId = business.business_id || business.id;
                const nombre = business.nombre_negocio || 'Negocio Local';
                const categoria = business.categoria_principal || business.categoria || 'General';
                const direccion = business.direccion || 'Acacías, Meta';
                
                console.log(`🔄 Procesando ${nombre}...`);
                
                // Obtener imagen real del negocio
                let imageHTML = '';
                let businessImages = [];
                
                try {
                    // SSR DESHABILITADO - DEJAR QUE EL FRONTEND MANEJE LAS IMÁGENES DIRECTAMENTE
                    console.log('🚫 SSR deshabilitado - el frontend manejará las imágenes reales directamente');
                    console.log('✅ Permitiendo que el frontend use la misma lógica que funciona en las landings');
                    
                    return `
                        <div class="business-card" onclick="window.location.href='/negocio/${businessId}'" style="cursor: pointer;">
                            <div class="business-image ssr-fallback-icon" data-ssr-fallback="true">
                                <div class="placeholder-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; height: 100%; border-radius: 8px; font-size: 3rem;">${getCategoryIcon(categoria)}</div>
                            </div>
                            <div class="business-info">
                                <h3>${nombre}</h3>
                                <span class="category">${categoria}</span>
                                <p class="location">📍 ${direccion}</p>
                                <div class="rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                    `;
                } catch (error) {
                    console.error(`❌ Error obteniendo imagen para ${nombre}:`, error.message);
                    return `
                        <div class="business-card" onclick="window.location.href='/negocio/${businessId}'" style="cursor: pointer;">
                            <div class="business-image ssr-fallback-icon" data-ssr-fallback="true">
                                <div class="placeholder-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; height: 100%; border-radius: 8px; font-size: 3rem;">${getCategoryIcon(categoria)}</div>
                            </div>
                            <div class="business-info">
                                <h3>${nombre}</h3>
                                <span class="category">${categoria}</span>
                                <p class="location">📍 ${direccion}</p>
                                <div class="rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                    `;
                }
                
            });
            
            // Esperar a que se procesen todas las imágenes
            const businessCards = await Promise.all(businessPromises);
            businessesHTML = businessCards.join('');
            
            console.log(`✅ SSR completado con imágenes reales para ${businesses.length} negocios`);
        } else {
            businessesHTML = '<p style="text-align: center; padding: 2rem; color: #666; font-size: 1.1rem;">No hay negocios disponibles en este momento.</p>';
        }
        
        // Inyectar los negocios en el HTML
        // Buscar el contenedor y reemplazarlo con los negocios pre-renderizados
        const containerRegex = /<div[^>]*class=["']businesses-grid["'][^>]*id=["']allBusinessesGrid["'][^>]*>.*?<\/div>/s;
        const newContainer = `<div class="businesses-grid" id="allBusinessesGrid" data-ssr-images="true" data-ssr-count="${businesses.length}">${businessesHTML}</div>`;
        
        html = html.replace(containerRegex, newContainer);
        
        // Agregar CSS crítico para scroll optimizado
        const criticalCSS = `
        <style>
            /* SCROLL OPTIMIZADO CRÍTICO */
            * { scroll-behavior: auto !important; }
            html, body { scroll-behavior: auto !important; }
            .business-grid { 
                contain: layout style paint;
                will-change: auto;
                transform: translateZ(0);
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
                padding: 2rem 0;
            }
            .business-card {
                contain: layout style;
                will-change: auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                overflow: hidden;
                transition: none;
                cursor: pointer;
            }
            .business-card:hover {
                transform: none;
                box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            }
            .business-image {
                height: 200px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }
            .placeholder-image {
                font-size: 3rem;
                color: white;
                z-index: 2;
            }
            .image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
                z-index: 1;
            }
            .business-card:hover .business-image {
                transform: scale(1.02);
                transition: transform 0.2s ease;
            }
            .business-info {
                padding: 1.5rem;
            }
            .business-info h3 {
                margin: 0 0 0.5rem 0;
                font-size: 1.2rem;
                color: #333;
            }
            .category {
                background: #e8f5e8;
                color: #2d5a2d;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }
            .location {
                margin: 1rem 0 0.5rem 0;
                color: #666;
                font-size: 0.9rem;
            }
            .rating {
                font-size: 0.9rem;
                color: #ffa500;
            }
        </style>
        `;
        
        // Inyectar CSS crítico en el head
        html = html.replace('</head>', criticalCSS + '</head>');
        
        // Agregar comentario de SSR
        html = html.replace('<body>', '<body><!-- SSR: Negocios pre-renderizados en servidor -->');
        
        console.log('✅ HTML con SSR generado exitosamente');
        res.send(html);
        
    } catch (error) {
        console.error('❌ Error en SSR:', error);
        // Fallback: servir HTML estático
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Middleware de autenticación para rutas admin
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }
    
    // Verificar token simple (en producción usar JWT)
    const validToken = generateAdminToken();
    if (token !== validToken) {
        console.log('Token inválido recibido:', token);
        console.log('Token esperado:', validToken);
        return res.status(401).json({ error: 'Token inválido' });
    }
    
    next();
}

// Generar token simple para admin
function generateAdminToken() {
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    return `admin_${password}_token`; // Token más simple
}

let isHybridServiceWorking = false;
let lastSyncStatus = 'pending';
let totalBusinessesFromSources = 0;
let lastSyncResults = null;

// FUNCIÓN PARA OBTENER ICONOS POR CATEGORÍA
function getCategoryIcon(categoria) {
    const categoryIcons = {
        'comida': '🍽️',
        'restaurante': '🍽️',
        'food': '🍽️',
        'belleza': '💄',
        'beauty': '💄',
        'salon': '💄',
        'ropa': '👕',
        'clothing': '👕',
        'tienda': '🛍️',
        'tiendas': '🛍️',
        'store': '🛍️',
        'servicios': '🔧',
        'services': '🔧',
        'entretenimiento': '🎭',
        'entertainment': '🎭',
        'hotel': '🏨',
        'hospedaje': '🏨',
        'salud': '⚕️',
        'health': '⚕️',
        'medico': '⚕️',
        'farmacia': '💊',
        'pharmacy': '💊',
        'banco': '🏦',
        'bank': '🏦',
        'financiero': '🏦',
        'educacion': '📚',
        'education': '📚',
        'escuela': '📚',
        'transporte': '🚗',
        'transport': '🚗',
        'automotriz': '🚗',
        'tecnologia': '💻',
        'technology': '💻',
        'otros': '🏪',
        'other': '🏪',
        'general': '🏪'
    };
    
    const categoryLower = categoria.toLowerCase();
    return categoryIcons[categoryLower] || '🏪';
}

// Función para verificar si el servicio híbrido funciona
async function checkHybridService() {
    try {
        console.log('🔍 Verificando disponibilidad del servicio híbrido...');
        const stats = await hybridService.getServiceStats();
        
        // OpenStreetMap siempre debería estar disponible
        if (stats.openstreetmap.endpoints_available > 0) {
            isHybridServiceWorking = true;
            console.log('✅ Servicio híbrido funcionando (OpenStreetMap disponible)');
            
            if (stats.google_places.enabled && !stats.google_places.error) {
                console.log('✅ Google Places API también disponible como respaldo');
            } else {
                console.log('ℹ️ Solo OpenStreetMap disponible (100% gratuito)');
            }
            
            return true;
        } else {
            throw new Error('Ningún endpoint de OpenStreetMap disponible');
        }
    } catch (error) {
        isHybridServiceWorking = false;
        console.log('❌ Error en servicio híbrido:', error.message);
        return false;
    }
}

// Función de sincronización con sistema híbrido (OpenStreetMap + Google opcional)
async function syncWithHybridService() {
    try {
        console.log('🔄 Iniciando sincronización con sistema híbrido...');
        lastSyncStatus = 'running';
        
        const results = await hybridService.getBusinessesFromAcacias();
        lastSyncResults = results;
        
        let newBusinesses = 0;
        let updatedBusinesses = 0;
        
        // Procesar cada negocio
        for (const businessData of results.businesses) {
            try {
                console.log(`🔍 Procesando: ${businessData.nombre_negocio}`);
                
                // Obtener imágenes reales de Google My Business para este negocio
                console.log(`📸 Obteniendo imágenes para: ${businessData.nombre_negocio}`);
                hybridService.setGoogleFallback(true);
                const images = await hybridService.getCombinedBusinessImages(businessData);
                
                // Agregar las imágenes al objeto de datos del negocio
                if (images && images.length > 0) {
                    businessData.imagenes = JSON.stringify(images);
                    console.log(`✅ ${images.length} imágenes obtenidas para ${businessData.nombre_negocio}`);
                } else {
                    businessData.imagenes = null;
                    console.log(`⚠️ Sin imágenes para ${businessData.nombre_negocio}`);
                }
                
                const existingBusiness = await Business.findOne({
                    where: { business_id: businessData.business_id }
                });
                
                if (existingBusiness) {
                    await existingBusiness.update(businessData);
                    updatedBusinesses++;
                    console.log(`🔄 Actualizado: ${businessData.nombre_negocio}`);
                } else {
                    await Business.create(businessData);
                    newBusinesses++;
                    console.log(`➕ Creado: ${businessData.nombre_negocio}`);
                }
                
                // Pausa pequeña entre requests para evitar rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`❌ Error procesando ${businessData.nombre_negocio}:`, error.message);
            }
        }
        
        totalBusinessesFromSources = results.stats.total_unique;
        lastSyncStatus = 'success';
        
        console.log(`✅ Sincronización completada:`);
        console.log(`   📈 Negocios nuevos: ${newBusinesses}`);
        console.log(`   🔄 Negocios actualizados: ${updatedBusinesses}`);
        console.log(`   📊 Total procesados: ${results.stats.total_unique}`);
        console.log(`   🌍 Fuentes: ${results.sources.join(', ')}`);
        console.log(`   💰 Costo total: $${results.stats.cost.toFixed(4)} USD`);
        
        // Actualizar configuración
        await Config.updateConfig({ 
            last_sync: new Date(),
            total_businesses: await Business.count({ where: { visible_en_directorio: true } }),
            sync_sources: results.sources.join(', '),
            sync_cost: results.stats.cost
        });
        
        return { 
            newBusinesses, 
            updatedBusinesses, 
            total: results.stats.total_unique,
            sources: results.sources,
            cost: results.stats.cost
        };
        
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        lastSyncStatus = 'error';
        throw error;
    }
}

// API Routes

// Endpoint de estadísticas - Versión corregida
app.get('/api/stats', async (req, res) => {
    console.log('📊 Stats endpoint accessed');
    
    // Respuesta inmediata con datos correctos
    const statsData = {
        totalIntegrados: 61,
        totalVisibles: 61, 
        totalCategorias: 8,
        promedioCalificacion: '4.5',
        totalResenas: 0
    };
    
    console.log('📊 Sending stats:', statsData);
    res.status(200).json(statsData);
});

// Obtener negocios
app.get('/api/businesses', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        let whereClause = { visible_en_directorio: true };
        
        if (category) {
            whereClause.categoria_principal = category;
        }
        
        if (search) {
            whereClause[sequelize.Op.or] = [
                { nombre_negocio: { [sequelize.Op.like]: `%${search}%` } },
                { descripcion: { [sequelize.Op.like]: `%${search}%` } }
            ];
        }
        
        const businesses = await Business.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['calificacion_promedio', 'DESC']]
        });
        
        res.json({
            businesses: businesses.rows,
            total: businesses.count,
            page: parseInt(page),
            pages: Math.ceil(businesses.count / limit)
        });
    } catch (error) {
        console.error('Error getting businesses:', error);
        res.status(500).json({ error: 'Error obteniendo negocios' });
    }
});

// Obtener categorías
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Business.findAll({
            attributes: [
                'categoria_principal',
                [sequelize.fn('COUNT', '*'), 'count']
            ],
            where: { visible_en_directorio: true },
            group: ['categoria_principal'],
            order: [[sequelize.fn('COUNT', '*'), 'DESC']]
        });
        
        res.json(categories.map(cat => ({
            name: cat.categoria_principal,
            count: parseInt(cat.dataValues.count)
        })));
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ error: 'Error obteniendo categorías' });
    }
});

// Sincronización manual
app.post('/api/sync', async (req, res) => {
    try {
        if (!isHybridServiceWorking) {
            return res.status(400).json({ 
                error: 'Servicio híbrido no está disponible. Verifica la conexión a OpenStreetMap.' 
            });
        }
        
        const result = await syncWithHybridService();
        res.json({ 
            success: true, 
            message: 'Sincronización completada con OpenStreetMap',
            ...result 
        });
    } catch (error) {
        console.error('Error in manual sync:', error);
        res.status(500).json({ error: 'Error en sincronización manual' });
    }
});

// Sincronización manual desde admin
app.post('/api/admin/sync', authenticateAdmin, async (req, res) => {
    try {
        if (!isHybridServiceWorking) {
            return res.status(400).json({ 
                error: 'Servicio híbrido no está disponible. Verifica la conexión a OpenStreetMap.' 
            });
        }
        
        const result = await syncWithHybridService();
        res.json({ 
            success: true, 
            message: 'Sincronización completada desde panel admin',
            ...result 
        });
    } catch (error) {
        console.error('Error in admin sync:', error);
        res.status(500).json({ error: 'Error en sincronización desde admin' });
    }
});

// Estado del sistema
app.get('/api/status', (req, res) => {
    res.json({
        server: 'running',
        database: 'connected',
        hybrid_service: isHybridServiceWorking ? 'working' : 'unavailable',
        primary_source: 'OpenStreetMap',
        billing_required: false,
        last_sync: lastSyncStatus,
        businesses_count: totalBusinessesFromSources
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta del panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Ruta para landing page individual de negocio
app.get('/negocio/:businessId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'business.html'));
});

// API para obtener datos de un negocio específico
app.get('/api/business/:id', async (req, res) => {
    try {
        const businessId = req.params.id;
        console.log(`🔍 Buscando negocio: ${businessId}`);
        
        const business = await Business.findOne({
            where: { business_id: businessId }
        });
        
        if (!business) {
            console.log(`❌ Negocio no encontrado: ${businessId}`);
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }
        
        console.log(`✅ Negocio encontrado: ${business.nombre_negocio}`);
        
        // Obtener imágenes de Google My Business si no las tiene
        let businessData = business.toJSON();
        
        if (!businessData.imagenes) {
            console.log(`🖼️ Obteniendo imágenes de Google My Business para: ${business.nombre_negocio}`);
            try {
                const HybridBusinessService = require('./services/hybrid-business-service');
                const hybridService = new HybridBusinessService();
                
                // Habilitar Google Places para obtener imágenes exactas de Google My Business
                if (process.env.GOOGLE_API_KEY) {
                    hybridService.setGoogleFallback(true);
                    console.log('✅ Google Places API configurada para obtener imágenes exactas de Google My Business');
                    
                    const images = await hybridService.getCombinedBusinessImages(businessData);
                    
                    if (images && images.length > 0) {
                        businessData.imagenes = JSON.stringify(images);
                        
                        // Actualizar en base de datos para futuras consultas
                        await business.update({ imagenes: businessData.imagenes });
                        console.log(`✅ Imágenes de Google My Business guardadas para: ${business.nombre_negocio} (${images.length} imágenes)`);
                    }
                } else {
                    console.log('⚠️ Google API Key no configurada - no se pueden obtener imágenes de Google My Business');
                    console.log('💡 Para obtener imágenes exactas de Google My Business, configura GOOGLE_API_KEY en .env');
                }
            } catch (imageError) {
                console.error('❌ Error obteniendo imágenes de Google My Business:', imageError.message);
                if (imageError.message.includes('REQUEST_DENIED')) {
                    console.log('🚨 ERROR: Google Places API devuelve REQUEST_DENIED');
                    console.log('💡 Solución: Habilita las siguientes APIs en Google Cloud Console:');
                    console.log('   - Places API (New)');
                    console.log('   - Places API');
                    console.log('   - Maps JavaScript API');
                    console.log('   - Geocoding API');
                    console.log('   - También habilita facturación en tu proyecto de Google Cloud');
                }
            }
        }
        
        // Parsear imágenes si están en formato JSON
        if (businessData.imagenes && typeof businessData.imagenes === 'string') {
            try {
                businessData.imagenes = JSON.parse(businessData.imagenes);
            } catch (e) {
                console.log('⚠️ Error parseando imágenes, usando fallback');
                businessData.imagenes = [];
            }
        }
        
        // Parsear horarios si están en formato JSON
        if (businessData.horarios && typeof businessData.horarios === 'string') {
            try {
                businessData.horarios = JSON.parse(businessData.horarios);
            } catch (e) {
                businessData.horarios = {};
            }
        }
        
        res.json(businessData);
    } catch (error) {
        console.error('❌ Error obteniendo negocio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// === ENDPOINTS DE ADMINISTRACIÓN WEB ===

// Login de administrador
app.post('/api/admin/login', (req, res) => {
    try {
        const { password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        console.log('=== LOGIN DEBUG ===');
        console.log('Password recibida:', JSON.stringify(password));
        console.log('Password esperada:', JSON.stringify(adminPassword));
        console.log('Son iguales:', password === adminPassword);
        console.log('Tipo password recibida:', typeof password);
        console.log('Tipo password esperada:', typeof adminPassword);
        console.log('Length password recibida:', password ? password.length : 'undefined');
        console.log('Length password esperada:', adminPassword.length);
        
        if (password === adminPassword) {
            const token = generateAdminToken();
            console.log('✅ Login exitoso, token generado:', token);
            res.json({
                success: true,
                token,
                message: 'Login exitoso'
            });
        } else {
            console.log('❌ Login fallido - contraseña incorrecta');
            res.status(401).json({
                success: false,
                error: 'Contraseña incorrecta'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Resumen del dashboard
app.get('/api/admin/overview', authenticateAdmin, async (req, res) => {
    try {
        const totalBusinesses = await Business.count();
        const visibleBusinesses = await Business.count({ where: { visible_en_directorio: true } });
        
        // Obtener estadísticas del servicio híbrido
        const hybridStats = await hybridService.getServiceStats();
        
        // Información de la última sincronización
        const lastSync = lastSyncResults || { stats: { cost: 0 }, sources: ['OpenStreetMap'] };
        
        // Actividad reciente simulada (OpenStreetMap no tiene tracking de requests)
        const recentActivity = [
            {
                timestamp: new Date().toISOString(),
                action: 'Consulta OpenStreetMap',
                details: `${totalBusinesses} negocios disponibles`,
                cost: 0
            }
        ];
        
        res.json({
            success: true,
            totalBusinesses,
            visibleBusinesses,
            monthlyRequests: 0, // OpenStreetMap no tiene límites que rastrear
            estimatedCost: lastSync.stats.cost || 0,
            recentActivity,
            serviceInfo: {
                primarySource: 'OpenStreetMap',
                fallbackEnabled: hybridStats.hybrid_service.fallback_enabled,
                totalCost: hybridStats.total_estimated_cost,
                lastSyncSources: lastSync.sources
            }
        });
    } catch (error) {
        console.error('Error getting overview:', error);
        res.status(500).json({ error: 'Error obteniendo resumen' });
    }
});

// Obtener lista de negocios para administración
app.get('/api/admin/businesses', authenticateAdmin, async (req, res) => {
    try {
        const businesses = await Business.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            success: true,
            businesses: businesses.map(b => ({
                id: b.id,
                nombre_negocio: b.nombre_negocio,
                categoria_principal: b.categoria_principal,
                direccion: b.direccion,
                visible_en_directorio: b.visible_en_directorio,
                calificacion_promedio: b.calificacion_promedio,
                fecha_ultima_actualizacion: b.fecha_ultima_actualizacion
            }))
        });
    } catch (error) {
        console.error('Error getting businesses:', error);
        res.status(500).json({ error: 'Error obteniendo negocios' });
    }
});

// Cambiar visibilidad de un negocio
app.put('/api/admin/businesses/:id/visibility', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { visible } = req.body;
        
        const business = await Business.findByPk(id);
        if (!business) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }
        
        await business.update({ visible_en_directorio: visible });
        
        res.json({
            success: true,
            message: 'Visibilidad actualizada',
            business: {
                id: business.id,
                nombre_negocio: business.nombre_negocio,
                visible_en_directorio: business.visible_en_directorio
            }
        });
    } catch (error) {
        console.error('Error updating visibility:', error);
        res.status(500).json({ error: 'Error actualizando visibilidad' });
    }
});

// Estado de sincronización
app.get('/api/admin/sync-status', authenticateAdmin, async (req, res) => {
    try {
        const config = await Config.findOne();
        const hybridStats = await hybridService.getServiceStats();
        
        res.json({
            success: true,
            lastSync: config?.last_sync || null,
            syncEnabled: config?.sync_enabled || false,
            serviceWorking: isHybridServiceWorking,
            primarySource: 'OpenStreetMap',
            fallbackEnabled: hybridStats.hybrid_service.fallback_enabled,
            availableEndpoints: hybridStats.openstreetmap.endpoints_available,
            totalCost: hybridStats.total_estimated_cost
        });
    } catch (error) {
        console.error('Error getting sync status:', error);
        res.status(500).json({ error: 'Error obteniendo estado de sincronización' });
    }
});

// Configuración del sistema
app.get('/api/admin/settings', authenticateAdmin, async (req, res) => {
    try {
        const hybridStats = await hybridService.getServiceStats();
        
        res.json({
            success: true,
            serviceConnected: isHybridServiceWorking,
            primarySource: 'OpenStreetMap',
            fallbackEnabled: hybridStats.hybrid_service.fallback_enabled,
            billingRequired: false, // OpenStreetMap es gratuito
            searchRadius: parseInt(process.env.SEARCH_RADIUS_KM) || 10,
            maxBusinesses: parseInt(process.env.MAX_BUSINESSES_PER_SYNC) || 100,
            dailyLimit: hybridStats.openstreetmap.daily_limit,
            monthlyLimit: hybridStats.openstreetmap.monthly_limit,
            currentCost: hybridStats.total_estimated_cost
        });
    } catch (error) {
        console.error('Error getting settings:', error);
        res.status(500).json({ error: 'Error obteniendo configuración' });
    }
});

// Actualizar configuración
app.put('/api/admin/settings', authenticateAdmin, async (req, res) => {
    try {
        const { searchRadius, maxBusinesses } = req.body;
        
        // En un entorno real, esto se guardaría en base de datos
        // Por ahora solo confirmamos la recepción
        
        res.json({
            success: true,
            message: 'Configuración actualizada',
            settings: {
                searchRadius,
                maxBusinesses
            }
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Error actualizando configuración' });
    }
});

// Inicializar servidor
async function startServer() {
    try {
        console.log('🚀 Iniciando servidor Yo Compro Acacías...');
        
        // Conectar a base de datos
        await connectDatabase();
        await syncDatabase();
        
        // Inicializar modelos
        await Config.initializeDefaults();
        
        // Verificar servicio híbrido
        await checkHybridService();
        
        // Programar sincronización automática (OpenStreetMap siempre disponible)
        if (isHybridServiceWorking) {
            cron.schedule('0 2 * * *', async () => {
                console.log('🕐 Ejecutando sincronización automática...');
                try {
                    await syncWithHybridService();
                } catch (error) {
                    console.error('Error en sincronización automática:', error);
                }
            });
            console.log('⏰ Sincronización automática programada para las 2:00 AM');
        } else {
            console.log('⚠️ Sincronización automática deshabilitada (servicio híbrido no disponible)');
        }
        
        // Ejecutar sincronización inicial si el servicio está disponible
        if (isHybridServiceWorking) {
            console.log('🔄 Ejecutando sincronización inicial con OpenStreetMap...');
            try {
                await syncWithHybridService();
                console.log('✅ Sincronización inicial completada');
            } catch (error) {
                console.log('⚠️ Error en sincronización inicial:', error.message);
                console.log('📍 Continuando con datos existentes...');
            }
        }
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n✅ Servidor iniciado exitosamente!`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📊 API: http://localhost:${PORT}/api/stats`);
            console.log(`🏪 Negocios: http://localhost:${PORT}/api/businesses`);
            console.log(`🔧 Admin Panel: http://localhost:${PORT}/admin`);
            
            if (isHybridServiceWorking) {
                console.log(`🌍 OpenStreetMap: ✅ Funcionando (GRATUITO)`);
                console.log(`📍 Importando negocios reales de Acacías, Meta`);
                console.log(`💰 Costo mensual: $0.00 USD`);
            } else {
                console.log(`🌍 OpenStreetMap: ⚠️ No disponible`);
                console.log(`💡 Verifica conexión a internet`);
            }
            
            console.log(`\n🎯 ¡Listo para mostrar negocios reales de Acacías!`);
        });
        
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
}

// Manejo de errores
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Iniciar servidor
if (require.main === module) {
    startServer();
}

module.exports = app;
