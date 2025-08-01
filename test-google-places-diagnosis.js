const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

console.log('🔍 DIAGNÓSTICO DE GOOGLE PLACES API');
console.log('=====================================');

if (!GOOGLE_API_KEY) {
    console.log('❌ ERROR: No se encontró GOOGLE_API_KEY en .env');
    process.exit(1);
}

console.log(`✅ API Key encontrada: ${GOOGLE_API_KEY.substring(0, 10)}...`);

// Test 1: Verificar si la API Key es válida con una consulta simple
async function testApiKeyValidity() {
    console.log('\n📋 TEST 1: Validez de API Key');
    console.log('------------------------------');
    
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: 'Acacías, Meta, Colombia',
                key: GOOGLE_API_KEY
            }
        });
        
        if (response.data.status === 'OK') {
            console.log('✅ API Key válida - Geocoding API funciona');
            return true;
        } else {
            console.log(`❌ Error en Geocoding API: ${response.data.status}`);
            console.log(`   Error message: ${response.data.error_message || 'N/A'}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return false;
    }
}

// Test 2: Verificar Places API Text Search
async function testPlacesTextSearch() {
    console.log('\n📋 TEST 2: Places API - Text Search');
    console.log('-----------------------------------');
    
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: 'restaurante Acacías Meta Colombia',
                location: '3.9889,-73.7561',
                radius: 10000,
                key: GOOGLE_API_KEY
            }
        });
        
        console.log(`Status: ${response.data.status}`);
        
        if (response.data.status === 'OK') {
            console.log(`✅ Places Text Search funciona - ${response.data.results.length} resultados`);
            return response.data.results[0] || null;
        } else {
            console.log(`❌ Error en Places Text Search: ${response.data.status}`);
            console.log(`   Error message: ${response.data.error_message || 'N/A'}`);
            
            // Información adicional sobre errores comunes
            if (response.data.status === 'REQUEST_DENIED') {
                console.log('\n💡 POSIBLES CAUSAS DE REQUEST_DENIED:');
                console.log('   1. API Key no tiene habilitada la Places API');
                console.log('   2. Facturación no está habilitada en Google Cloud');
                console.log('   3. Restricciones de API Key (IP, referrer, etc.)');
                console.log('   4. Cuota diaria/mensual excedida');
            }
            return null;
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return null;
    }
}

// Test 3: Verificar Places API Place Details
async function testPlacesDetails(placeId) {
    console.log('\n📋 TEST 3: Places API - Place Details');
    console.log('------------------------------------');
    
    if (!placeId) {
        console.log('⚠️  Saltando test - No hay place_id disponible');
        return null;
    }
    
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: placeId,
                fields: 'name,photos,formatted_address',
                key: GOOGLE_API_KEY
            }
        });
        
        console.log(`Status: ${response.data.status}`);
        
        if (response.data.status === 'OK') {
            const photos = response.data.result.photos || [];
            console.log(`✅ Places Details funciona - ${photos.length} fotos disponibles`);
            return photos[0] || null;
        } else {
            console.log(`❌ Error en Places Details: ${response.data.status}`);
            console.log(`   Error message: ${response.data.error_message || 'N/A'}`);
            return null;
        }
    } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        return null;
    }
}

// Test 4: Verificar Places API Photos
async function testPlacesPhoto(photoReference) {
    console.log('\n📋 TEST 4: Places API - Photo');
    console.log('-----------------------------');
    
    if (!photoReference) {
        console.log('⚠️  Saltando test - No hay photo_reference disponible');
        return false;
    }
    
    try {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
        
        const response = await axios.get(photoUrl, {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Permitir redirects
            }
        });
        
        if (response.status === 200 || response.status === 302) {
            console.log('✅ Places Photo API funciona');
            return true;
        } else {
            console.log(`❌ Error en Places Photo: Status ${response.status}`);
            return false;
        }
    } catch (error) {
        if (error.response && error.response.status === 302) {
            console.log('✅ Places Photo API funciona (redirect a imagen)');
            return true;
        }
        console.log(`❌ Error en Places Photo: ${error.message}`);
        return false;
    }
}

// Test 5: Verificar configuración de cuotas
async function checkQuotaStatus() {
    console.log('\n📋 TEST 5: Estado de Cuotas');
    console.log('---------------------------');
    
    try {
        const QuotaManager = require('./services/quota-manager');
        const quotaManager = new QuotaManager();
        
        const stats = await quotaManager.getQuotaStats();
        console.log('📊 Estado actual de cuotas:');
        console.log(`   Búsquedas: ${stats.searches.used}/${stats.searches.daily_limit} (diario)`);
        console.log(`   Detalles: ${stats.details.used}/${stats.details.daily_limit} (diario)`);
        console.log(`   Fotos: ${stats.photos.used}/${stats.photos.daily_limit} (diario)`);
        
        const canSync = await quotaManager.canPerformSync(1, 1, 1);
        console.log(`   ¿Puede hacer requests? ${canSync ? '✅ Sí' : '❌ No'}`);
        
        return canSync;
    } catch (error) {
        console.log(`⚠️  No se pudo verificar cuotas: ${error.message}`);
        return true; // Asumir que sí puede si no hay quota manager
    }
}

// Ejecutar todos los tests
async function runDiagnosis() {
    console.log('Iniciando diagnóstico completo...\n');
    
    // Test 1: API Key validity
    const apiKeyValid = await testApiKeyValidity();
    if (!apiKeyValid) {
        console.log('\n🚨 DIAGNÓSTICO DETENIDO: API Key inválida');
        return;
    }
    
    // Test 2: Places Text Search
    const firstPlace = await testPlacesTextSearch();
    const placeId = firstPlace ? firstPlace.place_id : null;
    
    // Test 3: Places Details
    const firstPhoto = await testPlacesDetails(placeId);
    const photoReference = firstPhoto ? firstPhoto.photo_reference : null;
    
    // Test 4: Places Photo
    await testPlacesPhoto(photoReference);
    
    // Test 5: Quota Status
    await checkQuotaStatus();
    
    console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
    console.log('==========================');
    
    if (firstPlace && firstPhoto) {
        console.log('✅ Todas las APIs de Google Places funcionan correctamente');
        console.log('   El problema puede estar en la implementación específica');
    } else {
        console.log('❌ Hay problemas con las APIs de Google Places');
        console.log('\n💡 PRÓXIMOS PASOS RECOMENDADOS:');
        console.log('1. Verificar en Google Cloud Console:');
        console.log('   - Places API está habilitada');
        console.log('   - Facturación está habilitada');
        console.log('   - No hay restricciones en la API Key');
        console.log('2. Revisar cuotas y límites');
        console.log('3. Verificar configuración de la API Key');
    }
}

runDiagnosis().catch(console.error);
