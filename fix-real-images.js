#!/usr/bin/env node

// Script para reemplazar URLs ficticias de Google My Business con imágenes reales funcionales
// Usando fuentes públicas que realmente funcionen

const fs = require('fs');
const path = require('path');

// URLs de imágenes reales de negocios que SÍ funcionan (fuentes públicas)
const realBusinessImages = [
  // Hoteles
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Tiendas y comercios
  "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Restaurantes
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Farmacias y salud
  "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Supermercados
  "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Belleza y estética
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Servicios generales
  "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"
];

function getRandomRealImage() {
  return realBusinessImages[Math.floor(Math.random() * realBusinessImages.length)];
}

function replaceGoogleWithReal(content) {
  // Regex para encontrar URLs ficticias de Google My Business
  const googleRegex = /"https:\/\/maps\.googleapis\.com\/maps\/api\/place\/photo[^"]+"/g;
  
  let replacedContent = content.replace(googleRegex, (match) => {
    const randomRealUrl = getRandomRealImage();
    console.log(`🔄 Reemplazando Google ficticia → Imagen real: ${randomRealUrl.substring(0, 60)}...`);
    return `"${randomRealUrl}"`;
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
  const originalGoogleCount = (content.match(/"https:\/\/maps\.googleapis\.com\/maps\/api\/place\/photo[^"]+"/g) || []).length;
  
  if (originalGoogleCount === 0) {
    console.log(`✅ No se encontraron URLs ficticias de Google en ${filePath}`);
    return true;
  }
  
  console.log(`🔍 Encontradas ${originalGoogleCount} URLs ficticias de Google My Business`);
  
  const newContent = replaceGoogleWithReal(content);
  const newGoogleCount = (newContent.match(/"https:\/\/maps\.googleapis\.com\/maps\/api\/place\/photo[^"]+"/g) || []).length;
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log(`✅ Reemplazadas ${originalGoogleCount - newGoogleCount} URLs ficticias con imágenes reales funcionales`);
  return true;
}

function main() {
  console.log('🚀 REEMPLAZANDO URLs FICTICIAS DE GOOGLE → IMÁGENES REALES FUNCIONALES');
  console.log('=' .repeat(80));
  
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
  
  console.log('\n' + '=' .repeat(80));
  console.log(`🎉 COMPLETADO: ${totalSuccess}/${totalProcessed} archivos procesados exitosamente`);
  console.log('🔥 Todas las imágenes ahora usan URLs reales y funcionales de Pexels');
  console.log('✅ No requieren proxy - son URLs públicas directas');
  console.log('\n💡 Próximo paso: Desplegar cambios a Netlify');
}

main();
