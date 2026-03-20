#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Configuration
const supabaseUrl = 'http://localhost:8001';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log('🔍 TEST COMPLET DE CONNEXION - 100%');
console.log('=====================================\n');

async function testSupabaseConnection() {
  console.log('1. 📊 Test de connexion Supabase...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test de lecture
    const { data: projects, error: readError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.log('❌ Erreur lecture Supabase:', readError.message);
      return false;
    }
    
    console.log('✅ Lecture Supabase: OK');
    console.log(`   Projet trouvé: ${projects[0]?.title || 'Aucun'}`);
    
    // Test d'écriture
    const { data: insertData, error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name: 'Test Connexion',
        email: 'test@connection.com',
        message: 'Test de connexion complète',
        subject: 'Test 100%'
      })
      .select();
    
    if (insertError) {
      console.log('❌ Erreur écriture Supabase:', insertError.message);
      return false;
    }
    
    console.log('✅ Écriture Supabase: OK');
    console.log(`   Message créé: ${insertData[0]?.id || 'Aucun'}`);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur Supabase:', error.message);
    return false;
  }
}

async function testMailHogConnection() {
  console.log('\n2. 📧 Test de connexion MailHog...');
  
  try {
    // Test de l'interface MailHog
    const response = await fetch('http://localhost:8025');
    if (!response.ok) {
      console.log('❌ Interface MailHog inaccessible');
      return false;
    }
    console.log('✅ Interface MailHog: OK');
    
    // Test de l'API MailHog
    const apiResponse = await fetch('http://localhost:8025/api/v1/messages');
    if (!apiResponse.ok) {
      console.log('❌ API MailHog inaccessible');
      return false;
    }
    console.log('✅ API MailHog: OK');
    
    // Test d'envoi via SMTP
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: null
    });
    
    const mailOptions = {
      from: 'test@connection.com',
      to: 'admin@example.com',
      subject: 'Test Connexion MailHog',
      text: 'Test de connexion SMTP MailHog'
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Envoi SMTP MailHog: OK');
    
    return true;
  } catch (error) {
    console.log('❌ Erreur MailHog:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('\n3. 🗄️ Test de connexion base de données...');
  
  try {
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 54322,
      database: 'postgres',
      user: 'postgres',
      password: 'your-super-secret-and-long-postgres-password'
    });
    
    await client.connect();
    console.log('✅ Connexion PostgreSQL: OK');
    
    // Test de requête
    const result = await client.query('SELECT COUNT(*) as count FROM public.projects');
    console.log(`✅ Requête PostgreSQL: OK (${result.rows[0].count} projets)`);
    
    await client.end();
    return true;
  } catch (error) {
    console.log('❌ Erreur PostgreSQL:', error.message);
    return false;
  }
}

async function testNextJSApp() {
  console.log('\n4. 🚀 Test de l\'application Next.js...');
  
  try {
    const response = await fetch('http://localhost:3000');
    if (!response.ok) {
      console.log('❌ Application Next.js inaccessible');
      return false;
    }
    
    const html = await response.text();
    if (html.includes('Ismail MOUYAHADA')) {
      console.log('✅ Application Next.js: OK');
      return true;
    } else {
      console.log('❌ Contenu application incorrect');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur Next.js:', error.message);
    return false;
  }
}

async function runCompleteTest() {
  const results = {
    supabase: await testSupabaseConnection(),
    mailhog: await testMailHogConnection(),
    database: await testDatabaseConnection(),
    nextjs: await testNextJSApp()
  };
  
  console.log('\n📋 RÉSULTATS FINAUX');
  console.log('===================');
  console.log(`Supabase: ${results.supabase ? '✅' : '❌'}`);
  console.log(`MailHog:  ${results.mailhog ? '✅' : '❌'}`);
  console.log(`Database: ${results.database ? '✅' : '❌'}`);
  console.log(`Next.js:  ${results.nextjs ? '✅' : '❌'}`);
  
  const allConnected = Object.values(results).every(result => result);
  
  console.log('\n🎯 CONNEXION GLOBALE');
  console.log('====================');
  if (allConnected) {
    console.log('🎉 100% CONNECTÉ ! Tous les services fonctionnent parfaitement !');
  } else {
    console.log('⚠️  Connexion partielle. Certains services nécessitent une attention.');
  }
  
  return allConnected;
}

// Exécution du test
runCompleteTest().catch(console.error);
