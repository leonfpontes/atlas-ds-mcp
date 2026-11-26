// Links between docs pages. Docs render inside Storybook's preview iframe, so a link to
// another page targets the manager window (the top frame).
export const REPO = 'https://github.com/leonfpontes/atlas-ds-mcp'

export function docsHref(id: string): string {
  let base = '/'
  try {
    base = window.top?.location.pathname ?? '/'
  } catch {
    // Cross-origin top frame (an embed): fall back to the site root.
  }
  return `${base}?path=/docs/${id}`
}

export const editHref = (path: string) => `${REPO}/edit/main/packages/ui/${path}`

/** Storybook id of a docs page from its title, e.g. "Foundations/Spacing & radius". */
export const docsId = (title: string) =>
  `${title
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/\//g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')}--docs`
