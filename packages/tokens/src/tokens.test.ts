// The real tokens.json: DTCG shape, the approved values from docs/DESIGN.md and the
// approved prototype (src/test/prototype-colors.json), AA contrast in both themes, and the CSS the build writes.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { contrastRatio } from './color.js'
import { CONTRAST_PAIRS } from './contrast.js'
import { buildCss, MODES_EXTENSION, themeColors } from './css.js'
import { flattenTokens, resolveTokens, type TokenTree, type TokenType } from './dtcg.js'

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = path.resolve(pkg, '../..')
const tree = JSON.parse(readFileSync(path.join(pkg, 'tokens.json'), 'utf8')) as TokenTree
const colors = themeColors(tree)
const color = new Map(colors.map((c) => [c.name, c]))

describe('tokens.json format', () => {
  const tokens = flattenTokens(tree)
  const TYPES: TokenType[] = [
    'color',
    'dimension',
    'fontFamily',
    'fontWeight',
    'duration',
    'cubicBezier',
    'shadow',
  ]

  it('every token has a DTCG type and a description an agent can read', () => {
    for (const t of tokens) {
      expect(TYPES, t.name).toContain(t.type)
      expect(t.description, `${t.name} has no $description`).toBeTruthy()
    }
  })

  it('resolves every alias', () => {
    expect(() => resolveTokens(tree)).not.toThrow()
  })

  it('colors are hex, and the dark value lives only in the modes extension', () => {
    for (const t of tokens.filter((x) => x.type === 'color')) {
      expect(t.value, t.name).toMatch(/^(#[0-9A-F]{6}|\{color\.[a-z0-9.-]+\})$/)
      const keys = Object.keys(t.extensions ?? {})
      expect(
        keys.filter((k) => k !== MODES_EXTENSION),
        t.name,
      ).toEqual([])
    }
    for (const c of colors) expect(c.dark, c.name).toMatch(/^#[0-9A-F]{6}$/)
  })

  it('has the full shadcn/ui theme plus the Atlas extensions', () => {
    const shadcn = [
      'background',
      'foreground',
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
      'primary',
      'primary-foreground',
      'secondary',
      'secondary-foreground',
      'muted',
      'muted-foreground',
      'accent',
      'accent-foreground',
      'destructive',
      'border',
      'input',
      'ring',
      'chart-1',
      'chart-2',
      'chart-3',
      'chart-4',
      'chart-5',
      'sidebar',
      'sidebar-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-accent',
      'sidebar-accent-foreground',
      'sidebar-border',
      'sidebar-ring',
    ]
    const atlas = [
      'success',
      'success-subtle',
      'warning',
      'warning-subtle',
      'info',
      'info-subtle',
      'destructive-subtle',
      'text-subtle',
    ]
    for (const name of [...shadcn, ...atlas]) expect(color.has(name), name).toBe(true)
  })
})

/** `| \`--name\` | #light | … | #dark |` rows of a Markdown table in docs/DESIGN.md. */
function designTable(heading: string): [string, string, string][] {
  const doc = readFileSync(path.join(root, 'docs/DESIGN.md'), 'utf8')
  const start = doc.indexOf(heading)
  expect(start, heading).toBeGreaterThan(-1)
  const section = doc.slice(start, doc.indexOf('\n## ', start + 1))
  const rows: [string, string, string][] = []
  for (const line of section.split('\n')) {
    const cells = line.split('|').map((c) => c.trim())
    const name = /^`--([a-z0-9-]+)`$/.exec(cells[1] ?? '')?.[1]
    // A cell may add the oklch after the hex: "#1F3A60 · oklch(…)".
    const hex = (cell: string | undefined) => /^(#[0-9A-F]{6})\b/.exec(cell ?? '')?.[1]
    const [light, dark] = [hex(cells[2]), hex(cells[4])]
    if (name && light && dark) rows.push([name, light, dark])
  }
  return rows
}

/** The approved prototype's `--name: #hex` colors for one theme, frozen in src/test/prototype-colors.json. */
function prototypeBlock(selector: ':root' | '.dark'): Map<string, string> {
  const frozen = JSON.parse(readFileSync(path.join(pkg, 'src/test/prototype-colors.json'), 'utf8')) as Record<
    'light' | 'dark',
    Record<string, string>
  >
  return new Map(Object.entries(frozen[selector === ':root' ? 'light' : 'dark']))
}

describe('values approved by the designer', () => {
  const rows = [...designTable('## shadcn/ui theme'), ...designTable('**Atlas extensions**')]

  it('reads the DESIGN.md tables', () => {
    expect(rows.length).toBeGreaterThanOrEqual(20)
    expect(rows.map((r) => r[0])).toEqual(
      expect.arrayContaining(['sidebar-accent', 'sidebar-accent-foreground']),
    )
  })

  it.each(rows)('--%s is %s light and %s dark, as in docs/DESIGN.md', (name, light, dark) => {
    expect(color.get(name)?.light).toBe(light)
    expect(color.get(name)?.dark).toBe(dark)
  })

  it('the chart colors follow DESIGN.md in both themes, in the same order', () => {
    const charts = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'].map((n) => color.get(n))
    expect(charts.map((c) => c?.light)).toEqual(['#0B5CAD', '#00745A', '#E69F00', '#B23A00', '#636B7D'])
    expect(charts.map((c) => c?.dark)).toEqual(['#6FA8F5', '#4CC9A0', '#F5B642', '#FF8A5C', '#9AA3B5'])
  })

  // DESIGN.md wins where the two disagree; list each difference here on purpose. None today.
  const DIFFERENCES: Record<string, string> = {}

  it.each([':root', '.dark'] as const)(
    'matches the approved prototype %s, except the listed differences',
    (selector) => {
      const mode = selector === ':root' ? 'light' : 'dark'
      const proto = prototypeBlock(selector)
      expect(proto.size).toBeGreaterThan(10)
      for (const [name, hex] of proto) {
        const ours = color.get(name)
        if (!ours || DIFFERENCES[`${mode} ${name}`]) continue
        expect(ours[mode], `${selector} --${name}`).toBe(hex)
      }
    },
  )
})

describe('contrast (WCAG 2.2 AA)', () => {
  const cases = (['light', 'dark'] as const).flatMap((mode) =>
    CONTRAST_PAIRS.map((p) => [mode, p.text, p.background, p.kind] as const),
  )

  it.each(cases)('%s: %s on %s (%s)', (mode, text, background, kind) => {
    const fg = color.get(text)
    const bg = color.get(background)
    expect(fg, text).toBeDefined()
    expect(bg, background).toBeDefined()
    const ratio = contrastRatio(fg![mode], bg![mode])
    expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(kind === 'text' ? 4.5 : 3)
  })
})

describe('build', () => {
  const { tokensCss, themeCss } = buildCss(tree)

  it('writes every color for light and only what changes for dark', () => {
    const block = (sel: string) =>
      tokensCss.slice(tokensCss.indexOf(`${sel} {`), tokensCss.indexOf('}', tokensCss.indexOf(`${sel} {`)))
    const light = block(':root')
    const dark = block('.dark')
    for (const c of colors) {
      expect(light, c.name).toContain(`--${c.name}: oklch(`)
      expect(dark.includes(`--${c.name}:`), c.name).toBe(c.dark !== c.light)
    }
    expect(light).toContain('--primary: oklch(0.478 0.147 254.3);')
    expect(dark).toContain('--background: oklch(0.195 0.016 261.6);')
  })

  it('code colors are the same in both themes', () => {
    for (const c of colors.filter((x) => x.name.startsWith('code-'))) expect(c.dark).toBe(c.light)
  })

  it('gives the controls 40 px and 44 px on touch, and the motion tokens', () => {
    expect(tokensCss).toContain('--control: 40px;')
    expect(tokensCss).toMatch(/@media \(pointer: coarse\) \{\s+:root \{\s+--control: 44px;/)
    expect(tokensCss).toContain('--radius: 0.375rem;')
    for (const v of ['--dur-fast: 120ms;', '--dur: 180ms;', '--dur-slow: 240ms;'])
      expect(tokensCss).toContain(v)
  })

  it('writes the Tailwind v4 theme: one utility per color, the radius scale, fonts and type', () => {
    for (const c of colors) expect(themeCss).toContain(`--color-${c.name}: var(--${c.name});`)
    expect(themeCss).toContain('--radius-sm: calc(var(--radius) * 0.6);')
    expect(themeCss).toContain('--radius-xl: calc(var(--radius) * 1.4);')
    expect(themeCss).toContain("--font-sans: 'IBM Plex Sans', system-ui")
    expect(themeCss).toContain("--font-mono: 'IBM Plex Mono', ui-monospace")
    for (const size of [12, 13, 14, 16, 17, 20, 28, 36, 44])
      expect(themeCss).toContain(`--text-${size}: ${size}px;`)
    expect(themeCss).toContain('--spacing: 4px;')
    expect(themeCss).toContain('--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);')
    expect(themeCss).toMatch(/--shadow-overlay: 0px 10px 30px -10px oklch\(/)
  })

  it('is deterministic', () => {
    expect(buildCss(tree)).toEqual({ tokensCss, themeCss })
  })
})
