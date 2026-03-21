#!/usr/bin/env node

/**
 * Script de vérification de santé de l'application
 * Vérifie l'état de tous les services et composants
 */

const http = require('http');
const https = require('https');

// Configuration
const config = {
  app: {
    url: 'http://localhost:3000',
    timeout: 5000
  },
  supabase: {
    url: 'http://localhost:8001',
    timeout: 5000
  },
  mailhog: {
    url: 'http://localhost:8025',
    timeout: 5000
  }
};

// Fonction pour faire une requête HTTP
function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout }, (res) => {
      resolve({
        status: res.statusCode,
        healthy: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Fonction principale de vérification
async function healthCheck() {
  console.log('🔍 Vérification de santé de l\'application...\n');

  const checks = [
    {
      name: 'Application Next.js',
      url: config.app.url,
      critical: true
    },
    {
      name: 'API Supabase',
      url: `${config.supabase.url}/rest/v1/`,
      critical: true
    },
    {
      name: 'MailHog',
      url: config.mailhog.url,
      critical: false
    }
  ];

  const results = [];

  for (const check of checks) {
    try {
      console.log(`⏳ Vérification de ${check.name}...`);
      const result = await makeRequest(check.url, config.app.timeout);
      results.push({
        ...check,
        status: result.status,
        healthy: result.healthy,
        error: null
      });
      console.log(`✅ ${check.name}: ${result.status} (${result.healthy ? 'OK' : 'KO'})`);
    } catch (error) {
      results.push({
        ...check,
        status: null,
        healthy: false,
        error: error.message
      });
      console.log(`❌ ${check.name}: ${error.message}`);
    }
  }

  // Résumé
  console.log('\n📊 Résumé des vérifications:');
  const healthy = results.filter(r => r.healthy).length;
  const total = results.length;
  const critical = results.filter(r => r.critical && !r.healthy);

  console.log(`✅ Services sains: ${healthy}/${total}`);

  if (critical.length > 0) {
    console.log('🚨 Services critiques en panne:');
    critical.forEach(service => {
      console.log(`   - ${service.name}: ${service.error || 'Status ' + service.status}`);
    });
    process.exit(1);
  } else {
    console.log('🎉 Tous les services critiques sont opérationnels!');
    process.exit(0);
  }
}

// Exécution
if (require.main === module) {
  healthCheck().catch(error => {
    console.error('💥 Erreur lors de la vérification:', error);
    process.exit(1);
  });
}

module.exports = { healthCheck, makeRequest };
