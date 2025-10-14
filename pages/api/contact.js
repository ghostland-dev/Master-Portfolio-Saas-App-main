// API pour les messages de contact
import db from '../../lib/database'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body

      // Validation basique
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Champs requis manquants' })
      }

      const contactMessage = await db.insertContactMessage(name, email, subject, message)
      res.status(201).json({ message: 'Message envoyé avec succès', data: contactMessage })
    } catch (error) {
      console.error('Erreur API contact:', error)
      res.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
