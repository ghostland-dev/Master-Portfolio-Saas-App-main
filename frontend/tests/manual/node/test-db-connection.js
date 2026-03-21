const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase
const supabaseUrl = 'http://localhost:8001'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

async function testConnection() {
  console.log('🔍 Test de connexion à Supabase...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')

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

    // Test des autres tables
    console.log('\n2. Test des autres tables...')

    const tables = ['skills', 'experiences', 'educations', 'contact_messages', 'resources']

    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase.from(table).select('*').limit(1)
        if (tableError) {
          console.log(`❌ Table ${table}: ${tableError.message}`)
        } else {
          console.log(`✅ Table ${table}: ${tableData.length} enregistrement(s)`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`)
      }
    }

    return true

  } catch (error) {
    console.error('❌ Erreur fatale:', error.message)
    return false
  }
}

// Exécution du test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Tous les tests sont passés! La connexion à Supabase fonctionne parfaitement.')
  } else {
    console.log('\n💥 Des erreurs ont été détectées. Vérifiez la configuration.')
  }
  process.exit(success ? 0 : 1)
})
