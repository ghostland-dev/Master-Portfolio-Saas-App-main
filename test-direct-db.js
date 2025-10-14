const { createClient } = require('@supabase/supabase-js')

// Configuration directe avec l'URL de la base de données
const supabaseUrl = 'http://localhost:54322'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

async function testDirectConnection() {
  console.log('🔍 Test de connexion directe à la base de données...')
  console.log('URL:', supabaseUrl)
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test de connexion basique
    console.log('\n1. Test de connexion basique...')
    const { data, error } = await supabase.from('projects').select('*').limit(1)
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message)
      return false
    }
    
    console.log('✅ Connexion réussie!')
    console.log('📊 Données récupérées:', data)
    
    return true
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error.message)
    return false
  }
}

// Exécution du test
testDirectConnection().then(success => {
  if (success) {
    console.log('\n🎉 La connexion directe fonctionne!')
  } else {
    console.log('\n💥 La connexion directe a échoué.')
  }
  process.exit(success ? 0 : 1)
})
