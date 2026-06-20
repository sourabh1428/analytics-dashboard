/**
 * Sitemap generator utility
 * This script generates a sitemap.xml file based on the application's routes
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Route configuration
const routes = [
  { 
    path: '/', 
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0,
    images: [
      {
        loc: 'https://easibill.site/assets/easibill-preview.png',
        caption: 'Easibill - Best Billing Service'
      }
    ]
  },
  { 
    path: '/contact', 
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6 
  },
  { 
    path: '/lead', 
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9 
  }
];

/**
 * Generate sitemap XML content
 * @param {string} baseUrl - The base URL of the website
 * @param {Array} routes - Array of route objects with path, lastmod, changefreq, priority
 * @returns {string} - XML content of the sitemap
 */
export function generateSitemapXml(baseUrl = 'https://easibill.site', routeConfig = routes) {
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
  xml += '        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  // Add each route
  routeConfig.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    if (route.lastmod) {
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
    }
    if (route.changefreq) {
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    }
    if (route.priority) {
      xml += `    <priority>${route.priority}</priority>\n`;
    }
    
    // Add images if they exist
    if (route.images && route.images.length > 0) {
      route.images.forEach(image => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${image.loc}</image:loc>\n`;
        if (image.caption) {
          xml += `      <image:caption>${image.caption}</image:caption>\n`;
        }
        xml += '    </image:image>\n';
      });
    }
    
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  
  return xml;
}

/**
 * Write sitemap to file
 * @param {string} xml - XML content
 * @param {string} outputPath - Path to output file
 */
export function writeSitemapToFile(xml, outputPath) {
  fs.writeFileSync(outputPath, xml);
  console.log(`Sitemap written to ${outputPath}`);
}

// This allows running the script directly with Node.js
if (typeof process !== 'undefined' && process.argv[1] === fileURLToPath(import.meta.url)) {
  const xml = generateSitemapXml();
  const outputPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  writeSitemapToFile(xml, outputPath);
}

export default { generateSitemapXml, writeSitemapToFile }; 
