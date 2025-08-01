const { OAuth2Client } = require('google-auth-library');

// Configuración OAuth2
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://directoriocomercial.netlify.app/auth/google/callback';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Scopes necesarios para Google My Business
const SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
  'https://www.googleapis.com/auth/plus.business.manage',
  'https://www.googleapis.com/auth/userinfo.profile'
];

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/google-oauth', '');
    
    switch (path) {
      case '/auth':
        return handleAuth(event, headers);
      case '/callback':
        return handleCallback(event, headers);
      case '/profile':
        return handleProfile(event, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Endpoint not found' })
        };
    }
  } catch (error) {
    console.error('OAuth Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

// Iniciar proceso de autenticación
async function handleAuth(event, headers) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ authUrl })
  };
}

// Manejar callback de Google
async function handleCallback(event, headers) {
  const { code } = event.queryStringParameters || {};
  
  if (!code) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Authorization code required' })
    };
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Guardar tokens de forma segura (en producción usar base de datos)
    // Por ahora retornamos para uso inmediato
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Authentication successful',
        // En producción, no retornar tokens directamente
        tokens: tokens
      })
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Failed to exchange code for tokens' })
    };
  }
}

// Obtener perfil del usuario autenticado
async function handleProfile(event, headers) {
  const authHeader = event.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Access token required' })
    };
  }

  const accessToken = authHeader.substring(7);
  oauth2Client.setCredentials({ access_token: accessToken });

  try {
    // Obtener información del perfil
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const profile = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ profile })
    };
  } catch (error) {
    console.error('Profile fetch error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch profile' })
    };
  }
}
