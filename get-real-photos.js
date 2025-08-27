const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI';

async function getRealPhotos() {
    try {
        console.log('🔍 Buscando restaurante en Acacías...');
        
        // Buscar restaurantes en Acacías
        const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: 'restaurante Acacías Meta Colombia',
                location: '3.9889,-73.7561',
                radius: 5000,
                type: 'restaurant',
                key: GOOGLE_API_KEY
            }
        });

        if (searchResponse.data.results.length === 0) {
            console.log('❌ No se encontraron restaurantes');
            return;
        }

        console.log(`✅ Encontrados ${searchResponse.data.results.length} restaurantes`);
        
        // Buscar el primero que tenga fotos
        for (const restaurant of searchResponse.data.results.slice(0, 3)) {
            console.log(`\n🔍 Verificando: ${restaurant.name}`);
            
            try {
                const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                    params: {
                        place_id: restaurant.place_id,
                        fields: 'name,photos',
                        key: GOOGLE_API_KEY
                    }
                });

                const details = detailsResponse.data.result;
                
                if (details.photos && details.photos.length > 0) {
                    console.log(`📸 ${details.name} tiene ${details.photos.length} fotos`);
                    
                    const realImages = details.photos.slice(0, 3).map(photo => 
                        `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}&maxwidth=800`
                    );
                    
                    // Probar la primera URL
                    const testResponse = await axios.head(realImages[0]);
                    if (testResponse.status === 200) {
                        console.log('✅ URLs válidas encontradas');
                        console.log('\n🔧 CÓDIGO PARA ACTUALIZAR:');
                        console.log('imagenes: JSON.stringify([');
                        realImages.forEach((url, i) => {
                            console.log(`  "${url}"${i < realImages.length - 1 ? ',' : ''}`);
                        });
                        console.log(']),');
                        
                        return {
                            name: details.name,
                            images: realImages
                        };
                    }
                }
            } catch (error) {
                console.log(`⚠️ Error con ${restaurant.name}: ${error.message}`);
            }
        }
        
        console.log('❌ No se encontraron restaurantes con fotos válidas');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

getRealPhotos();
