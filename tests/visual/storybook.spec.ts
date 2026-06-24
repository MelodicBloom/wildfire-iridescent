import { test, expect } from '@playwright/test'

/**
 * VRT smoke tests.
 * Shaders are frozen via `data-vrt-freeze` injected before screenshot,
 * so the canvas produces a stable frame regardless of uTime.
 * Playwright manages its own snapshot dir (storybook.spec.ts-snapshots/).
 * First run writes baselines and fails — re-run or use --update-snapshots.
 */

const stories = [
  { name: 'AbaloneCanvas',    path: '/iframe.html?id=renderer-abalonecanvas--default&viewMode=story' },
  { name: 'PrismEyeCursor',   path: '/iframe.html?id=renderer-prismeyecursor--default&viewMode=story' },
  { name: 'TiltedChromaCard', path: '/iframe.html?id=renderer-tiltedchromacard--default&viewMode=story' },
]

for (const story of stories) {
  test(`${story.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto(story.path)
    await page.waitForSelector('canvas', { timeout: 10_000 }).catch(() => null)
    // Let the first frame paint
    await page.waitForTimeout(800)

    // Freeze the R3F animation loop so uTime stops incrementing
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-vrt-freeze', 'true')
      // Cancel all rAF callbacks to stop the render loop
      const noop = () => {}
      const orig = window.requestAnimationFrame
      ;(window as any).__origRAF = orig
      window.requestAnimationFrame = (cb) => { void cb; return 0 }
    })
    // One more tick to let the frozen frame settle
    await page.waitForTimeout(200)

    const realErrors = errors.filter(
      (e) => !e.includes('SwiftShader') && !e.includes('WEBGL_lose_context')
    )
    expect(realErrors, `Console errors in ${story.name}: ${realErrors.join(' | ')}`).toHaveLength(0)

    await expect(page).toHaveScreenshot(`${story.name}.png`, {
      fullPage: false,
      // Generous pixel budget — SwiftShader floating-point is non-deterministic
      maxDiffPixels: 4000,
      threshold: 0.15,
      // Don't wait for animation stability — we froze it manually
      animations: 'disabled',
    })
  })
}
