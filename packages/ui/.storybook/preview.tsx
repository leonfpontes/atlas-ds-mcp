import type { Preview } from '@storybook/react-vite'
import { addons } from 'storybook/preview-api'

import { atlasTheme } from './theme'
import './preview.css'

const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

// Docs pages without a story don't run decorators, so the theme class follows the global here.
const applyTheme = ({ globals }: { globals: Record<string, unknown> }) =>
  document.documentElement.classList.toggle('dark', globals.theme === 'dark')
addons.getChannel().on('setGlobals', applyTheme)
addons.getChannel().on('globalsUpdated', applyTheme)

const preview: Preview = {
  // One theme control: the "Theme" button on each docs page (no toolbar switch). Stories follow it.
  initialGlobals: { theme: system },
  decorators: [
    (Story, { globals }) => {
      document.documentElement.classList.toggle('dark', globals.theme === 'dark')
      return Story()
    },
  ],
  parameters: {
    layout: 'centered',
    docs: { theme: atlasTheme('light'), toc: false, codePanel: true },
    a11y: {
      test: 'error',
      // A story is one component, not a page: page-level landmark and heading rules don't apply.
      // Docs pages have their landmarks and are checked with these rules on.
      config: {
        rules: [
          { id: 'region', enabled: false },
          { id: 'landmark-one-main', enabled: false },
          { id: 'page-has-heading-one', enabled: false },
        ],
      },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Welcome',
          ['Introduction', 'Getting started', 'Changelog'],
          'Foundations',
          ['Style', 'Colors', 'Typography', 'Spacing & radius', 'Icons'],
          'Components',
          [
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
          'Patterns',
          ['Orders table', 'Form validation', 'Empty states'],
          'MCP',
          ['How agents read Atlas', 'Tools reference', 'validate_screen rules'],
        ],
      },
    },
  },
}

export default preview
