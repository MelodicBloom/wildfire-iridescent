import { test, expect } from '@playwright/test'

const stories = [
  {
    name: 'DefaultTokens',
    id:   'tokens-smokesuite--default-tokens',
    cssVars: {
      '--iridescent-shader-aberration-strength': '0.018',
      '--iridescent-shader-film-thickness':      '0.72'
    }
  },
  {
    name: 'ReducedMotion',
    id:   'tokens-smokesuite--reduced-motion',
    cssVars: {}
  }
]

for (const { name, id, cssVars } of stories) {
  test(`Token smoke: ${name}`, async ({ page }) => {
    await page.goto(`http://localhost:6006/iframe.html?id=${id}`)
    await page.waitForSelector('[data-ready="1"]', { timeout: 6000 })

    for (const [varName, expected] of Object.entries(cssVars)) {
      const actual = await page.evaluate(
        (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim(),
        varName
      )
      expect(actual).toBe(expected)
    }

    await expect(page).toHaveScreenshot(`${name}.png`, {
      maxDiffPixelRatio: 0.01,
      fullPage: true
    })
  })
}
