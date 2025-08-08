/**
 * Netlify Function for Admin Business Management
 * Handles business visibility toggle and management
 */

// Mock business data (in production, this would come from a database)
let businessesData = [
    {
        id: 1,
        nombre_negocio: "Hotel La Perla Llanera",
        categoria: "Hotel",
        direccion: "Calle 15 #18-45, Acacías, Meta",
        telefono: "+57 8 123 4567",
        visible_en_directorio: true,
        sitio_web: "https://hotellaperla.com"
    },
    {
        id: 2,
        nombre_negocio: "Restaurante El Sabor Llanero",
        categoria: "Restaurante",
        direccion: "Carrera 20 #12-30, Acacías, Meta",
        telefono: "+57 8 234 5678",
        visible_en_directorio: true,
        sitio_web: null
    },
    {
        id: 3,
        nombre_negocio: "Ferretería Los Andes",
        categoria: "Ferretería",
        direccion: "Calle 18 #25-10, Acacías, Meta",
        telefono: "+57 8 345 6789",
        visible_en_directorio: false,
        sitio_web: null
    },
    {
        id: 4,
        nombre_negocio: "Panadería San José",
        categoria: "Panadería",
        direccion: "Carrera 22 #14-25, Acacías, Meta",
        telefono: "+57 8 456 7890",
        visible_en_directorio: true,
        sitio_web: null
    },
    {
        id: 5,
        nombre_negocio: "Farmacia Central",
        categoria: "Farmacia",
        direccion: "Calle 16 #19-35, Acacías, Meta",
        telefono: "+57 8 567 8901",
        visible_en_directorio: true,
        sitio_web: "https://farmaciacentral.com"
    }
];

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Check authentication (simple token check)
        const authHeader = event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'No autorizado' })
            };
        }

        const method = event.httpMethod;
        const path = event.path;

        switch (method) {
            case 'GET':
                // Get all businesses for admin management
                const businessesList = businessesData.map(business => ({
                    id: business.id,
                    nombre_negocio: business.nombre_negocio,
                    categoria: business.categoria,
                    direccion: business.direccion,
                    telefono: business.telefono,
                    sitio_web: business.sitio_web,
                    visible_en_directorio: business.visible_en_directorio,
                    link: `https://directorioacacias.netlify.app/business.html?id=${business.id}`
                }));

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        businesses: businessesList,
                        total: businessesList.length,
                        visible: businessesList.filter(b => b.visible_en_directorio).length,
                        hidden: businessesList.filter(b => !b.visible_en_directorio).length
                    })
                };

            case 'PUT':
                // Toggle business visibility
                const { businessId, visible } = JSON.parse(event.body);
                
                const businessIndex = businessesData.findIndex(b => b.id === parseInt(businessId));
                if (businessIndex === -1) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Negocio no encontrado' })
                    };
                }

                businessesData[businessIndex].visible_en_directorio = visible;

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: `Negocio ${visible ? 'activado' : 'desactivado'} correctamente`,
                        business: {
                            id: businessesData[businessIndex].id,
                            nombre_negocio: businessesData[businessIndex].nombre_negocio,
                            visible_en_directorio: businessesData[businessIndex].visible_en_directorio
                        }
                    })
                };

            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Método no permitido' })
                };
        }

    } catch (error) {
        console.error('Admin businesses error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Error interno del servidor',
                details: error.message
            })
        };
    }
};
