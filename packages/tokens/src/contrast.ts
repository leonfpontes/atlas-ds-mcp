// Text and background pairs that appear together in Atlas, by color token name. The AA test
// checks each pair in the light and the dark theme. Text needs 4.5:1; non-text (control
// borders, the focus ring) needs 3:1 (WCAG 2.2, 1.4.3 and 1.4.11).

export interface ContrastPair {
  text: string
  background: string
  /** `text` for words (4.5:1), `ui` for borders and focus indicators (3:1). */
  kind: 'text' | 'ui'
}

const text = (t: string, ...backgrounds: string[]): ContrastPair[] =>
  backgrounds.map((background) => ({ text: t, background, kind: 'text' }))
const ui = (t: string, ...backgrounds: string[]): ContrastPair[] =>
  backgrounds.map((background) => ({ text: t, background, kind: 'ui' }))

export const CONTRAST_PAIRS: ContrastPair[] = [
  ...text('foreground', 'background', 'muted', 'secondary', 'accent'),
  ...text('card-foreground', 'card'),
  ...text('popover-foreground', 'popover'),
  ...text('primary-foreground', 'primary'),
  ...text('secondary-foreground', 'secondary'),
  ...text('accent-foreground', 'accent'),
  ...text('muted-foreground', 'muted', 'background', 'card'),
  ...text('text-subtle', 'background', 'muted', 'card'),
  ...text('primary', 'background', 'card'),
  ...text('destructive', 'background', 'card', 'destructive-subtle'),
  ...text('destructive-foreground', 'destructive'),
  ...text('success', 'background', 'card', 'success-subtle'),
  ...text('success-foreground', 'success'),
  ...text('warning', 'background', 'card', 'warning-subtle'),
  ...text('info', 'background', 'info-subtle'),
  ...text('sidebar-foreground', 'sidebar'),
  ...text('sidebar-accent-foreground', 'sidebar-accent'),
  ...text('sidebar-primary-foreground', 'sidebar-primary'),
  ...text('code-fg', 'code-bg'),
  ...text('code-dim', 'code-bg'),
  ...text('code-add', 'code-bg'),
  ...text('code-del', 'code-bg'),
  ...text('code-key', 'code-bg'),
  ...text('code-str', 'code-bg'),
  ...ui('input', 'background', 'card'),
  ...ui('ring', 'background', 'card'),
]
