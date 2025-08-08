/**
 * Netlify Function for Admin Login - SIMPLE VERSION
 * Handles authentication for the admin panel
 */

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('🔐 Admin login attempt...');
        
        const { username, password } = JSON.parse(event.body);
        
        // Simple authentication
        const ADMIN_USERNAME = 'admin';
        const ADMIN_PASSWORD = 'admin123';
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            console.log('✅ Admin login successful');
            
            // Generate simple token
            const token = 'admin_token_' + Date.now();
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Login exitoso',
                    token: token,
                    user: {
                        username: ADMIN_USERNAME,
                        role: 'admin'
                    }
                })
            };
        } else {
            console.log('❌ Admin login failed - invalid credentials');
            
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Credenciales inválidas'
                })
            };
        }
        
    } catch (error) {
        console.error('❌ Error in admin login:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Error interno del servidor'
            })
        };
    }
};
