// Mock validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

const validateProjectData = (project: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!project.title || project.title.trim().length === 0) {
    errors.push('Le titre du projet est requis')
  }
  
  if (!project.client_id || project.client_id.trim().length === 0) {
    errors.push('Le client est requis')
  }
  
  if (project.budget && (isNaN(project.budget) || project.budget < 0)) {
    errors.push('Le budget doit être un nombre positif')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Password123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le mot de passe doit contenir au moins 8 caractères')
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule')
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un chiffre')
    })

    it('should require uppercase letter', () => {
      const result = validatePassword('password123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule')
    })

    it('should require lowercase letter', () => {
      const result = validatePassword('PASSWORD123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une minuscule')
    })

    it('should require digit', () => {
      const result = validatePassword('Password')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un chiffre')
    })
  })

  describe('validateProjectData', () => {
    it('should validate complete project data', () => {
      const project = {
        title: 'Test Project',
        client_id: 'client-123',
        budget: 5000,
        description: 'A test project'
      }
      
      const result = validateProjectData(project)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should require title', () => {
      const project = {
        client_id: 'client-123',
        budget: 5000
      }
      
      const result = validateProjectData(project)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le titre du projet est requis')
    })

    it('should require client_id', () => {
      const project = {
        title: 'Test Project',
        budget: 5000
      }
      
      const result = validateProjectData(project)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le client est requis')
    })

    it('should validate budget as positive number', () => {
      const project = {
        title: 'Test Project',
        client_id: 'client-123',
        budget: -1000
      }
      
      const result = validateProjectData(project)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le budget doit être un nombre positif')
    })

    it('should handle missing budget', () => {
      const project = {
        title: 'Test Project',
        client_id: 'client-123'
      }
      
      const result = validateProjectData(project)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
})
