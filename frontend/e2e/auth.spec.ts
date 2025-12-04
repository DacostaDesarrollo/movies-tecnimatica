import { test, expect } from '@playwright/test';

/**
 * 🌐 E2E TESTS - Flujo de Autenticación
 *
 * Estos tests simulan un usuario REAL interactuando con la aplicación.
 * Se ejecutan en un navegador real, haciendo clicks, escribiendo, etc.
 *
 * IMPORTANTE: Estos tests requieren que el backend esté corriendo
 * en http://localhost:5000 (o el puerto configurado)
 */

/**
 * TEST 1: Registro de nuevo usuario
 */
test.describe('Authentication Flow', () => {

  // Generar email único para CADA test
  let testUser: { email: string; password: string };

  test.beforeEach(() => {
    testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };
  });

  test('should register a new user successfully', async ({ page }) => {
    // ARRANGE: Navegar a la página de registro
    await page.goto('/auth/register');

    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByRole('heading', { name: /Crear Cuenta/i })).toBeVisible();

    // ACT: Llenar el formulario de registro
    await page.fill('input[formControlName="email"]', testUser.email);
    await page.fill('input[formControlName="password"]', testUser.password);
    await page.fill('input[formControlName="confirmPassword"]', testUser.password);

    // Click en el botón de registro
    await page.click('button[type="submit"]');

    // ASSERT: Verificar que se redirigió a /pages/search (lo más importante)
    await expect(page).toHaveURL(/\/pages\/search/, { timeout: 10000 });

    // Verificar que el usuario está logueado (aparece su email en el header)
    await expect(page.locator(`text=${testUser.email}`)).toBeVisible();
  });

  /**
   * TEST 2: Login con credenciales correctas
   */
  test('should login with valid credentials', async ({ page }) => {
  // Primero registramos el usuario
  await page.goto('/auth/register');
  await page.fill('input[formControlName="email"]', testUser.email);
  await page.fill('input[formControlName="password"]', testUser.password);
  await page.fill('input[formControlName="confirmPassword"]', testUser.password);
  await page.click('button[type="submit"]');

  // Esperamos a que se complete el registro
  await page.waitForURL(/\/pages\/search/);

  // Hacemos logout - primero abrir el menú de usuario
  await page.click('text=' + testUser.email); // Click en el email del usuario
  await page.click('text=Cerrar Sesión'); // Ahora sí aparece la opción
  await page.waitForURL(/\/auth\/login/);

  // ACT: Ahora hacemos login
  await page.fill('input[formControlName="email"]', testUser.email);
  await page.fill('input[formControlName="password"]', testUser.password);
  await page.click('button[type="submit"]');

  // ASSERT: Verificar que estamos logueados
  await expect(page).toHaveURL(/\/pages\/search/);
});

  /**
   * TEST 3: Login falla con credenciales incorrectas
   */
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // ACT: Intentar login con credenciales incorrectas
    await page.fill('input[formControlName="email"]', 'wrong@example.com');
    await page.fill('input[formControlName="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // ASSERT: Verificar que NO se redirigió
    await expect(page).toHaveURL(/\/auth\/login/);

    // Verificar que aparece mensaje de error (el texto real que se muestra)
    await expect(page.locator('text=Credenciales inválidas')).toBeVisible({ timeout: 5000 });
  });

  /**
   * TEST 4: Logout cierra sesión correctamente
   */
  test('should logout successfully', async ({ page }) => {
    // Login primero
    await page.goto('/auth/login');

    // Registrar usuario
    await page.goto('/auth/register');
    await page.fill('input[formControlName="email"]', testUser.email);
    await page.fill('input[formControlName="password"]', testUser.password);
    await page.fill('input[formControlName="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/pages\/search/);

    // ACT: Hacer logout - abrir menú de usuario primero
    await page.click(`text=${testUser.email}`); // Click en el email
    await page.click('text=Cerrar Sesión'); // Click en logout del menú

    // ASSERT: Verificar redirección a login
    await expect(page).toHaveURL(/\/auth\/login/);

    // Verificar que no puede acceder a páginas protegidas
    await page.goto('/pages/search');

    // Debe redirigir a login por el guard
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  /**
   * TEST 5: Validación de formulario de registro
   */
  test('should show validation errors on register form', async ({ page }) => {
    await page.goto('/auth/register');

    // ACT: Intentar submit con campos vacíos
    await page.click('button[type="submit"]');

    // ASSERT: Verificar que aparecen mensajes de error
    await expect(page.locator('text=El email es obligatorio')).toBeVisible();
    await expect(page.locator('text=La contraseña es obligatoria')).toBeVisible();
    await expect(page.locator('text=Confirma tu contraseña')).toBeVisible();

    // O verificar que los inputs tienen la clase de error de Nebular
    const emailInput = page.locator('input[formControlName="email"]');
    await expect(emailInput).toHaveClass(/status-danger/);
  });

  /**
   * TEST 6: Auth guard protege rutas
   */
  test('should protect routes when not authenticated', async ({ page }) => {
    // ACT: Intentar acceder directamente a /pages/search sin login
    await page.goto('/pages/search');

    // ASSERT: Debe redirigir a login
    await expect(page).toHaveURL(/\/auth\/login/);

    // Intentar acceder a /pages/favorites
    await page.goto('/pages/favorites');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
