import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Smoke + VRT tests.
 * - Always: verify each story loads with no console errors.
 * - If baselines exist: also do screenshot diff.
 * - If no baselines: write them and pass (first-run bootstrap).
 */

const stories = [
  { name: 'AbaloneCanvas',    path: '/iframe.html?id=renderer-abalonecanvas--default&viewMode=story' },
  { name: 'PrismEyeCursor',   path: '/iframe.html?id=renderer-prismeyecursor--default&viewMode=story' },
  { name: 'TiltedChromaCard', path: '/iframe.html?id=renderer-tiltedchromacard--default&viewMode=story' },
]

const snapshotDir = path.join(__dirname, '__snapshots__')
const baselinesExist = fs.existsSync(snapshotDir) && fs.readdirSync(snapshotDir).length > 0

for (const story of stories) {
  test(`${story.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto(story.path)
    await page.waitForSelector('canvas', { timeout: 10_000 }).catch(() => null)
    await page.waitForTimeout(1_500)

    const realErrors = errors.filter(
      (e) => !e.includes('SwiftShader') && !e.includes('WEBGL_lose_context')
    )
    expect(realErrors, `Console errors in ${story.name}: ${realErrors.join(' | ')}`).toHaveLength(0)

    if (baselinesExist) {
      await expect(page).toHaveScreenshot(`${story.name}.png`, { fullPage: false })
    } else {
      // No baselines yet — capture and skip diff
      // Run `npx playwright test --update-snapshots` locally then commit __snapshots__/
      if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir, { recursive: true })
      await page.screenshot({ path: path.join(snapshotDir, `${story.name}.png`) })
      console.log(`[vrt] Baseline written for ${story.name}`)
    }
  })
}
