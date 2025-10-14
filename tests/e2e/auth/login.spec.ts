import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Mot de passe')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Se connecter' }).click()
    
    await expect(page.getByText('L\'email est requis')).toBeVisible()
    await expect(page.getByText('Le mot de passe est requis')).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Mot de passe').fill('password123')
    await page.getByRole('button', { name: 'Se connecter' }).click()
    
    await expect(page.getByText('Format d\'email invalide')).toBeVisible()
  })

  test('should handle login with valid credentials', async ({ page }) => {
    // Mock successful login
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: '123',
            email: 'test@example.com'
          }
        })
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Mot de passe').fill('password123')
    await page.getByRole('button', { name: 'Se connecter' }).click()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should handle login with invalid credentials', async ({ page }) => {
    // Mock failed login
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid credentials'
        })
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Mot de passe').fill('wrongpassword')
    await page.getByRole('button', { name: 'Se connecter' }).click()
    
    await expect(page.getByText('Identifiants invalides')).toBeVisible()
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.getByText('Créer un compte').click()
    await expect(page).toHaveURL('/signup')
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByText('Mot de passe oublié ?').click()
    await expect(page).toHaveURL('/forgot-password')
  })
})
