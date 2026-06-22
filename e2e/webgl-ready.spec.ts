import { test, expect } from '@playwright/test'

const components = [
  { name: 'AbaloneCanvas', story: 'renderer-abalone-canvas--default' },
  { name: 'PrismEyeCursor', story: 'renderer-prism-eye-cursor--default' },
  { name: 'TiltedChromaCard', story: 'renderer-tilted-chroma-card--default' },
]

for (const { name, story } of components) {
  test(`${name} emits data-ready from component (not story)`, async ({ page }) => {
    await page.goto(`http://localhost:6006/iframe.html?id=${story}`)

    // Wait for the component's own gate — no story-level helper needed
    await page.waitForSelector('[data-ready="1"]', { timeout: 5000 })

    await expect(page.locator('[data-ready="1"]')).toBeAttached()

    await page.screenshot({
      path: `test-results/${name}-ready.png`,
      fullPage: true,
    })
  })
}
