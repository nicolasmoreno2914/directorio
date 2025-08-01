const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Función para conectar a la base de datos SQLite
function connectToDatabase() {
  const dbPath = path.join(__dirname, 'data', 'yo_compro_acacias.sqlite');
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error conectando a SQLite:', err.message);
    } else {
      console.log('✅ Conectado a la base de datos SQLite');
    }
  });
}

// Endpoint para obtener todos los negocios
app.get('/api/businesses', (req, res) => {
  const db = connectToDatabase();
  
  const query = `
    SELECT 
      business_id as id,
      nombre_negocio,
      categoria_principal as categoria,
      direccion,
      telefono,
      horarios as horario_atencion,
      calificacion_promedio as calificacion,
      imagenes,
      visible_en_directorio,
      lat,
      lng as lon,
      created_at,
      updated_at
    FROM businesses 
    WHERE visible_en_directorio = 1
    ORDER BY nombre_negocio ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error en consulta:', err.message);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    console.log(`📋 ${rows.length} negocios encontrados`);
    res.json(rows);
  });
  
  db.close();
});

// Función para obtener redes sociales simuladas
function getSocialMediaProfiles(businessName) {
  // Datos simulados realistas para demostración
  const mockProfiles = {
    'Barberia. Paris lo.mejor para el hombre ': {
      facebook: 'https://facebook.com/barberia.paris.acacias',
      instagram: 'https://instagram.com/barberia_paris',
      whatsapp: 'https://wa.me/573007654321'
    },
    'Amalia F3 Nails and Makeup': {
      facebook: 'https://facebook.com/amalia.nails.acacias',
      instagram: 'https://instagram.com/amalia_f3_nails',
      whatsapp: 'https://wa.me/573001234567'
    },
    'BFC': {
      facebook: 'https://facebook.com/bfc.acacias',
      instagram: 'https://instagram.com/bfc_acacias',
      whatsapp: 'https://wa.me/573009876543'
    },
    'Chorizos Los Monos': {
      facebook: 'https://facebook.com/chorizos.losmonos',
      instagram: 'https://instagram.com/chorizos_losmonos',
      whatsapp: 'https://wa.me/573005566778'
    }
  };
  
  // Buscar perfiles específicos o generar simulados
  const businessProfiles = mockProfiles[businessName];
  if (businessProfiles) {
    return businessProfiles;
  }
  
  // Generar datos simulados para otros negocios
  if (Math.random() > 0.5) { // 50% de probabilidad
    const businessSlug = businessName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '.');
    
    const profiles = {};
    
    // WhatsApp siempre disponible
    const randomPhone = '57300' + Math.floor(Math.random() * 9000000 + 1000000);
    profiles.whatsapp = `https://wa.me/${randomPhone}`;
    
    // Facebook (70% probabilidad)
    if (Math.random() > 0.3) {
      profiles.facebook = `https://facebook.com/${businessSlug}.acacias`;
    }
    
    // Instagram (60% probabilidad)
    if (Math.random() > 0.4) {
      profiles.instagram = `https://instagram.com/${businessSlug.replace(/\./g, '_')}`;
    }
    
    return profiles;
  }
  
  return null;
}

// Obtener negocio individual por ID con redes sociales
app.get('/api/business/:id', (req, res) => {
  const businessId = req.params.id;
  const db = connectToDatabase();
  
  const query = `
    SELECT 
      business_id as id,
      nombre_negocio,
      categoria_principal as categoria,
      direccion,
      telefono,
      horarios as horario_atencion,
      calificacion_promedio as calificacion,
      imagenes,
      visible_en_directorio,
      lat,
      lng as lon,
      created_at,
      updated_at
    FROM businesses 
    WHERE business_id = ? AND visible_en_directorio = 1
  `;
  
  db.get(query, [businessId], (err, row) => {
    if (err) {
      console.error('Error en consulta:', err.message);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Business not found' });
      return;
    }
    
    console.log(`🏢 Negocio encontrado: ${row.nombre_negocio}`);
    
    // Obtener redes sociales para este negocio
    const socialProfiles = getSocialMediaProfiles(row.nombre_negocio);
    
    // Agregar redes sociales al resultado
    const businessWithSocial = {
      ...row,
      socialProfiles: socialProfiles || {},
      redes_sociales: socialProfiles || {}
    };
    
    console.log(`📱 Redes sociales agregadas:`, socialProfiles ? Object.keys(socialProfiles) : 'ninguna');
    
    res.json(businessWithSocial);
  });
  
  db.close();
});

// Proxy para servir imágenes de Google My Business sin problemas CORS
app.get('/api/image-proxy', (req, res) => {
  const imageUrl = req.query.url;
  
  if (!imageUrl) {
    return res.status(400).json({ error: 'URL parameter required' });
  }
  
  // Verificar que sea una URL de Google Maps
  if (!imageUrl.includes('maps.googleapis.com')) {
    return res.status(400).json({ error: 'Only Google Maps URLs allowed' });
  }
  
  console.log('🖼️ Proxying image:', imageUrl);
  
  const https = require('https');
  const { URL } = require('url');
  
  function fetchImage(url, redirectCount = 0) {
    if (redirectCount > 5) {
      return res.status(500).json({ error: 'Too many redirects' });
    }
    
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    const request = https.request(options, (response) => {
      console.log(`🔄 Response status: ${response.statusCode}`);
      
      // Manejar redirecciones
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`➡️ Redirecting to: ${response.headers.location}`);
        return fetchImage(response.headers.location, redirectCount + 1);
      }
      
      // Si es una imagen, servirla
      if (response.statusCode === 200) {
        res.set({
          'Content-Type': response.headers['content-type'] || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        });
        
        response.pipe(res);
        console.log('✅ Image served successfully');
      } else {
        console.error(`❌ Error: Status ${response.statusCode}`);
        res.status(500).json({ error: `HTTP ${response.statusCode}` });
      }
    });
    
    request.on('error', (err) => {
      console.error('Error fetching image:', err);
      res.status(500).json({ error: 'Failed to fetch image' });
    });
    
    request.end();
  }
  
  fetchImage(imageUrl);
});

// Servir página de negocio
app.get('/negocio/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'business.html'));
});

// Servir página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Accede a: http://localhost:${PORT}`);
  console.log('✨ Usando base de datos SQLite con datos reales');
  
  // Verificar conexión a la base de datos
  const db = connectToDatabase();
  db.get("SELECT COUNT(*) as count FROM businesses", [], (err, row) => {
    if (err) {
      console.error('❌ Error verificando base de datos:', err.message);
    } else {
      console.log(`📋 ${row.count} negocios encontrados en la base de datos`);
    }
  });
  db.close();
});
