import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'admin'
        }
      }))
    })
    
    await page.goto('/dashboard')
  })

  test('should display dashboard for authenticated user', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible()
    await expect(page.getByText('Bienvenue, test@example.com')).toBeVisible()
  })

  test('should display navigation menu', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByText('Projets')).toBeVisible()
    await expect(page.getByText('Clients')).toBeVisible()
    await expect(page.getByText('Factures')).toBeVisible()
    await expect(page.getByText('Messages')).toBeVisible()
  })

  test('should display statistics cards', async ({ page }) => {
    await expect(page.getByText('Projets actifs')).toBeVisible()
    await expect(page.getByText('Clients')).toBeVisible()
    await expect(page.getByText('Revenus ce mois')).toBeVisible()
    await expect(page.getByText('Tâches en cours')).toBeVisible()
  })

  test('should display recent projects table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByText('Nom du projet')).toBeVisible()
    await expect(page.getByText('Client')).toBeVisible()
    await expect(page.getByText('Statut')).toBeVisible()
    await expect(page.getByText('Date de création')).toBeVisible()
  })

  test('should allow creating new project', async ({ page }) => {
    await page.getByRole('button', { name: 'Nouveau projet' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Créer un nouveau projet')).toBeVisible()
  })

  test('should display user profile in header', async ({ page }) => {
    await expect(page.getByText('test@example.com')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Menu utilisateur' })).toBeVisible()
  })

  test('should allow logging out', async ({ page }) => {
    await page.getByRole('button', { name: 'Menu utilisateur' }).click()
    await page.getByText('Déconnexion').click()
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login')
  })
})
