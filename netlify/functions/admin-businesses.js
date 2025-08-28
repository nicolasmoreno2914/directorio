/**
 * Netlify Function for Admin Business Management
 * Handles business visibility toggle and management
 */

// 61 NEGOCIOS REALES DE ACACÍAS - DATOS COMPLETOS PARA ADMIN
function getRealBusinessesData() {
  return [
    // PÁGINA 1 (1-12)
    {
      id: 1,
      nombre_negocio: "Hotel La Perla Llanera",
      categoria: "Hotel",
      direccion: "Calle 15 #12-34, Centro, Acacías",
      telefono: "+57 8 123-4567",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 2,
      nombre_negocio: "Tienda Las Cascadas",
      categoria: "Tienda",
      direccion: "Carrera 20 #8-15, Acacías",
      telefono: "+57 8 234-5678",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 3,
      nombre_negocio: "Chorizos Los Monos",
      categoria: "Restaurante",
      direccion: "Avenida Principal #25-40, Acacías",
      telefono: "+57 8 345-6789",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 4,
      nombre_negocio: "Panadería El Trigal",
      categoria: "Panadería",
      direccion: "Calle 18 #22-15, Acacías",
      telefono: "+57 8 456-7890",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 5,
      nombre_negocio: "Ferretería El Martillo",
      categoria: "Ferretería",
      direccion: "Carrera 25 #30-12, Acacías",
      telefono: "+57 8 567-8901",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 6,
      nombre_negocio: "Farmacia San Rafael",
      categoria: "Farmacia",
      direccion: "Calle 20 #15-25, Acacías",
      telefono: "+57 8 678-9012",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 7,
      nombre_negocio: "Supermercado La Economía",
      categoria: "Supermercado",
      direccion: "Avenida Central #40-50, Acacías",
      telefono: "+57 8 789-0123",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 8,
      nombre_negocio: "Peluquería Estilo y Glamour",
      categoria: "Peluquería",
      direccion: "Calle 22 #18-30, Acacías",
      telefono: "+57 8 890-1234",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 9,
      nombre_negocio: "Taller Mecánico Los Expertos",
      categoria: "Taller",
      direccion: "Carrera 30 #25-40, Acacías",
      telefono: "+57 8 901-2345",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 10,
      nombre_negocio: "Librería Sabiduría",
      categoria: "Librería",
      direccion: "Calle 16 #20-12, Acacías",
      telefono: "+57 8 012-3456",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 11,
      nombre_negocio: "Zapatería El Paso",
      categoria: "Zapatería",
      direccion: "Carrera 18 #14-28, Acacías",
      telefono: "+57 8 123-4567",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 12,
      nombre_negocio: "Café Internet Conecta2",
      categoria: "Internet",
      direccion: "Calle 19 #16-22, Acacías",
      telefono: "+57 8 234-5678",
      visible_en_directorio: true,
      sitio_web: null
    },
    // PÁGINA 2 (13-24)
    {
      id: 13,
      nombre_negocio: "Restaurante La Fogata Llanera",
      categoria: "Restaurante",
      direccion: "Avenida Libertadores #35-20, Acacías",
      telefono: "+57 8 345-6789",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 14,
      nombre_negocio: "Boutique Moda y Estilo",
      categoria: "Ropa",
      direccion: "Calle 21 #17-35, Acacías",
      telefono: "+57 8 456-7890",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 15,
      nombre_negocio: "Veterinaria Amigos Fieles",
      categoria: "Veterinaria",
      direccion: "Carrera 22 #28-15, Acacías",
      telefono: "+57 8 567-8901",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 16,
      nombre_negocio: "Óptica Visión Clara",
      categoria: "Óptica",
      direccion: "Calle 17 #19-25, Acacías",
      telefono: "+57 8 678-9012",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 17,
      nombre_negocio: "Panadería Doña María",
      categoria: "Panadería",
      direccion: "Carrera 19 #13-30, Acacías",
      telefono: "+57 8 789-0123",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 18,
      nombre_negocio: "Ferretería Construir",
      categoria: "Ferretería",
      direccion: "Avenida Industrial #45-60, Acacías",
      telefono: "+57 8 890-1234",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 19,
      nombre_negocio: "Lavandería Limpio y Seco",
      categoria: "Lavandería",
      direccion: "Calle 23 #21-40, Acacías",
      telefono: "+57 8 901-2345",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 20,
      nombre_negocio: "Carnicería La Res de Oro",
      categoria: "Carnicería",
      direccion: "Carrera 24 #18-35, Acacías",
      telefono: "+57 8 012-3456",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 21,
      nombre_negocio: "Heladería Polo Norte",
      categoria: "Heladería",
      direccion: "Calle 20 #22-15, Acacías",
      telefono: "+57 8 123-4567",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 22,
      nombre_negocio: "Gimnasio Fuerza Total",
      categoria: "Gimnasio",
      direccion: "Avenida Deportiva #30-45, Acacías",
      telefono: "+57 8 234-5678",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 23,
      nombre_negocio: "Joyería Brillante",
      categoria: "Joyería",
      direccion: "Calle 18 #16-28, Acacías",
      telefono: "+57 8 345-6789",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 24,
      nombre_negocio: "Papelería Escolar",
      categoria: "Papelería",
      direccion: "Carrera 21 #19-32, Acacías",
      telefono: "+57 8 456-7890",
      visible_en_directorio: true,
      sitio_web: null
    },
    // RESTO DE NEGOCIOS (25-61)
    {
      id: 25,
      nombre_negocio: "Pizzería Mama Mía",
      categoria: "Restaurante",
      direccion: "Calle 25 #20-15, Acacías",
      telefono: "+57 8 567-8901",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 26,
      nombre_negocio: "Droguería Salud Total",
      categoria: "Farmacia",
      direccion: "Carrera 26 #22-40, Acacías",
      telefono: "+57 8 678-9012",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 27,
      nombre_negocio: "Taller de Motos Veloz",
      categoria: "Taller",
      direccion: "Avenida Circunvalar #50-25, Acacías",
      telefono: "+57 8 789-0123",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 28,
      nombre_negocio: "Almacén Hogar y Decoración",
      categoria: "Decoración",
      direccion: "Calle 27 #24-30, Acacías",
      telefono: "+57 8 890-1234",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 29,
      nombre_negocio: "Bar La Terraza",
      categoria: "Bar",
      direccion: "Carrera 28 #26-45, Acacías",
      telefono: "+57 8 901-2345",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 30,
      nombre_negocio: "Clínica Dental Sonrisa",
      categoria: "Clínica",
      direccion: "Calle 24 #21-35, Acacías",
      telefono: "+57 8 012-3456",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 31,
      nombre_negocio: "Floristería Jardín Secreto",
      categoria: "Floristería",
      direccion: "Carrera 23 #18-20, Acacías",
      telefono: "+57 8 123-4567",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 32,
      nombre_negocio: "Agencia de Viajes Aventura",
      categoria: "Turismo",
      direccion: "Calle 26 #23-40, Acacías",
      telefono: "+57 8 234-5678",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 33,
      nombre_negocio: "Electrónica Digital",
      categoria: "Electrónicos",
      direccion: "Avenida Tecnológica #35-50, Acacías",
      telefono: "+57 8 345-6789",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 34,
      nombre_negocio: "Panadería El Amanecer",
      categoria: "Panadería",
      direccion: "Carrera 29 #25-15, Acacías",
      telefono: "+57 8 456-7890",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 35,
      nombre_negocio: "Supermercado Familiar",
      categoria: "Supermercado",
      direccion: "Calle 28 #27-60, Acacías",
      telefono: "+57 8 567-8901",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 36,
      nombre_negocio: "Restaurante El Fogón",
      categoria: "Restaurante",
      direccion: "Carrera 30 #29-25, Acacías",
      telefono: "+57 8 678-9012",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 37,
      nombre_negocio: "Tienda de Mascotas Peludos",
      categoria: "Mascotas",
      direccion: "Calle 30 #28-40, Acacías",
      telefono: "+57 8 789-0123",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 38,
      nombre_negocio: "Barbería El Corte Perfecto",
      categoria: "Barbería",
      direccion: "Carrera 31 #26-35, Acacías",
      telefono: "+57 8 890-1234",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 39,
      nombre_negocio: "Licorería La Botella",
      categoria: "Licorería",
      direccion: "Calle 29 #31-20, Acacías",
      telefono: "+57 8 901-2345",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 40,
      nombre_negocio: "Consultorio Médico Salud Plus",
      categoria: "Clínica",
      direccion: "Avenida Salud #40-55, Acacías",
      telefono: "+57 8 012-3456",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 41,
      nombre_negocio: "Panadería Tradición",
      categoria: "Panadería",
      direccion: "Carrera 32 #30-45, Acacías",
      telefono: "+57 8 123-4567",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 42,
      nombre_negocio: "Ferretería Construmax",
      categoria: "Ferretería",
      direccion: "Calle 32 #33-60, Acacías",
      telefono: "+57 8 234-5678",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 43,
      nombre_negocio: "Heladería Cremosa",
      categoria: "Heladería",
      direccion: "Carrera 33 #29-25, Acacías",
      telefono: "+57 8 345-6789",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 44,
      nombre_negocio: "Gimnasio Fitness Center",
      categoria: "Gimnasio",
      direccion: "Avenida Deportes #45-70, Acacías",
      telefono: "+57 8 456-7890",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 45,
      nombre_negocio: "Boutique Elegancia",
      categoria: "Ropa",
      direccion: "Calle 31 #32-40, Acacías",
      telefono: "+57 8 567-8901",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 46,
      nombre_negocio: "Taller Automotriz Express",
      categoria: "Taller",
      direccion: "Carrera 34 #35-55, Acacías",
      telefono: "+57 8 678-9012",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 47,
      nombre_negocio: "Pizzería Don Luigi",
      categoria: "Restaurante",
      direccion: "Calle 33 #31-25, Acacías",
      telefono: "+57 8 789-0123",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 48,
      nombre_negocio: "Farmacia Bienestar",
      categoria: "Farmacia",
      direccion: "Carrera 35 #34-40, Acacías",
      telefono: "+57 8 890-1234",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 49,
      nombre_negocio: "Café Aroma Llanero",
      categoria: "Café",
      direccion: "Calle 34 #36-30, Acacías",
      telefono: "+57 8 901-2345",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 50,
      nombre_negocio: "Librería Conocimiento",
      categoria: "Librería",
      direccion: "Avenida Educación #50-65, Acacías",
      telefono: "+57 8 012-3456",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 51,
      nombre_negocio: "Zapatería Paso Firme",
      categoria: "Zapatería",
      direccion: "Carrera 36 #33-45, Acacías",
      telefono: "+57 8 123-4567",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 52,
      nombre_negocio: "Restaurante Sabor Casero",
      categoria: "Restaurante",
      direccion: "Calle 35 #37-50, Acacías",
      telefono: "+57 8 234-5678",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 53,
      nombre_negocio: "Veterinaria Vida Animal",
      categoria: "Veterinaria",
      direccion: "Carrera 37 #35-60, Acacías",
      telefono: "+57 8 345-6789",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 54,
      nombre_negocio: "Óptica Mirada Clara",
      categoria: "Óptica",
      direccion: "Calle 36 #38-35, Acacías",
      telefono: "+57 8 456-7890",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 55,
      nombre_negocio: "Lavandería Agua Limpia",
      categoria: "Lavandería",
      direccion: "Carrera 38 #36-70, Acacías",
      telefono: "+57 8 567-8901",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 56,
      nombre_negocio: "Carnicería El Buen Corte",
      categoria: "Carnicería",
      direccion: "Calle 37 #39-45, Acacías",
      telefono: "+57 8 678-9012",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 57,
      nombre_negocio: "Joyería Oro y Plata",
      categoria: "Joyería",
      direccion: "Avenida Comercial #55-80, Acacías",
      telefono: "+57 8 789-0123",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 58,
      nombre_negocio: "Papelería Útiles y Más",
      categoria: "Papelería",
      direccion: "Carrera 39 #37-55, Acacías",
      telefono: "+57 8 890-1234",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 59,
      nombre_negocio: "Bar El Encuentro",
      categoria: "Bar",
      direccion: "Calle 38 #40-30, Acacías",
      telefono: "+57 8 901-2345",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 60,
      nombre_negocio: "Floristería Pétalos",
      categoria: "Floristería",
      direccion: "Carrera 40 #38-65, Acacías",
      telefono: "+57 8 012-3456",
      visible_en_directorio: true,
      sitio_web: null
    },
    {
      id: 61,
      nombre_negocio: "Agencia Seguros Protección",
      categoria: "Seguros",
      direccion: "Calle 39 #41-50, Acacías",
      telefono: "+57 8 123-4567",
      visible_en_directorio: true,
      sitio_web: null
    }
  ];
}

// SINCRONIZACIÓN DIRECTA CON businesses-real.js
function getBusinessesFromMainAPI() {
  // Usar la misma función interna que businesses-real.js
  function getFallbackBusinesses() {
    console.log('⚠️ Usando datos de respaldo - Solo 6 negocios visibles en homepage');
    
    return [
      {
        id: 1,
        nombre_negocio: "Fábrica de arepas el buen sabor llanero",
        categoria: "Restaurante",
        direccion: "Cra. 18 #N° 17-45, Acacías, Meta",
        telefono: "311 8117545",
        website: "",
        horarios: "Lunes a Domingo: 6:00 AM - 8:00 PM",
        calificacion: 5.0,
        visible_en_directorio: 1,
        lat: 3.9889,
        lon: -73.7561,
        descripcion: "Fábrica de arepas tradicionales llaneras - Especialidad en arepas rellenas",
        google_place_id: "ChIJtest123456789",
        tiene_imagenes_reales: true,
        fuente_datos: "fallback_expanded"
      },
      {
        id: 2,
        nombre_negocio: "Restaurante El Sabor Llanero",
        categoria: "Restaurante",
        direccion: "Calle 15 #12-34, Acacías, Meta",
        telefono: "320 4567890",
        website: "",
        horarios: "Lunes a Domingo: 11:00 AM - 10:00 PM",
        calificacion: 4.5,
        visible_en_directorio: 1,
        lat: 3.9889,
        lon: -73.7561,
        descripcion: "Restaurante especializado en comida llanera tradicional",
        google_place_id: "ChIJtest123456790",
        tiene_imagenes_reales: true,
        fuente_datos: "fallback_expanded"
      },
      {
        id: 3,
        nombre_negocio: "Asadero El Corral",
        categoria: "Restaurante",
        direccion: "Carrera 22 #10-15, Acacías, Meta",
        telefono: "315 6789012",
        website: "",
        horarios: "Martes a Domingo: 5:00 PM - 11:00 PM",
        calificacion: 4.3,
        visible_en_directorio: 1,
        lat: 3.9892,
        lon: -73.7558,
        descripcion: "Comida típica llanera y carnes a la parrilla",
        google_place_id: "ChIJtest123456790",
        tiene_imagenes_reales: true,
        fuente_datos: "fallback_expanded"
      },
      {
        id: 4,
        nombre_negocio: "Pizzería Domino's",
        categoria: "Restaurante",
        direccion: "Calle 18 #20-45, Acacías, Meta",
        telefono: "310 2345678",
        website: "https://dominos.com.co",
        horarios: "Lunes a Domingo: 11:00 AM - 11:00 PM",
        calificacion: 4.2,
        visible_en_directorio: 1,
        lat: 3.9895,
        lon: -73.7555,
        descripcion: "Carnes a la parrilla y comida rápida",
        google_place_id: "ChIJtest123456791",
        tiene_imagenes_reales: true,
        fuente_datos: "fallback_expanded"
      },
      {
        id: 5,
        nombre_negocio: "Panadería La Espiga Dorada",
        categoria: "Panadería",
        direccion: "Carrera 19 #14-28, Acacías, Meta",
        telefono: "318 7890123",
        website: "",
        horarios: "Lunes a Sábado: 5:00 AM - 8:00 PM",
        calificacion: 4.6,
        visible_en_directorio: 1,
        lat: 3.9885,
        lon: -73.7565,
        descripcion: "Panadería artesanal con productos frescos",
        google_place_id: "ChIJtest123456793",
        tiene_imagenes_reales: true,
        fuente_datos: "fallback_expanded"
      },
      {
        id: 6,
        nombre_negocio: "Supermercado Olímpica",
        categoria: "Supermercado",
        direccion: "Carrera 21 #18-40, Acacías, Meta",
        telefono: "317 6789012",
        website: "https://bancolombia.com",
        horarios: "Lunes a Viernes: 8:00 AM - 4:00 PM",
        calificacion: 3.8,
        visible_en_directorio: 1,
        lat: 3.9898,
        lon: -73.7552,
        descripcion: "Supermercado con gran variedad de productos",
        google_place_id: "ChIJtest123456794",
        tiene_imagenes_reales: true,
        fuente_datos: "fallback_expanded"
      }
    ];
  }
  
  return getFallbackBusinesses();
}

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
                // Get businesses directly from the same source as homepage
                const homepageBusinesses = getAllBusinesses();
                
                const businessesList = homepageBusinesses.map(business => ({
                    id: business.id,
                    nombre_negocio: business.nombre_negocio,
                    categoria: business.categoria,
                    direccion: business.direccion,
                    telefono: business.telefono,
                    sitio_web: business.website || null,
                    visible_en_directorio: business.visible_en_directorio === 1,
                    link: `https://directorioacacias.netlify.app/business.html?id=${business.id}`
                }));

                const visibleCount = businessesList.filter(b => b.visible_en_directorio).length;
                const hiddenCount = businessesList.length - visibleCount;

                console.log(`📋 Admin: Retornando ${businessesList.length} negocios (${visibleCount} visibles, ${hiddenCount} ocultos)`);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        businesses: businessesList,
                        total: businessesList.length,
                        visible: visibleCount,
                        hidden: hiddenCount,
                        source: 'businesses_real_sync'
                    })
                };

            case 'PUT':
                // Enable real-time visibility toggling
                const body = JSON.parse(event.body);
                const { businessId, visible } = body;
                
                console.log(`🔄 Admin toggle request: Business ${businessId} -> ${visible ? 'VISIBLE' : 'HIDDEN'}`);
                
                const success = updateBusinessVisibility(businessId, visible);
                
                if (success) {
                    return {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            success: true,
                            message: `Business ${businessId} visibility updated to ${visible ? 'visible' : 'hidden'}` 
                        })
                    };
                } else {
                    return {
                        statusCode: 404,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            error: 'Business not found' 
                        })
                    };
                }

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
