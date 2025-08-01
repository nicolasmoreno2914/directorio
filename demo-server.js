// Demo Server - Yo Compro Acacías
// Servidor simplificado con datos de demostración para preview inmediato

const express = require('express');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Datos de demostración
const mockBusinesses = [
  {
    id: 1,
    business_id: 'demo_001',
    nombre_negocio: 'Arepas Doña Lidia',
    slug: 'arepas-dona-lidia',
    categoria_principal: 'Restaurante',
    direccion: 'Calle 18 #10-30, Acacías, Meta',
    latitud: 3.98765,
    longitud: -73.76543,
    horarios: {
      lunes: '06:00-20:00',
      martes: '06:00-20:00',
      miercoles: '06:00-20:00',
      jueves: '06:00-20:00',
      viernes: '06:00-20:00',
      sabado: '06:00-21:00',
      domingo: '07:00-19:00'
    },
    descripcion: 'Deliciosas arepas tradicionales llaneras. Más de 20 años sirviendo los mejores desayunos de Acacías.',
    imagenes: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
    ],
    calificacion_promedio: 4.8,
    reseñas: [
      {
        autor: 'María González',
        calificacion: 5,
        comentario: 'Las mejores arepas de Acacías! El servicio es excelente y los precios muy justos.',
        fecha: '2025-01-20T10:30:00Z'
      },
      {
        autor: 'Carlos Rodríguez',
        calificacion: 5,
        comentario: 'Tradición familiar, sabor auténtico. Recomendado 100%.',
        fecha: '2025-01-18T08:15:00Z'
      },
      {
        autor: 'Ana Martínez',
        calificacion: 4,
        comentario: 'Muy buenas arepas, ambiente familiar y acogedor.',
        fecha: '2025-01-15T12:45:00Z'
      }
    ],
    url_perfil_google: 'https://www.google.com/maps/place/Acacías,+Meta',
    municipio: 'Acacías',
    departamento: 'Meta',
    pais: 'Colombia',
    visible_en_directorio: true,
    total_compartidos: 45
  },
  {
    id: 2,
    business_id: 'demo_002',
    nombre_negocio: 'Farmacia San Rafael',
    slug: 'farmacia-san-rafael',
    categoria_principal: 'Farmacia',
    direccion: 'Carrera 15 #22-45, Acacías, Meta',
    latitud: 3.98234,
    longitud: -73.76123,
    horarios: {
      lunes: '07:00-19:00',
      martes: '07:00-19:00',
      miercoles: '07:00-19:00',
      jueves: '07:00-19:00',
      viernes: '07:00-19:00',
      sabado: '08:00-18:00',
      domingo: '09:00-17:00'
    },
    descripcion: 'Farmacia con amplio surtido de medicamentos y productos de salud. Atención profesional las 24 horas.',
    imagenes: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      'https://images.unsplash.com/photo-1585435557343-3b092031d4c1?w=400'
    ],
    calificacion_promedio: 4.6,
    reseñas: [
      {
        autor: 'Pedro Jiménez',
        calificacion: 5,
        comentario: 'Excelente atención, siempre tienen los medicamentos que necesito.',
        fecha: '2025-01-22T16:20:00Z'
      },
      {
        autor: 'Lucía Herrera',
        calificacion: 4,
        comentario: 'Buenos precios y personal muy amable.',
        fecha: '2025-01-19T14:30:00Z'
      }
    ],
    url_perfil_google: 'https://www.google.com/maps/place/Acacías,+Meta',
    municipio: 'Acacías',
    departamento: 'Meta',
    pais: 'Colombia',
    visible_en_directorio: true,
    total_compartidos: 23
  },
  {
    id: 3,
    business_id: 'demo_003',
    nombre_negocio: 'Supermercado El Ahorro',
    slug: 'supermercado-el-ahorro',
    categoria_principal: 'Supermercado',
    direccion: 'Calle 20 #8-15, Acacías, Meta',
    latitud: 3.98456,
    longitud: -73.76789,
    horarios: {
      lunes: '06:00-21:00',
      martes: '06:00-21:00',
      miercoles: '06:00-21:00',
      jueves: '06:00-21:00',
      viernes: '06:00-21:00',
      sabado: '06:00-22:00',
      domingo: '07:00-20:00'
    },
    descripcion: 'Supermercado familiar con productos frescos, abarrotes y artículos para el hogar a los mejores precios.',
    imagenes: [
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
    ],
    calificacion_promedio: 4.3,
    reseñas: [
      {
        autor: 'Roberto Silva',
        calificacion: 4,
        comentario: 'Buenos precios y variedad de productos. Muy conveniente.',
        fecha: '2025-01-21T11:15:00Z'
      }
    ],
    url_perfil_google: 'https://www.google.com/maps/place/Acacías,+Meta',
    municipio: 'Acacías',
    departamento: 'Meta',
    pais: 'Colombia',
    visible_en_directorio: true,
    total_compartidos: 18
  },
  {
    id: 4,
    business_id: 'demo_004',
    nombre_negocio: 'Peluquería Estilo y Belleza',
    slug: 'peluqueria-estilo-y-belleza',
    categoria_principal: 'Belleza',
    direccion: 'Carrera 12 #25-30, Acacías, Meta',
    latitud: 3.98567,
    longitud: -73.76234,
    horarios: {
      martes: '08:00-18:00',
      miercoles: '08:00-18:00',
      jueves: '08:00-18:00',
      viernes: '08:00-18:00',
      sabado: '08:00-19:00'
    },
    descripcion: 'Salón de belleza especializado en cortes modernos, peinados y tratamientos capilares.',
    imagenes: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'
    ],
    calificacion_promedio: 4.9,
    reseñas: [
      {
        autor: 'Isabella Torres',
        calificacion: 5,
        comentario: 'Excelente trabajo, muy profesionales y el ambiente es muy agradable.',
        fecha: '2025-01-20T15:45:00Z'
      }
    ],
    url_perfil_google: 'https://www.google.com/maps/place/Acacías,+Meta',
    municipio: 'Acacías',
    departamento: 'Meta',
    pais: 'Colombia',
    visible_en_directorio: true,
    total_compartidos: 31
  },
  {
    id: 5,
    business_id: 'demo_005',
    nombre_negocio: 'Ferretería Los Andes',
    slug: 'ferreteria-los-andes',
    categoria_principal: 'Ferretería',
    direccion: 'Calle 16 #14-20, Acacías, Meta',
    latitud: 3.98345,
    longitud: -73.76456,
    horarios: {
      lunes: '07:00-18:00',
      martes: '07:00-18:00',
      miercoles: '07:00-18:00',
      jueves: '07:00-18:00',
      viernes: '07:00-18:00',
      sabado: '07:00-17:00'
    },
    descripcion: 'Ferretería completa con herramientas, materiales de construcción y artículos para el hogar.',
    imagenes: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    ],
    calificacion_promedio: 4.4,
    reseñas: [],
    url_perfil_google: 'https://www.google.com/maps/place/Acacías,+Meta',
    municipio: 'Acacías',
    departamento: 'Meta',
    pais: 'Colombia',
    visible_en_directorio: true,
    total_compartidos: 12
  }
];

// API Routes

// Obtener todos los negocios
app.get('/api/businesses', (req, res) => {
  const { page = 1, limit = 20, categoria, search } = req.query;
  
  let filteredBusinesses = mockBusinesses.filter(b => b.visible_en_directorio);
  
  // Filtro por categoría
  if (categoria && categoria !== 'todas') {
    filteredBusinesses = filteredBusinesses.filter(b => 
      b.categoria_principal.toLowerCase().includes(categoria.toLowerCase())
    );
  }
  
  // Búsqueda por texto
  if (search) {
    const searchLower = search.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(b => 
      b.nombre_negocio.toLowerCase().includes(searchLower) ||
      b.descripcion.toLowerCase().includes(searchLower) ||
      b.categoria_principal.toLowerCase().includes(searchLower)
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);
  
  res.json({
    businesses: paginatedBusinesses,
    totalPages: Math.ceil(filteredBusinesses.length / limit),
    currentPage: parseInt(page),
    total: filteredBusinesses.length
  });
});

// Obtener negocio por slug
app.get('/api/businesses/:slug', (req, res) => {
  const business = mockBusinesses.find(b => 
    b.slug === req.params.slug && b.visible_en_directorio
  );
  
  if (!business) {
    return res.status(404).json({ error: 'Negocio no encontrado' });
  }
  
  res.json(business);
});

// Incrementar contador de compartidos
app.post('/api/businesses/:slug/share', (req, res) => {
  const business = mockBusinesses.find(b => 
    b.slug === req.params.slug && b.visible_en_directorio
  );
  
  if (!business) {
    return res.status(404).json({ error: 'Negocio no encontrado' });
  }
  
  business.total_compartidos += 1;
  
  res.json({ 
    message: 'Compartido registrado',
    total_compartidos: business.total_compartidos
  });
});

// Generar código QR
app.get('/api/businesses/:slug/qr', async (req, res) => {
  const business = mockBusinesses.find(b => 
    b.slug === req.params.slug && b.visible_en_directorio
  );
  
  if (!business) {
    return res.status(404).json({ error: 'Negocio no encontrado' });
  }
  
  try {
    const businessUrl = `${req.protocol}://${req.get('host')}/${business.slug}`;
    const qrBuffer = await QRCode.toBuffer(businessUrl, {
      type: 'png',
      width: 300,
      margin: 2
    });
    
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${business.slug}-qr.png"`
    });
    
    res.send(qrBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Error generando código QR' });
  }
});

// Obtener categorías
app.get('/api/businesses/meta/categories', (req, res) => {
  const categories = {};
  
  mockBusinesses
    .filter(b => b.visible_en_directorio)
    .forEach(business => {
      const cat = business.categoria_principal;
      categories[cat] = (categories[cat] || 0) + 1;
    });
  
  const categoryList = Object.entries(categories).map(([name, count]) => ({
    name,
    count
  }));
  
  res.json(categoryList);
});

// Obtener estadísticas
app.get('/api/stats', (req, res) => {
  const visibleBusinesses = mockBusinesses.filter(b => b.visible_en_directorio);
  
  // Categorías
  const categories = {};
  visibleBusinesses.forEach(business => {
    const cat = business.categoria_principal;
    categories[cat] = (categories[cat] || 0) + 1;
  });
  
  const topCategorias = Object.entries(categories)
    .map(([categoria, cantidad]) => ({ categoria, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);
  
  // Mejor calificados
  const mejorCalificados = [...visibleBusinesses]
    .filter(b => b.calificacion_promedio >= 4.0)
    .sort((a, b) => b.calificacion_promedio - a.calificacion_promedio)
    .slice(0, 10);
  
  // Más compartidos
  const masCompartidos = [...visibleBusinesses]
    .filter(b => b.total_compartidos > 0)
    .sort((a, b) => b.total_compartidos - a.total_compartidos)
    .slice(0, 10);
  
  res.json({
    resumen: {
      totalIntegrados: mockBusinesses.length,
      totalVisibles: visibleBusinesses.length,
      totalCategorias: Object.keys(categories).length
    },
    categorias: topCategorias,
    mejorCalificados,
    masCompartidos
  });
});

// Rutas de páginas
app.get('/:slug', (req, res) => {
  const business = mockBusinesses.find(b => 
    b.slug === req.params.slug && b.visible_en_directorio
  );
  
  if (!business) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
  
  res.sendFile(path.join(__dirname, 'public', 'business.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🎉 ¡Yo Compro Acacías - DEMO Mode!');
  console.log(`🚀 Servidor demo corriendo en puerto ${PORT}`);
  console.log(`🌐 Accede a: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Datos de demostración cargados:');
  console.log(`   • ${mockBusinesses.length} negocios de ejemplo`);
  console.log(`   • ${mockBusinesses.filter(b => b.visible_en_directorio).length} negocios visibles`);
  console.log(`   • ${new Set(mockBusinesses.map(b => b.categoria_principal)).size} categorías`);
  console.log('');
  console.log('✨ Esta es una versión demo con datos simulados');
  console.log('   Para la versión completa, configura PostgreSQL y Google Business Profile API');
});

module.exports = app;
