const https = require('https');
const { URL } = require('url');

exports.handler = async (event, context) => {
  // Solo permitir GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const imageUrl = event.queryStringParameters?.url;
  
  if (!imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter required' })
    };
  }
  
  // Verificar que sea una URL de Google Maps
  if (!imageUrl.includes('maps.googleapis.com')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Only Google Maps URLs allowed' })
    };
  }
  
  console.log('🖼️ Proxying image:', imageUrl);
  
  return new Promise((resolve) => {
    function fetchImage(url, redirectCount = 0) {
      if (redirectCount > 5) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Too many redirects' })
        });
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
          const chunks = [];
          
          response.on('data', (chunk) => {
            chunks.push(chunk);
          });
          
          response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            console.log('✅ Image served successfully');
            
            resolve({
              statusCode: 200,
              headers: {
                'Content-Type': response.headers['content-type'] || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*'
              },
              body: buffer.toString('base64'),
              isBase64Encoded: true
            });
          });
        } else {
          console.error(`❌ Error: Status ${response.statusCode}`);
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: `HTTP ${response.statusCode}` })
          });
        }
      });
      
      request.on('error', (err) => {
        console.error('Error fetching image:', err);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to fetch image' })
        });
      });
      
      request.end();
    }
    
    fetchImage(imageUrl);
  });
};
