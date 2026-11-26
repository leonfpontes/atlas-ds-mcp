import { createElement } from 'react'
import { addons } from 'storybook/manager-api'

import { atlasTheme, managerColors, type Mode } from './theme'

// The manager follows the same light/dark switch as the docs (the "theme" global,
// set by the docs pages' Theme button), and the system setting before anyone picks one.
const systemMode = (): Mode => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

function managerCss(mode: Mode) {
  const c = managerColors(mode)
  return `
@font-face { font-family: 'IBM Plex Sans'; font-weight: 400; font-display: swap; src: url('./fonts/plex-sans/ibm-plex-sans-latin-400-normal.woff2') format('woff2'); }
@font-face { font-family: 'IBM Plex Sans'; font-weight: 500; font-display: swap; src: url('./fonts/plex-sans/ibm-plex-sans-latin-500-normal.woff2') format('woff2'); }
@font-face { font-family: 'IBM Plex Sans'; font-weight: 600; font-display: swap; src: url('./fonts/plex-sans/ibm-plex-sans-latin-600-normal.woff2') format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-weight: 400; font-display: swap; src: url('./fonts/plex-mono/ibm-plex-mono-latin-400-normal.woff2') format('woff2'); }
.atlas-version { margin-left: 8px; padding: 2px 8px; border: 1px solid ${c.border}; border-radius: 4.8px; font: 500 12px/18px 'IBM Plex Mono', monospace; color: ${c.fg}; }
/* Items carry no icons: the same cube on every row is a pattern Atlas avoids (docs/DESIGN.md). */
#storybook-explorer-tree .sidebar-item svg[type] { display: none; }
#storybook-explorer-tree .sidebar-item { min-height: 36px; border-radius: 4.8px; }
#storybook-explorer-tree .sidebar-item > a, #storybook-explorer-tree .sidebar-item > button:first-child { font-size: 14px; min-height: 36px; align-items: center; }
#storybook-explorer-tree .sidebar-item[data-nodetype='story'] > a, #storybook-explorer-tree .sidebar-item[data-nodetype='docs'] > a { font-size: 13.5px; color: ${c.muted}; }
#storybook-explorer-tree .sidebar-item[data-selected='true'] { background: ${c.accent}; box-shadow: inset 3px 0 0 ${c.primary}; }
#storybook-explorer-tree .sidebar-item[data-selected='true'] > a { color: ${c.accentFg}; font-weight: 500; }
#storybook-explorer-tree .sidebar-item[data-selected='false']:hover { background: ${c.hover}; }
#storybook-explorer-tree .sidebar-subheading { margin-top: 10px; }
#storybook-explorer-tree .sidebar-subheading > button:first-child { flex: 1; text-transform: none; letter-spacing: 0; font: 500 12px 'IBM Plex Sans', sans-serif; color: ${c.muted}; }
#storybook-explorer-tree .sidebar-subheading > button:first-child > div:first-child { display: none; }
.atlas-count { margin-left: auto; font-weight: 400; color: ${c.subtle}; }
@media (pointer: coarse) { #storybook-explorer-tree .sidebar-item, #storybook-explorer-tree .sidebar-item > a { min-height: 44px; } }
`
}

let style: HTMLStyleElement | undefined
function apply(mode: Mode) {
  addons.setConfig({ theme: atlasTheme(mode) })
  style ??= document.head.appendChild(document.createElement('style'))
  style.textContent = managerCss(mode)
}

apply(systemMode())

addons.setConfig({
  sidebar: {
    showRoots: true,
    // Group labels with their count, e.g. "Components 13".
    renderLabel: (item) =>
      item.type === 'root'
        ? createElement(
            'span',
            { style: { display: 'flex', width: '100%' } },
            item.name,
            createElement('span', { className: 'atlas-count' }, String(item.children.length)),
          )
        : item.name,
  },
})

addons.register('atlas/theme-sync', (api) => {
  api.on('globalsUpdated', ({ globals }: { globals: Record<string, unknown> }) => {
    const theme = globals.theme
    if (theme === 'dark' || theme === 'light') apply(theme)
  })
})
