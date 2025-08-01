require('dotenv').config();
const { connectDatabase, syncDatabase } = require('./config/database-sqlite');

async function initAdminDemo() {
    console.log('🚀 Inicializando demo del panel de administración...');
    
    try {
        // Conectar a base de datos
        await connectDatabase();
        await syncDatabase();
        
        const { Business, Config } = require('./models');
        
        // Crear algunos negocios de ejemplo si no existen
        const businessCount = await Business.count();
        
        if (businessCount === 0) {
            console.log('📊 Creando negocios de ejemplo...');
            
            const sampleBusinesses = [
                {
                    business_id: 'demo_1',
                    nombre_negocio: 'Restaurante El Sabor',
                    categoria_principal: 'Comida',
                    direccion: 'Calle 15 #12-34, Acacías, Meta',
                    telefono: '+57 318 123 4567',
                    lat: 3.9889,
                    lng: -73.7561,
                    horarios: JSON.stringify({
                        lunes: '8:00-20:00',
                        martes: '8:00-20:00',
                        miercoles: '8:00-20:00',
                        jueves: '8:00-20:00',
                        viernes: '8:00-22:00',
                        sabado: '8:00-22:00',
                        domingo: '10:00-18:00'
                    }),
                    descripcion: 'Deliciosa comida tradicional llanera en el corazón de Acacías',
                    imagenes: JSON.stringify(['https://via.placeholder.com/400x300?text=Restaurante']),
                    calificacion_promedio: 4.5,
                    numero_resenas: 23,
                    url_perfil_google: 'https://maps.google.com/demo1',
                    visible_en_directorio: true,
                    fecha_ultima_actualizacion: new Date()
                },
                {
                    business_id: 'demo_2',
                    nombre_negocio: 'Peluquería Bella Vista',
                    categoria_principal: 'Belleza',
                    direccion: 'Carrera 8 #20-15, Acacías, Meta',
                    telefono: '+57 310 987 6543',
                    lat: 3.9895,
                    lng: -73.7555,
                    horarios: JSON.stringify({
                        lunes: '9:00-18:00',
                        martes: '9:00-18:00',
                        miercoles: '9:00-18:00',
                        jueves: '9:00-18:00',
                        viernes: '9:00-19:00',
                        sabado: '8:00-17:00',
                        domingo: 'Cerrado'
                    }),
                    descripcion: 'Servicios de belleza y estética para toda la familia',
                    imagenes: JSON.stringify(['https://via.placeholder.com/400x300?text=Peluqueria']),
                    calificacion_promedio: 4.8,
                    numero_resenas: 15,
                    url_perfil_google: 'https://maps.google.com/demo2',
                    visible_en_directorio: true,
                    fecha_ultima_actualizacion: new Date()
                },
                {
                    business_id: 'demo_3',
                    nombre_negocio: 'Tienda La Económica',
                    categoria_principal: 'Hogar',
                    direccion: 'Calle 12 #8-25, Acacías, Meta',
                    telefono: '+57 315 456 7890',
                    lat: 3.9883,
                    lng: -73.7568,
                    horarios: JSON.stringify({
                        lunes: '7:00-19:00',
                        martes: '7:00-19:00',
                        miercoles: '7:00-19:00',
                        jueves: '7:00-19:00',
                        viernes: '7:00-19:00',
                        sabado: '7:00-20:00',
                        domingo: '8:00-16:00'
                    }),
                    descripcion: 'Todo para el hogar a los mejores precios',
                    imagenes: JSON.stringify(['https://via.placeholder.com/400x300?text=Tienda']),
                    calificacion_promedio: 4.2,
                    numero_resenas: 8,
                    url_perfil_google: 'https://maps.google.com/demo3',
                    visible_en_directorio: false, // Este está oculto para probar el toggle
                    fecha_ultima_actualizacion: new Date()
                },
                {
                    business_id: 'demo_4',
                    nombre_negocio: 'Farmacia San Rafael',
                    categoria_principal: 'Salud',
                    direccion: 'Carrera 10 #18-42, Acacías, Meta',
                    telefono: '+57 312 234 5678',
                    lat: 3.9901,
                    lng: -73.7549,
                    horarios: JSON.stringify({
                        lunes: '6:00-22:00',
                        martes: '6:00-22:00',
                        miercoles: '6:00-22:00',
                        jueves: '6:00-22:00',
                        viernes: '6:00-22:00',
                        sabado: '6:00-22:00',
                        domingo: '7:00-20:00'
                    }),
                    descripcion: 'Medicamentos y productos de salud las 24 horas',
                    imagenes: JSON.stringify(['https://via.placeholder.com/400x300?text=Farmacia']),
                    calificacion_promedio: 4.6,
                    numero_resenas: 31,
                    url_perfil_google: 'https://maps.google.com/demo4',
                    visible_en_directorio: true,
                    fecha_ultima_actualizacion: new Date()
                },
                {
                    business_id: 'demo_5',
                    nombre_negocio: 'Taller Mecánico Los Expertos',
                    categoria_principal: 'Automotriz',
                    direccion: 'Calle 22 #15-30, Acacías, Meta',
                    telefono: '+57 320 345 6789',
                    lat: 3.9875,
                    lng: -73.7575,
                    horarios: JSON.stringify({
                        lunes: '7:00-17:00',
                        martes: '7:00-17:00',
                        miercoles: '7:00-17:00',
                        jueves: '7:00-17:00',
                        viernes: '7:00-17:00',
                        sabado: '7:00-12:00',
                        domingo: 'Cerrado'
                    }),
                    descripcion: 'Reparación y mantenimiento de vehículos',
                    imagenes: JSON.stringify(['https://via.placeholder.com/400x300?text=Taller']),
                    calificacion_promedio: 4.3,
                    numero_resenas: 12,
                    url_perfil_google: 'https://maps.google.com/demo5',
                    visible_en_directorio: true,
                    fecha_ultima_actualizacion: new Date()
                }
            ];
            
            for (const businessData of sampleBusinesses) {
                await Business.create(businessData);
            }
            
            console.log(`✅ Creados ${sampleBusinesses.length} negocios de ejemplo`);
        } else {
            console.log(`📊 Ya existen ${businessCount} negocios en la base de datos`);
        }
        
        // Crear configuración inicial si no existe
        let config = await Config.findOne();
        if (!config) {
            console.log('⚙️ Creando configuración inicial...');
            config = await Config.create({
                sync_enabled: true,
                last_sync: null,
                municipality: 'Acacías, Meta',
                admin_email: 'admin@yocomproacacias.com'
            });
            console.log('✅ Configuración inicial creada');
        }
        
        console.log('\n🎉 Demo del panel de administración listo!');
        console.log('==========================================');
        console.log('📱 Panel de administración: http://localhost:3000/admin');
        console.log('🔑 Contraseña por defecto: admin123');
        console.log('🏠 Sitio principal: http://localhost:3000');
        console.log('\n📊 Estadísticas:');
        console.log(`   - Total negocios: ${await Business.count()}`);
        console.log(`   - Negocios visibles: ${await Business.count({ where: { visible_en_directorio: true } })}`);
        console.log(`   - Negocios ocultos: ${await Business.count({ where: { visible_en_directorio: false } })}`);
        console.log('\n🔧 Funcionalidades del panel:');
        console.log('   ✅ Login de administrador');
        console.log('   ✅ Dashboard con estadísticas');
        console.log('   ✅ Gestión de visibilidad de negocios');
        console.log('   ✅ Control de cuotas API');
        console.log('   ✅ Sincronización manual');
        console.log('   ✅ Configuración del sistema');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error inicializando demo:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    initAdminDemo();
}

module.exports = { initAdminDemo };
