import axe from 'axe-core'

/**
 * Accessibility violations in a rendered tree. Color contrast is checked in the browser
 * (Storybook a11y addon and the token AA test): jsdom has no layout or computed colors.
 */
export async function axeViolations(node: Element = document.body): Promise<string[]> {
  const result = await axe.run(node, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
}
