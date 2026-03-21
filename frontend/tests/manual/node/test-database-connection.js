const db = require('./lib/database')

async function testDatabaseConnection() {
  console.log('🔍 Test de connexion à la base de données PostgreSQL...')

  try {
    // Test de connexion
    console.log('\n1. Test de connexion...')
    const connectionTest = await db.testConnection()

    if (!connectionTest.success) {
      console.error('❌ Erreur de connexion:', connectionTest.error)
      return false
    }

    console.log('✅ Connexion réussie!')
    console.log('🕐 Heure actuelle:', connectionTest.time)

    // Test des données
    console.log('\n2. Test des données...')

    const tables = [
      { name: 'projets', func: db.getProjects },
      { name: 'compétences', func: db.getSkills },
      { name: 'expériences', func: db.getExperiences },
      { name: 'formations', func: db.getEducations },
      { name: 'ressources', func: db.getResources }
    ]

    for (const table of tables) {
      try {
        const data = await table.func()
        console.log(`✅ Table ${table.name}: ${data.length} enregistrement(s)`)

        if (data.length > 0) {
          console.log(`   Exemple: ${JSON.stringify(data[0], null, 2).substring(0, 100)}...`)
        }
      } catch (error) {
        console.log(`❌ Table ${table.name}: ${error.message}`)
      }
    }

    // Test d'insertion
    console.log('\n3. Test d\'insertion...')
    try {
      const testMessage = await db.insertContactMessage(
        'Test User',
        'test@example.com',
        'Test Subject',
        'Ceci est un message de test'
      )
      console.log('✅ Insertion réussie!')
      console.log('📝 Message inséré:', testMessage)
    } catch (error) {
      console.log('❌ Erreur d\'insertion:', error.message)
    }

    return true

  } catch (error) {
    console.error('❌ Erreur fatale:', error.message)
    return false
  }
}

// Exécution du test
testDatabaseConnection().then(success => {
  if (success) {
    console.log('\n🎉 Tous les tests sont passés! La base de données fonctionne parfaitement.')
  } else {
    console.log('\n💥 Des erreurs ont été détectées. Vérifiez la configuration.')
  }
  process.exit(success ? 0 : 1)
})
