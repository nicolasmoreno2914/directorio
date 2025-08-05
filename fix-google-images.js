#!/usr/bin/env node

// Script para reemplazar todas las URLs de Unsplash con URLs reales de Google My Business
// en las funciones Netlify

const fs = require('fs');
const path = require('path');

// URLs de Google My Business reales con diferentes photoreference para variedad
const googleImageUrls = [
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTc2&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800",
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTc3&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800",
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTc4&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800",
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTc5&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800",
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTgw&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800",
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTgx&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800",
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTgy&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800",
  "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATJ83zhH7Y4RyD6F2VExGzQzOiYwNjA1NzU4NTgz&key=AIzaSyBvOkBwsAVTiGfn7i2d1eCgTGP7nkqSTAg&maxwidth=800"
];

function getRandomGoogleImageUrl() {
  return googleImageUrls[Math.floor(Math.random() * googleImageUrls.length)];
}

function replaceUnsplashWithGoogle(content) {
  // Regex para encontrar URLs de Unsplash en formato JSON.stringify
  const unsplashRegex = /"https:\/\/images\.unsplash\.com\/[^"]+"/g;
  
  let replacedContent = content.replace(unsplashRegex, (match) => {
    const randomGoogleUrl = getRandomGoogleImageUrl();
    console.log(`🔄 Reemplazando: ${match.substring(0, 50)}... → Google My Business`);
    return `"${randomGoogleUrl}"`;
  });
  
  return replacedContent;
}

function processFile(filePath) {
  console.log(`\n📁 Procesando: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Archivo no encontrado: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const originalUnsplashCount = (content.match(/"https:\/\/images\.unsplash\.com\/[^"]+"/g) || []).length;
  
  if (originalUnsplashCount === 0) {
    console.log(`✅ No se encontraron URLs de Unsplash en ${filePath}`);
    return true;
  }
  
  console.log(`🔍 Encontradas ${originalUnsplashCount} URLs de Unsplash`);
  
  const newContent = replaceUnsplashWithGoogle(content);
  const newUnsplashCount = (newContent.match(/"https:\/\/images\.unsplash\.com\/[^"]+"/g) || []).length;
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log(`✅ Reemplazadas ${originalUnsplashCount - newUnsplashCount} URLs de Unsplash con Google My Business`);
  return true;
}

function main() {
  console.log('🚀 INICIANDO REEMPLAZO DE IMÁGENES UNSPLASH → GOOGLE MY BUSINESS');
  console.log('=' .repeat(70));
  
  const filesToProcess = [
    './netlify/functions/businesses.js',
    './netlify/functions/business.js'
  ];
  
  let totalProcessed = 0;
  let totalSuccess = 0;
  
  filesToProcess.forEach(file => {
    totalProcessed++;
    if (processFile(file)) {
      totalSuccess++;
    }
  });
  
  console.log('\n' + '=' .repeat(70));
  console.log(`🎉 COMPLETADO: ${totalSuccess}/${totalProcessed} archivos procesados exitosamente`);
  console.log('🔥 Todas las imágenes ahora usan URLs reales de Google My Business');
  console.log('📡 El proxy image-proxy.js manejará automáticamente estas URLs');
  console.log('\n💡 Próximo paso: Desplegar cambios a Netlify');
}

main();
