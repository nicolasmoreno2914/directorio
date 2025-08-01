const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Función para conectar a la base de datos SQLite
function connectToDatabase() {
  const dbPath = path.join(process.cwd(), 'public', 'yo_compro_acacias.sqlite');
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error conectando a SQLite:', err.message);
    } else {
      console.log('✅ Conectado a la base de datos SQLite');
    }
  });
}

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

  return new Promise((resolve) => {
    const db = connectToDatabase();
    
    const query = `
      SELECT 
        id,
        nombre_negocio,
        categoria,
        direccion,
        telefono,
        horario_atencion,
        calificacion,
        imagenes,
        visible_en_directorio,
        lat,
        lon,
        created_at,
        updated_at
      FROM businesses 
      WHERE visible_en_directorio = 1
      ORDER BY nombre_negocio ASC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error en consulta:', err.message);
        resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Database error' })
        });
        return;
      }
      
      console.log(`📋 ${rows.length} negocios encontrados`);
      
      resolve({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
        },
        body: JSON.stringify(rows)
      });
    });
    
    db.close();
  });
};
