import { createClient } from '@supabase/supabase-js'

// Configuration pour les tests d'intégration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:8001'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key'

export const testSupabase = createClient(supabaseUrl, supabaseKey)

// Données de test
export const testData = {
  users: [
    {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const,
      created_at: new Date().toISOString(),
    },
    {
      id: 'test-user-2',
      email: 'client@example.com',
      name: 'Test Client',
      role: 'client' as const,
      created_at: new Date().toISOString(),
    },
  ],
  projects: [
    {
      id: 'test-project-1',
      title: 'Test Project 1',
      description: 'A test project',
      status: 'active' as const,
      client_id: 'test-user-2',
      budget: 5000,
      created_at: new Date().toISOString(),
    },
    {
      id: 'test-project-2',
      title: 'Test Project 2',
      description: 'Another test project',
      status: 'completed' as const,
      client_id: 'test-user-2',
      budget: 7500,
      created_at: new Date().toISOString(),
    },
  ],
  messages: [
    {
      id: 'test-message-1',
      sender_id: 'test-user-1',
      recipient_id: 'test-user-2',
      subject: 'Test Message',
      content: 'This is a test message',
      priority: 'medium' as const,
      read: false,
      created_at: new Date().toISOString(),
    },
  ],
}

// Fonctions utilitaires pour les tests
export const setupTestData = async () => {
  try {
    // Insérer les utilisateurs de test
    await testSupabase.from('users').insert(testData.users)
    
    // Insérer les projets de test
    await testSupabase.from('projects').insert(testData.projects)
    
    // Insérer les messages de test
    await testSupabase.from('messages').insert(testData.messages)
  } catch (error) {
    console.error('Erreur lors de la configuration des données de test:', error)
  }
}

export const cleanupTestData = async () => {
  try {
    // Supprimer les données de test dans l'ordre inverse
    await testSupabase.from('messages').delete().in('id', testData.messages.map(m => m.id))
    await testSupabase.from('projects').delete().in('id', testData.projects.map(p => p.id))
    await testSupabase.from('users').delete().in('id', testData.users.map(u => u.id))
  } catch (error) {
    console.error('Erreur lors du nettoyage des données de test:', error)
  }
}

// Hook pour les tests
export const withTestDatabase = (testFn: () => Promise<void>) => {
  return async () => {
    await setupTestData()
    try {
      await testFn()
    } finally {
      await cleanupTestData()
    }
  }
}
