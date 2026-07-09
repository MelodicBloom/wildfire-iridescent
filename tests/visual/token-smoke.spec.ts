import { expect, test } from '@playwright/test'

const stories = [
  {
    name: 'DefaultTokens',
    id: 'tokens-smokesuite--default-tokens',
    cssVars: {
      '--iridescent-material-film-thickness-max': '0.92',
      '--iridescent-surface-page-background': '#080a0f',
    },
  },
  {
    name: 'ReducedMotion',
    id: 'tokens-smokesuite--reduced-motion',
    cssVars: {
      '--iridescent-shader-animation-speed': '0',
    },
  },
]

for (const { name, id, cssVars } of stories) {
  test(`Token smoke: ${name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}`)
    await page.waitForSelector('[data-ready="1"]', { timeout: 6000 })

    for (const [varName, expected] of Object.entries(cssVars)) {
      const actual = await page.evaluate(
        (tokenName) => getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim(),
        varName,
      )
      expect(actual).toBe(expected)
    }

    await expect(page).toHaveScreenshot(`${name}.png`, {
      maxDiffPixelRatio: 0.01,
      fullPage: true,
    })
  })
}
