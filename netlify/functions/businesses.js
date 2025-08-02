// Datos mock para el entorno de producción (Netlify)
const mockBusinesses = [
  {
    id: 1,
    nombre_negocio: "Restaurante El Sabor Llanero",
    categoria: "Restaurante",
    direccion: "Calle 15 #12-34, Centro, Acacías",
    telefono: "+57 8 123-4567",
    horario_atencion: "Lunes a Domingo: 6:00 AM - 10:00 PM",
    calificacion: 4.5,
    imagenes: JSON.stringify([
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
    ]),
    visible_en_directorio: 1,
    lat: 3.9889,
    lon: -73.7561,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    nombre_negocio: "Farmacia San Rafael",
    categoria: "Salud",
    direccion: "Carrera 20 #8-15, Acacías",
    telefono: "+57 8 234-5678",
    horario_atencion: "Lunes a Sábado: 7:00 AM - 8:00 PM",
    calificacion: 4.2,
    imagenes: JSON.stringify([
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800"
    ]),
    visible_en_directorio: 1,
    lat: 3.9895,
    lon: -73.7555,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    nombre_negocio: "Supermercado La Economía",
    categoria: "Supermercado",
    direccion: "Avenida Principal #25-40, Acacías",
    telefono: "+57 8 345-6789",
    horario_atencion: "Lunes a Domingo: 6:00 AM - 9:00 PM",
    calificacion: 4.0,
    imagenes: JSON.stringify([
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
    ]),
    visible_en_directorio: 1,
    lat: 3.9901,
    lon: -73.7548,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    nombre_negocio: "Peluquería Estilo & Belleza",
    categoria: "Belleza",
    direccion: "Calle 18 #14-22, Acacías",
    telefono: "+57 8 456-7890",
    horario_atencion: "Martes a Sábado: 8:00 AM - 6:00 PM",
    calificacion: 4.7,
    imagenes: JSON.stringify([
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"
    ]),
    visible_en_directorio: 1,
    lat: 3.9885,
    lon: -73.7570,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    nombre_negocio: "Ferretería El Tornillo",
    categoria: "Ferretería",
    direccion: "Carrera 22 #10-05, Acacías",
    telefono: "+57 8 567-8901",
    horario_atencion: "Lunes a Sábado: 7:00 AM - 5:00 PM",
    calificacion: 4.3,
    imagenes: JSON.stringify([
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800"
    ]),
    visible_en_directorio: 1,
    lat: 3.9878,
    lon: -73.7542,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    nombre_negocio: "Panadería Doña María",
    categoria: "Panadería",
    direccion: "Calle 12 #16-30, Acacías",
    telefono: "+57 8 678-9012",
    horario_atencion: "Lunes a Domingo: 5:00 AM - 8:00 PM",
    calificacion: 4.6,
    imagenes: JSON.stringify([
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
      "https://images.unsplash.com/photo-1555507036-ab794f4afe5a?w=800",
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800"
    ]),
    visible_en_directorio: 1,
    lat: 3.9892,
    lon: -73.7565,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

exports.handler = async (event, context) => {
  // Solo permitir GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // En el entorno de Netlify, usar datos mock
    console.log('✅ Sirviendo datos mock de negocios para Netlify');
    
    // Simular un pequeño delay como si fuera una consulta real
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
      },
      body: JSON.stringify({
        success: true,
        data: mockBusinesses,
        count: mockBusinesses.length,
        source: 'mock_data_netlify'
      })
    };
    
  } catch (error) {
    console.error('❌ Error en businesses function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};
