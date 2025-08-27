const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI';

async function findSaborLlanero() {
    try {
        console.log('🔍 Buscando específicamente "Restaurante El Sabor Llanero"...');
        
        // Buscar exactamente "El Sabor Llanero"
        const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: 'El Sabor Llanero Acacías Meta Colombia',
                location: '3.9889,-73.7561',
                radius: 5000,
                key: GOOGLE_API_KEY
            }
        });

        console.log(`📊 Resultados para "El Sabor Llanero": ${searchResponse.data.results.length}`);
        
        if (searchResponse.data.results.length > 0) {
            for (const restaurant of searchResponse.data.results) {
                console.log(`\n✅ Encontrado: ${restaurant.name}`);
                console.log(`📍 Dirección: ${restaurant.formatted_address}`);
                console.log(`⭐ Rating: ${restaurant.rating || 'N/A'}`);
                
                // Obtener detalles con fotos
                try {
                    const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                        params: {
                            place_id: restaurant.place_id,
                            fields: 'name,formatted_address,formatted_phone_number,photos',
                            key: GOOGLE_API_KEY
                        }
                    });

                    const details = detailsResponse.data.result;
                    console.log(`📸 Fotos disponibles: ${details.photos ? details.photos.length : 0}`);
                    
                    if (details.photos && details.photos.length > 0) {
                        console.log('\n🖼️ IMÁGENES REALES DE EL SABOR LLANERO:');
                        const realImages = details.photos.slice(0, 3).map(photo => 
                            `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}&maxwidth=800`
                        );
                        
                        console.log('\n🔧 CÓDIGO CORRECTO:');
                        console.log('imagenes: JSON.stringify([');
                        realImages.forEach((url, i) => {
                            console.log(`  "${url}"${i < realImages.length - 1 ? ',' : ''}`);
                        });
                        console.log(']),');
                        
                        return {
                            name: details.name,
                            address: details.formatted_address,
                            phone: details.formatted_phone_number,
                            images: realImages
                        };
                    }
                } catch (error) {
                    console.log(`⚠️ Error obteniendo detalles: ${error.message}`);
                }
            }
        } else {
            console.log('❌ No se encontró "Restaurante El Sabor Llanero" específicamente');
            console.log('💡 Opciones:');
            console.log('   1. Usar "Limón Mandarino" y cambiar el nombre en el código');
            console.log('   2. Buscar otro restaurante real de Acacías');
            console.log('   3. Crear datos de ejemplo con fondo verde');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

findSaborLlanero();
