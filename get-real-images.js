const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI';

async function getRealRestaurantImages() {
    console.log('🔍 Obteniendo imágenes REALES de Google My Business...');
    
    try {
        // Buscar "Restaurante El Sabor Llanero" en Acacías
        const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: 'Restaurante El Sabor Llanero Acacías Meta Colombia',
                location: '3.9889,-73.7561',
                radius: 5000,
                key: GOOGLE_API_KEY
            }
        });

        if (searchResponse.data.results.length === 0) {
            console.log('❌ Negocio no encontrado, usando imágenes de ejemplo');
            return null;
        }

        const business = searchResponse.data.results[0];
        console.log('✅ Encontrado:', business.name);

        // Obtener detalles con fotos
        const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: business.place_id,
                fields: 'photos',
                key: GOOGLE_API_KEY
            }
        });

        const details = detailsResponse.data.result;
        
        if (details.photos && details.photos.length > 0) {
            const realImages = details.photos.slice(0, 3).map(photo => 
                `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}&maxwidth=800`
            );
            
            console.log('📸 Imágenes reales obtenidas:', realImages.length);
            return realImages;
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

getRealRestaurantImages().then(images => {
    if (images) {
        console.log('\n🔧 CÓDIGO PARA ACTUALIZAR:');
        console.log('imagenes: JSON.stringify([');
        images.forEach((url, i) => {
            console.log(`  "${url}"${i < images.length - 1 ? ',' : ''}`);
        });
        console.log(']),');
    } else {
        console.log('❌ No se pudieron obtener imágenes reales');
    }
});
