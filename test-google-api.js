#!/usr/bin/env node

require('dotenv').config();
const GoogleBusinessProfileService = require('./services/google-business-api');

async function testGoogleAPI() {
    console.log('🧪 Probando conexión con Google Business Profile API...\n');
    
    // Verificar variables de entorno
    console.log('📋 Verificando configuración:');
    console.log(`   GOOGLE_API_KEY: ${process.env.GOOGLE_API_KEY ? '✅ Configurada' : '❌ Falta'}`);
    console.log(`   GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Configurada' : '❌ Falta'}`);
    console.log(`   TARGET_LOCATION_LAT: ${process.env.TARGET_LOCATION_LAT || '3.9889'}`);
    console.log(`   TARGET_LOCATION_LNG: ${process.env.TARGET_LOCATION_LNG || '-73.7561'}`);
    console.log(`   SEARCH_RADIUS_KM: ${process.env.SEARCH_RADIUS_KM || '10'}\n`);
    
    if (!process.env.GOOGLE_API_KEY) {
        console.log('❌ ERROR: Falta GOOGLE_API_KEY en el archivo .env');
        console.log('📝 Pasos para configurar:');
        console.log('1. Ve a Google Cloud Console > APIs y servicios > Credenciales');
        console.log('2. Crea una "Clave de API"');
        console.log('3. Agrega GOOGLE_API_KEY=tu_clave_aqui al archivo .env\n');
        return;
    }
    
    try {
        // Inicializar servicio
        const googleService = new GoogleBusinessProfileService();
        
        console.log('🔍 Buscando negocios en Acacías, Meta...');
        console.log('⏳ Esto puede tomar unos segundos...\n');
        
        // Buscar negocios reales
        const businesses = await googleService.getBusinessesFromAcacias();
        
        console.log(`🎉 ¡ÉXITO! Encontrados ${businesses.length} negocios en Acacías:\n`);
        
        // Mostrar primeros 5 negocios encontrados
        businesses.slice(0, 5).forEach((business, index) => {
            console.log(`${index + 1}. 🏪 ${business.nombre_negocio}`);
            console.log(`   📂 Categoría: ${business.categoria_principal}`);
            console.log(`   📍 Dirección: ${business.direccion}`);
            console.log(`   ⭐ Calificación: ${business.calificacion_promedio}/5`);
            console.log(`   📞 Teléfono: ${business.telefono || 'No disponible'}`);
            console.log('');
        });
        
        if (businesses.length > 5) {
            console.log(`... y ${businesses.length - 5} negocios más.\n`);
        }
        
        // Mostrar estadísticas por categoría
        const categoryCounts = {};
        businesses.forEach(business => {
            const category = business.categoria_principal;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        console.log('📊 Distribución por categorías:');
        Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .forEach(([category, count]) => {
                console.log(`   ${category}: ${count} negocios`);
            });
        
        console.log('\n✅ La conexión con Google Business Profile API funciona correctamente!');
        console.log('🚀 Ahora puedes ejecutar la sincronización completa con: npm run sync');
        
    } catch (error) {
        console.error('❌ Error probando Google API:', error.message);
        
        if (error.message.includes('API key')) {
            console.log('\n🔑 Problema con la API Key:');
            console.log('1. Verifica que la API Key sea correcta');
            console.log('2. Asegúrate de que Places API esté habilitada');
            console.log('3. Verifica las restricciones de la API Key');
        } else if (error.message.includes('credentials')) {
            console.log('\n🔐 Problema con las credenciales:');
            console.log('1. Verifica que el archivo google-service-account.json exista');
            console.log('2. Asegúrate de que esté en la ruta correcta: ./config/');
            console.log('3. Verifica que las credenciales sean válidas');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            console.log('\n📊 Problema de cuota:');
            console.log('1. Has excedido el límite de requests de la API');
            console.log('2. Espera un momento e intenta de nuevo');
            console.log('3. Verifica los límites en Google Cloud Console');
        }
        
        console.log('\n📖 Más información en: SETUP_GOOGLE_API.md');
    }
}

// Ejecutar test
if (require.main === module) {
    testGoogleAPI();
}

module.exports = testGoogleAPI;
