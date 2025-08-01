const https = require('https');
const fs = require('fs');
require('dotenv').config();

// Configuración de APIs
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log('🔍 PROBANDO TODAS LAS APIs DE GOOGLE MY BUSINESS');
console.log('================================================');

// Función para hacer requests HTTPS
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

// 1. Probar Places API (New) - Ya habilitada
async function testPlacesAPI() {
    console.log('\n1️⃣ Probando Places API (New)...');
    
    try {
        const url = `https://places.googleapis.com/v1/places:searchText?key=${GOOGLE_API_KEY}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber'
            }
        };
        
        const postData = JSON.stringify({
            textQuery: "restaurante Acacías Meta Colombia",
            maxResultCount: 1
        });
        
        const result = await new Promise((resolve, reject) => {
            const req = https.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, data: JSON.parse(data) });
                    } catch (e) {
                        resolve({ status: res.statusCode, data: data });
                    }
                });
            });
            req.on('error', reject);
            req.write(postData);
            req.end();
        });
        
        if (result.status === 200) {
            console.log('✅ Places API (New): FUNCIONANDO');
            console.log(`   Encontrados: ${result.data.places?.length || 0} lugares`);
        } else {
            console.log('❌ Places API (New): ERROR');
            console.log(`   Status: ${result.status}`);
            console.log(`   Error: ${JSON.stringify(result.data, null, 2)}`);
        }
    } catch (error) {
        console.log('❌ Places API (New): ERROR DE CONEXIÓN');
        console.log(`   Error: ${error.message}`);
    }
}

// 2. Probar My Business Business Information API
async function testBusinessInformationAPI() {
    console.log('\n2️⃣ Probando My Business Business Information API...');
    
    try {
        // Primero probamos si la API está disponible
        const url = `https://mybusinessbusinessinformation.googleapis.com/v1/accounts?key=${GOOGLE_API_KEY}`;
        const result = await makeRequest(url);
        
        if (result.status === 200) {
            console.log('✅ My Business Business Information API: FUNCIONANDO');
            console.log(`   Cuentas disponibles: ${result.data.accounts?.length || 0}`);
        } else if (result.status === 403) {
            console.log('⚠️  My Business Business Information API: HABILITADA pero requiere autenticación OAuth');
            console.log('   Esta API necesita autenticación de usuario, no solo API Key');
        } else {
            console.log('❌ My Business Business Information API: ERROR');
            console.log(`   Status: ${result.status}`);
            console.log(`   Error: ${JSON.stringify(result.data, null, 2)}`);
        }
    } catch (error) {
        console.log('❌ My Business Business Information API: ERROR DE CONEXIÓN');
        console.log(`   Error: ${error.message}`);
    }
}

// 3. Probar My Business Account Management API
async function testAccountManagementAPI() {
    console.log('\n3️⃣ Probando My Business Account Management API...');
    
    try {
        const url = `https://mybusinessaccountmanagement.googleapis.com/v1/accounts?key=${GOOGLE_API_KEY}`;
        const result = await makeRequest(url);
        
        if (result.status === 200) {
            console.log('✅ My Business Account Management API: FUNCIONANDO');
            console.log(`   Cuentas disponibles: ${result.data.accounts?.length || 0}`);
        } else if (result.status === 403) {
            console.log('⚠️  My Business Account Management API: HABILITADA pero requiere autenticación OAuth');
            console.log('   Esta API necesita autenticación de usuario, no solo API Key');
        } else {
            console.log('❌ My Business Account Management API: ERROR');
            console.log(`   Status: ${result.status}`);
            console.log(`   Error: ${JSON.stringify(result.data, null, 2)}`);
        }
    } catch (error) {
        console.log('❌ My Business Account Management API: ERROR DE CONEXIÓN');
        console.log(`   Error: ${error.message}`);
    }
}

// 4. Probar Business Profile Performance API
async function testBusinessProfilePerformanceAPI() {
    console.log('\n4️⃣ Probando Business Profile Performance API...');
    
    try {
        const url = `https://businessprofileperformance.googleapis.com/v1/locations?key=${GOOGLE_API_KEY}`;
        const result = await makeRequest(url);
        
        if (result.status === 200) {
            console.log('✅ Business Profile Performance API: FUNCIONANDO');
            console.log(`   Ubicaciones disponibles: ${result.data.locations?.length || 0}`);
        } else if (result.status === 403) {
            console.log('⚠️  Business Profile Performance API: HABILITADA pero requiere autenticación OAuth');
            console.log('   Esta API necesita autenticación de usuario, no solo API Key');
        } else {
            console.log('❌ Business Profile Performance API: ERROR');
            console.log(`   Status: ${result.status}`);
            console.log(`   Error: ${JSON.stringify(result.data, null, 2)}`);
        }
    } catch (error) {
        console.log('❌ Business Profile Performance API: ERROR DE CONEXIÓN');
        console.log(`   Error: ${error.message}`);
    }
}

// 5. Verificar credenciales de servicio
function checkServiceAccountCredentials() {
    console.log('\n5️⃣ Verificando credenciales de cuenta de servicio...');
    
    if (!GOOGLE_APPLICATION_CREDENTIALS) {
        console.log('⚠️  GOOGLE_APPLICATION_CREDENTIALS no está configurado');
        return false;
    }
    
    if (!fs.existsSync(GOOGLE_APPLICATION_CREDENTIALS)) {
        console.log('❌ Archivo de credenciales no encontrado:', GOOGLE_APPLICATION_CREDENTIALS);
        return false;
    }
    
    try {
        const credentials = JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
        console.log('✅ Credenciales de cuenta de servicio: ENCONTRADAS');
        console.log(`   Proyecto: ${credentials.project_id}`);
        console.log(`   Cliente: ${credentials.client_email}`);
        return true;
    } catch (error) {
        console.log('❌ Error leyendo credenciales:', error.message);
        return false;
    }
}

// Función principal
async function runAllTests() {
    console.log(`📋 API Key configurada: ${GOOGLE_API_KEY ? '✅ SÍ' : '❌ NO'}`);
    
    if (!GOOGLE_API_KEY) {
        console.log('❌ GOOGLE_API_KEY no está configurada en .env');
        return;
    }
    
    // Ejecutar todas las pruebas
    await testPlacesAPI();
    await testBusinessInformationAPI();
    await testAccountManagementAPI();
    await testBusinessProfilePerformanceAPI();
    
    const hasCredentials = checkServiceAccountCredentials();
    
    console.log('\n📊 RESUMEN DE RESULTADOS');
    console.log('========================');
    console.log('✅ = API funcionando completamente');
    console.log('⚠️  = API habilitada pero requiere configuración adicional');
    console.log('❌ = API no habilitada o con errores');
    
    console.log('\n🔧 PRÓXIMOS PASOS:');
    console.log('1. Si ves ⚠️, las APIs están habilitadas pero necesitan OAuth2');
    console.log('2. Para redes sociales necesitaremos configurar OAuth2 o usar Places API');
    console.log('3. Places API puede darnos información básica de contacto y sitio web');
    
    if (!hasCredentials) {
        console.log('4. ⚠️  Considera configurar credenciales de cuenta de servicio para acceso completo');
    }
}

// Ejecutar pruebas
runAllTests().catch(console.error);
