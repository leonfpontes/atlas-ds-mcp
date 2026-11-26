import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// One run for the whole monorepo. Workspace packages resolve to their source, so tests
// run on a clean clone before any build (TypeScript does the same with the
// "atlas-source" export condition; see tsconfig.base.json).
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@leonfpontes\/atlas-tokens$/, replacement: src('./packages/tokens/src/index.ts') },
      { find: /^@leonfpontes\/atlas-ui$/, replacement: src('./packages/ui/src/index.ts') },
    ],
  },
  test: {
    projects: [
      { extends: true, test: { name: 'repo', environment: 'node', include: ['tests/**/*.test.ts'] } },
      { extends: true, test: { name: 'atlas-tokens', root: 'packages/tokens', environment: 'node' } },
      {
        extends: true,
        test: {
          name: 'atlas-ui',
          root: 'packages/ui',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['src/test/setup.ts'],
        },
      },
      { extends: true, test: { name: 'design-system-mcp', root: 'mcp', environment: 'node' } },
      { extends: true, test: { name: 'atlas-evals', root: 'evals', environment: 'node' } },
      'site',
    ],
    coverage: {
      provider: 'v8',
      include: ['**/src/**'],
      exclude: ['**/*.test.*', '**/src/test/**', 'site/src/main.tsx'],
    },
  },
})
