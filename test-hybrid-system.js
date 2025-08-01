// Script de prueba para el sistema híbrido de negocios
require('dotenv').config();
const HybridBusinessService = require('./services/hybrid-business-service');

async function testHybridSystem() {
    console.log('🧪 PRUEBA DEL SISTEMA HÍBRIDO DE NEGOCIOS');
    console.log('==========================================\n');

    const hybridService = new HybridBusinessService();

    try {
        // 1. Probar solo con OpenStreetMap (gratuito)
        console.log('📍 FASE 1: Probando OpenStreetMap (100% gratuito)');
        console.log('------------------------------------------------');
        
        hybridService.setGoogleFallback(false);
        const osmResults = await hybridService.getBusinessesFromAcacias();
        
        console.log('\n✅ RESULTADOS OPENSTREETMAP:');
        console.log(`   📊 Total negocios: ${osmResults.stats.total_unique}`);
        console.log(`   🌍 Fuentes: ${osmResults.sources.join(', ')}`);
        console.log(`   💰 Costo: $${osmResults.stats.cost.toFixed(4)} USD`);
        
        // Mostrar algunos ejemplos
        if (osmResults.businesses.length > 0) {
            console.log('\n📋 EJEMPLOS DE NEGOCIOS ENCONTRADOS:');
            osmResults.businesses.slice(0, 5).forEach((business, index) => {
                console.log(`   ${index + 1}. ${business.name}`);
                console.log(`      📍 ${business.address}`);
                console.log(`      🏷️  ${business.category}`);
                console.log(`      📞 ${business.phone || 'Sin teléfono'}`);
                console.log(`      🌐 ${business.website || 'Sin website'}`);
                console.log(`      📊 Fuente: ${business.source}`);
                console.log('');
            });
        }

        // 2. Obtener estadísticas del servicio
        console.log('\n📈 ESTADÍSTICAS DEL SERVICIO:');
        console.log('-----------------------------');
        const stats = await hybridService.getServiceStats();
        
        console.log('OpenStreetMap:');
        console.log(`   • Límite diario: ${stats.openstreetmap.daily_limit.toLocaleString()} requests`);
        console.log(`   • Límite mensual: ${stats.openstreetmap.monthly_limit.toLocaleString()} requests`);
        console.log(`   • Costo: $${stats.openstreetmap.cost} USD (GRATIS)`);
        console.log(`   • Endpoints disponibles: ${stats.openstreetmap.endpoints_available}`);
        
        console.log('\nGoogle Places API:');
        console.log(`   • Estado: ${stats.google_places.enabled ? 'HABILITADO' : 'DESHABILITADO'}`);
        console.log(`   • Costo estimado: $${stats.total_estimated_cost.toFixed(4)} USD`);

        // 3. Probar sistema híbrido (si Google está disponible)
        console.log('\n📍 FASE 2: Probando sistema híbrido (OSM + Google)');
        console.log('--------------------------------------------------');
        
        hybridService.setGoogleFallback(true);
        
        try {
            const hybridResults = await hybridService.getBusinessesFromAcacias();
            
            console.log('\n✅ RESULTADOS HÍBRIDOS:');
            console.log(`   📊 Total negocios: ${hybridResults.stats.total_unique}`);
            console.log(`   🌍 OpenStreetMap: ${hybridResults.stats.osm_count} negocios`);
            console.log(`   🔍 Google Places: ${hybridResults.stats.google_count} negocios`);
            console.log(`   🔗 Fuentes: ${hybridResults.sources.join(', ')}`);
            console.log(`   💰 Costo total: $${hybridResults.stats.cost.toFixed(4)} USD`);
            
            // Comparar con solo OSM
            const improvement = hybridResults.stats.total_unique - osmResults.stats.total_unique;
            if (improvement > 0) {
                console.log(`   📈 Mejora: +${improvement} negocios adicionales con Google`);
            }
            
        } catch (hybridError) {
            console.log(`⚠️ Sistema híbrido no disponible: ${hybridError.message}`);
            console.log('✅ Continuando solo con OpenStreetMap (sin costo)');
        }

        // 4. Análisis de categorías
        console.log('\n📊 ANÁLISIS POR CATEGORÍAS:');
        console.log('---------------------------');
        const categories = {};
        osmResults.businesses.forEach(business => {
            categories[business.category] = (categories[business.category] || 0) + 1;
        });
        
        Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .forEach(([category, count]) => {
                console.log(`   ${category}: ${count} negocios`);
            });

        // 5. Recomendaciones
        console.log('\n💡 RECOMENDACIONES:');
        console.log('-------------------');
        console.log('✅ OpenStreetMap es COMPLETAMENTE GRATUITO');
        console.log('✅ 10,000 requests diarios vs 1,000 de Google');
        console.log('✅ Sin restricciones comerciales');
        console.log('✅ Datos actualizados por la comunidad');
        
        if (osmResults.businesses.length > 50) {
            console.log('🎯 RECOMENDACIÓN: Usar solo OpenStreetMap');
            console.log('   • Suficientes negocios encontrados');
            console.log('   • Costo: $0 USD/mes');
        } else {
            console.log('🎯 RECOMENDACIÓN: Considerar sistema híbrido');
            console.log('   • Combinar OSM (gratuito) + Google (pago)');
            console.log('   • Mejor cobertura de negocios');
        }

        console.log('\n🎉 PRUEBA COMPLETADA EXITOSAMENTE');
        
    } catch (error) {
        console.error('\n❌ ERROR EN PRUEBA:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Ejecutar prueba
testHybridSystem().catch(console.error);
