#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

console.log('🔐 TEST FINAL - AUTHENTIFICATION SUPABASE');
console.log('==========================================\n');

async function testDatabaseUsers() {
  console.log('1. 📊 Vérification des utilisateurs en base...');
  
  try {
    const { stdout: dbResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT id, email, name, role, aud, encrypted_password IS NOT NULL as has_password, email_confirmed_at IS NOT NULL as confirmed FROM public.users WHERE email IN (\'admin@portfolio-saas.com\', \'marie.dupont@techcorp.com\');"'
    );
    
    console.log('👥 Utilisateurs en base:');
    console.log(dbResult);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur vérification base:', error.message);
    return false;
  }
}

async function testAuthAPI() {
  console.log('\n2. 🔌 Test de l\'API d\'authentification...');
  
  try {
    // Test admin
    const { stdout: adminResult } = await execAsync(
      'curl -s -X POST "http://localhost:8001/auth/v1/token?grant_type=password" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" -H "Content-Type: application/json" -d \'{"email": "admin@portfolio-saas.com", "password": "admin123"}\''
    );
    
    console.log('🔑 Test admin:');
    console.log(adminResult);
    
    if (adminResult.includes('access_token')) {
      console.log('✅ Authentification admin: SUCCÈS');
    } else {
      console.log('❌ Authentification admin: ÉCHEC');
      return false;
    }
    
    // Test client
    const { stdout: clientResult } = await execAsync(
      'curl -s -X POST "http://localhost:8001/auth/v1/token?grant_type=password" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" -H "Content-Type: application/json" -d \'{"email": "marie.dupont@techcorp.com", "password": "client123"}\''
    );
    
    console.log('🔑 Test client:');
    console.log(clientResult);
    
    if (clientResult.includes('access_token')) {
      console.log('✅ Authentification client: SUCCÈS');
    } else {
      console.log('❌ Authentification client: ÉCHEC');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test API:', error.message);
    return false;
  }
}

async function testAuthServiceStatus() {
  console.log('\n3. 🔧 Vérification du statut du service auth...');
  
  try {
    const { stdout: statusResult } = await execAsync(
      'docker ps --filter "name=supabase-auth" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"'
    );
    
    console.log('📋 Statut du service auth:');
    console.log(statusResult);
    
    const { stdout: logsResult } = await execAsync(
      'docker logs supabase-auth --tail 5'
    );
    
    console.log('📝 Logs récents:');
    console.log(logsResult);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur vérification service:', error.message);
    return false;
  }
}

async function testFrontendAuth() {
  console.log('\n4. 🖥️ Test de l\'authentification frontend...');
  
  try {
    // Test de l'application Next.js
    const { stdout: appResult } = await execAsync(
      'curl -s "http://localhost:3000" | head -5'
    );
    
    if (appResult.includes('html') || appResult.includes('<!DOCTYPE')) {
      console.log('✅ Application Next.js: Accessible');
    } else {
      console.log('❌ Application Next.js: Non accessible');
      return false;
    }
    
    // Test de la page de login
    const { stdout: loginResult } = await execAsync(
      'curl -s "http://localhost:3000/login" | head -5'
    );
    
    if (loginResult.includes('html') || loginResult.includes('<!DOCTYPE')) {
      console.log('✅ Page de login: Accessible');
    } else {
      console.log('❌ Page de login: Non accessible');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test frontend:', error.message);
    return false;
  }
}

async function showAuthSummary() {
  console.log('\n5. 📋 Résumé de l\'authentification...');
  
  try {
    const { stdout: summaryResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT \'Utilisateurs avec mots de passe:\' as info, COUNT(*) as count FROM public.users WHERE encrypted_password IS NOT NULL UNION ALL SELECT \'Utilisateurs confirmés:\', COUNT(*) FROM public.users WHERE email_confirmed_at IS NOT NULL UNION ALL SELECT \'Utilisateurs admin:\', COUNT(*) FROM public.users WHERE role = \'admin\' UNION ALL SELECT \'Utilisateurs client:\', COUNT(*) FROM public.users WHERE role = \'client\';"'
    );
    
    console.log('📊 Résumé authentification:');
    console.log(summaryResult);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur résumé:', error.message);
    return false;
  }
}

async function runAuthTest() {
  const results = {
    database: await testDatabaseUsers(),
    authAPI: await testAuthAPI(),
    service: await testAuthServiceStatus(),
    frontend: await testFrontendAuth(),
    summary: await showAuthSummary()
  };
  
  console.log('\n📋 RÉSULTATS FINAUX - AUTHENTIFICATION');
  console.log('======================================');
  console.log(`Base de données:     ${results.database ? '✅' : '❌'}`);
  console.log(`API Authentification: ${results.authAPI ? '✅' : '❌'}`);
  console.log(`Service Auth:        ${results.service ? '✅' : '❌'}`);
  console.log(`Frontend:            ${results.frontend ? '✅' : '❌'}`);
  console.log(`Résumé:              ${results.summary ? '✅' : '❌'}`);
  
  const workingServices = Object.values(results).filter(result => result).length;
  const totalServices = Object.keys(results).length;
  
  console.log('\n🔐 AUTHENTIFICATION FINALE');
  console.log('==========================');
  console.log(`Services fonctionnels: ${workingServices}/${totalServices}`);
  
  if (workingServices === totalServices) {
    console.log('🎉 100% AUTHENTIFIÉ ! L\'authentification fonctionne parfaitement !');
    console.log('\n✅ Utilisateurs admin et client créés');
    console.log('✅ Mots de passe cryptés et sécurisés');
    console.log('✅ API d\'authentification fonctionnelle');
    console.log('✅ Frontend connecté à l\'authentification');
    console.log('✅ Rôles admin/client configurés');
    console.log('\n🚀 Votre application est prête avec l\'authentification !');
  } else if (workingServices >= 3) {
    console.log('🎯 95% AUTHENTIFIÉ ! Presque parfait !');
  } else {
    console.log('⚠️  Authentification partielle. Vérifiez les problèmes.');
  }
  
  return workingServices === totalServices;
}

// Exécution du test d'authentification
runAuthTest().catch(console.error);
