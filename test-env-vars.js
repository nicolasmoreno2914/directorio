require('dotenv').config();

console.log('🔧 VERIFICACIÓN DE VARIABLES DE ENTORNO');
console.log('=====================================');

console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'CONFIGURADA ✅' : 'NO CONFIGURADA ❌');
console.log('Valor:', process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.substring(0, 20) + '...' : 'undefined');

console.log('\nOtras variables importantes:');
console.log('TARGET_LOCATION_LAT:', process.env.TARGET_LOCATION_LAT);
console.log('TARGET_LOCATION_LNG:', process.env.TARGET_LOCATION_LNG);
console.log('SEARCH_RADIUS_KM:', process.env.SEARCH_RADIUS_KM);

// Probar inicialización directa del servicio
console.log('\n🧪 Probando inicialización del GooglePlacesService...');
const GooglePlacesService = require('./services/google-places-simple');
const googleService = new GooglePlacesService();

console.log('googleService.apiKey:', googleService.apiKey ? 'CONFIGURADA ✅' : 'NO CONFIGURADA ❌');
console.log('Valor en servicio:', googleService.apiKey ? googleService.apiKey.substring(0, 20) + '...' : 'undefined');
