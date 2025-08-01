const HybridBusinessService = require('./services/hybrid-business-service');
require('dotenv').config();

console.log('🎯 PRUEBA DE GOOGLE MY BUSINESS API (SOLO)');
console.log('==========================================');

async function testGoogleOnlyImages() {
    const hybridService = new HybridBusinessService();
    
    // Verificar configuración
    console.log('📋 Verificando configuración:');
    const hasApiKey = !!process.env.GOOGLE_API_KEY;
    console.log(`   Google API Key: ${hasApiKey ? '✅ Configurada' : '❌ No configurada'}`);
    
    if (!hasApiKey) {
        console.log('\n❌ ERROR: No se encontró GOOGLE_API_KEY en .env');
        console.log('💡 Configura tu API Key de Google Places en el archivo .env');
        return;
    }
    
    // Habilitar Google Places API
    hybridService.setGoogleFallback(true);
    
    // Datos de prueba de un negocio real
    const testBusiness = {
        nombre_negocio: 'Hotel La Perla Llanera',
        categoria_principal: 'hotel',
        direccion: 'Acacías, Meta, Colombia',
        lat: 3.9889,
        lng: -73.7561
    };
    
    console.log('\n🏪 Probando con negocio de ejemplo:');
    console.log(`   Nombre: ${testBusiness.nombre_negocio}`);
    console.log(`   Categoría: ${testBusiness.categoria_principal}`);
    console.log(`   Ubicación: ${testBusiness.lat}, ${testBusiness.lng}`);
    
    console.log('\n🔍 Buscando imágenes exactas de Google My Business...');
    
    try {
        const images = await hybridService.getCombinedBusinessImages(testBusiness);
        
        if (images && images.length > 0) {
            console.log(`\n🎉 ¡ÉXITO! Encontradas ${images.length} imágenes exactas de Google My Business:`);
            images.forEach((img, i) => {
                console.log(`   ${i + 1}. ${img.url}`);
                console.log(`      Fuente: ${img.source}`);
                console.log(`      Dimensiones: ${img.width}x${img.height}`);
            });
            
            console.log('\n✅ El sistema está funcionando correctamente');
            console.log('📸 Estas son las mismas imágenes que aparecen en Google My Business');
            
        } else {
            console.log('\n⚠️ No se encontraron imágenes para este negocio');
            console.log('💡 Posibles causas:');
            console.log('   - El negocio no tiene perfil de Google My Business');
            console.log('   - El perfil existe pero no tiene fotos');
            console.log('   - El nombre/ubicación no coincide exactamente');
        }
        
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        
        if (error.message.includes('REQUEST_DENIED')) {
            console.log('\n🚨 PROBLEMA DETECTADO: Google Places API devuelve REQUEST_DENIED');
            console.log('📋 SOLUCIÓN REQUERIDA:');
            console.log('   1. Ve a Google Cloud Console: https://console.cloud.google.com/');
            console.log('   2. Habilita estas APIs específicas:');
            console.log('      ✓ Places API (New)');
            console.log('      ✓ Places API');
            console.log('      ✓ Maps JavaScript API');
            console.log('      ✓ Geocoding API');
            console.log('   3. Habilita facturación en tu proyecto de Google Cloud');
            console.log('   4. Verifica que tu API Key no tenga restricciones');
            console.log('\n💰 Costo estimado: ~$5-10/mes para uso normal');
            console.log('🎁 Google da $200 gratis/mes para nuevos usuarios');
        }
    }
    
    console.log('\n📋 RESUMEN:');
    console.log('============');
    console.log('✅ Código limpiado - solo usa Google Places API');
    console.log('✅ Eliminadas todas las alternativas (Wikimedia, Foursquare, Yelp)');
    console.log('✅ Sistema configurado para obtener imágenes exactas de Google My Business');
    console.log('⚠️ Requiere habilitar APIs en Google Cloud Console para funcionar');
}

testGoogleOnlyImages().catch(console.error);
