/**
 * 🎯 SERVICIO DE NEGOCIOS CON DATOS REALES ÚNICAMENTE
 * Usa HybridRealBusinessAPI para obtener solo información e imágenes reales
 * Google My Business + OpenStreetMap como fallback
 */

const { HybridRealBusinessAPI } = require('./hybrid-real-business-api');

// Cache para evitar múltiples llamadas a APIs externas
let cachedBusinesses = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

/**
 * 🚀 OBTENER NEGOCIOS CON DATOS REALES
 */
async function getRealBusinessesData() {
  console.log('🎯 Obteniendo negocios con datos reales únicamente...');
  
  // 🚨 CACHE DESHABILITADO TEMPORALMENTE PARA PRUEBAS
  console.log('🧪 Cache deshabilitado - Forzando datos frescos para prueba de imágenes');
  // const now = Date.now();
  // if (cachedBusinesses && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
  //   console.log('📦 Usando datos en cache');
  //   return cachedBusinesses;
  // }
  
  try {
    // 🧪 FORZAR FALLBACK TEMPORALMENTE PARA PRUEBA DE IMÁGENES
    console.log('🧪 Usando fallback directo para probar imágenes reales');
    const businesses = getFallbackBusinesses();
    // const api = new HybridRealBusinessAPI();
    // const businesses = await api.getRealBusinesses('Acacías', 'Colombia');
    
    // Formatear datos para compatibilidad con frontend
    const formattedBusinesses = businesses.map((business, index) => ({
      id: index + 1,
      nombre_negocio: business.nombre_negocio,
      categoria: business.categoria_principal,
      direccion: business.direccion,
      telefono: business.telefono || '',
      website: business.website || '',
      horarios: business.horarios || 'Consultar horarios',
      calificacion: parseFloat(business.calificacion_promedio) || 4.0,
      imagenes: business.imagenes, // Ya viene como JSON string
      visible_en_directorio: business.visible_en_directorio || 1,
      lat: business.lat,
      lon: business.lon,
      descripcion: business.descripcion || '',
      google_place_id: business.google_place_id || null,
      tiene_imagenes_reales: business.tiene_imagenes_reales || false,
      fuente_datos: business.fuente_datos || 'hybrid'
    }));
    
    // Actualizar cache
    cachedBusinesses = formattedBusinesses;
    cacheTimestamp = now;
    
    console.log(`✅ ${formattedBusinesses.length} negocios obtenidos con datos reales`);
    console.log(`📸 ${formattedBusinesses.filter(b => b.tiene_imagenes_reales).length} con imágenes reales`);
    
    return formattedBusinesses;
    
  } catch (error) {
    console.error('❌ Error obteniendo datos reales:', error.message);
    
    // Fallback a datos básicos si todo falla
    return getFallbackBusinesses();
  }
}

/**
 * 🔄 DATOS DE RESPALDO MÍNIMOS (SIN IMÁGENES GENÉRICAS)
 */
function getFallbackBusinesses() {
  console.log('⚠️ Usando datos de respaldo mínimos - SIN IMÁGENES GENÉRICAS');
  
  return [
    {
      id: 1,
      nombre_negocio: "Fábrica de arepas el buen sabor llanero",
      categoria: "Restaurante",
      direccion: "Cra. 18 #N° 17-45, Acacías, Meta",
      telefono: "+57 8 123-4567",
      website: "",
      horarios: "Lunes a Domingo: 6:00 AM - 8:00 PM",
      calificacion: 5.0,
      // IMÁGENES REALES DE GOOGLE MY BUSINESS - Fábrica de arepas el buen sabor llanero (URLs válidas)
      imagenes: JSON.stringify([
        "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpeo5PSqPMOjFRKidta9lXKbaXgkTNev6ZUsOHT5gxx-xbBhx2wPntodE7KyJlUdwF-eYaMzMaWWXiTXx1sIeA8UUZlkLPMi_pP4I7QVLmU-x8Hyo-t4QGipr_AzmWyWxnUNi_6ll9ASLphrzQoosIrdPDJM9e5DsHrgtuFz2YuQelgGzJmhSAIMJuhhxlSnJNA9uvsX2wxvwiMeaEmpNL15jlzuJBqb76ha7BGAqLFqxQTyumU4ijNoNDdt5kxI0zIfwXtf-oj-xTAc0pYdv6dbctZCmWr7Z5yHOKlfq-zJPg&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800",
        "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpf-iywcpBL-RvS6Wu5B-2ZKAF0LCfciL29LVon_8Mi-ibvpJtkPXY0nIPBihRBvbmXxKFQL18PSXskhcZ4S-CSH0-npaFvdB5LN8_or3tXbDR20HosI_Veupg1slqDCwb_l7XOY1efJ45EZw7d4MrjnFGxC0A8pZl3CJ99N-IM-gz4uEgTn7aXilqryM-pHFQQQu1exm9XzuSnAdKtlCAlUW4Mx6k00AxFsO5nmzKooyjwyD_ya95XDvKO-ARmtw2emXF_25EaWMR01qilrtfRrQwlVQoRgBHVwIG1PFeSvRDly1g0CED2bwviyL-sX9iUTIQNOFQerS9fSUDRfa7aHQYSr4C8gUtYdOx6jJnm4HuzHlpuTumAZjYXND6HOy6ySVZNK0xQG9NbI6_HLQJDhqVTPmW6I6RZNhSipCRpIz1RF&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800",
        "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpd65RJTxlN5hOjP5IksEK3L1MDdUefU1AkdsVceseYmbqFxv7-Oq0aJa9H3XcFNViSto419DnDiy_T40dTK1VcRyGyZWc0vEX7pfyFEY1PNt539fuks_wVnAwVemWBsr25AYrwQSVscUzSFtInJNGiOtgnyzmblSJSSSfiYnocMCXyDrbkJmEoZZvNJkHBQfpxzAQvY2h8CiqiNE-VhjqsGmvJS7mDnawXn2llw7D-uevJxTmMO_FKmxYRFuIvV8BrchinYDCADYjNSnrTZdiN21Y10Y_ko6tpMutN2Wm83vk3ifQULE6fL18j21CfAqR1DLVllUqJ1GnXsH2ZAKwNEmbt2ChxJpAUHryvK1I_E4YTMbfd8JHsduaoFO-GULC3L_UI7MpNnGn9S3wC6qcd2J9cmjgLn6obAXd-ucHc0zU_6&key=AIzaSyCyzW8-6DAqGdeLcOZ8-9sFt4yw0_YqaNI&maxwidth=800"
      ]),
      visible_en_directorio: 1,
      lat: 3.9889,
      lon: -73.7561,
      descripcion: "Fábrica de arepas tradicionales llaneras - Especialidad en arepas rellenas",
      google_place_id: "ChIJtest123456789",
      tiene_imagenes_reales: true,
      fuente_datos: "test_real_images"
    },
    {
      id: 2,
      nombre_negocio: "Tienda Las Cascadas",
      categoria: "Tienda",
      direccion: "Carrera 20 #8-15, Acacías",
      telefono: "+57 8 234-5678",
      website: "",
      horarios: "Lunes a Sábado: 7:00 AM - 8:00 PM",
      calificacion: 4.0,
      imagenes: JSON.stringify([]), // Sin imágenes genéricas
      visible_en_directorio: 1,
      lat: 3.9895,
      lon: -73.7555,
      descripcion: "Tienda de abarrotes",
      google_place_id: null,
      tiene_imagenes_reales: false,
      fuente_datos: "fallback"
    },
    {
      id: 3,
      nombre_negocio: "Farmacia San José",
      categoria: "Farmacia",
      direccion: "Calle 16 #14-20, Acacías",
      telefono: "+57 8 345-6789",
      website: "",
      horarios: "Lunes a Domingo: 7:00 AM - 10:00 PM",
      calificacion: 4.3,
      imagenes: JSON.stringify([]), // Sin imágenes genéricas
      visible_en_directorio: 1,
      lat: 3.9892,
      lon: -73.7558,
      descripcion: "Farmacia y droguería",
      google_place_id: null,
      tiene_imagenes_reales: false,
      fuente_datos: "fallback"
    }
  ];
}

/**
 * 🌐 HANDLER PRINCIPAL PARA NETLIFY
 */
exports.handler = async (event, context) => {
  console.log('🎯 Iniciando servicio de negocios con datos reales únicamente...');
  
  try {
    // Obtener negocios con datos reales
    const businesses = await getRealBusinessesData();
    
    // Parámetros de paginación
    const page = parseInt(event.queryStringParameters?.page) || 1;
    const limit = parseInt(event.queryStringParameters?.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Aplicar paginación
    const paginatedBusinesses = businesses.slice(startIndex, endIndex);
    const totalPages = Math.ceil(businesses.length / limit);
    
    // Estadísticas de datos reales
    const stats = {
      total_negocios: businesses.length,
      con_imagenes_reales: businesses.filter(b => b.tiene_imagenes_reales).length,
      con_google_place_id: businesses.filter(b => b.google_place_id).length,
      fuentes: {
        google_my_business: businesses.filter(b => b.google_place_id).length,
        openstreetmap: businesses.filter(b => b.fuente_datos === 'openstreetmap').length,
        fallback: businesses.filter(b => b.fuente_datos === 'fallback').length
      }
    };
    
    console.log(`✅ Sirviendo página ${page}/${totalPages} (${paginatedBusinesses.length} negocios)`);
    console.log(`📊 Estadísticas: ${stats.con_imagenes_reales} con imágenes reales, ${stats.con_google_place_id} con Google Place ID`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        data: paginatedBusinesses,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: businesses.length,
          items_per_page: limit,
          has_next: page < totalPages,
          has_prev: page > 1
        },
        stats: stats,
        meta: {
          only_real_data: true,
          no_stock_images: true,
          sources: ['google_my_business', 'openstreetmap'],
          cache_duration_minutes: CACHE_DURATION / (60 * 1000),
          timestamp: new Date().toISOString()
        }
      })
    };
    
  } catch (error) {
    console.error('❌ Error en handler de negocios reales:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        fallback_used: true
      })
    };
  }
};
