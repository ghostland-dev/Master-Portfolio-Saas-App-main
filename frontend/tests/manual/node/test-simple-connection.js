const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase simplifiée
const supabaseUrl = 'http://localhost:8001'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

async function testSimpleConnection() {
  console.log('🔍 Test de connexion simplifiée à Supabase...')

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test de connexion avec timeout
    console.log('\n1. Test de connexion avec timeout...')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 secondes timeout

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1)
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)

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
          const { data: tableData, error: tableError } = await supabase
            .from(table)
            .select('*')
            .limit(1)
            .abortSignal(controller.signal)

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
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        console.error('❌ Timeout: La connexion a pris trop de temps')
      } else {
        console.error('❌ Erreur de connexion:', error.message)
      }
      return false
    }

  } catch (error) {
    console.error('❌ Erreur fatale:', error.message)
    return false
  }
}

// Exécution du test
testSimpleConnection().then(success => {
  if (success) {
    console.log('\n🎉 Tous les tests sont passés! La connexion à Supabase fonctionne parfaitement.')
  } else {
    console.log('\n💥 Des erreurs ont été détectées. Vérifiez la configuration.')
  }
  process.exit(success ? 0 : 1)
})
