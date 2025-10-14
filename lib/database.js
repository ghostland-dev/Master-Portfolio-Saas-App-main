// Configuration de base de données directe
const { Pool } = require('pg')

// Configuration PostgreSQL directe
const pool = new Pool({
  host: 'localhost',
  port: 54322,
  database: 'postgres',
  user: 'postgres',
  password: 'your-super-secret-and-long-postgres-password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Fonctions de base de données
const db = {
  // Récupérer tous les projets
  async getProjects() {
    try {
      const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC')
      return result.rows
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error)
      throw error
    }
  },

  // Récupérer tous les compétences
  async getSkills() {
    try {
      const result = await pool.query('SELECT * FROM skills ORDER BY category, name')
      return result.rows
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error)
      throw error
    }
  },

  // Récupérer toutes les expériences
  async getExperiences() {
    try {
      const result = await pool.query('SELECT * FROM experiences ORDER BY start_date DESC')
      return result.rows
    } catch (error) {
      console.error('Erreur lors de la récupération des expériences:', error)
      throw error
    }
  },

  // Récupérer toutes les formations
  async getEducations() {
    try {
      const result = await pool.query('SELECT * FROM educations ORDER BY start_date DESC')
      return result.rows
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error)
      throw error
    }
  },

  // Récupérer toutes les ressources
  async getResources() {
    try {
      const result = await pool.query('SELECT * FROM resources ORDER BY created_at DESC')
      return result.rows
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error)
      throw error
    }
  },

  // Insérer un message de contact
  async insertContactMessage(name, email, subject, message) {
    try {
      const result = await pool.query(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, subject, message]
      )
      return result.rows[0]
    } catch (error) {
      console.error('Erreur lors de l\'insertion du message de contact:', error)
      throw error
    }
  },

  // Tester la connexion
  async testConnection() {
    try {
      const result = await pool.query('SELECT NOW() as current_time')
      return { success: true, time: result.rows[0].current_time }
    } catch (error) {
      console.error('Erreur de connexion à la base de données:', error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = db
