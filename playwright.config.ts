import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-webgl',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-gl=swiftshader-webgl',
            '--enable-unsafe-swiftshader',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-accelerated-2d-canvas',
          ],
        },
      },
    },
  ],
  webServer: {
    command: 'npx http-server storybook-static -p 6006 --silent',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  expect: {
    // Global fallback — per-test overrides take precedence
    toHaveScreenshot: { threshold: 0.15, maxDiffPixels: 4000 },
  },
})
