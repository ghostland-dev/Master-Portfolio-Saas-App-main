// API pour récupérer les projets
import db from '../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const projects = await db.getProjects()
    res.status(200).json(projects)
  } catch (error) {
    console.error('Erreur API projets:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}
