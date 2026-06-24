import { test, expect } from '@playwright/test'

/**
 * VRT smoke tests.
 * Shaders are frozen by overriding rAF before screenshot so uTime stops
 * incrementing and canvas pixels are stable across runs.
 *
 * Playwright manages its own snapshot dir (storybook.spec.ts-snapshots/).
 * First run (or --update-snapshots) writes baselines; subsequent runs diff.
 */

const stories = [
  { name: 'AbaloneCanvas',    path: '/iframe.html?id=renderer-abalonecanvas--default&viewMode=story' },
  { name: 'PrismEyeCursor',   path: '/iframe.html?id=renderer-prismeyecursor--default&viewMode=story' },
  { name: 'TiltedChromaCard', path: '/iframe.html?id=renderer-tiltedchromacard--default&viewMode=story' },
]

// Errors emitted by TiltedChromaCard's DOM-layer that are non-fatal in a
// Storybook iframe (no scroll container, no SharedChromaProvider wrapper).
const KNOWN_SAFE_ERRORS = [
  'SwiftShader',
  'WEBGL_lose_context',
  // SharedChromaContext is optional; TiltedChromaCard silently skips it
  'useSharedChroma',
]

function isSafeError(msg: string): boolean {
  return KNOWN_SAFE_ERRORS.some((s) => msg.includes(s))
}

for (const story of stories) {
  test(`${story.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto(story.path)
    await page.waitForSelector('canvas', { timeout: 10_000 }).catch(() => null)
    // Let the first frame paint fully
    await page.waitForTimeout(1_000)

    // Freeze all animation loops (rAF + R3F useFrame) so uTime stops
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-vrt-freeze', 'true')
      window.requestAnimationFrame = () => 0
    })
    await page.waitForTimeout(200)

    const realErrors = errors.filter((e) => !isSafeError(e))
    expect(
      realErrors,
      `Console errors in ${story.name}: ${realErrors.join(' | ')}`
    ).toHaveLength(0)

    await expect(page).toHaveScreenshot(`${story.name}.png`, {
      fullPage: false,
      maxDiffPixels: 4000,
      threshold: 0.15,
      animations: 'disabled',
    })
  })
}
