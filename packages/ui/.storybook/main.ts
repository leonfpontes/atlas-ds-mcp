import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { defaultClientConditions, mergeConfig } from 'vite'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))
const fonts = (pkg: string) => here(`../node_modules/@fontsource/${pkg}/files`)

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  // The manager (sidebar, toolbar) loads IBM Plex from here; the preview bundles it.
  staticDirs: [
    { from: fonts('ibm-plex-sans'), to: '/fonts/plex-sans' },
    { from: fonts('ibm-plex-mono'), to: '/fonts/plex-mono' },
    { from: './public', to: '/' },
  ],
  docs: { defaultName: 'Docs' },
  // No onboarding checklist or change badges: the sidebar is the docs' table of contents.
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
    changeDetection: false,
    backgrounds: false,
    measure: false,
    outline: false,
  },
  viteFinal: (vite) =>
    mergeConfig(vite, {
      plugins: [tailwindcss()],
      resolve: {
        // Stories import components the way an app does; workspace packages resolve to source.
        alias: { '@': here('../src') },
        conditions: ['atlas-source', ...defaultClientConditions],
      },
      build: {
        rollupOptions: {
          // shadcn files start with "use client" (for Next.js); a static Storybook doesn't need it.
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
            warn(warning)
          },
        },
      },
    }),
}

export default config
