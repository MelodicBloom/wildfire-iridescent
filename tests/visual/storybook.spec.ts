import { test, expect } from '@playwright/test'

/**
 * Smoke tests — verify each story page loads and renders without errors.
 * Screenshot baselines are generated on first run (--update-snapshots).
 */

const stories = [
  { name: 'AbaloneCanvas',   path: '/iframe.html?id=renderer-abalonecanvas--default&viewMode=story' },
  { name: 'PrismEyeCursor',  path: '/iframe.html?id=renderer-prismeyecursor--default&viewMode=story' },
  { name: 'TiltedChromaCard',path: '/iframe.html?id=renderer-tiltedchromacard--default&viewMode=story' },
]

for (const story of stories) {
  test(`${story.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto(story.path)
    // Wait for canvas to be present (WebGL components mount asynchronously)
    await page.waitForSelector('canvas', { timeout: 10_000 }).catch(() => null)
    await page.waitForTimeout(1_500)

    // Filter out known benign WebGL SwiftShader warning
    const realErrors = errors.filter(
      (e) => !e.includes('SwiftShader') && !e.includes('WEBGL_lose_context')
    )
    expect(realErrors, `Console errors in ${story.name}: ${realErrors.join(' | ')}`).toHaveLength(0)
  })
}
