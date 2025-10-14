// API pour récupérer les projets
import db from '../../../lib/database'

export async function GET() {
  try {
    const projects = await db.getProjects()
    return Response.json(projects)
  } catch (error) {
    console.error('Erreur API projets:', error)
    return Response.json({ message: 'Erreur serveur', error: error.message }, { status: 500 })
  }
}
