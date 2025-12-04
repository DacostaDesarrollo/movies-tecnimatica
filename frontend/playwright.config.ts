import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para E2E testing
 *
 * Playwright es más moderno que Protractor (deprecated).
 * Soporta múltiples navegadores y es más rápido.
 */

export default defineConfig({
  testDir: './e2e',

  // Timeout para cada test (30 segundos)
  timeout: 30 * 1000,

  // Número de intentos si un test falla
  retries: process.env['CI'] ? 2 : 0,

  // Número de workers (tests en paralelo)
  workers: process.env['CI'] ? 1 : undefined,

  // Reporter (cómo mostrar resultados)
  reporter: [
    ['html'],
    ['list']
  ],

  // Configuración compartida para todos los tests
  use: {
    // URL base de la aplicación
    baseURL: 'http://localhost:4200',

    // Tomar screenshot solo cuando falla
    screenshot: 'only-on-failure',

    // Grabar video solo cuando falla
    video: 'retain-on-failure',

    // Trace (debugging avanzado) solo cuando falla
    trace: 'retain-on-failure',
  },

  // Proyectos (diferentes navegadores/configuraciones)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Descomentar para probar en más navegadores:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile viewports:
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Servidor de desarrollo
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120 * 1000, // 2 minutos para que levante el server
  },
});
