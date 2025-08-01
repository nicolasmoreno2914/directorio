// Script de prueba para verificar el login admin
const axios = require('axios');

async function testLogin() {
    console.log('🧪 Probando login de administrador...\n');
    
    const passwords = ['admin123', 'admin', '123', 'Admin123'];
    
    for (const password of passwords) {
        try {
            console.log(`Probando contraseña: "${password}"`);
            
            const response = await axios.post('http://localhost:3000/api/admin/login', {
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                console.log('✅ LOGIN EXITOSO!');
                console.log('Token:', response.data.token);
                console.log('Mensaje:', response.data.message);
                return;
            }
            
        } catch (error) {
            if (error.response) {
                console.log('❌ Error:', error.response.data.error);
            } else {
                console.log('❌ Error de conexión:', error.message);
            }
        }
        console.log('');
    }
    
    console.log('🔍 Ninguna contraseña funcionó. Verificando variables de entorno...');
    
    // Verificar .env
    require('dotenv').config();
    console.log('ADMIN_PASSWORD desde .env:', process.env.ADMIN_PASSWORD || 'No definida');
}

testLogin().catch(console.error);
