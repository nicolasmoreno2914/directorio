require('dotenv').config();
const QuotaManager = require('./services/quota-manager');
const GooglePlacesService = require('./services/google-places-simple');

async function testQuotaSystem() {
    console.log('🧪 PROBANDO SISTEMA DE CONTROL DE CUOTAS');
    console.log('==========================================\n');

    try {
        const quotaManager = new QuotaManager();
        const googleService = new GooglePlacesService();

        // 1. Verificar estado inicial de cuotas
        console.log('📊 1. Estado inicial de cuotas:');
        await quotaManager.generateUsageReport();

        // 2. Verificar si se puede hacer una sincronización
        console.log('\n🔍 2. Verificando disponibilidad para sincronización:');
        const syncCheck = await quotaManager.canMakeSync(50);
        
        if (syncCheck.allowed) {
            console.log('✅ Sincronización PERMITIDA');
            console.log(`   Negocios estimados: ${syncCheck.estimated_businesses}`);
            console.log('   Requests estimados:', syncCheck.estimated_requests);
        } else {
            console.log('🚫 Sincronización BLOQUEADA');
            Object.entries(syncCheck.checks).forEach(([type, check]) => {
                if (!check.allowed) {
                    console.log(`   ❌ ${type}: ${check.reason} (${check.current}/${check.limit})`);
                }
            });
        }

        // 3. Simular algunos requests para probar el sistema
        console.log('\n🎭 3. Simulando requests para probar el sistema:');
        
        // Simular request de búsqueda
        const canSearchRequest = await quotaManager.canMakeRequest('nearby_search', 1);
        if (canSearchRequest.allowed) {
            console.log('✅ Request de búsqueda permitido');
            await quotaManager.recordRequest('nearby_search', 1, { 
                test: true, 
                location: 'Acacías, Meta' 
            });
            console.log('📝 Request de búsqueda registrado');
        } else {
            console.log('🚫 Request de búsqueda bloqueado:', canSearchRequest.reason);
        }

        // Simular requests de detalles
        const canDetailsRequest = await quotaManager.canMakeRequest('place_details', 5);
        if (canDetailsRequest.allowed) {
            console.log('✅ Requests de detalles permitidos (5)');
            await quotaManager.recordRequest('place_details', 5, { 
                test: true, 
                businesses: ['test1', 'test2', 'test3', 'test4', 'test5'] 
            });
            console.log('📝 Requests de detalles registrados');
        } else {
            console.log('🚫 Requests de detalles bloqueados:', canDetailsRequest.reason);
        }

        // 4. Mostrar estado después de las simulaciones
        console.log('\n📈 4. Estado después de simulaciones:');
        await quotaManager.generateUsageReport();

        // 5. Probar configuración de límites personalizados
        console.log('\n⚙️ 5. Probando configuración de límites personalizados:');
        const newLimits = {
            daily_nearby_search: 25,  // Reducir límite diario
            monthly_place_details: 300  // Reducir límite mensual
        };
        
        await quotaManager.updateLimits(newLimits);
        console.log('✅ Límites actualizados');

        // Verificar nuevos límites
        const updatedStats = await quotaManager.getUsageStats();
        console.log('📊 Nuevos límites aplicados:');
        console.log(`   Búsquedas diarias: ${updatedStats.daily.limits.nearby_search}`);
        console.log(`   Detalles mensuales: ${updatedStats.monthly.limits.place_details}`);

        // 6. Probar límites con la nueva configuración
        console.log('\n🧪 6. Probando con nuevos límites:');
        const syncCheckUpdated = await quotaManager.canMakeSync(100);
        
        if (syncCheckUpdated.allowed) {
            console.log('✅ Sincronización aún permitida con nuevos límites');
        } else {
            console.log('🚫 Sincronización ahora bloqueada por nuevos límites');
            Object.entries(syncCheckUpdated.checks).forEach(([type, check]) => {
                if (!check.allowed) {
                    console.log(`   ❌ ${type}: ${check.reason} (${check.current}/${check.limit})`);
                }
            });
        }

        // 7. Mostrar estadísticas finales
        console.log('\n📋 7. Estadísticas finales:');
        const finalStats = await quotaManager.getUsageStats();
        
        console.log('\n💰 RESUMEN DE COSTOS:');
        console.log(`   Costo estimado actual: $${finalStats.estimated_cost.toFixed(4)} USD`);
        console.log(`   Total de requests: ${finalStats.total_requests}`);
        
        console.log('\n📅 ACTIVIDAD RECIENTE:');
        finalStats.recent_activity.forEach((activity, index) => {
            console.log(`   ${index + 1}. ${activity.type} x${activity.quantity} - ${new Date(activity.timestamp).toLocaleString()}`);
        });

        console.log('\n✅ PRUEBA DEL SISTEMA DE CUOTAS COMPLETADA');
        console.log('==========================================');

    } catch (error) {
        console.error('❌ Error en prueba del sistema de cuotas:', error);
        process.exit(1);
    }
}

// Función para probar conexión real con cuotas (solo si la facturación está habilitada)
async function testRealConnectionWithQuotas() {
    console.log('\n🌐 PROBANDO CONEXIÓN REAL CON CONTROL DE CUOTAS');
    console.log('===============================================\n');

    try {
        const googleService = new GooglePlacesService();
        
        // Verificar si se puede hacer la conexión
        const syncCheck = await googleService.quotaManager.canMakeSync(10); // Solo 10 negocios para prueba
        
        if (!syncCheck.allowed) {
            console.log('🚫 Conexión real bloqueada por límites de cuota');
            return;
        }

        console.log('✅ Cuotas disponibles - Intentando conexión real...');
        
        // Intentar obtener algunos negocios reales
        const businesses = await googleService.getBusinessesFromAcacias();
        
        console.log(`🏪 Negocios encontrados: ${businesses.length}`);
        businesses.slice(0, 3).forEach((business, index) => {
            console.log(`   ${index + 1}. ${business.nombre_negocio} - ${business.categoria_principal}`);
        });

        // Mostrar uso de cuotas después de la conexión real
        console.log('\n📊 Uso de cuotas después de conexión real:');
        await googleService.generateQuotaReport();

    } catch (error) {
        if (error.message.includes('BILLING_NOT_ENABLED')) {
            console.log('💳 La facturación no está habilitada en Google Cloud');
            console.log('   Esto es normal si aún no has configurado la facturación');
        } else if (error.message.includes('cuota')) {
            console.log('🚫 Conexión bloqueada por sistema de cuotas:', error.message);
        } else {
            console.log('⚠️ Error en conexión real:', error.message);
        }
    }
}

// Ejecutar pruebas
async function runTests() {
    await testQuotaSystem();
    
    console.log('\n' + '='.repeat(50));
    console.log('¿Quieres probar la conexión real? (requiere facturación habilitada)');
    console.log('Ejecutando prueba de conexión real en 3 segundos...');
    
    setTimeout(async () => {
        await testRealConnectionWithQuotas();
        process.exit(0);
    }, 3000);
}

if (require.main === module) {
    runTests();
}

module.exports = { testQuotaSystem, testRealConnectionWithQuotas };
