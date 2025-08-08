/**
 * Netlify Function para manejar la visibilidad de negocios
 * Usa un enfoque simple con datos hardcodeados que persisten
 */

// Estado de visibilidad hardcodeado que se puede modificar
let visibilityState = {
    // Por defecto, todos los negocios están visibles excepto algunos ejemplos
    hiddenBusinesses: [5, 11], // Ferretería El Martillo, Zapatería El Paso
    lastUpdated: new Date().toISOString()
};

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            // Retornar estado actual de visibilidad
            console.log('📋 Obteniendo estado de visibilidad...');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    hiddenBusinesses: visibilityState.hiddenBusinesses,
                    lastUpdated: visibilityState.lastUpdated,
                    source: 'admin_visibility_state'
                })
            };
        }

        if (event.httpMethod === 'POST') {
            // Actualizar visibilidad de un negocio
            const { businessId, visible } = JSON.parse(event.body);
            
            console.log(`⚙️ Actualizando visibilidad: Negocio ${businessId} -> ${visible ? 'VISIBLE' : 'OCULTO'}`);
            
            if (visible) {
                // Remover de la lista de ocultos
                visibilityState.hiddenBusinesses = visibilityState.hiddenBusinesses.filter(
                    id => id !== parseInt(businessId)
                );
            } else {
                // Agregar a la lista de ocultos
                if (!visibilityState.hiddenBusinesses.includes(parseInt(businessId))) {
                    visibilityState.hiddenBusinesses.push(parseInt(businessId));
                }
            }
            
            visibilityState.lastUpdated = new Date().toISOString();
            
            console.log(`✅ Estado actualizado. Negocios ocultos: [${visibilityState.hiddenBusinesses.join(', ')}]`);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: `Negocio ${businessId} ${visible ? 'activado' : 'desactivado'} correctamente`,
                    hiddenBusinesses: visibilityState.hiddenBusinesses,
                    lastUpdated: visibilityState.lastUpdated
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };

    } catch (error) {
        console.error('❌ Error en admin-visibility:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: 'Error interno del servidor',
                details: error.message 
            })
        };
    }
};
