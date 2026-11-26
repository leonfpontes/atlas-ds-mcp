// QA (story Q1): the social cards. The committed og.png and social-preview.png have to be
// what share.html draws today, so a new scoreboard can't ship with an old picture.
// Fix a failure with `pnpm --filter atlas-site share-images`.
import { readFileSync } from 'node:fs'

import { expect, type Page, test } from '@playwright/test'

const site = new URL('../site/', import.meta.url)
// Served by the second web server in playwright.config.ts (vite dev, so share.html exists).
const shareUrl = 'http://127.0.0.1:4174/share.html?theme=light'

/** Share of pixels that differ by more than a small tolerance, measured in the browser. */
async function pixelDiff(page: Page, a: Buffer, b: Buffer): Promise<number> {
  return page.evaluate(
    async ([x, y]) => {
      const load = async (b64: string) => {
        const img = new Image()
        img.src = `data:image/png;base64,${b64}`
        await img.decode()
        const c = document.createElement('canvas')
        c.width = img.naturalWidth
        c.height = img.naturalHeight
        const ctx = c.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        return ctx.getImageData(0, 0, c.width, c.height)
      }
      const [p, q] = [await load(x), await load(y)]
      if (p.width !== q.width || p.height !== q.height) return 1
      let diff = 0
      for (let i = 0; i < p.data.length; i += 4) {
        let d = 0
        for (let c = 0; c < 3; c++) d += Math.abs((p.data[i + c] ?? 0) - (q.data[i + c] ?? 0))
        if (d > 48) diff++
      }
      return diff / (p.width * p.height)
    },
    [a.toString('base64'), b.toString('base64')] as const,
  )
}

for (const [id, file, size] of [
  ['#art-og', 'public/og.png', { width: 1200, height: 630 }],
  ['#art-social', 'public/social-preview.png', { width: 1280, height: 640 }],
] as const) {
  test(`${file} is ${size.width} × ${size.height} and matches what share.html draws today`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1400, height: 3000 })
    await page.goto(shareUrl, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const fresh = await page.locator(id).screenshot()
    const committed = readFileSync(new URL(file, site))
    const ratio = await pixelDiff(page, fresh, committed)
    expect(ratio, `${file} is out of date: run pnpm --filter atlas-site share-images`).toBeLessThan(0.002)
  })
}

test('the page announces the card: og and twitter tags, 1200 × 630, with alt text', async ({ page }) => {
  await page.goto('/')
  const meta = (p: string) => page.locator(`meta[property="${p}"], meta[name="${p}"]`).getAttribute('content')
  expect(await meta('og:image')).toMatch(/\/og\.png$/)
  expect(await meta('og:image:width')).toBe('1200')
  expect(await meta('og:image:height')).toBe('630')
  expect((await meta('og:image:alt'))?.length).toBeGreaterThan(10)
  expect(await meta('twitter:card')).toBe('summary_large_image')
  const og = await page.request.get('/og.png')
  expect(og.ok()).toBe(true)
  expect(og.headers()['content-type']).toBe('image/png')
})
