/**
 * SCRIPT PARA OBTENER IMÁGENES REALES DE GOOGLE MY BUSINESS
 * Para el negocio específico: "Restaurante El Sabor Llanero" en Acacías
 */

const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI';

async function getRealBusinessImages() {
    console.log(' Buscando "Restaurante El Sabor Llanero" en Acacías...');
    
    try {
        // 1. BUSCAR EL NEGOCIO EN GOOGLE PLACES
        const searchQuery = 'Restaurante El Sabor Llanero Acacías Meta Colombia';
        const searchResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: searchQuery,
                location: '3.9889,-73.7561', // Coordenadas de Acacías
                radius: 5000,
                key: GOOGLE_API_KEY
            }
        });

        console.log(' Resultados de búsqueda:', searchResponse.data.results.length);
        
        if (searchResponse.data.results.length === 0) {
            console.log(' No se encontró el negocio en Google Places');
            return;
        }

        const business = searchResponse.data.results[0];
        console.log(' Negocio encontrado:', business.name);
        console.log(' Place ID:', business.place_id);
        console.log(' Rating:', business.rating);

        // 2. OBTENER DETALLES COMPLETOS CON FOTOS
        const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: business.place_id,
                fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,photos,types,geometry',
                key: GOOGLE_API_KEY
            }
        });

        const details = detailsResponse.data.result;
        console.log(' Detalles obtenidos para:', details.name);
        console.log(' Teléfono:', details.formatted_phone_number);
        console.log(' Website:', details.website);
        console.log(' Fotos disponibles:', details.photos ? details.photos.length : 0);

        // 3. PROCESAR IMÁGENES REALES
        if (details.photos && details.photos.length > 0) {
            console.log('\n IMÁGENES REALES ENCONTRADAS:');
            
            const realImages = [];
            for (let i = 0; i < Math.min(details.photos.length, 5); i++) {
                const photo = details.photos[i];
                const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}&maxwidth=800`;
                
                realImages.push(photoUrl);
                console.log(`   ${i + 1}. ${photoUrl}`);
            }

            // 4. GENERAR CÓDIGO PARA USAR EN EL FALLBACK
            console.log('\n CÓDIGO PARA USAR EN businesses-real.js:');
            console.log('```javascript');
            console.log('imagenes: JSON.stringify([');
            realImages.forEach((url, index) => {
                console.log(`  "${url}"${index < realImages.length - 1 ? ',' : ''}`);
            });
            console.log(']),');
            console.log('```');

            return {
                place_id: business.place_id,
                name: details.name,
                address: details.formatted_address,
                phone: details.formatted_phone_number,
                website: details.website,
                rating: details.rating,
                images: realImages
            };

        } else {
            console.log(' No se encontraron fotos para este negocio');
        }

    } catch (error) {
        console.error(' Error obteniendo imágenes reales:', error.message);
        
        if (error.response) {
            console.error(' Status:', error.response.status);
            console.error(' Data:', error.response.data);
        }
    }
}

// EJECUTAR EL SCRIPT
getRealBusinessImages()
    .then(result => {
        if (result) {
            console.log('\n ÉXITO: Imágenes reales obtenidas');
            console.log(' Resultado:', JSON.stringify(result, null, 2));
        }
    })
    .catch(error => {
        console.error(' Error ejecutando script:', error);
    });
