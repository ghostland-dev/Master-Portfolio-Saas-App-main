// API pour récupérer les compétences
import db from '../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const skills = await db.getSkills()
    res.status(200).json(skills)
  } catch (error) {
    console.error('Erreur API compétences:', error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}
