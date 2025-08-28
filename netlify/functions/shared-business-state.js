/**
 * Sistema de estado compartido para negocios
 * Mantiene sincronización entre admin y frontend
 */

// Estado compartido de negocios para sincronización entre admin y homepage
// SOLO LOS 6 NEGOCIOS PRINCIPALES QUE DEBEN APARECER EN AMBOS SITIOS
let businessesState = [
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
];

// NO MÁS NEGOCIOS - Solo los 6 principales para sincronización perfecta

/**
 * Obtener todos los negocios
 */
function getAllBusinesses() {
    return [...businessesState]; // Copia para evitar mutaciones
}

/**
 * Obtener solo negocios visibles
 */
function getVisibleBusinesses() {
    return businessesState.filter(business => business.visible_en_directorio === 1 || business.visible_en_directorio === true);
}

/**
 * Actualizar visibilidad de un negocio
 */
function updateBusinessVisibility(businessId, visible) {
    const business = businessesState.find(b => b.id === parseInt(businessId));
    if (business) {
        business.visible_en_directorio = visible;
        console.log(`🔄 Negocio ${businessId} (${business.nombre_negocio}) ${visible ? 'ACTIVADO' : 'DESACTIVADO'}`);
        return true;
    }
    return false;
}

/**
 * Obtener estadísticas
 */
function getBusinessStats() {
    const total = businessesState.length;
    const visible = businessesState.filter(b => b.visible_en_directorio === 1 || b.visible_en_directorio === true).length;
    const hidden = total - visible;
    
    return { total, visible, hidden };
}

module.exports = {
    getAllBusinesses,
    getVisibleBusinesses,
    updateBusinessVisibility,
    getBusinessStats
};
