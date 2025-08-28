/**
 * Netlify Function para manejar la visibilidad de negocios
 */

const { getAllBusinesses, getVisibleBusinesses, updateBusinessVisibility, getBusinessStats } = require('./shared-business-state');

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    try {
        const method = event.httpMethod;

        switch (method) {
            case 'GET':
                // Obtener estado actual de visibilidad
                const stats = getBusinessStats();
                const visibleBusinesses = getVisibleBusinesses();
                
                console.log(`📊 Admin visibility: ${stats.visible}/${stats.total} negocios visibles`);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        stats,
                        visibleBusinesses: visibleBusinesses.map(b => ({
                            id: b.id,
                            nombre_negocio: b.nombre_negocio,
                            visible_en_directorio: b.visible_en_directorio
                        }))
                    })
                };

            case 'PUT':
                // Actualizar visibilidad de un negocio
                const { businessId, visible } = JSON.parse(event.body);
                
                console.log(`🔄 Visibility toggle: Business ${businessId} -> ${visible ? 'VISIBLE' : 'HIDDEN'}`);
                
                const success = updateBusinessVisibility(businessId, visible);
                
                if (success) {
                    const newStats = getBusinessStats();
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            message: `Business ${businessId} visibility updated`,
                            stats: newStats
                        })
                    };
                } else {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({
                            success: false,
                            error: 'Business not found'
                        })
                    };
                }

            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }

    } catch (error) {
        console.error('Admin visibility error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};
