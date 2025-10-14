import { test, expect } from '@playwright/test'

test.describe('Portfolio Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/portfolio')
  })

  test('should display portfolio page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible()
    await expect(page.getByText('Mes projets')).toBeVisible()
  })

  test('should display project cards', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]')
    
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards).toHaveCount.greaterThan(0)
  })

  test('should display project details when card is clicked', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]')
    
    const firstProject = page.locator('[data-testid="project-card"]').first()
    await firstProject.click()
    
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Détails du projet')).toBeVisible()
  })

  test('should filter projects by category', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]')
    
    // Click on a category filter
    await page.getByText('Développement Web').click()
    
    // Wait for filtered results
    await page.waitForTimeout(1000)
    
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards).toHaveCount.greaterThan(0)
  })

  test('should search projects by name', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]')
    
    const searchInput = page.getByPlaceholder('Rechercher un projet')
    await searchInput.fill('E-commerce')
    await searchInput.press('Enter')
    
    // Wait for search results
    await page.waitForTimeout(1000)
    
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards).toHaveCount.greaterThan(0)
  })

  test('should display project technologies', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]')
    
    const firstProject = page.locator('[data-testid="project-card"]').first()
    await expect(firstProject.getByText('Technologies')).toBeVisible()
  })

  test('should display project status', async ({ page }) => {
    await page.waitForSelector('[data-testid="project-card"]')
    
    const firstProject = page.locator('[data-testid="project-card"]').first()
    await expect(firstProject.getByText('Statut')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible()
    
    // Check if mobile layout is applied
    const projectGrid = page.locator('[data-testid="project-grid"]')
    await expect(projectGrid).toHaveCSS('grid-template-columns', '1fr')
  })
})
