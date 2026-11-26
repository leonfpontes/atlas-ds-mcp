// Saves the GitHub social preview (1280 × 640), the OG image (1200 × 630) and the README cover
// (1280 × 640, light and dark) from share.html,
// so the images always carry the site's sentence, the canonical diff and the latest scoreboard.
// Usage: pnpm --filter atlas-site share-images   (needs Chromium: pnpm exec playwright install chromium)
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const out = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url))

const server = await createServer({ root, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' })
await server.listen()
const url = server.resolvedUrls?.local[0]
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 3000 }, deviceScaleFactor: 1 })
  await page.goto(`${url}share.html?theme=light`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  for (const [id, file] of [
    ['#art-social', 'public/social-preview.png'],
    ['#art-og', 'public/og.png'],
    // The README cover, light and dark, served with <picture> (read at 830 px on github.com).
    ['#art-cover-light', '../docs/cover-light.png'],
    ['#art-cover-dark', '../docs/cover-dark.png'],
  ]) {
    await page.locator(id).screenshot({ path: out(file) })
    console.log(`share-images: wrote ${file}`)
  }
} finally {
  await browser.close()
  await server.close()
}
