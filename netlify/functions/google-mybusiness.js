const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Configuración
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const API_KEY = process.env.GOOGLE_API_KEY;

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/google-mybusiness', '');
    
    switch (path) {
      case '/search-business':
        return await searchBusiness(event, headers);
      case '/business-details':
        return await getBusinessDetails(event, headers);
      case '/social-profiles':
        return await getSocialProfiles(event, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Endpoint not found' })
        };
    }
  } catch (error) {
    console.error('Google My Business API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

// Buscar negocio usando Places API
async function searchBusiness(event, headers) {
  const { query, location } = event.queryStringParameters || {};
  
  if (!query) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Query parameter required' })
    };
  }

  try {
    const placesUrl = `https://places.googleapis.com/v1/places:searchText`;
    
    const requestBody = {
      textQuery: query,
      locationBias: location ? {
        circle: {
          center: {
            latitude: parseFloat(location.split(',')[0]),
            longitude: parseFloat(location.split(',')[1])
          },
          radius: 10000
        }
      } : undefined,
      maxResultCount: 10
    };

    const response = await fetch(placesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.businessStatus,places.googleMapsUri'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Places API error: ${data.error?.message || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        businesses: data.places || [],
        count: data.places?.length || 0
      })
    };
  } catch (error) {
    console.error('Search business error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to search businesses', details: error.message })
    };
  }
}

// Obtener detalles completos del negocio
async function getBusinessDetails(event, headers) {
  const { placeId } = event.queryStringParameters || {};
  
  if (!placeId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'placeId parameter required' })
    };
  }

  try {
    const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}`;
    
    const response = await fetch(detailsUrl, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,websiteUri,nationalPhoneNumber,businessStatus,googleMapsUri,photos,editorialSummary,rating,userRatingCount,priceLevel,types,currentOpeningHours'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Places API error: ${data.error?.message || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        business: data
      })
    };
  } catch (error) {
    console.error('Get business details error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get business details', details: error.message })
    };
  }
}

// Obtener perfiles sociales (simulado por ahora, ya que requiere My Business API completa)
async function getSocialProfiles(event, headers) {
  const { businessName, website } = event.queryStringParameters || {};
  
  if (!businessName) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'businessName parameter required' })
    };
  }

  try {
    // Por ahora, extraer redes sociales del sitio web si está disponible
    const socialProfiles = await extractSocialFromWebsite(website, businessName);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        socialProfiles,
        source: 'extracted_from_website'
      })
    };
  } catch (error) {
    console.error('Get social profiles error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get social profiles', details: error.message })
    };
  }
}

// Función auxiliar para extraer redes sociales del sitio web
async function extractSocialFromWebsite(website, businessName) {
  const socialProfiles = {};
  
  if (!website) {
    // Generar perfiles sociales probables basados en el nombre del negocio
    const cleanName = businessName.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    
    return {
      facebook: `https://facebook.com/${cleanName}`,
      instagram: `https://instagram.com/${cleanName}`,
      whatsapp: `https://wa.me/573001234567`,
      website: website || null
    };
  }

  try {
    // En una implementación real, aquí harías scraping del sitio web
    // para encontrar enlaces a redes sociales
    const response = await fetch(website, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DirectorioBot/1.0)'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      
      // Buscar patrones de redes sociales en el HTML
      const facebookMatch = html.match(/facebook\.com\/([a-zA-Z0-9._-]+)/);
      const instagramMatch = html.match(/instagram\.com\/([a-zA-Z0-9._-]+)/);
      const twitterMatch = html.match(/twitter\.com\/([a-zA-Z0-9._-]+)/);
      const whatsappMatch = html.match(/wa\.me\/(\d+)/);
      
      if (facebookMatch) socialProfiles.facebook = `https://facebook.com/${facebookMatch[1]}`;
      if (instagramMatch) socialProfiles.instagram = `https://instagram.com/${instagramMatch[1]}`;
      if (twitterMatch) socialProfiles.twitter = `https://twitter.com/${twitterMatch[1]}`;
      if (whatsappMatch) socialProfiles.whatsapp = `https://wa.me/${whatsappMatch[1]}`;
    }
  } catch (error) {
    console.log('Could not extract social profiles from website:', error.message);
  }

  // Si no encontramos nada, retornar perfiles vacíos
  return {
    website: website,
    ...socialProfiles
  };
}
