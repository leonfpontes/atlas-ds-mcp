// QA (story Q1): the built site in a real browser, at 375, 1024 and 1440 px, light and dark.
// Runs against `vite preview` of site/dist (see playwright.config.ts): `pnpm build && pnpm e2e`.
import { readFileSync } from 'node:fs'

import { expect, type Page, test } from '@playwright/test'

const WIDTHS = [375, 1024, 1440] as const
const SCHEMES = ['light', 'dark'] as const

interface Summary {
  validPercent: number
  renderedPercent: number
  firstDraft?: { validPercent: number }
}
const latest = JSON.parse(readFileSync(new URL('../evals/results/latest.json', import.meta.url), 'utf8')) as {
  renderMode: string
  variants: Record<'without-mcp' | 'docs-mcp' | 'with-mcp', Summary>
}
const pct = (n: number) => `${Math.round(n * 10) / 10}%`

/** Fails the test on any console error or uncaught exception. */
function watchErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  return errors
}

async function noSideScroll(page: Page) {
  const { scroll, client } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }))
  expect(scroll, 'page scrolls sideways').toBeLessThanOrEqual(client)
}

for (const width of WIDTHS) {
  for (const scheme of SCHEMES) {
    test.describe(`${width} px · ${scheme}`, () => {
      test.use({ viewport: { width, height: 900 }, colorScheme: scheme })

      test('How it works: one H1, the final scoreboard, no stand-ins, no errors', async ({ page }) => {
        const errors = watchErrors(page)
        await page.goto('/')
        await expect(page.locator('html')).toHaveClass(scheme === 'dark' ? /\bdark\b/ : /^(?!.*\bdark\b).*$/)
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
          'Your coding agent gets the design system, then checks its own screen.',
        )

        // Hero: the lookups vs without, rounded, from latest.json.
        const v = latest.variants
        await expect(
          page.getByText(
            `${Math.round(v['docs-mcp'].validPercent)}% valid screens with the lookups vs ${Math.round(v['without-mcp'].validPercent)}% without`,
          ),
        ).toBeVisible()

        // Scoreboard: every "Valid screens" number from latest.json.
        const row = page.getByRole('row', { name: /^Valid screens/ })
        await row.scrollIntoViewIfNeeded()
        for (const n of [
          v['without-mcp'].validPercent,
          v['docs-mcp'].validPercent,
          v['with-mcp'].firstDraft!.validPercent,
          v['with-mcp'].validPercent,
        ])
          await expect(row).toContainText(pct(n))

        // The final run uses the real components: no stand-ins marker anywhere.
        expect(latest.renderMode).toBe('components')
        await expect(page.getByText(/stand-ins/i)).toHaveCount(0)

        await noSideScroll(page)
        expect(errors).toEqual([])
      })

      test('404: says the page is missing, offers three ways back and searches the docs', async ({
        page,
      }) => {
        const errors = watchErrors(page)
        await page.goto('/404.html')
        await expect(page.getByRole('heading', { level: 1, name: "This page isn't here" })).toBeVisible()
        for (const name of [/How it works/, /Docs/, /Quickstart/])
          await expect(page.getByRole('main').getByRole('link', { name }).first()).toBeVisible()
        await page.getByRole('searchbox', { name: 'Search docs and components' }).fill('button')
        await expect(page.getByRole('link', { name: /Button/ }).first()).toBeVisible()
        await noSideScroll(page)
        expect(errors).toEqual([])
      })
    })
  }
}

test.describe('keyboard', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the first Tab is "Skip to content", and it moves focus to the main content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
  })

  test('the quickstart tabs switch with the arrow keys', async ({ page }) => {
    await page.goto('/#quickstart')
    const code = page.getByRole('tab', { name: 'Claude Code' })
    await code.focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: 'Claude Desktop' })).toBeFocused()
    await expect(page.getByRole('tab', { name: 'Claude Desktop' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel')).toContainText('claude_desktop_config.json')
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tabpanel')).toContainText('.cursor/mcp.json')
  })

  test('every focusable element shows a focus ring', async ({ page }) => {
    await page.goto('/')
    const missing: string[] = []
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const s = getComputedStyle(el)
        const ring = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
        const shadow = s.boxShadow !== 'none'
        return { name: `${el.tagName} ${el.textContent?.trim().slice(0, 30) ?? ''}`, ok: ring || shadow }
      })
      if (!info) break
      if (!info.ok) missing.push(info.name)
    }
    expect(missing).toEqual([])
  })

  test('404: ⌘K or Ctrl+K jumps to the search', async ({ page }) => {
    await page.goto('/404.html', { waitUntil: 'networkidle' })
    await expect(page.getByRole('searchbox', { name: 'Search docs and components' })).not.toBeFocused()
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.getByRole('searchbox', { name: 'Search docs and components' })).toBeFocused()
  })
})

test.describe('small screens', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  test('the menu opens from the keyboard, lists the pages and closes with Esc, returning focus', async ({
    page,
  }) => {
    await page.goto('/')
    const open = page.getByRole('button', { name: 'Open menu' })
    await open.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Atlas' })
    await expect(dialog).toBeVisible()
    for (const name of ['How it works', 'Docs', 'Evaluation', 'GitHub'])
      await expect(dialog.getByRole('link', { name })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(open).toBeFocused()
  })

  test('controls are at least 44 px tall on touch', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 800 },
      hasTouch: true,
      isMobile: true,
    })
    const page = await context.newPage()
    await page.goto('/')
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('main button, header button')]
        .filter((el) => el.offsetParent !== null && !el.closest('[inert], [aria-hidden="true"]'))
        .map((el) => ({
          name: el.getAttribute('aria-label') ?? el.textContent?.trim(),
          h: el.getBoundingClientRect().height,
        }))
        .filter((b) => b.h < 44),
    )
    expect(small).toEqual([])
    await context.close()
  })
})
