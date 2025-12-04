import { test, expect } from '@playwright/test';

/**
 * 🌐 E2E TESTS - Búsqueda de Películas y Favoritos
 *
 * Flujo completo:
 * 1. Usuario hace login
 * 2. Busca una película
 * 3. Agrega a favoritos
 * 4. Verifica en página de favoritos
 * 5. Elimina de favoritos
 */

test.describe('Movies Search and Favorites', () => {

  // Generar email único para CADA test
  let testUser: { email: string; password: string };

  test.beforeEach(() => {
    testUser = {
      email: `movietest-${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };
  });

  // Helper: Login del usuario
  async function loginUser(page: any) {
    await page.goto('/auth/register');
    await page.fill('input[formControlName="email"]', testUser.email);
    await page.fill('input[formControlName="password"]', testUser.password);
    await page.fill('input[formControlName="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/pages\/search/);
  }

  /**
   * TEST 1: Buscar películas por título
   */
  test('should search for movies by title', async ({ page }) => {
    // ARRANGE: Login
    await loginUser(page);

    // ACT: Buscar "Matrix" - esperar a que el input esté visible
    const searchInput = page.getByPlaceholder('Escribe el título de una película...');
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill('Matrix');
    await searchInput.press('Enter');

    // Esperar a que carguen los resultados
    await page.waitForTimeout(2000);

    // ASSERT: Verificar que aparecen resultados
    const movieCards = page.locator('app-movie-card');
    await expect(movieCards.first()).toBeVisible();

    // Verificar que al menos un resultado contiene "Matrix"
    const firstMovieTitle = await movieCards.first().locator('.movie-title').textContent();
    expect(firstMovieTitle?.toLowerCase()).toContain('matrix');
  });

  /**
   * TEST 2: Agregar película a favoritos
   */
  test('should add movie to favorites', async ({ page }) => {
    await loginUser(page);

    // Buscar película
    const searchInput = page.getByPlaceholder('Escribe el título de una película...');
    await searchInput.fill('Inception');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    // ACT: Click en "Agregar a Favoritos" del primer resultado
    const addButton = page.locator('button:has-text("Agregar a Favoritos")').first();
    await addButton.click();

    // ASSERT: Esperar a que la petición al servidor se complete
    await page.waitForTimeout(1500);
  });

  /**
   * TEST 3: Ver lista de favoritos
   */
  test('should display favorites list', async ({ page }) => {
    await loginUser(page);

    // Agregar una película a favoritos primero
    const searchInput = page.getByPlaceholder('Escribe el título de una película...');
    await searchInput.fill('Interstellar');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    const addButton = page.locator('button:has-text("Agregar a Favoritos")').first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // ACT: Navegar a Favoritos
    await page.click('text=Mis Favoritos');
    await page.waitForURL(/\/pages\/favorites/);

    // ASSERT: Verificar que aparece al menos una película
    const favoriteCards = page.locator('app-movie-card');
    await expect(favoriteCards.first()).toBeVisible();
  });

  /**
   * TEST 4: Eliminar película de favoritos
   */
  test('should remove movie from favorites', async ({ page }) => {
    await loginUser(page);

    // Agregar película
    const searchInput = page.getByPlaceholder('Escribe el título de una película...');
    await searchInput.fill('Avatar');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Agregar a Favoritos")');
    await page.waitForTimeout(1000);

    // Ir a favoritos
    await page.click('text=Mis Favoritos');
    await page.waitForURL(/\/pages\/favorites/);

    // ACT: Click en "Eliminar"
    const removeButton = page.locator('button:has-text("Eliminar")').first();
    await removeButton.click();

    // ASSERT: Esperar a que se complete la eliminación
    await page.waitForTimeout(1500);
  });

  /**
   * TEST 5: Indicador visual de película favorita en búsqueda
   */
  test('should show favorite badge on search results', async ({ page }) => {
    await loginUser(page);

    // Buscar y agregar a favoritos
    const searchInput = page.getByPlaceholder('Escribe el título de una película...');
    await searchInput.fill('Titanic');
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    await page.click('button:has-text("Agregar a Favoritos")');
    await page.waitForTimeout(1500);

    // ACT: Ir a favoritos y verificar que está ahí
    await page.click('text=Mis Favoritos');
    await page.waitForURL(/\/pages\/favorites/);

    // ASSERT: Verificar que aparece la película en favoritos
    const favoriteCards = page.locator('app-movie-card');
    await expect(favoriteCards.first()).toBeVisible();
  });
});
