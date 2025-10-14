#!/usr/bin/env node

/**
 * Moniteur de performance avancé
 * Surveille les performances de l'application en temps réel
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

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
  monitoring: {
    interval: 30000, // 30 secondes
    logFile: 'monitoring/performance.log',
    maxLogSize: 10 * 1024 * 1024, // 10MB
    retentionDays: 7
  }
};

// Métriques collectées
let metrics = {
  requests: 0,
  errors: 0,
  avgResponseTime: 0,
  maxResponseTime: 0,
  minResponseTime: Infinity,
  uptime: Date.now(),
  lastCheck: null
};

// Fonction pour faire une requête HTTP avec mesure du temps
function makeTimedRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const req = http.get(url, { timeout }, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      resolve({
        status: res.statusCode,
        responseTime,
        healthy: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    req.on('error', (err) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      reject({ error: err, responseTime });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject({ error: new Error('Timeout'), responseTime: timeout });
    });
  });
}

// Fonction pour collecter les métriques
async function collectMetrics() {
  const checks = [
    { name: 'app', url: config.app.url },
    { name: 'supabase', url: config.supabase.url }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      const result = await makeTimedRequest(check.url, config.app.timeout);
      results.push({
        service: check.name,
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        service: check.name,
        status: null,
        responseTime: error.responseTime || 0,
        healthy: false,
        error: error.error?.message || 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return results;
}

// Fonction pour mettre à jour les métriques globales
function updateGlobalMetrics(results) {
  const appResult = results.find(r => r.service === 'app');
  
  if (appResult) {
    metrics.requests++;
    metrics.lastCheck = new Date().toISOString();
    
    if (!appResult.healthy) {
      metrics.errors++;
    }
    
    // Mise à jour des temps de réponse
    const responseTime = appResult.responseTime;
    metrics.maxResponseTime = Math.max(metrics.maxResponseTime, responseTime);
    metrics.minResponseTime = Math.min(metrics.minResponseTime, responseTime);
    
    // Calcul de la moyenne mobile
    metrics.avgResponseTime = (metrics.avgResponseTime * (metrics.requests - 1) + responseTime) / metrics.requests;
  }
}

// Fonction pour logger les métriques
function logMetrics(results) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    metrics: { ...metrics },
    checks: results
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  
  // Écrire dans le fichier de log
  fs.appendFileSync(config.monitoring.logFile, logLine);
  
  // Afficher un résumé
  console.log(`[${new Date().toISOString()}] Requests: ${metrics.requests}, Errors: ${metrics.errors}, Avg Response: ${metrics.avgResponseTime.toFixed(2)}ms`);
}

// Fonction pour nettoyer les logs anciens
function cleanupLogs() {
  try {
    const stats = fs.statSync(config.monitoring.logFile);
    const fileSize = stats.size;
    
    if (fileSize > config.monitoring.maxLogSize) {
      // Garder seulement les 50% les plus récents
      const content = fs.readFileSync(config.monitoring.logFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      const keepLines = lines.slice(-Math.floor(lines.length / 2));
      fs.writeFileSync(config.monitoring.logFile, keepLines.join('\n') + '\n');
      console.log('Logs nettoyés');
    }
  } catch (error) {
    // Fichier n'existe pas encore, pas de problème
  }
}

// Fonction pour générer un rapport de performance
function generateReport() {
  const uptime = Date.now() - metrics.uptime;
  const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(2);
  const errorRate = metrics.requests > 0 ? ((metrics.errors / metrics.requests) * 100).toFixed(2) : 0;
  
  console.log('\n📊 RAPPORT DE PERFORMANCE');
  console.log('========================');
  console.log(`⏱️  Uptime: ${uptimeHours} heures`);
  console.log(`📈 Requêtes totales: ${metrics.requests}`);
  console.log(`❌ Erreurs: ${metrics.errors} (${errorRate}%)`);
  console.log(`⚡ Temps de réponse moyen: ${metrics.avgResponseTime.toFixed(2)}ms`);
  console.log(`🚀 Temps de réponse min: ${metrics.minResponseTime === Infinity ? 'N/A' : metrics.minResponseTime + 'ms'}`);
  console.log(`🐌 Temps de réponse max: ${metrics.maxResponseTime}ms`);
  console.log(`🕐 Dernière vérification: ${metrics.lastCheck || 'Jamais'}`);
  console.log('========================\n');
}

// Fonction principale de monitoring
async function startMonitoring() {
  console.log('🚀 Démarrage du moniteur de performance...');
  console.log(`📊 Intervalle: ${config.monitoring.interval / 1000} secondes`);
  console.log(`📝 Logs: ${config.monitoring.logFile}\n`);
  
  // Créer le dossier de monitoring s'il n'existe pas
  const monitoringDir = path.dirname(config.monitoring.logFile);
  if (!fs.existsSync(monitoringDir)) {
    fs.mkdirSync(monitoringDir, { recursive: true });
  }
  
  // Boucle de monitoring
  const interval = setInterval(async () => {
    try {
      const results = await collectMetrics();
      updateGlobalMetrics(results);
      logMetrics(results);
      
      // Nettoyer les logs toutes les 10 vérifications
      if (metrics.requests % 10 === 0) {
        cleanupLogs();
      }
      
      // Afficher un rapport toutes les 20 vérifications
      if (metrics.requests % 20 === 0) {
        generateReport();
      }
    } catch (error) {
      console.error('Erreur lors de la collecte des métriques:', error);
    }
  }, config.monitoring.interval);
  
  // Gestion de l'arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du moniteur...');
    clearInterval(interval);
    generateReport();
    process.exit(0);
  });
  
  // Première vérification immédiate
  try {
    const results = await collectMetrics();
    updateGlobalMetrics(results);
    logMetrics(results);
  } catch (error) {
    console.error('Erreur lors de la première vérification:', error);
  }
}

// Exécution
if (require.main === module) {
  startMonitoring().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = { startMonitoring, collectMetrics, generateReport };
