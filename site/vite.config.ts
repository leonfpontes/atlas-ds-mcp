import { cpSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defaultClientConditions, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/** Ships the built Storybook under /storybook/, so the site and the docs deploy together. */
function storybook(): Plugin {
  const from = here('../packages/ui/storybook-static')
  return {
    name: 'atlas-storybook',
    apply: 'build',
    closeBundle() {
      if (!existsSync(from)) {
        this.warn('packages/ui/storybook-static is missing: run pnpm build first. /storybook/ will 404.')
        return
      }
      cpSync(from, here('dist/storybook'), { recursive: true })
    },
  }
}

/**
 * Social cards need absolute URLs. SITE_URL is the public origin (e.g. https://atlas.example.dev);
 * on Vercel it falls back to the production domain Vercel exposes. A production deploy without
 * either fails: relative og:image URLs make every shared link show no picture.
 */
export function siteOrigin(env: Record<string, string | undefined> = process.env): string {
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL
  const origin = (env.SITE_URL || (vercel ? `https://${vercel}` : '')).replace(/\/$/, '')
  if (!origin && env.VERCEL_ENV === 'production') {
    throw new Error('Set SITE_URL (e.g. https://atlas.example.dev): the social cards need an absolute URL.')
  }
  return origin
}

function siteUrl(): Plugin {
  return {
    name: 'atlas-site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteOrigin()),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), storybook(), siteUrl()],
  // Workspace packages resolve to their source (see tsconfig.base.json, "atlas-source").
  resolve: { conditions: ['atlas-source', ...defaultClientConditions] },
  server: { host: '127.0.0.1', port: 5173 },
  build: {
    rollupOptions: {
      input: { main: here('index.html'), notFound: here('404.html') },
      onwarn(warning, warn) {
        // shadcn files start with "use client" (for Next.js); this site doesn't need it.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },
  test: { name: 'atlas-site', environment: 'jsdom', setupFiles: ['src/test-setup.ts'] },
})
