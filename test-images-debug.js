require('dotenv').config();
const HybridBusinessService = require('./services/hybrid-business-service');

async function testImageFetching() {
    console.log('🧪 PRUEBA DE OBTENCIÓN DE IMÁGENES');
    console.log('=====================================');
    
    const hybridService = new HybridBusinessService();
    
    // Habilitar Google Places API
    console.log('🔧 Habilitando Google Places API...');
    hybridService.setGoogleFallback(true);
    
    // Probar con algunos negocios reales de la base de datos
    const testBusinesses = [
        {
            nombre_negocio: "Davivienda",
            categoria_principal: "Servicios",
            direccion: "Acacías, Meta, Colombia",
            lat: 3.98665,
            lng: -73.7618949
        },
        {
            nombre_negocio: "Hotel la perla llanera",
            categoria_principal: "Entretenimiento", 
            direccion: "Acacías, Meta, Colombia",
            lat: 3.9881162,
            lng: -73.7639387
        },
        {
            nombre_negocio: "Sabor a Leña",
            categoria_principal: "Comida",
            direccion: "Acacías, Meta, Colombia",
            lat: 3.9935196,
            lng: -73.7656844
        }
    ];
    
    for (const business of testBusinesses) {
        console.log(`\n🔍 Probando: ${business.nombre_negocio}`);
        console.log(`📍 Ubicación: ${business.lat}, ${business.lng}`);
        console.log(`🏷️ Categoría: ${business.categoria_principal}`);
        
        try {
            const images = await hybridService.getCombinedBusinessImages(business);
            
            if (images && images.length > 0) {
                console.log(`✅ ÉXITO: Encontradas ${images.length} imágenes`);
                images.forEach((img, index) => {
                    console.log(`   📸 Imagen ${index + 1}: ${img.substring(0, 80)}...`);
                });
            } else {
                console.log(`❌ Sin imágenes para ${business.nombre_negocio}`);
            }
        } catch (error) {
            console.log(`❌ ERROR para ${business.nombre_negocio}:`, error.message);
        }
        
        // Pausa entre requests para evitar rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🏁 Prueba completada');
}

// Ejecutar la prueba
testImageFetching().catch(console.error);
