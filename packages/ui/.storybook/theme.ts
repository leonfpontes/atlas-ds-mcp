// Storybook manager and docs themes, built from the Atlas tokens (docs/DESIGN.md → Storybook).
import { themeColors, type TokenTree } from '@leonfpontes/atlas-tokens'
import tokens from '@leonfpontes/atlas-tokens/tokens.json'
import { create } from 'storybook/theming'

export type Mode = 'light' | 'dark'

const colors = themeColors(tokens as TokenTree)
const color = (name: string, mode: Mode) => {
  const c = colors.find((x) => x.name === name)
  if (!c) throw new Error(`Atlas token --${name} is missing`)
  return c[mode]
}

const MARK = (mode: Mode) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="flex:none">${[
    [2, 2],
    [13, 2],
    [2, 13],
  ]
    .map(
      ([x, y]) => `<rect x="${x}" y="${y}" width="9" height="9" rx="2" fill="${color('foreground', mode)}"/>`,
    )
    .join('')}<rect x="13" y="13" width="9" height="9" rx="2" fill="${color('primary', mode)}"/></svg>`

export const VERSION = '0.1.0'

export function atlasTheme(mode: Mode) {
  const c = (name: string) => color(name, mode)
  return create({
    base: mode,
    brandTitle: `<span style="display:flex;align-items:center;gap:10px;font:600 16px 'IBM Plex Sans',sans-serif;color:${c('foreground')}">${MARK(mode)}Atlas<span class="atlas-version">v${VERSION}</span></span>`,
    brandUrl: '?path=/docs/welcome-introduction--docs',
    brandTarget: '_self',
    colorPrimary: c('primary'),
    colorSecondary: c('primary'),
    appBg: c('sidebar'),
    appContentBg: c('background'),
    appPreviewBg: c('background'),
    appBorderColor: c('border'),
    appBorderRadius: 6,
    fontBase: "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontCode: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
    textColor: c('foreground'),
    textInverseColor: c('background'),
    textMutedColor: c('muted-foreground'),
    barTextColor: c('muted-foreground'),
    barHoverColor: c('foreground'),
    barSelectedColor: c('primary'),
    barBg: c('background'),
    buttonBg: c('background'),
    buttonBorder: c('border'),
    booleanBg: c('secondary'),
    booleanSelectedBg: c('background'),
    inputBg: c('background'),
    inputBorder: c('input'),
    inputTextColor: c('foreground'),
    inputBorderRadius: 5,
  })
}

/** Colors the manager CSS needs beyond what create() covers. */
export const managerColors = (mode: Mode) => ({
  accent: color('sidebar-accent', mode),
  accentFg: color('sidebar-accent-foreground', mode),
  primary: color('primary', mode),
  muted: color('muted-foreground', mode),
  subtle: color('text-subtle', mode),
  border: color('border', mode),
  hover: color('accent', mode),
  fg: color('foreground', mode),
  bg: color('background', mode),
})
