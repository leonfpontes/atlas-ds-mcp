import { docsId } from './links'

/** Every docs page in sidebar order, for Previous / Next and the Browse lists. */
export const GROUPS = {
  Welcome: ['Introduction', 'Getting started', 'Changelog'],
  Foundations: ['Style', 'Colors', 'Typography', 'Spacing & radius', 'Icons'],
  Components: [
    'Alert',
    'Badge',
    'Button',
    'Card',
    'Command',
    'Dialog',
    'Input',
    'Select',
    'Sheet',
    'Table',
    'Tabs',
    'Toast',
    'Tooltip',
  ],
  Patterns: ['Orders table', 'Form validation', 'Empty states'],
  MCP: ['How agents read Atlas', 'Tools reference', 'validate_screen rules'],
} as const

export type Group = keyof typeof GROUPS

export const PAGES = (Object.entries(GROUPS) as [Group, readonly string[]][]).flatMap(([group, labels]) =>
  labels.map((label) => ({ group, label, id: docsId(`${group}/${label}`) })),
)

export const pageId = (group: Group, label: string) => docsId(`${group}/${label}`)

/** Previous and next page of a docs page. */
export function nav(label: string) {
  const i = PAGES.findIndex((p) => p.label === label)
  return { prev: PAGES[i - 1], next: PAGES[i + 1] }
}
