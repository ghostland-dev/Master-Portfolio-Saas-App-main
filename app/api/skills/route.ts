// API pour récupérer les compétences
import db from '../../../lib/database'

export async function GET() {
  try {
    const skills = await db.getSkills()
    return Response.json(skills)
  } catch (error) {
    console.error('Erreur API compétences:', error)
    return Response.json({ message: 'Erreur serveur', error: (error as any).message }, { status: 500 })
  }
}
