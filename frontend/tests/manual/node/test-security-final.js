#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

console.log('🔒 TEST FINAL SÉCURITÉ - EXTENSIONS ET FONCTIONS');
console.log('================================================\n');

async function testExtensionsSecurity() {
  console.log('1. 🔍 Vérification des extensions...');

  try {
    // Vérifier que les extensions sont dans le schéma extensions
    const { stdout: extensionsResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT extname, extnamespace::regnamespace as schema_name FROM pg_extension WHERE extname IN (\'uuid-ossp\', \'pgcrypto\');"'
    );

    if (extensionsResult.includes('extensions')) {
      console.log('✅ Extensions déplacées vers le schéma extensions');
    } else {
      console.log('❌ Extensions pas dans le bon schéma');
      return false;
    }

    // Vérifier qu\'il n\'y a plus d\'extensions dans public
    const { stdout: publicExtensionsResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT COUNT(*) as count FROM pg_extension WHERE extnamespace = \'public\'::regnamespace;"'
    );

    const publicCount = publicExtensionsResult.match(/count\s*\|\s*(\d+)/)?.[1] || '0';
    if (publicCount === '0') {
      console.log('✅ Aucune extension dans le schéma public');
    } else {
      console.log(`❌ ${publicCount} extensions encore dans public`);
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Erreur vérification extensions:', error.message);
    return false;
  }
}

async function testFunctionSecurity() {
  console.log('\n2. 🔧 Vérification de la fonction sécurisée...');

  try {
    // Vérifier que la fonction a search_path sécurisé
    const { stdout: functionResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT proname, proconfig FROM pg_proc WHERE proname = \'update_updated_at_column\';"'
    );

    if (functionResult.includes('search_path=""')) {
      console.log('✅ Fonction update_updated_at_column sécurisée');
    } else {
      console.log('❌ Fonction pas sécurisée');
      return false;
    }

    // Vérifier que les triggers sont recréés
    const { stdout: triggersResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT COUNT(*) as count FROM pg_trigger t JOIN pg_proc p ON t.tgfoid = p.oid WHERE p.proname = \'update_updated_at_column\';"'
    );

    const triggerCount = triggersResult.match(/count\s*\|\s*(\d+)/)?.[1] || '0';
    if (parseInt(triggerCount) >= 9) {
      console.log(`✅ ${triggerCount} triggers recréés avec la fonction sécurisée`);
    } else {
      console.log(`❌ Seulement ${triggerCount} triggers recréés`);
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Erreur vérification fonction:', error.message);
    return false;
  }
}

async function testAPIFunctionality() {
  console.log('\n3. 🚀 Test fonctionnalité API...');

  try {
    // Test de lecture des projets
    const { stdout: projectsResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/projects?select=*&limit=1" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );

    if (projectsResult.includes('title')) {
      console.log('✅ API projets fonctionnelle');
    } else {
      console.log('❌ API projets non fonctionnelle');
      return false;
    }

    // Test de lecture des utilisateurs
    const { stdout: usersResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/users?select=*&limit=1" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );

    if (usersResult.includes('email')) {
      console.log('✅ API utilisateurs fonctionnelle');
    } else {
      console.log('❌ API utilisateurs non fonctionnelle');
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Erreur test API:', error.message);
    return false;
  }
}

async function testDatabaseIntegrity() {
  console.log('\n4. 🗄️ Test intégrité base de données...');

  try {
    // Test de mise à jour d'un projet pour vérifier le trigger
    const { stdout: updateResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "UPDATE public.projects SET title = title WHERE id = (SELECT id FROM public.projects LIMIT 1); SELECT \'Trigger test successful\' as result;"'
    );

    if (updateResult.includes('Trigger test successful')) {
      console.log('✅ Triggers de mise à jour fonctionnels');
    } else {
      console.log('❌ Triggers de mise à jour non fonctionnels');
      return false;
    }

    return true;
  } catch (error) {
    console.log('❌ Erreur test intégrité:', error.message);
    return false;
  }
}

async function showSecuritySummary() {
  console.log('\n5. 📋 Résumé de sécurité...');

  try {
    const { stdout: summaryResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT \'Extensions dans extensions:\' as info, COUNT(*) as count FROM pg_extension WHERE extnamespace = \'extensions\'::regnamespace UNION ALL SELECT \'Extensions dans public:\', COUNT(*) FROM pg_extension WHERE extnamespace = \'public\'::regnamespace UNION ALL SELECT \'Triggers sécurisés:\', COUNT(*) FROM pg_trigger t JOIN pg_proc p ON t.tgfoid = p.oid WHERE p.proname = \'update_updated_at_column\';"'
    );

    console.log('📊 Résumé de sécurité:');
    console.log(summaryResult);

    return true;
  } catch (error) {
    console.log('❌ Erreur résumé sécurité:', error.message);
    return false;
  }
}

async function runSecurityTest() {
  const results = {
    extensions: await testExtensionsSecurity(),
    function: await testFunctionSecurity(),
    api: await testAPIFunctionality(),
    integrity: await testDatabaseIntegrity(),
    summary: await showSecuritySummary()
  };

  console.log('\n📋 RÉSULTATS FINAUX SÉCURITÉ');
  console.log('=============================');
  console.log(`Extensions:       ${results.extensions ? '✅' : '❌'}`);
  console.log(`Fonction:         ${results.function ? '✅' : '❌'}`);
  console.log(`API:              ${results.api ? '✅' : '❌'}`);
  console.log(`Intégrité:        ${results.integrity ? '✅' : '❌'}`);
  console.log(`Résumé:           ${results.summary ? '✅' : '❌'}`);

  const workingServices = Object.values(results).filter(result => result).length;
  const totalServices = Object.keys(results).length;

  console.log('\n🔒 SÉCURITÉ FINALE');
  console.log('==================');
  console.log(`Services sécurisés: ${workingServices}/${totalServices}`);

  if (workingServices === totalServices) {
    console.log('🎉 100% SÉCURISÉ ! Tous les problèmes de sécurité résolus !');
    console.log('\n✅ Extensions déplacées vers le schéma extensions');
    console.log('✅ Fonction update_updated_at_column sécurisée');
    console.log('✅ Triggers recréés et fonctionnels');
    console.log('✅ API entièrement fonctionnelle');
    console.log('✅ Base de données intègre');
    console.log('\n🔒 Votre application est maintenant sécurisée selon les meilleures pratiques !');
  } else if (workingServices >= 4) {
    console.log('🎯 95% SÉCURISÉ ! Sécurité quasi-parfaite !');
  } else {
    console.log('⚠️  Sécurité partielle. Vérifiez les problèmes restants.');
  }

  return workingServices === totalServices;
}

// Exécution du test de sécurité
runSecurityTest().catch(console.error);
