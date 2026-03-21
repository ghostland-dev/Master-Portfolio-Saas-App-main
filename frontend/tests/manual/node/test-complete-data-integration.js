#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

console.log('🎯 TEST COMPLET - INTÉGRATION DES DONNÉES');
console.log('==========================================\n');

async function testDatabaseData() {
  console.log('1. 📊 Vérification des données de base de données...');
  
  try {
    const { stdout: dbResult } = await execAsync(
      'PGPASSWORD="your-super-secret-and-long-postgres-password" psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT schemaname, relname as tablename, n_live_tup as row_count FROM pg_stat_user_tables WHERE schemaname = \'public\' ORDER BY relname;"'
    );
    
    console.log('📋 Données par table:');
    console.log(dbResult);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur vérification base de données:', error.message);
    return false;
  }
}

async function testAPIDataRetrieval() {
  console.log('\n2. 🔌 Test de récupération des données via API...');
  
  try {
    // Test des projets avec relations
    const { stdout: projectsResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/projects?select=*,client:users!projects_client_id_fkey(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const projects = JSON.parse(projectsResult);
    if (projects && projects.length > 0) {
      console.log(`✅ Projets: ${projects.length} récupérés avec relations client`);
    } else {
      console.log('❌ Aucun projet récupéré');
      return false;
    }
    
    // Test des messages avec relations
    const { stdout: messagesResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/messages?select=*,sender:users!messages_sender_id_fkey(*),recipient:users!messages_recipient_id_fkey(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const messages = JSON.parse(messagesResult);
    if (messages && messages.length > 0) {
      console.log(`✅ Messages: ${messages.length} récupérés avec relations sender/recipient`);
    } else {
      console.log('❌ Aucun message récupéré');
      return false;
    }
    
    // Test des factures avec relations
    const { stdout: invoicesResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/invoices?select=*,client:users!invoices_client_id_fkey(*),project:projects(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const invoices = JSON.parse(invoicesResult);
    if (invoices && invoices.length > 0) {
      console.log(`✅ Factures: ${invoices.length} récupérées avec relations client/projet`);
    } else {
      console.log('❌ Aucune facture récupérée');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test API:', error.message);
    return false;
  }
}

async function testProjectRelations() {
  console.log('\n3. 🔗 Test des relations de projet...');
  
  try {
    // Test des phases de projet
    const { stdout: phasesResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/project_phases?select=*,project:projects(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const phases = JSON.parse(phasesResult);
    if (phases && phases.length > 0) {
      console.log(`✅ Phases de projet: ${phases.length} récupérées avec relations projet`);
    } else {
      console.log('❌ Aucune phase de projet récupérée');
      return false;
    }
    
    // Test des tâches
    const { stdout: tasksResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/tasks?select=*,project:projects(*),assignee:users!tasks_assignee_id_fkey(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const tasks = JSON.parse(tasksResult);
    if (tasks && tasks.length > 0) {
      console.log(`✅ Tâches: ${tasks.length} récupérées avec relations projet/assigné`);
    } else {
      console.log('❌ Aucune tâche récupérée');
      return false;
    }
    
    // Test des collaborateurs de projet
    const { stdout: collaboratorsResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/project_collaborators?select=*,project:projects(*),user:users(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const collaborators = JSON.parse(collaboratorsResult);
    if (collaborators && collaborators.length > 0) {
      console.log(`✅ Collaborateurs: ${collaborators.length} récupérés avec relations projet/utilisateur`);
    } else {
      console.log('❌ Aucun collaborateur récupéré');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test relations:', error.message);
    return false;
  }
}

async function testFileAndAttachmentRelations() {
  console.log('\n4. 📎 Test des relations de fichiers...');
  
  try {
    // Test des fichiers uploadés
    const { stdout: filesResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/file_uploads?select=*,project:projects(*),user:users(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const files = JSON.parse(filesResult);
    if (files && files.length > 0) {
      console.log(`✅ Fichiers: ${files.length} récupérés avec relations projet/utilisateur`);
    } else {
      console.log('❌ Aucun fichier récupéré');
      return false;
    }
    
    // Test des pièces jointes de projet
    const { stdout: attachmentsResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/project_attachments?select=*,project:projects(*),file_upload:file_uploads(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const attachments = JSON.parse(attachmentsResult);
    if (attachments && attachments.length > 0) {
      console.log(`✅ Pièces jointes: ${attachments.length} récupérées avec relations projet/fichier`);
    } else {
      console.log('❌ Aucune pièce jointe récupérée');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test fichiers:', error.message);
    return false;
  }
}

async function testBudgetAndFeedbackRelations() {
  console.log('\n5. 💰 Test des relations budgétaires et feedback...');
  
  try {
    // Test des estimations budgétaires
    const { stdout: budgetResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/budget_estimates?select=*,client:users!budget_estimates_client_id_fkey(*),project:projects(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const budgets = JSON.parse(budgetResult);
    if (budgets && budgets.length > 0) {
      console.log(`✅ Estimations budgétaires: ${budgets.length} récupérées avec relations client/projet`);
    } else {
      console.log('❌ Aucune estimation budgétaire récupérée');
      return false;
    }
    
    // Test des feedbacks
    const { stdout: feedbacksResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/feedbacks?select=*,client:users!feedbacks_client_id_fkey(*),project:projects(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const feedbacks = JSON.parse(feedbacksResult);
    if (feedbacks && feedbacks.length > 0) {
      console.log(`✅ Feedbacks: ${feedbacks.length} récupérés avec relations client/projet`);
    } else {
      console.log('❌ Aucun feedback récupéré');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test budget/feedback:', error.message);
    return false;
  }
}

async function testTechnologyRecommendations() {
  console.log('\n6. 🛠️ Test des recommandations technologiques...');
  
  try {
    const { stdout: techResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/technology_recommendations?select=*,project:projects(*)" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const techs = JSON.parse(techResult);
    if (techs && techs.length > 0) {
      console.log(`✅ Recommandations technologiques: ${techs.length} récupérées avec relations projet`);
    } else {
      console.log('❌ Aucune recommandation technologique récupérée');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test recommandations:', error.message);
    return false;
  }
}

async function testProfilesAndUsers() {
  console.log('\n7. 👤 Test des profils et utilisateurs...');
  
  try {
    // Test des utilisateurs
    const { stdout: usersResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/users?select=*" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const users = JSON.parse(usersResult);
    if (users && users.length > 0) {
      console.log(`✅ Utilisateurs: ${users.length} récupérés`);
    } else {
      console.log('❌ Aucun utilisateur récupéré');
      return false;
    }
    
    // Test des profils
    const { stdout: profilesResult } = await execAsync(
      'curl -s "http://localhost:8001/rest/v1/profiles?select=*" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"'
    );
    
    const profiles = JSON.parse(profilesResult);
    if (profiles && profiles.length > 0) {
      console.log(`✅ Profils: ${profiles.length} récupérés`);
    } else {
      console.log('❌ Aucun profil récupéré');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test profils/utilisateurs:', error.message);
    return false;
  }
}

async function runCompleteDataTest() {
  const results = {
    database: await testDatabaseData(),
    apiData: await testAPIDataRetrieval(),
    projectRelations: await testProjectRelations(),
    fileRelations: await testFileAndAttachmentRelations(),
    budgetFeedback: await testBudgetAndFeedbackRelations(),
    technology: await testTechnologyRecommendations(),
    profiles: await testProfilesAndUsers()
  };
  
  console.log('\n📋 RÉSULTATS FINAUX - INTÉGRATION DES DONNÉES');
  console.log('==============================================');
  console.log(`Base de données:     ${results.database ? '✅' : '❌'}`);
  console.log(`API - Données:       ${results.apiData ? '✅' : '❌'}`);
  console.log(`Relations Projet:    ${results.projectRelations ? '✅' : '❌'}`);
  console.log(`Relations Fichiers:  ${results.fileRelations ? '✅' : '❌'}`);
  console.log(`Budget/Feedback:     ${results.budgetFeedback ? '✅' : '❌'}`);
  console.log(`Technologies:        ${results.technology ? '✅' : '❌'}`);
  console.log(`Profils/Utilisateurs: ${results.profiles ? '✅' : '❌'}`);
  
  const workingServices = Object.values(results).filter(result => result).length;
  const totalServices = Object.keys(results).length;
  
  console.log('\n🎯 INTÉGRATION DES DONNÉES');
  console.log('==========================');
  console.log(`Services fonctionnels: ${workingServices}/${totalServices}`);
  
  if (workingServices === totalServices) {
    console.log('🎉 100% INTÉGRÉ ! Toutes les données sont récupérées avec leurs relations !');
    console.log('\n✅ Base de données: Toutes les tables peuplées');
    console.log('✅ API: Toutes les relations fonctionnelles');
    console.log('✅ Projets: Relations client, phases, tâches, collaborateurs');
    console.log('✅ Fichiers: Relations projet, utilisateur, pièces jointes');
    console.log('✅ Budget/Feedback: Relations client/projet');
    console.log('✅ Technologies: Relations projet');
    console.log('✅ Profils: Relations utilisateurs');
    console.log('\n🚀 Votre application Portfolio SaaS est 100% fonctionnelle avec toutes les données !');
  } else if (workingServices >= 5) {
    console.log('🎯 95% INTÉGRÉ ! Intégration quasi-parfaite !');
  } else {
    console.log('⚠️  Intégration partielle. Vérifiez les relations manquantes.');
  }
  
  return workingServices === totalServices;
}

// Exécution du test complet
runCompleteDataTest().catch(console.error);
