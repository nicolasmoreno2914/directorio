#!/usr/bin/env node

require('dotenv').config();
const GooglePlacesService = require('./services/google-places-simple');

async function testPlacesAPI() {
    console.log('🧪 Probando conexión con Google Places API (solo API Key)...\n');
    
    // Verificar variables de entorno
    console.log('📋 Verificando configuración:');
    console.log(`   GOOGLE_API_KEY: ${process.env.GOOGLE_API_KEY ? '✅ Configurada' : '❌ Falta'}`);
    console.log(`   TARGET_LOCATION_LAT: ${process.env.TARGET_LOCATION_LAT || '3.9889'}`);
    console.log(`   TARGET_LOCATION_LNG: ${process.env.TARGET_LOCATION_LNG || '-73.7561'}`);
    console.log(`   SEARCH_RADIUS_KM: ${process.env.SEARCH_RADIUS_KM || '10'}\n`);
    
    if (!process.env.GOOGLE_API_KEY) {
        console.log('❌ ERROR: Falta GOOGLE_API_KEY en el archivo .env');
        console.log('📝 Pasos para configurar:');
        console.log('1. Ve a Google Cloud Console > APIs y servicios > Credenciales');
        console.log('2. Crea una "Clave de API"');
        console.log('3. Habilita "Places API (New)" para esta clave');
        console.log('4. Agrega GOOGLE_API_KEY=tu_clave_aqui al archivo .env\n');
        return;
    }
    
    try {
        // Inicializar servicio simplificado
        const placesService = new GooglePlacesService();
        
        console.log('🔍 Buscando negocios reales en Acacías, Meta...');
        console.log('⏳ Esto puede tomar unos segundos...\n');
        
        // Buscar negocios reales usando solo Places API
        const businesses = await placesService.getBusinessesFromAcacias();
        
        if (businesses.length === 0) {
            console.log('⚠️ No se encontraron negocios en Acacías.');
            console.log('💡 Posibles causas:');
            console.log('   - El radio de búsqueda es muy pequeño');
            console.log('   - Las coordenadas no son correctas');
            console.log('   - Los negocios no están registrados en Google Places');
            return;
        }
        
        console.log(`🎉 ¡ÉXITO! Encontrados ${businesses.length} negocios reales en Acacías:\n`);
        
        // Mostrar primeros 10 negocios encontrados
        businesses.slice(0, 10).forEach((business, index) => {
            console.log(`${index + 1}. 🏪 ${business.nombre_negocio}`);
            console.log(`   📂 Categoría: ${business.categoria_principal}`);
            console.log(`   📍 Dirección: ${business.direccion}`);
            console.log(`   ⭐ Calificación: ${business.calificacion_promedio}/5 (${business.total_resenas} reseñas)`);
            console.log(`   📞 Teléfono: ${business.telefono || 'No disponible'}`);
            if (business.website) {
                console.log(`   🌐 Website: ${business.website}`);
            }
            console.log('');
        });
        
        if (businesses.length > 10) {
            console.log(`... y ${businesses.length - 10} negocios más.\n`);
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
        
        // Calcular estadísticas generales
        const avgRating = businesses.reduce((sum, b) => sum + b.calificacion_promedio, 0) / businesses.length;
        const totalReviews = businesses.reduce((sum, b) => sum + b.total_resenas, 0);
        
        console.log('\n📈 Estadísticas generales:');
        console.log(`   📊 Total de negocios: ${businesses.length}`);
        console.log(`   ⭐ Calificación promedio: ${avgRating.toFixed(1)}/5`);
        console.log(`   💬 Total de reseñas: ${totalReviews.toLocaleString()}`);
        console.log(`   🏷️ Categorías únicas: ${Object.keys(categoryCounts).length}`);
        
        console.log('\n✅ ¡La conexión con Google Places API funciona perfectamente!');
        console.log('🚀 Estos son negocios REALES de Acacías obtenidos de Google Places');
        console.log('💾 Ahora puedes sincronizar estos datos con la base de datos');
        
    } catch (error) {
        console.error('❌ Error probando Google Places API:', error.message);
        
        if (error.message.includes('API key')) {
            console.log('\n🔑 Problema con la API Key:');
            console.log('1. Verifica que la API Key sea correcta');
            console.log('2. Asegúrate de que Places API esté habilitada');
            console.log('3. Verifica las restricciones de la API Key en Google Cloud Console');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            console.log('\n📊 Problema de cuota:');
            console.log('1. Has excedido el límite de requests de la API');
            console.log('2. Espera un momento e intenta de nuevo');
            console.log('3. Verifica los límites en Google Cloud Console');
        } else if (error.message.includes('REQUEST_DENIED')) {
            console.log('\n🚫 Acceso denegado:');
            console.log('1. Verifica que Places API esté habilitada en tu proyecto');
            console.log('2. Asegúrate de que la API Key tenga permisos para Places API');
            console.log('3. Revisa las restricciones de la API Key');
        }
        
        console.log('\n📖 Más información en: SETUP_GOOGLE_API.md');
    }
}

// Ejecutar test
if (require.main === module) {
    testPlacesAPI();
}

module.exports = testPlacesAPI;
