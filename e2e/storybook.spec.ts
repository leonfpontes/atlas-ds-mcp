// QA (story Q1): the Storybook the site publishes under /storybook/, in a real browser.
import { readFileSync } from 'node:fs'

import { expect, type FrameLocator, type Page, test } from '@playwright/test'

const WIDTHS = [375, 1024, 1440] as const
const SCHEMES = ['light', 'dark'] as const

const manifest = JSON.parse(
  readFileSync(new URL('../packages/ui/atlas.manifest.json', import.meta.url), 'utf8'),
) as { components: { name: string; storybook: string }[] }

type Entry = { id: string; type: 'docs' | 'story'; title: string }
async function docsEntries(page: Page): Promise<Entry[]> {
  const res = await page.request.get('/storybook/index.json')
  expect(res.ok()).toBe(true)
  const index = (await res.json()) as { entries: Record<string, Entry> }
  return Object.values(index.entries).filter((e) => e.type === 'docs')
}

function watchErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  return errors
}

const preview = (page: Page): FrameLocator => page.frameLocator('#storybook-preview-iframe')

for (const width of WIDTHS) {
  for (const scheme of SCHEMES) {
    test.describe(`${width} px · ${scheme}`, () => {
      test.use({ viewport: { width, height: 900 }, colorScheme: scheme })

      test('opens the Button docs page in the system theme, with no errors', async ({ page }) => {
        const errors = watchErrors(page)
        await page.goto('/storybook/?path=/docs/components-button--docs')
        const frame = preview(page)
        await expect(frame.getByRole('heading', { level: 1, name: 'Button' })).toBeVisible({
          timeout: 15_000,
        })
        await expect(frame.locator('html')).toHaveClass(scheme === 'dark' ? /\bdark\b/ : /^(?!.*\bdark\b).*$/)
        expect(errors).toEqual([])
      })
    })
  }
}

test('every docs page renders its title without errors', async ({ page }) => {
  test.setTimeout(120_000)
  const entries = await docsEntries(page)
  expect(entries.length).toBeGreaterThanOrEqual(13)
  const broken: string[] = []
  for (const entry of entries) {
    const errors = watchErrors(page)
    await page.goto(`/storybook/iframe.html?viewMode=docs&id=${entry.id}`)
    const h1 = page.getByRole('heading', { level: 1 }).first()
    try {
      await expect(h1).toBeVisible({ timeout: 10_000 })
    } catch {
      broken.push(`${entry.id}: no H1`)
    }
    if (errors.length) broken.push(`${entry.id}: ${errors.join(' | ')}`)
    page.removeAllListeners('console')
    page.removeAllListeners('pageerror')
  }
  expect(broken).toEqual([])
})

test('the manifest links each component to a docs page that exists', async ({ page }) => {
  const ids = new Set((await docsEntries(page)).map((e) => e.id))
  const missing = manifest.components
    .filter((c) => !ids.has(c.storybook))
    .map((c) => `${c.name} → ${c.storybook}`)
  expect(missing).toEqual([])
})

test('the docs theme button works from the keyboard', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/storybook/iframe.html?viewMode=docs&id=components-button--docs')
  const html = page.locator('html')
  await expect(html).not.toHaveClass(/\bdark\b/)
  const toggle = page.getByRole('button', { name: /^Theme: light/ })
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(html).toHaveClass(/\bdark\b/)
  await expect(page.getByRole('button', { name: /^Theme: dark/ })).toBeFocused()
})
