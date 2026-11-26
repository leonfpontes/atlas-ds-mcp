// Turns tokens.json into the two CSS files of the shadcn/ui theme:
// - tokens.css: the runtime variables, `:root` (light) and `.dark`, colors in oklch;
// - theme.css: the Tailwind CSS v4 theme (`@theme inline` maps the variables to utilities
//   such as bg-primary; `@theme` adds the fonts, type scale, spacing, easing and shadow).
// Dark values live in `$extensions["atlas.modes"].dark`; a token without one is the same in
// both themes, and an alias without one follows its target's dark value.

import { toOklchCss } from './color.js'
import { flattenTokens, resolveTokens, type FlatToken, type TokenTree } from './dtcg.js'

export const MODES_EXTENSION = 'atlas.modes'

const ALIAS = /^\{([^{}]+)\}$/

export interface ThemeColor {
  /** CSS variable without the dashes, e.g. `primary`, `code-bg`. */
  name: string
  token: string
  light: string
  dark: string
  description: string | undefined
}

/** Dark value as written in the token, if any. */
function ownDark(token: FlatToken): string | undefined {
  const modes = token.extensions?.[MODES_EXTENSION] as { dark?: unknown } | undefined
  return typeof modes?.dark === 'string' ? modes.dark : undefined
}

/** Every color token with its resolved light and dark hex. */
export function themeColors(tree: TokenTree): ThemeColor[] {
  const raw = new Map(flattenTokens(tree).map((t) => [t.name, t]))
  const resolved = resolveTokens(tree).filter((t) => t.type === 'color')
  const darkOf = (name: string, light: string, seen: string[] = []): string => {
    const token = raw.get(name)
    if (!token) return light
    const dark = ownDark(token)
    if (dark) return ALIAS.test(dark) ? resolveAlias(dark) : dark
    const target = typeof token.value === 'string' ? ALIAS.exec(token.value)?.[1] : undefined
    if (target && !seen.includes(target)) return darkOf(target, light, [...seen, name])
    return light
  }
  const resolveAlias = (value: string) => {
    const target = ALIAS.exec(value)?.[1] as string
    const hit = resolved.find((t) => t.name === target)
    if (!hit) throw new Error(`Dark value points to "${target}", which doesn't exist.`)
    return hit.value as string
  }
  return resolved.map((t) => {
    if (typeof t.value !== 'string') throw new Error(`Color token "${t.name}" must be a hex string.`)
    return {
      name: t.path.slice(1).join('-'),
      token: t.name,
      light: t.value,
      dark: darkOf(t.name, t.value),
      description: t.description,
    }
  })
}

type Dimension = { value: number; unit: string }
const dim = (v: unknown) => {
  const d = v as Dimension
  if (typeof d?.value !== 'number' || typeof d.unit !== 'string')
    throw new Error(`Not a dimension: ${JSON.stringify(v)}`)
  return `${d.value}${d.unit}`
}
const fontStack = (v: unknown) => (v as string[]).map((f) => (/^[\w-]+$/.test(f) ? f : `'${f}'`)).join(', ')
const shadow = (v: unknown) =>
  (v as { color: string; offsetX: unknown; offsetY: unknown; blur: unknown; spread: unknown }[])
    .map((s) => `${dim(s.offsetX)} ${dim(s.offsetY)} ${dim(s.blur)} ${dim(s.spread)} ${toOklchCss(s.color)}`)
    .join(', ')

const block = (selector: string, lines: string[], indent = '') =>
  `${indent}${selector} {\n${lines.map((l) => `${indent}  ${l}`).join('\n')}\n${indent}}`

export interface ThemeCss {
  tokensCss: string
  themeCss: string
}

/** The two CSS files. Throws if a token group the theme needs is missing. */
export function buildCss(tree: TokenTree): ThemeCss {
  const colors = themeColors(tree)
  const byName = new Map(resolveTokens(tree).map((t) => [t.name, t]))
  const need = (name: string) => {
    const t = byName.get(name)
    if (!t) throw new Error(`tokens.json has no "${name}".`)
    return t.value
  }
  const group = (prefix: string) => [...byName.values()].filter((t) => t.path[0] === prefix)
  const radiusBase = need('radius.base') as Dimension

  const root = [
    ...colors.map((c) => `--${c.name}: ${toOklchCss(c.light)};`),
    `--radius: ${dim(radiusBase)};`,
    `--control: ${dim(need('size.control'))};`,
    `--dur-fast: ${dim(need('duration.fast'))};`,
    `--dur: ${dim(need('duration.base'))};`,
    `--dur-slow: ${dim(need('duration.slow'))};`,
  ]
  const dark = colors.filter((c) => c.dark !== c.light).map((c) => `--${c.name}: ${toOklchCss(c.dark)};`)

  const header = '/* Generated from tokens.json by @leonfpontes/atlas-tokens. Do not edit. */'
  const tokensCss = [
    header,
    block(':root', root),
    `@media (pointer: coarse) {\n${block(':root', [`--control: ${dim(need('size.control-touch'))};`], '  ')}\n}`,
    block('.dark', dark),
    '',
  ].join('\n\n')

  const inline = [
    ...colors.map((c) => `--color-${c.name}: var(--${c.name});`),
    ...group('radius')
      .filter((t) => t.path[1] !== 'base')
      .map((t) => {
        const ratio = Number(((t.value as Dimension).value / radiusBase.value).toFixed(3))
        return `--radius-${t.path[1]}: ${ratio === 1 ? 'var(--radius)' : `calc(var(--radius) * ${ratio})`};`
      }),
  ]
  const theme = [
    `--font-sans: ${fontStack(need('font.family.sans'))};`,
    `--font-mono: ${fontStack(need('font.family.mono'))};`,
    ...group('font')
      .filter((t) => t.path[1] === 'weight')
      .map((t) => `--font-weight-${t.path[2]}: ${t.value as number};`),
    ...group('font')
      .filter((t) => t.path[1] === 'size')
      .map((t) => `--text-${t.path[2]}: ${dim(t.value)};`),
    `--spacing: ${dim(need('space.base'))};`,
    ...group('easing').map((t) => `--ease-${t.path[1]}: cubic-bezier(${(t.value as number[]).join(', ')});`),
    ...group('shadow').map((t) => `--shadow-${t.path[1]}: ${shadow(t.value)};`),
  ]
  const themeCss = [
    header,
    '/* Tailwind CSS v4: @import "tailwindcss"; then this file, then tokens.css. */',
    '@custom-variant dark (&:is(.dark *));',
    block('@theme inline', inline),
    block('@theme', theme),
    '',
  ].join('\n\n')

  return { tokensCss, themeCss }
}
