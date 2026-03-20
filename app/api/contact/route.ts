// API pour les messages de contact
import db from '../../../lib/database'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validation basique
    if (!name || !email || !message) {
      return Response.json({ message: 'Champs requis manquants' }, { status: 400 })
    }

    const contactMessage = await db.insertContactMessage(name, email, subject, message)
    return Response.json({ message: 'Message envoyé avec succès', data: contactMessage }, { status: 201 })
  } catch (error) {
    console.error('Erreur API contact:', error)
    return Response.json({ message: 'Erreur serveur', error: (error as any).message }, { status: 500 })
  }
}
